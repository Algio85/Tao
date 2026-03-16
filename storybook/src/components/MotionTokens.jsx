import React, { useState } from 'react';
import { theme } from '../tokens/theme.js';

const DURATION_TOKENS = [
  { name: 'instant', value: '0ms',   ms: 0,   description: 'No animation' },
  { name: 'fast',    value: '100ms', ms: 100, description: 'Small UI elements, tooltips' },
  { name: 'normal',  value: '200ms', ms: 200, description: 'Default transitions' },
  { name: 'slow',    value: '300ms', ms: 300, description: 'Modals, panels' },
  { name: 'slower',  value: '500ms', ms: 500, description: 'Page transitions' },
];

const EASING_TOKENS = [
  { name: 'linear',      value: 'linear',                             description: 'Progress bars' },
  { name: 'ease-in',     value: 'cubic-bezier(0.4, 0, 1, 1)',        description: 'Elements leaving screen' },
  { name: 'ease-out',    value: 'cubic-bezier(0, 0, 0.2, 1)',        description: 'Elements entering screen' },
  { name: 'ease-in-out', value: 'cubic-bezier(0.4, 0, 0.2, 1)',      description: 'Elements moving on screen' },
  { name: 'spring',      value: 'cubic-bezier(0.34, 1.56, 0.64, 1)', description: 'Playful, bouncy interactions' },
];

function CopyRow({ tokenName, children }) {
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
        gridTemplateColumns: '160px 80px 200px 1fr',
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
        {copied ? '✓ copied' : tokenName}
      </span>
      {children}
    </div>
  );
}

function DurationRow({ name, value, ms, description }) {
  const [active, setActive] = useState(false);
  const tokenName = `duration.${name}`;

  return (
    <CopyRow tokenName={tokenName}>
      <span style={{ fontFamily: theme.font, fontSize: 11, color: theme.text.subtlest }}>{value}</span>
      <span style={{ fontFamily: theme.font, fontSize: 10, color: theme.text.subtlest }}>{description}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
        <button
          onClick={e => { e.stopPropagation(); setActive(true); setTimeout(() => setActive(false), ms + 100); }}
          style={{
            all: 'unset', cursor: 'pointer',
            padding: `${theme.spacing.xxs}px ${theme.spacing.sm}px`,
            borderRadius: theme.spacing.xxs,
            fontFamily: theme.font, fontSize: 11,
            background: theme.accent.default,
            color: theme.text.inverse,
          }}
        >
          Play
        </button>
        <div style={{
          width: 120, height: 8,
          borderRadius: theme.spacing.xxs,
          background: theme.bg.surface,
          border: `1px solid ${theme.border.subtle}`,
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: active ? '100%' : '0%',
            background: theme.accent.default,
            transition: active ? `width ${value} linear` : 'none',
          }} />
        </div>
      </div>
    </CopyRow>
  );
}

function EasingRow({ name, value, description }) {
  const [active, setActive] = useState(false);
  const tokenName = `easing.${name}`;

  return (
    <CopyRow tokenName={tokenName}>
      <span style={{ fontFamily: theme.font, fontSize: 10, color: theme.text.subtlest, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</span>
      <span style={{ fontFamily: theme.font, fontSize: 10, color: theme.text.subtlest }}>{description}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
        <button
          onClick={e => { e.stopPropagation(); setActive(false); setTimeout(() => setActive(true), 50); setTimeout(() => setActive(false), 650); }}
          style={{
            all: 'unset', cursor: 'pointer',
            padding: `${theme.spacing.xxs}px ${theme.spacing.sm}px`,
            borderRadius: theme.spacing.xxs,
            fontFamily: theme.font, fontSize: 11,
            background: theme.accent.default,
            color: theme.text.inverse,
          }}
        >
          Play
        </button>
        <div style={{
          width: 200, height: 32,
          borderRadius: theme.spacing.xxs,
          background: theme.bg.surface,
          border: `1px solid ${theme.border.subtle}`,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            top: '50%', transform: 'translateY(-50%)',
            left: active ? 'calc(100% - 28px)' : '4px',
            width: 24, height: 24,
            borderRadius: '50%',
            background: theme.accent.default,
            transition: active ? `left 500ms ${value}` : 'none',
          }} />
        </div>
      </div>
    </CopyRow>
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

export function MotionTokens() {
  return (
    <div style={{ background: theme.bg.page, minHeight: '100vh', padding: `${theme.spacing.xxl}px`, fontFamily: theme.font }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap" />

      <div style={{ marginBottom: theme.spacing.xxl }}>
        <h1 style={{ fontFamily: theme.font, fontSize: 26, fontWeight: 300, color: theme.text.default, letterSpacing: '-0.02em', marginBottom: theme.spacing.xxs }}>
          Motion Tokens
        </h1>
        <p style={{ fontFamily: theme.font, fontSize: 10, color: theme.text.subtlest, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Duration · Easing · click Play to preview · click row to copy token name
        </p>
      </div>

      <div style={{ marginBottom: theme.spacing.xxxl }}>
        <SectionHeader title="Duration" subtitle="5 steps from instant to slow" />
        <div style={{ display: 'grid', gridTemplateColumns: '160px 80px 200px 1fr', gap: theme.spacing.lg, padding: `0 ${theme.spacing.md}px ${theme.spacing.xs}px`, borderBottom: `1px solid ${theme.border.default}`, marginBottom: 0 }}>
          {['Token', 'Value', 'Use case', 'Preview'].map(h => (
            <span key={h} style={{ fontFamily: theme.font, fontSize: 9, color: theme.text.subtlest, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{h}</span>
          ))}
        </div>
        {DURATION_TOKENS.map(t => <DurationRow key={t.name} {...t} />)}
      </div>

      <div>
        <SectionHeader title="Easing" subtitle="5 curves for different interaction types" />
        <div style={{ display: 'grid', gridTemplateColumns: '160px 80px 200px 1fr', gap: theme.spacing.lg, padding: `0 ${theme.spacing.md}px ${theme.spacing.xs}px`, borderBottom: `1px solid ${theme.border.default}`, marginBottom: 0 }}>
          {['Token', 'Value', 'Use case', 'Preview'].map(h => (
            <span key={h} style={{ fontFamily: theme.font, fontSize: 9, color: theme.text.subtlest, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{h}</span>
          ))}
        </div>
        {EASING_TOKENS.map(t => <EasingRow key={t.name} {...t} />)}
      </div>
    </div>
  );
}

export default MotionTokens;