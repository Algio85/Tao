import React, { useState } from 'react';
import { ShadeCell, BrandTokenRow } from './ColorSwatch';
import defaultTokens from '../tokens/shades.json';

const FONT = "'DM Sans', system-ui, sans-serif";

// ─── Shade generator (runs in browser) ───────────────────────────────────────

function hexToLinear(c) {
  c = c / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function hexToOklch(hex) {
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return null;
  const r = hexToLinear(parseInt(hex.slice(1, 3), 16));
  const g = hexToLinear(parseInt(hex.slice(3, 5), 16));
  const b = hexToLinear(parseInt(hex.slice(5, 7), 16));
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
  const l_ = Math.cbrt(l), m_ = Math.cbrt(m), s_ = Math.cbrt(s);
  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
  const bk = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;
  const C = Math.sqrt(a * a + bk * bk);
  const H = ((Math.atan2(bk, a) * 180) / Math.PI + 360) % 360;
  return { L, C, H };
}

function generateShades(hex) {
  const oklch = hexToOklch(hex);
  if (!oklch) return null;
  const { C: baseC, H } = oklch;
  const L_MAX = 0.97, L_MIN = 0.10;
  const shades = {};
  for (let i = 1; i <= 16; i++) {
    const t = (i - 1) / 15;
    const L = L_MAX + t * (L_MIN - L_MAX);
    const chromaScale = 1 - Math.pow(2 * t - 1, 4) * 0.5;
    const C = baseC * chromaScale;
    shades[String(i)] = {
      value: `oklch(${(L * 100).toFixed(2)}% ${C.toFixed(4)} ${H.toFixed(2)})`,
    };
  }
  return shades;
}

// ─── Default base colors ──────────────────────────────────────────────────────

const DEFAULT_BASE = Object.fromEntries(
  Object.entries(defaultTokens.color.brand).map(([name, token]) => [name, token.value])
);

// ─── Legend ───────────────────────────────────────────────────────────────────

const LEGEND = [
  { label: 'Lc 75+', desc: 'body text',          bg: '#052e16', text: '#4ade80' },
  { label: 'Lc 60+', desc: 'large text / UI',    bg: '#0f2a1a', text: '#86efac' },
  { label: 'Lc 45+', desc: 'large bold / icons', bg: '#1c2a1a', text: '#bef264' },
  { label: 'Lc 30+', desc: 'decorative',         bg: '#1c1917', text: '#a8a29e' },
  { label: 'Low',    desc: '< Lc 30',            bg: '#1c0a0a', text: '#f87171' },
];

function Legend() {
  return (
    <div style={{ display: 'flex', gap: 16, marginBottom: 40, alignItems: 'center', flexWrap: 'wrap' }}>
      {LEGEND.map(({ label, desc, bg, text }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ background: bg, color: text, padding: '2px 7px', borderRadius: 3, fontFamily: FONT, fontSize: 10, fontWeight: 700 }}>{label}</span>
          <span style={{ fontFamily: FONT, fontSize: 10, color: '#444' }}>{desc}</span>
        </div>
      ))}
      <div style={{ marginLeft: 'auto', fontFamily: FONT, fontSize: 9, color: '#333' }}>
        click swatch to copy token name
      </div>
    </div>
  );
}

// ─── Color editor row ─────────────────────────────────────────────────────────

function ColorEditor({ colorName, hex, onChange }) {
  const [input, setInput] = useState(hex);
  const isValid = /^#[0-9a-fA-F]{6}$/.test(input);

  const handleChange = (val) => {
    setInput(val);
    if (/^#[0-9a-fA-F]{6}$/.test(val)) onChange(val);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <input
        type="color"
        value={isValid ? input : hex}
        onChange={e => handleChange(e.target.value)}
        style={{ width: 24, height: 24, border: 'none', borderRadius: 4, padding: 0, cursor: 'pointer', background: 'none' }}
      />
      <input
        type="text"
        value={input}
        onChange={e => handleChange(e.target.value)}
        spellCheck={false}
        style={{
          fontFamily: FONT, fontSize: 11,
          color: isValid ? '#aaa' : '#ef4444',
          background: 'transparent', border: 'none',
          outline: 'none', width: 72,
        }}
      />
    </div>
  );
}

// ─── Single color section ─────────────────────────────────────────────────────

function ColorSection({ colorName, brandHex, showBrandToken }) {
  const shades = generateShades(brandHex);
  if (!shades) return null;

  return (
    <section style={{ marginBottom: 48 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <h2 style={{ fontFamily: FONT, fontSize: 14, fontWeight: 500, color: '#fff', textTransform: 'capitalize' }}>
          {colorName}
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)', gap: 4 }}>
        {Array.from({ length: 16 }, (_, i) => i + 1).map((i) => (
          <ShadeCell
            key={i}
            colorName={colorName}
            shadeIndex={i}
            value={shades[String(i)].value}
          />
        ))}
      </div>

      {showBrandToken && (
        <BrandTokenRow colorName={colorName} value={brandHex} />
      )}
    </section>
  );
}

// ─── ColorPalette ─────────────────────────────────────────────────────────────

export function ColorPalette({
  colors = Object.keys(DEFAULT_BASE),
  showBrandToken = true,
  baseColors = DEFAULT_BASE,
}) {
  const [liveColors, setLiveColors] = useState(baseColors);

  const handleChange = (name, hex) => {
    setLiveColors(prev => ({ ...prev, [name]: hex }));
  };

  return (
    <div style={{ background: '#0f0f0f', minHeight: '100vh', padding: '40px 40px', fontFamily: FONT }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap" />

      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: FONT, fontSize: 26, fontWeight: 300, color: '#fff', letterSpacing: '-0.02em', marginBottom: 4 }}>
          Color Palette
        </h1>
        <p style={{ fontFamily: FONT, fontSize: 10, color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          OKLCH · 16 shades per hue · APCA contrast (Lc) vs white and black
        </p>
      </div>

      {/* Live base color editors */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '8px 24px',
        marginBottom: 40, padding: '16px 20px',
        background: '#161616', borderRadius: 10, border: '1px solid #222',
      }}>
        <div style={{ width: '100%', fontFamily: FONT, fontSize: 9, color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
          Base colors — edit to live update shades
        </div>
        {colors.map(name => (
          <div key={name} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontFamily: FONT, fontSize: 9, color: '#555', textTransform: 'capitalize' }}>{name}</span>
            <ColorEditor
              colorName={name}
              hex={liveColors[name] ?? DEFAULT_BASE[name]}
              onChange={(hex) => handleChange(name, hex)}
            />
          </div>
        ))}
      </div>

      <Legend />

      {colors.map(name => (
        <ColorSection
          key={name + (liveColors[name] ?? '')}
          colorName={name}
          brandHex={liveColors[name] ?? DEFAULT_BASE[name]}
          showBrandToken={showBrandToken}
        />
      ))}
    </div>
  );
}

export default ColorPalette;