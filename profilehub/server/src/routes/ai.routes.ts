import { Router } from 'express';
import { aiController } from '../controllers/ai.controller.js';
import { optionalAuth } from '../middlewares/auth.middleware.js';
import { aiRateLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = Router();

// Áp dụng xác thực phiên người dùng & bộ kiểm soát tần suất gọi AI (Anti-Spam & Cost-Protection)
router.use(optionalAuth);
router.use(aiRateLimiter);

// POST /api/ai/cv-optimize (Hỗ trợ gợi ý & tối ưu nội dung CV)
router.post('/cv-optimize', aiController.optimizeCV);

// POST /api/ai/generate-tailored-cv (AI đọc JD & Hồ Sơ Cá Nhân để tự động tạo CV khớp JD)
router.post('/generate-tailored-cv', aiController.generateTailoredCV);

// POST /api/ai/contextual-action (Tác vụ AI Ngữ Cảnh: Viết lại theo JD, Nhấn mạnh từ khóa, Rút gọn)
router.post('/contextual-action', aiController.contextualAction);

export default router;
