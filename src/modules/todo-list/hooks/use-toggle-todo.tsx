import { useMutation, useQueryClient } from "@tanstack/react-query";
import { todoListApi } from "../api";

export function useToggleTodo() {
  const queryClient = useQueryClient();

  const updateTodoMutation = useMutation({
    mutationFn: todoListApi.updateTodo,

    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({ queryKey: [todoListApi.baseKey] });

      const previousQueries = queryClient.getQueriesData({
        queryKey: [todoListApi.baseKey],
      });

      queryClient.setQueriesData(
        { queryKey: [todoListApi.baseKey] },
        (old: any) => {
          if (!old || !old.data) return old;

          const todoIndex = old.data.findIndex(
            (todo: any) => todo.id === newTodo.id
          );
          if (todoIndex === -1) return old;

          return {
            ...old,
            data: old.data.map((todo: any) =>
              todo.id === newTodo.id ? { ...todo, ...newTodo } : todo
            ),
          };
        }
      );

      return { previousQueries };
    },

    onError: (_, __, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [todoListApi.baseKey] });
    },
  });

  const toggleTodo = (id: string, done: boolean) => {
    updateTodoMutation.mutate({
      id,
      done: !done,
    });
  };

  return {
    toggleTodo,
    isPending: updateTodoMutation.isPending,
  };
}
