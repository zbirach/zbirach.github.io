(function () {
    'use strict';

    let selectedColor = Lampa.Storage.get('menu_icon_color', '#ff0000');
    let styleEl;

    const cssTemplate = (color) => `
        .menu__item svg,
        .menu__item svg *,
        .menu__item img,
        .menu__item .icon,
        .menu__item .ico,
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

    // ✅ додаємо в налаштування
    Lampa.Settings.add({
        id: 'menu_icon_color',
        name: 'Колір іконок меню',
        type: 'select',
        values: {
            '#ff0000': 'Червоний',
            '#00ff00': 'Зелений',
            '#0000ff': 'Синій',
            '#ffff00': 'Жовтий',
            '#ffffff': 'Білий'
        },
        default: '#ff0000',
        value: selectedColor,
        onChange: function (value) {
            selectedColor = value;
            Lampa.Storage.set('menu_icon_color', value);
            applyStyles();
        },
        category: 'plugins'
    });

    applyStyles();

    console.log('✅ Плагін: кольори іконок меню активовано');
})();
