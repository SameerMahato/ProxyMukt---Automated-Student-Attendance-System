import express from 'express';
import {
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncement,
} from '../controllers/announcementController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';

const router = express.Router();

router.use(authenticate);

router.post('/', authorize('FACULTY', 'ADMIN'), createAnnouncement);
router.get('/', getAnnouncements);
router.delete('/:id', authorize('FACULTY', 'ADMIN'), deleteAnnouncement);

export default router;
