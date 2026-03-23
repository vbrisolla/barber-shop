import api from './client';
import type { AppointmentDTO, CreateAppointmentRequest, UpdateAppointmentStatusRequest } from '@barber-shop/shared';

export const appointmentsApi = {
  list: () => api.get<AppointmentDTO[]>('/appointments').then((r) => r.data),
  create: (data: CreateAppointmentRequest) => api.post<AppointmentDTO>('/appointments', data).then((r) => r.data),
  updateStatus: (id: string, data: UpdateAppointmentStatusRequest) =>
    api.patch<AppointmentDTO>(`/appointments/${id}/status`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/appointments/${id}`),
  reschedule: (id: string, data: { scheduledAt: string }) =>
    api.patch<AppointmentDTO>(`/appointments/${id}/reschedule`, data).then((r) => r.data),
};