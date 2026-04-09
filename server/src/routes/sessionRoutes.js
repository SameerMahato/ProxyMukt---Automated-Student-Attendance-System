import express from 'express';
import {
  createSession,
  startSession,
  endSession,
  getQRToken,
  getSessions,
  getSessionById,
  getSessionAttendance,
  toggleQR,
  togglePause,
  updateVerificationSettings,
} from '../controllers/sessionController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';

const router = express.Router();

router.use(authenticate);

router.post('/', authorize('FACULTY', 'ADMIN'), createSession);
router.post('/:id/start', authorize('FACULTY', 'ADMIN'), startSession);
router.post('/:id/end', authorize('FACULTY', 'ADMIN'), endSession);
router.post('/:id/toggle-qr', authorize('FACULTY', 'ADMIN'), toggleQR);
router.post('/:id/toggle-pause', authorize('FACULTY', 'ADMIN'), togglePause);
router.patch('/:id/verification', authorize('FACULTY', 'ADMIN'), updateVerificationSettings);
router.get('/:id/qr', getQRToken);
router.get('/', getSessions);
router.get('/:id', getSessionById);
router.get('/:id/attendance', authorize('FACULTY', 'ADMIN'), getSessionAttendance);

export default router;
