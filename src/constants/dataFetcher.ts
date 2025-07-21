// Query keys
export const QUERY_KEYS = {
  ALWAYS_LOADING: 'always-loading-demo',
  LOADING_THEN_DATA: 'loading-then-data-demo',
  CACHE_AND_UPDATE: 'cache-and-update-demo',
  CACHE_ONLY: 'cache-only-demo',
  FORCE_REFRESH: 'force-refresh'
} as const;

// Tab configuration
export const TABS = {
  ALWAYS_LOADING: {
    value: 'always-loading',
    title: 'Always Loading',
    description: 'Shows loading state indefinitely'
  },
  LOADING_THEN_DATA: {
    value: 'loading-then-data',
    title: 'Loading → Data',
    description: 'Shows loading state first, then displays the data'
  },
  CACHE_AND_UPDATE: {
    value: 'cache-and-update',
    title: 'Cache + Update',
    description:
      'Shows cached data immediately, then updates data after queried'
  },
  CACHE_ONLY: {
    value: 'cache-only',
    title: 'Cache Only',
    description: 'Shows only cached data, makes no network requests'
  }
} as const;

// Loading state configuration
export const LOADING_STATE = {
  SKELETON_ITEMS: 3,
  SKELETON_CLASS: 'h-4 w-full'
} as const;

// Error messages
export const ERROR_MESSAGES = {
  DEFAULT: 'Failed to load data',
  NO_CACHED_DATA: 'No cached data available'
} as const;

// Cache messages
export const CACHE_MESSAGES = {
  UPDATING: 'Updating data in the background...',
  CACHE_ONLY_NOTE:
    'Note: This will only show data if it was previously loaded in another tab.',
  CACHE_ONLY_INSTRUCTION:
    'Try loading the "Cache + Update" tab first, then switch to this tab.'
} as const;

// Button labels
export const BUTTON_LABELS = {
  FORCE_REFRESH: 'Force Refresh',
  REFRESH: 'Refresh',
  REFRESHING: 'Refreshing...',
  MANUAL_REFRESH: 'Load New Data',
  MANUAL_REFRESHING: 'Loading...'
} as const;

// Default behavior
export const DEFAULT_BEHAVIOR = 'loading-then-data' as const;

// Network simulation
export const MIN_LOADING_DELAY = 3000; // 3 seconds minimum loading time

// Mock Cache Data
export const MOCK_CACHE_DATA = {
  todos: [
    {
      id: 1,
      title: 'Cached Todo 1',
      completed: false
    },
    {
      id: 2,
      title: 'Cached Todo 2',
      completed: false
    },
    {
      id: 3,
      title: 'Cached Todo 3',
      completed: false
    }
  ]
};

// Status of todos
export const TODO_STATUS = {
  TODO: 'Todo',
  COMPLETED: 'Completed'
} as const;
