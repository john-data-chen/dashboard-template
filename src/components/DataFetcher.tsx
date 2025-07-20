import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import type { DataFetcherProps } from '@/types/dataFetcher';
import { DEFAULT_BEHAVIOR, MOCK_CACHE_DATA } from '@/constants/dataFetcher';

export function DataFetcher<TData, TError = Error>({
  queryKey,
  queryFn,
  renderLoading,
  renderSuccess,
  renderError,
  behavior = DEFAULT_BEHAVIOR,
  initialData
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
      : isCacheOnly
        ? () => Promise.resolve(MOCK_CACHE_DATA as TData)
        : isCacheAndUpdate
          ? async () => {
              // Then fetch fresh data after a delay
              await new Promise((resolve) => setTimeout(resolve, 3000));
              return queryFn();
            }
          : queryFn,
    // For 'cache-only', disable all refetching
    refetchOnMount: isCacheOnly ? false : isCacheAndUpdate,
    refetchOnWindowFocus: !isCacheOnly,
    refetchOnReconnect: !isCacheOnly,
    // For 'cache-and-update', show stale data while refetching
    keepPreviousData: isCacheAndUpdate,
    // Use provided initialData or fallback to MOCK_CACHE_DATA for cache-and-update
    ...(initialData && {
      initialData,
      staleTime: isCacheOnly ? Infinity : 0
    }),
    ...(isCacheAndUpdate &&
      !initialData && {
        initialData: MOCK_CACHE_DATA as TData,
        staleTime: 0 // Make sure we always refetch
      })
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
  });

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
        {behavior === 'cache-and-update' && isFetching}
        {renderSuccess(data)}
      </div>
    );
  }

  // Fallback (shouldn't normally be reached)
  return <>{renderLoading()}</>;
}
