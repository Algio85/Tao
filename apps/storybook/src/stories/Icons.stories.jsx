import React from 'react';
import { useGlobals } from '@storybook/preview-api';
import { IconGallery } from '../components/IconGallery';

const meta = {
  title: 'Foundations / Icons',
  component: IconGallery,
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
Icon library for the Tao design system, powered by [Phosphor Icons](https://phosphoricons.com).

~1300 icons across 6 weights. All icons are React components from \`@phosphor-icons/react\`.

---

### Usage

\`\`\`bash
npm install @phosphor-icons/react
\`\`\`

\`\`\`jsx
import { ArrowRight, Warning, Check } from '@phosphor-icons/react';

// Basic usage
<ArrowRight size={24} />

// With weight
<ArrowRight size={24} weight="bold" />

// With color
<ArrowRight size={24} weight="fill" color="currentColor" />
\`\`\`

### Weights

| Weight | Description |
|---|---|
| \`thin\` | Lightest, decorative |
| \`light\` | Subtle UI icons |
| \`regular\` | Default — most use cases |
| \`bold\` | High emphasis, small sizes |
| \`fill\` | Solid, high contrast |
| \`duotone\` | Two-tone, decorative |

### With Tao components

Pass any Phosphor icon as \`iconLeft\` or \`iconRight\` on Button, or \`icon\` on Badge Status:

\`\`\`jsx
import { ArrowRight, Warning } from '@phosphor-icons/react';

<Button variant="primary" size="md" iconRight={<ArrowRight size={16} />}>
  Continue
</Button>
\`\`\`

### In Figma

Icons are available via the [Phosphor Icons Figma plugin](https://www.figma.com/community/plugin/898620911119764089/phosphor-icons).
Once on canvas, use instance swap on Button and Badge Status icon slots to swap between icons.

Click any icon to copy its import statement to clipboard.
        `.trim(),
      },
    },
  },
};

export default meta;

export const Default = {
  name: 'Icon Gallery',
  render: () => {
    const [globals, updateGlobals] = useGlobals();
    return (
      <IconGallery
        weight={globals.iconWeight || 'regular'}
        onWeightChange={(w) => updateGlobals({ iconWeight: w })}
      />
    );
  },
};