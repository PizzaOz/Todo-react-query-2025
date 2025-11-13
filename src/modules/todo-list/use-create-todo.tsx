
import { useAppDispath } from "../../shared/redux";
import { createTodoThunc, useCreateLoding } from "./create-todo-thunk";

export function useCreateTodo() {
  const appDispatch = useAppDispath()

  const isLoding = useCreateLoding()



  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault()

    const formData = new FormData(e.currentTarget);

    const text = String(formData.get("text") ?? "");

    if (!text) {
      return;
    }
    appDispatch(createTodoThunc(text))

    e.currentTarget.reset();
  };

  return {
    handleCreate,
    isLoding
  }
}
