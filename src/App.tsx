import { TodoInput } from "./components/TodoInput/TodoInput";
import { TodoList } from "./components/TodoList/TodoList";
import styles from "./App.module.scss";

export default function App() {
  return (
    <div className={styles.app}>
      <div className={styles.logo} />
      <h1>Todo List</h1>
      <TodoInput />
      <TodoList />
    </div>
  );
}
