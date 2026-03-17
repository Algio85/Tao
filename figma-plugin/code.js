// ─── Helpers ──────────────────────────────────────────────────────────────────

function log(message, level) {
  figma.ui.postMessage({ type: 'log', message: message, level: level || '' });
}

function progress(pct) {
  figma.ui.postMessage({ type: 'progress', pct: pct });
}

function flattenTokens(obj, prefix) {
  var result = [];
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var val = obj[key];
    var fullKey = prefix ? prefix + '/' + key : key;
    if (val && typeof val === 'object' && ('$value' in val || 'value' in val)) {
      result.push({
        name: fullKey,
        value: val['$value'] !== undefined ? val['$value'] : val['value'],
        type: val['$type'] !== undefined ? val['$type'] : val['type'],
        description: val['$description'] || val['comment'] || ''
      });
    } else if (val && typeof val === 'object') {
      var nested = flattenTokens(val, fullKey);
      for (var j = 0; j < nested.length; j++) result.push(nested[j]);
    }
  }
  return result;
}

function hexToRgb(hex) {
  var clean = hex.replace('#', '');
  return {
    r: parseInt(clean.slice(0, 2), 16) / 255,
    g: parseInt(clean.slice(2, 4), 16) / 255,
    b: parseInt(clean.slice(4, 6), 16) / 255,
    a: 1
  };
}

function oklchToRgb(str) {
  var match = str.match(/oklch\(\s*([\d.]+)%?\s+([\d.]+)\s+([\d.]+)/);
  if (!match) return { r: 0.5, g: 0.5, b: 0.5, a: 1 };

  var L = parseFloat(match[1]);
  var C = parseFloat(match[2]);
  var H = parseFloat(match[3]);
  if (L > 1) L = L / 100;

  var hRad = H * Math.PI / 180;
  var a = C * Math.cos(hRad);
  var b = C * Math.sin(hRad);

  var l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  var m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  var s_ = L - 0.0894841775 * a - 1.291485548  * b;

  var lc = l_ * l_ * l_;
  var mc = m_ * m_ * m_;
  var sc = s_ * s_ * s_;

  function toSrgb(v) {
    v = Math.max(0, Math.min(1, v));
    return v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  }

  var r  = Math.round(toSrgb( 4.0767416621 * lc - 3.3077115913 * mc + 0.2309699292 * sc) * 255);
  var g  = Math.round(toSrgb(-1.2684380046 * lc + 2.6097574011 * mc - 0.3413193965 * sc) * 255);
  var bv = Math.round(toSrgb(-0.0041960863 * lc - 0.7034186147 * mc + 1.707614701  * sc) * 255);

  return {
    r: Math.max(0, Math.min(255, r)) / 255,
    g: Math.max(0, Math.min(255, g)) / 255,
    b: Math.max(0, Math.min(255, bv)) / 255,
    a: 1
  };
}

function parseColor(value) {
  if (typeof value !== 'string') return null;
  if (value.indexOf('#') === 0) return hexToRgb(value);
  if (value.indexOf('oklch') === 0) return oklchToRgb(value);
  return null;
}

function inferFigmaType(type, value) {
  if (type === 'color') return 'COLOR';
  if (type === 'spacing' || type === 'dimension' || type === 'borderRadius' || type === 'borderWidth' || type === 'number') return 'FLOAT';
  if (type === 'boolean') return 'BOOLEAN';
  // Auto-detect color from value
  if (typeof value === 'string' && (value.indexOf('#') === 0 || value.indexOf('oklch') === 0)) return 'COLOR';
  return 'STRING';
}

function parseNum(value) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
  return 0;
}

// ─── Push single collection ───────────────────────────────────────────────────

async function pushCollection(item) {
  var flat = flattenTokens(item.tokens, '');
  log('  → ' + item.collection + ': ' + flat.length + ' tokens', 'info');

  var existing = await figma.variables.getLocalVariableCollectionsAsync();
  var collection = null;
  for (var i = 0; i < existing.length; i++) {
    if (existing[i].name === item.collection) { collection = existing[i]; break; }
  }

  if (!collection) {
    collection = figma.variables.createVariableCollection(item.collection);
  }

  var modeId = collection.modes[0].modeId;
  var existingVars = await figma.variables.getLocalVariablesAsync();
  var existingMap = {};
  for (var i = 0; i < existingVars.length; i++) {
    var v = existingVars[i];
    if (v.variableCollectionId === collection.id) existingMap[v.name] = v;
  }

  var created = 0, updated = 0, errors = 0;

  for (var i = 0; i < flat.length; i++) {
    var token = flat[i];
    try {
      var figmaType = inferFigmaType(token.type, token.value);
      var variable = existingMap[token.name];

      if (!variable) {
        variable = figma.variables.createVariable(token.name, collection, figmaType);
        created++;
      } else {
        updated++;
      }

      // Set description if present
      if (token.description) {
        variable.description = token.description;
      }

      var value;
      if (figmaType === 'COLOR') {
        value = parseColor(token.value) || { r: 0, g: 0, b: 0, a: 1 };
      } else if (figmaType === 'FLOAT') {
        value = parseNum(token.value);
      } else if (figmaType === 'BOOLEAN') {
        value = Boolean(token.value);
      } else {
        value = String(token.value);
      }

      variable.setValueForMode(modeId, value);

      // Set CSS code syntax for Dev Mode
      var cssVarName = 'var(--tao-' + token.name.replace(/\//g, '-') + ')';
      variable.setVariableCodeSyntax('WEB', cssVarName);

    } catch (e) {
      log('    Error on ' + token.name + ': ' + e.message, 'error');
      errors++;
    }
  }

  log('  ✓ ' + item.collection + ' — ' + created + ' created, ' + updated + ' updated, ' + errors + ' errors', 'success');
}

// ─── Push all selected ────────────────────────────────────────────────────────

async function pushAll(collections) {
  log('Pushing ' + collections.length + ' collection(s)...', 'info');

  for (var i = 0; i < collections.length; i++) {
    await pushCollection(collections[i]);
    progress(Math.round(((i + 1) / collections.length) * 100));
  }

  log('All done!', 'success');
  figma.ui.postMessage({ type: 'done' });
}

// ─── Main ─────────────────────────────────────────────────────────────────────

figma.showUI(__html__, { width: 400, height: 560 });

figma.ui.onmessage = async function(msg) {
  if (msg.type === 'push-all') await pushAll(msg.collections);
};