import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { servicesApi } from '../../api/services';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import type { ServiceDTO } from '@barber-shop/shared';

const schema = z.object({
  name: z.string().min(1, 'Obrigatório'),
  description: z.string().optional(),
  durationMinutes: z.coerce.number().int().positive('Deve ser positivo'),
  price: z.coerce.number().positive('Deve ser positivo'),
});
type FormData = z.infer<typeof schema>;

export default function AdminServicesPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<ServiceDTO | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: servicesApi.list,
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: editing
      ? { name: editing.name, description: editing.description ?? '', durationMinutes: editing.durationMinutes, price: editing.price }
      : undefined,
  });

  const createMutation = useMutation({
    mutationFn: servicesApi.create,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['services'] }); resetForm(); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FormData> }) => servicesApi.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['services'] }); resetForm(); },
  });

  const deleteMutation = useMutation({
    mutationFn: servicesApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['services'] }),
  });

  function resetForm() {
    setEditing(null);
    setShowForm(false);
    reset();
  }

  async function onSubmit(data: FormData) {
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gerenciar Serviços</h1>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary">
          + Novo Serviço
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">
            {editing ? 'Editar Serviço' : 'Novo Serviço'}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label">Nome</label>
              <input className="input" {...register('name')} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="label">Descrição</label>
              <textarea className="input resize-none" rows={2} {...register('description')} />
            </div>
            <div>
              <label className="label">Duração (min)</label>
              <input type="number" className="input" {...register('durationMinutes')} />
              {errors.durationMinutes && <p className="text-red-500 text-xs mt-1">{errors.durationMinutes.message}</p>}
            </div>
            <div>
              <label className="label">Preço (R$)</label>
              <input type="number" step="0.01" className="input" {...register('price')} />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" disabled={isSubmitting} className="btn-primary">
                {editing ? 'Salvar' : 'Criar'}
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="card animate-pulse h-16" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {services?.map((service) => (
            <div key={service.id} className="card flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{service.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {service.durationMinutes} min &bull; R$ {service.price.toFixed(2)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditing(service); setShowForm(true); }}
                  className="btn-secondary text-sm py-1 px-3"
                >
                  Editar
                </button>
                <button
                  onClick={() => {
                    if (confirm('Deletar este serviço?')) deleteMutation.mutate(service.id);
                  }}
                  className="btn-danger text-sm py-1 px-3"
                >
                  Deletar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
