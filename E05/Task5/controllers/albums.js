import Album from "../models/Album.js";

// GET /albums
export async function getAllAlbums(req, res) {
  try {
    let filter = {};

    // ✅ Task 2 - Exact year filtering
    if (req.query.year) {
      filter.year = Number(req.query.year);
    }

    // ✅ Task 5 - Between two years filtering
    if (req.query.startYear || req.query.endYear) {
      filter.year = {};

      if (req.query.startYear) {
        filter.year.$gte = Number(req.query.startYear);
      }

      if (req.query.endYear) {
        filter.year.$lte = Number(req.query.endYear);
      }
    }

    // ✅ Task 4 - Regex search
    if (req.query.search) {
      filter.$or = [
        { artist: { $regex: req.query.search, $options: "i" } },
        { title: { $regex: req.query.search, $options: "i" } }
      ];
    }

    let query = Album.find(filter);

    // ✅ Task 1 - Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    }

    // ✅ Task 3 - Field selection
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    }

    const albums = await query.exec();

    const result = albums.map((album) => ({
      ...album.toObject({ virtuals: true }),
      isClassic: album.isClassic(),
    }));

    res.json(result);

  } catch (error) {
    res.status(500).json({ error: "Failed to load albums" });
  }
}

// GET /albums/:id
export async function getAlbumById(req, res) {
  try {
    const album = await Album.findById(req.params.id).exec();

    if (!album) {
      return res.status(404).json({ error: "Album not found" });
    }

    const result = {
      ...album.toObject({ virtuals: true }),
      isClassic: album.isClassic(),
    };

    res.json(result);

  } catch {
    res.status(400).json({ error: "Invalid album id" });
  }
}

// GET /albums/genre/:genre
export async function getAlbumsByGenre(req, res) {
  try {
    const albums = await Album.findByGenre(req.params.genre);

    const result = albums.map((album) => ({
      ...album.toObject({ virtuals: true }),
      isClassic: album.isClassic(),
    }));

    res.json(result);

  } catch {
    res.status(500).json({ error: "Failed to filter albums" });
  }
}

// POST /albums
export async function createAlbum(req, res) {
  try {
    const created = await Album.create(req.body);
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// PUT /albums/:id
export async function updateAlbum(req, res) {
  try {
    const updated = await Album.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).exec();

    if (!updated) {
      return res.status(404).json({ error: "Album not found" });
    }

    res.json(updated);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// DELETE /albums/:id
export async function deleteAlbum(req, res) {
  try {
    const deleted = await Album.findByIdAndDelete(req.params.id).exec();

    if (!deleted) {
      return res.status(404).json({ error: "Album not found" });
    }

    res.json({ message: "Album deleted", deleted });

  } catch {
    res.status(400).json({ error: "Invalid album id" });
  }
}