import type { Exercise } from './types';

const FAVORITES_KEY = 'your-energy-favorites';

function readFavorites(): Exercise[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as Exercise[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeFavorites(items: Exercise[]): void {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(items));
}

export function getFavorites(): Exercise[] {
  return readFavorites();
}

export function isFavorite(id: string): boolean {
  return readFavorites().some(item => item._id === id);
}

export function addFavorite(exercise: Exercise): void {
  const items = readFavorites();
  if (items.some(item => item._id === exercise._id)) {
    return;
  }
  items.push(exercise);
  writeFavorites(items);
}

export function removeFavorite(id: string): void {
  writeFavorites(readFavorites().filter(item => item._id !== id));
}

export function toggleFavorite(exercise: Exercise): boolean {
  if (isFavorite(exercise._id)) {
    removeFavorite(exercise._id);
    return false;
  }
  addFavorite(exercise);
  return true;
}
