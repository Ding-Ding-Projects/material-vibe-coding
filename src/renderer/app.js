(function() {
  'use strict';
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const target = document.getElementById('panel-' + tab.dataset.tab);
      if (target) target.classList.add('active');
    });
  });
  const btnMin = document.getElementById('btn-min');
  const btnMax = document.getElementById('btn-max');
  const btnClose = document.getElementById('btn-close');
  if (btnMin && window.vibe) btnMin.addEventListener('click', () => window.vibe.windowMinimize());
  if (btnMax && window.vibe) btnMax.addEventListener('click', () => window.vibe.windowMaximize());
  if (btnClose && window.vibe) btnClose.addEventListener('click', () => window.vibe.windowClose());
  const codeEditor = document.getElementById('code-editor');
  const lineCount = document.getElementById('line-count');
  const charCount = document.getElementById('char-count');
  function updateStats() {
    lineCount.textContent = 'Lines: ' + codeEditor.value.split('\n').length;
    charCount.textContent = 'Chars: ' + codeEditor.value.length;
  }
  if (codeEditor) codeEditor.addEventListener('input', updateStats);
  updateStats();
  const notificationArea = document.getElementById('notification-area');
  function notify(message, isError) {
    if (!notificationArea) return;
    const el = document.createElement('div');
    el.className = 'notification' + (isError ? ' error' : '');
    el.textContent = message;
    el.addEventListener('click', () => el.remove());
    notificationArea.appendChild(el);
    setTimeout(() => { if (el.parentNode) el.remove(); }, isError ? 8000 : 4000);
  }
  let darkTheme = true;
  function toggleTheme() {
    darkTheme = !darkTheme;
    document.documentElement.setAttribute('data-theme', darkTheme ? 'dark' : 'light');
    notify(darkTheme ? 'Dark theme 🌙' : 'Light theme ☀️');
  }
  const paletteOverlay = document.getElementById('command-palette-overlay');
  const paletteInput = document.getElementById('palette-input');
  const paletteResults = document.getElementById('palette-results');
  const commands = [
    ...Array.from(tabs).map(t => ({ label: t.textContent.trim(), action: () => t.click() })),
    { label: 'Toggle theme', action: toggleTheme },
  ];
  let paletteIndex = -1;
  function openPalette() {
    paletteOverlay.classList.remove('hidden');
    paletteInput.value = '';
    paletteIndex = -1;
    renderPalette('');
    paletteInput.focus();
  }
  function closePalette() { paletteOverlay.classList.add('hidden'); }
  function renderPalette(query) {
    paletteResults.innerHTML = '';
    commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase())).forEach((cmd, i) => {
      const li = document.createElement('li');
      li.textContent = cmd.label;
      li.className = i === paletteIndex ? 'selected' : '';
      li.addEventListener('click', () => { cmd.action(); closePalette(); });
      paletteResults.appendChild(li);
    });
  }
  if (paletteOverlay) {
    paletteOverlay.addEventListener('click', e => { if (e.target === paletteOverlay) closePalette(); });
    paletteInput.addEventListener('input', () => { paletteIndex = -1; renderPalette(paletteInput.value); });
    paletteInput.addEventListener('keydown', e => {
      const items = paletteResults.children;
      if (e.key === 'ArrowDown') { paletteIndex = Math.min(paletteIndex + 1, items.length - 1); renderPalette(paletteInput.value); }
      else if (e.key === 'ArrowUp') { paletteIndex = Math.max(paletteIndex - 1, 0); renderPalette(paletteInput.value); }
      else if (e.key === 'Enter' && items[paletteIndex]) { items[paletteIndex].click(); }
      else if (e.key === 'Escape') closePalette();
    });
  }
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.shiftKey && e.key === 'F') { e.preventDefault(); openPalette(); }
  });
  const dishes = [
    { en: 'Har Gow', zh: '蝦餃' }, { en: 'Siu Mai', zh: '燒賣' },
    { en: 'Char Siu Bao', zh: '叉燒包' }, { en: 'Cheung Fun', zh: '腸粉' },
    { en: 'Egg Tart', zh: '蛋撻' },
  ];
  if (Math.random() < 0.10) {
    const dish = dishes[Math.floor(Math.random() * dishes.length)];
    const el = document.getElementById('dimsum-surprise');
    if (el) {
      el.textContent = dish.en + ' · ' + dish.zh;
      el.classList.remove('hidden');
      el.addEventListener('click', () => el.classList.add('hidden'));
      setTimeout(() => el.classList.add('hidden'), 6000);
    }
  }
})();
