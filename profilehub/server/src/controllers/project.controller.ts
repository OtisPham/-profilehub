import { Response, NextFunction } from 'express';
import { projectService } from '../services/project.service.js';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware.js';

export const projectController = {
  async getStudentProjects(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const studentId = req.query.studentId as string || req.user?.id;
      if (!studentId) {
        res.status(400).json({ success: false, message: 'Missing studentId' });
        return;
      }
      const data = await projectService.getStudentProjects(studentId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async getProjectById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await projectService.getProjectById(id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async createProject(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const studentId = req.user?.id || req.body.student_id;
      const projectData = { ...req.body, student_id: studentId };
      const data = await projectService.createProject(projectData);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async updateProject(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await projectService.updateProject(id, req.body);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async deleteProject(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const studentId = req.user?.id || req.body.student_id;
      const data = await projectService.deleteProject(id, studentId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },
};
