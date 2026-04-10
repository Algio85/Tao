import React from 'react';
import { Spinner } from '../components/Spinner/Spinner';

export default {
  title: 'Components/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Spinner diameter — maps to spacing tokens (sm=16px, md=20px, lg=24px, xl=32px)',
    },
    color: {
      control: 'select',
      options: ['default', 'brand', 'success', 'danger', 'inverse'],
      description: 'Color variant — each aliases a border/* semantic token',
    },
  },
  args: {
    size: 'md',
    color: 'default',
  },
};

/* ─── Playground ─────────────────────────────────────────────────────────── */

export const Playground = {};

/* ─── Sizes ──────────────────────────────────────────────────────────────── */

export const Sizes = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--tao-spacing-lg)' }}>
      <Spinner size="sm" color="default" />
      <Spinner size="md" color="default" />
      <Spinner size="lg" color="default" />
      <Spinner size="xl" color="default" />
    </div>
  ),
};

/* ─── Colors ─────────────────────────────────────────────────────────────── */

export const Colors = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--tao-spacing-lg)' }}>
      <Spinner size="lg" color="default" />
      <Spinner size="lg" color="brand" />
      <Spinner size="lg" color="success" />
      <Spinner size="lg" color="danger" />
      <div style={{
        background: 'var(--tao-surface-neutral-strongest)',
        borderRadius: 'var(--tao-radius-md)',
        padding: 'var(--tao-spacing-sm)',
      }}>
        <Spinner size="lg" color="inverse" />
      </div>
    </div>
  ),
};

/* ─── All variants ───────────────────────────────────────────────────────── */

export const AllVariants = {
  render: () => {
    const sizes  = ['sm', 'md', 'lg', 'xl'];
    const colors = ['default', 'brand', 'success', 'danger', 'inverse'];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tao-spacing-lg)' }}>
        {sizes.map(size => (
          <div key={size} style={{ display: 'flex', alignItems: 'center', gap: 'var(--tao-spacing-lg)' }}>
            {colors.map(color => {
              const isInverse = color === 'inverse';
              return (
                <div
                  key={color}
                  style={{
                    display:         'flex',
                    alignItems:      'center',
                    justifyContent:  'center',
                    width:           'var(--tao-spacing-xxl)',
                    height:          'var(--tao-spacing-xxl)',
                    borderRadius:    'var(--tao-radius-md)',
                    background: isInverse
                      ? 'var(--tao-surface-neutral-strongest)'
                      : 'transparent',
                  }}
                >
                  <Spinner size={size} color={color} />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  },
};

/* ─── In context: loading button ─────────────────────────────────────────── */

export const InButton = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--tao-spacing-sm)', alignItems: 'center' }}>
      <button
        style={{
          display:       'inline-flex',
          alignItems:    'center',
          gap:           'var(--tao-spacing-xs)',
          padding:       'var(--tao-spacing-xs) var(--tao-spacing-md)',
          background:    'var(--tao-surface-brand-2-strong)',
          color:         'var(--tao-text-inverse)',
          border:        'none',
          borderRadius:  'var(--tao-radius-md)',
          fontSize:      'var(--tao-typography-size-md)',
          fontWeight:    600,
          cursor:        'wait',
        }}
        disabled
      >
        <Spinner size="sm" color="inverse" />
        Saving…
      </button>
      <button
        style={{
          display:       'inline-flex',
          alignItems:    'center',
          gap:           'var(--tao-spacing-xs)',
          padding:       'var(--tao-spacing-xs) var(--tao-spacing-md)',
          background:    'var(--tao-surface-neutral-subtlest)',
          color:         'var(--tao-text-default)',
          border:        'none',
          borderRadius:  'var(--tao-radius-md)',
          fontSize:      'var(--tao-typography-size-md)',
          fontWeight:    600,
          cursor:        'wait',
        }}
        disabled
      >
        <Spinner size="sm" color="default" />
        Loading…
      </button>
    </div>
  ),
};
