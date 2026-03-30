import React, { useState } from 'react';
import './RadioButton.css';

export function RadioButton({
  selected        = false,
  defaultSelected,
  state,
  label           = 'Label',
  required        = false,
  id,
  name,
  value,
  onChange,
  className,
}) {
  const [internalSelected, setInternalSelected] = useState(defaultSelected ?? selected);
  const isSelected = state ? selected : internalSelected;
  const isDisabled = state === 'disabled';

  const inputId = id || `radio-${label.toLowerCase().replace(/\s+/g, '-')}`;

  const handleChange = (e) => {
    if (!isDisabled) {
      setInternalSelected(e.target.checked);
      onChange?.(e);
    }
  };

  return (
    <label
      htmlFor={inputId}
      className={[
        'radio-button',
        isDisabled        ? 'radio-button--disabled'     : '',
        state === 'hover' ? 'radio-button--static-hover' : '',
        state === 'press' ? 'radio-button--static-press' : '',
        className || '',
      ].filter(Boolean).join(' ')}
    >
      <input
        id={inputId}
        type="radio"
        name={name}
        value={value}
        className="radio-button__input"
        checked={isSelected}
        disabled={isDisabled}
        required={required}
        aria-checked={isSelected}
        aria-required={required}
        aria-label={label}
        onChange={handleChange}
      />
      <span className="radio-button__radio" aria-hidden="true" />
      <span className="radio-button__label-group">
        <span className={['radio-button__label', isDisabled ? 'radio-button__label--disabled' : ''].filter(Boolean).join(' ')}>
          {label}
        </span>
        {required && (
          <span className="radio-button__required" aria-hidden="true">(required)</span>
        )}
      </span>
    </label>
  );
}

export default RadioButton;
