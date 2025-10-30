(function() {
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
        version: '2.5.0',
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
        console.log('Applying theme:', theme);
        
        // Удаляем предыдущие стили темы
        $('#maxsm_interface_mod_theme').remove();

        if (prevtheme !== '' && ((prevtheme === 'default' && theme !== 'default') || (prevtheme !== 'default' && theme === 'default'))) {
            window.location.reload();
        }

        prevtheme = theme;

        // Если выбрано "Нет", просто удаляем стили
        if (theme === 'default') return;

        var color = loaderColors[theme] || loaderColors["default"];

        // ПРОСТОЙ ЛОАДЕР ДЛЯ ТЕСТУ - заміни пізніше на місяць
        var svgCode = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <circle cx="50" cy="50" r="40" stroke="${color}" stroke-width="8" fill="none">
    <animate attributeName="stroke-dasharray" values="0,250;250,0;0,250" dur="2s" repeatCount="indefinite"/>
  </circle>
</svg>`;

        var encodedSvg = encodeURIComponent(svgCode.replace(/\s+/g, ' ').trim());

        // Создаем новый стиль
        var style = $('<style id="maxsm_interface_mod_theme"></style>');

        // БАЗОВІ СТИЛІ ДЛЯ ЛОАДЕРА
        var loaderStyles = `
            .activity__loader {
                background: url("data:image/svg+xml,${encodedSvg}) no-repeat center center !important;
                background-size: 60px 60px !important;
            }
            .screensaver__preload {
                background: url("data:image/svg+xml,${encodedSvg}) no-repeat center center !important;
                background-size: 80px 80px !important;
            }
            .activity__loader:before,
            .activity__loader:after {
                display: none !important;
            }
        `;

        // Определяем стили для разных тем
        var themes = {
            mint_dark: loaderStyles + `
                .navigation-bar__body { background: rgba(18, 32, 36, 0.96) !important; }
                html, body, .extensions { background: linear-gradient(135deg, #0a1b2a, #1a4036) !important; color: #ffffff !important; }
                .card__quality, .card__type::after { background: linear-gradient(to right, #1e6262, #3da18d) !important; }
                .search-source.focus, .simple-button.focus, .menu__item.focus { background: linear-gradient(to right, #1e6262, #3da18d) !important; color: #fff !important; }
                .modal__content { background: rgba(18, 32, 36, 0.96) !important; }
            `,
            crystal_cyan: loaderStyles + `
                .navigation-bar__body { background: rgba(10, 25, 40, 0.96) !important; }
                html, body, .extensions { background: linear-gradient(135deg, #081822, #104059) !important; color: #ffffff !important; }
                .card__quality, .card__type::after { background: linear-gradient(to right, #00d2ff, #3a8ee6) !important; }
                .search-source.focus, .simple-button.focus, .menu__item.focus { background: linear-gradient(to right, #00d2ff, #3a8ee6) !important; color: #fff !important; }
                .modal__content { background: rgba(10, 25, 40, 0.96) !important; }
            `,
            deep_aurora: loaderStyles + `
                .navigation-bar__body { background: rgba(18, 34, 59, 0.96) !important; }
                html, body, .extensions { background: linear-gradient(135deg, #1a102b, #0a1c3f) !important; color: #ffffff !important; }
                .card__quality, .card__type::after { background: linear-gradient(to right, #2c6fc1, #7e7ed9) !important; }
                .search-source.focus, .simple-button.focus, .menu__item.focus { background: linear-gradient(to right, #2c6fc1, #7e7ed9) !important; color: #fff !important; }
                .modal__content { background: rgba(18, 34, 59, 0.96) !important; }
            `
        };

        // Устанавливаем стили для выбранной темы
        style.html(themes[theme] || '');

        // Добавляем стиль в head
        $('head').append(style);

        console.log('Theme applied successfully');

        if (onetime === false) {
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
        Lampa.Settings.listener.follow('open', function(e) {
            if (e.name == 'interface') {
                e.body.find('[data-name="light_version"]').remove();
                e.body.find('[data-name="background"]').remove();
                e.body.find('[data-name="background_type"]').remove();
                e.body.find('[data-name="card_interfice_type"]').remove();
                e.body.find('[data-name="glass_style"]').prev('.settings-param-title').remove();
                e.body.find('[data-name="glass_style"]').remove();
                e.body.find('[data-name="glass_opacity"]').remove();
                e.body.find('[data-name="card_interfice_poster"]').prev('.settings-param-title').remove();
                e.body.find('[data-name="card_interfice_poster"]').remove();
                e.body.find('[data-name="card_interfice_cover"]').remove();
                e.body.find('[data-name="advanced_animation"]').remove();
            }
        });
        
        Lampa.Storage.set('light_version', 'false');
        Lampa.Storage.set('background', 'false');
        Lampa.Storage.set('card_interfice_type', 'new');
        Lampa.Storage.set('glass_style', 'false');
        Lampa.Storage.set('card_interfice_poster', 'false');
        Lampa.Storage.set('card_interfice_cover', 'true');
        Lampa.Storage.set('advanced_animation', 'false');
    }

    function forall() {
        var tv_caption = Lampa.Lang.translate('maxsm_themes_tvcaption');
        var style = `
        <style id="maxsm_interface_mod_theme_forall">
            .card__age {
                position: absolute;
                right: 0em;
                bottom: 0em;
                z-index: 10;
                background: rgba(0, 0, 0, 0.6);
                color: #ffffff;
                font-weight: 700;
                padding: 0.4em 0.6em;
                border-radius: 0.48em 0 0.48em 0;
                line-height: 1.0;
                font-size: 1.0em;
            }
            .card__type::after {
                content: '${tv_caption}';
                color: #fff;
                position: absolute;
                left: 0;
                top: 0;
                padding: 0.4em 0.6em;
                border-radius: 0.4em 0 0.4em 0;
                font-weight: 700;
            }
        </style>`;
        $('head').append(style);
    }

    function startPlugin() {
        console.log('Starting maxsm_themes plugin');
        
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
                "default": 'mint_dark'
            },
            field: {
                name: Lampa.Lang.translate('maxsm_themes'),
                description: ''
            },
            onChange: function onChange(value) {
                console.log('Theme changed to:', value);
                maxsm_themes.settings.theme = value;
                Lampa.Storage.set('maxsm_themes_selected', value);
                applyTheme(value);
            }
        });

        Lampa.Settings.listener.follow('open', function(e) {
            if (e.name == 'interface') {
                $("div[data-name=interface_size]").after($("div[data-name=maxsm_themes_selected]"));
            }
        });

        // Применяем настройки
        var savedTheme = Lampa.Storage.get('maxsm_themes_selected', 'mint_dark');
        console.log('Saved theme:', savedTheme);
        maxsm_themes.settings.theme = savedTheme;
        applyTheme(savedTheme);
    }

    // Ждем загрузки приложения
    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', function(event) {
            if (event.type === 'ready') {
                startPlugin();
            }
        });
    }

    Lampa.Manifest.plugins = {
        name: 'maxsm_themes',
        version: '2.5.0',
        description: 'maxsm_themes'
    };

    window.maxsm_themes = maxsm_themes;
})();
