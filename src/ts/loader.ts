const LOADER_DELAY_MS = 200;

let showTimer: ReturnType<typeof setTimeout> | null = null;

function getLoader(): HTMLElement | null {
  return document.querySelector('[data-loader]');
}

export function showLoader(): void {
  if (showTimer) {
    return;
  }

  showTimer = setTimeout(() => {
    const loader = getLoader();
    loader?.classList.add('is-visible');
    loader?.setAttribute('aria-hidden', 'false');
  }, LOADER_DELAY_MS);
}

export function hideLoader(): void {
  if (showTimer) {
    clearTimeout(showTimer);
    showTimer = null;
  }

  const loader = getLoader();
  loader?.classList.remove('is-visible');
  loader?.setAttribute('aria-hidden', 'true');
}
