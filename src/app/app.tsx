
import { TodoList } from "../modules/todo-list/todo-list";

import { TodoListInfinity } from "../modules/todo-list/todo-infinity";
import { useState } from "react";
import { useUser } from "../modules/auth/use-user";
import { Login } from "../modules/auth/login";
import { LogoutButton } from "../modules/auth/logout-button";

export function App() {
  const [showInfinity, setShowInfinity] = useState(false);

  const user = useUser();

  console.log(user.data, 'userData')

  if(user.isLoading) {
    return <div>Loding</div>
  }

  if (user.data) {
    return (
      <>
      <LogoutButton/>
        <button onClick={() => setShowInfinity((e) => !e)}>
          {showInfinity ? "Show Regular" : "Show Infinity"}
        </button>
        {showInfinity ? <TodoListInfinity /> : <TodoList />}
      </>
    );
  }

  return <Login/>
  
}
