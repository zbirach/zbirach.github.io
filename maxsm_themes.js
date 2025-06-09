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

    // Основной объект плагина
    var maxsm_themes = {
        // Название плагина
        name: 'maxsm_themes',
        // Версия плагина
        version: '2.5.0',
        // Настройки по умолчанию
        settings: {
            theme: 'mint_dark'
        }
    };

    // Была ли предыдущая тема стоковая
    var prevtheme = '';
    // Запускаем только один раз
    var onetime = false;

    // Цвета loader'а для каждой темы
    var loaderColors = {
        "default": '#fff',
        violet_blue: '#6a11cb',
        mint_dark: '#3da18d',
        deep_aurora: '#7e7ed9',
        crystal_cyan: '#7ed0f9',
        amber_noir: '#f4a261',
        velvet_sakura: '#f6a5b0'
    };

    // Функция для применения тем
    function applyTheme(theme) {
        // Удаляем предыдущие стили темы
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

        // Если выбрано "Нет", просто удаляем стили
        if (theme === 'default') return;

        var color = loaderColors[theme] || loaderColors["default"];

        var svgCode = encodeURIComponent("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"135\" height=\"140\" fill=\"".concat(color, "\"><rect width=\"10\" height=\"40\" y=\"100\" rx=\"6\"><animate attributeName=\"height\" begin=\"0s\" calcMode=\"linear\" dur=\"1s\" repeatCount=\"indefinite\" values=\"40;100;40\" keyTimes=\"0;0.5;1\"/><animate attributeName=\"y\" begin=\"0s\" calcMode=\"linear\" dur=\"1s\" repeatCount=\"indefinite\" values=\"100;40;100\" keyTimes=\"0;0.5;1\"/></rect><rect width=\"10\" height=\"40\" x=\"20\" y=\"100\" rx=\"6\"><animate attributeName=\"height\" begin=\"0.2s\" calcMode=\"linear\" dur=\"1s\" repeatCount=\"indefinite\" values=\"40;100;40\" keyTimes=\"0;0.5;1\"/><animate attributeName=\"y\" begin=\"0.2s\" calcMode=\"linear\" dur=\"1s\" repeatCount=\"indefinite\" values=\"100;40;100\" keyTimes=\"0;0.5;1\"/></rect><rect width=\"10\" height=\"40\" x=\"40\" y=\"100\" rx=\"6\"><animate attributeName=\"height\" begin=\"0.4s\" calcMode=\"linear\" dur=\"1s\" repeatCount=\"indefinite\" values=\"40;100;40\" keyTimes=\"0;0.5;1\"/><animate attributeName=\"y\" begin=\"0.4s\" calcMode=\"linear\" dur=\"1s\" repeatCount=\"indefinite\" values=\"100;40;100\" keyTimes=\"0;0.5;1\"/></rect><rect width=\"10\" height=\"40\" x=\"60\" y=\"100\" rx=\"6\"><animate attributeName=\"height\" begin=\"0.6s\" calcMode=\"linear\" dur=\"1s\" repeatCount=\"indefinite\" values=\"40;100;40\" keyTimes=\"0;0.5;1\"/><animate attributeName=\"y\" begin=\"0.6s\" calcMode=\"linear\" dur=\"1s\" repeatCount=\"indefinite\" values=\"100;40;100\" keyTimes=\"0;0.5;1\"/></rect><rect width=\"10\" height=\"40\" x=\"80\" y=\"100\" rx=\"6\"><animate attributeName=\"height\" begin=\"0.8s\" calcMode=\"linear\" dur=\"1s\" repeatCount=\"indefinite\" values=\"40;100;40\" keyTimes=\"0;0.5;1\"/><animate attributeName=\"y\" begin=\"0.8s\" calcMode=\"linear\" dur=\"1s\" repeatCount=\"indefinite\" values=\"100;40;100\" keyTimes=\"0;0.5;1\"/></rect><rect width=\"10\" height=\"40\" x=\"100\" y=\"100\" rx=\"6\"><animate attributeName=\"height\" begin=\"1s\" calcMode=\"linear\" dur=\"1s\" repeatCount=\"indefinite\" values=\"40;100;40\" keyTimes=\"0;0.5;1\"/><animate attributeName=\"y\" begin=\"1s\" calcMode=\"linear\" dur=\"1s\" repeatCount=\"indefinite\" values=\"100;40;100\" keyTimes=\"0;0.5;1\"/></rect><rect width=\"10\" height=\"40\" x=\"120\" y=\"100\" rx=\"6\"><animate attributeName=\"height\" begin=\"1.2s\" calcMode=\"linear\" dur=\"1s\" repeatCount=\"indefinite\" values=\"40;100;40\" keyTimes=\"0;0.5;1\"/><animate attributeName=\"y\" begin=\"1.2s\" calcMode=\"linear\" dur=\"1s\" repeatCount=\"indefinite\" values=\"100;40;100\" keyTimes=\"0;0.5;1\"/></rect></svg>"));


        // Создаем новый стиль
        var style = $('<style id="maxsm_interface_mod_theme"></style>');

        // Определяем стили для разных тем
        var themes = {
            mint_dark: "\n.navigation-bar__body\n{background: rgba(18, 32, 36, 0.96);\n}\n.card__quality,\n .card__type::after  {\nbackground: linear-gradient(to right, #1e6262dd, #3da18ddd);\n}\n.screensaver__preload {\nbackground:url(\"data:image/svg+xml,".concat(svgCode, "\") no-repeat 50% 50%\n}\n.activity__loader {\nposition:absolute;\ntop:0;\nleft:0;\nwidth:100%;\nheight:100%;\ndisplay:none;\nbackground:url(\"data:image/svg+xml,").concat(svgCode, "\") no-repeat 50% 50%\n \n}\nhtml, body, .extensions\n {\nbackground: linear-gradient(135deg, #0a1b2a, #1a4036);\ncolor: #ffffff;\n}\n.company-start.icon--broken .company-start__icon,\n.explorer-card__head-img > img,\n.bookmarks-folder__layer,\n.card-more__box,\n.card__img\n,.extensions__block-add\n,.extensions__item\n {\nbackground-color: #1e2c2f;\n}\n.search-source.focus,\n.simple-button.focus,\n.menu__item.focus,\n.menu__item.traverse,\n.menu__item.hover,\n.full-start__button.focus,\n.full-descr__tag.focus,\n.player-panel .button.focus,\n.full-person.selector.focus,\n.tag-count.selector.focus,\n.full-review.focus {\nbackground: linear-gradient(to right, #1e6262, #3da18d);\ncolor: #fff;\nbox-shadow: 0 0.0em 0.4em rgba(61, 161, 141, 0.0);\n}\n.selectbox-item.focus,\n.settings-folder.focus,\n.settings-param.focus {\nbackground: linear-gradient(to right, #1e6262, #3da18d);\ncolor: #fff;\nbox-shadow: 0 0.0em 0.4em rgba(61, 161, 141, 0.0);\nborder-radius: 0.5em 0 0 0.5em;\n}\n.full-episode.focus::after,\n.card-episode.focus .full-episode::after,\n.items-cards .selector.focus::after,  \n.card-more.focus .card-more__box::after,\n.card-episode.focus .full-episode::after,\n.card-episode.hover .full-episode::after,\n.card.focus .card__view::after,\n.card.hover .card__view::after,\n.torrent-item.focus::after,\n.online-prestige.selector.focus::after,\n.online-prestige--full.selector.focus::after,\n.explorer-card__head-img.selector.focus::after,\n.extensions__item.focus::after,\n.extensions__block-add.focus::after,\n.full-review-add.focus::after {\nborder: 0.2em solid #3da18d;\nbox-shadow: 0 0 0.8em rgba(61, 161, 141, 0.0);\n}\n.head__action.focus,\n.head__action.hover {\nbackground: linear-gradient(45deg, #3da18d, #1e6262);\n}\n.modal__content {\nbackground: rgba(18, 32, 36, 0.96);\nborder: 0em solid rgba(18, 32, 36, 0.96);\n}\n.settings__content,\n.settings-input__content,\n.selectbox__content,\n.settings-input {\nbackground: rgba(18, 32, 36, 0.96);\n}\n.torrent-serial {\nbackground: rgba(0, 0, 0, 0.22);\nborder: 0.2em solid rgba(0, 0, 0, 0.22);\n}\n.torrent-serial.focus {\nbackground-color: #1a3b36cc;\nborder: 0.2em solid #3da18d;\n}\n"),
            crystal_cyan: "\n.navigation-bar__body\n{background: rgba(10, 25, 40, 0.96);\n}\n.card__quality,\n .card__type::after  {\nbackground: linear-gradient(to right, #00d2ffdd, #3a8ee6dd);\n}\n.screensaver__preload {\nbackground:url(\"data:image/svg+xml,".concat(svgCode, "\") no-repeat 50% 50%\n}\n.activity__loader {\nposition:absolute;\ntop:0;\nleft:0;\nwidth:100%;\nheight:100%;\ndisplay:none;\nbackground:url(\"data:image/svg+xml,").concat(svgCode, "\") no-repeat 50% 50%\n \n}\nhtml, body, .extensions\n {\nbackground: linear-gradient(135deg, #081822, #104059);\ncolor: #ffffff;\n}\n.company-start.icon--broken .company-start__icon,\n.explorer-card__head-img > img,\n.bookmarks-folder__layer,\n.card-more__box,\n.card__img\n,.extensions__block-add\n,.extensions__item\n {\nbackground-color: #112b3a;\n}\n.search-source.focus,\n.simple-button.focus,\n.menu__item.focus,\n.menu__item.traverse,\n.menu__item.hover,\n.full-start__button.focus,\n.full-descr__tag.focus,\n.player-panel .button.focus,\n.full-person.selector.focus,\n.tag-count.selector.focus,\n.full-review.focus {\nbackground: linear-gradient(to right, #00d2ff, #3a8ee6);\ncolor: #fff;\nbox-shadow: 0 0.0em 0.4em rgba(72, 216, 255, 0.0);\n}\n.selectbox-item.focus,\n.settings-folder.focus,\n.settings-param.focus {\nbackground: linear-gradient(to right, #00d2ff, #3a8ee6);\ncolor: #fff;\nbox-shadow: 0 0.0em 0.4em rgba(72, 216, 255, 0.0);\nborder-radius: 0.5em 0 0 0.5em;\n}\n.full-episode.focus::after,\n.card-episode.focus .full-episode::after,\n.items-cards .selector.focus::after,  \n.card-more.focus .card-more__box::after,\n.card-episode.focus .full-episode::after,\n.card-episode.hover .full-episode::after,\n.card.focus .card__view::after,\n.card.hover .card__view::after,\n.torrent-item.focus::after,\n.online-prestige.selector.focus::after,\n.online-prestige--full.selector.focus::after,\n.explorer-card__head-img.selector.focus::after,\n.extensions__item.focus::after,\n.extensions__block-add.focus::after,\n.full-review-add.focus::after {\nborder: 0.2em solid #00d2ff;\nbox-shadow: 0 0 0.8em rgba(72, 216, 255, 0.0);\n}\n.head__action.focus,\n.head__action.hover {\nbackground: linear-gradient(45deg, #00d2ff, #3a8ee6);\n}\n.modal__content {\nbackground: rgba(10, 25, 40, 0.96);\nborder: 0em solid rgba(10, 25, 40, 0.96);\n}\n.settings__content,\n.settings-input__content,\n.selectbox__content,\n.settings-input {\nbackground: rgba(10, 25, 40, 0.96);\n}\n.torrent-serial {\nbackground: rgba(0, 0, 0, 0.22);\nborder: 0.2em solid rgba(0, 0, 0, 0.22);\n}\n.torrent-serial.focus {\nbackground-color: #0c2e45cc;\nborder: 0.2em solid #00d2ff;\n}\n"),
            deep_aurora: "\n.navigation-bar__body\n{background: rgba(18, 34, 59, 0.96);\n}\n.card__quality,\n .card__type::after  {\nbackground: linear-gradient(to right, #2c6fc1dd, #7e7ed9dd);\n}\n.screensaver__preload {\nbackground:url(\"data:image/svg+xml,".concat(svgCode, "\") no-repeat 50% 50%\n}\n.activity__loader {\nposition:absolute;\ntop:0;\nleft:0;\nwidth:100%;\nheight:100%;\ndisplay:none;\nbackground:url(\"data:image/svg+xml,").concat(svgCode, "\") no-repeat 50% 50%\n \n}\nhtml, body, .extensions\n {\nbackground: linear-gradient(135deg, #1a102b, #0a1c3f);\ncolor: #ffffff;\n}\n.company-start.icon--broken .company-start__icon,\n.explorer-card__head-img > img,\n.bookmarks-folder__layer,\n.card-more__box,\n.card__img\n,.extensions__block-add\n,.extensions__item\n {\nbackground-color: #171f3a;\n}\n.search-source.focus,\n.simple-button.focus,\n.menu__item.focus,\n.menu__item.traverse,\n.menu__item.hover,\n.full-start__button.focus,\n.full-descr__tag.focus,\n.player-panel .button.focus,\n.full-person.selector.focus,\n.tag-count.selector.focus,\n.full-review.focus {\nbackground: linear-gradient(to right, #2c6fc1, #7e7ed9);\ncolor: #fff;\nbox-shadow: 0 0.0em 0.4em rgba(124, 194, 255, 0.0);\n}\n.selectbox-item.focus,\n.settings-folder.focus,\n.settings-param.focus {\nbackground: linear-gradient(to right, #2c6fc1, #7e7ed9);\ncolor: #fff;\nbox-shadow: 0 0.0em 0.4em rgba(124, 194, 255, 0.0);\nborder-radius: 0.5em 0 0 0.5em;\n}\n.full-episode.focus::after,\n.card-episode.focus .full-episode::after,\n.items-cards .selector.focus::after,  \n.card-more.focus .card-more__box::after,\n.card-episode.focus .full-episode::after,\n.card-episode.hover .full-episode::after,\n.card.focus .card__view::after,\n.card.hover .card__view::after,\n.torrent-item.focus::after,\n.online-prestige.selector.focus::after,\n.online-prestige--full.selector.focus::after,\n.explorer-card__head-img.selector.focus::after,\n.extensions__item.focus::after,\n.extensions__block-add.focus::after,\n.full-review-add.focus::after {\nborder: 0.2em solid #7e7ed9;\nbox-shadow: 0 0 0.8em rgba(124, 194, 255, 0.0);\n}\n.head__action.focus,\n.head__action.hover {\nbackground: linear-gradient(45deg, #7e7ed9, #2c6fc1);\n}\n.modal__content {\nbackground: rgba(18, 34, 59, 0.96);\nborder: 0em solid rgba(18, 34, 59, 0.96);\n}\n.settings__content,\n.settings-input__content,\n.selectbox__content,\n.settings-input {\nbackground: rgba(18, 34, 59, 0.96);\n}\n.torrent-serial {\nbackground: rgba(0, 0, 0, 0.22);\nborder: 0.2em solid rgba(0, 0, 0, 0.22);\n}\n.torrent-serial.focus {\nbackground-color: #1a102bcc;\nborder: 0.2em solid #7e7ed9;\n}\n"),
            amber_noir: "\n.navigation-bar__body\n{background: rgba(28, 18, 10, 0.96);\n}\n.card__quality,\n .card__type::after {\nbackground: linear-gradient(to right, #f4a261dd, #e76f51dd);\n}\n.screensaver__preload {\nbackground:url(\"data:image/svg+xml,".concat(svgCode, "\") no-repeat 50% 50%\n}\n.activity__loader {\nposition:absolute;\ntop:0;\nleft:0;\nwidth:100%;\nheight:100%;\ndisplay:none;\nbackground:url(\"data:image/svg+xml,").concat(svgCode, "\") no-repeat 50% 50%\n \n}\nhtml, body, .extensions\n {\nbackground: linear-gradient(135deg, #1f0e04, #3b2a1e);\ncolor: #ffffff;\n}\n.company-start.icon--broken .company-start__icon,\n.explorer-card__head-img > img,\n.bookmarks-folder__layer,\n.card-more__box,\n.card__img\n,.extensions__block-add\n,.extensions__item\n {\nbackground-color: #2a1c11;\n}\n.search-source.focus,\n.simple-button.focus,\n.menu__item.focus,\n.menu__item.traverse,\n.menu__item.hover,\n.full-start__button.focus,\n.full-descr__tag.focus,\n.player-panel .button.focus,\n.full-person.selector.focus,\n.tag-count.selector.focus,\n.full-review.focus {\nbackground: linear-gradient(to right, #f4a261, #e76f51);\ncolor: #fff;\nbox-shadow: 0 0.0em 0.4em rgba(255, 160, 90, 0.0);\n}\n.selectbox-item.focus,\n.settings-folder.focus,\n.settings-param.focus {\nbackground: linear-gradient(to right, #f4a261, #e76f51);\ncolor: #fff;\nbox-shadow: 0 0.0em 0.4em rgba(255, 160, 90, 0.0);\nborder-radius: 0.5em 0 0 0.5em;\n}\n.full-episode.focus::after,\n.card-episode.focus .full-episode::after,\n.items-cards .selector.focus::after,  \n.card-more.focus .card-more__box::after,\n.card-episode.focus .full-episode::after,\n.card-episode.hover .full-episode::after,\n.card.focus .card__view::after,\n.card.hover .card__view::after,\n.torrent-item.focus::after,\n.online-prestige.selector.focus::after,\n.online-prestige--full.selector.focus::after,\n.explorer-card__head-img.selector.focus::after,\n.extensions__item.focus::after,\n.extensions__block-add.focus::after,\n.full-review-add.focus::after {\nborder: 0.2em solid #f4a261;\nbox-shadow: 0 0 0.8em rgba(255, 160, 90, 0.0);\n}\n.head__action.focus,\n.head__action.hover {\nbackground: linear-gradient(45deg, #f4a261, #e76f51);\n}\n.modal__content {\nbackground: rgba(28, 18, 10, 0.96);\nborder: 0em solid rgba(28, 18, 10, 0.96);\n}\n.settings__content,\n.settings-input__content,\n.selectbox__content,\n.settings-input {\nbackground: rgba(28, 18, 10, 0.96);\n}\n.torrent-serial {\nbackground: rgba(0, 0, 0, 0.22);\nborder: 0.2em solid rgba(0, 0, 0, 0.22);\n}\n.torrent-serial.focus {\nbackground-color: #3b2412cc;\nborder: 0.2em solid #f4a261;\n}\n"),
            velvet_sakura: "\n.navigation-bar__body\n{background: rgba(56, 32, 45, 0.96);\n}\n.card__quality,\n .card__type::after  {\nbackground: linear-gradient(to right, #f6a5b0dd, #f9b8d3dd);\n}\n.screensaver__preload {\nbackground:url(\"data:image/svg+xml,".concat(svgCode, "\") no-repeat 50% 50%\n}\n.activity__loader {\nposition:absolute;\ntop:0;\nleft:0;\nwidth:100%;\nheight:100%;\ndisplay:none;\nbackground:url(\"data:image/svg+xml,").concat(svgCode, "\") no-repeat 50% 50%\n \n}\nhtml, body, .extensions\n {\nbackground: linear-gradient(135deg, #4b0e2b, #7c2a57);\ncolor: #ffffff;\n}\n.company-start.icon--broken .company-start__icon,\n.explorer-card__head-img > img,\n.bookmarks-folder__layer,\n.card-more__box,\n.card__img\n,.extensions__block-add\n,.extensions__item\n {\nbackground-color: #5c0f3f;\n}\n.search-source.focus,\n.simple-button.focus,\n.menu__item.focus,\n.menu__item.traverse,\n.menu__item.hover,\n.full-start__button.focus,\n.full-descr__tag.focus,\n.player-panel .button.focus,\n.full-person.selector.focus,\n.tag-count.selector.focus,\n.full-review.focus {\nbackground: linear-gradient(to right, #f6a5b0, #f9b8d3);\ncolor: #fff;\nbox-shadow: 0 0.0em 0.4em rgba(246, 165, 176, 0.0);\n}\n.selectbox-item.focus,\n.settings-folder.focus,\n.settings-param.focus {\nbackground: linear-gradient(to right, #f6a5b0, #f9b8d3);\ncolor: #fff;\nbox-shadow: 0 0.0em 0.4em rgba(246, 165, 176, 0.0);\nborder-radius: 0.5em 0 0 0.5em;\n}\n.full-episode.focus::after,\n.card-episode.focus .full-episode::after,\n.items-cards .selector.focus::after,  \n.card-more.focus .card-more__box::after,\n.card-episode.focus .full-episode::after,\n.card-episode.hover .full-episode::after,\n.card.focus .card__view::after,\n.card.hover .card__view::after,\n.torrent-item.focus::after,\n.online-prestige.selector.focus::after,\n.online-prestige--full.selector.focus::after,\n.explorer-card__head-img.selector.focus::after,\n.extensions__item.focus::after,\n.extensions__block-add.focus::after,\n.full-review-add.focus::after {\nborder: 0.2em solid #f6a5b0;\nbox-shadow: 0 0 0.8em rgba(246, 165, 176, 0.0);\n}\n.head__action.focus,\n.head__action.hover {\nbackground: linear-gradient(45deg, #f9b8d3, #f6a5b0);\n}\n.modal__content {\nbackground: rgba(56, 32, 45, 0.96);\nborder: 0em solid rgba(56, 32, 45, 0.96);\n}\n.settings__content,\n.settings-input__content,\n.selectbox__content,\n.settings-input {\nbackground: rgba(56, 32, 45, 0.96);\n}\n.torrent-serial {\nbackground: rgba(0, 0, 0, 0.22);\nborder: 0.2em solid rgba(0, 0, 0, 0.22);\n}\n.torrent-serial.focus {\nbackground-color: #7c2a57cc;\nborder: 0.2em solid #f6a5b0;\n}\n")
        };

        // Устанавливаем стили для выбранной темы
        style.html(themes[theme] || '');

        // Добавляем стиль в head
        $('head').append(style);

        if (onetime === false) {
            onetime = true;
            forall();
            removeFromSettingsMenu();
            fix_lang();
        }

    }
    
    function fix_lang() {
       Lampa.Lang.add({
        tv_status_returning_series: {
          ru: "Идет"
        },
        tv_status_planned: {
          ru: "Запланирован"
        },
        tv_status_in_production: {
          ru: "В производстве"
        },
        tv_status_ended: {
          ru: "Завершен"
        },
        tv_status_canceled: {
          ru: "Отменен"
        },
        tv_status_pilot: {
          ru: "Пилот"
        },
        tv_status_released: {
          ru: "Вышел"
        },
        tv_status_rumored: {
          ru: "По слухам"
        },
        tv_status_post_production: {
          ru: "Скоро"
        }
      });
    }

    function removeFromSettingsMenu() {
        // Скрываем всё, что плохо сочетается с плагином тем
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
        // Настройки интерфейса под темы
        Lampa.Storage.set('light_version', 'false');
        Lampa.Storage.set('background', 'false');
        Lampa.Storage.set('card_interfice_type', 'new');
        Lampa.Storage.set('glass_style', 'false');
        Lampa.Storage.set('card_interfice_poster', 'false');
        Lampa.Storage.set('card_interfice_cover', 'true');
        Lampa.Storage.set('advanced_animation', 'false');

    }

    // Дополнительные Шаблоны, не меняющиеся от цветовых стилей    
    function forall() {
        // Шаблон карточки, где год перенесен выше названия
        Lampa.Template.add('card', "<div class=\"card selector layer--visible layer--render\">\n    <div class=\"card__view\">\n        <img src=\"./img/img_load.svg\" class=\"card__img\" />\n\n        <div class=\"card__icons\">\n            <div class=\"card__icons-inner\">\n                \n            </div>\n        </div>\n    <div class=\"card__age\">{release_year}</div>\n    </div>\n\n    <div class=\"card__title\">{title}</div>\n    </div>");
        // Шаблон карточки выхода эпизода, выкинем футер из card_episode, год и название на карточку
        Lampa.Template.add('card_episode', "<div class=\"card-episode selector layer--visible layer--render\">\n    <div class=\"card-episode__body\">\n        <div class=\"full-episode\">\n            <div class=\"full-episode__img\">\n                <img />\n            </div>\n\n            <div class=\"full-episode__body\">\n     <div class=\"card__title\">{title}</div>\n            <div class=\"card__age\">{release_year}</div>\n            <div class=\"full-episode__num hide\">{num}</div>\n                <div class=\"full-episode__name\">{name}</div>\n                <div class=\"full-episode__date\">{date}</div>\n            </div>\n        </div>\n    </div>\n    <div class=\"card-episode__footer hide\">\n        <div class=\"card__imgbox\">\n            <div class=\"card__view\">\n                <img class=\"card__img\" />\n            </div>\n        </div>\n\n        <div class=\"card__left\">\n            <div class=\"card__title\">{title}</div>\n            <div class=\"card__age\">{release_year}</div>\n        </div>\n    </div>\n</div>");
        // Стили 
          // Подтянем перевод для плашки Сериал
        var tv_caption = Lampa.Lang.translate('maxsm_themes_tvcaption');
        var style = "\n        <style id=\"maxsm_interface_mod_theme_forall\">\n " +
            // Firefox
            // "@-moz-document url-prefix() {    .full-start__background {        opacity: 0.7 !important;        filter: none !important; /* Отключаем фильтры для Firefox */    }" +   
            // "@-moz-document url-prefix() {    body {        background: #0a0a0a !important; /*Заменяем градиент на сплошной цвет */    }}" +
            // По центру в мобилке
            "@media screen and (max-width: 480px) { .full-start-new__head, .full-start-new__title, .full-start__title-original, .full-start__rate, .full-start-new__reactions, .full-start-new__rate-line, .full-start-new__buttons, .full-start-new__details, .full-start-new__tagline { -webkit-justify-content: center; justify-content: center; text-align: center; max-width: 100%; }}" +
            "@media screen and (max-width: 480px) { .full-start-new__right { background: -webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0)), to(rgba(0, 0, 0, 0))); background: -webkit-linear-gradient(top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%); background: -o-linear-gradient(top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%); background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%);}}" +
            // Круглые чек-боксы
            ".selectbox-item__checkbox\n {\nborder-radius: 100%\n}\n" +
            ".selectbox-item--checked .selectbox-item__checkbox\n {\nbackground: #ccc;\n}\n" +
            //  Рейтинг внутри карточки
            ".full-start-new__rate-line .full-start__pg {\n    font-size: 1em;\nbackground: #fff;\n    color: #000;\n}\n." +
            ".full-start__rate \n{\n     border-radius: 0.25em;\n padding: 0.3em;\n background-color: rgba(0, 0, 0, 0.3);\n}\n" +
            ".full-start__pg, .full-start__status\n {\nfont-size: 1em;\nbackground: #fff;\n    color: #000;\n}\n" +
            // Докручиваем плашки на карточках стилями 
            // Заголовок
            ".card__title {\n                    height: 3.6em;\n                    text-overflow: ellipsis;\n                     -o-text-overflow: ellipsis;\n                    text-overflow: ellipsis;\n                    -webkit-line-clamp: 3;\n                    line-clamp: 3;\n                }\n " +
            // Год
            ".card__age {\n  position: absolute;\n  right: 0em;\n  bottom: 0em;\n  z-index: 10;\n  background: rgba(0, 0, 0, 0.6);\n  color: #ffffff;\n  font-weight: 700;\n  padding: 0.4em 0.6em;\n    -webkit-border-radius: 0.48em 0 0.48em 0;\n     -moz-border-radius: 0.48em 0 0.48em 0;\n          border-radius: 0.48em 0 0.48em 0;\nline-height: 1.0;\nfont-size: 1.0em;\n}\n " +
            // Рейтинг
            ".card__vote {\n  position: absolute;\n  bottom: auto; \n right: 0em;\n  top: 0em;\n  background: rgba(0, 0, 0, 0.6);\n    font-weight: 700;\n  color: #fff;\n -webkit-border-radius: 0 0.34em 0 0.34em;\n     -moz-border-radius: 0 0.34em 0 0.34em;\n          border-radius: 0 0.34em 0 0.34em;\nline-height: 1.0;\nfont-size: 1.4em;\n}\n  " +
            // Тип (Сериал)
            //".card__type  {\n  position: absolute;\n  bottom: auto; \n left: 0em; \nright: auto;\n  top: 0em;\n  background: rgba(0, 0, 0, 0.6);\n  color: #fff;\n  font-weight: 700;\n  padding: 0.4em 0.6em;\n  -webkit-border-radius: 0.4em 0 0.4em 0;\n     -moz-border-radius: 0.4em 0 0.4em 0;\n          border-radius: 0.4em 0 0.4em 0;\nline-height: 1.0;\nfont-size: 1.0em;\n}\n " +
            //".card--tv .card__type {\n  color: #fff;\n}\n" +
            ".card--tv .card__type,\n.card__type {\n  font-size: 1em;\n  background: transparent;\n color: transparent;\n left: 0;\n  top: 0;\n}\n" + 
              // Воткнуть в нее с переводом
            ".card__type::after {\n  content: '" + tv_caption + "';\n  color: #fff;\n  position: absolute;\n  left: 0;\n  top: 0;\n padding: 0.4em 0.6em;\n  border-radius: 0.4em 0 0.4em 0;\n  font-weight: 700;\n}" +
            // Иконки закладок и т.д.
            ".card__icons {\n  position: absolute;\n  top: 2em;\n  left: 0;\n  right: auto;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -moz-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n  -webkit-justify-content: center;\n     -moz-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n background: rgba(0, 0, 0, 0.6);\n  color: #fff;\n    -webkit-border-radius: 0 0.5em 0.5em 0;\n     -moz-border-radius: 0 0.5em 0.5em 0;\n          border-radius: 0 0.5em 0.5em 0;\n}\n" +
            ".card__icons-inner {\n  background: rgba(0, 0, 0, 0); \n}\n" +
            // Статус расширенных закладок
            ".card__marker {\n position: absolute;\n  left: 0em;\n  top: 4em;\n  bottom: auto; \n  background: rgba(0, 0, 0, 0.6);\n  -webkit-border-radius: 0 0.5em 0.5em 0;\n     -moz-border-radius: 0 0.5em 0.5em 0;\n          border-radius: 0 0.5em 0.5em 0;\n  font-weight: 700;\n font-size: 1.0em;\n   padding: 0.4em 0.6em;\n    display: -webkit-box;\n  display: -webkit-flex;\n  display: -moz-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n  -webkit-align-items: center;\n     -moz-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  line-height: 1.2;\nmax-width: min(12em, 95%);\nbox-sizing: border-box;\n}\n" +
            // На маленьких экранах обрезаем, на больших полностью
            ".card__marker > span {\n max-width: min(12em, 95%);\n}\n" +
            // отметка качества background: rgba(0, 0, 0, 0.6);\n  
            ".card__quality {\n  position: absolute;\n  left: auto;\n right: 0em;\n  bottom: 2.4em;\n  padding: 0.4em 0.6em;\n  color: #fff;\n font-weight: 700;\n  font-size: 1.0em;\n  -webkit-border-radius: 0.5em 0 0 0.5em;\n  -moz-border-radius: 0.5em 0 0 0.5em;\n  border-radius: 0.5em 0 0 0.5em;\n  text-transform: uppercase;\n}\n" +
            // Уменьшаем расстояние между рядами только для карточках в списках
            ".items-line.items-line--type-cards + .items-line.items-line--type-cards  {\nmargin-top: 1em;\n}\n" +
            // Так же широкие карты фиксим, чтобы не было отскока нижнего ряда, делаем отступ снизу
            ".card--small .card__view {\nmargin-bottom: 2em;\n}\n" +
            // Уменьшаем высоту после удаления футера, нужно для card_episode
            ".items-line--type-cards {\n min-height: 18em;\n}\n" +
            // Внутри карточки информация стремится к нижней границе экрана
            "@media screen and (min-width: 580px) {\n.full-start-new {\nmin-height: 80vh;\ndisplay: flex\n}\n}\n" +
            // Делаем, чтобы кнопки были большими, если экран большой, и всегда маленькими на мелеом экране
            //".full-start-new__buttons .full-start__button:not(.focus) span {\ndisplay: inline ;\n}\n@media screen and (max-width: 580px) {\n.full-start-new__buttons {\noverflow: auto;\n}\n.full-start-new__buttons .full-start__button:not(.focus) span {\ndisplay: none;\n}\n}\n" +
            // Постер в карточке, менее затемнен чем в стоке
            ".full-start__background.loaded {\nopacity: 0.8;\n}\n.full-start__background.dim {\nopacity: 0.2;\n}\n" +
            // Скругления у большого числа элементов
            ".explorer__files .torrent-filter .simple-button {\nfont-size: 1.2em;\n-webkit-border-radius: 0.5em;\n-moz-border-radius: 0.5em;\nborder-radius: 0.5em;\n}\n" +
            ".full-review-add,\n.full-review,\n.extensions__item,\n.extensions__block-add,\n.search-source,\n.bookmarks-folder__layer,\n.bookmarks-folder__body,\n.card__img,\n.card__promo,\n.full-episode--next .full-episode__img:after,\n.full-episode__img img,\n.full-episode__body,\n.full-person__photo,\n.card-more__box,\n.full-start__button,\n.simple-button,\n.register {\nborder-radius: 0.5em;\n}\n" +
            ".extensions__item.focus::after,\n.extensions__block-add.focus::after,\n.full-episode.focus::after,\n.full-review-add.focus::after,\n.card-parser.focus::after,\n.card-episode.focus .full-episode::after,\n.card-episode.hover .full-episode::after,\n.card.focus .card__view::after,\n.card.hover .card__view::after,\n.card-more.focus .card-more__box::after,\n.register.focus::after {\nborder-radius: 1em;\n}\n" +
            ".search-source.focus,\n.simple-button.focus,\n.menu__item.focus,\n.menu__item.traverse,\n.menu__item.hover,\n.full-start__button.focus,\n.full-descr__tag.focus,\n.player-panel .button.focus,\n.full-person.selector.focus,\n.tag-count.selector.focus {\nborder-radius: 0.5em;\n}\n" +
            // Пробуем немного анимацмм
            ".card\n{transform: scale(1);\ntransition: transform 0.3s ease;\n}\n" +
            ".card.focus\n{transform: scale(1.03);\n}\n" +
            ".torrent-item,\n.online-prestige\n{transform: scale(1);\ntransition: transform 0.3s ease;\n}\n" +
            ".torrent-item.focus,\n.online-prestige.focus\n{transform: scale(1.01);\n}\n" +
            ".extensions__item,\n.extensions__block-add,\n.full-review-add,\n.full-review,\n.tag-count,\n.full-person,\n.full-episode,\n.simple-button,\n.full-start__button,\n.items-cards .selector,\n.card-more,\n.explorer-card__head-img.selector,\n.card-episode\n{transform: scale(1);\ntransition: transform 0.3s ease;\n}\n" +
            ".extensions__item.focus,\n.extensions__block-add.focus,\n.full-review-add.focus,\n.full-review.focus,\n.tag-count.focus,\n.full-person.focus,\n.full-episode.focus,\n.simple-button.focus,\n.full-start__button.focus,\n.items-cards .selector.focus,\n.card-more.focus,\n.explorer-card__head-img.selector.focus,\n.card-episode.focus\n{transform: scale(1.03);\n}\n" +
            ".menu__item {\n  transition: transform 0.3s ease;\n}\n" +
            ".menu__item.focus {\n transform: translateX(-0.2em);\n}\n" +
            ".selectbox-item,\n.settings-folder,\n.settings-param {\n transition: transform 0.3s ease;\n}\n" +
            ".selectbox-item.focus,\n.settings-folder.focus,\n.settings-param.focus {\n transform: translateX(0.2em);\n}\n" +
            // Меню слева
            ".menu__item.focus {border-radius: 0 0.5em 0.5em 0;\n}\n" +
            ".menu__list {\npadding-left: 0em;\n}\n" +
            // Оставим иконки белыми в левом Меню
            ".menu__item.focus .menu__ico {\n   -webkit-filter: invert(1);\n    filter: invert(1);\n }\n " +
            // Белые иконки в бошке
            // ".head__action.focus, .head__action.hover {\ncolor: fff;\n}\n" +
            "</style>\n";
        Lampa.Template.add('card_css', style);
        $('body').append(Lampa.Template.get('card_css', {}, true));
    }

    // Функция инициализации плагина
    function startPlugin() {
        // Список доступных тем
        var availableThemes = ['mint_dark', 'deep_aurora', 'crystal_cyan', 'amber_noir', 'velvet_sakura', 'default'];
        Lampa.SettingsApi.addParam({
            component: 'interface',
            param: {
                name: 'maxsm_themes_selected',
                type: 'select',
                values: {
                    mint_dark: 'Mint Dark',
                    deep_aurora: 'Deep Aurora',
                    crystal_cyan: 'Crystal Cyan',
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

        // Применяем настройки и проверяем, существует ли выбранная тема
        var savedTheme = Lampa.Storage.get('maxsm_themes_selected', 'mint_dark');
        if (availableThemes.indexOf(savedTheme) === -1) {
            // Если сохраненная тема не существует, ставим по умолчанию
            Lampa.Storage.set('maxsm_themes_selected', 'mint_dark');
            savedTheme = 'mint_dark';
        }
        maxsm_themes.settings.theme = savedTheme;
        applyTheme(maxsm_themes.settings.theme);
    }

    // Ждем загрузки приложения и запускаем плагин
    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', function(event) {
            if (event.type === 'ready') {
                startPlugin();
            }
        });
    }
    // Регистрация плагина в манифесте
    Lampa.Manifest.plugins = {
        name: 'maxsm_themes',
        version: '2.5.0',
        description: 'maxsm_themes'
    };

    // Экспортируем объект плагина для внешнего доступа
    window.maxsm_themes = maxsm_themes;
})();
