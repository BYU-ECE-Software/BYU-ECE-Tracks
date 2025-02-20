const express = require("express");
const {
    getCompanies,
    getCompany,
    addCompany,
    updateCompany,
    deleteCompany
} = require("../controllers/companyController");

const router = express.Router();

router.get("/", getCompanies);         // Get all items of a specific type
router.get("/:id", getCompany);      // Get a single item by ID
router.post("/", addCompany);         // Add a new list item
router.put("/:id", updateCompany);   // Update a list item
router.delete("/:id", deleteCompany);// Delete a list item

module.exports = router;