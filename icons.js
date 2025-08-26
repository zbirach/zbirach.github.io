(function(){
    // 🎨 Тут задаємо свої кольори
    const colors = {
        menu: "#ff4444",      // колір іконок у головному меню
        settings: "#44aaff"   // колір іконок у налаштуваннях
    };

    function applyCustomColors(){
        let style = document.createElement('style');
        style.innerHTML = `
        /* Головне меню */
        .menu__item .menu__ico svg {
            fill: ${colors.menu} !important;
        }
        /* Меню налаштувань */
        .settings__item .settings__ico svg {
            fill: ${colors.settings} !important;
        }
        `;
        document.head.appendChild(style);
    }

    // Запускаємо після завантаження додатку
    Lampa.Listener.follow('app', function (e) {
        if (e.type === 'ready') {
            applyCustomColors();
        }
    });
})();
