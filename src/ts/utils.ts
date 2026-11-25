import type { ExerciseQueryKey, FilterName } from './types';

export const FILTER_QUERY_MAP: Record<FilterName, ExerciseQueryKey> = {
  Muscles: 'muscles',
  'Body parts': 'bodypart',
  Equipment: 'equipment',
};

export function capitalize(value: string): string {
  if (!value) {
    return '';
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function getCategoryLimit(): number {
  if (window.matchMedia('(min-width: 768px)').matches) {
    return 12;
  }
  return 9;
}

export function getExerciseLimit(): number {
  if (window.matchMedia('(min-width: 1440px)').matches) {
    return 9;
  }
  if (window.matchMedia('(min-width: 768px)').matches) {
    return 8;
  }
  return 8;
}

export function formatRating(value: number): string {
  return value.toFixed(1);
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
