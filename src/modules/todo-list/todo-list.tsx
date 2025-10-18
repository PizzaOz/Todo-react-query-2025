// import React from "react";
import { useCreateTodo } from "./use-create-todo";
import { useDeleteTodo } from "./use-delete-todo";
import { useTodoList } from "./use-todo-list";
import { useToggleTodo } from "./use-toggle-todo";
// import { useMutation } from "@tanstack/react-query";
// import { todoListApi } from "./api";
// import { nanoid } from "nanoid";

export function TodoList() {
  const {
    error,
    todoItems,
    isLoading,
    isPlaceholderData,
    buttonPagination,
    setEnabled,
  } = useTodoList();

  const createTodo = useCreateTodo();
  const deleteTodo = useDeleteTodo();
  const { toggleTodo } = useToggleTodo();

  // const createTodoMutation = useMutation({
  //   mutationFn: todoListApi.createTodo
  // })

  //  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
  //   const formData = new FormData(e.currentTarget)

  //   const text = String(formData.get('text') ?? '')

  //   createTodoMutation.mutate({
  //     id: nanoid(),
  //     done: false,
  //     text: text,
  //     userId: '1',
  //     createdAt: new Date().toISOString(),
  //   })
  //   e.currentTarget.reset()
  //  }

  if (isLoading) {
    return <div>Loding</div>;
  }

  if (error) {
    return <div>error: {JSON.stringify(error)}</div>;
  }

  return (
    <div className="p-5 mx-auto max-w-[1200px] mt-10">
      <h1 className="text-3xl font-bold underline mb-5">Todo List</h1>
      <form className="flex gap-2 mb-5" onSubmit={createTodo.handleCreate}>
        <input
          className="rounded p-2 border border-teal-500"
          type="text"
          name="text"
        />
        <button
          disabled={createTodo.isPending}
          className="rounded p-2 border border-teal-500 disabled:opacity-50"
        >
          Создать
        </button>
      </form>
      <button onClick={() => setEnabled((e) => !e)}>enabled</button>
      <div
        className={
          "flex flex-col gap-4" + (isPlaceholderData ? " opacity-50" : "")
        }
      >
        {todoItems?.data.map((todo) => (
          <div className="border border-slate-300 rounded p-3 flex justify-between" key={todo.id}>
            <input 
            type="checkbox" 
            checked={todo.done} 
            onChange={() => toggleTodo(todo.id, todo.done)}
            />
            {todo.text}
            <button
              disabled={deleteTodo.getIsPending(todo.id)}
              className="text-rose-500 font-bold disabled:text-rose-300"
              onClick={() => deleteTodo.handleDelete(todo.id)}
            >
              Удалить
            </button>
          </div>
        ))}
      </div>
      {buttonPagination}
    </div>
  );
}
