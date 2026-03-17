// ─── Helpers ──────────────────────────────────────────────────────────────────

function log(message, level) {
  figma.ui.postMessage({ type: 'log', message: message, level: level || '' });
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
        type: val['$type'] !== undefined ? val['$type'] : val['type']
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

  r  = Math.max(0, Math.min(255, r));
  g  = Math.max(0, Math.min(255, g));
  bv = Math.max(0, Math.min(255, bv));

  return { r: r / 255, g: g / 255, b: bv / 255, a: 1 };
}

function parseColor(value) {
  if (typeof value !== 'string') return null;
  if (value.indexOf('#') === 0) return hexToRgb(value);
  if (value.indexOf('oklch') === 0) return oklchToRgb(value);
  return null;
}

function inferFigmaType(type) {
  if (type === 'color') return 'COLOR';
  if (type === 'spacing' || type === 'dimension' || type === 'borderRadius' || type === 'borderWidth' || type === 'number') return 'FLOAT';
  if (type === 'boolean') return 'BOOLEAN';
  return 'STRING';
}

function parseNum(value) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
  return 0;
}

function toHex(v) {
  return Math.round(v * 255).toString(16).padStart(2, '0');
}

// ─── Push ─────────────────────────────────────────────────────────────────────

async function pushTokens(tokens, collectionName) {
  var flat = flattenTokens(tokens, '');
  log('Found ' + flat.length + ' tokens', 'info');

  if (flat.length === 0) {
    log('No tokens found — check your JSON format', 'error');
    return;
  }

  var existing = await figma.variables.getLocalVariableCollectionsAsync();
  var collection = null;
  for (var i = 0; i < existing.length; i++) {
    if (existing[i].name === collectionName) { collection = existing[i]; break; }
  }

  if (!collection) {
    collection = figma.variables.createVariableCollection(collectionName);
    log('Created collection: ' + collectionName, 'success');
  } else {
    log('Using existing collection: ' + collectionName, 'info');
  }

  var modeId = collection.modes[0].modeId;
  var created = 0, updated = 0, errors = 0;

  var existingVars = await figma.variables.getLocalVariablesAsync();
  var existingMap = {};
  for (var i = 0; i < existingVars.length; i++) {
    var v = existingVars[i];
    if (v.variableCollectionId === collection.id) existingMap[v.name] = v;
  }

  for (var i = 0; i < flat.length; i++) {
    var token = flat[i];
    try {
      var figmaType = inferFigmaType(token.type);
      var variable = existingMap[token.name];

      if (!variable) {
        variable = figma.variables.createVariable(token.name, collection, figmaType);
        created++;
      } else {
        updated++;
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
      log('Error on ' + token.name + ': ' + e.message, 'error');
      errors++;
    }
  }

  log('Done — ' + created + ' created, ' + updated + ' updated, ' + errors + ' errors', 'success');
}

// ─── Pull ─────────────────────────────────────────────────────────────────────

async function pullTokens() {
  var collections = await figma.variables.getLocalVariableCollectionsAsync();
  var variables = await figma.variables.getLocalVariablesAsync();
  var result = {};

  for (var i = 0; i < variables.length; i++) {
    var variable = variables[i];
    var collection = null;
    for (var j = 0; j < collections.length; j++) {
      if (collections[j].id === variable.variableCollectionId) { collection = collections[j]; break; }
    }

    var colName = collection ? collection.name : 'unknown';
    var modeId = collection && collection.modes[0] ? collection.modes[0].modeId : null;
    var raw = modeId ? variable.valuesByMode[modeId] : null;

    var value, type;
    if (variable.resolvedType === 'COLOR' && raw && typeof raw === 'object' && 'r' in raw) {
      value = '#' + toHex(raw.r) + toHex(raw.g) + toHex(raw.b);
      type = 'color';
    } else if (variable.resolvedType === 'FLOAT') {
      value = raw;
      type = 'number';
    } else if (variable.resolvedType === 'BOOLEAN') {
      value = raw;
      type = 'boolean';
    } else {
      value = raw;
      type = 'string';
    }

    if (!result[colName]) result[colName] = {};

    var keys = variable.name.split('/');
    var node = result[colName];
    for (var k = 0; k < keys.length - 1; k++) {
      if (!node[keys[k]]) node[keys[k]] = {};
      node = node[keys[k]];
    }
    node[keys[keys.length - 1]] = { '$value': value, '$type': type };
  }

  figma.ui.postMessage({ type: 'pull-result', tokens: result });
}

// ─── Clear ────────────────────────────────────────────────────────────────────

async function clearVariables() {
  var variables = await figma.variables.getLocalVariablesAsync();
  var collections = await figma.variables.getLocalVariableCollectionsAsync();
  for (var i = 0; i < variables.length; i++) variables[i].remove();
  for (var i = 0; i < collections.length; i++) collections[i].remove();
  log('Cleared ' + variables.length + ' variables and ' + collections.length + ' collections', 'success');
}

// ─── Main ─────────────────────────────────────────────────────────────────────

figma.showUI(__html__, { width: 400, height: 560 });

figma.ui.onmessage = async function(msg) {
  if (msg.type === 'push') await pushTokens(msg.tokens, msg.collectionName);
  if (msg.type === 'pull') await pullTokens();
  if (msg.type === 'clear') await clearVariables();
};