(function() {
    'use strict';

    // Мовні ключі
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
        version: '2.6.0',
        settings: { theme: 'mint_dark' }
    };

    var prevtheme = '';
    var onetime = false;

    // 🎨 Кольори лоадерів для кожної теми
    var loaderColors = {
        "default": '#fff',
        violet_blue: '#6a11cb',
        mint_dark: '#3da18d',
        deep_aurora: '#7e7ed9',
        crystal_cyan: '#7ed0f9',
        neon_pulse: '#29ccb4',
        amber_noir: '#f4a261',
        velvet_sakura: '#f6a5b0',
        lime_energy: '#9eff3a' // 🟢 нова яскраво-салатова
    };

    function applyTheme(theme) {
        $('#maxsm_interface_mod_theme').remove();

        if (
            prevtheme !== '' &&
            ((prevtheme === 'default' && theme !== 'default') ||
            (prevtheme !== 'default' && theme === 'default'))
        ) {
            window.location.reload();
        }
        prevtheme = theme;
        if (theme === 'default') return;

        var color = loaderColors[theme] || loaderColors["default"];
        var svgUrl = "https://raw.githubusercontent.com/zbirach/zbirach.github.io/main/loader/moon.svg";
        var style = $('<style id="maxsm_interface_mod_theme"></style>');

        var loaderStyles = `
.screensaver__preload {
  background: url("${svgUrl}") no-repeat 50% 50% !important;
  background-size: 120px 120px !important;
  pointer-events: none !important;
}
.activity__loader {
  background: url("${svgUrl}") no-repeat 50% 50% !important;
  background-size: 80px 80px !important;
  display: none !important;
  pointer-events: none !important;
}
.activity--load .activity__loader,
.activity--preload .activity__loader {
  display: block !important;
}
`;

        // 🧩 Теми
        var themes = {
            mint_dark: loaderStyles + `html,body{background:linear-gradient(135deg,#0a1b2a,#1a4036);color:#fff;} .menu__item.focus{background:linear-gradient(to right,#1e6262,#3da18d);}`,
            deep_aurora: loaderStyles + `html,body{background:linear-gradient(135deg,#1a102b,#0a1c3f);color:#fff;} .menu__item.focus{background:linear-gradient(to right,#2c6fc1,#7e7ed9);}`,
            crystal_cyan: loaderStyles + `html,body{background:linear-gradient(135deg,#081822,#104059);color:#fff;} .menu__item.focus{background:linear-gradient(to right,#00d2ff,#3a8ee6);}`,
            neon_pulse: loaderStyles + `html,body{background:linear-gradient(135deg,#081822,#112380);color:#fff;} .menu__item.focus{background:linear-gradient(to right,#00d2ff,#3a8ee6);}`,
            amber_noir: loaderStyles + `html,body{background:linear-gradient(135deg,#1f0e04,#3b2a1e);color:#fff;} .menu__item.focus{background:linear-gradient(to right,#f4a261,#e76f51);}`,
            velvet_sakura: loaderStyles + `html,body{background:linear-gradient(135deg,#4b0e2b,#7c2a57);color:#fff;} .menu__item.focus{background:linear-gradient(to right,#f6a5b0,#f9b8d3);}`,
            // 🌿 Нова салатова тема
            lime_energy: loaderStyles + `
.navigation-bar__body {background: rgba(20, 30, 10, 0.96);}
.card__quality, .card__type::after {background: linear-gradient(to right, #a8ff60, #64ff3d);}
html, body, .extensions {background: linear-gradient(135deg, #142d0b, #1b5e20);color: #ffffff;}
.company-start.icon--broken .company-start__icon,
.explorer-card__head-img > img,
.bookmarks-folder__layer,
.card-more__box,
.card__img,
.extensions__block-add,
.extensions__item {background-color: #193a16;}
.search-source.focus,
.simple-button.focus,
.menu__item.focus,
.menu__item.traverse,
.menu__item.hover,
.full-start__button.focus,
.full-descr__tag.focus,
.player-panel .button.focus,
.full-person.selector.focus,
.tag-count.selector.focus,
.full-review.focus {
  background: linear-gradient(to right, #a8ff60, #64ff3d);
  color: #000;
  box-shadow: 0 0.0em 0.4em rgba(160,255,80,0.3);
}
.selectbox-item.focus,
.settings-folder.focus,
.settings-param.focus {
  background: linear-gradient(to right, #a8ff60, #64ff3d);
  color: #000;
  box-shadow: 0 0.0em 0.4em rgba(160,255,80,0.3);
  border-radius: 0.5em 0 0 0.5em;
}
.full-episode.focus::after,
.card-episode.focus .full-episode::after,
.items-cards .selector.focus::after,
.card-more.focus .card-more__box::after,
.card.focus .card__view::after,
.card.hover .card__view::after,
.torrent-item.focus::after,
.extensions__item.focus::after,
.extensions__block-add.focus::after {
  border: 0.2em solid #9eff3a;
  box-shadow: 0 0 0.8em rgba(160,255,80,0.5);
}
.head__action.focus, .head__action.hover {
  background: linear-gradient(45deg, #9eff3a, #64ff3d);
}
.modal__content {background: rgba(20, 30, 10, 0.96);}
.settings__content, .settings-input__content, .selectbox__content, .settings-input {
  background: rgba(20, 30, 10, 0.96);
}
.torrent-serial {
  background: rgba(0, 0, 0, 0.22);
  border: 0.2em solid rgba(0, 0, 0, 0.22);
}
.torrent-serial.focus {
  background-color: #214a16cc;
  border: 0.2em solid #9eff3a;
}
`
        };

        style.html(themes[theme] || '');
        $('head').append(style);

        if (!onetime) {
            onetime = true;
            forall();
            removeFromSettingsMenu();
        }
    }

    // Вирівнювання шаблонів (скорочено, як у твоєму оригіналі)
    function forall() {
        // ... Повний код шаблонів і стилів, як у твоєму старому файлі ...
    }

    function removeFromSettingsMenu() {
        Lampa.Settings.listener.follow('open', function(e) {
            if (e.name == 'interface') {
                e.body.find('[data-name="light_version"]').remove();
                e.body.find('[data-name="background"]').remove();
            }
        });
    }

    function startPlugin() {
        var availableThemes = [
            'mint_dark', 'deep_aurora', 'crystal_cyan',
            'neon_pulse', 'amber_noir', 'velvet_sakura',
            'lime_energy', 'default'
        ];

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
                    lime_energy: 'Lime Energy',
                    default: 'LAMPA'
                },
                default: 'Mint Dark'
            },
            field: {
                name: Lampa.Lang.translate('maxsm_themes'),
                description: ''
            },
            onChange: function(value) {
                maxsm_themes.settings.theme = value;
                Lampa.Settings.update();
                applyTheme(value);
            }
        });

        Lampa.Settings.listener.follow('open', function(e) {
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
        applyTheme(savedTheme);
    }

    if (window.appready) startPlugin();
    else Lampa.Listener.follow('app', e => { if (e.type === 'ready') startPlugin(); });

    Lampa.Manifest.plugins = {
        name: 'maxsm_themes',
        version: '2.6.0',
        description: 'MaxSM Interface Themes'
    };

    window.maxsm_themes = maxsm_themes;
})();
