import figma from '@figma/code-connect';
import { Button } from './Button';

/**
 * Code Connect mapping for the Tao Button component.
 *
 * Figma file: https://www.figma.com/design/WrV3bhb7Rbkbp5D8sxbMD0/Components
 * Component set node: 113:601
 *
 * Figma props → React props:
 *   Variant → variant
 *   Size    → size
 *   State   → disabled, loading, active (derived)
 *
 * Note: Icon Left / Icon Right boolean props are not mapped here because
 * they are component properties registered via the plugin runtime and are
 * not yet visible to the Figma REST API. Add them once they sync:
 *   iconLeft:  figma.boolean('Icon Left'),
 *   iconRight: figma.boolean('Icon Right'),
 */

figma.connect(
  Button,
  'https://www.figma.com/design/WrV3bhb7Rbkbp5D8sxbMD0/Components?node-id=113-601',
  {
    props: {
      variant: figma.enum('Variant', {
        primary: 'primary',
        ghost:   'ghost',
        danger:  'danger',
      }),

      size: figma.enum('Size', {
        sm: 'sm',
        md: 'md',
        lg: 'lg',
      }),

      disabled: figma.enum('State', {
        disabled: true,
      }),

      loading: figma.enum('State', {
        loading: true,
      }),

      active: figma.enum('State', {
        active:         true,
        'active-hover': true,
        'active-press': true,
      }),
    },

    example: ({ variant, size, disabled, loading, active }) => (
      <Button
        variant={variant}
        size={size}
        disabled={disabled}
        loading={loading}
        active={active}
      >
        Button
      </Button>
    ),
  }
);