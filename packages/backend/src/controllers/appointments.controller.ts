import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { addMinutes, isBefore, isAfter } from 'date-fns';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { AppointmentStatus } from '@barber-shop/shared';

const createSchema = z.object({
  barberId: z.string().min(1),
  serviceId: z.string().min(1),
  scheduledAt: z.string().datetime(),
  notes: z.string().optional(),
});

const statusSchema = z.object({
  status: z.nativeEnum(AppointmentStatus),
});

export async function listAppointments(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { role, userId } = req.user!;
    const where =
      role === 'CLIENT'
        ? { clientId: userId }
        : role === 'BARBER'
          ? { barber: { userId } }
          : {};

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        client: { select: { id: true, name: true, email: true, role: true, createdAt: true } },
        barber: { include: { user: { select: { id: true, name: true, email: true, role: true, createdAt: true } } } },
        service: true,
      },
      orderBy: { scheduledAt: 'asc' },
    });

    res.json(appointments);
  } catch (err) {
    next(err);
  }
}

export async function createAppointment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { barberId, serviceId, scheduledAt: scheduledAtStr, notes } = createSchema.parse(req.body);
    const clientId = req.user!.userId;

    const scheduledAt = new Date(scheduledAtStr);

    // Rule: no past dates
    if (isBefore(scheduledAt, new Date())) {
      throw new AppError('Cannot schedule appointments in the past', 400);
    }

    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) throw new AppError('Service not found', 404);

    const barber = await prisma.barber.findUnique({
      where: { id: barberId },
      include: { availability: true },
    });
    if (!barber) throw new AppError('Barber not found', 404);

    // Rule: check barber availability
    const dayOfWeek = scheduledAt.getDay();
    const dayAvailability = barber.availability.find((a) => a.dayOfWeek === dayOfWeek);
    if (!dayAvailability) {
      throw new AppError('Barber is not available on this day', 400);
    }

    const [startH, startM] = dayAvailability.startTime.split(':').map(Number);
    const [endH, endM] = dayAvailability.endTime.split(':').map(Number);

    const dayStart = new Date(scheduledAt);
    dayStart.setHours(startH, startM, 0, 0);
    const dayEnd = new Date(scheduledAt);
    dayEnd.setHours(endH, endM, 0, 0);

    const appointmentEnd = addMinutes(scheduledAt, service.durationMinutes);

    if (isBefore(scheduledAt, dayStart) || isAfter(appointmentEnd, dayEnd)) {
      throw new AppError('Appointment is outside barber working hours', 400);
    }

    // Rule: no double booking
    const conflicting = await prisma.appointment.findFirst({
      where: {
        barberId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        AND: [
          { scheduledAt: { lt: appointmentEnd } },
          {
            scheduledAt: {
              gt: new Date(scheduledAt.getTime() - service.durationMinutes * 60 * 1000),
            },
          },
        ],
      },
      include: { service: true },
    });

    if (conflicting) {
      const conflictEnd = addMinutes(new Date(conflicting.scheduledAt), conflicting.service.durationMinutes);
      if (
        isBefore(scheduledAt, conflictEnd) &&
        isAfter(appointmentEnd, new Date(conflicting.scheduledAt))
      ) {
        throw new AppError('This time slot is already booked', 409);
      }
    }

    const appointment = await prisma.appointment.create({
      data: { clientId, barberId, serviceId, scheduledAt, notes },
      include: {
        client: { select: { id: true, name: true, email: true, role: true, createdAt: true } },
        barber: { include: { user: { select: { id: true, name: true, email: true, role: true, createdAt: true } } } },
        service: true,
      },
    });

    res.status(201).json(appointment);
  } catch (err) {
    next(err);
  }
}

export async function updateAppointmentStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { status } = statusSchema.parse(req.body);
    const { role, userId } = req.user!;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { barber: true },
    });
    if (!appointment) throw new AppError('Appointment not found', 404);

    // Client can only cancel their own PENDING or CONFIRMED
    if (role === 'CLIENT') {
      if (appointment.clientId !== userId) {
        throw new AppError('Forbidden', 403);
      }
      if (status !== AppointmentStatus.CANCELLED) {
        throw new AppError('Clients can only cancel appointments', 403);
      }
      if (!['PENDING', 'CONFIRMED'].includes(appointment.status)) {
        throw new AppError('Cannot cancel an appointment that is not pending or confirmed', 400);
      }
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: { status },
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

export async function deleteAppointment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { role, userId } = req.user!;

    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment) throw new AppError('Appointment not found', 404);

    if (role === 'CLIENT' && appointment.clientId !== userId) {
      throw new AppError('Forbidden', 403);
    }

    await prisma.appointment.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
