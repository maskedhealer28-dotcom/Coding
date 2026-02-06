import type { Subject } from '../../types/study';

export const FilterSelector = ({ subjects, value, onChange }: { subjects: Subject[]; value: string; onChange: (value: string) => void }) => (
  <select className="rounded-full bg-cyan-500/20 px-4 py-2 text-sm text-white" value={value} onChange={(e) => onChange(e.target.value)}>
    <option value="all">All</option>
    {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
  </select>
);
