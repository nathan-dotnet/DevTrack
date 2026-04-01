import * as signalR from "@microsoft/signalr";
import { useEffect, useRef } from "react";
import type { Task } from "../types";

interface TaskHubCallbacks {
  onTaskCreated?: (task: Task) => void;
  onTaskUpdated?: (task: Task) => void;
  onTaskDeleted?: (taskId: string) => void;
}

export function useTaskHub(projectId: string, callbacks: TaskHubCallbacks) {
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token || !projectId) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:5263/hubs/tasks?access_token=${token}`)
      .withAutomaticReconnect()
      .build();

    connection.on("TaskCreated", (task: Task) =>
      callbacks.onTaskCreated?.(task),
    );
    connection.on("TaskUpdated", (task: Task) =>
      callbacks.onTaskUpdated?.(task),
    );
    connection.on("TaskDeleted", (taskId: string) =>
      callbacks.onTaskDeleted?.(taskId),
    );

    connection
      .start()
      .then(() => connection.invoke("JoinProject", projectId))
      .catch(console.error);

    connectionRef.current = connection;

    return () => {
      connection.invoke("LeaveProject", projectId).catch(() => {});
      connection.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);
}
