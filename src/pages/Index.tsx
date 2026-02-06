import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { isSameWeek } from 'date-fns';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { MonthlyCalendar } from '../components/calendar/MonthlyCalendar';
import { DailyStats } from '../components/calendar/DailyStats';
import { WeeklyView } from '../components/calendar/WeeklyView';
import { ThemeToggle } from '../components/floating/ThemeToggle';
import { SubjectSelector } from '../components/floating/SubjectSelector';
import { FilterSelector } from '../components/floating/FilterSelector';
import { ModeSelector } from '../components/floating/ModeSelector';
import { DatePickerWithDelete } from '../components/floating/DatePickerWithDelete';
import { ChapterInput } from '../components/floating/ChapterInput';
import { MarkAsDoneButton } from '../components/floating/MarkAsDoneButton';
import { GeneratePanel } from '../components/floating/GeneratePanel';
import { useStudyStore } from '../hooks/useStudyStore';
import { useAppMode } from '../contexts/AppModeContext';
import { useEventSelection } from '../contexts/EventSelectionContext';
import { springTransition } from '../lib/transitions';

const formSchema = z.object({ chapter: z.string().min(1), count: z.number().int().min(1).max(15) });

export default function Index() {
  const { state, actions, eventsByMode } = useStudyStore();
  const { mode, setMode } = useAppMode();
  const { selectedIds, selectionMode, toggleSelection, clearSelection } = useEventSelection();
  const [selectedSubject, setSelectedSubject] = useState(state.subjects[0]?.id ?? '');
  const [subjectFilter, setSubjectFilter] = useState('all');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { chapter: '', count: 6 },
  });

  const modeEvents = useMemo(() => {
    const events = eventsByMode(mode);
    return subjectFilter === 'all' ? events : events.filter((event) => event.subjectId === subjectFilter);
  }, [eventsByMode, mode, subjectFilter]);

  const weeklyEvents = modeEvents.filter((event) => isSameWeek(new Date(event.date), new Date(state.uiPreferences.lastSelectedDate)));

  const runModeAction = () => {
    if (!selectedIds.length) return;
    if (mode === 'new') actions.markDone(selectedIds);
    if (mode === 'archive') actions.undoDone(selectedIds);
    if (mode === 'trash') actions.restoreFromTrash(selectedIds);
    clearSelection();
    toast.success('Action completed');
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-white" onClick={(e) => e.currentTarget === e.target && clearSelection()}>
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-slate-900 to-slate-950" />

      <main className="relative z-[35] mx-auto max-w-5xl p-6 pb-40">
        <MonthlyCalendar date={new Date(state.uiPreferences.lastSelectedDate)} events={modeEvents} subjects={state.subjects} onDayClick={(date) => actions.setLastSelectedDate(date.toISOString())} />
        <div className="my-4"><DailyStats anchorDate={new Date(state.uiPreferences.lastSelectedDate)} events={modeEvents} /></div>
        <WeeklyView
          events={weeklyEvents}
          subjects={state.subjects}
          selectedIds={selectedIds}
          selectionMode={selectionMode}
          onEventLongPress={toggleSelection}
          onEventClick={(id) => (selectionMode ? toggleSelection(id) : undefined)}
        />
      </main>

      <div className="pointer-events-none fixed inset-0 z-40 shadow-[inset_0_0_120px_rgba(0,0,0,.6)]" />

      <motion.div layout className="fixed left-4 top-4 z-50 flex gap-2" transition={springTransition}>
        <ThemeToggle theme={state.uiPreferences.theme} onToggle={() => actions.setTheme(state.uiPreferences.theme === 'dark' ? 'light' : 'dark')} />
        <AnimatePresence mode="wait">
          {selectionMode ? (
            <motion.div key="filter" layoutId="subject-filter"><FilterSelector subjects={state.subjects} value={subjectFilter} onChange={setSubjectFilter} /></motion.div>
          ) : (
            <motion.div key="subject" layoutId="subject-filter"><SubjectSelector subjects={state.subjects} value={selectedSubject} onChange={setSelectedSubject} /></motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="fixed right-4 top-4 z-50"><ModeSelector mode={mode} onChange={(x) => { setMode(x); actions.setLastMode(x); clearSelection(); }} /></div>

      <motion.div layout transition={springTransition} className="fixed bottom-4 left-4 z-50">
        <DatePickerWithDelete selectionMode={selectionMode} date={state.uiPreferences.lastSelectedDate} onDate={actions.setLastSelectedDate} onDelete={() => { actions.softDelete(selectedIds); clearSelection(); }} />
      </motion.div>

      <motion.div layout transition={springTransition} className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
        {selectionMode ? (
          <MarkAsDoneButton label={mode === 'new' ? 'Mark as Done' : mode === 'archive' ? 'Undo' : 'Restore'} onClick={runModeAction} />
        ) : (
          <ChapterInput value={form.watch('chapter')} onChange={(value) => form.setValue('chapter', value)} />
        )}
      </motion.div>

      <div className="fixed bottom-4 right-4 z-50">
        <GeneratePanel
          label={selectionMode ? (mode === 'trash' ? 'Permanent Delete' : 'Delete') : 'Generate'}
          onClick={() => {
            if (selectionMode) {
              if (mode === 'trash') actions.permanentDelete(selectedIds); else actions.softDelete(selectedIds);
              clearSelection();
              return;
            }
            const values = form.getValues();
            const parsed = formSchema.safeParse(values);
            if (!parsed.success) {
              toast.error('Enter chapter and valid count');
              return;
            }
            actions.generateEvents(selectedSubject, parsed.data.chapter, new Date(state.uiPreferences.lastSelectedDate), parsed.data.count);
            toast.success('Events generated');
          }}
        />
      </div>
    </div>
  );
}
