const Company = require("../models/Company");

exports.getCompanies = async (req, res) => {
  const companies = await Company.find();
  res.json(companies);
};

exports.getCompany = async (req, res) => {
  const company = await Company.findById(req.params.id);
  res.json(company);
};

exports.addCompany = async (req, res) => {
  const company = new Company(req.body);
  await company.save();
  res.status(201).json(company);
};

exports.updateCompany = async (req, res) => {
  const updatedCompany = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedCompany);
};

exports.deleteCompany = async (req, res) => {
  await Company.findByIdAndDelete(req.params.id);
  res.json({ message: "Company deleted" });
};