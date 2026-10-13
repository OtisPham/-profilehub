import { Router } from 'express';
import { jobController } from '../controllers/job.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// GET /api/jobs (Danh sách công việc)
router.get('/', jobController.getAllJobs);

// POST /api/jobs (Đăng việc mới)
router.post('/', requireAuth, jobController.createJob);

// PUT /api/jobs/:id (Cập nhật việc)
router.put('/:id', requireAuth, jobController.updateJob);

// DELETE /api/jobs/:id (Xóa việc)
router.delete('/:id', requireAuth, jobController.deleteJob);

export default router;
