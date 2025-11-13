import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { todoListApi } from "../api";
import { useState } from "react";
import { useUser } from "../../auth/hooks/use-user";

export function useTodoList(){
    const [page, setPage] = useState(1);
    const userQuery = useUser();

    const {
      data: todoItems,
      error,
      isPlaceholderData,
      isLoading
    } = useQuery({
      ...todoListApi.getTodoListQueryOptions({ 
        page, 
        userId: userQuery.data?.id 
      }),
      placeholderData: keepPreviousData,
      enabled: !!userQuery.data?.id,
    });
    const isPrevDisabled = page <= 1;
    const isNextDisabled = !todoItems?.pages || page >= todoItems.pages;

    const buttonPagination = (
        <div className="flex gap-2 mt-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={isPrevDisabled}
          className="p-3 rounded border border-teal-500 disabled:opacity-50"
        >
          prev
        </button>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, todoItems?.pages ?? 1))}
          disabled={isNextDisabled}
          className="p-3 rounded border border-teal-500 disabled:opacity-50"
        >
          next
        </button>
      </div>
    )
    return {error, todoItems, isLoading, isPlaceholderData, buttonPagination}
}

