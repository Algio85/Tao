import React from 'react';
import { BorderTokens } from '../components/BorderTokens';

const meta = {
  title: 'Design System / Borders',
  component: BorderTokens,
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
Border tokens cover two categories: **radius** and **width**.

---

### Border Radius

8 steps from sharp to fully circular.

| Token | Value | Use case |
|---|---|---|
| \`radius.none\` | 0px | Tables, code blocks, sharp UI |
| \`radius.xs\` | 2px | Badges, tags, subtle rounding |
| \`radius.sm\` | 4px | Inputs, small buttons |
| \`radius.md\` | 8px | Cards, dropdowns, modals |
| \`radius.lg\` | 16px | Large cards, panels |
| \`radius.xl\` | 24px | Bottom sheets, large modals |
| \`radius.circular\` | 100px | Square elements → circles (avatars, icon buttons) |
| \`radius.pill\` | 100px | Rectangular elements → fully rounded (chips, buttons) |

Note: \`circular\` and \`pill\` share the same value but carry different semantic intent.

---

### Border Width

4 steps from hairline to thick.

| Token | Value | Use case |
|---|---|---|
| \`border.width.sm\` | 1px | Default borders, dividers |
| \`border.width.md\` | 2px | Focus rings, active states |
| \`border.width.lg\` | 4px | Thick accents, highlights |
| \`border.width.xl\` | 8px | Decorative, illustration borders |

Click any row to copy the token name to clipboard.
        `.trim(),
      },
    },
  },
};

export default meta;

export const Default = {
  name: 'Border Tokens',
};