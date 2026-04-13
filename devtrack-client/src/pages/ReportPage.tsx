import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { reportsApi } from "../api/reportsApi";
import { StatCard } from "../components/ui/statcard";
import type { ProjectReport } from "../types";

const STATUS_COLORS: Record<string, string> = {
  Todo: "#e5e7eb",
  InProgress: "#818cf8",
  Done: "#34d399",
};

const PIE_COLORS = ["#e5e7eb", "#818cf8", "#34d399"];

export function ReportPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [report, setReport] = useState<ProjectReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!projectId) return;
    reportsApi
      .getProjectReport(projectId)
      .then(({ data }) => setReport(data))
      .catch(() => setError("Could not load report."))
      .finally(() => setIsLoading(false));
  }, [projectId]);

  if (isLoading)
    return <div className="p-10 text-sm text-gray-400">Loading report...</div>;
  if (error) return <div className="p-10 text-sm text-red-400">{error}</div>;
  if (!report) return null;

  const pieData = [
    { name: "Todo", value: report.todoCount },
    { name: "In Progress", value: report.inProgressCount },
    { name: "Done", value: report.doneCount },
  ];

  const completionRate =
    report.totalTasks > 0
      ? Math.round((report.doneCount / report.totalTasks) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white/95 border-b border-slate-200 px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to={`/projects/${projectId}`}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
        >
          ← Back to board
        </Link>
        <span className="text-sm font-medium text-slate-700">
          {report.projectName} — Report
        </span>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard label="Total tasks" value={report.totalTasks} />
          <StatCard
            label="Completion rate"
            value={`${completionRate}%`}
            color="text-indigo-600"
          />
          <StatCard
            label="Hours logged"
            value={`${report.totalHoursLogged}h`}
            color="text-emerald-600"
          />
          <StatCard
            label="In progress"
            value={report.inProgressCount}
            color="text-violet-600"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Task status breakdown — Pie */}
          <div className="bg-white/95 border border-slate-200 rounded-3xl p-5 shadow-soft">
            <h2 className="text-sm font-medium text-slate-700 mb-4">
              Task status breakdown
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Legend iconType="circle" iconSize={8} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Daily hours logged — Bar */}
          <div className="bg-white/95 border border-slate-200 rounded-3xl p-5 shadow-soft">
            <h2 className="text-sm font-medium text-slate-700 mb-4">
              Hours logged (last 14 days)
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={report.dailyActivity} barSize={14}>
                <XAxis
                  dataKey="date"
                  tickFormatter={(d) => d.slice(5)}
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                />
                <Tooltip
                  formatter={(value) => {
                    if (typeof value !== "number") return ["0h", "Hours"];
                    return [`${value.toFixed(1)}h`, "Hours"];
                  }}
                  labelFormatter={(l) => `Date: ${l}`}
                />
                <Bar
                  dataKey="hoursLogged"
                  fill="#818cf8"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Time per task table */}
        <div className="bg-white/95 border border-slate-200 rounded-3xl p-5 shadow-soft">
          <h2 className="text-sm font-medium text-slate-700 mb-4">
            Time logged per task
          </h2>
          {report.taskBreakdowns.length === 0 ? (
            <p className="text-sm text-gray-400">No time logged yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-slate-400 border-b border-slate-100">
                    <th className="text-left py-2 pr-4 font-medium">Task</th>
                    <th className="text-left py-2 pr-4 font-medium">Status</th>
                    <th className="text-right py-2 font-medium">
                      Hours logged
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {report.taskBreakdowns.map((t) => (
                    <tr
                      key={t.taskId}
                      className="border-b border-gray-50 hover:bg-gray-50"
                    >
                      <td className="py-2 pr-4 text-slate-800">
                        {t.taskTitle}
                      </td>
                      <td className="py-2 pr-4">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{
                            background: STATUS_COLORS[t.status] + "33",
                            color: STATUS_COLORS[t.status],
                          }}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="py-2 text-right font-mono text-slate-700">
                        {t.hoursLogged.toFixed(2)}h
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
