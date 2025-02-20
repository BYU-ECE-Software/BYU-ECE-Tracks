const express = require("express");
const { getTracks, getTrack, addTrack, updateTrack, deleteTrack } = require("../controllers/trackController");

const router = express.Router();

router.get("/", getTracks);
router.get("/:id", getTrack);
router.post("/", addTrack);
router.put("/:id", updateTrack);
router.delete("/:id", deleteTrack);

module.exports = router;
