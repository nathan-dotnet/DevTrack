interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  isLoading?: boolean;
}

export function Button({
  variant = "primary",
  isLoading,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-60 disabled:cursor-not-allowed";
  const variants = {
    primary:
      "bg-slate-900 text-white shadow-sm hover:bg-slate-800 focus:ring-slate-400",
    secondary:
      "border border-slate-200 bg-white text-slate-900 shadow-sm hover:border-slate-300 hover:bg-slate-50 focus:ring-slate-300",
    danger:
      "bg-rose-600 text-white shadow-sm hover:bg-rose-700 focus:ring-rose-400",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}
