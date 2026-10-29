import React from 'react';
import { useCheckStyles } from './checkStyles.js';

export function Radio({ label, description, disabled, className = '', style, ...rest }) {
  useCheckStyles();
  return (
    <label className={['lm-check', disabled && 'lm-check--disabled', className].filter(Boolean).join(' ')} style={style}>
      <input type="radio" className="lm-check__input" disabled={disabled} {...rest} />
      <span className="lm-check__box lm-check__box--radio" aria-hidden="true"><span className="lm-check__dot" /></span>
      {(label || description) && <span className="lm-check__text">
        {label && <span className="lm-check__label">{label}</span>}
        {description && <span className="lm-check__desc">{description}</span>}
      </span>}
    </label>
  );
}
