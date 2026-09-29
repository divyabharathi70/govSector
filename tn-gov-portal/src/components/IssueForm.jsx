import { useState } from 'react';
import { inp, SB, COMMON } from '../utils';
import { Field, StatusSel, FormBtns } from './ui';

export default function IssForm({ item, deps, onSave, onCancel }) {
  const [name, setName] = useState(item.name);
  const [departmentId, setDepartmentId] = useState(item.departmentId);
  const [status, setStatus] = useState(item.status);
  const [err, setErr] = useState('');
  const submit = e => { e.preventDefault(); const r = onSave({ ...item, name: name.trim(), departmentId, status }); if (r) setErr(r); };
  return (
    <form onSubmit={submit}>
      <Field label="Issue Name"><input className={inp} value={name} onChange={e => setName(e.target.value)} /></Field>
      <Field label="Department">
        <select className={inp} value={departmentId} onChange={e => setDepartmentId(e.target.value)}>{deps.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select>
      </Field>
      <Field label="Status"><StatusSel value={status} onChange={setStatus} opts={['Open', 'In Progress', 'Resolved']} /></Field>
      {err && <p className="text-red-700 text-sm mb-3">{err}</p>}
      <FormBtns onCancel={onCancel} />
    </form>
  );
}
