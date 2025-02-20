const mongoose = require("mongoose");

const TrackSchema = new mongoose.Schema({
  name: {type: String, required: true, unique: true, trim: true},
  description: String,
  imageUrl: String,
  primaryCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  optionalCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  companies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company"}]
})

const { attachTrackToCourses, removeTrackFromCourses } = require("../middleware/mongooseHooks");

TrackSchema.post("save", attachTrackToCourses);
TrackSchema.post("findOneAndDelete", removeTrackFromCourses);

module.exports = mongoose.model("Track", TrackSchema);