import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../shared/api/query-client";
import { TodoList } from "../modules/todo-list/todo-list";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TodoListInfinity } from "../modules/todo-list/todo-infinity";
import { useState } from "react";

export function App() {
  const [showInfinity, setShowInfinity] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <button onClick={() => setShowInfinity((e) => !e)}>
        {showInfinity ? "Show Regular" : "Show Infinity"}
      </button>
      {showInfinity ? <TodoListInfinity /> : <TodoList />}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
