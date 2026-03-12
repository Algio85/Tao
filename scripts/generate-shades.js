#!/usr/bin/env node

/**
 * Generates 16 OKLCH shades for each base color.
 * Shade 1 = nearest to white, Shade 16 = nearest to black.
 * Also outputs a `brand` token equal to the original base color (outside shades).
 */

const fs = require("fs");
const path = require("path");

// Minimal hex → OKLCH converter (via linear RGB → XYZ D65 → OKLab → OKLCH)
function hexToLinear(c) {
  c = c / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function linearToOklab(r, g, b) {
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
  const l_ = Math.cbrt(l), m_ = Math.cbrt(m), s_ = Math.cbrt(s);
  return [
    0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_,
  ];
}

function hexToOklch(hex) {
  const r = hexToLinear(parseInt(hex.slice(1, 3), 16));
  const g = hexToLinear(parseInt(hex.slice(3, 5), 16));
  const b = hexToLinear(parseInt(hex.slice(5, 7), 16));
  const [L, a, bk] = linearToOklab(r, g, b);
  const C = Math.sqrt(a * a + bk * bk);
  const H = ((Math.atan2(bk, a) * 180) / Math.PI + 360) % 360;
  return { L, C, H };
}

function oklchToCSS(L, C, H) {
  return `oklch(${(L * 100).toFixed(2)}% ${C.toFixed(4)} ${H.toFixed(2)})`;
}

// Load base tokens
const baseTokens = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../tokens/base/colors.json"),
    "utf-8"
  )
);

const baseColors = baseTokens.color.base;
const NUM_SHADES = 16;

// Lightness range: shade 1 (lightest) → 0.97, shade 16 (darkest) → 0.10
const L_MAX = 0.97;
const L_MIN = 0.10;

const shadeTokens = { color: { shade: {}, brand: {} } };

for (const [name, meta] of Object.entries(baseColors)) {
  const hex = meta.value;
  const { L: baseL, C: baseC, H } = hexToOklch(hex);

  shadeTokens.color.shade[name] = {};

  for (let i = 1; i <= NUM_SHADES; i++) {
    // Linear interpolation from lightest to darkest
    const t = (i - 1) / (NUM_SHADES - 1); // 0 → 1
    const L = L_MAX + t * (L_MIN - L_MAX);

    // Chroma: peak around mid-range, compressed at extremes
    const chromaScale = 1 - Math.pow(2 * t - 1, 4) * 0.5;
    const C = baseC * chromaScale;

    shadeTokens.color.shade[name][i.toString()] = {
      value: oklchToCSS(L, C, H),
      comment: `${name} shade ${i} — lightness ${(L * 100).toFixed(0)}%`,
    };
  }

  // Brand token: exact base color preserved as-is (not part of shades)
  shadeTokens.color.brand[name] = {
    value: hex,
    comment: `${meta.comment} — exact brand color, use only for specific brand moments`,
  };
}

const outPath = path.join(__dirname, "../tokens/base/shades.json");
fs.writeFileSync(outPath, JSON.stringify(shadeTokens, null, 2));
console.log(`✅ Generated shades → ${outPath}`);
