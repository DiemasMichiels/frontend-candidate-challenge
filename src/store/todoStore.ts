import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Todo = {
  id: string;
  text: string;
  done: boolean;
};

type TodoState = {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  editTodo: (id: string, text: string) => void;
};

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      todos: [
        { id: "1", text: "Buy milk", done: true },
        { id: "2", text: "Buy bread", done: false },
      ],

      addTodo: (text: string) => {
        if (!text.trim()) return;

        set((state) => ({
          todos: [
            {
              id: Date.now().toString(),
              text,
              done: false,
            },
            ...state.todos,
          ],
        }));
      },

      toggleTodo: (id: string) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, done: !todo.done } : todo
          ),
        })),

      deleteTodo: (id: string) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),

      editTodo: (id: string, text: string) => {
        if (!text.trim()) return;

        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, text } : todo
          ),
        }));
      },
    }),
    {
      name: "todo-storage",
      partialize: (state) => ({ todos: state.todos }),
    }
  )
);
