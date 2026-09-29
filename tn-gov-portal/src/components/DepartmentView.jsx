import { useState } from 'react';
import { inp, SB, COMMON } from '../utils';
import { Field, StatusSel, FormBtns } from './ui';

export default function DepView({ dep, cat, issues, onClose }) {
  const [sel, setSel] = useState('');
  return (
    <div>
      <p className="font-semibold text-slate-800 mb-3">{dep.name}</p>
      <p className="text-sm font-medium text-slate-700 mb-1">Category</p>
      <label className="flex items-center gap-2 text-sm mb-4"><input type="radio" checked readOnly /> {cat ? cat.name : '—'}</label>
      <p className="text-sm font-medium text-slate-700 mb-1">Issues</p>
      {issues.map(i => <label key={i.id} className="flex items-center gap-2 text-sm mb-1"><input type="radio" name="dep-issue" checked={sel === i.id} onChange={() => setSel(i.id)} /> {i.name}</label>)}
      {!issues.length && <p className="text-sm text-slate-500">No issues for this department.</p>}
      <div className="flex justify-end mt-4"><button className={SB} onClick={onClose}>Close</button></div>
    </div>
  );
}
