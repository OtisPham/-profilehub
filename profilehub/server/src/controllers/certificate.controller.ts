import { Response, NextFunction } from 'express';
import { certificateService } from '../services/certificate.service.js';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware.js';

export const certificateController = {
  async getUserCertificates(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.query.userId as string || req.user?.id;
      if (!userId) {
        res.status(400).json({ success: false, message: 'Missing userId' });
        return;
      }
      const data = await certificateService.getUserCertificates(userId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async createCertificate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id || req.body.user_id;
      const data = await certificateService.createCertificate({ ...req.body, user_id: userId });
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async updateCertificate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await certificateService.updateCertificate(id, req.body);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async deleteCertificate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || req.body.user_id;
      const data = await certificateService.deleteCertificate(id, userId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },
};
