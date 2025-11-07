import { CreateTodoForm } from "./create-todo-form";
import { TodoItem } from "./todo-item";
import { useDeleteTodo } from "./use-delete-todo";
import { useTodoList } from "./use-todo-list";
import { useToggleTodo } from "./use-toggle-todo";

export function TodoList() {
  const {
    error,
    todoItems,
    isLoading,
    isPlaceholderData,
    buttonPagination,
  } = useTodoList();

  const deleteTodo = useDeleteTodo();
  const { toggleTodo } = useToggleTodo();

  if (isLoading) return <div>Loading</div>;
  if (error) return <div>error: {JSON.stringify(error)}</div>;

  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-[80vh] gap-4">
      <div>
        <CreateTodoForm />
      </div>
      <div className={"flex flex-col gap-4" + (isPlaceholderData ? " opacity-50" : "")}>
        {todoItems?.data.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo.handleDelete}
            isDeleting={deleteTodo.getIsPending(todo.id)}
          />
        ))}
        {todoItems?.data.length === 0 && (
          <div className="text-center text-slate-500 py-8 h-full flex items-center justify-center">
            У вас пока нет задач
          </div>
        )}
      </div>
      <div className="pt-4">
        {buttonPagination}
      </div>
    </div>
  );
}
