import { useState } from 'react';
import { inp, SB, COMMON } from '../utils';
import { Field, StatusSel, FormBtns } from './ui';

export default function DepForm({ item, cats, issues, onSave, onCancel }) {
  const [name, setName] = useState(item ? item.name : '');
  const [categoryId, setCategoryId] = useState(item ? item.categoryId : '');
  const [status, setStatus] = useState(item ? item.status : 'Active');
  const [list, setList] = useState(item ? issues.filter(i => i.departmentId === item.id).map(i => i.name) : []);
  const [text, setText] = useState('');
  const [err, setErr] = useState('');
  const add = n => { n = n.trim(); if (n && !list.some(x => x.toLowerCase() === n.toLowerCase())) setList([...list, n]); setText(''); };
  const submit = e => { e.preventDefault(); const r = onSave({ ...item, name: name.trim(), categoryId, status }, list); if (r) setErr(r); };
  return (
    <form onSubmit={submit}>
      <Field label="Department Name"><input className={inp} value={name} onChange={e => setName(e.target.value)} /></Field>
      <Field label="Category">
        <select className={inp} value={categoryId} onChange={e => setCategoryId(e.target.value)}>
          <option value="">-- Select category --</option>
          {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </Field>
      <Field label="Department Issues">
        <div className="flex gap-2">
          <input className={inp} value={text} placeholder="Type an issue and press Add" onChange={e => setText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(text); } }} />
          <button type="button" className={SB} onClick={() => add(text)}>Add</button>
        </div>
      </Field>
      <div className="flex flex-wrap gap-2 mb-3">
        {list.map(n => <span key={n} className="bg-blue-50 border border-blue-200 text-blue-900 text-sm rounded px-2 py-0.5">{n} <button type="button" className="ml-1 text-slate-500" onClick={() => setList(list.filter(x => x !== n))}>&times;</button></span>)}
        {!list.length && <span className="text-sm text-slate-500">No issues added yet.</span>}
      </div>
      <p className="text-xs text-slate-500 mb-1">Quick add:</p>
      <div className="flex flex-wrap gap-1 mb-4">
        {COMMON.map(n => <button type="button" key={n} onClick={() => add(n)} className="text-xs border border-slate-300 rounded px-2 py-0.5 hover:bg-slate-100">{n}</button>)}
      </div>
      <Field label="Status"><StatusSel value={status} onChange={setStatus} /></Field>
      {err && <p className="text-red-700 text-sm mb-3">{err}</p>}
      <FormBtns onCancel={onCancel} />
    </form>
  );
}
