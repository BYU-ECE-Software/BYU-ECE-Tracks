const express = require("express");
const {
    getMajors,
    getMajor,
    addMajor,
    updateMajor,
    deleteMajor
} = require("../controllers/majorController");

const router = express.Router();

router.get("/", getMajors);         // Get all items of a specific type
router.get("/:id", getMajor);      // Get a single item by ID
router.post("/", addMajor);         // Add a new list item
router.put("/:id", updateMajor);   // Update a list item
router.delete("/:id", deleteMajor);// Delete a list item

module.exports = router;