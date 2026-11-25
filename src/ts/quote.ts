import { getQuote } from './api';
import type { Quote } from './types';

const QUOTE_KEY = 'your-energy-quote';
const DAY_MS = 24 * 60 * 60 * 1000;

interface CachedQuote {
  data: Quote;
  savedAt: number;
}

function readCache(): CachedQuote | null {
  try {
    const raw = localStorage.getItem(QUOTE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as CachedQuote;
  } catch {
    return null;
  }
}

export async function loadDailyQuote(): Promise<Quote> {
  const cached = readCache();
  if (cached && Date.now() - cached.savedAt < DAY_MS) {
    return cached.data;
  }

  const data = await getQuote();
  localStorage.setItem(
    QUOTE_KEY,
    JSON.stringify({ data, savedAt: Date.now() } satisfies CachedQuote)
  );
  return data;
}

export function renderQuote(root: ParentNode = document): void {
  const quoteEl = root.querySelector('[data-quote-text]');
  const authorEl = root.querySelector('[data-quote-author]');
  if (!quoteEl || !authorEl) {
    return;
  }

  loadDailyQuote()
    .then(quote => {
      quoteEl.textContent = quote.quote;
      authorEl.textContent = quote.author;
    })
    .catch(() => {
      quoteEl.textContent = 'Stay active and keep moving every day.';
      authorEl.textContent = 'Your Energy';
    });
}
