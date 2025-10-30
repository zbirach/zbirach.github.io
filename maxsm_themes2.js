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

    // Исправленный SVG код лоадера
    var svgCode = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <path fill="${color}" d="M50 5 A45 45 0 0 1 50 95 A25 25 0 0 0 50 5Z">
    <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="1s" repeatCount="indefinite"/>
  </path>
</svg>`;

    // Кодируем SVG для использования в CSS
    var encodedSvg = encodeURIComponent(svgCode.replace(/\s+/g, ' '));

    // Создаем новый стиль
    var style = $('<style id="maxsm_interface_mod_theme"></style>');

    // Базовые стили для лоадера, которые работают в Lampa
    var loaderStyles = `
        /* Стили для основного лоадера при загрузке */
        .activity--preload .activity__loader,
        .activity--load .activity__loader {
            background-image: url("data:image/svg+xml,${encodedSvg}") !important;
            background-size: 80px 80px !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
        }
        
        /* Стили для скринсейвера/заставки */
        .screensaver__preload {
            background-image: url("data:image/svg+xml,${encodedSvg}") !important;
            background-size: 120px 120px !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
        }
        
        /* Убираем стандартные анимации Lampa */
        .activity__loader:before,
        .activity__loader:after {
            display: none !important;
        }
        
        .screensaver__preload:before,
        .screensaver__preload:after {
            display: none !important;
        }
    `;

    // Определяем стили для разных тем
    var themes = {
        mint_dark: loaderStyles + "\n.navigation-bar__body\n{background: rgba(18, 32, 36, 0.96);\n}\n.card__quality,\n .card__type::after  {\nbackground: linear-gradient(to right, #1e6262, #3da18d);\n}\nhtml, body, .extensions\n {\nbackground: linear-gradient(135deg, #0a1b2a, #1a4036);\ncolor: #ffffff;\n}\n.company-start.icon--broken .company-start__icon,\n.explorer-card__head-img > img,\n.bookmarks-folder__layer,\n.card-more__box,\n.card__img\n,.extensions__block-add\n,.extensions__item\n {\nbackground-color: #1e2c2f;\n}\n.search-source.focus,\n.simple-button.focus,\n.menu__item.focus,\n.menu__item.traverse,\n.menu__item.hover,\n.full-start__button.focus,\n.full-descr__tag.focus,\n.player-panel .button.focus,\n.full-person.selector.focus,\n.tag-count.selector.focus,\n.full-review.focus {\nbackground: linear-gradient(to right, #1e6262, #3da18d);\ncolor: #fff;\nbox-shadow: 0 0.0em 0.4em rgba(61, 161, 141, 0.0);\n}\n.selectbox-item.focus,\n.settings-folder.focus,\n.settings-param.focus {\nbackground: linear-gradient(to right, #1e6262, #3da18d);\ncolor: #fff;\nbox-shadow: 0 0.0em 0.4em rgba(61, 161, 141, 0.0);\nborder-radius: 0.5em 0 0 0.5em;\n}\n.full-episode.focus::after,\n.card-episode.focus .full-episode::after,\n.items-cards .selector.focus::after,  \n.card-more.focus .card-more__box::after,\n.card-episode.focus .full-episode::after,\n.card-episode.hover .full-episode::after,\n.card.focus .card__view::after,\n.card.hover .card__view::after,\n.torrent-item.focus::after,\n.online-prestige.selector.focus::after,\n.online-prestige--full.selector.focus::after,\n.explorer-card__head-img.selector.focus::after,\n.extensions__item.focus::after,\n.extensions__block-add.focus::after,\n.full-review-add.focus::after {\nborder: 0.2em solid #3da18d;\nbox-shadow: 0 0 0.8em rgba(61, 161, 141, 0.0);\n}\n.head__action.focus,\n.head__action.hover {\nbackground: linear-gradient(45deg, #3da18d, #1e6262);\n}\n.modal__content {\nbackground: rgba(18, 32, 36, 0.96);\nborder: 0em solid rgba(18, 32, 36, 0.96);\n}\n.settings__content,\n.settings-input__content,\n.selectbox__content,\n.settings-input {\nbackground: rgba(18, 32, 36, 0.96);\n}\n.torrent-serial {\nbackground: rgba(0, 0, 0, 0.22);\nborder: 0.2em solid rgba(0, 0, 0, 0.22);\n}\n.torrent-serial.focus {\nbackground-color: #1a3b36cc;\nborder: 0.2em solid #3da18d;\n}\n",
        // ... остальные темы (код сокращен для примера)
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
