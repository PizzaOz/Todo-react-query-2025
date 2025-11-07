import { TodoList } from "../modules/todo-list/todo-list";
import { TodoListInfinity } from "../modules/todo-list/todo-infinity";
import { useState } from "react";
import { useUser } from "../modules/auth/use-user";
import { Login } from "../modules/auth/login";
import { PageHeader } from "../modules/todo-list/page-header";

export function App() {
  const [showInfinity, setShowInfinity] = useState(false);
  const user = useUser();

  if(user.isLoading) {
    return <div>Loading</div>
  }

  if (user.data) {
    return (
      <div className="p-5 mx-auto max-w-[1200px] mt-10">
        <PageHeader 
          onToggleView={() => setShowInfinity(e => !e)}
          isInfinityView={showInfinity}
        />
        {showInfinity ? <TodoListInfinity /> : <TodoList />}
      </div>
    );
  }

  return <Login/>
}
