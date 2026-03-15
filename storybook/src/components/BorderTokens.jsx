import React, { useState } from 'react';
import { theme } from '../tokens/theme.js';

const RADIUS_TOKENS = {
  none:     { value: '0px',   px: 0   },
  xs:       { value: '2px',   px: 2   },
  sm:       { value: '4px',   px: 4   },
  md:       { value: '8px',   px: 8   },
  lg:       { value: '16px',  px: 16  },
  xl:       { value: '24px',  px: 24  },
  circular: { value: '100px', px: 100, comment: 'Use on square elements' },
  pill:     { value: '100px', px: 100, comment: 'Use on rectangular elements' },
};

const WIDTH_TOKENS = {
  sm: { value: '1px', px: 1 },
  md: { value: '2px', px: 2 },
  lg: { value: '4px', px: 4 },
  xl: { value: '8px', px: 8 },
};

function CopyRow({ tokenName, children, style = {} }) {
  const [copied, setCopied] = useState(false);

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
        alignItems: 'center',
        gap: theme.spacing.lg,
        padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
        borderRadius: theme.spacing.xs,
        cursor: 'pointer',
        transition: 'background 0.12s',
        background: copied ? '#f0fdf4' : 'transparent',
        borderBottom: `1px solid ${theme.border.subtle}`,
        ...style,
      }}
      onMouseEnter={e => { if (!copied) e.currentTarget.style.background = theme.bg.hover; }}
      onMouseLeave={e => { if (!copied) e.currentTarget.style.background = copied ? '#f0fdf4' : 'transparent'; }}
    >
      <span style={{ fontFamily: theme.font, fontSize: 11, color: copied ? '#16a34a' : theme.text.subtle, transition: 'color 0.2s' }}>
        {copied ? '✓ copied' : tokenName}
      </span>
      {children}
    </div>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: theme.spacing.md }}>
      <h2 style={{ fontFamily: theme.font, fontSize: 16, fontWeight: 400, color: theme.text.default, marginBottom: theme.spacing.xxs }}>{title}</h2>
      {subtitle && <p style={{ fontFamily: theme.font, fontSize: 10, color: theme.text.subtlest, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{subtitle}</p>}
    </div>
  );
}

function ColumnHeaders({ columns }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: columns,
      gap: theme.spacing.lg,
      padding: `0 ${theme.spacing.md}px ${theme.spacing.xs}px`,
      borderBottom: `1px solid ${theme.border.default}`,
      marginBottom: 0,
    }}>
      {['Token', 'Value', 'Preview'].map(h => (
        <span key={h} style={{ fontFamily: theme.font, fontSize: 9, color: theme.text.subtlest, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {h}
        </span>
      ))}
    </div>
  );
}

export function BorderTokens() {
  return (
    <div style={{ background: theme.bg.page, minHeight: '100vh', padding: `${theme.spacing.xxl}px ${theme.spacing.xxl}px`, fontFamily: theme.font }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap" />

      <div style={{ marginBottom: theme.spacing.xxl }}>
        <h1 style={{ fontFamily: theme.font, fontSize: 26, fontWeight: 300, color: theme.text.default, letterSpacing: '-0.02em', marginBottom: theme.spacing.xxs }}>
          Border Tokens
        </h1>
        <p style={{ fontFamily: theme.font, fontSize: 10, color: theme.text.subtlest, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Radius · Width · click row to copy token name
        </p>
      </div>

      <div style={{ marginBottom: theme.spacing.xxxl }}>
        <SectionHeader title="Border Radius" subtitle="8 steps — from sharp to circular" />
        <ColumnHeaders columns="160px 60px 1fr" />
        {Object.entries(RADIUS_TOKENS).map(([name, { value, px, comment }]) => (
          <CopyRow key={name} tokenName={`radius.${name}`} style={{ gridTemplateColumns: '160px 60px 1fr' }}>
            <span style={{ fontFamily: theme.font, fontSize: 11, color: theme.text.subtlest }}>{value}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
              <div style={{ width: 48, height: 48, background: theme.accent.default, borderRadius: px, flexShrink: 0 }} />
              {(name === 'pill' || name === 'circular') && (
                <div style={{ width: name === 'pill' ? 96 : 48, height: 48, background: theme.accent.default, opacity: 0.3, borderRadius: px, flexShrink: 0 }} />
              )}
              {comment && <span style={{ fontFamily: theme.font, fontSize: 10, color: theme.text.subtlest, fontStyle: 'italic' }}>{comment}</span>}
            </div>
          </CopyRow>
        ))}
      </div>

      <div>
        <SectionHeader title="Border Width" subtitle="4 steps — from hairline to thick" />
        <ColumnHeaders columns="160px 60px 1fr" />
        {Object.entries(WIDTH_TOKENS).map(([name, { value, px }]) => (
          <CopyRow key={name} tokenName={`border.width.${name}`} style={{ gridTemplateColumns: '160px 60px 1fr' }}>
            <span style={{ fontFamily: theme.font, fontSize: 11, color: theme.text.subtlest }}>{value}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
              <div style={{ width: 160, height: px, background: theme.accent.default, borderRadius: px }} />
              <div style={{ width: 48, height: 32, border: `${px}px solid ${theme.accent.default}`, borderRadius: 6, background: 'transparent' }} />
            </div>
          </CopyRow>
        ))}
      </div>
    </div>
  );
}

export default BorderTokens;