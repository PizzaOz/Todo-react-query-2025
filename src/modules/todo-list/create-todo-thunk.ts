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

    if (!userId) {
        throw new Error('user not login')
    }
    const user = await queryClient.fetchQuery(authApi.getUserByid(userId))

    const newTodo: TodoDto = {
        id: nanoid(),
        done: false,
        text: text,
        userId,
        createdAt: new Date().toISOString(),
        login: user.login
    }

    queryClient.cancelQueries({
        queryKey: [todoListApi.baseKey]
    });

    const prevTasks = queryClient.getQueryData(todoListApi.getTodoListQueryOptions({page: 1}).queryKey,)

    queryClient.setQueryData(
        todoListApi.getTodoListQueryOptions({page: 1}).queryKey,
        (tasks: PaginatedResult<TodoDto> | undefined) => ({
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
