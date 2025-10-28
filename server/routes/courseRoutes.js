import express from 'express';
const router = express.Router();
import {
  createCourse,
  getCourses,
  getCourseById,
  enrollInCourse,
  addLecture,
  addAssignment,
  submitAssignment,
} from '../controllers/courseController.js';
import { protect, instructor }
  from '../middleware/authMiddleware.js';

router.route('/')
  .get(getCourses)
  .post(protect, instructor, createCourse);

router.route('/:id')
  .get(protect, getCourseById);

router.route('/:id/enroll')
  .post(protect, enrollInCourse);

router.route('/:id/lectures')
  .post(protect, instructor, addLecture);
  
router.route('/:id/assignments')
  .post(protect, instructor, addAssignment);

router.route('/:id/assignments/:assignmentId/submit')
  .post(protect, submitAssignment);

export default router;