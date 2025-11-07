import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PaginatedResult, TodoDto, todoListApi } from "./api";

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  const deleteTodoMutation = useMutation({
    mutationFn: todoListApi.deleteTodo,
    onSuccess: (_, deleteId) => {
      queryClient.setQueriesData(
        { queryKey: [todoListApi.baseKey] },
        (old: PaginatedResult<TodoDto> | undefined) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter(item => item.id !== deleteId)
          };
        }
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [todoListApi.baseKey] });
    }
  });

  return {
    handleDelete: deleteTodoMutation.mutate,
    getIsPending: (id: string) => 
      deleteTodoMutation.isPending && deleteTodoMutation.variables === id
  };
}
