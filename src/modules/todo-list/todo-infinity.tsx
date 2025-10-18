// import { useInfiniteQuery } from "@tanstack/react-query";
// import { todoListApi } from "./api";
// import { useCallback, useRef, useState } from "react";

import { useTodoList as useTodoListInfinity } from "./use-todo-list-infinity";

export function TodoListInfinity() {
    const {error, todoItems, isLoading, cursor, isPlaceholderData} = useTodoListInfinity()

    // const {
    //   data: todoItems,
    //   error,
    //   // isPending, поменял на isLoading сейчас используеться как ленивая загрузка 
    //   isPlaceholderData,
    //   isLoading,
    //   fetchNextPage,
    //   hasNextPage,
    //   isFetchingNextPage,
    // } = useInfiniteQuery({
    //   ...todoListApi.getTodoListInfinityQueryOptions(),
    //   enabled: enabled,
    // });

    // const cursorRef = useIntersection(() => {
    //     fetchNextPage()
    // })


    if (isLoading) {
      return <div>Loding</div>;
    }
  
    if (error) {
      return <div>error: {JSON.stringify(error)}</div>;
    }
  
    return (
      <div className="p-5 mx-auto max-w-[1200px] mt-10">
        <h1 className="text-3xl font-bold underline mb-5">Todo List Infinity</h1>
        <div className={"flex flex-col gap-4" + (isPlaceholderData ? ' opacity-50': '')}>
          {todoItems?.map((todo) => (
            <div className="border border-slate-300 rounded p-3" key={todo.id}>
              {todo.text}
            </div>
          ))}
        </div>
        {/* <div className="flex gap-2 mt-4" ref={cursorRef}>
          {!hasNextPage && <div> Нет данных для загрузки</div>}
          {isFetchingNextPage && <div>...Loding</div>}
        </div> */}
        {cursor}
      </div>
    );
}

