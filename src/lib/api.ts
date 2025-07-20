import type { Todo } from '@/types/data-fetcher';
import { BASE_URL } from '@/constants/mockApi';

export async function fetchTodos(): Promise<Todo[]> {
  const response = await fetch(`${BASE_URL}/todos`);
  if (!response.ok) {
    throw new Error('Failed to fetch todos');
  }
  return response.json();
}
