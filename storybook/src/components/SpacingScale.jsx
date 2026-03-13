import React, { useState, useEffect } from 'react';

const FONT = "'DM Sans', system-ui, sans-serif";

const SCALE = [4, 8, 12, 16, 24, 32, 48, 64];

const TOKENS = [
  { name: 'xxs',  index: 0 },
  { name: 'xs',   index: 1 },
  { name: 'sm',   index: 2 },
  { name: 'md',   index: 3 },
  { name: 'lg',   index: 4 },
  { name: 'xl',   index: 5 },
  { name: 'xxl',  index: 6 },
  { name: 'xxxl', index: 7 },
];

const DENSITY_SHIFT = {
  comfortable: 0,
  compact: -1,
  dense: -2,
};

const DENSITY_LABELS = {
  comfortable: 'Comfortable',
  compact: 'Compact',
  dense: 'Dense',
};

function resolveIndex(index, shift) {
  const resolved = Math.max(0, index + shift);
  return Math.min(resolved, SCALE.length - 1);
}

function SpacingRow({ name, index, shift }) {
  const [copied, setCopied] = useState(false);
  const tokenName = `spacing.${name}`;
  const resolvedIdx = resolveIndex(index, shift);
  const basePx = SCALE[index];
  const resolvedPx = SCALE[resolvedIdx];
  const changed = resolvedPx !== basePx;

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
        gridTemplateColumns: '100px 60px 60px 1fr 80px',
        alignItems: 'center',
        gap: 24,
        padding: '10px 16px',
        borderRadius: 8,
        cursor: 'pointer',
        transition: 'background 0.12s',
        background: copied ? '#0f2a1a' : 'transparent',
        borderBottom: '1px solid #111',
      }}
      onMouseEnter={e => { if (!copied) e.currentTarget.style.background = '#161616'; }}
      onMouseLeave={e => { if (!copied) e.currentTarget.style.background = copied ? '#0f2a1a' : 'transparent'; }}
    >
      {/* Token name */}
      <span style={{ fontFamily: FONT, fontSize: 12, color: copied ? '#4ade80' : '#888', transition: 'color 0.2s' }}>
        {copied ? '✓ copied' : tokenName}
      </span>

      {/* Base px */}
      <span style={{ fontFamily: FONT, fontSize: 11, color: '#333', textAlign: 'right', textDecoration: changed ? 'line-through' : 'none' }}>
        {basePx}px
      </span>

      {/* Resolved px */}
      <span style={{ fontFamily: FONT, fontSize: 11, color: changed ? '#f59e0b' : '#555', textAlign: 'right', fontWeight: changed ? 500 : 400 }}>
        {resolvedPx}px
      </span>

      {/* Visual bar */}
      <div style={{
        height: 20,
        width: resolvedPx * 2,
        background: changed ? 'oklch(72% 0.18 60)' : 'oklch(62% 0.18 262)',
        borderRadius: 3,
        minWidth: 4,
        transition: 'width 0.25s ease, background 0.2s',
      }} />

      {/* Index badge */}
      <span style={{
        fontFamily: FONT, fontSize: 9,
        color: '#2a2a2a',
        textAlign: 'right',
        letterSpacing: '0.05em',
      }}>
        idx {resolvedIdx}
      </span>
    </div>
  );
}

export function SpacingScale() {
  const [density, setDensity] = useState('comfortable');

  // Sync with Storybook global density toolbar
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const el = document.querySelector('[data-density]');
      if (el) setDensity(el.dataset.density || 'comfortable');
    });
    observer.observe(document.body, { attributes: true, subtree: true });
    // Initial read
    const el = document.querySelector('[data-density]');
    if (el) setDensity(el.dataset.density || 'comfortable');
    return () => observer.disconnect();
  }, []);

  const shift = DENSITY_SHIFT[density] ?? 0;

  return (
    <div style={{ background: '#0f0f0f', minHeight: '100vh', padding: '40px 40px', fontFamily: FONT }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap" />

      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontFamily: FONT, fontSize: 26, fontWeight: 300, color: '#fff', letterSpacing: '-0.02em', marginBottom: 4 }}>
          Spacing Scale
        </h1>
        <p style={{ fontFamily: FONT, fontSize: 10, color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          8 steps · 4px base · index-based · density: <span style={{ color: shift === 0 ? '#555' : '#f59e0b' }}>{DENSITY_LABELS[density]}</span>
          {shift !== 0 && <span style={{ color: '#f59e0b' }}> (shift {shift})</span>}
        </p>
      </div>

      {/* Density switcher — local fallback if toolbar not used */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 32 }}>
        {Object.keys(DENSITY_SHIFT).map(d => (
          <button
            key={d}
            onClick={() => setDensity(d)}
            style={{
              all: 'unset', cursor: 'pointer',
              padding: '4px 12px', borderRadius: 4,
              fontFamily: FONT, fontSize: 11,
              background: density === d ? 'oklch(62% 0.18 262)' : '#1a1a1a',
              color: density === d ? '#fff' : '#555',
              border: `1px solid ${density === d ? 'transparent' : '#222'}`,
              transition: 'all 0.15s',
            }}
          >
            {DENSITY_LABELS[d]}
          </button>
        ))}
      </div>

      {/* Column headers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '100px 60px 60px 1fr 80px',
        gap: 24,
        padding: '0 16px 8px',
        borderBottom: '1px solid #1a1a1a',
        marginBottom: 0,
      }}>
        {['Token', 'Base', 'Resolved', 'Visual', 'Index'].map(h => (
          <span key={h} style={{
            fontFamily: FONT, fontSize: 9, color: '#333',
            textTransform: 'uppercase', letterSpacing: '0.1em',
            textAlign: ['Base', 'Resolved'].includes(h) ? 'right' : 'left',
          }}>{h}</span>
        ))}
      </div>

      {TOKENS.map(({ name, index }) => (
        <SpacingRow key={name} name={name} index={index} shift={shift} />
      ))}
    </div>
  );
}

export default SpacingScale;