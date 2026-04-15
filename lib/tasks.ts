
export type Task = {
  id: string;
  title: string;
  note?: string;
  completed: boolean;
  createdAt: number;
};

export type FilterType = "all" | "active" | "done";

export function createTask(title: string, note?: string): Task {
  return {
    id: Math.random().toString(36).slice(2),
    title,
    note,
    completed: false,
    createdAt: Date.now(),
  };
}

export function filterTasks(tasks: Task[], filter: FilterType): Task[] {
  if (filter === "active") return tasks.filter((t) => !t.completed);
  if (filter === "done") return tasks.filter((t) => t.completed);
  return tasks;
}