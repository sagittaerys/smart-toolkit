import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task, createTask } from "../lib/tasks";

type TaskStore = {
  tasks: Task[];
  addTask: (title: string, note?: string) => void;
  editTask: (id: string, title: string, note?: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
};

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: (title, note) =>
        set((s) => ({ tasks: [createTask(title, note), ...s.tasks] })),
      editTask: (id, title, note) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, title, note } : t)),
        })),
      toggleTask: (id) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
        })),
      deleteTask: (id) =>
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
    }),
    {
      name: "tasks-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);