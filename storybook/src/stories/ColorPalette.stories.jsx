import React from 'react';
import { ColorPalette } from '../components/ColorPalette';
import shadesTokens from '../tokens/shades.json';

const ALL_COLORS = Object.keys(shadesTokens.color.shade);

// ─── Meta ─────────────────────────────────────────────────────────────────────

/**
 * @type {import('@storybook/react').Meta<typeof ColorPalette>}
 */
const meta = {
  title: 'Design System / Color Palette',
  component: ColorPalette,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark',  value: '#0f0f0f' },
        { name: 'light', value: '#ffffff' },
      ],
    },
    docs: {
        description: {
          component: `
    Full design system color palette.
    
    Each hue has **16 OKLCH shades** (1 = nearest white, 16 = nearest black).
    Chroma follows a natural curve — peak at mid-range, compressed at extremes.
    Base colors are editable live — use the color pickers at the top to update all shades in real time.
    
    ---
    
    ### Contrast — APCA vs WCAG
    
    Contrast is measured using **APCA (Accessible Perceptual Contrast Algorithm)**, not WCAG 2.x.
    
    WCAG 2.x uses a simple luminance ratio that is inconsistent across hues — a yellow and a blue at the same OKLCH lightness will report very different contrast ratios against white, even though they appear equally light to the human eye.
    
    APCA models how the visual cortex actually perceives contrast. It accounts for spatial frequency, polarity (light-on-dark vs dark-on-light), and the non-linear response of human vision. The result is **Lc (Lightness Contrast)** — a signed value where polarity matters.
    
    **APCA thresholds used here:**
    
    | Lc (absolute) | Use case |
    |---|---|
    | 75+ | Body text, small UI labels |
    | 60+ | Large text, navigation, UI components |
    | 45+ | Large bold text, icons, non-text elements |
    | 30+ | Placeholder text, decorative elements |
    | < 30 | Insufficient for any meaningful use |
    
    Each swatch shows Lc vs ⬜ white and ⬛ black independently, so you can immediately see which background a shade works on.
    
    ---
    
    ### Tokens
    
    - **\`color.shade.<name>.<1-16>\`** — OKLCH shade values, ready for CSS custom properties
    - **\`color.brand.<name>\`** — exact original hex, outside the shade scale. Use only for specific brand moments (logo, brand illustrations), not for UI scale.
    
    Click any swatch to copy the token name to clipboard.
          `.trim(),
        },
    },
  },
  argTypes: {
    colors: {
      control: 'check',
      options: ALL_COLORS,
      description: 'Which color ramps to display',
      table: {
        type: { summary: 'string[]' },
        defaultValue: { summary: 'all' },
      },
    },
    showBrandToken: {
      control: 'boolean',
      description: 'Show the brand token row below each ramp',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
  },
};

export default meta;

// ─── Stories ──────────────────────────────────────────────────────────────────

/**
 * Full palette — all color ramps with brand tokens.
 */
export const FullPalette = {
  name: 'Full Palette',
  args: {
    colors: ALL_COLORS,
    showBrandToken: true,
  },
};

/**
 * Only cool-toned hues.
 */
export const CoolHues = {
  name: 'Cool Hues',
  args: {
    colors: ['blue', 'indigo', 'violet', 'cyan', 'teal'],
    showBrandToken: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Blue-family hues only — useful for UI state colors (info, link, focus).',
      },
    },
  },
};

/**
 * Warm + accent hues.
 */
export const WarmHues = {
  name: 'Warm Hues',
  args: {
    colors: ['red', 'orange', 'amber', 'pink'],
    showBrandToken: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Warm hues — useful for error, warning, and alert states.',
      },
    },
  },
};

/**
 * Shades only — no brand token rows.
 */
export const ShadesOnly = {
  name: 'Shades Only',
  args: {
    colors: ALL_COLORS,
    showBrandToken: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'All ramps without the brand token row — compact view.',
      },
    },
  },
};

/**
 * Single color — useful for deep inspection.
 */
export const SingleColor = {
  name: 'Single Color',
  args: {
    colors: ['blue'],
    showBrandToken: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Isolated single ramp. Use the **colors** control to switch.',
      },
    },
  },
  argTypes: {
    colors: {
      control: 'check',
      options: ALL_COLORS,
    },
  },
};
