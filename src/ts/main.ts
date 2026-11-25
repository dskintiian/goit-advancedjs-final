import 'modern-normalize/modern-normalize.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '../css/styles.css';

import { initFooter } from './footer';
import { initHeader } from './header';
import { initHome } from './home';
import { initModal } from './modal';
import { renderQuote } from './quote';
import { initScrollUp } from './scroll-up';

initHeader();
initFooter();
initScrollUp();
initModal();
renderQuote();
initHome();
