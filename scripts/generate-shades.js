#!/usr/bin/env node
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import fs from "fs";
import path from "path";

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

function oklchToHex(L, C, H) {
  const hRad = H * Math.PI / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548  * b;

  const lc = l_ ** 3, mc = m_ ** 3, sc = s_ ** 3;

  function toSrgb(v) {
    v = Math.max(0, Math.min(1, v));
    return v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
  }

  const r  = Math.round(toSrgb( 4.0767416621 * lc - 3.3077115913 * mc + 0.2309699292 * sc) * 255);
  const g  = Math.round(toSrgb(-1.2684380046 * lc + 2.6097574011 * mc - 0.3413193965 * sc) * 255);
  const bv = Math.round(toSrgb(-0.0041960863 * lc - 0.7034186147 * mc + 1.707614701  * sc) * 255);

  const clamp = v => Math.max(0, Math.min(255, v));
  const toHex = v => clamp(v).toString(16).padStart(2, '0');

  return '#' + toHex(r) + toHex(g) + toHex(bv);
}

const baseTokens = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../tokens/base/colors.json"), "utf-8")
);
const baseColors = baseTokens.color.brand;

const L_MAX = 0.97;
const L_MIN = 0.10;
const NUM_SHADES = 16;

const shadeTokens = { color: { shade: {}, brand: {} } };

for (const [name, meta] of Object.entries(baseColors)) {
  const hex = meta.value;
  const { C: baseC, H } = hexToOklch(hex);

  shadeTokens.color.shade[name] = {};

  for (let i = 1; i <= NUM_SHADES; i++) {
    const t = (i - 1) / (NUM_SHADES - 1);
    const L = L_MAX + t * (L_MIN - L_MAX);
    const chromaScale = 1 - Math.pow(2 * t - 1, 4) * 0.5;
    const C = baseC * chromaScale;

    shadeTokens.color.shade[name][i.toString()] = {
      value: oklchToHex(L, C, H),
      type: "color",
      comment: `${name} shade ${i} — lightness ${(L * 100).toFixed(0)}%`,
    };
  }

  shadeTokens.color.brand[name] = {
    value: hex,
    type: "color",
    comment: `${name} — exact brand color`,
  };
}

const outPath = path.join(__dirname, "../tokens/base/shades.json");
fs.writeFileSync(outPath, JSON.stringify(shadeTokens, null, 2));
console.log(`✅ Generated shades → ${outPath}`);