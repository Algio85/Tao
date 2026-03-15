import React, { useState } from 'react';
import { theme } from '../tokens/theme.js';

const PRESETS = [
  { name: 'xs', label: 'Surface', description: 'Cards, panels, surface-level elements', keyLight: '0px 1px 4px 0px', ambient: '0px 2px 8px 0px' },
  { name: 'sm', label: 'Non-modal', description: 'Non-modal elements like dropdowns, tooltips', keyLight: '0px 2px 8px 0px', ambient: '0px 3px 12px 0px' },
  { name: 'md', label: 'Sticky', description: 'Sticky headers, floating action bars', keyLight: '0px 3px 12px 0px', ambient: '0px 4px 16px 0px' },
  { name: 'lg', label: 'Non-modal sticky', description: 'Non-modal elements on sticky surfaces', keyLight: '0px 4px 16px 0px', ambient: '0px 5px 20px 0px' },
  { name: 'xl', label: 'Modal', description: 'Modals, dialogs, drawers', keyLight: '0px 2px 8px 0px', ambient: '0px 6px 24px 0px' },
];

const SHADOW_COLOR = 'rgba(0, 0, 0, 0.10)';

function ShadowRow({ name, label, description, keyLight, ambient }) {
  const [copied, setCopied] = useState(false);
  const tokenName = `shadow.${name}`;
  const boxShadow = `${keyLight} ${SHADOW_COLOR}, ${ambient} ${SHADOW_COLOR}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(tokenName).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    });
  };

  return (
    <div
      onClick={handleCopy}
      title={`Copy: ${tokenName}`}
      style={{
        display: 'grid',
        gridTemplateColumns: '120px 140px 1fr 220px',
        alignItems: 'center',
        gap: theme.spacing.lg,
        padding: `${theme.spacing.md}px ${theme.spacing.md}px`,
        borderRadius: theme.spacing.xs,
        cursor: 'pointer',
        transition: 'background 0.12s',
        background: copied ? '#f0fdf4' : 'transparent',
        borderBottom: `1px solid ${theme.border.subtle}`,
      }}
      onMouseEnter={e => { if (!copied) e.currentTarget.style.background = theme.bg.hover; }}
      onMouseLeave={e => { if (!copied) e.currentTarget.style.background = copied ? '#f0fdf4' : 'transparent'; }}
    >
      <span style={{ fontFamily: theme.font, fontSize: 11, color: copied ? '#16a34a' : theme.text.subtle, transition: 'color 0.2s' }}>
        {copied ? '✓ copied' : tokenName}
      </span>

      <div>
        <div style={{ fontFamily: theme.font, fontSize: 12, color: theme.text.default, marginBottom: theme.spacing.xxs }}>{label}</div>
        <div style={{ fontFamily: theme.font, fontSize: 10, color: theme.text.subtlest }}>{description}</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xxs }}>
        <div style={{ fontFamily: theme.font, fontSize: 10, color: theme.text.subtlest }}>
          <span style={{ color: theme.text.subtle, marginRight: theme.spacing.xs }}>key</span>{keyLight}
        </div>
        <div style={{ fontFamily: theme.font, fontSize: 10, color: theme.text.subtlest }}>
          <span style={{ color: theme.text.subtle, marginRight: theme.spacing.xs }}>ambient</span>{ambient}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', background: theme.bg.surface, borderRadius: theme.spacing.xs, padding: `${theme.spacing.sm}px ${theme.spacing.md}px` }}>
        <div style={{
          width: 120,
          height: 64,
          background: '#ffffff',
          borderRadius: theme.spacing.xs,
          boxShadow,
        }} />
      </div>
    </div>
  );
}

export function ShadowTokens() {
  return (
    <div style={{ background: theme.bg.page, minHeight: '100vh', padding: `${theme.spacing.xxl}px ${theme.spacing.xxl}px`, fontFamily: theme.font }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap" />

      <div style={{ marginBottom: theme.spacing.xxl }}>
        <h1 style={{ fontFamily: theme.font, fontSize: 26, fontWeight: 300, color: theme.text.default, letterSpacing: '-0.02em', marginBottom: theme.spacing.xxs }}>
          Shadow Tokens
        </h1>
        <p style={{ fontFamily: theme.font, fontSize: 10, color: theme.text.subtlest, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          5 elevation presets · key + ambient layers · click row to copy token name
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '120px 140px 1fr 220px',
        gap: theme.spacing.lg,
        padding: `0 ${theme.spacing.md}px ${theme.spacing.xs}px`,
        borderBottom: `1px solid ${theme.border.default}`,
        marginBottom: 0,
      }}>
        {['Token', 'Preset', 'Values', 'Preview'].map(h => (
          <span key={h} style={{ fontFamily: theme.font, fontSize: 9, color: theme.text.subtlest, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {h}
          </span>
        ))}
      </div>

      {PRESETS.map(({ name, ...rest }) => (
        <ShadowRow key={name} name={name} {...rest} />
      ))}
    </div>
  );
}

export default ShadowTokens;