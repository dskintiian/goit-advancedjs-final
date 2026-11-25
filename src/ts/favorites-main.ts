import 'modern-normalize/modern-normalize.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '../css/styles.css';

import { initFavoritesPage, renderFavorites } from './favorites-page';
import { initFooter } from './footer';
import { initHeader } from './header';
import { initModal } from './modal';
import { renderQuote } from './quote';
import { initScrollUp } from './scroll-up';

initHeader();
initFooter();
initScrollUp();
initModal({ onFavoritesChange: renderFavorites });
renderQuote();
initFavoritesPage();
