(function(){
    function applyCustomColors(){
        let style = document.createElement('style');
        style.innerHTML = `
        /* Головне меню */
        .menu__item .menu__ico svg {
            fill: #ff4444 !important; /* червоний */
        }
        /* Меню налаштувань */
        .settings__item .settings__ico svg {
            fill: #44aaff !important; /* синій */
        }
        `;
        document.head.appendChild(style);
    }

    Lampa.Listener.follow('app', function (e) {
        if (e.type === 'ready') {
            applyCustomColors();
        }
    });
})();
