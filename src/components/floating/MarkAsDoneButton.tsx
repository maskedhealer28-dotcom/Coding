export const MarkAsDoneButton = ({ onClick, label }: { onClick: () => void; label: string }) => (
  <button className="rounded-full bg-cyan-500/30 px-4 py-2 text-sm text-white" onClick={onClick}>{label}</button>
);
