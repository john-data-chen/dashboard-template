export const TODO_QUERY_KEYS = {
  BASIC: 'todos',
  CUSTOM: 'todos-custom',
  CACHED: 'todos-cached',
  CACHE_ONLY: 'todos-cache-only'
} as const;

export const TAB_IDS = {
  LOADING: 'loading',
  CUSTOM: 'custom',
  CACHED: 'cached',
  CACHE_ONLY: 'cache-only'
} as const;

export const ERROR_MESSAGES = {
  FETCH_FAILED: 'Failed to fetch todos',
  SOMETHING_WRONG: 'Oops! Something went wrong.'
} as const;

export const CARD_TITLES = {
  BASIC_LOADING: 'Basic Loading State',
  CUSTOM_UI: 'Custom UI States',
  CACHED_REFRESH: 'Cached with Refresh',
  CACHE_ONLY: 'Cache Only'
} as const;

export const CARD_DESCRIPTIONS = {
  BASIC_LOADING: 'Shows loading state while fetching data',
  CUSTOM_UI: 'Custom loading and error states',
  CACHED_REFRESH: 'Shows cached data while refreshing',
  CACHE_ONLY: 'Uses cached data without refetching'
} as const;
