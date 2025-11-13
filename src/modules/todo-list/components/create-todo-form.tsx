import { useCreateTodo } from "../hooks/use-create-todo";

export function CreateTodoForm() {
  const createTodo = useCreateTodo();

  return (
    <div>
      <form className="flex gap-2 mb-5" onSubmit={createTodo.handleCreate}>
        <input
          className="rounded p-2 border border-teal-500"
          type="text"
          name="text"
          placeholder="Введите задачу..."
        />
        <button
          disabled={createTodo.isLoding}
          className="rounded p-2 border border-teal-500 disabled:opacity-50"
        >
          Создать
        </button>
      </form>
    </div>
  );
}
