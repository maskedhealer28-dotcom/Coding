import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type EventSelectionContextValue = {
  selectedIds: string[];
  selectionMode: boolean;
  toggleSelection: (id: string) => void;
  clearSelection: () => void;
};

const EventSelectionContext = createContext<EventSelectionContextValue | null>(null);

export const EventSelectionProvider = ({ children }: { children: ReactNode }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const value = useMemo<EventSelectionContextValue>(() => ({
    selectedIds,
    selectionMode: selectedIds.length > 0,
    toggleSelection: (id: string) => {
      setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    },
    clearSelection: () => setSelectedIds([]),
  }), [selectedIds]);

  return <EventSelectionContext.Provider value={value}>{children}</EventSelectionContext.Provider>;
};

export const useEventSelection = () => {
  const context = useContext(EventSelectionContext);
  if (!context) throw new Error('useEventSelection must be used inside EventSelectionProvider');
  return context;
};
