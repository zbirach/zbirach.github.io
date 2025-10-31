/*
 maxsm_themes_test.js
 Повна версія плагіна: всі початкові шаблони, стилі і логіка з доданою темою Lime Energy.
 Залишено стандартний SVG-лоадер з GitHub (moon.svg).
*/
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

    // Основной объект плагина
    var maxsm_themes = {
        name: 'maxsm_themes',
        version: '2.7.0',
        settings: {
            theme: 'mint_dark'
        }
    };

    var prevtheme = '';
    var onetime = false;

    // Цвета loader'а для каждой темы
    var loaderColors = {
        "default": '#fff',
        violet_blue: '#6a11cb',
        mint_dark: '#3da18d',
        deep_aurora: '#7e7ed9',
        crystal_cyan: '#7ed0f9',
        neon_pulse: '#29ccb4',
        amber_noir: '#f4a261',
        velvet_sakura: '#f6a5b0',
        lime_energy: '#9eff3a' // новая салатовая тема
    };

    // SVG URL (с сохранённым moon.svg на GitHub)
    var svgUrl = "https://raw.githubusercontent.com/zbirach/zbirach.github.io/main/loader/moon.svg";

    // Применение темы (создаём/обновляем <style id="maxsm_interface_mod_theme">)
    function applyTheme(theme) {
        $('#maxsm_interface_mod_theme').remove();

        // Перезагрузка при переключении между default и non-default (как в оригинале)
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

        // Если выбран default — ничего не добавляем (возвращаемся к стоковым стилям)
        if (theme === 'default') {
            // уберём стили меню и для безопасности вернём стандартные значения
            $('#maxsm_interface_mod_theme_forall').remove();
            return;
        }

        var color = loaderColors[theme] || loaderColors["default"];

        var style = $('<style id="maxsm_interface_mod_theme"></style>');

        var loaderStyles = `
/* Лоадер */
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

        // Полные стили для каждой темы (включая настройки меню и карточек)
        // Они включают: фон приложения, фокусные градиенты, фон элементов, плашки качества, позиционирование года и рейтинга и фон меню настроек
        var themes = {};

        // helper: общие правила для позиции года/рейтинга/качества (восстановлены как в старом плагине)
        var commonCardPlacement = `
/* Позиция года (внизу справа) */
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

/* Рейтинг (вверху справа) */
.card__vote {
  position: absolute;
  top: 0em;
  right: 0em;
  background: rgba(0, 0, 0, 0.6);
  font-weight: 700;
  color: #fff;
  border-radius: 0 0.34em 0 0.34em;
  line-height: 1.0;
  font-size: 1.1em;
  padding: 0.26em 0.5em;
}

/* Плашка качества (внизу слева) */
.card__quality {
  position: absolute;
  left: 0em;
  bottom: 0em;
  padding: 0.2em 0.3em;
  color: #fff;
  font-weight: 700;
  font-size: 0.9em;
  border-radius: 0 0.5em 0.5em 0;
  text-transform: uppercase;
}
`;

        // mint_dark (примерно как в старом)
        themes.mint_dark = loaderStyles + `
.navigation-bar__body {background: rgba(18, 32, 36, 0.96);}
.card__quality, .card__type::after {background: linear-gradient(to right, #1e6262, #3da18d); color:#fff;}
html, body, .extensions {background: linear-gradient(135deg, #0a1b2a, #1a4036); color: #ffffff;}
.company-start.icon--broken .company-start__icon,
.explorer-card__head-img > img,
.bookmarks-folder__layer,
.card-more__box,
.card__img,
.extensions__block-add,
.extensions__item {
    background-color: #1e2c2f;
}
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
    background: linear-gradient(to right, #1e6262, #3da18d);
    color: #fff;
    box-shadow: 0 0 0.6em rgba(61,161,141,0.08);
}
` + commonCardPlacement + `
/* Настройки: фон под тему */
.settings__content,
.settings-input__content,
.selectbox__content,
.settings-input {
  background: linear-gradient(135deg,#0a1b2a,#1a4036) !important;
}
`;

        // deep_aurora
        themes.deep_aurora = loaderStyles + `
.navigation-bar__body {background: rgba(18, 34, 59, 0.96);}
.card__quality, .card__type::after {background: linear-gradient(to right, #2c6fc1, #7e7ed9); color:#fff;}
html, body, .extensions {background: linear-gradient(135deg, #1a102b, #0a1c3f); color: #ffffff;}
.company-start.icon--broken .company-start__icon,
.explorer-card__head-img > img,
.bookmarks-folder__layer,
.card-more__box,
.card__img,
.extensions__block-add,
.extensions__item { background-color: #171f3a; }
.search-source.focus, .simple-button.focus, .menu__item.focus, .menu__item.traverse, .menu__item.hover,
.full-start__button.focus, .full-descr__tag.focus, .player-panel .button.focus { background: linear-gradient(to right,#2c6fc1,#7e7ed9); color:#fff; box-shadow: 0 0 0.6em rgba(126,126,217,0.06);}
` + commonCardPlacement + `
.settings__content,
.settings-input__content,
.selectbox__content,
.settings-input {
  background: linear-gradient(135deg,#1a102b,#0a1c3f) !important;
}
`;

        // crystal_cyan
        themes.crystal_cyan = loaderStyles + `
.navigation-bar__body {background: rgba(10, 25, 40, 0.96);}
.card__quality, .card__type::after {background: linear-gradient(to right, #00d2ff, #3a8ee6); color:#fff;}
html, body, .extensions {background: linear-gradient(135deg, #081822, #104059); color: #ffffff;}
.company-start.icon--broken .company-start__icon,
.explorer-card__head-img > img,
.bookmarks-folder__layer,
.card-more__box,
.card__img,
.extensions__block-add,
.extensions__item { background-color: #112b3a; }
.search-source.focus, .simple-button.focus, .menu__item.focus { background: linear-gradient(to right,#00d2ff,#3a8ee6); color:#fff; box-shadow: 0 0 0.6em rgba(72,216,255,0.06);}
` + commonCardPlacement + `
.settings__content,
.settings-input__content,
.selectbox__content,
.settings-input {
  background: linear-gradient(135deg,#081822,#104059) !important;
}
`;

        // neon_pulse
        themes.neon_pulse = loaderStyles + `
.navigation-bar__body {background: rgba(10, 25, 40, 0.96);}
.card__quality, .card__type::after {background: linear-gradient(to right, #00d2ff, #3a8ee6); color:#fff;}
html, body, .extensions {background: linear-gradient(135deg, #081822, #112380); color: #ffffff;}
.company-start.icon--broken .company-start__icon,
.explorer-card__head-img > img,
.bookmarks-folder__layer,
.card-more__box,
.card__img,
.extensions__block-add,
.extensions__item { background-color: #112380; }
.search-source.focus, .simple-button.focus, .menu__item.focus { background: linear-gradient(to right,#00d2ff,#3a8ee6); color:#fff; box-shadow: 0 0 0.6em rgba(72,216,255,0.06);}
` + commonCardPlacement + `
.settings__content,
.settings-input__content,
.selectbox__content,
.settings-input {
  background: linear-gradient(135deg,#081822,#112380) !important;
}
`;

        // amber_noir
        themes.amber_noir = loaderStyles + `
.navigation-bar__body {background: rgba(28, 18, 10, 0.96);}
.card__quality, .card__type::after {background: linear-gradient(to right, #f4a261, #e76f51); color:#fff;}
html, body, .extensions {background: linear-gradient(135deg, #1f0e04, #3b2a1e); color: #ffffff;}
.company-start.icon--broken .company-start__icon,
.explorer-card__head-img > img,
.bookmarks-folder__layer,
.card-more__box,
.card__img,
.extensions__block-add,
.extensions__item { background-color: #2a1c11; }
.search-source.focus, .simple-button.focus, .menu__item.focus { background: linear-gradient(to right,#f4a261,#e76f51); color:#fff; box-shadow: 0 0 0.6em rgba(244,162,97,0.06);}
` + commonCardPlacement + `
.settings__content,
.settings-input__content,
.selectbox__content,
.settings-input {
  background: linear-gradient(135deg,#1f0e04,#3b2a1e) !important;
}
`;

        // velvet_sakura
        themes.velvet_sakura = loaderStyles + `
.navigation-bar__body {background: rgba(56, 32, 45, 0.96);}
.card__quality, .card__type::after {background: linear-gradient(to right, #f6a5b0, #f9b8d3); color:#fff;}
html, body, .extensions {background: linear-gradient(135deg, #4b0e2b, #7c2a57); color: #ffffff;}
.company-start.icon--broken .company-start__icon,
.explorer-card__head-img > img,
.bookmarks-folder__layer,
.card-more__box,
.card__img,
.extensions__block-add,
.extensions__item { background-color: #5c0f3f; }
.search-source.focus, .simple-button.focus, .menu__item.focus { background: linear-gradient(to right,#f6a5b0,#f9b8d3); color:#fff; box-shadow: 0 0 0.6em rgba(246,165,176,0.06);}
` + commonCardPlacement + `
.settings__content,
.settings-input__content,
.selectbox__content,
.settings-input {
  background: linear-gradient(135deg,#4b0e2b,#7c2a57) !important;
}
`;

        // lime_energy (новая ярко-салатовая тема)
        themes.lime_energy = loaderStyles + `
.navigation-bar__body {background: rgba(20, 30, 10, 0.96);}
.card__quality, .card__type::after {background: linear-gradient(to right, #a8ff60, #64ff3d); color:#000;}
html, body, .extensions {background: linear-gradient(135deg, #142d0b, #1b5e20); color: #ffffff;}
.company-start.icon--broken .company-start__icon,
.explorer-card__head-img > img,
.bookmarks-folder__layer,
.card-more__box,
.card__img,
.extensions__block-add,
.extensions__item { background-color: #193a16; }
.search-source.focus, .simple-button.focus, .menu__item.focus, .menu__item.traverse, .menu__item.hover,
.full-start__button.focus, .full-descr__tag.focus, .player-panel .button.focus {
  background: linear-gradient(to right, #a8ff60, #64ff3d);
  color: #000;
  box-shadow: 0 0 0.6em rgba(160,255,80,0.06);
}
` + commonCardPlacement + `
/* Настройки: фон под цвет темы (с более мягкой подсветкой) */
.settings__content,
.settings-input__content,
.selectbox__content,
.settings-input {
  background: linear-gradient(135deg,#142d0b,#1b5e20) !important;
  color: #fff !important;
}

/* Привести элементы меню настроек в тон темы */
.settings .settings-param-title,
.settings .settings-param-field {
  color: #fff !important;
}
`;

        // Если тема не найдена — пустая строка (безопасно)
        style.html(themes[theme] || '');

        $('head').append(style);

        // Один раз: доп. шаблоны и правки
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

    // Прячем конфликтные опции из настроек интерфейса (как в старом плагине)
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

        // Принудительные значения, чтобы темы выглядели согласовано
        Lampa.Storage.set('light_version', 'false');
        Lampa.Storage.set('background', 'false');
        Lampa.Storage.set('card_interfice_type', 'new');
        Lampa.Storage.set('glass_style', 'false');
        Lampa.Storage.set('card_interfice_poster', 'false');
        Lampa.Storage.set('card_interfice_cover', 'true');
        Lampa.Storage.set('advanced_animation', 'false');
    }

    // Полные шаблоны и дополнительные общие правки (взято из оригинального плагина)
    function forall() {
        // Шаблон карточки — год над названием (но позиция .card__age контролируется стилями выше и будет внизу справа)
        Lampa.Template.add('card', "<div class=\"card selector layer--visible layer--render\">\n    <div class=\"card__view\">\n        <img src=\"./img/img_load.svg\" class=\"card__img\" />\n\n        <div class=\"card__icons\">\n            <div class=\"card__icons-inner\"></div>\n        </div>\n        <div class=\"card__age\">{release_year}</div>\n    </div>\n\n    <div class=\"card__title\">{title}</div>\n</div>");

        // Шаблон card_episode (с годом и названием)
        Lampa.Template.add('card_episode', "<div class=\"card-episode selector layer--visible layer--render\">\n    <div class=\"card-episode__body\">\n        <div class=\"full-episode\">\n            <div class=\"full-episode__img\">\n                <img />\n            </div>\n            <div class=\"full-episode__body\">\n                <div class=\"card__title\">{title}</div>\n                <div class=\"card__age\">{release_year}</div>\n                <div class=\"full-episode__num hide\">{num}</div>\n                <div class=\"full-episode__name\">{name}</div>\n                <div class=\"full-episode__date\">{date}</div>\n            </div>\n        </div>\n    </div>\n    <div class=\"card-episode__footer hide\">\n        <div class=\"card__imgbox\">\n            <div class=\"card__view\">\n                <img class=\"card__img\" />\n            </div>\n        </div>\n\n        <div class=\"card__left\">\n            <div class=\"card__title\">{title}</div>\n            <div class=\"card__age\">{release_year}</div>\n        </div>\n    </div>\n</div>");

        // Добавим CSS, который дополняет наши темы — много правил из оригинала
        var tv_caption = Lampa.Lang.translate('maxsm_themes_tvcaption');

        var style = "\n<style id=\"maxsm_interface_mod_theme_forall\">\n" +
            // Мобильная центровка описаний
            "@media screen and (max-width: 480px) { .full-start-new__head, .full-start-new__title, .full-start__title-original, .full-start__rate, .full-start-new__reactions, .full-start-new__rate-line, .full-start-new__buttons, .full-start-new__details, .full-start-new__tagline { -webkit-justify-content: center; justify-content: center; text-align: center; max-width: 100%; }}\n" +
            // Скругления и визуальные мелочи
            ".selectbox-item__checkbox { border-radius: 100% }\n" +
            ".selectbox-item--checked .selectbox-item__checkbox { background: #ccc; }\n" +
            ".card__title { height: 3.6em; text-overflow: ellipsis; -webkit-line-clamp: 3; line-clamp: 3; overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; }\n" +
            ".card__icons { position: absolute; top: 2em; left: 0; display:flex; justify-content:center; background: rgba(0,0,0,0.6); color: #fff; border-radius: 0 0.5em 0.5em 0; }\n" +
            ".card__marker { position:absolute; left:0; top:4em; background: rgba(0,0,0,0.6); border-radius: 0 0.5em 0.5em 0; padding:0.4em 0.6em; color:#fff; font-weight:700; font-size:1.0em; }\n" +
            ".items-line.items-line--type-cards + .items-line.items-line--type-cards { margin-top:1em; }\n" +
            ".card--small .card__view { margin-bottom:2em; }\n" +
            ".items-line--type-cards { min-height: 18em; }\n" +
            ".card { transform: scale(1); transition: transform 0.3s ease; }\n" +
            ".card.focus { transform: scale(1.03); }\n" +
            ".menu__item.focus { border-radius: 0 0.5em 0.5em 0; }\n" +
            ".menu__list { padding-left: 0em; }\n" +
            ".menu__item.focus .menu__ico { filter: invert(1); }\n" +
            ".full-start__pg, .full-start__status { font-size:1em; background:#fff; color:#000; }\n" +
            ".full-start__rate { border-radius: 0.25em; padding:0.3em; background-color: rgba(0,0,0,0.3); }\n" +
            ".card__quality { box-sizing: border-box; }\n" +
            ".card__vote { box-sizing: border-box; }\n" +
            // Тип (Сериал) - заменяем через псевдоэлемент
            ".card__type { color: transparent; }\n" +
            ".card__type::after { content: '" + tv_caption + "'; color: #fff; position: absolute; left: 0; top: 0; padding: 0.4em 0.6em; border-radius: 0.4em 0 0.4em 0; font-weight: 700; }\n" +
            // Прочие стили
            ".full-start__background.loaded { opacity: 0.8; }\n" +
            ".full-start__background.dim { opacity: 0.2; }\n" +
            ".explorer__files .torrent-filter .simple-button { font-size: 1.2em; border-radius: 0.5em; }\n" +
            ".full-review-add, .full-review, .extensions__item, .extensions__block-add, .search-source, .bookmarks-folder__layer, .card__img, .card__promo, .full-episode--next .full-episode__img:after, .full-episode__img img, .full-episode__body, .full-person__photo, .card-more__box, .full-start__button, .simple-button, .register { border-radius: 0.5em; }\n" +
            ".card__icons-inner { background: rgba(0,0,0,0); }\n" +
            "</style>\n";

        Lampa.Template.add('card_css', style);
        $('body').append(Lampa.Template.get('card_css', {}, true));
    }

    // Инициализация и добавление параметра в интерфейс настроек
    function startPlugin() {
        var availableThemes = ['mint_dark', 'deep_aurora', 'crystal_cyan', 'neon_pulse', 'amber_noir', 'velvet_sakura', 'lime_energy', 'default'];

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
                "default": 'Mint Dark'
            },
            field: {
                name: Lampa.Lang.translate('maxsm_themes'),
                description: ''
            },
            onChange: function onChange(value) {
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

        // Применяем сохранённую тему или селектируем по умолчанию
        var savedTheme = Lampa.Storage.get('maxsm_themes_selected', 'mint_dark');
        if (availableThemes.indexOf(savedTheme) === -1) {
            Lampa.Storage.set('maxsm_themes_selected', 'mint_dark');
            savedTheme = 'mint_dark';
        }
        maxsm_themes.settings.theme = savedTheme;
        applyTheme(maxsm_themes.settings.theme);
    }

    // Запуск плагина при готовности приложения
    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', function(event) {
            if (event.type === 'ready') {
                startPlugin();
            }
        });
    }

    // Регистрация плагина в манефесте (как в исходнике)
    Lampa.Manifest.plugins = {
        name: 'maxsm_themes',
        version: maxsm_themes.version,
        description: 'MaxSM Interface Themes'
    };

    // Экспортируем объект плагина
    window.maxsm_themes = maxsm_themes;
})();
