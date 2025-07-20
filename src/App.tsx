import { DataFetcher, useDataFetcher } from './components/DataFetcher';
import { Button } from './components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { useState } from 'react';
import { TodoList } from './components/TodoList';
import './global.css';
import { fetchTodos } from '@/lib/api';
import { TITLE } from '@/constants/texts';

const App = () => {
  const [tab, setTab] = useState('loading');
  const [forceRefresh, setForceRefresh] = useState(0);

  // Example 1: Basic loading state
  const basicQuery = useDataFetcher('todos', fetchTodos);

  // Example 2: With custom loading and error states
  const customQuery = useDataFetcher('todos-custom', fetchTodos, {
    renderLoading: () => (
      <div className="text-center py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
          ))}
        </div>
      </div>
    ),
    renderError: (error) => (
      <div className="text-center py-8 text-destructive">
        <p>Oops! Something went wrong.</p>
        <p className="text-sm opacity-75">{error.message}</p>
      </div>
    )
  });

  // Example 3: With cache and background refresh
  const cachedQuery = useDataFetcher(
    ['todos-cached', forceRefresh],
    fetchTodos,
    {
      useCache: true,
      refetchOnMount: true
    }
  );

  // Example 4: Cache only (no refetch)
  const cacheOnlyQuery = useDataFetcher('todos-cache-only', fetchTodos, {
    useCache: true,
    refetchOnMount: false
  });

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">{TITLE}</h1>

      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="loading">Loading</TabsTrigger>
          <TabsTrigger value="custom">Custom UI</TabsTrigger>
          <TabsTrigger value="cached">Cached + Refresh</TabsTrigger>
          <TabsTrigger value="cache-only">Cache Only</TabsTrigger>
        </TabsList>

        <TabsContent value="loading" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Loading State</CardTitle>
              <CardDescription>
                Shows loading state while fetching data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataFetcher
                {...basicQuery}
                renderSuccess={(data) => <TodoList todos={data} />}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom UI States</CardTitle>
              <CardDescription>Custom loading and error states</CardDescription>
            </CardHeader>
            <CardContent>
              <DataFetcher
                {...customQuery}
                renderSuccess={(data) => <TodoList todos={data} />}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cached" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Cached with Refresh</CardTitle>
                  <CardDescription>
                    Shows cached data while refreshing
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
                {...cachedQuery}
                renderSuccess={(data) => <TodoList todos={data} />}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cache-only" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cache Only</CardTitle>
              <CardDescription>
                Uses cached data without refetching
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataFetcher
                {...cacheOnlyQuery}
                renderSuccess={(data) => <TodoList todos={data} />}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default App;
