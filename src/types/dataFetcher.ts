import type { ReactNode } from 'react';

export type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

export type TodoListProps = {
  todos: Todo[];
};

export type FetchTodosResponse = {
  todos: Todo[];
};

export type DataFetcherBehavior =
  | 'always-loading'
  | 'loading-then-data'
  | 'cache-and-update'
  | 'cache-only';

export type DataFetcherProps<TData, TError = Error> = {
  queryKey: string | unknown[];
  queryFn: () => Promise<TData>;
  renderLoading: () => ReactNode;
  renderSuccess: (data: TData) => ReactNode;
  renderError: (error: TError) => ReactNode;
  behavior?: DataFetcherBehavior;
  initialData?: TData;
};
