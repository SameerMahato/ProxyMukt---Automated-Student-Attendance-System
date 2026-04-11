import express from 'express';
import {
  getStudentTimetable,
  getFacultyTimetable,
  createTimetableEntry,
  deleteTimetableEntry,
} from '../controllers/timetableController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';

const router = express.Router();

router.use(authenticate);

router.get('/student', authorize('STUDENT'), getStudentTimetable);
router.get('/faculty', authorize('FACULTY'), getFacultyTimetable);
router.post('/', authorize('ADMIN'), createTimetableEntry);
router.delete('/:id', authorize('ADMIN'), deleteTimetableEntry);

export default router;
