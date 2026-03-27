import React, { useState } from 'react';
import { theme } from '../tokens/theme.js';
import typographyTokens from '../tokens/semantic/typography.json';

const FONT = theme.font;

const STYLES = [
  'display',
  'title-1', 'title-2', 'title-3', 'title-4',
  'body', 'body-sm',
  'label', 'label-sm'
];

const WEIGHTS = ['light', 'regular', 'bold'];

const PREVIEW_TEXT = 'The quick brown fox';

const SIZE_MAP = { xs: '11px', sm: '13px', md: '16px', lg: '19px', xl: '23px', xxl: '28px', xxxl: '33px' };

function resolveSize(ref) {
  const match = ref?.match?.(/^\{typography\.size\.(\w+)\}$/);
  if (!match) return ref;
  return SIZE_MAP[match[1]] ?? ref;
}

function SectionTitle({ children }) {
  return (
    <h2 style={{
      fontFamily: FONT, fontSize: 16, fontWeight: 500,
      color: theme.text.default,
      marginBottom: theme.spacing.md,
      paddingBottom: theme.spacing.xs,
      borderBottom: '1px solid ' + theme.border.subtle,
    }}>
      {children}
    </h2>
  );
}

function InfoBox({ children }) {
  return (
    <div style={{
      padding: theme.spacing.sm + 'px ' + theme.spacing.md + 'px',
      background: theme.bg.surface,
      borderRadius: theme.spacing.xs,
      border: '1px solid ' + theme.border.subtle,
      fontFamily: FONT, fontSize: 12,
      color: theme.text.subtle,
      marginTop: theme.spacing.md,
    }}>
      {children}
    </div>
  );
}

function StyleRow({ styleName }) {
  const [copied, setCopied] = useState(null);

  return (
    <div style={{ borderBottom: '1px solid ' + theme.border.subtle }}>
      {WEIGHTS.map(weight => {
        const token = typographyTokens.text[styleName]?.[weight];
        const fontSize   = resolveSize(token?.value?.fontSize);
        const fontWeight = token?.value?.fontWeight;
        const lineHeight = token?.value?.lineHeight;
        const tokenName  = 'text.' + styleName + '.' + weight;

        const handleCopy = () => {
          navigator.clipboard?.writeText(tokenName).then(() => {
            setCopied(weight);
            setTimeout(() => setCopied(null), 1400);
          });
        };

        return (
          <div
            key={weight}
            onClick={handleCopy}
            title={'Copy: ' + tokenName}
            style={{
              display: 'grid',
              gridTemplateColumns: '120px 80px 60px 60px 60px 1fr',
              alignItems: 'center',
              gap: theme.spacing.md,
              padding: theme.spacing.xs + 'px ' + theme.spacing.md + 'px',
              cursor: 'pointer',
              transition: 'background 0.12s',
              background: copied === weight ? '#f0fdf4' : 'transparent',
            }}
            onMouseEnter={e => { if (copied !== weight) e.currentTarget.style.background = theme.bg.hover; }}
            onMouseLeave={e => { if (copied !== weight) e.currentTarget.style.background = 'transparent'; }}
          >
            <span style={{ fontFamily: FONT, fontSize: 10, color: copied === weight ? '#16a34a' : theme.text.subtlest, transition: 'color 0.2s' }}>
              {copied === weight ? '✓ copied' : tokenName}
            </span>
            <span style={{ fontFamily: FONT, fontSize: 10, color: theme.text.subtlest, textTransform: 'capitalize' }}>{weight}</span>
            <span style={{ fontFamily: FONT, fontSize: 10, color: theme.text.subtlest }}>{fontSize}</span>
            <span style={{ fontFamily: FONT, fontSize: 10, color: theme.text.subtlest }}>{fontWeight}</span>
            <span style={{ fontFamily: FONT, fontSize: 10, color: theme.text.subtlest }}>{lineHeight}</span>
            <span style={{
              fontFamily: FONT,
              fontSize,
              fontWeight,
              lineHeight,
              color: theme.text.default,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {PREVIEW_TEXT}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function TypeStyles() {
  return (
    <div style={{ background: theme.bg.page, minHeight: '100vh', padding: theme.spacing.xxl + 'px', fontFamily: FONT }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&display=swap" />

      <div style={{ marginBottom: theme.spacing.xxl }}>
        <h1 style={{ fontFamily: FONT, fontSize: 26, fontWeight: 300, color: theme.text.default, letterSpacing: '-0.02em', marginBottom: theme.spacing.xxs }}>
          Type Styles
        </h1>
        <p style={{ fontFamily: FONT, fontSize: 10, color: theme.text.subtlest, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          9 styles · 3 weights each · click row to copy token name
        </p>
      </div>

      <section style={{ marginBottom: theme.spacing.xxl }}>
        <SectionTitle>Variables vs Text Styles in Figma</SectionTitle>
        <p style={{ fontFamily: FONT, fontSize: 13, color: theme.text.subtle, lineHeight: 1.7, marginBottom: theme.spacing.sm }}>
          Typography exists as two separate artifacts in Figma, and they are not linked to each other.
        </p>
        <p style={{ fontFamily: FONT, fontSize: 13, color: theme.text.subtle, lineHeight: 1.7, marginBottom: theme.spacing.sm }}>
          The primitive size values — <code style={{ fontFamily: 'monospace', fontSize: 11, color: theme.accent.default, background: theme.bg.surface, padding: '1px 4px', borderRadius: 3 }}>typography/size/xxxl = 33</code> — are pushed as <strong>Variables</strong> in the Typography collection. They are raw numbers with no semantic intent, a lookup table for dimensions.
        </p>
        <p style={{ fontFamily: FONT, fontSize: 13, color: theme.text.subtle, lineHeight: 1.7 }}>
          The composed styles — <code style={{ fontFamily: 'monospace', fontSize: 11, color: theme.accent.default, background: theme.bg.surface, padding: '1px 4px', borderRadius: 3 }}>text/display/bold</code> — are pushed as <strong>Text Styles</strong> with baked-in values for font size, weight, and line height. Figma has no variable type for typography composites, so these properties cannot be bound to a variable inside a Text Style. The value is resolved and copied in at push time, not referenced.
        </p>
        <InfoBox>
          The source of truth is <code style={{ fontFamily: 'monospace', color: theme.accent.default }}>tokens/semantic/typography.json</code>. If the type scale changes, re-run <strong>Tao Token Pusher → Styles → Push All Styles</strong> to resync Text Styles in Figma with the new values.
        </InfoBox>
      </section>

      <section>
        <SectionTitle>Style reference</SectionTitle>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '120px 80px 60px 60px 60px 1fr',
          gap: theme.spacing.md,
          padding: '0 ' + theme.spacing.md + 'px ' + theme.spacing.xs + 'px',
          borderBottom: '1px solid ' + theme.border.subtle,
          marginBottom: 0,
        }}>
          {['Token', 'Weight', 'Size', 'Weight', 'Line-h', 'Preview'].map(function(h, i) {
            return <span key={i} style={{ fontFamily: FONT, fontSize: 9, color: theme.text.subtlest, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{h}</span>;
          })}
        </div>

        {STYLES.map(function(styleName) {
          return (
            <div key={styleName}>
              <div style={{ padding: theme.spacing.xs + 'px ' + theme.spacing.md + 'px ' + theme.spacing.xxs + 'px', background: theme.bg.surface, marginTop: theme.spacing.xs }}>
                <span style={{ fontFamily: FONT, fontSize: 9, color: theme.text.subtlest, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{styleName}</span>
              </div>
              <StyleRow styleName={styleName} />
            </div>
          );
        })}
      </section>
    </div>
  );
}

export default TypeStyles;
