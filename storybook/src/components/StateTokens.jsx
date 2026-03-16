import React, { useState } from 'react';
import { theme } from '../tokens/theme.js';
import { resolveTokens } from '../tokens/resolve.js';
import stateTokens from '../tokens/semantic/states.json';
import shades from '../tokens/shades.json';

const resolved = resolveTokens(stateTokens, '', shades);

const TOKENS = [
  { name: 'state.hover',           description: 'Hover background' },
  { name: 'state.active',          description: 'Active/pressed background' },
  { name: 'state.selected',        description: 'Selected background' },
  { name: 'state.focus',           description: 'Focus ring color' },
  { name: 'state.disabled.bg',     description: 'Disabled background' },
  { name: 'state.disabled.text',   description: 'Disabled text' },
  { name: 'state.disabled.border', description: 'Disabled border' },
];

function StateRow({ name, description }) {
  const [copied, setCopied] = useState(false);
  const value = resolved[name];
  const isText   = name.includes('text');
  const isBorder = name.includes('border') || name.includes('focus');

  const handleCopy = () => {
    navigator.clipboard?.writeText(name).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    });
  };

  return (
    <div
      onClick={handleCopy}
      title={`Copy: ${name}`}
      style={{
        display: 'grid',
        gridTemplateColumns: '200px 180px 200px 1fr',
        alignItems: 'center',
        gap: theme.spacing.lg,
        padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
        borderRadius: theme.spacing.xxs,
        cursor: 'pointer',
        transition: 'background 0.12s',
        background: copied ? '#f0fdf4' : 'transparent',
        borderBottom: `1px solid ${theme.border.subtle}`,
      }}
      onMouseEnter={e => { if (!copied) e.currentTarget.style.background = theme.bg.hover; }}
      onMouseLeave={e => { if (!copied) e.currentTarget.style.background = copied ? '#f0fdf4' : 'transparent'; }}
    >
      <span style={{ fontFamily: theme.font, fontSize: 11, color: copied ? '#16a34a' : theme.text.subtle, transition: 'color 0.2s' }}>
        {copied ? '✓ copied' : name}
      </span>

      <span style={{ fontFamily: theme.font, fontSize: 10, color: theme.text.subtlest }}>{description}</span>

      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
        <div style={{
          width: 24, height: 24,
          borderRadius: theme.spacing.xxs,
          background: isBorder ? 'transparent' : value,
          border: isBorder ? `2px solid ${value}` : `1px solid ${theme.border.subtle}`,
          flexShrink: 0,
        }} />
        <span style={{ fontFamily: theme.font, fontSize: 10, color: theme.text.subtlest }}>{value}</span>
      </div>

      {/* Preview */}
      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
        {isText ? (
          <div style={{
            padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
            borderRadius: theme.spacing.xxs,
            background: theme.bg.raised,
            border: `1px solid ${theme.border.subtle}`,
          }}>
            <span style={{ fontFamily: theme.font, fontSize: 13, color: value }}>
              Disabled text sample
            </span>
          </div>
        ) : isBorder ? (
          <div style={{
            width: 120, height: 40,
            borderRadius: theme.spacing.xs,
            background: theme.bg.raised,
            border: `2px solid ${value}`,
            outline: name === 'state.focus' ? `3px solid ${value}` : 'none',
            outlineOffset: 2,
          }} />
        ) : (
          <div style={{ display: 'flex', gap: theme.spacing.xs }}>
            <div style={{
              width: 80, height: 40,
              borderRadius: theme.spacing.xs,
              background: value,
              border: `1px solid ${theme.border.subtle}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontFamily: theme.font, fontSize: 11, color: theme.text.default }}>Label</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function StateTokens() {
  return (
    <div style={{ background: theme.bg.page, minHeight: '100vh', padding: `${theme.spacing.xxl}px`, fontFamily: theme.font }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap" />

      <div style={{ marginBottom: theme.spacing.xxl }}>
        <h1 style={{ fontFamily: theme.font, fontSize: 26, fontWeight: 300, color: theme.text.default, letterSpacing: '-0.02em', marginBottom: theme.spacing.xxs }}>
          Interactive States
        </h1>
        <p style={{ fontFamily: theme.font, fontSize: 10, color: theme.text.subtlest, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Semantic state tokens · click row to copy token name
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '200px 180px 200px 1fr',
        gap: theme.spacing.lg,
        padding: `0 ${theme.spacing.md}px ${theme.spacing.xs}px`,
        borderBottom: `1px solid ${theme.border.default}`,
        marginBottom: 0,
      }}>
        {['Token', 'Description', 'Value', 'Preview'].map(h => (
          <span key={h} style={{ fontFamily: theme.font, fontSize: 9, color: theme.text.subtlest, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{h}</span>
        ))}
      </div>

      {TOKENS.map(({ name, description }) => (
        <StateRow key={name} name={name} description={description} />
      ))}
    </div>
  );
}

export default StateTokens;