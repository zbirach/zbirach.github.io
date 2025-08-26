(function () {
  'use strict';

  /* ====== Налаштування за замовчуванням ====== */
  const LS_KEY = 'mic_color_hex';
  const DEFAULT_COLOR = '#ff3b30'; // червоний Apple-like

  /* ====== Службові функції ====== */
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
  function hexToRgb(hex) {
    const m = hex.replace('#', '').match(/.{1,2}/g);
    if (!m || (m.length !== 3)) return { r: 255, g: 255, b: 255 };
    return { r: parseInt(m[0], 16), g: parseInt(m[1], 16), b: parseInt(m[2], 16) };
  }

  /* Алгоритм підбору CSS filter для перефарбування білої іконки у довільний колір.
     (спрощена версія «Sosuke» — достатньо точна для PNG/SVG із білою основою) */
  function cssFilterFromHex(hex) {
    const { r, g, b } = hexToRgb(hex);
    // Нормалізація
    const nr = r / 255, ng = g / 255, nb = b / 255;

    // Підбір по місцю (швидкий евристичний варіант)
    // Базово: інвертуємо (щоб зробити біле чорним), потім коригуємо відтінок
    // Цього зазвичай достатньо для моноіконок
    // hue приблизно з HSL:
    const max = Math.max(nr, ng, nb), min = Math.min(nr, ng, nb);
    let h;
    if (max === min) h = 0;
    else if (max === nr) h = (60 * ((ng - nb) / (max - min)) + 360) % 360;
    else if (max === ng) h = 60 * ((nb - nr) / (max - min)) + 120;
    else h = 60 * ((nr - ng) / (max - min)) + 240;

    // Насиченість і яскравість
    const l = (max + min) / 2;
    const s = (max === min) ? 0 : ( (l <= 0.5) ? ((max - min) / (max + min)) : ((max - min) / (2 - max - min)) );

    // Конструюємо набір фільтрів
    const invert = 1; // інвертуємо повністю від білого
    const sepia = clamp(0.2 + s * 0.6, 0, 1);
    const saturate = clamp(2 + s * 6, 0, 10);
    const hue = Math.round(h);
    const brightness = clamp(0.7 + l * 0.6, 0.5, 1.4);
    const contrast = clamp(0.9 + s * 0.3, 0.6, 1.4);

    return `invert(${invert}) sepia(${sepia}) saturate(${saturate}) hue-rotate(${hue}deg) brightness(${brightness}) contrast(${contrast})`;
  }

  /* ====== Стан + застосування стилів ====== */
  let color = (() => {
    try { return localStorage.getItem(LS_KEY) || DEFAULT_COLOR; } catch { return DEFAULT_COLOR; }
  })();

  function ensureStyle() {
    let s = document.getElementById('mic-style');
    if (!s) {
      s = document.createElement('style');
      s.id = 'mic-style';
      document.head.appendChild(s);
    }
    const filter = cssFilterFromHex(color);
    s.textContent = `
      :root{
        --mic-color:${color};
        --mic-filter:${filter};
      }
      /* Головне меню: іконки SVG, шрифтові та растрові */
      .menu__item svg, .menu__item svg *,
      .menu__item .icon, .menu__item .ico { fill: var(--mic-color) !important; color: var(--mic-color) !important; stroke: var(--mic-color) !important; }
      .menu__item img { filter: var(--mic-filter) !important; }

      /* Налаштування */
      .settings__item svg, .settings__item svg *,
      .settings__item .settings__ico, .settings__item .settings__icon,
      .settings__item .icon, .settings__item .ico { fill: var(--mic-color) !important; color: var(--mic-color) !important; stroke: var(--mic-color) !important; }
      .settings__item img { filter: var(--mic-filter) !important; }

      /* Нижня панель навігації (якщо є) */
      .navigation-bar__item svg, .navigation-bar__item svg * { fill: var(--mic-color) !important; stroke: var(--mic-color) !important; color: var(--mic-color) !important; }
      .navigation-bar__item img { filter: var(--mic-filter) !important; }
    `;
  }

  function setColor(newHex) {
    if (!/^#([0-9A-F]{3}){1,2}$/i.test(newHex)) return;
    color = newHex;
    try { localStorage.setItem(LS_KEY, color); } catch {}
    ensureStyle();
  }

  /* ====== Міні-панель налаштувань (плаваюча) ====== */
  function injectUI() {
    if (document.getElementById('mic-panel')) return;

    const btn = document.createElement('button');
    btn.id = 'mic-panel';
    btn.textContent = '🎨';
    Object.assign(btn.style, {
      position: 'fixed', right: '16px', bottom: '16px', width: '44px', height: '44px',
      borderRadius: '12px', border: 'none', background: '#2b2b2b', color: '#fff',
      fontSize: '22px', lineHeight: '44px', cursor: 'pointer', zIndex: 2147483647,
      boxShadow: '0 6px 18px rgba(0,0,0,.35)', opacity: '.85'
    });

    const panel = document.createElement('div');
    panel.id = 'mic-modal';
    panel.style.cssText = `
      position: fixed; right: 16px; bottom: 72px; z-index: 2147483647;
      background: #1f1f1f; color: #fff; border-radius: 14px; padding: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,.45); min-width: 220px; display: none;
    `;

    panel.innerHTML = `
      <div style="font-weight:600;margin-bottom:8px;">Колір іконок</div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
        <input id="mic-color" type="color" value="${color}" style="width:38px;height:38px;border:none;background:transparent;"/>
        <input id="mic-hex" type="text" value="${color}" maxlength="7" placeholder="#ff3b30"
               style="flex:1;padding:8px 10px;border-radius:8px;border:1px solid #444;background:#141414;color:#fff;"/>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">
        ${['#ff3b30','#ff9500','#ffcc00','#34c759','#0a84ff','#bf5af2','#ffffff','#9e9e9e'].map(c =>
          `<button data-c="${c}" style="width:24px;height:24px;border-radius:6px;border:1px solid #333;background:${c}"></button>`).join('')}
      </div>
      <div style="display:flex;gap:8px;justify-content:flex-end;">
        <button id="mic-reset" style="padding:6px 10px;border-radius:8px;border:1px solid #444;background:#2a2a2a;color:#fff;">Скинути</button>
        <button id="mic-close" style="padding:6px 10px;border-radius:8px;border:1px solid #444;background:#2a2a2a;color:#fff;">Закрити</button>
      </div>
    `;

    document.body.appendChild(btn);
    document.body.appendChild(panel);

    const inputColor = panel.querySelector('#mic-color');
    const inputHex   = panel.querySelector('#mic-hex');

    function sync(hex) {
      inputColor.value = hex;
      inputHex.value = hex;
      setColor(hex);
    }

    btn.addEventListener('click', () => {
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    });
    panel.querySelector('#mic-close').addEventListener('click', () => panel.style.display = 'none');
    panel.querySelector('#mic-reset').addEventListener('click', () => sync(DEFAULT_COLOR));

    inputColor.addEventListener('input', e => sync(e.target.value));
    inputHex.addEventListener('change', e => {
      const v = e.target.value.trim();
      if (/^#([0-9A-F]{3}){1,2}$/i.test(v)) sync(v);
      else e.target.value = color;
    });

    panel.querySelectorAll('button[data-c]').forEach(b =>
      b.addEventListener('click', () => sync(b.getAttribute('data-c')))
    );
  }

  /* ====== Запуск ====== */
  function start() {
    ensureStyle();
    injectUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else start();

  // На випадок перезавантажень частин DOM
  new MutationObserver(() => ensureStyle()).observe(document.documentElement, {childList: true, subtree: true});
})();
