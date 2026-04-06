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

export interface TimeLog {
  id: string;
  taskId: string;
  taskTitle: string;
  userId: string;
  userEmail: string;
  startedAt: string;
  endedAt?: string;
  notes?: string;
  durationMinutes?: number;
  isRunning: boolean;
}

export interface TaskTimeBreakdown {
  taskId: string;
  taskTitle: string;
  status: string;
  hoursLogged: number;
}

export interface DailyActivity {
  date: string;
  tasksCompleted: number;
  hoursLogged: number;
}

export interface ProjectReport {
  projectId: string;
  projectName: string;
  totalTasks: number;
  todoCount: number;
  inProgressCount: number;
  doneCount: number;
  totalHoursLogged: number;
  taskBreakdowns: TaskTimeBreakdown[];
  dailyActivity: DailyActivity[];
}
