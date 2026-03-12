import React, { useState, useCallback } from 'react';
import {
  parseOklch, oklchToRgb, parseHex,
  apcaContrast, apcaLevel,
  WHITE, BLACK,
} from '../utils/contrast';

// ─── Contrast Badge ──────────────────────────────────────────────────────────

const LEVEL_STYLES = {
  'Lc 75+': { bg: '#052e16', text: '#4ade80' },
  'Lc 60+': { bg: '#0f2a1a', text: '#86efac' },
  'Lc 45+': { bg: '#1c2a1a', text: '#bef264' },
  'Lc 30+': { bg: '#1c1917', text: '#a8a29e' },
  'Low':    { bg: '#1c0a0a', text: '#f87171' },
};

function ContrastBadge({ against, lc, level }) {
  const s = LEVEL_STYLES[level] ?? LEVEL_STYLES['Low'];
  const abs = Math.abs(lc).toFixed(0);
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 4,
      padding: '2px 5px',
      borderRadius: 3,
      background: s.bg,
      fontFamily: "'DM Sans', system-ui, sans-serif",
      fontSize: 9,
      lineHeight: 1.4,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ opacity: 0.6 }}>{against === 'white' ? '⬜' : '⬛'}</span>
      <span style={{ color: s.text, fontWeight: 600 }}>Lc {abs}</span>
      <span style={{ color: s.text, fontSize: 8, opacity: 0.75 }}>{level}</span>
    </div>
  );
}

// ─── Single shade cell ────────────────────────────────────────────────────────

export function ShadeCell({ colorName, shadeIndex, value }) {
  const [copied, setCopied] = useState(false);

  const oklch = parseOklch(value);
  const rgb = oklch ? oklchToRgb(oklch.L, oklch.C, oklch.H) : [128, 128, 128];
  const lcWhite = apcaContrast(rgb, WHITE);
  const lcBlack = apcaContrast(rgb, BLACK);

  const tokenName = `color.shade.${colorName}.${shadeIndex}`;

  const handleCopy = useCallback(() => {
    navigator.clipboard?.writeText(tokenName).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    });
  }, [tokenName]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', borderRadius: 6, overflow: 'hidden' }}>
      <div
        title={value}
        onClick={handleCopy}
        style={{
          height: 56,
          background: value,
          cursor: 'pointer',
          position: 'relative',
          transition: 'transform 0.12s ease',
          flexShrink: 0,
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scaleY(1.08)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scaleY(1)'}
      >
        {copied && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.45)',
            fontSize: 9, color: '#fff',
            fontFamily: "'DM Sans', system-ui, sans-serif",
            letterSpacing: '0.05em',
          }}>
            copied
          </div>
        )}
      </div>

      <div style={{
        padding: '6px 4px 5px',
        background: '#111',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}>
        <button
          onClick={handleCopy}
          title={`Copy token: ${tokenName}`}
          style={{
            all: 'unset', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 3, marginBottom: 1,
          }}
        >
          <span style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 9,
            color: copied ? '#a3e635' : '#555',
            letterSpacing: '0.04em',
            transition: 'color 0.2s',
          }}>
            {shadeIndex}
          </span>
          <span style={{ fontSize: 7, color: '#333', fontFamily: "'DM Sans', system-ui, sans-serif" }}>⌘</span>
        </button>

        <ContrastBadge against="white" lc={lcWhite} level={apcaLevel(lcWhite)} />
        <ContrastBadge against="black" lc={lcBlack} level={apcaLevel(lcBlack)} />
      </div>
    </div>
  );
}

// ─── Brand token row ─────────────────────────────────────────────────────────

export function BrandTokenRow({ colorName, value }) {
  const [copied, setCopied] = useState(false);
  const tokenName = `color.brand.${colorName}`;
  const rgb = parseHex(value);
  const lcWhite = apcaContrast(rgb, WHITE);
  const lcBlack = apcaContrast(rgb, BLACK);

  const handleCopy = () => {
    navigator.clipboard?.writeText(tokenName).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    });
  };

  return (
    <div style={{
      marginTop: 8,
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 14px',
      background: '#161616', borderRadius: 8, border: '1px solid #222',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 6,
        background: value, flexShrink: 0,
        boxShadow: '0 0 0 1px rgba(255,255,255,0.06)',
      }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 9,
          color: '#444', textTransform: 'uppercase',
          letterSpacing: '0.1em', marginBottom: 3,
        }}>
          Brand token — exact color, outside shade scale
        </div>
        <button
          onClick={handleCopy}
          title={`Copy: ${tokenName}`}
          style={{ all: 'unset', cursor: 'pointer' }}
        >
          <span style={{
            fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 11,
            color: copied ? '#a3e635' : '#888',
            transition: 'color 0.2s',
          }}>
            {copied ? '✓ copied' : tokenName}
          </span>
        </button>
        <div style={{
          fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 10,
          color: '#444', marginTop: 2,
        }}>{value}</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
        <ContrastBadge against="white" lc={lcWhite} level={apcaLevel(lcWhite)} />
        <ContrastBadge against="black" lc={lcBlack} level={apcaLevel(lcBlack)} />
      </div>
    </div>
  );
}