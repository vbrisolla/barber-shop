import { useQuery } from '@tanstack/react-query';
import { appointmentsApi } from '../../api/appointments';
import AppointmentCard from '../../components/AppointmentCard';
import { useState } from 'react';
import type { AppointmentStatus } from '@barber-shop/shared';

const FILTERS = [
  { label: 'Todos', value: '' },
  { label: 'Pendentes', value: 'PENDING' },
  { label: 'Confirmados', value: 'CONFIRMED' },
  { label: 'Concluídos', value: 'COMPLETED' },
  { label: 'Cancelados', value: 'CANCELLED' },
] as const;

export default function AdminAppointmentsPage() {
  const [filter, setFilter] = useState<AppointmentStatus | ''>('');
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: appointmentsApi.list,
  });

  const filtered = filter ? appointments?.filter((a) => a.status === filter) : appointments;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Gerenciar Agendamentos</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {FILTERS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === value
                ? 'bg-brand-600 text-white'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-brand-400'
            }`}
          >
            {label}
            {value === '' && appointments && (
              <span className="ml-1 text-xs">({appointments.length})</span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="card animate-pulse h-28" />)}
        </div>
      ) : filtered?.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Nenhum agendamento encontrado.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered?.map((appt) => (
            <AppointmentCard key={appt.id} appointment={appt} showClient />
          ))}
        </div>
      )}
    </div>
  );
}
