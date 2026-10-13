import { Router } from 'express';
import { projectController } from '../controllers/project.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// GET /api/projects?studentId=... (Lấy danh sách dự án)
router.get('/', requireAuth, projectController.getStudentProjects);

// GET /api/projects/:id (Lấy chi tiết dự án)
router.get('/:id', projectController.getProjectById);

// POST /api/projects (Tạo mới dự án)
router.post('/', requireAuth, projectController.createProject);

// PUT /api/projects/:id (Cập nhật dự án)
router.put('/:id', requireAuth, projectController.updateProject);

// DELETE /api/projects/:id (Xóa dự án)
router.delete('/:id', requireAuth, projectController.deleteProject);

export default router;
