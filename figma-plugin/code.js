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

      var cssVarName = 'var(--tao-' + token.name.replace(/\//g, '-') + ')';
      variable.setVariableCodeSyntax('WEB', cssVarName);

    } catch (e) {
      log('    Error on ' + token.name + ': ' + e.message, 'error');
      errors++;
    }
  }

  log('  ✓ ' + item.collection + ' — ' + created + ' created, ' + updated + ' updated, ' + errors + ' errors', 'success');
}

// ─── Push all variable collections ───────────────────────────────────────────

async function pushAll(collections) {
  log('Pushing ' + collections.length + ' collection(s)...', 'info');

  for (var i = 0; i < collections.length; i++) {
    await pushCollection(collections[i]);
    progress(Math.round(((i + 1) / collections.length) * 100));
  }

  log('All done!', 'success');
  figma.ui.postMessage({ type: 'done' });
}

// ─── Typography ───────────────────────────────────────────────────────────────

// Resolved from tokens/base/typography.json — update here if sizes change
var TYPOGRAPHY_SIZES = {
  'xs':   11,
  'sm':   13,
  'md':   16,
  'lg':   19,
  'xl':   23,
  'xxl':  28,
  'xxxl': 33
};

// ⚠️  Update to match the typeface used in your Figma file
var FONT_FAMILY = 'DM Sans';

var FONT_WEIGHT_MAP = {
  '300': 'Light',
  '400': 'Regular',
  '700': 'Bold'
};

function resolveTypographyRef(ref) {
  // Handles "{typography.size.xl}" → 23
  if (typeof ref === 'string') {
    var match = ref.match(/\{typography\.size\.(\w+)\}/);
    if (match) return TYPOGRAPHY_SIZES[match[1]] || 16;
    return parseFloat(ref) || 16;
  }
  return typeof ref === 'number' ? ref : 16;
}

function flattenTypographyTokens(obj, prefix) {
  var result = [];
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var val = obj[key];
    var fullKey = prefix ? prefix + '/' + key : key;
    if (val && typeof val === 'object' && ('$value' in val || 'value' in val)) {
      var rawVal = val['$value'] !== undefined ? val['$value'] : val['value'];
      // Only process composite typography tokens (objects with fontSize)
      if (rawVal && typeof rawVal === 'object' && rawVal.fontSize) {
        result.push({
          name: fullKey,
          value: rawVal,
          description: val['$description'] || val['comment'] || ''
        });
      }
    } else if (val && typeof val === 'object') {
      var nested = flattenTypographyTokens(val, fullKey);
      for (var j = 0; j < nested.length; j++) result.push(nested[j]);
    }
  }
  return result;
}

async function pushTextStyles(tokens) {
  log('Creating Text Styles...', 'info');

  var flat = flattenTypographyTokens(tokens, '');
  log('  → ' + flat.length + ' typography tokens found', 'info');

  var existingStyles = await figma.getLocalTextStylesAsync();
  var styleMap = {};
  for (var i = 0; i < existingStyles.length; i++) {
    styleMap[existingStyles[i].name] = existingStyles[i];
  }

  var created = 0, updated = 0, errors = 0;

  for (var i = 0; i < flat.length; i++) {
    var token = flat[i];
    try {
      var fontWeight = String(token.value.fontWeight || '400');
      var fontStyle  = FONT_WEIGHT_MAP[fontWeight] || 'Regular';
      var fontSize   = resolveTypographyRef(token.value.fontSize);
      var lineHeight = parseFloat(token.value.lineHeight) || 1.5;

      // Load font before creating/editing the style
      await figma.loadFontAsync({ family: FONT_FAMILY, style: fontStyle });

      var style = styleMap[token.name];
      if (!style) {
        style = figma.createTextStyle();
        style.name = token.name;
        created++;
      } else {
        updated++;
      }

      style.fontName   = { family: FONT_FAMILY, style: fontStyle };
      style.fontSize   = fontSize;
      style.lineHeight = { unit: 'PERCENT', value: lineHeight * 100 };

      if (token.description) style.description = token.description;

    } catch (e) {
      log('  Error on ' + token.name + ': ' + e.message, 'error');
      errors++;
    }
  }

  log('✓ Text Styles — ' + created + ' created, ' + updated + ' updated, ' + errors + ' errors', 'success');
  figma.ui.postMessage({ type: 'done' });
}

// ─── Shadows / Effect Styles ──────────────────────────────────────────────────

// Resolved from tokens/base/shadows.json globals
var SHADOW_OPACITY = 0.08;
var SHADOW_RGB     = { r: 0, g: 0, b: 0 };

// key + ambient shadow values per elevation level
// Resolved from tokens/base/shadows.json key/ambient arrays
var SHADOW_LAYERS = {
  'xs': {
    key:     { x: 0, y: 1, blur: 4,  spread: 0 },
    ambient: { x: 0, y: 2, blur: 8,  spread: 0 }
  },
  'sm': {
    key:     { x: 0, y: 2, blur: 8,  spread: 0 },
    ambient: { x: 0, y: 3, blur: 12, spread: 0 }
  },
  'md': {
    key:     { x: 0, y: 3, blur: 12, spread: 0 },
    ambient: { x: 0, y: 4, blur: 16, spread: 0 }
  },
  'lg': {
    key:     { x: 0, y: 4, blur: 16, spread: 0 },
    ambient: { x: 0, y: 5, blur: 20, spread: 0 }
  },
  'xl': {
    key:     { x: 0, y: 2, blur: 8,  spread: 0 },
    ambient: { x: 0, y: 6, blur: 24, spread: 0 }
  }
};

// Semantic names from tokens/base/shadows.json preset
var SHADOW_NAMES = {
  'xs': 'shadow/surface',
  'sm': 'shadow/non-modal',
  'md': 'shadow/sticky',
  'lg': 'shadow/non-modal-sticky',
  'xl': 'shadow/modal'
};

// Descriptions from tokens/base/shadows.json preset.$description
var SHADOW_DESCRIPTIONS = {
  'xs': 'Cards, panels — surface level elements',
  'sm': 'Non-modal elements',
  'md': 'Sticky elements',
  'lg': 'Non-modal elements on sticky surfaces',
  'xl': 'Modal elements'
};

async function pushEffectStyles() {
  log('Creating Effect Styles...', 'info');

  var existingStyles = await figma.getLocalEffectStylesAsync();
  var styleMap = {};
  for (var i = 0; i < existingStyles.length; i++) {
    styleMap[existingStyles[i].name] = existingStyles[i];
  }

  var created = 0, updated = 0, errors = 0;
  var levels = Object.keys(SHADOW_LAYERS);

  for (var i = 0; i < levels.length; i++) {
    var level     = levels[i];
    var layers    = SHADOW_LAYERS[level];
    var styleName = SHADOW_NAMES[level];

    try {
      var style = styleMap[styleName];
      if (!style) {
        style = figma.createEffectStyle();
        style.name = styleName;
        style.description = SHADOW_DESCRIPTIONS[level] || '';
        created++;
      } else {
        style.description = SHADOW_DESCRIPTIONS[level] || '';
        updated++;
      }

      style.effects = [
        {
          type:      'DROP_SHADOW',
          color:     { r: SHADOW_RGB.r, g: SHADOW_RGB.g, b: SHADOW_RGB.b, a: SHADOW_OPACITY },
          offset:    { x: layers.key.x, y: layers.key.y },
          radius:    layers.key.blur,
          spread:    layers.key.spread,
          visible:   true,
          blendMode: 'NORMAL'
        },
        {
          type:      'DROP_SHADOW',
          color:     { r: SHADOW_RGB.r, g: SHADOW_RGB.g, b: SHADOW_RGB.b, a: SHADOW_OPACITY },
          offset:    { x: layers.ambient.x, y: layers.ambient.y },
          radius:    layers.ambient.blur,
          spread:    layers.ambient.spread,
          visible:   true,
          blendMode: 'NORMAL'
        }
      ];

    } catch (e) {
      log('  Error on ' + styleName + ': ' + e.message, 'error');
      errors++;
    }
  }

  log('✓ Effect Styles — ' + created + ' created, ' + updated + ' updated, ' + errors + ' errors', 'success');
  figma.ui.postMessage({ type: 'done' });
}

// ─── Diff check ──────────────────────────────────────────────────────────────

async function checkDiff(collections, typographyTokens) {
  var variablesMissing = 0;

  // Check variables: count tokens missing from Figma
  var existingVars = await figma.variables.getLocalVariablesAsync();
  var existingVarNames = {};
  for (var i = 0; i < existingVars.length; i++) {
    existingVarNames[existingVars[i].name] = true;
  }

  for (var c = 0; c < collections.length; c++) {
    var flat = flattenTokens(collections[c].tokens, '');
    for (var i = 0; i < flat.length; i++) {
      if (!existingVarNames[flat[i].name]) variablesMissing++;
    }
  }

  // Check text styles: count tokens missing from Figma
  var existingTextStyles = await figma.getLocalTextStylesAsync();
  var existingTextNames = {};
  for (var i = 0; i < existingTextStyles.length; i++) {
    existingTextNames[existingTextStyles[i].name] = true;
  }

  var flatTypo = flattenTypographyTokens(typographyTokens, '');
  var textMissing = 0;
  for (var i = 0; i < flatTypo.length; i++) {
    if (!existingTextNames[flatTypo[i].name]) textMissing++;
  }

  // Check effect styles: count shadow presets missing from Figma
  var existingEffectStyles = await figma.getLocalEffectStylesAsync();
  var existingEffectNames = {};
  for (var i = 0; i < existingEffectStyles.length; i++) {
    existingEffectNames[existingEffectStyles[i].name] = true;
  }

  var shadowMissing = 0;
  var shadowLevels = Object.keys(SHADOW_NAMES);
  for (var i = 0; i < shadowLevels.length; i++) {
    if (!existingEffectNames[SHADOW_NAMES[shadowLevels[i]]]) shadowMissing++;
  }

  figma.ui.postMessage({
    type: 'diff',
    variables: variablesMissing,
    styles: textMissing + shadowMissing
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────────

figma.showUI(__html__, { width: 400, height: 560 });

figma.ui.onmessage = async function(msg) {
  if (msg.type === 'ready')            await checkDiff(msg.collections, msg.typographyTokens);
  if (msg.type === 'push-all')         await pushAll(msg.collections);
  if (msg.type === 'push-text-styles') await pushTextStyles(msg.tokens);
  if (msg.type === 'push-shadows')     await pushEffectStyles();
};