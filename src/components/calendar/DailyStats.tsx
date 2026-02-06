import { addDays, format, startOfWeek } from 'date-fns';
import type { StudyEvent } from '../../types/study';

export const DailyStats = ({ anchorDate, events }: { anchorDate: Date; events: StudyEvent[] }) => {
  const start = startOfWeek(anchorDate);
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  const counts = days.map((d) => events.filter((e) => format(new Date(e.date), 'yyyy-MM-dd') === format(d, 'yyyy-MM-dd')).length);
  const max = Math.max(1, ...counts);

  return (
    <div className="flex h-24 items-end gap-2 overflow-x-auto">
      {days.map((day, i) => (
        <div key={day.toISOString()} className="flex min-w-10 flex-col items-center gap-1">
          <div className="w-6 rounded-t bg-cyan-400" style={{ height: `${(counts[i] / max) * 100}%` }} />
          <span className="text-xs text-white/70">{format(day, 'EE')}</span>
        </div>
      ))}
    </div>
  );
};
