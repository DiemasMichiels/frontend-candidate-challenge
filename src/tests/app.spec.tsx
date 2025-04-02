import App from "../App";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useTodoStore } from "../store/todoStore";
import "@testing-library/jest-dom";

beforeEach(() => {
  const { getState, setState } = useTodoStore;
  setState({
    ...getState(),
    todos: [
      { id: "1", text: "Buy milk", done: true },
      { id: "2", text: "Buy bread", done: false },
    ],
  });
});

describe("TodoApp", () => {
  it("renders app", () => {
    const app = render(<App />);
    expect(app).not.toBeUndefined();
  });

  it("renders initial items", () => {
    render(<App />);

    const firstTodoInput = screen.getByTestId("todo-text-1");
    expect(firstTodoInput).toHaveValue("Buy milk");
    expect(screen.getByTestId("todo-checkbox-1")).toBeChecked();
    expect(firstTodoInput).toBeDisabled();

    const secondTodoInput = screen.getByTestId("todo-text-2");
    expect(secondTodoInput).toHaveValue("Buy bread");
    expect(screen.getByTestId("todo-checkbox-2")).not.toBeChecked();
    expect(secondTodoInput).not.toBeDisabled();
  });

  it("adds a new todo", async () => {
    render(<App />);

    const input = screen.getByTestId("new-todo-input");
    const addButton = screen.getByTestId("add-todo-button");

    await userEvent.type(input, "Buy eggs");
    fireEvent.click(addButton);

    const todoItems = screen.getAllByTestId(/todo-item/);
    expect(todoItems.length).toBe(3);

    const firstTodoInput = screen.getAllByTestId(/todo-text/)[0];
    expect(firstTodoInput).toHaveValue("Buy eggs");
    expect(input).toHaveValue("");
  });

  it("adds a new todo on Enter key press", async () => {
    render(<App />);

    const input = screen.getByTestId("new-todo-input");
    await userEvent.type(input, "Buy cheese{enter}");

    const newTodoInput = screen.getAllByTestId(/todo-text/)[0];
    expect(newTodoInput).toHaveValue("Buy cheese");
    expect(input).toHaveValue("");
  });

  it("toggles todo completion status", () => {
    render(<App />);

    const breadCheckbox = screen.getByTestId("todo-checkbox-2");
    const breadInput = screen.getByTestId("todo-text-2");

    expect(breadInput).not.toBeDisabled();

    fireEvent.click(breadCheckbox);
    expect(breadCheckbox).toBeChecked();
    expect(breadInput).toBeDisabled();

    fireEvent.click(breadCheckbox);
    expect(breadCheckbox).not.toBeChecked();
    expect(breadInput).not.toBeDisabled();
  });

  it("deletes a todo", () => {
    render(<App />);

    expect(screen.getAllByTestId(/todo-item/).length).toBe(2);

    const deleteButton = screen.getByTestId("delete-button-1");
    fireEvent.click(deleteButton);

    expect(screen.getAllByTestId(/todo-item/).length).toBe(1);
    expect(screen.getByTestId("todo-text-2")).toHaveValue("Buy bread");
  });

  it("edits a todo directly", async () => {
    render(<App />);

    const breadInput = screen.getByTestId("todo-text-2");

    await userEvent.clear(breadInput);
    await userEvent.type(breadInput, "Buy whole wheat bread");

    expect(breadInput).toHaveValue("Buy whole wheat bread");
  });

  it("prevents saving empty todos when editing", async () => {
    render(<App />);

    const breadInput = screen.getByTestId("todo-text-2") as HTMLInputElement;
    const originalValue = breadInput.value;

    await userEvent.clear(breadInput);
    fireEvent.blur(breadInput);
    expect(breadInput).toHaveValue(originalValue);

    await userEvent.clear(breadInput);
    await userEvent.type(breadInput, "   ");
    fireEvent.blur(breadInput);
    expect(breadInput).toHaveValue(originalValue);
  });

  it("prevents adding empty todos", async () => {
    render(<App />);

    const input = screen.getByTestId("new-todo-input");
    const addButton = screen.getByTestId("add-todo-button");

    expect(addButton).toBeDisabled();

    await userEvent.type(input, "   ");
    expect(addButton).toBeDisabled();
    expect(screen.getAllByTestId(/todo-item/).length).toBe(2);
  });

  it("cannot edit completed todos", async () => {
    render(<App />);

    const milkInput = screen.getByTestId("todo-text-1") as HTMLInputElement;
    expect(milkInput).toBeDisabled();

    const originalValue = milkInput.value;
    await userEvent.type(milkInput, "test");
    expect(milkInput).toHaveValue(originalValue);
  });
});
