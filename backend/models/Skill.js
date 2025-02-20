const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true }
});

module.exports = mongoose.model("Skill", SkillSchema);