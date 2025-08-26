(function(){
    'use strict';

    Lampa.Plugin.add({
        title: 'Color Icons',
        id: 'color_icons',
        version: '1.0',
        description: 'Зміна кольорів іконок головного меню та налаштувань',
        author: 'GPT'
    });

    function applyColors(){
        // Колір іконок головного меню
        document.querySelectorAll('.menu .menu__item .menu__ico').forEach(el=>{
            el.style.filter = 'invert(39%) sepia(95%) saturate(5000%) hue-rotate(180deg)'; 
            // заміни filter на свій колір (наприклад: el.style.color = "#ff0000"; якщо іконки svg)
        });

        // Колір іконок у меню налаштувань
        document.querySelectorAll('.settings-container .settings__item .settings__icon').forEach(el=>{
            el.style.color = '#00ff99'; // салатовий приклад
        });

        // Колір тексту меню
        document.querySelectorAll('.menu .menu__item').forEach(el=>{
            el.style.color = '#ffffff'; 
        });

        // Колір активного пункту
        document.querySelectorAll('.menu .menu__item.active').forEach(el=>{
            el.style.backgroundColor = '#222244'; 
        });
    }

    // чекати коли Lampa завантажить DOM
    document.addEventListener("DOMContentLoaded", applyColors);
    // ще раз після перемикання розділів
    Lampa.Listener.follow('app', function(e){
        if(e.type == 'ready') applyColors();
    });

})();
