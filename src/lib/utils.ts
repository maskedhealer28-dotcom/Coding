import { addDays } from 'date-fns';

export const cn = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(' ');

export const calculateEventDates = (start: Date, count: number): Date[] => {
  const dates = [start];
  let current = start;
  for (let i = 1; i < count; i += 1) {
    current = addDays(current, i);
    dates.push(current);
  }
  return dates;
};

export const deterministicId = (seed: string, i = 0) => `${seed}-${i}`;
