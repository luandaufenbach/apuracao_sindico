import React from 'react';
import { ICON_PATHS } from './iconPaths.js';

export function Icon({ name, size = 20, strokeWidth = 1.5, title, style, className = '', ...rest }) {
  const inner = ICON_PATHS[name];
  if (!inner) return null;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      aria-hidden={title ? undefined : true} role={title ? 'img' : undefined} aria-label={title}
      className={className} style={{ flexShrink: 0, display: 'block', ...style }}
      dangerouslySetInnerHTML={{ __html: (title ? '<title>' + title + '</title>' : '') + inner }} {...rest} />
  );
}

export const ICON_NAMES = Object.keys(ICON_PATHS);
