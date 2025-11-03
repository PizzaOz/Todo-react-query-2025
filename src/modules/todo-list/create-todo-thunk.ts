import { MutationObserver, useMutation } from "@tanstack/react-query";
import { AppThunk } from "../../shared/redux";
import { queryClient } from "../../shared/api/query-client";
import { PaginatedResult, TodoDto, todoListApi } from "./api";
import { nanoid } from "nanoid";
import { authSlice } from "../auth/auth-slice";
import { authApi } from "../auth/api";

export const createTodoThunc =
  (text: string): AppThunk =>
  async (_, getState) => {

    const userId = authSlice.selectors.userId(getState());
    const formatCreatedAt = (date: Date) => {
        return new Intl.DateTimeFormat('ru-RU', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }).format(date);
      };

    if (!userId) {
        throw new Error('user not login')
    }
    const user = await queryClient.fetchQuery(authApi.getUserByid(userId))

    const newTodo: TodoDto = {
        id: nanoid(),
        done: false,
        text: `${text} (Owner: ${user.login}, Created: ${formatCreatedAt(new Date())})`,
        userId,
        createdAt: new Date().toISOString(),
    }

    queryClient.cancelQueries({
        queryKey: [todoListApi.baseKey]
    });

    const prevTasks = queryClient.getQueryData(todoListApi.getTodoListQueryOptions({page: 1}).queryKey,)

    queryClient.setQueryData(
        todoListApi.getTodoListQueryOptions({page: 1}).queryKey,
        (tasks: PaginatedResult<TodoDto> | undefined) => ({
            // Если tasks undefined, создаем базовую структуру
            ...(tasks || {
                first: 1,
                last: 1,
                pages: 1,
                next: null,
                prev: null,
            }),
            data: [newTodo, ...(tasks?.data ?? [])],
            items: (tasks?.items ?? 0) + 1,
        })
    );
    try {
        await new MutationObserver(queryClient, {
            mutationFn: todoListApi.createTodo,
          }).mutate(newTodo)
    } catch(e) {
        queryClient.setQueryData(todoListApi.getTodoListQueryOptions({page: 1}).queryKey, prevTasks)
    } finally {
        queryClient.invalidateQueries({
            queryKey: [todoListApi.baseKey]
        })
    }
  };

export const useCreateLoding = () =>
  useMutation({
    mutationKey: ["create-todo"],
  }).isPending;
