import React, { useState } from 'react';

const FONT = "'DM Sans', system-ui, sans-serif";

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
        gap: 24,
        padding: '12px 16px',
        borderRadius: 8,
        cursor: 'pointer',
        transition: 'background 0.12s',
        background: copied ? '#0f2a1a' : 'transparent',
        borderBottom: '1px solid #111',
        ...style,
      }}
      onMouseEnter={e => { if (!copied) e.currentTarget.style.background = '#161616'; }}
      onMouseLeave={e => { if (!copied) e.currentTarget.style.background = copied ? '#0f2a1a' : 'transparent'; }}
    >
      <span style={{ fontFamily: FONT, fontSize: 11, color: copied ? '#4ade80' : '#555', transition: 'color 0.2s' }}>
        {copied ? '✓ copied' : tokenName}
      </span>
      {children}
    </div>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h2 style={{ fontFamily: FONT, fontSize: 16, fontWeight: 400, color: '#fff', marginBottom: 4 }}>{title}</h2>
      {subtitle && <p style={{ fontFamily: FONT, fontSize: 10, color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{subtitle}</p>}
    </div>
  );
}

function ColumnHeaders({ columns }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: columns,
      gap: 24,
      padding: '0 16px 8px',
      borderBottom: '1px solid #1a1a1a',
      marginBottom: 0,
    }}>
      {['Token', 'Value', 'Preview'].map(h => (
        <span key={h} style={{ fontFamily: FONT, fontSize: 9, color: '#333', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {h}
        </span>
      ))}
    </div>
  );
}

export function BorderTokens() {
  return (
    <div style={{ background: '#0f0f0f', minHeight: '100vh', padding: '40px 40px', fontFamily: FONT }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap" />

      <div style={{ marginBottom: 48 }}>
        <h1 style={{ fontFamily: FONT, fontSize: 26, fontWeight: 300, color: '#fff', letterSpacing: '-0.02em', marginBottom: 4 }}>
          Border Tokens
        </h1>
        <p style={{ fontFamily: FONT, fontSize: 10, color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Radius · Width · click row to copy token name
        </p>
      </div>

      {/* Radius */}
      <div style={{ marginBottom: 64 }}>
        <SectionHeader title="Border Radius" subtitle="8 steps — from sharp to circular" />
        <ColumnHeaders columns="160px 60px 1fr" />
        {Object.entries(RADIUS_TOKENS).map(([name, { value, px, comment }]) => (
          <CopyRow key={name} tokenName={`radius.${name}`} style={{ gridTemplateColumns: '160px 60px 1fr' }}>
            <span style={{ fontFamily: FONT, fontSize: 11, color: '#444' }}>{value}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, background: 'oklch(62% 0.18 262)', borderRadius: px, flexShrink: 0 }} />
              {(name === 'pill' || name === 'circular') && (
                <div style={{ width: name === 'pill' ? 96 : 48, height: 48, background: 'oklch(62% 0.18 262 / 0.4)', borderRadius: px, flexShrink: 0 }} />
              )}
              {comment && <span style={{ fontFamily: FONT, fontSize: 10, color: '#333', fontStyle: 'italic' }}>{comment}</span>}
            </div>
          </CopyRow>
        ))}
      </div>

      {/* Border Width */}
      <div>
        <SectionHeader title="Border Width" subtitle="4 steps — from hairline to thick" />
        <ColumnHeaders columns="160px 60px 1fr" />
        {Object.entries(WIDTH_TOKENS).map(([name, { value, px }]) => (
          <CopyRow key={name} tokenName={`border.width.${name}`} style={{ gridTemplateColumns: '160px 60px 1fr' }}>
            <span style={{ fontFamily: FONT, fontSize: 11, color: '#444' }}>{value}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 160, height: px, background: 'oklch(62% 0.18 262)', borderRadius: px }} />
              <div style={{ width: 48, height: 32, border: `${px}px solid oklch(62% 0.18 262)`, borderRadius: 6, background: 'transparent' }} />
            </div>
          </CopyRow>
        ))}
      </div>
    </div>
  );
}

export default BorderTokens;