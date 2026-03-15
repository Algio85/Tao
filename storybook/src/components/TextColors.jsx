import React, { useState } from 'react';
import { theme } from '../tokens/theme.js';
import { resolveTokens } from '../tokens/resolve.js';
import textTokens from '../tokens/semantic/text.json';
import shades from '../tokens/shades.json';

const resolved = resolveTokens(textTokens, '', shades);

const TOKENS = [
  { name: 'default',  group: 'Neutral' },
  { name: 'subtle',   group: 'Neutral' },
  { name: 'subtlest', group: 'Neutral' },
  { name: 'inverse',  group: 'Neutral' },
  { name: 'brand-1',  group: 'Role' },
  { name: 'brand-2',  group: 'Role' },
  { name: 'brand-3',  group: 'Role' },
  { name: 'success',  group: 'Role' },
  { name: 'danger',   group: 'Role' },
  { name: 'alert',    group: 'Role' },
  { name: 'info',     group: 'Role' },
  { name: 'news',     group: 'Role' },
  { name: 'ai',       group: 'Role' },
];

function TextRow({ name }) {
  const [copied, setCopied] = useState(false);
  const tokenName = `text.${name}`;
  const value = resolved[tokenName];
  const isInverse = name === 'inverse';

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
        gridTemplateColumns: '160px 140px 1fr',
        alignItems: 'center',
        gap: theme.spacing.lg,
        padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
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

      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
        <div style={{
          width: 24, height: 24, borderRadius: theme.spacing.xs,
          background: value,
          border: `1px solid ${theme.border.subtle}`,
          flexShrink: 0,
        }} />
        <span style={{ fontFamily: theme.font, fontSize: 10, color: theme.text.subtlest }}>{value}</span>
      </div>

      <div style={{
        padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
        borderRadius: theme.spacing.xs,
        background: isInverse ? theme.text.default : theme.bg.raised,
        border: `1px solid ${theme.border.subtle}`,
      }}>
        <span style={{ fontFamily: theme.font, fontSize: 14, color: value }}>
          The quick brown fox jumps over the lazy dog
        </span>
      </div>
    </div>
  );
}

export function TextColors() {
  const groups = [...new Set(TOKENS.map(t => t.group))];

  return (
    <div style={{ background: theme.bg.page, minHeight: '100vh', padding: `${theme.spacing.xxl}px ${theme.spacing.xxl}px`, fontFamily: theme.font }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap" />

      <div style={{ marginBottom: theme.spacing.xxl }}>
        <h1 style={{ fontFamily: theme.font, fontSize: 26, fontWeight: 300, color: theme.text.default, letterSpacing: '-0.02em', marginBottom: theme.spacing.xxs }}>
          Text Colors
        </h1>
        <p style={{ fontFamily: theme.font, fontSize: 10, color: theme.text.subtlest, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Semantic text colors · click row to copy token name
        </p>
      </div>

      {groups.map(group => (
        <div key={group} style={{ marginBottom: theme.spacing.xxl }}>
          <div style={{
            padding: `${theme.spacing.xxs}px ${theme.spacing.md}px`,
            background: theme.bg.surface,
            borderRadius: theme.spacing.xs,
            display: 'inline-block',
            marginBottom: theme.spacing.xs,
          }}>
            <span style={{ fontFamily: theme.font, fontSize: 9, color: theme.text.subtlest, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{group}</span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '160px 140px 1fr',
            gap: theme.spacing.lg,
            padding: `0 ${theme.spacing.md}px ${theme.spacing.xs}px`,
            borderBottom: `1px solid ${theme.border.default}`,
            marginBottom: 0,
          }}>
            {['Token', 'Value', 'Preview'].map(h => (
              <span key={h} style={{ fontFamily: theme.font, fontSize: 9, color: theme.text.subtlest, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{h}</span>
            ))}
          </div>

          {TOKENS.filter(t => t.group === group).map(({ name }) => (
            <TextRow key={name} name={name} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default TextColors;