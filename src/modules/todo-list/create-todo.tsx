import { useUser } from "../auth/use-user";
import { useCreateTodo } from "./use-create-todo";

export function CreateTodo() {
  const createTodo = useCreateTodo();
  const userQuery = useUser()

  return (
    <div className="p-5 mx-auto max-w-[1200px] mt-10">
      <h1 className="text-3xl font-bold underline mb-5">
        Todo List {userQuery.data?.login}
      </h1>
      <form className="flex gap-2 mb-5" onSubmit={createTodo.handleCreate}>
        <input
          className="rounded p-2 border border-teal-500"
          type="text"
          name="text"
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
