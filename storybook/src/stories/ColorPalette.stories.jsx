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
        { name: 'dark', value: '#0f0f0f' },
        { name: 'light', value: '#ffffff' },
      ],
    },
    docs: {
      description: {
        component: `
Full design system color palette.

Each hue has **16 OKLCH shades** (1 = nearest white, 16 = nearest black).
Chroma follows a natural curve — peak at mid-range, compressed at extremes.

Each shade shows:
- WCAG contrast ratio vs ⬜ white and ⬛ black
- WCAG level badge (AAA / AA / AA Large / Fail)
- Click swatch or shade number to **copy the token name**

The **brand token** \`color.brand.<name>\` is the exact original hex color,
kept outside the shade scale for moments that require the precise brand color.
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
