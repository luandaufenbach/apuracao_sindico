import React from 'react';
import { useCheckStyles } from './checkStyles.js';

export function Switch({ checked, defaultChecked = false, onChange, label, description, disabled, className = '', style }) {
  useCheckStyles();
  const [inner, setInner] = React.useState(defaultChecked);
  const on = checked ?? inner;
  const toggle = () => { if (checked === undefined) setInner(!on); onChange && onChange(!on); };
  return (
    <button type="button" role="switch" aria-checked={on} disabled={disabled} onClick={toggle} className={'lm-switch ' + className} style={style}>
      <span className="lm-switch__track"><span className="lm-switch__thumb" /></span>
      {(label || description) && <span className="lm-check__text">
        {label && <span className="lm-check__label">{label}</span>}
        {description && <span className="lm-check__desc">{description}</span>}
      </span>}
    </button>
  );
}
