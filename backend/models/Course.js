const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  name: {type: String, required: true, unique: true, trim: true},
  // description: String,
  // imageUrl: String,
  // offered: String,
  // skills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
  // majors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Major" }],
  // companies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }],
  // tracks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Track" }],
  // relatedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }]

});

module.exports = mongoose.model("Course", CourseSchema);