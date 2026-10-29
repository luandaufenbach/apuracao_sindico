import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { injectStyles } from '../core/injectStyles.js';

injectStyles('lm-datatable', `
.lm-dt{font-family:var(--font-sans);width:100%}
.lm-dt__wrap{overflow-x:auto}
.lm-dt table{width:100%;border-collapse:collapse}
.lm-dt th{height:40px;padding:0 16px;font-family:var(--font-mono);font-size:11px;font-weight:400;letter-spacing:var(--tracking-caps);text-transform:uppercase;color:var(--text-tertiary);text-align:left;white-space:nowrap;box-shadow:inset 0 -1px 0 var(--border-default)}
.lm-dt th button{all:unset;cursor:pointer;display:inline-flex;align-items:center;gap:6px}
.lm-dt th button:hover{color:var(--text-primary)}
.lm-dt th button:focus-visible{box-shadow:var(--focus-shadow)}
.lm-dt td{height:56px;padding:0 16px;font-size:14px;letter-spacing:-.01em;color:var(--text-primary);box-shadow:inset 0 -1px 0 var(--border-subtle);white-space:nowrap}
.lm-dt td.lm-dt--mono,.lm-dt__v.lm-dt--mono{font-family:var(--font-mono);font-size:13px;letter-spacing:0;font-variant-numeric:tabular-nums}
.lm-dt .lm-dt--right{text-align:right}
.lm-dt tbody tr{transition:background-color var(--duration-fast)}
.lm-dt--click tbody tr{cursor:pointer}
.lm-dt--click tbody tr:hover{background:var(--surface-3)}
.lm-dt__cards{display:none;list-style:none;margin:0;padding:0;flex-direction:column;gap:8px}
.lm-dt__card{background:var(--surface-1);box-shadow:var(--shadow-hairline);border-radius:var(--radius-card);padding:14px 16px;display:flex;flex-direction:column;gap:10px}
.lm-dt--click .lm-dt__card{cursor:pointer}
.lm-dt__ctitle{display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:15px}
.lm-dt__row{display:flex;justify-content:space-between;align-items:center;gap:12px;min-height:22px}
.lm-dt__k{font-family:var(--font-mono);font-size:11px;letter-spacing:var(--tracking-caps);text-transform:uppercase;color:var(--text-tertiary)}
.lm-dt__v{font-size:14px;text-align:right}
.lm-dt__sort{display:none;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px}
.lm-dt__sort select{appearance:none;-webkit-appearance:none;background:var(--surface-2);color:var(--text-primary);border:0;box-shadow:inset 0 0 0 1px var(--border-default);border-radius:var(--radius-xs);height:40px;padding:0 12px;font-family:var(--font-mono);font-size:12px;letter-spacing:.04em;text-transform:uppercase}
.lm-dt__empty{padding:48px 16px;text-align:center;color:var(--text-tertiary);font-size:14px}
@media (max-width:767px){.lm-dt__wrap{display:none}.lm-dt__cards{display:flex}.lm-dt__sort{display:flex}}
`);

export function DataTable({ columns = [], rows = [], rowKey = 'id', onRowClick, sortable = true, defaultSort, empty = 'No results', className = '', style }) {
  const [sort, setSort] = React.useState(defaultSort || null);
  const sorted = React.useMemo(() => {
    if (!sort) return rows;
    const col = columns.find(c => c.key === sort.key);
    const get = col && col.sortValue ? col.sortValue : r => r[sort.key];
    return [...rows].sort((a, b) => { const x = get(a), y = get(b); return (x > y ? 1 : x < y ? -1 : 0) * (sort.dir === 'desc' ? -1 : 1); });
  }, [rows, sort, columns]);
  const toggle = key => setSort(s => s && s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' });
  const cell = (c, r) => c.render ? c.render(r) : r[c.key];
  const primary = columns.find(c => c.primary) || columns[0];
  const rest = columns.filter(c => c !== primary);
  const sortCols = sortable ? columns.filter(c => c.sortable !== false) : [];
  const cls = ['lm-dt', onRowClick && 'lm-dt--click', className].filter(Boolean).join(' ');
  return (
    <div className={cls} style={style}>
      {sortCols.length > 0 && <div className="lm-dt__sort">
        <span className="lm-dt__k">{rows.length} items</span>
        <select aria-label="Sort by" value={sort ? sort.key + ':' + sort.dir : ''} onChange={e => { const [key, dir] = e.target.value.split(':'); setSort(key ? { key, dir } : null); }}>
          <option value="">Sort: default</option>
          {sortCols.map(c => [<option key={c.key + 'd'} value={c.key + ':desc'}>{c.header} ↓</option>, <option key={c.key + 'a'} value={c.key + ':asc'}>{c.header} ↑</option>])}
        </select>
      </div>}
      <div className="lm-dt__wrap">
        <table>
          <thead><tr>{columns.map(c => {
            const canSort = sortable && c.sortable !== false;
            const active = sort && sort.key === c.key;
            return (
              <th key={c.key} className={c.align === 'right' ? 'lm-dt--right' : ''} style={{ width: c.width }} aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}>
                {canSort ? <button type="button" onClick={() => toggle(c.key)} style={{ color: active ? 'var(--text-primary)' : undefined }}>
                  {c.header}<Icon name={active && sort.dir === 'asc' ? 'arrow-up' : 'arrow-down'} size={12} style={{ opacity: active ? 1 : 0.35 }} />
                </button> : c.header}
              </th>
            );
          })}</tr></thead>
          <tbody>{sorted.length === 0 ? <tr><td colSpan={columns.length} className="lm-dt__empty">{empty}</td></tr> :
            sorted.map((r, i) => (
              <tr key={r[rowKey] ?? i} onClick={onRowClick ? () => onRowClick(r) : undefined}>
                {columns.map(c => <td key={c.key} className={[c.mono && 'lm-dt--mono', c.align === 'right' && 'lm-dt--right'].filter(Boolean).join(' ')}>{cell(c, r)}</td>)}
              </tr>
            ))}</tbody>
        </table>
      </div>
      <ul className="lm-dt__cards">
        {sorted.length === 0 ? <li className="lm-dt__empty">{empty}</li> : sorted.map((r, i) => (
          <li key={r[rowKey] ?? i} className="lm-dt__card" onClick={onRowClick ? () => onRowClick(r) : undefined} tabIndex={onRowClick ? 0 : undefined}>
            <div className="lm-dt__ctitle"><span>{cell(primary, r)}</span>{onRowClick && <Icon name="chevron-right" size={16} style={{ color: 'var(--text-tertiary)' }} />}</div>
            {rest.map(c => <div key={c.key} className="lm-dt__row"><span className="lm-dt__k">{c.header}</span><span className={'lm-dt__v' + (c.mono ? ' lm-dt--mono' : '')}>{cell(c, r)}</span></div>)}
          </li>
        ))}
      </ul>
    </div>
  );
}
