const express = require("express");
const { getSupertracks, getSupertrack, addSupertrack, updateSupertrack, deleteSupertrack, getSupertrackNameByExtension } = require("../controllers/supertrackController");

const router = express.Router();

router.get("/", getSupertracks);
router.get("/:id", getSupertrack);
router.post("/", addSupertrack);
router.put("/:id", updateSupertrack);
router.delete("/:id", deleteSupertrack);
router.get("/name/:name", getSupertrackNameByExtension);

module.exports = router;
