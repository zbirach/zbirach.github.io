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
        neon_pulse: '#29ccb4',
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

        // ⚡⚡⚡ ТВОЙ GITHUB URL ДЛЯ SVG ⚡⚡⚡
        // Заміни цей шлях на свій GitHub URL
        var svgUrl = "https://raw.githubusercontent.com/zbirach/zbirach.github.io/main/loader/764.gif";

        // Создаем новый стиль
        var style = $('<style id="maxsm_interface_mod_theme"></style>');

        // Определяем стили для разных тем
        var themes = {
            mint_dark: `
.screensaver__preload {
    background: url("${svgUrl}") no-repeat 50% 50% !important;
    background-size: 120px 120px !important;
}
.activity__loader {
    background: url("${svgUrl}") no-repeat 50% 50% !important;
    background-size: 80px 80px !important;
    display: block !important;
}
.navigation-bar__body
{background: rgba(18, 32, 36, 0.96);
}
.card__quality,
 .card__type::after  {
background: linear-gradient(to right, #1e6262, #3da18d);
}
html, body, .extensions
 {
background: linear-gradient(135deg, #0a1b2a, #1a4036);
color: #ffffff;
}
.company-start.icon--broken .company-start__icon,
.explorer-card__head-img > img,
.bookmarks-folder__layer,
.card-more__box,
.card__img
,.extensions__block-add
,.extensions__item
 {
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
box-shadow: 0 0.0em 0.4em rgba(61, 161, 141, 0.0);
}
.selectbox-item.focus,
.settings-folder.focus,
.settings-param.focus {
background: linear-gradient(to right, #1e6262, #3da18d);
color: #fff;
box-shadow: 0 0.0em 0.4em rgba(61, 161, 141, 0.0);
border-radius: 0.5em 0 0 0.5em;
}
.full-episode.focus::after,
.card-episode.focus .full-episode::after,
.items-cards .selector.focus::after,  
.card-more.focus .card-more__box::after,
.card-episode.focus .full-episode::after,
.card-episode.hover .full-episode::after,
.card.focus .card__view::after,
.card.hover .card__view::after,
.torrent-item.focus::after,
.online-prestige.selector.focus::after,
.online-prestige--full.selector.focus::after,
.explorer-card__head-img.selector.focus::after,
.extensions__item.focus::after,
.extensions__block-add.focus::after,
.full-review-add.focus::after {
border: 0.2em solid #3da18d;
box-shadow: 0 0 0.8em rgba(61, 161, 141, 0.0);
}
.head__action.focus,
.head__action.hover {
background: linear-gradient(45deg, #3da18d, #1e6262);
}
.modal__content {
background: rgba(18, 32, 36, 0.96);
border: 0em solid rgba(18, 32, 36, 0.96);
}
.settings__content,
.settings-input__content,
.selectbox__content,
.settings-input {
background: rgba(18, 32, 36, 0.96);
}
.torrent-serial {
background: rgba(0, 0, 0, 0.22);
border: 0.2em solid rgba(0, 0, 0, 0.22);
}
.torrent-serial.focus {
background-color: #1a3b36cc;
border: 0.2em solid #3da18d;
}
`,

            crystal_cyan: `
.screensaver__preload {
    background: url("${svgUrl}") no-repeat 50% 50% !important;
    background-size: 120px 120px !important;
}
.activity__loader {
    background: url("${svgUrl}") no-repeat 50% 50% !important;
    background-size: 80px 80px !important;
    display: block !important;
}
.navigation-bar__body
{background: rgba(10, 25, 40, 0.96);
}
.card__quality,
 .card__type::after  {
background: linear-gradient(to right, #00d2ff, #3a8ee6);
}
html, body, .extensions
 {
background: linear-gradient(135deg, #081822, #104059);
color: #ffffff;
}
.company-start.icon--broken .company-start__icon,
.explorer-card__head-img > img,
.bookmarks-folder__layer,
.card-more__box,
.card__img
,.extensions__block-add
,.extensions__item
 {
background-color: #112b3a;
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
background: linear-gradient(to right, #00d2ff, #3a8ee6);
color: #fff;
box-shadow: 0 0.0em 0.4em rgba(72, 216, 255, 0.0);
}
.selectbox-item.focus,
.settings-folder.focus,
.settings-param.focus {
background: linear-gradient(to right, #00d2ff, #3a8ee6);
color: #fff;
box-shadow: 0 0.0em 0.4em rgba(72, 216, 255, 0.0);
border-radius: 0.5em 0 0 0.5em;
}
.full-episode.focus::after,
.card-episode.focus .full-episode::after,
.items-cards .selector.focus::after,  
.card-more.focus .card-more__box::after,
.card-episode.focus .full-episode::after,
.card-episode.hover .full-episode::after,
.card.focus .card__view::after,
.card.hover .card__view::after,
.torrent-item.focus::after,
.online-prestige.selector.focus::after,
.online-prestige--full.selector.focus::after,
.explorer-card__head-img.selector.focus::after,
.extensions__item.focus::after,
.extensions__block-add.focus::after,
.full-review-add.focus::after {
border: 0.2em solid #00d2ff;
box-shadow: 0 0 0.8em rgba(72, 216, 255, 0.0);
}
.head__action.focus,
.head__action.hover {
background: linear-gradient(45deg, #00d2ff, #3a8ee6);
}
.modal__content {
background: rgba(10, 25, 40, 0.96);
border: 0em solid rgba(10, 25, 40, 0.96);
}
.settings__content,
.settings-input__content,
.selectbox__content,
.settings-input {
background: rgba(10, 25, 40, 0.96);
}
.torrent-serial {
background: rgba(0, 0, 0, 0.22);
border: 0.2em solid rgba(0, 0, 0, 0.22);
}
.torrent-serial.focus {
background-color: #0c2e45cc;
border: 0.2em solid #00d2ff;
}
`,

            neon_pulse: `
.screensaver__preload {
    background: url("${svgUrl}") no-repeat 50% 50% !important;
    background-size: 120px 120px !important;
}
.activity__loader {
    background: url("${svgUrl}") no-repeat 50% 50% !important;
    background-size: 80px 80px !important;
    display: block !important;
}
.navigation-bar__body
{background: rgba(10, 25, 40, 0.96);
}
.card__quality,
 .card__type::after  {
background: linear-gradient(to right, #00d2ff, #3a8ee6);
}
html, body, .extensions
 {
background: linear-gradient(135deg, #081822, #112380);
color: #ffffff;
}
.company-start.icon--broken .company-start__icon,
.explorer-card__head-img > img,
.bookmarks-folder__layer,
.card-more__box,
.card__img
,.extensions__block-add
,.extensions__item
 {
background-color: #112380;
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
background: linear-gradient(to right, #00d2ff, #3a8ee6);
color: #fff;
box-shadow: 0 0.0em 0.4em rgba(72, 216, 255, 0.0);
}
.selectbox-item.focus,
.settings-folder.focus,
.settings-param.focus {
background: linear-gradient(to right, #00d2ff, #3a8ee6);
color: #fff;
box-shadow: 0 0.0em 0.4em rgba(72, 216, 255, 0.0);
border-radius: 0.5em 0 0 0.5em;
}
.full-episode.focus::after,
.card-episode.focus .full-episode::after,
.items-cards .selector.focus::after,  
.card-more.focus .card-more__box::after,
.card-episode.focus .full-episode::after,
.card-episode.hover .full-episode::after,
.card.focus .card__view::after,
.card.hover .card__view::after,
.torrent-item.focus::after,
.online-prestige.selector.focus::after,
.online-prestige--full.selector.focus::after,
.explorer-card__head-img.selector.focus::after,
.extensions__item.focus::after,
.extensions__block-add.focus::after,
.full-review-add.focus::after {
border: 0.2em solid #00d2ff;
box-shadow: 0 0 0.8em rgba(72, 216, 255, 0.0);
}
.head__action.focus,
.head__action.hover {
background: linear-gradient(45deg, #00d2ff, #3a8ee6);
}
.modal__content {
background: rgba(10, 25, 40, 0.96);
border: 0em solid rgba(10, 25, 40, 0.96);
}
.settings__content,
.settings-input__content,
.selectbox__content,
.settings-input {
background: rgba(10, 25, 40, 0.96);
}
.torrent-serial {
background: rgba(0, 0, 0, 0.22);
border: 0.2em solid rgba(0, 0, 0, 0.22);
}
.torrent-serial.focus {
background-color: #a31d9fcc;
border: 0.2em solid #00d2ff;
}
`,

            deep_aurora: `
.screensaver__preload {
    background: url("${svgUrl}") no-repeat 50% 50% !important;
    background-size: 120px 120px !important;
}
.activity__loader {
    background: url("${svgUrl}") no-repeat 50% 50% !important;
    background-size: 80px 80px !important;
    display: block !important;
}
.navigation-bar__body
{background: rgba(18, 34, 59, 0.96);
}
.card__quality,
 .card__type::after  {
background: linear-gradient(to right, #2c6fc1, #7e7ed9);
}
html, body, .extensions
 {
background: linear-gradient(135deg, #1a102b, #0a1c3f);
color: #ffffff;
}
.company-start.icon--broken .company-start__icon,
.explorer-card__head-img > img,
.bookmarks-folder__layer,
.card-more__box,
.card__img
,.extensions__block-add
,.extensions__item
 {
background-color: #171f3a;
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
background: linear-gradient(to right, #2c6fc1, #7e7ed9);
color: #fff;
box-shadow: 0 0.0em 0.4em rgba(124, 194, 255, 0.0);
}
.selectbox-item.focus,
.settings-folder.focus,
.settings-param.focus {
background: linear-gradient(to right, #2c6fc1, #7e7ed9);
color: #fff;
box-shadow: 0 0.0em 0.4em rgba(124, 194, 255, 0.0);
border-radius: 0.5em 0 0 0.5em;
}
.full-episode.focus::after,
.card-episode.focus .full-episode::after,
.items-cards .selector.focus::after,  
.card-more.focus .card-more__box::after,
.card-episode.focus .full-episode::after,
.card-episode.hover .full-episode::after,
.card.focus .card__view::after,
.card.hover .card__view::after,
.torrent-item.focus::after,
.online-prestige.selector.focus::after,
.online-prestige--full.selector.focus::after,
.explorer-card__head-img.selector.focus::after,
.extensions__item.focus::after,
.extensions__block-add.focus::after,
.full-review-add.focus::after {
border: 0.2em solid #7e7ed9;
box-shadow: 0 0 0.8em rgba(124, 194, 255, 0.0);
}
.head__action.focus,
.head__action.hover {
background: linear-gradient(45deg, #7e7ed9, #2c6fc1);
}
.modal__content {
background: rgba(18, 34, 59, 0.96);
border: 0em solid rgba(18, 34, 59, 0.96);
}
.settings__content,
.settings-input__content,
.selectbox__content,
.settings-input {
background: rgba(18, 34, 59, 0.96);
}
.torrent-serial {
background: rgba(0, 0, 0, 0.22);
border: 0.2em solid rgba(0, 0, 0, 0.22);
}
.torrent-serial.focus {
background-color: #1a102bcc;
border: 0.2em solid #7e7ed9;
}
`,

            amber_noir: `
.screensaver__preload {
    background: url("${svgUrl}") no-repeat 50% 50% !important;
    background-size: 120px 120px !important;
}
.activity__loader {
    background: url("${svgUrl}") no-repeat 50% 50% !important;
    background-size: 80px 80px !important;
    display: block !important;
}
.navigation-bar__body
{background: rgba(28, 18, 10, 0.96);
}
.card__quality,
 .card__type::after {
background: linear-gradient(to right, #f4a261, #e76f51);
}
html, body, .extensions
 {
background: linear-gradient(135deg, #1f0e04, #3b2a1e);
color: #ffffff;
}
.company-start.icon--broken .company-start__icon,
.explorer-card__head-img > img,
.bookmarks-folder__layer,
.card-more__box,
.card__img
,.extensions__block-add
,.extensions__item
 {
background-color: #2a1c11;
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
background: linear-gradient(to right, #f4a261, #e76f51);
color: #fff;
box-shadow: 0 0.0em 0.4em rgba(255, 160, 90, 0.0);
}
.selectbox-item.focus,
.settings-folder.focus,
.settings-param.focus {
background: linear-gradient(to right, #f4a261, #e76f51);
color: #fff;
box-shadow: 0 0.0em 0.4em rgba(255, 160, 90, 0.0);
border-radius: 0.5em 0 0 0.5em;
}
.full-episode.focus::after,
.card-episode.focus .full-episode::after,
.items-cards .selector.focus::after,  
.card-more.focus .card-more__box::after,
.card-episode.focus .full-episode::after,
.card-episode.hover .full-episode::after,
.card.focus .card__view::after,
.card.hover .card__view::after,
.torrent-item.focus::after,
.online-prestige.selector.focus::after,
.online-prestige--full.selector.focus::after,
.explorer-card__head-img.selector.focus::after,
.extensions__item.focus::after,
.extensions__block-add.focus::after,
.full-review-add.focus::after {
border: 0.2em solid #f4a261;
box-shadow: 0 0 0.8em rgba(255, 160, 90, 0.0);
}
.head__action.focus,
.head__action.hover {
background: linear-gradient(45deg, #f4a261, #e76f51);
}
.modal__content {
background: rgba(28, 18, 10, 0.96);
border: 0em solid rgba(28, 18, 10, 0.96);
}
.settings__content,
.settings-input__content,
.selectbox__content,
.settings-input {
background: rgba(28, 18, 10, 0.96);
}
.torrent-serial {
background: rgba(0, 0, 0, 0.22);
border: 0.2em solid rgba(0, 0, 0, 0.22);
}
.torrent-serial.focus {
background-color: #3b2412cc;
border: 0.2em solid #f4a261;
}
`,

            velvet_sakura: `
.screensaver__preload {
    background: url("${svgUrl}") no-repeat 50% 50% !important;
    background-size: 120px 120px !important;
}
.activity__loader {
    background: url("${svgUrl}") no-repeat 50% 50% !important;
    background-size: 80px 80px !important;
    display: block !important;
}
.navigation-bar__body
{background: rgba(56, 32, 45, 0.96);
}
.card__quality,
 .card__type::after  {
background: linear-gradient(to right, #f6a5b0, #f9b8d3);
}
html, body, .extensions
 {
background: linear-gradient(135deg, #4b0e2b, #7c2a57);
color: #ffffff;
}
.company-start.icon--broken .company-start__icon,
.explorer-card__head-img > img,
.bookmarks-folder__layer,
.card-more__box,
.card__img
,.extensions__block-add
,.extensions__item
 {
background-color: #5c0f3f;
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
background: linear-gradient(to right, #f6a5b0, #f9b8d3);
color: #fff;
box-shadow: 0 0.0em 0.4em rgba(246, 165, 176, 0.0);
}
.selectbox-item.focus,
.settings-folder.focus,
.settings-param.focus {
background: linear-gradient(to right, #f6a5b0, #f9b8d3);
color: #fff;
box-shadow: 0 0.0em 0.4em rgba(246, 165, 176, 0.0);
border-radius: 0.5em 0 0 0.5em;
}
.full-episode.focus::after,
.card-episode.focus .full-episode::after,
.items-cards .selector.focus::after,  
.card-more.focus .card-more__box::after,
.card-episode.focus .full-episode::after,
.card-episode.hover .full-episode::after,
.card.focus .card__view::after,
.card.hover .card__view::after,
.torrent-item.focus::after,
.online-prestige.selector.focus::after,
.online-prestige--full.selector.focus::after,
.explorer-card__head-img.selector.focus::after,
.extensions__item.focus::after,
.extensions__block-add.focus::after,
.full-review-add.focus::after {
border: 0.2em solid #f6a5b0;
box-shadow: 0 0 0.8em rgba(246, 165, 176, 0.0);
}
.head__action.focus,
.head__action.hover {
background: linear-gradient(45deg, #f9b8d3, #f6a5b0);
}
.modal__content {
background: rgba(56, 32, 45, 0.96);
border: 0em solid rgba(56, 32, 45, 0.96);
}
.settings__content,
.settings-input__content,
.selectbox__content,
.settings-input {
background: rgba(56, 32, 45, 0.96);
}
.torrent-serial {
background: rgba(0, 0, 0, 0.22);
border: 0.2em solid rgba(0, 0, 0, 0.22);
}
.torrent-serial.focus {
background-color: #7c2a57cc;
border: 0.2em solid #f6a5b0;
}
`
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
    
    // ... (решта коду залишається без змін)
