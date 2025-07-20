import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from './ui/card';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { DataFetcher } from './DataFetcher';
import {
  QUERY_KEYS,
  TABS,
  LOADING_STATE,
  ERROR_MESSAGES,
  CACHE_MESSAGES,
  BUTTON_LABELS,
  type FetchTodosResponse
} from '@/constants/dataFetcher';
import { MOCK_API_URL } from '@/constants/mockApi';

// Fetch todos from the mock API
const fetchTodos = async (): Promise<FetchTodosResponse> => {
  const response = await fetch(MOCK_API_URL);
  if (!response.ok) {
    throw new Error(ERROR_MESSAGES.DEFAULT);
  }
  return await response.json();
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
            {todo.completed ? 'Done' : 'Pending'}
          </span>
        </div>
      ))}
    </div>
  );
};

export const DataFetchingDemo = () => {
  const [forceRefresh, setForceRefresh] = useState(0);

  return (
    <Tabs defaultValue={TABS.ALWAYS_LOADING.value} className="w-full">
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
          behavior: 'always-loading' as const,
          showForceRefresh: false
        },
        [TABS.LOADING_THEN_DATA.value]: {
          queryKey: QUERY_KEYS.LOADING_THEN_DATA,
          behavior: 'loading-then-data' as const,
          showForceRefresh: false
        },
        [TABS.CACHE_AND_UPDATE.value]: {
          queryKey: [QUERY_KEYS.CACHE_AND_UPDATE, forceRefresh],
          behavior: 'cache-and-update' as const,
          showForceRefresh: true
        },
        [TABS.CACHE_ONLY.value]: {
          queryKey: QUERY_KEYS.CACHE_ONLY,
          behavior: 'cache-only' as const,
          showForceRefresh: false
        }
      }).map(([tabValue, config]) => (
        <TabsContent key={tabValue} value={tabValue}>
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>
                    {
                      TABS[
                        tabValue
                          .toUpperCase()
                          .replace(/-/g, '_') as keyof typeof TABS
                      ].title
                    }
                  </CardTitle>
                  <CardDescription>
                    {
                      TABS[
                        tabValue
                          .toUpperCase()
                          .replace(/-/g, '_') as keyof typeof TABS
                      ].description
                    }
                  </CardDescription>
                </div>
                {config.showForceRefresh && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setForceRefresh((prev) => prev + 1)}
                  >
                    {BUTTON_LABELS.FORCE_REFRESH}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <DataFetcher
                queryKey={config.queryKey}
                queryFn={fetchTodos}
                behavior={config.behavior}
                renderLoading={
                  tabValue === TABS.CACHE_ONLY.value
                    ? () => <div>{ERROR_MESSAGES.NO_CACHED_DATA}</div>
                    : LoadingState
                }
                renderError={ErrorState}
                renderSuccess={TodoList}
              />
              {tabValue === TABS.CACHE_ONLY.value && (
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>{CACHE_MESSAGES.CACHE_ONLY_NOTE}</p>
                  <p>{CACHE_MESSAGES.CACHE_ONLY_INSTRUCTION}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      ))}

      <TabsContent value="cache-and-update">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Cache + Update</CardTitle>
                <CardDescription>
                  Shows cached data immediately, then updates in the background
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setForceRefresh((prev) => prev + 1)}
              >
                Force Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <DataFetcher
              queryKey={['cache-and-update-demo', forceRefresh]}
              queryFn={fetchTodos}
              behavior="cache-and-update"
              renderLoading={LoadingState}
              renderError={ErrorState}
              renderSuccess={TodoList}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="cache-only">
        <Card>
          <CardHeader>
            <CardTitle>Cache Only</CardTitle>
            <CardDescription>
              Shows only cached data, makes no network requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataFetcher
              queryKey="cache-only-demo"
              queryFn={fetchTodos}
              behavior="cache-only"
              renderLoading={() => <div>No cached data available</div>}
              renderError={ErrorState}
              renderSuccess={TodoList}
            />
            <div className="mt-4 text-sm text-muted-foreground">
              <p>
                Note: This will only show data if it was previously loaded in
                another tab.
              </p>
              <p>
                Try loading the "Cache + Update" tab first, then switch to this
                tab.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default DataFetchingDemo;
