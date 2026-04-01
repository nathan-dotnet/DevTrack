import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { tasksApi } from "../api/tasksApi";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { useTaskHub } from "../hooks/useTaskHub";
import type { Task } from "../types";

const COLUMNS: Task["status"][] = ["Todo", "InProgress", "Done"];

export function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    tasksApi
      .getAll(projectId, { pageSize: 100 })
      .then(({ data }) => setTasks(data.items))
      .finally(() => setIsLoading(false));
  }, [projectId]);

  // Real-time updates via SignalR
  useTaskHub(projectId!, {
    onTaskCreated: (task) => setTasks((prev) => [task, ...prev]),
    onTaskUpdated: (task) =>
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t))),
    onTaskDeleted: (taskId) =>
      setTasks((prev) => prev.filter((t) => t.id !== taskId)),
  });

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !projectId) return;
    setAdding(true);
    try {
      await tasksApi.create(projectId, { title: newTitle.trim() });
      setNewTitle("");
      // SignalR will push the new task via onTaskCreated
    } finally {
      setAdding(false);
    }
  };

  const handleStatusChange = async (task: Task, status: Task["status"]) => {
    if (!projectId) return;
    await tasksApi.update(projectId, task.id, { status });
    // SignalR will push the update via onTaskUpdated
  };

  const handleDelete = async (task: Task) => {
    if (!projectId) return;
    await tasksApi.delete(projectId, task.id);
    // SignalR will push the deletion via onTaskDeleted
  };

  if (isLoading)
    return <div className="p-10 text-sm text-gray-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <Link to="/" className="text-sm text-indigo-600 hover:underline">
          ← Projects
        </Link>
        <span className="text-gray-300">|</span>
        <span className="text-sm font-medium text-gray-700">Kanban board</span>
      </nav>

      <main className="px-6 py-8">
        <form onSubmit={handleAddTask} className="flex gap-3 mb-8 max-w-md">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Add a task..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Button type="submit" isLoading={adding}>
            Add
          </Button>
        </form>

        <div className="grid grid-cols-3 gap-6">
          {COLUMNS.map((col) => (
            <div
              key={col}
              className="bg-white border border-gray-200 rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-4">
                <Badge value={col} />
                <span className="text-sm text-gray-400">
                  {tasks.filter((t) => t.status === col).length}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {tasks
                  .filter((t) => t.status === col)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="border border-gray-100 rounded-lg p-3 hover:border-gray-200 transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-800 mb-2">
                        {task.title}
                      </p>

                      <div className="flex items-center gap-2 mb-3">
                        <Badge value={task.priority} />
                        {task.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-1 flex-wrap">
                        {COLUMNS.filter((s) => s !== col).map((s) => (
                          <button
                            key={s}
                            onClick={() => handleStatusChange(task, s)}
                            className="text-xs text-indigo-600 hover:underline"
                          >
                            → {s}
                          </button>
                        ))}
                        <button
                          onClick={() => handleDelete(task)}
                          className="text-xs text-red-400 hover:underline ml-auto"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
