/**
 * APCA (Accessible Perceptual Contrast Algorithm) utilities.
 * APCA-W3 0.0.98G — https://github.com/Myndex/SAPC-APCA
 * Works entirely in JS — no canvas, no DOM.
 *
 * APCA returns Lc (Lightness Contrast) values:
 *   Lc is signed: positive = light bg / dark text, negative = dark bg / light text
 *   We use absolute value for display.
 *
 * Thresholds (absolute Lc):
 *   ≥ 75  → strong (equivalent to AA body text)
 *   ≥ 60  → medium (large text / UI components)
 *   ≥ 45  → minimum (large bold text)
 *   < 45  → insufficient
 */

// ─── Color parsing ────────────────────────────────────────────────────────────

/** Parse oklch(L% C H) → { L, C, H } */
export function parseOklch(str) {
  const m = str.match(/oklch\(\s*([\d.]+)%?\s+([\d.]+)\s+([\d.]+)\s*\)/);
  if (!m) return null;
  let L = parseFloat(m[1]);
  if (L > 1) L = L / 100;
  return { L, C: parseFloat(m[2]), H: parseFloat(m[3]) };
}

/** Parse #rrggbb → [r, g, b] (0–255) */
export function parseHex(hex) {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

/** OKLCH → sRGB [0–255] */
export function oklchToRgb(L, C, H) {
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const lc = l_ ** 3, mc = m_ ** 3, sc = s_ ** 3;

  const toSrgb = (v) => {
    v = Math.max(0, Math.min(1, v));
    return v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
  };

  return [
    Math.round(toSrgb(+4.0767416621 * lc - 3.3077115913 * mc + 0.2309699292 * sc) * 255),
    Math.round(toSrgb(-1.2684380046 * lc + 2.6097574011 * mc - 0.3413193965 * sc) * 255),
    Math.round(toSrgb(-0.0041960863 * lc - 0.7034186147 * mc + 1.707614701  * sc) * 255),
  ];
}

// ─── APCA ─────────────────────────────────────────────────────────────────────

/** sRGB [0–255] → APCA estimated luminance (Y) */
function apcaLuminance([r, g, b]) {
  const sr = (r / 255) ** 2.4;
  const sg = (g / 255) ** 2.4;
  const sb = (b / 255) ** 2.4;
  return 0.2126729 * sr + 0.7151522 * sg + 0.0721750 * sb;
}

/**
 * APCA-W3 contrast: returns signed Lc value.
 * txtRgb = text color, bgRgb = background color.
 * Positive = dark text on light bg, negative = light text on dark bg.
 */
export function apcaContrast(txtRgb, bgRgb) {
  const Ytxt = apcaLuminance(txtRgb);
  const Ybg  = apcaLuminance(bgRgb);

  const blackClamp = 0.022;
  const blackExp   = 1.414;

  const Ytxt_ = Ytxt > blackClamp ? Ytxt : Ytxt + (blackClamp - Ytxt) ** blackExp;
  const Ybg_  = Ybg  > blackClamp ? Ybg  : Ybg  + (blackClamp - Ybg)  ** blackExp;

  let Lc;
  if (Ybg_ >= Ytxt_) {
    // Light background
    Lc = (Ybg_ ** 0.56 - Ytxt_ ** 0.57) * 1.14;
  } else {
    // Dark background
    Lc = (Ybg_ ** 0.65 - Ytxt_ ** 0.62) * 1.14;
  }

  // Clamp low-contrast noise
  if (Math.abs(Lc) < 0.1) return 0;

  return Lc * 100; // Scale to Lc units
}

/**
 * APCA level label based on absolute Lc.
 *   Lc 75+ → body text (small, normal weight)
 *   Lc 60+ → large text / UI components
 *   Lc 45+ → large bold text / non-text elements
 *   Lc 30+ → placeholder / decorative
 *   < 30   → insufficient
 */
export function apcaLevel(lc) {
  const abs = Math.abs(lc);
  if (abs >= 75) return 'Lc 75+';
  if (abs >= 60) return 'Lc 60+';
  if (abs >= 45) return 'Lc 45+';
  if (abs >= 30) return 'Lc 30+';
  return 'Low';
}

export const WHITE = [255, 255, 255];
export const BLACK = [0, 0, 0];