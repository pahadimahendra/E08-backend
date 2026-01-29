import fs from "fs/promises";
import path from "path";

const ALBUMS_FILE = path.join(process.cwd(), "data", "albums.json");

async function loadAlbums() {
  const data = await fs.readFile(ALBUMS_FILE, "utf8");
  return JSON.parse(data).albums;
}

async function saveAlbums(albums) {
  await fs.writeFile(ALBUMS_FILE, JSON.stringify({ albums }, null, 2), "utf8");
}

export async function getAllAlbums(req, res) {
  try {
    const albums = await loadAlbums();
    res.json(albums);
  } catch (error) {
    res.status(500).json({ error: "Failed to load albums" });
  }
}

export async function getAlbumById(req, res) {
  try {
    const id = Number(req.params.id);
    const albums = await loadAlbums();
    const album = albums.find((a) => a.id === id);

    if (!album) {
      return res.status(404).json({ error: "Album not found" });
    }

    res.json(album);
  } catch (error) {
    res.status(500).json({ error: "Failed to load album" });
  }
}

export async function createAlbum(req, res) {
  try {
    const { artist, title, year, genre, tracks } = req.body;

    if (
      !artist ||
      !title ||
      year === undefined ||
      !genre ||
      tracks === undefined
    ) {
      return res.status(400).json({
        error: "artist, title, year, genre, tracks are required",
      });
    }

    const albums = await loadAlbums();
    const newAlbum = {
      id: albums.length ? Math.max(...albums.map((a) => a.id)) + 1 : 1,
      artist,
      title,
      year: Number(year),
      genre,
      tracks: Number(tracks),
    };

    albums.push(newAlbum);
    await saveAlbums(albums);

    res.status(201).json(newAlbum);
  } catch (error) {
    res.status(500).json({ error: "Failed to create album" });
  }
}

export async function updateAlbum(req, res) {
  try {
    const id = Number(req.params.id);
    const { artist, title, year, genre, tracks } = req.body;

    if (
      !artist ||
      !title ||
      year === undefined ||
      !genre ||
      tracks === undefined
    ) {
      return res.status(400).json({
        error: "artist, title, year, genre, tracks are required",
      });
    }

    const albums = await loadAlbums();
    const index = albums.findIndex((a) => a.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Album not found" });
    }

    const updatedAlbum = {
      id,
      artist,
      title,
      year: Number(year),
      genre,
      tracks: Number(tracks),
    };

    albums[index] = updatedAlbum;
    await saveAlbums(albums);

    res.json(updatedAlbum);
  } catch (error) {
    res.status(500).json({ error: "Failed to update album" });
  }
}

export async function deleteAlbum(req, res) {
  try {
    const id = Number(req.params.id);

    const albums = await loadAlbums();
    const index = albums.findIndex((a) => a.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Album not found" });
    }

    const deletedAlbum = albums.splice(index, 1)[0];
    await saveAlbums(albums);

    res.json({ message: "Album deleted", deleted: deletedAlbum });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete album" });
  }
}
