type BadgeVariant = "Todo" | "InProgress" | "Done" | "Low" | "Medium" | "High";

const labels: Record<BadgeVariant, string> = {
  Todo: "To do",
  InProgress: "In progress",
  Done: "Done",
  Low: "Low",
  Medium: "Medium",
  High: "High",
};

const styles: Record<BadgeVariant, string> = {
  Todo: "bg-slate-100 text-slate-700",
  InProgress: "bg-indigo-100 text-indigo-700",
  Done: "bg-emerald-100 text-emerald-700",
  Low: "bg-slate-100 text-slate-700",
  Medium: "bg-amber-100 text-amber-700",
  High: "bg-rose-100 text-rose-700",
};

export function Badge({ value }: { value: BadgeVariant }) {
  return (
    <span
      className={`text-xs font-semibold uppercase tracking-[0.15em] px-3 py-1 rounded-full ${styles[value]}`}
    >
      {labels[value]}
    </span>
  );
}
