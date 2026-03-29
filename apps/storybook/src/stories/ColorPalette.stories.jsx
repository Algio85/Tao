import React from 'react';
import { useGlobals } from '@storybook/preview-api';
import { ColorPalette } from '../components/ColorPalette';
import shadesTokens from '../tokens/shades.json';

const ALL_COLORS = Object.keys(shadesTokens.color.shade);

const meta = {
  title: 'Foundations / Colors / Color Palette',
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

Each palette has **16 OKLCH shades** (1 = nearest white, 16 = nearest black).
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

- **\`color.shade.<palette>.<1-16>\`** — OKLCH shade values, ready for CSS custom properties
- **\`color.brand.<palette>\`** — exact original hex, outside the shade scale. Use only for specific brand moments (logo, brand illustrations), not for UI.

Click any swatch to copy the token name to clipboard.
        `.trim(),
      },
    },
  },
  argTypes: {
    colors: {
      control: 'check',
      options: ALL_COLORS,
      description: 'Which palettes to display',
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

export const FullPalette = {
  name: 'Full Palette',
  render: (args) => {
    const [, updateGlobals] = useGlobals();
    return (
      <ColorPalette
        {...args}
        onColorChange={(name, hex) => updateGlobals({ [name]: hex })}
      />
    );
  },
  args: {
    colors: ALL_COLORS,
    showBrandToken: true,
  },
};