import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { tasksApi } from "../api/tasksApi";
import { TimerWidget } from "../components/TimerWidget";
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

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  if (isLoading)
    return <div className="p-10 text-sm text-gray-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white/95 border-b border-slate-200 px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            {"<- Projects"}
          </Link>
          <span className="text-sm font-medium text-slate-700">
            Kanban board
          </span>
        </div>
        <Link
          to={`/projects/${projectId}/report`}
          className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm transition hover:bg-indigo-100"
        >
          {"View report ->"}
        </Link>
      </nav>

      <main className="px-6 py-10">
        <form
          onSubmit={handleAddTask}
          className="flex flex-col gap-3 sm:flex-row mb-8 max-w-xl"
        >
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Add a task..."
            className="flex-1 border border-slate-200 rounded-2xl bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-transparent focus:ring-2 focus:ring-slate-300"
          />
          <Button type="submit" isLoading={adding}>
            Add
          </Button>
        </form>

        <div className="grid grid-cols-3 gap-6">
          {COLUMNS.map((col) => (
            <div
              key={col}
              className="bg-white/95 border border-slate-200 rounded-3xl p-5 shadow-soft"
            >
              <div className="flex flex-col gap-3 mb-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                  <Badge value={col} />
                  <span className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    {tasks.filter((t) => t.status === col).length} tasks
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {tasks
                  .filter((t) => t.status === col)
                  .map((task) => (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className={`border rounded-2xl p-4 cursor-pointer transition-colors ${
                        selectedTask?.id === task.id
                          ? "border-indigo-300 bg-indigo-50/80"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
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

                      <div className="flex flex-wrap items-center gap-2">
                        {COLUMNS.filter((s) => s !== col).map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(task, s);
                            }}
                            className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                          >
                            {col === "Done"
                              ? `<- ${s === "InProgress" ? "In progress" : s}`
                              : col === "InProgress" && s === "Todo"
                                ? "<- Todo"
                                : `-> ${s === "InProgress" ? "In progress" : s}`}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(task);
                          }}
                          aria-label={`Delete ${task.title}`}
                          title="Delete task"
                          className="ml-auto inline-flex h-7 w-7 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-700 transition hover:bg-rose-100"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="h-4 w-4"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14M10 10v6m4-6v6"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
        {selectedTask && (
          <div className="mt-8 max-w-sm rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-soft">
            <p className="text-sm font-medium text-slate-700 mb-3">
              Selected:{" "}
              <span className="text-indigo-600">{selectedTask.title}</span>
            </p>
            <TimerWidget task={selectedTask} />
          </div>
        )}
      </main>
    </div>
  );
}
