export interface Task {
  id: number;
  title: string;
  description?: string; // Optional
  status: "pending" | "completed";
  owner_id: number;
}

export interface CreateTask {
  title: string;
  description?: string;
}

export interface UpdateTask {
  title?: string;
  description?: string;
  status?: "pending" | "completed";
}

export type TaskStatus = "pending" | "completed";