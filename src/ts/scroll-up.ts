const SHOW_AFTER_PX = 300;

export function initScrollUp(): void {
  const button = document.querySelector<HTMLButtonElement>('[data-scroll-up]');
  if (!button) {
    return;
  }

  const toggle = (): void => {
    button.classList.toggle('is-visible', window.scrollY > SHOW_AFTER_PX);
  };

  window.addEventListener('scroll', toggle, { passive: true });
  toggle();

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
