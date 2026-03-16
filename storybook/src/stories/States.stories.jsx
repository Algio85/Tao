import React from 'react';
import { StateTokens } from '../components/StateTokens';

const meta = {
  title: 'Foundations / States',
  component: StateTokens,
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
Semantic tokens for interactive states — hover, active, selected, focus, and disabled.

---

### States

| Token | Use case |
|---|---|
| \`state.hover\` | Background on mouse hover |
| \`state.active\` | Background on press/click |
| \`state.selected\` | Background for selected items |
| \`state.focus\` | Focus ring color for keyboard navigation |
| \`state.disabled.bg\` | Background for disabled elements |
| \`state.disabled.text\` | Text color for disabled elements |
| \`state.disabled.border\` | Border color for disabled elements |

---

### Usage

\`\`\`css
/* Hover */
background: var(--tao-state-hover);

/* Focus ring */
outline: 2px solid var(--tao-state-focus);
outline-offset: 2px;

/* Disabled */
background: var(--tao-state-disabled-bg);
color: var(--tao-state-disabled-text);
border-color: var(--tao-state-disabled-border);
pointer-events: none;
\`\`\`

Click any row to copy the token name to clipboard.
        `.trim(),
      },
    },
  },
};

export default meta;

export const Default = {
  name: 'Interactive States',
};