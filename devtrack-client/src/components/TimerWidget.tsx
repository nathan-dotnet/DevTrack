import { useEffect, useState } from "react";
import { timeLogsApi } from "../api/timeLogsApi";
import type { Task, TimeLog } from "../types";
import { Button } from "./ui/button";

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${h}:${m}:${s}`;
}

interface Props {
  task: Task;
}

export function TimerWidget({ task }: Props) {
  const [activeLog, setActiveLog] = useState<TimeLog | null>(null);
  const [logs, setLogs] = useState<TimeLog[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isBusy, setIsBusy] = useState(false);

  // Load existing logs and check for an active timer on this task
  useEffect(() => {
    Promise.all([timeLogsApi.getActive(), timeLogsApi.getByTask(task.id)])
      .then(([activeRes, logsRes]) => {
        const active = activeRes.data;
        if (active && active.taskId === task.id) {
          setActiveLog(active);
          setElapsed(
            Math.floor(
              (Date.now() - new Date(active.startedAt).getTime()) / 1000,
            ),
          );
        }
        setLogs(logsRes.data);
      })
      .finally(() => setIsLoading(false));
  }, [task.id]);

  // Tick every second when timer is running
  useEffect(() => {
    if (!activeLog) return;
    const interval = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [activeLog]);

  const handleStart = async () => {
    setIsBusy(true);
    try {
      const { data } = await timeLogsApi.start(task.id);
      setActiveLog(data);
      setElapsed(0);
    } finally {
      setIsBusy(false);
    }
  };

  const handleStop = async () => {
    setIsBusy(true);
    try {
      const { data } = await timeLogsApi.stop();
      setActiveLog(null);
      setElapsed(0);
      setLogs((prev) => [data, ...prev]);
    } finally {
      setIsBusy(false);
    }
  };

  const handleDelete = async (logId: string) => {
    await timeLogsApi.delete(logId);
    setLogs((prev) => prev.filter((l) => l.id !== logId));
  };

  if (isLoading)
    return <div className="text-sm text-gray-400">Loading timer...</div>;

  const totalMinutes = logs.reduce(
    (sum, l) => sum + (l.durationMinutes ?? 0),
    0,
  );
  const totalHours = (totalMinutes / 60).toFixed(1);

  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-700">Time tracker</h3>
        <span className="text-xs text-gray-400">
          {totalHours}h total logged
        </span>
      </div>

      {/* Timer display */}
      <div className="flex items-center gap-4 mb-5">
        <span
          className={`text-3xl font-mono font-semibold tabular-nums ${activeLog ? "text-indigo-600" : "text-gray-300"}`}
        >
          {formatDuration(elapsed)}
        </span>
        {activeLog ? (
          <Button variant="danger" onClick={handleStop} isLoading={isBusy}>
            Stop
          </Button>
        ) : (
          <Button onClick={handleStart} isLoading={isBusy}>
            Start
          </Button>
        )}
      </div>

      {activeLog && (
        <p className="text-xs text-indigo-500 mb-4">
          Timer started at {new Date(activeLog.startedAt).toLocaleTimeString()}
        </p>
      )}

      {/* Past logs */}
      {logs.length > 0 && (
        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs font-medium text-gray-500 mb-2">Past entries</p>
          <div className="flex flex-col gap-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between text-xs text-gray-600"
              >
                <span>
                  {new Date(log.startedAt).toLocaleDateString()} —{" "}
                  <span className="font-medium">
                    {log.durationMinutes
                      ? `${log.durationMinutes.toFixed(0)} min`
                      : "running"}
                  </span>
                </span>
                <button
                  onClick={() => handleDelete(log.id)}
                  className="text-red-400 hover:underline ml-4"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
