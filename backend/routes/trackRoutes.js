import express from "express";
import { getTracks, getTrack, addTrack, updateTrack, deleteTrack, getTrackByExtension } from "../controllers/trackController.js";

const router = express.Router();

router.get("/", getTracks);
router.get("/:id", getTrack);
router.post("/", addTrack);
router.put("/:id", updateTrack);
router.delete("/:id", deleteTrack);
router.get("/name/:name", getTrackByExtension);

export default router;
