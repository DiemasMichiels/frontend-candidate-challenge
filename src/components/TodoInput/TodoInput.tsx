import { useState } from "react";
import { useTodoStore } from "../../store/todoStore";
import styles from "./TodoInput.module.scss";

export const TodoInput = () => {
  const [text, setText] = useState("");
  const addTodo = useTodoStore((state) => state.addTodo);

  const handleAddTodo = () => {
    if (text.trim()) {
      addTodo(text);
      setText("");
    }
  };

  return (
    <form action={handleAddTodo} className={styles.container}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new todo"
        data-testid="new-todo-input"
        className={styles.input}
      />
      <button
        type="submit"
        disabled={!text.trim()}
        data-testid="add-todo-button"
        className={styles.button}
      >
        Add
      </button>
    </form>
  );
};
