import React from 'react';
import { theme } from '../tokens/theme.js';

const FONT = theme.font;

const SECTIONS = [
  {
    label:       'Foundations',
    storyId:     'foundations-colors-color-palette--full-palette',
    description: 'Color palettes, spacing, typography, motion, elevation and shadow tokens.',
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
    storyId:     'figma-token-pusher--default',
    description: 'Custom plugin for syncing tokens and styles. Figma Console for AI-assisted component building.',
    count:       '2 plugins',
    accent:      '#0d9488',
  },
  {
    label:       'Figma',
    storyId:     'figma-console--default',
    description: 'AI-assisted component creation and canvas writes via Desktop Bridge.',
    count:       '2 plugins',
    accent:      '#d71f21',
  },
];

const STATS = [
  { value: '336', label: 'Variables' },
  { value: '27',  label: 'Text styles' },
  { value: '5',   label: 'Effect styles' },
  { value: '11',  label: 'Collections' },
];

const STACK = ['Style Dictionary', 'Figma', 'React', 'Chromatic', 'OKLCH'];

function navigate(storyId) {
  const url = window.parent.location.origin + window.parent.location.pathname + '?path=/story/' + storyId;
  window.parent.location.href = url;
}

export function Introduction() {
  return (
    <div style={{ background: theme.bg.page, minHeight: '100vh', fontFamily: FONT, color: theme.text.default }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700&display=swap" />

      {/* Hero */}
      <div style={{
        padding: theme.spacing.xxxl + 'px',
        borderBottom: '1px solid ' + theme.border.subtle,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: theme.spacing.xxxl,
        alignItems: 'center',
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

          <h1 style={{
            fontFamily: FONT, fontSize: 72, fontWeight: 300,
            lineHeight: 1, letterSpacing: '-0.03em',
            color: theme.text.default, margin: '0 0 ' + theme.spacing.sm + 'px',
          }}>
            Tao
          </h1>
          <p style={{
            fontFamily: FONT, fontSize: 11, fontWeight: 400,
            color: theme.text.subtlest, margin: 0,
            textTransform: 'uppercase', letterSpacing: '0.12em',
          }}>
            Design System
          </p>
        </div>

        <div>
          <p style={{
            fontFamily: FONT, fontSize: 16, fontWeight: 300, lineHeight: 1.7,
            color: theme.text.subtle, margin: '0 0 ' + theme.spacing.lg + 'px',
          }}>
            A token-based design system where AI is a core part of the workflow —
            not just a tool, but a collaborator. Built with Style Dictionary,
            Figma, React, and Claude.
          </p>
          <div style={{ display: 'flex', gap: theme.spacing.xs, flexWrap: 'wrap' }}>
            {STACK.map(tag => (
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

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderBottom: '1px solid ' + theme.border.subtle }}>
        {STATS.map((stat, i) => (
          <div key={stat.label} style={{
            padding: theme.spacing.xl + 'px ' + theme.spacing.xxxl + 'px',
            borderRight: i < STATS.length - 1 ? '1px solid ' + theme.border.subtle : 'none',
          }}>
            <div style={{
              fontFamily: FONT, fontSize: 48, fontWeight: 300,
              color: theme.text.default, lineHeight: 1,
              letterSpacing: '-0.03em', marginBottom: theme.spacing.xxs,
            }}>
              {stat.value}
            </div>
            <div style={{
              fontFamily: FONT, fontSize: 10, color: theme.text.subtlest,
              textTransform: 'uppercase', letterSpacing: '0.1em',
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Section cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
        {SECTIONS.map((section, i) => (
          <div
            key={section.label}
            onClick={() => navigate(section.storyId)}
            style={{
              padding: theme.spacing.xxl + 'px ' + theme.spacing.xxxl + 'px',
              borderRight: i % 2 === 0 ? '1px solid ' + theme.border.subtle : 'none',
              borderBottom: i < 2 ? '1px solid ' + theme.border.subtle : 'none',
              background: 'transparent',
              transition: 'background 0.15s',
              position: 'relative',
              cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = theme.bg.hover; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            <div style={{
              position: 'absolute', top: 0, left: 0,
              width: 2, height: '100%', background: section.accent,
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.sm }}>
              <span style={{
                fontFamily: FONT, fontSize: 10, color: section.accent,
                textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500,
              }}>
                {section.label}
              </span>
              <span style={{ fontFamily: FONT, fontSize: 10, color: theme.text.subtlest, letterSpacing: '0.06em' }}>
                {section.count}
              </span>
            </div>

            <p style={{
              fontFamily: FONT, fontSize: 13, fontWeight: 300, lineHeight: 1.6,
              color: theme.text.subtle, margin: '0 0 ' + theme.spacing.md + 'px',
            }}>
              {section.description}
            </p>

            <span style={{ fontFamily: FONT, fontSize: 11, color: section.accent }}>
              Explore →
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        padding: theme.spacing.lg + 'px ' + theme.spacing.xxxl + 'px',
        borderTop: '1px solid ' + theme.border.subtle,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontFamily: FONT, fontSize: 10, color: theme.text.subtlest, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Tao Design System
        </span>
        <span style={{ fontFamily: FONT, fontSize: 10, color: theme.text.subtlest, letterSpacing: '0.06em' }}>
          React · Style Dictionary · Figma · Chromatic
        </span>
      </div>
    </div>
  );
}

export default Introduction;
