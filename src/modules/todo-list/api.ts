import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { supabase } from "../../shared/api/supabase-client";

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
  login?: string;
};

export const todoListApi = {
  baseKey: "tasks",

  getTodoListInfinityQueryOptions: () => {
    return infiniteQueryOptions({
      queryKey: [todoListApi.baseKey, "list"],
      queryFn: async (meta) => {
        const page = meta.pageParam;
        const perPage = 10;
        const from = (page - 1) * perPage;
        const to = from + perPage - 1;

        const { data, error, count } = await supabase
          .from("tasks")
          .select("*", { count: "exact" })
          .order("createdAt", { ascending: false })
          .range(from, to)
          .abortSignal(meta.signal);

        if (error) throw new Error(error.message);

        const totalItems = count || 0;
        const totalPages = Math.ceil(totalItems / perPage);

        return {
          data: data || [],
          items: totalItems,
          pages: totalPages,
          first: 1,
          last: totalPages,
          next: page < totalPages ? page + 1 : null,
          prev: page > 1 ? page - 1 : null,
        } as PaginatedResult<TodoDto>;
      },
      initialPageParam: 1,
      getNextPageParam: (result) => result.next,
      select: (result) => result.pages.flatMap((page) => page.data),
    });
  },

  getTodoListQueryOptions: ({
    page,
    userId,
  }: {
    page: number;
    userId?: string;
  }) => {
    return queryOptions({
      queryKey: [todoListApi.baseKey, "list", { page, userId }],
      queryFn: async (meta) => {
        const perPage = 10;
        const from = (page - 1) * perPage;
        const to = from + perPage - 1;

        let query = supabase
          .from("tasks")
          .select("*", { count: "exact" })
          .order("createdAt", { ascending: false })
          .range(from, to)
          .abortSignal(meta.signal);

        if (userId) {
          query = query.eq("userId", userId);
        }

        const { data, error, count } = await query;

        if (error) throw new Error(error.message);

        const totalItems = count || 0;
        const totalPages = Math.ceil(totalItems / perPage);

        return {
          data: data || [],
          items: totalItems,
          pages: totalPages,
          first: 1,
          last: totalPages,
          next: page < totalPages ? page + 1 : null,
          prev: page > 1 ? page - 1 : null,
        } as PaginatedResult<TodoDto>;
      },
    });
  },

  createTodo: async (data: TodoDto) => {
    const { data: result, error } = await supabase
      .from("tasks")
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return result as TodoDto;
  },

  updateTodo: async (data: Partial<TodoDto> & { id: string }) => {
    const { data: result, error } = await supabase
      .from("tasks")
      .update(data)
      .eq("id", data.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return result as TodoDto;
  },

  deleteTodo: async (id: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) throw new Error(error.message);
    return { success: true };
  },
};
