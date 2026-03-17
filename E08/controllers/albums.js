import Album from "../models/Album.js";
import AppError from "../errors/AppError.js";

// GET /albums — public
export async function getAllAlbums(req, res) {
  try {
    let filter = {};

    // Filter by year
    if (req.query.year) filter.year = Number(req.query.year);
    if (req.query.startYear || req.query.endYear) {
      filter.year = {};
      if (req.query.startYear) filter.year.$gte = Number(req.query.startYear);
      if (req.query.endYear) filter.year.$lte = Number(req.query.endYear);
    }

    // Search by artist/title
    if (req.query.search) {
      filter.$or = [
        { artist: { $regex: req.query.search, $options: "i" } },
        { title: { $regex: req.query.search, $options: "i" } },
      ];
    }

    let query = Album.find(filter);

    // Sorting
    if (req.query.sort) {
      query = query.sort(req.query.sort.split(",").join(" "));
    }

    // Field selection
    if (req.query.fields) {
      query = query.select(req.query.fields.split(",").join(" "));
    }

    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    const total = await Album.countDocuments(filter);
    const albums = await query.lean();

    const result = albums.map(a => ({
      ...a,
      isClassic: new Date().getFullYear() - a.year > 25,
    }));

    res.json({
      metadata: { total, page, limit, totalPages: Math.ceil(total / limit) },
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load albums" });
  }
}

// GET /albums/:id — public
export async function getAlbumById(req, res) {
  try {
    const album = await Album.findById(req.params.id).lean();
    if (!album) return res.status(404).json({ error: "Album not found" });

    const result = { ...album, isClassic: new Date().getFullYear() - album.year > 25 };
    res.json(result);
  } catch {
    res.status(400).json({ error: "Invalid album id" });
  }
}

// POST /albums — protected
export async function createAlbum(req, res, next) {
  try {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });

    const albumData = { ...req.body, owner: req.user.id };
    const created = await Album.create(albumData);

    res.status(201).json({
      ...created.toObject({ virtuals: true }),
      isClassic: created.year < new Date().getFullYear() - 25,
    });
  } catch (error) {
    next(error);
  }
}

// PUT /albums/:id — protected
export async function updateAlbum(req, res, next) {
  try {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });

    const album = await Album.findById(req.params.id);
    if (!album) return res.status(404).json({ error: "Album not found" });

    // Ownership check: regular users can update only their own albums
    if (req.user.role !== "admin" && album.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    Object.assign(album, req.body);
    await album.save();

    res.json({ ...album.toObject({ virtuals: true }), isClassic: album.year < new Date().getFullYear() - 25 });
  } catch (error) {
    next(error);
  }
}

// DELETE /albums/:id — protected
export async function deleteAlbum(req, res, next) {
  try {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });

    const album = await Album.findById(req.params.id);
    if (!album) return res.status(404).json({ error: "Album not found" });

    // Ownership check: regular users can delete only their own albums
    if (req.user.role !== "admin" && album.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    await album.deleteOne();

    res.json({
      message: "Album deleted",
      deleted: { ...album.toObject({ virtuals: true }), isClassic: album.year < new Date().getFullYear() - 25 },
    });
  } catch (error) {
    next(error);
  }
}