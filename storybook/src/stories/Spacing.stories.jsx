import React from 'react';
import { SpacingScale } from '../components/SpacingScale';

const meta = {
  title: 'Foundations / Spacing',
  component: SpacingScale,
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
Spacing scale for the design system.

8 steps based on a 4px grid. Each token maps to a CSS custom property:

| Token | px | rem | CSS |
|---|---|---|---|
| \`spacing.xxs\`  | 4px  | 0.25rem | \`--tao-spacing-xxs\` |
| \`spacing.xs\`   | 8px  | 0.5rem  | \`--tao-spacing-xs\` |
| \`spacing.sm\`   | 12px | 0.75rem | \`--tao-spacing-sm\` |
| \`spacing.md\`   | 16px | 1rem    | \`--tao-spacing-md\` |
| \`spacing.lg\`   | 24px | 1.5rem  | \`--tao-spacing-lg\` |
| \`spacing.xl\`   | 32px | 2rem    | \`--tao-spacing-xl\` |
| \`spacing.xxl\`  | 48px | 3rem    | \`--tao-spacing-xxl\` |
| \`spacing.xxxl\` | 64px | 4rem    | \`--tao-spacing-xxxl\` |

---

### Density

Spacing tokens are index-based — each token occupies a position on the scale. Density shifts every token by a fixed number of steps without changing the token name or the base value.

| Density | Step shift | Example: \`spacing.md\` (index 3) |
|---|---|---|
| Comfortable | 0 | 16px (unchanged) |
| Compact | −1 | 12px (one step down) |
| Dense | −2 | 8px (two steps down) |

This means components always reference the same token — \`spacing.md\` — and the rendered value adapts automatically based on the density context. Typography and border tokens are not affected by density.

Use the **Density** toolbar at the top of the canvas to see the scale shift live.

Click any row to copy the token name to clipboard.
`.trim(),
      },
    },
  },
};

export default meta;

export const Default = {
  name: 'Spacing Scale',
};