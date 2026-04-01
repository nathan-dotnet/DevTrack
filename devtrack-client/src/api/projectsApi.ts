import type { Project } from "../types";
import api from "./axios";

export const projectsApi = {
  getAll: () => api.get<Project[]>("/projects"),

  getById: (id: string) => api.get<Project>(`/project/${id}`),

  create: (name: string, description?: string) =>
    api.post<Project>("/projects", { name, description }),

  update: (id: string, data: Partial<Pick<Project, "name" | "description">>) =>
    api.patch<Project>(`/projects/${id}`, data),

  delete: (id: string) => api.delete(`/projects/${id}`),
};
