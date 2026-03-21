import { Router } from 'express';
import { listServices, getService, createService, updateService, deleteService } from '../controllers/services.controller';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', listServices);
router.get('/:id', getService);
router.post('/', authenticate, requireRole('ADMIN'), createService);
router.put('/:id', authenticate, requireRole('ADMIN'), updateService);
router.delete('/:id', authenticate, requireRole('ADMIN'), deleteService);

export default router;
