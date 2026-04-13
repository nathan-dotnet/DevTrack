import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { projectsApi } from "../api/projectsApi";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";
import type { Project } from "../types";

export function DashboardPage() {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    projectsApi
      .getAll()
      .then(({ data }) => setProjects(data))
      .finally(() => setIsLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const { data } = await projectsApi.create(newName.trim());
      setProjects((prev) => [data, ...prev]);
      setNewName("");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white/95 border-b border-slate-200 px-6 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-semibold text-slate-900 text-lg">DevTrack</span>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <span className="text-sm text-slate-500">{user?.email}</span>
          <Button variant="secondary" onClick={logout}>
            Sign out
          </Button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-semibold text-slate-900 mb-6">
          Your projects
        </h1>

        <form
          onSubmit={handleCreate}
          className="flex flex-col gap-3 sm:flex-row mb-8"
        >
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New project name..."
            className="flex-1 border border-slate-200 rounded-2xl bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-transparent focus:ring-2 focus:ring-slate-300"
          />
          <Button type="submit" isLoading={creating}>
            Create
          </Button>
        </form>

        {isLoading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : projects.length === 0 ? (
          <p className="text-sm text-gray-400">
            No projects yet. Create one above.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="bg-white border border-slate-200 rounded-3xl px-5 py-4 transition-all hover:border-slate-300 hover:shadow-soft"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">
                    {project.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {project.taskCount} tasks
                  </span>
                </div>
                {project.description && (
                  <p className="text-sm text-gray-500 mt-1">
                    {project.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
