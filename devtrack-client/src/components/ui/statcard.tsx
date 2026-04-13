interface Props {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}

export function StatCard({
  label,
  value,
  sub,
  color = "text-gray-900",
}: Props) {
  return (
    <div className="bg-white/90 border border-slate-200 rounded-3xl p-5 shadow-soft">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className={`text-2xl font-semibold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}
