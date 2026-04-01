import React from 'react';
import { useGlobals } from '@storybook/preview-api';
import { TypographyScale } from '../components/TypographyScale';

const SCROLL_KEY = 'tao-typescale-scroll';

const meta = {
  title: 'Foundations / Typography / Type Scale',
  component: TypographyScale,
  tags: [],
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
Modular type scale generator.

Choose a **base size** (default 16px) and a **ratio** to generate a consistent typographic scale.
All steps are calculated as \`base × ratio^n\` and rounded to the nearest pixel.

### How to use

1. Move the **base size** slider and pick a **ratio** until you're happy with the scale
2. Click **Export tokens.json** — the resolved JSON is copied to your clipboard
3. Paste it into \`tokens/base/typography.json\`
4. Run \`npm run build-tokens\` — StyleDictionary outputs CSS variables with the exact px values you chose

Storybook acts as a visual configurator — you see the scale live, you decide, you export.
The token file is always the source of truth for the build, but you generate it interactively instead of writing numbers by hand.

---

### Available ratios

| Name | Ratio | Best for |
|---|---|---|
| Minor Second | 1.067 | Dense UIs, data-heavy interfaces |
| Major Second | 1.125 | Compact editorial, dashboards |
| Minor Third | 1.200 | Balanced — most common choice |
| Major Third | 1.250 | Spacious, consumer apps |
| Perfect Fourth | 1.333 | Strong hierarchy, marketing sites |
| Golden Ratio | 1.618 | Dramatic, display-heavy layouts |

Click any row to copy the token name to clipboard.
        `.trim(),
      },
    },
  },
  argTypes: {
    base:  { control: false },
    ratio: { control: false },
  },
};

export default meta;

export const Default = {
  name: 'Minor Third (1.2)',
  render: function Render(args) {
    const [globals, updateGlobals] = useGlobals();
    const ratio = parseFloat(globals.typescale)   || args.ratio;
    const base  = parseInt(globals.typescaleBase) || args.base;
    return (
      <TypographyScale
        {...args} ratio={ratio} base={base}
        onRatioChange={(r) => { sessionStorage.setItem(SCROLL_KEY, String(window.scrollY)); updateGlobals({ typescale: String(r) }); }}
        onBaseChange={(b)  => { sessionStorage.setItem(SCROLL_KEY, String(window.scrollY)); updateGlobals({ typescaleBase: String(b) }); }}
      />
    );
  },
  args: { base: 16, ratio: 1.2 },
};

export const Compact = {
  name: 'Major Second (1.125)',
  render: function Render(args) {
    const [globals, updateGlobals] = useGlobals();
    const ratio = parseFloat(globals.typescale)   || args.ratio;
    const base  = parseInt(globals.typescaleBase) || args.base;
    return (
      <TypographyScale
        {...args} ratio={ratio} base={base}
        onRatioChange={(r) => { sessionStorage.setItem(SCROLL_KEY, String(window.scrollY)); updateGlobals({ typescale: String(r) }); }}
        onBaseChange={(b)  => { sessionStorage.setItem(SCROLL_KEY, String(window.scrollY)); updateGlobals({ typescaleBase: String(b) }); }}
      />
    );
  },
  args: { base: 16, ratio: 1.125 },
};

export const Expressive = {
  name: 'Perfect Fourth (1.333)',
  render: function Render(args) {
    const [globals, updateGlobals] = useGlobals();
    const ratio = parseFloat(globals.typescale)   || args.ratio;
    const base  = parseInt(globals.typescaleBase) || args.base;
    return (
      <TypographyScale
        {...args} ratio={ratio} base={base}
        onRatioChange={(r) => { sessionStorage.setItem(SCROLL_KEY, String(window.scrollY)); updateGlobals({ typescale: String(r) }); }}
        onBaseChange={(b)  => { sessionStorage.setItem(SCROLL_KEY, String(window.scrollY)); updateGlobals({ typescaleBase: String(b) }); }}
      />
    );
  },
  args: { base: 16, ratio: 1.333 },
};