import api from './client';
import type { AuthResponse, LoginRequest, RegisterRequest, UserDTO } from '@barber-shop/shared';

export const authApi = {
  login: (data: LoginRequest) => api.post<AuthResponse>('/auth/login', data).then((r) => r.data),
  register: (data: RegisterRequest) => api.post<AuthResponse>('/auth/register', data).then((r) => r.data),
  me: () => api.get<UserDTO>('/auth/me').then((r) => r.data),
};
