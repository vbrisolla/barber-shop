import api from './client';
import type { ServiceDTO, CreateServiceRequest } from '@barber-shop/shared';

export const servicesApi = {
  list: () => api.get<ServiceDTO[]>('/services').then((r) => r.data),
  get: (id: string) => api.get<ServiceDTO>(`/services/${id}`).then((r) => r.data),
  create: (data: CreateServiceRequest) => api.post<ServiceDTO>('/services', data).then((r) => r.data),
  update: (id: string, data: Partial<CreateServiceRequest>) =>
    api.put<ServiceDTO>(`/services/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/services/${id}`),
};
