import { inp, bt, PB, SB, BADGE } from '../utils';

export const Badge = ({ v }) => <span className={"px-2 py-0.5 rounded text-xs font-medium " + BADGE[v]}>{v}</span>;

export const Field = ({ label, children }) => <label className="block mb-4"><span className="block text-sm font-medium text-slate-700 mb-1">{label}</span>{children}</label>;

export function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-40 bg-slate-900/50 flex items-center justify-center p-4">
      <div className="bg-white rounded shadow-lg w-full max-w-lg max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center px-5 py-3 border-b bg-slate-50">
          <h3 className="font-semibold text-blue-900">{title}</h3>
          <button onClick={onClose} className="text-slate-500 text-xl leading-none">&times;</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function Table({ heads, rows }) {
  if (!rows.length) return <div className="text-center text-slate-500 text-sm py-10 border border-dashed border-slate-300 rounded bg-white">No records found.</div>;
  return (
    <div className="overflow-x-auto bg-white border border-slate-200 rounded">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-100 text-slate-700"><tr>{heads.map(h => <th key={h} className="px-4 py-2 font-semibold whitespace-nowrap">{h}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i} className="border-t border-slate-200 align-top">{r.map((c, j) => <td key={j} className="px-4 py-2">{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

export const Actions = ({ onEdit, onDelete, onView }) => (
  <div className="flex gap-3 text-sm whitespace-nowrap">
    {onView && <button onClick={onView} className="text-slate-700 hover:underline">View</button>}
    <button onClick={onEdit} className="text-blue-800 hover:underline">Edit</button>
    <button onClick={onDelete} className="text-red-700 hover:underline">Delete</button>
  </div>
);

export function Section({ title, addLabel, onAdd, search, setSearch, children }) {
  return (
    <section className="mb-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <h2 className="text-lg font-semibold text-blue-900">{title}</h2>
        <div className="flex gap-2 flex-1 sm:flex-none justify-end">
          <input className={inp + " sm:w-64"} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          {onAdd && <button className={PB + " whitespace-nowrap"} onClick={onAdd}>{addLabel}</button>}
        </div>
      </div>
      {children}
    </section>
  );
}

export const StatusSel = ({ value, onChange, opts = ['Active', 'Inactive'] }) => (
  <select className={inp} value={value} onChange={e => onChange(e.target.value)}>{opts.map(o => <option key={o}>{o}</option>)}</select>
);

export const FormBtns = ({ onCancel }) => (
  <div className="flex justify-end gap-2 mt-2"><button type="button" className={SB} onClick={onCancel}>Cancel</button><button type="submit" className={PB}>Save</button></div>
);

