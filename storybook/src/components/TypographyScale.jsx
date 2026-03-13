import React, { useState } from 'react';

const FONT = "'DM Sans', system-ui, sans-serif";

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
        gap: 24,
        padding: '12px 16px',
        borderRadius: 8,
        cursor: 'pointer',
        transition: 'background 0.12s',
        background: copied ? '#f0fdf4' : 'transparent',
        borderBottom: '1px solid #ebebeb',
      }}
      onMouseEnter={e => { if (!copied) e.currentTarget.style.background = '#f5f5f5'; }}
      onMouseLeave={e => { if (!copied) e.currentTarget.style.background = copied ? '#f0fdf4' : 'transparent'; }}
    >
      <span style={{ fontFamily: FONT, fontSize: 11, color: copied ? '#16a34a' : '#888', transition: 'color 0.2s' }}>
        {copied ? '✓ copied' : tokenName}
      </span>
      <span style={{ fontFamily: FONT, fontSize: 11, color: '#aaa' }}>{px}px</span>
      <span style={{ fontFamily: FONT, fontSize: 11, color: '#ccc' }}>{rem}rem</span>
      <span style={{
        fontFamily: FONT, fontSize: px, color: '#111',
        lineHeight: 1.2, whiteSpace: 'nowrap',
        overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
        {PREVIEW_TEXT}
      </span>
    </div>
  );
}

export function TypographyScale({ base = 16, ratio = 1.2 }) {
  const [liveBase, setLiveBase] = useState(base);
  const [liveRatio, setLiveRatio] = useState(ratio);
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
    <div style={{ background: '#f5f5f5', minHeight: '100vh', padding: '40px 40px', fontFamily: FONT }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap" />

      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontFamily: FONT, fontSize: 26, fontWeight: 300, color: '#111', letterSpacing: '-0.02em', marginBottom: 4 }}>
          Typography Scale
        </h1>
        <p style={{ fontFamily: FONT, fontSize: 10, color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Modular scale · click row to copy token name
        </p>
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex', gap: 40, flexWrap: 'wrap',
        marginBottom: 48, padding: '20px 24px',
        background: '#fff', borderRadius: 10, border: '1px solid #e5e5e5',
        alignItems: 'flex-end',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <label style={{ fontFamily: FONT, fontSize: 9, color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Base size — {liveBase}px
          </label>
          <input
            type="range" min={12} max={24} step={1}
            value={liveBase}
            onChange={e => setLiveBase(Number(e.target.value))}
            style={{ width: 200, accentColor: 'oklch(52% 0.18 262)' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT, fontSize: 9, color: '#ccc' }}>
            <span>12px</span><span>24px</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <label style={{ fontFamily: FONT, fontSize: 9, color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Scale ratio — {selectedRatio.name} ({liveRatio})
          </label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {RATIOS.map(r => (
              <button
                key={r.value}
                onClick={() => setLiveRatio(r.value)}
                style={{
                  all: 'unset', cursor: 'pointer',
                  padding: '4px 10px', borderRadius: 4,
                  fontFamily: FONT, fontSize: 11,
                  background: liveRatio === r.value ? 'oklch(52% 0.18 262)' : '#ebebeb',
                  color: liveRatio === r.value ? '#fff' : '#666',
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
            padding: '8px 16px', borderRadius: 6,
            fontFamily: FONT, fontSize: 12, fontWeight: 500,
            background: exported ? '#f0fdf4' : '#fff',
            color: exported ? '#16a34a' : '#888',
            border: `1px solid ${exported ? '#86efac' : '#e5e5e5'}`,
            transition: 'all 0.2s',
          }}
        >
          {exported ? '✓ Copied to clipboard' : 'Export tokens.json'}
        </button>
      </div>

      {/* Column headers */}
      <div style={{
        display: 'grid', gridTemplateColumns: '100px 60px 60px 1fr',
        gap: 24, padding: '0 16px 8px',
        borderBottom: '1px solid #e5e5e5', marginBottom: 0,
      }}>
        {['Token', 'px', 'rem', 'Preview'].map(h => (
          <span key={h} style={{ fontFamily: FONT, fontSize: 9, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
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