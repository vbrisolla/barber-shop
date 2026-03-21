export enum Role {
  ADMIN = 'ADMIN',
  BARBER = 'BARBER',
  CLIENT = 'CLIENT',
}

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface BarberDTO {
  id: string;
  userId: string;
  bio: string | null;
  avatarUrl: string | null;
  user: UserDTO;
  services?: ServiceDTO[];
}

export interface ServiceDTO {
  id: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  price: number;
}

export interface AppointmentDTO {
  id: string;
  clientId: string;
  barberId: string;
  serviceId: string;
  scheduledAt: string;
  status: AppointmentStatus;
  notes: string | null;
  createdAt: string;
  client?: UserDTO;
  barber?: BarberDTO;
  service?: ServiceDTO;
}

export interface BarberAvailabilityDTO {
  id: string;
  barberId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: UserDTO;
}

export interface CreateAppointmentRequest {
  barberId: string;
  serviceId: string;
  scheduledAt: string;
  notes?: string;
}

export interface UpdateAppointmentStatusRequest {
  status: AppointmentStatus;
}

export interface CreateServiceRequest {
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
}

export interface CreateAvailabilityRequest {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}
