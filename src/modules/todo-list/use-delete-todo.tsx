import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PaginatedResult, TodoDto, todoListApi } from "./api";

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  const deleteTodoMutation = useMutation({
    mutationFn: todoListApi.deleteTodo,
    onSuccess: (_, deleteId) => {
      // Обновляем ВСЕ страницы, где есть этот todo
      queryClient.setQueriesData(
        { queryKey: ["task", "list"] },
        (old: PaginatedResult<TodoDto> | undefined) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter(item => item.id !== deleteId)
          };
        }
      );
    },
  });

  return {
    handleDelete: deleteTodoMutation.mutate,
    getIsPending: (id: string) => 
      deleteTodoMutation.isPending && deleteTodoMutation.variables === id
  };
}
