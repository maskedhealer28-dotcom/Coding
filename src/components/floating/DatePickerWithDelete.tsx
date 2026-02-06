export const DatePickerWithDelete = ({ selectionMode, date, onDate, onDelete }: {
  selectionMode: boolean;
  date: string;
  onDate: (date: string) => void;
  onDelete: () => void;
}) => selectionMode
  ? <button className="rounded-full bg-red-500/30 px-4 py-2 text-sm text-white" onClick={onDelete}>Delete</button>
  : <input type="date" className="rounded-full bg-white/10 px-4 py-2 text-sm text-white" value={date.slice(0, 10)} onChange={(e) => onDate(new Date(e.target.value).toISOString())} />;
