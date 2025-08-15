import express from "express";
import { getSupertracks, getSupertrack, addSupertrack, updateSupertrack, deleteSupertrack, getSupertrackNameByExtension } from "../controllers/supertrackController.js";

const router = express.Router();

router.get("/", getSupertracks);
router.get("/:id", getSupertrack);
router.post("/", addSupertrack);
router.put("/:id", updateSupertrack);
router.delete("/:id", deleteSupertrack);
router.get("/name/:name", getSupertrackNameByExtension);

export default router;
