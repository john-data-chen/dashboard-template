import type { QueryKey, UseQueryOptions } from '@tanstack/react-query';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface DataFetcherProps<TData, TError = Error> {
  queryKey: QueryKey;
  queryFn: () => Promise<TData>;
  renderLoading?: () => React.ReactNode;
  renderError?: (error: TError | Error) => React.ReactNode;
  renderSuccess: (data: TData) => React.ReactNode;
  useCache?: boolean;
  refetchOnMount?: boolean;
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
