import Track from "../models/Track.js";

export async function getTracks(req, res) {
  try {
    const tracks = await Track.find()
    res.json(tracks);
  }
  catch (error) {
    res.status(500).json({ error: "Failed to fetch tracks" });

  }
};

export async function getTrack(req, res) {
  try {
    const track = await Track.findById(req.params.id)
    res.json(track);
  }
  catch (error) {
    res.status(500).json({ error: "Failed to fetch track" });
  }
};

export async function addTrack(req, res) {
  const track = new Track(req.body);
  await track.save();
  res.status(201).json(track);
};

export async function updateTrack(req, res) {
  const updatedTrack = await Track.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedTrack);
};

export async function deleteTrack(req, res) {
  await Track.findByIdAndDelete(req.params.id);
  res.json({ message: "Track deleted" });
};

export async function getTrackByExtension(req, res) {
  const track = await Track.findOne({ extension: req.params.name });
    res.json(track);
};
