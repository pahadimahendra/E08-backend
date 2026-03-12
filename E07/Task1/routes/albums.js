import express from "express";
import {
  getAllAlbums,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum
} from "../controllers/albums.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// PUBLIC ROUTES
// Anyone can read albums
router.get("/", getAllAlbums);
router.get("/:id", getAlbumById);

// PROTECTED ROUTES
// Only logged-in users can create/update/delete
router.post("/", protect, createAlbum);
router.put("/:id", protect, updateAlbum);
router.delete("/:id", protect, deleteAlbum);

export default router;