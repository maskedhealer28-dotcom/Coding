import { eachDayOfInterval, endOfMonth, format, startOfMonth } from 'date-fns';
import type { StudyEvent, Subject } from '../../types/study';

export const MonthlyCalendar = ({ date, events, subjects, onDayClick }: {
  date: Date;
  events: StudyEvent[];
  subjects: Subject[];
  onDayClick: (date: Date) => void;
}) => {
  const days = eachDayOfInterval({ start: startOfMonth(date), end: endOfMonth(date) });

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((day) => {
        const dayKey = format(day, 'yyyy-MM-dd');
        const dayEvents = events.filter((event) => format(new Date(event.date), 'yyyy-MM-dd') === dayKey);
        return (
          <button key={dayKey} onClick={() => onDayClick(day)} className="rounded-xl border border-white/10 p-2 text-left">
            <div className="text-xs text-white/80">{format(day, 'd')}</div>
            <div className="mt-2 flex gap-1">
              {dayEvents.slice(0, 4).map((event) => {
                const subject = subjects.find((s) => s.id === event.subjectId);
                return <span key={event.id} className="h-2 w-2 rounded-full" style={{ background: subject?.color, opacity: event.completed ? 0.4 : 1 }} />;
              })}
            </div>
          </button>
        );
      })}
    </div>
  );
};
