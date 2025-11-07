import { useInfiniteQuery } from "@tanstack/react-query";
import { todoListApi } from "./api";
import { useCallback, useRef, /* useState */ } from "react";


export  function useTodoListInfinity(){
    // const [enabled, setEnabled] = useState(false)
    
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
        // enabled: enabled,
      });
  
    //   const cursorRef = useIntersection(() => {
    //     if (enabled && hasNextPage) {
    //         fetchNextPage()
    //     }

    //   })

    const cursorRef = useIntersection(() => {
                fetchNextPage()
          })

    const cursor = (
        <div className="flex gap-2 mt-4" ref={/* enabled ? */ cursorRef /*: null */}>
          {!hasNextPage && /* !enabled?<div> загрузите данные</div>: */<div>  Нет данных для загрузки</div>}
          {isFetchingNextPage && <div>...Loding</div>}
        </div>
    )

    return {error, todoItems, isLoading, cursor, isPlaceholderData, /*setEnabled */}
}

export function useIntersection(onIntersect: () => void){

    const unsubscribe = useRef(() => {})
    return useCallback((el: HTMLDivElement | null) => {
        const observer = new IntersectionObserver((entris) => {
            entris.forEach(intersection => {
                if(intersection.isIntersecting){
                    onIntersect()
                }
            })
        })
        if(el){
            observer.observe(el)
            unsubscribe.current = () => observer.disconnect()
        }else {
            unsubscribe.current()
        }
    },[onIntersect])
}