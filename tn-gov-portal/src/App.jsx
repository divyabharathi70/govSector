import { useState, useEffect } from 'react';
import { K, load, nid, COMMON, inp, bt, PB, SB } from './utils';
import { Badge, Modal, Table, Actions, Section } from './components/ui';
import CatForm from './components/CategoryForm';
import DepForm from './components/DepartmentForm';
import SrvForm from './components/ServiceForm';
import IssForm from './components/IssueForm';
import DepView from './components/DepartmentView';

export default function App() {
  const [cats, setCats] = useState(() => load(K.c));
  const [deps, setDeps] = useState(() => load(K.d));
  const [srvs, setSrvs] = useState(() => load(K.s));
  const [iss, setIss] = useState(() => load(K.i));
  const [page, setPage] = useState('Home');
  const [modal, setModal] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [notice, setNotice] = useState('');
  const [q, setQ] = useState({ c: '', d: '', s: '', i: '' });
  const [f, setF] = useState({ cat: '', dep: '', st: '' });

  useEffect(() => { try { localStorage.setItem(K.c, JSON.stringify(cats)); } catch (e) {} }, [cats]);
  useEffect(() => { try { localStorage.setItem(K.d, JSON.stringify(deps)); } catch (e) {} }, [deps]);
  useEffect(() => { try { localStorage.setItem(K.s, JSON.stringify(srvs)); } catch (e) {} }, [srvs]);
  useEffect(() => { try { localStorage.setItem(K.i, JSON.stringify(iss)); } catch (e) {} }, [iss]);

  const setSearch = k => v => setQ({ ...q, [k]: v });
  const warn = m => { setNotice(m); setTimeout(() => setNotice(''), 5000); };
  const close = () => setModal(null);
  const catOf = d => cats.find(c => c.id === (d && d.categoryId));
  const depOf = id => deps.find(d => d.id === id);
  const has = (s, t) => s.toLowerCase().includes(t.trim().toLowerCase());
  const dup = (list, n, id) => list.some(x => x.id !== id && x.name.toLowerCase() === n.toLowerCase());

  const saveCat = c => {
    if (!c.name) return 'Category name is required.';
    if (dup(cats, c.name, c.id)) return 'A category with this name already exists.';
    setCats(c.id ? cats.map(x => x.id === c.id ? c : x) : [...cats, { ...c, id: nid('CAT', cats) }]);
    close();
  };
  const saveDep = (d, names) => {
    if (!d.name) return 'Department name is required.';
    if (!d.categoryId) return 'Please select a category.';
    if (dup(deps, d.name, d.id)) return 'A department with this name already exists.';
    const id = d.id || nid('DEP', deps);
    setDeps(d.id ? deps.map(x => x.id === id ? d : x) : [...deps, { ...d, id }]);
    let cur = iss.filter(i => i.departmentId !== id || names.includes(i.name));
    names.forEach(n => { if (!cur.some(i => i.departmentId === id && i.name === n)) cur = [...cur, { id: nid('ISS', cur), name: n, departmentId: id, status: 'Open' }]; });
    setIss(cur);
    close();
  };
  const saveSrv = s => {
    if (!s.name) return 'Service name is required.';
    if (!s.departmentId) return 'Please select a department.';
    setSrvs(s.id ? srvs.map(x => x.id === s.id ? s : x) : [...srvs, { ...s, id: nid('SRV', srvs) }]);
    close();
  };
  const saveIss = i => {
    if (!i.name) return 'Issue name is required.';
    if (iss.some(x => x.id !== i.id && x.departmentId === i.departmentId && x.name.toLowerCase() === i.name.toLowerCase())) return 'This department already has that issue.';
    setIss(iss.map(x => x.id === i.id ? i : x));
    close();
  };

  const delCat = c => {
    const n = deps.filter(d => d.categoryId === c.id).length;
    if (n) return warn(`Cannot delete "${c.name}": it is used by ${n} department(s). Reassign or delete them first.`);
    setConfirm({ msg: `Delete category "${c.name}"?`, yes: () => setCats(cats.filter(x => x.id !== c.id)) });
  };
  const delDep = d => {
    const n = srvs.filter(s => s.departmentId === d.id).length;
    if (n) return warn(`Cannot delete "${d.name}": it has ${n} service(s). Delete or reassign them first.`);
    setConfirm({ msg: `Delete department "${d.name}" and its issues?`, yes: () => { setDeps(deps.filter(x => x.id !== d.id)); setIss(iss.filter(i => i.departmentId !== d.id)); } });
  };
  const delSrv = s => setConfirm({ msg: `Delete service "${s.name}"?`, yes: () => setSrvs(srvs.filter(x => x.id !== s.id)) });
  const delIss = i => setConfirm({ msg: `Delete issue "${i.name}"?`, yes: () => setIss(iss.filter(x => x.id !== i.id)) });

  const openAddDep = () => cats.length ? setModal({ t: 'dep' }) : warn('Please add a category first.');
  const openAddSrv = () => deps.length ? setModal({ t: 'srv' }) : warn('Please add a department first.');

  const catRows = cats.filter(c => has(c.name, q.c)).map(c => [c.id, c.name, <Badge v={c.status} />, <Actions onEdit={() => setModal({ t: 'cat', item: c })} onDelete={() => delCat(c)} />]);
  const depRows = deps.filter(d => { const cn = (catOf(d) || {}).name || ''; const is = iss.filter(i => i.departmentId === d.id).map(i => i.name).join(' '); return has(d.name + ' ' + cn + ' ' + is, q.d); })
    .map(d => [d.id, d.name, (catOf(d) || {}).name || '—', iss.filter(i => i.departmentId === d.id).map(i => i.name).join(', ') || '—', <Badge v={d.status} />,
      <Actions onView={() => setModal({ t: 'view', item: d })} onEdit={() => setModal({ t: 'dep', item: d })} onDelete={() => delDep(d)} />]);
  const srvRows = srvs.filter(s => { const d = depOf(s.departmentId); return has(s.name + ' ' + (d ? d.name : '') + ' ' + ((catOf(d) || {}).name || ''), q.s); })
    .map(s => { const d = depOf(s.departmentId); return [s.id, s.name, d ? d.name : '—', (catOf(d) || {}).name || '—', <Badge v={s.status} />, <Actions onEdit={() => setModal({ t: 'srv', item: s })} onDelete={() => delSrv(s)} />]; });
  const issRows = iss.filter(i => { const d = depOf(i.departmentId); return has(i.name + ' ' + i.id, q.i) && (!f.cat || (d && d.categoryId === f.cat)) && (!f.dep || i.departmentId === f.dep) && (!f.st || i.status === f.st); })
    .map(i => { const d = depOf(i.departmentId); return [i.id, i.name, (catOf(d) || {}).name || '—', d ? d.name : '—', <Badge v={i.status} />, <Actions onEdit={() => setModal({ t: 'iss', item: i })} onDelete={() => delIss(i)} />]; });

  const nav = ['Home', 'Departments', 'Services', 'Issues'];
  return (
    <div className="min-h-screen text-slate-800">
      <div className="h-1 bg-gradient-to-r from-orange-500 via-white to-green-600" />
      <header className="bg-blue-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white text-xl flex items-center justify-center">🏛️</div>
            <div className="leading-tight"><div className="font-semibold">Government of Tamil Nadu</div><div className="text-xs text-blue-200">Services &amp; Public Issues Portal</div></div>
          </div>
          <nav className="flex gap-1">
            {nav.map(n => <button key={n} onClick={() => setPage(n)} className={"px-3 py-2 text-sm border-b-2 " + (page === n ? "border-amber-400 font-semibold" : "border-transparent text-blue-100 hover:text-white")}>{n}</button>)}
          </nav>
        </div>
      </header>

      {notice && <div className="max-w-6xl mx-auto px-4 mt-4"><div className="bg-amber-50 border border-amber-300 text-amber-900 text-sm rounded px-4 py-2 flex justify-between"><span>{notice}</span><button onClick={() => setNotice('')}>&times;</button></div></div>}

      <main className="max-w-6xl mx-auto px-4 py-6">
        {page === 'Home' && <>
          <div className="mb-6 rounded overflow-hidden border border-slate-200 bg-white">
            <img src="/banner.jpg" alt="Tamil Nadu Government – Government Services & Public Issues Management" className="block w-full h-auto" />
          </div>
          <div className="flex flex-wrap gap-3 mb-8">
            <button className={PB} onClick={() => setModal({ t: 'cat' })}>Add Category</button>
            <button className={PB} onClick={openAddDep}>Add Department</button>
            <button className={PB} onClick={openAddSrv}>Add Service</button>
          </div>
          <Section title="Categories" search={q.c} setSearch={setSearch('c')}><Table heads={['ID', 'Category Name', 'Status', 'Actions']} rows={catRows} /></Section>
        </>}
        {page === 'Departments' && <Section title="Departments" addLabel="Add Department" onAdd={openAddDep} search={q.d} setSearch={setSearch('d')}><Table heads={['ID', 'Department', 'Category', 'Issues', 'Status', 'Actions']} rows={depRows} /></Section>}
        {page === 'Services' && <Section title="Services" addLabel="Add Service" onAdd={openAddSrv} search={q.s} setSearch={setSearch('s')}><Table heads={['ID', 'Service Name', 'Department', 'Category', 'Status', 'Actions']} rows={srvRows} /></Section>}
        {page === 'Issues' && <Section title="Public Issues" search={q.i} setSearch={setSearch('i')}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
            <select className={inp} value={f.cat} onChange={e => setF({ ...f, cat: e.target.value })}><option value="">All categories</option>{cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
            <select className={inp} value={f.dep} onChange={e => setF({ ...f, dep: e.target.value })}><option value="">All departments</option>{deps.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select>
            <select className={inp} value={f.st} onChange={e => setF({ ...f, st: e.target.value })}><option value="">All statuses</option>{['Open', 'In Progress', 'Resolved'].map(s => <option key={s}>{s}</option>)}</select>
          </div>
          <Table heads={['Issue ID', 'Issue', 'Category', 'Department', 'Status', 'Actions']} rows={issRows} />
          <p className="text-xs text-slate-500 mt-2">Issues are created from the Department form.</p>
        </Section>}
      </main>

      {modal && modal.t === 'cat' && <Modal title={modal.item ? 'Edit Category' : 'Add Category'} onClose={close}><CatForm item={modal.item} onSave={saveCat} onCancel={close} /></Modal>}
      {modal && modal.t === 'dep' && <Modal title={modal.item ? 'Edit Department' : 'Add Department'} onClose={close}><DepForm item={modal.item} cats={cats} issues={iss} onSave={saveDep} onCancel={close} /></Modal>}
      {modal && modal.t === 'srv' && <Modal title={modal.item ? 'Edit Service' : 'Add Service'} onClose={close}><SrvForm item={modal.item} cats={cats} deps={deps} onSave={saveSrv} onCancel={close} /></Modal>}
      {modal && modal.t === 'iss' && <Modal title="Edit Issue" onClose={close}><IssForm item={modal.item} deps={deps} onSave={saveIss} onCancel={close} /></Modal>}
      {modal && modal.t === 'view' && <Modal title="Department Details" onClose={close}><DepView dep={modal.item} cat={catOf(modal.item)} issues={iss.filter(i => i.departmentId === modal.item.id)} onClose={close} /></Modal>}
      {confirm && <Modal title="Confirm Delete" onClose={() => setConfirm(null)}>
        <p className="text-sm mb-5">{confirm.msg}</p>
        <div className="flex justify-end gap-2"><button className={SB} onClick={() => setConfirm(null)}>Cancel</button><button className={bt + "bg-red-700 text-white hover:bg-red-800"} onClick={() => { confirm.yes(); setConfirm(null); }}>Delete</button></div>
      </Modal>}
    </div>
  );
}
