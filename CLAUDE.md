# Tao Design System — Claude Agent Context

## Token Naming Convention

All tokens follow this hierarchy (not all levels are always present):

```
System . Group . Component . Component Variant . Component Theme . Component State .
Element . Element Variant . Element State . Attribute . Attribute Variant .
Property . Property Variant . Scale . Mode
```

In CSS, this maps to:
```
--tao-[group]-[subgroup]-[variant]-[scale]
```

**Rules:**
- NEVER use raw hex values, hardcoded px sizes, or arbitrary colors
- ALWAYS use semantic tokens (`--tao-surface-*`, `--tao-text-*`, `--tao-border-*`)
- Only use primitive tokens (`--tao-color-shade-*`) inside the token system itself, never in components

---

## Available Semantic Tokens

### Surfaces (backgrounds)
```css
--tao-surface-brand-1-subtlest   /* lightest brand tint */
--tao-surface-brand-1-subtle
--tao-surface-brand-1-default
--tao-surface-brand-1-bold
--tao-surface-brand-1-strong
--tao-surface-brand-1-strongest

/* Same scale for: brand-2, brand-3, success, danger, alert, info, news, ai */
--tao-surface-[semantic]-[scale]
```

### Text
```css
--tao-text-default       /* primary body text */
--tao-text-subtle        /* secondary text */
--tao-text-subtlest      /* placeholder, disabled */
--tao-text-inverse       /* text on dark backgrounds */
--tao-text-brand-1
--tao-text-brand-2
--tao-text-brand-3
--tao-text-success
--tao-text-danger
--tao-text-alert
--tao-text-info
--tao-text-news
--tao-text-ai
```

### Borders
```css
--tao-border-default
--tao-border-subtle
--tao-border-strong
--tao-border-focus
--tao-border-brand-1
--tao-border-brand-2
--tao-border-brand-3
--tao-border-success
--tao-border-danger
--tao-border-alert
--tao-border-info
--tao-border-news
--tao-border-ai

/* Border widths */
--tao-border-width-sm    /* 1px */
--tao-border-width-md    /* 2px */
--tao-border-width-lg    /* 4px */
--tao-border-width-xl    /* 8px */
```

### States
```css
--tao-state-hover        /* hover background */
--tao-state-active       /* pressed background */
--tao-state-selected     /* selected background */
--tao-state-focus        /* focus ring */
--tao-state-disabled-bg
--tao-state-disabled-text
--tao-state-disabled-border
```

### Typography
```css
/* Font sizes */
--tao-typography-size-xs    /* 11px */
--tao-typography-size-sm    /* 13px */
--tao-typography-size-md    /* 16px */
--tao-typography-size-lg    /* 19px */
--tao-typography-size-xl    /* 23px */
--tao-typography-size-xxl   /* 28px */
--tao-typography-size-xxxl  /* 33px */

/* Type styles — use font-size + font-weight + line-height together */
/* Roles: display, title-1, title-2, title-3, title-4, body, body-sm, label, label-sm */
/* Weights: light (300), regular (400), bold (700) */
```

---

## Component Creation Rules

When creating a component always:

1. **Use semantic tokens** for all visual properties
2. **Map states explicitly**: hover → `--tao-state-hover`, focus → `--tao-state-focus`, disabled → `--tao-state-disabled-*`
3. **Use border-width tokens** for all border thicknesses
4. **Use typography tokens** for all text sizes — never hardcode font sizes
5. **Support light and dark mode** via CSS custom properties (tokens handle this automatically)
6. **Name component CSS classes** following the same hierarchy: `tao-[component]-[variant]-[element]`

### Component CSS pattern
```css
.tao-card {
  background: var(--tao-surface-brand-1-subtlest);
  border: var(--tao-border-width-sm) solid var(--tao-border-default);
  color: var(--tao-text-default);
}

.tao-card:hover {
  background: var(--tao-state-hover);
}

.tao-card:focus-visible {
  outline: var(--tao-border-width-md) solid var(--tao-state-focus);
}

.tao-card--disabled {
  background: var(--tao-state-disabled-bg);
  color: var(--tao-state-disabled-text);
  border-color: var(--tao-state-disabled-border);
}

.tao-card__title {
  font-size: var(--tao-typography-size-lg);
  font-weight: 700;
  color: var(--tao-text-default);
}

.tao-card__body {
  font-size: var(--tao-typography-size-md);
  font-weight: 400;
  color: var(--tao-text-subtle);
}
```

---

## Flexible Dimensions (configurable per project)

These are the dimensions that vary between projects or platforms:

| Dimension     | Tokens                          | Description                        |
|---------------|---------------------------------|------------------------------------|
| Type scale    | `--tao-typography-size-*`       | Font size scale (ratio-based)      |
| Density       | `--tao-spacing-*`               | Spacing scale                      |
| Brand colors  | `--tao-surface-brand-*`         | palette-1, palette-2, palette-3    |
| Border radius | `--tao-border-radius-*`         | Sharp / rounded / pill             |
| Motion        | `--tao-motion-*`                | Duration and easing                |

---

## Platform Outputs

Tokens are built for:
- **Web**: CSS custom properties (`--tao-*`)
- **iOS**: Swift constants
- **Android**: XML resources
- **React Native**: JS numbers (no px/rem units)

When creating components for **React Native**, use plain numbers — not CSS variables.
When creating components for **web**, always use `var(--tao-*)`.

---

## Workspace Structure

```
workspace/
├── packages/tao/        ← token source of truth (JSON → Style Dictionary)
├── apps/storybook/      ← component preview and theme playground
└── apps/portfolio/      ← personal portfolio (Astro, deployed on Vercel)
```

Components built for the portfolio live in `apps/portfolio/src/components/`.
Components built for the design system live in `apps/storybook/src/components/`.
