const Course = require("../models/Course");

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find()
    res.json(courses);
  }
  catch (error) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
    res.json(course);
  }
  catch (error) {
    res.status(500).json({ error: "Failed to fetch course ${req.params.id}" })

  }
};

exports.addCourse = async (req, res) => {
  const course = new Course(req.body);
  await course.save();
  res.status(201).json(course);
};

exports.updateCourse = async (req, res) => {
  const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedCourse);
};

exports.deleteCourse = async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  res.json({ message: "Course deleted" });
};
