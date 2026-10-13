import { Request, Response, NextFunction } from 'express';
import { jobService } from '../services/job.service.js';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware.js';

export const jobController = {
  async getAllJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await jobService.getAllJobs();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async createJob(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const recruiterId = req.user?.id || req.body.recruiter_id;
      const data = await jobService.createJob({ ...req.body, recruiter_id: recruiterId });
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async updateJob(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await jobService.updateJob(id, req.body);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async deleteJob(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await jobService.deleteJob(id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },
};
