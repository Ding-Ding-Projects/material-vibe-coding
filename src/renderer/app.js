(function() {
  'use strict';

  /* ─── Theme management ─── */
  const html = document.documentElement;
  let darkTheme = localStorage.getItem('theme') !== 'light';
  function applyTheme(dark) {
    darkTheme = dark;
    html.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }
  applyTheme(darkTheme);

  /* ─── Tab navigation ─── */
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.panel');
  function activateTab(name) {
    tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    panels.forEach(p => p.classList.remove('active'));
    const tab = document.querySelector(`.tab[data-tab="${name}"]`);
    const panel = document.getElementById('panel-' + name);
    if (tab) { tab.classList.add('active'); tab.setAttribute('aria-selected', 'true'); tab.scrollIntoView({ block: 'nearest' }); }
    if (panel) { panel.classList.remove('hidden'); panel.classList.add('active'); }
  }
  tabs.forEach(tab => tab.addEventListener('click', () => activateTab(tab.dataset.tab)));

  /* ─── Window controls ─── */
  const btnMin = document.getElementById('btn-min');
  const btnMax = document.getElementById('btn-max');
  const btnClose = document.getElementById('btn-close');
  if (btnMin && window.vibe) btnMin.addEventListener('click', () => window.vibe.windowMinimize());
  if (btnMax && window.vibe) btnMax.addEventListener('click', () => window.vibe.windowMaximize());
  if (btnClose && window.vibe) btnClose.addEventListener('click', () => window.vibe.windowClose());

  /* ─── Code editor stats ─── */
  const codeEditor = document.getElementById('code-editor');
  const lineCount = document.getElementById('line-count');
  const charCount = document.getElementById('char-count');
  function updateStats() {
    const val = codeEditor.value;
    const lines = val.split('\n').length;
    const pos = codeEditor.selectionStart || 0;
    const beforeCursor = val.substring(0, pos);
    const col = pos - beforeCursor.lastIndexOf('\n');
    lineCount.textContent = `Ln ${lines}, Col ${col}`;
    charCount.textContent = `${val.length.toLocaleString()} chars`;
  }
  if (codeEditor) {
    codeEditor.addEventListener('input', updateStats);
    codeEditor.addEventListener('click', updateStats);
    codeEditor.addEventListener('keyup', updateStats);
  }
  updateStats();

  /* ─── Notifications ─── */
  const notificationArea = document.getElementById('notification-area');
  function notify(message, type) {
    if (!notificationArea) return;
    const el = document.createElement('div');
    el.className = 'notification' + (type === 'error' ? ' error' : type === 'success' ? ' success' : '');
    el.textContent = message;
    el.setAttribute('role', type === 'error' ? 'alert' : 'status');
    notificationArea.appendChild(el);
    const dismissAfter = type === 'error' ? 10000 : 5000;
    setTimeout(() => dismissNotification(el), dismissAfter);
  }
  function dismissNotification(el) {
    el.classList.add('leaving');
    setTimeout(() => el.remove(), 300);
  }

  /* ─── Command palette ─── */
  const paletteOverlay = document.getElementById('command-palette-overlay');
  const paletteInput = document.getElementById('palette-input');
  const paletteResults = document.getElementById('palette-results');
  let paletteIndex = -1;

  const commands = [
    ...Array.from(tabs).map(t => ({
      label: t.textContent.trim().replace(/^[^\w]+/, '').trim(),
      icon: t.querySelector('.tab-icon')?.textContent?.trim() || '',
      action: () => activateTab(t.dataset.tab)
    })),
    { label: 'Toggle theme', icon: '🎨', action: () => { applyTheme(!darkTheme); notify(darkTheme ? 'Dark theme 🌙' : 'Light theme ☀️'); } },
  ];

  function openPalette() {
    paletteOverlay.classList.remove('hidden');
    paletteInput.value = '';
    paletteIndex = -1;
    renderPalette('');
    requestAnimationFrame(() => paletteInput.focus());
  }
  function closePalette() { paletteOverlay.classList.add('hidden'); }
  function renderPalette(query) {
    paletteResults.innerHTML = '';
    const filtered = commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));
    filtered.forEach((cmd, i) => {
      const li = document.createElement('li');
      li.setAttribute('role', 'option');
      li.innerHTML = `<span>${cmd.icon} ${cmd.label}</span>`;
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
      if (e.key === 'ArrowDown') { e.preventDefault(); paletteIndex = Math.min(paletteIndex + 1, items.length - 1); highlightPalette(items); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); paletteIndex = Math.max(paletteIndex - 1, 0); highlightPalette(items); }
      else if (e.key === 'Enter' && items[paletteIndex]) items[paletteIndex].click();
      else if (e.key === 'Escape') closePalette();
    });
  }
  function highlightPalette(items) {
    Array.from(items).forEach((li, i) => li.classList.toggle('selected', i === paletteIndex));
  }
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.shiftKey && e.key === 'F') { e.preventDefault(); openPalette(); }
    if (e.key === 'Escape' && !paletteOverlay.classList.contains('hidden')) closePalette();
  });

  /* ─── Settings interactions ─── */
  const themeSelect = document.getElementById('setting-theme');
  if (themeSelect) {
    themeSelect.value = darkTheme ? 'dark' : 'light';
    themeSelect.addEventListener('change', () => applyTheme(themeSelect.value === 'dark'));
  }
  const funnyEn = document.getElementById('funny-en');
  const funnyEnLabel = document.getElementById('funny-en-label');
  const funnyZh = document.getElementById('funny-zh');
  const funnyZhLabel = document.getElementById('funny-zh-label');
  if (funnyEn) funnyEn.addEventListener('input', () => { funnyEnLabel.textContent = funnyEn.value; });
  if (funnyZh) funnyZh.addEventListener('input', () => { funnyZhLabel.textContent = funnyZh.value; });

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

  /* ─── Converter drop zone ─── */
  const dropZone = document.getElementById('converter-drop');
  if (dropZone) {
    dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragover'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', e => { e.preventDefault(); dropZone.classList.remove('dragover'); });
  }

  /* ─── Ollama status check ─── */
  const ollamaStatus = document.getElementById('ollama-status');
  const ollamaStatusText = document.getElementById('ollama-status-text');
  const ollamaRefresh = document.getElementById('ollama-refresh');
  async function checkOllama() {
    if (!ollamaStatusText) return;
    ollamaStatusText.textContent = 'Checking local Ollama service…';
    try {
      const resp = await fetch('http://localhost:11434/api/tags', { signal: AbortSignal.timeout(3000) });
      if (!resp.ok) throw new Error(resp.status);
      const data = await resp.json();
      ollamaStatusText.textContent = `✅ Connected — ${data.models?.length || 0} model(s) available`;
      ollamaStatus?.classList.add('connected');
    } catch {
      ollamaStatusText.textContent = '⚠️ Ollama not detected on localhost:11434. Install or start Ollama to use this feature.';
      ollamaStatus?.classList.remove('connected');
    }
  }
  if (ollamaRefresh) ollamaRefresh.addEventListener('click', checkOllama);
  // Check when the Models tab is first activated
  let ollamaChecked = false;
  tabs.forEach(t => t.addEventListener('click', () => {
    if (t.dataset.tab === 'ollama' && !ollamaChecked) { checkOllama(); ollamaChecked = true; }
  }));
})();
