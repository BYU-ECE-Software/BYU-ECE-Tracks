import Course from "../models/Course.js";

export async function getCourses(req, res) {
  try {
    const courses = await Course.find();
    res.json(courses);
  }
  catch (error) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

export async function getCourse(req, res) {
  try {
    const course = await Course.findById(req.params.id)
    res.json(course);
  }
  catch (error) {
    res.status(500).json({ error: "Failed to fetch course ${req.params.id}" })

  }
};

export async function addCourse(req, res) {
  const course = new Course(req.body);
  await course.save();
  res.status(201).json(course);
};

export async function updateCourse(req, res) {
  const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedCourse);
};

export async function deleteCourse(req, res) {
  await Course.findByIdAndDelete(req.params.id);
  res.json({ message: "Course deleted" });
};
