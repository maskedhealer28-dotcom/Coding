import { format } from 'date-fns';
import { motion } from 'framer-motion';
import type { StudyEvent, Subject } from '../../types/study';
import { springTransition } from '../../lib/transitions';

export const WeeklyView = ({ events, subjects, selectedIds, selectionMode, onEventClick, onEventLongPress }: {
  events: StudyEvent[];
  subjects: Subject[];
  selectedIds: string[];
  selectionMode: boolean;
  onEventClick: (id: string) => void;
  onEventLongPress: (id: string) => void;
}) => (
  <div className="space-y-2">
    {events.map((event) => {
      const subject = subjects.find((s) => s.id === event.subjectId);
      let timeout: number | undefined;
      return (
        <motion.button
          layout
          transition={springTransition}
          key={event.id}
          className="w-full rounded-xl border border-white/10 p-3 text-left"
          style={{ background: selectedIds.includes(event.id) ? 'rgba(56,189,248,.25)' : 'rgba(255,255,255,.06)' }}
          onMouseDown={() => {
            timeout = window.setTimeout(() => onEventLongPress(event.id), 500);
          }}
          onMouseUp={() => clearTimeout(timeout)}
          onMouseLeave={() => clearTimeout(timeout)}
          onClick={() => onEventClick(event.id)}
        >
          <div className="flex items-center justify-between">
            <p className="font-medium text-white">{event.chapterTitle} · R{event.reviewIndex}</p>
            {!selectionMode && <span className="text-xs text-white/70">{format(new Date(event.date), 'MMM d')}</span>}
          </div>
          <p className="text-xs" style={{ color: subject?.color }}>{subject?.name}</p>
        </motion.button>
      );
    })}
  </div>
);
