import { Router } from 'express';
import { aiController } from '../controllers/ai.controller.js';

const router = Router();

// POST /api/ai/ai-match & /api/ai/jev-match (Đánh giá tương thích CV - JD theo AI Matching Framework v1.0)
router.post('/ai-match', aiController.evaluateAiCompatibility);
router.post('/jev-match', aiController.evaluateAiCompatibility);

// POST /api/ai/cv-optimize
router.post('/cv-optimize', aiController.optimizeCV);

// POST /api/ai/interview-questions
router.post('/interview-questions', aiController.getInterviewQuestions);

// POST /api/ai/interview-evaluate
router.post('/interview-evaluate', aiController.evaluateInterviewAnswer);

export default router;
