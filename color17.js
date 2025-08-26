(function () {
    'use strict';

    // 🎨 вибери колір (синій приклад)
    const ICON_FILTER = 'invert(31%) sepia(94%) saturate(3500%) hue-rotate(210deg) brightness(110%) contrast(115%)';

    const css = `
        /* Головне меню */
        .menu__item svg,
        .menu__item svg *,
        .menu__item img,
        .menu__item .icon,
        .menu__item .ico {
            filter: ${ICON_FILTER} !important;
        }

        /* Налаштування */
        .settings__item svg,
        .settings__item svg *,
        .settings__item img,
        .settings__item .settings__ico,
        .settings__item .settings__icon,
        .settings__item .icon,
        .settings__item .ico {
            filter: ${ICON_FILTER} !important;
        }
    `;

    function applyStyles() {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }

    applyStyles();

    console.log('✅ Плагін: іконки меню та налаштувань перекрашені через filter');
})();
