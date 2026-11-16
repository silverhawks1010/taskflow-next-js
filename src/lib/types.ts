export type Status = "todo" | "in-doing" | "done";
export type Priority = 1 | 2 | 3;

export type Task = {
  id: string | number;
  projectId: string | number;
  title: string;
  status: Status;
  priority: Priority;
  dueDate?: string;
};

export type Project = {
  id: string | number;
  name: string;
  description: string;
};

export type ProjectWithTasks = Project & {
  tasks: Task[];
};

export type Database = {
  projects: Project[];
  tasks: Task[];
};

export const STATUS_LABEL: Record<Status, string> = {
  todo: "À faire",
  "in-doing": "En cours",
  done: "Terminé",
};

export const nextStatus = (status: Status): Status =>
  status === "todo" ? "in-doing" : status === "in-doing" ? "done" : "todo";
