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
    if (val && typeof val === 'object' && '$value' in val) {
      result.push({ name: fullKey, value: val['$value'], type: val['$type'] });
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

function parseColor(value) {
  if (typeof value !== 'string') return null;
  if (value.indexOf('#') === 0) return hexToRgb(value);
  return { r: 0.5, g: 0.5, b: 0.5, a: 1 };
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