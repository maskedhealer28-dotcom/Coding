import { createContext, useContext, useState, type ReactNode } from 'react';
import type { AppMode } from '../types/study';

type AppModeContextValue = {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
};

const AppModeContext = createContext<AppModeContextValue | null>(null);

export const AppModeProvider = ({ children, initialMode }: { children: ReactNode; initialMode: AppMode }) => {
  const [mode, setMode] = useState<AppMode>(initialMode);
  return <AppModeContext.Provider value={{ mode, setMode }}>{children}</AppModeContext.Provider>;
};

export const useAppMode = () => {
  const context = useContext(AppModeContext);
  if (!context) throw new Error('useAppMode must be used within AppModeProvider');
  return context;
};
