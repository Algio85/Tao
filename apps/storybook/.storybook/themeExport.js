/**
 * themeExport.js
 * Generates platform-specific token output from a Tao theme config.
 * Used by the Themes toolbar in manager.js.
 */

/* ─── OKLCH colour math (mirrors themeEngine.js) ────────────────────────────── */

function hexToLinear(c) {
  c = c / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function linearToOklab(r, g, b) {
  const l = 0.4122214708*r + 0.5363325363*g + 0.0514459929*b;
  const m = 0.2119034982*r + 0.6806995451*g + 0.1073969566*b;
  const s = 0.0883024619*r + 0.2817188376*g + 0.6299787005*b;
  const l_ = Math.cbrt(l), m_ = Math.cbrt(m), s_ = Math.cbrt(s);
  return [
    0.2104542553*l_ + 0.7936177850*m_ - 0.0040720468*s_,
    1.9779984951*l_ - 2.4285922050*m_ + 0.4505937099*s_,
    0.0259040371*l_ + 0.7827717662*m_ - 0.8086757660*s_,
  ];
}

function hexToOklch(hex) {
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return null;
  const r = hexToLinear(parseInt(hex.slice(1,3),16));
  const g = hexToLinear(parseInt(hex.slice(3,5),16));
  const b = hexToLinear(parseInt(hex.slice(5,7),16));
  const [L, a, bk] = linearToOklab(r,g,b);
  const C = Math.sqrt(a*a + bk*bk);
  const H = ((Math.atan2(bk,a)*180/Math.PI)+360)%360;
  return {L,C,H};
}

function oklchToHex(L,C,H) {
  const hRad = H*Math.PI/180;
  const a = C*Math.cos(hRad), b = C*Math.sin(hRad);
  const l_ = L+0.3963377774*a+0.2158037573*b;
  const m_ = L-0.1055613458*a-0.0638541728*b;
  const s_ = L-0.0894841775*a-1.291485548*b;
  const lc=l_**3, mc=m_**3, sc=s_**3;
  const toSrgb = v => { v=Math.max(0,Math.min(1,v)); return v<=0.0031308?12.92*v:1.055*v**(1/2.4)-0.055; };
  const r = Math.round(toSrgb( 4.0767416621*lc-3.3077115913*mc+0.2309699292*sc)*255);
  const g = Math.round(toSrgb(-1.2684380046*lc+2.6097574011*mc-0.3413193965*sc)*255);
  const bv= Math.round(toSrgb(-0.0041960863*lc-0.7034186147*mc+1.707614701*sc)*255);
  const clamp = v=>Math.max(0,Math.min(255,v));
  const toHex  = v=>clamp(v).toString(16).padStart(2,'0');
  return '#'+toHex(r)+toHex(g)+toHex(bv);
}

function generateShades(baseHex) {
  const oklch = hexToOklch(baseHex);
  if (!oklch) return null;
  const {C,H} = oklch;
  const L_MAX=0.97, L_MIN=0.10;
  const shades = {};
  for (let i=1;i<=16;i++) {
    const t = (i-1)/15;
    const L = L_MAX + t*(L_MIN-L_MAX);
    const chromaScale = 1 - Math.pow(2*t-1,4)*0.5;
    shades[i] = oklchToHex(L, C*chromaScale, H);
  }
  return shades;
}

/* ─── Component tokens ──────────────────────────────────────────────────────── */

/**
 * Component-level CSS custom properties defined by Tao components.
 * These are overridable via inline styles or scoped CSS — not :root globals.
 */
export const COMPONENT_TOKENS = [
  // Button
  { component: 'Button', token: '--tao-button-bg',        globalKey: 'tao-button-bg',        fallback: 'variant default',              description: 'background-color' },
  { component: 'Button', token: '--tao-button-text',      globalKey: 'tao-button-text',      fallback: 'variant default',              description: 'color' },
  { component: 'Button', token: '--tao-button-radius',    globalKey: 'tao-button-radius',    fallback: 'size default',                 description: 'border-radius' },
  { component: 'Button', token: '--tao-button-font-size', globalKey: 'tao-button-font-size', fallback: 'size default',                 description: 'font-size' },
  { component: 'Button', token: '--tao-button-padding-h', globalKey: 'tao-button-padding-h', fallback: 'size default',                 description: 'horizontal padding' },
  { component: 'Button', token: '--tao-button-padding-v', globalKey: 'tao-button-padding-v', fallback: 'size default',                 description: 'vertical padding' },
  { component: 'Button', token: '--tao-button-gap',       globalKey: 'tao-button-gap',       fallback: 'size default',                 description: 'icon ↔ label gap' },
  // BadgeStatus
  { component: 'BadgeStatus', token: '--tao-badge-status-bg',           globalKey: 'tao-badge-status-bg',           fallback: '--tao-surface-*',          description: 'background-color (set by variant class)' },
  { component: 'BadgeStatus', token: '--tao-badge-status-text',         globalKey: 'tao-badge-status-text',         fallback: '--tao-text-*',             description: 'color (set by variant class)' },
  { component: 'BadgeStatus', token: '--tao-badge-status-border-color', globalKey: 'tao-badge-status-border-color', fallback: 'transparent',              description: 'border-color (transparent by default)' },
  { component: 'BadgeStatus', token: '--tao-badge-status-border-width', globalKey: 'tao-badge-status-border-width', fallback: '--tao-border-width-sm',    description: 'border-width' },
  { component: 'BadgeStatus', token: '--tao-badge-status-radius',       globalKey: 'tao-badge-status-radius',       fallback: '--tao-radius-md',          description: 'border-radius' },
  { component: 'BadgeStatus', token: '--tao-badge-status-font-size',    globalKey: 'tao-badge-status-font-size',    fallback: '--tao-typography-size-xs', description: 'font-size' },
  { component: 'BadgeStatus', token: '--tao-badge-status-spacing-gap',  globalKey: 'tao-badge-status-spacing-gap',  fallback: '--tao-spacing-xxs',        description: 'gap between icon and label' },
  { component: 'BadgeStatus', token: '--tao-badge-status-spacing-h',    globalKey: 'tao-badge-status-spacing-h',    fallback: '--tao-spacing-xs',         description: 'horizontal padding' },
  { component: 'BadgeStatus', token: '--tao-badge-status-spacing-v',    globalKey: 'tao-badge-status-spacing-v',    fallback: '--tao-spacing-xxs',        description: 'vertical padding' },
];

/** Global keys for all component token overrides */
export const COMPONENT_GLOBAL_KEYS = COMPONENT_TOKENS.map(t => t.globalKey);

/* ─── Token generators ──────────────────────────────────────────────────────── */

const SIZE_STEPS   = [{key:'xs',step:-2},{key:'sm',step:-1},{key:'md',step:0},{key:'lg',step:1},{key:'xl',step:2},{key:'xxl',step:3},{key:'xxxl',step:4}];
const SPACING_BASE = {xxs:4,xs:8,sm:12,md:16,lg:24,xl:32,xxl:48,xxxl:64};

function resolvedTokens(config) {
  const tokens = {};

  // Palette shades
  Object.entries(config.palette).forEach(([name, hex]) => {
    const shades = generateShades(hex);
    if (!shades) return;
    Object.entries(shades).forEach(([i, h]) => {
      tokens[`color-shade-${name}-${i}`] = h;
    });
  });

  // Type scale
  const base  = parseInt(config.typescaleBase) || 16;
  const ratio = parseFloat(config.typescale)   || 1.2;
  SIZE_STEPS.forEach(({key,step}) => {
    tokens[`typography-size-${key}`] = Math.round(base * Math.pow(ratio, step)) + 'px';
  });

  // Spacing
  const factor = parseFloat(config.density) || 1;
  Object.entries(SPACING_BASE).forEach(([key,val]) => {
    tokens[`spacing-${key}`] = Math.round(val * factor) + 'px';
  });

  // Icon weight
  tokens['icon-weight'] = config.iconWeight || 'regular';

  return tokens;
}

function resolvedComponentTokens(config) {
  if (!config.componentTokens) return {};
  return Object.fromEntries(
    Object.entries(config.componentTokens).filter(([,v]) => v)
  );
}

/* ─── Format generators ─────────────────────────────────────────────────────── */

/** CSS custom property override file — import after base tokens.css */
export function generateCSS(config, appName = 'app') {
  const tokens = resolvedTokens(config);
  const lines  = Object.entries(tokens).map(([k,v]) => `  --tao-${k}: ${v};`);

  // Group component tokens by component name
  const byComponent = COMPONENT_TOKENS.reduce((acc, t) => {
    (acc[t.component] = acc[t.component] || []).push(t);
    return acc;
  }, {});
  const componentLines = Object.entries(byComponent).flatMap(([name, tokens]) => [
    ``,
    `/* ${name} — override per-element via inline style or scoped class */`,
    ...tokens.map(t => `/* ${t.token}: <value>;  — ${t.description} — fallback: ${t.fallback} */`),
  ]);

  const compTokens = resolvedComponentTokens(config);
  const compLines  = Object.entries(compTokens).map(([k,v]) => `  --${k}: ${v};`);

  return [
    `/* Tao token overrides — ${appName} */`,
    `/* Import after @tao/tokens/tokens.css */`,
    `/* Generated: ${new Date().toISOString()} */`,
    ``,
    `:root {`,
    ...lines,
    ...(compLines.length ? [``, `  /* Component token overrides */`, ...compLines] : []),
    `}`,
    ``,
    `/* ─── Component tokens (${COMPONENT_TOKENS.length}) ────────────────────────────────────────────── */`,
    ...componentLines,
    ``,
  ].join('\n');
}

/** Flat design token JSON — feed to Style Dictionary for any platform */
export function generateJSON(config, appName = 'app') {
  const tokens = resolvedTokens(config);
  const out = {
    _meta: {
      name:      appName,
      generated: new Date().toISOString(),
      source:    'Tao Design System — Storybook export',
    },
    config: {
      palette:       config.palette,
      typescale:     config.typescale,
      typescaleBase: config.typescaleBase,
      density:       config.density,
      iconWeight:    config.iconWeight || 'regular',
    },
    tokens: Object.fromEntries(
      Object.entries(tokens).map(([k,v]) => [k, { value: v }])
    ),
    componentTokens: {
      slots: COMPONENT_TOKENS.map(({ component, token, fallback, description }) => ({ component, token, fallback, description })),
      overrides: resolvedComponentTokens(config),
    },
  };
  return JSON.stringify(out, null, 2);
}

/** ES module — for React Native, Electron, Node.js */
export function generateJSModule(config, appName = 'app') {
  const tokens = resolvedTokens(config);
  const entries = Object.entries(tokens)
    .map(([k,v]) => `  '${k}': '${v}',`)
    .join('\n');
  const componentEntries = COMPONENT_TOKENS
    .map(t => `  // ${t.component}: '${t.token}' — ${t.description} (fallback: ${t.fallback})`)
    .join('\n');
  return [
    `// Tao token overrides — ${appName}`,
    `// Generated: ${new Date().toISOString()}`,
    ``,
    `export const tokens = {`,
    entries,
    `};`,
    ``,
    `// Component tokens (${COMPONENT_TOKENS.length}) — override per-element via inline style`,
    `export const componentTokens = [`,
    ...COMPONENT_TOKENS.map(t => `  { component: '${t.component}', token: '${t.token}', fallback: '${t.fallback}' },`),
    `];`,
    ``,
    `export default tokens;`,
    ``,
  ].join('\n');
}

/** Style Dictionary config scaffold — drop in apps/<name>/ */
export function generateSDConfig(appName = 'app') {
  return JSON.stringify({
    source:    [`tao-theme.json`],
    platforms: {
      css: {
        transformGroup: 'css',
        prefix:         'tao',
        buildPath:       `dist/`,
        files: [{ destination: 'tokens.css', format: 'css/variables' }],
      },
      ios: {
        transformGroup: 'ios-swift',
        buildPath:       `dist/ios/`,
        files: [{ destination: 'TaoTokens.swift', format: 'ios-swift/class.swift', className: 'TaoTokens' }],
      },
      android: {
        transformGroup: 'android',
        buildPath:       `dist/android/`,
        files: [{ destination: 'tokens.xml', format: 'android/resources' }],
      },
    },
  }, null, 2);
}

/* ─── File download helper ──────────────────────────────────────────────────── */

export function downloadFile(content, filename, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
