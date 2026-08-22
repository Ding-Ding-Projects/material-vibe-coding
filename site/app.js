(function() {
  'use strict';

  /* ─── Theme ─── */
  const html = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle');
  const themeSelect = document.getElementById('site-theme-select');
  let dark = localStorage.getItem('site-theme') !== 'light';
  function applyTheme(d) {
    dark = d;
    html.setAttribute('data-theme', d ? 'dark' : 'light');
    if (themeBtn) themeBtn.textContent = d ? '☀️' : '🌙';
    if (themeSelect) themeSelect.value = d ? 'dark' : 'light';
    localStorage.setItem('site-theme', d ? 'dark' : 'light');
  }
  applyTheme(dark);
  if (themeBtn) themeBtn.addEventListener('click', () => applyTheme(!dark));
  if (themeSelect) themeSelect.addEventListener('change', () => applyTheme(themeSelect.value === 'dark'));

  /* ─── Tabs ─── */
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.panel');
  function activateTab(name) {
    tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    panels.forEach(p => p.classList.remove('active'));
    const tab = document.querySelector(`.tab[data-tab="${name}"]`);
    const panel = document.getElementById('panel-' + name);
    if (tab) { tab.classList.add('active'); tab.setAttribute('aria-selected', 'true'); }
    if (panel) { panel.classList.remove('hidden'); panel.classList.add('active'); }
    window.scrollTo({ top: 0 });
  }
  tabs.forEach(t => t.addEventListener('click', () => activateTab(t.dataset.tab)));
  document.querySelectorAll('a[href^="#panel-"]').forEach(a => {
    a.addEventListener('click', e => { e.preventDefault(); activateTab(a.getAttribute('href').replace('#panel-','')); });
  });
  // Download CTA on home page
  const dlCta = document.querySelector('.cta[href="#panel-download"]');
  if (dlCta) dlCta.addEventListener('click', e => { e.preventDefault(); activateTab('download'); });
  const featCta = document.querySelector('.cta[href="#panel-features"]');
  if (featCta) featCta.addEventListener('click', e => { e.preventDefault(); activateTab('features'); });

  /* ─── Notifications ─── */
  const notifArea = document.getElementById('notification-area');
  function notify(msg, isErr) {
    if (!notifArea) return;
    const el = document.createElement('div');
    el.className = 'notification' + (isErr ? ' error' : '');
    el.textContent = msg;
    el.addEventListener('click', () => el.remove());
    notifArea.appendChild(el);
    setTimeout(() => el.remove(), isErr ? 8000 : 5000);
  }

  /* ─── Command palette ─── */
  const paletteOverlay = document.getElementById('command-palette-overlay');
  const paletteInput = document.getElementById('palette-input');
  const paletteResults = document.getElementById('palette-results');
  let idx = -1;
  const commands = [
    ...Array.from(tabs).map(t => ({ label: t.textContent.trim().replace(/^[^\w]+/,'').trim(), action: () => activateTab(t.dataset.tab) })),
    { label: 'Toggle theme', action: () => applyTheme(!dark) },
  ];
  function openPalette() { paletteOverlay.classList.remove('hidden'); paletteInput.value = ''; idx = -1; renderPalette(''); requestAnimationFrame(() => paletteInput.focus()); }
  function closePalette() { paletteOverlay.classList.add('hidden'); }
  function renderPalette(q) {
    paletteResults.innerHTML = '';
    commands.filter(c => c.label.toLowerCase().includes(q.toLowerCase())).forEach((cmd, i) => {
      const li = document.createElement('li');
      li.textContent = cmd.label;
      li.className = i === idx ? 'selected' : '';
      li.addEventListener('click', () => { cmd.action(); closePalette(); });
      paletteResults.appendChild(li);
    });
  }
  if (paletteOverlay) {
    paletteOverlay.addEventListener('click', e => { if (e.target === paletteOverlay) closePalette(); });
    paletteInput.addEventListener('input', () => { idx = -1; renderPalette(paletteInput.value); });
    paletteInput.addEventListener('keydown', e => {
      const items = paletteResults.children;
      if (e.key === 'ArrowDown') { e.preventDefault(); idx = Math.min(idx + 1, items.length - 1); highlight(items); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); idx = Math.max(idx - 1, 0); highlight(items); }
      else if (e.key === 'Enter' && items[idx]) items[idx].click();
      else if (e.key === 'Escape') closePalette();
    });
  }
  function highlight(items) { Array.from(items).forEach((li, i) => li.classList.toggle('selected', i === idx)); }
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.shiftKey && e.key === 'F') { e.preventDefault(); openPalette(); }
    if (e.key === 'Escape' && !paletteOverlay.classList.contains('hidden')) closePalette();
  });

  /* ─── Funny levels ─── */
  const fEn = document.getElementById('site-funny-en');
  const fEnL = document.getElementById('site-funny-en-label');
  const fZh = document.getElementById('site-funny-zh');
  const fZhL = document.getElementById('site-funny-zh-label');
  if (fEn) fEn.addEventListener('input', () => { fEnL.textContent = fEn.value; });
  if (fZh) fZh.addEventListener('input', () => { fZhL.textContent = fZh.value; });

  /* ─── Dim sum surprise ─── */
  const dishes = [
    { en: 'Har Gow · 蝦餃', icon: '🥟' },
    { en: 'Siu Mai · 燒賣', icon: '🥠' },
    { en: 'Char Siu Bao · 叉燒包', icon: '🥮' },
    { en: 'Cheung Fun · 腸粉', icon: '🍜' },
    { en: 'Egg Tart · 蛋撻', icon: '🥧' },
  ];
  if (Math.random() < 0.10) {
    const dish = dishes[Math.floor(Math.random() * dishes.length)];
    const el = document.getElementById('dimsum-surprise');
    const textEl = document.getElementById('dish-text');
    if (el && textEl) {
      el.querySelector('.dish-icon').textContent = dish.icon;
      textEl.textContent = dish.en;
      el.classList.remove('hidden');
      el.addEventListener('click', () => el.classList.add('hidden'));
      setTimeout(() => el.classList.add('hidden'), 6000);
    }
  }
})();
