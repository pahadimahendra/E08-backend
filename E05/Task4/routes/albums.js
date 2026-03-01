import express from "express";
import * as albumController from "../controllers/albums.js";

const router = express.Router();

//static method route (must be above /:id)
router.get("/genre/:genre", albumController.getAlbumsByGenre);

router.get("/", albumController.getAllAlbums);
router.get("/:id", albumController.getAlbumById);
router.post("/", albumController.createAlbum);
router.put("/:id", albumController.updateAlbum);
router.delete("/:id", albumController.deleteAlbum);

export default router;
