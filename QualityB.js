/**
 * Quality+Mod - Enhanced Quality Plugin for Lampa
 * --------------------------------------------------------------------------------
 * Розширений плагін для автоматичного визначення та відображення якості відео
 * Інтегрується з JacRed API для пошуку найкращих доступних релізів.
 * --------------------------------------------------------------------------------
 * Основні можливості:
 * - Автоматичне визначення якості відео (4K, FHD, HD, SD) з торрент-трекера JacRed
 * - Розширена система парсингу якості з розпізнаванням роздільності та джерела
 * - Підтримка спрощених міток якості (4K, FHD, TS, TC тощо) з можливістю налаштування
 * - Відображення міток якості на повних картках та спискових картках з кастомними стилями
 * - Ручні перевизначення якості для конкретних ID контенту
 * - Розумна система кешування з фоновим оновленням (24 години валідності)
 * - Оптимізована черга запитів з обмеженням паралельності (до 12 одночасних запитів)
 * - Підтримка проксі для обходу CORS обмежень
 * - Можливість відключення якості для серіалів
 * - Детальне логування для налагодження
 * --------------------------------------------------------------------------------
 * Конфігурація:
 * - Налаштування кольорів, шрифтів та розмірів міток
 * - Включення/виключення якості для серіалів
 * - Використання спрощених міток якості
 * - Налаштування проксі та таймаутів
 * - Ручні перевизначення для конкретних ID
 * - Детальне логування різних компонентів
 */

(function() {
    'use strict'; // Використання суворого режиму для запобігання помилок

    // ===================== КОНФІГУРАЦІЯ =====================
    var LQE_CONFIG = {
        CACHE_VERSION: 2, // Версія кешу для інвалідації старих даних
        LOGGING_GENERAL: false, // Загальне логування для налагодження
        LOGGING_QUALITY: false, // Логування процесу визначення якості
        LOGGING_CARDLIST: false, // Логування для спискових карток
        CACHE_VALID_TIME_MS: 24 * 60 * 60 * 1000, // Час життя кешу (24 години)
        CACHE_REFRESH_THRESHOLD_MS: 12 * 60 * 60 * 1000, // Час для фонового оновлення кешу (12 годин)
        CACHE_KEY: 'lampa_quality_cache', // Ключ для зберігання кешу в LocalStorage
        JACRED_PROTOCOL: 'http://', // Протокол для API JacRed
        JACRED_URL: 'jacred.xyz', // Домен API JacRed
        JACRED_API_KEY: '', // Ключ API (не використовується в даній версії)
        PROXY_LIST: [ // Список проксі серверів для обходу CORS обмежень
            'http://api.allorigins.win/raw?url=',
            'http://cors.bwa.workers.dev/'
        ],
        PROXY_TIMEOUT_MS: 4000, // Таймаут для проксі запитів (4 секунди)
        SHOW_QUALITY_FOR_TV_SERIES: true, // ✅ Показувати якість для серіалів
        MAX_PARALLEL_REQUESTS: 12, // Максимальна кількість паралельних запитів
        
        USE_SIMPLE_QUALITY_LABELS: true, // ✅ Використовувати спрощені мітки якості (4K, FHD, TS, TC тощо) "true" - так /  "false" - ні
        
        // Стилі для відображення якості на повній картці
        FULL_CARD_LABEL_BORDER_COLOR: '#FFFFFF',
        FULL_CARD_LABEL_TEXT_COLOR: '#FFFFFF',
        FULL_CARD_LABEL_FONT_WEIGHT: 'normal',
        FULL_CARD_LABEL_FONT_SIZE: '1.2em',
        FULL_CARD_LABEL_FONT_STYLE: 'normal',
        
        // Стилі для відображення якості на спискових картках
        LIST_CARD_LABEL_BORDER_COLOR: '#3DA18D',
        LIST_CARD_LABEL_BACKGROUND_COLOR: 'rgba(61, 161, 141, 0.9)', //Стандартна прозорість фону 0.8 (1 - фон не прозорий)
        LIST_CARD_LABEL_BACKGROUND_TRANSPARENT: false,
        LIST_CARD_LABEL_TEXT_COLOR: '#FFFFFF',
        LIST_CARD_LABEL_FONT_WEIGHT: '600',
        LIST_CARD_LABEL_FONT_SIZE: '1.1em',
        LIST_CARD_LABEL_FONT_STYLE: 'normal',
        
        // Ручні перевизначення якості для конкретних ID контенту
		MANUAL_OVERRIDES: {
    		'338969': { 
        		quality_code: 2160, 
        		full_label: '4K WEB-DL', //✅ Повна мітка
        		simple_label: '4K'  	 //✅ Спрощена мітка
    		},
    		'654028': { 
        		quality_code: 2160, 
        		full_label: '4K WEB-DL', //✅ Повна мітка
        		simple_label: '4K'  	 //✅ Спрощена мітка
    		},
	    	'12556': { 
        		quality_code: 1080, 
        		full_label: '1080 ВDRemux', //✅ Повна мітка
        		simple_label: 'FHD'  	 //✅ Спрощена мітка
    		},
    		'604079': { 
        		quality_code: 2160, 
        		full_label: '4K WEB-DL', //✅ Повна мітка
        		simple_label: '4K'  	 //✅ Спрощена мітка
    		},
	    	'1267905': { 
        		quality_code: 2160, 
        		full_label: '4K WEB-DL', //✅ Повна мітка
        		simple_label: '4K'  	 //✅ Спрощена мітка
    		}

			/*'Тут ID фільму': { 
        		quality_code: 1080, 
        		full_label: '1080p WEB-DLRip',  //✅ Повна мітка
        		simple_label: 'FHD'  		    //✅ Спрощена мітка
    		},*/
		}
    };
    var currentGlobalMovieId = null; // Змінна для відстеження поточного ID фільму

    // ===================== МАПИ ДЛЯ ПАРСИНГУ ЯКОСТІ =====================
    
    // Мапа для прямих відповідностей назв якості (fallback)
    var QUALITY_DISPLAY_MAP = {
        "WEBRip 1080p | AVC @ звук с TS": "1080P WEBRip/TS",
        "TeleSynch 1080P": "1080P TS",
        "4K Web-DL 10bit HDR P81 HEVC": "4K WEB-DL",
        "Telecine [H.264/1080P] [звук с TS] [AD]": "1080P TS",
        "WEB-DLRip @ Синема УС": "WEB-DLRip",
        "UHD Blu-ray disc 2160p": "4K Blu-ray",
        "Blu-ray disc 1080P]": "1080P Blu-ray",
        "Blu-Ray Remux (1080P)": "1080P BDRemux",
        "BDRemux 1080P] [Крупний план]": "1080P BDRemux",
        "Blu-ray disc (custom) 1080P]": "1080P BDRip",
        "DVDRip [AV1/2160p] [4K, SDR, 10-bit] [hand made Upscale AI]": "4K Upscale AI",
        "Hybrid (2160p)": "4K Hybrid",
        "Blu-ray disc] [Mastered in 4K] [Extended Cut]": "4K Blu-ray",
        "4K, HEVC, HDR / Blu-Ray Remux (2160p)": "4K BDRemux",
        "4K, HEVC, HDR, HDR10+, Dolby Vision / Hybrid (2160p)": "4K Hybrid",
        "4K, HEVC, HDR, Dolby Vision P7 / Blu-Ray Remux (2160p)": "4K BDRemux",
        "4K, HEVC, HDR, Dolby Vision / Blu-Ray Remux (2160p)": "4K BDRemux",
        "Blu-Ray Remux 2160p | 4K | HDR | Dolby Vision P7": "4K BDRemux",
        "4K, HEVC, HDR / WEB-DLRip (2160p)": "4K WEB-DLRip",
        "Blu-ray disc (custom) 1080P] [StudioCanal]": "1080P BDRip",
        "HDTVRip [H.264/720p]": "720p HDTVRip",
        "HDTVRip 720p": "720p HDTVRip",
        "2025 / ЛМ / TC": "TC", // Telecine
      
        // Стандартні варіанти якості
        "2160p": "4K", "4k": "4K", "4К": "4K", "1080p": "1080p", "1080": "1080p", 
        "1080i": "1080p", "hdtv 1080i": "1080i FHDTV", "480p": "SD", "480": "SD",
        "web-dl": "WEB-DL", "webrip": "WEBRip", "web-dlrip": "WEB-DLRip",
        "bluray": "BluRay", "bdrip": "BDRip", "bdremux": "BDRemux",
        "hdtvrip": "HDTVRip", "dvdrip": "DVDRip", "ts": "TS", "camrip": "CAMRip",
  	  
        "blu-ray remux (2160p)": "4K BDRemux", "hdtvrip 2160p": "4K HDTVRip", "hybrid 2160p": "4K Hybrid",
        "web-dlrip (2160p)": "4K WEB-DLRip",
        "1080p web-dlrip": "1080p WEB-DLRip", "webdlrip": "WEB-DLRip", "hdtvrip-avc": "HDTVRip-AVC",
        "HDTVRip (1080p)": "1080p FHDTVRip", "hdrip": "HDRip",
        "hdtvrip (720p)": "720p HDTVRip",
        "dvdrip": "DVDRip", "hdtv": "HDTV", "dsrip": "DSRip", "satrip": "SATRip",
		"telecine": "TC", "tc": "TC", "ts": "TS"
      
    };

    // Мапа для визначення роздільності з назви
    var RESOLUTION_MAP = {
        "2160p":"4K", "2160":"4K", "4k":"4K", "4к":"4K", "uhd":"4K", "ultra hd":"4K", "ultrahd":"4K", "dci 4k":"4K",
        "1440p":"QHD", "1440":"QHD", "2k":"QHD", "qhd":"QHD",
        "1080p":"1080p", "1080":"1080p", "1080i":"1080i", "full hd":"1080p", "fhd":"1080p",
        "720p":"720p", "720":"720p", "hd":"720p", "hd ready":"720p",
        "576p":"576p", "576":"576p", "pal":"576p", 
        "480p":"480p", "480":"480p", "sd":"480p", "standard definition":"480p", "ntsc":"480p",
        "360p":"360p", "360":"360p", "low":"360p"
    };
    // Мапа для визначення джерела відео
    var SOURCE_MAP = {
        "blu-ray remux":"BDRemux", "uhd bdremux":"4K BDRemux", "bdremux":"BDRemux", 
        "remux":"BDRemux", "blu-ray disc":"Blu-ray", "bluray":"Blu-ray", 
        "blu-ray":"Blu-ray", "bdrip":"BDRip", "brrip":"BDRip",
        "uhd blu-ray":"4K Blu-ray", "4k blu-ray":"4K Blu-ray",
        "web-dl":"WEB-DL", "webdl":"WEB-DL", "web dl":"WEB-DL",
        "web-dlrip":"WEB-DLRip", "webdlrip":"WEB-DLRip", "web dlrip":"WEB-DLRip",
        "webrip":"WEBRip", "web rip":"WEBRip", "hdtvrip":"HDTVRip", 
        "hdtv":"HDTVRip", "hdrip":"HDRip", "dvdrip":"DVDRip", "dvd rip":"DVDRip", 
        "dvd":"DVD", "dvdscr":"DVDSCR", "scr":"SCR", "bdscr":"BDSCR", "r5":"R5",
        "hdrip": "HDRip",
        "screener": "SCR",
        "telecine":"TC", "tc":"TC", "hdtc":"TC", "telesync":"TS", "ts":"TS", 
        "hdts":"TS", "camrip":"CAMRip", "cam":"CAMRip", "hdcam":"CAMRip",
        "vhsrip":"VHSRip", "vcdrip":"VCDRip", "dcp":"DCP", "workprint":"Workprint", 
        "preair":"Preair", "tv":"TVRip", "line":"Line Audio", "hybrid":"Hybrid", 
        "uhd hybrid":"4K Hybrid", "upscale":"Upscale", "ai upscale":"AI Upscale",
        "bd3d":"3D Blu-ray", "3d blu-ray":"3D Blu-ray"
    };
    // Мапа для спрощення повних назв якості до коротких форматів
    var QUALITY_SIMPLIFIER_MAP = {
    // Якість (роздільність)
    "2160p": "4K", "2160": "4K", "4k": "4K", "4к": "4K", "uhd": "4K", "ultra hd": "4K", "dci 4k": "4K", "ultrahd": "4K",
    "1440p": "QHD", "1440": "QHD", "2k": "QHD", "qhd": "QHD",
    "1080p": "FHD", "1080": "FHD", "1080i": "FHD", "full hd": "FHD", "fhd": "FHD",
    "720p": "HD", "720": "HD", "hd ready": "HD", "hd": "HD",
    "480p": "SD", "480": "SD", "sd": "SD", "pal": "SD", "ntsc": "SD", "576p": "SD", "576": "SD",
    "360p": "LQ", "360": "LQ",

    // Погана якість (джерело) - мають пріоритет над роздільністю при відображенні
    "camrip": "CamRip", "cam": "CamRip", "hdcam": "CamRip", "камрип": "CamRip",
    "telesync": "TS", "ts": "TS", "hdts": "TS", "телесинк": "TS",
    "telecine": "TC", "tc": "TC", "hdtc": "TC", "телесин": "TC",
    "dvdscr": "SCR", "scr": "SCR", "bdscr": "SCR", "screener": "SCR",

    // Якісні джерела
    "remux": "Remux", "bdremux": "Remux", "blu-ray remux": "Remux",
    "bluray": "BR", "blu-ray": "BR", "bdrip": "BRip", "brrip": "BRip",
    "web-dl": "WebDL", "webdl": "WebDL",
    "webrip": "WebRip", "web-dlrip": "WebDLRip", "webdlrip": "WebDLRip",
    "hdtv": "HDTV", "hdtvrip": "HDTV",
    "hdrip": "HDRip",
    "dvdrip": "DVDRip", "dvd": "DVD"
    };
    // ===================== СТИЛІ CSS =====================
    
    // Основні стилі для відображення якості
    var styleLQE = "<style id=\"lampa_quality_styles\">" +
        ".full-start-new__rate-line {" + // Контейнер для лінії рейтингу повної картки
        "visibility: hidden;" + // Приховано під час завантаження
        "flex-wrap: wrap;" + // Дозволити перенос елементів
        "gap: 0.4em 0;" + // Відступи між елементами
        "}" +
        ".full-start-new__rate-line > * {" + // Стилі для всіх дітей лінії рейтингу
        "margin-right: 0.5em;" + // Відступ праворуч
        "flex-shrink: 0;" + // Заборонити стискання
        "flex-grow: 0;" + // Заборонити розтягування
        "}" +
        ".lqe-quality {" + // Стилі для мітки якості на повній картці
        "min-width: 2.8em;" + // Мінімальна ширина
        "text-align: center;" + // Вирівнювання тексту по центру
        "text-transform: none;" + // Без трансформації тексту
        "border: 1px solid " + LQE_CONFIG.FULL_CARD_LABEL_BORDER_COLOR + " !important;" + // Колір рамки з конфігурації
        "color: " + LQE_CONFIG.FULL_CARD_LABEL_TEXT_COLOR + " !important;" + // Колір тексту
        "font-weight: " + LQE_CONFIG.FULL_CARD_LABEL_FONT_WEIGHT + " !important;" + // Товщина шрифту
        "font-size: " + LQE_CONFIG.FULL_CARD_LABEL_FONT_SIZE + " !important;" + // Розмір шрифту
        "font-style: " + LQE_CONFIG.FULL_CARD_LABEL_FONT_STYLE + " !important;" + // Стиль шрифту
        "border-radius: 0.2em;" + // Закруглення кутів
        "padding: 0.3em;" + // Внутрішні відступи
        "height: 1.72em;" + // Фіксована висота
        "display: flex;" + // Flexbox для центрування
        "align-items: center;" + // Вертикальне центрування
        "justify-content: center;" + // Горизонтальне центрування
        "box-sizing: border-box;" + // Box-model
        "}" +
        ".card__view {" + // Контейнер для картки у списку
        " position: relative; " + // Відносне позиціонування
        "}" +
        ".card__quality {" + // Стилі для мітки якості на списковій картці
        " position: absolute; " + // Абсолютне позиціонування
        " bottom: 0.50em; " + // Відступ від низу
        " left: 0; " + // Вирівнювання по лівому краю
		" margin-left: -0.78em; " + //ВІДСТУП за лівий край 
        " background-color: " + (LQE_CONFIG.LIST_CARD_LABEL_BACKGROUND_TRANSPARENT ? "transparent" : LQE_CONFIG.LIST_CARD_LABEL_BACKGROUND_COLOR) + " !important;" + // Колір фону
        " z-index: 10;" + // Z-index для поверх інших елементів
        " width: fit-content; " + // Ширина по вмісту
        " max-width: calc(100% - 1em); " + // Максимальна ширина
        " border-radius: 0.3em 0.3em 0.3em 0.3em; " + // Закруглення кутів
        " overflow: hidden;" + // Обрізання переповнення
        "}" +
        ".card__quality div {" + // Стилі для тексту всередині мітки якості
        " text-transform: uppercase; " + // Великі літери
        " font-family: 'Roboto Condensed', 'Arial Narrow', Arial, sans-serif; " + // Шрифт
        " font-weight: 700; " + // Жирний шрифт
        " letter-spacing: 0.1px; " + // Відстань між літерами
        " font-size: 1.10em; " + // Розмір шрифту
        " color: " + LQE_CONFIG.LIST_CARD_LABEL_TEXT_COLOR + " !important;" + // Колір тексту
        " padding: 0.1em 0.1em 0.08em 0.1em; " + // Внутрішні відступи
        " white-space: nowrap;" + // Заборонити перенос тексту
        " text-shadow: 0.5px 0.5px 1px rgba(0,0,0,0.3); " + // Тінь тексту
        "}" +
        "</style>";
    // Додаємо стилі до DOM
    Lampa.Template.add('lampa_quality_css', styleLQE);
    $('body').append(Lampa.Template.get('lampa_quality_css', {}, true));
    // Стилі для плавного з'явлення міток якості
	var fadeStyles = "<style id='lampa_quality_fade'>" +
   		".card__quality, .full-start__status.lqe-quality {" + // Елементи для анімації
        "opacity: 0;" + // Початково прозорі
        "transition: opacity 0.22s ease-in-out;" + // Плавна зміна прозорості
    	"}" +
    	".card__quality.show, .full-start__status.lqe-quality.show {" + // Клас для показу
        "opacity: 1;" + // Повністю видимі
    	"}" +
    	".card__quality.show.fast, .full-start__status.lqe-quality.show.fast {" + // Вимкнення переходу
        "transition: none !important;" +
    	"}" +
		"</style>";

    Lampa.Template.add('lampa_quality_fade', fadeStyles);
    $('body').append(Lampa.Template.get('lampa_quality_fade', {}, true));

    // Стилі для анімації завантаження (крапки)
    var loadingStylesLQE = "<style id=\"lampa_quality_loading_animation\">" +
        ".loading-dots-container {" + // Контейнер для анімації завантаження
        "    position: absolute;" + // Абсолютне позиціонування
        "    top: 50%;" + // По центру вертикалі
        "    left: 0;" + // Лівий край
        "    right: 0;" + // Правий край
        "    text-align: left;" + // Вирівнювання тексту ліворуч
        "    transform: translateY(-50%);" + // Центрування по вертикалі
        "    z-index: 10;" + // Поверх інших елементів
        "}" +
        ".full-start-new__rate-line {" + // Лінія рейтингу
        "    position: relative;" + // Відносне позиціонування для абсолютних дітей
        "}" +
        ".loading-dots {" + // Контейнер крапок завантаження
        "    display: inline-flex;" + // Inline-flex для вирівнювання
        "    align-items: center;" + // Центрування по вертикалі
        "    gap: 0.4em;" + // Відступи між елементами
        "    color: #ffffff;" + // Колір тексту
        "    font-size: 0.7em;" + // Розмір шрифту
        "    background: rgba(0, 0, 0, 0.3);" + // Напівпрозорий фон
        "    padding: 0.6em 1em;" + // Внутрішні відступи
        "    border-radius: 0.5em;" + // Закруглення кутів
        "}" +
        ".loading-dots__text {" + // Текст "Пошук..."
        "    margin-right: 1em;" + // Відступ праворуч
        "}" +
        ".loading-dots__dot {" + // Окремі крапки
        "    width: 0.5em;" + // Ширина крапки
        "    height: 0.5em;" + // Висота крапки
        "    border-radius: 50%;" + // Кругла форма
        "    background-color: currentColor;" + // Колір як у тексту
        "    opacity: 0.3;" + // Напівпрозорість
        "    animation: loading-dots-fade 1.5s infinite both;" + // Анімація
        "}" +
        ".loading-dots__dot:nth-child(1) {" + // Перша крапка
        "    animation-delay: 0s;" + // Без затримки
        "}" +
        ".loading-dots__dot:nth-child(2) {" + // Друга крапка
        "    animation-delay: 0.5s;" + // Затримка 0.5с
        "}" +
        ".loading-dots__dot:nth-child(3) {" + // Третя крапка
        "    animation-delay: 1s;" + // Затримка 1с
        "}" +
        "@keyframes loading-dots-fade {" + // Анімація миготіння крапок
        "    0%, 90%, 100% { opacity: 0.3; }" + // Низька прозорість
        "    35% { opacity: 1; }" + // Пік видимості
        "}" +
        "@media screen and (max-width: 480px) { .loading-dots-container { -webkit-justify-content: center; justify-content: center; text-align: center; max-width: 100%; }}" + // Адаптація для мобільних
        "</style>";

    Lampa.Template.add('lampa_quality_loading_animation_css', loadingStylesLQE);
    $('body').append(Lampa.Template.get('lampa_quality_loading_animation_css', {}, true));

    // ===================== МЕРЕЖЕВІ ФУНКЦІЇ =====================
    
    /**
     * Виконує запит через проксі з обробкою помилок
     * @param {string} url - URL для запиту
     * @param {string} cardId - ID картки для логування
     * @param {function} callback - Callback функція
     */
    function fetchWithProxy(url, cardId, callback) {
        var currentProxyIndex = 0; // Поточний індекс проксі в списку
        var callbackCalled = false; // Прапорець виклику callback

        // Рекурсивна функція спроб через різні проксі
        function tryNextProxy() {
            // Перевіряємо, чи не вичерпано всі проксі
            if (currentProxyIndex >= LQE_CONFIG.PROXY_LIST.length) {
                if (!callbackCalled) { // Якщо callback ще не викликано
                    callbackCalled = true;
                    callback(new Error('All proxies failed for ' + url)); // Повертаємо помилку
                }
                return;
            }
            
            // Формуємо URL з поточним проксі
            var proxyUrl = LQE_CONFIG.PROXY_LIST[currentProxyIndex] + encodeURIComponent(url);
            if (LQE_CONFIG.LOGGING_GENERAL) console.log("LQE-LOG", "card: " + cardId + ", Fetch with proxy: " + proxyUrl);
            // Встановлюємо таймаут для запиту
            var timeoutId = setTimeout(function() {
                if (!callbackCalled) { // Якщо ще не отримали відповідь
                    currentProxyIndex++; // Переходимо до наступного проксі
                    tryNextProxy(); // Рекурсивний виклик
                }
            }, LQE_CONFIG.PROXY_TIMEOUT_MS);
            // Виконуємо fetch запит
            fetch(proxyUrl)
                .then(function(response) {
                    clearTimeout(timeoutId); // Очищаємо таймаут
                    if (!response.ok) throw new Error('Proxy error: ' + response.status); // Перевіряємо статус
                    return response.text(); // Повертаємо текст відповіді
                })
                .then(function(data) {
                    if (!callbackCalled) {
                        callbackCalled = true;
                        clearTimeout(timeoutId);
                        callback(null, data); // Успішний запит
                    }
                })
                .catch(function(error) {
                    console.error("LQE-LOG", "card: " + cardId + ", Proxy fetch error for " + proxyUrl + ":", error);
                    clearTimeout(timeoutId);
                    if (!callbackCalled) {
                        currentProxyIndex++; // Переходимо до наступного проксі
                        tryNextProxy(); // Рекурсивний виклик
                    }
                });
        }
        
        tryNextProxy(); // Починаємо з першого проксі
    }

    // ===================== АНІМАЦІЯ ЗАВАНТАЖЕННЯ =====================
    
    /**
     * Додає анімацію завантаження до картки
     * @param {string} cardId - ID картки
     * @param {Element} renderElement - DOM елемент
     */
    function addLoadingAnimation(cardId, renderElement) {
        if (!renderElement) return; // Перевірка наявності елемента
        if (LQE_CONFIG.LOGGING_GENERAL) console.log("LQE-LOG", "card: " + cardId + ", Add loading animation");
        // Знаходимо лінію рейтингу в контексті renderElement
        var rateLine = $('.full-start-new__rate-line', renderElement);
        // Перевіряємо наявність лінії та відсутність вже доданої анімації
        if (!rateLine.length || $('.loading-dots-container', rateLine).length) return;
        // Додаємо HTML структуру анімації
        rateLine.append(
            '<div class="loading-dots-container">' +
            '<div class="loading-dots">' +
            '<span class="loading-dots__text">Пошук...</span>' + // Текст завантаження
            '<span class="loading-dots__dot"></span>' + // Крапка 1
            '<span class="loading-dots__dot"></span>' + // Крапка 2
            '<span class="loading-dots__dot"></span>' + // Крапка 3
            '</div>' +
            '</div>'
        );
        // Робимо анімацію видимою
        $('.loading-dots-container', rateLine).css({
            'opacity': '1',
            'visibility': 'visible'
        });
    }

    /**
     * Видаляє анімацію завантаження
     * @param {string} cardId - ID картки
     * @param {Element} renderElement - DOM елемент
     */
    function removeLoadingAnimation(cardId, renderElement) {
        if (!renderElement) return;
        if (LQE_CONFIG.LOGGING_GENERAL) console.log("LQE-LOG", "card: " + cardId + ", Remove loading animation");
        // Видаляємо контейнер з анімацією
        $('.loading-dots-container', renderElement).remove();
    }

    // ===================== УТІЛІТИ =====================
    
    /**
     * Визначає тип контенту (фільм/серіал)
     * @param {object} cardData - Дані картки
     * @returns {string} - 'movie' або 'tv'
     */
    function getCardType(cardData) {
        var type = cardData.media_type || cardData.type; // Отримуємо тип з даних
        if (type === 'movie' || type === 'tv') return type; // Якщо тип визначено
        return cardData.name || cardData.original_name ? 'tv' : 'movie'; // Визначаємо по наявності назви
    }

    /**
     * Очищує та нормалізує назву для пошуку
     * @param {string} title - Оригінальна назва
     * @returns {string} - Нормалізована назва
     */
    function sanitizeTitle(title) {
        if (!title) return ''; // Перевірка на пусту назву
        // Приводимо до нижнього регістру, замінюємо роздільники на пробіли, видаляємо зайві пробіли
        return title.toString().toLowerCase()
                   .replace(/[\._\-\[\]\(\),]+/g, ' ') // Заміна роздільників на пробіли
                   .replace(/\s+/g, ' ') // Видалення зайвих пробілів
                   .trim(); // Обрізка пробілів по краях
    }

    /**
     * Генерує ключ для кешу
     * @param {number} version - Версія кешу
     * @param {string} type - Тип контенту
     * @param {string} id - ID картки
     * @returns {string} - Ключ кешу
     */
    function makeCacheKey(version, type, id) {
        return version + '_' + (type === 'tv' ? 'tv' : 'movie') + '_' + id; // Форматуємо ключ
    }

    // ===================== ПАРСИНГ ЯКОСТІ =====================
    
/**
 * Спрощує повну назву якості до короткого формату (Фінальна версія)
 * @param {string} fullLabel - Повна назва якості (вибрана з найкращого релізу JacRed)
 * @param {string} originalTitle - Оригінальна назва торренту
 * @returns {string} - Спрощена назва для відображення на мітці
 */
function simplifyQualityLabel(fullLabel, originalTitle) {
    if (!fullLabel) return ''; // Перевірка на пусту назву
    
    var lowerLabel = fullLabel.toLowerCase(); // Нижній регістр для порівняння
    // var lowerTitle = (originalTitle || '').toLowerCase(); // ❌ БІЛЬШЕ НЕ ВИКОРИСТОВУЄМО (бо перебиває якісний реліз)

    // --- Крок 1: Погані якості (найвищий пріоритет) ---
    // Якщо JacRed вибрав реліз з поганою якістю - показуємо тип якості
    // Це означає що кращих варіантів немає
    
    // CamRip - найгірша якість (запис з кінотеатру камерою)
    if (/(camrip|камрип|cam\b)/.test(lowerLabel)) {
        if (LQE_CONFIG.LOGGING_QUALITY) console.log("LQE-QUALITY", "Simplified to CamRip");
        return "CamRip";
    }
    
    // TS (Telesync) - погана якість (запис з проектора)
    if (/(telesync|телесинк|ts\b)/.test(lowerLabel)) {
        if (LQE_CONFIG.LOGGING_QUALITY) console.log("LQE-QUALITY", "Simplified to TS");
        return "TS";
    }
    
    // TC (Telecine) - погана якість (запис з кіноплівки)
    if (/(telecine|телесин|tc\b)/.test(lowerLabel)) {
        if (LQE_CONFIG.LOGGING_QUALITY) console.log("LQE-QUALITY", "Simplified to TC");
        return "TC";
    }
    
    // SCR (DVD Screener) - погана якість (промо-копія)
    if (/(dvdscr|scr\b)/.test(lowerLabel)) {
        if (LQE_CONFIG.LOGGING_QUALITY) console.log("LQE-QUALITY", "Simplified to SCR");
        return "SCR";
    }

    // --- Крок 2: Якісні джерела (тільки якщо немає поганих якостей) ---
    // Якщо JacRed вибрав якісний реліз - показуємо роздільність
    
    // 4K (Ultra HD) - найвища якість
    if (/(2160p|4k|uhd|ultra hd)/.test(lowerLabel)) {
        if (LQE_CONFIG.LOGGING_QUALITY) console.log("LQE-QUALITY", "Simplified to 4K");
        return "4K";
    }

    // 2К (QHD) - висока якість
    if (/(1440p|1440|2k|qhd)/.test(lowerLabel)) {
        if (LQE_CONFIG.LOGGING_QUALITY) console.log("LQE-QUALITY", "Simplified to QHD");
        return "QHD";
    }
  
    // FHD (Full HD) - висока якість
    if (/(1080p|1080|fullhd|fhd)/.test(lowerLabel)) {
        if (LQE_CONFIG.LOGGING_QUALITY) console.log("LQE-QUALITY", "Simplified to FHD");
        return "FHD";
    }
    
    // HD (High Definition) - середня якість
    if (/(720p|720|hd\b)/.test(lowerLabel)) {
        var hdRegex = /(720p|720|^hd$| hd |hd$)/;
        if (hdRegex.test(lowerLabel)) {
            if (LQE_CONFIG.LOGGING_QUALITY) console.log("LQE-QUALITY", "Simplified to HD");
            return "HD";
        }
    }

	// Крок WEB-DLRip без роздільності → HD (ДОДАНО)
	if (/(web-dlrip|webdlrip)\b/.test(lowerLabel)) {
    	if (LQE_CONFIG.LOGGING_QUALITY) console.log("LQE-QUALITY", "Simplified to HD");
    	return "HD";
	}
	
    // SD (Standard Definition) - базова якість
    if (/(480p|480|sd\b)/.test(lowerLabel)) {
        if (LQE_CONFIG.LOGGING_QUALITY) console.log("LQE-QUALITY", "Simplified to SD");
        return "SD";
    }
    
    // LQ (Low Quality) - дуже низька якість
    if (/(360p|360|low quality|lq\b)/.test(lowerLabel)) {
        if (LQE_CONFIG.LOGGING_QUALITY) console.log("LQE-QUALITY", "Simplified to LQ");
        return "LQ";
    }

    // --- Крок 3: Fallback ---
    // Якщо нічого з вищеперерахованого не знайдено, повертаємо оригінальну повну назву
    if (LQE_CONFIG.LOGGING_QUALITY) console.log("LQE-QUALITY", "No simplification rules matched, keeping original:", fullLabel);
    return fullLabel;
}

    
    /**
     * Перетворює технічну назву якості на читабельну
     * @param {number} qualityCode - Код якості
     * @param {string} fullTorrentTitle - Повна назва торренту
     * @returns {string} - Відформатована назва якості
     */
    function translateQualityLabel(qualityCode, fullTorrentTitle) {
        if (LQE_CONFIG.LOGGING_QUALITY) console.log("LQE-QUALITY", "translateQualityLabel:", qualityCode, fullTorrentTitle);
        var title = sanitizeTitle(fullTorrentTitle || ''); // Нормалізуємо назву
        var titleForSearch = ' ' + title + ' '; // Додаємо пробіли для точного пошуку

        // Пошук роздільності в назві
        var resolution = '';
        var bestResKey = '';
        var bestResLen = 0;
        for (var rKey in RESOLUTION_MAP) {
            if (!RESOLUTION_MAP.hasOwnProperty(rKey)) continue; // Перевірка власної властивості
            var lk = rKey.toString().toLowerCase(); // Нижній регістр ключа
            // Шукаємо повне слово в назві
            if (titleForSearch.indexOf(' ' + lk + ' ') !== -1 || title.indexOf(lk) !== -1) {
                // Вибираємо найдовший збіг (найточніший)
                if (lk.length > bestResLen) {
                    bestResLen = lk.length;
                    bestResKey = rKey;
                }
            }
        }
        if (bestResKey) resolution = RESOLUTION_MAP[bestResKey]; // Отримуємо роздільність

        // Пошук джерела в назві
        var source = '';
        var bestSrcKey = '';
        var bestSrcLen = 0;
        for (var sKey in SOURCE_MAP) {
            if (!SOURCE_MAP.hasOwnProperty(sKey)) continue;
            var lk2 = sKey.toString().toLowerCase();
            if (titleForSearch.indexOf(' ' + lk2 + ' ') !== -1 || title.indexOf(lk2) !== -1) {
                if (lk2.length > bestSrcLen) {
                    bestSrcLen = lk2.length;
                    bestSrcKey = sKey;
                }
            }
        }
        if (bestSrcKey) source = SOURCE_MAP[bestSrcKey]; // Отримуємо джерело

        // Комбінуємо роздільність та джерело
        var finalLabel = '';
        if (resolution && source) {
            if (source.toLowerCase().includes(resolution.toLowerCase())) {
                finalLabel = source; // Якщо джерело вже містить роздільність
            } else {
                finalLabel = resolution + ' ' + source; // Комбінуємо
            }
        } else if (resolution) {
            finalLabel = resolution; // Тільки роздільність
        } else if (source) {
            finalLabel = source; // Тільки джерело
        }

        // Fallback на пряму мапу
        if (!finalLabel || finalLabel.trim() === '') {
            var bestDirectKey = '';
            var maxDirectLen = 0;
            for (var qk in QUALITY_DISPLAY_MAP) {
                if (!QUALITY_DISPLAY_MAP.hasOwnProperty(qk)) continue;
                var lkq = qk.toString().toLowerCase();
                if (title.indexOf(lkq) !== -1) {
                    if (lkq.length > maxDirectLen) {
                        maxDirectLen = lkq.length;
                        bestDirectKey = qk;
                    }
                }
            }
            if (bestDirectKey) {
                finalLabel = QUALITY_DISPLAY_MAP[bestDirectKey]; // Використовуємо пряму мапу
            }
        }

        // Останній fallback
        if (!finalLabel || finalLabel.trim() === '') {
            if (qualityCode) {
                var qc = String(qualityCode).toLowerCase();
                finalLabel = QUALITY_DISPLAY_MAP[qc] || qualityCode; // По коду або оригіналу
            } else {
                finalLabel = fullTorrentTitle || ''; // Оригінальна назва
            }
        }

        // Автоматичне спрощення якості (якщо увімкнено в конфігурації)
        if (LQE_CONFIG.USE_SIMPLE_QUALITY_LABELS) {
            var simplifiedLabel = simplifyQualityLabel(finalLabel, fullTorrentTitle);
            if (simplifiedLabel && simplifiedLabel !== finalLabel) {
                if (LQE_CONFIG.LOGGING_QUALITY) console.log("LQE-QUALITY", "Simplified quality:", finalLabel, "→", simplifiedLabel);
                finalLabel = simplifiedLabel;
            }
        }

        if (LQE_CONFIG.LOGGING_QUALITY) console.log("LQE-QUALITY", "Final quality label:", finalLabel);
        return finalLabel;
    }

    // ===================== ЧЕРГА ЗАПИТІВ (Lite-черга) =====================

    var requestQueue = []; // Масив для зберігання завдань у черзі
    var activeRequests = 0; // Лічильник активних запитів

    /**
     * Додає завдання до черги та запускає обробку
     * @param {function} fn - Функція завдання (приймає callback done)
     */
    function enqueueTask(fn) {
        requestQueue.push(fn); // Додаємо завдання в кінець черги
        processQueue(); // Запускаємо обробку черги
    }

    /**
     * Обробляє чергу завдань з дотриманням обмеження паралельності
     */
    function processQueue() {
        // Перевіряємо, чи не перевищено ліміт паралельних запитів
        if (activeRequests >= LQE_CONFIG.MAX_PARALLEL_REQUESTS) return;
        var task = requestQueue.shift(); // Беремо перше завдання з черги
        if (!task) return; // Якщо черга порожня - виходимо
        
        activeRequests++; // Збільшуємо лічильник активних запитів
        
        try {
            // Виконуємо завдання з callback-функцією завершення
            task(function onTaskDone() {
                activeRequests--; // Зменшуємо лічильник
                setTimeout(processQueue, 0); // Запускаємо наступне завдання
            });
        } catch (e) {
            // Обробляємо помилки виконання завдання
            console.error("LQE-LOG", "Queue task error:", e);
            activeRequests--; // Все одно зменшуємо лічильник
            setTimeout(processQueue, 0); // Продовжуємо обробку
        }
    }

    // ===================== ПОШУК В JACRED =====================
    
    /**
     * Визначає якість з назви торренту
     * @param {string} title - Назва торренту
     * @returns {number} - Числовий код якості (2160, 1440, 1080, 720, 480, 3, 2, 1)
     */
    function extractNumericQualityFromTitle(title) {
        if (!title) return 0; // Перевірка на пусту назву
        var lower = title.toLowerCase(); // Нижній регістр для порівняння
        
        // ✅ ПРАВИЛЬНІ ПРІОРИТЕТИ:
        if (/2160p|4k/.test(lower)) return 2160; // Найвищий пріоритет - 4K
		if (/1440p|qhd|2k/.test(lower)) return 1440; // QHD
        if (/1080p/.test(lower)) return 1080; // Full HD
        if (/720p/.test(lower)) return 720; // HD
        if (/480p/.test(lower)) return 480; // SD
        // Погані якості - правильний порядок (TC > TS > CamRip):
        if (/tc|telecine/.test(lower)) return 3; // TC краще за TS
        if (/ts|telesync/.test(lower)) return 2; // TS краще за CamRip
        if (/camrip|камрип/.test(lower)) return 1; // CamRip - найгірше
        
        return 0; // Якість не визначена
    }

    /**
     * Знаходить найкращий реліз в JacRed API
     * @param {object} normalizedCard - Нормалізовані дані картки
     * @param {string} cardId - ID картки
     * @param {function} callback - Callback функція
     */
    function getBestReleaseFromJacred(normalizedCard, cardId, callback) {
        enqueueTask(function (done) {
            // === ЗМІНА 1: Додано перевірку на майбутній реліз ===
            var releaseDate = normalizedCard.release_date ? new Date(normalizedCard.release_date) : null;
            if (releaseDate && releaseDate.getTime() > Date.now()) {
                if (LQE_CONFIG.LOGGING_QUALITY) {
                    console.log("LQE-QUALITY", "card: " + cardId + ", Future release. Skipping JacRed search.");
                }
                callback(null);
                done();
                return;
            }
            // === КІНЕЦЬ ЗМІНИ 1 ===

            if (LQE_CONFIG.LOGGING_QUALITY) console.log("LQE-QUALITY", "card: " + cardId + ", Searching JacRed...");

            // Перевірка налаштувань JacRed
            if (!LQE_CONFIG.JACRED_URL) {
                if (LQE_CONFIG.LOGGING_QUALITY) console.log("LQE-QUALITY", "card: " + cardId + ", JacRed URL not configured");
                callback(null);
                done();
                return;
            }

            // Витягуємо рік з дати релізу
            var year = '';
            if (normalizedCard.release_date && normalizedCard.release_date.length >= 4) {
                year = normalizedCard.release_date.substring(0, 4);
            }
            if (!year || isNaN(year)) {
                if (LQE_CONFIG.LOGGING_QUALITY) console.log("LQE-QUALITY", "card: " + cardId + ", Invalid year");
                callback(null);
                done();
                return;
            }
            
            var searchYearNum = parseInt(year, 10);
            // Допоміжна функція для витягування року з назви
            function extractYearFromTitle(title) {
                var regex = /(?:^|[^\d])(\d{4})(?:[^\d]|$)/g;
                var match, lastYear = 0;
                var currentYear = new Date().getFullYear();
                while ((match = regex.exec(title)) !== null) {
                    var extractedYear = parseInt(match[1], 10);
                    if (extractedYear >= 1900 && extractedYear <= currentYear + 1) {
                        lastYear = extractedYear;
                    }
                }
                return lastYear;
            }

            // Функція пошуку в JacRed API
            function searchJacredApi(searchTitle, searchYear, exactMatch, strategyName, apiCallback) {
                var userId = Lampa.Storage.get('lampac_unic_id', '');
                var apiUrl = LQE_CONFIG.JACRED_PROTOCOL + LQE_CONFIG.JACRED_URL + '/api/v1.0/torrents?search=' +
                    encodeURIComponent(searchTitle) +
                    '&year=' + searchYear +
                    (exactMatch ? '&exact=true' : '') +
                    '&uid=' + userId;
                if (LQE_CONFIG.LOGGING_QUALITY) console.log("LQE-QUALITY", "card: " + cardId + ", JacRed: " + strategyName + " URL: " + apiUrl);
                // Таймаут для запиту
                var timeoutId = setTimeout(function () {
                    if (LQE_CONFIG.LOGGING_GENERAL) console.log("LQE-LOG", "card: " + cardId + ", JacRed: " + strategyName + " request timed out.");
                    apiCallback(null);
                }, LQE_CONFIG.PROXY_TIMEOUT_MS * LQE_CONFIG.PROXY_LIST.length + 1000);

                // Виконуємо запит через проксі
                fetchWithProxy(apiUrl, cardId, function (error, responseText) {
                    clearTimeout(timeoutId);
                    
                    if (error || !responseText) {
                        if (LQE_CONFIG.LOGGING_QUALITY) console.log("LQE-QUALITY", "card: " + cardId + ", JacRed fetch error:", error);
                        apiCallback(null);
                        return;
                    }
    
                    try {
                        var torrents = JSON.parse(responseText);
                        if (!Array.isArray(torrents) || torrents.length === 0) {
                            if (LQE_CONFIG.LOGGING_QUALITY) console.log("LQE-QUALITY", "card: " + cardId + ", No torrents found");
                            apiCallback(null);
                            return;
                        }

                        var bestNumericQuality = -1; // Найкраща знайдена якість
                        var bestFoundTorrent = null; // Найкращий знайдений торрент

                        // Аналізуємо кожен торрент
                        for (var i = 0; i < torrents.length; i++) {
                            var currentTorrent = torrents[i];

							
							// Якщо картка - це серіал (tv)
                            if (normalizedCard.type === 'tv') {
                               var tTitle = currentTorrent.title.toLowerCase(); // назву приводимо до нижнього регістру
                               // Перевірка: у назві має бути "сезон", "season", "s01", "s1", "серии" тощо
                                   if (!/(сезон|season|s\d{1,2}|\d{1,2}\s*из\s*\d{1,2}|серии)/.test(tTitle)) {
                                      if (LQE_CONFIG.LOGGING_QUALITY) {
                                         console.log(
                                         "LQE-QUALITY",
                                         "card: " + cardId + ", Пропускаємо торрент без ознаки сезону:", currentTorrent.title
                                         );
                                      }
                                   continue; // пропускаємо реліз, якщо це серіал, але немає сезону в назві
                                 }
	                        }

                            // Якщо картка - це фільм (movie)
                            if (normalizedCard.type === 'movie') {
                               var tTitleMovie = currentTorrent.title.toLowerCase();
                            // Якщо в назві є ознаки серіалу – пропускаємо (щоб не брати якість від серіалів)
                                   if (/(сезон|season|s\d{1,2}|\d{1,2}\s*из\s*\d{1,2}|серии)/.test(tTitleMovie)) {
                                      if (LQE_CONFIG.LOGGING_QUALITY) {
                                         console.log(
                                         "LQE-QUALITY",
                                         "card: " + cardId + ", Пропускаємо реліз із ознаками серіалу для фільму:",
                                         currentTorrent.title
                                         );
                                      }
                                   continue; // пропускаємо цей торрент
                                   }
	                          }


							
                            // Визначаємо якість (спочатку з поля, потім з назви)
                            var currentNumericQuality = currentTorrent.quality;
                            if (typeof currentNumericQuality !== 'number' || currentNumericQuality === 0) {
                                var extractedQuality = extractNumericQualityFromTitle(currentTorrent.title);
                                if (extractedQuality > 0) {
                                    currentNumericQuality = extractedQuality;
                                } else {
                                    continue; // Пропускаємо якщо якість не визначена
                                }
                            }

                            // === ЗМІНА 2: Покращена валідація року ===
                            var torrentYearRaw = currentTorrent.relased;
                            var parsedYear = 0;
                            if (torrentYearRaw && !isNaN(torrentYearRaw)) {
                                parsedYear = parseInt(torrentYearRaw, 10);
                            }
                            // Якщо рік не знайдено в полі 'relased', спробуємо витягнути з назви
                            if (parsedYear < 1900) {
                                parsedYear = extractYearFromTitle(currentTorrent.title);
                            }

                            // Дозволяємо різницю в 1 рік (наприклад, реліз в грудні, а торрент з'явився в січні)
                            var yearDifference = Math.abs(parsedYear - searchYearNum);
                            if (parsedYear > 1900 && yearDifference > 1) {
                                if (LQE_CONFIG.LOGGING_QUALITY) console.log("LQE-QUALITY", "card: " + cardId + ", Torrent year mismatch, skipping. Torrent: " + currentTorrent.title + ", Searched: " + searchYearNum + ", Found: " + parsedYear);
                                continue;
                            }
                            // === КІНЕЦЬ ЗМІНИ 2 ===

                            if (LQE_CONFIG.LOGGING_QUALITY) {
                                console.log(
                                    "LQE-QUALITY",
                                    "card: " + cardId +
                                    ", Torrent: " + currentTorrent.title +
                                    " | Quality: " + currentNumericQuality + "p" +
                                    " | Year: " + (parsedYear || "unknown") +
                                    " | Strategy: " + strategyName
                                );
                            }

                            // ✅ ЛОГІКА ВИБОРУ ТОРРЕНТУ
                            if (currentNumericQuality > bestNumericQuality) {
                                // Знайшли торрент з кращою якістю
                                bestNumericQuality = currentNumericQuality;
                                bestFoundTorrent = currentTorrent;
                            } 
                            else if (currentNumericQuality === bestNumericQuality && bestFoundTorrent && 
                                     currentTorrent.title.length > bestFoundTorrent.title.length) {
                                // Якість рівна - беремо торрент з довшою назвою (більше деталей)
                                bestFoundTorrent = currentTorrent;
                            }
                        }

                        if (bestFoundTorrent) {
                            var result = {
                                quality: bestFoundTorrent.quality || bestNumericQuality,
                                full_label: bestFoundTorrent.title
                            };
                            if (LQE_CONFIG.LOGGING_QUALITY) console.log("LQE-QUALITY", "card: " + cardId + ", Best torrent found:", result, "Quality:", bestNumericQuality);
                            apiCallback(result);
                        } else {
                            if (LQE_CONFIG.LOGGING_QUALITY) console.log("LQE-QUALITY", "card: " + cardId + ", No suitable torrent found");
                            apiCallback(null);
                        }

                    } catch (e) {
                        console.error("LQE-LOG", "card: " + cardId + ", JacRed API parse error:", e);
                        apiCallback(null);
                    }
                });
            }

            // ✅ СТРАТЕГІЇ ПОШУКУ
            var searchStrategies = [];
            // Стратегія 1: Оригінальна назва + точний рік
            if (normalizedCard.original_title && (/[a-zа-яё]/i.test(normalizedCard.original_title) || /^\d+$/.test(normalizedCard.original_title))) {
                searchStrategies.push({
                    title: normalizedCard.original_title.trim(),
                    year: year,
                    exact: true,
                    name: "OriginalTitle Exact Year"
                });
            }

            // Стратегія 2: Локалізована назва + точний рік  
            if (normalizedCard.title && (/[a-zа-яё]/i.test(normalizedCard.title) || /^\d+$/.test(normalizedCard.title))) {
                searchStrategies.push({
                    title: normalizedCard.title.trim(),
                    year: year,
                    exact: true,
                    name: "Title Exact Year"
                });
            }

            // Рекурсивна функція виконання стратегій
            function executeNextStrategy(index) {
                if (index >= searchStrategies.length) {
                    if (LQE_CONFIG.LOGGING_QUALITY) console.log("LQE-QUALITY", "card: " + cardId + ", All strategies failed. No quality found.");
                    callback(null);
                    done();
                    return;
                }
                
                var s = searchStrategies[index];
                if (LQE_CONFIG.LOGGING_QUALITY) console.log("LQE-QUALITY", "card: " + cardId + ", Trying strategy", index + 1, ":", s.name);
                searchJacredApi(s.title, s.year, s.exact, s.name, function (result) {
                    if (result !== null) {
                        callback(result);
                        done();
                    } else {
                        executeNextStrategy(index + 1); // Наступна стратегія
                    }
                });
            }

            if (searchStrategies.length > 0) {
                executeNextStrategy(0);
            } else {
                if (LQE_CONFIG.LOGGING_QUALITY) console.log("LQE-QUALITY", "card: " + cardId + ", No valid search titles or strategies defined.");
                callback(null);
                done();
            }
        });
    }

    // ===================== КЕШУВАННЯ =====================
    
    /**
     * Отримує дані з кешу
     * @param {string} key - Ключ кешу
     * @returns {object|null} - Дані кешу або null
     */
    function getQualityCache(key) {
        var cache = Lampa.Storage.get(LQE_CONFIG.CACHE_KEY) || {}; // Отримуємо кеш або пустий об'єкт
        var item = cache[key]; // Отримуємо елемент по ключу
        var isCacheValid = item && (Date.now() - item.timestamp < LQE_CONFIG.CACHE_VALID_TIME_MS); // Перевіряємо валідність
        
        if (LQE_CONFIG.LOGGING_QUALITY) {
            console.log("LQE-QUALITY", "Cache: Checking quality cache for key:", key, "Found:", !!item, "Valid:", isCacheValid);
        }
        
        return isCacheValid ? item : null; // Повертаємо елемент або null
    }

    /**
     * Зберігає дані в кеш
     * @param {string} key - Ключ кешу
     * @param {object} data - Дані для зберігання
     * @param {string} cardId - ID картки для логування
     */
    function saveQualityCache(key, data, cardId) {
        if (LQE_CONFIG.LOGGING_QUALITY) console.log("LQE-QUALITY", "Cache: Saving quality cache for key:", key, "Data:", data);
        var cache = Lampa.Storage.get(LQE_CONFIG.CACHE_KEY) || {};
        cache[key] = {
            quality_code: data.quality_code,
            full_label: data.full_label,
            timestamp: Date.now() // Поточний час
        };
        Lampa.Storage.set(LQE_CONFIG.CACHE_KEY, cache); // Зберігаємо в LocalStorage
    }

    /**
     * Видаляє застарілі записи кешу
     */
    function removeExpiredCacheEntries() {
        var cache = Lampa.Storage.get(LQE_CONFIG.CACHE_KEY) || {};
        var changed = false;
        var now = Date.now();
        
        for (var k in cache) {
            if (!cache.hasOwnProperty(k)) continue;
            var item = cache[k];
            if (!item || !item.timestamp || (now - item.timestamp) > LQE_CONFIG.CACHE_VALID_TIME_MS) {
                delete cache[k]; // Видаляємо застарілий запис
                changed = true;
            }
        }
        
        if (changed) {
            Lampa.Storage.set(LQE_CONFIG.CACHE_KEY, cache);
            if (LQE_CONFIG.LOGGING_QUALITY) console.log("LQE-QUALITY", "Cache: Removed expired entries");
        }
    }

    // Очищаємо застарілий кеш при ініціалізації
    removeExpiredCacheEntries();
    // ===================== UI ДОПОМІЖНІ ФУНКЦІЇ =====================
    
    /**
     * Очищає елементи якості на повній картці
     * @param {string} cardId - ID картки
     * @param {Element} renderElement - DOM елемент
     */
    function clearFullCardQualityElements(cardId, renderElement) {
        if (renderElement) {
            var existingElements = $('.full-start__status.lqe-quality', renderElement);
            if (existingElements.length > 0) {
                if (LQE_CONFIG.LOGGING_QUALITY) console.log("LQE-QUALITY", "card: " + cardId + ", Clearing existing quality elements on full card.");
                existingElements.remove(); // Видаляємо існуючі елементи
            }
        }
    }

    /**
     * Показує заглушку завантаження якості
     * @param {string} cardId - ID картки
     * @param {Element} renderElement - DOM елемент
     */
    function showFullCardQualityPlaceholder(cardId, renderElement) {
        if (!renderElement) return;
        var rateLine = $('.full-start-new__rate-line', renderElement);
        if (!rateLine.length) {
            if (LQE_CONFIG.LOGGING_QUALITY) console.log("LQE-QUALITY", "card: " + cardId + ", Cannot show placeholder, .full-start-new__rate-line not found.");
            return;
        }
        
        // Перевіряємо, чи немає вже плейсхолдера якості
        if (!$('.full-start__status.lqe-quality', rateLine).length) {
            if (LQE_CONFIG.LOGGING_QUALITY) console.log("LQE-QUALITY", "card: " + cardId + ", Adding quality placeholder on full card.");
            var placeholder = document.createElement('div');
            placeholder.className = 'full-start__status lqe-quality';
            placeholder.textContent = 'Пошук...';
            placeholder.style.opacity = '0.7';
            
            rateLine.append(placeholder); // Додаємо плейсхолдер
        } else {
            if (LQE_CONFIG.LOGGING_QUALITY) console.log("LQE-QUALITY", "card: " + cardId + ", Placeholder already exists on full card, skipping.");
        }
    }

    /**
     * Оновлює елемент якості на повній картці
     * @param {number} qualityCode - Код якості
     * @param {string} fullTorrentTitle - Назва торренту
     * @param {string} cardId - ID картки
     * @param {Element} renderElement - DOM елемент
     * @param {boolean} bypassTranslation - Пропустити переклад
     */
	function updateFullCardQualityElement(qualityCode, fullTorrentTitle, cardId, renderElement, bypassTranslation) {
        if (!renderElement) return;
        var element = $('.full-start__status.lqe-quality', renderElement);
        var rateLine = $('.full-start-new__rate-line', renderElement);
        if (!rateLine.length) return;

        var displayQuality = bypassTranslation ? fullTorrentTitle : translateQualityLabel(qualityCode, fullTorrentTitle);
  
    	// ✅ Якщо це ручне перевизначення І увімкнено спрощення - беремо спрощену мітку
    	if (bypassTranslation && LQE_CONFIG.USE_SIMPLE_QUALITY_LABELS) {
        	var manualData = LQE_CONFIG.MANUAL_OVERRIDES[cardId];
        		if (manualData && manualData.simple_label) {
            	displayQuality = manualData.simple_label;
        	}	
    	}
		
        if (element.length) {
            // Оновлюємо існуючий елемент
            if (LQE_CONFIG.LOGGING_QUALITY) console.log('LQE-QUALITY', 'card: ' + cardId + ', Updating existing element with quality "' + displayQuality + '" on full card.');
            element.text(displayQuality).css('opacity', '1').addClass('show');
        } else {
            // Створюємо новий елемент
            if (LQE_CONFIG.LOGGING_QUALITY) console.log("LQE-QUALITY", "card: " + cardId + ", Creating new element with quality '" + displayQuality + "' on full card.");
            var div = document.createElement('div');
            div.className = 'full-start__status lqe-quality';
            div.textContent = displayQuality;
            rateLine.append(div);
            // Додаємо клас для анімації
            setTimeout(function(){ 
                $('.full-start__status.lqe-quality', renderElement).addClass('show'); 
            }, 20);
        }
    }

    /**
     * Оновлює елемент якості на списковій картці
     * @param {Element} cardView - DOM елемент картки
     * @param {number} qualityCode - Код якості
     * @param {string} fullTorrentTitle - Назва торренту
     * @param {boolean} bypassTranslation - Пропустити переклад
     */
    function updateCardListQualityElement(cardView, qualityCode, fullTorrentTitle, bypassTranslation) {
        var displayQuality = bypassTranslation ? fullTorrentTitle : translateQualityLabel(qualityCode, fullTorrentTitle);

	// ✅ Якщо це ручне перевизначення І увімкнено спрощені мітки — беремо simple_label
	if (bypassTranslation && LQE_CONFIG.USE_SIMPLE_QUALITY_LABELS) {
    	var cardId = cardView?.card_data?.id || cardView?.closest('.card')?.card_data?.id;
    	var manualData = LQE_CONFIG.MANUAL_OVERRIDES[cardId];
    	if (manualData && manualData.simple_label) {
        displayQuality = manualData.simple_label;
    	}
	}
		
        // Перевіряємо наявність ідентичного елемента
        var existing = cardView.querySelector('.card__quality');
        if (existing) {
            var inner = existing.querySelector('div');
            if (inner && inner.textContent === displayQuality) {
                return; // Не оновлюємо якщо текст не змінився
            }
            existing.remove(); // Видаляємо старий
        }

        // Створюємо новий елемент
        var qualityDiv = document.createElement('div');
        qualityDiv.className = 'card__quality';
        var innerElement = document.createElement('div');
        innerElement.textContent = displayQuality;
        qualityDiv.appendChild(innerElement);
        cardView.appendChild(qualityDiv);
        // Плавне з'явлення
        requestAnimationFrame(function(){ qualityDiv.classList.add('show'); });
    }

    // ===================== ОБРОБКА ПОВНОЇ КАРТКИ =====================
    
    /**
     * Обробляє якість для повної картки
     * @param {object} cardData - Дані картки
     * @param {Element} renderElement - DOM елемент
     */
    function processFullCardQuality(cardData, renderElement) {
        if (!renderElement) {
            console.error("LQE-LOG", "Render element is null in processFullCardQuality. Aborting.");
            return;
        }
        
        var cardId = cardData.id;
        if (LQE_CONFIG.LOGGING_GENERAL) console.log("LQE-LOG", "card: " + cardId + ", Processing full card. Data: ", cardData);
        // Нормалізуємо дані картки
        var normalizedCard = {
            id: cardData.id,
            title: cardData.title || cardData.name || '',
            original_title: cardData.original_title || cardData.original_name || '',
            type: getCardType(cardData),
            release_date: cardData.release_date || cardData.first_air_date || ''
        };
        if (LQE_CONFIG.LOGGING_GENERAL) console.log("LQE-LOG", "card: " + cardId + ", Normalized full card data: ", normalizedCard);
        
        var rateLine = $('.full-start-new__rate-line', renderElement);
        if (rateLine.length) {
            // Ховаємо оригінальну лінію та додаємо анімацію завантаження
            rateLine.css('visibility', 'hidden');
            rateLine.addClass('done');
            addLoadingAnimation(cardId, renderElement);
        } else {
            if (LQE_CONFIG.LOGGING_GENERAL) console.log("LQE-LOG", "card: " + cardId + ", .full-start-new__rate-line not found, skipping loading animation.");
        }
        
        // Визначаємо тип контенту та створюємо ключ кешу
        var isTvSeries = (normalizedCard.type === 'tv' || normalizedCard.name);
        var cacheKey = LQE_CONFIG.CACHE_VERSION + '_' + (isTvSeries ? 'tv_' : 'movie_') + normalizedCard.id;
        // Перевіряємо ручні налаштування (найвищий пріоритет)
        var manualOverrideData = LQE_CONFIG.MANUAL_OVERRIDES[cardId];
        if (manualOverrideData) {
            if (LQE_CONFIG.LOGGING_QUALITY) console.log("LQE-QUALITY", "card: " + cardId + ", Found manual override:", manualOverrideData);
            updateFullCardQualityElement(null, manualOverrideData.full_label, cardId, renderElement, true);
            removeLoadingAnimation(cardId, renderElement);
            rateLine.css('visibility', 'visible');
            return;
        }

        // Отримуємо дані з кешу
        var cachedQualityData = getQualityCache(cacheKey);
        // Перевіряємо, чи не вимкнено якість для серіалів
        if (!(isTvSeries && LQE_CONFIG.SHOW_QUALITY_FOR_TV_SERIES === false)) {
            if (LQE_CONFIG.LOGGING_QUALITY) console.log('LQE-QUALITY', 'card: ' + cardId + ', Quality feature enabled for this content, starting processing.');
            if (cachedQualityData) {
                // Використовуємо кешовані дані
                if (LQE_CONFIG.LOGGING_QUALITY) console.log("LQE-QUALITY", "card: " + cardId + ", Quality data found in cache:", cachedQualityData);
                updateFullCardQualityElement(cachedQualityData.quality_code, cachedQualityData.full_label, cardId, renderElement);
                
                // Фонове оновлення застарілого кешу
                if (Date.now() - cachedQualityData.timestamp > LQE_CONFIG.CACHE_REFRESH_THRESHOLD_MS) {
                    if (LQE_CONFIG.LOGGING_QUALITY) console.log("LQE-QUALITY", "card: " + cardId + ", Cache is old, scheduling background refresh AND UI update.");
                    getBestReleaseFromJacred(normalizedCard, cardId, function(jrResult) {
                        if (jrResult && jrResult.quality && jrResult.quality !== 'NO') {
                            saveQualityCache(cacheKey, {
                                quality_code: jrResult.quality,
                                full_label: jrResult.full_label
                            }, cardId);
                            updateFullCardQualityElement(jrResult.quality, jrResult.full_label, cardId, renderElement);
                            if (LQE_CONFIG.LOGGING_QUALITY) console.log("LQE-QUALITY", "card: " + cardId + ", Background cache and UI refresh completed.");
                        }
                    });
                }
                
                removeLoadingAnimation(cardId, renderElement);
                rateLine.css('visibility', 'visible');
            } else {
                // Новий пошук якості
                clearFullCardQualityElements(cardId, renderElement);
                showFullCardQualityPlaceholder(cardId, renderElement);
                
                getBestReleaseFromJacred(normalizedCard, cardId, function(jrResult) {
                    if (LQE_CONFIG.LOGGING_QUALITY) console.log('LQE-QUALITY', 'card: ' + cardId + ', JacRed callback received for full card. Result:', jrResult);
                    var qualityCode = (jrResult && jrResult.quality) || null;
                    var fullTorrentTitle = (jrResult && jrResult.full_label) || null;
                     
                    if (LQE_CONFIG.LOGGING_QUALITY) console.log(`LQE-QUALITY: JacRed returned - qualityCode: "${qualityCode}", full label: "${fullTorrentTitle}"`);
                    
                    if (qualityCode && qualityCode !== 'NO') {
                        saveQualityCache(cacheKey, {
                            quality_code: qualityCode,
                            full_label: fullTorrentTitle
                        }, cardId);
                        updateFullCardQualityElement(qualityCode, fullTorrentTitle, cardId, renderElement);
                    } else {
                        if (LQE_CONFIG.LOGGING_QUALITY) console.log("LQE-QUALITY", 'card: ' + cardId + ', No quality found from JacRed or it was "NO". Clearing quality elements.');
                        clearFullCardQualityElements(cardId, renderElement);
                    }
                    
                    removeLoadingAnimation(cardId, renderElement);
                    rateLine.css('visibility', 'visible');
                });
            }
        } else {
            // Якість вимкнено для серіалів
            if (LQE_CONFIG.LOGGING_QUALITY) console.log('LQE-QUALITY', 'card: ' + cardId + ', Quality feature disabled for TV series (as configured), skipping quality fetch.');
            clearFullCardQualityElements(cardId, renderElement);
            removeLoadingAnimation(cardId, renderElement);
            rateLine.css('visibility', 'visible');
        }
        
        if (LQE_CONFIG.LOGGING_GENERAL) console.log("LQE-LOG", "card: " + cardId + ", Full card quality processing initiated.");
    }

    // ===================== ОБРОБКА СПИСКОВИХ КАРТОК =====================
    
    /**
     * Оновлює якість для спискової картки
     * @param {Element} cardElement - DOM елемент картки
     */
    function updateCardListQuality(cardElement) {
        if (LQE_CONFIG.LOGGING_CARDLIST) console.log("LQE-CARDLIST", "Processing list card");
        // Перевіряємо чи вже обробляли цю картку
        if (cardElement.hasAttribute('data-lqe-quality-processed')) {
            if (LQE_CONFIG.LOGGING_CARDLIST) console.log("LQE-CARDLIST", "Card already processed");
            return;
        }
        
        var cardView = cardElement.querySelector('.card__view');
        var cardData = cardElement.card_data;
        
        if (!cardData || !cardView) {
            if (LQE_CONFIG.LOGGING_CARDLIST) console.log("LQE-CARDLIST", "Invalid card data or view");
            return;
        }
        
        var isTvSeries = (getCardType(cardData) === 'tv');
        if (isTvSeries && LQE_CONFIG.SHOW_QUALITY_FOR_TV_SERIES === false) {
            if (LQE_CONFIG.LOGGING_CARDLIST) console.log("LQE-CARDLIST", "Skipping TV series");
            return;
        }

        // Нормалізуємо дані
        var normalizedCard = {
            id: cardData.id || '',
            title: cardData.title || cardData.name || '',
            original_title: cardData.original_title || cardData.original_name || '',
            type: getCardType(cardData),
            release_date: cardData.release_date || cardData.first_air_date || ''
        };
        
        var cardId = normalizedCard.id;
        var cacheKey = makeCacheKey(LQE_CONFIG.CACHE_VERSION, normalizedCard.type, cardId);
        cardElement.setAttribute('data-lqe-quality-processed', 'true'); // Позначаємо як оброблену

        // Перевіряємо ручні перевизначення
        var manualOverrideData = LQE_CONFIG.MANUAL_OVERRIDES[cardId];
        if (manualOverrideData) {
            if (LQE_CONFIG.LOGGING_QUALITY) console.log("LQE-QUALITY", "card: " + cardId + ", Manual override for list");
            updateCardListQualityElement(cardView, null, manualOverrideData.full_label, true);
            return;
        }

        // Перевіряємо кеш
        var cachedQualityData = getQualityCache(cacheKey);
        if (cachedQualityData) {
            if (LQE_CONFIG.LOGGING_CARDLIST) console.log('LQE-CARDLIST', 'card: ' + cardId + ', Using cached quality');
            updateCardListQualityElement(cardView, cachedQualityData.quality_code, cachedQualityData.full_label);

            // Фонове оновлення застарілого кешу
            if (Date.now() - cachedQualityData.timestamp > LQE_CONFIG.CACHE_REFRESH_THRESHOLD_MS) {
                if (LQE_CONFIG.LOGGING_QUALITY) console.log("LQE-QUALITY", "card: " + cardId + ", Background refresh for list");
                getBestReleaseFromJacred(normalizedCard, cardId, function(jrResult) {
                    if (jrResult && jrResult.quality && jrResult.quality !== 'NO') {
                        saveQualityCache(cacheKey, {
                            quality_code: jrResult.quality,
                            full_label: jrResult.full_label
                        }, cardId);
                        if (document.body.contains(cardElement)) {
                            updateCardListQualityElement(cardView, jrResult.quality, jrResult.full_label);
                        }
                    }
                });
            }
            return;
        }

        // Завантажуємо нові дані
        getBestReleaseFromJacred(normalizedCard, cardId, function(jrResult) {
            if (LQE_CONFIG.LOGGING_CARDLIST) console.log('LQE-CARDLIST', 'card: ' + cardId + ', JacRed result for list');
            
            if (!document.body.contains(cardElement)) {
                if (LQE_CONFIG.LOGGING_CARDLIST) console.log('LQE-CARDLIST', 'Card removed from DOM');
                return;
            }
            
            var qualityCode = (jrResult && jrResult.quality) || null;
            var fullTorrentTitle = (jrResult && jrResult.full_label) || null;
            
            if (qualityCode && qualityCode !== 'NO') {
                if (LQE_CONFIG.LOGGING_CARDLIST) console.log('LQE-CARDLIST', 'card: ' + cardId + ', Quality found for list');
                saveQualityCache(cacheKey, {
                    quality_code: qualityCode,
                    full_label: fullTorrentTitle
                }, cardId);
                updateCardListQualityElement(cardView, qualityCode, fullTorrentTitle);
            } else {
                if (LQE_CONFIG.LOGGING_CARDLIST) console.log('LQE-CARDLIST', 'card: ' + cardId + ', No quality for list');
            }
        });
    }

    // ===================== OPTIMIZED MUTATION OBSERVER =====================
    
    var observer = new MutationObserver(function(mutations) {
        var newCards = [];
        
        // Аналізуємо мутації
        for (var m = 0; m < mutations.length; m++) {
            var mutation = mutations[m];
            if (mutation.addedNodes) {
                for (var j = 0; j < mutation.addedNodes.length; j++) {
                    var node = mutation.addedNodes[j];
                    if (node.nodeType !== 1) continue; // Пропускаємо не-елементи
                     
                    // Перевіряємо чи це картка
                    if (node.classList && node.classList.contains('card')) {
                        newCards.push(node);
                    }
                     
                    // Шукаємо вкладені картки
                    try {
                        var nestedCards = node.querySelectorAll('.card');
                        if (nestedCards && nestedCards.length) {
                            for (var k = 0; k < nestedCards.length; k++) {
                                newCards.push(nestedCards[k]);
                            }
                        }
                    } catch (e) {
                        // Ігноруємо помилки селекторів
                    }
                }
            }
        }
        
        if (newCards.length) {
            if (LQE_CONFIG.LOGGING_CARDLIST) console.log("LQE-CARDLIST", "Observer found", newCards.length, "new cards");
            debouncedProcessNewCards(newCards); // Запускаємо обробку з дебаунсингом
        }
    });
    var observerDebounceTimer = null;
    
    /**
     * Оптимізований дебаунс обробки нових карток з TV-оптимізацією
     * @param {Array} cards - Масив карток
     */
    function debouncedProcessNewCards(cards) {
        if (!Array.isArray(cards) || cards.length === 0) return;
        clearTimeout(observerDebounceTimer);
        observerDebounceTimer = setTimeout(function() {
            // Вимикаємо перевірку дублікатів - обробляємо всі картки
            var uniqueCards = cards.filter(function(card) {
                return card && card.isConnected;
            });
            
            if (LQE_CONFIG.LOGGING_CARDLIST && uniqueCards.length < cards.length) {
                console.log("LQE-CARDLIST", "Removed duplicates:", cards.length - uniqueCards.length);
            }
            
    
            if (LQE_CONFIG.LOGGING_CARDLIST) {
                console.log("LQE-CARDLIST", "Processing", uniqueCards.length, "unique cards with batching");
            }
            
            // TV-ОПТИМІЗАЦІЯ: обробка порціями для уникнення фризів
            var BATCH_SIZE = 10; // Кількість карток за один раз
            var DELAY_MS = 50; // Затримка між порціями
            
            /**
             * Рекурсивна функція обробки порцій
             * @param {number} startIndex - Індекс початку поточної порції
             */
            function processBatch(startIndex) {
                var batch = uniqueCards.slice(startIndex, startIndex + BATCH_SIZE); // Поточна порція
                
                if (LQE_CONFIG.LOGGING_CARDLIST) {
                    console.log("LQE-CARDLIST", "Processing batch", (startIndex/BATCH_SIZE) + 1, 
                               "with", batch.length, "cards");
                }
                
                // Обробляємо поточну порцію
                batch.forEach(function(card) {
                    if (card.isConnected) { // Перевіряємо, чи картка ще в DOM
                        updateCardListQuality(card);
                    }
                });
                var nextIndex = startIndex + BATCH_SIZE;
                
                // Якщо залишилися картки - плануємо наступну порцію
                if (nextIndex < uniqueCards.length) {
                    setTimeout(function() {
                        processBatch(nextIndex);
                    }, DELAY_MS);
                } else {
                    // Всі картки оброблено
                    if (LQE_CONFIG.LOGGING_CARDLIST) {
                        console.log("LQE-CARDLIST", "All batches processed successfully");
                    }
                }
            }
            
            // Запускаємо обробку з першої порції
            if (uniqueCards.length > 0) {
                processBatch(0);
            }
            
        }, 15); // Дебаунсинг 15ms для швидшого відображення
    }

    /**
     * Налаштовує Observer для відстеження нових карток
     */
    function attachObserver() {
        var containers = document.querySelectorAll('.cards, .card-list, .content, .main, .cards-list, .preview__list');
        if (containers && containers.length) {
            for (var i = 0; i < containers.length; i++) {
                try {
                    observer.observe(containers[i], { childList: true, subtree: true });
                } catch (e) {
                    console.error("LQE-LOG", "Observer error:", e);
                }
            }
        } else {
            observer.observe(document.body, { childList: true, subtree: true }); // Fallback на весь документ
        }
    }

    // ===================== ІНІЦІАЛІЗАЦІЯ ПЛАГІНА =====================
    
    /**
     * Ініціалізує плагін якості
     */
    function initializeLampaQualityPlugin() {
        if (LQE_CONFIG.LOGGING_GENERAL) console.log("LQE-LOG", "Lampa Quality Enhancer: Initializing...");
        window.lampaQualityPlugin = true; // Позначаємо плагін як ініціалізований
        
        attachObserver(); // Налаштовуємо спостерігач
        if (LQE_CONFIG.LOGGING_GENERAL) console.log('LQE-LOG: MutationObserver started');
        // Підписуємося на події повної картки
        Lampa.Listener.follow('full', function(event) {
            if (event.type == 'complite') {
                var renderElement = event.object.activity.render();
                currentGlobalMovieId = event.data.movie.id;
                
                
                if (LQE_CONFIG.LOGGING_GENERAL) {
                    console.log("LQE-LOG", "Full card completed for ID:", currentGlobalMovieId);
                }
                
                processFullCardQuality(event.data.movie, renderElement);
            }
        });
        if (LQE_CONFIG.LOGGING_GENERAL) console.log("LQE-LOG", "Lampa Quality Enhancer: Initialized successfully!");
    }

    // Ініціалізуємо плагін якщо ще не ініціалізовано
    if (!window.lampaQualityPlugin) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeLampaQualityPlugin); // Чекаємо завантаження DOM
        } else {
            initializeLampaQualityPlugin(); // Ініціалізуємо негайно
        }
    }

})();
