import { useQuery } from '@tanstack/react-query';
import type { DataFetcherProps } from '@/types/data-fetcher';
import { Loader2 } from 'lucide-react';

const defaultLoading = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    <span className="ml-2">Loading...</span>
  </div>
);

const defaultError = (error: unknown) => {
  const errorMessage =
    error instanceof Error ? error.message : 'An unknown error occurred';
  return (
    <div className="rounded-md bg-destructive/10 p-4 text-destructive">
      <p>Error: {errorMessage}</p>
    </div>
  );
};

export function DataFetcher<TData, TError = Error>({
  queryKey,
  queryFn,
  renderLoading = defaultLoading,
  renderError = defaultError,
  renderSuccess,
  useCache = true,
  refetchOnMount = true,
  options = {}
}: DataFetcherProps<TData, TError>) {
  const query = useQuery<TData, TError>({
    queryKey,
    queryFn,
    staleTime: useCache ? 5 * 60 * 1000 : 0, // 5 minutes cache
    refetchOnWindowFocus: false,
    refetchOnMount: refetchOnMount,
    retry: 2,
    ...options
  });

  // Handle loading state
  if (query.isPending) {
    return <>{renderLoading()}</>;
  }

  // Handle error state
  if (query.isError && query.error) {
    return <>{renderError(query.error)}</>;
  }

  // Handle success state
  if (query.data) {
    return <>{renderSuccess(query.data)}</>;
  }

  // Fallback (should not reach here)
  return null;
}

// Helper hook for common data fetching patterns
export function useDataFetcher<TData, TError = Error>(
  queryKey: string | unknown[],
  queryFn: () => Promise<TData>,
  options?: Omit<
    DataFetcherProps<TData, TError>,
    'queryKey' | 'queryFn' | 'renderSuccess'
  >
) {
  return {
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    queryFn,
    ...options
  };
}
