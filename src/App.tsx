import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppModeProvider } from './contexts/AppModeContext';
import { EventSelectionProvider } from './contexts/EventSelectionContext';
import Index from './pages/Index';
import NotFound from './pages/NotFound';

export default function App() {
  const mode = (localStorage.getItem('offline-study-planner') && JSON.parse(localStorage.getItem('offline-study-planner') ?? '{}')?.uiPreferences?.lastMode) || 'new';
  return (
    <BrowserRouter>
      <AppModeProvider initialMode={mode}>
        <EventSelectionProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/index" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster richColors />
        </EventSelectionProvider>
      </AppModeProvider>
    </BrowserRouter>
  );
}
