import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { barbersApi } from '../api/barbers';
import { servicesApi } from '../api/services';
import { appointmentsApi } from '../api/appointments';
import BookingCalendar from '../components/BookingCalendar';
import TimeSlotPicker from '../components/TimeSlotPicker';
import type { BarberDTO, ServiceDTO, TimeSlot } from '@barber-shop/shared';

type Step = 1 | 2 | 3;

export default function BookingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [selectedBarber, setSelectedBarber] = useState<BarberDTO | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceDTO | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const { data: barbers, isLoading: loadingBarbers } = useQuery({
    queryKey: ['barbers'],
    queryFn: barbersApi.list,
  });

  const { data: services, isLoading: loadingServices } = useQuery({
    queryKey: ['services'],
    queryFn: servicesApi.list,
  });

  const { data: slotsData, isLoading: loadingSlots } = useQuery({
    queryKey: ['slots', selectedBarber?.id, selectedDate, selectedService?.id],
    queryFn: () =>
      barbersApi.getAvailability(
        selectedBarber!.id,
        format(selectedDate!, 'yyyy-MM-dd'),
        selectedService?.id
      ) as Promise<{ slots: TimeSlot[] }>,
    enabled: !!selectedBarber && !!selectedDate && !!selectedService,
  });

  const slots = (slotsData as { slots: TimeSlot[] })?.slots ?? [];

  const availableDays = selectedBarber
    ? (selectedBarber as BarberDTO & { availability?: { dayOfWeek: number }[] }).availability?.map(
        (a) => a.dayOfWeek
      ) ?? [1, 2, 3, 4, 5, 6]
    : [1, 2, 3, 4, 5, 6];

  const bookMutation = useMutation({
    mutationFn: () => {
      const scheduledAt = new Date(selectedDate!);
      const [h, m] = selectedTime!.split(':').map(Number);
      scheduledAt.setHours(h, m, 0, 0);
      return appointmentsApi.create({
        barberId: selectedBarber!.id,
        serviceId: selectedService!.id,
        scheduledAt: scheduledAt.toISOString(),
        notes: notes || undefined,
      });
    },
    onSuccess: () => navigate('/appointments'),
    onError: (err: unknown) => {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message || 'Erro ao agendar');
    },
  });

  const canProceedStep1 = selectedBarber && selectedService;
  const canProceedStep2 = selectedDate && selectedTime;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Fazer Agendamento</h1>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-8">
        {([1, 2, 3] as Step[]).map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                step >= s ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
              }`}
            >
              {s}
            </div>
            {s < 3 && <div className={`h-0.5 w-12 ${step > s ? 'bg-brand-600' : 'bg-gray-200'}`} />}
          </div>
        ))}
        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
          {step === 1 && 'Barbeiro e Serviço'}
          {step === 2 && 'Data e Horário'}
          {step === 3 && 'Confirmação'}
        </span>
      </div>

      {/* Step 1: Barbeiro e Serviço */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Escolha o Barbeiro</h2>
            {loadingBarbers ? (
              <div className="grid grid-cols-2 gap-4">
                {[1, 2].map((i) => <div key={i} className="card animate-pulse h-24" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {barbers?.map((barber) => (
                  <button
                    key={barber.id}
                    onClick={() => setSelectedBarber(barber)}
                    className={`card text-left transition-all ${
                      selectedBarber?.id === barber.id
                        ? 'border-brand-500 ring-2 ring-brand-200'
                        : 'hover:border-brand-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={barber.avatarUrl || `https://i.pravatar.cc/60?u=${barber.id}`}
                        alt={barber.user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{barber.user.name}</p>
                        {barber.bio && <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{barber.bio}</p>}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Escolha o Serviço</h2>
            {loadingServices ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => <div key={i} className="card animate-pulse h-16" />)}
              </div>
            ) : (
              <div className="space-y-2">
                {services?.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`card w-full text-left transition-all ${
                      selectedService?.id === service.id
                        ? 'border-brand-500 ring-2 ring-brand-200'
                        : 'hover:border-brand-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{service.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{service.durationMinutes} min</p>
                      </div>
                      <span className="font-bold text-brand-600">R$ {service.price.toFixed(2)}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!canProceedStep1}
            className="btn-primary w-full"
          >
            Continuar
          </button>
        </div>
      )}

      {/* Step 2: Data e Horário */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Escolha a Data</h2>
            <BookingCalendar
              selected={selectedDate}
              onChange={(d) => { setSelectedDate(d); setSelectedTime(null); }}
              availableDays={availableDays}
            />
          </div>

          {selectedDate && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
                Horários disponíveis em{' '}
                {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
              </h2>
              <TimeSlotPicker
                slots={slots}
                selected={selectedTime}
                onChange={setSelectedTime}
                loading={loadingSlots}
              />
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="btn-secondary flex-1">
              Voltar
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!canProceedStep2}
              className="btn-primary flex-1"
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirmação */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Confirmar Agendamento</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="card space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Barbeiro</span>
              <span className="font-medium">{selectedBarber?.user.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Serviço</span>
              <span className="font-medium">{selectedService?.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Duração</span>
              <span className="font-medium">{selectedService?.durationMinutes} min</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Data</span>
              <span className="font-medium">
                {selectedDate && format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Horário</span>
              <span className="font-medium">{selectedTime}</span>
            </div>
            <div className="flex justify-between text-sm border-t pt-3">
              <span className="text-gray-500 dark:text-gray-400 font-medium">Total</span>
              <span className="font-bold text-brand-600 text-base">
                R$ {selectedService?.price.toFixed(2)}
              </span>
            </div>
          </div>

          <div>
            <label className="label">Observações (opcional)</label>
            <textarea
              className="input resize-none"
              rows={3}
              placeholder="Ex: prefiro cabelo mais curto nas laterais..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="btn-secondary flex-1">
              Voltar
            </button>
            <button
              onClick={() => bookMutation.mutate()}
              disabled={bookMutation.isPending}
              className="btn-primary flex-1"
            >
              {bookMutation.isPending ? 'Agendando...' : 'Confirmar Agendamento'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
