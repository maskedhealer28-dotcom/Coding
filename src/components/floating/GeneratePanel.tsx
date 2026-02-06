export const GeneratePanel = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <button className="rounded-full bg-emerald-500/30 px-4 py-2 text-sm text-white" onClick={onClick}>{label}</button>
);
