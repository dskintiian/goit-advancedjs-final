import { ApiError, getExerciseById, patchExerciseRating } from './api';
import { isFavorite, toggleFavorite } from './favorites';
import { ICONS } from './icons';
import { capitalize, escapeHtml, formatRating } from './utils';
import type { Exercise } from './types';

const EMAIL_PATTERN = /^\w+(\.\w+)?@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

let currentExercise: Exercise | null = null;
let selectedRate = 0;
let onFavoritesChange: (() => void) | null = null;

export function initModal(options?: { onFavoritesChange?: () => void }): void {
  onFavoritesChange = options?.onFavoritesChange ?? null;

  const modal = document.querySelector<HTMLElement>('[data-exercise-modal]');
  const ratingModal = document.querySelector<HTMLElement>('[data-rating-modal]');
  if (!modal) {
    return;
  }

  modal.addEventListener('click', event => {
    const target = event.target as HTMLElement;

    if (target === modal || target.closest('[data-modal-close]')) {
      closeExerciseModal();
      return;
    }

    if (!currentExercise) {
      return;
    }

    if (target.closest('[data-favorite-toggle]')) {
      const added = toggleFavorite(currentExercise);
      updateFavoriteButton(added);
      onFavoritesChange?.();
      return;
    }

    if (target.closest('[data-open-rating]')) {
      openRatingModal();
    }
  });

  ratingModal?.addEventListener('click', event => {
    const target = event.target as HTMLElement;
    if (target === ratingModal || target.closest('[data-rating-close]')) {
      closeRatingModal();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') {
      return;
    }
    if (ratingModal?.classList.contains('is-open')) {
      closeRatingModal();
      return;
    }
    if (modal.classList.contains('is-open')) {
      closeExerciseModal();
    }
  });

  initRatingForm();
}

export async function openExerciseModal(id: string): Promise<void> {
  const modal = document.querySelector<HTMLElement>('[data-exercise-modal]');
  const content = document.querySelector<HTMLElement>('[data-modal-content]');
  if (!modal || !content) {
    return;
  }

  try {
    currentExercise = await getExerciseById(id);
    content.innerHTML = buildModalMarkup(currentExercise);
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('scroll-lock');
  } catch {
    content.innerHTML =
      '<p class="modal__error">Unable to load exercise details.</p>';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('scroll-lock');
  }
}

export function closeExerciseModal(): void {
  const modal = document.querySelector<HTMLElement>('[data-exercise-modal]');
  modal?.classList.remove('is-open');
  modal?.setAttribute('aria-hidden', 'true');
  if (!document.querySelector('[data-rating-modal].is-open')) {
    document.body.classList.remove('scroll-lock');
  }
  currentExercise = null;
}

function openRatingModal(): void {
  const ratingModal = document.querySelector<HTMLElement>('[data-rating-modal]');
  const rateValue = document.querySelector('[data-rate-value]');
  if (!ratingModal) {
    return;
  }
  selectedRate = 0;
  if (rateValue) {
    rateValue.textContent = '0.0';
  }
  ratingModal.querySelectorAll<HTMLButtonElement>('[data-rate]').forEach(btn => {
    btn.classList.remove('is-active');
    const icon = btn.querySelector('img');
    if (icon) {
      icon.src = ICONS.starMuted;
    }
  });
  ratingModal.classList.add('is-open');
  ratingModal.setAttribute('aria-hidden', 'false');
}

function closeRatingModal(): void {
  const ratingModal = document.querySelector<HTMLElement>('[data-rating-modal]');
  ratingModal?.classList.remove('is-open');
  ratingModal?.setAttribute('aria-hidden', 'true');
  const form = ratingModal?.querySelector<HTMLFormElement>('[data-rating-form]');
  form?.reset();
}

function updateFavoriteButton(isAdded: boolean): void {
  const button = document.querySelector<HTMLButtonElement>('[data-favorite-toggle]');
  if (!button) {
    return;
  }
  button.innerHTML = isAdded
    ? `Remove from favorites <img src="${ICONS.heartFilledLight}" alt="" width="20" height="20" />`
    : `Add to favorites <img src="${ICONS.heart}" alt="" width="20" height="20" />`;
}

function buildStarsMarkup(rating: number): string {
  const stars = Array.from({ length: 5 }, (_, index) => {
    const filled = rating >= index + 0.5;
    return `<img class="modal__star" src="${filled ? ICONS.star : ICONS.starMuted}" alt="" width="18" height="18" />`;
  }).join('');

  return `<span class="modal__stars" aria-hidden="true">${stars}</span>`;
}

function buildModalMarkup(exercise: Exercise): string {
  const favorite = isFavorite(exercise._id);
  const rating = Number(exercise.rating) || 0;

  return `
    <button class="modal__close" type="button" data-modal-close aria-label="Close">
      <img src="${ICONS.close}" alt="" width="28" height="28" />
    </button>
    <div class="modal__body">
      <div class="modal__media">
        <img class="modal__gif" src="${escapeHtml(exercise.gifUrl)}" alt="${escapeHtml(exercise.name)}" width="295" height="259" />
      </div>
      <div class="modal__info">
        <h2 class="modal__title">${escapeHtml(capitalize(exercise.name))}</h2>
        <p class="modal__rating">
          <span>${formatRating(rating)}</span>
          ${buildStarsMarkup(rating)}
        </p>
        <ul class="modal__stats">
          <li>
            <span class="modal__stats-label">Target</span>
            <span class="modal__stats-value">${escapeHtml(capitalize(exercise.target))}</span>
          </li>
          <li>
            <span class="modal__stats-label">Body Part</span>
            <span class="modal__stats-value">${escapeHtml(capitalize(exercise.bodyPart))}</span>
          </li>
          <li>
            <span class="modal__stats-label">Equipment</span>
            <span class="modal__stats-value">${escapeHtml(capitalize(exercise.equipment))}</span>
          </li>
          <li>
            <span class="modal__stats-label">Popular</span>
            <span class="modal__stats-value">${exercise.popularity}</span>
          </li>
          <li>
            <span class="modal__stats-label">Burned Calories</span>
            <span class="modal__stats-value">${exercise.burnedCalories} / ${exercise.time} min</span>
          </li>
        </ul>
        <p class="modal__description">${escapeHtml(exercise.description)}</p>
        <div class="modal__actions">
          <button class="btn btn--light" type="button" data-favorite-toggle>
            ${
              favorite
                ? `Remove from favorites <img src="${ICONS.heartFilledLight}" alt="" width="20" height="20" />`
                : `Add to favorites <img src="${ICONS.heart}" alt="" width="20" height="20" />`
            }
          </button>
          <button class="btn btn--ghost-light" type="button" data-open-rating>Give a rating</button>
        </div>
      </div>
    </div>
  `;
}

function initRatingForm(): void {
  const ratingModal = document.querySelector<HTMLElement>('[data-rating-modal]');
  const form = document.querySelector<HTMLFormElement>('[data-rating-form]');
  const message = document.querySelector<HTMLElement>('[data-rating-message]');
  if (!ratingModal || !form) {
    return;
  }

  const rateButtons = ratingModal.querySelectorAll<HTMLButtonElement>('[data-rate]');

  rateButtons.forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();

      selectedRate = Number(button.dataset.rate);
      const rateValue = ratingModal.querySelector('[data-rate-value]');
      if (rateValue) {
        rateValue.textContent = selectedRate.toFixed(1);
      }

      rateButtons.forEach(item => {
        const active = Number(item.dataset.rate) <= selectedRate;
        item.classList.toggle('is-active', active);
        const icon = item.querySelector('img');
        if (icon) {
          icon.src = active ? ICONS.star : ICONS.starMuted;
        }
      });
    });
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!currentExercise || !message) {
      return;
    }

    message.textContent = '';
    message.classList.remove('is-error', 'is-success');

    const emailInput = form.querySelector<HTMLInputElement>('[name="email"]');
    const reviewInput = form.querySelector<HTMLTextAreaElement>('[name="review"]');
    const email = emailInput?.value.trim() ?? '';
    const review = reviewInput?.value.trim() ?? '';

    if (!selectedRate) {
      message.textContent = 'Select a rating';
      message.classList.add('is-error');
      return;
    }

    if (!EMAIL_PATTERN.test(email)) {
      message.textContent = 'Invalid email';
      message.classList.add('is-error');
      return;
    }

    if (!review) {
      message.textContent = 'Enter a comment';
      message.classList.add('is-error');
      return;
    }

    try {
      currentExercise = await patchExerciseRating(currentExercise._id, {
        rate: selectedRate,
        email,
        review,
      });
      const content = document.querySelector('[data-modal-content]');
      if (content && currentExercise) {
        content.innerHTML = buildModalMarkup(currentExercise);
      }
      message.textContent = 'Thank you for your rating';
      message.classList.add('is-success');
      closeRatingModal();
    } catch (error) {
      message.textContent =
        error instanceof ApiError ? error.message : 'Failed to send rating';
      message.classList.add('is-error');
    }
  });
}
