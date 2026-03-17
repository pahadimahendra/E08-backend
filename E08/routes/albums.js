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

// Public
router.get("/", getAllAlbums);
router.get("/:id", getAlbumById);

// Protected
router.post("/", protect, createAlbum);
router.put("/:id", protect, updateAlbum);
router.delete("/:id", protect, deleteAlbum);

export default router;