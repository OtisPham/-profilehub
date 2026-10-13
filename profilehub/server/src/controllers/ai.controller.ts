import { Request, Response, NextFunction } from 'express';
import { aiCvService } from '../services/aiCv.service.js';
import { aiInterviewService } from '../services/aiInterview.service.js';
import { aiMatchingService } from '../services/aiMatching.service.js';

export const aiController = {
  /**
   * Đánh giá tương thích CV - JD theo chuẩn AI Matching Framework v1.0
   */
  async evaluateAiCompatibility(req: Request, res: Response, next: NextFunction) {
    try {
      const { candidate, job, jdText, userSkills, projects, certificates } = req.body;

      // Hỗ trợ cả 2 định dạng payload: cấu trúc trực tiếp hoặc phân rã
      const candidateProfile = candidate || {
        skills: userSkills || [],
        projects: projects || [],
        certificates: certificates || [],
        experience_level: req.body.experience_level || 'fresher',
      };

      const jobDescription = job || {
        raw_jd_text: jdText || '',
        required_skills: req.body.required_skills,
        preferred_skills: req.body.preferred_skills,
        level: req.body.job_level || 'fresher',
      };

      const result = await aiMatchingService.evaluateCompatibility(candidateProfile, jobDescription);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  // Alias for backward compatibility
  evaluateJevCompatibility(req: Request, res: Response, next: NextFunction) {
    return aiController.evaluateAiCompatibility(req, res, next);
  },

  async optimizeCV(req: Request, res: Response, next: NextFunction) {
    try {
      const { jdText, userSkills, projects, certificates } = req.body;
      const data = await aiCvService.analyzeAndTailorCV(jdText || '', userSkills || [], projects || [], certificates || []);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async getInterviewQuestions(req: Request, res: Response, next: NextFunction) {
    try {
      const { project, job } = req.body;
      const questions = aiInterviewService.generateTailoredQuestions(project, job);
      res.status(200).json({ success: true, data: questions });
    } catch (error) {
      next(error);
    }
  },

  async evaluateInterviewAnswer(req: Request, res: Response, next: NextFunction) {
    try {
      const { question, answerText } = req.body;
      const evaluation = aiInterviewService.evaluateStudentAnswer(question, answerText || '');
      res.status(200).json({ success: true, data: evaluation });
    } catch (error) {
      next(error);
    }
  },
};
