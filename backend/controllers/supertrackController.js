const Supertrack = require("../models/Supertrack");

exports.getSupertracks = async (req, res) => {
  try {
    const supertracks = await Supertrack.find();
    res.json(supertracks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Supertracks" });
  }
};

exports.getSupertrack = async (req, res) => {
  try {
    const supertrack = await Supertrack.findById(req.params.id);
    res.json(supertrack);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Supertrack" });
  }
};

exports.addSupertrack = async (req, res) => {
  const supertrack = new Supertrack(req.body);
  await supertrack.save();
  res.status(201).json(supertrack);
};

exports.updateSupertrack = async (req, res) => {
  const updatedSupertrack = await Supertrack.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updatedSupertrack);
};

exports.deleteSupertrack = async (req, res) => {
  await Supertrack.findByIdAndDelete(req.params.id);
  res.json({ message: "Supertrack deleted" });
};

exports.getSupertrackNameByExtension = async (req, res) => {
  const supertrack = await Supertrack.findOne({ extension: req.params.name });
  res.json(supertrack);
};
