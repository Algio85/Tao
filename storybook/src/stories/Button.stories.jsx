import React from 'react';
import { Button } from '../../components/Button/Button';

const meta = {
  title: 'Components / Button',
  component: Button,
  tags: ['autodocs'],
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
The Button component is the primary interactive element in the Tao design system.

3 variants × 3 sizes × 8 states = 72 Figma component variants. In React, states are handled via props and CSS — hover and press via \`:hover\` / \`:active\`, active-hover and active-press via \`.btn--active\` combined with pseudo-classes.

---

### Variants

| Variant | Use case |
|---|---|
| \`primary\` | Main call to action — one per view |
| \`ghost\` | Secondary actions, less visual weight |
| \`danger\` | Destructive actions — delete, remove, revoke |

### Sizes

| Size | Font | Padding H | Padding V | Use case |
|---|---|---|---|---|
| \`sm\` | 13px | 12px | 8px | Compact UI, tables, toolbars |
| \`md\` | 16px | 16px | 8px | Default — most use cases |
| \`lg\` | 19px | 24px | 16px | Hero actions, prominent CTAs |

### States

- **default** — resting state
- **hover** — cursor over the button (CSS \`:hover\`)
- **press** — mouse down (CSS \`:active\`)
- **active** — toggled on, selected state (\`active\` prop)
- **active-hover / active-press** — hover and press on top of active state
- **disabled** — non-interactive (\`disabled\` prop)
- **loading** — async pending (\`loading\` prop)

### Icon slots

Both \`iconLeft\` and \`iconRight\` accept any React node — pass an icon component. Both slots are independent and can be used together.

---

### Token layer

All visual values are driven by \`--tao-button-*\` CSS custom properties defined in \`Button.css\`, which reference semantic tokens. No hardcoded values in the component.

\`\`\`css
--tao-button-primary-background-color:  var(--tao-surface-brand-1-strong);
--tao-button-primary-hover-background-color: var(--tao-surface-brand-1-strong);
--tao-button-primary-press-background-color: var(--tao-surface-brand-1-strongest);
--tao-button-md-spacing-horizontal: var(--tao-spacing-md);
\`\`\`

### Figma

Component set: [Components → Button](https://www.figma.com/design/WrV3bhb7Rbkbp5D8sxbMD0/Components?node-id=113-601)

72 variants (3 variants × 3 sizes × 8 states). Icon left and icon right are boolean component properties — not variant dimensions.
        `.trim(),
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'ghost', 'danger'],
      description: 'Visual variant',
      table: { defaultValue: { summary: 'primary' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size scale',
      table: { defaultValue: { summary: 'md' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button — non-interactive, reduced opacity',
      table: { defaultValue: { summary: false } },
    },
    loading: {
      control: 'boolean',
      description: 'Loading state — shows loading label, blocks interaction',
      table: { defaultValue: { summary: false } },
    },
    active: {
      control: 'boolean',
      description: 'Active / selected state — toggled on',
      table: { defaultValue: { summary: false } },
    },
    iconLeft: {
      control: 'boolean',
      description: 'Show icon slot on the left',
      table: { defaultValue: { summary: false } },
    },
    iconRight: {
      control: 'boolean',
      description: 'Show icon slot on the right',
      table: { defaultValue: { summary: false } },
    },
    children: {
      control: 'text',
      description: 'Button label',
      table: { defaultValue: { summary: 'Button' } },
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler',
    },
  },
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    active: false,
    iconLeft: false,
    iconRight: false,
    children: 'Button',
  },
};

export default meta;

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default = {
  name: 'Default',
};

// ─── Variants ─────────────────────────────────────────────────────────────────

export const AllVariants = {
  name: 'All variants',
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
      <Button variant="primary" size="md">Primary</Button>
      <Button variant="ghost"   size="md">Ghost</Button>
      <Button variant="danger"  size="md">Danger</Button>
    </div>
  ),
};

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const AllSizes = {
  name: 'All sizes',
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
      <Button variant="primary" size="sm">Small</Button>
      <Button variant="primary" size="md">Medium</Button>
      <Button variant="primary" size="lg">Large</Button>
    </div>
  ),
};

// ─── States ───────────────────────────────────────────────────────────────────

export const States = {
  name: 'States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {['primary', 'ghost', 'danger'].map(variant => (
        <div key={variant} style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button variant={variant} size="md">Default</Button>
          <Button variant={variant} size="md" active>Active</Button>
          <Button variant={variant} size="md" loading>Loading</Button>
          <Button variant={variant} size="md" disabled>Disabled</Button>
        </div>
      ))}
    </div>
  ),
};

// ─── Icon slots ───────────────────────────────────────────────────────────────

const IconPlaceholder = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
    <rect x="2" y="2" width="12" height="12" rx="2" opacity="0.8" />
  </svg>
);

export const WithIcons = {
  name: 'With icons',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <Button variant="primary" size="md" iconLeft={<IconPlaceholder />}>Icon left</Button>
        <Button variant="primary" size="md" iconRight={<IconPlaceholder />}>Icon right</Button>
        <Button variant="primary" size="md" iconLeft={<IconPlaceholder />} iconRight={<IconPlaceholder />}>Both icons</Button>
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <Button variant="ghost" size="md" iconLeft={<IconPlaceholder />}>Icon left</Button>
        <Button variant="ghost" size="md" iconRight={<IconPlaceholder />}>Icon right</Button>
        <Button variant="ghost" size="md" iconLeft={<IconPlaceholder />} iconRight={<IconPlaceholder />}>Both icons</Button>
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <Button variant="danger" size="md" iconLeft={<IconPlaceholder />}>Icon left</Button>
        <Button variant="danger" size="md" iconRight={<IconPlaceholder />}>Icon right</Button>
        <Button variant="danger" size="md" iconLeft={<IconPlaceholder />} iconRight={<IconPlaceholder />}>Both icons</Button>
      </div>
    </div>
  ),
};

// ─── Full matrix ──────────────────────────────────────────────────────────────

export const FullMatrix = {
  name: 'Full matrix',
  parameters: { layout: 'fullscreen' },
  render: () => {
    const variants = ['primary', 'ghost', 'danger'];
    const sizes    = ['sm', 'md', 'lg'];
    const labelStyle = {
      fontSize: 10,
      color: '#888',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      fontFamily: 'DM Sans, sans-serif',
      minWidth: 60,
    };
    return (
      <div style={{ padding: 32, fontFamily: 'DM Sans, sans-serif', background: '#f5f5f5', minHeight: '100vh' }}>
        <h2 style={{ fontSize: 13, fontWeight: 500, color: '#111', marginBottom: 24, letterSpacing: '-0.01em' }}>Button — full matrix</h2>
        {variants.map(variant => (
          <div key={variant} style={{ marginBottom: 32 }}>
            <p style={{ ...labelStyle, marginBottom: 12 }}>{variant}</p>
            {sizes.map(size => (
              <div key={size} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
                <span style={{ ...labelStyle, minWidth: 24 }}>{size}</span>
                <Button variant={variant} size={size}>Default</Button>
                <Button variant={variant} size={size} active>Active</Button>
                <Button variant={variant} size={size} loading>Loading</Button>
                <Button variant={variant} size={size} disabled>Disabled</Button>
                <Button variant={variant} size={size} iconLeft={<IconPlaceholder />}>Icon L</Button>
                <Button variant={variant} size={size} iconRight={<IconPlaceholder />}>Icon R</Button>
                <Button variant={variant} size={size} iconLeft={<IconPlaceholder />} iconRight={<IconPlaceholder />}>Both</Button>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  },
};