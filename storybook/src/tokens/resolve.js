import defaultShades from './shades.json';

export function resolveReference(ref, primitives = null) {
  if (typeof ref !== 'string') return ref;
  const match = ref.match(/^\{(.+)\}$/);
  if (!match) return ref;
  const path = match[1].split('.');
  let node = primitives ?? defaultShades;
  for (const key of path) {
    if (node === undefined || node === null) return ref;
    node = node[key];
  }
  if (node && typeof node === 'object' && 'value' in node) return node.value;
  return node ?? ref;
}

export function resolveTokens(semanticTokens, prefix = '', primitives = null) {
  const result = {};
  for (const [key, val] of Object.entries(semanticTokens)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (val && typeof val === 'object' && 'value' in val) {
      result[fullKey] = resolveReference(val.value, primitives);
    } else if (val && typeof val === 'object') {
      Object.assign(result, resolveTokens(val, fullKey, primitives));
    }
  }
  return result;
}