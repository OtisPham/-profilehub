import { Response, NextFunction } from 'express';
import { recruiterService } from '../services/recruiter.service.js';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware.js';

export const recruiterController = {
  async searchCandidates(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { query, skills } = req.query;
      const skillsArr = skills ? (skills as string).split(',') : undefined;
      const data = await recruiterService.searchCandidates(query as string, skillsArr);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async getPipeline(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const recruiterId = req.user?.id || (req.query.recruiterId as string);
      if (!recruiterId) {
        res.status(400).json({ success: false, message: 'Missing recruiterId' });
        return;
      }
      const data = await recruiterService.getPipeline(recruiterId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async updatePipelineStage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { itemId } = req.params;
      const { stage, notes } = req.body;
      const data = await recruiterService.updatePipelineStage(itemId, stage, notes);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async submitFeedback(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const recruiterId = req.user?.id || req.body.recruiter_id;
      const data = await recruiterService.submitFeedback({ ...req.body, recruiter_id: recruiterId });
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },
};
