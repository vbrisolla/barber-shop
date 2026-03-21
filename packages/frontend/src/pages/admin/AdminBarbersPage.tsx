import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { barbersApi } from '../../api/barbers';
import { useState } from 'react';
import type { BarberDTO, BarberAvailabilityDTO } from '@barber-shop/shared';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const DAY_NAMES = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

const availSchema = z.object({
  dayOfWeek: z.coerce.number().int().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
});
type AvailForm = z.infer<typeof availSchema>;

export default function AdminBarbersPage() {
  const queryClient = useQueryClient();
  const [selectedBarber, setSelectedBarber] = useState<BarberDTO | null>(null);

  const { data: barbers, isLoading } = useQuery({ queryKey: ['barbers'], queryFn: barbersApi.list });

  const { data: barberDetail } = useQuery({
    queryKey: ['barber', selectedBarber?.id],
    queryFn: () => barbersApi.get(selectedBarber!.id),
    enabled: !!selectedBarber,
  });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AvailForm>({
    resolver: zodResolver(availSchema),
    defaultValues: { startTime: '09:00', endTime: '18:00' },
  });

  const availMutation = useMutation({
    mutationFn: (data: AvailForm) => barbersApi.setAvailability(selectedBarber!.id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['barber', selectedBarber?.id] }),
  });

  const availability: BarberAvailabilityDTO[] =
    (barberDetail as BarberDTO & { availability?: BarberAvailabilityDTO[] })?.availability ?? [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Gerenciar Barbeiros</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Barbers list */}
        <div>
          <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">Barbeiros</h2>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => <div key={i} className="card animate-pulse h-20" />)}
            </div>
          ) : (
            <div className="space-y-3">
              {barbers?.map((barber) => (
                <button
                  key={barber.id}
                  onClick={() => setSelectedBarber(barber)}
                  className={`card w-full text-left transition-all ${
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
                      <p className="text-sm text-gray-500 dark:text-gray-400">{barber.user.email}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Availability editor */}
        <div>
          <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">
            Disponibilidade {selectedBarber ? `— ${selectedBarber.user.name}` : ''}
          </h2>

          {!selectedBarber ? (
            <div className="card text-center py-8 text-gray-400 dark:text-gray-500">
              Selecione um barbeiro para editar a disponibilidade
            </div>
          ) : (
            <>
              <div className="card mb-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Dias configurados:</p>
                {availability.length === 0 ? (
                  <p className="text-sm text-gray-400 dark:text-gray-500">Nenhum dia configurado</p>
                ) : (
                  <div className="space-y-1">
                    {availability.map((a) => (
                      <div key={a.id} className="flex justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-300">{DAY_NAMES[a.dayOfWeek]}</span>
                        <span className="text-gray-500 dark:text-gray-400">
                          {a.startTime} – {a.endTime}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="card">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Adicionar / Editar dia:</p>
                <form onSubmit={handleSubmit((d) => availMutation.mutate(d))} className="space-y-3">
                  <div>
                    <label className="label">Dia da Semana</label>
                    <select className="input" {...register('dayOfWeek')}>
                      {DAY_NAMES.map((name, i) => (
                        <option key={i} value={i}>{name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Início</label>
                      <input type="time" className="input" {...register('startTime')} />
                    </div>
                    <div>
                      <label className="label">Fim</label>
                      <input type="time" className="input" {...register('endTime')} />
                    </div>
                  </div>
                  {(errors.startTime || errors.endTime) && (
                    <p className="text-red-500 text-xs">Formato inválido</p>
                  )}
                  <button type="submit" disabled={isSubmitting || availMutation.isPending} className="btn-primary w-full">
                    Salvar
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
