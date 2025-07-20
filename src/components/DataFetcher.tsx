import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { Card, CardContent } from './ui/card';
import type { DataFetcherProps } from '@/constants/dataFetcher';
import { CACHE_MESSAGES, DEFAULT_BEHAVIOR } from '@/constants/dataFetcher';

export function DataFetcher<TData, TError = Error>({
  queryKey,
  queryFn,
  renderLoading,
  renderSuccess,
  renderError,
  behavior = DEFAULT_BEHAVIOR
}: DataFetcherProps<TData, TError>): ReturnType<
  DataFetcherProps<TData, TError>['renderLoading']
> {
  const isCacheAndUpdate = behavior === 'cache-and-update';
  const isCacheOnly = behavior === 'cache-only';
  const isLoadingIndefinitely = behavior === 'always-loading';

  const queryOptions = {
    // For 'always-loading', use a never-resolving promise
    queryFn: isLoadingIndefinitely
      ? (): Promise<never> => new Promise(() => {})
      : queryFn,
    // For 'cache-and-update', enable background refetching
    refetchOnMount: isCacheAndUpdate,
    refetchOnWindowFocus: !isCacheOnly,
    refetchOnReconnect: !isCacheOnly,
    // For 'cache-and-update', show stale data while refetching
    keepPreviousData: isCacheAndUpdate
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
  if (isLoadingIndefinitely || (isLoading && !isCacheAndUpdate)) {
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
              {CACHE_MESSAGES.UPDATING}
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
