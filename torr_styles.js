(function(){
    // Список текстових замін
    const REPLACEMENTS = {
        'Дублированный': 'Дубльований',
        'Ukr': '🇺🇦 Українською',
        'Ua': '🇺🇦 Ua',
        'Дубляж': 'Дубльований',
        'Многоголосый': 'Багатоголосий',
        'Украинский': '🇺🇦 Українською',
        'Zetvideo': 'UaFlix',
        'Нет истории просмотра': 'Історія перегляду відсутня'
    };

    // Конфігурація стилів
    const STYLES = {
        '.torrent-item__seeds span.high-seeds': {
            color: '#00ff00',
            'font-weight': 'bold'
        },
        '.torrent-item__bitrate span.high-bitrate': {
            color: '#ff0000',
            'font-weight': 'bold'
        },
        '.torrent-item__tracker.kinozal': {
            color: '#915ea6',
            'font-weight': 'bold'
        },
        '.torrent-item__tracker.bitru': {
            color: '#915ea6',
            'font-weight': 'bold'
        },
        '.torrent-item__tracker.rutracker': {
            color: '#915ea6',
            'font-weight': 'bold'
        }
        '.torrent-item__tracker.megapeer': {
            color: '#915ea6',
            'font-weight': 'bold'
        }
        '.torrent-item__tracker.nnmclub': {
            color: '#915ea6',
            'font-weight': 'bold'
        }
        '.torrent-item__tracker.torrentby': {
            color: '#915ea6',
            'font-weight': 'bold'
        }
        '.torrent-item__tracker.rutor': {
            color: '#915ea6',
            'font-weight': 'bold'
        }
        '.torrent-item__tracker.toloka': {
            color: '#915ea6',
            'font-weight': 'bold'
        }
    };

    // Додаємо CSS-стилі
    let style = document.createElement('style');
    style.innerHTML = Object.entries(STYLES).map(([selector, props]) => {
        return `${selector} { ${Object.entries(props).map(([prop, val]) => `${prop}: ${val} !important`).join('; ')} }`;
    }).join('\n');
    document.head.appendChild(style);

    // Функція для заміни текстів у вказаних контейнерах
    function replaceTexts() {
        // Список селекторів, де потрібно шукати тексти для заміни
        const containers = [
            '.online-prestige-watched__body',
            '.online-prestige--full .online-prestige__title',
            '.online-prestige--full .online-prestige__info'
        ];

        containers.forEach(selector => {
            document.querySelectorAll(selector).forEach(container => {
                // Заміняємо текст у всіх вузлах-нащадках
                const walker = document.createTreeWalker(
                    container,
                    NodeFilter.SHOW_TEXT,
                    null,
                    false
                );

                let node;
                while (node = walker.nextNode()) {
                    let text = node.nodeValue;
                    Object.entries(REPLACEMENTS).forEach(([original, replacement]) => {
                        if (text.includes(original)) {
                            text = text.replace(new RegExp(original, 'g'), replacement);
                        }
                    });
                    node.nodeValue = text;
                }
            });
        });
    }

    // Функція для оновлення стилів торентів
    function updateTorrentStyles() {
        // Seeds > 19
        document.querySelectorAll('.torrent-item__seeds span').forEach(span => {
            span.classList.toggle('high-seeds', (parseInt(span.textContent) || 0) > 19);
        });

        // Бітрейт > 50
        document.querySelectorAll('.torrent-item__bitrate span').forEach(span => {
            span.classList.toggle('high-bitrate', (parseFloat(span.textContent) || 0) > 50);
        });

        // Трекери
        document.querySelectorAll('.torrent-item__tracker').forEach(tracker => {
            const text = tracker.textContent.trim();
            tracker.classList.remove('kinozal', 'bitru', 'rutracker', 'rutor', 'torrentby', 'nnmclub', 'megapeer', 'toloka');
            
            if (text.includes('kinozal')) tracker.classList.add('kinozal');
            else if (text.includes('toloka')) tracker.classList.add('toloka');
            else if (text.includes('rutracker')) tracker.classList.add('rutracker');
            else if (text.includes('rutor')) tracker.classList.add('rutor');
            else if (text.includes('torrentby')) tracker.classList.add('torrentby');
            else if (text.includes('nnmclub')) tracker.classList.add('nnmclub');
            else if (text.includes('megapeer')) tracker.classList.add('megapeer');
            else if (text.includes('bitru')) tracker.classList.add('bitru');
        });
    }

    // Основна функція оновлення
    function updateAll() {
        replaceTexts();
        updateTorrentStyles();
    }

    // Оптимізований спостерігач
    const observer = new MutationObserver(mutations => {
        if (mutations.some(m => m.addedNodes.length)) {
            updateAll();
        }
    });

    // Ініціалізація
    observer.observe(document.body, { childList: true, subtree: true });
    updateAll();
})();

Lampa.Platform.tv();
