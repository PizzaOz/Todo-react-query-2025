import { useInfiniteQuery } from "@tanstack/react-query";
import { todoListApi } from "../api";
import { useCallback, useRef } from "react";

export function useTodoListInfinity() {
  const {
    data: todoItems,
    error,
    isPlaceholderData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    ...todoListApi.getTodoListInfinityQueryOptions(),
  });

  const cursorRef = useIntersection(() => {
    if (hasNextPage) {
      fetchNextPage();
    }
  });

  const cursor = (
    <div className="flex gap-2 mt-4" ref={cursorRef}>
      {!hasNextPage && <div>Нет данных для загрузки</div>}
      {isFetchingNextPage && <div>...Loading</div>}
    </div>
  );

  return { error, todoItems, isLoading, cursor, isPlaceholderData };
}

export function useIntersection(onIntersect: () => void) {
  const unsubscribe = useRef(() => {});
  return useCallback(
    (el: HTMLDivElement | null) => {
      const observer = new IntersectionObserver((entris) => {
        entris.forEach((intersection) => {
          if (intersection.isIntersecting) {
            onIntersect();
          }
        });
      });
      if (el) {
        observer.observe(el);
        unsubscribe.current = () => observer.disconnect();
      } else {
        unsubscribe.current();
      }
    },
    [onIntersect]
  );
}
