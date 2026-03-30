import React, { useState } from 'react';
import './Checkbox.css';

export function Checkbox({
  checked        = false,
  defaultChecked,
  state,
  label          = 'Label',
  required       = false,
  id,
  onChange,
  className,
}) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked ?? checked);
  const isChecked  = state ? checked : internalChecked;
  const isDisabled = state === 'disabled';

  const inputId = id || `checkbox-${label.toLowerCase().replace(/\s+/g, '-')}`;

  const handleChange = (e) => {
    if (!isDisabled) {
      setInternalChecked(e.target.checked);
      onChange?.(e);
    }
  };

  return (
    <label
      htmlFor={inputId}
      className={[
        'checkbox',
        isDisabled        ? 'checkbox--disabled'     : '',
        state === 'hover' ? 'checkbox--static-hover' : '',
        state === 'press' ? 'checkbox--static-press' : '',
        className || '',
      ].filter(Boolean).join(' ')}
    >
      <input
        id={inputId}
        type="checkbox"
        className="checkbox__input"
        checked={isChecked}
        disabled={isDisabled}
        required={required}
        aria-checked={isChecked}
        aria-required={required}
        aria-label={label}
        onChange={handleChange}
      />
      <span className="checkbox__box" aria-hidden="true" />
      <span className="checkbox__label-group">
        <span className={['checkbox__label', isDisabled ? 'checkbox__label--disabled' : ''].filter(Boolean).join(' ')}>
          {label}
        </span>
        {required && (
          <span className="checkbox__required" aria-hidden="true">(required)</span>
        )}
      </span>
    </label>
  );
}

export default Checkbox;
