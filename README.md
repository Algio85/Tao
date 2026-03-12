# Design System

Token-based design system con OKLCH color shades e Storybook React.

## Struttura

```
design-system/
├── tokens/
│   └── base/
│       ├── colors.json              # Raw brand colors (edit questi)
│       └── shades.json              # Auto-generato — non editare a mano
├── scripts/
│   └── generate-shades.js          # Genera 16 shades OKLCH + brand token
├── style-dictionary/
│   └── config.js                   # Build CSS vars / JSON / ES6
├── storybook/
│   ├── .storybook/
│   │   ├── main.js                  # @storybook/react-webpack5
│   │   └── preview.js
│   └── src/
│       ├── components/
│       │   ├── ColorPalette.jsx     # Componente principale
│       │   └── ColorSwatch.jsx      # ShadeCell + BrandTokenRow
│       ├── stories/
│       │   └── ColorPalette.stories.jsx  # CSF3 stories
│       └── utils/
│           └── contrast.js          # WCAG contrast utilities
└── package.json
```

## Setup

### 1. Generare i token

```bash
# Root del progetto
npm install
npm run generate-shades   # → tokens/base/shades.json
npm run build-tokens      # → build/css, build/json, build/js
```

### 2. Avviare Storybook

```bash
cd storybook
npm install
npm run storybook         # → http://localhost:6006
```

## Token structure

### `color.shade.<name>.<1-16>`
16 shades OKLCH per ogni hue.
- `1` = più vicino al bianco (lightness ~97%)
- `16` = più vicino al nero (lightness ~10%)
- La chroma segue una curva naturale: picco a metà scala, compressa agli estremi

### `color.brand.<name>`
Hex esatto del brand color originale. **Non fa parte della scala shades.**
Usare solo per momenti specifici in cui serve il colore di brand preciso
(es. logo, brand moment), non per le scale UI.

## Aggiungere un colore

In `tokens/base/colors.json`:

```json
"emerald": { "value": "#059669", "comment": "Brand Emerald" }
```

Poi:
```bash
npm run generate-shades
npm run build-tokens
```

## Stories disponibili

| Story         | Descrizione                                      |
|---------------|--------------------------------------------------|
| Full Palette  | Tutti i colori con brand token                   |
| Cool Hues     | Blue, indigo, violet, cyan, teal                 |
| Warm Hues     | Red, orange, amber, pink                         |
| Shades Only   | Tutti i colori senza brand token row             |
| Single Color  | Un singolo hue (selezionabile via controls)      |

## Controls Storybook

- **colors** (checkbox) — seleziona quali hue visualizzare
- **showBrandToken** (boolean) — mostra/nasconde la riga brand token

## Output StyleDictionary

```
build/
├── css/tokens.css   → :root { --ds-color-shade-blue-1: oklch(...) }
├── json/tokens.json → { "ds-color-shade-blue-1": "oklch(...)" }
└── js/tokens.js     → export const DsColorShadeBlue1 = "oklch(...)"
```
