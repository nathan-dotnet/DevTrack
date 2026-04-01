export interface AuthResponse {
  accessToken: string;
  email: string;
  role: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  ownerId: string;
  ownerEmail: string;
  taskCount: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "Todo" | "InProgress" | "Done";
  priority: "Low" | "Medium" | "High";
  dueDate?: string;
  createdAt: string;
  projectId: string;
  assigneeId?: string;
  assigneeEmail?: string;
  tags: string[];
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface TaskQueryParams {
  status?: string;
  priority?: string;
  sortBy?: string;
  descensing?: boolean;
  page?: number;
  pageSize?: number;
}
