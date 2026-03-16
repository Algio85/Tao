import React from 'react';
import { MotionTokens } from '../components/MotionTokens';

const meta = {
  title: 'Foundations / Motion',
  component: MotionTokens,
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
Motion tokens define the timing and easing of animations and transitions.

---

### Duration

| Token | Value | Use case |
|---|---|---|
| \`duration.instant\` | 0ms | No animation, immediate feedback |
| \`duration.fast\` | 100ms | Small UI elements, tooltips, badges |
| \`duration.normal\` | 200ms | Default transitions, buttons, inputs |
| \`duration.slow\` | 300ms | Modals, drawers, panels |
| \`duration.slower\` | 500ms | Page transitions, complex animations |

### Easing

| Token | Value | Use case |
|---|---|---|
| \`easing.linear\` | linear | Progress bars, loading indicators |
| \`easing.ease-in\` | cubic-bezier(0.4, 0, 1, 1) | Elements leaving the screen |
| \`easing.ease-out\` | cubic-bezier(0, 0, 0.2, 1) | Elements entering the screen |
| \`easing.ease-in-out\` | cubic-bezier(0.4, 0, 0.2, 1) | Elements moving within the screen |
| \`easing.spring\` | cubic-bezier(0.34, 1.56, 0.64, 1) | Playful, bouncy interactions |

---

### Usage

\`\`\`css
/* Default transition */
transition: all var(--tao-duration-normal) var(--tao-easing-ease-out);

/* Modal entrance */
transition: transform var(--tao-duration-slow) var(--tao-easing-ease-out);

/* Button hover */
transition: background var(--tao-duration-fast) var(--tao-easing-ease-in-out);
\`\`\`

Click **Play** to preview each duration and easing curve. Click any row to copy the token name.
        `.trim(),
      },
    },
  },
};

export default meta;

export const Default = {
  name: 'Motion Tokens',
};