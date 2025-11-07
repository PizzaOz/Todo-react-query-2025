import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { todoListApi } from "./api";
import { useState } from "react";
import { useUser } from "../auth/use-user";
import { jsonApiInstance } from "../../shared/api/api-instance";
import { PaginatedResult, TodoDto } from "./api";

export function useTodoList(){
    const [page, setPage] = useState(1);
    const userQuery = useUser();
  
    const {
      data: todoItems,
      error,
      isPlaceholderData,
      isLoading
    } = useQuery({
      // Добавляем userId в queryKey для кэширования
      queryKey: [todoListApi.baseKey, "list", { page, userId: userQuery.data?.id }],
      queryFn: (meta) =>
        jsonApiInstance<PaginatedResult<TodoDto>>(
          // Добавляем фильтр по userId в URL
          `/tasks?_page=${page}&_per_page=10&_sort=-createdAt&userId=${userQuery.data?.id}`,
          { signal: meta.signal }
        ),
      placeholderData: keepPreviousData,
      enabled: !!userQuery.data?.id, // Запрос выполняется только когда известен userId
    });

    const buttonPagination = (
        <div className="flex gap-2 mt-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="p-3 rounded border border-teal-500"
        >
          prev
        </button>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, todoItems?.pages ?? 1))}
          className="p-3 rounded border border-teal-500"
        >
          next
        </button>
      </div>
    )
  
    return {error, todoItems, isLoading, isPlaceholderData, buttonPagination}
}

