import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware.js';

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, fullName, role } = req.body;
      const data = await authService.register(email, password, fullName, role);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const data = await authService.login(email, password);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.id) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const data = await authService.getProfile(req.user.id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },
};
