import { resolveTokens } from './resolve.js';
import textTokens from './semantic/text.json';
import surfaceTokens from './semantic/surfaces.json';
import shades from './shades.json';

const text    = resolveTokens(textTokens,    '', shades);
const surface = resolveTokens(surfaceTokens, '', shades);

const SPACING = {
  xxs:  4,
  xs:   8,
  sm:   12,
  md:   16,
  lg:   24,
  xl:   32,
  xxl:  48,
  xxxl: 64,
};

export const theme = {
  bg: {
    page:    surface['surface.neutral.subtlest'],
    surface: surface['surface.neutral.subtle'],
    raised:  surface['surface.neutral.subtlest'],
    sunken:  surface['surface.neutral.default'],
    hover:   surface['surface.neutral.subtle'],
    active:  surface['surface.neutral.default'],
  },

  text: {
    default:  text['text.default'],
    subtle:   text['text.subtle'],
    subtlest: text['text.subtlest'],
    inverse:  text['text.inverse'],
  },

  border: {
    default: surface['surface.neutral.bold'],
    subtle:  surface['surface.neutral.default'],
  },

  accent: {
    default: text['text.brand-1'],
  },

  spacing: SPACING,

  font: "'DM Sans', system-ui, sans-serif",
};