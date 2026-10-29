import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { useFieldStyles } from './fieldStyles.js';

export function Select({ label, hint, error, required, options = [], placeholder, size = 'md', disabled, id, className = '', style, ...rest }) {
  useFieldStyles();
  const autoId = React.useId();
  const fid = id || autoId;
  const ctrl = ['lm-control', 'lm-control--' + size, error && 'lm-control--invalid', disabled && 'lm-control--disabled'].filter(Boolean).join(' ');
  return (
    <div className={'lm-field ' + className} style={style}>
      {label && <label className="lm-field__label" htmlFor={fid}>{label}{required && <span className="lm-field__req" aria-hidden="true">*</span>}</label>}
      <div className={ctrl}>
        <select id={fid} disabled={disabled} required={required} aria-invalid={!!error || undefined} {...rest}>
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map(o => typeof o === 'string' ? <option key={o} value={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <Icon name="chevron-down" size={16} className="lm-control__chev" />
      </div>
      {error ? <span className="lm-field__err"><Icon name="circle-x" size={14} />{error}</span> : hint && <span className="lm-field__hint">{hint}</span>}
    </div>
  );
}
