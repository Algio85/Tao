import React from 'react';
import { useGlobals } from '@storybook/preview-api';
import { applyTheme } from '../src/tokens/themeEngine.js';

const PALETTE_KEYS = [
  'palette-1','palette-2','palette-3','palette-4','palette-5','palette-6',
  'palette-7','palette-8','palette-9','palette-10','palette-11',
];

const COMPONENT_GLOBAL_KEYS = [
  // Button
  'tao-button-bg','tao-button-text','tao-button-radius',
  'tao-button-font-size','tao-button-padding-h','tao-button-padding-v','tao-button-gap',
  // BadgeStatus
  'tao-badge-status-bg','tao-badge-status-text','tao-badge-status-border-color','tao-badge-status-border-width',
  'tao-badge-status-radius','tao-badge-status-font-size','tao-badge-status-spacing-gap',
  'tao-badge-status-spacing-h','tao-badge-status-spacing-v',
];

export function ThemeDecorator(Story, context) {
  const [globals] = useGlobals();

  const palettes = Object.fromEntries(
    PALETTE_KEYS.map(k => [k, globals[k]]).filter(([, v]) => v)
  );

  // Apply synchronously on every render so CSS persists across story navigation
  applyTheme({
    palettes,
    typescaleRatio: globals.typescale     || '1.2',
    typescaleBase:  globals.typescaleBase || '16',
    densityFactor:  globals.density       || '1',
  });

  // Apply component token overrides with component-specific selectors so they
  // win over variant-level custom property declarations (e.g. .tao-button--primary).
  const buttonKeys = COMPONENT_GLOBAL_KEYS.filter(k => k.startsWith('tao-button-') && globals[k]);
  const badgeKeys  = COMPONENT_GLOBAL_KEYS.filter(k => k.startsWith('tao-badge-')  && globals[k]);

  let el = document.getElementById('tao-component-overrides');
  if (buttonKeys.length > 0 || badgeKeys.length > 0) {
    if (!el) {
      el = document.createElement('style');
      el.id = 'tao-component-overrides';
      document.head.appendChild(el);
    }
    const blocks = [];
    if (buttonKeys.length > 0) {
      blocks.push(`#storybook-root .tao-button {\n${buttonKeys.map(k => `  --${k}: ${globals[k]};`).join('\n')}\n}`);
    }
    if (badgeKeys.length > 0) {
      blocks.push(`:root {\n${badgeKeys.map(k => `  --${k}: ${globals[k]};`).join('\n')}\n}`);
    }
    el.textContent = blocks.join('\n');
  } else if (el) {
    el.textContent = '';
  }

  return <Story {...context} />;
}
