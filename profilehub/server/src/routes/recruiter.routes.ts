import { Router } from 'express';
import { recruiterController } from '../controllers/recruiter.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// GET /api/recruiter/candidates (Tìm kiếm ứng viên)
router.get('/candidates', requireAuth, recruiterController.searchCandidates);

// GET /api/recruiter/pipeline (Lấy pipeline ứng viên)
router.get('/pipeline', requireAuth, recruiterController.getPipeline);

// PUT /api/recruiter/pipeline/:itemId (Cập nhật stage phỏng vấn)
router.put('/pipeline/:itemId', requireAuth, recruiterController.updatePipelineStage);

// POST /api/recruiter/feedback (Gửi đánh giá phỏng vấn)
router.post('/feedback', requireAuth, recruiterController.submitFeedback);

export default router;
