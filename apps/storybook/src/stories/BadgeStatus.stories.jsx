import React from 'react';
import { useGlobals } from '@storybook/preview-api';
import { BadgeStatus } from '../components/BadgeStatus/BadgeStatus';
import { CheckCircleIcon, WarningIcon, InfoIcon, StarIcon } from '@phosphor-icons/react';
import {
  surfaceTokenControl,
  textTokenControl,
  borderTokenControl,
  borderWidthTokenControl,
  radiusTokenControl,
  fontSizeTokenControl,
  spacingTokenControl,
  resolveToken,
  SURFACE_TOKEN_MAP,
  TEXT_TOKEN_MAP,
  BORDER_TOKEN_MAP,
  BORDER_WIDTH_TOKEN_MAP,
  RADIUS_TOKEN_MAP,
  FONT_SIZE_TOKEN_MAP,
  SPACING_TOKEN_MAP,
} from '../tokens/tokenOptions';

/* ─── Sync decorator ─────────────────────────────────────────────────────────
   Whenever a badge token arg is changed, push the resolved CSS value to the
   matching Storybook global so the Overrides panel tracks it.
   ─────────────────────────────────────────────────────────────────────────── */

function BadgeSyncDecorator(Story, context) {
  const { args, viewMode } = context;
  const [, updateGlobals] = useGlobals();

  React.useEffect(() => {
    // In docs mode Storybook unmounts/remounts stories on every globals change,
    // so calling updateGlobals here would create an infinite render loop.
    if (viewMode === 'docs') return;

    updateGlobals({
      'tao-badge-status-bg':           resolveToken(args.tokenBg,          SURFACE_TOKEN_MAP) || '',
      'tao-badge-status-text':         resolveToken(args.tokenText,         TEXT_TOKEN_MAP)    || '',
      'tao-badge-status-border-color': resolveToken(args.tokenBorderColor,  BORDER_TOKEN_MAP)  || '',
      'tao-badge-status-border-width': resolveToken(args.tokenBorderWidth,  BORDER_WIDTH_TOKEN_MAP) || '',
      'tao-badge-status-radius':       resolveToken(args.tokenRadius,       RADIUS_TOKEN_MAP)  || '',
      'tao-badge-status-font-size':    resolveToken(args.tokenFontSize,     FONT_SIZE_TOKEN_MAP) || '',
      'tao-badge-status-spacing-gap':  resolveToken(args.tokenGap,          SPACING_TOKEN_MAP) || '',
      'tao-badge-status-spacing-h':    resolveToken(args.tokenPaddingX,     SPACING_TOKEN_MAP) || '',
      'tao-badge-status-spacing-v':    resolveToken(args.tokenPaddingY,     SPACING_TOKEN_MAP) || '',
    });
  }, [
    viewMode,
    args.tokenBg, args.tokenText, args.tokenBorderColor, args.tokenBorderWidth,
    args.tokenRadius, args.tokenFontSize, args.tokenGap, args.tokenPaddingX, args.tokenPaddingY,
  ]);

  return React.createElement(Story);
}

/* ─── Meta ───────────────────────────────────────────────────────────────── */

const meta = {
  title: 'Components / Badge Status',
  component: BadgeStatus,
  tags: ['autodocs'],
  decorators: [BadgeSyncDecorator],
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
Badge Status is a compact label component used to communicate status, category, or metadata at a glance.

9 semantic color variants · optional icon left/right · editable label.

---

### Variants

| Color | Surface token | Text token | Use case |
|---|---|---|---|
| \`neutral\` | \`surface/neutral/subtle\` | \`text/default\` | Default, inactive |
| \`brand-1\` | \`surface/brand-1/subtlest\` | \`text/brand-1\` | Primary brand |
| \`brand-2\` | \`surface/brand-2/subtlest\` | \`text/brand-2\` | Secondary brand |
| \`brand-3\` | \`surface/brand-3/subtlest\` | \`text/brand-3\` | Tertiary brand |
| \`success\` | \`surface/news/subtlest\` | \`text/news\` | Success, positive |
| \`danger\` | \`surface/danger/subtlest\` | \`text/danger\` | Error, destructive |
| \`alert\` | \`surface/alert/subtlest\` | \`text/alert\` | Warning |
| \`info\` | \`surface/info/subtlest\` | \`text/info\` | Informational |
| \`ai\` | \`surface/ai/subtlest\` | \`text/ai\` | AI-generated content |

---

### Component tokens

Override any slot via the **Token overrides** controls or inline style. Changes appear in the **Overrides** toolbar.

| Token | Property | Fallback |
|---|---|---|
| \`--tao-badge-status-bg\` | background-color | \`--tao-surface-*\` (per variant) |
| \`--tao-badge-status-text\` | color | \`--tao-text-*\` (per variant) |
| \`--tao-badge-status-border-color\` | border-color | \`transparent\` |
| \`--tao-badge-status-border-width\` | border-width | \`--tao-border-width-sm\` |
| \`--tao-badge-status-radius\` | border-radius | \`--tao-radius-md\` |
| \`--tao-badge-status-font-size\` | font-size | \`--tao-typography-size-xs\` |
| \`--tao-badge-status-spacing-gap\` | icon ↔ label gap | \`--tao-spacing-xxs\` |
| \`--tao-badge-status-spacing-h\` | horizontal padding | \`--tao-spacing-xs\` |
| \`--tao-badge-status-spacing-v\` | vertical padding | \`--tao-spacing-xxs\` |

---

### Icons

Pass any React node to \`iconLeft\` or \`iconRight\`. Phosphor icons at size 11 work well.

\`\`\`jsx
<BadgeStatus color="success" label="Done" iconLeft={<CheckCircleIcon size={11} weight="fill" />} />
\`\`\`

---

### Figma
[Components → Badge Status](https://www.figma.com/design/WrV3bhb7Rbkbp5D8sxbMD0/Components?node-id=118-448)
        `.trim(),
      },
    },
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['neutral', 'brand-1', 'brand-2', 'brand-3', 'success', 'danger', 'alert', 'info', 'ai'],
      description: 'Semantic color variant',
      table: { defaultValue: { summary: 'neutral' } },
    },
    label: {
      control: 'text',
      description: 'Badge label text',
      table: { defaultValue: { summary: 'Label' } },
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
    // ── Token overrides
    tokenBg:          surfaceTokenControl('Override --tao-badge-status-bg'),
    tokenText:        textTokenControl('Override --tao-badge-status-text'),
    tokenBorderColor: borderTokenControl('Override --tao-badge-status-border-color'),
    tokenBorderWidth: borderWidthTokenControl('Override --tao-badge-status-border-width'),
    tokenRadius:      radiusTokenControl('Override --tao-badge-status-radius'),
    tokenFontSize:    fontSizeTokenControl('Override --tao-badge-status-font-size'),
    tokenGap:         spacingTokenControl('Override --tao-badge-status-spacing-gap'),
    tokenPaddingX:    spacingTokenControl('Override --tao-badge-status-spacing-h'),
    tokenPaddingY:    spacingTokenControl('Override --tao-badge-status-spacing-v'),
  },
  args: {
    color: 'neutral',
    label: 'Label',
    iconLeft: false,
    iconRight: false,
    tokenBg: '', tokenText: '', tokenBorderColor: '', tokenBorderWidth: '',
    tokenRadius: '', tokenFontSize: '', tokenGap: '', tokenPaddingX: '', tokenPaddingY: '',
  },
};

export default meta;

/* ─── Component ──────────────────────────────────────────────────────────── */

export const Component = {
  name: 'Component',
  render: (args) => {
    const icon = args.iconLeft || args.iconRight
      ? <CheckCircleIcon size={11} weight="fill" />
      : null;
    return (
      <BadgeStatus
        color={args.color}
        label={args.label}
        iconLeft={args.iconLeft ? icon : null}
        iconRight={args.iconRight ? icon : null}
      />
    );
  },
};
