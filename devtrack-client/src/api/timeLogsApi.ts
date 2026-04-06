import type { TimeLog } from "../types";
import api from "./axios";

export const timeLogsApi = {
  getActive: () => api.get<TimeLog | null>("/timers/active"),

  start: (taskId: string, notes?: string) =>
    api.post<TimeLog>(`/tasks/${taskId}/timers/start`, { notes }),

  stop: (notes?: string) => api.post<TimeLog>("/timers/stop", { notes }),

  getByTask: (taskId: string) =>
    api.get<TimeLog[]>(`/tasks/${taskId}/timelogs`),

  logManual: (
    taskId: string,
    startedAt: string,
    endedAt: string,
    notes?: string,
  ) =>
    api.post<TimeLog>(`/tasks/${taskId}/timelogs`, {
      startedAt,
      endedAt,
      notes,
    }),

  delete: (id: string) => api.delete(`/timelogs/${id}`),
};
