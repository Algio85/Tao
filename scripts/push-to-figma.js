import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const FIGMA_TOKEN   = process.env.FIGMA_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY;

if (!FIGMA_TOKEN || !FIGMA_FILE_KEY) {
  console.error('Missing FIGMA_TOKEN or FIGMA_FILE_KEY in environment');
  process.exit(1);
}

const BASE_URL = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/variables`;

// ─── Load token files ─────────────────────────────────────────────────────────

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '..', filePath), 'utf8'));
}

const shades    = loadJson('tokens/base/shades.json');
const spacing   = loadJson('tokens/base/spacing.json');
const borders   = loadJson('tokens/base/borders.json');
const typography = loadJson('tokens/base/typography.json');
const opacity   = loadJson('tokens/base/opacity.json');
const motion    = loadJson('tokens/base/motion.json');
const elevation = loadJson('tokens/base/elevation.json');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function oklchToHex(oklch) {
  // For now return a placeholder — full OKLCH→hex conversion is done at build time
  return oklch;
}

function flattenTokens(obj, prefix = '') {
  const result = [];
  for (const [key, val] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}/${key}` : key;
    if (val && typeof val === 'object' && '$value' in val) {
      result.push({ name: fullKey, value: val.$value, type: val.$type });
    } else if (val && typeof val === 'object') {
      result.push(...flattenTokens(val, fullKey));
    }
  }
  return result;
}

// ─── Build variable payload ───────────────────────────────────────────────────

function buildPayload(collections) {
  const variableCollections = [];
  const variables = [];
  const variableModeValues = [];

  for (const { name, tokens, type } of collections) {
    const collectionId = `collection_${name}`;
    const modeId = `mode_${name}_default`;

    variableCollections.push({
      action: 'CREATE',
      id: collectionId,
      name,
      initialModeId: modeId,
    });

    for (const token of tokens) {
      const variableId = `var_${name}_${token.name.replace(/\//g, '_')}`;
      const resolvedType = type ?? (
        token.type === 'color' ? 'COLOR' :
        token.type === 'spacing' || token.type === 'dimension' || token.type === 'borderRadius' || token.type === 'borderWidth' ? 'FLOAT' :
        token.type === 'number' ? 'FLOAT' :
        token.type === 'duration' ? 'STRING' :
        token.type === 'cubicBezier' ? 'STRING' :
        'STRING'
      );

      variables.push({
        action: 'CREATE',
        id: variableId,
        name: token.name,
        variableCollectionId: collectionId,
        resolvedType,
      });

      let value = token.value;
      if (resolvedType === 'FLOAT' && typeof value === 'string') {
        value = parseFloat(value.replace('px', '').replace('ms', '').replace('%', ''));
      }

      variableModeValues.push({
        action: 'CREATE',
        variableId,
        modeId,
        value: resolvedType === 'COLOR' ? { r: 0, g: 0, b: 0, a: 1 } : value,
      });
    }
  }

  return { variableCollections, variables, variableModeValues };
}

// ─── Push to Figma ────────────────────────────────────────────────────────────

async function push() {
  const collections = [
    { name: 'Colors/Shades',    tokens: flattenTokens(shades.color.shade) },
    { name: 'Colors/Brand',     tokens: flattenTokens(shades.color.brand) },
    { name: 'Spacing',          tokens: flattenTokens(spacing) },
    { name: 'Typography',       tokens: flattenTokens(typography) },
    { name: 'Borders/Radius',   tokens: flattenTokens({ radius: borders.radius }) },
    { name: 'Borders/Width',    tokens: flattenTokens({ border: borders.border }) },
    { name: 'Opacity',          tokens: flattenTokens(opacity) },
    { name: 'Motion/Duration',  tokens: flattenTokens({ duration: motion.duration }) },
    { name: 'Motion/Easing',    tokens: flattenTokens({ easing: motion.easing }) },
    { name: 'Elevation',        tokens: flattenTokens(elevation) },
  ];

  const payload = buildPayload(collections);

  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'X-Figma-Token': FIGMA_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error('Error pushing to Figma:', result);
    process.exit(1);
  }

  console.log('✓ Tokens pushed to Figma successfully');
  console.log(`  ${payload.variables.length} variables across ${payload.variableCollections.length} collections`);
}

push();