import { Router } from 'express';
import { certificateController } from '../controllers/certificate.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// GET /api/certificates?userId=...
router.get('/', requireAuth, certificateController.getUserCertificates);

// POST /api/certificates
router.post('/', requireAuth, certificateController.createCertificate);

// PUT /api/certificates/:id
router.put('/:id', requireAuth, certificateController.updateCertificate);

// DELETE /api/certificates/:id
router.delete('/:id', requireAuth, certificateController.deleteCertificate);

export default router;
