import express from "express";
import * as albumController from "../controllers/albums.js";

const router = express.Router();

// Task 4: Static method route (must be ABOVE /:id)
router.get("/genre/:genre", albumController.getAlbumsByGenre);

router.get("/", albumController.getAllAlbums);
router.get("/:id", albumController.getAlbumById);
router.post("/", albumController.createAlbum);
router.put("/:id", albumController.updateAlbum);
router.delete("/:id", albumController.deleteAlbum);

export default router;
