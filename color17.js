(function () {
    'use strict';

    let selectedColor = '#ff0000'; // колір за замовчуванням (червоний)

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

    let styleEl;

    function applyStyles() {
        if (styleEl) styleEl.remove();
        styleEl = document.createElement('style');
        styleEl.type = 'text/css';
        styleEl.appendChild(document.createTextNode(cssTemplate(selectedColor)));
        document.head.appendChild(styleEl);
    }

    // 🔌 Реєстрація плагіна в Lampa
    Lampa.Plugin.create('menu_icon_color', {
        title: '🎨 Колір іконок меню',
        description: 'Змінює колір іконок у головному меню та налаштуваннях',
        component: {
            settings: function () {
                return {
                    name: 'menu_icon_color',
                    type: 'color',
                    label: 'Колір іконок',
                    value: selectedColor,
                    onChange: function (value) {
                        selectedColor = value;
                        localStorage.setItem('menu_icon_color', value);
                        applyStyles();
                    }
                };
            }
        },
        onCreate: function () {
            // Відновлення збереженого кольору
            const saved = localStorage.getItem('menu_icon_color');
            if (saved) selectedColor = saved;
            applyStyles();
        }
    });
})();
