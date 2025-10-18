import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { jsonApiInstance } from "../../shared/api/api-instance";

// const BASE_URL = "http://localhost:3000";

export type PaginatedResult<T> = {
  data: T[];
  first: number;
  items: number;
  last: number;
  next: number | null;
  pages: number;
  prev: number | null;
};

export type TodoDto = {
  id: string;
  text: string;
  done: boolean;
  userId: string;
  createdAt?: string;
};

export const todoListApi = {
  // getTodoList: (
  //   {page}: {page: number},
  //   { signal }: { signal: AbortSignal
  //   }) => {
  //   return fetch(`${BASE_URL}/tasks?_page=${page}&_per_page=10`, {
  //     signal,
  //   }).then((res) => res.json() as Promise<PaginatedResult<TodoDto>>);
  // },
  getTodoListInfinityQueryOptions: () => {
    // вынес повторяему логику из useInfiniteQuery
    return infiniteQueryOptions({
      queryKey: ["task", "list"],
      queryFn: (meta) =>
        jsonApiInstance<PaginatedResult<TodoDto>>(
          `/tasks?_page=${meta.pageParam}&_per_page=10&_sort=-createdAt`,
          { signal: meta.signal }
        ),
      initialPageParam: 1,
      getNextPageParam: (result) => result.next,
      select: (result) => result.pages.flatMap((page) => page.data),
    });
  },
  getTodoListQueryOptions: ({ page }: { page: number }) => {
    // вынес повторяему логику из useQuery
    return queryOptions({
      queryKey: ["task", "list", { page }],
      queryFn: (meta) =>
        jsonApiInstance<PaginatedResult<TodoDto>>(
          `/tasks?_page=${page}&_per_page=10&_sort=-createdAt`,
          { signal: meta.signal }
        ),
    });
  },
  createTodo: (data: TodoDto) => {
    return jsonApiInstance<TodoDto>(`/tasks`, {
      method: 'POST',
      json: data
    })
  },
  updateTodo: (data: Partial<TodoDto> & {id: string}) => {
    return jsonApiInstance<TodoDto>(`/tasks/${data.id}`, {
      method: 'PATCH',
      json: data
    })
  },
  deleteTodo: (id: string) => {
    return jsonApiInstance(`/tasks/${id}`, {
    method: 'DELETE',
  })},
};
