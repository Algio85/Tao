import React from 'react';
import { IconColors } from '../components/IconColors';

const meta = {
  title: 'Foundations / Colors / Icon Colors',
  component: IconColors,
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
Semantic icon color tokens for the Tao design system.

Icons have their own dedicated token layer — \`icon.*\` — which aliases the \`text.*\` tokens. This keeps icon and text colors in sync by default while allowing them to be overridden independently in the future.

---

### Usage

\`\`\`jsx
import { WarningIcon } from '@phosphor-icons/react';

// Via CSS custom property
<WarningIcon size={20} weight="fill" color="var(--tao-icon-danger)" />

// Via currentColor
<span style={{ color: 'var(--tao-icon-danger)' }}>
  <WarningIcon size={20} weight="fill" color="currentColor" />
</span>
\`\`\`

### Token reference

| Token | Aliases | Use case |
|---|---|---|
| \`icon.default\` | \`text.default\` | Primary icons, default state |
| \`icon.subtle\` | \`text.subtle\` | Secondary icons, supporting UI |
| \`icon.subtlest\` | \`text.subtlest\` | Placeholder, disabled icons |
| \`icon.inverse\` | \`text.inverse\` | Icons on dark backgrounds |
| \`icon.brand-1\` | \`text.brand-1\` | Brand 1 colored icons |
| \`icon.brand-2\` | \`text.brand-2\` | Brand 2 colored icons |
| \`icon.brand-3\` | \`text.brand-3\` | Brand 3 colored icons |
| \`icon.success\` | \`text.success\` | Success state icons |
| \`icon.danger\` | \`text.danger\` | Error / destructive icons |
| \`icon.alert\` | \`text.alert\` | Warning icons |
| \`icon.info\` | \`text.info\` | Info icons |
| \`icon.news\` | \`text.news\` | News icons |
| \`icon.ai\` | \`text.ai\` | AI content icons |

Toggle weight per row to preview how regular, bold, and fill weights read across each color.

Click any token name to copy it to clipboard.
        `.trim(),
      },
    },
  },
};

export default meta;

export const Default = {
  name: 'Icon Colors',
};
