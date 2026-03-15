import React, { useState } from 'react';
import { theme } from '../tokens/theme.js';
import typographyTokens from '../tokens/semantic/typography.json';

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

function StyleRow({ styleName }) {
  const [copied, setCopied] = useState(null);

  return (
    <div style={{ borderBottom: `1px solid ${theme.border.subtle}` }}>
      {WEIGHTS.map(weight => {
        const token = typographyTokens.text[styleName]?.[weight];
        const fontSize   = resolveSize(token?.$value?.fontSize);
        const fontWeight = token?.$value?.fontWeight;
        const lineHeight = token?.$value?.lineHeight;
        const tokenName  = `text.${styleName}.${weight}`;

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
            title={`Copy: ${tokenName}`}
            style={{
              display: 'grid',
              gridTemplateColumns: '120px 80px 60px 60px 60px 1fr',
              alignItems: 'center',
              gap: theme.spacing.md,
              padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
              cursor: 'pointer',
              transition: 'background 0.12s',
              background: copied === weight ? '#f0fdf4' : 'transparent',
            }}
            onMouseEnter={e => { if (copied !== weight) e.currentTarget.style.background = theme.bg.hover; }}
            onMouseLeave={e => { if (copied !== weight) e.currentTarget.style.background = 'transparent'; }}
          >
            <span style={{ fontFamily: theme.font, fontSize: 10, color: copied === weight ? '#16a34a' : theme.text.subtlest, transition: 'color 0.2s' }}>
              {copied === weight ? '✓ copied' : tokenName}
            </span>
            <span style={{ fontFamily: theme.font, fontSize: 10, color: theme.text.subtlest, textTransform: 'capitalize' }}>{weight}</span>
            <span style={{ fontFamily: theme.font, fontSize: 10, color: theme.text.subtlest }}>{fontSize}</span>
            <span style={{ fontFamily: theme.font, fontSize: 10, color: theme.text.subtlest }}>{fontWeight}</span>
            <span style={{ fontFamily: theme.font, fontSize: 10, color: theme.text.subtlest }}>{lineHeight}</span>
            <span style={{
              fontFamily: theme.font,
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
    <div style={{ background: theme.bg.page, minHeight: '100vh', padding: `${theme.spacing.xxl}px ${theme.spacing.xxl}px`, fontFamily: theme.font }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&display=swap" />

      <div style={{ marginBottom: theme.spacing.xxl }}>
        <h1 style={{ fontFamily: theme.font, fontSize: 26, fontWeight: 300, color: theme.text.default, letterSpacing: '-0.02em', marginBottom: theme.spacing.xxs }}>
          Type Styles
        </h1>
        <p style={{ fontFamily: theme.font, fontSize: 10, color: theme.text.subtlest, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          9 styles · 3 weights each · click row to copy token name
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '120px 80px 60px 60px 60px 1fr',
        gap: theme.spacing.md,
        padding: `0 ${theme.spacing.md}px ${theme.spacing.xs}px`,
        borderBottom: `1px solid ${theme.border.subtle}`,
        marginBottom: 0,
      }}>
        {['Token', 'Weight', 'Size', 'Weight', 'Line-h', 'Preview'].map((h, i) => (
          <span key={i} style={{ fontFamily: theme.font, fontSize: 9, color: theme.text.subtlest, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{h}</span>
        ))}
      </div>

      {STYLES.map(styleName => (
        <div key={styleName}>
          <div style={{ padding: `${theme.spacing.xs}px ${theme.spacing.md}px ${theme.spacing.xxs}px`, background: theme.bg.surface, marginTop: theme.spacing.xs }}>
            <span style={{ fontFamily: theme.font, fontSize: 9, color: theme.text.subtlest, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{styleName}</span>
          </div>
          <StyleRow styleName={styleName} />
        </div>
      ))}
    </div>
  );
}

export default TypeStyles;