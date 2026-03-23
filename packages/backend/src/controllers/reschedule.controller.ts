import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { addMinutes, isBefore, isAfter } from 'date-fns';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

export async function rescheduleAppointment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { scheduledAt: scheduledAtStr } = z.object({ scheduledAt: z.string().datetime() }).parse(req.body);
    const { userId, role } = (req as any).user;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { service: true, barber: { include: { availability: true } } },
    });
    if (!appointment) throw new AppError('Appointment not found', 404);

    if (role === 'CLIENT' && appointment.clientId !== userId) {
      throw new AppError('Forbidden', 403);
    }

    if (!['PENDING', 'CONFIRMED'].includes(appointment.status)) {
      throw new AppError('Cannot reschedule this appointment', 400);
    }

    const scheduledAt = new Date(scheduledAtStr);

    if (isBefore(scheduledAt, new Date())) {
      throw new AppError('Cannot schedule appointments in the past', 400);
    }

    const dayOfWeek = scheduledAt.getDay();
    const dayAvailability = appointment.barber.availability.find((a) => a.dayOfWeek === dayOfWeek);
    if (!dayAvailability) throw new AppError('Barber is not available on this day', 400);

    const [startH, startM] = dayAvailability.startTime.split(':').map(Number);
    const [endH, endM] = dayAvailability.endTime.split(':').map(Number);
    const dayStart = new Date(scheduledAt);
    dayStart.setHours(startH, startM, 0, 0);
    const dayEnd = new Date(scheduledAt);
    dayEnd.setHours(endH, endM, 0, 0);
    const appointmentEnd = addMinutes(scheduledAt, appointment.service.durationMinutes);

    if (isBefore(scheduledAt, dayStart) || isAfter(appointmentEnd, dayEnd)) {
      throw new AppError('Appointment is outside barber working hours', 400);
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: { scheduledAt },
      include: {
        client: { select: { id: true, name: true, email: true, role: true, createdAt: true } },
        barber: { include: { user: { select: { id: true, name: true, email: true, role: true, createdAt: true } } } },
        service: true,
      },
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
}