import express from 'express';
import {
  submitLeave,
  getMyLeaves,
  getPendingLeaves,
  respondToLeave,
} from '../controllers/leaveController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';

const router = express.Router();

router.use(authenticate);

router.post('/submit', authorize('STUDENT'), submitLeave);
router.get('/my-leaves', authorize('STUDENT'), getMyLeaves);
router.get('/pending', authorize('FACULTY', 'ADMIN'), getPendingLeaves);
router.patch('/:id/respond', authorize('FACULTY', 'ADMIN'), respondToLeave);

export default router;
