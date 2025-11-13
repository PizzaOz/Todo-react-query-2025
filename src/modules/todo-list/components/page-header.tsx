import { LogoutButton } from "../../auth/components/logout-button";
import { useUser } from "../../auth/hooks/use-user";

interface PageHeaderProps {
  onToggleView: () => void;
  isInfinityView: boolean;
}

export function PageHeader({ onToggleView, isInfinityView }: PageHeaderProps) {
  const userQuery = useUser();
  
  return (
    <div className="flex justify-between items-center mb-5">
      <h1 className="text-3xl font-bold underline">
        Todo List {isInfinityView? "Все задачи": userQuery.data?.login}
      </h1>
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleView}
          className="rounded p-2 border border-teal-500 disabled:opacity-50"
        >
          {isInfinityView ? "Мои задачи" : "Все задачи"}
        </button>
        <LogoutButton />
      </div>
    </div>
  );
}
