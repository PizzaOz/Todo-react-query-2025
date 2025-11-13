import { useAppDispath } from "../../../shared/redux";
import { logoutThunk } from "../logout-thunk";

export function LogoutButton() {
  const dispatch = useAppDispath();
  return (
    <button
      onClick={() => dispatch(logoutThunk())}
      className="rounded p-2 border border-rose-500 disabled:opacity-50"
    >
      Выход
    </button>
  );
}
