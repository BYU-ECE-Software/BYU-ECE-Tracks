const Track = require("../models/Track");

exports.getTracks = async (req, res) => {
  try {
    const tracks = await Track.find()
      .populate("companies", "_id name")
      .populate("optionalCourses", "_id name")
      .populate("primaryCourses", "_id name");
    res.json(tracks);
  }
  catch (error) {
    res.status(500).json({ error: "Failed to fetch tracks" });

  }
};

exports.getTrack = async (req, res) => {
  try {
    const track = await Track.findById(req.params.id)
      .populate("companies", "_id name")
      .populate("optionalCourses", "_id name")
      .populate("primaryCourses", "_id name");
    res.json(track);
  }
  catch (error) {
    res.status(500).json({ error: "Failed to fetch track" });
  }
};

exports.addTrack = async (req, res) => {
  const track = new Track(req.body);
  await track.save();
  res.status(201).json(track);
};

exports.updateTrack = async (req, res) => {
  const updatedTrack = await Track.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedTrack);
};

exports.deleteTrack = async (req, res) => {
  await Track.findByIdAndDelete(req.params.id);
  res.json({ message: "Track deleted" });
};
