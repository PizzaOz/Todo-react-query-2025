import { TodoDto } from "./api";

interface TodoItemProps {
  todo: TodoDto;
  onToggle: (id: string, currentDone: boolean) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function TodoItem({
  todo,
  onToggle,
  onDelete,
  isDeleting,
}: TodoItemProps) {
  return (
    <div className="border border-slate-300 rounded p-3 grid grid-cols-[200px_1fr_200px] gap-4 items-center">
      <div className="flex items-center gap-3 min-w-0">
        <input
          type="checkbox"
          checked={todo.done}
          onChange={() => onToggle(todo.id, todo.done)}
        />
        <span className="font-sans font-medium text-slate-700 whitespace-nowrap truncate">
          {todo.login ? `Owner: ${todo.login}` : ""}
        </span>
      </div>
      <span className="font-sans font-bold text-slate-700 truncate text-center">
        {todo.text}
      </span>
      <div className="flex items-center gap-4 justify-end">
        <span className="font-sans font-medium text-slate-700 whitespace-nowrap text-sm">
          {new Date(todo.createdAt || new Date()).toLocaleDateString("ru-RU")}
        </span>
        <button
          disabled={isDeleting}
          className="text-rose-500 font-bold disabled:text-rose-300 whitespace-nowrap"
          onClick={() => onDelete(todo.id)}
        >
          Удалить
        </button>
      </div>
    </div>
  );
}
