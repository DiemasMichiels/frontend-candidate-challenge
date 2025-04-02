import { useState, useEffect } from "react";
import { Todo, useTodoStore } from "../../store/todoStore";
import styles from "./TodoItem.module.scss";

type TodoItemProps = {
  todo: Todo;
};

export const TodoItem = ({ todo }: TodoItemProps) => {
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);
  const editTodo = useTodoStore((state) => state.editTodo);

  const [inputValue, setInputValue] = useState(todo.text);

  useEffect(() => {
    setInputValue(todo.text);
  }, [todo.text]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (newValue.trim()) {
      editTodo(todo.id, newValue);
    }
  };

  const handleBlur = () => {
    if (!inputValue.trim()) {
      setInputValue(todo.text);
    }
  };

  return (
    <li className={styles.item} data-testid={`todo-item-${todo.id}`}>
      <div className={styles.content}>
        <input
          type="checkbox"
          checked={todo.done}
          onChange={() => toggleTodo(todo.id)}
          data-testid={`todo-checkbox-${todo.id}`}
        />
        <input
          type="text"
          value={inputValue}
          disabled={todo.done}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`${styles.text} ${todo.done ? styles.done : ""}`}
          data-testid={`todo-text-${todo.id}`}
        />
      </div>
      <button
        onClick={() => deleteTodo(todo.id)}
        className={styles.deleteButton}
        data-testid={`delete-button-${todo.id}`}
      >
        Delete
      </button>
    </li>
  );
};
