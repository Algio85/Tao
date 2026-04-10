import React from 'react';
import { useGlobals } from '@storybook/preview-api';
import { Button } from '../components/Button/Button';
import { ArrowRightIcon, PlusIcon } from '@phosphor-icons/react';
import {
  surfaceTokenControl,
  textTokenControl,
  radiusTokenControl,
  fontSizeTokenControl,
  spacingTokenControl,
  resolveToken,
  SURFACE_TOKEN_MAP,
  TEXT_TOKEN_MAP,
  RADIUS_TOKEN_MAP,
  FONT_SIZE_TOKEN_MAP,
  SPACING_TOKEN_MAP,
} from '../tokens/tokenOptions';

/* ─── Sync decorator ─────────────────────────────────────────────────────────
   Whenever a button token arg changes, push the resolved CSS value to the
   matching Storybook global so the Overrides panel tracks it.
   ─────────────────────────────────────────────────────────────────────────── */

function ButtonSyncDecorator(Story, context) {
  const { args, viewMode } = context;
  const [, updateGlobals] = useGlobals();

  React.useEffect(() => {
    if (viewMode === 'docs') return;

    updateGlobals({
      'tao-button-bg':        resolveToken(args.tokenBg,       SURFACE_TOKEN_MAP) || '',
      'tao-button-text':      resolveToken(args.tokenText,     TEXT_TOKEN_MAP)    || '',
      'tao-button-radius':    resolveToken(args.tokenRadius,   RADIUS_TOKEN_MAP)  || '',
      'tao-button-font-size': resolveToken(args.tokenFontSize, FONT_SIZE_TOKEN_MAP) || '',
      'tao-button-padding-h': resolveToken(args.tokenPaddingH, SPACING_TOKEN_MAP) || '',
      'tao-button-padding-v': resolveToken(args.tokenPaddingV, SPACING_TOKEN_MAP) || '',
      'tao-button-gap':       resolveToken(args.tokenGap,      SPACING_TOKEN_MAP) || '',
    });
  }, [
    viewMode,
    args.tokenBg, args.tokenText, args.tokenRadius,
    args.tokenFontSize, args.tokenPaddingH, args.tokenPaddingV, args.tokenGap,
  ]);

  return React.createElement(Story);
}

/* ─── Meta ───────────────────────────────────────────────────────────────── */

const meta = {
  title: 'Components / Button',
  component: Button,
  tags: ['autodocs'],
  decorators: [ButtonSyncDecorator],
  parameters: {
    layout: 'padded',
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
Button is the primary action trigger in the Tao design system.

3 variants · 3 sizes · optional icon left/right · active, loading and disabled states.

---

### Variants

| Variant | Background token | Text token | Use case |
|---|---|---|---|
| \`primary\` | \`surface/brand-2/strong\` | \`text/inverse\` | Main CTA |
| \`ghost\` | \`surface/neutral/subtlest\` | \`text/default\` | Secondary action |
| \`outline\` | \`transparent\` | \`text/default\` | Bordered secondary action |
| \`danger\` | \`surface/danger/strong\` | \`text/inverse\` | Destructive action |

---

### States & overlays

Hover and press states use a layered overlay approach — the base fill stays constant and a semantic state token is composited on top.

| State | Overlay token | Opacity |
|---|---|---|
| hover | \`button/hover/overlay/color\` → \`state/hover\` | 8% |
| press | \`button/press/overlay/color\` → \`state/active\` | 16% |
| active hover | \`button/active-hover/overlay/color\` → \`state/hover\` | 8% |
| active press | \`button/active-press/overlay/color\` → \`state/active\` | 16% |

---

### Component tokens

| Token | Property | Fallback |
|---|---|---|
| \`--tao-button-bg\` | background-color | variant default |
| \`--tao-button-text\` | color | variant default |
| \`--tao-button-radius\` | border-radius | size default |
| \`--tao-button-font-size\` | font-size | size default |
| \`--tao-button-padding-h\` | horizontal padding | size default |
| \`--tao-button-padding-v\` | vertical padding | size default |
| \`--tao-button-gap\` | icon ↔ label gap | size default |

---

### Usage

\`\`\`jsx
<Button variant="primary" size="md" label="Save changes" />
<Button variant="ghost"   size="sm" label="Cancel" />
<Button variant="danger"  size="md" label="Delete" disabled />
<Button variant="primary" size="lg" label="Loading…" loading />
\`\`\`

---

### Figma
[Components → Button](https://www.figma.com/design/WrV3bhb7Rbkbp5D8sxbMD0/Components?node-id=257-1643)
        `.trim(),
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'ghost', 'outline', 'danger'],
      description: 'Visual style variant',
      table: { defaultValue: { summary: 'primary' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Button size',
      table: { defaultValue: { summary: 'md' } },
    },
    label: {
      control: 'text',
      description: 'Button label text',
      table: { defaultValue: { summary: 'Button' } },
    },
    iconLeft: {
      control: 'boolean',
      description: 'Show icon on the left',
      table: { defaultValue: { summary: false } },
    },
    iconRight: {
      control: 'boolean',
      description: 'Show icon on the right',
      table: { defaultValue: { summary: false } },
    },
    active: {
      control: 'boolean',
      description: 'Visual active / pressed state.',
      table: { defaultValue: { summary: false } },
    },
    toggle: {
      control: 'boolean',
      description: 'Marks the button as a toggle — applies `aria-pressed` for assistive technologies.',
      table: { defaultValue: { summary: false }, category: 'Accessibility' },
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state.',
      table: { defaultValue: { summary: false } },
    },
    loading: {
      control: 'boolean',
      description: 'Loading state — replaces icon-left with a spinner and sets `aria-busy="true"`.',
      table: { defaultValue: { summary: false } },
    },
    as: {
      control: 'select',
      options: ['button', 'a', 'span', 'div'],
      description: 'Polymorphic tag.',
      table: { defaultValue: { summary: 'button' }, category: 'Accessibility' },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible label override — required for icon-only buttons.',
      table: { category: 'Accessibility' },
    },
    // ── Token overrides
    tokenBg:       surfaceTokenControl('Override --tao-button-bg'),
    tokenText:     textTokenControl('Override --tao-button-text'),
    tokenRadius:   radiusTokenControl('Override --tao-button-radius'),
    tokenFontSize: fontSizeTokenControl('Override --tao-button-font-size'),
    tokenPaddingH: spacingTokenControl('Override --tao-button-padding-h'),
    tokenPaddingV: spacingTokenControl('Override --tao-button-padding-v'),
    tokenGap:      spacingTokenControl('Override --tao-button-gap'),
  },
  args: {
    variant: 'primary',
    size: 'md',
    label: 'Button',
    iconLeft: false,
    iconRight: false,
    active: false,
    disabled: false,
    loading: false,
    tokenBg: '', tokenText: '', tokenRadius: '',
    tokenFontSize: '', tokenPaddingH: '', tokenPaddingV: '', tokenGap: '',
  },
};

export default meta;

/* ─── Component ──────────────────────────────────────────────────────────── */

const ICON       = <PlusIcon size={16} weight="bold" />;
const ICON_RIGHT = <ArrowRightIcon size={16} weight="bold" />;

export const Component = {
  name: 'Component',
  render: (args) => (
    <Button
      variant={args.variant}
      size={args.size}
      label={args.label}
      iconLeft={args.iconLeft ? ICON : null}
      iconRight={args.iconRight ? ICON_RIGHT : null}
      active={args.active}
      disabled={args.disabled}
      loading={args.loading}
    />
  ),
};
