const express = require("express");
const {
    getSkills,
    getSkill,
    addSkill,
    updateSkill,
    deleteSkill
} = require("../controllers/skillController");

const router = express.Router();

router.get("/", getSkills);         // Get all items of a specific type
router.get("/:id", getSkill);      // Get a single item by ID
router.post("/", addSkill);         // Add a new list item
router.put("/:id", updateSkill);   // Update a list item
router.delete("/:id", deleteSkill);// Delete a list item

module.exports = router;