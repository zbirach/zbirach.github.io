(function () {
  'use strict';

  // 🎨 Налаштуй свої кольори тут
  const COLORS = {
    menu: '#ff4444',       // іконки головного меню
    settings: '#00ccff',   // іконки в Налаштуваннях
    activeBg: '#222244',   // фон активного пункту меню (необов'язково)
  };

  function injectStyles() {
    if (document.getElementById('color-icons-style')) return;

    const css = `
    /* ГОЛОВНЕ МЕНЮ — font-іконки та текст */
    .menu .menu__ico, .menu .menu__item .icon { color: ${COLORS.menu} !important; }
    .menu .menu__item { color: inherit; }

    /* ГОЛОВНЕ МЕНЮ — inline SVG (усі вузли всередині) */
    .menu .menu__item svg, .menu .menu__item svg * {
      fill: ${COLORS.menu} !important;
      stroke: ${COLORS.menu} !important;
    }

    /* ГОЛОВНЕ МЕНЮ — PNG (якщо трапляються) */
    .menu .menu__item img {
      filter: invert(40%) sepia(95%) saturate(4000%) hue-rotate(350deg);
    }

    /* НАЛАШТУВАННЯ — font-іконки */
    .settings__item .settings__ico,
    .settings__item .settings__icon {
      color: ${COLORS.settings} !important;
    }

    /* НАЛАШТУВАННЯ — inline SVG */
    .settings__item svg, .settings__item svg * {
      fill: ${COLORS.settings} !important;
      stroke: ${COLORS.settings} !important;
    }

    /* Активний пункт меню (опціонально) */
    .menu .menu__item.active, .menu .menu__item.focus {
      background-color: ${COLORS.activeBg} !important;
    }
    `;

    const style = document.createElement('style');
    style.id = 'color-icons-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function start() { injectStyles(); }

  // 1) Запуск коли DOM готовий
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  // 2) Якщо є Lampa.Listener — підпишемось, але без вимоги до Plugin.add
  const hook = () => {
    if (window.Lampa && Lampa.Listener && typeof Lampa.Listener.follow === 'function') {
      Lampa.Listener.follow('app', (e) => {
        if (e.type === 'ready' || e.type === 'activity' || e.type === 'select') injectStyles();
      });
    }
  };
  hook();

  // 3) Підстрахуємося на динамічні зміни DOM
  new MutationObserver(() => injectStyles()).observe(document.documentElement, { childList: true, subtree: true });
})();
