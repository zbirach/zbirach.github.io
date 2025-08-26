(function () {
    'use strict';

    let selectedColor = localStorage.getItem('menu_icon_color') || '#ff0000'; // червоний за замовчуванням
    let styleEl;

    const cssTemplate = (color) => `
        /* Головне меню */
        .menu__item svg,
        .menu__item svg *,
        .menu__item img,
        .menu__item .icon,
        .menu__item .ico {
            fill: ${color} !important;
            color: ${color} !important;
        }

        /* Налаштування */
        .settings__item svg,
        .settings__item svg *,
        .settings__item img,
        .settings__item .settings__ico,
        .settings__item .settings__icon,
        .settings__item .icon,
        .settings__item .ico {
            fill: ${color} !important;
            color: ${color} !important;
        }
    `;

    function applyStyles() {
        if (styleEl) styleEl.remove();
        styleEl = document.createElement('style');
        styleEl.type = 'text/css';
        styleEl.appendChild(document.createTextNode(cssTemplate(selectedColor)));
        document.head.appendChild(styleEl);
    }

    // додаємо пункт у "Плагіни"
    Lampa.SettingsApi.addComponent({
        component: 'menu_icon_color',
        name: 'Колір іконок меню',
        type: 'color',
        value: selectedColor,
        onChange: function (value) {
            selectedColor = value;
            localStorage.setItem('menu_icon_color', value);
            applyStyles();
        }
    });

    // застосувати стиль при старті
    applyStyles();

    console.log('✅ Плагін menu_icon_color запущено');
})();
