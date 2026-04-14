// ========================================
// SECTION DATA
// ========================================
const SECTIONS = {
  hero:        { icon: '🦸', name: 'Hero' },
  kurz:        { icon: '💬', name: 'Kurze Beschreibung' },
  lang:        { icon: '📝', name: 'Lange Beschreibung' },
  plaintext:   { icon: '📄', name: 'Plain Text' },
  features:    { icon: '✨', name: 'Features' },
  leistungen:  { icon: '🛠️', name: 'Leistungen' },
  stats:       { icon: '📊', name: 'Stats' },
  testimonials:{ icon: '⭐', name: 'Testimonials' },
  pricing:     { icon: '💰', name: 'Pricing' },
  team:        { icon: '👥', name: 'Team' },
  ueberuns:    { icon: '🏢', name: 'Über uns' },
  bilder:      { icon: '🖼️', name: 'Bilder' },
  video:       { icon: '🎬', name: 'Video' },
  blog:        { icon: '📰', name: 'Blog Einträge' },
  cta:         { icon: '🚀', name: 'CTA' },
  impressum:   { icon: '⚖️', name: 'Impressum' },
  footer:      { icon: '🔻', name: 'Footer' },
};

// ========================================
// STATE
// ========================================
let canvasItems = [];
let dragSource = null;
let dragType = null;

// ========================================
// DOM REFS
// ========================================
const dropZone = document.getElementById('dropZone');
const dropEmpty = document.getElementById('dropEmpty');
const generateBtn = document.getElementById('generateBtn');

// ========================================
// RENDER CANVAS
// ========================================
function renderCanvas() {
  dropZone.querySelectorAll('.canvas-item, .drop-placeholder').forEach(el => el.remove());

  if (canvasItems.length === 0) {
    dropEmpty.style.display = 'flex';
  } else {
    dropEmpty.style.display = 'none';
    canvasItems.forEach((item, index) => {
      const el = createCanvasItem(item, index);
      dropZone.appendChild(el);
    });
  }
}

function createCanvasItem(item, index) {
  const section = SECTIONS[item.type];
  const el = document.createElement('div');
  el.className = 'canvas-item';
  el.draggable = true;
  el.dataset.index = index;

  el.innerHTML = `
    <div class="canvas-item-drag">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="9" cy="5" r="1" fill="currentColor"/>
        <circle cx="9" cy="12" r="1" fill="currentColor"/>
        <circle cx="9" cy="19" r="1" fill="currentColor"/>
        <circle cx="15" cy="5" r="1" fill="currentColor"/>
        <circle cx="15" cy="12" r="1" fill="currentColor"/>
        <circle cx="15" cy="19" r="1" fill="currentColor"/>
      </svg>
    </div>
    <div class="canvas-item-icon">${section.icon}</div>
    <div class="canvas-item-info">
      <div class="canvas-item-name">${section.name}</div>
      <div class="canvas-item-num">Section ${index + 1}</div>
    </div>
    <div class="canvas-item-actions">
      <button class="item-action-btn" title="Nach oben" onclick="moveItem(${index}, -1)">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m18 15-6-6-6 6"/></svg>
      </button>
      <button class="item-action-btn" title="Nach unten" onclick="moveItem(${index}, 1)">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m6 9 6 6 6-6"/></svg>
      </button>
      <button class="item-action-btn delete" title="Entfernen" onclick="removeItem(${index})">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
    </div>
  `;

  el.addEventListener('dragstart', (e) => {
    dragType = 'canvas';
    dragSource = index;
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => el.style.opacity = '0.4', 0);
  });
  el.addEventListener('dragend', () => {
    el.style.opacity = '1';
    dropZone.querySelectorAll('.drop-placeholder').forEach(p => p.remove());
  });

  return el;
}

// ========================================
// DRAG FROM SIDEBAR
// ========================================
document.querySelectorAll('.section-card').forEach(card => {
  card.addEventListener('dragstart', (e) => {
    dragType = 'sidebar';
    dragSource = card.dataset.type;
    e.dataTransfer.effectAllowed = 'copy';
    card.style.opacity = '0.5';
  });
  card.addEventListener('dragend', () => {
    card.style.opacity = '1';
    dropZone.querySelectorAll('.drop-placeholder').forEach(p => p.remove());
  });
  card.addEventListener('click', () => addItem(card.dataset.type));
});

// ========================================
// DROP ZONE
// ========================================
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = dragType === 'canvas' ? 'move' : 'copy';
  dropZone.classList.add('drag-over');
});
dropZone.addEventListener('dragleave', (e) => {
  if (!dropZone.contains(e.relatedTarget)) dropZone.classList.remove('drag-over');
});
dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  dropZone.querySelectorAll('.drop-placeholder').forEach(p => p.remove());
  if (dragType === 'sidebar') addItem(dragSource);
  dragType = null;
  dragSource = null;
});

// ========================================
// ACTIONS
// ========================================
function addItem(type) {
  canvasItems.push({ type, id: Date.now() });
  renderCanvas();
}
function removeItem(index) {
  canvasItems.splice(index, 1);
  renderCanvas();
}
function moveItem(index, direction) {
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= canvasItems.length) return;
  [canvasItems[index], canvasItems[newIndex]] = [canvasItems[newIndex], canvasItems[index]];
  renderCanvas();
}

// ========================================
// GET CONFIG
// ========================================
function getConfig() {
  return {
    sections: canvasItems.map(item => item.type),
    colors: {
      primary:    document.getElementById('colorPrimary').value,
      background: document.getElementById('colorBg').value,
      dark:       document.getElementById('colorDark').value,
    },
    shape:       document.querySelector('.shape-btn.active')?.dataset.shape || 'rounded',
    font:        document.getElementById('fontSelect').value,
    inspiration: document.getElementById('inspirationUrl').value,
    prompt:      document.getElementById('promptText').value,
    language:    document.getElementById('langSelect').value,
  };
}

// ========================================
// GENERATE — Config als JSON herunterladen
// ========================================
generateBtn.addEventListener('click', () => {
  if (canvasItems.length === 0) {
    showToast('Bitte füge mindestens eine Section hinzu.', 'error');
    return;
  }

  const config = getConfig();
  const json = JSON.stringify(config, null, 2);

  // JSON-Datei herunterladen
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'website-config.json';
  a.click();
  URL.revokeObjectURL(url);

  showToast('Config gespeichert! Jetzt in Terminal ausführen:', 'success');

  // Anleitung einblenden
  showTerminalHint(config.sections.length);
});

// ========================================
// TERMINAL HINT MODAL
// ========================================
function showTerminalHint(sectionCount) {
  // Bestehende entfernen
  document.getElementById('terminalHint')?.remove();

  const div = document.createElement('div');
  div.id = 'terminalHint';
  div.style.cssText = `
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
    background: #0f2f33; color: #fff; border-radius: 12px; padding: 20px 24px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.25); z-index: 1000; max-width: 520px; width: 90%;
    border: 1px solid rgba(28,199,184,0.3); font-family: var(--font-sans);
  `;
  div.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:12px;">
      <div style="font-weight:700; font-size:14px; color:#1cc7b8;">✅ ${sectionCount} Sections konfiguriert</div>
      <button onclick="document.getElementById('terminalHint').remove()" style="background:none;border:none;color:rgba(255,255,255,0.5);cursor:pointer;font-size:18px;line-height:1;">×</button>
    </div>
    <div style="font-size:13px; color:rgba(255,255,255,0.75); margin-bottom:12px;">
      Führe diesen Befehl im Terminal aus (im website-builder Ordner):
    </div>
    <div style="background:#1a1a1a; border-radius:8px; padding:10px 14px; font-family:monospace; font-size:13px; color:#1cc7b8; margin-bottom:12px; word-break:break-all;">
      python generate.py website-config.json output.html
    </div>
    <div style="font-size:11px; color:rgba(255,255,255,0.4);">
      Voraussetzung: Ollama läuft lokal (<code style="color:#1cc7b8;">ollama serve</code>) und Mistral ist installiert (<code style="color:#1cc7b8;">ollama pull mistral</code>)
    </div>
  `;
  document.body.appendChild(div);
}

// ========================================
// LIVE PREVIEW (output.html öffnen)
// ========================================
document.querySelector('.btn-primary')?.addEventListener('click', function(e) {
  // Nur der Preview-Button oben rechts
  if (this === generateBtn) return;
  window.open('output.html', '_blank');
});

// ========================================
// TOAST
// ========================================
function showToast(msg, type = 'info') {
  document.querySelectorAll('.toast').forEach(t => t.remove());
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.style.cssText = `
    position: fixed; top: 80px; right: 20px; z-index: 9999;
    background: ${type === 'error' ? '#dc2626' : '#1cc7b8'};
    color: ${type === 'error' ? '#fff' : '#0f2f33'};
    padding: 10px 16px; border-radius: 8px; font-size: 13px; font-weight: 600;
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    animation: fadeIn 0.2s ease;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// ========================================
// SHAPE & COLOR INTERACTIONS
// ========================================
document.querySelectorAll('.shape-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.shape-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

document.querySelectorAll('.color-preset').forEach(preset => {
  preset.addEventListener('click', () => {
    document.querySelectorAll('.color-preset').forEach(p => p.classList.remove('active'));
    preset.classList.add('active');
  });
});

document.querySelectorAll('.color-input-wrap').forEach(wrap => {
  const colorInput = wrap.querySelector('input[type="color"]');
  const hexInput = wrap.querySelector('.color-hex');
  if (!colorInput || !hexInput) return;
  colorInput.addEventListener('input', () => { hexInput.value = colorInput.value; });
  hexInput.addEventListener('input', () => {
    if (/^#[0-9A-Fa-f]{6}$/.test(hexInput.value)) colorInput.value = hexInput.value;
  });
});

// ========================================
// INIT
// ========================================
renderCanvas();
