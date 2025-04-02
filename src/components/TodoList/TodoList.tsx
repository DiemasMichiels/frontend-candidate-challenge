import { useTodoStore } from "../../store/todoStore";
import { TodoItem } from "../TodoItem/TodoItem";
import styles from "./TodoList.module.scss";

export const TodoList = () => {
  const todos = useTodoStore((state) => state.todos);

  return (
    <ul className={styles.list} data-testid="todo-list">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
};
