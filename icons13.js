(function () {
  'use strict';

  // 🎨 налаштуй свої кольори
  const COLORS = {
    menu: '#ff4444',       // іконки в головному меню
    settings: '#00ccff',   // іконки в Налаштуваннях
    activeBg: '#222244',   // фон активного пункту (опціонально)
  };

  // Спроба зареєструвати плагін, якщо API є (без помилки, якщо нема)
  try {
    if (window.Lampa && Lampa.Plugin && typeof Lampa.Plugin.add === 'function') {
      Lampa.Plugin.add({
        title: 'Color Icons',
        id: 'color_icons',
        version: '1.3',
        description: 'Кастомні кольори іконок меню та налаштувань',
        author: 'GPT'
      });
    }
  } catch (e) { /* ignore */ }

  function injectStyles() {
    if (document.getElementById('color-icons-style')) return;

    const css = `
    /* ГОЛОВНЕ МЕНЮ: font-іконки, svg, png */
    .menu .menu__ico, .menu .menu__item .icon { color: ${COLORS.menu} !important; }
    .menu .menu__item svg, .menu .menu__item svg * {
      fill: ${COLORS.menu} !important; stroke: ${COLORS.menu} !important;
    }
    .menu .menu__item img {
      filter: invert(40%) sepia(95%) saturate(4000%) hue-rotate(350deg);
    }
    /* НАЛАШТУВАННЯ */
    .settings__item .settings__ico,
    .settings__item .settings__icon,
    .settings__item .ico,
    .settings__item .icon {
    color: #00ccff !important; /* 🔵 заміни на свій */
    }

    /* svg-іконки */
    .settings__item svg,
    .settings__item svg * {
    fill: #00ccff !important;
    stroke: #00ccff !important;
    }

    /* картинки у налаштуваннях */
    .settings__item img {
    filter: invert(65%) sepia(95%) saturate(4000%) hue-rotate(180deg);
    }

    /* НАЛАШТУВАННЯ: font-іконки та svg */
    .settings__item .settings__ico, .settings__item .settings__icon {
      color: ${COLORS.settings} !important;
    }
    .settings__item svg, .settings__item svg * {
      fill: ${COLORS.settings} !important; stroke: ${COLORS.settings} !important;
    }

    /* Активний пункт меню */
    .menu .menu__item.active, .menu .menu__item.focus {
      background-color: ${COLORS.activeBg} !important;
    }
    `;

    const style = document.createElement('style');
    style.id = 'color-icons-style';
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
  }

  function start() { injectStyles(); }

  // 1) DOM готовий
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();

  // 2) Якщо є Listener — підпишемось (без вимоги до нього)
  try {
    if (window.Lampa && Lampa.Listener && typeof Lampa.Listener.follow === 'function') {
      Lampa.Listener.follow('app', e => {
        if (e.type === 'ready' || e.type === 'activity' || e.type === 'select') injectStyles();
      });
    }
  } catch (e) { /* ignore */ }

  // 3) Підстраховка на динамічні зміни DOM
  new MutationObserver(() => injectStyles()).observe(document.documentElement, { childList: true, subtree: true });
})();
