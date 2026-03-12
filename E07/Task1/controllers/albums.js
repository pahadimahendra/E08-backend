import Album from "../models/Album.js";

// GET ALL
export async function getAllAlbums(req, res) {

  try {

    const albums = await Album.find();

    res.json(albums);

  } catch (error) {
    res.status(500).json({ error: "Failed to load albums" });
  }

}

// GET BY ID
export async function getAlbumById(req, res) {

  try {

    const album = await Album.findById(req.params.id);

    if (!album) {
      return res.status(404).json({ error: "Album not found" });
    }

    res.json(album);

  } catch {
    res.status(400).json({ error: "Invalid album id" });
  }

}

// CREATE
export async function createAlbum(req, res) {

  try {

    const album = await Album.create({
      ...req.body,
      owner: req.user._id
    });

    res.status(201).json(album);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }

}

// UPDATE
export async function updateAlbum(req, res) {

  try {

    const album = await Album.findById(req.params.id);

    if (!album) {
      return res.status(404).json({ error: "Album not found" });
    }

    if (
      req.user.role !== "admin" &&
      album.owner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        error: "You can only update your own albums"
      });
    }

    const updated = await Album.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updated);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }

}

// DELETE
export async function deleteAlbum(req, res) {

  try {

    const album = await Album.findById(req.params.id);

    if (!album) {
      return res.status(404).json({ error: "Album not found" });
    }

    if (
      req.user.role !== "admin" &&
      album.owner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        error: "You can only delete your own albums"
      });
    }

    await album.deleteOne();

    res.json({ message: "Album deleted" });

  } catch {
    res.status(400).json({ error: "Invalid album id" });
  }

}