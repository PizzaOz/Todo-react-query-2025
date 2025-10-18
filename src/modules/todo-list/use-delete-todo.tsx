import { useMutation, useQueryClient } from "@tanstack/react-query";
import { todoListApi } from "./api";

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  const deleteTodoMutation = useMutation({
    mutationFn: todoListApi.deleteTodo,
    async onSettled() {
      queryClient.invalidateQueries(todoListApi.getTodoListQueryOptions({ page: 1 }));
    },
    async onSuccess(_, deleteId) {
        const todos = queryClient.getQueryData(
            todoListApi.getTodoListQueryOptions({ page: 1 }).queryKey)
    if(todos) {
        queryClient.setQueryData(
            todoListApi.getTodoListQueryOptions({ page: 1 }).queryKey,
            {
                ...todos,
                data: todos.data.filter(item => item.id !== deleteId)
            }
        )
    }
    }
  });
  deleteTodoMutation.variables
  return {
    handleDelete: deleteTodoMutation.mutate,
    getIsPending: (id: string) => 
      deleteTodoMutation.isPending && deleteTodoMutation.variables === id
  };
}
