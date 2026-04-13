import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-8">
      <div className="rounded-3xl bg-white/95 border border-slate-200 p-10 text-center shadow-soft">
        <h1 className="text-4xl font-semibold text-slate-900 mb-2">404</h1>
        <p className="text-slate-500 mb-6">Page not found</p>
        <Link to="/" className="text-indigo-600 hover:underline text-sm">
          Go home
        </Link>
      </div>
    </div>
  );
}
