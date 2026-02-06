import type { Subject } from '../../types/study';

export const SubjectSelector = ({ subjects, value, onChange }: { subjects: Subject[]; value: string; onChange: (value: string) => void }) => (
  <select className="rounded-full bg-white/10 px-4 py-2 text-sm text-white" value={value} onChange={(e) => onChange(e.target.value)}>
    {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
  </select>
);
