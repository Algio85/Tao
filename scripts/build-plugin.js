import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const TOKEN_FILES = [
  { file: 'tokens/base/shades.json',          collection: 'Colors/Shades',     description: 'All 16 shades per palette + brand tokens' },
  { file: 'tokens/base/spacing.json',         collection: 'Spacing',           description: 'Spacing scale — 8 steps' },
  { file: 'tokens/base/borders.json',         collection: 'Borders',           description: 'Border radius and border width' },
  { file: 'tokens/base/typography.json',      collection: 'Typography',        description: 'Type scale — size and config' },
  { file: 'tokens/base/opacity.json',         collection: 'Opacity',           description: 'Opacity scale — 10 steps' },
  { file: 'tokens/base/motion.json',          collection: 'Motion',            description: 'Duration and easing tokens' },
  { file: 'tokens/base/elevation.json',       collection: 'Elevation',         description: 'Z-index scale' },
  { file: 'tokens/semantic/surfaces.json',    collection: 'Semantic/Surfaces', description: 'Surface color tokens' },
  { file: 'tokens/semantic/text.json',        collection: 'Semantic/Text',     description: 'Text color tokens' },
  { file: 'tokens/semantic/borders.json',     collection: 'Semantic/Borders',  description: 'Border color tokens' },
  { file: 'tokens/semantic/states.json',      collection: 'Semantic/States',   description: 'Interactive state tokens' },
  { file: 'tokens/semantic/icons.json',       collection: 'Semantic/Icons',    description: 'Icon color tokens' },
];

const shades = JSON.parse(fs.readFileSync(path.join(root, 'tokens/base/shades.json'), 'utf8'));

// Load all token files for reference resolution
const allTokenSources = [
  JSON.parse(fs.readFileSync(path.join(root, 'tokens/base/spacing.json'), 'utf8')),
  JSON.parse(fs.readFileSync(path.join(root, 'tokens/base/borders.json'), 'utf8')),
  JSON.parse(fs.readFileSync(path.join(root, 'tokens/base/typography.json'), 'utf8')),
  JSON.parse(fs.readFileSync(path.join(root, 'tokens/semantic/surfaces.json'), 'utf8')),
  JSON.parse(fs.readFileSync(path.join(root, 'tokens/semantic/text.json'), 'utf8')),
  JSON.parse(fs.readFileSync(path.join(root, 'tokens/semantic/states.json'), 'utf8')),
];

// Merge all token sources into one lookup object for reference resolution
function mergeDeep(...objects) {
  const result = {};
  for (const obj of objects) {
    for (const [key, val] of Object.entries(obj)) {
      if (val && typeof val === 'object' && !('$value' in val) && !('value' in val)) {
        result[key] = mergeDeep(result[key] || {}, val);
      } else {
        result[key] = val;
      }
    }
  }
  return result;
}

const allPrimitives = mergeDeep(shades, ...allTokenSources);

function resolveRef(value, primitives) {
  if (typeof value !== 'string') return value;
  const match = value.match(/^\{(.+)\}$/);
  if (!match) return value;
  const parts = match[1].split('.');
  let node = primitives;
  for (const part of parts) {
    if (!node || typeof node !== 'object') return value;
    node = node[part];
  }
  if (node && typeof node === 'object' && 'value' in node) return node.value;
  if (node && typeof node === 'object' && '$value' in node) return node.$value;
  return value;
}

function resolveTokens(obj, primitives) {
  const result = {};
  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith('_comment')) continue; // skip comment keys
    if (val && typeof val === 'object' && ('$value' in val || 'value' in val)) {
      const raw = val.$value !== undefined ? val.$value : val.value;
      const resolved = resolveRef(raw, primitives);
      result[key] = Object.assign({}, val, { value: resolved, $value: resolved });
    } else if (val && typeof val === 'object') {
      result[key] = resolveTokens(val, primitives);
    } else {
      result[key] = val;
    }
  }
  return result;
}

const bundle = TOKEN_FILES.map(({ file, collection, description }) => {
  let tokens = JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
  // Component tokens need the full primitive set to resolve semantic refs
  const primitives = (collection.startsWith('Components/') || collection.startsWith('Semantic/')) ? allPrimitives : shades;
  tokens = resolveTokens(tokens, primitives);
  return { file, collection, description, tokens };
});

const typographyTokens = JSON.parse(
  fs.readFileSync(path.join(root, 'tokens/semantic/typography.json'), 'utf8')
);

const shadowTokens = JSON.parse(
  fs.readFileSync(path.join(root, 'tokens/base/shadows.json'), 'utf8')
);

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'DM Sans', sans-serif; font-size: 12px; background: #fff; }
    .header { padding: 16px; border-bottom: 1px solid #e5e5e5; }
    h1 { font-size: 14px; font-weight: 600; color: #111; margin-bottom: 4px; }
    .header p { font-size: 11px; color: #888; }
    .tabs { display: flex; border-bottom: 1px solid #e5e5e5; }
    .tab { flex: 1; padding: 9px 0; font-size: 11px; font-weight: 500; color: #888; text-align: center; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; display: flex; align-items: center; justify-content: center; gap: 6px; }
    .tab.active { color: #2563EB; border-bottom-color: #2563EB; }
    .tab-badge { display: none; font-size: 9px; font-weight: 600; background: #ef4444; color: #fff; border-radius: 10px; padding: 1px 5px; line-height: 1.4; }
    .tab-badge.visible { display: inline-block; }
    .panel { display: none; }
    .panel.active { display: block; }
    .collections { padding: 12px 16px; border-bottom: 1px solid #e5e5e5; max-height: 260px; overflow-y: auto; }
    .collection-row { display: flex; align-items: center; gap: 10px; padding: 8px 4px; border-bottom: 1px solid #f0f0f0; cursor: pointer; border-radius: 4px; }
    .collection-row:last-child { border-bottom: none; }
    .collection-row:hover { background: #fafafa; }
    .collection-row input[type="checkbox"] { width: 14px; height: 14px; accent-color: #2563EB; cursor: pointer; flex-shrink: 0; }
    .collection-info { flex: 1; min-width: 0; }
    .collection-name { font-size: 12px; font-weight: 500; color: #111; }
    .collection-desc { font-size: 10px; color: #aaa; margin-top: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .collection-count { font-size: 10px; color: #bbb; background: #f5f5f5; padding: 2px 6px; border-radius: 3px; flex-shrink: 0; }
    .select-all-row { display: flex; align-items: center; gap: 8px; padding: 8px 16px; border-bottom: 1px solid #e5e5e5; background: #fafafa; }
    .select-all-row label { font-size: 11px; color: #555; cursor: pointer; }
    .styles-section { padding: 12px 16px; border-bottom: 1px solid #e5e5e5; }
    .styles-section h2 { font-size: 11px; font-weight: 600; color: #555; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
    .style-row { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
    .style-row:last-child { border-bottom: none; }
    .style-info .style-name { font-size: 12px; font-weight: 500; color: #111; }
    .style-info .style-desc { font-size: 10px; color: #aaa; margin-top: 2px; }
    .style-count { font-size: 10px; color: #bbb; background: #f5f5f5; padding: 2px 6px; border-radius: 3px; }
    .actions { padding: 12px 16px; display: flex; flex-direction: column; gap: 8px; }
    button { width: 100%; padding: 9px 16px; border-radius: 6px; font-size: 12px; font-weight: 500; cursor: pointer; border: none; }
    .btn-primary { background: #2563EB; color: #fff; }
    .btn-primary:hover { background: #1d4ed8; }
    .btn-primary:disabled { background: #bfdbfe; cursor: not-allowed; }
    .btn-secondary { background: #f5f5f5; color: #333; }
    .btn-secondary:hover { background: #e5e5e5; }
    .btn-secondary:disabled { background: #f5f5f5; color: #bbb; cursor: not-allowed; }
    .log { padding: 10px 16px; font-size: 10px; font-family: monospace; color: #555; background: #f9f9f9; min-height: 60px; max-height: 90px; overflow-y: auto; border-top: 1px solid #e5e5e5; }
    .log .success { color: #16a34a; }
    .log .error { color: #dc2626; }
    .log .info { color: #2563EB; }
    .progress { height: 3px; background: #e5e5e5; display: none; }
    .progress-bar { height: 100%; background: #2563EB; transition: width 0.2s; width: 0%; }
  </style>
</head>
<body>

<div class="header">
  <h1>Tao Token Pusher</h1>
  <p>Push tokens and styles to Figma</p>
</div>

<div class="tabs">
  <div class="tab active" id="tab-variables" onclick="switchTab('variables', this)">
    Variables
    <span class="tab-badge" id="badge-variables"></span>
  </div>
  <div class="tab" id="tab-styles" onclick="switchTab('styles', this)">
    Styles
    <span class="tab-badge" id="badge-styles"></span>
  </div>
</div>

<div class="panel active" id="panel-variables">
  <div class="select-all-row">
    <input type="checkbox" id="selectAll" onchange="toggleAll(this.checked)" />
    <label for="selectAll">Select all</label>
    <span id="selectedCount" style="margin-left:auto;font-size:10px;color:#aaa;">0 selected</span>
  </div>
  <div class="collections" id="collections"></div>
  <div class="progress" id="progress-variables"><div class="progress-bar" id="progressBar-variables"></div></div>
  <div class="actions">
    <button class="btn-primary" id="pushBtn" onclick="pushSelected()" disabled>Push selected to Figma</button>
  </div>
</div>

<div class="panel" id="panel-styles">
  <div class="styles-section">
    <h2>Text Styles</h2>
    <div class="style-row">
      <div class="style-info">
        <div class="style-name">Typography scale</div>
        <div class="style-desc">Display, Title 1–4, Body, Body SM, Label, Label SM × 3 weights</div>
      </div>
      <span class="style-count">27</span>
    </div>
  </div>
  <div class="styles-section">
    <h2>Effect Styles</h2>
    <div class="style-row">
      <div class="style-info">
        <div class="style-name">Shadow presets</div>
        <div class="style-desc">Surface, Non-modal, Sticky, Non-modal-sticky, Modal</div>
      </div>
      <span class="style-count">5</span>
    </div>
  </div>
  <div class="progress" id="progress-styles"><div class="progress-bar" id="progressBar-styles"></div></div>
  <div class="actions">
    <button class="btn-primary" id="pushTextBtn" onclick="pushTextStyles()">Push Text Styles</button>
    <button class="btn-secondary" id="pushShadowBtn" onclick="pushShadows()">Push Shadow Styles</button>
    <button class="btn-primary" id="pushAllStylesBtn" onclick="pushAllStyles()">Push All Styles</button>
  </div>
</div>

<div class="log" id="log">Checking Figma…</div>

<script>
  function switchTab(name, el) {
    document.querySelectorAll('.tab').forEach(function(t) { t.classList.remove('active'); });
    document.querySelectorAll('.panel').forEach(function(p) { p.classList.remove('active'); });
    el.classList.add('active');
    document.getElementById('panel-' + name).classList.add('active');
  }

  function setBadge(id, count) {
    var el = document.getElementById('badge-' + id);
    if (!el) return;
    if (count > 0) {
      el.textContent = count;
      el.classList.add('visible');
    } else {
      el.textContent = '';
      el.classList.remove('visible');
    }
  }

  var checkboxes = [];

  function countTokens(tokens) {
    var count = 0;
    function walk(obj) {
      var keys = Object.keys(obj);
      for (var i = 0; i < keys.length; i++) {
        var val = obj[keys[i]];
        if (val && typeof val === 'object' && (val.hasOwnProperty('value') || val.hasOwnProperty('$value'))) {
          count++;
        } else if (val && typeof val === 'object') {
          walk(val);
        }
      }
    }
    walk(tokens);
    return count;
  }

  function log(msg, type) {
    var el = document.getElementById('log');
    el.innerHTML += '<div class="' + (type || '') + '">' + msg + '</div>';
    el.scrollTop = el.scrollHeight;
  }

  function setProgress(id, pct) {
    var wrap = document.getElementById('progress-' + id);
    var bar  = document.getElementById('progressBar-' + id);
    if (!wrap || !bar) return;
    wrap.style.display = 'block';
    bar.style.width = pct + '%';
    if (pct >= 100) {
      setTimeout(function() { wrap.style.display = 'none'; }, 800);
    }
  }

  function setStyleBtnsDisabled(disabled) {
    document.getElementById('pushTextBtn').disabled = disabled;
    document.getElementById('pushShadowBtn').disabled = disabled;
    document.getElementById('pushAllStylesBtn').disabled = disabled;
  }

  function renderCollections() {
    var container = document.getElementById('collections');
    for (var idx = 0; idx < TOKEN_BUNDLE.length; idx++) {
      var item = TOKEN_BUNDLE[idx];
      var count = countTokens(item.tokens);
      var row = document.createElement('div');
      row.className = 'collection-row';
      row.innerHTML =
        '<input type="checkbox" id="cb_' + idx + '" onchange="updateCount()" />' +
        '<div class="collection-info">' +
          '<div class="collection-name">' + item.collection + '</div>' +
          '<div class="collection-desc">' + item.description + '</div>' +
        '</div>' +
        '<span class="collection-count">' + count + '</span>';
      (function(i) {
        row.onclick = function(e) {
          if (e.target.tagName !== 'INPUT') {
            var cb = document.getElementById('cb_' + i);
            cb.checked = !cb.checked;
            updateCount();
          }
        };
      })(idx);
      container.appendChild(row);
      checkboxes.push('cb_' + idx);
    }
  }

  function updateCount() {
    var selected = 0;
    for (var i = 0; i < checkboxes.length; i++) {
      if (document.getElementById(checkboxes[i]).checked) selected++;
    }
    document.getElementById('selectedCount').textContent = selected + ' selected';
    document.getElementById('pushBtn').disabled = selected === 0;
    document.getElementById('selectAll').checked = selected === checkboxes.length;
    document.getElementById('selectAll').indeterminate = selected > 0 && selected < checkboxes.length;
  }

  function toggleAll(checked) {
    for (var i = 0; i < checkboxes.length; i++) {
      document.getElementById(checkboxes[i]).checked = checked;
    }
    updateCount();
  }

  function pushSelected() {
    var selected = [];
    for (var i = 0; i < checkboxes.length; i++) {
      if (document.getElementById(checkboxes[i]).checked) selected.push(TOKEN_BUNDLE[i]);
    }
    if (selected.length === 0) return;
    document.getElementById('pushBtn').disabled = true;
    document.getElementById('log').innerHTML = '';
    log('Pushing ' + selected.length + ' collection(s)...', 'info');
    setProgress('variables', 5);
    parent.postMessage({ pluginMessage: { type: 'push-all', collections: selected } }, '*');
  }

  function pushTextStyles() {
    document.getElementById('log').innerHTML = '';
    setStyleBtnsDisabled(true);
    setProgress('styles', 5);
    log('Pushing Text Styles...', 'info');
    parent.postMessage({ pluginMessage: { type: 'push-text-styles', tokens: TYPOGRAPHY_BUNDLE } }, '*');
  }

  function pushShadows() {
    document.getElementById('log').innerHTML = '';
    setStyleBtnsDisabled(true);
    setProgress('styles', 5);
    log('Pushing Shadow Styles...', 'info');
    parent.postMessage({ pluginMessage: { type: 'push-shadows' } }, '*');
  }

  function pushAllStyles() {
    document.getElementById('log').innerHTML = '';
    setStyleBtnsDisabled(true);
    setProgress('styles', 5);
    log('Pushing all Styles...', 'info');
    window._pendingAllStyles = true;
    parent.postMessage({ pluginMessage: { type: 'push-text-styles', tokens: TYPOGRAPHY_BUNDLE } }, '*');
  }

  window.onmessage = function(event) {
    var msg = event.data.pluginMessage;
    if (!msg) return;

    if (msg.type === 'log') log(msg.message, msg.level);

    if (msg.type === 'diff') {
      document.getElementById('log').innerHTML = '';
      setBadge('variables', msg.variables);
      setBadge('styles', msg.styles);
      if (msg.variables === 0 && msg.styles === 0) {
        log('Figma is up to date.', 'success');
      } else {
        if (msg.variables > 0) log(msg.variables + ' variable(s) missing — push Variables to sync.', 'info');
        if (msg.styles > 0)    log(msg.styles + ' style(s) missing — push Styles to sync.', 'info');
      }
    }

    if (msg.type === 'progress') {
      setProgress('variables', msg.pct);
      setProgress('styles', msg.pct);
    }

    if (msg.type === 'done') {
      if (window._pendingAllStyles) {
        window._pendingAllStyles = false;
        setProgress('styles', 50);
        log('Pushing Shadow Styles...', 'info');
        parent.postMessage({ pluginMessage: { type: 'push-shadows' } }, '*');
        return;
      }
      document.getElementById('pushBtn').disabled = (checkboxes.filter(function(id) {
        return document.getElementById(id).checked;
      }).length === 0);
      setStyleBtnsDisabled(false);
      setProgress('variables', 100);
      setProgress('styles', 100);
      parent.postMessage({ pluginMessage: { type: 'ready', collections: TOKEN_BUNDLE, typographyTokens: TYPOGRAPHY_BUNDLE } }, '*');
    }
  };
</script>

<script>
  var TOKEN_BUNDLE = ${JSON.stringify(bundle)};
  var TYPOGRAPHY_BUNDLE = ${JSON.stringify(typographyTokens)};
  var SHADOW_BUNDLE = ${JSON.stringify(shadowTokens)};
  renderCollections();
  parent.postMessage({ pluginMessage: { type: 'ready', collections: TOKEN_BUNDLE, typographyTokens: TYPOGRAPHY_BUNDLE } }, '*');
</script>

</body>
</html>`;

fs.writeFileSync(path.join(root, 'figma-plugin', 'ui.html'), html);
console.log('Plugin bundle generated -> figma-plugin/ui.html');