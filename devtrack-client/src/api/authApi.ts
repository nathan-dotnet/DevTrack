import type { AuthResponse } from "../types";
import api from "./axios";

export const authApi = {
  register: (email: string, password: string) =>
    api.post<AuthResponse>("/auth/register", { email, password }),

  login: (email: string, password: string) =>
    api.post<AuthResponse>("/auth/login", { email, password }),

  refresh: () => api.post<AuthResponse>("/auth/refresh"),

  revoke: () => api.post("/auth/revoke"),
};
