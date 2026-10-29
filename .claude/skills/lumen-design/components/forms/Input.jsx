import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { useFieldStyles } from './fieldStyles.js';

export function Input({ label, hint, error, required, iconLeft, suffix, size = 'md', multiline = false, rows = 4, disabled, id, className = '', style, ...rest }) {
  useFieldStyles();
  const autoId = React.useId();
  const fid = id || autoId;
  const describedBy = error ? fid + '-err' : hint ? fid + '-hint' : undefined;
  const ctrl = ['lm-control', 'lm-control--' + size, multiline && 'lm-control--multi', error && 'lm-control--invalid', disabled && 'lm-control--disabled'].filter(Boolean).join(' ');
  const Field = multiline ? 'textarea' : 'input';
  return (
    <div className={'lm-field ' + className} style={style}>
      {label && <label className="lm-field__label" htmlFor={fid}>{label}{required && <span className="lm-field__req" aria-hidden="true">*</span>}</label>}
      <div className={ctrl}>
        {iconLeft && <Icon name={iconLeft} size={18} />}
        <Field id={fid} rows={multiline ? rows : undefined} disabled={disabled} required={required} aria-invalid={!!error || undefined} aria-describedby={describedBy} {...rest} />
        {suffix && <span className="lm-control__suffix">{suffix}</span>}
      </div>
      {error ? <span id={fid + '-err'} className="lm-field__err"><Icon name="circle-x" size={14} />{error}</span>
        : hint && <span id={fid + '-hint'} className="lm-field__hint">{hint}</span>}
    </div>
  );
}
