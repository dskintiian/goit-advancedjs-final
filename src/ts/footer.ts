import { ApiError, subscribe } from './api';

const EMAIL_PATTERN = /^\w+(\.\w+)?@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

export function initFooter(): void {
  const form = document.querySelector<HTMLFormElement>('[data-subscribe-form]');
  const input = document.querySelector<HTMLInputElement>('[data-subscribe-email]');
  const message = document.querySelector<HTMLElement>('[data-subscribe-message]');

  if (!form || !input || !message) {
    return;
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    message.textContent = '';
    message.classList.remove('is-error', 'is-success');

    const email = input.value.trim();
    if (!EMAIL_PATTERN.test(email)) {
      message.textContent = 'Invalid email';
      message.classList.add('is-error');
      return;
    }

    try {
      const result = await subscribe(email);
      message.textContent = result.message || 'Subscribed successfully';
      message.classList.add('is-success');
      form.reset();
    } catch (error) {
      const text =
        error instanceof ApiError ? error.message : 'Subscription failed';
      message.textContent = text;
      message.classList.add('is-error');
    }
  });
}
