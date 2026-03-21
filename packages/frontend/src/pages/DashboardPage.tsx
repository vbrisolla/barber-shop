import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { appointmentsApi } from '../api/appointments';
import AppointmentCard from '../components/AppointmentCard';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AppointmentStatus } from '@barber-shop/shared';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: appointmentsApi.list,
  });

  const upcoming = appointments
    ?.filter((a) => ['PENDING', 'CONFIRMED'].includes(a.status))
    .slice(0, 3);

  const today = format(new Date(), "dd 'de' MMMM", { locale: ptBR });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Olá, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{today}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card bg-brand-50 border-brand-200">
          <p className="text-sm text-brand-700 font-medium">Agendamentos Ativos</p>
          <p className="text-3xl font-bold text-brand-800 mt-1">
            {appointments?.filter((a) => ['PENDING', 'CONFIRMED'].includes(a.status)).length ?? 0}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Concluídos</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
            {appointments?.filter((a) => a.status === AppointmentStatus.COMPLETED).length ?? 0}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{appointments?.length ?? 0}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Próximos Agendamentos</h2>
        <Link to="/appointments" className="text-sm text-brand-600 hover:underline">
          Ver todos
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse h-24" />
          ))}
        </div>
      ) : upcoming?.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Nenhum agendamento próximo.</p>
          <Link to="/booking" className="btn-primary">
            Fazer Agendamento
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {upcoming?.map((appt) => (
            <AppointmentCard key={appt.id} appointment={appt} />
          ))}
        </div>
      )}

      <div className="mt-8">
        <Link to="/booking" className="btn-primary inline-block">
          Novo Agendamento
        </Link>
      </div>
    </div>
  );
}
