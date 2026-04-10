import React, { useState } from 'react';
import { theme } from '../tokens/theme.js';

const FONT = theme.font;

const SECTIONS = [
  {
    label:       'Foundations',
    storyId:     'foundations-colors-color-palette--full-palette',
    description: 'Color palettes, spacing, typography, motion, elevation and shadow tokens. Edit base colors live — all components update in real time.',
    count:       '336 variables',
    accent:      theme.accent.default,
  },
  {
    label:       'Icons',
    storyId:     'foundations-icons--default',
    description: 'Phosphor icon library — 1300+ icons across 6 weights with semantic color tokens.',
    count:       '1300+ icons',
    accent:      '#722be1',
  },
  {
    label:       'Components',
    storyId:     'components-checkbox--default',
    description: 'Production-ready React components bound to Tao tokens. All states, focus rings and interactions are CSS-only — no raw values.',
    count:       '4 components',
    accent:      '#d71f21',
  },
  {
    label:       'Figma',
    storyId:     'figma-token-pusher--default',
    description: 'Token Pusher plugin for syncing tokens and styles. Console for reading Figma files directly from Storybook.',
    count:       '2 plugins',
    accent:      '#0d9488',
  },
];

const STATS = [
  { value: '336', label: 'Variables' },
  { value: '4',   label: 'Components' },
  { value: '2',   label: 'Figma plugins' },
  { value: '11',  label: 'Token collections' },
];

const AGENTS = [
  {
    name:        'token-governance-auditor',
    description: 'Audits components for hardcoded values that should be design tokens and checks for semantic token misuse. Flags hex colors, raw px spacing, and primitive tokens used outside the token system.',
    scope:       'apps/portfolio · apps/storybook',
    accent:      '#722be1',
    invoke:      'Run the token-governance-auditor on apps/storybook',
  },
  {
    name:        'a11y-compliance-auditor',
    description: 'Audits component files for WCAG 2.1 compliance — contrast ratios, focus indicators, ARIA semantics, missing alt text, and reduced-motion media queries.',
    scope:       'apps/portfolio · apps/storybook',
    accent:      '#0d9488',
    invoke:      'Run the a11y-compliance-auditor on apps/portfolio',
  },
  {
    name:        'performance-governance-auditor',
    description: 'Audits Astro components for hydration overhead, unoptimized media and Core Web Vitals pitfalls — LCP images, CLS from missing dimensions, client:load misuse.',
    scope:       'apps/portfolio · apps/storybook',
    accent:      '#d71f21',
    invoke:      'Run the performance-governance-auditor on apps/portfolio',
  },
];

const COMMANDS = [
  {
    group: 'Token pipeline',
    items: [
      { cmd: 'npm run build',           desc: 'Generate shades → build tokens → sync to Storybook (run from packages/tao)' },
      { cmd: 'npm run generate-shades', desc: 'Regenerate OKLCH color shades from base palette colors' },
      { cmd: 'npm run build-tokens',    desc: 'Run Style Dictionary — outputs build/css/tokens.css' },
      { cmd: 'npm run sync-tokens',     desc: 'Copy compiled tokens to apps/storybook/src/tokens/' },
    ],
  },
  {
    group: 'Storybook',
    items: [
      { cmd: 'npm run storybook', desc: 'Start Storybook on port 6006 (run from apps/storybook)' },
      { cmd: 'npm run chromatic', desc: 'Deploy to Chromatic for visual regression testing' },
    ],
  },
  {
    group: 'Apps',
    items: [
      { cmd: 'npm run dev',   desc: 'Start Astro dev server (run from apps/portfolio)' },
      { cmd: 'npm run build', desc: 'Build for production — Vercel auto-deploys on push to main' },
      { cmd: 'style-dictionary build --config tao-sd.config.json', desc: 'Generate platform tokens from a saved theme (run from any app folder)' },
    ],
  },
  {
    group: 'Claude Code',
    items: [
      { cmd: '/simplify',  desc: 'Review changed code for reuse, quality and efficiency — then fix issues found' },
      { cmd: '/commit',    desc: 'Stage, write a commit message and commit — follows conventional commits style' },
      { cmd: '/review-pr', desc: 'Review a GitHub PR and post structured feedback as comments' },
    ],
  },
];

const WORKFLOW = [
  {
    step:  '01',
    title: 'Play with tokens',
    desc:  'Use the Color Palette, Type Scale and Spacing pages in Storybook — change palette colors, ratio or density and all components update live.',
  },
  {
    step:  '02',
    title: 'Save as theme',
    desc:  'Click Themes in the toolbar, name the theme and hit Save. Storybook creates apps/<name>/ with tao-overrides.css, tao-theme.json and package.json automatically.',
  },
  {
    step:  '03',
    title: 'Use in your app',
    desc:  'Import tokens.css (base) then tao-overrides.css (your theme) — done for any web app. Use the JSON export with Style Dictionary for iOS, Android or other platforms.',
  },
  {
    step:  '04',
    title: 'Design in Figma',
    desc:  'Design components using tao variables — token names are identical in Figma and in code. Push updated tokens to Figma with the Token Pusher plugin.',
  },
  {
    step:  '05',
    title: 'Claude codes it',
    desc:  'Claude reads the Figma component via MCP and generates React code using the matching semantic token names. No raw values, no hardcoded colors.',
  },
  {
    step:  '06',
    title: 'Commit + deploy',
    desc:  'GitHub Desktop push → Chromatic snapshots Storybook for visual regression, Vercel deploys the portfolio automatically.',
  },
];

const TOKEN_LAYERS = [
  {
    layer:   'Primitive',
    path:    'tokens/base/',
    example: '--tao-color-shade-palette-1-8',
    desc:    'Raw values — OKLCH shades, spacing scale, type scale',
  },
  {
    layer:   'Semantic',
    path:    'tokens/semantic/',
    example: '--tao-surface-brand-1-strong',
    desc:    'Contextual meaning — surface, text, border, icon, state',
  },
  {
    layer:   'Component',
    path:    'tokens/components/',
    example: '--tao-button-primary-bg',
    desc:    'Component-specific tokens (planned)',
  },
];

const THEMING = [
  { icon: '🎨', title: 'Color palette',  desc: 'Change any of the 11 base colors — 16 OKLCH shades are regenerated live for each one',          link: 'foundations-colors-color-palette--full-palette' },
  { icon: '🔤', title: 'Type scale',     desc: 'Switch ratio (Minor Third → Perfect Fourth) and base size — all typography tokens update',       link: 'foundations-typography-type-scale--default' },
  { icon: '📐', title: 'Spacing',        desc: 'Switch between Comfortable, Compact and Dense — all spacing tokens scale proportionally',         link: 'foundations-spacing--default' },
  { icon: '💾', title: 'Themes toolbar', desc: 'Save any configuration as a named theme — the app folder is created on disk automatically',       link: null },
];

function navigate(storyId) {
  try { window.parent.location.search = '?path=/story/' + storyId; }
  catch { window.location.search = '?path=/story/' + storyId; }
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1400);
        });
      }}
      style={{
        all: 'unset', cursor: 'pointer',
        fontFamily: FONT, fontSize: 10,
        color:      copied ? '#16a34a' : theme.text.subtlest,
        padding:    '2px 6px', borderRadius: 4,
        background: copied ? '#f0fdf4' : theme.bg.surface,
        border:     `1px solid ${copied ? '#86efac' : theme.border.subtle}`,
        transition: 'all 0.12s', flexShrink: 0,
      }}
    >
      {copied ? '✓' : 'copy'}
    </button>
  );
}

export function Introduction() {
  return (
    <div style={{ background: theme.bg.page, minHeight: '100vh', fontFamily: FONT, color: theme.text.default }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700&display=swap" />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div style={{
        padding: theme.spacing.xxxl + 'px',
        borderBottom: '1px solid ' + theme.border.subtle,
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: theme.spacing.xxxl, alignItems: 'center',
      }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '3px 10px', borderRadius: 100,
            background: theme.bg.surface, border: '1px solid ' + theme.border.subtle,
            marginBottom: theme.spacing.xl,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: theme.accent.default }} />
            <span style={{ fontFamily: FONT, fontSize: 10, color: theme.text.subtlest, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Alpha</span>
          </div>
          <h1 style={{ fontFamily: FONT, fontSize: 72, fontWeight: 300, lineHeight: 1, letterSpacing: '-0.03em', color: theme.text.default, margin: '0 0 ' + theme.spacing.sm + 'px' }}>
            Tao
          </h1>
          <p style={{ fontFamily: FONT, fontSize: 11, fontWeight: 400, color: theme.text.subtlest, margin: 0, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Design System
          </p>
        </div>
        <div>
          <p style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, lineHeight: 1.7, color: theme.text.subtle, margin: '0 0 ' + theme.spacing.lg + 'px' }}>
            A token-based design system where tao is the single source of truth —
            Figma pulls from it, apps consume it, and Claude uses it to generate
            components. Edit colors, scale and density live in Storybook and save
            named themes that become real app folders on disk instantly.
          </p>
          <div style={{ display: 'flex', gap: theme.spacing.xs, flexWrap: 'wrap' }}>
            {['Style Dictionary', 'Figma', 'React', 'Astro', 'Vercel', 'Chromatic', 'OKLCH', 'Phosphor'].map(tag => (
              <span key={tag} style={{
                fontFamily: FONT, fontSize: 10, color: theme.text.subtlest,
                background: theme.bg.surface, border: '1px solid ' + theme.border.subtle,
                borderRadius: 4, padding: '3px 8px', letterSpacing: '0.04em',
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderBottom: '1px solid ' + theme.border.subtle }}>
        {STATS.map((stat, i) => (
          <div key={stat.label} style={{ padding: theme.spacing.xl + 'px ' + theme.spacing.xxxl + 'px', borderRight: i < STATS.length - 1 ? '1px solid ' + theme.border.subtle : 'none' }}>
            <div style={{ fontFamily: FONT, fontSize: 48, fontWeight: 300, color: theme.text.default, lineHeight: 1, letterSpacing: '-0.03em', marginBottom: theme.spacing.xxs }}>
              {stat.value}
            </div>
            <div style={{ fontFamily: FONT, fontSize: 10, color: theme.text.subtlest, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Section cards ─────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', borderBottom: '1px solid ' + theme.border.subtle }}>
        {SECTIONS.map((section, i) => (
          <div
            key={section.label}
            onClick={() => navigate(section.storyId)}
            style={{
              padding: theme.spacing.xxl + 'px ' + theme.spacing.xxxl + 'px',
              borderRight:  i % 2 === 0 ? '1px solid ' + theme.border.subtle : 'none',
              borderBottom: i < 2       ? '1px solid ' + theme.border.subtle : 'none',
              background: 'transparent', transition: 'background 0.15s',
              position: 'relative', cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = theme.bg.hover; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, width: 2, height: '100%', background: section.accent }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.sm }}>
              <span style={{ fontFamily: FONT, fontSize: 10, color: section.accent, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500 }}>{section.label}</span>
              <span style={{ fontFamily: FONT, fontSize: 10, color: theme.text.subtlest }}>{section.count}</span>
            </div>
            <p style={{ fontFamily: FONT, fontSize: 13, fontWeight: 300, lineHeight: 1.6, color: theme.text.subtle, margin: '0 0 ' + theme.spacing.md + 'px' }}>
              {section.description}
            </p>
            <span style={{ fontFamily: FONT, fontSize: 11, color: section.accent }}>Explore →</span>
          </div>
        ))}
      </div>

      {/* ── Live Theming ───────────────────────────────────────────────────── */}
      <div style={{ padding: theme.spacing.xxxl + 'px', borderBottom: '1px solid ' + theme.border.subtle }}>
        <h2 style={{ fontFamily: FONT, fontSize: 11, fontWeight: 500, color: theme.text.subtlest, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: theme.spacing.xl }}>
          Live Theming
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: theme.spacing.lg }}>
          {THEMING.map(item => (
            <div
              key={item.title}
              onClick={() => item.link && navigate(item.link)}
              style={{
                padding: theme.spacing.md + 'px',
                background: theme.bg.surface,
                border: '1px solid ' + theme.border.subtle,
                borderRadius: 8,
                cursor: item.link ? 'pointer' : 'default',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => { if (item.link) e.currentTarget.style.borderColor = theme.accent.default; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border.subtle; }}
            >
              <div style={{ fontSize: 20, marginBottom: theme.spacing.xs }}>{item.icon}</div>
              <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 500, color: theme.text.default, marginBottom: theme.spacing.xxs }}>{item.title}</div>
              <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 300, lineHeight: 1.5, color: theme.text.subtle }}>{item.desc}</div>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: FONT, fontSize: 11, color: theme.text.subtlest, marginTop: theme.spacing.md, lineHeight: 1.6 }}>
          Changes persist across story navigation via Storybook globals. Use <strong style={{ color: theme.text.subtle }}>Overrides</strong> in the toolbar to see what's active and reset all at once. Use <strong style={{ color: theme.text.subtle }}>Themes</strong> to save, switch between and export named configurations.
        </p>
      </div>

      {/* ── Token Architecture ────────────────────────────────────────────── */}
      <div style={{ padding: theme.spacing.xxxl + 'px', borderBottom: '1px solid ' + theme.border.subtle }}>
        <h2 style={{ fontFamily: FONT, fontSize: 11, fontWeight: 500, color: theme.text.subtlest, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: theme.spacing.xl }}>
          Token Architecture
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {TOKEN_LAYERS.map((layer, i) => (
            <div key={layer.layer} style={{
              display: 'grid', gridTemplateColumns: '100px 180px 1fr 1fr',
              alignItems: 'center', gap: theme.spacing.lg,
              padding: theme.spacing.sm + 'px ' + theme.spacing.md + 'px',
              borderBottom: i < TOKEN_LAYERS.length - 1 ? '1px solid ' + theme.border.subtle : 'none',
            }}>
              <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 500, color: theme.text.default }}>{layer.layer}</span>
              <span style={{ fontFamily: 'monospace', fontSize: 10, color: theme.text.subtlest }}>{layer.path}</span>
              <span style={{ fontFamily: 'monospace', fontSize: 10, color: theme.accent.default, background: theme.bg.surface, padding: '2px 6px', borderRadius: 3 }}>{layer.example}</span>
              <span style={{ fontFamily: FONT, fontSize: 11, color: theme.text.subtle }}>{layer.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Workflow ──────────────────────────────────────────────────────── */}
      <div style={{ padding: theme.spacing.xxxl + 'px', borderBottom: '1px solid ' + theme.border.subtle }}>
        <h2 style={{ fontFamily: FONT, fontSize: 11, fontWeight: 500, color: theme.text.subtlest, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: theme.spacing.xl }}>
          Workflow
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: theme.spacing.xxl }}>
          {WORKFLOW.map((step, i) => (
            <div key={step.step} style={{ paddingBottom: i < 3 ? theme.spacing.xl : 0, borderBottom: i < 3 ? '1px solid ' + theme.border.subtle : 'none' }}>
              <div style={{ fontFamily: FONT, fontSize: 10, color: theme.text.subtlest, letterSpacing: '0.08em', marginBottom: theme.spacing.xs }}>{step.step}</div>
              <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 500, color: theme.text.default, marginBottom: theme.spacing.xxs }}>{step.title}</div>
              <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 300, lineHeight: 1.5, color: theme.text.subtle }}>{step.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Claude Agents ─────────────────────────────────────────────────── */}
      <div style={{ padding: theme.spacing.xxxl + 'px', borderBottom: '1px solid ' + theme.border.subtle }}>
        <h2 style={{ fontFamily: FONT, fontSize: 11, fontWeight: 500, color: theme.text.subtlest, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: theme.spacing.xl }}>
          Claude Agents
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: theme.spacing.lg }}>
          {AGENTS.map(agent => (
            <div key={agent.name} style={{
              padding: theme.spacing.md + 'px',
              background: theme.bg.surface,
              border: '1px solid ' + theme.border.subtle,
              borderRadius: 8,
              position: 'relative',
              display: 'flex', flexDirection: 'column', gap: theme.spacing.sm,
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: 2, height: '100%', background: agent.accent, borderRadius: '8px 0 0 8px' }} />
              <div style={{ paddingLeft: theme.spacing.xs }}>
                <code style={{ fontFamily: 'monospace', fontSize: 11, color: agent.accent }}>{agent.name}</code>
              </div>
              <p style={{ fontFamily: FONT, fontSize: 11, fontWeight: 300, lineHeight: 1.6, color: theme.text.subtle, margin: 0, paddingLeft: theme.spacing.xs }}>
                {agent.description}
              </p>
              <div style={{ paddingLeft: theme.spacing.xs, marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: theme.spacing.xxs }}>
                <div style={{ fontFamily: FONT, fontSize: 10, color: theme.text.subtlest, letterSpacing: '0.04em' }}>
                  Scope: {agent.scope}
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.xs,
                  padding: '4px 8px',
                  background: theme.bg.page,
                  border: '1px solid ' + theme.border.subtle,
                  borderRadius: 4,
                }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 10, color: theme.text.subtlest, fontStyle: 'italic' }}>"{agent.invoke}"</span>
                  <CopyButton text={agent.invoke} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: FONT, fontSize: 11, color: theme.text.subtlest, marginTop: theme.spacing.md, lineHeight: 1.6 }}>
          Agents live in <code style={{ fontFamily: 'monospace', fontSize: 10 }}>.claude/agents/</code>. Invoke by describing the task in Claude Code — the agent is selected automatically and runs with full codebase access.
        </p>
      </div>

      {/* ── Commands ──────────────────────────────────────────────────────── */}
      <div style={{ padding: theme.spacing.xxxl + 'px', borderBottom: '1px solid ' + theme.border.subtle }}>
        <h2 style={{ fontFamily: FONT, fontSize: 11, fontWeight: 500, color: theme.text.subtlest, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: theme.spacing.xl }}>
          Commands
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: theme.spacing.xxl }}>
          {COMMANDS.map(group => (
            <div key={group.group}>
              <div style={{ fontFamily: FONT, fontSize: 10, fontWeight: 500, color: theme.text.subtlest, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: theme.spacing.sm }}>
                {group.group}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xs }}>
                {group.items.map(item => (
                  <div key={item.cmd} style={{
                    padding: theme.spacing.sm + 'px',
                    background: theme.bg.surface, borderRadius: theme.spacing.xs,
                    border: '1px solid ' + theme.border.subtle,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.xs, marginBottom: 4 }}>
                      <code style={{ fontFamily: 'monospace', fontSize: 11, color: theme.accent.default }}>{item.cmd}</code>
                      <CopyButton text={item.cmd} />
                    </div>
                    <div style={{ fontFamily: FONT, fontSize: 11, color: theme.text.subtlest, lineHeight: 1.4 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <div style={{
        padding: theme.spacing.lg + 'px ' + theme.spacing.xxxl + 'px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontFamily: FONT, fontSize: 10, color: theme.text.subtlest, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Tao Design System</span>
        <span style={{ fontFamily: FONT, fontSize: 10, color: theme.text.subtlest }}>React · Style Dictionary · Figma · Chromatic · Vercel</span>
      </div>
    </div>
  );
}

export default Introduction;
