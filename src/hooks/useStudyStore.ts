import { useEffect, useMemo, useState } from 'react';
import { formatISO } from 'date-fns';
import { calculateEventDates, deterministicId } from '../lib/utils';
import type { AppMode, AppState, StudyEvent, Subject } from '../types/study';

const STORAGE_KEY = 'offline-study-planner';

const defaultState: AppState = {
  subjects: [
    { id: 'subject-default', name: 'General', color: 'hsl(220 90% 60%)' },
  ],
  events: [],
  uiPreferences: {
    theme: 'dark',
    lastSelectedDate: new Date().toISOString(),
    lastMode: 'new',
  },
};

const loadState = (): AppState => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultState;
  try {
    return JSON.parse(raw) as AppState;
  } catch {
    return defaultState;
  }
};

export const modeFilter = (event: StudyEvent, mode: AppMode) => {
  if (mode === 'new') return !event.deleted && !event.completed;
  if (mode === 'archive') return !event.deleted && event.completed;
  return event.deleted;
};

export const useStudyStore = () => {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const eventsByMode = (mode: AppMode) => state.events.filter((event) => modeFilter(event, mode));

  const actions = useMemo(() => ({
    setTheme: (theme: 'light' | 'dark') => {
      setState((prev) => ({ ...prev, uiPreferences: { ...prev.uiPreferences, theme } }));
    },
    setLastMode: (mode: AppMode) => {
      setState((prev) => ({ ...prev, uiPreferences: { ...prev.uiPreferences, lastMode: mode } }));
    },
    setLastSelectedDate: (date: string) => {
      setState((prev) => ({ ...prev, uiPreferences: { ...prev.uiPreferences, lastSelectedDate: date } }));
    },
    addSubject: (name: string) => {
      const id = `subject-${name.toLowerCase().replace(/\s+/g, '-')}`;
      const hue = (name.length * 47) % 360;
      const subject: Subject = { id, name, color: `hsl(${hue} 80% 55%)` };
      setState((prev) => ({ ...prev, subjects: prev.subjects.some((s) => s.id === id) ? prev.subjects : [...prev.subjects, subject] }));
      return id;
    },
    generateEvents: (subjectId: string, chapterTitle: string, startDate: Date, count: number) => {
      const dates = calculateEventDates(startDate, count);
      const seed = `${subjectId}-${chapterTitle}-${formatISO(startDate, { representation: 'date' })}`;
      const events = dates.map((date, index) => ({
        id: deterministicId(seed, index + 1),
        subjectId,
        chapterTitle,
        date: date.toISOString(),
        reviewIndex: index + 1,
        completed: false,
        deleted: false,
        wasCompletedBeforeDelete: false,
      } satisfies StudyEvent));

      setState((prev) => ({
        ...prev,
        events: [...prev.events.filter((e) => !events.some((n) => n.id === e.id)), ...events],
      }));
    },
    markDone: (ids: string[]) => {
      setState((prev) => ({ ...prev, events: prev.events.map((e) => ids.includes(e.id) ? { ...e, completed: true } : e) }));
    },
    undoDone: (ids: string[]) => {
      setState((prev) => ({ ...prev, events: prev.events.map((e) => ids.includes(e.id) ? { ...e, completed: false } : e) }));
    },
    softDelete: (ids: string[]) => {
      setState((prev) => ({ ...prev, events: prev.events.map((e) => ids.includes(e.id) ? { ...e, deleted: true, wasCompletedBeforeDelete: e.completed } : e) }));
    },
    restoreFromTrash: (ids: string[]) => {
      setState((prev) => ({
        ...prev,
        events: prev.events.map((e) => ids.includes(e.id)
          ? { ...e, deleted: false, completed: e.wasCompletedBeforeDelete }
          : e),
      }));
    },
    permanentDelete: (ids: string[]) => {
      setState((prev) => ({ ...prev, events: prev.events.filter((e) => !ids.includes(e.id)) }));
    },
  }), []);

  return { state, actions, eventsByMode };
};
