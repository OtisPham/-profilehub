import { Request, Response, NextFunction } from 'express';
import { aiCvService } from '../services/aiCv.service.js';

export const aiController = {
  async optimizeCV(req: Request, res: Response, next: NextFunction) {
    try {
      const { jdText, userSkills, projects, certificates } = req.body;
      const data = await aiCvService.analyzeAndTailorCV(jdText || '', userSkills || [], projects || [], certificates || []);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async generateTailoredCV(req: Request, res: Response, next: NextFunction) {
    try {
      const { jdText, targetRole, companyName, profile, projects, certificates, achievements } = req.body;

      if (!jdText || typeof jdText !== 'string' || jdText.trim().length === 0) {
        res.status(400).json({ success: false, message: 'Vui lòng cung cấp nội dung Mô tả công việc (JD).' });
        return;
      }

      const generatedCV = await aiCvService.generateTailoredCVFromJD({
        jdText,
        targetRole,
        companyName,
        profile: profile || {},
        projects: Array.isArray(projects) ? projects : [],
        certificates: Array.isArray(certificates) ? certificates : [],
        achievements: Array.isArray(achievements) ? achievements : []
      });

      res.status(200).json({ success: true, data: generatedCV });
    } catch (error) {
      next(error);
    }
  },

  async contextualAction(req: Request, res: Response, next: NextFunction) {
    try {
      const { actionType, currentText, targetRole, jdContext, keywords } = req.body;
      if (!currentText || typeof currentText !== 'string') {
        res.status(400).json({ success: false, message: 'Thiếu đoạn văn bản cần tối ưu (currentText).' });
        return;
      }

      const validAction = [
        'REWRITE_FOR_JD',
        'ADD_KEYWORDS',
        'SHORTEN',
        'REWRITE_PROFESSIONAL',
        'FOCUS_RESULTS',
        'EXPAND',
        'TRANSLATE_EN',
        'TRANSLATE_VI'
      ].includes(actionType)
        ? actionType
        : 'REWRITE_FOR_JD';

      const result = await aiCvService.executeContextualAction({
        actionType: validAction,
        currentText,
        targetRole,
        jdContext,
        keywords: Array.isArray(keywords) ? keywords : []
      });

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
};

