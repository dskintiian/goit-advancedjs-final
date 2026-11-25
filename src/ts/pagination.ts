export function renderPagination(
  container: HTMLElement,
  currentPage: number,
  totalPages: number,
  onChange: (page: number) => void
): void {
  container.innerHTML = '';

  if (totalPages <= 1) {
    container.hidden = true;
    return;
  }

  container.hidden = false;

  const createButton = (
    label: string,
    page: number,
    options: { active?: boolean; disabled?: boolean; ariaLabel?: string } = {}
  ): HTMLButtonElement => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'pagination__btn';
    button.textContent = label;
    if (options.active) {
      button.classList.add('is-active');
      button.setAttribute('aria-current', 'page');
    }
    if (options.disabled) {
      button.disabled = true;
    }
    if (options.ariaLabel) {
      button.setAttribute('aria-label', options.ariaLabel);
    }
    button.addEventListener('click', () => onChange(page));
    return button;
  };

  const pages = getVisiblePages(currentPage, totalPages);
  pages.forEach(page => {
    if (page === '...') {
      const dots = document.createElement('span');
      dots.className = 'pagination__dots';
      dots.textContent = '...';
      container.append(dots);
      return;
    }
    container.append(
      createButton(String(page), page, { active: page === currentPage })
    );
  });
}

function getVisiblePages(
  current: number,
  total: number
): Array<number | '...'> {
  if (total <= 5) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  if (current <= 3) {
    return [1, 2, 3, '...', total];
  }

  if (current >= total - 2) {
    return [1, '...', total - 2, total - 1, total];
  }

  return [1, '...', current, '...', total];
}
