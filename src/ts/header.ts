export function initHeader(): void {
  const page = document.body.dataset.page;
  if (page) {
    document
      .querySelector(`[data-nav="${page}"]`)
      ?.classList.add('is-active');
  }

  const menuButton = document.querySelector<HTMLButtonElement>('[data-menu-open]');
  const closeButton = document.querySelector<HTMLButtonElement>('[data-menu-close]');
  const mobileMenu = document.querySelector<HTMLElement>('[data-mobile-menu]');

  if (!menuButton || !closeButton || !mobileMenu) {
    return;
  }

  const openMenu = (): void => {
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    menuButton.setAttribute('aria-expanded', 'true');
    document.body.classList.add('scroll-lock');
  };

  const closeMenu = (): void => {
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    menuButton.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('scroll-lock');
  };

  menuButton.addEventListener('click', openMenu);
  closeButton.addEventListener('click', closeMenu);

  mobileMenu.addEventListener('click', event => {
    const target = event.target as HTMLElement;
    if (target.closest('a')) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
      closeMenu();
    }
  });
}
