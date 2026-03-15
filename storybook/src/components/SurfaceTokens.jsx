import React, { useState } from 'react';
import { theme } from '../tokens/theme.js';
import { resolveTokens } from '../tokens/resolve.js';
import surfaceTokens from '../tokens/semantic/surfaces.json';
import shades from '../tokens/shades.json';

const resolved = resolveTokens(surfaceTokens, '', shades);

const ROLES = [
  'brand-1', 'brand-2', 'brand-3',
  'success', 'danger', 'alert',
  'info', 'news', 'ai', 'neutral'
];

const VARIANTS = ['subtlest', 'subtle', 'default', 'bold', 'strong', 'strongest'];

function SwatchCell({ role, variant }) {
  const [copied, setCopied] = useState(false);
  const tokenName = `surface.${role}.${variant}`;
  const value = resolved[tokenName];

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
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: theme.spacing.xs, cursor: 'pointer' }}
    >
      <div style={{
        width: '100%', height: 40,
        borderRadius: theme.spacing.xs,
        background: value,
        border: `1px solid ${theme.border.subtle}`,
      }} />
      <div style={{ fontFamily: theme.font, fontSize: 9, color: copied ? '#16a34a' : theme.text.subtlest, textAlign: 'center', transition: 'color 0.2s' }}>
        {copied ? '✓' : variant}
      </div>
    </div>
  );
}

function SurfaceRow({ role }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '100px repeat(6, 1fr)',
      alignItems: 'center',
      gap: theme.spacing.sm,
      padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
      borderBottom: `1px solid ${theme.border.subtle}`,
    }}>
      <span style={{ fontFamily: theme.font, fontSize: 12, color: theme.text.subtle, textTransform: 'capitalize' }}>{role}</span>
      {VARIANTS.map(variant => (
        <SwatchCell key={variant} role={role} variant={variant} />
      ))}
    </div>
  );
}

export function SurfaceTokens() {
  return (
    <div style={{ background: theme.bg.page, minHeight: '100vh', padding: `${theme.spacing.xxl}px ${theme.spacing.xxl}px`, fontFamily: theme.font }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap" />

      <div style={{ marginBottom: theme.spacing.xxl }}>
        <h1 style={{ fontFamily: theme.font, fontSize: 26, fontWeight: 300, color: theme.text.default, letterSpacing: '-0.02em', marginBottom: theme.spacing.xxs }}>
          Surface Tokens
        </h1>
        <p style={{ fontFamily: theme.font, fontSize: 10, color: theme.text.subtlest, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Semantic surfaces · 6 variants per role · click to copy token name
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '100px repeat(6, 1fr)',
        gap: theme.spacing.sm,
        padding: `0 ${theme.spacing.md}px ${theme.spacing.xs}px`,
        borderBottom: `1px solid ${theme.border.default}`,
        marginBottom: 0,
      }}>
        {['Role', ...VARIANTS].map(h => (
          <span key={h} style={{ fontFamily: theme.font, fontSize: 9, color: theme.text.subtlest, textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: h === 'Role' ? 'left' : 'center' }}>{h}</span>
        ))}
      </div>

      {ROLES.map(role => (
        <SurfaceRow key={role} role={role} />
      ))}
    </div>
  );
}

export default SurfaceTokens;