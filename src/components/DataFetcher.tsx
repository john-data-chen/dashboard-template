import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { Card, CardContent } from './ui/card';
import type { ReactNode } from 'react';

type DataFetcherProps<TData, TError = Error> = {
  queryKey: string | unknown[];
  queryFn: () => Promise<TData>;
  renderLoading: () => ReactNode;
  renderSuccess: (data: TData) => ReactNode;
  renderError: (error: TError) => ReactNode;
  /**
   * Behavior options:
   * - 'always-loading': Shows loading state indefinitely
   * - 'loading-then-data': Shows loading, then data (default)
   * - 'cache-and-update': Shows cached data immediately, then updates
   * - 'cache-only': Shows only cached data, no network request
   */
  behavior?:
    | 'always-loading'
    | 'loading-then-data'
    | 'cache-and-update'
    | 'cache-only';
};

export function DataFetcher<TData, TError = Error>({
  queryKey,
  queryFn,
  renderLoading,
  renderSuccess,
  renderError,
  behavior = 'loading-then-data'
}: DataFetcherProps<TData, TError>): ReactNode {
  const queryOptions = {
    // For 'always-loading', use a never-resolving promise
    queryFn:
      behavior === 'always-loading'
        ? (): Promise<never> => new Promise(() => {})
        : queryFn,
    // For 'cache-and-update', enable background refetching
    refetchOnMount: behavior === 'cache-and-update',
    refetchOnWindowFocus: behavior !== 'cache-only',
    refetchOnReconnect: behavior !== 'cache-only',
    // For 'cache-and-update', show stale data while refetching
    keepPreviousData: behavior === 'cache-and-update'
  };

  const {
    data,
    error,
    isError,
    isLoading,
    isFetching
  }: UseQueryResult<TData, TError> = useQuery({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    ...queryOptions
  } as const);

  // Handle loading states
  if (
    behavior === 'always-loading' ||
    (isLoading && behavior !== 'cache-and-update')
  ) {
    return <>{renderLoading()}</>;
  }

  // Handle error state
  if (isError && error) {
    return <>{renderError(error)}</>;
  }

  // Handle success state
  if (data !== undefined) {
    return (
      <div className="space-y-4">
        {behavior === 'cache-and-update' && isFetching && (
          <Card className="mb-4">
            <CardContent className="p-4 text-sm text-muted-foreground">
              Updating data in the background...
            </CardContent>
          </Card>
        )}
        {renderSuccess(data)}
      </div>
    );
  }

  // Fallback (shouldn't normally be reached)
  return <>{renderLoading()}</>;
}
