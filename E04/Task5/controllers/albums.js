import Album from "../models/Album.js";

// GET /albums (includes virtual + method)
export async function getAllAlbums(req, res) {
  try {
    const albums = await Album.find({}).exec();

    const result = albums.map((album) => ({
      ...album.toObject({ virtuals: true }),
      isClassic: album.isClassic(),
    }));

    res.json(result);
  } catch {
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

// GET /albums/genre/:genre (static method)
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
      runValidators: true, // important for schema validators
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
