import React from 'react';
import './BadgeStatus.css';

/**
 * BadgeStatus component — Tao Design System
 *
 * Figma: https://www.figma.com/design/WrV3bhb7Rbkbp5D8sxbMD0/Components?node-id=118-448
 * 9 color variants, optional icon left/right, editable label.
 */

export function BadgeStatus({
  color     = 'neutral',
  label     = 'Label',
  iconLeft  = null,
  iconRight = null,
  className,
  style,
}) {
  return (
    <span
      className={`badge-status badge-status--${color}${className ? ` ${className}` : ''}`}
      style={style}
    >
      {iconLeft && (
        <span className="badge-status__icon badge-status__icon--left" aria-hidden="true">
          {iconLeft}
        </span>
      )}
      <span className="badge-status__label">{label}</span>
      {iconRight && (
        <span className="badge-status__icon badge-status__icon--right" aria-hidden="true">
          {iconRight}
        </span>
      )}
    </span>
  );
}

export default BadgeStatus;
