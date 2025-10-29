(function () {
    'use strict';

    Lampa.Lang.add({
        maxsm_themes: {
            ru: "Темы оформления",
            en: "Interface themes",
            uk: "Теми оформлення",
            be: "Тэмы афармлення",
            zh: "主题",
            pt: "Temas",
            bg: "Теми",
            he: "ערכות נושא",
            cs: "Témata"
        },
        maxsm_themes_tvcaption: {
            ru: "СЕРИАЛ",
            en: "TV SERIES",
            uk: "СЕРІАЛ",
            be: "СЕРЫЯЛ",
            zh: "剧集",
            pt: "SÉRIE",
            bg: "СЕРИАЛ",
            he: "סִדְרָה",
            cs: "SERIÁL"
        }
    });

    var maxsm_themes = {
        name: 'maxsm_themes',
        version: '2.5.1',
        settings: {
            theme: 'mint_dark'
        }
    };

    var prevtheme = '';
    var onetime = false;

    var loaderColors = {
        "default": '#fff',
        violet_blue: '#6a11cb',
        mint_dark: '#3da18d',
        deep_aurora: '#7e7ed9',
        crystal_cyan: '#7ed0f9',
        neon_pulse: '#29ccb4',
        amber_noir: '#f4a261',
        velvet_sakura: '#f6a5b0'
    };

    function applyTheme(theme) {
        $('#maxsm_interface_mod_theme').remove();

        if (
            prevtheme !== '' &&
            (
                (prevtheme === 'default' && theme !== 'default') ||
                (prevtheme !== 'default' && theme === 'default')
            )
        ) {
            window.location.reload();
        }

        prevtheme = theme;

        if (theme === 'default') return;

        var color = loaderColors[theme] || loaderColors["default"];

        // 🔄 Новий лоадер — обертовий півмісяць
        var svgCode = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
  <path fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round"
        d="M25 5a20 20 0 0 1 0 40a20 20 0 0 0 0-40">
    <animateTransform attributeName="transform"
      type="rotate" from="0 25 25" to="360 25 25"
      dur="1s" repeatCount="indefinite"/>
  </path>
</svg>
        `);

        var style = $('<style id="maxsm_interface_mod_theme"></style>');

        var themes = {
            mint_dark: `
                .navigation-bar__body {
                    background: rgba(18, 32, 36, 0.96);
                }
                .screensaver__preload,
                .activity__loader {
                    background: url("data:image/svg+xml,${svgCode}") no-repeat 50% 50%;
                }
                html, body, .extensions {
                    background: linear-gradient(135deg, #0a1b2a, #1a4036);
                    color: #ffffff;
                }
            `,
            crystal_cyan: `
                .navigation-bar__body {
                    background: rgba(10, 25, 40, 0.96);
                }
                .screensaver__preload,
                .activity__loader {
                    background: url("data:image/svg+xml,${svgCode}") no-repeat 50% 50%;
                }
                html, body, .extensions {
                    background: linear-gradient(135deg, #081822, #104059);
                    color: #ffffff;
                }
            `,
            deep_aurora: `
                .navigation-bar__body {
                    background: rgba(18, 34, 59, 0.96);
                }
                .screensaver__preload,
                .activity__loader {
                    background: url("data:image/svg+xml,${svgCode}") no-repeat 50% 50%;
                }
                html, body, .extensions {
                    background: linear-gradient(135deg, #1a102b, #0a1c3f);
                    color: #ffffff;
                }
            `,
            amber_noir: `
                .navigation-bar__body {
                    background: rgba(28, 18, 10, 0.96);
                }
                .screensaver__preload,
                .activity__loader {
                    background: url("data:image/svg+xml,${svgCode}") no-repeat 50% 50%;
                }
                html, body, .extensions {
                    background: linear-gradient(135deg, #1f0e04, #3b2a1e);
                    color: #ffffff;
                }
            `,
            velvet_sakura: `
                .navigation-bar__body {
                    background: rgba(56, 32, 45, 0.96);
                }
                .screensaver__preload,
                .activity__loader {
                    background: url("data:image/svg+xml,${svgCode}") no-repeat 50% 50%;
                }
                html, body, .extensions {
                    background: linear-gradient(135deg, #4b0e2b, #7c2a57);
                    color: #ffffff;
                }
            `,
            neon_pulse: `
                .navigation-bar__body {
                    background: rgba(10, 25, 40, 0.96);
                }
                .screensaver__preload,
                .activity__loader {
                    background: url("data:image/svg+xml,${svgCode}") no-repeat 50% 50%;
                }
                html, body, .extensions {
                    background: linear-gradient(135deg, #081822, #112380);
                    color: #ffffff;
                }
            `
        };

        style.html(themes[theme] || '');
        $('head').append(style);

        if (!onetime) {
            onetime = true;
            forall();
            removeFromSettingsMenu();
            fix_lang();
        }
    }

    function fix_lang() {
        Lampa.Lang.add({
            tv_status_returning_series: { ru: "Идет" },
            tv_status_planned: { ru: "Запланирован" },
            tv_status_in_production: { ru: "В производстве" },
            tv_status_ended: { ru: "Завершен" },
            tv_status_canceled: { ru: "Отменен" },
            tv_status_pilot: { ru: "Пилот" },
            tv_status_released: { ru: "Вышел" },
            tv_status_rumored: { ru: "По слухам" },
            tv_status_post_production: { ru: "Скоро" }
        });
    }

    function removeFromSettingsMenu() {
        Lampa.Settings.listener.follow('open', function (e) {
            if (e.name == 'interface') {
                e.body.find('[data-name="light_version"]').remove();
                e.body.find('[data-name="background"]').remove();
                e.body.find('[data-name="background_type"]').remove();
                e.body.find('[data-name="card_interfice_type"]').remove();
            }
        });

        Lampa.Storage.set('light_version', 'false');
        Lampa.Storage.set('background', 'false');
        Lampa.Storage.set('card_interfice_type', 'new');
    }

    function forall() {
        // Можна залишити шаблони як у твоєму файлі
    }

    function startPlugin() {
        var availableThemes = ['mint_dark', 'deep_aurora', 'crystal_cyan', 'neon_pulse', 'amber_noir', 'velvet_sakura', 'default'];
        Lampa.SettingsApi.addParam({
            component: 'interface',
            param: {
                name: 'maxsm_themes_selected',
                type: 'select',
                values: {
                    mint_dark: 'Mint Dark',
                    deep_aurora: 'Deep Aurora',
                    crystal_cyan: 'Crystal Cyan',
                    neon_pulse: 'Neon Pulse',
                    amber_noir: 'Amber Noir',
                    velvet_sakura: 'Velvet Sakura',
                    default: 'LAMPA'
                },
                "default": 'Mint Dark'
            },
            field: {
                name: Lampa.Lang.translate('maxsm_themes'),
                description: ''
            },
            onChange: function (value) {
                maxsm_themes.settings.theme = value;
                Lampa.Settings.update();
                applyTheme(value);
            }
        });

        Lampa.Settings.listener.follow('open', function (e) {
            if (e.name == 'interface') {
                $("div[data-name=interface_size]").after($("div[data-name=maxsm_themes_selected]"));
            }
        });

        var savedTheme = Lampa.Storage.get('maxsm_themes_selected', 'mint_dark');
        if (availableThemes.indexOf(savedTheme) === -1) {
            Lampa.Storage.set('maxsm_themes_selected', 'mint_dark');
            savedTheme = 'mint_dark';
        }
        maxsm_themes.settings.theme = savedTheme;
        applyTheme(maxsm_themes.settings.theme);
    }

    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') startPlugin();
        });
    }

    Lampa.Manifest.plugins = {
        name: 'maxsm_themes',
        version: '2.5.1',
        description: 'maxsm_themes with crescent loader'
    };

    window.maxsm_themes = maxsm_themes;
})();
          
