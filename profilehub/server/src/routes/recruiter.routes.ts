import { Router } from 'express';
import { recruiterController } from '../controllers/recruiter.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

// Guard kiểm soát truy cập phân quyền RBAC: Bắt buộc đăng nhập VÀ vai trò là 'recruiter' hoặc 'admin'
const recruiterGuard = [requireAuth, requireRole(['recruiter', 'admin'])];

// GET /api/recruiter/candidates (Tìm kiếm ứng viên)
router.get('/candidates', recruiterGuard, recruiterController.searchCandidates);

// GET /api/recruiter/pipeline (Lấy pipeline ứng viên)
router.get('/pipeline', recruiterGuard, recruiterController.getPipeline);

// PUT /api/recruiter/pipeline/:itemId (Cập nhật stage phỏng vấn)
router.put('/pipeline/:itemId', recruiterGuard, recruiterController.updatePipelineStage);

// POST /api/recruiter/feedback (Gửi đánh giá phỏng vấn)
router.post('/feedback', recruiterGuard, recruiterController.submitFeedback);

export default router;
