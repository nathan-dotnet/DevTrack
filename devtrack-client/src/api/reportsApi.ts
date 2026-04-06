import type { ProjectReport } from "../types";
import api from "./axios";

export const reportsApi = {
  getProjectReport: (projectId: string) =>
    api.get<ProjectReport>(`/projects/${projectId}/report`),
};
