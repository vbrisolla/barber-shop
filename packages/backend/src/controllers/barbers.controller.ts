import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { addMinutes, format, parse, isAfter, isBefore, isEqual } from 'date-fns';

const availabilitySchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format HH:MM'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format HH:MM'),
});

export async function listBarbers(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const barbers = await prisma.barber.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, role: true, createdAt: true } },
        services: { include: { service: true } },
      },
    });
    res.json(barbers);
  } catch (err) {
    next(err);
  }
}

export async function getBarber(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const barber = await prisma.barber.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { id: true, name: true, email: true, role: true, createdAt: true } },
        services: { include: { service: true } },
        availability: true,
      },
    });
    if (!barber) throw new AppError('Barber not found', 404);
    res.json(barber);
  } catch (err) {
    next(err);
  }
}

export async function getBarberAvailability(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { date, serviceId } = req.query as { date?: string; serviceId?: string };

    const barber = await prisma.barber.findUnique({ where: { id } });
    if (!barber) throw new AppError('Barber not found', 404);

    if (!date) {
      const availability = await prisma.barberAvailability.findMany({ where: { barberId: id } });
      res.json(availability);
      return;
    }

    // Get service duration
    let durationMinutes = 30;
    if (serviceId) {
      const service = await prisma.service.findUnique({ where: { id: serviceId } });
      if (service) durationMinutes = service.durationMinutes;
    }

    const requestedDate = new Date(date + 'T00:00:00');
    const dayOfWeek = requestedDate.getDay();

    const dayAvailability = await prisma.barberAvailability.findUnique({
      where: { barberId_dayOfWeek: { barberId: id, dayOfWeek } },
    });

    if (!dayAvailability) {
      res.json({ slots: [] });
      return;
    }

    // Get existing appointments for that day
    const startOfDay = new Date(date + 'T00:00:00');
    const endOfDay = new Date(date + 'T23:59:59');
    const existing = await prisma.appointment.findMany({
      where: {
        barberId: id,
        scheduledAt: { gte: startOfDay, lte: endOfDay },
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
      include: { service: true },
    });

    // Generate slots
    const slots: { time: string; available: boolean }[] = [];
    const [startH, startM] = dayAvailability.startTime.split(':').map(Number);
    const [endH, endM] = dayAvailability.endTime.split(':').map(Number);

    const slotStart = new Date(requestedDate);
    slotStart.setHours(startH, startM, 0, 0);
    const slotEnd = new Date(requestedDate);
    slotEnd.setHours(endH, endM, 0, 0);

    const now = new Date();
    let current = new Date(slotStart);

    while (isBefore(current, slotEnd) || isEqual(current, slotEnd)) {
      const slotFinish = addMinutes(current, durationMinutes);
      if (isAfter(slotFinish, slotEnd)) break;

      const isPast = isBefore(current, now);
      const isOccupied = existing.some((appt) => {
        const apptStart = new Date(appt.scheduledAt);
        const apptEnd = addMinutes(apptStart, appt.service.durationMinutes);
        return isBefore(current, apptEnd) && isAfter(slotFinish, apptStart);
      });

      slots.push({ time: format(current, 'HH:mm'), available: !isPast && !isOccupied });
      current = addMinutes(current, 30);
    }

    res.json({ slots });
  } catch (err) {
    next(err);
  }
}

export async function setBarberAvailability(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const barber = await prisma.barber.findUnique({ where: { id } });
    if (!barber) throw new AppError('Barber not found', 404);

    const data = availabilitySchema.parse(req.body);

    const availability = await prisma.barberAvailability.upsert({
      where: { barberId_dayOfWeek: { barberId: id, dayOfWeek: data.dayOfWeek } },
      update: { startTime: data.startTime, endTime: data.endTime },
      create: { barberId: id, ...data },
    });

    res.json(availability);
  } catch (err) {
    next(err);
  }
}
