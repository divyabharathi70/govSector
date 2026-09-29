export const K = { c: 'government_categories', d: 'government_departments', s: 'government_services', i: 'government_issues' };

export const load = k => { try { const v = JSON.parse(localStorage.getItem(k)); return Array.isArray(v) ? v : []; } catch (e) { return []; } };

export const nid = (p, l) => p + String(Math.max(0, ...l.map(x => parseInt(x.id.slice(p.length)) || 0)) + 1).padStart(3, '0');

export const COMMON = ['Road Damage','Street Light Issues','Water Supply','Drainage Problems','Garbage Collection','Electricity Issues','Public Transport','Sanitation','Government Building Maintenance','Traffic Issues'];

export const inp = "w-full border border-slate-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-800";

export const bt = "px-4 py-2 rounded text-sm font-medium ";

export const PB = bt + "bg-blue-900 text-white hover:bg-blue-800";

export const SB = bt + "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50";

export const BADGE = { Active: 'bg-green-100 text-green-800', Inactive: 'bg-slate-200 text-slate-700', Open: 'bg-red-100 text-red-800', 'In Progress': 'bg-amber-100 text-amber-800', Resolved: 'bg-green-100 text-green-800' };

