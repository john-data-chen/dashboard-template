import type { Todo } from '@/types/data-fetcher';

interface TodoListProps {
  todos: Todo[];
  emptyMessage?: React.ReactNode;
  className?: string;
}

export function TodoList({
  todos,
  emptyMessage = 'No todos found',
  className = ''
}: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className={`text-center py-4 text-muted-foreground ${className}`}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <ul className={`space-y-2 ${className}`}>
      {todos.map((todo) => (
        <li key={todo.id} className="flex items-center space-x-4">
          <div
            className={`flex-1 ${todo.completed ? 'line-through text-muted-foreground' : ''}`}
          >
            {todo.title}
          </div>
          <time
            dateTime={todo.createdAt}
            className="text-sm text-muted-foreground"
            title={new Date(todo.createdAt).toLocaleString()}
          >
            {new Date(todo.createdAt).toLocaleDateString()}
          </time>
        </li>
      ))}
    </ul>
  );
}
