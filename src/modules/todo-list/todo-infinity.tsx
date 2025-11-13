import { CreateTodoForm } from "./create-todo-form";
import { useTodoListInfinity } from "./use-todo-list-infinity";
import { useDeleteTodo } from "./use-delete-todo";
import { useToggleTodo } from "./use-toggle-todo";
import { TodoItem } from "./todo-item";

export function TodoListInfinity() {
  const { error, todoItems, isLoading, cursor, isPlaceholderData } =
    useTodoListInfinity();

  const deleteTodo = useDeleteTodo();
  const { toggleTodo } = useToggleTodo();

  if (isLoading) return <div>Loading</div>;
  if (error) return <div>error: {JSON.stringify(error)}</div>;

  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-[80vh] gap-4">
      <div>
        <CreateTodoForm />
      </div>
      <div
        className={
          "flex flex-col gap-4" + (isPlaceholderData ? " opacity-50" : "")
        }
      >
        {todoItems?.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo.handleDelete}
            isDeleting={deleteTodo.getIsPending(todo.id)}
          />
        ))}
      </div>
      {cursor}
    </div>
  );
}
