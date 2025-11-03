import { useMutation, useQueryClient } from "@tanstack/react-query";
import { todoListApi } from "./api";

export function useToggleTodo() {
  const queryClient = useQueryClient();

  const updateTodoMutation = useMutation({
    mutationFn: todoListApi.updateTodo,

    onMutate: async (newTodo) => {
      // Отменяем все запросы связанные со списком задач
      await queryClient.cancelQueries({ queryKey: [todoListApi.baseKey] });

      // Сохраняем предыдущее состояние ВСЕХ страниц
      const previousQueries = queryClient.getQueriesData({ 
        queryKey: [todoListApi.baseKey] 
      });

      // Обновляем ВСЕ страницы, где есть этот todo
      queryClient.setQueriesData(
        { queryKey: [todoListApi.baseKey] },
        (old: any) => {
          if (!old || !old.data) return old;
          
          // Проверяем, есть ли обновляемый todo на этой странице
          const todoIndex = old.data.findIndex((todo: any) => todo.id === newTodo.id);
          if (todoIndex === -1) return old; // Не на этой странице

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
      // Восстанавливаем ВСЕ предыдущие состояния
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    onSettled: () => {
      // Инвалидируем ВСЕ запросы списка задач
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
    isPending: updateTodoMutation.isPending
  };
}
