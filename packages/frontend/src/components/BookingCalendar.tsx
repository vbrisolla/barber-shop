import { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  isBefore,
  startOfDay,
  addMonths,
  subMonths,
  getDay,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Props {
  selected: Date | null;
  onChange: (date: Date) => void;
  availableDays?: number[];
}

const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function BookingCalendar({ selected, onChange, availableDays = [1, 2, 3, 4, 5, 6] }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const startOffset = getDay(startOfMonth(currentMonth));

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
        >
          &lsaquo;
        </button>
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </h3>
        <button
          onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
        >
          &rsaquo;
        </button>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {WEEK_DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map((day) => {
          const isAvailableDay = availableDays.includes(getDay(day));
          const isPastDay = isBefore(day, startOfDay(new Date()));
          const isDisabled = isPastDay || !isAvailableDay;
          const isSelected = selected && isSameDay(day, selected);
          const isTodayDay = isToday(day);

          return (
            <button
              key={day.toISOString()}
              onClick={() => !isDisabled && onChange(day)}
              disabled={isDisabled}
              className={`
                aspect-square rounded-lg text-sm font-medium transition-colors
                ${isSelected ? 'bg-brand-600 text-white' : ''}
                ${!isSelected && isTodayDay ? 'border-2 border-brand-400 text-brand-600' : ''}
                ${!isSelected && !isDisabled ? 'hover:bg-brand-100 dark:hover:bg-brand-900 text-gray-700 dark:text-gray-200' : ''}
                ${isDisabled ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
}
