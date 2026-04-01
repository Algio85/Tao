import React, { useState, useEffect } from 'react';
import { theme } from '../tokens/theme.js';

const RATIOS = [
  { name: 'Minor Second',   value: 1.067 },
  { name: 'Major Second',   value: 1.125 },
  { name: 'Minor Third',    value: 1.200 },
  { name: 'Major Third',    value: 1.250 },
  { name: 'Perfect Fourth', value: 1.333 },
  { name: 'Golden Ratio',   value: 1.618 },
];

const STEPS = [
  { name: 'xs',   exp: -2 },
  { name: 'sm',   exp: -1 },
  { name: 'md',   exp:  0 },
  { name: 'lg',   exp:  1 },
  { name: 'xl',   exp:  2 },
  { name: 'xxl',  exp:  3 },
  { name: 'xxxl', exp:  4 },
];

const PREVIEW_TEXT = 'The quick brown fox jumps over the lazy dog';

function generateScale(base, ratio) {
  return STEPS.map(({ name, exp }) => {
    const px = Math.round(base * Math.pow(ratio, exp));
    const rem = (px / 16).toFixed(3).replace(/\.?0+$/, '');
    return { name, px, rem };
  });
}

function TypeRow({ name, px, rem, copied, onCopy }) {
  const tokenName = `typography.size.${name}`;
  return (
    <div
      onClick={onCopy}
      title={`Copy: ${tokenName}`}
      style={{
        display: 'grid',
        gridTemplateColumns: '100px 60px 60px 1fr',
        alignItems: 'center',
        gap: theme.spacing.lg,
        padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
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
      <span style={{ fontFamily: theme.font, fontSize: 11, color: theme.text.subtlest }}>{px}px</span>
      <span style={{ fontFamily: theme.font, fontSize: 11, color: theme.text.subtlest }}>{rem}rem</span>
      <span style={{
        fontFamily: theme.font, fontSize: px, color: theme.text.default,
        lineHeight: 1.2, whiteSpace: 'nowrap',
        overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
        {PREVIEW_TEXT}
      </span>
    </div>
  );
}

const SCROLL_KEY = 'tao-typescale-scroll';

export function TypographyScale({ base = 16, ratio = 1.2, onBaseChange, onRatioChange }) {
  const [liveBase, setLiveBase] = useState(base);
  const [liveRatio, setLiveRatio] = useState(ratio);

  // Restore scroll position after globals update causes re-mount
  useEffect(() => {
    const saved = sessionStorage.getItem(SCROLL_KEY);
    if (saved !== null) {
      const y = parseInt(saved, 10);
      sessionStorage.removeItem(SCROLL_KEY);
      requestAnimationFrame(() => {
        window.scrollTo({ top: y, behavior: 'instant' });
        requestAnimationFrame(() => window.scrollTo({ top: y, behavior: 'instant' }));
      });
    }
  }, []);

  // Sync local state when globals-driven props change (e.g. navigating back to this story)
  useEffect(() => { setLiveBase(base); }, [base]);
  useEffect(() => { setLiveRatio(ratio); }, [ratio]);
  const [copied, setCopied] = useState(null);
  const [exported, setExported] = useState(false);

  const scale = generateScale(liveBase, liveRatio);
  const selectedRatio = RATIOS.find(r => r.value === liveRatio) ?? RATIOS[2];

  const handleCopy = (name) => {
    navigator.clipboard?.writeText(`typography.size.${name}`).then(() => {
      setCopied(name);
      setTimeout(() => setCopied(null), 1400);
    });
  };

  const handleExport = () => {
    const config = {
      typography: {
        config: {
          base:  { value: liveBase,  type: 'number', comment: 'Base font size in px' },
          ratio: { value: liveRatio, type: 'number', comment: `Modular scale ratio (${selectedRatio.name})` },
        },
        size: Object.fromEntries(
          scale.map(({ name, px }) => [
            name,
            { value: `${px}px`, type: 'typography', comment: `${selectedRatio.name} — ${name}` }
          ])
        ),
      },
    };
    navigator.clipboard?.writeText(JSON.stringify(config, null, 2)).then(() => {
      setExported(true);
      setTimeout(() => setExported(false), 2000);
    });
  };

  return (
    <div style={{ background: theme.bg.page, minHeight: '100vh', padding: `${theme.spacing.xxl}px`, fontFamily: theme.font }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap" />

      <div style={{ marginBottom: theme.spacing.xxl }}>
        <h1 style={{ fontFamily: theme.font, fontSize: 26, fontWeight: 300, color: theme.text.default, letterSpacing: '-0.02em', marginBottom: theme.spacing.xxs }}>
          Typography Scale
        </h1>
        <p style={{ fontFamily: theme.font, fontSize: 10, color: theme.text.subtlest, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Modular scale · click row to copy token name
        </p>
      </div>

      <div style={{
        display: 'flex', gap: theme.spacing.xxl, flexWrap: 'wrap',
        marginBottom: theme.spacing.xxl, padding: `${theme.spacing.md}px ${theme.spacing.lg}px`,
        background: theme.bg.raised, borderRadius: theme.spacing.sm, border: `1px solid ${theme.border.subtle}`,
        alignItems: 'flex-end',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xs }}>
          <label style={{ fontFamily: theme.font, fontSize: 9, color: theme.text.subtlest, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Base size — {liveBase}px
          </label>
          <input
            type="range" min={12} max={24} step={1}
            value={liveBase}
            onInput={e => setLiveBase(Number(e.target.value))}
            onChange={e => { const v = Number(e.target.value); setLiveBase(v); onBaseChange?.(v); }}
            style={{ width: 200, accentColor: theme.accent.default }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: theme.font, fontSize: 9, color: theme.text.subtlest }}>
            <span>12px</span><span>24px</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xs }}>
          <label style={{ fontFamily: theme.font, fontSize: 9, color: theme.text.subtlest, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Scale ratio — {selectedRatio.name} ({liveRatio})
          </label>
          <div style={{ display: 'flex', gap: theme.spacing.xs, flexWrap: 'wrap' }}>
            {RATIOS.map(r => (
              <button
                key={r.value}
                onClick={() => { setLiveRatio(r.value); onRatioChange?.(r.value); }}
                style={{
                  all: 'unset', cursor: 'pointer',
                  padding: `${theme.spacing.xxs}px ${theme.spacing.xs}px`,
                  borderRadius: theme.spacing.xxs,
                  fontFamily: theme.font, fontSize: 11,
                  background: liveRatio === r.value ? theme.accent.default : theme.bg.surface,
                  color: liveRatio === r.value ? theme.text.inverse : theme.text.subtle,
                  transition: 'all 0.15s',
                }}
              >
                {r.name}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleExport}
          style={{
            all: 'unset', cursor: 'pointer',
            marginLeft: 'auto',
            padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
            borderRadius: theme.spacing.xs,
            fontFamily: theme.font, fontSize: 12, fontWeight: 500,
            background: exported ? '#f0fdf4' : theme.bg.raised,
            color: exported ? '#16a34a' : theme.text.subtle,
            border: `1px solid ${exported ? '#86efac' : theme.border.subtle}`,
            transition: 'all 0.2s',
          }}
        >
          {exported ? '✓ Copied to clipboard' : 'Export tokens.json'}
        </button>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: '100px 60px 60px 1fr',
        gap: theme.spacing.lg, padding: `0 ${theme.spacing.md}px ${theme.spacing.xs}px`,
        borderBottom: `1px solid ${theme.border.subtle}`, marginBottom: 0,
      }}>
        {['Token', 'px', 'rem', 'Preview'].map(h => (
          <span key={h} style={{ fontFamily: theme.font, fontSize: 9, color: theme.text.subtlest, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {h}
          </span>
        ))}
      </div>

      {[...scale].reverse().map(({ name, px, rem }) => (
        <TypeRow
          key={name} name={name} px={px} rem={rem}
          copied={copied === name}
          onCopy={() => handleCopy(name)}
        />
      ))}
    </div>
  );
}

export default TypographyScale;