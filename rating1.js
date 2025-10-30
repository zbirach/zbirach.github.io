(function () {
    'use strict';

    function insertSafeRating(card, event) {
        let voteEl = card.querySelector('.card__vote.rate--safe');
        if (!voteEl) {
            voteEl = document.createElement('div');
            voteEl.className = 'card__vote rate--safe';
            voteEl.style.cssText = `
                line-height: 1;
                font-family: "Segoe UI", sans-serif;
                cursor: default;
                box-sizing: border-box;
                outline: none;
                user-select: none;
                position: absolute;
                right: 0.3em;
                bottom: 0.3em;
                background: rgba(255,255,255,0.2);
                color: #fff;
                padding: 0.2em 0.6em;
                border-radius: 1em;
                display: flex;
                align-items: center;
                font-weight: 600;
            `;
            const parent = card.querySelector('.card__view') || card;
            parent.appendChild(voteEl);
        }

        let data = event.object.data || {};
        let rating = data.vote_average || 0;
        if (!rating || rating === 0) {
            voteEl.style.display = 'none';
        } else {
            voteEl.style.display = 'flex';
            voteEl.innerHTML = rating.toFixed(1);
        }
    }

    function insertFullRating(render, data) {
        if (!render) return;
        let rateLine = $(render).find('.full-start-new__rate-line');
        if (rateLine.length === 0) return;

        if (rateLine.find('.rate--safe').length === 0) {
            let safeBlock = `
                <div class="full-start__rate rate--safe">
                    <div class="rate-value">${data.vote_average ? data.vote_average.toFixed(1) : '0.0'}</div>
                    <div class="source--name">LAMPA SAFE</div>
                </div>`;
            let kpBlock = rateLine.find('.rate--kp');
            if (kpBlock.length > 0) kpBlock.after(safeBlock);
            else rateLine.append(safeBlock);
        }
    }

    function setupCardListener() {
        if (window.lampa_safe_listener) return;
        window.lampa_safe_listener = true;

        Object.defineProperty(window.Lampa.Card.prototype, 'build', {
            get() { return this._build; },
            set(func) {
                this._build = () => {
                    func.apply(this);
                    Lampa.Listener.send('card', { type: 'build', object: this });
                };
            }
        });
    }

    function initSafePlugin() {
        const style = document.createElement('style');
        style.textContent = `
            .rate--safe .rate-value { color: #ffd700; font-weight: bold; }
        `;
        document.head.appendChild(style);

        setupCardListener();

        Lampa.Listener.follow('card', (e) => {
            if (e.type === 'build' && e.object.card) insertSafeRating(e.object.card, e);
        });

        Lampa.Listener.follow('full', (e) => {
            if (e.type === 'complite') {
                let render = e.object.activity.render();
                let data = e.object.data || {};
                insertFullRating(render, data);
            }
        });
    }

    if (window.appready) initSafePlugin();
    else Lampa.Listener.follow('app', (e) => {
        if (e.type === 'ready') initSafePlugin();
    });
})();
