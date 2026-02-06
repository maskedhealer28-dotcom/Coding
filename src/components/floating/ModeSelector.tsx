import type { AppMode } from '../../types/study';

export const ModeSelector = ({ mode, onChange }: { mode: AppMode; onChange: (mode: AppMode) => void }) => (
  <div className="flex rounded-full bg-white/10 p-1 text-xs text-white">
    {(['new', 'archive', 'trash'] as const).map((x) => (
      <button key={x} className={`rounded-full px-3 py-1 ${x === mode ? 'bg-white/20' : ''}`} onClick={() => onChange(x)}>{x}</button>
    ))}
  </div>
);
