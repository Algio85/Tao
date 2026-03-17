import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TOKEN_FILES = [
  { file: 'tokens/base/shades.json',       collection: 'Colors/Shades',     description: 'All 16 shades per palette + brand tokens' },
  { file: 'tokens/base/spacing.json',      collection: 'Spacing',           description: 'Spacing scale — 8 steps' },
  { file: 'tokens/base/borders.json',      collection: 'Borders',           description: 'Border radius and border width' },
  { file: 'tokens/base/typography.json',   collection: 'Typography',        description: 'Type scale — size and config' },
  { file: 'tokens/base/opacity.json',      collection: 'Opacity',           description: 'Opacity scale — 10 steps' },
  { file: 'tokens/base/motion.json',       collection: 'Motion',            description: 'Duration and easing tokens' },
  { file: 'tokens/base/elevation.json',    collection: 'Elevation',         description: 'Z-index scale' },
  { file: 'tokens/semantic/surfaces.json', collection: 'Semantic/Surfaces', description: 'Surface color tokens' },
  { file: 'tokens/semantic/text.json',     collection: 'Semantic/Text',     description: 'Text color tokens' },
  { file: 'tokens/semantic/borders.json',  collection: 'Semantic/Borders',  description: 'Border color tokens' },
  { file: 'tokens/semantic/states.json',   collection: 'Semantic/States',   description: 'Interactive state tokens' },
];

const bundle = TOKEN_FILES.map(({ file, collection, description }) => {
  const filePath = path.join(__dirname, '..', file);
  const tokens = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return { file, collection, description, tokens };
});

const output = `var TOKEN_BUNDLE = ${JSON.stringify(bundle, null, 2)};`;
const outPath = path.join(__dirname, '..', 'figma-plugin', 'tokens-bundle.js');
fs.writeFileSync(outPath, output);
console.log('✅ Plugin bundle generated → figma-plugin/tokens-bundle.js');