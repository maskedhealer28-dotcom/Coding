export const ChapterInput = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
  <input className="w-72 rounded-full bg-white/10 px-4 py-2 text-sm text-white" placeholder="Chapter / Lesson" value={value} onChange={(e) => onChange(e.target.value)} />
);
