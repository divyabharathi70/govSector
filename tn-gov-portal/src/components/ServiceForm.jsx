import { useState } from 'react';
import { inp, SB, COMMON } from '../utils';
import { Field, StatusSel, FormBtns } from './ui';

export default function SrvForm({ item, cats, deps, onSave, onCancel }) {
  const [name, setName] = useState(item ? item.name : '');
  const [departmentId, setDepartmentId] = useState(item ? item.departmentId : '');
  const [status, setStatus] = useState(item ? item.status : 'Active');
  const [err, setErr] = useState('');
  const dep = deps.find(d => d.id === departmentId);
  const cat = dep && cats.find(c => c.id === dep.categoryId);
  const submit = e => { e.preventDefault(); const r = onSave({ ...item, name: name.trim(), departmentId, status }); if (r) setErr(r); };
  return (
    <form onSubmit={submit}>
      <Field label="Service Name"><input className={inp} value={name} onChange={e => setName(e.target.value)} /></Field>
      <Field label="Related Department">
        <select className={inp} value={departmentId} onChange={e => setDepartmentId(e.target.value)}>
          <option value="">-- Select department --</option>
          {deps.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </Field>
      <Field label="Related Category (auto)"><input className={inp + " bg-slate-100"} readOnly value={cat ? cat.name : '—'} /></Field>
      <Field label="Status"><StatusSel value={status} onChange={setStatus} /></Field>
      {err && <p className="text-red-700 text-sm mb-3">{err}</p>}
      <FormBtns onCancel={onCancel} />
    </form>
  );
}
