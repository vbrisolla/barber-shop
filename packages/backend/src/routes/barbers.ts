import { Router } from 'express';
import { listBarbers, getBarber, getBarberAvailability, setBarberAvailability } from '../controllers/barbers.controller';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', listBarbers);
router.get('/:id', getBarber);
router.get('/:id/availability', getBarberAvailability);
router.post('/:id/availability', authenticate, requireRole('ADMIN', 'BARBER'), setBarberAvailability);

export default router;
