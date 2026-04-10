import React from 'react';
import './Spinner.css';

/**
 * Spinner component — Tao Design System
 *
 * Figma: https://www.figma.com/design/WrV3bhb7Rbkbp5D8sxbMD0/Components?node-id=404-576
 * 4 sizes · 5 color variants · uses border/* tokens · motion from tao-duration/easing tokens
 *
 * Layers:
 *   track     — full circle, 32% opacity (--tao-opacity-32)
 *   indicator — quarter-arc (top → right), round caps, full opacity
 */

export function Spinner({
  size       = 'md',
  color      = 'default',
  className,
  style,
  role       = 'status',
  'aria-label': ariaLabel = 'Loading',
  'aria-hidden': ariaHidden,
}) {
  const classes = [
    'tao-spinner',
    `tao-spinner--${size}`,
    `tao-spinner--${color}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <span
      className={classes}
      style={style}
      role={ariaHidden ? undefined : role}
      aria-label={ariaHidden ? undefined : ariaLabel}
      aria-hidden={ariaHidden || undefined}
    >
      <svg
        viewBox="0 0 16 16"
        width="100%"
        height="100%"
        fill="none"
        aria-hidden="true"
      >
        {/* Track — full circle */}
        <circle
          className="tao-spinner__track"
          cx="8" cy="8" r="6"
          stroke="currentColor"
          vectorEffect="non-scaling-stroke"
        />
        {/* Indicator — quarter-arc, top (12 o'clock) → right (3 o'clock) */}
        <path
          className="tao-spinner__indicator"
          d="M8 2a6 6 0 0 1 6 6"
          stroke="currentColor"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  );
}

export default Spinner;
