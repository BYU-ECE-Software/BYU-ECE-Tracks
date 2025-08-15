import mongoose from "mongoose";

const SupertrackSchema = new mongoose.Schema({
  name: {type: String, required: true, unique: true, trim: true}, //this is with dashes and lowercase
  extension: {type: String, required: true, trim: true}, //this is what gets displayed
  description: String,
  imageUrl: String,
  imageKey: String, // Key for the image in MinIO
  tracks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Track" }],
})

export default mongoose.model("Supertrack", SupertrackSchema);