import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from './ui/card';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { RefreshCw } from 'lucide-react';
import { DataFetcher } from './DataFetcher';
import type {
  DataFetcherBehavior,
  FetchTodosResponse
} from '@/types/dataFetcher';
import {
  QUERY_KEYS,
  TABS,
  BUTTON_LABELS,
  MOCK_CACHE_DATA,
  LOADING_STATE,
  ERROR_MESSAGES,
  CACHE_MESSAGES,
  TODO_STATUS
} from '../constants/dataFetcher';
import { MOCK_API_URL } from '@/constants/mockApi';

// Fetch todos from the mock API
export const fetchTodos = async (context?: {
  queryKey?: any[];
}): Promise<FetchTodosResponse> => {
  // Check if this is the loading-then-data tab by checking the query key
  const isDelayedTab = context?.queryKey?.some(
    (key) =>
      key === QUERY_KEYS.LOADING_THEN_DATA ||
      (Array.isArray(key) && key.includes(QUERY_KEYS.LOADING_THEN_DATA))
  );

  const startTime = Date.now();
  let response;

  try {
    response = await fetch(MOCK_API_URL);
    if (!response.ok) {
      throw new Error(ERROR_MESSAGES.DEFAULT);
    }

    const data = await response.json();
    const todos = Array.isArray(data) ? data : data.todos || [];

    // For the loading-then-data tab, ensure loading state is shown for at least 3 seconds
    if (isDelayedTab) {
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, 3000 - elapsed);
      if (remainingTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
      }
    }

    return { todos };
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
};

// Loading component
const LoadingState = () => (
  <div className="space-y-4">
    <div className="animate-pulse text-center text-muted-foreground">
      加載中...
    </div>
    <div className="space-y-2">
      {[...Array(LOADING_STATE.SKELETON_ITEMS)].map((_, i) => (
        <Skeleton key={i} className={LOADING_STATE.SKELETON_CLASS} />
      ))}
    </div>
  </div>
);

// Error component
const ErrorState = ({ error }: { error: Error }) => (
  <div className="text-destructive">
    <p>Error: {error.message || ERROR_MESSAGES.DEFAULT}</p>
  </div>
);

// Success component
const TodoList = ({ todos }: { todos: FetchTodosResponse['todos'] }) => {
  // Handle case where todos is undefined or null
  if (!todos || !Array.isArray(todos)) {
    return <div className="text-muted-foreground">No todos found</div>;
  }

  // Handle empty array case
  if (todos.length === 0) {
    return <div className="text-muted-foreground">No todos available</div>;
  }

  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <div key={todo.id} className="flex items-center space-x-2">
          <span
            className={`flex-1 ${todo.completed ? 'line-through text-muted-foreground' : ''}`}
          >
            {todo.title}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
            {todo.completed ? TODO_STATUS.COMPLETED : TODO_STATUS.TODO}
          </span>
        </div>
      ))}
    </div>
  );
};

export const DataFetchingDemo = () => {
  const [forceRefresh, setForceRefresh] = useState(0);
  const [activeTab, setActiveTab] =
    useState<DataFetcherBehavior>('always-loading');
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<number | null>(null);

  // Reset loading state when tab changes or when data is loaded
  useEffect(() => {
    setIsLoading(false);
  }, [activeTab, lastRefreshTime]);

  // Effect to handle loading state updates
  useEffect(() => {
    if (isLoading) {
      setLastRefreshTime(Date.now());
    }
  }, [isLoading]);

  // Auto-refresh when switching to the loading-then-data tab
  useEffect(() => {
    if (activeTab === 'loading-then-data') {
      setRefreshKey((prev) => prev + 1);
    }
  }, [activeTab]);

  // Track the currently refreshing tab for force refresh
  const [refreshingTab, setRefreshingTab] = useState<string | null>(null);

  // Handle manual refresh for loading-then-data tab
  const handleManualRefresh = () => {
    if (!isLoading) {
      setIsLoading(true);
      setRefreshKey((prev) => prev + 1);
    }
  };

  // Handle force refresh for other tabs
  const handleForceRefresh = (tabValue: string) => {
    setRefreshingTab(tabValue);
    setForceRefresh((prev) => prev + 1);
  };

  return (
    <div className="w-full">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as DataFetcherBehavior)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4">
          {Object.values(TABS).map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries({
          [TABS.ALWAYS_LOADING.value]: {
            queryKey: QUERY_KEYS.ALWAYS_LOADING,
            behavior: TABS.ALWAYS_LOADING.value,
            showForceRefresh: false,
            title: TABS.ALWAYS_LOADING.title,
            description: TABS.ALWAYS_LOADING.description
          },
          [TABS.LOADING_THEN_DATA.value]: {
            queryKey: [QUERY_KEYS.LOADING_THEN_DATA, refreshKey],
            behavior: TABS.LOADING_THEN_DATA.value,
            showForceRefresh: true,
            title: TABS.LOADING_THEN_DATA.title,
            description: TABS.LOADING_THEN_DATA.description
          },
          [TABS.CACHE_AND_UPDATE.value]: {
            queryKey: [QUERY_KEYS.CACHE_AND_UPDATE, forceRefresh],
            behavior: TABS.CACHE_AND_UPDATE.value,
            showForceRefresh: true,
            title: TABS.CACHE_AND_UPDATE.title,
            description: TABS.CACHE_AND_UPDATE.description
          },
          [TABS.CACHE_ONLY.value]: {
            queryKey: QUERY_KEYS.CACHE_ONLY,
            behavior: TABS.CACHE_ONLY.value,
            showForceRefresh: false,
            title: TABS.CACHE_ONLY.title,
            description: TABS.CACHE_ONLY.description,
            initialData: MOCK_CACHE_DATA
          }
        }).map(([tabValue, config]) => {
          const isCacheOnly = tabValue === TABS.CACHE_ONLY.value;
          return (
            <TabsContent key={tabValue} value={tabValue}>
              <DataFetcher
                key={`${tabValue}-${refreshKey}`}
                queryKey={config.queryKey}
                queryFn={fetchTodos}
                behavior={config.behavior as DataFetcherBehavior}
                initialData={isCacheOnly ? MOCK_CACHE_DATA : undefined}
                renderLoading={() => (
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{config.title}</CardTitle>
                          <CardDescription>
                            {config.description}
                          </CardDescription>
                        </div>
                        {tabValue === TABS.LOADING_THEN_DATA.value && (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={true}
                            className="flex items-center gap-2"
                          >
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            {BUTTON_LABELS.MANUAL_REFRESHING}
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {isCacheOnly ? (
                        <div>{ERROR_MESSAGES.NO_CACHED_DATA}</div>
                      ) : (
                        <LoadingState />
                      )}
                    </CardContent>
                  </Card>
                )}
                renderError={(error) => (
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{config.title}</CardTitle>
                          <CardDescription>
                            {config.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ErrorState error={error} />
                    </CardContent>
                  </Card>
                )}
                renderSuccess={(data) => (
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{config.title}</CardTitle>
                          <CardDescription>
                            {config.description}
                          </CardDescription>
                        </div>
                        <div>
                          {tabValue === TABS.LOADING_THEN_DATA.value ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleManualRefresh}
                              disabled={isLoading}
                              className="flex items-center gap-2"
                            >
                              <RefreshCw
                                className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
                              />
                              {isLoading
                                ? BUTTON_LABELS.MANUAL_REFRESHING
                                : BUTTON_LABELS.MANUAL_REFRESH}
                            </Button>
                          ) : config.showForceRefresh ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleForceRefresh(tabValue)}
                              disabled={refreshingTab === tabValue}
                              className="flex items-center gap-2"
                            >
                              <RefreshCw
                                className={`h-4 w-4 ${refreshingTab === tabValue ? 'animate-spin' : ''}`}
                              />
                              {refreshingTab === tabValue
                                ? BUTTON_LABELS.MANUAL_REFRESHING
                                : BUTTON_LABELS.FORCE_REFRESH}
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <TodoList todos={data.todos} />
                      {isCacheOnly && (
                        <div className="mt-4 text-sm text-muted-foreground">
                          <p>{CACHE_MESSAGES.CACHE_ONLY_NOTE}</p>
                          <p>{CACHE_MESSAGES.CACHE_ONLY_INSTRUCTION}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default DataFetchingDemo;
