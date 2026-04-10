import React from 'react';
import { BorderColors } from '../components/BorderColors';

const meta = {
  title: 'Foundations / Borders / Border Colors',
  component: BorderColors,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f5f5f5' },
        { name: 'dark',  value: '#0f0f0f' },
      ],
    },
    docs: {
      description: {
        component: `
Semantic border color tokens for the design system.

---

### Neutral borders

| Token | Shade | Use case |
|---|---|---|
| \`border.default\` | palette-11.5 | Default borders, inputs |
| \`border.subtle\` | palette-11.4 | Subtle dividers, separators |
| \`border.strong\` | palette-11.7 | Strong borders, emphasis |
| \`border.focus\` | palette-1.8 | Focus rings, keyboard navigation |
| \`border.inverse\` | palette-11.1 | Borders on dark/inverted backgrounds |

### Role-based borders

| Token | Palette | Use case |
|---|---|---|
| \`border.brand-1\` | palette-1 | Brand 1 bordered elements |
| \`border.brand-2\` | palette-2 | Brand 2 bordered elements |
| \`border.brand-3\` | palette-3 | Brand 3 bordered elements |
| \`border.success\` | palette-8 | Success states, valid inputs |
| \`border.danger\` | palette-5 | Error states, invalid inputs |
| \`border.alert\` | palette-6 | Warning states |
| \`border.info\` | palette-7 | Info states |
| \`border.news\` | palette-9 | News bordered elements |
| \`border.ai\` | palette-10 | AI content borders |

---

### Updating border colors

Border tokens reference palette shades directly. If you change the base colors:

1. Go to **Foundations / Colors / Color Palette**
2. Change the base color using the color pickers
3. Click **Update tokens**
4. Border colors will update automatically

To make changes permanent:

1. Edit \`tokens/base/colors.json\` with the new hex values
2. Run \`npm run generate-shades\`
3. Copy: \`cp tokens/base/shades.json storybook/src/tokens/shades.json\`

Click any row to copy the token name to clipboard.
        `.trim(),
      },
    },
  },
};

export default meta;

export const Default = {
  name: 'Border Colors',
};