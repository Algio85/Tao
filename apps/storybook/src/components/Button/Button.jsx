import React from 'react';
import { Spinner } from '../Spinner/Spinner';
import './Button.css';

/**
 * Button component — Tao Design System
 *
 * Figma: https://www.figma.com/design/WrV3bhb7Rbkbp5D8sxbMD0/Components?node-id=257-1643
 * 3 variants · 3 sizes · optional icon left/right · active + loading + disabled states.
 */

export function Button({
  variant   = 'primary', // 'primary' | 'ghost' | 'outline' | 'danger'
  size      = 'md',
  label     = 'Button',
  iconLeft  = null,
  iconRight = null,
  active    = false,
  toggle    = false,
  disabled  = false,
  loading   = false,
  onClick,
  className,
  style,
  as: Tag   = 'button',
  'aria-label': ariaLabel,
  ...rest
}) {
  const isDisabled = disabled || loading;

  const classes = [
    'tao-button',
    `tao-button--${variant}`,
    `tao-button--${size}`,
    loading && 'tao-button--loading',
    className,
  ].filter(Boolean).join(' ');

  return (
    <Tag
      {...rest}
      className={classes}
      style={style}
      disabled={Tag === 'button' ? isDisabled || undefined : undefined}
      aria-disabled={Tag !== 'button' ? isDisabled || undefined : undefined}
      tabIndex={Tag !== 'button' && isDisabled ? -1 : undefined}
      aria-pressed={toggle ? active : undefined}
      aria-busy={loading ? true : undefined}
      aria-label={!label ? ariaLabel : undefined}
      data-active={active ? 'true' : undefined}
      onClick={!isDisabled ? onClick : undefined}
    >
      {loading ? (
        <Spinner
          size={size === 'lg' ? 'md' : 'sm'}
          color="default"
          className="tao-button__spinner"
          aria-hidden="true"
        />
      ) : (
        iconLeft && (
          <span className="tao-button__icon tao-button__icon--left" aria-hidden="true">
            {iconLeft}
          </span>
        )
      )}

      {label && <span className="tao-button__label">{label}</span>}

      {!loading && iconRight && (
        <span className="tao-button__icon tao-button__icon--right" aria-hidden="true">
          {iconRight}
        </span>
      )}
    </Tag>
  );
}

export default Button;
