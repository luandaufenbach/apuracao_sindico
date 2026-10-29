import React from 'react';

export function Wordmark({ name = 'Lumen', size = 24, color = 'currentColor', style }) {
  return (
    <span style={{ fontFamily: 'var(--font-display)', fontSize: size, lineHeight: 1, letterSpacing: '-0.05em', fontWeight: 400, color, whiteSpace: 'nowrap', ...style }}>{name}</span>
  );
}
