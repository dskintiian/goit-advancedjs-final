import type {
  Exercise,
  FilterItem,
  FilterName,
  PaginatedResponse,
  Quote,
  RatingPayload,
} from './types';
import { hideLoader, showLoader } from './loader';

export const API_BASE_URL = 'https://your-energy.b.goit.study/api';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

let pendingRequests = 0;

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  pendingRequests += 1;
  showLoader();

  try {
    const response = await fetch(url, options);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message =
        typeof data === 'object' && data && 'message' in data
          ? String((data as { message: string }).message)
          : `Request failed with status ${response.status}`;
      throw new ApiError(message, response.status);
    }

    return data as T;
  } finally {
    pendingRequests = Math.max(0, pendingRequests - 1);
    if (pendingRequests === 0) {
      hideLoader();
    }
  }
}

export function getFilters(
  filter: FilterName,
  page = 1,
  limit = 12
): Promise<PaginatedResponse<FilterItem>> {
  const params = new URLSearchParams({
    filter,
    page: String(page),
    limit: String(limit),
  });
  return fetchJson(`${API_BASE_URL}/filters?${params}`);
}

export function getExercises(params: {
  muscles?: string;
  bodypart?: string;
  equipment?: string;
  keyword?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<Exercise>> {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      search.set(key, String(value));
    }
  });
  return fetchJson(`${API_BASE_URL}/exercises?${search}`);
}

export function getExerciseById(id: string): Promise<Exercise> {
  return fetchJson(`${API_BASE_URL}/exercises/${id}`);
}

export function getQuote(): Promise<Quote> {
  return fetchJson(`${API_BASE_URL}/quote`);
}

export function subscribe(email: string): Promise<{ message: string }> {
  return fetchJson(`${API_BASE_URL}/subscription`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
}

export function patchExerciseRating(
  id: string,
  payload: RatingPayload
): Promise<Exercise> {
  return fetchJson(`${API_BASE_URL}/exercises/${id}/rating`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}
