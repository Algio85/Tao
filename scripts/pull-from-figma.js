import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const FIGMA_TOKEN    = process.env.FIGMA_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY;

if (!FIGMA_TOKEN || !FIGMA_FILE_KEY) {
  console.error('Missing FIGMA_TOKEN or FIGMA_FILE_KEY in environment');
  process.exit(1);
}

const BASE_URL = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/variables/local`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rgbaToOklch({ r, g, b, a }) {
  // Simple RGB → hex conversion for now
  const toHex = v => Math.round(v * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function setNested(obj, path, value) {
  const keys = path.split('/');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) current[keys[i]] = {};
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
}

function figmaTypeToW3c(type) {
  switch (type) {
    case 'COLOR':  return 'color';
    case 'FLOAT':  return 'number';
    case 'STRING': return 'string';
    case 'BOOLEAN': return 'boolean';
    default: return 'string';
  }
}

// ─── Pull from Figma ──────────────────────────────────────────────────────────

async function pull() {
  const response = await fetch(BASE_URL, {
    headers: { 'X-Figma-Token': FIGMA_TOKEN },
  });

  if (!response.ok) {
    console.error('Error pulling from Figma:', await response.json());
    process.exit(1);
  }

  const data = await response.json();
  const { variables, variableCollections } = data.meta;

  // Build collection name map
  const collectionNames = {};
  for (const [id, col] of Object.entries(variableCollections)) {
    collectionNames[id] = col.name;
  }

  // Group variables by collection
  const byCollection = {};
  for (const [, variable] of Object.entries(variables)) {
    const colName = collectionNames[variable.variableCollectionId] ?? 'unknown';
    if (!byCollection[colName]) byCollection[colName] = {};

    // Get the default mode value
    const modeId = Object.keys(variable.valuesByMode)[0];
    const raw = variable.valuesByMode[modeId];

    let value;
    if (variable.resolvedType === 'COLOR' && raw && typeof raw === 'object' && 'r' in raw) {
      value = rgbaToOklch(raw);
    } else {
      value = raw;
    }

    setNested(byCollection[colName], variable.name, {
      '$value': value,
      '$type': figmaTypeToW3c(variable.resolvedType),
    });
  }

  // Write each collection to a JSON file
  const outputDir = path.join(__dirname, '..', 'tokens', 'figma');
  fs.mkdirSync(outputDir, { recursive: true });

  for (const [colName, tokens] of Object.entries(byCollection)) {
    const fileName = colName.replace(/\//g, '-').replace(/\s+/g, '-').toLowerCase() + '.json';
    const filePath = path.join(outputDir, fileName);
    fs.writeFileSync(filePath, JSON.stringify(tokens, null, 2));
    console.log(`✓ Written ${filePath}`);
  }

  console.log(`\n✓ Pull complete — ${Object.keys(byCollection).length} collections written to tokens/figma/`);
}

pull();