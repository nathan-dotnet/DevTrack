import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-semibold text-gray-900 mb-2">404</h1>
        <p className="text-gray-500 mb-6">Page not found</p>
        <Link to="/" className="text-indigo-600 hover:underline text-sm">
          Go home
        </Link>
      </div>
    </div>
  );
}
