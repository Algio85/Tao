import '../src/tokens/tokens.css';
import { ThemeDecorator } from './ThemeDecorator.jsx';

export const globalTypes = {
  // Palette globals — no toolbar, controlled from the Color Palette story
  'palette-1':  { defaultValue: '#2563EB' },
  'palette-2':  { defaultValue: '#4F46E5' },
  'palette-3':  { defaultValue: '#7C3AED' },
  'palette-4':  { defaultValue: '#DB2777' },
  'palette-5':  { defaultValue: '#DC2626' },
  'palette-6':  { defaultValue: '#EA580C' },
  'palette-7':  { defaultValue: '#D97706' },
  'palette-8':  { defaultValue: '#16A34A' },
  'palette-9':  { defaultValue: '#0D9488' },
  'palette-10': { defaultValue: '#0891B2' },
  'palette-11': { defaultValue: '#525252' },

  // Controlled from dedicated story pages — no toolbar
  typescale:     { defaultValue: '1.2'  },
  typescaleBase: { defaultValue: '16'   },
  density:       { defaultValue: '1'    },
  iconWeight:    { defaultValue: 'regular' },

  // Button component token overrides — synced from story controls
  'tao-button-bg':        { defaultValue: '' },
  'tao-button-text':      { defaultValue: '' },
  'tao-button-radius':    { defaultValue: '' },
  'tao-button-font-size': { defaultValue: '' },
  'tao-button-padding-h': { defaultValue: '' },
  'tao-button-padding-v': { defaultValue: '' },
  'tao-button-gap':       { defaultValue: '' },

  // BadgeStatus component token overrides — synced from story controls
  'tao-badge-status-bg':           { defaultValue: '' },
  'tao-badge-status-text':         { defaultValue: '' },
  'tao-badge-status-border-color': { defaultValue: '' },
  'tao-badge-status-border-width': { defaultValue: '' },
  'tao-badge-status-radius':       { defaultValue: '' },
  'tao-badge-status-font-size':    { defaultValue: '' },
  'tao-badge-status-spacing-gap':  { defaultValue: '' },
  'tao-badge-status-spacing-h':    { defaultValue: '' },
  'tao-badge-status-spacing-v':    { defaultValue: '' },
};

/** @type { import('@storybook/react').Preview } */
const preview = {
  decorators: [ThemeDecorator],
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f5f5f5' },
        { name: 'dark',  value: '#0f0f0f' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
