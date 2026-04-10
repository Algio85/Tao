/**
 * tokenOptions.js
 * Reusable semantic token registries for Storybook story controls.
 *
 * Usage in a story argType:
 *   import { surfaceTokenControl, buildTokenStyle } from '../tokens/tokenOptions';
 *
 *   tokenBg: surfaceTokenControl('Override background token'),
 *
 *   render: (args) => (
 *     <Component style={buildTokenStyle({ '--comp-bg': args.tokenBg })} />
 *   )
 */

// ─── Surface tokens ──────────────────────────────────────────────────────────

const SURFACE_ROLES = [
  'brand-1', 'brand-2', 'brand-3',
  'success', 'danger', 'alert', 'info', 'news', 'ai',
];
const SURFACE_SCALES   = ['subtlest', 'subtle', 'default', 'bold', 'strong', 'strongest'];
const NEUTRAL_SCALES   = ['white', 'subtlest', 'subtle', 'default', 'bold', 'strong', 'strongest', 'black'];

export const SURFACE_TOKEN_MAP = {
  ...Object.fromEntries(
    SURFACE_ROLES.flatMap(role =>
      SURFACE_SCALES.map(scale => [
        `surface/${role}/${scale}`,
        `var(--tao-surface-${role}-${scale})`,
      ])
    )
  ),
  ...Object.fromEntries(
    NEUTRAL_SCALES.map(scale => [
      `surface/neutral/${scale}`,
      `var(--tao-surface-neutral-${scale})`,
    ])
  ),
};

// ─── Text tokens ─────────────────────────────────────────────────────────────

const TEXT_ROLES = [
  'default', 'subtle', 'subtlest', 'inverse',
  'brand-1', 'brand-2', 'brand-3',
  'success', 'danger', 'alert', 'info', 'news', 'ai',
];

export const TEXT_TOKEN_MAP = Object.fromEntries(
  TEXT_ROLES.map(role => [`text/${role}`, `var(--tao-text-${role})`])
);

// ─── Border color tokens ─────────────────────────────────────────────────────

const BORDER_ROLES = [
  'default', 'subtle', 'strong', 'focus',
  'brand-1', 'brand-2', 'brand-3',
  'success', 'danger', 'alert', 'info', 'news', 'ai',
];

export const BORDER_TOKEN_MAP = Object.fromEntries(
  BORDER_ROLES.map(role => [`border/${role}`, `var(--tao-border-${role})`])
);

// ─── Border width tokens ─────────────────────────────────────────────────────

export const BORDER_WIDTH_TOKEN_MAP = {
  'border-width/sm': 'var(--tao-border-width-sm)',   // 1px
  'border-width/md': 'var(--tao-border-width-md)',   // 2px
  'border-width/lg': 'var(--tao-border-width-lg)',   // 4px
  'border-width/xl': 'var(--tao-border-width-xl)',   // 8px
};

// ─── Radius tokens ───────────────────────────────────────────────────────────

export const RADIUS_TOKEN_MAP = {
  'radius/xs':       'var(--tao-radius-xs)',
  'radius/sm':       'var(--tao-radius-sm)',
  'radius/md':       'var(--tao-radius-md)',
  'radius/lg':       'var(--tao-radius-lg)',
  'radius/xl':       'var(--tao-radius-xl)',
  'radius/pill':     'var(--tao-radius-pill)',
  'radius/circular': 'var(--tao-radius-circular)',
};

// ─── Spacing tokens ──────────────────────────────────────────────────────────

export const SPACING_TOKEN_MAP = {
  'spacing/xxs':  'var(--tao-spacing-xxs)',   // 4px
  'spacing/xs':   'var(--tao-spacing-xs)',    // 8px
  'spacing/sm':   'var(--tao-spacing-sm)',    // 12px
  'spacing/md':   'var(--tao-spacing-md)',    // 16px
  'spacing/lg':   'var(--tao-spacing-lg)',    // 24px
  'spacing/xl':   'var(--tao-spacing-xl)',    // 32px
  'spacing/xxl':  'var(--tao-spacing-xxl)',   // 48px
  'spacing/xxxl': 'var(--tao-spacing-xxxl)',  // 64px
};

// ─── Font size tokens ─────────────────────────────────────────────────────────

export const FONT_SIZE_TOKEN_MAP = {
  'typography/size/xs':   'var(--tao-typography-size-xs)',
  'typography/size/sm':   'var(--tao-typography-size-sm)',
  'typography/size/md':   'var(--tao-typography-size-md)',
  'typography/size/lg':   'var(--tao-typography-size-lg)',
  'typography/size/xl':   'var(--tao-typography-size-xl)',
  'typography/size/xxl':  'var(--tao-typography-size-xxl)',
  'typography/size/xxxl': 'var(--tao-typography-size-xxxl)',
};

// ─── argType factories ────────────────────────────────────────────────────────

function makeControl(map, description) {
  return {
    control: 'select',
    options: ['', ...Object.keys(map)],
    mapping: { '': undefined, ...map },
    description,
    table: { defaultValue: { summary: '(variant default)' }, category: 'Token overrides' },
  };
}

export const surfaceTokenControl     = (desc = 'Override background token')      => makeControl(SURFACE_TOKEN_MAP,      desc);
export const textTokenControl        = (desc = 'Override text color token')      => makeControl(TEXT_TOKEN_MAP,         desc);
export const borderTokenControl      = (desc = 'Override border color token')    => makeControl(BORDER_TOKEN_MAP,       desc);
export const borderWidthTokenControl = (desc = 'Override border width token')    => makeControl(BORDER_WIDTH_TOKEN_MAP, desc);
export const radiusTokenControl      = (desc = 'Override border radius token')   => makeControl(RADIUS_TOKEN_MAP,       desc);
export const fontSizeTokenControl    = (desc = 'Override font size token')       => makeControl(FONT_SIZE_TOKEN_MAP,    desc);
export const spacingTokenControl     = (desc = 'Override spacing token')         => makeControl(SPACING_TOKEN_MAP,      desc);

// ─── All maps (for resolution) ────────────────────────────────────────────────

export const ALL_TOKEN_MAPS = [
  SURFACE_TOKEN_MAP,
  TEXT_TOKEN_MAP,
  BORDER_TOKEN_MAP,
  BORDER_WIDTH_TOKEN_MAP,
  RADIUS_TOKEN_MAP,
  FONT_SIZE_TOKEN_MAP,
  SPACING_TOKEN_MAP,
];

/**
 * Resolves a Storybook arg value to its CSS var string.
 * Works whether Storybook's mapping has already applied or not.
 *
 * @param {string} value   — raw arg value (e.g. 'spacing/xxs' or 'var(--tao-spacing-xxs)')
 * @param {Object} map     — the token map to look up in
 * @returns {string|undefined}
 */
export function resolveToken(value, map) {
  if (!value) return undefined;
  return map[value] ?? value;
}

// ─── Style builder ────────────────────────────────────────────────────────────

/**
 * Builds an inline style object from token override args.
 * Filters out undefined/empty values so unset controls don't clobber defaults.
 *
 * @param {Object} overrides — { '--comp-bg': args.tokenBg, ... }
 * @returns {Object} React-safe inline style object
 */
export function buildTokenStyle(overrides) {
  return Object.fromEntries(
    Object.entries(overrides).filter(([, v]) => v != null && v !== '')
  );
}
