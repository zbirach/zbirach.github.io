(function () {
    'use strict';

    // 🎨 тут вибери свій колір
    const ICON_COLOR = '#ff4444';

    const css = `
        /* ===== ГОЛОВНЕ МЕНЮ ===== */
        .menu__item .menu__ico,
        .menu__item .ico,
        .menu__item .icon {
            color: ${ICON_COLOR} !important;
        }
        .menu__item svg,
        .menu__item svg * {
            fill: ${ICON_COLOR} !important;
            stroke: ${ICON_COLOR} !important;
        }
        .menu__item img {
            filter: invert(65%) sepia(95%) saturate(4000%) hue-rotate(330deg);
        }

        /* ===== НАЛАШТУВАННЯ ===== */
        .settings__item .settings__ico,
        .settings__item .settings__icon,
        .settings__item .ico,
        .settings__item .icon {
            color: ${ICON_COLOR} !important;
        }
        .settings__item svg,
        .settings__item svg * {
            fill: ${ICON_COLOR} !important;
            stroke: ${ICON_COLOR} !important;
        }
        .settings__item img {
            filter: invert(65%) sepia(95%) saturate(4000%) hue-rotate(330deg);
        }
    `;

    function applyStyles() {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }

    // Запуск плагіна
    applyStyles();

    console.log('✅ Плагін для кольору іконок меню та налаштувань підключений');
})();
