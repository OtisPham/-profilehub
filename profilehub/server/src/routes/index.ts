import { Router } from 'express';
import authRoutes from './auth.routes.js';
import projectRoutes from './project.routes.js';
import certificateRoutes from './certificate.routes.js';
import verificationRoutes from './verification.routes.js';
import jobRoutes from './job.routes.js';
import recruiterRoutes from './recruiter.routes.js';
import aiRoutes from './ai.routes.js';
import discoveryRoutes from './discovery.routes.js';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/projects', projectRoutes);
apiRouter.use('/certificates', certificateRoutes);
apiRouter.use('/verifications', verificationRoutes);
apiRouter.use('/jobs', jobRoutes);
apiRouter.use('/recruiter', recruiterRoutes);
apiRouter.use('/ai', aiRoutes);
apiRouter.use('/discovery', discoveryRoutes);

// Health check endpoint
apiRouter.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

export default apiRouter;
