(function () {
    'use strict';

    const PLUGIN_ID = 'menu_icon_color';
    const PLUGIN_NAME = 'Колір іконок меню';

    // значення за замовчуванням
    let color = Lampa.Storage.get(PLUGIN_ID, '#ff0000');

    function applyStyles() {
        const css = `
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
        let style = document.getElementById(PLUGIN_ID);
        if (!style) {
            style = document.createElement('style');
            style.id = PLUGIN_ID;
            document.head.appendChild(style);
        }
        style.innerHTML = css;
    }

    function init() {
        applyStyles();

        // додаємо в налаштування
        Lampa.Settings.add({
            id: PLUGIN_ID,
            name: PLUGIN_NAME,
            component: () => {
                return {
                    render: () => {
                        let input = $('<input type="text" placeholder="#ff0000">')
                            .val(color)
                            .on('change', function () {
                                color = $(this).val();
                                Lampa.Storage.set(PLUGIN_ID, color);
                                applyStyles();
                            });

                        return $('<div class="settings-param selector">')
                            .append('<div class="settings-param__name">Колір (HEX)</div>')
                            .append(input);
                    },
                    update: function(){},
                    destroy: function(){}
                };
            }
        });
    }

    Lampa.Plugin.create(PLUGIN_ID, init);
})();
