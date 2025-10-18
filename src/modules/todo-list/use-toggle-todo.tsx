import { useMutation, useQueryClient } from "@tanstack/react-query";
import { todoListApi } from "./api";

export function useToggleTodo() {
  const queryClient = useQueryClient();

  const updateTodoMutation = useMutation({
    mutationFn: todoListApi.updateTodo,

    onMutate: async (newTodo) => {
      await queryClient.cancelQueries(
        todoListApi.getTodoListQueryOptions({ page: 1 })
      );

      const previousTodos = queryClient.getQueryData(
        todoListApi.getTodoListQueryOptions({ page: 1 }).queryKey
      );

      queryClient.setQueryData(
        todoListApi.getTodoListQueryOptions({ page: 1 }).queryKey,
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((todo) =>
              todo.id === newTodo.id ? { ...todo, ...newTodo } : todo
            ),
          };
        }
      );

      return { previousTodos };
    },

    onError: (_, __, context) => {
        if (context?.previousTodos) {
          queryClient.setQueryData(
            todoListApi.getTodoListQueryOptions({ page: 1 }).queryKey,
            context.previousTodos
          );
        }
      },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: todoListApi.getTodoListQueryOptions({ page: 1 }).queryKey,
      });
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
  };
}
