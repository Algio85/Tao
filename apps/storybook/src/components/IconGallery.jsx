import React, { useState, useMemo } from 'react';
import * as PhosphorIcons from '@phosphor-icons/react';
import { theme } from '../tokens/theme.js';

const FONT = theme.font;

const WEIGHT_BEFORE_ICON = ['Thin', 'Light', 'Bold', 'Fill', 'Duotone'];
const EXCLUDE = new Set(['IconContext', 'IconBase', 'SSR', 'default', 'createIcon', 'Icon']);

const ALL_ICONS = Object.keys(PhosphorIcons)
  .filter(key => {
    if (EXCLUDE.has(key)) return false;
    // Keep only Icon-suffixed base exports
    if (!key.endsWith('Icon')) return false;
    // Skip weight-specific: AcornThinIcon, AcornBoldIcon etc.
    if (WEIGHT_BEFORE_ICON.some(w => key.endsWith(w + 'Icon'))) return false;
    // Must be truthy (don't care about typeof — could be class or function)
    return !!PhosphorIcons[key];
  })
  .map(key => ({
    key,
    displayName: key.slice(0, -4),
  }))
  .sort((a, b) => a.displayName.localeCompare(b.displayName));

const WEIGHTS = ['thin', 'light', 'regular', 'bold', 'fill', 'duotone'];
const SIZES   = [16, 20, 24, 32, 48];

function PillSelector({ label, options, value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{
        fontFamily: FONT, fontSize: 10, color: theme.text.subtlest,
        textTransform: 'uppercase', letterSpacing: '0.08em', minWidth: 44,
      }}>
        {label}
      </span>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {options.map(opt => (
          <button
            key={String(opt)}
            onClick={() => onChange(opt)}
            style={{
              all: 'unset',
              cursor: 'pointer',
              padding: '3px 10px',
              borderRadius: 4,
              fontFamily: FONT,
              fontSize: 11,
              fontWeight: value === opt ? 500 : 400,
              background: value === opt ? theme.accent.default : theme.bg.surface,
              color: value === opt ? theme.text.inverse : theme.text.subtle,
              border: `1px solid ${value === opt ? theme.accent.default : theme.border.subtle}`,
              transition: 'all 0.12s',
            }}
          >
            {String(opt)}
          </button>
        ))}
      </div>
    </div>
  );
}

function IconCell({ iconKey, displayName, weight, size, copied, onCopy }) {
  const IconComponent = PhosphorIcons[iconKey];
  if (!IconComponent) return null;
  const isCopied = copied === iconKey;

  return (
    <div
      onClick={() => onCopy(iconKey)}
      title={`import { ${iconKey} } from '@phosphor-icons/react'`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding: '12px 8px',
        borderRadius: 8,
        cursor: 'pointer',
        background: isCopied ? '#f0fdf4' : 'transparent',
        border: `1px solid ${isCopied ? '#86efac' : 'transparent'}`,
        transition: 'background 0.12s, border-color 0.12s',
      }}
      onMouseEnter={e => { if (!isCopied) e.currentTarget.style.background = theme.bg.hover; }}
      onMouseLeave={e => { if (!isCopied) e.currentTarget.style.background = isCopied ? '#f0fdf4' : 'transparent'; }}
    >
      <IconComponent weight={weight} size={size} color={isCopied ? '#16a34a' : theme.text.default} />
      <span style={{
        fontFamily: FONT,
        fontSize: 9,
        color: isCopied ? '#16a34a' : theme.text.subtlest,
        textAlign: 'center',
        lineHeight: 1.3,
        wordBreak: 'break-word',
        maxWidth: 80,
        transition: 'color 0.2s',
      }}>
        {isCopied ? '✓ copied' : displayName}
      </span>
    </div>
  );
}

export function IconGallery({ weight = 'regular', onWeightChange }) {
  const [size, setSize] = useState(24);
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return ALL_ICONS;
    const q = search.toLowerCase();
    return ALL_ICONS.filter(({ displayName }) => displayName.toLowerCase().includes(q));
  }, [search]);

  const handleCopy = (iconKey) => {
    const importStr = `import { ${iconKey} } from '@phosphor-icons/react';`;
    navigator.clipboard?.writeText(importStr).then(() => {
      setCopied(iconKey);
      setTimeout(() => setCopied(null), 1400);
    });
  };

  return (
    <div style={{ background: theme.bg.page, minHeight: '100vh', padding: '40px', fontFamily: FONT }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap" />

      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: FONT, fontSize: 26, fontWeight: 300, color: theme.text.default, letterSpacing: '-0.02em', marginBottom: 4 }}>
          Icons
        </h1>
        <p style={{ fontFamily: FONT, fontSize: 10, color: theme.text.subtlest, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Phosphor Icons · {filtered.length} of {ALL_ICONS.length} · click to copy import
        </p>
      </div>

      {/* Debug — remove once working */}
      {ALL_ICONS.length === 0 && (
        <div style={{ padding: 12, background: '#fef2f2', borderRadius: 6, marginBottom: 16, fontFamily: 'monospace', fontSize: 10, color: '#991b1b' }}>
          0 icons. typeof AcornIcon = {typeof PhosphorIcons['AcornIcon']}. Keys ending in Icon: {Object.keys(PhosphorIcons).filter(k => k.endsWith('Icon') && !['IconContext','IconBase'].includes(k)).length}
        </div>
      )}

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        alignItems: 'center',
        padding: 16,
        background: theme.bg.surface,
        borderRadius: 8,
        border: `1px solid ${theme.border.subtle}`,
        marginBottom: 32,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '1 1 200px' }}>
          <span style={{ fontFamily: FONT, fontSize: 10, color: theme.text.subtlest, textTransform: 'uppercase', letterSpacing: '0.08em', minWidth: 44 }}>
            Search
          </span>
          <input
            type="text"
            placeholder="Filter icons…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              fontFamily: FONT, fontSize: 12,
              color: theme.text.default,
              background: theme.bg.page,
              border: `1px solid ${theme.border.subtle}`,
              borderRadius: 6,
              padding: '4px 10px',
              outline: 'none',
              width: '100%',
              maxWidth: 240,
            }}
          />
        </div>
        <PillSelector label="Weight" options={WEIGHTS} value={weight} onChange={w => onWeightChange?.(w)} />
        <PillSelector label="Size"   options={SIZES}   value={size}   onChange={setSize}   />
      </div>

      {filtered.length === 0 && ALL_ICONS.length > 0 && (
        <div style={{ padding: '48px 0', textAlign: 'center' }}>
          <p style={{ fontFamily: FONT, fontSize: 13, color: theme.text.subtlest }}>
            No icons matching "{search}"
          </p>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))',
        gap: 4,
      }}>
        {filtered.map(({ key, displayName }) => (
          <IconCell
            key={key}
            iconKey={key}
            displayName={displayName}
            weight={weight}
            size={size}
            copied={copied}
            onCopy={handleCopy}
          />
        ))}
      </div>
    </div>
  );
}

export default IconGallery;
