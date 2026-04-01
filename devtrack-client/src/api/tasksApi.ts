import type { PagedResult, Task, TaskQueryParams } from "../types";
import api from "./axios";

export const tasksApi = {
  getAll: (projectId: string, params?: TaskQueryParams) =>
    api.get<PagedResult<Task>>(`/projects/${projectId}/tasks`, { params }),

  getById: (projectId: string, taskId: string) =>
    api.get<Task>(`/projects/${projectId}/tasks/${taskId}`),

  create: (projectId: string, data: Partial<Task> & { title: string }) =>
    api.post<Task>(`/projects/${projectId}/tasks`, data),

  update: (projectId: string, taskId: string, data: Partial<Task>) =>
    api.patch<Task>(`/projects/${projectId}/tasks/${taskId}`, data),

  delete: (projectId: string, taskId: string) =>
    api.delete(`/projects/${projectId}/tasks/${taskId}`),
};
