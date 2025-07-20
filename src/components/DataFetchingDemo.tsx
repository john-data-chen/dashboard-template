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
import { DataFetcher } from './DataFetcher';

// Mock API function to simulate data fetching
const fetchTodos = async (): Promise<{
  todos: Array<{ id: number; title: string; completed: boolean }>;
}> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Return mock data
  return {
    todos: [
      { id: 1, title: 'Learn React', completed: true },
      { id: 2, title: 'Master TypeScript', completed: false },
      { id: 3, title: 'Build awesome apps', completed: false }
    ]
  };
};

// Loading component
import { Skeleton } from './ui/skeleton';

const LoadingState = () => (
  <div className="space-y-2">
    {[...Array(3)].map((_, i) => (
      <Skeleton key={i} className="h-4 w-full" />
    ))}
  </div>
);

// Error component
const ErrorState = ({ error }: { error: Error }) => (
  <div className="text-destructive">
    <p>Error: {error.message || 'Failed to load data'}</p>
  </div>
);

// Success component
const TodoList = ({
  todos
}: {
  todos: {
    todos: Array<{ id: number; title: string; completed: boolean }>;
  }['todos'];
}) => (
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

export const DataFetchingDemo = () => {
  const [forceRefresh, setForceRefresh] = useState(0);

  return (
    <Tabs defaultValue="always-loading" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="always-loading">Always Loading</TabsTrigger>
        <TabsTrigger value="loading-then-data">Loading → Data</TabsTrigger>
        <TabsTrigger value="cache-and-update">Cache + Update</TabsTrigger>
        <TabsTrigger value="cache-only">Cache Only</TabsTrigger>
      </TabsList>

      <TabsContent value="always-loading">
        <Card>
          <CardHeader>
            <CardTitle>Always Loading</CardTitle>
            <CardDescription>
              Shows loading state indefinitely using a never-resolving promise
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataFetcher
              queryKey="always-loading-demo"
              queryFn={fetchTodos}
              behavior="always-loading"
              renderLoading={LoadingState}
              renderError={ErrorState}
              renderSuccess={TodoList}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="loading-then-data">
        <Card>
          <CardHeader>
            <CardTitle>Loading → Data</CardTitle>
            <CardDescription>
              Shows loading state first, then displays the data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataFetcher
              queryKey="loading-then-data-demo"
              queryFn={fetchTodos}
              behavior="loading-then-data"
              renderLoading={LoadingState}
              renderError={ErrorState}
              renderSuccess={TodoList}
            />
          </CardContent>
        </Card>
      </TabsContent>

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
