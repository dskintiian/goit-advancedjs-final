import { getFavorites, removeFavorite } from './favorites';
import { ICONS } from './icons';
import { openExerciseModal } from './modal';
import { capitalize, escapeHtml } from './utils';
import type { Exercise } from './types';

export function renderFavorites(): void {
  const list = document.querySelector<HTMLElement>('[data-favorites-list]');
  const empty = document.querySelector<HTMLElement>('[data-favorites-empty]');
  if (!list || !empty) {
    return;
  }

  const favorites = getFavorites();
  if (!favorites.length) {
    list.innerHTML = '';
    empty.hidden = false;
    return;
  }

  empty.hidden = true;
  list.innerHTML = favorites.map(renderFavoriteCard).join('');
}

export function initFavoritesPage(): void {
  const list = document.querySelector<HTMLElement>('[data-favorites-list]');
  if (!list) {
    return;
  }

  list.addEventListener('click', event => {
    const target = event.target as HTMLElement;
    const removeButton = target.closest<HTMLButtonElement>('[data-remove-id]');
    if (removeButton?.dataset.removeId) {
      removeFavorite(removeButton.dataset.removeId);
      renderFavorites();
      return;
    }

    const startButton = target.closest<HTMLButtonElement>('[data-exercise-id]');
    if (startButton?.dataset.exerciseId) {
      void openExerciseModal(startButton.dataset.exerciseId);
    }
  });

  renderFavorites();
}

function renderFavoriteCard(item: Exercise): string {
  return `
    <li class="exercise-card">
      <div class="exercise-card__top">
        <span class="exercise-card__badge">Workout</span>
        <button class="exercise-card__trash" type="button" data-remove-id="${item._id}" aria-label="Remove from favorites">
          <img src="${ICONS.trash}" alt="" width="16" height="16" />
        </button>
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
