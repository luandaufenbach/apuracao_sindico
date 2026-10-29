import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { useCheckStyles } from './checkStyles.js';

export function Checkbox({ label, description, disabled, className = '', style, ...rest }) {
  useCheckStyles();
  return (
    <label className={['lm-check', disabled && 'lm-check--disabled', className].filter(Boolean).join(' ')} style={style}>
      <input type="checkbox" className="lm-check__input" disabled={disabled} {...rest} />
      <span className="lm-check__box" aria-hidden="true"><Icon name="check" size={14} strokeWidth={2.25} /></span>
      {(label || description) && <span className="lm-check__text">
        {label && <span className="lm-check__label">{label}</span>}
        {description && <span className="lm-check__desc">{description}</span>}
      </span>}
    </label>
  );
}
