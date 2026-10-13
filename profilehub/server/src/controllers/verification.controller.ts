import { Request, Response, NextFunction } from 'express';
import { verificationService } from '../services/verification.service.js';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware.js';

export const verificationController = {
  async getInbox(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const teacherId = req.user?.id || (req.query.teacherId as string) || '';
      const data = await verificationService.getTeacherInbox(teacherId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async approve(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.params;
      const { teacherId, teacherName, score, feedback } = req.body;
      const tId = req.user?.id || teacherId;
      const data = await verificationService.approveProject(projectId, tId, teacherName, Number(score), feedback);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async reject(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.params;
      const { teacherId, feedback } = req.body;
      const tId = req.user?.id || teacherId;
      const data = await verificationService.rejectProject(projectId, tId, feedback);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async getPublicRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const { code } = req.params;
      const data = await verificationService.getPublicVerificationRecord(code);
      if (!data) {
        res.status(404).json({ success: false, message: 'Verification record not found or not verified' });
        return;
      }
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },
};
