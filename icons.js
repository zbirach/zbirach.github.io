(function(){
    'use strict';

    Lampa.Plugin.add({
        title: 'Color Icons',
        id: 'color_icons',
        version: '1.1',
        description: 'Зміна кольорів усіх іконок у меню та налаштуваннях',
        author: 'GPT'
    });

    function applyColors(){
        // Головне меню: font-icon (іконки-шрифт)
        document.querySelectorAll('.menu .menu__ico, .menu .menu__item .icon').forEach(el=>{
            el.style.color = '#ff4444'; // червоний
        });

        // Inline SVG іконки (приклад: anime, releases)
        document.querySelectorAll('.menu .menu__item svg path').forEach(el=>{
            el.setAttribute('fill', '#ff4444');
        });

        // PNG іконки (деякі елементи меню) — підсвічування через invert
        document.querySelectorAll('.menu .menu__item img').forEach(el=>{
            el.style.filter = 'invert(39%) sepia(95%) saturate(5000%) hue-rotate(340deg)'; 
        });

        // Меню налаштувань
        document.querySelectorAll('.settings-container .settings__item .settings__icon').forEach(el=>{
            el.style.color = '#00ccff'; // блакитний
        });

        // Активні пункти
        document.querySelectorAll('.menu .menu__item.active').forEach(el=>{
            el.style.backgroundColor = '#222244'; 
        });
    }

    // чекати DOM
    document.addEventListener("DOMContentLoaded", applyColors);

    // оновлювати при перемиканні
    Lampa.Listener.follow('app', function(e){
        if(e.type == 'ready') applyColors();
    });

})();
