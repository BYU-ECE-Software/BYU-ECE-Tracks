const Major = require("../models/Major");

exports.getMajors = async (req, res) => {
  const majors = await Major.find();
  res.json(majors);
};

exports.getMajor = async (req, res) => {
  const major = await Major.findById(req.params.id);
  res.json(major);
};

exports.addMajor = async (req, res) => {
  const major = new Major(req.body);
  await major.save();
  res.status(201).json(major);
};

exports.updateMajor = async (req, res) => {
  const updatedMajor = await Major.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedMajor);
};

exports.deleteMajor = async (req, res) => {
  await Major.findByIdAndDelete(req.params.id);
  res.json({ message: "Major deleted" });
};