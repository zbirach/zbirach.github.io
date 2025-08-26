(function () {
    'use strict';

    const PLUGIN_ID = 'menu-icon-color';
    const PLUGIN_NAME = 'Колір іконок меню';

    // 🔧 беремо колір з localStorage або ставимо червоний (#ff0000)
    let currentColor = localStorage.getItem(PLUGIN_ID) || '#ff0000';

    // функція конвертації HEX → CSS filter
    function hexToFilter(hex) {
        // генератор складний, тому дамо простий "invert + sepia" варіант
        // він не ідеальний, але працює для більшості кольорів
        const r = parseInt(hex.substr(1, 2), 16);
        const g = parseInt(hex.substr(3, 2), 16);
        const b = parseInt(hex.substr(5, 2), 16);
        return `brightness(0) saturate(100%) invert(${(255 - r) / 2.55}%) sepia(${g / 2.55}%) saturate(500%) hue-rotate(${b}deg)`;
    }

    function applyStyles() {
        const ICON_FILTER = hexToFilter(currentColor);

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

        let style = document.getElementById(PLUGIN_ID + '-style');
        if (!style) {
            style = document.createElement('style');
            style.id = PLUGIN_ID + '-style';
            document.head.appendChild(style);
        }
        style.textContent = css;
    }

    // додаємо пункт у меню налаштувань
    function addSettingsMenu() {
        Lampa.SettingsApi.addComponent({
            component: PLUGIN_ID,
            name: PLUGIN_NAME,
            type: 'color', // буде піпетка 🎨
            value: currentColor,
            onChange: (val) => {
                currentColor = val;
                localStorage.setItem(PLUGIN_ID, currentColor);
                applyStyles();
            }
        });
    }

    // запуск
    applyStyles();
    addSettingsMenu();

    console.log(`✅ Плагін "${PLUGIN_NAME}" активований`);
})();
