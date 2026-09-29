import { useState } from 'react';
import { inp, SB, COMMON } from '../utils';
import { Field, StatusSel, FormBtns } from './ui';

export default function CatForm({ item, onSave, onCancel }) {
  const [name, setName] = useState(item ? item.name : '');
  const [status, setStatus] = useState(item ? item.status : 'Active');
  const [err, setErr] = useState('');
  const submit = e => { e.preventDefault(); const r = onSave({ ...item, name: name.trim(), status }); if (r) setErr(r); };
  return (
    <form onSubmit={submit}>
      <Field label="Category Name"><input className={inp} value={name} onChange={e => setName(e.target.value)} /></Field>
      <Field label="Status"><StatusSel value={status} onChange={setStatus} /></Field>
      {err && <p className="text-red-700 text-sm mb-3">{err}</p>}
      <FormBtns onCancel={onCancel} />
    </form>
  );
}
