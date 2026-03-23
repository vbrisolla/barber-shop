import { Router } from 'express';
import {
  listAppointments,
  createAppointment,
  updateAppointmentStatus,
  deleteAppointment,
} from '../controllers/appointments.controller';
import { rescheduleAppointment } from '../controllers/reschedule.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', listAppointments);
router.post('/', createAppointment);
router.patch('/:id/status', updateAppointmentStatus);
router.patch('/:id/reschedule', rescheduleAppointment);
router.delete('/:id', deleteAppointment);

export default router;