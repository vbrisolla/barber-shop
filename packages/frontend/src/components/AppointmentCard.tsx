import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { AppointmentDTO } from '@barber-shop/shared';
import { AppointmentStatus } from '@barber-shop/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentsApi } from '../api/appointments';
import { useAuth } from '../contexts/AuthContext';

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmado',
  CANCELLED: 'Cancelado',
  COMPLETED: 'Concluído',
};

const STATUS_COLORS: Record<AppointmentStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
};

interface Props {
  appointment: AppointmentDTO;
  showClient?: boolean;
  showActions?: boolean;
}

export default function AppointmentCard({ appointment, showClient = false, showActions = true }: Props) {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();

  const cancelMutation = useMutation({
    mutationFn: () =>
      appointmentsApi.updateStatus(appointment.id, { status: AppointmentStatus.CANCELLED }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appointments'] }),
  });

  const confirmMutation = useMutation({
    mutationFn: () =>
      appointmentsApi.updateStatus(appointment.id, { status: AppointmentStatus.CONFIRMED }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appointments'] }),
  });

  const completeMutation = useMutation({
    mutationFn: () =>
      appointmentsApi.updateStatus(appointment.id, { status: AppointmentStatus.COMPLETED }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appointments'] }),
  });

  const canCancel = ['PENDING', 'CONFIRMED'].includes(appointment.status);

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[appointment.status]}`}>
              {STATUS_LABELS[appointment.status]}
            </span>
            {showClient && appointment.client && (
              <span className="text-sm text-gray-500 dark:text-gray-400">Cliente: {appointment.client.name}</span>
            )}
          </div>

          <h3 className="font-semibold text-gray-900 dark:text-white">{appointment.service?.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Barbeiro: {appointment.barber?.user?.name ?? '—'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {format(new Date(appointment.scheduledAt), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
          </p>
          {appointment.service && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {appointment.service.durationMinutes} min &bull; R$ {appointment.service.price.toFixed(2)}
            </p>
          )}
          {appointment.notes && (
            <p className="text-sm text-gray-500 mt-1 italic">"{appointment.notes}"</p>
          )}
        </div>

        {showActions && (
          <div className="flex flex-col gap-2 shrink-0">
            {isAdmin && appointment.status === 'PENDING' && (
              <button
                onClick={() => confirmMutation.mutate()}
                disabled={confirmMutation.isPending}
                className="btn-primary text-xs py-1 px-3"
              >
                Confirmar
              </button>
            )}
            {isAdmin && appointment.status === 'CONFIRMED' && (
              <button
                onClick={() => completeMutation.mutate()}
                disabled={completeMutation.isPending}
                className="bg-blue-600 text-white text-xs py-1 px-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Concluir
              </button>
            )}
            {canCancel && (
              <button
                onClick={() => cancelMutation.mutate()}
                disabled={cancelMutation.isPending}
                className="btn-danger text-xs py-1 px-3"
              >
                Cancelar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
