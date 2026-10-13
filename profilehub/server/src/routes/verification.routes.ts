import { Router } from 'express';
import { verificationController } from '../controllers/verification.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// GET /api/verifications/inbox (Dành cho Giảng viên duyệt)
router.get('/inbox', requireAuth, verificationController.getInbox);

// POST /api/verifications/:projectId/approve (Giảng viên duyệt đồ án)
router.post('/:projectId/approve', requireAuth, verificationController.approve);

// POST /api/verifications/:projectId/reject (Giảng viên từ chối đồ án)
router.post('/:projectId/reject', requireAuth, verificationController.reject);

// GET /api/verifications/public/:code (Trang xác minh công khai qua QR / Hash)
router.get('/public/:code', verificationController.getPublicRecord);

export default router;
