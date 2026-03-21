import type { TimeSlot } from '@barber-shop/shared';

interface Props {
  slots: TimeSlot[];
  selected: string | null;
  onChange: (time: string) => void;
  loading?: boolean;
}

export default function TimeSlotPicker({ slots, selected, onChange, loading = false }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-10 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
        Nenhum horário disponível para este dia.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2">
      {slots.map((slot) => (
        <button
          key={slot.time}
          onClick={() => slot.available && onChange(slot.time)}
          disabled={!slot.available}
          className={`
            py-2 rounded-lg text-sm font-medium transition-colors
            ${selected === slot.time ? 'bg-brand-600 text-white' : ''}
            ${slot.available && selected !== slot.time ? 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-brand-400 hover:text-brand-600 text-gray-700 dark:text-gray-200' : ''}
            ${!slot.available ? 'bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed line-through' : 'cursor-pointer'}
          `}
        >
          {slot.time}
        </button>
      ))}
    </div>
  );
}
