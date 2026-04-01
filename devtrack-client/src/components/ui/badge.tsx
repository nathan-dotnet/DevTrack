type BadgeVariant = "Todo" | "InProgress" | "Done" | "Low" | "Medium" | "High";

const styles: Record<BadgeVariant, string> = {
  Todo: "bg-gray-100 text-gray-700",
  InProgress: "bg-blue-100 text-blue-700",
  Done: "bg-green-100 text-green-700",
  Low: "bg-gray-100 text-gray-600",
  Medium: "bg-yellow-100 text-yellow-700",
  High: "bg-red-100 text-red-700",
};

export function Badge({ value }: { value: BadgeVariant }) {
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[value]}`}
    >
      {value}
    </span>
  );
}
