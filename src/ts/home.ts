import { getExercises, getFilters } from './api';
import { ICONS } from './icons';
import { openExerciseModal } from './modal';
import { renderPagination } from './pagination';
import {
  FILTER_QUERY_MAP,
  capitalize,
  escapeHtml,
  formatRating,
  getCategoryLimit,
  getExerciseLimit,
} from './utils';
import type { Exercise, FilterItem, FilterName } from './types';

interface CatalogState {
  filter: FilterName;
  category: string | null;
  keyword: string;
  page: number;
  totalPages: number;
  mode: 'categories' | 'exercises';
}

const state: CatalogState = {
  filter: 'Muscles',
  category: null,
  keyword: '',
  page: 1,
  totalPages: 1,
  mode: 'categories',
};

export function initHome(): void {
  const filters = document.querySelector('[data-filters]');
  const searchForm = document.querySelector<HTMLFormElement>('[data-search-form]');
  const clearButton = document.querySelector('[data-search-clear]');
  const list = document.querySelector('[data-catalog-list]');
  const pagination = document.querySelector<HTMLElement>('[data-pagination]');
  const breadcrumb = document.querySelector('[data-breadcrumb]');

  if (!filters || !list || !pagination) {
    return;
  }

  filters.addEventListener('click', event => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>(
      '[data-filter]'
    );
    if (!button) {
      return;
    }
    const nextFilter = button.dataset.filter as FilterName;
    if (!nextFilter || nextFilter === state.filter) {
      return;
    }
    state.filter = nextFilter;
    state.category = null;
    state.keyword = '';
    state.page = 1;
    state.mode = 'categories';
    syncFilterButtons();
    syncSearchVisibility();
    syncBreadcrumb();
    const searchInput = document.querySelector<HTMLInputElement>('[data-search-input]');
    if (searchInput) {
      searchInput.value = '';
    }
    void loadCatalog();
  });

  list.addEventListener('click', event => {
    const target = event.target as HTMLElement;
    const categoryCard = target.closest<HTMLElement>('[data-category]');
    if (categoryCard?.dataset.category) {
      state.category = categoryCard.dataset.category;
      state.page = 1;
      state.mode = 'exercises';
      state.keyword = '';
      syncSearchVisibility();
      syncBreadcrumb();
      void loadCatalog();
      return;
    }

    const startButton = target.closest<HTMLButtonElement>('[data-exercise-id]');
    if (startButton?.dataset.exerciseId) {
      void openExerciseModal(startButton.dataset.exerciseId);
    }
  });

  searchForm?.addEventListener('submit', event => {
    event.preventDefault();
    const input = searchForm.querySelector<HTMLInputElement>('[data-search-input]');
    state.keyword = input?.value.trim() ?? '';
    state.page = 1;
    void loadCatalog();
  });

  clearButton?.addEventListener('click', () => {
    const input = document.querySelector<HTMLInputElement>('[data-search-input]');
    if (input) {
      input.value = '';
    }
    state.keyword = '';
    state.page = 1;
    void loadCatalog();
  });

  if (breadcrumb) {
    breadcrumb.addEventListener('click', event => {
      const button = (event.target as HTMLElement).closest('[data-back-categories]');
      if (!button) {
        return;
      }
      state.category = null;
      state.mode = 'categories';
      state.keyword = '';
      state.page = 1;
      syncSearchVisibility();
      syncBreadcrumb();
      void loadCatalog();
    });
  }

  syncFilterButtons();
  syncSearchVisibility();
  syncBreadcrumb();
  void loadCatalog();

  window.addEventListener('resize', () => {
    // Limits change across breakpoints; reload current page safely.
  });
}

async function loadCatalog(): Promise<void> {
  const list = document.querySelector<HTMLElement>('[data-catalog-list]');
  const pagination = document.querySelector<HTMLElement>('[data-pagination]');
  const empty = document.querySelector<HTMLElement>('[data-catalog-empty]');
  if (!list || !pagination) {
    return;
  }

  try {
    list.classList.toggle('catalog__list--categories', state.mode === 'categories');
    list.classList.toggle('catalog__list--exercises', state.mode === 'exercises');

    if (state.mode === 'categories') {
      const response = await getFilters(
        state.filter,
        state.page,
        getCategoryLimit()
      );
      state.totalPages = Number(response.totalPages) || 1;
      list.innerHTML = response.results.map(renderCategoryCard).join('');
      empty && (empty.hidden = response.results.length > 0);
    } else if (state.category) {
      const queryKey = FILTER_QUERY_MAP[state.filter];
      const response = await getExercises({
        [queryKey]: state.category,
        keyword: state.keyword || undefined,
        page: state.page,
        limit: getExerciseLimit(),
      });
      state.totalPages = Number(response.totalPages) || 1;
      list.innerHTML = response.results.map(renderExerciseCard).join('');
      if (empty) {
        empty.hidden = response.results.length > 0;
        empty.textContent =
          'No exercises found matching your criteria. Try another search.';
      }
    }

    renderPagination(pagination, state.page, state.totalPages, page => {
      state.page = page;
      void loadCatalog();
      document
        .querySelector('[data-exercises-section]')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  } catch {
    list.innerHTML = '';
    if (empty) {
      empty.hidden = false;
      empty.textContent = 'Something went wrong. Please try again later.';
    }
    pagination.hidden = true;
  }
}

function syncFilterButtons(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach(button => {
    const active = button.dataset.filter === state.filter;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function syncSearchVisibility(): void {
  const search = document.querySelector<HTMLElement>('[data-search]');
  if (!search) {
    return;
  }
  search.hidden = state.mode !== 'exercises';
}

function syncBreadcrumb(): void {
  const breadcrumb = document.querySelector<HTMLElement>('[data-breadcrumb]');
  const title = document.querySelector('[data-exercises-title]');
  if (!breadcrumb || !title) {
    return;
  }

  if (state.mode === 'exercises' && state.category) {
    title.textContent = 'Exercises';
    breadcrumb.hidden = false;
    breadcrumb.innerHTML = `/ <button class="breadcrumb__btn" type="button" data-back-categories>${escapeHtml(capitalize(state.category))}</button>`;
  } else {
    title.textContent = 'Exercises';
    breadcrumb.hidden = true;
    breadcrumb.innerHTML = '';
  }
}

function renderCategoryCard(item: FilterItem): string {
  return `
    <li class="category-card">
      <button class="category-card__btn" type="button" data-category="${escapeHtml(item.name)}">
        <img class="category-card__image" src="${escapeHtml(item.imgURL)}" alt="" loading="lazy" decoding="async" width="335" height="225" />
        <span class="category-card__overlay">
          <span class="category-card__name">${escapeHtml(capitalize(item.name))}</span>
          <span class="category-card__filter">${escapeHtml(item.filter)}</span>
        </span>
      </button>
    </li>
  `;
}

function renderExerciseCard(item: Exercise): string {
  return `
    <li class="exercise-card">
      <div class="exercise-card__top">
        <span class="exercise-card__badge">Workout</span>
        <span class="exercise-card__rating">${formatRating(item.rating)}
          <img src="${ICONS.star}" alt="" width="18" height="18" />
        </span>
        <button class="exercise-card__start" type="button" data-exercise-id="${item._id}">
          Start
          <img src="${ICONS.arrowRight}" alt="" width="16" height="16" />
        </button>
      </div>
      <h3 class="exercise-card__title">
        <img src="${ICONS.runner}" alt="" width="24" height="24" />
        ${escapeHtml(capitalize(item.name))}
      </h3>
      <ul class="exercise-card__meta">
        <li>Burned calories: <span>${item.burnedCalories} / ${item.time} min</span></li>
        <li>Body part: <span>${escapeHtml(capitalize(item.bodyPart))}</span></li>
        <li>Target: <span>${escapeHtml(capitalize(item.target))}</span></li>
      </ul>
    </li>
  `;
}
