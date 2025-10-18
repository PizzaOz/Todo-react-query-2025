import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { todoListApi } from "./api";
import { useState } from "react";


export  function useTodoList(){
    const [page, setPage] = useState(1);
    const [enabled, setEnabled] = useState(false)
  
    const {
      data: todoItems,
      error,
      // isPending, поменял на isLoading сейчас используеться как ленивая загрузка 
      isPlaceholderData,
      isLoading
    } = useQuery({
      ...todoListApi.getTodoListQueryOptions({page}),
      placeholderData: keepPreviousData,
      enabled: enabled
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
  

    return {error, todoItems, isLoading, isPlaceholderData, buttonPagination, setEnabled}
}

