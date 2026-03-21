import api from './client';
import type { BarberDTO, BarberAvailabilityDTO, CreateAvailabilityRequest, TimeSlot } from '@barber-shop/shared';

export const barbersApi = {
  list: () => api.get<BarberDTO[]>('/barbers').then((r) => r.data),
  get: (id: string) => api.get<BarberDTO>(`/barbers/${id}`).then((r) => r.data),
  getAvailability: (id: string, date?: string, serviceId?: string) =>
    api
      .get<{ slots: TimeSlot[] } | BarberAvailabilityDTO[]>(`/barbers/${id}/availability`, {
        params: { date, serviceId },
      })
      .then((r) => r.data),
  setAvailability: (id: string, data: CreateAvailabilityRequest) =>
    api.post<BarberAvailabilityDTO>(`/barbers/${id}/availability`, data).then((r) => r.data),
};
