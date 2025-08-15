import Supertrack from "../models/Supertrack.js";

export async function getSupertracks(req, res) {
  try {
    const supertracks = await Supertrack.find();
    res.json(supertracks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Supertracks" });
  }
};

export async function getSupertrack(req, res) {
  try {
    const supertrack = await Supertrack.findById(req.params.id);
    res.json(supertrack);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Supertrack" });
  }
};

export async function addSupertrack(req, res) {
  const supertrack = new Supertrack(req.body);
  await supertrack.save();
  res.status(201).json(supertrack);
};

export async function updateSupertrack(req, res) {
  const updatedSupertrack = await Supertrack.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updatedSupertrack);
};

export async function deleteSupertrack(req, res) {
  await Supertrack.findByIdAndDelete(req.params.id);
  res.json({ message: "Supertrack deleted" });
};

export async function getSupertrackNameByExtension(req, res) {
  const supertrack = await Supertrack.findOne({ extension: req.params.name });
  res.json(supertrack);
};
