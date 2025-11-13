import { TodoList } from "../modules/todo-list/components/todo-list";
import { TodoListInfinity } from "../modules/todo-list/components/todo-infinity";
import { useState } from "react";
import { useUser } from "../modules/auth/hooks/use-user";
import { Login } from "../modules/auth/components/login";
import { PageHeader } from "../modules/todo-list/components/page-header";

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
