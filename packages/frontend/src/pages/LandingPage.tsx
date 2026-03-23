import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { servicesApi } from '../api/services';
import { barbersApi } from '../api/barbers';
import { useAuth } from '../contexts/AuthContext';
import Carrossel from '../components/Carrossel';

export default function LandingPage() {
  const { user } = useAuth();
  const { data: services } = useQuery({ queryKey: ['services'], queryFn: servicesApi.list });
  const { data: barbers } = useQuery({ queryKey: ['barbers'], queryFn: barbersApi.list });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gray-100 text-gray-900 dark:bg-gray-950 dark:text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 text-brand-400">BSAR</h1>
          <h1 className="text-5xl font-bold mb-6 text-brand-400">Barbearia Premium</h1>
          <p className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Cortes modernos, barba impecável. Agende seu horário com os melhores barbeiros da cidade.
          </p>
          <div className="flex gap-4 justify-center">
            {user ? (
              <Link to="/booking" className="btn-primary text-lg px-8 py-3">
                Agendar Agora
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary text-lg px-8 py-3">
                  Criar Conta
                </Link>
                <Link to="/login" className="btn-secondary text-lg px-8 py-3">
                  Entrar
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Nossos Serviços</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services?.map((service) => (
              <div key={service.id} className="card hover:shadow-md transition-shadow">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{service.name}</h3>
                {service.description && <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">{service.description}</p>}
                <div className="flex items-center justify-between mt-4">
                  <span className="text-brand-600 font-bold text-lg">R$ {service.price.toFixed(2)}</span>
                  <span className="text-gray-500 text-sm">{service.durationMinutes} min</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Barbers */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Nossos Barbeiros</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {barbers?.map((barber) => (
              <div key={barber.id} className="card text-center hover:shadow-md transition-shadow">
                <img
                  src={barber.avatarUrl || `https://i.pravatar.cc/120?u=${barber.id}`}
                  alt={barber.user.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{barber.user.name}</h3>
                {barber.bio && <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">{barber.bio}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Galeria */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Nosso Espaço
          </h2>
          <Carrossel />
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 px-4 bg-gray-100 text-gray-900 dark:bg-gray-950 dark:text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Pronto para um novo visual?</h2>
        <p className="text-gray-900 dark:text-white mb-8">Agende online em menos de 2 minutos.</p>
        <Link to={user ? '/booking' : '/register'} className="btn-primary text-lg px-8 py-3">
          {user ? 'Agendar Agora' : 'Começar Agora'}
        </Link>
      </section>
    </div>
  );
}
