# DevTrack

DevTrack is a full-stack task and time tracking app built with an ASP.NET Core 8 Web API backend and a React + Vite frontend. It supports JWT authentication, refresh tokens, project and task management, time logging, project-level reporting, and real-time task updates with SignalR.

![DevTrack Kanban Board](https://placehold.co/1200x600/6366f1/ffffff?text=DevTrack+Kanban+Board)

---

## Tech Stack

| Layer     | Technology                                              |
| --------- | ------------------------------------------------------- |
| Frontend  | React 18 + Vite + TypeScript + Tailwind CSS             |
| Backend   | ASP.NET Core 8 Web API                                  |
| Database  | SQL Server + Entity Framework Core 8                    |
| Real-time | SignalR                                                 |
| Auth      | JWT (access tokens) + Refresh tokens (HttpOnly cookies) |
| Charts    | Recharts                                                |

---

## Features

### Authentication & Security

- Register and login with email + password (BCrypt hashed)
- Short-lived JWT access tokens (15 min) with automatic silent refresh
- Refresh tokens stored in `HttpOnly` cookies — never exposed to JavaScript
- Token rotation on every refresh — old tokens are invalidated
- Role-based authorization (`Admin` / `Member`)

### Projects

- Create and manage projects scoped to the authenticated user.
- Owner-only access enforcement at the service layer.

### Tasks

- Full CRUD with status (`Todo`, `InProgress`, `Done`) and priority (`Low`, `Medium`, `High`)
- Filter by status, priority, and assignee
- Sort by created date, due date, or priority
- Paginated responses with total count and page metadata
- Many-to-many tag system with automatic tag deduplication

### Real-time Updates (SignalR)

- Join a project's live group on page load
- Task create, update, and delete events broadcast instantly to all connected clients
- JWT authentication over WebSocket connections via query string
- Automatic reconnect on disconnect

### Time Logging

- Start / stop a live timer on any task
- Only one active timer per user — starting a new one auto-stops the previous
- Manual time entry with start and end timestamps
- Per-task time history with delete support
- Live elapsed counter in the React timer widget

### Reports & Analytics

- Completion rate, total hours logged, and task status counts
- Donut chart: task status breakdown
- Bar chart: hours logged per day over the last 14 days
- Time-per-task table sorted by hours logged

---

## Architecture

```
DevTrack.API/
├── Controllers/        # HTTP layer — routing, request/response mapping
├── Services/           # Business logic
│   └── Interfaces/     # Contracts decoupling layers
├── Repositories/       # Data access via EF Core
│   └── Interfaces/
├── Models/             # EF Core entities
├── DTOs/               # Request and response shapes
├── Data/               # AppDbContext, migrations
└── Hubs/               # SignalR hub
```

The app follows a strict **Controller → Service → Repository** layering. Controllers never touch the DbContext directly. Services depend on repository interfaces, not concrete implementations — making the data layer swappable.

---

## Database Schema

```
Users          Projects        TaskItems
─────────      ────────────    ──────────────
Id (PK)        Id (PK)         Id (PK)
Email          Name            Title
PasswordHash   Description     Description
Role           OwnerId (FK)    Status
RefreshToken   CreatedAt       Priority
                               DueDate
TimeLogs                       ProjectId (FK)
─────────      Tags            AssigneeId (FK)
Id (PK)        ────────
TaskId (FK)    Id (PK)         TagTaskItem (join)
UserId (FK)    Name            ──────────────────
StartedAt                      TaskId (FK)
EndedAt                        TagId (FK)
Notes
```

---

## Main Domain Models

- `User`: login identity, role, refresh token metadata
- `Project`: user-owned work container
- `TaskItem`: task details, status, priority, assignee, due date
- `TimeLog`: running or completed time entries for tasks
- `Tag`: many-to-many task labels

## Getting Started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/) (or SQL Server Express / LocalDB)

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/devtrack.git
cd devtrack
```

### 2. Configure the API

Copy the example config and fill in your values:

```bash
cp DevTrack.API/appsettings.json DevTrack.API/appsettings.Development.json
```

Edit `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=DevTrackDb;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "JwtSettings": {
    "Secret": "your-super-secret-key-at-least-32-characters-long",
    "AccessTokenExpiryMinutes": 15,
    "RefreshTokenExpiryDays": 7,
    "Issuer": "DevTrack",
    "Audience": "DevTrackUsers"
  }
}
```

### 3. Run database migrations

```bash
cd DevTrack.API
dotnet ef database update
```

### 4. Start the API

```bash
dotnet run
```

API runs at `https://localhost:5001`. Swagger UI available at `https://localhost:5001/swagger`.

### 5. Start the frontend

```bash
cd devtrack-client
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

---

## API Reference

### Auth

| Method | Endpoint             | Description                                  |
| ------ | -------------------- | -------------------------------------------- |
| `POST` | `/api/auth/register` | Create a new account                         |
| `POST` | `/api/auth/login`    | Login, receive access token + refresh cookie |
| `POST` | `/api/auth/refresh`  | Silently refresh access token via cookie     |
| `POST` | `/api/auth/revoke`   | Logout — invalidate refresh token            |

### Projects

| Method   | Endpoint             | Description                             |
| -------- | -------------------- | --------------------------------------- |
| `GET`    | `/api/projects`      | List all projects owned by current user |
| `POST`   | `/api/projects`      | Create a project                        |
| `GET`    | `/api/projects/{id}` | Get a project by ID                     |
| `PATCH`  | `/api/projects/{id}` | Update a project                        |
| `DELETE` | `/api/projects/{id}` | Delete a project                        |

### Tasks

| Method   | Endpoint                               | Description                                  |
| -------- | -------------------------------------- | -------------------------------------------- |
| `GET`    | `/api/projects/{projectId}/tasks`      | List tasks (filterable, sortable, paginated) |
| `POST`   | `/api/projects/{projectId}/tasks`      | Create a task                                |
| `GET`    | `/api/projects/{projectId}/tasks/{id}` | Get a task                                   |
| `PATCH`  | `/api/projects/{projectId}/tasks/{id}` | Update a task                                |
| `DELETE` | `/api/projects/{projectId}/tasks/{id}` | Delete a task                                |

**Query params for GET tasks:** `status`, `priority`, `assigneeId`, `sortBy`, `descending`, `page`, `pageSize`

### Time Logging

| Method   | Endpoint                           | Description                         |
| -------- | ---------------------------------- | ----------------------------------- |
| `GET`    | `/api/timers/active`               | Get the current user's active timer |
| `POST`   | `/api/tasks/{taskId}/timers/start` | Start a timer on a task             |
| `POST`   | `/api/timers/stop`                 | Stop the active timer               |
| `GET`    | `/api/tasks/{taskId}/timelogs`     | Get all time logs for a task        |
| `POST`   | `/api/tasks/{taskId}/timelogs`     | Add a manual time entry             |
| `DELETE` | `/api/timelogs/{id}`               | Delete a time log                   |

### Reports

| Method | Endpoint                           | Description                         |
| ------ | ---------------------------------- | ----------------------------------- |
| `GET`  | `/api/projects/{projectId}/report` | Full analytics report for a project |

### SignalR Hub

Connect to `/hubs/tasks?access_token=<jwt>` and invoke:

| Method                    | Description                           |
| ------------------------- | ------------------------------------- |
| `JoinProject(projectId)`  | Subscribe to a project's live updates |
| `LeaveProject(projectId)` | Unsubscribe                           |

Listen for events: `TaskCreated`, `TaskUpdated`, `TaskDeleted`

---

## Key Design Decisions

**Why HttpOnly cookies for refresh tokens?**
Storing tokens in `localStorage` exposes them to XSS attacks. An `HttpOnly` cookie is inaccessible to JavaScript entirely — even if a script is injected, it can't read the token.

**Why short-lived access tokens?**
15-minute access tokens limit the window of exposure if a token is intercepted. The silent refresh via cookie makes this invisible to the user.

**Why the Repository pattern over direct EF Core in services?**
It keeps business logic unit-testable without a real database. Services depend on `ITaskRepository`, not `AppDbContext` — you can swap in an in-memory fake for tests.

**Why SignalR groups instead of broadcasting to all?**
Broadcasting every task event to every connected client is wasteful and a security concern. Groups scope each event to only the users currently viewing that project.

---
