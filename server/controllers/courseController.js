import asyncHandler from 'express-async-handler';
import Course from '../models/courseModel.js';
import mongoose from 'mongoose';

const createCourse = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  const course = new Course({
    title,
    description,
    instructor: req.user._id,
  });

  const createdCourse = await course.save();
  res.status(201).json(createdCourse);
});

const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({}).populate('instructor', 'name');
  res.json(courses);
});

const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate('instructor', 'name email')
    .populate('students', 'name email');

  if (course) {
    res.json(course);
  } else {
    res.status(404);
    throw new Error('Course not found');
  }
});

const enrollInCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (course) {
    const isAlreadyEnrolled = course.students.find(
      (s) => s.toString() === req.user._id.toString()
    );

    if (isAlreadyEnrolled) {
      res.status(400);
      throw new Error('Already enrolled in this course');
    }

    course.students.push(req.user._id);
    await course.save();
    res.json({ message: 'Enrolled successfully' });
  } else {
    res.status(404);
    throw new Error('Course not found');
  }
});

const addLecture = asyncHandler(async (req, res) => {
  const { title, videoUrl } = req.body;
  const course = await Course.findById(req.params.id);

  if (course) {
    if (course.instructor.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to add lectures to this course');
    }

    const lecture = {
      title,
      videoUrl,
    };

    course.lectures.push(lecture);
    await course.save();
    res.status(201).json({ message: 'Lecture added' });
  } else {
    res.status(404);
    throw new Error('Course not found');
  }
});

const addAssignment = asyncHandler(async (req, res) => {
  const { title, description, dueDate } = req.body;
  const course = await Course.findById(req.params.id);

  if (course) {
    if (course.instructor.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to add assignments to this course');
    }

    const assignment = {
      title,
      description,
      dueDate,
    };

    course.assignments.push(assignment);
    await course.save();
    res.status(201).json({ message: 'Assignment added' });
  } else {
    res.status(404);
    throw new Error('Course not found');
  }
});

const submitAssignment = asyncHandler(async (req, res) => {
  const { fileUrl } = req.body;
  const courseId = req.params.id;
  const assignmentId = req.params.assignmentId;

  const course = await Course.findById(courseId);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  const isEnrolled = course.students.some(s => s.toString() === req.user._id.toString());
  if (!isEnrolled) {
    res.status(401);
    throw new Error('Not enrolled in this course');
  }

  const assignment = course.assignments.id(assignmentId);
  if (!assignment) {
    res.status(404);
    throw new Error('Assignment not found');
  }

  const alreadySubmitted = assignment.submissions.find(
    (s) => s.student.toString() === req.user._id.toString()
  );

  if (alreadySubmitted) {
    res.status(400);
    throw new Error('Assignment already submitted');
  }

  const submission = {
    student: req.user._id,
    fileUrl: fileUrl,
  };

  assignment.submissions.push(submission);
  await course.save();
  res.status(201).json({ message: 'Assignment submitted' });
});

export {
  createCourse,
  getCourses,
  getCourseById,
  enrollInCourse,
  addLecture,
  addAssignment,
  submitAssignment,
};