(function() {
  'use strict';
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.panel');
  function activateTab(name) {
    tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    panels.forEach(p => p.classList.remove('active'));
    const tab = document.querySelector('.tab[data-tab="' + name + '"]');
    const panel = document.getElementById('panel-' + name);
    if (tab) { tab.classList.add('active'); tab.setAttribute('aria-selected', 'true'); }
    if (panel) { panel.classList.remove('hidden'); panel.classList.add('active'); }
  }
  tabs.forEach(tab => tab.addEventListener('click', () => activateTab(tab.dataset.tab)));
  document.querySelectorAll('a[href^="#panel-"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const name = a.getAttribute('href').replace('#panel-', '');
      activateTab(name);
    });
  });
  // Theme toggle
  const themeBtn = document.getElementById('theme-toggle');
  let dark = true;
  themeBtn.addEventListener('click', () => {
    dark = !dark;
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    themeBtn.textContent = dark ? '☀️' : '🌙';
  });
  // Notifications
  const notifArea = document.getElementById('notification-area');
  function notify(msg, isErr) {
    const el = document.createElement('div');
    el.className = 'notification' + (isErr ? ' error' : '');
    el.textContent = msg;
    el.addEventListener('click', () => el.remove());
    notifArea.appendChild(el);
    setTimeout(() => { if (el.parentNode) el.remove(); }, isErr ? 8000 : 4000);
  }
  // Command palette
  const paletteOverlay = document.getElementById('command-palette-overlay');
  const paletteInput = document.getElementById('palette-input');
  const paletteResults = document.getElementById('palette-results');
  const commands = [
    ...Array.from(tabs).map(t => ({ label: t.textContent.trim(), action: () => activateTab(t.dataset.tab) })),
    { label: 'Toggle theme', action: () => themeBtn.click() },
  ];
  let idx = -1;
  function openPalette() { paletteOverlay.classList.remove('hidden'); paletteInput.value = ''; idx = -1; renderPalette(''); paletteInput.focus(); }
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
  paletteOverlay.addEventListener('click', e => { if (e.target === paletteOverlay) closePalette(); });
  paletteInput.addEventListener('input', () => { idx = -1; renderPalette(paletteInput.value); });
  paletteInput.addEventListener('keydown', e => {
    const items = paletteResults.children;
    if (e.key === 'ArrowDown') { idx = Math.min(idx + 1, items.length - 1); renderPalette(paletteInput.value); }
    else if (e.key === 'ArrowUp') { idx = Math.max(idx - 1, 0); renderPalette(paletteInput.value); }
    else if (e.key === 'Enter' && items[idx]) items[idx].click();
    else if (e.key === 'Escape') closePalette();
  });
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.shiftKey && e.key === 'F') { e.preventDefault(); openPalette(); }
  });
  // Dim sum surprise
  const dishes = [
    { en: 'Har Gow', zh: '蝦餃' }, { en: 'Siu Mai', zh: '燒賣' },
    { en: 'Char Siu Bao', zh: '叉燒包' }, { en: 'Cheung Fun', zh: '腸粉' },
    { en: 'Egg Tart', zh: '蛋撻' },
  ];
  if (Math.random() < 0.10) {
    const dish = dishes[Math.floor(Math.random() * dishes.length)];
    const el = document.getElementById('dimsum-surprise');
    el.textContent = dish.en + ' · ' + dish.zh;
    el.classList.remove('hidden');
    el.addEventListener('click', () => el.classList.add('hidden'));
    setTimeout(() => el.classList.add('hidden'), 6000);
  }
})();
