import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { BarChart, Bar, AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// ═══════════════════════════════════════════════════════════════════════════
// HOW TO ADD A NEW MODULE — READ THIS FIRST
// ═══════════════════════════════════════════════════════════════════════════
// 1. Add seed data to INIT (below) under a new key, e.g. INIT.mymodule = [...]
// 2. Create a React component: const MyModule = ({data, setData, user}) => { ... }
// 3. Add it to PAGES: { ..., mymodule: MyModule }
// 4. Add a title to TITLES: { ..., mymodule: 'My Module' }
// 5. Add a nav entry to NAVS: { id:'mymodule', icon:'◈', label:'My Module' }
//    under an existing section header or add a new section header
// 6. Add role access to ROLE_ACCESS for each role that should see it
// That's it — storage, persistence, AI context all inherit automatically.
// ═══════════════════════════════════════════════════════════════════════════

// ─── STYLES ─────────────────────────────────────────────────────────────────────
const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;600;700;800;900&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    :root{
      --bg:#07070f;--s1:#0c0c18;--s2:#101020;--s3:#14142a;
      --bdr:#1a1a30;--bdr2:#222238;
      --acc:#00e5ff;--acc2:#7c3aed;--acc3:#f97316;
      --txt:#dde1f0;--muted:#4a5070;--dim:#2a3050;
      --ok:#10b981;--warn:#f59e0b;--err:#ef4444;--info:#3b82f6;
    }
    html,body,#root{height:100%;overflow:hidden;background:var(--bg)}
    .app{display:flex;height:100vh;font-family:'Inter',sans-serif;color:var(--txt);background:var(--bg);overflow:hidden}
    ::-webkit-scrollbar{width:3px;height:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--bdr2);border-radius:2px}
    .hd{font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:.03em}
    .mono{font-family:'JetBrains Mono',monospace}
    table{width:100%;border-collapse:collapse}
    th{font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:700;letter-spacing:.13em;text-transform:uppercase;color:var(--muted);padding:9px 12px;border-bottom:1px solid var(--bdr);text-align:left;white-space:nowrap;background:var(--s2)}
    td{padding:8px 12px;border-bottom:1px solid var(--bdr);font-size:12.5px}
    tr:last-child td{border-bottom:none}
    tr:hover td{background:rgba(255,255,255,.012)}
    input,select,textarea{background:var(--s2);border:1px solid var(--bdr);color:var(--txt);padding:7px 10px;border-radius:5px;font-family:'Inter',sans-serif;font-size:13px;outline:none;width:100%;transition:border-color .15s,box-shadow .15s}
    input:focus,select:focus,textarea:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(0,229,255,.07)}
    label{font-size:10px;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:4px}
    select option{background:var(--s2)}
    @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes slideR{from{transform:translateX(100%)}to{transform:translateX(0)}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
    @keyframes spin{to{transform:rotate(360deg)}}
    .fade-up{animation:fadeUp .2s ease}.fade-in{animation:fadeIn .2s ease}.slide-r{animation:slideR .3s cubic-bezier(.25,.46,.45,.94)}
    .spin{animation:spin .8s linear infinite}.pulse{animation:pulse 2s infinite}
    .btn{display:inline-flex;align-items:center;gap:5px;padding:7px 14px;border-radius:5px;border:none;font-family:'Barlow Condensed',sans-serif;font-size:12.5px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;cursor:pointer;transition:all .15s;white-space:nowrap;user-select:none}
    .btn:disabled{opacity:.4;cursor:not-allowed}
    .btn-p{background:var(--acc);color:#000}.btn-p:hover:not(:disabled){filter:brightness(1.1);box-shadow:0 0 14px rgba(0,229,255,.3)}
    .btn-v{background:var(--acc2);color:#fff}.btn-v:hover:not(:disabled){filter:brightness(1.15)}
    .btn-g{background:transparent;color:var(--muted);border:1px solid var(--bdr)}.btn-g:hover{color:var(--txt);border-color:var(--dim)}
    .btn-d{background:rgba(239,68,68,.1);color:var(--err);border:1px solid rgba(239,68,68,.2)}.btn-d:hover{background:rgba(239,68,68,.2)}
    .btn-ok{background:rgba(16,185,129,.12);color:var(--ok);border:1px solid rgba(16,185,129,.25)}.btn-ok:hover{background:rgba(16,185,129,.22)}
    .btn-warn{background:rgba(245,158,11,.12);color:var(--warn);border:1px solid rgba(245,158,11,.25)}.btn-warn:hover{background:rgba(245,158,11,.22)}
    .btn-sm{padding:4px 9px;font-size:10.5px}.btn-xs{padding:2px 7px;font-size:10px}
    .badge{display:inline-flex;align-items:center;padding:2px 7px;border-radius:3px;font-family:'Barlow Condensed',sans-serif;font-size:10.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
    .overlay{position:fixed;inset:0;background:rgba(0,0,0,.82);z-index:300;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(10px)}
    .modal{background:var(--s1);border:1px solid var(--bdr2);border-radius:10px;width:580px;max-height:90vh;overflow-y:auto;padding:26px;animation:fadeUp .2s ease;box-shadow:0 24px 64px rgba(0,0,0,.6)}
    .modal-lg{width:760px}.modal-xl{width:960px}
    .stat-card{background:var(--s1);border:1px solid var(--bdr);border-radius:8px;padding:18px 20px}
    .sidebar{width:214px;min-width:214px;background:var(--s1);border-right:1px solid var(--bdr);display:flex;flex-direction:column;height:100vh}
    .nav-i{display:flex;align-items:center;gap:8px;padding:7px 12px;margin:1px 7px;border-radius:6px;cursor:pointer;font-size:12.5px;color:var(--muted);transition:all .12s;user-select:none}
    .nav-i:hover{background:var(--s2);color:var(--txt)}.nav-i.on{background:rgba(0,229,255,.08);color:var(--acc);border:1px solid rgba(0,229,255,.12)}
    .nav-section{font-family:'Barlow Condensed',sans-serif;font-size:9px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--dim);padding:10px 14px 3px;margin-top:4px}
    .main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}
    .topbar{height:50px;min-height:50px;background:var(--s1);border-bottom:1px solid var(--bdr);display:flex;align-items:center;padding:0 18px;gap:10px}
    .content{flex:1;overflow-y:auto;padding:22px}
    .grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
    .grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px}
    .grid4{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:14px}
    .card{background:var(--s1);border:1px solid var(--bdr);border-radius:8px;padding:18px}
    .section-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap;gap:10px}
    .ai-panel{position:fixed;right:0;top:0;bottom:0;width:370px;background:var(--s1);border-left:1px solid var(--bdr);display:flex;flex-direction:column;z-index:150}
    .ai-msg{padding:10px 12px;border-radius:7px;margin-bottom:6px;font-size:12.5px;line-height:1.55}
    .ai-u{background:var(--s3);border:1px solid var(--bdr)}.ai-a{background:rgba(0,229,255,.05);border:1px solid rgba(0,229,255,.14)}
    .progress-bar{height:3px;background:var(--bdr);border-radius:2px;overflow:hidden}
    .progress-fill{height:100%;border-radius:2px;transition:width .4s}
    .chip{display:inline-flex;align-items:center;gap:3px;padding:2px 7px;background:var(--s3);border:1px solid var(--bdr);border-radius:3px;font-size:11px;color:var(--muted);font-family:'Barlow Condensed',sans-serif;font-weight:600;letter-spacing:.04em}
    .tab{padding:5px 13px;border-radius:4px;cursor:pointer;font-family:'Barlow Condensed',sans-serif;font-size:11.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);transition:all .12s;border:none;background:none}
    .tab:hover{color:var(--txt)}.tab.on{background:rgba(0,229,255,.1);color:var(--acc)}
    .search{background:var(--s2);border:1px solid var(--bdr);color:var(--txt);padding:6px 10px;border-radius:5px;font-size:12.5px;outline:none}
    .search:focus{border-color:var(--acc)}
    .divider{height:1px;background:var(--bdr);margin:14px 0}
    .alert-bar{border-radius:6px;padding:9px 13px;margin-bottom:14px;display:flex;gap:8px;align-items:flex-start;font-size:12px}
    .alert-err{background:rgba(239,68,68,.07);border:1px solid rgba(239,68,68,.2)}
    .alert-warn{background:rgba(245,158,11,.07);border:1px solid rgba(245,158,11,.2)}
    .alert-info{background:rgba(59,130,246,.07);border:1px solid rgba(59,130,246,.2)}
    .alert-ok{background:rgba(16,185,129,.07);border:1px solid rgba(16,185,129,.2)}
    input[type=range]{padding:0;height:4px;accent-color:var(--acc)}
    input[type=checkbox]{width:auto;accent-color:var(--acc)}
    .skill-cell{width:28px;height:28px;border-radius:4px;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;cursor:pointer;border:none;transition:all .15s}
    @media print{.no-print{display:none!important}.print-only{display:block!important}body{background:#fff!important;color:#000!important}}
    .print-only{display:none}
    .login-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg);position:relative;overflow:hidden}
    .login-wrap::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 50% 0%,rgba(0,229,255,.07),transparent)}
    .login-box{background:var(--s1);border:1px solid var(--bdr2);border-radius:12px;padding:36px;width:420px;box-shadow:0 32px 80px rgba(0,0,0,.7);animation:fadeUp .3s ease}
    .login-input{background:var(--s2);border:1px solid var(--bdr);color:var(--txt);padding:11px 13px;border-radius:6px;font-size:14px;outline:none;width:100%;transition:border-color .15s}
    .login-input:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(0,229,255,.08)}
    .role-admin{color:#f97316;background:rgba(249,115,22,.12);border:1px solid rgba(249,115,22,.3)}
    .role-office{color:#a78bfa;background:rgba(167,139,250,.12);border:1px solid rgba(167,139,250,.3)}
    .role-shop{color:#34d399;background:rgba(52,211,153,.12);border:1px solid rgba(52,211,153,.3)}
    .ref-table td,.ref-table th{padding:6px 10px;font-size:11.5px}
    .calc-box{background:var(--s2);border:1px solid var(--bdr);border-radius:8px;padding:18px}
  `}</style>
);

// ─── CONSTANTS ───────────────────────────────────────────────────────────────────
const DEMO_USERS = [
  { email:'admin@maisyrailing.com',  password:'Maisy2026$',  role:'admin',  name:'Daniel Jones',    title:'Director of Operations' },
  { email:'rocky@maisyrailing.com',  password:'Maisy2026$',  role:'owner',  name:'Rocky',           title:'Owner' },
  { email:'office@maisyrailing.com', password:'Maisy2026$',  role:'office', name:'Office Staff',     title:'Office' },
  { email:'shop@maisyrailing.com',   password:'Maisy2026$',  role:'shop',   name:'Shop Floor',       title:'Production' },
];

const ROLE_ACCESS = {
  admin:  ['dashboard','todo','sales','production','inventory','shipping','invoicing','purchasing','jobcost','customers','autopo','people','shopref','automation','sister','finance','kpi','srscatalog','legacyorders','printcenter','reports'],
  owner:  ['dashboard','sales','invoicing','finance','reports','customers','automation','people','kpi','printcenter'],
  office: ['dashboard','todo','sales','invoicing','shipping','customers','srscatalog','printcenter'],
  shop:   ['dashboard','todo','production','shopref','printcenter'],
};

const BADGE = {
  Completed:'#10b981',Complete:'#10b981',Received:'#10b981',Paid:'#10b981',Delivered:'#10b981',Active:'#10b981',
  'In Progress':'#3b82f6','In Transit':'#3b82f6',Ordered:'#3b82f6','Ready to Ship':'#3b82f6',
  Queued:'#f59e0b',Pending:'#f59e0b',Quoted:'#f59e0b',Draft:'#f59e0b','Not Started':'#f59e0b',
  Shipped:'#a78bfa','In Production':'#a78bfa',Planning:'#a78bfa',
  Overdue:'#ef4444',Cancelled:'#ef4444',Exception:'#ef4444','On Hold':'#f97316',
  Done:'#10b981','In Review':'#3b82f6',Open:'#f59e0b',Blocked:'#ef4444',
  Low:'#4a5070',Medium:'#f59e0b',High:'#f97316',Critical:'#ef4444',
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────────
const fmt$  = n => '$'+(n||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const fmtD  = d => d ? new Date(d+'T00:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '—';
const fmtDs = d => d ? new Date(d+'T00:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric'}) : '—';
const uid   = () => Math.random().toString(36).slice(2,8).toUpperCase();
const now   = () => new Date().toISOString().slice(0,10);
const ts    = () => new Date().toLocaleString();
const deg2rad = d => d * Math.PI / 180;

// ─── PRINT ENGINE ─────────────────────────────────────────────────────────────
const PRINT_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Inter',sans-serif;font-size:11px;color:#1a1a2e;background:#fff;padding:0}
  .page{width:100%;max-width:800px;margin:0 auto;padding:28px 32px}
  .hdr{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #1a1a2e;padding-bottom:12px;margin-bottom:18px}
  .logo{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:800;letter-spacing:.04em;text-transform:uppercase}
  .logo span{color:#00e5ff}
  .doc-title{font-family:'Barlow Condensed',sans-serif;font-size:28px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}
  .doc-meta{font-size:10px;color:#6b7280;letter-spacing:.06em;text-transform:uppercase}
  .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}
  .grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px}
  .grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px}
  .box{border:1px solid #e5e7eb;border-radius:6px;padding:12px 14px}
  .box-label{font-size:9px;color:#9ca3af;letter-spacing:.1em;text-transform:uppercase;margin-bottom:4px}
  .box-val{font-size:15px;font-weight:600;font-family:'Barlow Condensed',sans-serif}
  .section-title{font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#6b7280;border-bottom:1px solid #e5e7eb;padding-bottom:4px;margin:16px 0 10px}
  table{width:100%;border-collapse:collapse;font-size:11px;margin-bottom:16px}
  th{background:#f3f4f6;text-align:left;padding:6px 8px;font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#6b7280;border-bottom:1px solid #d1d5db}
  td{padding:6px 8px;border-bottom:1px solid #f3f4f6}
  tr:last-child td{border-bottom:none}
  .badge{display:inline-block;padding:2px 7px;border-radius:3px;font-size:9px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
  .badge-ok{background:#d1fae5;color:#065f46}
  .badge-warn{background:#fef3c7;color:#92400e}
  .badge-err{background:#fee2e2;color:#991b1b}
  .badge-blue{background:#dbeafe;color:#1e40af}
  .badge-gray{background:#f3f4f6;color:#6b7280}
  .sig-line{border-top:1px solid #1a1a2e;margin-top:32px;padding-top:4px;font-size:10px;color:#6b7280;display:flex;justify-content:space-between}
  .write-line{border-bottom:1px solid #d1d5db;height:22px;margin-bottom:8px}
  .write-label{font-size:9px;color:#9ca3af;letter-spacing:.08em;text-transform:uppercase;margin-bottom:2px}
  .checkbox-row{display:flex;align-items:center;gap:8px;margin-bottom:7px;font-size:11px}
  .checkbox{width:14px;height:14px;border:1.5px solid #9ca3af;border-radius:2px;flex-shrink:0}
  .acct-row{display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #f3f4f6;font-size:11px}
  .acct-total{font-weight:700;font-size:12px;border-top:2px solid #1a1a2e;padding-top:6px;margin-top:4px}
  .watermark{position:fixed;bottom:18px;right:24px;font-size:9px;color:#d1d5db;letter-spacing:.06em;text-transform:uppercase}
  @media print{body{print-color-adjust:exact;-webkit-print-color-adjust:exact}.no-print{display:none}@page{margin:14mm 12mm}}
`;

const printHTML = (title, bodyHTML) => {
  const w = window.open('','_blank','width=900,height=750');
  const scriptTag = '<scr'+'ipt>window.onload=()=>{window.print();}</scr'+'ipt>';
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title} — Maisy Railing</title><style>${PRINT_CSS}</style></head><body>${bodyHTML}<div class="watermark">Maisy Railing · Printed ${new Date().toLocaleDateString()} · Confidential</div>${scriptTag}</body></html>`);
  w.document.close();
};

const PrintBtn = ({onClick,label='Print',small}) => (
  <button onClick={onClick} className={`btn${small?' btn-xs':''}`} style={{background:'none',border:'1px solid var(--bdr)',color:'var(--muted)',display:'flex',alignItems:'center',gap:5,fontFamily:'Barlow Condensed',fontSize:small?10:11,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase'}} title="Print">
    🖨 {label}
  </button>
);

const printWorkOrder = (wo) => {
  const jc = (wo.matCost||0) + ((wo.laborHrs||0)*(wo.laborRate||28));
  printHTML(`Work Order ${wo.id}`, `
    <div class="page">
      <div class="hdr">
        <div><div class="logo">MAISY<span>ERP</span> · Maisy Railing</div><div class="doc-meta">Work Order Traveler</div></div>
        <div style="text-align:right"><div class="doc-title">${wo.id}</div><div class="doc-meta">Printed ${new Date().toLocaleDateString()}</div></div>
      </div>
      <div class="grid-4">
        <div class="box"><div class="box-label">Order Ref</div><div class="box-val">${wo.orderId||'—'}</div></div>
        <div class="box"><div class="box-label">Station</div><div class="box-val">${wo.station}</div></div>
        <div class="box"><div class="box-label">Qty</div><div class="box-val">${wo.qty} pcs</div></div>
        <div class="box"><div class="box-label">Due Date</div><div class="box-val" style="font-size:13px">${wo.due||'—'}</div></div>
      </div>
      <div class="section-title">Product</div>
      <div class="box" style="font-size:14px;font-weight:600;margin-bottom:16px">${wo.product}</div>
      <div class="section-title">Job Cost Summary</div>
      <div class="grid-3">
        <div class="box"><div class="box-label">Material Cost</div><div class="box-val">$${(wo.matCost||0).toFixed(2)}</div></div>
        <div class="box"><div class="box-label">Labor (${wo.laborHrs||0} hrs × $${wo.laborRate||0}/hr)</div><div class="box-val">$${((wo.laborHrs||0)*(wo.laborRate||0)).toFixed(2)}</div></div>
        <div class="box" style="background:#f0fdf4"><div class="box-label">Total Job Cost</div><div class="box-val" style="color:#065f46">$${jc.toFixed(2)}</div></div>
      </div>
      <div class="section-title">Production Checklist</div>
      <table>
        <thead><tr><th>Station</th><th>Task</th><th>Operator</th><th>Time</th><th>Sign-off</th></tr></thead>
        <tbody>
          ${['Material Pull & Verify','CNC Setup & Cut','Drill / Punch','TIG Weld','Grind & Finish','Powder Coat Prep','Powder Coat','Assembly & Hardware','QC Inspection','Packaging'].map(t=>`<tr><td></td><td>${t}</td><td style="min-width:90px"> </td><td style="min-width:70px"> </td><td style="min-width:80px"> </td></tr>`).join('')}
        </tbody>
      </table>
      <div class="section-title">Notes / Special Instructions</div>
      <div class="write-line"/><div class="write-line"/><div class="write-line"/>
      <div class="sig-line"><span>Assigned: ${wo.assigned||'__________________'}</span><span>Supervisor: __________________</span><span>QC Sign-off: __________________</span></div>
    </div>`);
};

const printInvoice = (inv) => {
  printHTML(`Invoice ${inv.id}`, `
    <div class="page">
      <div class="hdr">
        <div><div class="logo">MAISY<span>ERP</span> · Maisy Railing</div><div class="doc-meta">2150 E Glenrose Dr, Hayden, ID 83835 · (208) 603-8149</div></div>
        <div style="text-align:right"><div class="doc-title">INVOICE</div><div class="doc-meta" style="font-size:14px;font-weight:700;color:#1a1a2e">${inv.id}</div></div>
      </div>
      <div class="grid-2">
        <div><div class="section-title">Bill To</div>
          <div style="font-size:13px;font-weight:600;margin-bottom:4px">${inv.customer}</div>
          <div class="doc-meta">Order Ref: ${inv.orderId||'—'}</div>
        </div>
        <div style="text-align:right">
          <div class="box" style="display:inline-block;min-width:200px">
            <div class="acct-row"><span>Invoice Date:</span><span>${inv.issued||'—'}</span></div>
            <div class="acct-row"><span>Due Date:</span><span style="font-weight:600;color:${inv.status==='Overdue'?'#991b1b':'#1a1a2e'}">${inv.due||'—'}</span></div>
            <div class="acct-row"><span>Status:</span><span><span class="badge badge-${inv.status==='Paid'?'ok':inv.status==='Overdue'?'err':'warn'}">${inv.status}</span></span></div>
          </div>
        </div>
      </div>
      <table>
        <thead><tr><th>Description</th><th style="text-align:right">Amount</th></tr></thead>
        <tbody>
          <tr><td>Railing Systems — ${inv.orderId||'Custom Order'}</td><td style="text-align:right">$${(inv.amount||0).toFixed(2)}</td></tr>
        </tbody>
      </table>
      <div style="display:flex;justify-content:flex-end;margin-bottom:24px">
        <div style="min-width:240px">
          <div class="acct-row"><span>Subtotal</span><span>$${(inv.amount||0).toFixed(2)}</span></div>
          <div class="acct-row"><span>Tax (0%)</span><span>$0.00</span></div>
          <div class="acct-total acct-row"><span>TOTAL DUE</span><span>$${(inv.amount||0).toFixed(2)}</span></div>
          ${inv.paid?`<div class="acct-row" style="color:#065f46"><span>Paid ${inv.paid}</span><span>-$${(inv.amount||0).toFixed(2)}</span></div>`:''}
        </div>
      </div>
      <div class="section-title">Payment Instructions</div>
      <div style="font-size:11px;line-height:1.7;color:#374151">
        <b>Check:</b> Payable to Maisy Railing LLC &nbsp;|&nbsp; <b>ACH/Wire:</b> Contact daniel@maisyrailing.com for banking details<br>
        Net 15 — Late payments subject to 1.5% monthly finance charge.
      </div>
      <div class="sig-line"><span>Maisy Railing LLC · Hayden, Idaho</span><span>Questions? daniel@maisyrailing.com · (208) 603-8149</span></div>
    </div>`);
};

const printPO = (po) => {
  const items = po.items||[];
  const total = items.reduce((a,b)=>a+(b.qty*b.cost),0)||po.total||0;
  printHTML(`PO ${po.id}`, `
    <div class="page">
      <div class="hdr">
        <div><div class="logo">MAISY<span>ERP</span> · Maisy Railing</div><div class="doc-meta">2150 E Glenrose Dr, Hayden, ID 83835</div></div>
        <div style="text-align:right"><div class="doc-title">PURCHASE ORDER</div><div class="doc-meta" style="font-size:14px;font-weight:700;color:#1a1a2e">${po.id}</div></div>
      </div>
      <div class="grid-2" style="margin-bottom:20px">
        <div><div class="section-title">Vendor</div>
          <div style="font-size:13px;font-weight:600">${po.vendor||'—'}</div>
          ${po.vendorId?`<div class="doc-meta">Vendor ID: ${po.vendorId}</div>`:''}
        </div>
        <div>
          <div class="box">
            <div class="acct-row"><span>PO Date:</span><span>${po.ordered||now()}</span></div>
            <div class="acct-row"><span>Expected:</span><span>${po.expected||'—'}</span></div>
            <div class="acct-row"><span>Status:</span><span><span class="badge badge-blue">${po.status||'Draft'}</span></span></div>
          </div>
        </div>
      </div>
      <table>
        <thead><tr><th>#</th><th>Item / Description</th><th style="text-align:center">Qty</th><th>Unit</th><th style="text-align:right">Unit Cost</th><th style="text-align:right">Total</th></tr></thead>
        <tbody>
          ${items.length>0?items.map((it,i)=>`<tr><td>${i+1}</td><td>${it.name||it.inventoryId||'—'}</td><td style="text-align:center">${it.qty}</td><td>${it.unit||''}</td><td style="text-align:right">$${(it.cost||0).toFixed(2)}</td><td style="text-align:right">$${((it.qty||0)*(it.cost||0)).toFixed(2)}</td></tr>`).join(''):`<tr><td colspan="6" style="text-align:center;color:#9ca3af;padding:20px">See notes below</td></tr>`}
        </tbody>
      </table>
      <div style="display:flex;justify-content:flex-end;margin-bottom:20px">
        <div style="min-width:220px">
          <div class="acct-total acct-row"><span>PO TOTAL</span><span>$${total.toFixed(2)}</span></div>
        </div>
      </div>
      <div class="section-title">Notes / Special Instructions</div>
      <div class="write-line"/><div class="write-line"/>
      <div class="section-title">Authorized By</div>
      <div class="sig-line"><span>Approved: Daniel Jones, Director of Operations</span><span>Date: __________________</span></div>
    </div>`);
};

const printPackingSlip = (shipment) => {
  printHTML(`Packing Slip ${shipment.id||''}`, `
    <div class="page">
      <div class="hdr">
        <div><div class="logo">MAISY<span>ERP</span> · Maisy Railing</div><div class="doc-meta">2150 E Glenrose Dr · Hayden, ID 83835 · (208) 603-8149</div></div>
        <div style="text-align:right"><div class="doc-title">PACKING SLIP</div><div class="doc-meta">${new Date().toLocaleDateString()}</div></div>
      </div>
      <div class="grid-2">
        <div><div class="section-title">Ship From</div>
          <div style="font-size:11px;line-height:1.8">Maisy Railing LLC<br>2150 E Glenrose Dr<br>Hayden, ID 83835</div>
        </div>
        <div><div class="section-title">Ship To</div>
          <div style="font-size:13px;font-weight:600;margin-bottom:4px">${shipment.customer||shipment.destCity||'—'}</div>
          <div style="font-size:11px;line-height:1.8">${shipment.destCity||''}${shipment.destState?', '+shipment.destState:''}</div>
        </div>
      </div>
      <div class="grid-4">
        <div class="box"><div class="box-label">Carrier</div><div class="box-val" style="font-size:12px">${shipment.carrier||'—'}</div></div>
        <div class="box"><div class="box-label">Service</div><div class="box-val" style="font-size:12px">${shipment.service||'—'}</div></div>
        <div class="box"><div class="box-label">Weight</div><div class="box-val">${shipment.weight||'—'} lbs</div></div>
        <div class="box"><div class="box-label">Tracking</div><div class="box-val" style="font-size:10px;word-break:break-all">${shipment.tracking||'—'}</div></div>
      </div>
      <div class="section-title">Contents</div>
      <table>
        <thead><tr><th>#</th><th>Description</th><th>Qty</th><th>Condition</th><th>Notes</th></tr></thead>
        <tbody>
          <tr><td>1</td><td>Aluminum Railing System — ${shipment.customer||''}</td><td> </td><td><span class="badge badge-ok">New</span></td><td></td></tr>
          <tr><td>2</td><td>Hardware Kit</td><td> </td><td><span class="badge badge-ok">New</span></td><td></td></tr>
          <tr><td>3</td><td>Installation Instructions</td><td>1</td><td><span class="badge badge-ok">New</span></td><td></td></tr>
        </tbody>
      </table>
      <div class="section-title">Condition on Departure</div>
      ${['Inspected by QC','All hardware included','No visible damage','Photos taken'].map(t=>`<div class="checkbox-row"><div class="checkbox"></div><span>${t}</span></div>`).join('')}
      <div class="sig-line"><span>Packed by: __________________</span><span>Inspected by: __________________</span><span>Date: __________________</span></div>
    </div>`);
};

const printHuddleBoard = (date) => {
  const d = date||new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'});
  printHTML('Daily Huddle Board', `
    <div class="page">
      <div class="hdr">
        <div><div class="logo">MAISY<span>ERP</span> · Maisy Railing</div><div class="doc-meta">Daily Production Standup</div></div>
        <div style="text-align:right"><div class="doc-title">HUDDLE BOARD</div><div class="doc-meta">${d}</div></div>
      </div>
      <div class="section-title">Team Updates</div>
      <table>
        <thead><tr><th style="width:18%">Team Member</th><th>Completed Yesterday</th><th>Working On Today</th><th style="width:22%">Blockers / Needs</th></tr></thead>
        <tbody>
          ${['Amber','Jace','Nick','Michael',''].map(n=>`<tr style="height:44px"><td style="font-weight:600">${n}</td><td></td><td></td><td></td></tr>`).join('')}
        </tbody>
      </table>
      <div class="grid-2">
        <div>
          <div class="section-title">🔥 Today's Priorities (Top 3)</div>
          ${[1,2,3].map(n=>`<div class="checkbox-row"><div class="checkbox"></div><div style="flex:1;border-bottom:1px solid #e5e7eb;height:22px"></div></div>`).join('')}
          <div class="section-title">⚠️ Safety / Quality Alerts</div>
          <div class="write-line"/><div class="write-line"/>
        </div>
        <div>
          <div class="section-title">📦 Orders Shipping Today</div>
          <div class="write-line"/><div class="write-line"/><div class="write-line"/>
          <div class="section-title">📊 Yesterday's Output vs Goal</div>
          <table>
            <thead><tr><th>Station</th><th>Goal</th><th>Actual</th><th>Δ</th></tr></thead>
            <tbody>${['Cutting','CNC','Welding','Powder Coat','Assembly'].map(s=>`<tr style="height:26px"><td>${s}</td><td></td><td></td><td></td></tr>`).join('')}</tbody>
          </table>
        </div>
      </div>
      <div class="section-title">💡 Improvement Ideas / Notes</div>
      <div class="write-line"/><div class="write-line"/>
      <div class="sig-line"><span>Facilitator: __________________</span><span>Start Time: ______</span><span>End Time: ______</span><span>Attendees: ______ of ______</span></div>
    </div>`);
};

const printKPIReport = (data) => {
  const weekly = (data.kpiWeekly||[]).filter(w=>w.onTimeDeliveryPct||w.wipCount||w.scrapWasteDollar).slice(-8);
  const targets = data.kpiTargets||[];
  printHTML('KPI Report', `
    <div class="page">
      <div class="hdr">
        <div><div class="logo">MAISY<span>ERP</span> · Maisy Railing</div><div class="doc-meta">Operations KPI Report</div></div>
        <div style="text-align:right"><div class="doc-title">KPI REPORT</div><div class="doc-meta">Printed ${new Date().toLocaleDateString()}</div></div>
      </div>
      <div class="section-title">KPI Targets</div>
      <table>
        <thead><tr><th>Metric</th><th>🟢 Green Target</th><th>🟡 Yellow</th><th>Unit</th></tr></thead>
        <tbody>${targets.map(t=>`<tr><td>${t.metric}</td><td style="color:#065f46;font-weight:600">${(t.green*100).toFixed(0)}</td><td style="color:#92400e">${(t.yellow*100).toFixed(0)}</td><td style="color:#6b7280">${t.unit}</td></tr>`).join('')}</tbody>
      </table>
      <div class="section-title">Weekly KPI Trend (Last 8 Weeks)</div>
      <table>
        <thead><tr><th>Week Ending</th><th>On-Time %</th><th>FPY %</th><th>Lead Time</th><th>WIP</th><th>Scrap $</th><th>Safety</th></tr></thead>
        <tbody>${weekly.length>0?weekly.map(w=>`<tr><td>${w.weekEnding}</td><td style="${w.onTimeDeliveryPct>=95?'color:#065f46':w.onTimeDeliveryPct>=85?'color:#92400e':'color:#991b1b'}">${w.onTimeDeliveryPct||'—'}</td><td>${w.firstPassYieldPct||'—'}</td><td>${w.avgLeadTimeDays||'—'}</td><td>${w.wipCount||'—'}</td><td>${w.scrapWasteDollar?'$'+w.scrapWasteDollar:'—'}</td><td style="${w.safetyIncidents>0?'color:#991b1b;font-weight:700':''}">${w.safetyIncidents||'0'}</td></tr>`).join(''):`<tr><td colspan="7" style="text-align:center;color:#9ca3af;padding:16px">No weekly data entered yet — use KPI Dashboard to log weekly metrics</td></tr>`}</tbody>
      </table>
      <div class="section-title">Station Output (Process Cost Analysis)</div>
      <table>
        <thead><tr><th>Station</th><th>Min/Section</th><th>Sections/Day</th><th>Labor $/Day</th><th>Total $/Day</th></tr></thead>
        <tbody>${(data.costPerStation||[]).slice(0,10).map(s=>`<tr><td>${s.station}</td><td>${s.timePerSectionMin?.toFixed(1)||'—'}</td><td>${s.sectionsPerDay?.toFixed(0)||'—'}</td><td>$${s.laborDollarDay?.toFixed(0)||'—'}</td><td>$${s.totalProcessDollarDay?.toFixed(0)||'—'}</td></tr>`).join('')}</tbody>
      </table>
      <div class="sig-line"><span>Report by: Daniel Jones, Director of Operations</span><span>Maisy Railing · ${new Date().toLocaleDateString()}</span></div>
    </div>`);
};

const printInventoryReport = (data) => {
  const inv = data.inventory||[];
  const critical = inv.filter(i=>i.status==='CRITICAL'||i.qty<=i.reorder);
  printHTML('Inventory Report', `
    <div class="page">
      <div class="hdr">
        <div><div class="logo">MAISY<span>ERP</span> · Maisy Railing</div><div class="doc-meta">Inventory Status Report</div></div>
        <div style="text-align:right"><div class="doc-title">INVENTORY</div><div class="doc-meta">Printed ${new Date().toLocaleDateString()}</div></div>
      </div>
      <div class="grid-4" style="margin-bottom:16px">
        <div class="box"><div class="box-label">Total Items</div><div class="box-val">${inv.length}</div></div>
        <div class="box"><div class="box-label">Critical / Low</div><div class="box-val" style="color:#991b1b">${critical.length}</div></div>
        <div class="box"><div class="box-label">Raw Materials</div><div class="box-val">${(data.rawMaterials||[]).length}</div></div>
        <div class="box"><div class="box-label">Assembly Items</div><div class="box-val">${(data.assemblyItems||[]).length}</div></div>
      </div>
      <div class="section-title">🔴 Critical / Low Stock — Reorder Required</div>
      <table>
        <thead><tr><th>ID</th><th>Description</th><th>On Hand</th><th>Reorder Point</th><th>Unit</th><th>Vendor</th><th>Status</th></tr></thead>
        <tbody>${critical.map(i=>`<tr><td style="font-family:monospace;font-size:10px">${i.id}</td><td>${i.name}</td><td style="font-weight:700;color:#991b1b">${i.qty}</td><td>${i.reorder||i.minOnHand||'—'}</td><td>${i.unit}</td><td style="font-size:10px">${i.vendor||'—'}</td><td><span class="badge badge-err">${i.status}</span></td></tr>`).join('')}</tbody>
      </table>
      <div class="section-title">Full Inventory — Raw Materials</div>
      <table>
        <thead><tr><th>ID</th><th>Description</th><th>Qty On Hand</th><th>Unit</th><th>Cost</th><th>Value</th><th>Status</th></tr></thead>
        <tbody>${(data.rawMaterials||[]).map(i=>`<tr><td style="font-family:monospace;font-size:10px">${i.id}</td><td style="font-size:10px">${i.name}</td><td style="${i.status==='CRITICAL'?'color:#991b1b;font-weight:700':''}">${i.qty}</td><td>${i.unit}</td><td>$${i.cost||'—'}</td><td>$${i.value||((i.qty||0)*(i.cost||0)).toFixed(2)}</td><td><span class="badge badge-${i.status==='OK'?'ok':i.status==='CRITICAL'?'err':'warn'}">${i.status||'—'}</span></td></tr>`).join('')}</tbody>
      </table>
      <div class="sig-line"><span>Cycle Count by: __________________</span><span>Date: __________________</span><span>Verified by: __________________</span></div>
    </div>`);
};

const printSafetyLog = (data) => {
  const log = data.safetyLog||[];
  printHTML('Safety Log', `
    <div class="page">
      <div class="hdr">
        <div><div class="logo">MAISY<span>ERP</span> · Maisy Railing</div><div class="doc-meta">Safety Incident Log · OSHA Recordkeeping</div></div>
        <div style="text-align:right"><div class="doc-title">SAFETY LOG</div><div class="doc-meta">Printed ${new Date().toLocaleDateString()}</div></div>
      </div>
      <div class="grid-4" style="margin-bottom:16px">
        <div class="box"><div class="box-label">Total Incidents</div><div class="box-val">${log.length}</div></div>
        <div class="box"><div class="box-label">Open</div><div class="box-val" style="color:#991b1b">${log.filter(l=>l.status&&l.status.toLowerCase().includes('open')).length}</div></div>
        <div class="box"><div class="box-label">Injuries</div><div class="box-val" style="color:#d97706">${log.filter(l=>l.type&&l.type.toLowerCase().includes('injury')).length}</div></div>
        <div class="box"><div class="box-label">Near Misses</div><div class="box-val">${log.filter(l=>l.type&&l.type.toLowerCase().includes('near')).length}</div></div>
      </div>
      <table>
        <thead><tr><th>Date</th><th>Type</th><th>Location</th><th>Involved</th><th>Description</th><th>Corrective Action</th><th>Status</th></tr></thead>
        <tbody>${log.map(l=>`<tr><td style="white-space:nowrap">${l.date||'—'}</td><td><span class="badge badge-${l.type&&l.type.toLowerCase().includes('injury')?'err':l.type&&l.type.toLowerCase().includes('near')?'warn':'gray'}">${l.type||'—'}</span></td><td style="font-size:10px">${l.location||'—'}</td><td style="font-size:10px">${l.involved||'—'}</td><td style="font-size:10px;max-width:150px">${l.description||'—'}</td><td style="font-size:10px;max-width:120px">${l.corrAction||'—'}</td><td><span class="badge badge-${l.status&&l.status.toLowerCase().includes('closed')?'ok':'err'}">${l.status||'—'}</span></td></tr>`).join('')}
        ${log.length===0?'<tr><td colspan="7" style="text-align:center;color:#9ca3af;padding:20px">No incidents recorded</td></tr>':''}</tbody>
      </table>
      <div class="section-title">Blank Incident Report</div>
      <div class="grid-2">
        <div><div class="write-label">Date / Time</div><div class="write-line"/>
        <div class="write-label">Location / Station</div><div class="write-line"/>
        <div class="write-label">Employee(s) Involved</div><div class="write-line"/></div>
        <div><div class="write-label">Incident Type</div><div class="write-line"/>
        <div class="write-label">Reported By</div><div class="write-line"/>
        <div class="write-label">Supervisor Notified</div><div class="write-line"/></div>
      </div>
      <div class="write-label">Description of Incident</div><div class="write-line"/><div class="write-line"/>
      <div class="write-label">Root Cause</div><div class="write-line"/>
      <div class="write-label">Corrective Action Taken</div><div class="write-line"/><div class="write-line"/>
      <div class="sig-line"><span>Employee Signature: __________________</span><span>Supervisor: __________________</span><span>Date: __________</span></div>
    </div>`);
};

const printImprovementLog = (data) => {
  const log = data.improvementLog||[];
  const totalSavings = log.reduce((a,b)=>a+(b.estSavings||0),0);
  printHTML('Improvement Log', `
    <div class="page">
      <div class="hdr">
        <div><div class="logo">MAISY<span>ERP</span> · Maisy Railing</div><div class="doc-meta">Kaizen / Continuous Improvement Log</div></div>
        <div style="text-align:right"><div class="doc-title">IMPROVEMENT LOG</div><div class="doc-meta">Printed ${new Date().toLocaleDateString()}</div></div>
      </div>
      <div class="grid-4" style="margin-bottom:16px">
        <div class="box"><div class="box-label">Total Ideas</div><div class="box-val">${log.length}</div></div>
        <div class="box"><div class="box-label">Complete</div><div class="box-val" style="color:#065f46">${log.filter(l=>l.status==='Complete').length}</div></div>
        <div class="box"><div class="box-label">In Progress</div><div class="box-val" style="color:#1e40af">${log.filter(l=>l.status==='In Progress').length}</div></div>
        <div class="box" style="background:#f0fdf4"><div class="box-label">Est. Annual Savings</div><div class="box-val" style="color:#065f46">$${totalSavings.toLocaleString()}</div></div>
      </div>
      <table>
        <thead><tr><th>ID</th><th>Area</th><th>Description</th><th>By</th><th>Est $/yr</th><th>Cost</th><th>Status</th></tr></thead>
        <tbody>${log.map(l=>`<tr><td style="font-family:monospace;font-size:10px">${l.id}</td><td style="font-size:10px">${l.area||'—'}</td><td style="font-size:10px;max-width:200px">${l.description||'—'}</td><td style="font-size:10px">${l.submittedBy||'—'}</td><td style="color:#065f46;font-weight:600">$${(l.estSavings||0).toLocaleString()}</td><td style="color:#6b7280">$${(l.implCost||0).toLocaleString()}</td><td><span class="badge badge-${l.status==='Complete'?'ok':l.status==='In Progress'?'blue':'gray'}">${l.status||'—'}</span></td></tr>`).join('')}</tbody>
      </table>
      <div class="section-title">Submit a New Improvement Idea</div>
      <div class="grid-2">
        <div><div class="write-label">Submitted By</div><div class="write-line"/>
        <div class="write-label">Station / Area</div><div class="write-line"/>
        <div class="write-label">Est. Annual Savings</div><div class="write-line"/></div>
        <div><div class="write-label">Date</div><div class="write-line"/>
        <div class="write-label">Priority (1–5)</div><div class="write-line"/>
        <div class="write-label">Est. Implementation Cost</div><div class="write-line"/></div>
      </div>
      <div class="write-label">Description of Improvement</div><div class="write-line"/><div class="write-line"/>
      <div class="write-label">Expected Benefit / Outcome</div><div class="write-line"/>
      <div class="sig-line"><span>Submitted: __________________</span><span>Reviewed by: Daniel Jones</span><span>Date: __________</span></div>
    </div>`);
};

const printTrainingMatrix = (data) => {
  const matrix = data.trainingMatrix||[];
  const employees = [...new Set(matrix.map(m=>m.empName))];
  const skills = [...new Set(matrix.map(m=>m.skill))];
  const lookup = {};
  matrix.forEach(m=>{ lookup[`${m.empName}|${m.skill}`] = m.raw; });
  printHTML('Training Matrix', `
    <div class="page">
      <div class="hdr">
        <div><div class="logo">MAISY<span>ERP</span> · Maisy Railing</div><div class="doc-meta">Cross-Training Skills Matrix</div></div>
        <div style="text-align:right"><div class="doc-title">TRAINING MATRIX</div><div class="doc-meta">Printed ${new Date().toLocaleDateString()}</div></div>
      </div>
      <div style="font-size:10px;color:#6b7280;margin-bottom:10px">Legend: <b style="color:#065f46">✓</b> = Certified &nbsp;|&nbsp; <b style="color:#1e40af">IP</b> = In Progress &nbsp;|&nbsp; <b style="color:#9ca3af">—</b> = Not Trained</div>
      <table>
        <thead><tr><th>Skill / Certification</th>${employees.map(e=>`<th style="text-align:center">${e}</th>`).join('')}</tr></thead>
        <tbody>${skills.map(skill=>`<tr><td style="font-size:10px">${skill}</td>${employees.map(e=>{const v=lookup[`${e}|${skill}`]||'—';return`<td style="text-align:center;font-size:11px;font-weight:700;color:${v==='✓'?'#065f46':v==='IP'?'#1e40af':'#d1d5db'}">${v}</td>`;}).join('')}</tr>`).join('')}</tbody>
      </table>
      <div class="sig-line"><span>HR Review: __________________</span><span>Date: __________________</span><span>Next Review: __________________</span></div>
    </div>`);
};


const Badge = ({s}) => { const c=BADGE[s]||'#4a5070'; return <span className="badge" style={{background:`${c}1a`,color:c,border:`1px solid ${c}33`}}>{s}</span>; };
const Spinner = () => <div className="spin" style={{width:12,height:12,border:'2px solid var(--bdr)',borderTopColor:'var(--acc)',borderRadius:'50%'}}/>;
const Empty = ({msg='No records'}) => <div style={{textAlign:'center',padding:'40px 0',color:'var(--muted)',fontSize:12.5}}><div style={{fontSize:24,marginBottom:8,opacity:.3}}>◫</div>{msg}</div>;

const Modal = ({title,onClose,children,lg,xl}) => (
  <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div className={`modal${xl?' modal-xl':lg?' modal-lg':''}`}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
        <span className="hd" style={{fontSize:18}}>{title}</span>
        <button onClick={onClose} style={{background:'none',border:'none',color:'var(--muted)',cursor:'pointer',fontSize:22,lineHeight:1}}>×</button>
      </div>
      {children}
    </div>
  </div>
);

const Field = ({label,children}) => (
  <div style={{marginBottom:12}}><label>{label}</label>{children}</div>
);

const SectionHeader = ({label}) => (
  <div style={{fontFamily:'Barlow Condensed',fontSize:10,fontWeight:700,letterSpacing:'.18em',textTransform:'uppercase',color:'var(--dim)',margin:'16px 0 6px'}}>{label}</div>
);

// ─── INITIAL DATA ────────────────────────────────────────────────────────────────
const INIT = {
  // ── Maisy_04_ARSENAL_SUPPLY — Raw Materials (45 items, deduped source) ─────
  rawMaterials: [
    {
        "id": "RM-001",
        "name": "6061-T6 Tube 1\"x3\"x1/8\"",
        "cat": "Aluminum Tube/Pipe",
        "alloy": "6061-T6",
        "size": "1\"x3\"x1/8\"",
        "finish": "Mill",
        "unit": "FT",
        "qty": 940.0,
        "minOnHand": 500.0,
        "reorder": 750.0,
        "reorderQty": 2000.0,
        "status": "OK",
        "cost": 3.47,
        "value": 3261.8,
        "vendor": "EMJ",
        "partNo": "",
        "loc": "Rack A1",
        "notes": "High-volume item"
    },
    {
        "id": "RM-002",
        "name": "6061-T6 Bar 1/8\"x2\"",
        "cat": "Aluminum Flat Bar",
        "alloy": "6061-T6",
        "size": "1/8\"x2\"",
        "finish": "Mill",
        "unit": "FT",
        "qty": 31.0,
        "minOnHand": 100.0,
        "reorder": 200.0,
        "reorderQty": 500.0,
        "status": "CRITICAL",
        "cost": 4.25,
        "value": 131.75,
        "vendor": "",
        "partNo": "",
        "loc": "Rack A2",
        "notes": ""
    },
    {
        "id": "RM-003",
        "name": "6061-T6 Tube 2\"x1/8\"",
        "cat": "Aluminum Tube/Pipe",
        "alloy": "6061-T6",
        "size": "2\"x1/8\"",
        "finish": "Mill",
        "unit": "FT",
        "qty": 80.0,
        "minOnHand": 500.0,
        "reorder": 1000.0,
        "reorderQty": 2000.0,
        "status": "CRITICAL",
        "cost": 4.25,
        "value": 340.0,
        "vendor": "",
        "partNo": "",
        "loc": "Rack A3",
        "notes": ""
    },
    {
        "id": "RM-004",
        "name": "6061-T6 Bar 1/4\"x 4\"",
        "cat": "Aluminum Flat Bar",
        "alloy": "6061-T6",
        "size": " 1/4\"x 4\"",
        "finish": "Mill",
        "unit": "FT",
        "qty": 60.0,
        "minOnHand": 100.0,
        "reorder": 300.0,
        "reorderQty": 400.0,
        "status": "CRITICAL",
        "cost": 4.25,
        "value": 255.0,
        "vendor": "",
        "partNo": "",
        "loc": "Rack A4",
        "notes": ""
    },
    {
        "id": "RM-005",
        "name": "6061-T6 Angle 2\"x 4\"x1/8\"",
        "cat": "Aluminum Angle",
        "alloy": "6061-T6",
        "size": "2\"x 4\"x1/8\"",
        "finish": "Mill",
        "unit": "FT",
        "qty": 41.0,
        "minOnHand": 100.0,
        "reorder": 150.0,
        "reorderQty": 250.0,
        "status": "CRITICAL",
        "cost": 4.25,
        "value": 174.25,
        "vendor": "",
        "partNo": "",
        "loc": "Rack A5",
        "notes": ""
    },
    {
        "id": "RM-006",
        "name": "6061-T6 Tube 1\"x2\"x1/8\"",
        "cat": "Aluminum Tube/Pipe",
        "alloy": "6061-T6",
        "size": "1\"x2\"x1/8\"",
        "finish": "Mill",
        "unit": "FT",
        "qty": 147.0,
        "minOnHand": 250.0,
        "reorder": 300.0,
        "reorderQty": 500.0,
        "status": "CRITICAL",
        "cost": 4.25,
        "value": 624.75,
        "vendor": "",
        "partNo": "",
        "loc": "Rack A6",
        "notes": ""
    },
    {
        "id": "RM-007",
        "name": "6061-T6 Angle 2\"x 2\"x1/8\"",
        "cat": "Aluminum Angle",
        "alloy": "6061-T6",
        "size": "2\"x 2\"x1/8\"",
        "finish": "Mill",
        "unit": "FT",
        "qty": 5.0,
        "minOnHand": 100.0,
        "reorder": 150.0,
        "reorderQty": 250.0,
        "status": "CRITICAL",
        "cost": 4.25,
        "value": 21.25,
        "vendor": "",
        "partNo": "",
        "loc": "Rack A7",
        "notes": ""
    },
    {
        "id": "RM-008",
        "name": "6061-T6 Bar 1/4\"x 3\"",
        "cat": "Aluminum Flat Bar",
        "alloy": "6061-T6",
        "size": "1/4\"x 3\"",
        "finish": "Mill",
        "unit": "FT",
        "qty": 36.0,
        "minOnHand": 15.0,
        "reorder": 25.0,
        "reorderQty": 50.0,
        "status": "OK",
        "cost": 4.25,
        "value": 153.0,
        "vendor": "",
        "partNo": "",
        "loc": "Rack A8",
        "notes": ""
    },
    {
        "id": "RM-009",
        "name": "6061-T6 Angle 1.5\"x 1.5\"x 1/8\"",
        "cat": "Aluminum Angle",
        "alloy": "6061-T6",
        "size": " 1.5\"x 1.5\"x 1/8\"",
        "finish": "Mill",
        "unit": "FT",
        "qty": 24.0,
        "minOnHand": 5.0,
        "reorder": 10.0,
        "reorderQty": 15.0,
        "status": "OK",
        "cost": 4.25,
        "value": 102.0,
        "vendor": "",
        "partNo": "",
        "loc": "Rack A9",
        "notes": ""
    },
    {
        "id": "RM-010",
        "name": "6061-T6 Bar 1/8\"x 4\"",
        "cat": "Aluminum Flat Bar",
        "alloy": "6061-T6",
        "size": "1/8\"x 4\"",
        "finish": "Mill",
        "unit": "FT",
        "qty": 58.0,
        "minOnHand": 300.0,
        "reorder": 600.0,
        "reorderQty": 800.0,
        "status": "CRITICAL",
        "cost": 4.25,
        "value": 246.5,
        "vendor": "",
        "partNo": "",
        "loc": "Rack A10",
        "notes": ""
    },
    {
        "id": "RM-011",
        "name": "6061-T6 Tube 1/8\"x3/4\"",
        "cat": "Aluminum Tube/Pipe",
        "alloy": "6061-T6",
        "size": "1/8\"x3/4\"",
        "finish": "Mill",
        "unit": "FT",
        "qty": 300.0,
        "minOnHand": 20.0,
        "reorder": 25.0,
        "reorderQty": 20.0,
        "status": "OK",
        "cost": 4.25,
        "value": 1275.0,
        "vendor": "",
        "partNo": "",
        "loc": "Rack A11",
        "notes": ""
    },
    {
        "id": "RM-012",
        "name": "6061-T6 Pipe 1 7/8\"x .125\"",
        "cat": "Aluminum Tube/Pipe",
        "alloy": "6061-T6",
        "size": "1 7/8\"x .125\"",
        "finish": "Mill",
        "unit": "FT",
        "qty": 15.0,
        "minOnHand": 10.0,
        "reorder": 15.0,
        "reorderQty": 40.0,
        "status": "LOW",
        "cost": 4.25,
        "value": 63.75,
        "vendor": "",
        "partNo": "",
        "loc": "Rack A12",
        "notes": ""
    },
    {
        "id": "RM-013",
        "name": "6061-T6 Angle 2.5\"x2.5\"x1/4\"",
        "cat": "Aluminum Angle",
        "alloy": "6061-T6",
        "size": "2.5\"x2.5\"x1/4\"",
        "finish": "Mill",
        "unit": "FT",
        "qty": 16.0,
        "minOnHand": 10.0,
        "reorder": 15.0,
        "reorderQty": 40.0,
        "status": "OK",
        "cost": 4.25,
        "value": 68.0,
        "vendor": "",
        "partNo": "",
        "loc": "Rack A13",
        "notes": ""
    },
    {
        "id": "RM-014",
        "name": "6061-T6 Angle \"ROUNDED\" 2\"x4\"x1/4\"",
        "cat": "Aluminum Angle",
        "alloy": "6061-T6",
        "size": " 2\"x4\"x1/4\"",
        "finish": "Mill",
        "unit": "FT",
        "qty": 20.0,
        "minOnHand": 2.0,
        "reorder": 5.0,
        "reorderQty": 20.0,
        "status": "OK",
        "cost": 4.25,
        "value": 85.0,
        "vendor": "",
        "partNo": "",
        "loc": "Rack A14",
        "notes": ""
    },
    {
        "id": "RM-015",
        "name": "6061-T6 Angle 2\"x4\"x1/4\"",
        "cat": "Aluminum Angle",
        "alloy": "6061-T6",
        "size": " 2\"x4\"x1/4\"",
        "finish": "Mill",
        "unit": "FT",
        "qty": 7.0,
        "minOnHand": 20.0,
        "reorder": 30.0,
        "reorderQty": 40.0,
        "status": "CRITICAL",
        "cost": 4.25,
        "value": 29.75,
        "vendor": "",
        "partNo": "",
        "loc": "Rack A15",
        "notes": ""
    },
    {
        "id": "RM-016",
        "name": "6061-T6 Angle 4\"x4\"x1/2\"",
        "cat": "Aluminum Angle",
        "alloy": "6061-T6",
        "size": "4\"x4\"x1/2\"",
        "finish": "Mill",
        "unit": "FT",
        "qty": 18.0,
        "minOnHand": 5.0,
        "reorder": 10.0,
        "reorderQty": 40.0,
        "status": "OK",
        "cost": 4.25,
        "value": 76.5,
        "vendor": "",
        "partNo": "",
        "loc": "Rack A16",
        "notes": ""
    },
    {
        "id": "RM-017",
        "name": "Powder - T009-BG01",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Gloss-Smooth",
        "size": "25LB",
        "finish": "Almond 90",
        "unit": "LB",
        "qty": 32.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "T009-BG01",
        "loc": "Shelf A1",
        "notes": ""
    },
    {
        "id": "RM-018",
        "name": "Powder - T002-WH08",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Semi-Gloss Smooth",
        "size": "25LB",
        "finish": "White",
        "unit": "LB",
        "qty": 41.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "T002-WH08",
        "loc": "Shelf A2",
        "notes": ""
    },
    {
        "id": "RM-019",
        "name": "Powder - T075-BK211",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Semi-Gloss Vein  ",
        "size": "25LB",
        "finish": "Copper",
        "unit": "LB",
        "qty": 16.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "T075-BK211",
        "loc": "Shelf A3",
        "notes": ""
    },
    {
        "id": "RM-020",
        "name": "Powder - T002-BK08",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Semi-Gloss Smooth ",
        "size": "25LB",
        "finish": "Black",
        "unit": "LB",
        "qty": 19.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "T002-BK08",
        "loc": "Shelf A4",
        "notes": ""
    },
    {
        "id": "RM-021",
        "name": "Powder - C013-GR08",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Semi-Gloss Hammer",
        "size": "25LB",
        "finish": "Gray",
        "unit": "LB",
        "qty": 8.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "C013-GR08",
        "loc": "Shelf A5",
        "notes": ""
    },
    {
        "id": "RM-022",
        "name": "Powder - T005-BK78",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Semi-Gloss Smooth",
        "size": "25LB",
        "finish": "Black",
        "unit": "LB",
        "qty": 15.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "T005-BK78",
        "loc": "Shelf A6",
        "notes": ""
    },
    {
        "id": "RM-023",
        "name": "Powder - C241-GR305",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Semi-Gloss Texture",
        "size": "5LB",
        "finish": "Bay Gray",
        "unit": "LB",
        "qty": 5.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "C241-GR305",
        "loc": "Shelf A7",
        "notes": ""
    },
    {
        "id": "RM-024",
        "name": "Powder - C206-BK266",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Semi-Gloss Smooth",
        "size": "50LB",
        "finish": "Black",
        "unit": "LB",
        "qty": 43.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "C206-BK266",
        "loc": "Shelf A8",
        "notes": ""
    },
    {
        "id": "RM-025",
        "name": "Powder - C241-GR07",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Semi-Gloss Texture",
        "size": "25LB",
        "finish": "Gray",
        "unit": "LB",
        "qty": 13.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "C241-GR07",
        "loc": "Shelf A9",
        "notes": ""
    },
    {
        "id": "RM-026",
        "name": "Powder - T025-BR01",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Semi-Gloss  ",
        "size": "25LB",
        "finish": "Bronze 50",
        "unit": "LB",
        "qty": 31.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "T025-BR01",
        "loc": "Shelf A10",
        "notes": ""
    },
    {
        "id": "RM-027",
        "name": "Powder - T243-GR301",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Semi-Gloss Texture",
        "size": "5LB",
        "finish": "Quartz Gray",
        "unit": "LB",
        "qty": 12.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "T243-GR301",
        "loc": "Shelf A11",
        "notes": ""
    },
    {
        "id": "RM-028",
        "name": "Powder - T064-BR24",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Semi-Gloss Hammertone",
        "size": "25LB",
        "finish": "Bronze  ",
        "unit": "LB",
        "qty": 9.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "T064-BR24",
        "loc": "Shelf A12",
        "notes": ""
    },
    {
        "id": "RM-029",
        "name": "Powder - T013-GR185",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Semi-Gloss Hammer",
        "size": "25LB",
        "finish": "RAL 7035-Light Grey",
        "unit": "LB",
        "qty": 9.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "T013-GR185",
        "loc": "Shelf A13",
        "notes": ""
    },
    {
        "id": "RM-030",
        "name": "Powder - T291-BR251",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Semi-Gloss Texture",
        "size": "25LB",
        "finish": "Oil Rubbed Bronze",
        "unit": "LB",
        "qty": 8.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "T291-BR251",
        "loc": "Shelf A14",
        "notes": ""
    },
    {
        "id": "RM-031",
        "name": "Powder - T091-BR47",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Semi-Gloss Texture",
        "size": "50LB",
        "finish": "Rust",
        "unit": "LB",
        "qty": 30.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "T091-BR47",
        "loc": "Shelf A15",
        "notes": ""
    },
    {
        "id": "RM-032",
        "name": "Powder - T375-BK26",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Semi-Gloss Vein  ",
        "size": "50LB",
        "finish": "Silver",
        "unit": "LB",
        "qty": 36.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "T375-BK26",
        "loc": "Shelf A16",
        "notes": ""
    },
    {
        "id": "RM-033",
        "name": "Powder - T012-BR161",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Semi-Gloss Hammer",
        "size": "5LB",
        "finish": "Bronze  ",
        "unit": "LB",
        "qty": 5.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "T012-BR161",
        "loc": "Shelf A17",
        "notes": ""
    },
    {
        "id": "RM-035",
        "name": "Powder - P000-BK247",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Flat - Smooth",
        "size": "25LB",
        "finish": "Black",
        "unit": "LB",
        "qty": 16.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "P000-BK247",
        "loc": "Shelf A18",
        "notes": ""
    },
    {
        "id": "RM-036",
        "name": "Powder - T375-BK07",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Semi-Gloss Vein  ",
        "size": "50LB",
        "finish": "Copper",
        "unit": "LB",
        "qty": 74.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "T375-BK07",
        "loc": "Shelf A19",
        "notes": ""
    },
    {
        "id": "RM-037",
        "name": "Powder - C031-WH120",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Semi-Gloss Texture",
        "size": "50LB",
        "finish": "White",
        "unit": "LB",
        "qty": 37.0,
        "minOnHand": 50.0,
        "reorder": 75.0,
        "reorderQty": 100.0,
        "status": "CRITICAL",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "C031-WH120",
        "loc": "Shelf A20",
        "notes": ""
    },
    {
        "id": "RM-038",
        "name": "Powder -  T238-GR2070",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Gloss-Smooth",
        "size": "25LB",
        "finish": "RAL 7035-Light Grey",
        "unit": "LB",
        "qty": 21.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "T238-GR2070",
        "loc": "Shelf A21",
        "notes": ""
    },
    {
        "id": "RM-039",
        "name": "Powder -  T209 - C101",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Gloss-Smooth",
        "size": "50LB",
        "finish": "Clear",
        "unit": "LB",
        "qty": 41.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "T209 - C101",
        "loc": "Shelf A22",
        "notes": ""
    },
    {
        "id": "RM-040",
        "name": "Powder - C209-BR358",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Gloss-Smooth",
        "size": "25LB",
        "finish": "RAL 8028-Terra Brown 90",
        "unit": "LB",
        "qty": 20.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "C209-BR358",
        "loc": "Shelf A23",
        "notes": ""
    },
    {
        "id": "RM-041",
        "name": "Powder - E305-GR533",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Semi-Gloss Smooth",
        "size": "25LB",
        "finish": "Gray Primer",
        "unit": "LB",
        "qty": 5.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "E305-GR533",
        "loc": "Shelf A24",
        "notes": ""
    },
    {
        "id": "RM-042",
        "name": "Powder - P000-BG631",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Flat - Smooth",
        "size": "5LB",
        "finish": "FS 33446-Desert Sand",
        "unit": "LB",
        "qty": 8.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "P000-BG631",
        "loc": "Shelf A25",
        "notes": ""
    },
    {
        "id": "RM-043",
        "name": "Powder - C241-BK303",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Semi-Gloss Texture",
        "size": "50LB",
        "finish": "Black",
        "unit": "LB",
        "qty": 40.0,
        "minOnHand": 100.0,
        "reorder": 150.0,
        "reorderQty": 200.0,
        "status": "CRITICAL",
        "cost": 5.2,
        "value": 208.0,
        "vendor": "Cardinal",
        "partNo": "C241-BK303",
        "loc": "Shelf A26",
        "notes": ""
    },
    {
        "id": "RM-044",
        "name": "Powder - T032-BL04",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Semi-Gloss Texture",
        "size": "5",
        "finish": "FS 25109 - Blue",
        "unit": "LB",
        "qty": 0.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "CRITICAL",
        "cost": 12.8,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "T032-BL04",
        "loc": "Shelf A27",
        "notes": ""
    },
    {
        "id": "RM-045",
        "name": "Touch-Up Paint",
        "cat": "Spray Paint",
        "alloy": "Textured Black",
        "size": "Can",
        "finish": "Black",
        "unit": "EA",
        "qty": 2.0,
        "minOnHand": 1.0,
        "reorder": 2.0,
        "reorderQty": 4.0,
        "status": "LOW",
        "cost": 10.98,
        "value": 21.96,
        "vendor": "Home Depot",
        "partNo": "",
        "loc": "Shelf A28",
        "notes": ""
    },
    {
        "id": "RM-046",
        "name": "Touch-Up Paint",
        "cat": "",
        "alloy": "",
        "size": "",
        "finish": "",
        "unit": "",
        "qty": 0.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "",
        "partNo": "",
        "loc": "",
        "notes": ""
    }
],

  // ── Maisy_04_ARSENAL_SUPPLY — Assembly Items (21 items) ───────────────────
  assemblyItems: [
    {
        "id": "AI-001",
        "name": "1/8\" Cable SS",
        "cat": "Cable",
        "spec": "1/8\"",
        "material": "316 SS",
        "finish": "Natural",
        "unit": "FT",
        "qty": 1900.0,
        "minOnHand": 1000.0,
        "reorder": 2000.0,
        "reorderQty": 3000.0,
        "status": "LOW",
        "cost": 0.12,
        "value": 228.0,
        "vendor": "VEVOR",
        "partNo": "",
        "loc": "Bin A1"
    },
    {
        "id": "AI-002",
        "name": "#11 Self-Tap Screw, Sq Drive Pan Head",
        "cat": "Self-Tap Screw",
        "spec": "#11x3/4\"",
        "material": "316 SS",
        "finish": "Black",
        "unit": "EA",
        "qty": 12300.0,
        "minOnHand": 500.0,
        "reorder": 1000.0,
        "reorderQty": 2000.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "TBD \u2013 Evaluating",
        "partNo": "",
        "loc": "Bin E1"
    },
    {
        "id": "AI-004",
        "name": "Post Screw - 3/16 x 2 7/8\" Lock Head, T-25 Drive, Black",
        "cat": "Post Screws",
        "spec": "3/16 x 2 7/8",
        "material": "Carbon Steel",
        "finish": "Black",
        "unit": "EA",
        "qty": 25.0,
        "minOnHand": 500.0,
        "reorder": 750.0,
        "reorderQty": 1000.0,
        "status": "CRITICAL",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "TBD \u2013 Evaluating",
        "partNo": "",
        "loc": "Bin F1"
    },
    {
        "id": "AI-005",
        "name": "Lag Bolt - Hex Head, SS",
        "cat": "Lags",
        "spec": "3/8\" x 5\"",
        "material": "316 SS",
        "finish": "Natural",
        "unit": "EA",
        "qty": 2800.0,
        "minOnHand": 100.0,
        "reorder": 200.0,
        "reorderQty": 1000.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "TBD \u2013 Evaluating",
        "partNo": "",
        "loc": "Bin F1"
    },
    {
        "id": "AI-008",
        "name": "Lag Bolt Washer - 7/16\", O.D 49/64\" SS",
        "cat": "Washers",
        "spec": "7/16\"",
        "material": "316 SS",
        "finish": "Natural",
        "unit": "EA",
        "qty": 219.0,
        "minOnHand": 150.0,
        "reorder": 300.0,
        "reorderQty": 500.0,
        "status": "LOW",
        "cost": 0.28,
        "value": 61.32,
        "vendor": "TBD \u2013 Evaluating",
        "partNo": "",
        "loc": "Bin F2"
    },
    {
        "id": "AI-009",
        "name": "Swage Washer - 1/4\", O.D 15/32\" SS \"Small\"",
        "cat": "Washers",
        "spec": "1/4\" x 49/64\" OD",
        "material": "316 SS",
        "finish": "Natural",
        "unit": "EA",
        "qty": 1532.0,
        "minOnHand": 200.0,
        "reorder": 400.0,
        "reorderQty": 600.0,
        "status": "OK",
        "cost": 0.18,
        "value": 275.76,
        "vendor": "TBD \u2013 Evaluating",
        "partNo": "",
        "loc": "Bin F2"
    },
    {
        "id": "AI-010",
        "name": "Swage Washer - 1/4\", O.D 5/8\" SS \"Large\"",
        "cat": "Washers",
        "spec": "1/4\" x 5/8\" OD",
        "material": "316 SS",
        "finish": "Natural",
        "unit": "EA",
        "qty": 1532.0,
        "minOnHand": 75.0,
        "reorder": 150.0,
        "reorderQty": 250.0,
        "status": "OK",
        "cost": 1.95,
        "value": 2987.4,
        "vendor": "TBD \u2013 Evaluating",
        "partNo": "",
        "loc": "Bin E2"
    },
    {
        "id": "AI-011",
        "name": "Swage Nut - 1/4\" NC -  Hex, SS",
        "cat": "Nuts",
        "spec": "1/8\" LH",
        "material": "316 SS",
        "finish": "Natural",
        "unit": "EA",
        "qty": 1532.0,
        "minOnHand": 75.0,
        "reorder": 150.0,
        "reorderQty": 250.0,
        "status": "OK",
        "cost": 1.95,
        "value": 2987.4,
        "vendor": "TBD \u2013 Evaluating",
        "partNo": "",
        "loc": "Bin E2"
    },
    {
        "id": "AI-012",
        "name": "Tensioner Body \u2013 1/4\" NC Thread -  1/8\" Cable",
        "cat": "Tensioners",
        "spec": "1/8\"x1/4\"x3 7/8\"",
        "material": "316 SS",
        "finish": "Natural",
        "unit": "EA",
        "qty": 1532.0,
        "minOnHand": 50.0,
        "reorder": 100.0,
        "reorderQty": 150.0,
        "status": "OK",
        "cost": 3.4,
        "value": 5208.8,
        "vendor": "TBD \u2013 Evaluating",
        "partNo": "",
        "loc": "Bin E2"
    },
    {
        "id": "AI-013",
        "name": "Swage Acorn Nut - 1/4\" SS",
        "cat": "Nuts",
        "spec": "1/4\"",
        "material": "316 SS",
        "finish": "Natural",
        "unit": "EA",
        "qty": 1532.0,
        "minOnHand": 100.0,
        "reorder": 200.0,
        "reorderQty": 300.0,
        "status": "OK",
        "cost": 0.35,
        "value": 536.2,
        "vendor": "TBD \u2013 Evaluating",
        "partNo": "",
        "loc": "Bin E2"
    },
    {
        "id": "AI-014",
        "name": "Swage Angle Washer - 1/4\" ID  x  57\u00b0",
        "cat": "Angle Washers",
        "spec": "57\u00b0",
        "material": "316 SS",
        "finish": "Natural",
        "unit": "EA",
        "qty": 112.0,
        "minOnHand": 8.0,
        "reorder": 15.0,
        "reorderQty": 25.0,
        "status": "OK",
        "cost": 28.5,
        "value": 3192.0,
        "vendor": "TBD \u2013 Evaluating",
        "partNo": "",
        "loc": "Shelf G1"
    },
    {
        "id": "AI-015",
        "name": "Swage Assembly - 1/8\"",
        "cat": "Swages",
        "spec": "1/8\"",
        "material": "316 SS",
        "finish": "Natural",
        "unit": "EA",
        "qty": 1532.0,
        "minOnHand": 2000.0,
        "reorder": 3000.0,
        "reorderQty": 5000.0,
        "status": "CRITICAL",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "TBD \u2013 Evaluating",
        "partNo": "",
        "loc": ""
    },
    {
        "id": "AI-016",
        "name": "Swage Assembly - 1/8\"",
        "cat": "Swages",
        "spec": "1/8\"",
        "material": "316 SS",
        "finish": "Black",
        "unit": "EA",
        "qty": 16.0,
        "minOnHand": 1000.0,
        "reorder": 1500.0,
        "reorderQty": 2000.0,
        "status": "CRITICAL",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "TBD \u2013 Evaluating",
        "partNo": "",
        "loc": ""
    },
    {
        "id": "AI-017",
        "name": "Swage Angle Washer - 1/4\" ID  x  57\u00b0",
        "cat": "Angle Washers",
        "spec": "57\u00b0",
        "material": "316 SS",
        "finish": "Black",
        "unit": "EA",
        "qty": 5.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "TBD \u2013 Evaluating",
        "partNo": "",
        "loc": ""
    },
    {
        "id": "AI-018",
        "name": "Gate Hinge Kit \u2013 3 1/2\" Self-Closing, Black",
        "cat": "Hinge Kits",
        "spec": "Standard",
        "material": "Steel",
        "finish": "Black",
        "unit": "KIT",
        "qty": 1.0,
        "minOnHand": 8.0,
        "reorder": 15.0,
        "reorderQty": 25.0,
        "status": "CRITICAL",
        "cost": 28.5,
        "value": 28.5,
        "vendor": "TBD \u2013 Evaluating",
        "partNo": "",
        "loc": "Shelf G1"
    },
    {
        "id": "AI-019",
        "name": "Handrail End Cap \u2013 3\" x 1\", Black",
        "cat": "End Caps",
        "spec": "3\" x 1\" OD",
        "material": "Plastic",
        "finish": "Black",
        "unit": "EA",
        "qty": 2900.0,
        "minOnHand": 50.0,
        "reorder": 100.0,
        "reorderQty": 150.0,
        "status": "OK",
        "cost": 0.95,
        "value": 2755.0,
        "vendor": "TBD \u2013 Evaluating",
        "partNo": "",
        "loc": "Bin H2"
    },
    {
        "id": "AI-020",
        "name": "6 Mil Heavy Duty Poly Tubing Roll - 5\" x 1,000'",
        "cat": "Poly Tubing",
        "spec": "6Mil - 5\"x1,000'",
        "material": "LDPE",
        "finish": "Natural",
        "unit": "EA",
        "qty": 1.0,
        "minOnHand": 1.0,
        "reorder": 2.0,
        "reorderQty": 6.0,
        "status": "CRITICAL",
        "cost": 93.0,
        "value": 93.0,
        "vendor": "ULINE",
        "partNo": "S-2941",
        "loc": "SHELF A1"
    },
    {
        "id": "AI-021",
        "name": "6 Mil Heavy Duty Poly Tubing Roll - 6\" x 1,000'",
        "cat": "Poly Tubing",
        "spec": "6Mil - 6\"x1,000'",
        "material": "LDPE",
        "finish": "Natural",
        "unit": "EA",
        "qty": 1.0,
        "minOnHand": 1.0,
        "reorder": 2.0,
        "reorderQty": 6.0,
        "status": "CRITICAL",
        "cost": 111.0,
        "value": 111.0,
        "vendor": "ULINE",
        "partNo": "S-1659",
        "loc": "SHELF A1"
    },
    {
        "id": "AI-022",
        "name": "6 Mil Heavy Duty Poly Tubing Roll - 10\" x 1,000'",
        "cat": "Poly Tubing",
        "spec": "6Mil - 10\"x1,000'",
        "material": "LDPE",
        "finish": "Natural",
        "unit": "EA",
        "qty": 1.0,
        "minOnHand": 1.0,
        "reorder": 2.0,
        "reorderQty": 6.0,
        "status": "CRITICAL",
        "cost": 176.0,
        "value": 176.0,
        "vendor": "ULINE",
        "partNo": "S-2239",
        "loc": "SHELF A1"
    },
    {
        "id": "AI-023",
        "name": "1 Mil Air Cushion Film for Uline Air Cushion Machine - 1\u00a01\u20444\u00a0x 9 x 13\"",
        "cat": "Air Cushion Film",
        "spec": "1 Mil - 16\"x1,150",
        "material": "MDPE",
        "finish": "Natural",
        "unit": "EA",
        "qty": 1.0,
        "minOnHand": 1.0,
        "reorder": 2.0,
        "reorderQty": 4.0,
        "status": "CRITICAL",
        "cost": 144.0,
        "value": 144.0,
        "vendor": "ULINE",
        "partNo": "S-22468",
        "loc": "SHELF A1"
    },
    {
        "id": "AI-024",
        "name": "Cardboard Box (Mini Display)",
        "cat": "Shipping",
        "spec": "21x6x16",
        "material": "paper",
        "finish": "Natural",
        "unit": "EA",
        "qty": 0.0,
        "minOnHand": 2.0,
        "reorder": 1.0,
        "reorderQty": 5.0,
        "status": "CRITICAL",
        "cost": 5.09,
        "value": 0.0,
        "vendor": "ULINE",
        "partNo": "S-16333",
        "loc": "SHELF A2"
    }
],

  // ── Maisy_04_ARSENAL_SUPPLY — Glass Inventory (30 panels) ─────────────────
  glassInventory: [
    {
        "height": 42,
        "width": 21.0,
        "qty": 3.0,
        "unit": "panel",
        "status": "OK",
        "loc": "Glass Bay"
    },
    {
        "height": 42,
        "width": 27.0,
        "qty": 1.0,
        "unit": "panel",
        "status": "LOW",
        "loc": "Glass Bay"
    },
    {
        "height": 42,
        "width": 39.0,
        "qty": 3.0,
        "unit": "panel",
        "status": "OK",
        "loc": "Glass Bay"
    },
    {
        "height": 42,
        "width": 45.0,
        "qty": 1.0,
        "unit": "panel",
        "status": "LOW",
        "loc": "Glass Bay"
    },
    {
        "height": 42,
        "width": 48.0,
        "qty": 14.0,
        "unit": "panel",
        "status": "OK",
        "loc": "Glass Bay"
    },
    {
        "height": 42,
        "width": 51.0,
        "qty": 1.0,
        "unit": "panel",
        "status": "LOW",
        "loc": "Glass Bay"
    },
    {
        "height": 42,
        "width": 53.0,
        "qty": 10.0,
        "unit": "panel",
        "status": "OK",
        "loc": "Glass Bay"
    },
    {
        "height": 42,
        "width": 54.0,
        "qty": 2.0,
        "unit": "panel",
        "status": "LOW",
        "loc": "Glass Bay"
    },
    {
        "height": 42,
        "width": 57.0,
        "qty": 1.0,
        "unit": "panel",
        "status": "LOW",
        "loc": "Glass Bay"
    },
    {
        "height": 42,
        "width": 60.0,
        "qty": 2.0,
        "unit": "panel",
        "status": "LOW",
        "loc": "Glass Bay"
    },
    {
        "height": 42,
        "width": 60.75,
        "qty": 2.0,
        "unit": "panel",
        "status": "LOW",
        "loc": "Glass Bay"
    },
    {
        "height": 42,
        "width": 61.0,
        "qty": 1.0,
        "unit": "panel",
        "status": "LOW",
        "loc": "Glass Bay"
    },
    {
        "height": 42,
        "width": 66.0,
        "qty": 2.0,
        "unit": "panel",
        "status": "LOW",
        "loc": "Glass Bay"
    },
    {
        "height": 36,
        "width": 4.0,
        "qty": 1.0,
        "unit": "panel",
        "status": "LOW",
        "loc": "Glass Bay"
    },
    {
        "height": 36,
        "width": 9.0,
        "qty": 1.0,
        "unit": "panel",
        "status": "LOW",
        "loc": "Glass Bay"
    },
    {
        "height": 36,
        "width": 38.0,
        "qty": 1.0,
        "unit": "panel",
        "status": "LOW",
        "loc": "Glass Bay"
    },
    {
        "height": 36,
        "width": 39.0,
        "qty": 3.0,
        "unit": "panel",
        "status": "OK",
        "loc": "Glass Bay"
    },
    {
        "height": 36,
        "width": 41.0,
        "qty": 1.0,
        "unit": "panel",
        "status": "LOW",
        "loc": "Glass Bay"
    },
    {
        "height": 36,
        "width": 44.0,
        "qty": 1.0,
        "unit": "panel",
        "status": "LOW",
        "loc": "Glass Bay"
    },
    {
        "height": 36,
        "width": 46.0,
        "qty": 3.0,
        "unit": "panel",
        "status": "OK",
        "loc": "Glass Bay"
    },
    {
        "height": 36,
        "width": 47.0,
        "qty": 2.0,
        "unit": "panel",
        "status": "LOW",
        "loc": "Glass Bay"
    },
    {
        "height": 36,
        "width": 47.625,
        "qty": 5.0,
        "unit": "panel",
        "status": "OK",
        "loc": "Glass Bay"
    },
    {
        "height": 36,
        "width": 48.0,
        "qty": 1.0,
        "unit": "panel",
        "status": "LOW",
        "loc": "Glass Bay"
    },
    {
        "height": 36,
        "width": 52.5,
        "qty": 1.0,
        "unit": "panel",
        "status": "LOW",
        "loc": "Glass Bay"
    },
    {
        "height": 36,
        "width": 53.0,
        "qty": 5.0,
        "unit": "panel",
        "status": "OK",
        "loc": "Glass Bay"
    },
    {
        "height": 36,
        "width": 53.5,
        "qty": 10.0,
        "unit": "panel",
        "status": "OK",
        "loc": "Glass Bay"
    },
    {
        "height": 36,
        "width": 54.0,
        "qty": 13.0,
        "unit": "panel",
        "status": "OK",
        "loc": "Glass Bay"
    },
    {
        "height": 36,
        "width": 56.0,
        "qty": 1.0,
        "unit": "panel",
        "status": "LOW",
        "loc": "Glass Bay"
    },
    {
        "height": 36,
        "width": 61.0,
        "qty": 1.0,
        "unit": "panel",
        "status": "LOW",
        "loc": "Glass Bay"
    },
    {
        "height": 36,
        "width": 63.0,
        "qty": 3.0,
        "unit": "panel",
        "status": "OK",
        "loc": "Glass Bay"
    }
],

  // ── Maisy_04_ARSENAL_SUPPLY — Shop Consumables (36 items) ─────────────────
  shopConsumables: [
    {
        "id": "PSC-001",
        "name": "Argon Bottle",
        "cat": "Weld",
        "unit": "EA",
        "qty": 1.0,
        "reorder": 3.0,
        "status": "CRITICAL",
        "cost": 8.5,
        "vendor": "Airgas",
        "partNo": "",
        "loc": "Shelf W1"
    },
    {
        "id": "PSC-002",
        "name": "84 T Saw Blade/ Alum-Plastic",
        "cat": "Machining",
        "unit": "EA",
        "qty": 1.0,
        "reorder": 1.0,
        "status": "CRITICAL",
        "cost": 74.97,
        "vendor": "Home Depot",
        "partNo": "",
        "loc": "Shelf W2"
    },
    {
        "id": "PSC-003",
        "name": "Lumber 2x4",
        "cat": "Shipping",
        "unit": "EA",
        "qty": 0.0,
        "reorder": 7.0,
        "status": "CRITICAL",
        "cost": 3.98,
        "vendor": "Home Depot",
        "partNo": "",
        "loc": "Shelf W2"
    },
    {
        "id": "PSC-004",
        "name": "Pallet",
        "cat": "Shipping",
        "unit": "EA",
        "qty": 6.0,
        "reorder": 8.0,
        "status": "LOW",
        "cost": 0.0,
        "vendor": "TBD",
        "partNo": "",
        "loc": "Shelf PC1"
    },
    {
        "id": "PSC-005",
        "name": "Gloves",
        "cat": "PPE",
        "unit": "CTN",
        "qty": 0.0,
        "reorder": 1.0,
        "status": "CRITICAL",
        "cost": 19.0,
        "vendor": "ULINE",
        "partNo": "",
        "loc": "Bin PC2"
    },
    {
        "id": "PSC-006",
        "name": "Shop Rags",
        "cat": "Shop",
        "unit": "EA",
        "qty": 0.0,
        "reorder": 1.0,
        "status": "CRITICAL",
        "cost": 0.0,
        "vendor": "TBD",
        "partNo": "",
        "loc": "Bin PC3"
    },
    {
        "id": "PSC-007",
        "name": "Shipping Label's",
        "cat": "Shipping",
        "unit": "EA",
        "qty": 1.0,
        "reorder": 2.0,
        "status": "CRITICAL",
        "cost": 24.0,
        "vendor": "ULINE",
        "partNo": "",
        "loc": "Bin PC4"
    },
    {
        "id": "PSC-008",
        "name": "Sanding Disc",
        "cat": "Prep",
        "unit": "PK",
        "qty": 0.0,
        "reorder": 3.0,
        "status": "CRITICAL",
        "cost": 22.97,
        "vendor": "Home Depot",
        "partNo": "",
        "loc": "Bin PC5"
    },
    {
        "id": "PSC-009",
        "name": "Drill Bits 5/16",
        "cat": "Machining",
        "unit": "EA",
        "qty": 1.0,
        "reorder": 0.0,
        "status": "OK",
        "cost": 0.0,
        "vendor": "A&L",
        "partNo": "",
        "loc": ""
    },
    {
        "id": "PSC-010",
        "name": "Drill Bits 7/16",
        "cat": "Machining",
        "unit": "EA",
        "qty": 1.0,
        "reorder": 0.0,
        "status": "OK",
        "cost": 0.0,
        "vendor": "A&L",
        "partNo": "",
        "loc": ""
    },
    {
        "id": "PSC-011",
        "name": "Drill Bits 3/8",
        "cat": "Machining",
        "unit": "EA",
        "qty": 1.0,
        "reorder": 0.0,
        "status": "OK",
        "cost": 0.0,
        "vendor": "A&L",
        "partNo": "",
        "loc": ""
    },
    {
        "id": "PSC-012",
        "name": "Drill Bits 1/2",
        "cat": "Machining",
        "unit": "EA",
        "qty": 1.0,
        "reorder": 0.0,
        "status": "OK",
        "cost": 0.0,
        "vendor": "A&L",
        "partNo": "",
        "loc": ""
    },
    {
        "id": "PSC-013",
        "name": "Drill Bits 1/8",
        "cat": "Machining",
        "unit": "EA",
        "qty": 1.0,
        "reorder": 0.0,
        "status": "OK",
        "cost": 0.0,
        "vendor": "",
        "partNo": "",
        "loc": ""
    },
    {
        "id": "PSC-014",
        "name": "Cut-Off Wheel",
        "cat": "Weld",
        "unit": "",
        "qty": 0.0,
        "reorder": 0.0,
        "status": "",
        "cost": 0.0,
        "vendor": "",
        "partNo": "",
        "loc": ""
    },
    {
        "id": "PSC-015",
        "name": "Sanding Wheel",
        "cat": "Weld",
        "unit": "",
        "qty": 0.0,
        "reorder": 0.0,
        "status": "",
        "cost": 0.0,
        "vendor": "",
        "partNo": "",
        "loc": ""
    },
    {
        "id": "PSC-016",
        "name": "Filler Rod - #4043 3/32 Alum.",
        "cat": "Weld",
        "unit": "CTN",
        "qty": 0.0,
        "reorder": 0.0,
        "status": "CRITICAL",
        "cost": 0.0,
        "vendor": "",
        "partNo": "",
        "loc": ""
    },
    {
        "id": "PSC-017",
        "name": "Tungsten Rod - 2% Ceriated",
        "cat": "Weld",
        "unit": "EA",
        "qty": 6.0,
        "reorder": 0.0,
        "status": "OK",
        "cost": 0.0,
        "vendor": "",
        "partNo": "",
        "loc": ""
    },
    {
        "id": "PSC-018",
        "name": "Tig Welding Collets - Long- 3/32",
        "cat": "Weld",
        "unit": "EA",
        "qty": 6.0,
        "reorder": 0.0,
        "status": "OK",
        "cost": 0.0,
        "vendor": "",
        "partNo": "",
        "loc": ""
    },
    {
        "id": "PSC-019",
        "name": " Tig Welding Collets - Lens - 3/32",
        "cat": "Weld",
        "unit": "EA",
        "qty": 3.0,
        "reorder": 0.0,
        "status": "OK",
        "cost": 0.0,
        "vendor": "",
        "partNo": "",
        "loc": ""
    },
    {
        "id": "PSC-020",
        "name": "Mig Weld Wire ",
        "cat": "Weld",
        "unit": "EA",
        "qty": 0.0,
        "reorder": 0.0,
        "status": "CRITICAL",
        "cost": 0.0,
        "vendor": "",
        "partNo": "",
        "loc": ""
    },
    {
        "id": "PSC-021",
        "name": "Carbon Dioxide Bottle",
        "cat": "Weld",
        "unit": "EA",
        "qty": 1.0,
        "reorder": 0.0,
        "status": "OK",
        "cost": 0.0,
        "vendor": "",
        "partNo": "",
        "loc": ""
    },
    {
        "id": "PSC-022",
        "name": "Weld Rod - E7018 - 1/8\"",
        "cat": "Weld",
        "unit": "EA",
        "qty": 46.0,
        "reorder": 0.0,
        "status": "OK",
        "cost": 0.0,
        "vendor": "",
        "partNo": "",
        "loc": ""
    },
    {
        "id": "PSC-023",
        "name": "Tig Weld -  Back Cup",
        "cat": "Weld",
        "unit": "EA",
        "qty": 1.0,
        "reorder": 0.0,
        "status": "OK",
        "cost": 0.0,
        "vendor": "",
        "partNo": "",
        "loc": ""
    },
    {
        "id": "PSC-024",
        "name": "Tig Weld -  Back Cup",
        "cat": "Weld",
        "unit": "EA",
        "qty": 1.0,
        "reorder": 0.0,
        "status": "OK",
        "cost": 0.0,
        "vendor": "",
        "partNo": "",
        "loc": ""
    },
    {
        "id": "PSC-025",
        "name": "Tig Weld -  Back Cup",
        "cat": "Weld",
        "unit": "EA",
        "qty": 0.0,
        "reorder": 0.0,
        "status": "CRITICAL",
        "cost": 0.0,
        "vendor": "",
        "partNo": "",
        "loc": ""
    },
    {
        "id": "PSC-026",
        "name": "Tig Gas - Lens Cup",
        "cat": "Weld",
        "unit": "EA",
        "qty": 13.0,
        "reorder": 0.0,
        "status": "OK",
        "cost": 0.0,
        "vendor": "",
        "partNo": "",
        "loc": ""
    },
    {
        "id": "PSC-027",
        "name": "Tig Gas - Lens Body",
        "cat": "Weld",
        "unit": "EA",
        "qty": 4.0,
        "reorder": 0.0,
        "status": "OK",
        "cost": 0.0,
        "vendor": "",
        "partNo": "",
        "loc": ""
    },
    {
        "id": "PSC-028",
        "name": "Tig Collet Body",
        "cat": "Weld",
        "unit": "EA",
        "qty": 1.0,
        "reorder": 0.0,
        "status": "OK",
        "cost": 0.0,
        "vendor": "",
        "partNo": "",
        "loc": ""
    },
    {
        "id": "PSC-029",
        "name": "Tig Ceramic Cup",
        "cat": "Weld",
        "unit": "EA",
        "qty": 8.0,
        "reorder": 0.0,
        "status": "OK",
        "cost": 0.0,
        "vendor": "",
        "partNo": "",
        "loc": ""
    },
    {
        "id": "PSC-030",
        "name": "Wire Brush",
        "cat": "Weld",
        "unit": "EA",
        "qty": 2.0,
        "reorder": 0.0,
        "status": "OK",
        "cost": 0.0,
        "vendor": "",
        "partNo": "",
        "loc": ""
    },
    {
        "id": "PSC-031",
        "name": "Weld Hood - Lens- Outer- Michael",
        "cat": "Weld",
        "unit": "EA",
        "qty": 4.0,
        "reorder": 0.0,
        "status": "OK",
        "cost": 0.0,
        "vendor": "A&L",
        "partNo": "",
        "loc": ""
    },
    {
        "id": "PSC-032",
        "name": "Weld Hood - Lens- Inner- Michael",
        "cat": "Weld",
        "unit": "EA",
        "qty": 4.0,
        "reorder": 0.0,
        "status": "OK",
        "cost": 0.0,
        "vendor": "A&L",
        "partNo": "",
        "loc": ""
    },
    {
        "id": "PSC-033",
        "name": "Weld Hood Band - Michael",
        "cat": "Weld",
        "unit": "EA",
        "qty": 1.0,
        "reorder": 0.0,
        "status": "OK",
        "cost": 0.0,
        "vendor": "NationalWelding",
        "partNo": "",
        "loc": ""
    },
    {
        "id": "PSC-034",
        "name": "Weld Hood Band - Jace",
        "cat": "Weld",
        "unit": "EA",
        "qty": 1.0,
        "reorder": 0.0,
        "status": "OK",
        "cost": 0.0,
        "vendor": "PipeLiners Cloud",
        "partNo": "",
        "loc": ""
    },
    {
        "id": "PSC-035",
        "name": "Drill Press Drive Belt",
        "cat": "Machining",
        "unit": "EA",
        "qty": 0.0,
        "reorder": 2.0,
        "status": "CRITICAL",
        "cost": 0.0,
        "vendor": "Napa Auto",
        "partNo": "",
        "loc": ""
    },
    {
        "id": "PSC-036",
        "name": "Propane",
        "cat": "Powder Coat",
        "unit": "EA",
        "qty": 1.0,
        "reorder": 0.0,
        "status": "OK",
        "cost": 53.27,
        "vendor": "Ace Hardware",
        "partNo": "",
        "loc": ""
    }
],

  // ── Maisy_04_ARSENAL_SUPPLY — Vendor Directory (39 vendors) ───────────────
  vendors: [
    {
        "id": "VND-001",
        "name": "COAST",
        "contact": "Melissa Myers",
        "phone": "(xxx) yyy-zzzz",
        "email": "mmyers@coastaluminum.com",
        "accountNo": "608645",
        "terms": "Credit Card/PO",
        "supplies": "Aluminum flat bar, sheet, plate, tube",
        "minOrder": "No minimum",
        "pricing": "Will-Call",
        "rating": 0.0
    },
    {
        "id": "VND-002",
        "name": "RYERSON",
        "contact": "Winston \"Wink\" Hodgson",
        "phone": "(509) 532-7724",
        "email": "winston.hodgson@ryerson.com",
        "accountNo": "10386551",
        "terms": "Credit Card",
        "supplies": "Aluminum flat bar, sheet, plate, tube",
        "minOrder": "No minimum",
        "pricing": "Walk-in pricing, will-call available",
        "rating": 0.0
    },
    {
        "id": "VND-003",
        "name": "EMJ",
        "contact": "Justin Czarapata",
        "phone": "(206) 445-3816",
        "email": "jczarapata@emjmetals.com",
        "accountNo": "326326",
        "terms": "Credit Card",
        "supplies": "Aluminum flat bar, sheet, plate, tube",
        "minOrder": "No minimum",
        "pricing": "Walk-in pricing, will-call available",
        "rating": 0.0
    },
    {
        "id": "VND-004",
        "name": "Home Depot",
        "contact": "Web Order",
        "phone": "(208) 676-1441",
        "email": "https://www.homedepot.com",
        "accountNo": "",
        "terms": "Credit Card",
        "supplies": "Shop Supplies",
        "minOrder": "No minimum",
        "pricing": "Walk-in pricing, will-call available",
        "rating": 0.0
    },
    {
        "id": "VND-005",
        "name": "Prismatic Powders",
        "contact": "Customer Service",
        "phone": "(888) 774-7628",
        "email": "sales@prismaticpowders.com",
        "accountNo": "",
        "terms": "Credit Card",
        "supplies": "Powder coat \u2014 all colors, finishes, textures",
        "minOrder": "No minimum",
        "pricing": "Online store pricing; bulk discount available",
        "rating": 0.0
    },
    {
        "id": "VND-006",
        "name": "Cardinal Paint & Powder",
        "contact": "Sales Dept.",
        "phone": "(800) 252-8842",
        "email": "info@cardinalpaint.com",
        "accountNo": "",
        "terms": "Net 30 / CC",
        "supplies": "Powder coat \u2014 industrial and architectural coatings",
        "minOrder": "25 lb",
        "pricing": "Distributor pricing; contact for volume quote",
        "rating": 0.0
    },
    {
        "id": "VND-007",
        "name": "Powder Coating Supply",
        "contact": "Customer Service",
        "phone": "(800) 960-4550",
        "email": "info@powdercoatingsupply.com",
        "accountNo": "",
        "terms": "Credit Card",
        "supplies": "Powder coat \u2014 Tiger Drylac, Columbia, Prismatic brands",
        "minOrder": "No minimum",
        "pricing": "Online store pricing",
        "rating": 0.0
    },
    {
        "id": "VND-008",
        "name": "Midwest Steel & Aluminum",
        "contact": "Sales",
        "phone": "(800) 424-6305",
        "email": "sales@midweststeelsupply.com",
        "accountNo": "",
        "terms": "Credit Card",
        "supplies": "Aluminum tube, bar, angle, flat stock \u2014 6061 T6",
        "minOrder": "No minimum",
        "pricing": "Online cut-to-length pricing; volume breaks available",
        "rating": 0.0
    },
    {
        "id": "VND-009",
        "name": "FastMetals",
        "contact": "Customer Service",
        "phone": "(877) 838-1399",
        "email": "sales@fastmetals.com",
        "accountNo": "",
        "terms": "Credit Card",
        "supplies": "Aluminum tube, bar, angle, flat stock \u2014 6061 T6",
        "minOrder": "No minimum",
        "pricing": "Online store pricing; 20% off orders over $200",
        "rating": 0.0
    },
    {
        "id": "VND-010",
        "name": "E-Rigging",
        "contact": "Sales Team",
        "phone": "(888) 975-0747",
        "email": "sales@e-rigging.com",
        "accountNo": "",
        "terms": "Credit Card",
        "supplies": "Stainless cable 7x7/1x19, swages, tensioners, cable hardware",
        "minOrder": "No minimum",
        "pricing": "Online store pricing; volume discounts available",
        "rating": 0.0
    },
    {
        "id": "VND-011",
        "name": "Stainless Cable & Railing",
        "contact": "Customer Service",
        "phone": "(888) 686-7245",
        "email": "info@stainlesscablerailing.com",
        "accountNo": "",
        "terms": "Credit Card",
        "supplies": "T316 SS cable, swage assemblies, tensioners, cable railing hardware",
        "minOrder": "No minimum",
        "pricing": "Online store pricing; custom swaged assemblies",
        "rating": 0.0
    },
    {
        "id": "VND-012",
        "name": "US Rigging Supply",
        "contact": "Sales",
        "phone": "(855) 877-4447",
        "email": "sales@usrigging.com",
        "accountNo": "",
        "terms": "Credit Card",
        "supplies": "Stainless aircraft cable 7x7, rigging hardware",
        "minOrder": "No minimum",
        "pricing": "Online store pricing",
        "rating": 0.0
    },
    {
        "id": "VND-013",
        "name": "Coastal Hardware",
        "contact": "Customer Service",
        "phone": "",
        "email": "info@coastalhardware.com",
        "accountNo": "",
        "terms": "Credit Card",
        "supplies": "Cable railing hardware, swages, angle washers",
        "minOrder": "No minimum",
        "pricing": "Online pricing; verify current stock",
        "rating": 0.0
    },
    {
        "id": "VND-014",
        "name": "Fastenal",
        "contact": "Local Branch",
        "phone": "(208) 762-0033",
        "email": "haydenid@fastenal.com",
        "accountNo": "",
        "terms": "Net 30 / CC",
        "supplies": "Fasteners, screws, bolts, drill bits, PPE, shop supplies",
        "minOrder": "No minimum",
        "pricing": "Account pricing; will-call at Hayden branch",
        "rating": 0.0
    },
    {
        "id": "VND-015",
        "name": "McMaster-Carr",
        "contact": "Customer Service",
        "phone": "(630) 600-3600",
        "email": "chi.sales@mcmaster.com",
        "accountNo": "",
        "terms": "Credit Card",
        "supplies": "Hardware, fasteners, washers, nuts, industrial supply",
        "minOrder": "No minimum",
        "pricing": "Online store pricing; same-day shipping available",
        "rating": 0.0
    },
    {
        "id": "VND-016",
        "name": "Bolt Depot",
        "contact": "Customer Service",
        "phone": "(866) 337-9888",
        "email": "sales@boltdepot.com",
        "accountNo": "",
        "terms": "Credit Card",
        "supplies": "SS lag bolts, hex nuts, washers, fasteners",
        "minOrder": "No minimum",
        "pricing": "Online store pricing; price breaks at quantity",
        "rating": 0.0
    },
    {
        "id": "VND-017",
        "name": "Starborn Industries",
        "contact": "Customer Service",
        "phone": "(800) 596-7747",
        "email": "info@starbornindustries.com",
        "accountNo": "",
        "terms": "Credit Card",
        "supplies": "Pro-plug post screws, deck screws, specialty fasteners",
        "minOrder": "Box qty",
        "pricing": "Online/dealer pricing; verify distributor availability",
        "rating": 0.0
    },
    {
        "id": "VND-018",
        "name": "Albany County Fasteners",
        "contact": "Customer Service",
        "phone": "(888) 551-5507",
        "email": "sales@albanycountyfasteners.com",
        "accountNo": "",
        "terms": "Credit Card",
        "supplies": "Specialty fasteners, post screws, lag screws",
        "minOrder": "No minimum",
        "pricing": "Online store pricing",
        "rating": 0.0
    },
    {
        "id": "VND-019",
        "name": "D&D Technologies",
        "contact": "Customer Service",
        "phone": "(800) 716-0888",
        "email": "info@ddtech.com.au",
        "accountNo": "",
        "terms": "Credit Card",
        "supplies": "Gate hinge kits \u2014 self-closing, spring hinge",
        "minOrder": "No minimum",
        "pricing": "Distributor/online pricing",
        "rating": 0.0
    },
    {
        "id": "VND-020",
        "name": "Nationwide Industries",
        "contact": "Customer Service",
        "phone": "(800) 330-2220",
        "email": "info@nationwideindustries.com",
        "accountNo": "",
        "terms": "Net 30 / CC",
        "supplies": "Gate hinges, latches, fencing hardware",
        "minOrder": "No minimum",
        "pricing": "Distributor pricing; contact for volume",
        "rating": 0.0
    },
    {
        "id": "VND-021",
        "name": "Uline",
        "contact": "Customer Service",
        "phone": "(800) 295-5510",
        "email": "customer.service@uline.com",
        "accountNo": "30862840",
        "terms": "Credit Card",
        "supplies": "Poly tubing, pallets, shipping labels, packaging supplies",
        "minOrder": "No minimum",
        "pricing": "Catalog/online pricing; free freight on qualifying orders",
        "rating": 0.0
    },
    {
        "id": "VND-022",
        "name": "Amazon Business",
        "contact": "Account Manager",
        "phone": "",
        "email": "business.amazon.com",
        "accountNo": "",
        "terms": "Credit Card",
        "supplies": "General consumables, drill bits, sanding, misc supplies",
        "minOrder": "No minimum",
        "pricing": "Business pricing; quantity discounts auto-applied",
        "rating": 0.0
    },
    {
        "id": "VND-023",
        "name": "Inpak Systems",
        "contact": "Customer Service",
        "phone": "(800) 957-9008",
        "email": "info@inpaksystems.com",
        "accountNo": "",
        "terms": "Net 30 / CC",
        "supplies": "Poly tubing, packaging materials, shop supplies",
        "minOrder": "No minimum",
        "pricing": "Distributor pricing",
        "rating": 0.0
    },
    {
        "id": "VND-024",
        "name": "Sealed Air / Pregis",
        "contact": "Sales",
        "phone": "(877) 733-4369",
        "email": "info@pregis.com",
        "accountNo": "",
        "terms": "Net 30",
        "supplies": "Air cushion film for Uline air cushion machines",
        "minOrder": "Case qty",
        "pricing": "Account pricing; contact for volume agreement",
        "rating": 0.0
    },
    {
        "id": "VND-025",
        "name": "Airgas",
        "contact": "Local Branch",
        "phone": "(208) 772-0468",
        "email": "customerservice@airgas.com",
        "accountNo": "",
        "terms": "Net 30 / CC",
        "supplies": "Argon (125/250 CF), CO2 (20 lb), mixed gases \u2014 cylinder lease & refill",
        "minOrder": "Per cylinder",
        "pricing": "Account pricing; cylinder deposit required",
        "rating": 0.0
    },
    {
        "id": "VND-026",
        "name": "Linde (Praxair)",
        "contact": "Local Branch",
        "phone": "(800) 772-9247",
        "email": "customer.service@linde.com",
        "accountNo": "",
        "terms": "Net 30",
        "supplies": "Argon, CO2, shielding gases \u2014 cylinder lease & refill",
        "minOrder": "Per cylinder",
        "pricing": "Account pricing; cylinder deposit required",
        "rating": 0.0
    },
    {
        "id": "VND-027",
        "name": "Matheson Tri-Gas",
        "contact": "Customer Service",
        "phone": "(800) 416-2505",
        "email": "customerservice@mathesongas.com",
        "accountNo": "",
        "terms": "Net 30",
        "supplies": "Argon, CO2, industrial gases \u2014 cylinder lease & refill",
        "minOrder": "Per cylinder",
        "pricing": "Account pricing; quote required",
        "rating": 0.0
    },
    {
        "id": "VND-028",
        "name": "Grainger",
        "contact": "Local Branch",
        "phone": "(208) 772-0760",
        "email": "inquiries@grainger.com",
        "accountNo": "",
        "terms": "Net 30 / CC",
        "supplies": "Tungsten, PPE, welding accessories, drill bits, general industrial",
        "minOrder": "No minimum",
        "pricing": "Account pricing; online order + will-call available",
        "rating": 0.0
    },
    {
        "id": "VND-029",
        "name": "HYW Products",
        "contact": "Customer Service",
        "phone": "",
        "email": "hywproducts.com",
        "accountNo": "",
        "terms": "Credit Card",
        "supplies": "ER4043 / ER5356 aluminum TIG/MIG filler rods",
        "minOrder": "1 lb",
        "pricing": "Online store pricing",
        "rating": 0.0
    },
    {
        "id": "VND-030",
        "name": "American Welding Supply",
        "contact": "Customer Service",
        "phone": "(800) 342-4789",
        "email": "info@americanweldingsupply.com",
        "accountNo": "",
        "terms": "Net 30 / CC",
        "supplies": "ER4043/4047 TIG rods, E7018 stick rod, Lincoln Electric products",
        "minOrder": "No minimum",
        "pricing": "Distributor pricing; volume discounts",
        "rating": 0.0
    },
    {
        "id": "VND-031",
        "name": "WeldingCity",
        "contact": "Customer Service",
        "phone": "",
        "email": "weldingcity.com",
        "accountNo": "",
        "terms": "Credit Card",
        "supplies": "ER4043/5356 TIG/MIG filler metals, welding accessories",
        "minOrder": "1 lb",
        "pricing": "Online store pricing",
        "rating": 0.0
    },
    {
        "id": "VND-032",
        "name": "Arc-Zone",
        "contact": "Customer Service",
        "phone": "(800) 944-2243",
        "email": "customerservice@arc-zone.com",
        "accountNo": "",
        "terms": "Credit Card",
        "supplies": "TIG electrodes, collets, cups, ceriated tungsten rods",
        "minOrder": "No minimum",
        "pricing": "Online store pricing; professional welding accessories",
        "rating": 0.0
    },
    {
        "id": "VND-033",
        "name": "Baker's Gas & Welding",
        "contact": "Customer Service",
        "phone": "(800) 396-9233",
        "email": "info@bakersgas.com",
        "accountNo": "",
        "terms": "Net 30 / CC",
        "supplies": "TIG cups, collet bodies, gas lenses, CK Worldwide products",
        "minOrder": "No minimum",
        "pricing": "Online/distributor pricing",
        "rating": 0.0
    },
    {
        "id": "VND-034",
        "name": "ToolsPlus",
        "contact": "Customer Service",
        "phone": "(800) 222-6133",
        "email": "sales@toolsplus.com",
        "accountNo": "",
        "terms": "Credit Card",
        "supplies": "Saw blades \u2014 Freud, aluminum-cutting, 84T 10\" carbide",
        "minOrder": "No minimum",
        "pricing": "Online store pricing",
        "rating": 0.0
    },
    {
        "id": "VND-035",
        "name": "84 Lumber",
        "contact": "Local Branch",
        "phone": "(208) 765-8494",
        "email": "customerservice@84lumber.com",
        "accountNo": "",
        "terms": "Net 30 / CC",
        "supplies": "Dimensional lumber \u2014 2x4 SPF framing for shipping/crating",
        "minOrder": "No minimum",
        "pricing": "Contractor pricing available with account",
        "rating": 0.0
    },
    {
        "id": "VND-036",
        "name": "Pallet One",
        "contact": "Customer Service",
        "phone": "(888) 252-5538",
        "email": "sales@palletone.com",
        "accountNo": "",
        "terms": "Net 30",
        "supplies": "New and reconditioned GMA pallets (48x40)",
        "minOrder": "Pallet min qty",
        "pricing": "Volume/account pricing; delivery available",
        "rating": 0.0
    },
    {
        "id": "VND-037",
        "name": "Creel Industries",
        "contact": "Customer Service",
        "phone": "(800) 356-5750",
        "email": "sales@creelindustries.com",
        "accountNo": "",
        "terms": "Net 30",
        "supplies": "New GMA pallets, custom pallet sizes",
        "minOrder": "Pallet min qty",
        "pricing": "Wholesale pricing; account required",
        "rating": 0.0
    },
    {
        "id": "VND-038",
        "name": "Trim-Lok",
        "contact": "Customer Service",
        "phone": "(800) 457-0887",
        "email": "info@trim-lok.com",
        "accountNo": "",
        "terms": "Net 30 / CC",
        "supplies": "Handrail end caps, edge trim, rubber/plastic extrusions",
        "minOrder": "No minimum",
        "pricing": "Online/distributor pricing",
        "rating": 0.0
    },
    {
        "id": "VND-039",
        "name": "Lowe's",
        "contact": "Web / Store",
        "phone": "(208) 762-6900",
        "email": "https://www.lowes.com",
        "accountNo": "",
        "terms": "Credit Card",
        "supplies": "Dimensional lumber, general shop supplies",
        "minOrder": "No minimum",
        "pricing": "Walk-in / online retail pricing",
        "rating": 0.0
    }
],

  // ── Maisy_04_ARSENAL_SUPPLY — Purchase Log (7 orders) ─────────────────────
  purchaseLog: [
    {
        "po": "18538062",
        "date": "2026-02-12",
        "vendor": "Ryerson",
        "contact": "Winston Hodgson",
        "item": "6061-T6 Tube 2in SQ x 0.125",
        "cat": "Aluminum Tube",
        "qty": 500.0,
        "unit": "LF",
        "unitCost": 4.6,
        "total": 2300.0,
        "freight": 0.0,
        "grandTotal": 2300.0,
        "leadDays": 0.0,
        "received": "2026-02-12",
        "status": "Received",
        "terms": "Credit Card",
        "notes": "emailed receipt to Accounting"
    },
    {
        "po": "18538070",
        "date": "2025-02-12",
        "vendor": "Ryerson",
        "contact": "Winston Hodgson",
        "item": "6061-T6 Tube 2in SQ x 0.125",
        "cat": "Aluminum Tube",
        "qty": 660.0,
        "unit": "LF",
        "unitCost": 4.6,
        "total": 3036.0,
        "freight": 0.0,
        "grandTotal": 3036.0,
        "leadDays": 0.0,
        "received": "2026-02-12",
        "status": "Received",
        "terms": "Credit Card",
        "notes": "emailed receipt to Accounting"
    },
    {
        "po": "1121370",
        "date": "2026-02-16",
        "vendor": "EMJ",
        "contact": "Justin Czarapate",
        "item": "6061-T6 Top Rail 1\" x 3\"  x 0.125",
        "cat": "Aluminum Tube",
        "qty": 940.0,
        "unit": "LF",
        "unitCost": 3.47,
        "total": 3261.8,
        "freight": 0.0,
        "grandTotal": 3261.8,
        "leadDays": 2.0,
        "received": "2026-02-23",
        "status": "Received",
        "terms": "Credit Card",
        "notes": "emailed receipt to Accounting"
    },
    {
        "po": "486092",
        "date": "2026-02-17",
        "vendor": "Alcobra",
        "contact": "Ashley Coleman",
        "item": "6061-T6 Flat Bar 1/8\" x 2\"",
        "cat": "Aluminum Flat Stock",
        "qty": 120.0,
        "unit": "LF",
        "unitCost": 2.21,
        "total": 265.2,
        "freight": 23.87,
        "grandTotal": 289.07,
        "leadDays": 0.0,
        "received": "2026-02-17",
        "status": "Received",
        "terms": "Credit Card",
        "notes": "emailed receipt to Accounting"
    },
    {
        "po": "26022500943217-400000",
        "date": "2026-02-25",
        "vendor": "Vevor",
        "contact": "Online Order",
        "item": "T319 1/8\" 1x19 SS Cable (1000')",
        "cat": "Cable / Wire",
        "qty": 3.0,
        "unit": "Roll",
        "unitCost": 134.9,
        "total": 404.7,
        "freight": 0.0,
        "grandTotal": 404.7,
        "leadDays": 3.0,
        "received": "2026-02-26",
        "status": "Received",
        "terms": "Credit Card",
        "notes": "emailed receipt to Accounting"
    },
    {
        "po": "486675",
        "date": "2026-02-25",
        "vendor": "Alcobra",
        "contact": "Ashley Coleman",
        "item": "6061-T6 Flat Bar 1/8\" x 2\"",
        "cat": "Aluminum Flat Stock",
        "qty": 180.0,
        "unit": "LF",
        "unitCost": 2.27,
        "total": 408.24,
        "freight": 37.15,
        "grandTotal": 445.39,
        "leadDays": 0.0,
        "received": "2026-02-26",
        "status": "Received",
        "terms": "Credit Card",
        "notes": "emailed receipt to Accounting"
    },
    {
        "po": "18560388",
        "date": "2026-02-25",
        "vendor": "Ryerson",
        "contact": "Winston Hodgson",
        "item": "6061-T6 Tube 2in SQ x 0.125",
        "cat": "Aluminum Tube",
        "qty": 500.0,
        "unit": "LF",
        "unitCost": 4.6,
        "total": 2300.0,
        "freight": 209.3,
        "grandTotal": 2509.3,
        "leadDays": 1.0,
        "received": "2026-02-26",
        "status": "Received",
        "terms": "Credit Card",
        "notes": "emailed receipt to Accounting"
    }
],

  // ── Maisy_04_ARSENAL_SUPPLY — Order Requests (5 requests) ─────────────────
  orderRequests: [
    {
        "id": "REQ-0001",
        "dateReq": "2026-02-11",
        "dateNeed": "2026-03-02",
        "item": "Weld Hood Band",
        "dept": "Welding",
        "requester": "Michael",
        "priority": "Medium",
        "approvedBy": "D. Jones",
        "approvalDate": "2026-02-14",
        "vendor": "National Wedling",
        "partNo": "UMRWXHR",
        "qty": 1.0,
        "unit": "EA",
        "estCost": 54.0,
        "estTotal": 54.0,
        "status": "Requested",
        "notes": ""
    },
    {
        "id": "REQ-0002",
        "dateReq": "2026-02-25",
        "dateNeed": "2026-03-02",
        "item": "Powder Coat mask",
        "dept": "Powder Coating",
        "requester": "Amber",
        "priority": "Medium",
        "approvedBy": "D. Jones",
        "approvalDate": "2026-02-25",
        "vendor": "Amazon",
        "partNo": "",
        "qty": 1.0,
        "unit": "EA",
        "estCost": 129.0,
        "estTotal": 129.0,
        "status": "On Order",
        "notes": ""
    },
    {
        "id": "REQ-0003",
        "dateReq": "2026-02-27",
        "dateNeed": "2026-03-05",
        "item": "A-32 Drive Belt",
        "dept": "Maintenance",
        "requester": "Nick",
        "priority": "Medium",
        "approvedBy": "D. Jones",
        "approvalDate": "2026-03-01",
        "vendor": "Napa Auto",
        "partNo": "",
        "qty": 4.0,
        "unit": "EA",
        "estCost": 0.0,
        "estTotal": 0.0,
        "status": "On Order",
        "notes": ""
    },
    {
        "id": "REQ-0004",
        "dateReq": "2026-03-03",
        "dateNeed": "2026-03-05",
        "item": "Swages",
        "dept": "Assembly",
        "requester": "Amber",
        "priority": "High",
        "approvedBy": "D. Jones",
        "approvalDate": "2026-03-03",
        "vendor": "Amazon",
        "partNo": "",
        "qty": 1000.0,
        "unit": "EA",
        "estCost": 0.0,
        "estTotal": 0.0,
        "status": "On Order",
        "notes": ""
    },
    {
        "id": "REQ-0005",
        "dateReq": "2026-03-03",
        "dateNeed": "2026-03-04",
        "item": "12\"-96T- Saw Blade",
        "dept": "Cutting",
        "requester": "Nick",
        "priority": "High",
        "approvedBy": "D. Jones",
        "approvalDate": "2026-03-03",
        "vendor": "Home Depot",
        "partNo": "",
        "qty": 1.0,
        "unit": "EA",
        "estCost": 0.0,
        "estTotal": 0.0,
        "status": "Received",
        "notes": ""
    }
],

  // ── Maisy_04_ARSENAL_SUPPLY — Misc Charges (15 charges, same as 05 — one copy) ──
  miscCharges: [
    {
        "id": "MC-001",
        "date": "2026-02-12",
        "cat": "Waste Disposal",
        "desc": "Waste Disposal from Shop",
        "vendor": "Ramsey Transfer Station",
        "amount": 46.79,
        "payMethod": "Company Card",
        "paidBy": "Company",
        "reimbursable": "No",
        "approvedBy": "D. Jones",
        "invoiceNo": "47-35295",
        "notes": "emailed receipt to Accounting"
    },
    {
        "id": "MC-002",
        "date": "2026-02-12",
        "cat": "Waste Disposal",
        "desc": "Waste Disposal from Shop",
        "vendor": "Ramsey Transfer Station",
        "amount": 21.48,
        "payMethod": "Company Card",
        "paidBy": "Company",
        "reimbursable": "No",
        "approvedBy": "D. Jones",
        "invoiceNo": "47-35323",
        "notes": "emailed receipt to Accounting"
    },
    {
        "id": "MC-003",
        "date": "2026-02-20",
        "cat": "Fuel",
        "desc": "Bellevue Transfer",
        "vendor": "Sinclair",
        "amount": 55.02,
        "payMethod": "Company Card",
        "paidBy": "Company",
        "reimbursable": "No",
        "approvedBy": "D. Jones",
        "invoiceNo": "31699",
        "notes": "emailed receipt to Accounting"
    },
    {
        "id": "MC-004",
        "date": "2026-02-20",
        "cat": "Fuel",
        "desc": "Bellevue Transfer",
        "vendor": "Chevron",
        "amount": 65.5,
        "payMethod": "Company Card",
        "paidBy": "Company",
        "reimbursable": "No",
        "approvedBy": "D. Jones",
        "invoiceNo": "236578",
        "notes": "emailed receipt to Accounting"
    },
    {
        "id": "MC-005",
        "date": "2026-02-20",
        "cat": "Fuel",
        "desc": "Bellevue Transfer",
        "vendor": "Shell",
        "amount": 104.93,
        "payMethod": "Company Card",
        "paidBy": "Company",
        "reimbursable": "No",
        "approvedBy": "D. Jones",
        "invoiceNo": "413500",
        "notes": "emailed receipt to Accounting"
    },
    {
        "id": "MC-006",
        "date": "2026-02-24",
        "cat": "Repairs & Maintenance",
        "desc": "Pest Control - Hayden",
        "vendor": "Home Depot",
        "amount": 72.47,
        "payMethod": "Company Card",
        "paidBy": "Company",
        "reimbursable": "No",
        "approvedBy": "D. Jones",
        "invoiceNo": "WK16817719",
        "notes": "emailed receipt to Accounting"
    },
    {
        "id": "MC-007",
        "date": "2026-02-24",
        "cat": "Other",
        "desc": "Powder Coat - Propane",
        "vendor": "Ace Hardware",
        "amount": 75.23,
        "payMethod": "Company Card",
        "paidBy": "Company",
        "reimbursable": "No",
        "approvedBy": "D. Jones",
        "invoiceNo": "D71346/3",
        "notes": "emailed receipt to Accounting"
    },
    {
        "id": "MC-008",
        "date": "2026-02-23",
        "cat": "Other",
        "desc": "Shop Supplies",
        "vendor": "AirGas",
        "amount": 185.09,
        "payMethod": "Company Card",
        "paidBy": "Company",
        "reimbursable": "No",
        "approvedBy": "D. Jones",
        "invoiceNo": "2014247009",
        "notes": "emailed receipt to Accounting"
    },
    {
        "id": "MC-009",
        "date": "2026-02-24",
        "cat": "Other",
        "desc": "Argon",
        "vendor": "AirGas",
        "amount": 50.63,
        "payMethod": "Company Card",
        "paidBy": "Company",
        "reimbursable": "No",
        "approvedBy": "D. Jones",
        "invoiceNo": "1146571174",
        "notes": "emailed receipt to Accounting"
    },
    {
        "id": "MC-010",
        "date": "2026-02-23",
        "cat": "Other",
        "desc": "Spray Paint / 1/2\" cold roll",
        "vendor": "Home Depot",
        "amount": 34.16,
        "payMethod": "Company Card",
        "paidBy": "Company",
        "reimbursable": "No",
        "approvedBy": "D. Jones",
        "invoiceNo": "1803-00051-91861",
        "notes": "emailed receipt to Accounting"
    },
    {
        "id": "MC-011",
        "date": "2026-02-23",
        "cat": "Other",
        "desc": "DIABLO - 5\" sanding pad - 50PK - 80 Grit",
        "vendor": "Home Depot",
        "amount": 48.7,
        "payMethod": "Company Card",
        "paidBy": "Company",
        "reimbursable": "No",
        "approvedBy": "D. Jones",
        "invoiceNo": "1803-00051-91366",
        "notes": "emailed receipt to Accounting"
    },
    {
        "id": "MC-012",
        "date": "2026-02-12",
        "cat": "Other",
        "desc": "Air Hammer / Kit",
        "vendor": "Home Depot",
        "amount": 83.44,
        "payMethod": "Company Card",
        "paidBy": "Company",
        "reimbursable": "No",
        "approvedBy": "D. Jones",
        "invoiceNo": "WN48809387",
        "notes": "emailed receipt to Accounting"
    },
    {
        "id": "MC-013",
        "date": "2026-02-12",
        "cat": "Other",
        "desc": "DIABLO - 5\" sanding pad - 50PK - 80 Grit",
        "vendor": "Home Depot",
        "amount": 48.7,
        "payMethod": "Company Card",
        "paidBy": "Company",
        "reimbursable": "No",
        "approvedBy": "D. Jones",
        "invoiceNo": "WN48822063",
        "notes": "emailed receipt to Accounting"
    },
    {
        "id": "MC-014",
        "date": "2026-02-16",
        "cat": "Other",
        "desc": "DIABLO - 10\"-84T Saw Blade / Gate Kit",
        "vendor": "Home Depot",
        "amount": 196.41,
        "payMethod": "Company Card",
        "paidBy": "Rocky",
        "reimbursable": "Yes",
        "approvedBy": "D. Jones",
        "invoiceNo": "WN49140063",
        "notes": "emailed receipt to Accounting"
    },
    {
        "id": "MC-015",
        "date": "2026-02-24",
        "cat": "Other",
        "desc": "DIABLO - 5\" sanding pad - 50PK - 80 Grit / Hand Sander / Lumber",
        "vendor": "Home Depot",
        "amount": 218.02,
        "payMethod": "Company Card",
        "paidBy": "Company",
        "reimbursable": "No",
        "approvedBy": "D. Jones",
        "invoiceNo": "WN49807812",
        "notes": "emailed receipt to Accounting"
    }
],

  // ── Maisy_02_VELOCITY_SALES — Quote Log (deduped from 02 only) ────────────
  quoteLog: [
    {
        "id": "SQ-2026-0045",
        "customer": "Henderson Deck Co.",
        "origin": "Hayden",
        "dest": "",
        "carrier": "FedEx",
        "pieces": 0.0,
        "weight": 0.0,
        "estCost": 0.0,
        "actualCost": 142.3,
        "status": "Shipped",
        "variance": 0.0
    },
    {
        "id": "SQ-2026-0046",
        "customer": "Coastal Living Design",
        "origin": "Hayden",
        "dest": "",
        "carrier": "R+L Carriers",
        "pieces": 0.0,
        "weight": 0.0,
        "estCost": 0.0,
        "actualCost": 410.0,
        "status": "Shipped",
        "variance": 0.0
    },
    {
        "id": "SQ-2026-0047",
        "customer": "Apex Construction",
        "origin": "Hayden",
        "dest": "",
        "carrier": "FedEx",
        "pieces": 0.0,
        "weight": 0.0,
        "estCost": 0.0,
        "actualCost": 0.0,
        "status": "Quoted",
        "variance": 0.0
    },
    {
        "id": "SQ-2026-0048",
        "customer": "Home Depot \u2014 #4521",
        "origin": "Hayden",
        "dest": "",
        "carrier": "Old Dominion",
        "pieces": 0.0,
        "weight": 0.0,
        "estCost": 0.0,
        "actualCost": 0.0,
        "status": "Quoted",
        "variance": 0.0
    }
],

  // ── Maisy_06_DISPATCH_LOGISTICS — Ship Cost Log (23 real shipments) ────────
  shipCostLog: [
    {
        "date": "2026-01-13",
        "month": "Jan 2026",
        "poRef": "147979110",
        "customer": "Wayfair - Vahid M",
        "carrier": "ABF Freight",
        "service": "Freight",
        "weight": 22.0,
        "dims": "144x6x6",
        "declaredValue": 100.0,
        "destCity": "Chicago",
        "destState": "IL",
        "baseRate": 407.08,
        "totalCost": 407.08,
        "tracking": "OMG1129858"
    },
    {
        "date": "2026-01-19",
        "month": "Jan 2026",
        "poRef": "147979141",
        "customer": "Farzaneh Fetdows",
        "carrier": "ABF Freight",
        "service": "Freight",
        "weight": 829.0,
        "dims": "144x40x17",
        "declaredValue": 100.0,
        "destCity": "Woodland Hills",
        "destState": "CA",
        "baseRate": 763.85,
        "totalCost": 763.85,
        "tracking": "OMG1208013"
    },
    {
        "date": "2026-01-21",
        "month": "Jan 2026",
        "poRef": "147979150",
        "customer": "Dave Miller",
        "carrier": "ABF Freight",
        "service": "Freight",
        "weight": 298.0,
        "dims": "144x43x18",
        "declaredValue": 100.0,
        "destCity": "Lewes",
        "destState": "DE ",
        "baseRate": 681.25,
        "totalCost": 681.25,
        "tracking": "OMG1079219"
    },
    {
        "date": "2026-01-21",
        "month": "Jan 2026",
        "poRef": "147979149",
        "customer": "Jrscates LLC",
        "carrier": "ABF Freight",
        "service": "Freight",
        "weight": 450.0,
        "dims": "144x44x17",
        "declaredValue": 100.0,
        "destCity": "Cream Ridge",
        "destState": "NJ",
        "baseRate": 737.16,
        "totalCost": 737.16,
        "tracking": "OMG3500598"
    },
    {
        "date": "2026-02-04",
        "month": "Feb 2026",
        "poRef": "432627101",
        "customer": "Kristy Mohoney",
        "carrier": "Other",
        "service": "Freight",
        "weight": 276.0,
        "dims": "147x43x17",
        "declaredValue": 100.0,
        "destCity": "Shoreline",
        "destState": "WA",
        "baseRate": 703.22,
        "totalCost": 703.22,
        "tracking": "310362"
    },
    {
        "date": "2026-02-04",
        "month": "Feb 2026",
        "poRef": "147979217",
        "customer": "Jacob Neal",
        "carrier": "ABF Freight",
        "service": "Freight",
        "weight": 133.0,
        "dims": "98x43x17",
        "declaredValue": 100.0,
        "destCity": "Happy Valley",
        "destState": "OR",
        "baseRate": 409.14,
        "totalCost": 409.14,
        "tracking": "OMG1679662"
    },
    {
        "date": "2026-02-04",
        "month": "Feb 2026",
        "poRef": "147979216",
        "customer": "KGM Construction",
        "carrier": "ABF Freight",
        "service": "Freight",
        "weight": 664.0,
        "dims": "117x43x30",
        "declaredValue": 100.0,
        "destCity": "Templeton",
        "destState": "CA",
        "baseRate": 696.88,
        "totalCost": 696.88,
        "tracking": "OMG9457768"
    },
    {
        "date": "2026-02-16",
        "month": "Feb 2026",
        "poRef": "147979296",
        "customer": "Gregg Luebbe",
        "carrier": "ABF Freight",
        "service": "Freight",
        "weight": 381.0,
        "dims": "144x44x17",
        "declaredValue": 100.0,
        "destCity": "Portland",
        "destState": "OR",
        "baseRate": 409.14,
        "totalCost": 409.14,
        "tracking": "OMG1945564"
    },
    {
        "date": "2026-02-17",
        "month": "Feb 2026",
        "poRef": "147979300",
        "customer": "Andrew Lojewski",
        "carrier": "ABF Freight",
        "service": "Freight",
        "weight": 248.0,
        "dims": "144x44x17",
        "declaredValue": 100.0,
        "destCity": "Davis",
        "destState": "CA",
        "baseRate": 510.94,
        "totalCost": 510.94,
        "tracking": "OMG3833512"
    },
    {
        "date": "2026-02-18",
        "month": "Feb 2026",
        "poRef": "147979314",
        "customer": "Brett Chell",
        "carrier": "ABF Freight",
        "service": "Freight",
        "weight": 875.0,
        "dims": "240x44x17",
        "declaredValue": 100.0,
        "destCity": "Salt Lake City",
        "destState": "UT",
        "baseRate": 1779.31,
        "totalCost": 1779.31,
        "tracking": "OMG1325998"
    },
    {
        "date": "2026-02-18",
        "month": "Feb 2026",
        "poRef": "147979318",
        "customer": "Shem Hart",
        "carrier": "ABF Freight",
        "service": "Freight",
        "weight": 279.0,
        "dims": "144x44x19",
        "declaredValue": 100.0,
        "destCity": "Yacolt",
        "destState": "WA",
        "baseRate": 1077.61,
        "totalCost": 1077.61,
        "tracking": "OMG2058540"
    },
    {
        "date": "2026-02-20",
        "month": "Feb 2026",
        "poRef": "147979333",
        "customer": "Adam Jensen",
        "carrier": "ABF Freight",
        "service": "Freight",
        "weight": 100.0,
        "dims": "144x44x17",
        "declaredValue": 100.0,
        "destCity": "Tigard",
        "destState": "OR",
        "baseRate": 367.26,
        "totalCost": 367.26,
        "tracking": "OMG2015962"
    },
    {
        "date": "2026-02-19",
        "month": "Feb 2026",
        "poRef": "N/A",
        "customer": "Jason Jessop",
        "carrier": "UPS",
        "service": "Ground",
        "weight": 60.0,
        "dims": "49x13x13",
        "declaredValue": 100.0,
        "destCity": "Victor",
        "destState": "MT",
        "baseRate": 79.01,
        "totalCost": 79.01,
        "tracking": "1Z5K02DT0332224203"
    },
    {
        "date": "2026-02-19",
        "month": "Feb 2026",
        "poRef": "N/A",
        "customer": "Jason Jessop",
        "carrier": "UPS",
        "service": "Ground",
        "weight": 60.0,
        "dims": "49x13x13",
        "declaredValue": 100.0,
        "destCity": "Victor",
        "destState": "MT",
        "baseRate": 79.01,
        "totalCost": 79.01,
        "tracking": "1Z5K02DT0310144019"
    },
    {
        "date": "2026-02-19",
        "month": "Feb 2026",
        "poRef": "N/A",
        "customer": "Jason Jessop",
        "carrier": "UPS",
        "service": "Ground",
        "weight": 59.0,
        "dims": "49x13x13",
        "declaredValue": 100.0,
        "destCity": "Victor",
        "destState": "MT",
        "baseRate": 41.98,
        "totalCost": 41.98,
        "tracking": "1Z5K02DT0308501342"
    },
    {
        "date": "2026-02-19",
        "month": "Feb 2026",
        "poRef": "N/A",
        "customer": "Jason Jessop",
        "carrier": "UPS",
        "service": "Ground",
        "weight": 50.0,
        "dims": "48x12x12",
        "declaredValue": 100.0,
        "destCity": "Victor",
        "destState": "MT",
        "baseRate": 41.98,
        "totalCost": 41.98,
        "tracking": "1Z5K02DT0301184350"
    },
    {
        "date": "2026-02-23",
        "month": "Feb 2026",
        "poRef": "N/A",
        "customer": "KGM Construction",
        "carrier": "UPS",
        "service": "Ground",
        "weight": 12.0,
        "dims": "12x15x15",
        "declaredValue": 100.0,
        "destCity": "Templeton",
        "destState": "CA",
        "baseRate": 38.0,
        "totalCost": 38.0,
        "tracking": "1Z5K02DT0302928189"
    },
    {
        "date": "2026-02-23",
        "month": "Feb 2026",
        "poRef": "N/A",
        "customer": "Joe Hurtt",
        "carrier": "UPS",
        "service": "Ground",
        "weight": 12.0,
        "dims": "12x15x15",
        "declaredValue": 100.0,
        "destCity": "Kingston",
        "destState": "CA",
        "baseRate": 38.0,
        "totalCost": 38.0,
        "tracking": "1Z5K02DT0300754398"
    },
    {
        "date": "2026-02-25",
        "month": "Feb 2026",
        "poRef": "N/A",
        "customer": "Joe Christman",
        "carrier": "UPS",
        "service": "Express 2-Day",
        "weight": 3.0,
        "dims": "6x6x6",
        "declaredValue": 100.0,
        "destCity": "Denver",
        "destState": "CO",
        "baseRate": 69.95,
        "totalCost": 69.95,
        "tracking": "1Z5K02DT0137072238"
    },
    {
        "date": "2026-02-26",
        "month": "Feb 2026",
        "poRef": "N/A",
        "customer": "Gregg Luebbe",
        "carrier": "UPS",
        "service": "Express 2-Day",
        "weight": 11.0,
        "dims": "48x12x12",
        "declaredValue": 100.0,
        "destCity": "Portland",
        "destState": "OR",
        "baseRate": 60.81,
        "totalCost": 60.81,
        "tracking": "1Z5K02DT0335782640"
    },
    {
        "date": "2026-03-02",
        "month": "Mar 2026",
        "poRef": "432685222",
        "customer": "Cedrik Cox",
        "carrier": "Estes Freight",
        "service": "Freight",
        "weight": 443.0,
        "dims": "144x48x17",
        "declaredValue": 100.0,
        "destCity": "St. Helens",
        "destState": "OR",
        "baseRate": 754.53,
        "totalCost": 754.53,
        "tracking": "317447"
    },
    {
        "date": "2026-03-06",
        "month": "Mar 2026",
        "poRef": "N/A",
        "customer": "Cedrik Cox",
        "carrier": "UPS",
        "service": "Ground",
        "weight": 1.0,
        "dims": "8x8x7",
        "declaredValue": 100.0,
        "destCity": "St. Helens",
        "destState": "OR",
        "baseRate": 26.45,
        "totalCost": 26.45,
        "tracking": "1Z5K02DT0320589066"
    },
    {
        "date": "2026-03-09",
        "month": "Mar 2026",
        "poRef": "N/A",
        "customer": "Adam Jensen",
        "carrier": "UPS",
        "service": "Next day",
        "weight": 2.0,
        "dims": "6x6x6",
        "declaredValue": 100.0,
        "destCity": "Portland",
        "destState": "OR",
        "baseRate": 54.38,
        "totalCost": 54.38,
        "tracking": "1Z68T1Y81397331898"
    }
],

  // ── Maisy_06_DISPATCH_LOGISTICS — Borrowed Labor (11 entries) ─────────────
  borrowedLabor: [
    {
        "entry": 1.0,
        "employee": "Jace",
        "date": "2026-02-17",
        "task": "DECK BUILD",
        "location": "HAYDEN",
        "onSiteHrs": 7.0,
        "transferHrs": 0.0,
        "totalHrs": 7.0,
        "rate": 35.0,
        "billable": 245.0
    },
    {
        "entry": 3.0,
        "employee": "Michael",
        "date": "2026-02-13",
        "task": "DELIVERY",
        "location": "HAYDEN-BELLEVUE",
        "onSiteHrs": 0.0,
        "transferHrs": 11.0,
        "totalHrs": 11.0,
        "rate": 40.0,
        "billable": 440.0
    },
    {
        "entry": 4.0,
        "employee": "Michael",
        "date": "2026-02-06",
        "task": "DELIVERY",
        "location": "HAYDEN-BELLEVUE",
        "onSiteHrs": 0.0,
        "transferHrs": 11.0,
        "totalHrs": 11.0,
        "rate": 40.0,
        "billable": 440.0
    },
    {
        "entry": 5.0,
        "employee": "Amber",
        "date": "2026-01-23",
        "task": "DELIVERY",
        "location": "HAYDEN-BELLEVUE",
        "onSiteHrs": 0.0,
        "transferHrs": 10.0,
        "totalHrs": 10.0,
        "rate": 40.0,
        "billable": 400.0
    },
    {
        "entry": 6.0,
        "employee": "Jace",
        "date": "2026-02-09",
        "task": "DELIVERY",
        "location": "HAYDEN-BELLEVUE",
        "onSiteHrs": 0.0,
        "transferHrs": 10.0,
        "totalHrs": 10.0,
        "rate": 35.0,
        "billable": 350.0
    },
    {
        "entry": 7.0,
        "employee": "Jace",
        "date": "2026-01-26",
        "task": "DECK BUILD",
        "location": "HAYDEN",
        "onSiteHrs": 6.0,
        "transferHrs": 0.0,
        "totalHrs": 6.0,
        "rate": 35.0,
        "billable": 210.0
    },
    {
        "entry": 8.0,
        "employee": "Jace",
        "date": "2026-01-27",
        "task": "DECK BUILD",
        "location": "HAYDEN",
        "onSiteHrs": 9.0,
        "transferHrs": 0.0,
        "totalHrs": 9.0,
        "rate": 35.0,
        "billable": 315.0
    },
    {
        "entry": 9.0,
        "employee": "Jace",
        "date": "2026-02-18",
        "task": "DECK BUILD",
        "location": "HAYDEN",
        "onSiteHrs": 9.0,
        "transferHrs": 0.0,
        "totalHrs": 9.0,
        "rate": 35.0,
        "billable": 315.0
    },
    {
        "entry": 10.0,
        "employee": "Amber",
        "date": "2026-02-20",
        "task": "DELIVERY",
        "location": "HAYDEN-BELLEVUE",
        "onSiteHrs": 0.0,
        "transferHrs": 11.0,
        "totalHrs": 11.0,
        "rate": 40.0,
        "billable": 440.0
    },
    {
        "entry": 11.0,
        "employee": "Amber",
        "date": "2026-02-27",
        "task": "DELIVERY",
        "location": "HAYDEN-BELLEVUE",
        "onSiteHrs": 0.0,
        "transferHrs": 11.0,
        "totalHrs": 11.0,
        "rate": 40.0,
        "billable": 440.0
    },
    {
        "entry": 12.0,
        "employee": "Jace",
        "date": "2026-03-06",
        "task": "DELIVERY",
        "location": "HAYDEN-BELLEVUE",
        "onSiteHrs": 0.0,
        "transferHrs": 11.0,
        "totalHrs": 11.0,
        "rate": 35.0,
        "billable": 385.0
    }
],

  // ── Maisy_06_DISPATCH_LOGISTICS — Order Fulfillment / Sister Co (17 orders) ─
  orderFulfillment: [
    {
        "orderNo": "1088",
        "date": "2026-01-01",
        "project": "3BD-DAVE WAH",
        "desc": "6 POST/ 1 L BAR",
        "location": "HAYDEN - BELLEVUE",
        "value": 0.0,
        "notes": "NO AMOUNT ON ORDER FORM"
    },
    {
        "orderNo": "1085",
        "date": "2026-01-02",
        "project": "3BD-HANNAH PARK",
        "desc": "SURFACE CABLE",
        "location": "HAYDEN - BELLEVUE",
        "value": 0.0,
        "notes": "NO AMOUNT ON ORDER FORM"
    },
    {
        "orderNo": "",
        "date": "2026-01-03",
        "project": "3BD-LISA GILL",
        "desc": "FASCIA FRAMED GLASS",
        "location": "HAYDEN - BELLEVUE",
        "value": 0.0,
        "notes": "NO AMOUNT ON ORDER FORM"
    },
    {
        "orderNo": "1059",
        "date": "2026-01-04",
        "project": "3BD-MATHEW PAWLIKOWSKI",
        "desc": "FASCIA CABLE",
        "location": "HAYDEN - BELLEVUE",
        "value": 7534.45,
        "notes": ""
    },
    {
        "orderNo": "1073",
        "date": "2026-01-05",
        "project": "3BD-SURYA MAHARJAN",
        "desc": "FASCIA CABLE",
        "location": "HAYDEN - BELLEVUE",
        "value": 0.0,
        "notes": "NO AMOUNT ON ORDER FORM"
    },
    {
        "orderNo": "1089",
        "date": "2026-01-06",
        "project": "3BD-VARGRA",
        "desc": "3 POST",
        "location": "HAYDEN - BELLEVUE",
        "value": 0.0,
        "notes": "NO AMOUNT ON ORDER FORM / REMAKE"
    },
    {
        "orderNo": "1095",
        "date": "2026-02-01",
        "project": "3BD-FABRICE",
        "desc": "SURFACE CABLE",
        "location": "HAYDEN - BELLEVUE",
        "value": 996.22,
        "notes": ""
    },
    {
        "orderNo": "1111",
        "date": "2026-02-02",
        "project": "3BD-DAVE WAH",
        "desc": "96' POST",
        "location": "HAYDEN - BELLEVUE",
        "value": 0.0,
        "notes": "NO AMOUNT ON ORDER FORM "
    },
    {
        "orderNo": "1110",
        "date": "2026-02-03",
        "project": "3BD-IRENNE KEARNS",
        "desc": "FASCIA CABLE",
        "location": "HAYDEN - BELLEVUE",
        "value": 4163.67,
        "notes": ""
    },
    {
        "orderNo": "1096",
        "date": "2026-02-04",
        "project": "3BD-TODD BEHRBAUM",
        "desc": "SURFACE CABLE",
        "location": "HAYDEN - BELLEVUE",
        "value": 3305.06,
        "notes": ""
    },
    {
        "orderNo": "1101",
        "date": "2026-02-05",
        "project": "3BD-TRAVIS ISAACS",
        "desc": "7 FM POST",
        "location": "HAYDEN - BELLEVUE",
        "value": 0.0,
        "notes": "NO AMOUNT ON ORDER FORM"
    },
    {
        "orderNo": "1115",
        "date": "2026-02-18",
        "project": "3BD-TRACIE GRANT",
        "desc": "FASCIA CABLE",
        "location": "HAYDEN - BELLEVUE",
        "value": 3900.2,
        "notes": ""
    },
    {
        "orderNo": "1123",
        "date": "2026-02-25",
        "project": "3BD-Conrad",
        "desc": "FASCIA CABLE",
        "location": "Hayden Local Pick-Up",
        "value": 7655.99,
        "notes": "Local Pick-Up 3BD Install"
    },
    {
        "orderNo": "1125",
        "date": "2026-02-25",
        "project": "3BD-Noah Borun",
        "desc": "SURFACE CABLE",
        "location": "HAYDEN - BELLEVUE",
        "value": 5629.57,
        "notes": ""
    },
    {
        "orderNo": "1127",
        "date": "2026-02-25",
        "project": "3BD-Hatch",
        "desc": "FASCIA CABLE",
        "location": "Hayden Local Pick-Up",
        "value": 31340.84,
        "notes": "Local Pick-Up 3BD Install"
    },
    {
        "orderNo": "1135",
        "date": "2026-03-05",
        "project": "3BD-Varjra",
        "desc": "2x1 (Rail) ",
        "location": "HAYDEN - BELLEVUE",
        "value": 0.0,
        "notes": "NO AMOUNT ON ORDER FORM"
    },
    {
        "orderNo": "1136",
        "date": "2026-03-05",
        "project": "3BD - Janet Vanderveen",
        "desc": "Top Rail",
        "location": "HAYDEN - BELLEVUE",
        "value": 0.0,
        "notes": "NO AMOUNT ON ORDER FORM "
    }
],

  // ── Maisy_03_FORGE_PRODUCTION — Scrap & Waste (6 entries) ─────────────────
  scrapWaste: [
    {
        "date": "2026-01-14",
        "station": "Cutting",
        "material": "6063-T5 Tube 2x2",
        "sku": "Cable Post SM 42",
        "qty": 3.0,
        "unit": "pcs",
        "cost": 42.5,
        "reasonCode": "CUT",
        "rootCause": "Wrong length \u2014 measured from wrong end",
        "corrAction": "Re-trained on measurement SOP",
        "reportedBy": "Jace",
        "ytdScrap": 42.5
    },
    {
        "date": "2026-01-21",
        "station": "Welding",
        "material": "6063-T5 Tube 2x2",
        "sku": "Cable Post FM 36",
        "qty": 2.0,
        "unit": "pcs",
        "cost": 28.0,
        "reasonCode": "WELD",
        "rootCause": "Burn-through on thin wall",
        "corrAction": "Reduced amperage on TIG",
        "reportedBy": "Jace",
        "ytdScrap": 70.5
    },
    {
        "date": "2026-01-29",
        "station": "CNC",
        "material": "6063-T5 Bar 1.5x3",
        "sku": "Glass Post FM 42",
        "qty": 1.0,
        "unit": "pcs",
        "cost": 35.0,
        "reasonCode": "CNC",
        "rootCause": "Wrong hole pattern \u2014 old program",
        "corrAction": "Updated CNC program library",
        "reportedBy": "Nick",
        "ytdScrap": 105.5
    },
    {
        "date": "2026-02-03",
        "station": "Powder Coat",
        "material": "Powder Coat (Black)",
        "sku": "Cable Post SM 36",
        "qty": 5.0,
        "unit": "pcs",
        "cost": 18.75,
        "reasonCode": "COAT",
        "rootCause": "Orange peel \u2014 DFT too high",
        "corrAction": "Calibrated spray gun",
        "reportedBy": "Michael",
        "ytdScrap": 124.25
    },
    {
        "date": "2026-02-10",
        "station": "Cutting",
        "material": "6063-T5 Tube 2x2",
        "sku": "Top Rail 8ft",
        "qty": 4.0,
        "unit": "pcs",
        "cost": 56.0,
        "reasonCode": "CUT",
        "rootCause": "Blade chatter \u2014 dull blade",
        "corrAction": "Replaced cold saw blade",
        "reportedBy": "Amber",
        "ytdScrap": 180.25
    },
    {
        "date": "2026-02-21",
        "station": "Assembly",
        "material": "Hardware Kit",
        "sku": "Cable Post SM 42",
        "qty": 2.0,
        "unit": "kits",
        "cost": 15.5,
        "reasonCode": "HAND",
        "rootCause": "Dropped off workbench",
        "corrAction": "Added bin holders",
        "reportedBy": "Amber",
        "ytdScrap": 195.75
    }
],

  // ── Maisy_03_FORGE_PRODUCTION — Safety Log (4 incidents) ──────────────────
  safetyLog: [
    {
        "date": "2026-01-09",
        "time": "10:30 AM",
        "reportedBy": "Daniel",
        "type": "Near Miss",
        "location": "Cutting",
        "description": "Aluminum tube slipped from saw clamp",
        "involved": "Amber",
        "injury": "None",
        "firstAid": "No",
        "rootCause": "Clamp not fully tightened",
        "corrAction": "Added clamp check to SOP",
        "status": "Closed"
    },
    {
        "date": "2026-01-24",
        "time": "2:15 PM",
        "reportedBy": "Jace",
        "type": "Injury",
        "location": "Welding",
        "description": "Minor burn on left forearm \u2014 sleeve rode up",
        "involved": "Jace",
        "injury": "First-degree burn, 1\" area",
        "firstAid": "Yes",
        "rootCause": "PPE not secured",
        "corrAction": "Issued welding sleeves",
        "status": "Closed"
    },
    {
        "date": "2026-02-08",
        "time": "11:00 AM",
        "reportedBy": "Nick",
        "type": "Property",
        "location": "Powder Coat",
        "description": "Powder gun hose caught on rack",
        "involved": "N/A",
        "injury": "N/A",
        "firstAid": "No",
        "rootCause": "Hose routing issue",
        "corrAction": "Rerouted with overhead hooks",
        "status": "Closed"
    },
    {
        "date": "2026-02-20",
        "time": "9:45 AM",
        "reportedBy": "Amber",
        "type": "Near Miss",
        "location": "Assembly",
        "description": "Air hose whipped on disconnect",
        "involved": "Michael",
        "injury": "None",
        "firstAid": "No",
        "rootCause": "Worn quick-connect",
        "corrAction": "Replaced all fittings + whip checks",
        "status": "Open"
    }
],

  // ── Maisy_03_FORGE_PRODUCTION — Improvement Log (5 ideas) ────────────────
  improvementLog: [
    {
        "id": "KZ-001",
        "dateSubmitted": "2026-01-14",
        "submittedBy": "Daniel",
        "area": "Welding",
        "description": "Add welding fixture for cable posts",
        "benefit": "Reduce weld time 30%",
        "estSavings": 8500.0,
        "implCost": 1200.0,
        "priority": 1.0,
        "status": "Complete",
        "dateCompleted": "2026-02-08",
        "actualSavings": 7200.0,
        "paybackMonths": 1.69
    },
    {
        "id": "KZ-002",
        "dateSubmitted": "2026-01-21",
        "submittedBy": "Jace",
        "area": "Cutting",
        "description": "Install auto-stop on cold saw",
        "benefit": "Eliminate measuring errors",
        "estSavings": 12000.0,
        "implCost": 3500.0,
        "priority": 2.0,
        "status": "In Progress",
        "dateCompleted": "",
        "actualSavings": 0.0,
        "paybackMonths": 3.5
    },
    {
        "id": "KZ-003",
        "dateSubmitted": "2026-01-29",
        "submittedBy": "Nick",
        "area": "CNC",
        "description": "Build multi-part fixture \u2014 4 posts/cycle",
        "benefit": "Double CNC throughput",
        "estSavings": 18000.0,
        "implCost": 2800.0,
        "priority": 1.0,
        "status": "In Progress",
        "dateCompleted": "",
        "actualSavings": 0.0,
        "paybackMonths": 1.87
    },
    {
        "id": "KZ-004",
        "dateSubmitted": "2026-02-08",
        "submittedBy": "Amber",
        "area": "Packaging",
        "description": "Standardize box sizes \u2014 reduce waste",
        "benefit": "Save ~$200/mo materials",
        "estSavings": 2400.0,
        "implCost": 500.0,
        "priority": 3.0,
        "status": "Planning",
        "dateCompleted": "",
        "actualSavings": 0.0,
        "paybackMonths": 2.5
    },
    {
        "id": "KZ-005",
        "dateSubmitted": "2026-02-18",
        "submittedBy": "Daniel",
        "area": "Powder Coat",
        "description": "Batch colors \u2014 reduce changeover",
        "benefit": "Save 45 min per change",
        "estSavings": 6000.0,
        "implCost": 0.0,
        "priority": 2.0,
        "status": "Planning",
        "dateCompleted": "",
        "actualSavings": 0.0,
        "paybackMonths": 0.0
    }
],

  // ── Maisy_05_MERIDIAN_FINANCE — Labor Processes (26 processes) ────────────
  laborProcesses: [
    {
        "id": "P-01",
        "dept": "Admin",
        "process": "Order Entry & Acknowledgment",
        "hourlyRate": 40.0,
        "stdTime": 0.25,
        "unitBasis": "Per Order",
        "notes": "Review order sheet, create work order, confirm specs",
        "fullyLoaded": 46.0,
        "costPerUnit": 11.5
    },
    {
        "id": "P-02",
        "dept": "Admin",
        "process": "Material Scheduling & Procurement",
        "hourlyRate": 40.0,
        "stdTime": 0.5,
        "unitBasis": "Per Order",
        "notes": "Check inventory, place POs if needed, schedule production",
        "fullyLoaded": 46.0,
        "costPerUnit": 23.0
    },
    {
        "id": "P-03",
        "dept": "Warehouse",
        "process": "Material Receiving & Inspection",
        "hourlyRate": 40.0,
        "stdTime": 0.5,
        "unitBasis": "Per Order",
        "notes": "Inspect inbound materials against PO, update inventory",
        "fullyLoaded": 46.0,
        "costPerUnit": 23.0
    },
    {
        "id": "P-04",
        "dept": "Warehouse",
        "process": "Kit Pulling & Staging",
        "hourlyRate": 40.0,
        "stdTime": 0.75,
        "unitBasis": "Per Order",
        "notes": "Pull all materials per BOM, stage at production cell",
        "fullyLoaded": 46.0,
        "costPerUnit": 34.5
    },
    {
        "id": "P-05",
        "dept": "Fabrication",
        "process": "CNC Setup & Fixturing",
        "hourlyRate": 40.0,
        "stdTime": 0.5,
        "unitBasis": "Per Setup",
        "notes": "Load program, set fixtures, run test piece",
        "fullyLoaded": 46.0,
        "costPerUnit": 23.0
    },
    {
        "id": "P-06",
        "dept": "Fabrication",
        "process": "CNC Cutting / Machining (Posts)",
        "hourlyRate": 40.0,
        "stdTime": 0.08,
        "unitBasis": "Per Post",
        "notes": "Machine posts to length, drill holes, add features",
        "fullyLoaded": 46.0,
        "costPerUnit": 3.68
    },
    {
        "id": "P-07",
        "dept": "Fabrication",
        "process": "CNC Cutting / Machining (Rails)",
        "hourlyRate": 40.0,
        "stdTime": 0.05,
        "unitBasis": "Per Linear Foot",
        "notes": "Cut rail lengths, machine end profiles",
        "fullyLoaded": 46.0,
        "costPerUnit": 2.3
    },
    {
        "id": "P-08",
        "dept": "Fabrication",
        "process": "Manual Cutting / Deburring",
        "hourlyRate": 40.0,
        "stdTime": 0.03,
        "unitBasis": "Per Linear Foot",
        "notes": "Trim ends, remove burrs, clean edges",
        "fullyLoaded": 46.0,
        "costPerUnit": 1.38
    },
    {
        "id": "P-09",
        "dept": "Fabrication",
        "process": "Punching / Drilling",
        "hourlyRate": 40.0,
        "stdTime": 0.03,
        "unitBasis": "Per Post",
        "notes": "Drill cable holes, punch mounting holes",
        "fullyLoaded": 46.0,
        "costPerUnit": 1.38
    },
    {
        "id": "P-10",
        "dept": "Welding",
        "process": "Welding Setup & Fixture",
        "hourlyRate": 45.0,
        "stdTime": 0.33,
        "unitBasis": "Per Order",
        "notes": "Set up welding fixtures, check drawings",
        "fullyLoaded": 51.75,
        "costPerUnit": 17.08
    },
    {
        "id": "P-11",
        "dept": "Welding",
        "process": "MIG / TIG Welding (Posts)",
        "hourlyRate": 45.0,
        "stdTime": 0.1,
        "unitBasis": "Per Post",
        "notes": "Weld base plates, brackets, and features",
        "fullyLoaded": 51.75,
        "costPerUnit": 5.17
    },
    {
        "id": "P-12",
        "dept": "Welding",
        "process": "Welding (Rails & Components)",
        "hourlyRate": 45.0,
        "stdTime": 0.05,
        "unitBasis": "Per Linear Foot",
        "notes": "Weld rail connections, end caps",
        "fullyLoaded": 51.75,
        "costPerUnit": 2.59
    },
    {
        "id": "P-13",
        "dept": "Welding",
        "process": "Grinding & Weld Finishing",
        "hourlyRate": 45.0,
        "stdTime": 0.05,
        "unitBasis": "Per Post",
        "notes": "Grind welds smooth, prep for coating",
        "fullyLoaded": 51.75,
        "costPerUnit": 2.59
    },
    {
        "id": "P-14",
        "dept": "Powder Coat",
        "process": "Chemical Pre-Treatment / Wash",
        "hourlyRate": 40.0,
        "stdTime": 0.03,
        "unitBasis": "Per Linear Foot",
        "notes": "Clean, degrease, iron phosphate wash",
        "fullyLoaded": 46.0,
        "costPerUnit": 1.38
    },
    {
        "id": "P-15",
        "dept": "Powder Coat",
        "process": "Masking",
        "hourlyRate": 40.0,
        "stdTime": 0.02,
        "unitBasis": "Per Post",
        "notes": "Mask threads, holes, and surfaces not to be coated",
        "fullyLoaded": 46.0,
        "costPerUnit": 0.92
    },
    {
        "id": "P-16",
        "dept": "Powder Coat",
        "process": "Powder Application",
        "hourlyRate": 40.0,
        "stdTime": 0.02,
        "unitBasis": "Per Linear Foot",
        "notes": "Electrostatic powder application",
        "fullyLoaded": 46.0,
        "costPerUnit": 0.92
    },
    {
        "id": "P-17",
        "dept": "Powder Coat",
        "process": "Oven Cure",
        "hourlyRate": 40.0,
        "stdTime": 0.17,
        "unitBasis": "Per Batch",
        "notes": "Cure at 400\u00b0F for 10 minutes minimum (batch based on oven capacity)",
        "fullyLoaded": 46.0,
        "costPerUnit": 7.82
    },
    {
        "id": "P-18",
        "dept": "Powder Coat",
        "process": "QC Inspection - Powder Coat",
        "hourlyRate": 40.0,
        "stdTime": 0.02,
        "unitBasis": "Per Post",
        "notes": "Inspect coverage, thickness, color match",
        "fullyLoaded": 46.0,
        "costPerUnit": 0.92
    },
    {
        "id": "P-19",
        "dept": "Assembly",
        "process": "Hardware Assembly & Kitting",
        "hourlyRate": 40.0,
        "stdTime": 0.1,
        "unitBasis": "Per Order",
        "notes": "Bag & label hardware per section",
        "fullyLoaded": 46.0,
        "costPerUnit": 4.6
    },
    {
        "id": "P-20",
        "dept": "Assembly",
        "process": "Cable Assembly (per run)",
        "hourlyRate": 40.0,
        "stdTime": 0.25,
        "unitBasis": "Per Run",
        "notes": "Route cable, crimp swages, tension cable",
        "fullyLoaded": 46.0,
        "costPerUnit": 11.5
    },
    {
        "id": "P-21",
        "dept": "Assembly",
        "process": "Glass Install & Alignment",
        "hourlyRate": 40.0,
        "stdTime": 0.5,
        "unitBasis": "Per Pane",
        "notes": "Install glass, set level and plumb, torque clamps",
        "fullyLoaded": 46.0,
        "costPerUnit": 23.0
    },
    {
        "id": "P-22",
        "dept": "Assembly",
        "process": "Post Alignment & Final Fit",
        "hourlyRate": 40.0,
        "stdTime": 0.15,
        "unitBasis": "Per Post",
        "notes": "Final alignment check, adjust as needed",
        "fullyLoaded": 46.0,
        "costPerUnit": 6.9
    },
    {
        "id": "P-23",
        "dept": "Quality",
        "process": "Final QC Inspection",
        "hourlyRate": 40.0,
        "stdTime": 0.25,
        "unitBasis": "Per Order",
        "notes": "Full inspection per quality checklist",
        "fullyLoaded": 46.0,
        "costPerUnit": 11.5
    },
    {
        "id": "P-24",
        "dept": "Quality",
        "process": "Measurement Verification",
        "hourlyRate": 40.0,
        "stdTime": 0.1,
        "unitBasis": "Per Run",
        "notes": "Verify all dimensions match order sheet",
        "fullyLoaded": 46.0,
        "costPerUnit": 4.6
    },
    {
        "id": "P-25",
        "dept": "Shipping",
        "process": "Packaging & Crating",
        "hourlyRate": 40.0,
        "stdTime": 0.25,
        "unitBasis": "Per Order",
        "notes": "Package all components, protect with foam/cardboard",
        "fullyLoaded": 46.0,
        "costPerUnit": 11.5
    },
    {
        "id": "P-26",
        "dept": "Shipping",
        "process": "Load & Ship / Delivery Prep",
        "hourlyRate": 40.0,
        "stdTime": 0.25,
        "unitBasis": "Per Order",
        "notes": "Load truck, complete BOL, coordinate delivery",
        "fullyLoaded": 46.0,
        "costPerUnit": 11.5
    }
],

  // ── Maisy_07_NEXUS_PEOPLE — Employees (5 real employees) ──────────────────
  employees: [
    {
        "id": "EMP-001",
        "name": "Daniel Jones",
        "role": "Director of Operations",
        "dept": "Management",
        "hire": "2026-02-09",
        "status": "Active",
        "rateHr": 58,
        "email": "daniel@maisyrailing.com",
        "phone": "208-603-8149"
    },
    {
        "id": "EMP-002",
        "name": "Amber",
        "role": "Assembly / Prep",
        "dept": "Production",
        "hire": "2025-01-01",
        "status": "Active",
        "rateHr": 40,
        "email": "",
        "phone": ""
    },
    {
        "id": "EMP-003",
        "name": "Jace",
        "role": "Welder / Fabricator",
        "dept": "Production",
        "hire": "2025-01-01",
        "status": "Active",
        "rateHr": 35,
        "email": "",
        "phone": ""
    },
    {
        "id": "EMP-004",
        "name": "Nick",
        "role": "CNC Operator",
        "dept": "Production",
        "hire": "2025-01-01",
        "status": "Active",
        "rateHr": 40,
        "email": "",
        "phone": ""
    },
    {
        "id": "EMP-005",
        "name": "Michael",
        "role": "Powder Coat Technician",
        "dept": "Production",
        "hire": "2025-01-01",
        "status": "Active",
        "rateHr": 40,
        "email": "",
        "phone": ""
    }
],

  // ── Maisy_07_NEXUS_PEOPLE — Training Matrix (real data) ───────────────────
  trainingMatrix: [
    {
        "empId": "EMP-002",
        "empName": "Amber",
        "skill": "EQUIPMENT OPERATION",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-003",
        "empName": "Jace",
        "skill": "EQUIPMENT OPERATION",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-004",
        "empName": "Nick",
        "skill": "EQUIPMENT OPERATION",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-005",
        "empName": "Michael",
        "skill": "EQUIPMENT OPERATION",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-002",
        "empName": "Amber",
        "skill": "Cold Saw Operation",
        "level": 3,
        "raw": "\u2713"
    },
    {
        "empId": "EMP-003",
        "empName": "Jace",
        "skill": "Cold Saw Operation",
        "level": 2,
        "raw": "IP"
    },
    {
        "empId": "EMP-004",
        "empName": "Nick",
        "skill": "Cold Saw Operation",
        "level": 3,
        "raw": "\u2713"
    },
    {
        "empId": "EMP-005",
        "empName": "Michael",
        "skill": "Cold Saw Operation",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-002",
        "empName": "Amber",
        "skill": "Band Saw Operation",
        "level": 3,
        "raw": "\u2713"
    },
    {
        "empId": "EMP-003",
        "empName": "Jace",
        "skill": "Band Saw Operation",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-004",
        "empName": "Nick",
        "skill": "Band Saw Operation",
        "level": 3,
        "raw": "\u2713"
    },
    {
        "empId": "EMP-005",
        "empName": "Michael",
        "skill": "Band Saw Operation",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-002",
        "empName": "Amber",
        "skill": "Laguna Swift CNC",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-003",
        "empName": "Jace",
        "skill": "Laguna Swift CNC",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-004",
        "empName": "Nick",
        "skill": "Laguna Swift CNC",
        "level": 3,
        "raw": "\u2713"
    },
    {
        "empId": "EMP-005",
        "empName": "Michael",
        "skill": "Laguna Swift CNC",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-002",
        "empName": "Amber",
        "skill": "CNC Program Loading",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-003",
        "empName": "Jace",
        "skill": "CNC Program Loading",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-004",
        "empName": "Nick",
        "skill": "CNC Program Loading",
        "level": 3,
        "raw": "\u2713"
    },
    {
        "empId": "EMP-005",
        "empName": "Michael",
        "skill": "CNC Program Loading",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-002",
        "empName": "Amber",
        "skill": "TIG Welder Operation",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-003",
        "empName": "Jace",
        "skill": "TIG Welder Operation",
        "level": 3,
        "raw": "\u2713"
    },
    {
        "empId": "EMP-004",
        "empName": "Nick",
        "skill": "TIG Welder Operation",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-005",
        "empName": "Michael",
        "skill": "TIG Welder Operation",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-002",
        "empName": "Amber",
        "skill": "Powder Coat Gun",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-003",
        "empName": "Jace",
        "skill": "Powder Coat Gun",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-004",
        "empName": "Nick",
        "skill": "Powder Coat Gun",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-005",
        "empName": "Michael",
        "skill": "Powder Coat Gun",
        "level": 3,
        "raw": "\u2713"
    },
    {
        "empId": "EMP-002",
        "empName": "Amber",
        "skill": "Powder Coat Oven",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-003",
        "empName": "Jace",
        "skill": "Powder Coat Oven",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-004",
        "empName": "Nick",
        "skill": "Powder Coat Oven",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-005",
        "empName": "Michael",
        "skill": "Powder Coat Oven",
        "level": 3,
        "raw": "\u2713"
    },
    {
        "empId": "EMP-002",
        "empName": "Amber",
        "skill": "Overhead Crane",
        "level": 2,
        "raw": "IP"
    },
    {
        "empId": "EMP-003",
        "empName": "Jace",
        "skill": "Overhead Crane",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-004",
        "empName": "Nick",
        "skill": "Overhead Crane",
        "level": 2,
        "raw": "IP"
    },
    {
        "empId": "EMP-005",
        "empName": "Michael",
        "skill": "Overhead Crane",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-002",
        "empName": "Amber",
        "skill": "Completion %",
        "level": 0,
        "raw": "0.25"
    },
    {
        "empId": "EMP-003",
        "empName": "Jace",
        "skill": "Completion %",
        "level": 0,
        "raw": "0.125"
    },
    {
        "empId": "EMP-004",
        "empName": "Nick",
        "skill": "Completion %",
        "level": 0,
        "raw": "0.5"
    },
    {
        "empId": "EMP-005",
        "empName": "Michael",
        "skill": "Completion %",
        "level": 0,
        "raw": "0.25"
    },
    {
        "empId": "EMP-002",
        "empName": "Amber",
        "skill": "PRODUCTION SKILLS",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-003",
        "empName": "Jace",
        "skill": "PRODUCTION SKILLS",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-004",
        "empName": "Nick",
        "skill": "PRODUCTION SKILLS",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-005",
        "empName": "Michael",
        "skill": "PRODUCTION SKILLS",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-002",
        "empName": "Amber",
        "skill": "Blueprint / Drawing Reading",
        "level": 3,
        "raw": "\u2713"
    },
    {
        "empId": "EMP-003",
        "empName": "Jace",
        "skill": "Blueprint / Drawing Reading",
        "level": 3,
        "raw": "\u2713"
    },
    {
        "empId": "EMP-004",
        "empName": "Nick",
        "skill": "Blueprint / Drawing Reading",
        "level": 3,
        "raw": "\u2713"
    },
    {
        "empId": "EMP-005",
        "empName": "Michael",
        "skill": "Blueprint / Drawing Reading",
        "level": 2,
        "raw": "IP"
    },
    {
        "empId": "EMP-002",
        "empName": "Amber",
        "skill": "Quality Inspection / Calipers",
        "level": 3,
        "raw": "\u2713"
    },
    {
        "empId": "EMP-003",
        "empName": "Jace",
        "skill": "Quality Inspection / Calipers",
        "level": 3,
        "raw": "\u2713"
    },
    {
        "empId": "EMP-004",
        "empName": "Nick",
        "skill": "Quality Inspection / Calipers",
        "level": 3,
        "raw": "\u2713"
    },
    {
        "empId": "EMP-005",
        "empName": "Michael",
        "skill": "Quality Inspection / Calipers",
        "level": 3,
        "raw": "\u2713"
    },
    {
        "empId": "EMP-002",
        "empName": "Amber",
        "skill": "Material Identification",
        "level": 2,
        "raw": "IP"
    },
    {
        "empId": "EMP-003",
        "empName": "Jace",
        "skill": "Material Identification",
        "level": 3,
        "raw": "\u2713"
    },
    {
        "empId": "EMP-004",
        "empName": "Nick",
        "skill": "Material Identification",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-005",
        "empName": "Michael",
        "skill": "Material Identification",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-002",
        "empName": "Amber",
        "skill": "Weld Fit-Up & Tack",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-003",
        "empName": "Jace",
        "skill": "Weld Fit-Up & Tack",
        "level": 3,
        "raw": "\u2713"
    },
    {
        "empId": "EMP-004",
        "empName": "Nick",
        "skill": "Weld Fit-Up & Tack",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-005",
        "empName": "Michael",
        "skill": "Weld Fit-Up & Tack",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-002",
        "empName": "Amber",
        "skill": "Full TIG Welding (Aluminum)",
        "level": 2,
        "raw": "IP"
    },
    {
        "empId": "EMP-003",
        "empName": "Jace",
        "skill": "Full TIG Welding (Aluminum)",
        "level": 3,
        "raw": "\u2713"
    },
    {
        "empId": "EMP-004",
        "empName": "Nick",
        "skill": "Full TIG Welding (Aluminum)",
        "level": 2,
        "raw": "IP"
    },
    {
        "empId": "EMP-005",
        "empName": "Michael",
        "skill": "Full TIG Welding (Aluminum)",
        "level": 2,
        "raw": "IP"
    },
    {
        "empId": "EMP-002",
        "empName": "Amber",
        "skill": "Grinding & Finishing",
        "level": 3,
        "raw": "\u2713"
    },
    {
        "empId": "EMP-003",
        "empName": "Jace",
        "skill": "Grinding & Finishing",
        "level": 2,
        "raw": "IP"
    },
    {
        "empId": "EMP-004",
        "empName": "Nick",
        "skill": "Grinding & Finishing",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-005",
        "empName": "Michael",
        "skill": "Grinding & Finishing",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-002",
        "empName": "Amber",
        "skill": "Assembly (Cable Posts)",
        "level": 3,
        "raw": "\u2713"
    },
    {
        "empId": "EMP-003",
        "empName": "Jace",
        "skill": "Assembly (Cable Posts)",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-004",
        "empName": "Nick",
        "skill": "Assembly (Cable Posts)",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-005",
        "empName": "Michael",
        "skill": "Assembly (Cable Posts)",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-002",
        "empName": "Amber",
        "skill": "Assembly (Glass Posts)",
        "level": 2,
        "raw": "IP"
    },
    {
        "empId": "EMP-003",
        "empName": "Jace",
        "skill": "Assembly (Glass Posts)",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-004",
        "empName": "Nick",
        "skill": "Assembly (Glass Posts)",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-005",
        "empName": "Michael",
        "skill": "Assembly (Glass Posts)",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-002",
        "empName": "Amber",
        "skill": "Assembly (Gate Kits)",
        "level": 3,
        "raw": "\u2713"
    },
    {
        "empId": "EMP-003",
        "empName": "Jace",
        "skill": "Assembly (Gate Kits)",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-004",
        "empName": "Nick",
        "skill": "Assembly (Gate Kits)",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-005",
        "empName": "Michael",
        "skill": "Assembly (Gate Kits)",
        "level": 3,
        "raw": "\u2713"
    },
    {
        "empId": "EMP-002",
        "empName": "Amber",
        "skill": "Packaging & Crating",
        "level": 3,
        "raw": "\u2713"
    },
    {
        "empId": "EMP-003",
        "empName": "Jace",
        "skill": "Packaging & Crating",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-004",
        "empName": "Nick",
        "skill": "Packaging & Crating",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-005",
        "empName": "Michael",
        "skill": "Packaging & Crating",
        "level": 2,
        "raw": "IP"
    },
    {
        "empId": "EMP-002",
        "empName": "Amber",
        "skill": "Completion %",
        "level": 0,
        "raw": "0.6"
    },
    {
        "empId": "EMP-003",
        "empName": "Jace",
        "skill": "Completion %",
        "level": 0,
        "raw": "0.5"
    },
    {
        "empId": "EMP-004",
        "empName": "Nick",
        "skill": "Completion %",
        "level": 0,
        "raw": "0.2"
    },
    {
        "empId": "EMP-005",
        "empName": "Michael",
        "skill": "Completion %",
        "level": 0,
        "raw": "0.2"
    },
    {
        "empId": "EMP-002",
        "empName": "Amber",
        "skill": "SAFETY & COMPLIANCE",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-003",
        "empName": "Jace",
        "skill": "SAFETY & COMPLIANCE",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-004",
        "empName": "Nick",
        "skill": "SAFETY & COMPLIANCE",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-005",
        "empName": "Michael",
        "skill": "SAFETY & COMPLIANCE",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-002",
        "empName": "Amber",
        "skill": "PPE Requirements",
        "level": 3,
        "raw": "\u2713"
    },
    {
        "empId": "EMP-003",
        "empName": "Jace",
        "skill": "PPE Requirements",
        "level": 2,
        "raw": "IP"
    },
    {
        "empId": "EMP-004",
        "empName": "Nick",
        "skill": "PPE Requirements",
        "level": 3,
        "raw": "\u2713"
    },
    {
        "empId": "EMP-005",
        "empName": "Michael",
        "skill": "PPE Requirements",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-002",
        "empName": "Amber",
        "skill": "Fire Extinguisher Location & Use",
        "level": 3,
        "raw": "\u2713"
    },
    {
        "empId": "EMP-003",
        "empName": "Jace",
        "skill": "Fire Extinguisher Location & Use",
        "level": 3,
        "raw": "\u2713"
    },
    {
        "empId": "EMP-004",
        "empName": "Nick",
        "skill": "Fire Extinguisher Location & Use",
        "level": 3,
        "raw": "\u2713"
    },
    {
        "empId": "EMP-005",
        "empName": "Michael",
        "skill": "Fire Extinguisher Location & Use",
        "level": 3,
        "raw": "\u2713"
    },
    {
        "empId": "EMP-002",
        "empName": "Amber",
        "skill": "Lockout/Tagout (LOTO)",
        "level": 2,
        "raw": "IP"
    },
    {
        "empId": "EMP-003",
        "empName": "Jace",
        "skill": "Lockout/Tagout (LOTO)",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-004",
        "empName": "Nick",
        "skill": "Lockout/Tagout (LOTO)",
        "level": 2,
        "raw": "IP"
    },
    {
        "empId": "EMP-005",
        "empName": "Michael",
        "skill": "Lockout/Tagout (LOTO)",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-002",
        "empName": "Amber",
        "skill": "Hazard Communication (HazCom)",
        "level": 0,
        "raw": "EXP"
    },
    {
        "empId": "EMP-003",
        "empName": "Jace",
        "skill": "Hazard Communication (HazCom)",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-004",
        "empName": "Nick",
        "skill": "Hazard Communication (HazCom)",
        "level": 3,
        "raw": "\u2713"
    },
    {
        "empId": "EMP-005",
        "empName": "Michael",
        "skill": "Hazard Communication (HazCom)",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-002",
        "empName": "Amber",
        "skill": "Forklift / Crane Safety",
        "level": 3,
        "raw": "\u2713"
    },
    {
        "empId": "EMP-003",
        "empName": "Jace",
        "skill": "Forklift / Crane Safety",
        "level": 3,
        "raw": "\u2713"
    },
    {
        "empId": "EMP-004",
        "empName": "Nick",
        "skill": "Forklift / Crane Safety",
        "level": 3,
        "raw": "\u2713"
    },
    {
        "empId": "EMP-005",
        "empName": "Michael",
        "skill": "Forklift / Crane Safety",
        "level": 3,
        "raw": "\u2713"
    },
    {
        "empId": "EMP-002",
        "empName": "Amber",
        "skill": "Completion %",
        "level": 0,
        "raw": "0.666666666666667"
    },
    {
        "empId": "EMP-003",
        "empName": "Jace",
        "skill": "Completion %",
        "level": 0,
        "raw": "0.5"
    },
    {
        "empId": "EMP-004",
        "empName": "Nick",
        "skill": "Completion %",
        "level": 0,
        "raw": "0.833333333333333"
    },
    {
        "empId": "EMP-005",
        "empName": "Michael",
        "skill": "Completion %",
        "level": 0,
        "raw": "0.5"
    },
    {
        "empId": "EMP-002",
        "empName": "Amber",
        "skill": "Emergency Evacuation Routes",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-003",
        "empName": "Jace",
        "skill": "Emergency Evacuation Routes",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-004",
        "empName": "Nick",
        "skill": "Emergency Evacuation Routes",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-005",
        "empName": "Michael",
        "skill": "Emergency Evacuation Routes",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-002",
        "empName": "Amber",
        "skill": "STATUS KEY",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-003",
        "empName": "Jace",
        "skill": "STATUS KEY",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-004",
        "empName": "Nick",
        "skill": "STATUS KEY",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-005",
        "empName": "Michael",
        "skill": "STATUS KEY",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-002",
        "empName": "Amber",
        "skill": "\u2713",
        "level": 0,
        "raw": "Fully Trained & Certified"
    },
    {
        "empId": "EMP-003",
        "empName": "Jace",
        "skill": "\u2713",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-004",
        "empName": "Nick",
        "skill": "\u2713",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-005",
        "empName": "Michael",
        "skill": "\u2713",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-002",
        "empName": "Amber",
        "skill": "IP",
        "level": 0,
        "raw": "In Progress / Training"
    },
    {
        "empId": "EMP-003",
        "empName": "Jace",
        "skill": "IP",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-004",
        "empName": "Nick",
        "skill": "IP",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-005",
        "empName": "Michael",
        "skill": "IP",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-002",
        "empName": "Amber",
        "skill": "\u2014",
        "level": 0,
        "raw": "Not Started"
    },
    {
        "empId": "EMP-003",
        "empName": "Jace",
        "skill": "\u2014",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-004",
        "empName": "Nick",
        "skill": "\u2014",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-005",
        "empName": "Michael",
        "skill": "\u2014",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-002",
        "empName": "Amber",
        "skill": "N/A",
        "level": 0,
        "raw": "Not Applicable to Role"
    },
    {
        "empId": "EMP-003",
        "empName": "Jace",
        "skill": "N/A",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-004",
        "empName": "Nick",
        "skill": "N/A",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-005",
        "empName": "Michael",
        "skill": "N/A",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-002",
        "empName": "Amber",
        "skill": "EXP",
        "level": 0,
        "raw": "Certification Expired \u2014 Needs Renewal"
    },
    {
        "empId": "EMP-003",
        "empName": "Jace",
        "skill": "EXP",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-004",
        "empName": "Nick",
        "skill": "EXP",
        "level": 0,
        "raw": "\u2014"
    },
    {
        "empId": "EMP-005",
        "empName": "Michael",
        "skill": "EXP",
        "level": 0,
        "raw": "\u2014"
    }
],

  // ── Maisy_07_NEXUS_PEOPLE — Automation Stations (8 stations) ─────────────
  automationStations: [
    {
        "station": "Cutting",
        "currentProcess": "Manual cold saw",
        "targetAutomation": "Auto-feed CNC saw",
        "laborReduction": "50%",
        "throughputIncrease": "2x",
        "phase": "1",
        "priority": "1",
        "notes": ""
    },
    {
        "station": "CNC",
        "currentProcess": "Laguna Swift",
        "targetAutomation": "Multi-fixture + auto-load",
        "laborReduction": "40%",
        "throughputIncrease": "2x",
        "phase": "1",
        "priority": "2",
        "notes": "Fusion CAM"
    },
    {
        "station": "Welding",
        "currentProcess": "Manual TIG (2)",
        "targetAutomation": "Robotic TIG weld cell",
        "laborReduction": "60-75%",
        "throughputIncrease": "3x",
        "phase": "2",
        "priority": "1",
        "notes": "Biggest ROI"
    },
    {
        "station": "Grinding",
        "currentProcess": "Manual grinder",
        "targetAutomation": "Robotic grinding cell",
        "laborReduction": "50%",
        "throughputIncrease": "2x",
        "phase": "2",
        "priority": "3",
        "notes": ""
    },
    {
        "station": "Powder Coat",
        "currentProcess": "Manual gun + oven",
        "targetAutomation": "Auto gun + conveyor",
        "laborReduction": "40%",
        "throughputIncrease": "2x",
        "phase": "3",
        "priority": "2",
        "notes": "Bottleneck #2"
    },
    {
        "station": "Assembly",
        "currentProcess": "Manual",
        "targetAutomation": "Semi-auto fixtures",
        "laborReduction": "30%",
        "throughputIncrease": "1.5x",
        "phase": "3",
        "priority": "4",
        "notes": ""
    },
    {
        "station": "QC",
        "currentProcess": "Calipers + visual",
        "targetAutomation": "Vision system",
        "laborReduction": "50%",
        "throughputIncrease": "3x",
        "phase": "2",
        "priority": "3",
        "notes": ""
    },
    {
        "station": "Packaging",
        "currentProcess": "Manual wrap",
        "targetAutomation": "Semi-auto stretch wrap",
        "laborReduction": "20%",
        "throughputIncrease": "1.5x",
        "phase": "3",
        "priority": "5",
        "notes": ""
    }
],

  // ── Maisy_07_NEXUS_PEOPLE — Automation Phases Roadmap ────────────────────
  automationPhasesRoadmap: [
    {
        "phase": "Phase",
        "timeline": "Timeline",
        "focus": "Focus",
        "equipment": "Milestones",
        "estCost": "Budget",
        "laborReduction": "Labor Savings",
        "throughput": "Capacity",
        "status": "Status"
    },
    {
        "phase": "Phase 1",
        "timeline": "Q1-Q2 2026",
        "focus": "CNC + Cutting",
        "equipment": "Fusion CAM, auto-feed saw, multi-fixture",
        "estCost": "$25-50K",
        "laborReduction": "20-30%",
        "throughput": "1.5-2x",
        "status": "PLANNING"
    },
    {
        "phase": "Phase 2",
        "timeline": "Q3-Q4 2026",
        "focus": "Welding + QC",
        "equipment": "Robotic weld cell, vision QC",
        "estCost": "$75-150K",
        "laborReduction": "40-50%",
        "throughput": "2-3x",
        "status": "RESEARCH"
    },
    {
        "phase": "Phase 3",
        "timeline": "2027",
        "focus": "Powder + Assembly",
        "equipment": "Conveyor powder line, semi-auto fixtures",
        "estCost": "$50-100K",
        "laborReduction": "55-65%",
        "throughput": "2-3x",
        "status": "FUTURE"
    },
    {
        "phase": "Phase 4",
        "timeline": "2027+",
        "focus": "Full Integration",
        "equipment": "Connected systems, auto-scheduling",
        "estCost": "$25-50K",
        "laborReduction": "60-75%",
        "throughput": "3x+",
        "status": "FUTURE"
    }
],

  // ── Maisy_07_NEXUS_PEOPLE — Job History (10 orders) ──────────────────────
  jobHistory: [
    {
        "id": "MR-2026-0101",
        "customer": "Riverside Homes",
        "project": "Deck Railing",
        "productType": "Cable Post SM 42",
        "mount": "Surface",
        "qty": 18.0,
        "orderTotal": 4250.0,
        "materialCost": 1680.0,
        "laborCost": 850.0,
        "grossMarginPct": 40.0,
        "dateReceived": "2025-12-15",
        "dateShipped": "2025-12-30",
        "leadTimeDays": 15.0,
        "grossProfit": 1720.0
    },
    {
        "id": "MR-2026-0105",
        "customer": "Alpine Builders",
        "project": "Stair Rail",
        "productType": "Cable Post FM 36",
        "mount": "Fascia",
        "qty": 12.0,
        "orderTotal": 3180.0,
        "materialCost": 1200.0,
        "laborCost": 620.0,
        "grossMarginPct": 43.0,
        "dateReceived": "2025-12-20",
        "dateShipped": "2026-01-04",
        "leadTimeDays": 15.0,
        "grossProfit": 1360.0
    },
    {
        "id": "MR-2026-0112",
        "customer": "Clearwater Design",
        "project": "Balcony",
        "productType": "Glass Post FM 42",
        "mount": "Fascia",
        "qty": 8.0,
        "orderTotal": 5600.0,
        "materialCost": 2400.0,
        "laborCost": 1100.0,
        "grossMarginPct": 38.0,
        "dateReceived": "2025-12-28",
        "dateShipped": "2026-01-11",
        "leadTimeDays": 14.0,
        "grossProfit": 2100.0
    },
    {
        "id": "MR-2026-0118",
        "customer": "Home Depot \u2014 #3847",
        "project": "Stock Order",
        "productType": "Cable Post SM 36",
        "mount": "Surface",
        "qty": 48.0,
        "orderTotal": 8900.0,
        "materialCost": 3800.0,
        "laborCost": 1600.0,
        "grossMarginPct": 39.0,
        "dateReceived": "2026-01-01",
        "dateShipped": "2026-01-17",
        "leadTimeDays": 16.0,
        "grossProfit": 3500.0
    },
    {
        "id": "MR-2026-0122",
        "customer": "Mountain View LLC",
        "project": "Pool Fence",
        "productType": "Glass Post SM 42",
        "mount": "Surface",
        "qty": 24.0,
        "orderTotal": 9200.0,
        "materialCost": 4100.0,
        "laborCost": 1800.0,
        "grossMarginPct": 36.0,
        "dateReceived": "2026-01-09",
        "dateShipped": "2026-01-21",
        "leadTimeDays": 12.0,
        "grossProfit": 3300.0
    },
    {
        "id": "MR-2026-0127",
        "customer": "Pinehurst Residence",
        "project": "Front Porch",
        "productType": "Handrail 8ft",
        "mount": "N/A",
        "qty": 6.0,
        "orderTotal": 1450.0,
        "materialCost": 580.0,
        "laborCost": 290.0,
        "grossMarginPct": 40.0,
        "dateReceived": "2026-01-14",
        "dateShipped": "2026-01-24",
        "leadTimeDays": 10.0,
        "grossProfit": 580.0
    },
    {
        "id": "MR-2026-0130",
        "customer": "Northwest Fabrication",
        "project": "Sister Co.",
        "productType": "Custom Post",
        "mount": "Surface",
        "qty": 32.0,
        "orderTotal": 6400.0,
        "materialCost": 2900.0,
        "laborCost": 1400.0,
        "grossMarginPct": 33.0,
        "dateReceived": "2026-01-19",
        "dateShipped": "2026-01-31",
        "leadTimeDays": 12.0,
        "grossProfit": 2100.0
    },
    {
        "id": "MR-2026-0135",
        "customer": "Sunset Terrace Dev",
        "project": "Rooftop Deck",
        "productType": "Cable Post SM 42",
        "mount": "Surface",
        "qty": 40.0,
        "orderTotal": 9800.0,
        "materialCost": 4200.0,
        "laborCost": 1900.0,
        "grossMarginPct": 38.0,
        "dateReceived": "2026-01-24",
        "dateShipped": "2026-02-06",
        "leadTimeDays": 13.0,
        "grossProfit": 3700.0
    },
    {
        "id": "MR-2026-0139",
        "customer": "Baker Construction",
        "project": "ADA Handrail",
        "productType": "Handrail 8ft",
        "mount": "N/A",
        "qty": 10.0,
        "orderTotal": 2400.0,
        "materialCost": 960.0,
        "laborCost": 480.0,
        "grossMarginPct": 40.0,
        "dateReceived": "2026-01-31",
        "dateShipped": "2026-02-10",
        "leadTimeDays": 10.0,
        "grossProfit": 960.0
    },
    {
        "id": "MR-2026-0143",
        "customer": "Lakeshore Estates",
        "project": "Entry Gate",
        "productType": "Gate Kit 42",
        "mount": "N/A",
        "qty": 4.0,
        "orderTotal": 2200.0,
        "materialCost": 880.0,
        "laborCost": 440.0,
        "grossMarginPct": 40.0,
        "dateReceived": "2026-02-08",
        "dateShipped": "2026-02-16",
        "leadTimeDays": 8.0,
        "grossProfit": 880.0
    }
],

  // ── Retained from v4.0 — Sales Orders & Customers (placeholder until CRM sync) ──
  salesOrders:[
    {id:'SO-001',customer:'Henderson Deck Co.',dest:'Boise, ID',carrier:'FedEx Ground',pkgs:3,weight:185,estCost:145,actualCost:142.30,status:'Shipped',variance:-2.70},
    {id:'SO-002',customer:'Coastal Living Design',dest:'San Diego, CA',carrier:'R+L LTL',pkgs:2,weight:420,estCost:385,actualCost:410,status:'Shipped',variance:25},
    {id:'SO-003',customer:'Apex Construction',dest:'Portland, OR',carrier:'FedEx Freight',pkgs:4,weight:650,estCost:520,actualCost:null,status:'Quoted',variance:null},
    {id:'SO-004',customer:'Home Depot #4521',dest:'Seattle, WA',carrier:'Old Dominion LTL',pkgs:6,weight:980,estCost:680,actualCost:null,status:'Quoted',variance:null},
  ],
  customers:[
    {id:'CUS-001',name:'Henderson Deck Co.',contact:'',email:'',phone:'',type:'Builder',city:'Boise, ID',ytd:0},
    {id:'CUS-002',name:'Coastal Living Design',contact:'',email:'',phone:'',type:'Residential',city:'San Diego, CA',ytd:0},
    {id:'CUS-003',name:'Apex Construction',contact:'',email:'',phone:'',type:'GC',city:'Portland, OR',ytd:0},
    {id:'CUS-004',name:'Home Depot #4521',contact:'',email:'',phone:'',type:'Commercial',city:'Seattle, WA',ytd:0},
    {id:'CUS-005',name:'Farzaneh Fetdows',contact:'',email:'',phone:'',type:'Residential',city:'Woodland Hills, CA',ytd:763.85},
    {id:'CUS-006',name:'Dave Miller',contact:'',email:'',phone:'',type:'Residential',city:'Lewes, DE',ytd:681.25},
    {id:'CUS-007',name:'KGM Construction',contact:'',email:'',phone:'',type:'GC',city:'Templeton, CA',ytd:734.88},
  ],

  // ── Work Orders (placeholder — FORGE production sync pending) ─────────────
  workOrders:[
    {id:'WO-001',product:'Cable Post SM 42 — 18pc',customer:'Riverside Homes',qty:18,station:'Assembly',status:'Complete',start:'2025-12-15',due:'2025-12-30',progress:100,laborHrs:0,matCost:1680,laborRate:40},
    {id:'WO-002',product:'Cable Post FM 36 — 12pc',customer:'Alpine Builders',qty:12,station:'Welding',status:'Complete',start:'2025-12-20',due:'2026-01-04',progress:100,laborHrs:0,matCost:1200,laborRate:40},
    {id:'WO-003',product:'Glass Post FM 42 — 8pc',customer:'Clearwater Design',qty:8,station:'Powder Coat',status:'In Progress',start:'2026-02-28',due:'2026-03-10',progress:55,laborHrs:12,matCost:2400,laborRate:45},
    {id:'WO-004',product:'Cable Post SM 36 — 48pc',customer:'Home Depot #3847',qty:48,station:'CNC',status:'In Progress',start:'2026-03-01',due:'2026-03-12',progress:40,laborHrs:8,matCost:3800,laborRate:40},
  ],

  // ── Invoices (placeholder — MERIDIAN finance sync pending) ────────────────
  invoices:[
    {id:'INV-001',orderId:'MR-2026-0101',customer:'Riverside Homes',amount:4250,status:'Paid',issued:'2025-12-30',due:'2026-01-14',paid:'2026-01-10'},
    {id:'INV-002',orderId:'MR-2026-0105',customer:'Alpine Builders',amount:3180,status:'Paid',issued:'2026-01-04',due:'2026-01-19',paid:'2026-01-15'},
    {id:'INV-003',orderId:'MR-2026-0112',customer:'Clearwater Design',amount:5600,status:'Pending',issued:'2026-01-11',due:'2026-01-26',paid:null},
    {id:'INV-004',orderId:'MR-2026-0118',customer:'Home Depot #3847',amount:8900,status:'Paid',issued:'2026-01-17',due:'2026-02-01',paid:'2026-01-28'},
    {id:'INV-005',orderId:'MR-2026-0143',customer:'Lakeshore Estates',amount:2200,status:'Overdue',issued:'2026-02-16',due:'2026-03-02',paid:null},
  ],

  // ── P&L Monthly (structure ready — data entry pending) ────────────────────
  pnlMonthly:[
    {month:'Jan 26',revenue:0,cogs:0,gross:0,overhead:0,ebitda:0},
    {month:'Feb 26',revenue:0,cogs:0,gross:0,overhead:0,ebitda:0},
    {month:'Mar 26',revenue:0,cogs:0,gross:0,overhead:0,ebitda:0},
  ],

  // ── Hot List & Todos ───────────────────────────────────────────────────────
  hotList:[
    {id:'HOT-001',orderId:'MR-2026-0118',customer:'Home Depot #3847',item:'Cable Post SM 36 × 48',notes:'Stock order — production priority',flag:'HOT',date:'2026-03-01'},
    {id:'HOT-002',orderId:'MR-2026-0143',customer:'Lakeshore Estates',item:'Gate Kit 42 × 4',notes:'Invoice overdue — follow up',flag:'WATCH',date:'2026-03-05'},
  ],
  todos:[
    {id:'TODO-001',title:'Reorder swage assemblies — AI-015/AI-016 critical',cat:'Inventory',priority:'High',status:'Open',due:'2026-03-10',assigned:'Daniel Jones',notes:'REQ-0004 submitted'},
    {id:'TODO-002',title:'Order poly tubing (AI-020/021/022) and air cushion film',cat:'Inventory',priority:'High',status:'Open',due:'2026-03-10',assigned:'Daniel Jones',notes:'ULINE order pending'},
    {id:'TODO-003',title:'Restock TIG filler rod #4043 and MIG wire',cat:'Inventory',priority:'High',status:'Open',due:'2026-03-10',assigned:'Daniel Jones',notes:'PSC-016 and PSC-020 critical'},
    {id:'TODO-004',title:'Approve REQ-0001 Weld Hood Band — National Welding',cat:'Purchasing',priority:'Medium',status:'Open',due:'2026-03-15',assigned:'Daniel Jones',notes:'Michael requested'},
    {id:'TODO-005',title:'Schedule vendor scorecard reviews',cat:'Admin',priority:'Low',status:'Open',due:'2026-03-25',assigned:'Daniel Jones',notes:'14 vendors to evaluate'},
    {id:'TODO-006',title:'Finalize automation Phase 1 RFQ',cat:'Automation',priority:'High',status:'Open',due:'2026-03-20',assigned:'Daniel Jones',notes:'CNC + cutting stations'},
    {id:'TODO-007',title:'Follow up on IMV-005 overdue invoice — Lakeshore Estates',cat:'Finance',priority:'High',status:'Open',due:'2026-03-09',assigned:'Daniel Jones',notes:'$2,200 past due'},
    {id:'TODO-008',title:'Safety: close REQ AIR HOSE whip check (2/20)',cat:'Quality',priority:'Medium',status:'Open',due:'2026-03-12',assigned:'Daniel Jones',notes:'All fittings replaced — verify'},
  ],

  // ── Open Positions & Discipline ───────────────────────────────────────────
  openPositions:[
    {id:'POS-001',title:'Welder / Fabricator',dept:'Production',priority:'High',status:'Open',posted:'2026-02-15',notes:'TIG aluminum required, 2yr min exp'},
    {id:'POS-002',title:'Powder Coat Prep',dept:'Production',priority:'Medium',status:'Open',posted:'2026-02-20',notes:'Entry level OK, will train'},
    {id:'POS-003',title:'QC Inspector',dept:'Quality',priority:'High',status:'Open',posted:'2026-03-01',notes:'Measurement tools experience required'},
    {id:'POS-004',title:'Shipping Coordinator',dept:'Logistics',priority:'Medium',status:'Open',posted:'2026-03-01',notes:'Freight/LTL experience preferred'},
  ],
  disciplineLog:[],

  // ── Automation Roadmap (kept from v4 — real data in automationStations/PhasesRoadmap) ──
  automationPhases:[
    {id:'PH-001',phase:1,title:'CNC + Cutting Automation',months:'Q1-Q2 2026',budget:50000,status:'In Progress',completion:15,items:[
      {id:'PH-001-A',task:'Fusion CAM nesting software',cost:0,status:'In Progress'},
      {id:'PH-001-B',task:'Auto-feed CNC saw',cost:25000,status:'Planned'},
      {id:'PH-001-C',task:'Multi-fixture 4-post/cycle CNC',cost:2800,status:'In Progress'},
    ]},
    {id:'PH-002',phase:2,title:'Welding + QC Automation',months:'Q3-Q4 2026',budget:150000,status:'Research',completion:5,items:[
      {id:'PH-002-A',task:'Robotic TIG weld cell',cost:120000,status:'Planned'},
      {id:'PH-002-B',task:'Vision QC system',cost:30000,status:'Planned'},
    ]},
    {id:'PH-003',phase:3,title:'Powder Coat + Assembly',months:'2027',budget:100000,status:'Future',completion:0,items:[
      {id:'PH-003-A',task:'Conveyor powder coat line',cost:80000,status:'Planned'},
      {id:'PH-003-B',task:'Semi-auto assembly fixtures',cost:20000,status:'Planned'},
    ]},
    {id:'PH-004',phase:4,title:'Full Integration',months:'2027+',budget:50000,status:'Future',completion:0,items:[
      {id:'PH-004-A',task:'Connected systems auto-scheduling',cost:50000,status:'Planned'},
    ]},
  ],

  // ── Sister Company ─────────────────────────────────────────────────────────
  sisterOrders:[
    {id:'SIS-001',orderNo:'1059',date:'2026-01-04',project:'3BD-MATHEW PAWLIKOWSKI',desc:'FASCIA CABLE',location:'HAYDEN - BELLEVUE',value:7534.45,notes:''},
    {id:'SIS-002',orderNo:'1095',date:'2026-02-01',project:'3BD-FABRICE',desc:'SURFACE CABLE',location:'HAYDEN - BELLEVUE',value:996.22,notes:''},
    {id:'SIS-003',orderNo:'1110',date:'2026-02-03',project:'3BD-IRENNE KEARNS',desc:'FASCIA CABLE',location:'HAYDEN - BELLEVUE',value:4163.67,notes:''},
    {id:'SIS-004',orderNo:'1096',date:'2026-02-04',project:'3BD-TODD BEHRBAUM',desc:'SURFACE CABLE',location:'HAYDEN - BELLEVUE',value:3305.06,notes:''},
    {id:'SIS-005',orderNo:'1115',date:'2026-02-18',project:'3BD-TRACIE GRANT',desc:'FASCIA CABLE',location:'HAYDEN - BELLEVUE',value:3900.20,notes:''},
    {id:'SIS-006',orderNo:'1123',date:'2026-02-25',project:'3BD-CONRAD',desc:'FASCIA CABLE',location:'Hayden Local Pick-Up',value:7655.99,notes:'Local Pick-Up 3BD Install'},
    {id:'SIS-007',orderNo:'1125',date:'2026-02-25',project:'3BD-NOAH BORUN',desc:'SURFACE CABLE',location:'HAYDEN - BELLEVUE',value:5629.57,notes:''},
    {id:'SIS-008',orderNo:'1127',date:'2026-02-25',project:'3BD-HATCH',desc:'FASCIA CABLE',location:'Hayden Local Pick-Up',value:31340.84,notes:'Local Pick-Up 3BD Install'},
  ],
  sisterLabor: [
    {
        "entry": 1.0,
        "employee": "Jace",
        "date": "2026-02-17",
        "task": "DECK BUILD",
        "location": "HAYDEN",
        "onSiteHrs": 7.0,
        "transferHrs": 0.0,
        "totalHrs": 7.0,
        "rate": 35.0,
        "billable": 245.0
    },
    {
        "entry": 3.0,
        "employee": "Michael",
        "date": "2026-02-13",
        "task": "DELIVERY",
        "location": "HAYDEN-BELLEVUE",
        "onSiteHrs": 0.0,
        "transferHrs": 11.0,
        "totalHrs": 11.0,
        "rate": 40.0,
        "billable": 440.0
    },
    {
        "entry": 4.0,
        "employee": "Michael",
        "date": "2026-02-06",
        "task": "DELIVERY",
        "location": "HAYDEN-BELLEVUE",
        "onSiteHrs": 0.0,
        "transferHrs": 11.0,
        "totalHrs": 11.0,
        "rate": 40.0,
        "billable": 440.0
    },
    {
        "entry": 5.0,
        "employee": "Amber",
        "date": "2026-01-23",
        "task": "DELIVERY",
        "location": "HAYDEN-BELLEVUE",
        "onSiteHrs": 0.0,
        "transferHrs": 10.0,
        "totalHrs": 10.0,
        "rate": 40.0,
        "billable": 400.0
    },
    {
        "entry": 6.0,
        "employee": "Jace",
        "date": "2026-02-09",
        "task": "DELIVERY",
        "location": "HAYDEN-BELLEVUE",
        "onSiteHrs": 0.0,
        "transferHrs": 10.0,
        "totalHrs": 10.0,
        "rate": 35.0,
        "billable": 350.0
    },
    {
        "entry": 7.0,
        "employee": "Jace",
        "date": "2026-01-26",
        "task": "DECK BUILD",
        "location": "HAYDEN",
        "onSiteHrs": 6.0,
        "transferHrs": 0.0,
        "totalHrs": 6.0,
        "rate": 35.0,
        "billable": 210.0
    },
    {
        "entry": 8.0,
        "employee": "Jace",
        "date": "2026-01-27",
        "task": "DECK BUILD",
        "location": "HAYDEN",
        "onSiteHrs": 9.0,
        "transferHrs": 0.0,
        "totalHrs": 9.0,
        "rate": 35.0,
        "billable": 315.0
    },
    {
        "entry": 9.0,
        "employee": "Jace",
        "date": "2026-02-18",
        "task": "DECK BUILD",
        "location": "HAYDEN",
        "onSiteHrs": 9.0,
        "transferHrs": 0.0,
        "totalHrs": 9.0,
        "rate": 35.0,
        "billable": 315.0
    },
    {
        "entry": 10.0,
        "employee": "Amber",
        "date": "2026-02-20",
        "task": "DELIVERY",
        "location": "HAYDEN-BELLEVUE",
        "onSiteHrs": 0.0,
        "transferHrs": 11.0,
        "totalHrs": 11.0,
        "rate": 40.0,
        "billable": 440.0
    },
    {
        "entry": 11.0,
        "employee": "Amber",
        "date": "2026-02-27",
        "task": "DELIVERY",
        "location": "HAYDEN-BELLEVUE",
        "onSiteHrs": 0.0,
        "transferHrs": 11.0,
        "totalHrs": 11.0,
        "rate": 40.0,
        "billable": 440.0
    },
    {
        "entry": 12.0,
        "employee": "Jace",
        "date": "2026-03-06",
        "task": "DELIVERY",
        "location": "HAYDEN-BELLEVUE",
        "onSiteHrs": 0.0,
        "transferHrs": 11.0,
        "totalHrs": 11.0,
        "rate": 35.0,
        "billable": 385.0
    }
],

  // ── Auto-PO Rules (configured based on critical items) ────────────────────
  autoPoRules:[
    {id:'APR-001',itemId:'AI-015',itemName:'Swage Assembly Natural SS',vendor:'Coastal Hardware',triggerQty:500,orderQty:2000,unitCost:5.35,unit:'EA',enabled:true},
    {id:'APR-002',itemId:'AI-016',itemName:'Swage Assembly Black SS',vendor:'Coastal Hardware',triggerQty:200,orderQty:1000,unitCost:5.35,unit:'EA',enabled:true},
    {id:'APR-003',itemId:'RM-002',itemName:'6061-T6 Bar 1/8"×2"',vendor:'EMJ Metals',triggerQty:100,orderQty:500,unitCost:3.10,unit:'FT',enabled:true},
    {id:'APR-004',itemId:'PSC-016',itemName:'Filler Rod #4043 3/32 Alum',vendor:'American Welding Supply',triggerQty:2,orderQty:10,unitCost:0,unit:'LB',enabled:true},
  ],


  // ─── NEW DATA — v5.1 ────────────────────────────────────────────────────────

  // ERP.xlsx — Post MFG Lengths (24 part numbers with CNC cut lengths in inches)
  postsMfgList: [
    {
        "partNo": "P-CBL-FM-LINE-42",
        "desc": "Post | Cable | Fascia Mount | Line - 42\"",
        "mfgLength": 47.75,
        "unit": "in"
    },
    {
        "partNo": "P-CBL-FM-STR-42",
        "desc": "Post | Cable | Fascia Mount | Stair - 42\"",
        "mfgLength": 47.62,
        "unit": "in"
    },
    {
        "partNo": "P-CBL-FM-CRN-42",
        "desc": "Post | Cable | Fascia Mount | Corner - 42\"",
        "mfgLength": 47.75,
        "unit": "in"
    },
    {
        "partNo": "P-GLS-FM-LINE-42",
        "desc": "Post | Glass | Fascia Mount | Line - 42\"",
        "mfgLength": 47.75,
        "unit": "in"
    },
    {
        "partNo": "P-GLS-FM-STR-42",
        "desc": "Post | Glass | Fascia Mount | Stair - 42\"",
        "mfgLength": 47.62,
        "unit": "in"
    },
    {
        "partNo": "P-GLS-FM-CRN-42",
        "desc": "Post | Glass | Fascia Mount | Corner - 42\"",
        "mfgLength": 47.75,
        "unit": "in"
    },
    {
        "partNo": "P-CBL-SM-LINE-42",
        "desc": "Post | Cable | Surface Mount | Line - 42\"",
        "mfgLength": 41.0,
        "unit": "in"
    },
    {
        "partNo": "P-CBL-SM-STR-42",
        "desc": "Post | Cable | Surface Mount | Stair - 42\"",
        "mfgLength": 40.88,
        "unit": "in"
    },
    {
        "partNo": "P-CBL-SM-CRN-42",
        "desc": "Post | Cable | Surface Mount | Corner - 42\"",
        "mfgLength": 41.0,
        "unit": "in"
    },
    {
        "partNo": "P-GLS-SM-LINE-42",
        "desc": "Post | Glass | Surface Mount | Line - 42\"",
        "mfgLength": 41.0,
        "unit": "in"
    },
    {
        "partNo": "P-GLS-SM-STR-42",
        "desc": "Post | Glass | Surface Mount | Stair - 42\"",
        "mfgLength": 40.88,
        "unit": "in"
    },
    {
        "partNo": "P-GLS-SM-CRN-42",
        "desc": "Post | Glass | Surface Mouint | Corner - 42\"",
        "mfgLength": 41.0,
        "unit": "in"
    },
    {
        "partNo": "P-CBL-FM-LINE-36",
        "desc": "Post | Cable | Fascia Mount | Line - 36\"",
        "mfgLength": 43.0,
        "unit": "in"
    },
    {
        "partNo": "P-CBL-FM-STR-36",
        "desc": "Post | Cable | Fascia Mount | Stair - 36\"",
        "mfgLength": 42.88,
        "unit": "in"
    },
    {
        "partNo": "P-CBL-FM-CRN-36",
        "desc": "Post | Cable | Fascia Mount | Corner - 36\"",
        "mfgLength": 43.0,
        "unit": "in"
    },
    {
        "partNo": "P-GLS-FM-LINE-36",
        "desc": "Post | Glass | Fascia Mount | Line - 36\"",
        "mfgLength": 43.0,
        "unit": "in"
    },
    {
        "partNo": "P-GLS-FM-STR-36",
        "desc": "Post | Glass | Fascia Mount | Stair - 36\"",
        "mfgLength": 42.88,
        "unit": "in"
    },
    {
        "partNo": "P-GLS-FM-CRN-36",
        "desc": "Post | Glass | Fascia Mount | Corner - 36\"",
        "mfgLength": 43.0,
        "unit": "in"
    },
    {
        "partNo": "P-CBL-SM-LINE-36",
        "desc": "Post | Cable | Surface Mount | Line - 36\"",
        "mfgLength": 35.0,
        "unit": "in"
    },
    {
        "partNo": "P-CBL-SM-STR-36",
        "desc": "Post | Cable | Surface Mount | Stair - 36\"",
        "mfgLength": 34.88,
        "unit": "in"
    },
    {
        "partNo": "P-CBL-SM-CRN-36",
        "desc": "Post | Cable | Surface Mount | Corner - 36\"",
        "mfgLength": 35.0,
        "unit": "in"
    },
    {
        "partNo": "P-GLS-SM-LINE-36",
        "desc": "Post | Glass | Surface Mount | Line - 36\"",
        "mfgLength": 35.0,
        "unit": "in"
    },
    {
        "partNo": "P-GLS-SM-STR-36",
        "desc": "Post | Glass | Surface Mount | Stair - 36\"",
        "mfgLength": 34.88,
        "unit": "in"
    },
    {
        "partNo": "P-GLS-SM-CRN-36",
        "desc": "Post | Glass | Surface Mount | Corner - 36\"",
        "mfgLength": 35.0,
        "unit": "in"
    }
],

  // ERP.xlsx (pre-2026) — 387 historical customer orders Nov 2024-Feb 2025
  legacyOrders: [
    {
        "id": "LEG-0001",
        "customer": "Marshon Smith Kempf",
        "date": "2025-11-20",
        "shipTo": "Local Pickup",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            30.0,
            16.0,
            16.0,
            6.0,
            26.0,
            338.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0002",
        "customer": "Ford Perry",
        "date": "2025-11-20",
        "shipTo": "Local Install 3bd",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            63.0,
            29.0,
            29.0,
            18.0,
            50.0,
            650.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0003",
        "customer": "Stan Thornton",
        "date": "2025-11-20",
        "shipTo": "Local Install 3bd",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            26.0,
            12.0,
            12.0,
            5.0,
            20.0,
            260.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0004",
        "customer": "Ben Hall (dads job)",
        "date": "2025-11-20",
        "shipTo": "Shipping",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            15.0,
            3.0,
            18.0,
            104.0,
            30.0,
            60.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0005",
        "customer": "Paul Beagle",
        "date": "2025-11-20",
        "shipTo": "Shipping",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            13.0,
            10.0,
            10.0,
            4.0,
            12.0,
            156.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0006",
        "customer": "Carol Oliver & Elliav",
        "date": "2025-11-21",
        "shipTo": "3bd w/side install",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            59.0,
            8.0,
            8.0,
            10.0,
            50.0,
            650.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0007",
        "customer": "Jrscates LLC James Scate",
        "date": "2025-11-25",
        "shipTo": "Shipping",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            16.0,
            14.0,
            14.0,
            4.0,
            14.0,
            182.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0008",
        "customer": "Ac Wool",
        "date": "2025-11-26",
        "shipTo": "Local Install 3bd",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            27.0,
            6.0,
            6.0,
            6.0,
            22.0,
            286.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0009",
        "customer": "Patrick McMullen",
        "date": "2025-12-02",
        "shipTo": "Local Delivery",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            6.0,
            1.0,
            4.0,
            52.0,
            300.0,
            12.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0010",
        "customer": "Nathan Oines",
        "date": "2025-11-12",
        "shipTo": "Washington",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            34.0,
            8.0,
            8.0,
            7.0,
            22.0,
            286.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0011",
        "customer": "3bd - Inventory",
        "date": "2025-11-12",
        "shipTo": "Bellevue",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            100.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0012",
        "customer": "Kristen Jepsen",
        "date": "2025-11-12",
        "shipTo": "Oregon",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            19.0,
            6.0,
            6.0,
            4.0,
            18.0,
            240.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0013",
        "customer": "Amy Talarico",
        "date": "2025-11-10",
        "shipTo": "California Ship",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            12.0,
            6.0,
            6.0,
            2.0,
            12.0,
            156.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0014",
        "customer": "Lisa Brown",
        "date": "2025-11-10",
        "shipTo": "California",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            8.0,
            2.0,
            4.0,
            52.0,
            300.0,
            32.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0015",
        "customer": "Kim Sloat",
        "date": "2025-11-10",
        "shipTo": "California",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            40.0,
            8.0,
            8.0,
            10.0,
            24.0,
            312.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0016",
        "customer": "Cary Jones",
        "date": "2025-11-10",
        "shipTo": "California",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            23.0,
            2.0,
            2.0,
            5.0,
            14.0,
            182.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0017",
        "customer": "Joe Christman",
        "date": "2025-11-06",
        "shipTo": "Ship to: Denver",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            45.0,
            9.0,
            20.0,
            260.0,
            1900.0,
            90.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0018",
        "customer": "Judd & Ellie Mathiason",
        "date": "2025-11-05",
        "shipTo": "Local Pickup",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            47.0,
            6.0,
            6.0,
            10.0,
            24.0,
            312.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0019",
        "customer": "BRAD Lewandowski",
        "date": "2025-11-05",
        "shipTo": "Local Install 3bd",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            18.0,
            4.0,
            4.0,
            4.0,
            10.0,
            156.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0020",
        "customer": "Keith Robertson",
        "date": "2025-11-03",
        "shipTo": "Local Install 3bd",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            26.0,
            4.0,
            2.0,
            5.0,
            14.0,
            182.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0021",
        "customer": "Dean Brotzman",
        "date": "2025-11-03",
        "shipTo": "Local Pickup",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            2.0,
            4.0,
            8.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0022",
        "customer": "Rick Taylor",
        "date": "2025-10-24",
        "shipTo": "Local Delivery",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            38.0,
            8.0,
            8.0,
            9.0,
            22.0,
            300.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0023",
        "customer": "Rob Motts",
        "date": "2025-10-30",
        "shipTo": "Local Install 3bd",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            19.0,
            4.0,
            4.0,
            4.0,
            12.0,
            180.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0024",
        "customer": "Barry McLane (CUSTOM COLOR)",
        "date": "2025-10-23",
        "shipTo": "Washington",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            34.0,
            8.0,
            8.0,
            8.0,
            20.0,
            260.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0025",
        "customer": "David Jumpa",
        "date": "2024-12-30",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            7.0,
            7.0,
            6.0,
            6.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0026",
        "customer": "Zhuang",
        "date": "2024-12-30",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            14.0,
            14.0,
            2.0,
            2.0,
            2.0,
            2.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0027",
        "customer": "Blake Carson",
        "date": "2025-01-03",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            25.0,
            25.0,
            6.0,
            6.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0028",
        "customer": "Merwin Storage",
        "date": "2025-01-03",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            16.0,
            16.0,
            3.0,
            3.0,
            8.0,
            120.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0029",
        "customer": "JC",
        "date": "2024-12-27",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            5.0,
            5.0,
            2.0,
            2.0,
            2.0,
            2.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0030",
        "customer": "Lisa Addy / Rock Ext",
        "date": "2025-01-10",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            15.0,
            15.0,
            4.0,
            4.0,
            4.0,
            4.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0031",
        "customer": "Cheryl Johnson",
        "date": "2025-01-06",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            31.0,
            31.0,
            7.0,
            7.0,
            16.0,
            220.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0032",
        "customer": "Chris Campbell",
        "date": "2025-01-21",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            27.0,
            27.0,
            4.0,
            4.0,
            4.0,
            4.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0033",
        "customer": "David Johnson (WHITE!)",
        "date": "2025-01-23",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            29.0,
            29.0,
            5.0,
            5.0,
            10.0,
            10.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0034",
        "customer": "Lillian Colbert",
        "date": "2025-02-04",
        "shipTo": "Colorado",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            2.0,
            2.0,
            2.0,
            2.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0035",
        "customer": "Ryan Rauschert",
        "date": "2025-01-17",
        "shipTo": "Oregon (Mail)",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            800.0,
            800.0,
            60.0,
            60.0,
            150.0,
            150.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0036",
        "customer": "Tami Neumann (Rework 2)",
        "date": "2025-02-11",
        "shipTo": "Oregon",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            10.0,
            10.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0037",
        "customer": "Justin Whitman",
        "date": "2025-01-29",
        "shipTo": "Montana",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            10.0,
            10.0,
            5.0,
            5.0,
            5.0,
            5.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0038",
        "customer": "3BD - Matt Kimmerly",
        "date": "2025-01-29",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            39.0,
            39.0,
            18.0,
            18.0,
            18.0,
            18.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0039",
        "customer": "Zach Yamagishi",
        "date": "2025-02-04",
        "shipTo": "Colorado",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            8.0,
            8.0,
            5.0,
            5.0,
            10.0,
            10.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0040",
        "customer": "3BD - Daniel Phillips",
        "date": "2025-01-29",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            15.0,
            15.0,
            16.0,
            16.0,
            16.0,
            16.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0041",
        "customer": "3BD - Craig Feldman",
        "date": "2025-01-30",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            16.0,
            16.0,
            8.0,
            8.0,
            8.0,
            8.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0042",
        "customer": "Garret Jacobs",
        "date": "2025-01-29",
        "shipTo": "California",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            15.0,
            15.0,
            6.0,
            6.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0043",
        "customer": "3BD - Chris Helgeson",
        "date": "2025-02-27",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            47.0,
            47.0,
            14.0,
            14.0,
            14.0,
            14.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0044",
        "customer": "3BD - Juan Morales",
        "date": "2025-02-27",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            50.0,
            50.0,
            16.0,
            16.0,
            16.0,
            16.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0045",
        "customer": "Ben Murphy - Monica",
        "date": "2025-02-19",
        "shipTo": "Local",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            11.0,
            11.0,
            8.0,
            8.0,
            8.0,
            8.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0046",
        "customer": "Ben Murphy - Eric",
        "date": "2025-02-19",
        "shipTo": "Local",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            14.0,
            14.0,
            12.0,
            12.0,
            12.0,
            12.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0047",
        "customer": "Ben Murphy - Clifton",
        "date": "2025-02-13",
        "shipTo": "Local",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            9.0,
            9.0,
            8.0,
            8.0,
            8.0,
            8.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0048",
        "customer": "Cheri Douglas",
        "date": "2025-02-17",
        "shipTo": "Wisconsin",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            24.0,
            24.0,
            6.0,
            6.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0049",
        "customer": "Terry Walker",
        "date": "2025-02-27",
        "shipTo": "Local",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            6.0,
            6.0,
            3.0,
            3.0,
            3.0,
            3.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0050",
        "customer": "Alan / Vicky / Kathren",
        "date": "2025-02-20",
        "shipTo": "Local",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            16.0,
            16.0,
            10.0,
            10.0,
            10.0,
            10.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0051",
        "customer": "John Barnwell",
        "date": "2025-03-20",
        "shipTo": "Local",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            19.0,
            19.0,
            4.0,
            4.0,
            8.0,
            8.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0052",
        "customer": "3BD - Todd Dunlap",
        "date": "2025-02-27",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            31.0,
            31.0,
            12.0,
            12.0,
            12.0,
            12.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0053",
        "customer": "Andrew Luccock",
        "date": "2025-03-11",
        "shipTo": "Oregon",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            17.0,
            17.0,
            2.5,
            2.5,
            8.0,
            8.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0054",
        "customer": "3BD - Matt Kimmberly - REWORK 3",
        "date": "2025-03-11",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            5.0,
            5.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0055",
        "customer": "Isaiah Banfro",
        "date": "2025-03-17",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            24.0,
            24.0,
            20.0,
            20.0,
            20.0,
            20.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0056",
        "customer": "Heather Wilson",
        "date": "2025-03-14",
        "shipTo": "Local",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            24.0,
            24.0,
            3.0,
            3.0,
            3.0,
            3.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0057",
        "customer": "Erin Hope",
        "date": "2025-03-14",
        "shipTo": "Local",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            5.0,
            5.0,
            1.0,
            1.0,
            2.0,
            2.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0058",
        "customer": "Sage Decks - Dave Holma",
        "date": "2025-03-18",
        "shipTo": "Montana",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            34.0,
            34.0,
            16.0,
            16.0,
            16.0,
            16.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0059",
        "customer": "Coeur Builders - Cochran",
        "date": "2025-03-21",
        "shipTo": "Local",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            29.0,
            29.0,
            6.0,
            6.0,
            16.0,
            16.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0060",
        "customer": "Junity - Lot 5",
        "date": "2025-03-21",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            20.0,
            20.0,
            6.0,
            6.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0061",
        "customer": "Junity - Lot 6",
        "date": "2025-03-21",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            31.0,
            31.0,
            6.0,
            6.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0062",
        "customer": "Claudia Scruzr",
        "date": "2025-03-24",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            19.0,
            19.0,
            8.0,
            8.0,
            8.0,
            8.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0063",
        "customer": "3BD - Gulstrom",
        "date": "2025-03-24",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            17.0,
            17.0,
            8.0,
            8.0,
            8.0,
            8.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0064",
        "customer": "3BD - JoLynn Garrett",
        "date": "2025-03-24",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            37.0,
            37.0,
            10.0,
            10.0,
            10.0,
            10.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0065",
        "customer": "3BD - Traci Grant",
        "date": "2025-04-01",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            19.0,
            19.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0066",
        "customer": "Curtis Kiepprien",
        "date": "2025-03-31",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            8.0,
            8.0,
            3.0,
            3.0,
            1.0,
            1.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0067",
        "customer": "3BD - Kristine Marshall",
        "date": "2025-04-01",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            26.0,
            26.0,
            8.0,
            8.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0068",
        "customer": "Sarah Rodriguez",
        "date": "2025-04-01",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            29.0,
            29.0,
            1.0,
            1.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0069",
        "customer": "SkyPro Remodeling",
        "date": "2025-03-21",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            11.0,
            11.0,
            15.0,
            15.0,
            15.0,
            15.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0070",
        "customer": "3BD - Greg Appert",
        "date": "2025-03-30",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            37.0,
            37.0,
            8.0,
            8.0,
            8.0,
            8.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0071",
        "customer": "Bryan Cooley",
        "date": "2025-03-30",
        "shipTo": "Colorado",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            35.0,
            35.0,
            17.0,
            17.0,
            17.0,
            17.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0072",
        "customer": "Nicole Hawkins",
        "date": "2025-04-11",
        "shipTo": "Local",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            32.0,
            32.0,
            6.0,
            6.0,
            12.0,
            12.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0073",
        "customer": "Ruvim Dragomir",
        "date": "2025-04-11",
        "shipTo": "Local",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            22.0,
            22.0,
            2.0,
            2.0,
            2.0,
            2.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0074",
        "customer": "Clearwater Construction",
        "date": "2025-04-09",
        "shipTo": "Washington",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            31.0,
            31.0,
            8.0,
            8.0,
            18.0,
            18.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0075",
        "customer": "Lynne O'Callaghan",
        "date": "2025-04-11",
        "shipTo": "Oregon",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            11.0,
            11.0,
            2.0,
            2.0,
            2.0,
            2.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0076",
        "customer": "Rich Boyer",
        "date": "2025-04-04",
        "shipTo": "California",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            35.0,
            35.0,
            8.0,
            8.0,
            8.0,
            8.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0077",
        "customer": "Matthew Siegel",
        "date": "2025-04-07",
        "shipTo": "Washington",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            30.0,
            30.0,
            5.0,
            5.0,
            12.0,
            12.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0078",
        "customer": "Myles Magnuson",
        "date": "2025-04-22",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            2.0,
            2.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0079",
        "customer": "Claudia Scruzr - Rework",
        "date": "2025-04-21",
        "shipTo": "Washington",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            8.0,
            8.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0080",
        "customer": "3BD - Paul Mathews",
        "date": "2025-04-07",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            38.0,
            38.0,
            22.0,
            22.0,
            7.0,
            7.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0081",
        "customer": "Dale Bernardson",
        "date": "2025-04-07",
        "shipTo": "Washington",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            45.0,
            45.0,
            4.0,
            4.0,
            4.0,
            4.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0082",
        "customer": "Javier Rodriguez - Echo Hallow",
        "date": "2025-04-16",
        "shipTo": "Oregon",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            10.0,
            10.0,
            10.0,
            10.0,
            4.0,
            4.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0083",
        "customer": "3BD  - Will Green",
        "date": "2025-05-12",
        "shipTo": "Local",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            9.0,
            9.0,
            2.0,
            2.0,
            2.0,
            2.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0084",
        "customer": "JEM Builders - Vincent Valesquez",
        "date": "2025-04-07",
        "shipTo": "Local",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            132.0,
            132.0,
            14.0,
            14.0,
            14.0,
            14.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0085",
        "customer": "Cathie Haas",
        "date": "2025-04-09",
        "shipTo": "Local",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            12.0,
            12.0,
            6.0,
            6.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0086",
        "customer": "3BD - Dave Peters",
        "date": "2025-04-22",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            19.0,
            19.0,
            3.0,
            3.0,
            3.0,
            3.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0087",
        "customer": "3BD - Pascucci Posts / Gate",
        "date": "2025-05-16",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            11.0,
            11.0,
            5.0,
            5.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0088",
        "customer": "3BD - Pham Custom Posts",
        "date": "2025-05-16",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0089",
        "customer": "Jason - Everett - New Posts",
        "date": "2025-05-12",
        "shipTo": "California",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            22.0,
            22.0,
            30.0,
            30.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0090",
        "customer": "Jesse Farrat",
        "date": "2025-05-12",
        "shipTo": "Local",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            50.0,
            50.0,
            13.0,
            13.0,
            13.0,
            13.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0091",
        "customer": "Chelsea Mae",
        "date": "2025-04-22",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            32.0,
            32.0,
            7.0,
            7.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0092",
        "customer": "NWBNR - Scott Peterson",
        "date": "2025-04-16",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            11.0,
            11.0,
            3.0,
            3.0,
            3.0,
            3.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0093",
        "customer": "3BD - Wilder Heath / Custom",
        "date": "2025-05-21",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            22.0,
            22.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0094",
        "customer": "Coeur Builders - Juliet Rail",
        "date": "2025-05-12",
        "shipTo": "Local",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            3.0,
            3.0,
            0.5,
            0.5,
            2.0,
            2.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0095",
        "customer": "3BD - Tom Fink",
        "date": "2025-05-27",
        "shipTo": "Local Install",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            7.0,
            7.0,
            4.0,
            4.0,
            4.0,
            4.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0096",
        "customer": "3BD - Ken Kolbe",
        "date": "2025-05-28",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            19.0,
            19.0,
            3.0,
            3.0,
            8.0,
            8.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0097",
        "customer": "Koinonia Construction",
        "date": "2025-04-23",
        "shipTo": "Nevada",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            31.0,
            31.0,
            5.0,
            5.0,
            14.0,
            14.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0098",
        "customer": "Peterson Const. - Bruce Peterson",
        "date": "2025-05-07",
        "shipTo": "Local",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            20.0,
            20.0,
            5.0,
            5.0,
            10.0,
            10.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0099",
        "customer": "Bar Rozner",
        "date": "2025-06-13",
        "shipTo": "California",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            15.0,
            15.0,
            3.0,
            3.0,
            12.0,
            12.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0100",
        "customer": "Linda & Tom Dabbs",
        "date": "2025-05-30",
        "shipTo": "Local Pick-Up",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            27.0,
            27.0,
            5.0,
            5.0,
            10.0,
            10.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0101",
        "customer": "3BD - Mark Anderson",
        "date": "2025-05-09",
        "shipTo": "Local",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            48.0,
            48.0,
            41.0,
            41.0,
            41.0,
            41.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0102",
        "customer": "3BD - Robyn Borders",
        "date": "2025-07-01",
        "shipTo": "Local Install",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            15.0,
            15.0,
            8.0,
            8.0,
            8.0,
            8.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0103",
        "customer": "3BD - Tom Fink / Order 2",
        "date": "2025-07-01",
        "shipTo": "Local Install",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            18.0,
            18.0,
            12.0,
            12.0,
            12.0,
            12.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0104",
        "customer": "Jack Rosemary",
        "date": "2025-06-24",
        "shipTo": "Local",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            2.0,
            2.0,
            2.0,
            2.0,
            2.0,
            2.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0105",
        "customer": "Brittney Lissner",
        "date": "2025-06-24",
        "shipTo": "California",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            48.0,
            48.0,
            8.0,
            8.0,
            8.0,
            8.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0106",
        "customer": "Brady Frandsen - Constitutional",
        "date": "2025-06-24",
        "shipTo": "Utah",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            10.0,
            10.0,
            8.0,
            8.0,
            8.0,
            8.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0107",
        "customer": "JDM Customs",
        "date": "2025-07-01",
        "shipTo": "Local Delivery",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            10.0,
            10.0,
            11.0,
            11.0,
            26.0,
            26.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0108",
        "customer": "Sarah Cichosz - Columbia Pools",
        "date": "2025-05-16",
        "shipTo": "Washington",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            36.0,
            36.0,
            6.0,
            6.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0109",
        "customer": "Paul Harrington",
        "date": "2025-05-29",
        "shipTo": "Local",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            10.0,
            10.0,
            2.0,
            2.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0110",
        "customer": "Tom Kelly",
        "date": "2025-05-30",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            18.0,
            18.0,
            3.0,
            3.0,
            10.0,
            10.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0111",
        "customer": "Louise Conroy",
        "date": "2025-06-04",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            12.0,
            12.0,
            3.0,
            3.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0112",
        "customer": "Kenneth Nguyen",
        "date": "2025-06-11",
        "shipTo": "Pennsylvania",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            24.0,
            24.0,
            6.0,
            6.0,
            10.0,
            10.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0113",
        "customer": "Kevin Hungate",
        "date": "2025-06-25",
        "shipTo": "Idaho",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            8.0,
            8.0,
            6.0,
            6.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0114",
        "customer": "Bar Rozner - Bloch Street",
        "date": "2025-07-03",
        "shipTo": "California",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            12.0,
            12.0,
            3.0,
            3.0,
            8.0,
            8.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0115",
        "customer": "Ben Murphy - Spirit Lake",
        "date": "2025-07-14",
        "shipTo": "Local Pick-Up",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            13.0,
            13.0,
            8.0,
            8.0,
            8.0,
            8.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0116",
        "customer": "Keith Moses",
        "date": "2025-07-02",
        "shipTo": "Washington",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            10.0,
            10.0,
            6.0,
            6.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0117",
        "customer": "Maravilla Projects - Scouts Overlook",
        "date": "2025-07-02",
        "shipTo": "Georgia",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            28.0,
            28.0,
            8.0,
            8.0,
            12.0,
            12.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0118",
        "customer": "Todd Bassen",
        "date": "2025-07-09",
        "shipTo": "Local Install",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            22.0,
            22.0,
            6.0,
            6.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0119",
        "customer": "Brad Anderson",
        "date": "2025-07-14",
        "shipTo": "Oregon",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            15.0,
            15.0,
            7.0,
            7.0,
            7.0,
            7.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0120",
        "customer": "Menno Vanderlist",
        "date": "2025-06-20",
        "shipTo": "Washington",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            29.0,
            29.0,
            9.0,
            9.0,
            9.0,
            9.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0121",
        "customer": "Daniel Jaimes",
        "date": "2025-07-21",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            18.0,
            18.0,
            8.0,
            8.0,
            8.0,
            5.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0122",
        "customer": "Greg Mixon",
        "date": "2025-07-02",
        "shipTo": "Montana",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            16.0,
            16.0,
            6.0,
            6.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0123",
        "customer": "Glenn Boarman",
        "date": "2025-06-04",
        "shipTo": "Colorado",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            17.0,
            17.0,
            16.0,
            16.0,
            16.0,
            16.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0124",
        "customer": "Mike Cortinas",
        "date": "2025-07-18",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            20.0,
            20.0,
            5.0,
            5.0,
            10.0,
            10.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0125",
        "customer": "Eyo Ekpo",
        "date": "2025-07-18",
        "shipTo": "Minnesota",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            10.0,
            10.0,
            3.0,
            3.0,
            4.0,
            4.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0126",
        "customer": "Alyssa Shaw",
        "date": "2025-07-18",
        "shipTo": "Local Install",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            20.0,
            20.0,
            5.0,
            5.0,
            10.0,
            10.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0127",
        "customer": "James Forsyth",
        "date": "2025-07-28",
        "shipTo": "Oregon",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            12.0,
            12.0,
            3.0,
            3.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0128",
        "customer": "Sherri Meck",
        "date": "2025-08-04",
        "shipTo": "Washington",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            13.0,
            13.0,
            3.0,
            3.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0129",
        "customer": "Aaron Egger",
        "date": "2025-08-08",
        "shipTo": "Oregon",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            7.0,
            7.0,
            22.0,
            22.0,
            320.0,
            320.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0130",
        "customer": "3BD Inventory - Week of 08.11",
        "date": "2025-08-11",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            100.0,
            100.0,
            50.0,
            50.0,
            50.0,
            50.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0131",
        "customer": "Ben Murphy - Spirit Lake 2",
        "date": "2025-08-04",
        "shipTo": "Local Pick-Up",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            11.0,
            11.0,
            7.0,
            7.0,
            20.0,
            20.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0132",
        "customer": "Viking Construction - Harold Hopkins",
        "date": "2025-08-04",
        "shipTo": "Local Install",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            12.0,
            12.0,
            10.0,
            10.0,
            10.0,
            10.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0133",
        "customer": "Tennaile Timbrook",
        "date": "2025-08-06",
        "shipTo": "Ohio",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            26.0,
            26.0,
            8.0,
            8.0,
            8.0,
            8.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0134",
        "customer": "3BD Inventory - Week of 08.18",
        "date": "2025-08-18",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            200.0,
            200.0,
            30.0,
            30.0,
            50.0,
            50.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0135",
        "customer": "Duane Klinge",
        "date": "2025-08-12",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            29.0,
            29.0,
            14.0,
            14.0,
            14.0,
            14.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0136",
        "customer": "KingBuilt LLC",
        "date": "2025-08-12",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            36.0,
            36.0,
            10.0,
            10.0,
            10.0,
            10.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0137",
        "customer": "Dan Kozak",
        "date": "2025-08-18",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            33.0,
            33.0,
            7.0,
            7.0,
            16.0,
            16.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0138",
        "customer": "River A Construction",
        "date": "2025-08-20",
        "shipTo": "Oregon",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            14.0,
            14.0,
            3.0,
            3.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0139",
        "customer": "Debi Ferguson",
        "date": "2025-08-25",
        "shipTo": "Oregon",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            30.0,
            30.0,
            6.0,
            6.0,
            12.0,
            12.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0140",
        "customer": "3BD Inventory - Week of 08.25",
        "date": "2025-08-15",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            200.0,
            200.0,
            30.0,
            30.0,
            50.0,
            50.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0141",
        "customer": "Cecil Roby, Jr.",
        "date": "2025-08-11",
        "shipTo": "Local Pick-Up",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            43.0,
            43.0,
            6.0,
            6.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0142",
        "customer": "3BD - Graham Johnson",
        "date": "2025-09-02",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            5.0,
            5.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0143",
        "customer": "Renan Morals",
        "date": "2025-08-18",
        "shipTo": "California",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            25.0,
            25.0,
            12.0,
            12.0,
            2.0,
            2.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0144",
        "customer": "3BD Inventory - Week of Sept 01",
        "date": "2025-08-25",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            200.0,
            200.0,
            60.0,
            60.0,
            60.0,
            60.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0145",
        "customer": "Blake Carson - Nelson Project",
        "date": "2025-09-04",
        "shipTo": "Washington",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            21.0,
            21.0,
            8.0,
            8.0,
            8.0,
            8.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0146",
        "customer": "3BD - McKenzie Construstion",
        "date": "2025-09-02",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            1.0,
            1.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0147",
        "customer": "David Victor",
        "date": "2025-08-28",
        "shipTo": "Local Pick-Up",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            15.0,
            15.0,
            6.0,
            6.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0148",
        "customer": "Chirs McCartney",
        "date": "2025-09-03",
        "shipTo": "Local Pick-Up",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            12.0,
            12.0,
            3.0,
            3.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0149",
        "customer": "Rocky Fresh",
        "date": "2025-08-29",
        "shipTo": "Washington",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            13.0,
            13.0,
            7.0,
            7.0,
            7.0,
            7.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0150",
        "customer": "Bonified Wood - Nick Lazzaretto",
        "date": "2025-09-10",
        "shipTo": "Washington",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            34.0,
            34.0,
            9.0,
            9.0,
            9.0,
            9.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0151",
        "customer": "Glenn Boarman",
        "date": "2025-08-29",
        "shipTo": "Colorado",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            2.0,
            2.0,
            10.0,
            10.0,
            1.0,
            1.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0152",
        "customer": "3BD Inventory - Week of Sept 08",
        "date": "2025-09-01",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            200.0,
            200.0,
            60.0,
            60.0,
            50.0,
            50.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0153",
        "customer": "Kelly Crandell",
        "date": "2025-08-29",
        "shipTo": "California",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            7.0,
            7.0,
            2.0,
            2.0,
            2.0,
            2.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0154",
        "customer": "Kambell & Jarvis Excavating",
        "date": "2025-09-11",
        "shipTo": "Washington",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            14.0,
            14.0,
            4.0,
            4.0,
            4.0,
            4.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0155",
        "customer": "Seattle Style - Luis",
        "date": "2025-09-12",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            19.0,
            19.0,
            15.0,
            15.0,
            15.0,
            15.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0156",
        "customer": "Revolutionary Construction",
        "date": "2025-08-28",
        "shipTo": "Local Delivery",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            46.0,
            46.0,
            6.0,
            6.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0157",
        "customer": "Missy Borgen",
        "date": "2025-08-29",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            9.0,
            9.0,
            2.0,
            2.0,
            2.0,
            2.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0158",
        "customer": "Natalia Krasnova",
        "date": "2025-09-04",
        "shipTo": "Nevada",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            45.0,
            45.0,
            17.0,
            17.0,
            17.0,
            17.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0159",
        "customer": "Chris McCartney",
        "date": "2025-09-17",
        "shipTo": "Local Pick-Up",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            4.0,
            4.0,
            1.0,
            1.0,
            2.0,
            2.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0160",
        "customer": "Mark Anderson",
        "date": "2025-09-22",
        "shipTo": "Local Install",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            15.0,
            15.0,
            4.0,
            4.0,
            8.0,
            8.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0161",
        "customer": "Matt Snodgrass",
        "date": "2025-09-12",
        "shipTo": "Local Delivery",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            25.0,
            25.0,
            5.0,
            5.0,
            12.0,
            12.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0162",
        "customer": "Sean Slaughter",
        "date": "2025-08-29",
        "shipTo": "Local Delivery",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            2.0,
            2.0,
            2.0,
            2.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0163",
        "customer": "Scott Venera",
        "date": "2025-09-22",
        "shipTo": "Local Pick-Up",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            24.0,
            24.0,
            12.0,
            12.0,
            12.0,
            12.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0164",
        "customer": "Lisa Aslanzadeh",
        "date": "2025-09-26",
        "shipTo": "Local Deliver",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            11.0,
            11.0,
            8.0,
            8.0,
            8.0,
            8.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0165",
        "customer": "3BD - Courtney Gifford",
        "date": "2025-10-09",
        "shipTo": "Oregon",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            4.0,
            4.0,
            1.0,
            1.0,
            1.0,
            1.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0166",
        "customer": "Jerry Vosberg",
        "date": "2025-09-25",
        "shipTo": "Washington",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            26.0,
            26.0,
            3.0,
            3.0,
            3.0,
            3.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0167",
        "customer": "Dean Brotzman",
        "date": "2025-10-02",
        "shipTo": "Local Pick-Up",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            12.0,
            12.0,
            4.0,
            4.0,
            4.0,
            4.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0168",
        "customer": "Nick Upton",
        "date": "2025-10-03",
        "shipTo": "Washington",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            25.0,
            25.0,
            10.0,
            10.0,
            10.0,
            10.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0169",
        "customer": "Chris Saliture",
        "date": "2025-10-07",
        "shipTo": "Minnesota",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            31.0,
            31.0,
            200.0,
            200.0,
            1500.0,
            1500.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0170",
        "customer": "John Hofland (CUSTOM COLOR WH120)",
        "date": "2025-09-22",
        "shipTo": "Local Pick-Up",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            12.0,
            12.0,
            3.0,
            3.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0171",
        "customer": "Benjamin Pugh",
        "date": "2025-10-07",
        "shipTo": "Washington",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            13.0,
            13.0,
            2.0,
            2.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0172",
        "customer": "Bill Fargher",
        "date": "2025-10-07",
        "shipTo": "Washington",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            20.0,
            20.0,
            5.0,
            5.0,
            10.0,
            10.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0173",
        "customer": "3BD - Christopher Lee (TED)",
        "date": "2025-10-07",
        "shipTo": "Local Install",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            49.0,
            49.0,
            3.0,
            3.0,
            4.0,
            4.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0174",
        "customer": "Melissa Ramis",
        "date": "2025-10-14",
        "shipTo": "Oregon",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            4.0,
            4.0,
            18.0,
            18.0,
            18.0,
            18.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0175",
        "customer": "Matt Dover",
        "date": "2025-10-03",
        "shipTo": "Local Pick-Up",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            22.0,
            22.0,
            22.0,
            22.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0176",
        "customer": "Heigi Gudnason (CUSTOM COLOR WH120)",
        "date": "2025-09-29",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            8.0,
            8.0,
            2.0,
            2.0,
            4.0,
            4.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0177",
        "customer": "Tenalle Timbrook - EXTRA",
        "date": "2025-10-17",
        "shipTo": "Ohio",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            1.0,
            1.0,
            1.0,
            1.0,
            1.0,
            1.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0178",
        "customer": "Kathryn Jarboe",
        "date": "2025-09-22",
        "shipTo": "Washington",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            10.0,
            10.0,
            4.0,
            4.0,
            4.0,
            4.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0179",
        "customer": "Preston Scott",
        "date": "2025-10-21",
        "shipTo": "Oregon",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            14.0,
            14.0,
            3.0,
            3.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0180",
        "customer": "Shari Pierson",
        "date": "2025-08-06",
        "shipTo": "Washington",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            39.0,
            39.0,
            7.0,
            7.0,
            7.0,
            7.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0181",
        "customer": "Josh Rasmason",
        "date": "2025-10-22",
        "shipTo": "Local Delivery",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            25.0,
            25.0,
            5.0,
            5.0,
            10.0,
            10.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0182",
        "customer": "3BD - Chris Lee (extra)",
        "date": "2025-10-31",
        "shipTo": "Local Install 3bd",
        "productType": "42\u201d Cable - Fascia",
        "quantities": [
            1.0,
            1.0,
            1.0,
            1.0,
            25.0,
            25.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0183",
        "customer": "Lee Shalett",
        "date": "2025-11-10",
        "shipTo": "Florida",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            14.0,
            4.0,
            8.0,
            104.0,
            600.0,
            56.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0184",
        "customer": "Gian Simsuangco",
        "date": "2025-11-25",
        "shipTo": "LaVerne CA Shipping",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            5.0,
            2.0,
            2.0,
            1.0,
            6.0,
            78.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0185",
        "customer": "Luke Welch",
        "date": "2025-12-02",
        "shipTo": "Lebanon OR",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            4.0,
            1.0,
            2.0,
            26.0,
            200.0,
            16.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0186",
        "customer": "Ser Avendeyenko",
        "date": "2025-10-30",
        "shipTo": "3bd Truck",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            8.0,
            2.0,
            2.0,
            2.0,
            6.0,
            80.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0187",
        "customer": "Michael Minka",
        "date": "2025-10-30",
        "shipTo": "California",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            1.0,
            4.0,
            5.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0188",
        "customer": "Rob Motts",
        "date": "2025-10-30",
        "shipTo": "Local Delivery",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            2.0,
            2.0,
            4.0,
            2.0,
            40.0,
            40.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0189",
        "customer": "Rick Taylor",
        "date": "2025-10-24",
        "shipTo": "Local Delivery",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            73.0,
            12.0,
            24.0,
            320.0,
            3000.0,
            292.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0190",
        "customer": "Jerry Vossberg - 10.23",
        "date": "2025-10-23",
        "shipTo": "Washington",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            26.0,
            3.0,
            3.0,
            6.0,
            14.0,
            200.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0191",
        "customer": "James Hamilton",
        "date": "2025-01-02",
        "shipTo": "California",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            23.0,
            23.0,
            4.0,
            4.0,
            14.0,
            14.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0192",
        "customer": "Shawn Ho",
        "date": "2024-12-26",
        "shipTo": "Colorado",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            4.0,
            4.0,
            1.0,
            1.0,
            1.0,
            1.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0193",
        "customer": "Kirk McElroy",
        "date": "2025-01-07",
        "shipTo": "California",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            9.0,
            9.0,
            4.0,
            4.0,
            2.0,
            2.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0194",
        "customer": "Jeff Pool",
        "date": "2025-01-03",
        "shipTo": "Burley, ID",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            2.0,
            2.0,
            3.0,
            3.0,
            3.0,
            3.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0195",
        "customer": "Michaela Loebel",
        "date": "2025-01-03",
        "shipTo": "Nebraska",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            2.0,
            2.0,
            1.0,
            1.0,
            1.0,
            1.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0196",
        "customer": "Russ Ellersick",
        "date": "2025-01-21",
        "shipTo": "Washiington",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            10.0,
            10.0,
            7.0,
            7.0,
            5.0,
            7.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0197",
        "customer": "John Sebring",
        "date": "2024-12-30",
        "shipTo": "Colorado",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            14.0,
            14.0,
            8.0,
            8.0,
            4.0,
            4.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0198",
        "customer": "Javier Rodriguez",
        "date": "2025-01-21",
        "shipTo": "Oregon",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            16.0,
            16.0,
            6.0,
            6.0,
            4.0,
            4.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0199",
        "customer": "Ben Hall",
        "date": "2025-01-21",
        "shipTo": "Missouri",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            40.0,
            40.0,
            11.0,
            11.0,
            11.0,
            11.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0200",
        "customer": "Zach Yamagishi",
        "date": "2025-02-04",
        "shipTo": "Colorado",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            16.0,
            16.0,
            64.0,
            64.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0201",
        "customer": "Paul Carpenter",
        "date": "2025-02-04",
        "shipTo": "Worley, ID",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            31.0,
            31.0,
            10.0,
            10.0,
            1.0,
            1.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0202",
        "customer": "Finish Line Cons.",
        "date": "2025-01-21",
        "shipTo": "Hayden",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            51.0,
            51.0,
            4.0,
            4.0,
            2.0,
            2.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0203",
        "customer": "Eddie - NWBNR",
        "date": "2025-02-13",
        "shipTo": "Washington",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            1.0,
            1.0,
            4.0,
            4.0,
            4.0,
            4.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0204",
        "customer": "Ryan Rauscart",
        "date": "2025-02-21",
        "shipTo": "Oregon",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            4.0,
            4.0,
            300.0,
            300.0,
            30.0,
            30.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0205",
        "customer": "Cathy Reynolds",
        "date": "2025-02-20",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            5.0,
            5.0,
            1.0,
            1.0,
            1.0,
            1.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0206",
        "customer": "John Barnwell",
        "date": "2025-03-20",
        "shipTo": "Local",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            5.0,
            5.0,
            2.0,
            2.0,
            3.0,
            3.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0207",
        "customer": "Javier Rodriguez",
        "date": "2025-03-13",
        "shipTo": "Oregon",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            10.0,
            10.0,
            2.5,
            2.5,
            10.0,
            10.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0208",
        "customer": "Tom Peterson",
        "date": "2025-02-20",
        "shipTo": "Local",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            31.0,
            31.0,
            8.0,
            8.0,
            1.0,
            1.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0209",
        "customer": "Caleb Barlow",
        "date": "2025-02-26",
        "shipTo": "Utah",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            20.0,
            20.0,
            12.0,
            12.0,
            12.0,
            12.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0210",
        "customer": "Steve Johnson",
        "date": "2025-03-04",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            14.0,
            14.0,
            2.0,
            2.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0211",
        "customer": "Zach Yamaghishi - Extra Stuff",
        "date": "2025-03-18",
        "shipTo": "Colorado",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            4.0,
            4.0,
            0.5,
            0.5
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0212",
        "customer": "Alex Dudrov",
        "date": "2025-03-28",
        "shipTo": "Local",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            16.0,
            16.0,
            4.0,
            4.0,
            8.0,
            8.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0213",
        "customer": "Mike Cloke",
        "date": "2025-03-26",
        "shipTo": "Washington",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            15.0,
            15.0,
            4.0,
            4.0,
            8.0,
            8.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0214",
        "customer": "SkyPro Remodeling - Adam Elbaz",
        "date": "2025-03-21",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            12.0,
            12.0,
            10.0,
            10.0,
            140.0,
            140.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0215",
        "customer": "Clearwater Construction",
        "date": "2025-04-09",
        "shipTo": "Washington",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            14.0,
            14.0,
            14.0,
            14.0,
            8.0,
            8.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0216",
        "customer": "Robert Gregg",
        "date": "2025-04-10",
        "shipTo": "Oregon",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            24.0,
            24.0,
            4.0,
            4.0,
            14.0,
            14.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0217",
        "customer": "Brittany Venner",
        "date": "2025-04-10",
        "shipTo": "Oregon",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            15.0,
            15.0,
            3.0,
            3.0,
            12.0,
            12.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0218",
        "customer": "John Frack",
        "date": "2025-03-21",
        "shipTo": "Local",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            8.0,
            8.0,
            3.0,
            3.0,
            3.0,
            3.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0219",
        "customer": "Rich Boyer",
        "date": "2025-04-04",
        "shipTo": "California",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            2.0,
            2.0,
            8.0,
            8.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0220",
        "customer": "Scott Andreason",
        "date": "2025-04-07",
        "shipTo": "Washington",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            34.0,
            34.0,
            3.0,
            3.0,
            5.0,
            5.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0221",
        "customer": "Pike Sowie",
        "date": "2025-03-08",
        "shipTo": "Utah",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            38.0,
            38.0,
            8.0,
            8.0,
            8.0,
            8.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0222",
        "customer": "Sage Decks - Ryan Bennet",
        "date": "2025-04-07",
        "shipTo": "Montana",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            32.0,
            32.0,
            12.0,
            12.0,
            2.0,
            2.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0223",
        "customer": "Travis Berends",
        "date": "2025-04-07",
        "shipTo": "Minnesota",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            17.0,
            17.0,
            6.0,
            6.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0224",
        "customer": "Mel Everes",
        "date": "2025-04-07",
        "shipTo": "Louisiana",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            22.0,
            22.0,
            14.0,
            14.0,
            14.0,
            14.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0225",
        "customer": "Angus McLean",
        "date": "2025-04-09",
        "shipTo": "Tennessee",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            8.0,
            8.0,
            16.0,
            16.0,
            1.0,
            1.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0226",
        "customer": "Scott Andreason - Corners",
        "date": "2025-05-12",
        "shipTo": "Washington",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            5.0,
            5.0,
            20.0,
            20.0,
            40.0,
            40.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0227",
        "customer": "Alex Dudrov - Stairs",
        "date": "2025-05-12",
        "shipTo": "Local",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            8.0,
            8.0,
            8.0,
            8.0,
            2.0,
            2.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0228",
        "customer": "3BD - Kristie Keene",
        "date": "2025-05-16",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            4.0,
            4.0,
            4.0,
            4.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0229",
        "customer": "Keith Kriegh",
        "date": "2025-04-28",
        "shipTo": "Local",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            4.0,
            4.0,
            3.0,
            3.0,
            3.0,
            3.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0230",
        "customer": "Mike Stephenson",
        "date": "2025-05-01",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            37.0,
            37.0,
            7.0,
            7.0,
            7.0,
            7.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0231",
        "customer": "HD - Patrick Targete",
        "date": "2025-05-28",
        "shipTo": "Massachusetts",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            3.0,
            3.0,
            1.0,
            1.0,
            2.0,
            2.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0232",
        "customer": "Coeur Builders - Echo Canyon",
        "date": "2025-05-15",
        "shipTo": "Local",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            36.0,
            36.0,
            6.0,
            6.0,
            12.0,
            12.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0233",
        "customer": "Cynthia Knox Guenther",
        "date": "2025-04-25",
        "shipTo": "Oregon",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            43.0,
            43.0,
            9.0,
            9.0,
            9.0,
            9.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0234",
        "customer": "Bob Burgnaler",
        "date": "2025-04-30",
        "shipTo": "Local",
        "productType": "42\u201d Cable - Surface",
        "quantities": [],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0235",
        "customer": "Mark Anderson",
        "date": "2025-05-09",
        "shipTo": "Local",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            6.0,
            6.0,
            4.0,
            4.0,
            60.0,
            60.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0236",
        "customer": "Randy Pratt",
        "date": "2025-05-12",
        "shipTo": "North Carolina",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            37.0,
            37.0,
            10.0,
            10.0,
            10.0,
            10.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0237",
        "customer": "Revolutionary Construction",
        "date": "2025-05-20",
        "shipTo": "Local",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            18.0,
            18.0,
            11.0,
            11.0,
            11.0,
            11.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0238",
        "customer": "Bob Burgnaier",
        "date": "2025-04-15",
        "shipTo": "Local",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            6.0,
            6.0,
            1.0,
            2.0,
            2.0,
            4.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0239",
        "customer": "Jon Frack",
        "date": "2025-05-09",
        "shipTo": "Local",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            22.0,
            22.0,
            8.0,
            8.0,
            8.0,
            8.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0240",
        "customer": "Jon Altman",
        "date": "2025-06-27",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            13.0,
            13.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0241",
        "customer": "Jack Rosemary",
        "date": "2025-06-23",
        "shipTo": "Local",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            5.0,
            5.0,
            1.0,
            1.0,
            4.0,
            4.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0242",
        "customer": "Cathie Haas - Remake",
        "date": "2025-06-05",
        "shipTo": "Local Install",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            12.0,
            12.0,
            6.0,
            6.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0243",
        "customer": "Jerry / Kathy Vosberg",
        "date": "2025-05-13",
        "shipTo": "Washington",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            22.0,
            22.0,
            4.0,
            4.0,
            20.0,
            20.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0244",
        "customer": "Craig Johnson - Extra",
        "date": "2025-07-02",
        "shipTo": "Washington",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            2.0,
            2.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0245",
        "customer": "3BD - Jeanne Foss",
        "date": "2025-07-01",
        "shipTo": "Local Install",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            9.0,
            9.0,
            5.0,
            5.0,
            5.0,
            5.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0246",
        "customer": "Ziggys - Collen Ewasko",
        "date": "2025-06-19",
        "shipTo": "Local",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            22.0,
            22.0,
            4.0,
            4.0,
            1.0,
            1.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0247",
        "customer": "Menno Vanderlist",
        "date": "2025-06-19",
        "shipTo": "Washington",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            6.0,
            6.0,
            4.0,
            4.0,
            60.0,
            60.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0248",
        "customer": "Alison West",
        "date": "2025-06-19",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            4.0,
            4.0,
            12.0,
            12.0,
            12.0,
            12.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0249",
        "customer": "3BD - Reid Redinger",
        "date": "2025-07-28",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            34.0,
            34.0,
            3.0,
            3.0,
            5.0,
            5.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0250",
        "customer": "Sarah Olney",
        "date": "2025-07-23",
        "shipTo": "Local Delivery",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            24.0,
            24.0,
            8.0,
            8.0,
            8.0,
            8.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0251",
        "customer": "Craig Charbonneau",
        "date": "2025-08-04",
        "shipTo": "Washington",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            12.0,
            12.0,
            3.0,
            3.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0252",
        "customer": "Greg Hart",
        "date": "2025-07-30",
        "shipTo": "Local Install",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            35.0,
            35.0,
            8.0,
            8.0,
            8.0,
            8.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0253",
        "customer": "Lisa & Ryan Carpenter",
        "date": "2025-08-21",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            35.0,
            35.0,
            10.0,
            10.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0254",
        "customer": "Duane Klinge",
        "date": "2025-08-12",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            3.0,
            3.0,
            2.0,
            2.0,
            40.0,
            40.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0255",
        "customer": "River A Construction",
        "date": "2025-08-20",
        "shipTo": "Oregon",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            20.0,
            20.0,
            4.0,
            4.0,
            10.0,
            10.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0256",
        "customer": "Sheila",
        "date": "2025-08-13",
        "shipTo": "Local Install",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            7.0,
            7.0,
            7.0,
            7.0,
            7.0,
            7.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0257",
        "customer": "Cecil Roby, Jr.",
        "date": "2025-08-11",
        "shipTo": "Local Pick-Up",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            5.0,
            5.0,
            5.0,
            5.0,
            1.0,
            1.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0258",
        "customer": "Nick Haughn",
        "date": "2025-08-29",
        "shipTo": "Local Pick-Up",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            6.0,
            6.0,
            6.0,
            6.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0259",
        "customer": "Ziggy's - Collen Ewasko",
        "date": "2025-09-11",
        "shipTo": "Local Pick-Up",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            15.0,
            15.0,
            15.0,
            15.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0260",
        "customer": "Todd Folsom",
        "date": "2025-09-08",
        "shipTo": "Local Pick-Up",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            3.0,
            3.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0261",
        "customer": "Mercado Brothers Fencing",
        "date": "2025-08-25",
        "shipTo": "Seattle",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            29.0,
            29.0,
            5.0,
            5.0,
            12.0,
            12.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0262",
        "customer": "Maria Miller",
        "date": "2025-08-28",
        "shipTo": "Oregon",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            6.0,
            6.0,
            6.0,
            6.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0263",
        "customer": "Glenn Boarman - Extra",
        "date": "2025-08-20",
        "shipTo": "Colorado",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            10.0,
            10.0,
            10.0,
            10.0,
            10.0,
            10.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0264",
        "customer": "Kelly Crandell",
        "date": "2025-08-29",
        "shipTo": "California",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            16.0,
            16.0,
            2.0,
            2.0,
            2.0,
            2.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0265",
        "customer": "Justin Ryan",
        "date": "2025-09-08",
        "shipTo": "California",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            24.0,
            24.0,
            7.0,
            7.0,
            7.0,
            7.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0266",
        "customer": "Sean Slaughter",
        "date": "2025-08-29",
        "shipTo": "Local Delivery",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            16.0,
            16.0,
            4.0,
            4.0,
            8.0,
            8.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0267",
        "customer": "Richard Weatherman",
        "date": "2025-09-24",
        "shipTo": "Local Delivery",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            27.0,
            27.0,
            3.0,
            3.0,
            3.0,
            3.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0268",
        "customer": "Mike Ellison",
        "date": "2025-09-22",
        "shipTo": "Local Install",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            2.0,
            2.0,
            4.0,
            4.0,
            1.0,
            1.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0269",
        "customer": "Chris Saliture",
        "date": "2025-10-07",
        "shipTo": "Minnesota",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            8.0,
            8.0,
            8.0,
            8.0,
            60.0,
            60.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0270",
        "customer": "Josh Rasmuson",
        "date": "2025-10-22",
        "shipTo": "Local Delivery",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            2.0,
            2.0,
            12.0,
            12.0,
            12.0,
            12.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0271",
        "customer": "Patricia Mather",
        "date": "2025-10-22",
        "shipTo": "California",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            29.0,
            29.0,
            7.0,
            7.0,
            24.0,
            24.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0272",
        "customer": "David Maffetore",
        "date": "2025-10-20",
        "shipTo": "California",
        "productType": "42\u201d Cable - Surface",
        "quantities": [
            10.0,
            10.0,
            3.0,
            3.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0273",
        "customer": "Dave Miller",
        "date": "2025-11-21",
        "shipTo": "Delaware",
        "productType": "42\u201d Glass - Fascia",
        "quantities": [
            12.0,
            2.0,
            4.0,
            36.0,
            24.0,
            40.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0274",
        "customer": "Cass Monroe",
        "date": "2025-01-21",
        "shipTo": "Seattle",
        "productType": "42\u201d Glass - Fascia",
        "quantities": [
            13.0,
            13.0,
            2.0,
            2.0,
            5.0,
            5.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0275",
        "customer": "3BD - Larry McNutt",
        "date": "2025-01-29",
        "shipTo": "Seattle",
        "productType": "42\u201d Glass - Fascia",
        "quantities": [
            30.0,
            30.0,
            24.0,
            24.0,
            10.0,
            10.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0276",
        "customer": "3BD - Gilbo",
        "date": "2025-02-09",
        "shipTo": "Seattle",
        "productType": "42\u201d Glass - Fascia",
        "quantities": [
            16.0,
            16.0,
            4.0,
            4.0,
            4.0,
            4.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0277",
        "customer": "3BD - Larry McNutt (extra posts)",
        "date": "2025-02-28",
        "shipTo": "Seattle",
        "productType": "42\u201d Glass - Fascia",
        "quantities": [
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0278",
        "customer": "Lillian Xiong - REWORK",
        "date": "2025-03-24",
        "shipTo": "Seattle",
        "productType": "42\u201d Glass - Fascia",
        "quantities": [
            25.0,
            25.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0279",
        "customer": "Johnathan Moeller",
        "date": "2025-03-18",
        "shipTo": "Colorado",
        "productType": "42\u201d Glass - Fascia",
        "quantities": [
            20.0,
            20.0,
            76.0,
            76.0,
            80.0,
            80.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0280",
        "customer": "Troy Hoerner",
        "date": "2025-06-09",
        "shipTo": "Local",
        "productType": "42\u201d Glass - Fascia",
        "quantities": [
            7.0,
            7.0,
            2.0,
            2.0,
            2.0,
            2.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0281",
        "customer": "Phil Virgil",
        "date": "2025-05-07",
        "shipTo": "Wyoming",
        "productType": "42\u201d Glass - Fascia",
        "quantities": [
            23.0,
            23.0,
            5.0,
            5.0,
            14.0,
            14.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0282",
        "customer": "Kurt Mueller",
        "date": "2025-06-12",
        "shipTo": "North Carolina",
        "productType": "42\u201d Glass - Fascia",
        "quantities": [
            14.0,
            14.0,
            6.0,
            6.0,
            12.0,
            12.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0283",
        "customer": "3BD - Lillian Xiong",
        "date": "2025-07-29",
        "shipTo": "Seattle",
        "productType": "42\u201d Glass - Fascia",
        "quantities": [
            27.0,
            27.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0284",
        "customer": "3BD - Graham Johnson",
        "date": "2025-09-03",
        "shipTo": "Seattle",
        "productType": "42\u201d Glass - Fascia",
        "quantities": [
            11.0,
            2.0,
            2.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0285",
        "customer": "3BD - Chris Lee (extra)",
        "date": "2025-10-31",
        "shipTo": "Local Install",
        "productType": "42\u201d Glass - Fascia",
        "quantities": [
            2.0,
            2.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0286",
        "customer": "Finish Line Cons",
        "date": "2025-01-29",
        "shipTo": "Seattle",
        "productType": "42\u201d Glass - Surface",
        "quantities": [
            24.0,
            24.0,
            18.0,
            18.0,
            92.0,
            92.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0287",
        "customer": "3BD - Lillian Xiong",
        "date": "2025-01-21",
        "shipTo": "Hayden",
        "productType": "42\u201d Glass - Surface",
        "quantities": [
            10.0,
            10.0,
            3.0,
            3.0,
            8.0,
            8.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0288",
        "customer": "Finish Line Const - Missing Posts",
        "date": "2025-02-27",
        "shipTo": "Seattle",
        "productType": "42\u201d Glass - Surface",
        "quantities": [
            22.0,
            22.0,
            6.0,
            6.0,
            9.0,
            9.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0289",
        "customer": "3BD - Sam Riedeman (CUSTOM)",
        "date": "2025-03-11",
        "shipTo": "Local",
        "productType": "42\u201d Glass - Surface",
        "quantities": [
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0290",
        "customer": "???",
        "date": "2025-03-27",
        "shipTo": "Seattle",
        "productType": "42\u201d Glass - Surface",
        "quantities": [
            10.0,
            10.0,
            3.0,
            3.0,
            4.0,
            4.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0291",
        "customer": "Kurt Mueller",
        "date": "2025-06-12",
        "shipTo": "North Carolina",
        "productType": "42\u201d Glass - Surface",
        "quantities": [
            21.0,
            21.0,
            2.0,
            2.0,
            16.0,
            16.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0292",
        "customer": "Ziggy's - Megan Dietz",
        "date": "2025-07-23",
        "shipTo": "Local Delivery",
        "productType": "42\u201d Glass - Surface",
        "quantities": [
            13.0,
            13.0,
            3.0,
            3.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0293",
        "customer": "3BD - Serren Wrap",
        "date": "2025-08-11",
        "shipTo": "Seattle",
        "productType": "42\u201d Glass - Surface",
        "quantities": [
            12.0,
            12.0,
            18.0,
            18.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0294",
        "customer": "Tessa Dover",
        "date": "2025-08-20",
        "shipTo": "Seattle",
        "productType": "42\u201d Glass - Surface",
        "quantities": [
            6.0,
            6.0,
            1.0,
            1.0,
            2.0,
            2.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0295",
        "customer": "3BD - Lillian Xiong Interior",
        "date": "2025-10-17",
        "shipTo": "Seattle",
        "productType": "42\u201d Glass - Surface",
        "quantities": [
            5.0,
            5.0,
            12.0,
            12.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0296",
        "customer": "Jax (GFY Homes)",
        "date": "2025-11-03",
        "shipTo": "Bellevue P/U",
        "productType": "36\u201d Cable - Fascia",
        "quantities": [
            17.0,
            4.0,
            4.0,
            5.0,
            12.0,
            156.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0297",
        "customer": "Doug Dodson",
        "date": "2025-11-12",
        "shipTo": "Local Install",
        "productType": "36\u201d Cable - Fascia",
        "quantities": [
            21.0,
            2.0,
            12.0,
            156.0,
            800.0,
            42.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0298",
        "customer": "Maureen Ramirez",
        "date": "2025-11-12",
        "shipTo": "Local Install",
        "productType": "36\u201d Cable - Fascia",
        "quantities": [
            31.0,
            8.0,
            8.0,
            5.0,
            22.0,
            286.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0299",
        "customer": "Josh Taylor",
        "date": "2025-11-20",
        "shipTo": "Local Pickup",
        "productType": "36\u201d Cable - Fascia",
        "quantities": [
            17.0,
            3.0,
            8.0,
            104.0,
            700.0,
            34.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0300",
        "customer": "Sarah Stone",
        "date": "2025-11-25",
        "shipTo": "Deliver to Freeland",
        "productType": "36\u201d Cable - Fascia",
        "quantities": [
            20.0,
            4.0,
            10.0,
            130.0,
            800.0,
            40.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0301",
        "customer": "Tami Neumann",
        "date": "2024-12-27",
        "shipTo": "Seattle",
        "productType": "36\u201d Cable - Fascia",
        "quantities": [
            31.0,
            31.0,
            6.0,
            6.0,
            16.0,
            220.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0302",
        "customer": "Tami Neumann (Rework)",
        "date": "2024-12-27",
        "shipTo": "Oregon",
        "productType": "36\u201d Cable - Fascia",
        "quantities": [
            31.0,
            31.0,
            10.0,
            10.0,
            10.0,
            10.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0303",
        "customer": "Jason Everett",
        "date": "2025-01-21",
        "shipTo": "Oregon",
        "productType": "36\u201d Cable - Fascia",
        "quantities": [
            31.0,
            31.0,
            10.0,
            10.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0304",
        "customer": "Chris Gonzalez",
        "date": "2025-03-13",
        "shipTo": "California",
        "productType": "36\u201d Cable - Fascia",
        "quantities": [
            22.0,
            22.0,
            4.0,
            4.0,
            10.0,
            10.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0305",
        "customer": "Jonathan Callans",
        "date": "2025-03-11",
        "shipTo": "Texas",
        "productType": "36\u201d Cable - Fascia",
        "quantities": [
            38.0,
            38.0,
            6.0,
            6.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0306",
        "customer": "Trevor Nowak",
        "date": "2025-03-11",
        "shipTo": "Washington",
        "productType": "36\u201d Cable - Fascia",
        "quantities": [
            5.0,
            5.0,
            2.0,
            2.0,
            2.0,
            2.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0307",
        "customer": "Ruben Lutat",
        "date": "2025-03-01",
        "shipTo": "Portland",
        "productType": "36\u201d Cable - Fascia",
        "quantities": [
            15.0,
            15.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0308",
        "customer": "Steve Anderson",
        "date": "2025-04-01",
        "shipTo": "Seatle",
        "productType": "36\u201d Cable - Fascia",
        "quantities": [
            34.0,
            34.0,
            5.0,
            5.0,
            5.0,
            5.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0309",
        "customer": "3BD - Ralph Mundell",
        "date": "2025-04-02",
        "shipTo": "Seattle",
        "productType": "36\u201d Cable - Fascia",
        "quantities": [
            21.0,
            21.0,
            5.0,
            5.0,
            14.0,
            14.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0310",
        "customer": "Greg Metzgar",
        "date": "2025-04-18",
        "shipTo": "Seattle",
        "productType": "36\u201d Cable - Fascia",
        "quantities": [
            21.0,
            21.0,
            4.0,
            4.0,
            12.0,
            12.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0311",
        "customer": "Legacy Decking - Dave Deyman",
        "date": "2025-04-18",
        "shipTo": "Local p/iu",
        "productType": "36\u201d Cable - Fascia",
        "quantities": [
            23.0,
            23.0,
            8.0,
            8.0,
            8.0,
            8.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0312",
        "customer": "Abby Thostenson",
        "date": "2025-05-15",
        "shipTo": "Seattle",
        "productType": "36\u201d Cable - Fascia",
        "quantities": [
            24.0,
            24.0,
            6.0,
            6.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0313",
        "customer": "Stephanie Queen",
        "date": "2025-05-16",
        "shipTo": "Michigan",
        "productType": "36\u201d Cable - Fascia",
        "quantities": [
            17.0,
            17.0,
            8.0,
            8.0,
            8.0,
            8.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0314",
        "customer": "Simon Lystad",
        "date": "2025-05-21",
        "shipTo": "Washington",
        "productType": "36\u201d Cable - Fascia",
        "quantities": [
            12.0,
            12.0,
            2.0,
            2.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0315",
        "customer": "Ben Murphy - Spirt Lake 2",
        "date": "2025-06-27",
        "shipTo": "Seattle",
        "productType": "36\u201d Cable - Fascia",
        "quantities": [
            21.0,
            21.0,
            10.0,
            10.0,
            10.0,
            10.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0316",
        "customer": "Deni Liechty",
        "date": "2025-08-04",
        "shipTo": "Local Pick-up",
        "productType": "36\u201d Cable - Fascia",
        "quantities": [
            19.0,
            19.0,
            4.0,
            4.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0317",
        "customer": "Matt Reichert - Smith",
        "date": "2025-08-15",
        "shipTo": "Arizona",
        "productType": "36\u201d Cable - Fascia",
        "quantities": [
            24.0,
            24.0,
            10.0,
            10.0,
            12.0,
            12.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0318",
        "customer": "Curtis Kiepprien",
        "date": "2025-08-12",
        "shipTo": "Local Delivery",
        "productType": "36\u201d Cable - Fascia",
        "quantities": [
            12.0,
            12.0,
            12.0,
            12.0,
            12.0,
            12.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0319",
        "customer": "McMorris Decks and Structures",
        "date": "2025-08-21",
        "shipTo": "Washington",
        "productType": "36\u201d Cable - Fascia",
        "quantities": [
            45.0,
            45.0,
            10.0,
            10.0,
            10.0,
            10.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0320",
        "customer": "Nicholas Bincewski",
        "date": "2025-08-25",
        "shipTo": "Utah",
        "productType": "36\u201d Cable - Fascia",
        "quantities": [
            15.0,
            15.0,
            4.0,
            4.0,
            8.0,
            8.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0321",
        "customer": "Matthew Siegel",
        "date": "2025-08-20",
        "shipTo": "Local Delivery",
        "productType": "36\u201d Cable - Fascia",
        "quantities": [
            32.0,
            32.0,
            20.0,
            20.0,
            20.0,
            20.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0322",
        "customer": "3BD - Graham Johnson REWORK",
        "date": "2025-09-05",
        "shipTo": "Washington",
        "productType": "36\u201d Cable - Fascia",
        "quantities": [
            26.0,
            26.0,
            5.0,
            5.0,
            12.0,
            12.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0323",
        "customer": "David Pelton",
        "date": "2025-09-10",
        "shipTo": "Seattle",
        "productType": "36\u201d Cable - Fascia",
        "quantities": [
            7.0,
            7.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0324",
        "customer": "3BD - Carolyne Michels (CUSTOM COLOR)",
        "date": "2025-09-16",
        "shipTo": "Washington",
        "productType": "36\u201d Cable - Fascia",
        "quantities": [
            15.0,
            15.0,
            12.0,
            12.0,
            12.0,
            15.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0325",
        "customer": "Cole Ferguson",
        "date": "2025-09-24",
        "shipTo": "Seattle",
        "productType": "36\u201d Cable - Fascia",
        "quantities": [
            62.0,
            62.0,
            20.0,
            20.0,
            3.0,
            3.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0326",
        "customer": "Rick Taylor",
        "date": "2025-09-30",
        "shipTo": "Local Pick-up",
        "productType": "36\u201d Cable - Fascia",
        "quantities": [
            50.0,
            50.0,
            2.0,
            2.0,
            2.0,
            2.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0327",
        "customer": "Karen Weber",
        "date": "2025-10-16",
        "shipTo": "Local Delivery",
        "productType": "36\u201d Cable - Fascia",
        "quantities": [
            5.0,
            5.0,
            4.0,
            4.0,
            4.0,
            4.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0328",
        "customer": "James Thomas, Jr",
        "date": "2025-10-16",
        "shipTo": "Bellevue P/U",
        "productType": "36\u201d Cable - Fascia",
        "quantities": [
            9.0,
            9.0,
            2.0,
            2.0,
            4.0,
            4.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0329",
        "customer": "Alex Avdeyev",
        "date": "2025-10-15",
        "shipTo": "Arizona",
        "productType": "36\u201d Cable - Fascia",
        "quantities": [
            19.0,
            19.0,
            3.0,
            3.0,
            12.0,
            12.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0330",
        "customer": "Linda Carpenter",
        "date": "2025-10-20",
        "shipTo": "Local Delivery",
        "productType": "36\u201d Cable - Fascia",
        "quantities": [
            41.0,
            41.0,
            4.0,
            4.0,
            4.0,
            4.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0331",
        "customer": "Bellevue Inventory - Week of 11.03",
        "date": "2025-11-03",
        "shipTo": "Seattle",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            30.0,
            20.0,
            10.0,
            20.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0332",
        "customer": "Jared Mehany",
        "date": "2025-10-29",
        "shipTo": "Washington",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            13.0,
            2.0,
            4.0,
            8.0,
            120.0,
            1000.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0333",
        "customer": "Harold Gambini",
        "date": "2025-01-23",
        "shipTo": "Seattle",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            31.0,
            31.0,
            124.0,
            124.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0334",
        "customer": "Landon McMorris",
        "date": "2025-02-17",
        "shipTo": "Utah",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            4.0,
            4.0,
            1.0,
            1.0,
            2.0,
            2.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0335",
        "customer": "Cheri Douglas",
        "date": "2025-02-17",
        "shipTo": "Wisconsin",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            4.0,
            4.0,
            1.0,
            1.0,
            4.0,
            4.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0336",
        "customer": "Todd Hodgen (CUSTOM)",
        "date": "2025-02-17",
        "shipTo": "Nevada",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            6.0,
            6.0,
            6.0,
            6.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0337",
        "customer": "Ruban Hipolito",
        "date": "2025-03-14",
        "shipTo": "Montana",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            28.0,
            28.0,
            12.0,
            12.0,
            2.0,
            2.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0338",
        "customer": "Buildsphere - Mike Ujano",
        "date": "2025-02-21",
        "shipTo": "Seattle",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            14.0,
            14.0,
            3.0,
            3.0,
            8.0,
            8.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0339",
        "customer": "Steve Anderson",
        "date": "2025-04-02",
        "shipTo": "Seatlle",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            4.0,
            4.0,
            35.0,
            35.0,
            35.0,
            35.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0340",
        "customer": "Claudia Scruzr",
        "date": "2025-04-21",
        "shipTo": "Washington",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            3.0,
            3.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0341",
        "customer": "Bridget Findley",
        "date": "2025-04-30",
        "shipTo": "Washington",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            9.0,
            9.0,
            2.0,
            2.0,
            4.0,
            4.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0342",
        "customer": "Doug Smith",
        "date": "2025-04-16",
        "shipTo": "Local",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            35.0,
            35.0,
            8.0,
            8.0,
            9.0,
            9.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0343",
        "customer": "Carolyn Neblett",
        "date": "2025-04-22",
        "shipTo": "Idaho",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            2.0,
            2.0,
            4.0,
            4.0,
            4.0,
            4.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0344",
        "customer": "Cami Fleming",
        "date": "2025-05-07",
        "shipTo": "Utah",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            28.0,
            28.0,
            3.0,
            3.0,
            3.0,
            3.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0345",
        "customer": "Brady Frandsen",
        "date": "2025-05-14",
        "shipTo": "Utah",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            26.0,
            26.0,
            18.0,
            18.0,
            18.0,
            18.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0346",
        "customer": "Craig Johnson",
        "date": "2025-05-29",
        "shipTo": "Washington",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            20.0,
            20.0,
            5.0,
            5.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0347",
        "customer": "Gibson Fence and Deck",
        "date": "2025-05-22",
        "shipTo": "Seattle",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            23.0,
            23.0,
            5.0,
            5.0,
            12.0,
            12.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0348",
        "customer": "Sarah Cichosz - Columbia Pools",
        "date": "2025-05-29",
        "shipTo": "Washington",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            9.0,
            9.0,
            6.0,
            6.0,
            80.0,
            80.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0349",
        "customer": "Blue Sky Decks - Patrick",
        "date": "2025-06-03",
        "shipTo": "Local Pick-UP",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            13.0,
            13.0,
            2.0,
            2.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0350",
        "customer": "Vitaly Semenyuk",
        "date": "2025-06-23",
        "shipTo": "Seattle",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            18.0,
            18.0,
            4.0,
            4.0,
            8.0,
            8.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0351",
        "customer": "SkyPro - RUSH",
        "date": "2025-05-28",
        "shipTo": "Seattle",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            9.0,
            9.0,
            4.0,
            4.0,
            4.0,
            4.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0352",
        "customer": "Tessa Fitzgerald",
        "date": "2025-06-11",
        "shipTo": "Seattle",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            13.0,
            13.0,
            2.0,
            2.0,
            4.0,
            4.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0353",
        "customer": "Craig Johnson",
        "date": "2025-07-21",
        "shipTo": "Washington",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            11.0,
            11.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0354",
        "customer": "Nate Lew",
        "date": "2025-07-25",
        "shipTo": "Seattle",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            19.0,
            19.0,
            3.0,
            3.0,
            1.0,
            1.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0355",
        "customer": "Lynn Bull",
        "date": "2025-08-19",
        "shipTo": "Local Delivery",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            11.0,
            11.0,
            3.0,
            3.0,
            8.0,
            8.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0356",
        "customer": "Kirk Johnson",
        "date": "2025-08-04",
        "shipTo": "Colorado",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            4.0,
            4.0,
            8.0,
            8.0,
            8.0,
            8.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0357",
        "customer": "3BD Inventory - Week of 08.18",
        "date": "2025-08-18",
        "shipTo": "Seattle",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            30.0,
            30.0,
            10.0,
            10.0,
            10.0,
            10.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0358",
        "customer": "Robert Gregg - Exchange",
        "date": "2025-08-06",
        "shipTo": "Oregon",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            20.0,
            20.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0359",
        "customer": "Jeremy Falls",
        "date": "2025-08-14",
        "shipTo": "Seattle",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            21.0,
            21.0,
            8.0,
            8.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0360",
        "customer": "Deni Liechty",
        "date": "2025-08-15",
        "shipTo": "Arizona",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            13.0,
            13.0,
            16.0,
            16.0,
            220.0,
            220.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0361",
        "customer": "3BD Inventory - Week of 08.25",
        "date": "2025-08-15",
        "shipTo": "Seattle",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            30.0,
            30.0,
            10.0,
            10.0,
            10.0,
            10.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0362",
        "customer": "Pike Sowie - Replacement",
        "date": "2025-08-15",
        "shipTo": "Utah",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            32.0,
            32.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0363",
        "customer": "Samantha Buckley Huggessen",
        "date": "2025-08-15",
        "shipTo": "California",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            51.0,
            51.0,
            12.0,
            12.0,
            4.0,
            4.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0364",
        "customer": "Deni Liechty",
        "date": "2025-08-15",
        "shipTo": "Arizona",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            14.0,
            14.0,
            400.0,
            400.0,
            100.0,
            100.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0365",
        "customer": "Matt Reichert - Park",
        "date": "2025-08-15",
        "shipTo": "Local Delivery",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            16.0,
            16.0,
            14.0,
            14.0,
            14.0,
            14.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0366",
        "customer": "Cory Michaels",
        "date": "2025-08-22",
        "shipTo": "Washington",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            13.0,
            13.0,
            8.0,
            8.0,
            8.0,
            8.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0367",
        "customer": "Karen Gorzela",
        "date": "2025-08-13",
        "shipTo": "Seattle",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            6.0,
            6.0,
            2.0,
            2.0,
            2.0,
            2.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0368",
        "customer": "Curtis Kiepprien",
        "date": "2025-08-21",
        "shipTo": "Washington",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            4.0,
            4.0,
            1.0,
            1.0,
            40.0,
            40.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0369",
        "customer": "3BD Inventory - Week of Setp 01",
        "date": "2025-08-25",
        "shipTo": "Seattle",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            30.0,
            30.0,
            10.0,
            10.0,
            10.0,
            10.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0370",
        "customer": "Todd Folsom",
        "date": "2025-09-15",
        "shipTo": "Local Pick-Up",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            3.0,
            3.0,
            3.0,
            3.0,
            12.0,
            12.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0371",
        "customer": "Pike Sowie - Swap",
        "date": "2025-09-09",
        "shipTo": "Utah",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            32.0,
            32.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0372",
        "customer": "3BD Inventory - Week of Sept 08",
        "date": "2025-09-01",
        "shipTo": "Seattle",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            10.0,
            10.0,
            10.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0373",
        "customer": "Cami Fleming",
        "date": "2010-09-09",
        "shipTo": "Utah",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            21.0,
            21.0,
            86.0,
            86.0,
            86.0,
            86.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0374",
        "customer": "Steve Dow",
        "date": "2025-09-25",
        "shipTo": "Local Pick-Up",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            37.0,
            37.0,
            8.0,
            8.0,
            18.0,
            18.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0375",
        "customer": "Trevor Engman",
        "date": "2025-09-22",
        "shipTo": "Idaho",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            4.0,
            4.0,
            2.0,
            2.0,
            2.0,
            2.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0376",
        "customer": "Doug Geltz",
        "date": "2025-09-29",
        "shipTo": "Oregon",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            27.0,
            27.0,
            8.0,
            8.0,
            8.0,
            8.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0377",
        "customer": "Ron Erickson - CUSTOM COLOR",
        "date": "2025-09-22",
        "shipTo": "Local Pick-Up",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            36.0,
            36.0,
            2.0,
            2.0,
            6.0,
            6.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0378",
        "customer": "Debie Phillips",
        "date": "2025-10-07",
        "shipTo": "Local Delivery",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            9.0,
            9.0,
            4.0,
            4.0,
            4.0,
            4.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0379",
        "customer": "Jesse Farrar - Dragoon Dr - CUSTOM COLOR",
        "date": "2025-10-10",
        "shipTo": "Local Pick-Up",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            27.0,
            27.0,
            6.0,
            6.0,
            18.0,
            18.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0380",
        "customer": "Kelly Crandell - Extra",
        "date": "2025-10-17",
        "shipTo": "California",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            7.0,
            7.0,
            7.0,
            7.0,
            5.0,
            5.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0381",
        "customer": "John Frack",
        "date": "2025-10-22",
        "shipTo": "Local Pick-up",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            8.0,
            8.0,
            3.0,
            3.0,
            3.0,
            3.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0382",
        "customer": "MSHS Construction - John Ashline",
        "date": "2025-10-23",
        "shipTo": "Local Pick-Up",
        "productType": "36\u201d Cable - Suface",
        "quantities": [
            13.0,
            13.0,
            8.0,
            8.0,
            8.0,
            8.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0383",
        "customer": "Curtis Kiepprien",
        "date": "2025-08-21",
        "shipTo": "Washington",
        "productType": "36\u201d Glass - Fascia",
        "quantities": [
            6.0,
            6.0,
            20.0,
            20.0,
            24.0,
            24.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0384",
        "customer": "3BD - Graham Johnson REWORK",
        "date": "2025-09-11",
        "shipTo": "Seattle",
        "productType": "36\u201d Glass - Fascia",
        "quantities": [
            12.0,
            12.0,
            2.0,
            2.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0385",
        "customer": "Shauny Jang",
        "date": "2025-11-26",
        "shipTo": "Bellevue Pickup",
        "productType": "36\u201d Glass - Surface",
        "quantities": [
            3.0,
            1.0,
            2.0,
            8.0,
            12.0,
            16.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0386",
        "customer": "Steve Anderson",
        "date": "2025-04-02",
        "shipTo": "Seattle",
        "productType": "36\u201d Glass - Surface",
        "quantities": [
            5.0,
            5.0,
            2.0,
            2.0,
            4.0,
            4.0
        ],
        "source": "Pre-2026 ERP"
    },
    {
        "id": "LEG-0387",
        "customer": "Stephanie Burgess",
        "date": "2025-09-22",
        "shipTo": "Washington",
        "productType": "Frameless Glass - Fascia",
        "quantities": [
            42.0,
            42.0,
            54.0,
            54.0,
            84.0,
            84.0
        ],
        "source": "Pre-2026 ERP"
    }
],

  // ERP.xlsx (pre-2026) — Legacy raw stock (different ID convention, historical baseline)
  legacyRawStock: [
    {
        "id": "TB-SQ-6160AL 2 x 2 x 0.125 x 240",
        "desc": "Tube | Square | Aluminum | 2 x 2 x 1/8 x 20 ft",
        "stdLenFt": 20.0,
        "qtyOH": 19.0,
        "totalFt": 380.0,
        "usedFor": "Posts"
    },
    {
        "id": "TB-SQ-6160AL 0.75 x 0.75 x 240",
        "desc": "Tube | Square | Aluminum | 3/4 x 3/4 x 1/8 x 20 ft",
        "stdLenFt": 240.0,
        "qtyOH": 0,
        "totalFt": 0.0,
        "usedFor": "Pickets"
    },
    {
        "id": "TB-SQ-6160AL 1 x 1 x 0.125 x 240",
        "desc": "Tube | Square | Aluminum | 1 x 1 x 1/8 x 20 ft",
        "stdLenFt": 20.0,
        "qtyOH": 0,
        "totalFt": 0.0,
        "usedFor": "Pickets"
    },
    {
        "id": "TB-SQ-6160AL 1 x 1 x 0.125 x 72",
        "desc": "Tube | Square | Aluminum | 1 x 1 x 1/8 x 6 ft",
        "stdLenFt": 6.0,
        "qtyOH": 0,
        "totalFt": 0.0,
        "usedFor": "Pickets"
    },
    {
        "id": "TB-RECT-6160AL 1 x 3 x 0.125 x 240",
        "desc": "Tube | Square | Aluminum | 1 x 3 x 1/8 x 20 ft",
        "stdLenFt": 20.0,
        "qtyOH": 0,
        "totalFt": 0.0,
        "usedFor": "Rails, Top and Stair"
    },
    {
        "id": "TB-RECT-6160AL 1 x 2 x 0.125 x 240",
        "desc": "Tube | Square | Aluminum | 1 x 2 x 1/8 x 20 ft",
        "stdLenFt": 20.0,
        "qtyOH": 0,
        "totalFt": 0.0,
        "usedFor": "Handrail"
    },
    {
        "id": "L-6160AL 1.5 x 1.5 x 0.125 x 192",
        "desc": "Angle | 90 | Aluminum | 1.5 x 1.5 x 1/8 x 24 ft",
        "stdLenFt": 24.0,
        "qtyOH": 0,
        "totalFt": 0.0,
        "usedFor": "Top Plates / Corner Posts"
    },
    {
        "id": "L-6160AL 4 x 2 x 0.125 x 192",
        "desc": "Angle | 90 | Aluminum | 4 x 2 x 1/8 x 16 ft",
        "stdLenFt": 16.0,
        "qtyOH": 0,
        "totalFt": 0.0,
        "usedFor": "FM Plates / Bottom / Corner Posts'"
    },
    {
        "id": "L-6160AL 4 x 2 x 0.250 x 240",
        "desc": "Angle | 90 | Aluminum | 4 x 2 x 1/4 x 20 ft",
        "stdLenFt": 20.0,
        "qtyOH": 0,
        "totalFt": 0.0,
        "usedFor": "Posts / Fascia Mount / Corner"
    },
    {
        "id": "FB-6160AL 2 x 0.125 x 120",
        "desc": "Flat Bar | Aluminum | 2 x 1/8 x 10 ft",
        "stdLenFt": 10.0,
        "qtyOH": 0,
        "totalFt": 0.0,
        "usedFor": "Plate, Top"
    },
    {
        "id": "FB-6160AL 4 x 0.250 x 120",
        "desc": "Flat Bar | Aluminum | 4 x 1/4 x 12 ft",
        "stdLenFt": 12.0,
        "qtyOH": 0,
        "totalFt": 0.0,
        "usedFor": "Plate, Surface Mount"
    }
],

  // Process_Cost_Analysis_v9 — Per-station cost + daily output (was empty [])
  costPerStation: [
    {
        "station": "1. Material Cutting",
        "timePerSectionMin": 7.08,
        "sectionsPerHour": 8.47,
        "sectionsPerDay": 2.0,
        "laborDollarDay": 7.33,
        "consumableDollarDay": 0.49,
        "totalProcessDollarDay": 7.91,
        "notes": ""
    },
    {
        "station": "1B. Manual Drilling (Drill Press)",
        "timePerSectionMin": 12.0,
        "sectionsPerHour": 5.0,
        "sectionsPerDay": 1.0,
        "laborDollarDay": 6.21,
        "consumableDollarDay": 0.01,
        "totalProcessDollarDay": 0.0,
        "notes": ""
    },
    {
        "station": "2. CNC Machining",
        "timePerSectionMin": 37.0,
        "sectionsPerHour": 5.0,
        "sectionsPerDay": 1.0,
        "laborDollarDay": 21.65,
        "consumableDollarDay": 1.64,
        "totalProcessDollarDay": 54.94,
        "notes": ""
    },
    {
        "station": "3. Welding & Fabrication",
        "timePerSectionMin": 5.5,
        "sectionsPerHour": 1.62,
        "sectionsPerDay": 0.0,
        "laborDollarDay": 2.97,
        "consumableDollarDay": 1.59,
        "totalProcessDollarDay": 4.71,
        "notes": ""
    },
    {
        "station": "4. Powder Coat Prep",
        "timePerSectionMin": 41.5,
        "sectionsPerHour": 10.91,
        "sectionsPerDay": 3.0,
        "laborDollarDay": 0.0,
        "consumableDollarDay": 0.0,
        "totalProcessDollarDay": 0.0,
        "notes": ""
    },
    {
        "station": "5. Powder Coating",
        "timePerSectionMin": 7.25,
        "sectionsPerHour": 1.45,
        "sectionsPerDay": 0.0,
        "laborDollarDay": 11.26,
        "consumableDollarDay": 3.69,
        "totalProcessDollarDay": 15.66,
        "notes": ""
    },
    {
        "station": "6. Assembly",
        "timePerSectionMin": 39.0,
        "sectionsPerHour": 8.27,
        "sectionsPerDay": 2.0,
        "laborDollarDay": 0.0,
        "consumableDollarDay": 0.0,
        "totalProcessDollarDay": 0.0,
        "notes": ""
    },
    {
        "station": "7. Quality Control",
        "timePerSectionMin": 25.0,
        "sectionsPerHour": 1.54,
        "sectionsPerDay": 0.0,
        "laborDollarDay": 29.25,
        "consumableDollarDay": 1.98,
        "totalProcessDollarDay": 32.93,
        "notes": ""
    },
    {
        "station": "8. Packaging & Shipping",
        "timePerSectionMin": 54.0,
        "sectionsPerHour": 2.4,
        "sectionsPerDay": 0.0,
        "laborDollarDay": 0.0,
        "consumableDollarDay": 0.0,
        "totalProcessDollarDay": 0.0,
        "notes": ""
    },
    {
        "station": "BOTTLENECK STATION:",
        "timePerSectionMin": 0,
        "sectionsPerHour": 0,
        "sectionsPerDay": 0,
        "laborDollarDay": 0,
        "consumableDollarDay": 0,
        "totalProcessDollarDay": 0,
        "notes": ""
    },
    {
        "station": "BOTTLENECK STATION:",
        "timePerSectionMin": 0,
        "sectionsPerHour": 0,
        "sectionsPerDay": 0,
        "laborDollarDay": 0,
        "consumableDollarDay": 0,
        "totalProcessDollarDay": 0,
        "notes": ""
    },
    {
        "station": "SYSTEM DAILY OUTPUT (Bottleneck Limited):",
        "timePerSectionMin": 0.0,
        "sectionsPerHour": 0,
        "sectionsPerDay": 0,
        "laborDollarDay": 0,
        "consumableDollarDay": 0,
        "totalProcessDollarDay": 0,
        "notes": ""
    },
    {
        "station": "MULTI-WORKER SCENARIO MODELING",
        "timePerSectionMin": 0,
        "sectionsPerHour": 0,
        "sectionsPerDay": 0,
        "laborDollarDay": 0,
        "consumableDollarDay": 0,
        "totalProcessDollarDay": 0,
        "notes": ""
    },
    {
        "station": "Adjust workers per station below (yellow cells) to model throughput:",
        "timePerSectionMin": 0,
        "sectionsPerHour": 0,
        "sectionsPerDay": 0,
        "laborDollarDay": 0,
        "consumableDollarDay": 0,
        "totalProcessDollarDay": 0,
        "notes": ""
    },
    {
        "station": "1. Material Cutting",
        "timePerSectionMin": 1.0,
        "sectionsPerHour": 0,
        "sectionsPerDay": 0,
        "laborDollarDay": 0,
        "consumableDollarDay": 0,
        "totalProcessDollarDay": 0,
        "notes": ""
    },
    {
        "station": "1B. Manual Drilling",
        "timePerSectionMin": 1.0,
        "sectionsPerHour": 12.0,
        "sectionsPerDay": 1.0,
        "laborDollarDay": 10.87,
        "consumableDollarDay": 0.0,
        "totalProcessDollarDay": 0,
        "notes": ""
    },
    {
        "station": "2. CNC Machining",
        "timePerSectionMin": 1.0,
        "sectionsPerHour": 37.0,
        "sectionsPerDay": 0,
        "laborDollarDay": 0,
        "consumableDollarDay": 0,
        "totalProcessDollarDay": 0,
        "notes": ""
    },
    {
        "station": "3. Welding & Fabrication",
        "timePerSectionMin": 2.0,
        "sectionsPerHour": 5.5,
        "sectionsPerDay": 1.0,
        "laborDollarDay": 2.97,
        "consumableDollarDay": 4.71,
        "totalProcessDollarDay": 0,
        "notes": ""
    },
    {
        "station": "4. Powder Coat Prep",
        "timePerSectionMin": 1.0,
        "sectionsPerHour": 41.5,
        "sectionsPerDay": 0.0,
        "laborDollarDay": 0,
        "consumableDollarDay": 0,
        "totalProcessDollarDay": 0,
        "notes": ""
    },
    {
        "station": "5. Powder Coating",
        "timePerSectionMin": 1.0,
        "sectionsPerHour": 3.63,
        "sectionsPerDay": 3.0,
        "laborDollarDay": 7.51,
        "consumableDollarDay": 5.22,
        "totalProcessDollarDay": 0,
        "notes": ""
    },
    {
        "station": "6. Assembly",
        "timePerSectionMin": 1.0,
        "sectionsPerHour": 39.0,
        "sectionsPerDay": 0.0,
        "laborDollarDay": 0.0,
        "consumableDollarDay": 0.0,
        "totalProcessDollarDay": 0,
        "notes": ""
    },
    {
        "station": "7. Quality Control",
        "timePerSectionMin": 1.0,
        "sectionsPerHour": 25.0,
        "sectionsPerDay": 5.0,
        "laborDollarDay": 43.88,
        "consumableDollarDay": 49.4,
        "totalProcessDollarDay": 0,
        "notes": ""
    },
    {
        "station": "8. Packaging & Shipping",
        "timePerSectionMin": 1.0,
        "sectionsPerHour": 54.0,
        "sectionsPerDay": 0.0,
        "laborDollarDay": 0.0,
        "consumableDollarDay": 0.0,
        "totalProcessDollarDay": 0,
        "notes": ""
    },
    {
        "station": "BALANCED SYSTEM OUTPUT:",
        "timePerSectionMin": 0,
        "sectionsPerHour": 0,
        "sectionsPerDay": 0,
        "laborDollarDay": 0,
        "consumableDollarDay": 0,
        "totalProcessDollarDay": 0,
        "notes": ""
    },
    {
        "station": "TOTAL WORKERS REQUIRED:",
        "timePerSectionMin": 8.0,
        "sectionsPerHour": 0,
        "sectionsPerDay": 0,
        "laborDollarDay": 0,
        "consumableDollarDay": 0,
        "totalProcessDollarDay": 0,
        "notes": ""
    },
    {
        "station": "BALANCED SYSTEM OUTPUT:",
        "timePerSectionMin": 0,
        "sectionsPerHour": 0,
        "sectionsPerDay": 0,
        "laborDollarDay": 0,
        "consumableDollarDay": 0,
        "totalProcessDollarDay": 0,
        "notes": ""
    },
    {
        "station": "TOTAL WORKERS REQUIRED:",
        "timePerSectionMin": 10.0,
        "sectionsPerHour": 0,
        "sectionsPerDay": 0,
        "laborDollarDay": 0,
        "consumableDollarDay": 0,
        "totalProcessDollarDay": 0,
        "notes": ""
    }
],

  // KPI_Dashboard — KPI targets (green/yellow/red thresholds)
  kpiTargets: [
    {
        "metric": "On-Time Delivery Rate",
        "green": 0.95,
        "yellow": 0.85,
        "red": 0.85,
        "unit": "%",
        "notes": "\u226595% green, 85-94% yellow, <85% red"
    },
    {
        "metric": "First-Pass Yield",
        "green": 0.9,
        "yellow": 0.8,
        "red": 0.8,
        "unit": "%",
        "notes": "\u226590% green, 80-89% yellow, <80% red"
    },
    {
        "metric": "Average Lead Time (business days)",
        "green": 5.0,
        "yellow": 8.0,
        "red": 8.0,
        "unit": "Days",
        "notes": "\u22645 green, 6-8 yellow, >8 red"
    },
    {
        "metric": "WIP Count (active jobs on floor)",
        "green": 15.0,
        "yellow": 25.0,
        "red": 25.0,
        "unit": "Jobs",
        "notes": "\u226415 green, 16-25 yellow, >25 red"
    },
    {
        "metric": "Scrap/Waste ($)",
        "green": 200.0,
        "yellow": 500.0,
        "red": 500.0,
        "unit": "$",
        "notes": "\u2264$200 green, $201-500 yellow, >$500 red"
    },
    {
        "metric": "Safety Incidents",
        "green": 0.0,
        "yellow": 1.0,
        "red": 1.0,
        "unit": "Count",
        "notes": "0 = green, 1 = yellow, \u22652 = red"
    },
    {
        "metric": "Daily Production Output (avg units)",
        "green": 20.0,
        "yellow": 18.0,
        "red": 18.0,
        "unit": "Units",
        "notes": "\u226520 green, 18-19 yellow, <18 red"
    },
    {
        "metric": "Rework Hours",
        "green": 5.0,
        "yellow": 10.0,
        "red": 10.0,
        "unit": "Hours",
        "notes": "\u22645 green, 6-10 yellow, >10 red"
    }
],

  // KPI_Dashboard — Weekly KPI tracking (27 weeks, data entry ongoing)
  kpiWeekly: [
    {
        "weekEnding": "Week Endin",
        "onTimeDeliveryPct": 0,
        "firstPassYieldPct": 0,
        "avgLeadTimeDays": 0,
        "wipCount": 0,
        "scrapWasteDollar": 0,
        "safetyIncidents": 0,
        "laborUtilizationPct": 0,
        "customerComplaints": 0,
        "orderFulfillmentPct": 0
    },
    {
        "weekEnding": "2026-03-06",
        "onTimeDeliveryPct": 0,
        "firstPassYieldPct": 0,
        "avgLeadTimeDays": 0,
        "wipCount": 0,
        "scrapWasteDollar": 0,
        "safetyIncidents": 0,
        "laborUtilizationPct": 0,
        "customerComplaints": 0,
        "orderFulfillmentPct": 0
    },
    {
        "weekEnding": "2026-03-13",
        "onTimeDeliveryPct": 0,
        "firstPassYieldPct": 0,
        "avgLeadTimeDays": 0,
        "wipCount": 0,
        "scrapWasteDollar": 0,
        "safetyIncidents": 0,
        "laborUtilizationPct": 0,
        "customerComplaints": 0,
        "orderFulfillmentPct": 0
    },
    {
        "weekEnding": "2026-03-20",
        "onTimeDeliveryPct": 0,
        "firstPassYieldPct": 0,
        "avgLeadTimeDays": 0,
        "wipCount": 0,
        "scrapWasteDollar": 0,
        "safetyIncidents": 0,
        "laborUtilizationPct": 0,
        "customerComplaints": 0,
        "orderFulfillmentPct": 0
    },
    {
        "weekEnding": "2026-03-27",
        "onTimeDeliveryPct": 0,
        "firstPassYieldPct": 0,
        "avgLeadTimeDays": 0,
        "wipCount": 0,
        "scrapWasteDollar": 0,
        "safetyIncidents": 0,
        "laborUtilizationPct": 0,
        "customerComplaints": 0,
        "orderFulfillmentPct": 0
    },
    {
        "weekEnding": "2026-04-03",
        "onTimeDeliveryPct": 0,
        "firstPassYieldPct": 0,
        "avgLeadTimeDays": 0,
        "wipCount": 0,
        "scrapWasteDollar": 0,
        "safetyIncidents": 0,
        "laborUtilizationPct": 0,
        "customerComplaints": 0,
        "orderFulfillmentPct": 0
    },
    {
        "weekEnding": "2026-04-10",
        "onTimeDeliveryPct": 0,
        "firstPassYieldPct": 0,
        "avgLeadTimeDays": 0,
        "wipCount": 0,
        "scrapWasteDollar": 0,
        "safetyIncidents": 0,
        "laborUtilizationPct": 0,
        "customerComplaints": 0,
        "orderFulfillmentPct": 0
    },
    {
        "weekEnding": "2026-04-17",
        "onTimeDeliveryPct": 0,
        "firstPassYieldPct": 0,
        "avgLeadTimeDays": 0,
        "wipCount": 0,
        "scrapWasteDollar": 0,
        "safetyIncidents": 0,
        "laborUtilizationPct": 0,
        "customerComplaints": 0,
        "orderFulfillmentPct": 0
    },
    {
        "weekEnding": "2026-04-24",
        "onTimeDeliveryPct": 0,
        "firstPassYieldPct": 0,
        "avgLeadTimeDays": 0,
        "wipCount": 0,
        "scrapWasteDollar": 0,
        "safetyIncidents": 0,
        "laborUtilizationPct": 0,
        "customerComplaints": 0,
        "orderFulfillmentPct": 0
    },
    {
        "weekEnding": "2026-05-01",
        "onTimeDeliveryPct": 0,
        "firstPassYieldPct": 0,
        "avgLeadTimeDays": 0,
        "wipCount": 0,
        "scrapWasteDollar": 0,
        "safetyIncidents": 0,
        "laborUtilizationPct": 0,
        "customerComplaints": 0,
        "orderFulfillmentPct": 0
    },
    {
        "weekEnding": "2026-05-08",
        "onTimeDeliveryPct": 0,
        "firstPassYieldPct": 0,
        "avgLeadTimeDays": 0,
        "wipCount": 0,
        "scrapWasteDollar": 0,
        "safetyIncidents": 0,
        "laborUtilizationPct": 0,
        "customerComplaints": 0,
        "orderFulfillmentPct": 0
    },
    {
        "weekEnding": "2026-05-15",
        "onTimeDeliveryPct": 0,
        "firstPassYieldPct": 0,
        "avgLeadTimeDays": 0,
        "wipCount": 0,
        "scrapWasteDollar": 0,
        "safetyIncidents": 0,
        "laborUtilizationPct": 0,
        "customerComplaints": 0,
        "orderFulfillmentPct": 0
    },
    {
        "weekEnding": "2026-05-22",
        "onTimeDeliveryPct": 0,
        "firstPassYieldPct": 0,
        "avgLeadTimeDays": 0,
        "wipCount": 0,
        "scrapWasteDollar": 0,
        "safetyIncidents": 0,
        "laborUtilizationPct": 0,
        "customerComplaints": 0,
        "orderFulfillmentPct": 0
    },
    {
        "weekEnding": "2026-05-29",
        "onTimeDeliveryPct": 0,
        "firstPassYieldPct": 0,
        "avgLeadTimeDays": 0,
        "wipCount": 0,
        "scrapWasteDollar": 0,
        "safetyIncidents": 0,
        "laborUtilizationPct": 0,
        "customerComplaints": 0,
        "orderFulfillmentPct": 0
    },
    {
        "weekEnding": "2026-06-05",
        "onTimeDeliveryPct": 0,
        "firstPassYieldPct": 0,
        "avgLeadTimeDays": 0,
        "wipCount": 0,
        "scrapWasteDollar": 0,
        "safetyIncidents": 0,
        "laborUtilizationPct": 0,
        "customerComplaints": 0,
        "orderFulfillmentPct": 0
    },
    {
        "weekEnding": "2026-06-12",
        "onTimeDeliveryPct": 0,
        "firstPassYieldPct": 0,
        "avgLeadTimeDays": 0,
        "wipCount": 0,
        "scrapWasteDollar": 0,
        "safetyIncidents": 0,
        "laborUtilizationPct": 0,
        "customerComplaints": 0,
        "orderFulfillmentPct": 0
    },
    {
        "weekEnding": "2026-06-19",
        "onTimeDeliveryPct": 0,
        "firstPassYieldPct": 0,
        "avgLeadTimeDays": 0,
        "wipCount": 0,
        "scrapWasteDollar": 0,
        "safetyIncidents": 0,
        "laborUtilizationPct": 0,
        "customerComplaints": 0,
        "orderFulfillmentPct": 0
    },
    {
        "weekEnding": "2026-06-26",
        "onTimeDeliveryPct": 0,
        "firstPassYieldPct": 0,
        "avgLeadTimeDays": 0,
        "wipCount": 0,
        "scrapWasteDollar": 0,
        "safetyIncidents": 0,
        "laborUtilizationPct": 0,
        "customerComplaints": 0,
        "orderFulfillmentPct": 0
    },
    {
        "weekEnding": "2026-07-03",
        "onTimeDeliveryPct": 0,
        "firstPassYieldPct": 0,
        "avgLeadTimeDays": 0,
        "wipCount": 0,
        "scrapWasteDollar": 0,
        "safetyIncidents": 0,
        "laborUtilizationPct": 0,
        "customerComplaints": 0,
        "orderFulfillmentPct": 0
    },
    {
        "weekEnding": "2026-07-10",
        "onTimeDeliveryPct": 0,
        "firstPassYieldPct": 0,
        "avgLeadTimeDays": 0,
        "wipCount": 0,
        "scrapWasteDollar": 0,
        "safetyIncidents": 0,
        "laborUtilizationPct": 0,
        "customerComplaints": 0,
        "orderFulfillmentPct": 0
    },
    {
        "weekEnding": "2026-07-17",
        "onTimeDeliveryPct": 0,
        "firstPassYieldPct": 0,
        "avgLeadTimeDays": 0,
        "wipCount": 0,
        "scrapWasteDollar": 0,
        "safetyIncidents": 0,
        "laborUtilizationPct": 0,
        "customerComplaints": 0,
        "orderFulfillmentPct": 0
    },
    {
        "weekEnding": "2026-07-24",
        "onTimeDeliveryPct": 0,
        "firstPassYieldPct": 0,
        "avgLeadTimeDays": 0,
        "wipCount": 0,
        "scrapWasteDollar": 0,
        "safetyIncidents": 0,
        "laborUtilizationPct": 0,
        "customerComplaints": 0,
        "orderFulfillmentPct": 0
    },
    {
        "weekEnding": "2026-07-31",
        "onTimeDeliveryPct": 0,
        "firstPassYieldPct": 0,
        "avgLeadTimeDays": 0,
        "wipCount": 0,
        "scrapWasteDollar": 0,
        "safetyIncidents": 0,
        "laborUtilizationPct": 0,
        "customerComplaints": 0,
        "orderFulfillmentPct": 0
    },
    {
        "weekEnding": "2026-08-07",
        "onTimeDeliveryPct": 0,
        "firstPassYieldPct": 0,
        "avgLeadTimeDays": 0,
        "wipCount": 0,
        "scrapWasteDollar": 0,
        "safetyIncidents": 0,
        "laborUtilizationPct": 0,
        "customerComplaints": 0,
        "orderFulfillmentPct": 0
    },
    {
        "weekEnding": "2026-08-14",
        "onTimeDeliveryPct": 0,
        "firstPassYieldPct": 0,
        "avgLeadTimeDays": 0,
        "wipCount": 0,
        "scrapWasteDollar": 0,
        "safetyIncidents": 0,
        "laborUtilizationPct": 0,
        "customerComplaints": 0,
        "orderFulfillmentPct": 0
    },
    {
        "weekEnding": "2026-08-21",
        "onTimeDeliveryPct": 0,
        "firstPassYieldPct": 0,
        "avgLeadTimeDays": 0,
        "wipCount": 0,
        "scrapWasteDollar": 0,
        "safetyIncidents": 0,
        "laborUtilizationPct": 0,
        "customerComplaints": 0,
        "orderFulfillmentPct": 0
    },
    {
        "weekEnding": "2026-08-28",
        "onTimeDeliveryPct": 0,
        "firstPassYieldPct": 0,
        "avgLeadTimeDays": 0,
        "wipCount": 0,
        "scrapWasteDollar": 0,
        "safetyIncidents": 0,
        "laborUtilizationPct": 0,
        "customerComplaints": 0,
        "orderFulfillmentPct": 0
    }
],

  // PRODUCT_SKU_MASTER_AM — SRS customer catalog (93 SKUs + GTINs, isolated from Maisy production)
  srsCatalog: [
    {
        "category": "Cable Post",
        "sku": "P-CBL-FM-STR-42-BLK",
        "techDesc": "Post | Cable | Fascia Mount | Stair - 42\" | Black",
        "commonName": "42\" Cable Railing - Stair Post -  Fascia Mount -  Black",
        "srsStock": 72.0,
        "gs1Prefix": "0850084137",
        "gtin": "00850084137020"
    },
    {
        "category": "Hardware",
        "sku": "CBL-SS-POL-500",
        "techDesc": "Cable | Stainless Steel | Polished Finish | 500' Roll",
        "commonName": "1/4\" Stainless Cable - Polished (500' Roll)",
        "srsStock": 80.0,
        "gs1Prefix": "0850084137",
        "gtin": "00850084137099"
    },
    {
        "category": "Cable Post",
        "sku": "P-CBL-SM-STR-36-BLK",
        "techDesc": "Post | Cable | Surface Mount | Stair - 36\" | Black",
        "commonName": "36\" Cable Railing - Stair Post -  Surface Mount -  Black",
        "srsStock": 90.0,
        "gs1Prefix": "0850084137",
        "gtin": "00850084137068"
    },
    {
        "category": "Cable Post",
        "sku": "P-CBL-SM-CRN-36-BLK",
        "techDesc": "Post | Cable | Surface Mount | Corner - 36\" | Black",
        "commonName": "36\" Cable Railing - Corner Post -  Surface Mount -  Black",
        "srsStock": 105.0,
        "gs1Prefix": "0850084137",
        "gtin": "00850084137075"
    },
    {
        "category": "Top Rail",
        "sku": "TR-20-BLK",
        "techDesc": "Top Rail | 20' length | Black",
        "commonName": "20' - 1\" x 3\" Toprail - Black",
        "srsStock": 137.0,
        "gs1Prefix": "0850084137",
        "gtin": "00850084137051"
    },
    {
        "category": "Cable Post",
        "sku": "P-CBL-SM-LINE-36-BLK",
        "techDesc": "Post | Cable | Surface Mount | Line - 36\" | Black",
        "commonName": "36\" Cable Railing - Line Post -  Surface Mount -  Black",
        "srsStock": 275.0,
        "gs1Prefix": "0850084137",
        "gtin": "00850084137037"
    },
    {
        "category": "Cable Post",
        "sku": "P-CBL-FM-LINE-42-BLK",
        "techDesc": "Post | Cable | Fascia Mount | Line - 42\" | Black",
        "commonName": "42\" Cable Railing - Line Post -  Fascia Mount -  Black",
        "srsStock": 325.0,
        "gs1Prefix": "0850084137",
        "gtin": "00850084137006"
    },
    {
        "category": "Hardware",
        "sku": "TR-END-BLK",
        "techDesc": "Top Rail | End Cap | Black",
        "commonName": "Top Rail End Cap",
        "srsStock": 600.0,
        "gs1Prefix": "0850084137",
        "gtin": "00850084137013"
    },
    {
        "category": "Hardware",
        "sku": "LAGWSR-FM-SS-POL",
        "techDesc": "Fascia Mount | Stainless Steel | Post Lag w/Washer| Polished Finish",
        "commonName": "3/8\" x 5\" Stainless Lag Bolt w/ Flat Washer",
        "srsStock": 800.0,
        "gs1Prefix": "0850084137",
        "gtin": "00850084137082"
    },
    {
        "category": "Hardware",
        "sku": "WSR-ANG-SS",
        "techDesc": "Stainless Steel | Angle Washer",
        "commonName": "Angle Washer - Stainless - Polished",
        "srsStock": 1000.0,
        "gs1Prefix": "08600143964",
        "gtin": "00860014396465"
    },
    {
        "category": "Hardware",
        "sku": "PS-SM-SS-BLK",
        "techDesc": "Surface Mount | Stainless Steel | Post Screws | Black Finish",
        "commonName": "Surface Mount Post Screws - Stainless - Black Finish",
        "srsStock": 1900.0,
        "gs1Prefix": "08600143964",
        "gtin": "00860014396496"
    },
    {
        "category": "Hardware",
        "sku": "SCR-ST-SS-BLK",
        "techDesc": "Stainless Steel | Self-Tap Screws | Black Finish",
        "commonName": "Self-Tap Screws Stainless Steel -  Black Finish-",
        "srsStock": 3400.0,
        "gs1Prefix": "0850084137",
        "gtin": "00850084137044"
    },
    {
        "category": "Hardware",
        "sku": "SWG-CBL-SS-POL",
        "techDesc": "Swage | Stainless Steel |Polished Finish",
        "commonName": "1/4\" Threaded Cable Stainless Swage - Polished",
        "srsStock": 7200.0,
        "gs1Prefix": "08600143964",
        "gtin": "00860014396441"
    },
    {
        "category": "Hardware",
        "sku": "SPG-FM-BSHD",
        "techDesc": "Spigot | Fascia Mount | Brushed Finish",
        "commonName": "Fascia Mount Spigot -  Brushed Finish",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Hardware",
        "sku": "SPG-FM-COL",
        "techDesc": "Spigot | Fascia Mount | Color",
        "commonName": "Fascia Mount Spigot -  Custom Color",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Hardware",
        "sku": "SCR-ST-SS-POL",
        "techDesc": "Stainless Steel | Self-Tap Screws | Polished Finish",
        "commonName": "Self-Tap Screws Stainless Steel -  Polished Finish-",
        "srsStock": 0,
        "gs1Prefix": "08600143964",
        "gtin": "00860014396458"
    },
    {
        "category": "Hardware",
        "sku": "SPG-SM-BSHD",
        "techDesc": "Spigot | Surface Mount | Brushed Finish",
        "commonName": "Surface Mount Spigot -  Brushed Finish",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Hardware",
        "sku": "SPG-SM-COL",
        "techDesc": "Spigot | Surface Mount | Color",
        "commonName": "Surface Mount Spigot -  Custom Color",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Top Rail",
        "sku": "TR-CUT-FT-BLK",
        "techDesc": "Top Rail |Cut | Per Ft",
        "commonName": "1\" x 3\" Toprail - Custom Color",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Hardware",
        "sku": "CBL-SS-BLK-500",
        "techDesc": "Cable | Stainless Steel | Black Finish | 500' Roll",
        "commonName": "1/4\" Stainless Cable - Black (500' Roll)",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Hardware",
        "sku": "CBL-SS-BLK",
        "techDesc": "Cable | Stainless Steel | Black Finish",
        "commonName": "1/4\" Stainless Cable - Black (Per Foot)",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Hardware",
        "sku": "CBL-SS-POL",
        "techDesc": "Cable | Stainless Steel | Polished Finish",
        "commonName": "1/4\" Stainless Cable - Polished (Per Foot)",
        "srsStock": 0,
        "gs1Prefix": "08600143964",
        "gtin": "00860014396434"
    },
    {
        "category": "Hardware",
        "sku": "SWG-CBL-SS-BLK",
        "techDesc": "Swage | Stainless Steel |Black Finish",
        "commonName": "1/4\" Threaded Cable Stainless Swage - Black",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Top Rail",
        "sku": "TR-12-BLK",
        "techDesc": "Top Rail | 12' length | Black",
        "commonName": "12' - 1\" x 3\" Toprail - Black",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Top Rail",
        "sku": "TR-12-CLR",
        "techDesc": "Top Rail | 12' length | Custom Color",
        "commonName": "12' - 1\" x 3\" Toprail - Custom Color",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Top Rail",
        "sku": "TR-16-BLK",
        "techDesc": "Top Rail | 16' length | Black",
        "commonName": "16' - 1\" x 3\" Toprail - Black",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Top Rail",
        "sku": "TR-16-CLR",
        "techDesc": "Top Rail | 16' length | Custom Color",
        "commonName": "16' - 1\" x 3\" Toprail - Custom Color",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Top Rail",
        "sku": "TR-20-CLR",
        "techDesc": "Top Rail | 20' length | Custom Color",
        "commonName": "20' - 1\" x 3\" Toprail - Custom Color",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Hardware",
        "sku": "LAG-FM-SS-WSR-BLK",
        "techDesc": "Fascia Mount | Stainless Steel | Post Lags | Washer | Black Finish",
        "commonName": "3/8\" Flat Washer - Black",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Hardware",
        "sku": "LAG-FM-SS-WSR-POL",
        "techDesc": "Fascia Mount | Stainless Steel | Post Lags | Washer | Polished Finish",
        "commonName": "3/8\" Flat Washer - Polished",
        "srsStock": 0,
        "gs1Prefix": "08600143964",
        "gtin": "00860014396489"
    },
    {
        "category": "Hardware",
        "sku": "LAG-FM-SS-BLK",
        "techDesc": "Fascia Mount | Stainless Steel | Post Lags | Black Finish",
        "commonName": "3/8\" x 5\" Stainless Lag Bolt - Black",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Hardware",
        "sku": "LAG-FM-SS-POL",
        "techDesc": "Fascia Mount | Stainless Steel | Post Lags | Polished Finish",
        "commonName": "3/8\" x 5\" Stainless Lag Bolt - Polished",
        "srsStock": 0,
        "gs1Prefix": "08600143964",
        "gtin": "00860014396472"
    },
    {
        "category": "Cable Post",
        "sku": "P-CBL-FM-CRN-36-BLK",
        "techDesc": "Post | Cable | Fascia Mount | Corner - 36\" | Black",
        "commonName": "36\" Cable Railing - Corner Post -  Fascia Mount -  Black",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Cable Post",
        "sku": "P-CBL-FM-CRN-36-CLR",
        "techDesc": "Post | Cable | Fascia Mount | Corner - 36\" | Custom Color",
        "commonName": "36\" Cable Railing - Corner Post -  Fascia Mount -  Custom Color",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Cable Post",
        "sku": "P-CBL-SM-CRN-36-CLR",
        "techDesc": "Post | Cable | Surface Mount | Corner - 36\" | Custom Color",
        "commonName": "36\" Cable Railing - Corner Post -  Surface Mount -  Custom Color",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Cable Post",
        "sku": "P-CBL-FM-LINE-36-BLK",
        "techDesc": "Post | Cable | Fascia Mount | Line - 36\" | Black",
        "commonName": "36\" Cable Railing - Line Post -  Fascia Mount -  Black",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Cable Post",
        "sku": "P-CBL-FM-LINE-36-CLR",
        "techDesc": "Post | Cable | Fascia Mount | Line - 36\" | Custom Color",
        "commonName": "36\" Cable Railing - Line Post -  Fascia Mount -  Custom Color",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Cable Post",
        "sku": "P-CBL-SM-LINE-36-CLR",
        "techDesc": "Post | Cable | Surface Mount| Line - 36\" | Custom Color",
        "commonName": "36\" Cable Railing - Line Post -  Surface Mount-  Custom Color",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Cable Post",
        "sku": "P-CBL-FM-STR-36-BLK",
        "techDesc": "Post | Cable | Fascia Mount | Stair - 36\" | Black",
        "commonName": "36\" Cable Railing - Stair Post -  Fascia Mount -  Black",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Cable Post",
        "sku": "P-CBL-FM-STR-36-CLR",
        "techDesc": "Post | Cable | Fascia Mount | Stair - 36\" | Custom Color",
        "commonName": "36\" Cable Railing - Stair Post -  Fascia Mount -  Custom Color",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Cable Post",
        "sku": "P-CBL-SM-STR-36-CLR",
        "techDesc": "Post | Cable | Surface Mount | Stair - 36\" | Custom Color",
        "commonName": "36\" Cable Railing - Stair Post -  Surface Mount -  Custom Color",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Framed Glass Railing",
        "sku": "P-GLS-FM-CRN-36-BLK",
        "techDesc": "Post | Glass | Fascia Mount | Corner - 36\" | Black",
        "commonName": "36\" Glass Railing - Corner Post -  Fascia Mount -  Black",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Framed Glass Railing",
        "sku": "P-GLS-FM-CRN-36-CLR",
        "techDesc": "Post | Glass | Fascia Mount | Corner - 36\" | Custom Color",
        "commonName": "36\" Glass Railing - Corner Post -  Fascia Mount -  Custom Color",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Framed Glass Railing",
        "sku": "P-GLS-SM-CRN-36-BLK",
        "techDesc": "Post | Glass | Surface | Corner - 36\" | Black",
        "commonName": "36\" Glass Railing - Corner Post -  Surface -  Black",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Framed Glass Railing",
        "sku": "P-GLS-SM-CRN-36-CLR",
        "techDesc": "Post | Glass | Surface | Corner - 36\" | Custom Color",
        "commonName": "36\" Glass Railing - Corner Post -  Surface -  Custom Color",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Framed Glass Railing",
        "sku": "P-GLS-FM-LINE-36-BLK",
        "techDesc": "Post | Glass | Fascia Mount | Line - 36\" | Black",
        "commonName": "36\" Glass Railing - Line Post -  Fascia Mount -  Black",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Framed Glass Railing",
        "sku": "P-GLS-FM-LINE-36-CLR",
        "techDesc": "Post | Glass | Fascia Mount | Line - 36\" | Custom Color",
        "commonName": "36\" Glass Railing - Line Post -  Fascia Mount -  Custom Color",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Framed Glass Railing",
        "sku": "P-GLS-SM-LINE-36-BLK",
        "techDesc": "Post | Glass | Surface | Line - 36\" | Black",
        "commonName": "36\" Glass Railing - Line Post -  Surface -  Black",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Framed Glass Railing",
        "sku": "P-GLS-SM-LINE-36-CLR",
        "techDesc": "Post | Glass | Surface | Line - 36\" | Custom Color",
        "commonName": "36\" Glass Railing - Line Post -  Surface -  Custom Color",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Framed Glass Railing",
        "sku": "P-GLS-FM-STR-36-BLK",
        "techDesc": "Post | Glass | Fascia Mount | Stair - 36\" | Black",
        "commonName": "36\" Glass Railing - Stair Post -  Fascia Mount -  Black",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Framed Glass Railing",
        "sku": "P-GLS-FM-STR-36-CLR",
        "techDesc": "Post | Glass | Fascia Mount | Stair - 36\" | Custom Color",
        "commonName": "36\" Glass Railing - Stair Post -  Fascia Mount -  Custom Color",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Framed Glass Railing",
        "sku": "P-GLS-SM-STR-36-BLK",
        "techDesc": "Post | Glass | Surface | Stair - 36\" | Black",
        "commonName": "36\" Glass Railing - Stair Post -  Surface -  Black",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Framed Glass Railing",
        "sku": "P-GLS-SM-STR-36-CLR",
        "techDesc": "Post | Glass | Surface | Stair - 36\" | Custom Color",
        "commonName": "36\" Glass Railing - Stair Post -  Surface -  Custom Color",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Top Rail",
        "sku": "TR-4-BLK",
        "techDesc": "Top Rail | 4' length | Black",
        "commonName": "4' - 1\" x 3\" Toprail - Black",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Top Rail",
        "sku": "TR-4-CLR",
        "techDesc": "Top Rail | 4' length | Custom Color",
        "commonName": "4' - 1\" x 3\" Toprail - Custom Color",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Cable Post",
        "sku": "P-CBL-FM-CRN-42-BLK",
        "techDesc": "Post | Cable | Fascia Mount | Corner - 42\" | Black",
        "commonName": "42\" Cable Railing - Corner Post -  Fascia Mount -  Black",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Cable Post",
        "sku": "P-CBL-FM-CRN-42-CLR",
        "techDesc": "Post | Cable | Fascia Mount | Corner - 42\" | Custom Color",
        "commonName": "42\" Cable Railing - Corner Post -  Fascia Mount -  Custom Color",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Cable Post",
        "sku": "P-CBL-SM-CRN-42-BLK",
        "techDesc": "Post | Cable | Surface Mount | Corner - 42\" | Black",
        "commonName": "42\" Cable Railing - Corner Post -  Surface Mount -  Black",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Cable Post",
        "sku": "P-CBL-SM-CRN-42-CLR",
        "techDesc": "Post | Cable | Surface Mount | Corner - 42\" | Custom Color",
        "commonName": "42\" Cable Railing - Corner Post -  Surface Mount -  Custom Color",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Cable Post",
        "sku": "P-CBL-FM-LINE-42-CLR",
        "techDesc": "Post | Cable | Fascia Mount | Line - 42\" | Custom Color",
        "commonName": "42\" Cable Railing - Line Post -  Fascia Mount -  Custom Color",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Cable Post",
        "sku": "P-CBL-SM-LINE-42-BLK",
        "techDesc": "Post | Cable | Surface Mount | Line - 42\" | Black",
        "commonName": "42\" Cable Railing - Line Post -  Surface Mount -  Black",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Cable Post",
        "sku": "P-CBL-SM-LINE-42-CLR",
        "techDesc": "Post | Cable | Surface Mount | Line - 42\" | Custom Color",
        "commonName": "42\" Cable Railing - Line Post -  Surface Mount -  Custom Color",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Cable Post",
        "sku": "P-CBL-FM-STR-42-CLR",
        "techDesc": "Post | Cable | Fascia Mount | Stair - 42\" | Custom Color",
        "commonName": "42\" Cable Railing - Stair Post -  Fascia Mount -  Custom Color",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Cable Post",
        "sku": "P-CBL-SM-STR-42-BLK",
        "techDesc": "Post | Cable | Surface Mount | Stair - 42\" | Black",
        "commonName": "42\" Cable Railing - Stair Post -  Surface Mount -  Black",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Cable Post",
        "sku": "P-CBL-SM-STR-42-CLR",
        "techDesc": "Post | Cable | Surface Mount | Stair - 42\" | Custom Color",
        "commonName": "42\" Cable Railing - Stair Post -  Surface Mount -  Custom Color",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Framed Glass Railing",
        "sku": "P-GLS-FM-CRN-42-BLK",
        "techDesc": "Post | Glass | Fascia Mount | Corner - 42\" | Black",
        "commonName": "42\" Glass Railing - Corner Post -  Fascia Mount -  Black",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Framed Glass Railing",
        "sku": "P-GLS-FM-CRN-42-CLR",
        "techDesc": "Post | Glass | Fascia Mount | Corner - 42\" | Custom Color",
        "commonName": "42\" Glass Railing - Corner Post -  Fascia Mount -  Custom Color",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Framed Glass Railing",
        "sku": "P-GLS-SM-CRN-42-BLK",
        "techDesc": "Post | Glass | Surface Mount | Corner - 42\" | Black",
        "commonName": "42\" Glass Railing - Corner Post -  Surface Mount -  Black",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Framed Glass Railing",
        "sku": "P-GLS-SM-CRN-42-CLR",
        "techDesc": "Post | Glass | Surface Mount | Corner - 42\" | Custom Color",
        "commonName": "42\" Glass Railing - Corner Post -  Surface Mount -  Custom Color",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Framed Glass Railing",
        "sku": "P-GLS-FM-LINE-42-BLK",
        "techDesc": "Post | Glass | Fascia Mount | Line - 42\" | Black",
        "commonName": "42\" Glass Railing - Line Post -  Fascia Mount -  Black",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Framed Glass Railing",
        "sku": "P-GLS-FM-LINE-42-CLR",
        "techDesc": "Post | Glass | Fascia Mount | Line - 42\" | Custom Color",
        "commonName": "42\" Glass Railing - Line Post -  Fascia Mount -  Custom Color",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Framed Glass Railing",
        "sku": "P-GLS-SM-LINE-42-BLK",
        "techDesc": "Post | Glass | Surface Mount | Line - 42\" | Black",
        "commonName": "42\" Glass Railing - Line Post -  Surface Mount -  Black",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Framed Glass Railing",
        "sku": "P-GLS-SM-LINE-42-CLR",
        "techDesc": "Post | Glass | Surface Mount | Line - 42\" | Custom Color",
        "commonName": "42\" Glass Railing - Line Post -  Surface Mount -  Custom Color",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Framed Glass Railing",
        "sku": "P-GLS-FM-STR-42-BLK",
        "techDesc": "Post | Glass | Fascia Mount | Stair - 42\" | Black",
        "commonName": "42\" Glass Railing - Stair Post -  Fascia Mount -  Black",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Framed Glass Railing",
        "sku": "P-GLS-FM-STR-42-CLR",
        "techDesc": "Post | Glass | Fascia Mount | Stair - 42\" | Custom Color",
        "commonName": "42\" Glass Railing - Stair Post -  Fascia Mount -  Custom Color",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Framed Glass Railing",
        "sku": "P-GLS-SM-STR-42-BLK",
        "techDesc": "Post | Glass | Surface Mount | Stair - 42\" | Black",
        "commonName": "42\" Glass Railing - Stair Post -  Surface Mount -  Black",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Framed Glass Railing",
        "sku": "P-GLS-SM-STR-42-CLR",
        "techDesc": "Post | Glass | Surface Mount | Stair - 42\" | Custom Color",
        "commonName": "42\" Glass Railing - Stair Post -  Surface Mount -  Custom Color",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Top Rail",
        "sku": "TR-8-BLK",
        "techDesc": "Top Rail | 8' length | Black",
        "commonName": "8' - 1\" x 3\" Toprail - Black",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Top Rail",
        "sku": "TR-8-CLR",
        "techDesc": "Top Rail | 8' length | Custom Color",
        "commonName": "8' - 1\" x 3\" Toprail - Custom Color",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Plates / Tabs",
        "sku": "PLT-SM",
        "techDesc": "Plate| Surface Mount",
        "commonName": "Component - Post Surface Mount Plate",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Plates / Tabs",
        "sku": "PLT-TOP",
        "techDesc": "Plate| Top Rail",
        "commonName": "Component - Post Top Rail Plate",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Hardware",
        "sku": "ANG-TOP",
        "techDesc": "Angle | Top | Bracket",
        "commonName": "Stair Post Toprail Angle Bracket",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    },
    {
        "category": "Kit",
        "sku": "MR-KIT-CABLE-FM-L-BLK-20x42",
        "techDesc": "KIT | CABLE | MOUNT | LINE ,CORNER, STAIR | BLACK |  20 ft x 42\u201d",
        "commonName": "#N/A",
        "srsStock": 0,
        "gs1Prefix": "08600130936",
        "gtin": "00860013093655"
    },
    {
        "category": "Kit",
        "sku": "MR-KIT-CABLE-SM-L-BLK-20x42",
        "techDesc": "KIT | CABLE | MOUNT | LINE ,CORNER, STAIR | BLACK |  20 ft x 42\u201d",
        "commonName": "#N/A",
        "srsStock": 0,
        "gs1Prefix": "08600130936",
        "gtin": "00860013093693"
    },
    {
        "category": "Kit",
        "sku": "MR-KIT-CABLE-FM-L-BLK-12x42",
        "techDesc": "KIT | CABLE | MOUNT | LINE ,CORNER, STAIR | BLACK | 12 ft x 42\u201d",
        "commonName": "#N/A",
        "srsStock": 0,
        "gs1Prefix": "08600130936",
        "gtin": "00860013093631"
    },
    {
        "category": "Kit",
        "sku": "MR-KIT-CABLE-SM-L-BLK-12x42",
        "techDesc": "KIT | CABLE | MOUNT | LINE ,CORNER, STAIR | BLACK | 12 ft x 42\u201d",
        "commonName": "#N/A",
        "srsStock": 0,
        "gs1Prefix": "08600130936",
        "gtin": "00860013093679"
    },
    {
        "category": "Kit",
        "sku": "MR-KIT-CABLE-FM-L-BLK-16x42",
        "techDesc": "KIT | CABLE | MOUNT | LINE ,CORNER, STAIR | BLACK | 16 ft x 42\u201d",
        "commonName": "#N/A",
        "srsStock": 0,
        "gs1Prefix": "08600130936",
        "gtin": "00860013093648"
    },
    {
        "category": "Kit",
        "sku": "MR-KIT-CABLE-SM-L-BLK-16x42",
        "techDesc": "KIT | CABLE | MOUNT | LINE ,CORNER, STAIR | BLACK | 16 ft x 42\u201d",
        "commonName": "#N/A",
        "srsStock": 0,
        "gs1Prefix": "08600130936",
        "gtin": "00860013093686"
    },
    {
        "category": "Kit",
        "sku": "MR-KIT-CABLE-FM-L-BLK-4x42",
        "techDesc": "KIT | CABLE | MOUNT | LINE ,CORNER, STAIR | BLACK | 4 ft x 42\u201d",
        "commonName": "#N/A",
        "srsStock": 0,
        "gs1Prefix": "08600130936",
        "gtin": "00860013093600"
    },
    {
        "category": "Kit",
        "sku": "MR-KIT-CABLE-SM-L-BLK-4x42",
        "techDesc": "KIT | CABLE | MOUNT | LINE ,CORNER, STAIR | BLACK | 4 ft x 42\u201d",
        "commonName": "#N/A",
        "srsStock": 0,
        "gs1Prefix": "08600130936",
        "gtin": "00860013093617"
    },
    {
        "category": "Kit",
        "sku": "MR-KIT-CABLE-FM-L-BLK-8x42",
        "techDesc": "KIT | CABLE | MOUNT | LINE ,CORNER, STAIR | BLACK | 8 ft x 42\u201d",
        "commonName": "#N/A",
        "srsStock": 0,
        "gs1Prefix": "08600130936",
        "gtin": "00860013093624"
    },
    {
        "category": "Kit",
        "sku": "MR-KIT-CABLE-SM-L-BLK-8x42",
        "techDesc": "KIT | CABLE | MOUNT | LINE ,CORNER, STAIR | BLACK | 8 ft x 42\u201d",
        "commonName": "#N/A",
        "srsStock": 0,
        "gs1Prefix": "08600130936",
        "gtin": "00860013093662"
    },
    {
        "category": "Plates / Tabs",
        "sku": "ANG-BOT",
        "techDesc": "Angle| Bottom",
        "commonName": "",
        "srsStock": 0,
        "gs1Prefix": "#N/A",
        "gtin": "#N/A"
    }
],

  // PRODUCT_SKU_MASTER_AM — SRS item dimensions (weight/length/width/height)
  srsDims: [
    {
        "commonName": "Fascia Mount Spigot -  Brushed Finish",
        "weightLb": 0,
        "length": 0,
        "width": 0,
        "height": 0
    },
    {
        "commonName": "Fascia Mount Spigot -  Custom Color",
        "weightLb": 0,
        "length": 0,
        "width": 0,
        "height": 0
    },
    {
        "commonName": "Self-Tap Screws Stainless Steel -  Black Finish-",
        "weightLb": 0,
        "length": 0,
        "width": 0,
        "height": 0
    },
    {
        "commonName": "Self-Tap Screws Stainless Steel -  Polished Finish-",
        "weightLb": 0,
        "length": 0,
        "width": 0,
        "height": 0
    },
    {
        "commonName": "Surface Mount Spigot -  Brushed Finish",
        "weightLb": 0,
        "length": 0,
        "width": 0,
        "height": 0
    },
    {
        "commonName": "Surface Mount Spigot -  Custom Color",
        "weightLb": 0,
        "length": 0,
        "width": 0,
        "height": 0
    },
    {
        "commonName": "1\" x 3\" Toprail - Custom Color",
        "weightLb": 0,
        "length": 0,
        "width": 0,
        "height": 0
    },
    {
        "commonName": "1/4\" Stainless Cable - Black (500' Roll)",
        "weightLb": 0,
        "length": 0,
        "width": 0,
        "height": 0
    },
    {
        "commonName": "1/4\" Stainless Cable - Black (Per Foot)",
        "weightLb": 0,
        "length": 0,
        "width": 0,
        "height": 0
    },
    {
        "commonName": "1/4\" Stainless Cable - Polished (500' Roll)",
        "weightLb": 0,
        "length": 0,
        "width": 0,
        "height": 0
    },
    {
        "commonName": "1/4\" Stainless Cable - Polished (Per Foot)",
        "weightLb": 0,
        "length": 0,
        "width": 0,
        "height": 0
    },
    {
        "commonName": "1/4\" Threaded Cable Stainless Swage - Black",
        "weightLb": 0,
        "length": 0,
        "width": 0,
        "height": 0
    },
    {
        "commonName": "1/4\" Threaded Cable Stainless Swage - Polished",
        "weightLb": 0,
        "length": 0,
        "width": 0,
        "height": 0
    },
    {
        "commonName": "12' - 1\" x 3\" Toprail - Black",
        "weightLb": 0,
        "length": 144.0,
        "width": 3.0,
        "height": 1.0
    },
    {
        "commonName": "12' - 1\" x 3\" Toprail - Custom Color",
        "weightLb": 0,
        "length": 144.0,
        "width": 3.0,
        "height": 1.0
    },
    {
        "commonName": "16' - 1\" x 3\" Toprail - Black",
        "weightLb": 0,
        "length": 192.0,
        "width": 3.0,
        "height": 1.0
    },
    {
        "commonName": "16' - 1\" x 3\" Toprail - Custom Color",
        "weightLb": 0,
        "length": 192.0,
        "width": 3.0,
        "height": 1.0
    },
    {
        "commonName": "20' - 1\" x 3\" Toprail - Black",
        "weightLb": 0,
        "length": 240.0,
        "width": 3.0,
        "height": 1.0
    },
    {
        "commonName": "20' - 1\" x 3\" Toprail - Custom Color",
        "weightLb": 0,
        "length": 240.0,
        "width": 3.0,
        "height": 1.0
    },
    {
        "commonName": "3/8\" Flat Washer - Black",
        "weightLb": 0,
        "length": 0,
        "width": 0,
        "height": 0
    },
    {
        "commonName": "3/8\" Flat Washer - Polished",
        "weightLb": 0,
        "length": 0,
        "width": 0,
        "height": 0
    },
    {
        "commonName": "3/8\" x 5\" Stainless Lag Bolt - Black",
        "weightLb": 0,
        "length": 0,
        "width": 0,
        "height": 0
    },
    {
        "commonName": "3/8\" x 5\" Stainless Lag Bolt - Polished",
        "weightLb": 0,
        "length": 0,
        "width": 0,
        "height": 0
    },
    {
        "commonName": "3/8\" x 5\" Stainless Lag Bolt w/ Flat Washer",
        "weightLb": 0,
        "length": 0,
        "width": 0,
        "height": 0
    },
    {
        "commonName": "36\" Cable Railing - Corner Post -  Fascia Mount -  Black",
        "weightLb": 5.2,
        "length": 6.0,
        "width": 6.0,
        "height": 48.0
    },
    {
        "commonName": "36\" Cable Railing - Corner Post -  Fascia Mount -  Custom Color",
        "weightLb": 5.2,
        "length": 6.0,
        "width": 6.0,
        "height": 48.0
    },
    {
        "commonName": "36\" Cable Railing - Corner Post -  Surface Mount -  Black",
        "weightLb": 0,
        "length": 0,
        "width": 0,
        "height": 0
    },
    {
        "commonName": "36\" Cable Railing - Corner Post -  Surface Mount -  Custom Color",
        "weightLb": 0,
        "length": 0,
        "width": 0,
        "height": 0
    },
    {
        "commonName": "36\" Cable Railing - Line Post -  Fascia Mount -  Black",
        "weightLb": 4.2,
        "length": 2.0,
        "width": 2.0,
        "height": 43.0
    },
    {
        "commonName": "36\" Cable Railing - Line Post -  Fascia Mount -  Custom Color",
        "weightLb": 4.2,
        "length": 2.0,
        "width": 2.0,
        "height": 43.0
    },
    {
        "commonName": "36\" Cable Railing - Line Post -  Surface Mount -  Black",
        "weightLb": 4.6,
        "length": 4.0,
        "width": 4.0,
        "height": 35.0
    },
    {
        "commonName": "36\" Cable Railing - Line Post -  Surface Mount-  Custom Color",
        "weightLb": 4.6,
        "length": 4.0,
        "width": 4.0,
        "height": 35.0
    },
    {
        "commonName": "36\" Cable Railing - Stair Post -  Fascia Mount -  Black",
        "weightLb": 4.0,
        "length": 2.0,
        "width": 2.0,
        "height": 43.0
    },
    {
        "commonName": "36\" Cable Railing - Stair Post -  Fascia Mount -  Custom Color",
        "weightLb": 4.0,
        "length": 2.0,
        "width": 2.0,
        "height": 43.0
    },
    {
        "commonName": "36\" Cable Railing - Stair Post -  Surface Mount -  Black",
        "weightLb": 4.6,
        "length": 4.0,
        "width": 4.0,
        "height": 35.0
    },
    {
        "commonName": "36\" Cable Railing - Stair Post -  Surface Mount -  Custom Color",
        "weightLb": 4.6,
        "length": 4.0,
        "width": 4.0,
        "height": 35.0
    },
    {
        "commonName": "36\" Glass Railing - Corner Post -  Fascia Mount -  Black",
        "weightLb": 5.0,
        "length": 6.0,
        "width": 6.0,
        "height": 43.0
    },
    {
        "commonName": "36\" Glass Railing - Corner Post -  Fascia Mount -  Custom Color",
        "weightLb": 5.0,
        "length": 6.0,
        "width": 6.0,
        "height": 43.0
    },
    {
        "commonName": "36\" Glass Railing - Corner Post -  Surface -  Black",
        "weightLb": 0,
        "length": 0,
        "width": 0,
        "height": 0
    },
    {
        "commonName": "36\" Glass Railing - Corner Post -  Surface -  Custom Color",
        "weightLb": 0,
        "length": 0,
        "width": 0,
        "height": 0
    },
    {
        "commonName": "36\" Glass Railing - Line Post -  Fascia Mount -  Black",
        "weightLb": 4.0,
        "length": 4.0,
        "width": 4.0,
        "height": 43.0
    },
    {
        "commonName": "36\" Glass Railing - Line Post -  Fascia Mount -  Custom Color",
        "weightLb": 4.0,
        "length": 4.0,
        "width": 4.0,
        "height": 43.0
    },
    {
        "commonName": "36\" Glass Railing - Line Post -  Surface -  Black",
        "weightLb": 0,
        "length": 0,
        "width": 0,
        "height": 0
    },
    {
        "commonName": "36\" Glass Railing - Line Post -  Surface -  Custom Color",
        "weightLb": 0,
        "length": 0,
        "width": 0,
        "height": 0
    },
    {
        "commonName": "36\" Glass Railing - Stair Post -  Fascia Mount -  Black",
        "weightLb": 0,
        "length": 0,
        "width": 0,
        "height": 0
    },
    {
        "commonName": "36\" Glass Railing - Stair Post -  Fascia Mount -  Custom Color",
        "weightLb": 0,
        "length": 0,
        "width": 0,
        "height": 0
    },
    {
        "commonName": "36\" Glass Railing - Stair Post -  Surface -  Black",
        "weightLb": 0,
        "length": 0,
        "width": 0,
        "height": 0
    },
    {
        "commonName": "36\" Glass Railing - Stair Post -  Surface -  Custom Color",
        "weightLb": 0,
        "length": 0,
        "width": 0,
        "height": 0
    },
    {
        "commonName": "4' - 1\" x 3\" Toprail - Black",
        "weightLb": 0,
        "length": 48.0,
        "width": 3.0,
        "height": 1.0
    },
    {
        "commonName": "4' - 1\" x 3\" Toprail - Custom Color",
        "weightLb": 0,
        "length": 48.0,
        "width": 3.0,
        "height": 1.0
    },
    {
        "commonName": "42\" Cable Railing - Corner Post -  Fascia Mount -  Black",
        "weightLb": 5.2,
        "length": 2.0,
        "width": 2.0,
        "height": 48.0
    },
    {
        "commonName": "42\" Cable Railing - Corner Post -  Fascia Mount -  Custom Color",
        "weightLb": 5.2,
        "length": 2.0,
        "width": 2.0,
        "height": 48.0
    },
    {
        "commonName": "42\" Cable Railing - Corner Post -  Surface Mount -  Black",
        "weightLb": 4.2,
        "length": 4.0,
        "width": 4.0,
        "height": 41.0
    },
    {
        "commonName": "42\" Cable Railing - Corner Post -  Surface Mount -  Custom Color",
        "weightLb": 4.2,
        "length": 4.0,
        "width": 4.0,
        "height": 41.0
    },
    {
        "commonName": "42\" Cable Railing - Line Post -  Fascia Mount -  Black",
        "weightLb": 4.6,
        "length": 4.0,
        "width": 4.0,
        "height": 48.0
    },
    {
        "commonName": "42\" Cable Railing - Line Post -  Fascia Mount -  Custom Color",
        "weightLb": 4.6,
        "length": 4.0,
        "width": 4.0,
        "height": 48.0
    },
    {
        "commonName": "42\" Cable Railing - Line Post -  Surface Mount -  Black",
        "weightLb": 4.6,
        "length": 4.0,
        "width": 4.0,
        "height": 41.0
    },
    {
        "commonName": "42\" Cable Railing - Line Post -  Surface Mount -  Custom Color",
        "weightLb": 0,
        "length": 4.0,
        "width": 4.0,
        "height": 41.0
    },
    {
        "commonName": "42\" Cable Railing - Stair Post -  Fascia Mount -  Black",
        "weightLb": 4.2,
        "length": 2.0,
        "width": 2.0,
        "height": 48.0
    },
    {
        "commonName": "42\" Cable Railing - Stair Post -  Fascia Mount -  Custom Color",
        "weightLb": 4.2,
        "length": 2.0,
        "width": 2.0,
        "height": 48.0
    },
    {
        "commonName": "42\" Cable Railing - Stair Post -  Surface Mount -  Black",
        "weightLb": 4.0,
        "length": 4.0,
        "width": 4.0,
        "height": 41.0
    },
    {
        "commonName": "42\" Cable Railing - Stair Post -  Surface Mount -  Custom Color",
        "weightLb": 4.0,
        "length": 4.0,
        "width": 4.0,
        "height": 41.0
    },
    {
        "commonName": "42\" Glass Railing - Corner Post -  Fascia Mount -  Black",
        "weightLb": 5.2,
        "length": 6.0,
        "width": 6.0,
        "height": 48.0
    },
    {
        "commonName": "42\" Glass Railing - Corner Post -  Fascia Mount -  Custom Color",
        "weightLb": 5.2,
        "length": 6.0,
        "width": 6.0,
        "height": 48.0
    },
    {
        "commonName": "42\" Glass Railing - Corner Post -  Surface Mount -  Black",
        "weightLb": 4.2,
        "length": 4.0,
        "width": 4.0,
        "height": 41.0
    },
    {
        "commonName": "42\" Glass Railing - Corner Post -  Surface Mount -  Custom Color",
        "weightLb": 4.2,
        "length": 4.0,
        "width": 4.0,
        "height": 41.0
    },
    {
        "commonName": "42\" Glass Railing - Line Post -  Fascia Mount -  Black",
        "weightLb": 4.6,
        "length": 4.0,
        "width": 4.0,
        "height": 48.0
    },
    {
        "commonName": "42\" Glass Railing - Line Post -  Fascia Mount -  Custom Color",
        "weightLb": 4.6,
        "length": 4.0,
        "width": 4.0,
        "height": 48.0
    },
    {
        "commonName": "42\" Glass Railing - Line Post -  Surface Mount -  Black",
        "weightLb": 4.2,
        "length": 4.0,
        "width": 4.0,
        "height": 41.0
    },
    {
        "commonName": "42\" Glass Railing - Line Post -  Surface Mount -  Custom Color",
        "weightLb": 4.2,
        "length": 4.0,
        "width": 4.0,
        "height": 41.0
    },
    {
        "commonName": "42\" Glass Railing - Stair Post -  Fascia Mount -  Black",
        "weightLb": 4.2,
        "length": 2.0,
        "width": 2.0,
        "height": 48.0
    },
    {
        "commonName": "42\" Glass Railing - Stair Post -  Fascia Mount -  Custom Color",
        "weightLb": 4.2,
        "length": 2.0,
        "width": 2.0,
        "height": 48.0
    },
    {
        "commonName": "42\" Glass Railing - Stair Post -  Surface Mount -  Black",
        "weightLb": 0,
        "length": 0,
        "width": 0,
        "height": 0
    },
    {
        "commonName": "42\" Glass Railing - Stair Post -  Surface Mount -  Custom Color",
        "weightLb": 0,
        "length": 0,
        "width": 0,
        "height": 0
    },
    {
        "commonName": "8' - 1\" x 3\" Toprail - Black",
        "weightLb": 0,
        "length": 0,
        "width": 0,
        "height": 0
    },
    {
        "commonName": "8' - 1\" x 3\" Toprail - Custom Color",
        "weightLb": 0,
        "length": 0,
        "width": 0,
        "height": 0
    },
    {
        "commonName": "Angle Washer - Stainless - Polished",
        "weightLb": 0,
        "length": 0,
        "width": 0,
        "height": 0
    },
    {
        "commonName": "Component - Post Surface Mount Plate",
        "weightLb": 0,
        "length": 0,
        "width": 0,
        "height": 0
    },
    {
        "commonName": "Component - Post Top Rail Plate",
        "weightLb": 0,
        "length": 0,
        "width": 0,
        "height": 0
    },
    {
        "commonName": "Stair Post Toprail Angle Bracket",
        "weightLb": 0,
        "length": 0,
        "width": 0,
        "height": 0
    },
    {
        "commonName": "Surface Mount Post Screws - Stainless - Black Finish",
        "weightLb": 0,
        "length": 0,
        "width": 0,
        "height": 0
    },
    {
        "commonName": "Top Rail End Cap",
        "weightLb": 0,
        "length": 0,
        "width": 0,
        "height": 0
    }
],

  // Daily Huddle Board — standup entries (structure ready, data entry per shift)
  huddleBoard: [],

    // ─── Backward-compatible keys (v4 components reference these — do NOT remove) ──
  // inventory: merged view of rawMaterials + assemblyItems + shopConsumables
  inventory: [
    {
        "id": "RM-001",
        "name": "6061-T6 Tube 1\"x3\"x1/8\"",
        "cat": "Aluminum Tube/Pipe",
        "alloy": "6061-T6",
        "size": "1\"x3\"x1/8\"",
        "finish": "Mill",
        "unit": "FT",
        "qty": 940.0,
        "minOnHand": 500.0,
        "reorder": 750.0,
        "reorderQty": 2000.0,
        "status": "OK",
        "cost": 3.47,
        "value": 3261.8,
        "vendor": "EMJ",
        "partNo": "",
        "loc": "Rack A1",
        "notes": "High-volume item",
        "sku": "RM-001",
        "type": "Raw Material"
    },
    {
        "id": "RM-002",
        "name": "6061-T6 Bar 1/8\"x2\"",
        "cat": "Aluminum Flat Bar",
        "alloy": "6061-T6",
        "size": "1/8\"x2\"",
        "finish": "Mill",
        "unit": "FT",
        "qty": 31.0,
        "minOnHand": 100.0,
        "reorder": 200.0,
        "reorderQty": 500.0,
        "status": "CRITICAL",
        "cost": 4.25,
        "value": 131.75,
        "vendor": "",
        "partNo": "",
        "loc": "Rack A2",
        "notes": "",
        "sku": "RM-002",
        "type": "Raw Material"
    },
    {
        "id": "RM-003",
        "name": "6061-T6 Tube 2\"x1/8\"",
        "cat": "Aluminum Tube/Pipe",
        "alloy": "6061-T6",
        "size": "2\"x1/8\"",
        "finish": "Mill",
        "unit": "FT",
        "qty": 80.0,
        "minOnHand": 500.0,
        "reorder": 1000.0,
        "reorderQty": 2000.0,
        "status": "CRITICAL",
        "cost": 4.25,
        "value": 340.0,
        "vendor": "",
        "partNo": "",
        "loc": "Rack A3",
        "notes": "",
        "sku": "RM-003",
        "type": "Raw Material"
    },
    {
        "id": "RM-004",
        "name": "6061-T6 Bar 1/4\"x 4\"",
        "cat": "Aluminum Flat Bar",
        "alloy": "6061-T6",
        "size": " 1/4\"x 4\"",
        "finish": "Mill",
        "unit": "FT",
        "qty": 60.0,
        "minOnHand": 100.0,
        "reorder": 300.0,
        "reorderQty": 400.0,
        "status": "CRITICAL",
        "cost": 4.25,
        "value": 255.0,
        "vendor": "",
        "partNo": "",
        "loc": "Rack A4",
        "notes": "",
        "sku": "RM-004",
        "type": "Raw Material"
    },
    {
        "id": "RM-005",
        "name": "6061-T6 Angle 2\"x 4\"x1/8\"",
        "cat": "Aluminum Angle",
        "alloy": "6061-T6",
        "size": "2\"x 4\"x1/8\"",
        "finish": "Mill",
        "unit": "FT",
        "qty": 41.0,
        "minOnHand": 100.0,
        "reorder": 150.0,
        "reorderQty": 250.0,
        "status": "CRITICAL",
        "cost": 4.25,
        "value": 174.25,
        "vendor": "",
        "partNo": "",
        "loc": "Rack A5",
        "notes": "",
        "sku": "RM-005",
        "type": "Raw Material"
    },
    {
        "id": "RM-006",
        "name": "6061-T6 Tube 1\"x2\"x1/8\"",
        "cat": "Aluminum Tube/Pipe",
        "alloy": "6061-T6",
        "size": "1\"x2\"x1/8\"",
        "finish": "Mill",
        "unit": "FT",
        "qty": 147.0,
        "minOnHand": 250.0,
        "reorder": 300.0,
        "reorderQty": 500.0,
        "status": "CRITICAL",
        "cost": 4.25,
        "value": 624.75,
        "vendor": "",
        "partNo": "",
        "loc": "Rack A6",
        "notes": "",
        "sku": "RM-006",
        "type": "Raw Material"
    },
    {
        "id": "RM-007",
        "name": "6061-T6 Angle 2\"x 2\"x1/8\"",
        "cat": "Aluminum Angle",
        "alloy": "6061-T6",
        "size": "2\"x 2\"x1/8\"",
        "finish": "Mill",
        "unit": "FT",
        "qty": 5.0,
        "minOnHand": 100.0,
        "reorder": 150.0,
        "reorderQty": 250.0,
        "status": "CRITICAL",
        "cost": 4.25,
        "value": 21.25,
        "vendor": "",
        "partNo": "",
        "loc": "Rack A7",
        "notes": "",
        "sku": "RM-007",
        "type": "Raw Material"
    },
    {
        "id": "RM-008",
        "name": "6061-T6 Bar 1/4\"x 3\"",
        "cat": "Aluminum Flat Bar",
        "alloy": "6061-T6",
        "size": "1/4\"x 3\"",
        "finish": "Mill",
        "unit": "FT",
        "qty": 36.0,
        "minOnHand": 15.0,
        "reorder": 25.0,
        "reorderQty": 50.0,
        "status": "OK",
        "cost": 4.25,
        "value": 153.0,
        "vendor": "",
        "partNo": "",
        "loc": "Rack A8",
        "notes": "",
        "sku": "RM-008",
        "type": "Raw Material"
    },
    {
        "id": "RM-009",
        "name": "6061-T6 Angle 1.5\"x 1.5\"x 1/8\"",
        "cat": "Aluminum Angle",
        "alloy": "6061-T6",
        "size": " 1.5\"x 1.5\"x 1/8\"",
        "finish": "Mill",
        "unit": "FT",
        "qty": 24.0,
        "minOnHand": 5.0,
        "reorder": 10.0,
        "reorderQty": 15.0,
        "status": "OK",
        "cost": 4.25,
        "value": 102.0,
        "vendor": "",
        "partNo": "",
        "loc": "Rack A9",
        "notes": "",
        "sku": "RM-009",
        "type": "Raw Material"
    },
    {
        "id": "RM-010",
        "name": "6061-T6 Bar 1/8\"x 4\"",
        "cat": "Aluminum Flat Bar",
        "alloy": "6061-T6",
        "size": "1/8\"x 4\"",
        "finish": "Mill",
        "unit": "FT",
        "qty": 58.0,
        "minOnHand": 300.0,
        "reorder": 600.0,
        "reorderQty": 800.0,
        "status": "CRITICAL",
        "cost": 4.25,
        "value": 246.5,
        "vendor": "",
        "partNo": "",
        "loc": "Rack A10",
        "notes": "",
        "sku": "RM-010",
        "type": "Raw Material"
    },
    {
        "id": "RM-011",
        "name": "6061-T6 Tube 1/8\"x3/4\"",
        "cat": "Aluminum Tube/Pipe",
        "alloy": "6061-T6",
        "size": "1/8\"x3/4\"",
        "finish": "Mill",
        "unit": "FT",
        "qty": 300.0,
        "minOnHand": 20.0,
        "reorder": 25.0,
        "reorderQty": 20.0,
        "status": "OK",
        "cost": 4.25,
        "value": 1275.0,
        "vendor": "",
        "partNo": "",
        "loc": "Rack A11",
        "notes": "",
        "sku": "RM-011",
        "type": "Raw Material"
    },
    {
        "id": "RM-012",
        "name": "6061-T6 Pipe 1 7/8\"x .125\"",
        "cat": "Aluminum Tube/Pipe",
        "alloy": "6061-T6",
        "size": "1 7/8\"x .125\"",
        "finish": "Mill",
        "unit": "FT",
        "qty": 15.0,
        "minOnHand": 10.0,
        "reorder": 15.0,
        "reorderQty": 40.0,
        "status": "LOW",
        "cost": 4.25,
        "value": 63.75,
        "vendor": "",
        "partNo": "",
        "loc": "Rack A12",
        "notes": "",
        "sku": "RM-012",
        "type": "Raw Material"
    },
    {
        "id": "RM-013",
        "name": "6061-T6 Angle 2.5\"x2.5\"x1/4\"",
        "cat": "Aluminum Angle",
        "alloy": "6061-T6",
        "size": "2.5\"x2.5\"x1/4\"",
        "finish": "Mill",
        "unit": "FT",
        "qty": 16.0,
        "minOnHand": 10.0,
        "reorder": 15.0,
        "reorderQty": 40.0,
        "status": "OK",
        "cost": 4.25,
        "value": 68.0,
        "vendor": "",
        "partNo": "",
        "loc": "Rack A13",
        "notes": "",
        "sku": "RM-013",
        "type": "Raw Material"
    },
    {
        "id": "RM-014",
        "name": "6061-T6 Angle \"ROUNDED\" 2\"x4\"x1/4\"",
        "cat": "Aluminum Angle",
        "alloy": "6061-T6",
        "size": " 2\"x4\"x1/4\"",
        "finish": "Mill",
        "unit": "FT",
        "qty": 20.0,
        "minOnHand": 2.0,
        "reorder": 5.0,
        "reorderQty": 20.0,
        "status": "OK",
        "cost": 4.25,
        "value": 85.0,
        "vendor": "",
        "partNo": "",
        "loc": "Rack A14",
        "notes": "",
        "sku": "RM-014",
        "type": "Raw Material"
    },
    {
        "id": "RM-015",
        "name": "6061-T6 Angle 2\"x4\"x1/4\"",
        "cat": "Aluminum Angle",
        "alloy": "6061-T6",
        "size": " 2\"x4\"x1/4\"",
        "finish": "Mill",
        "unit": "FT",
        "qty": 7.0,
        "minOnHand": 20.0,
        "reorder": 30.0,
        "reorderQty": 40.0,
        "status": "CRITICAL",
        "cost": 4.25,
        "value": 29.75,
        "vendor": "",
        "partNo": "",
        "loc": "Rack A15",
        "notes": "",
        "sku": "RM-015",
        "type": "Raw Material"
    },
    {
        "id": "RM-016",
        "name": "6061-T6 Angle 4\"x4\"x1/2\"",
        "cat": "Aluminum Angle",
        "alloy": "6061-T6",
        "size": "4\"x4\"x1/2\"",
        "finish": "Mill",
        "unit": "FT",
        "qty": 18.0,
        "minOnHand": 5.0,
        "reorder": 10.0,
        "reorderQty": 40.0,
        "status": "OK",
        "cost": 4.25,
        "value": 76.5,
        "vendor": "",
        "partNo": "",
        "loc": "Rack A16",
        "notes": "",
        "sku": "RM-016",
        "type": "Raw Material"
    },
    {
        "id": "RM-017",
        "name": "Powder - T009-BG01",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Gloss-Smooth",
        "size": "25LB",
        "finish": "Almond 90",
        "unit": "LB",
        "qty": 32.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "T009-BG01",
        "loc": "Shelf A1",
        "notes": "",
        "sku": "RM-017",
        "type": "Raw Material"
    },
    {
        "id": "RM-018",
        "name": "Powder - T002-WH08",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Semi-Gloss Smooth",
        "size": "25LB",
        "finish": "White",
        "unit": "LB",
        "qty": 41.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "T002-WH08",
        "loc": "Shelf A2",
        "notes": "",
        "sku": "RM-018",
        "type": "Raw Material"
    },
    {
        "id": "RM-019",
        "name": "Powder - T075-BK211",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Semi-Gloss Vein  ",
        "size": "25LB",
        "finish": "Copper",
        "unit": "LB",
        "qty": 16.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "T075-BK211",
        "loc": "Shelf A3",
        "notes": "",
        "sku": "RM-019",
        "type": "Raw Material"
    },
    {
        "id": "RM-020",
        "name": "Powder - T002-BK08",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Semi-Gloss Smooth ",
        "size": "25LB",
        "finish": "Black",
        "unit": "LB",
        "qty": 19.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "T002-BK08",
        "loc": "Shelf A4",
        "notes": "",
        "sku": "RM-020",
        "type": "Raw Material"
    },
    {
        "id": "RM-021",
        "name": "Powder - C013-GR08",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Semi-Gloss Hammer",
        "size": "25LB",
        "finish": "Gray",
        "unit": "LB",
        "qty": 8.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "C013-GR08",
        "loc": "Shelf A5",
        "notes": "",
        "sku": "RM-021",
        "type": "Raw Material"
    },
    {
        "id": "RM-022",
        "name": "Powder - T005-BK78",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Semi-Gloss Smooth",
        "size": "25LB",
        "finish": "Black",
        "unit": "LB",
        "qty": 15.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "T005-BK78",
        "loc": "Shelf A6",
        "notes": "",
        "sku": "RM-022",
        "type": "Raw Material"
    },
    {
        "id": "RM-023",
        "name": "Powder - C241-GR305",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Semi-Gloss Texture",
        "size": "5LB",
        "finish": "Bay Gray",
        "unit": "LB",
        "qty": 5.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "C241-GR305",
        "loc": "Shelf A7",
        "notes": "",
        "sku": "RM-023",
        "type": "Raw Material"
    },
    {
        "id": "RM-024",
        "name": "Powder - C206-BK266",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Semi-Gloss Smooth",
        "size": "50LB",
        "finish": "Black",
        "unit": "LB",
        "qty": 43.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "C206-BK266",
        "loc": "Shelf A8",
        "notes": "",
        "sku": "RM-024",
        "type": "Raw Material"
    },
    {
        "id": "RM-025",
        "name": "Powder - C241-GR07",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Semi-Gloss Texture",
        "size": "25LB",
        "finish": "Gray",
        "unit": "LB",
        "qty": 13.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "C241-GR07",
        "loc": "Shelf A9",
        "notes": "",
        "sku": "RM-025",
        "type": "Raw Material"
    },
    {
        "id": "RM-026",
        "name": "Powder - T025-BR01",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Semi-Gloss  ",
        "size": "25LB",
        "finish": "Bronze 50",
        "unit": "LB",
        "qty": 31.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "T025-BR01",
        "loc": "Shelf A10",
        "notes": "",
        "sku": "RM-026",
        "type": "Raw Material"
    },
    {
        "id": "RM-027",
        "name": "Powder - T243-GR301",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Semi-Gloss Texture",
        "size": "5LB",
        "finish": "Quartz Gray",
        "unit": "LB",
        "qty": 12.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "T243-GR301",
        "loc": "Shelf A11",
        "notes": "",
        "sku": "RM-027",
        "type": "Raw Material"
    },
    {
        "id": "RM-028",
        "name": "Powder - T064-BR24",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Semi-Gloss Hammertone",
        "size": "25LB",
        "finish": "Bronze  ",
        "unit": "LB",
        "qty": 9.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "T064-BR24",
        "loc": "Shelf A12",
        "notes": "",
        "sku": "RM-028",
        "type": "Raw Material"
    },
    {
        "id": "RM-029",
        "name": "Powder - T013-GR185",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Semi-Gloss Hammer",
        "size": "25LB",
        "finish": "RAL 7035-Light Grey",
        "unit": "LB",
        "qty": 9.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "T013-GR185",
        "loc": "Shelf A13",
        "notes": "",
        "sku": "RM-029",
        "type": "Raw Material"
    },
    {
        "id": "RM-030",
        "name": "Powder - T291-BR251",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Semi-Gloss Texture",
        "size": "25LB",
        "finish": "Oil Rubbed Bronze",
        "unit": "LB",
        "qty": 8.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "T291-BR251",
        "loc": "Shelf A14",
        "notes": "",
        "sku": "RM-030",
        "type": "Raw Material"
    },
    {
        "id": "RM-031",
        "name": "Powder - T091-BR47",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Semi-Gloss Texture",
        "size": "50LB",
        "finish": "Rust",
        "unit": "LB",
        "qty": 30.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "T091-BR47",
        "loc": "Shelf A15",
        "notes": "",
        "sku": "RM-031",
        "type": "Raw Material"
    },
    {
        "id": "RM-032",
        "name": "Powder - T375-BK26",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Semi-Gloss Vein  ",
        "size": "50LB",
        "finish": "Silver",
        "unit": "LB",
        "qty": 36.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "T375-BK26",
        "loc": "Shelf A16",
        "notes": "",
        "sku": "RM-032",
        "type": "Raw Material"
    },
    {
        "id": "RM-033",
        "name": "Powder - T012-BR161",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Semi-Gloss Hammer",
        "size": "5LB",
        "finish": "Bronze  ",
        "unit": "LB",
        "qty": 5.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "T012-BR161",
        "loc": "Shelf A17",
        "notes": "",
        "sku": "RM-033",
        "type": "Raw Material"
    },
    {
        "id": "RM-035",
        "name": "Powder - P000-BK247",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Flat - Smooth",
        "size": "25LB",
        "finish": "Black",
        "unit": "LB",
        "qty": 16.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "P000-BK247",
        "loc": "Shelf A18",
        "notes": "",
        "sku": "RM-035",
        "type": "Raw Material"
    },
    {
        "id": "RM-036",
        "name": "Powder - T375-BK07",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Semi-Gloss Vein  ",
        "size": "50LB",
        "finish": "Copper",
        "unit": "LB",
        "qty": 74.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "T375-BK07",
        "loc": "Shelf A19",
        "notes": "",
        "sku": "RM-036",
        "type": "Raw Material"
    },
    {
        "id": "RM-037",
        "name": "Powder - C031-WH120",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Semi-Gloss Texture",
        "size": "50LB",
        "finish": "White",
        "unit": "LB",
        "qty": 37.0,
        "minOnHand": 50.0,
        "reorder": 75.0,
        "reorderQty": 100.0,
        "status": "CRITICAL",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "C031-WH120",
        "loc": "Shelf A20",
        "notes": "",
        "sku": "RM-037",
        "type": "Raw Material"
    },
    {
        "id": "RM-038",
        "name": "Powder -  T238-GR2070",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Gloss-Smooth",
        "size": "25LB",
        "finish": "RAL 7035-Light Grey",
        "unit": "LB",
        "qty": 21.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "T238-GR2070",
        "loc": "Shelf A21",
        "notes": "",
        "sku": "RM-038",
        "type": "Raw Material"
    },
    {
        "id": "RM-039",
        "name": "Powder -  T209 - C101",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Gloss-Smooth",
        "size": "50LB",
        "finish": "Clear",
        "unit": "LB",
        "qty": 41.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "T209 - C101",
        "loc": "Shelf A22",
        "notes": "",
        "sku": "RM-039",
        "type": "Raw Material"
    },
    {
        "id": "RM-040",
        "name": "Powder - C209-BR358",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Gloss-Smooth",
        "size": "25LB",
        "finish": "RAL 8028-Terra Brown 90",
        "unit": "LB",
        "qty": 20.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "C209-BR358",
        "loc": "Shelf A23",
        "notes": "",
        "sku": "RM-040",
        "type": "Raw Material"
    },
    {
        "id": "RM-041",
        "name": "Powder - E305-GR533",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Semi-Gloss Smooth",
        "size": "25LB",
        "finish": "Gray Primer",
        "unit": "LB",
        "qty": 5.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "E305-GR533",
        "loc": "Shelf A24",
        "notes": "",
        "sku": "RM-041",
        "type": "Raw Material"
    },
    {
        "id": "RM-042",
        "name": "Powder - P000-BG631",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Flat - Smooth",
        "size": "5LB",
        "finish": "FS 33446-Desert Sand",
        "unit": "LB",
        "qty": 8.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "P000-BG631",
        "loc": "Shelf A25",
        "notes": "",
        "sku": "RM-042",
        "type": "Raw Material"
    },
    {
        "id": "RM-043",
        "name": "Powder - C241-BK303",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Semi-Gloss Texture",
        "size": "50LB",
        "finish": "Black",
        "unit": "LB",
        "qty": 40.0,
        "minOnHand": 100.0,
        "reorder": 150.0,
        "reorderQty": 200.0,
        "status": "CRITICAL",
        "cost": 5.2,
        "value": 208.0,
        "vendor": "Cardinal",
        "partNo": "C241-BK303",
        "loc": "Shelf A26",
        "notes": "",
        "sku": "RM-043",
        "type": "Raw Material"
    },
    {
        "id": "RM-044",
        "name": "Powder - T032-BL04",
        "cat": "Powder Coat (Bulk)",
        "alloy": "Semi-Gloss Texture",
        "size": "5",
        "finish": "FS 25109 - Blue",
        "unit": "LB",
        "qty": 0.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "CRITICAL",
        "cost": 12.8,
        "value": 0.0,
        "vendor": "Cardinal",
        "partNo": "T032-BL04",
        "loc": "Shelf A27",
        "notes": "",
        "sku": "RM-044",
        "type": "Raw Material"
    },
    {
        "id": "RM-045",
        "name": "Touch-Up Paint",
        "cat": "Spray Paint",
        "alloy": "Textured Black",
        "size": "Can",
        "finish": "Black",
        "unit": "EA",
        "qty": 2.0,
        "minOnHand": 1.0,
        "reorder": 2.0,
        "reorderQty": 4.0,
        "status": "LOW",
        "cost": 10.98,
        "value": 21.96,
        "vendor": "Home Depot",
        "partNo": "",
        "loc": "Shelf A28",
        "notes": "",
        "sku": "RM-045",
        "type": "Raw Material"
    },
    {
        "id": "RM-046",
        "name": "Touch-Up Paint",
        "cat": "",
        "alloy": "",
        "size": "",
        "finish": "",
        "unit": "",
        "qty": 0.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "",
        "partNo": "",
        "loc": "",
        "notes": "",
        "sku": "RM-046",
        "type": "Raw Material"
    },
    {
        "id": "AI-001",
        "name": "1/8\" Cable SS",
        "cat": "Cable",
        "spec": "1/8\"",
        "material": "316 SS",
        "finish": "Natural",
        "unit": "FT",
        "qty": 1900.0,
        "minOnHand": 1000.0,
        "reorder": 2000.0,
        "reorderQty": 3000.0,
        "status": "LOW",
        "cost": 0.12,
        "value": 228.0,
        "vendor": "VEVOR",
        "partNo": "",
        "loc": "Bin A1",
        "sku": "AI-001",
        "type": "Assembly"
    },
    {
        "id": "AI-002",
        "name": "#11 Self-Tap Screw, Sq Drive Pan Head",
        "cat": "Self-Tap Screw",
        "spec": "#11x3/4\"",
        "material": "316 SS",
        "finish": "Black",
        "unit": "EA",
        "qty": 12300.0,
        "minOnHand": 500.0,
        "reorder": 1000.0,
        "reorderQty": 2000.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "TBD \u2013 Evaluating",
        "partNo": "",
        "loc": "Bin E1",
        "sku": "AI-002",
        "type": "Assembly"
    },
    {
        "id": "AI-004",
        "name": "Post Screw - 3/16 x 2 7/8\" Lock Head, T-25 Drive, Black",
        "cat": "Post Screws",
        "spec": "3/16 x 2 7/8",
        "material": "Carbon Steel",
        "finish": "Black",
        "unit": "EA",
        "qty": 25.0,
        "minOnHand": 500.0,
        "reorder": 750.0,
        "reorderQty": 1000.0,
        "status": "CRITICAL",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "TBD \u2013 Evaluating",
        "partNo": "",
        "loc": "Bin F1",
        "sku": "AI-004",
        "type": "Assembly"
    },
    {
        "id": "AI-005",
        "name": "Lag Bolt - Hex Head, SS",
        "cat": "Lags",
        "spec": "3/8\" x 5\"",
        "material": "316 SS",
        "finish": "Natural",
        "unit": "EA",
        "qty": 2800.0,
        "minOnHand": 100.0,
        "reorder": 200.0,
        "reorderQty": 1000.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "TBD \u2013 Evaluating",
        "partNo": "",
        "loc": "Bin F1",
        "sku": "AI-005",
        "type": "Assembly"
    },
    {
        "id": "AI-008",
        "name": "Lag Bolt Washer - 7/16\", O.D 49/64\" SS",
        "cat": "Washers",
        "spec": "7/16\"",
        "material": "316 SS",
        "finish": "Natural",
        "unit": "EA",
        "qty": 219.0,
        "minOnHand": 150.0,
        "reorder": 300.0,
        "reorderQty": 500.0,
        "status": "LOW",
        "cost": 0.28,
        "value": 61.32,
        "vendor": "TBD \u2013 Evaluating",
        "partNo": "",
        "loc": "Bin F2",
        "sku": "AI-008",
        "type": "Assembly"
    },
    {
        "id": "AI-009",
        "name": "Swage Washer - 1/4\", O.D 15/32\" SS \"Small\"",
        "cat": "Washers",
        "spec": "1/4\" x 49/64\" OD",
        "material": "316 SS",
        "finish": "Natural",
        "unit": "EA",
        "qty": 1532.0,
        "minOnHand": 200.0,
        "reorder": 400.0,
        "reorderQty": 600.0,
        "status": "OK",
        "cost": 0.18,
        "value": 275.76,
        "vendor": "TBD \u2013 Evaluating",
        "partNo": "",
        "loc": "Bin F2",
        "sku": "AI-009",
        "type": "Assembly"
    },
    {
        "id": "AI-010",
        "name": "Swage Washer - 1/4\", O.D 5/8\" SS \"Large\"",
        "cat": "Washers",
        "spec": "1/4\" x 5/8\" OD",
        "material": "316 SS",
        "finish": "Natural",
        "unit": "EA",
        "qty": 1532.0,
        "minOnHand": 75.0,
        "reorder": 150.0,
        "reorderQty": 250.0,
        "status": "OK",
        "cost": 1.95,
        "value": 2987.4,
        "vendor": "TBD \u2013 Evaluating",
        "partNo": "",
        "loc": "Bin E2",
        "sku": "AI-010",
        "type": "Assembly"
    },
    {
        "id": "AI-011",
        "name": "Swage Nut - 1/4\" NC -  Hex, SS",
        "cat": "Nuts",
        "spec": "1/8\" LH",
        "material": "316 SS",
        "finish": "Natural",
        "unit": "EA",
        "qty": 1532.0,
        "minOnHand": 75.0,
        "reorder": 150.0,
        "reorderQty": 250.0,
        "status": "OK",
        "cost": 1.95,
        "value": 2987.4,
        "vendor": "TBD \u2013 Evaluating",
        "partNo": "",
        "loc": "Bin E2",
        "sku": "AI-011",
        "type": "Assembly"
    },
    {
        "id": "AI-012",
        "name": "Tensioner Body \u2013 1/4\" NC Thread -  1/8\" Cable",
        "cat": "Tensioners",
        "spec": "1/8\"x1/4\"x3 7/8\"",
        "material": "316 SS",
        "finish": "Natural",
        "unit": "EA",
        "qty": 1532.0,
        "minOnHand": 50.0,
        "reorder": 100.0,
        "reorderQty": 150.0,
        "status": "OK",
        "cost": 3.4,
        "value": 5208.8,
        "vendor": "TBD \u2013 Evaluating",
        "partNo": "",
        "loc": "Bin E2",
        "sku": "AI-012",
        "type": "Assembly"
    },
    {
        "id": "AI-013",
        "name": "Swage Acorn Nut - 1/4\" SS",
        "cat": "Nuts",
        "spec": "1/4\"",
        "material": "316 SS",
        "finish": "Natural",
        "unit": "EA",
        "qty": 1532.0,
        "minOnHand": 100.0,
        "reorder": 200.0,
        "reorderQty": 300.0,
        "status": "OK",
        "cost": 0.35,
        "value": 536.2,
        "vendor": "TBD \u2013 Evaluating",
        "partNo": "",
        "loc": "Bin E2",
        "sku": "AI-013",
        "type": "Assembly"
    },
    {
        "id": "AI-014",
        "name": "Swage Angle Washer - 1/4\" ID  x  57\u00b0",
        "cat": "Angle Washers",
        "spec": "57\u00b0",
        "material": "316 SS",
        "finish": "Natural",
        "unit": "EA",
        "qty": 112.0,
        "minOnHand": 8.0,
        "reorder": 15.0,
        "reorderQty": 25.0,
        "status": "OK",
        "cost": 28.5,
        "value": 3192.0,
        "vendor": "TBD \u2013 Evaluating",
        "partNo": "",
        "loc": "Shelf G1",
        "sku": "AI-014",
        "type": "Assembly"
    },
    {
        "id": "AI-015",
        "name": "Swage Assembly - 1/8\"",
        "cat": "Swages",
        "spec": "1/8\"",
        "material": "316 SS",
        "finish": "Natural",
        "unit": "EA",
        "qty": 1532.0,
        "minOnHand": 2000.0,
        "reorder": 3000.0,
        "reorderQty": 5000.0,
        "status": "CRITICAL",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "TBD \u2013 Evaluating",
        "partNo": "",
        "loc": "",
        "sku": "AI-015",
        "type": "Assembly"
    },
    {
        "id": "AI-016",
        "name": "Swage Assembly - 1/8\"",
        "cat": "Swages",
        "spec": "1/8\"",
        "material": "316 SS",
        "finish": "Black",
        "unit": "EA",
        "qty": 16.0,
        "minOnHand": 1000.0,
        "reorder": 1500.0,
        "reorderQty": 2000.0,
        "status": "CRITICAL",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "TBD \u2013 Evaluating",
        "partNo": "",
        "loc": "",
        "sku": "AI-016",
        "type": "Assembly"
    },
    {
        "id": "AI-017",
        "name": "Swage Angle Washer - 1/4\" ID  x  57\u00b0",
        "cat": "Angle Washers",
        "spec": "57\u00b0",
        "material": "316 SS",
        "finish": "Black",
        "unit": "EA",
        "qty": 5.0,
        "minOnHand": 0.0,
        "reorder": 0.0,
        "reorderQty": 0.0,
        "status": "OK",
        "cost": 0.0,
        "value": 0.0,
        "vendor": "TBD \u2013 Evaluating",
        "partNo": "",
        "loc": "",
        "sku": "AI-017",
        "type": "Assembly"
    },
    {
        "id": "AI-018",
        "name": "Gate Hinge Kit \u2013 3 1/2\" Self-Closing, Black",
        "cat": "Hinge Kits",
        "spec": "Standard",
        "material": "Steel",
        "finish": "Black",
        "unit": "KIT",
        "qty": 1.0,
        "minOnHand": 8.0,
        "reorder": 15.0,
        "reorderQty": 25.0,
        "status": "CRITICAL",
        "cost": 28.5,
        "value": 28.5,
        "vendor": "TBD \u2013 Evaluating",
        "partNo": "",
        "loc": "Shelf G1",
        "sku": "AI-018",
        "type": "Assembly"
    },
    {
        "id": "AI-019",
        "name": "Handrail End Cap \u2013 3\" x 1\", Black",
        "cat": "End Caps",
        "spec": "3\" x 1\" OD",
        "material": "Plastic",
        "finish": "Black",
        "unit": "EA",
        "qty": 2900.0,
        "minOnHand": 50.0,
        "reorder": 100.0,
        "reorderQty": 150.0,
        "status": "OK",
        "cost": 0.95,
        "value": 2755.0,
        "vendor": "TBD \u2013 Evaluating",
        "partNo": "",
        "loc": "Bin H2",
        "sku": "AI-019",
        "type": "Assembly"
    },
    {
        "id": "AI-020",
        "name": "6 Mil Heavy Duty Poly Tubing Roll - 5\" x 1,000'",
        "cat": "Poly Tubing",
        "spec": "6Mil - 5\"x1,000'",
        "material": "LDPE",
        "finish": "Natural",
        "unit": "EA",
        "qty": 1.0,
        "minOnHand": 1.0,
        "reorder": 2.0,
        "reorderQty": 6.0,
        "status": "CRITICAL",
        "cost": 93.0,
        "value": 93.0,
        "vendor": "ULINE",
        "partNo": "S-2941",
        "loc": "SHELF A1",
        "sku": "AI-020",
        "type": "Assembly"
    },
    {
        "id": "AI-021",
        "name": "6 Mil Heavy Duty Poly Tubing Roll - 6\" x 1,000'",
        "cat": "Poly Tubing",
        "spec": "6Mil - 6\"x1,000'",
        "material": "LDPE",
        "finish": "Natural",
        "unit": "EA",
        "qty": 1.0,
        "minOnHand": 1.0,
        "reorder": 2.0,
        "reorderQty": 6.0,
        "status": "CRITICAL",
        "cost": 111.0,
        "value": 111.0,
        "vendor": "ULINE",
        "partNo": "S-1659",
        "loc": "SHELF A1",
        "sku": "AI-021",
        "type": "Assembly"
    },
    {
        "id": "AI-022",
        "name": "6 Mil Heavy Duty Poly Tubing Roll - 10\" x 1,000'",
        "cat": "Poly Tubing",
        "spec": "6Mil - 10\"x1,000'",
        "material": "LDPE",
        "finish": "Natural",
        "unit": "EA",
        "qty": 1.0,
        "minOnHand": 1.0,
        "reorder": 2.0,
        "reorderQty": 6.0,
        "status": "CRITICAL",
        "cost": 176.0,
        "value": 176.0,
        "vendor": "ULINE",
        "partNo": "S-2239",
        "loc": "SHELF A1",
        "sku": "AI-022",
        "type": "Assembly"
    },
    {
        "id": "AI-023",
        "name": "1 Mil Air Cushion Film for Uline Air Cushion Machine - 1\u00a01\u20444\u00a0x 9 x 13\"",
        "cat": "Air Cushion Film",
        "spec": "1 Mil - 16\"x1,150",
        "material": "MDPE",
        "finish": "Natural",
        "unit": "EA",
        "qty": 1.0,
        "minOnHand": 1.0,
        "reorder": 2.0,
        "reorderQty": 4.0,
        "status": "CRITICAL",
        "cost": 144.0,
        "value": 144.0,
        "vendor": "ULINE",
        "partNo": "S-22468",
        "loc": "SHELF A1",
        "sku": "AI-023",
        "type": "Assembly"
    },
    {
        "id": "AI-024",
        "name": "Cardboard Box (Mini Display)",
        "cat": "Shipping",
        "spec": "21x6x16",
        "material": "paper",
        "finish": "Natural",
        "unit": "EA",
        "qty": 0.0,
        "minOnHand": 2.0,
        "reorder": 1.0,
        "reorderQty": 5.0,
        "status": "CRITICAL",
        "cost": 5.09,
        "value": 0.0,
        "vendor": "ULINE",
        "partNo": "S-16333",
        "loc": "SHELF A2",
        "sku": "AI-024",
        "type": "Assembly"
    },
    {
        "id": "PSC-001",
        "name": "Argon Bottle",
        "cat": "Weld",
        "unit": "EA",
        "qty": 1.0,
        "reorder": 3.0,
        "status": "CRITICAL",
        "cost": 8.5,
        "vendor": "Airgas",
        "partNo": "",
        "loc": "Shelf W1",
        "sku": "PSC-001",
        "type": "Consumable"
    },
    {
        "id": "PSC-002",
        "name": "84 T Saw Blade/ Alum-Plastic",
        "cat": "Machining",
        "unit": "EA",
        "qty": 1.0,
        "reorder": 1.0,
        "status": "CRITICAL",
        "cost": 74.97,
        "vendor": "Home Depot",
        "partNo": "",
        "loc": "Shelf W2",
        "sku": "PSC-002",
        "type": "Consumable"
    },
    {
        "id": "PSC-003",
        "name": "Lumber 2x4",
        "cat": "Shipping",
        "unit": "EA",
        "qty": 0.0,
        "reorder": 7.0,
        "status": "CRITICAL",
        "cost": 3.98,
        "vendor": "Home Depot",
        "partNo": "",
        "loc": "Shelf W2",
        "sku": "PSC-003",
        "type": "Consumable"
    },
    {
        "id": "PSC-004",
        "name": "Pallet",
        "cat": "Shipping",
        "unit": "EA",
        "qty": 6.0,
        "reorder": 8.0,
        "status": "LOW",
        "cost": 0.0,
        "vendor": "TBD",
        "partNo": "",
        "loc": "Shelf PC1",
        "sku": "PSC-004",
        "type": "Consumable"
    },
    {
        "id": "PSC-005",
        "name": "Gloves",
        "cat": "PPE",
        "unit": "CTN",
        "qty": 0.0,
        "reorder": 1.0,
        "status": "CRITICAL",
        "cost": 19.0,
        "vendor": "ULINE",
        "partNo": "",
        "loc": "Bin PC2",
        "sku": "PSC-005",
        "type": "Consumable"
    },
    {
        "id": "PSC-006",
        "name": "Shop Rags",
        "cat": "Shop",
        "unit": "EA",
        "qty": 0.0,
        "reorder": 1.0,
        "status": "CRITICAL",
        "cost": 0.0,
        "vendor": "TBD",
        "partNo": "",
        "loc": "Bin PC3",
        "sku": "PSC-006",
        "type": "Consumable"
    },
    {
        "id": "PSC-007",
        "name": "Shipping Label's",
        "cat": "Shipping",
        "unit": "EA",
        "qty": 1.0,
        "reorder": 2.0,
        "status": "CRITICAL",
        "cost": 24.0,
        "vendor": "ULINE",
        "partNo": "",
        "loc": "Bin PC4",
        "sku": "PSC-007",
        "type": "Consumable"
    },
    {
        "id": "PSC-008",
        "name": "Sanding Disc",
        "cat": "Prep",
        "unit": "PK",
        "qty": 0.0,
        "reorder": 3.0,
        "status": "CRITICAL",
        "cost": 22.97,
        "vendor": "Home Depot",
        "partNo": "",
        "loc": "Bin PC5",
        "sku": "PSC-008",
        "type": "Consumable"
    },
    {
        "id": "PSC-009",
        "name": "Drill Bits 5/16",
        "cat": "Machining",
        "unit": "EA",
        "qty": 1.0,
        "reorder": 0.0,
        "status": "OK",
        "cost": 0.0,
        "vendor": "A&L",
        "partNo": "",
        "loc": "",
        "sku": "PSC-009",
        "type": "Consumable"
    },
    {
        "id": "PSC-010",
        "name": "Drill Bits 7/16",
        "cat": "Machining",
        "unit": "EA",
        "qty": 1.0,
        "reorder": 0.0,
        "status": "OK",
        "cost": 0.0,
        "vendor": "A&L",
        "partNo": "",
        "loc": "",
        "sku": "PSC-010",
        "type": "Consumable"
    },
    {
        "id": "PSC-011",
        "name": "Drill Bits 3/8",
        "cat": "Machining",
        "unit": "EA",
        "qty": 1.0,
        "reorder": 0.0,
        "status": "OK",
        "cost": 0.0,
        "vendor": "A&L",
        "partNo": "",
        "loc": "",
        "sku": "PSC-011",
        "type": "Consumable"
    },
    {
        "id": "PSC-012",
        "name": "Drill Bits 1/2",
        "cat": "Machining",
        "unit": "EA",
        "qty": 1.0,
        "reorder": 0.0,
        "status": "OK",
        "cost": 0.0,
        "vendor": "A&L",
        "partNo": "",
        "loc": "",
        "sku": "PSC-012",
        "type": "Consumable"
    },
    {
        "id": "PSC-013",
        "name": "Drill Bits 1/8",
        "cat": "Machining",
        "unit": "EA",
        "qty": 1.0,
        "reorder": 0.0,
        "status": "OK",
        "cost": 0.0,
        "vendor": "",
        "partNo": "",
        "loc": "",
        "sku": "PSC-013",
        "type": "Consumable"
    },
    {
        "id": "PSC-014",
        "name": "Cut-Off Wheel",
        "cat": "Weld",
        "unit": "",
        "qty": 0.0,
        "reorder": 0.0,
        "status": "",
        "cost": 0.0,
        "vendor": "",
        "partNo": "",
        "loc": "",
        "sku": "PSC-014",
        "type": "Consumable"
    },
    {
        "id": "PSC-015",
        "name": "Sanding Wheel",
        "cat": "Weld",
        "unit": "",
        "qty": 0.0,
        "reorder": 0.0,
        "status": "",
        "cost": 0.0,
        "vendor": "",
        "partNo": "",
        "loc": "",
        "sku": "PSC-015",
        "type": "Consumable"
    },
    {
        "id": "PSC-016",
        "name": "Filler Rod - #4043 3/32 Alum.",
        "cat": "Weld",
        "unit": "CTN",
        "qty": 0.0,
        "reorder": 0.0,
        "status": "CRITICAL",
        "cost": 0.0,
        "vendor": "",
        "partNo": "",
        "loc": "",
        "sku": "PSC-016",
        "type": "Consumable"
    },
    {
        "id": "PSC-017",
        "name": "Tungsten Rod - 2% Ceriated",
        "cat": "Weld",
        "unit": "EA",
        "qty": 6.0,
        "reorder": 0.0,
        "status": "OK",
        "cost": 0.0,
        "vendor": "",
        "partNo": "",
        "loc": "",
        "sku": "PSC-017",
        "type": "Consumable"
    },
    {
        "id": "PSC-018",
        "name": "Tig Welding Collets - Long- 3/32",
        "cat": "Weld",
        "unit": "EA",
        "qty": 6.0,
        "reorder": 0.0,
        "status": "OK",
        "cost": 0.0,
        "vendor": "",
        "partNo": "",
        "loc": "",
        "sku": "PSC-018",
        "type": "Consumable"
    },
    {
        "id": "PSC-019",
        "name": " Tig Welding Collets - Lens - 3/32",
        "cat": "Weld",
        "unit": "EA",
        "qty": 3.0,
        "reorder": 0.0,
        "status": "OK",
        "cost": 0.0,
        "vendor": "",
        "partNo": "",
        "loc": "",
        "sku": "PSC-019",
        "type": "Consumable"
    },
    {
        "id": "PSC-020",
        "name": "Mig Weld Wire ",
        "cat": "Weld",
        "unit": "EA",
        "qty": 0.0,
        "reorder": 0.0,
        "status": "CRITICAL",
        "cost": 0.0,
        "vendor": "",
        "partNo": "",
        "loc": "",
        "sku": "PSC-020",
        "type": "Consumable"
    },
    {
        "id": "PSC-021",
        "name": "Carbon Dioxide Bottle",
        "cat": "Weld",
        "unit": "EA",
        "qty": 1.0,
        "reorder": 0.0,
        "status": "OK",
        "cost": 0.0,
        "vendor": "",
        "partNo": "",
        "loc": "",
        "sku": "PSC-021",
        "type": "Consumable"
    },
    {
        "id": "PSC-022",
        "name": "Weld Rod - E7018 - 1/8\"",
        "cat": "Weld",
        "unit": "EA",
        "qty": 46.0,
        "reorder": 0.0,
        "status": "OK",
        "cost": 0.0,
        "vendor": "",
        "partNo": "",
        "loc": "",
        "sku": "PSC-022",
        "type": "Consumable"
    },
    {
        "id": "PSC-023",
        "name": "Tig Weld -  Back Cup",
        "cat": "Weld",
        "unit": "EA",
        "qty": 1.0,
        "reorder": 0.0,
        "status": "OK",
        "cost": 0.0,
        "vendor": "",
        "partNo": "",
        "loc": "",
        "sku": "PSC-023",
        "type": "Consumable"
    },
    {
        "id": "PSC-024",
        "name": "Tig Weld -  Back Cup",
        "cat": "Weld",
        "unit": "EA",
        "qty": 1.0,
        "reorder": 0.0,
        "status": "OK",
        "cost": 0.0,
        "vendor": "",
        "partNo": "",
        "loc": "",
        "sku": "PSC-024",
        "type": "Consumable"
    },
    {
        "id": "PSC-025",
        "name": "Tig Weld -  Back Cup",
        "cat": "Weld",
        "unit": "EA",
        "qty": 0.0,
        "reorder": 0.0,
        "status": "CRITICAL",
        "cost": 0.0,
        "vendor": "",
        "partNo": "",
        "loc": "",
        "sku": "PSC-025",
        "type": "Consumable"
    },
    {
        "id": "PSC-026",
        "name": "Tig Gas - Lens Cup",
        "cat": "Weld",
        "unit": "EA",
        "qty": 13.0,
        "reorder": 0.0,
        "status": "OK",
        "cost": 0.0,
        "vendor": "",
        "partNo": "",
        "loc": "",
        "sku": "PSC-026",
        "type": "Consumable"
    },
    {
        "id": "PSC-027",
        "name": "Tig Gas - Lens Body",
        "cat": "Weld",
        "unit": "EA",
        "qty": 4.0,
        "reorder": 0.0,
        "status": "OK",
        "cost": 0.0,
        "vendor": "",
        "partNo": "",
        "loc": "",
        "sku": "PSC-027",
        "type": "Consumable"
    },
    {
        "id": "PSC-028",
        "name": "Tig Collet Body",
        "cat": "Weld",
        "unit": "EA",
        "qty": 1.0,
        "reorder": 0.0,
        "status": "OK",
        "cost": 0.0,
        "vendor": "",
        "partNo": "",
        "loc": "",
        "sku": "PSC-028",
        "type": "Consumable"
    },
    {
        "id": "PSC-029",
        "name": "Tig Ceramic Cup",
        "cat": "Weld",
        "unit": "EA",
        "qty": 8.0,
        "reorder": 0.0,
        "status": "OK",
        "cost": 0.0,
        "vendor": "",
        "partNo": "",
        "loc": "",
        "sku": "PSC-029",
        "type": "Consumable"
    },
    {
        "id": "PSC-030",
        "name": "Wire Brush",
        "cat": "Weld",
        "unit": "EA",
        "qty": 2.0,
        "reorder": 0.0,
        "status": "OK",
        "cost": 0.0,
        "vendor": "",
        "partNo": "",
        "loc": "",
        "sku": "PSC-030",
        "type": "Consumable"
    },
    {
        "id": "PSC-031",
        "name": "Weld Hood - Lens- Outer- Michael",
        "cat": "Weld",
        "unit": "EA",
        "qty": 4.0,
        "reorder": 0.0,
        "status": "OK",
        "cost": 0.0,
        "vendor": "A&L",
        "partNo": "",
        "loc": "",
        "sku": "PSC-031",
        "type": "Consumable"
    },
    {
        "id": "PSC-032",
        "name": "Weld Hood - Lens- Inner- Michael",
        "cat": "Weld",
        "unit": "EA",
        "qty": 4.0,
        "reorder": 0.0,
        "status": "OK",
        "cost": 0.0,
        "vendor": "A&L",
        "partNo": "",
        "loc": "",
        "sku": "PSC-032",
        "type": "Consumable"
    },
    {
        "id": "PSC-033",
        "name": "Weld Hood Band - Michael",
        "cat": "Weld",
        "unit": "EA",
        "qty": 1.0,
        "reorder": 0.0,
        "status": "OK",
        "cost": 0.0,
        "vendor": "NationalWelding",
        "partNo": "",
        "loc": "",
        "sku": "PSC-033",
        "type": "Consumable"
    },
    {
        "id": "PSC-034",
        "name": "Weld Hood Band - Jace",
        "cat": "Weld",
        "unit": "EA",
        "qty": 1.0,
        "reorder": 0.0,
        "status": "OK",
        "cost": 0.0,
        "vendor": "PipeLiners Cloud",
        "partNo": "",
        "loc": "",
        "sku": "PSC-034",
        "type": "Consumable"
    },
    {
        "id": "PSC-035",
        "name": "Drill Press Drive Belt",
        "cat": "Machining",
        "unit": "EA",
        "qty": 0.0,
        "reorder": 2.0,
        "status": "CRITICAL",
        "cost": 0.0,
        "vendor": "Napa Auto",
        "partNo": "",
        "loc": "",
        "sku": "PSC-035",
        "type": "Consumable"
    },
    {
        "id": "PSC-036",
        "name": "Propane",
        "cat": "Powder Coat",
        "unit": "EA",
        "qty": 1.0,
        "reorder": 0.0,
        "status": "OK",
        "cost": 53.27,
        "vendor": "Ace Hardware",
        "partNo": "",
        "loc": "",
        "sku": "PSC-036",
        "type": "Consumable"
    }
],
  // shipments: alias for shipCostLog with normalized id/status
  shipments: [
    {
        "date": "2026-01-13",
        "month": "Jan 2026",
        "poRef": "147979110",
        "customer": "Wayfair - Vahid M",
        "carrier": "ABF Freight",
        "service": "Freight",
        "weight": 22.0,
        "dims": "144x6x6",
        "declaredValue": 100.0,
        "destCity": "Chicago",
        "destState": "IL",
        "baseRate": 407.08,
        "totalCost": 407.08,
        "tracking": "OMG1129858",
        "id": "147979110",
        "status": "Delivered"
    },
    {
        "date": "2026-01-19",
        "month": "Jan 2026",
        "poRef": "147979141",
        "customer": "Farzaneh Fetdows",
        "carrier": "ABF Freight",
        "service": "Freight",
        "weight": 829.0,
        "dims": "144x40x17",
        "declaredValue": 100.0,
        "destCity": "Woodland Hills",
        "destState": "CA",
        "baseRate": 763.85,
        "totalCost": 763.85,
        "tracking": "OMG1208013",
        "id": "147979141",
        "status": "Delivered"
    },
    {
        "date": "2026-01-21",
        "month": "Jan 2026",
        "poRef": "147979150",
        "customer": "Dave Miller",
        "carrier": "ABF Freight",
        "service": "Freight",
        "weight": 298.0,
        "dims": "144x43x18",
        "declaredValue": 100.0,
        "destCity": "Lewes",
        "destState": "DE ",
        "baseRate": 681.25,
        "totalCost": 681.25,
        "tracking": "OMG1079219",
        "id": "147979150",
        "status": "Delivered"
    },
    {
        "date": "2026-01-21",
        "month": "Jan 2026",
        "poRef": "147979149",
        "customer": "Jrscates LLC",
        "carrier": "ABF Freight",
        "service": "Freight",
        "weight": 450.0,
        "dims": "144x44x17",
        "declaredValue": 100.0,
        "destCity": "Cream Ridge",
        "destState": "NJ",
        "baseRate": 737.16,
        "totalCost": 737.16,
        "tracking": "OMG3500598",
        "id": "147979149",
        "status": "Delivered"
    },
    {
        "date": "2026-02-04",
        "month": "Feb 2026",
        "poRef": "432627101",
        "customer": "Kristy Mohoney",
        "carrier": "Other",
        "service": "Freight",
        "weight": 276.0,
        "dims": "147x43x17",
        "declaredValue": 100.0,
        "destCity": "Shoreline",
        "destState": "WA",
        "baseRate": 703.22,
        "totalCost": 703.22,
        "tracking": "310362",
        "id": "432627101",
        "status": "Delivered"
    },
    {
        "date": "2026-02-04",
        "month": "Feb 2026",
        "poRef": "147979217",
        "customer": "Jacob Neal",
        "carrier": "ABF Freight",
        "service": "Freight",
        "weight": 133.0,
        "dims": "98x43x17",
        "declaredValue": 100.0,
        "destCity": "Happy Valley",
        "destState": "OR",
        "baseRate": 409.14,
        "totalCost": 409.14,
        "tracking": "OMG1679662",
        "id": "147979217",
        "status": "Delivered"
    },
    {
        "date": "2026-02-04",
        "month": "Feb 2026",
        "poRef": "147979216",
        "customer": "KGM Construction",
        "carrier": "ABF Freight",
        "service": "Freight",
        "weight": 664.0,
        "dims": "117x43x30",
        "declaredValue": 100.0,
        "destCity": "Templeton",
        "destState": "CA",
        "baseRate": 696.88,
        "totalCost": 696.88,
        "tracking": "OMG9457768",
        "id": "147979216",
        "status": "Delivered"
    },
    {
        "date": "2026-02-16",
        "month": "Feb 2026",
        "poRef": "147979296",
        "customer": "Gregg Luebbe",
        "carrier": "ABF Freight",
        "service": "Freight",
        "weight": 381.0,
        "dims": "144x44x17",
        "declaredValue": 100.0,
        "destCity": "Portland",
        "destState": "OR",
        "baseRate": 409.14,
        "totalCost": 409.14,
        "tracking": "OMG1945564",
        "id": "147979296",
        "status": "Delivered"
    },
    {
        "date": "2026-02-17",
        "month": "Feb 2026",
        "poRef": "147979300",
        "customer": "Andrew Lojewski",
        "carrier": "ABF Freight",
        "service": "Freight",
        "weight": 248.0,
        "dims": "144x44x17",
        "declaredValue": 100.0,
        "destCity": "Davis",
        "destState": "CA",
        "baseRate": 510.94,
        "totalCost": 510.94,
        "tracking": "OMG3833512",
        "id": "147979300",
        "status": "Delivered"
    },
    {
        "date": "2026-02-18",
        "month": "Feb 2026",
        "poRef": "147979314",
        "customer": "Brett Chell",
        "carrier": "ABF Freight",
        "service": "Freight",
        "weight": 875.0,
        "dims": "240x44x17",
        "declaredValue": 100.0,
        "destCity": "Salt Lake City",
        "destState": "UT",
        "baseRate": 1779.31,
        "totalCost": 1779.31,
        "tracking": "OMG1325998",
        "id": "147979314",
        "status": "Delivered"
    },
    {
        "date": "2026-02-18",
        "month": "Feb 2026",
        "poRef": "147979318",
        "customer": "Shem Hart",
        "carrier": "ABF Freight",
        "service": "Freight",
        "weight": 279.0,
        "dims": "144x44x19",
        "declaredValue": 100.0,
        "destCity": "Yacolt",
        "destState": "WA",
        "baseRate": 1077.61,
        "totalCost": 1077.61,
        "tracking": "OMG2058540",
        "id": "147979318",
        "status": "Delivered"
    },
    {
        "date": "2026-02-20",
        "month": "Feb 2026",
        "poRef": "147979333",
        "customer": "Adam Jensen",
        "carrier": "ABF Freight",
        "service": "Freight",
        "weight": 100.0,
        "dims": "144x44x17",
        "declaredValue": 100.0,
        "destCity": "Tigard",
        "destState": "OR",
        "baseRate": 367.26,
        "totalCost": 367.26,
        "tracking": "OMG2015962",
        "id": "147979333",
        "status": "Delivered"
    },
    {
        "date": "2026-02-19",
        "month": "Feb 2026",
        "poRef": "N/A",
        "customer": "Jason Jessop",
        "carrier": "UPS",
        "service": "Ground",
        "weight": 60.0,
        "dims": "49x13x13",
        "declaredValue": 100.0,
        "destCity": "Victor",
        "destState": "MT",
        "baseRate": 79.01,
        "totalCost": 79.01,
        "tracking": "1Z5K02DT0332224203",
        "id": "N/A",
        "status": "Delivered"
    },
    {
        "date": "2026-02-19",
        "month": "Feb 2026",
        "poRef": "N/A",
        "customer": "Jason Jessop",
        "carrier": "UPS",
        "service": "Ground",
        "weight": 60.0,
        "dims": "49x13x13",
        "declaredValue": 100.0,
        "destCity": "Victor",
        "destState": "MT",
        "baseRate": 79.01,
        "totalCost": 79.01,
        "tracking": "1Z5K02DT0310144019",
        "id": "N/A",
        "status": "Delivered"
    },
    {
        "date": "2026-02-19",
        "month": "Feb 2026",
        "poRef": "N/A",
        "customer": "Jason Jessop",
        "carrier": "UPS",
        "service": "Ground",
        "weight": 59.0,
        "dims": "49x13x13",
        "declaredValue": 100.0,
        "destCity": "Victor",
        "destState": "MT",
        "baseRate": 41.98,
        "totalCost": 41.98,
        "tracking": "1Z5K02DT0308501342",
        "id": "N/A",
        "status": "Delivered"
    },
    {
        "date": "2026-02-19",
        "month": "Feb 2026",
        "poRef": "N/A",
        "customer": "Jason Jessop",
        "carrier": "UPS",
        "service": "Ground",
        "weight": 50.0,
        "dims": "48x12x12",
        "declaredValue": 100.0,
        "destCity": "Victor",
        "destState": "MT",
        "baseRate": 41.98,
        "totalCost": 41.98,
        "tracking": "1Z5K02DT0301184350",
        "id": "N/A",
        "status": "Delivered"
    },
    {
        "date": "2026-02-23",
        "month": "Feb 2026",
        "poRef": "N/A",
        "customer": "KGM Construction",
        "carrier": "UPS",
        "service": "Ground",
        "weight": 12.0,
        "dims": "12x15x15",
        "declaredValue": 100.0,
        "destCity": "Templeton",
        "destState": "CA",
        "baseRate": 38.0,
        "totalCost": 38.0,
        "tracking": "1Z5K02DT0302928189",
        "id": "N/A",
        "status": "Delivered"
    },
    {
        "date": "2026-02-23",
        "month": "Feb 2026",
        "poRef": "N/A",
        "customer": "Joe Hurtt",
        "carrier": "UPS",
        "service": "Ground",
        "weight": 12.0,
        "dims": "12x15x15",
        "declaredValue": 100.0,
        "destCity": "Kingston",
        "destState": "CA",
        "baseRate": 38.0,
        "totalCost": 38.0,
        "tracking": "1Z5K02DT0300754398",
        "id": "N/A",
        "status": "Delivered"
    },
    {
        "date": "2026-02-25",
        "month": "Feb 2026",
        "poRef": "N/A",
        "customer": "Joe Christman",
        "carrier": "UPS",
        "service": "Express 2-Day",
        "weight": 3.0,
        "dims": "6x6x6",
        "declaredValue": 100.0,
        "destCity": "Denver",
        "destState": "CO",
        "baseRate": 69.95,
        "totalCost": 69.95,
        "tracking": "1Z5K02DT0137072238",
        "id": "N/A",
        "status": "Delivered"
    },
    {
        "date": "2026-02-26",
        "month": "Feb 2026",
        "poRef": "N/A",
        "customer": "Gregg Luebbe",
        "carrier": "UPS",
        "service": "Express 2-Day",
        "weight": 11.0,
        "dims": "48x12x12",
        "declaredValue": 100.0,
        "destCity": "Portland",
        "destState": "OR",
        "baseRate": 60.81,
        "totalCost": 60.81,
        "tracking": "1Z5K02DT0335782640",
        "id": "N/A",
        "status": "Delivered"
    },
    {
        "date": "2026-03-02",
        "month": "Mar 2026",
        "poRef": "432685222",
        "customer": "Cedrik Cox",
        "carrier": "Estes Freight",
        "service": "Freight",
        "weight": 443.0,
        "dims": "144x48x17",
        "declaredValue": 100.0,
        "destCity": "St. Helens",
        "destState": "OR",
        "baseRate": 754.53,
        "totalCost": 754.53,
        "tracking": "317447",
        "id": "432685222",
        "status": "Delivered"
    },
    {
        "date": "2026-03-06",
        "month": "Mar 2026",
        "poRef": "N/A",
        "customer": "Cedrik Cox",
        "carrier": "UPS",
        "service": "Ground",
        "weight": 1.0,
        "dims": "8x8x7",
        "declaredValue": 100.0,
        "destCity": "St. Helens",
        "destState": "OR",
        "baseRate": 26.45,
        "totalCost": 26.45,
        "tracking": "1Z5K02DT0320589066",
        "id": "N/A",
        "status": "Delivered"
    },
    {
        "date": "2026-03-09",
        "month": "Mar 2026",
        "poRef": "N/A",
        "customer": "Adam Jensen",
        "carrier": "UPS",
        "service": "Next day",
        "weight": 2.0,
        "dims": "6x6x6",
        "declaredValue": 100.0,
        "destCity": "Portland",
        "destState": "OR",
        "baseRate": 54.38,
        "totalCost": 54.38,
        "tracking": "1Z68T1Y81397331898",
        "id": "N/A",
        "status": "Delivered"
    }
],
  // laborRates: alias for laborProcesses
  laborRates: [
    {
        "id": "P-01",
        "dept": "Admin",
        "process": "Order Entry & Acknowledgment",
        "hourlyRate": 40.0,
        "stdTime": 0.25,
        "unitBasis": "Per Order",
        "notes": "Review order sheet, create work order, confirm specs",
        "fullyLoaded": 46.0,
        "costPerUnit": 11.5
    },
    {
        "id": "P-02",
        "dept": "Admin",
        "process": "Material Scheduling & Procurement",
        "hourlyRate": 40.0,
        "stdTime": 0.5,
        "unitBasis": "Per Order",
        "notes": "Check inventory, place POs if needed, schedule production",
        "fullyLoaded": 46.0,
        "costPerUnit": 23.0
    },
    {
        "id": "P-03",
        "dept": "Warehouse",
        "process": "Material Receiving & Inspection",
        "hourlyRate": 40.0,
        "stdTime": 0.5,
        "unitBasis": "Per Order",
        "notes": "Inspect inbound materials against PO, update inventory",
        "fullyLoaded": 46.0,
        "costPerUnit": 23.0
    },
    {
        "id": "P-04",
        "dept": "Warehouse",
        "process": "Kit Pulling & Staging",
        "hourlyRate": 40.0,
        "stdTime": 0.75,
        "unitBasis": "Per Order",
        "notes": "Pull all materials per BOM, stage at production cell",
        "fullyLoaded": 46.0,
        "costPerUnit": 34.5
    },
    {
        "id": "P-05",
        "dept": "Fabrication",
        "process": "CNC Setup & Fixturing",
        "hourlyRate": 40.0,
        "stdTime": 0.5,
        "unitBasis": "Per Setup",
        "notes": "Load program, set fixtures, run test piece",
        "fullyLoaded": 46.0,
        "costPerUnit": 23.0
    },
    {
        "id": "P-06",
        "dept": "Fabrication",
        "process": "CNC Cutting / Machining (Posts)",
        "hourlyRate": 40.0,
        "stdTime": 0.08,
        "unitBasis": "Per Post",
        "notes": "Machine posts to length, drill holes, add features",
        "fullyLoaded": 46.0,
        "costPerUnit": 3.68
    },
    {
        "id": "P-07",
        "dept": "Fabrication",
        "process": "CNC Cutting / Machining (Rails)",
        "hourlyRate": 40.0,
        "stdTime": 0.05,
        "unitBasis": "Per Linear Foot",
        "notes": "Cut rail lengths, machine end profiles",
        "fullyLoaded": 46.0,
        "costPerUnit": 2.3
    },
    {
        "id": "P-08",
        "dept": "Fabrication",
        "process": "Manual Cutting / Deburring",
        "hourlyRate": 40.0,
        "stdTime": 0.03,
        "unitBasis": "Per Linear Foot",
        "notes": "Trim ends, remove burrs, clean edges",
        "fullyLoaded": 46.0,
        "costPerUnit": 1.38
    },
    {
        "id": "P-09",
        "dept": "Fabrication",
        "process": "Punching / Drilling",
        "hourlyRate": 40.0,
        "stdTime": 0.03,
        "unitBasis": "Per Post",
        "notes": "Drill cable holes, punch mounting holes",
        "fullyLoaded": 46.0,
        "costPerUnit": 1.38
    },
    {
        "id": "P-10",
        "dept": "Welding",
        "process": "Welding Setup & Fixture",
        "hourlyRate": 45.0,
        "stdTime": 0.33,
        "unitBasis": "Per Order",
        "notes": "Set up welding fixtures, check drawings",
        "fullyLoaded": 51.75,
        "costPerUnit": 17.08
    },
    {
        "id": "P-11",
        "dept": "Welding",
        "process": "MIG / TIG Welding (Posts)",
        "hourlyRate": 45.0,
        "stdTime": 0.1,
        "unitBasis": "Per Post",
        "notes": "Weld base plates, brackets, and features",
        "fullyLoaded": 51.75,
        "costPerUnit": 5.17
    },
    {
        "id": "P-12",
        "dept": "Welding",
        "process": "Welding (Rails & Components)",
        "hourlyRate": 45.0,
        "stdTime": 0.05,
        "unitBasis": "Per Linear Foot",
        "notes": "Weld rail connections, end caps",
        "fullyLoaded": 51.75,
        "costPerUnit": 2.59
    },
    {
        "id": "P-13",
        "dept": "Welding",
        "process": "Grinding & Weld Finishing",
        "hourlyRate": 45.0,
        "stdTime": 0.05,
        "unitBasis": "Per Post",
        "notes": "Grind welds smooth, prep for coating",
        "fullyLoaded": 51.75,
        "costPerUnit": 2.59
    },
    {
        "id": "P-14",
        "dept": "Powder Coat",
        "process": "Chemical Pre-Treatment / Wash",
        "hourlyRate": 40.0,
        "stdTime": 0.03,
        "unitBasis": "Per Linear Foot",
        "notes": "Clean, degrease, iron phosphate wash",
        "fullyLoaded": 46.0,
        "costPerUnit": 1.38
    },
    {
        "id": "P-15",
        "dept": "Powder Coat",
        "process": "Masking",
        "hourlyRate": 40.0,
        "stdTime": 0.02,
        "unitBasis": "Per Post",
        "notes": "Mask threads, holes, and surfaces not to be coated",
        "fullyLoaded": 46.0,
        "costPerUnit": 0.92
    },
    {
        "id": "P-16",
        "dept": "Powder Coat",
        "process": "Powder Application",
        "hourlyRate": 40.0,
        "stdTime": 0.02,
        "unitBasis": "Per Linear Foot",
        "notes": "Electrostatic powder application",
        "fullyLoaded": 46.0,
        "costPerUnit": 0.92
    },
    {
        "id": "P-17",
        "dept": "Powder Coat",
        "process": "Oven Cure",
        "hourlyRate": 40.0,
        "stdTime": 0.17,
        "unitBasis": "Per Batch",
        "notes": "Cure at 400\u00b0F for 10 minutes minimum (batch based on oven capacity)",
        "fullyLoaded": 46.0,
        "costPerUnit": 7.82
    },
    {
        "id": "P-18",
        "dept": "Powder Coat",
        "process": "QC Inspection - Powder Coat",
        "hourlyRate": 40.0,
        "stdTime": 0.02,
        "unitBasis": "Per Post",
        "notes": "Inspect coverage, thickness, color match",
        "fullyLoaded": 46.0,
        "costPerUnit": 0.92
    },
    {
        "id": "P-19",
        "dept": "Assembly",
        "process": "Hardware Assembly & Kitting",
        "hourlyRate": 40.0,
        "stdTime": 0.1,
        "unitBasis": "Per Order",
        "notes": "Bag & label hardware per section",
        "fullyLoaded": 46.0,
        "costPerUnit": 4.6
    },
    {
        "id": "P-20",
        "dept": "Assembly",
        "process": "Cable Assembly (per run)",
        "hourlyRate": 40.0,
        "stdTime": 0.25,
        "unitBasis": "Per Run",
        "notes": "Route cable, crimp swages, tension cable",
        "fullyLoaded": 46.0,
        "costPerUnit": 11.5
    },
    {
        "id": "P-21",
        "dept": "Assembly",
        "process": "Glass Install & Alignment",
        "hourlyRate": 40.0,
        "stdTime": 0.5,
        "unitBasis": "Per Pane",
        "notes": "Install glass, set level and plumb, torque clamps",
        "fullyLoaded": 46.0,
        "costPerUnit": 23.0
    },
    {
        "id": "P-22",
        "dept": "Assembly",
        "process": "Post Alignment & Final Fit",
        "hourlyRate": 40.0,
        "stdTime": 0.15,
        "unitBasis": "Per Post",
        "notes": "Final alignment check, adjust as needed",
        "fullyLoaded": 46.0,
        "costPerUnit": 6.9
    },
    {
        "id": "P-23",
        "dept": "Quality",
        "process": "Final QC Inspection",
        "hourlyRate": 40.0,
        "stdTime": 0.25,
        "unitBasis": "Per Order",
        "notes": "Full inspection per quality checklist",
        "fullyLoaded": 46.0,
        "costPerUnit": 11.5
    },
    {
        "id": "P-24",
        "dept": "Quality",
        "process": "Measurement Verification",
        "hourlyRate": 40.0,
        "stdTime": 0.1,
        "unitBasis": "Per Run",
        "notes": "Verify all dimensions match order sheet",
        "fullyLoaded": 46.0,
        "costPerUnit": 4.6
    },
    {
        "id": "P-25",
        "dept": "Shipping",
        "process": "Packaging & Crating",
        "hourlyRate": 40.0,
        "stdTime": 0.25,
        "unitBasis": "Per Order",
        "notes": "Package all components, protect with foam/cardboard",
        "fullyLoaded": 46.0,
        "costPerUnit": 11.5
    },
    {
        "id": "P-26",
        "dept": "Shipping",
        "process": "Load & Ship / Delivery Prep",
        "hourlyRate": 40.0,
        "stdTime": 0.25,
        "unitBasis": "Per Order",
        "notes": "Load truck, complete BOL, coordinate delivery",
        "fullyLoaded": 46.0,
        "costPerUnit": 11.5
    }
],
  // purchaseOrders: alias for purchaseLog
  purchaseOrders: [
    {
        "po": "18538062",
        "date": "2026-02-12",
        "vendor": "Ryerson",
        "contact": "Winston Hodgson",
        "item": "6061-T6 Tube 2in SQ x 0.125",
        "cat": "Aluminum Tube",
        "qty": 500.0,
        "unit": "LF",
        "unitCost": 4.6,
        "total": 2300.0,
        "freight": 0.0,
        "grandTotal": 2300.0,
        "leadDays": 0.0,
        "received": "2026-02-12",
        "status": "Received",
        "terms": "Credit Card",
        "notes": "emailed receipt to Accounting"
    },
    {
        "po": "18538070",
        "date": "2025-02-12",
        "vendor": "Ryerson",
        "contact": "Winston Hodgson",
        "item": "6061-T6 Tube 2in SQ x 0.125",
        "cat": "Aluminum Tube",
        "qty": 660.0,
        "unit": "LF",
        "unitCost": 4.6,
        "total": 3036.0,
        "freight": 0.0,
        "grandTotal": 3036.0,
        "leadDays": 0.0,
        "received": "2026-02-12",
        "status": "Received",
        "terms": "Credit Card",
        "notes": "emailed receipt to Accounting"
    },
    {
        "po": "1121370",
        "date": "2026-02-16",
        "vendor": "EMJ",
        "contact": "Justin Czarapate",
        "item": "6061-T6 Top Rail 1\" x 3\"  x 0.125",
        "cat": "Aluminum Tube",
        "qty": 940.0,
        "unit": "LF",
        "unitCost": 3.47,
        "total": 3261.8,
        "freight": 0.0,
        "grandTotal": 3261.8,
        "leadDays": 2.0,
        "received": "2026-02-23",
        "status": "Received",
        "terms": "Credit Card",
        "notes": "emailed receipt to Accounting"
    },
    {
        "po": "486092",
        "date": "2026-02-17",
        "vendor": "Alcobra",
        "contact": "Ashley Coleman",
        "item": "6061-T6 Flat Bar 1/8\" x 2\"",
        "cat": "Aluminum Flat Stock",
        "qty": 120.0,
        "unit": "LF",
        "unitCost": 2.21,
        "total": 265.2,
        "freight": 23.87,
        "grandTotal": 289.07,
        "leadDays": 0.0,
        "received": "2026-02-17",
        "status": "Received",
        "terms": "Credit Card",
        "notes": "emailed receipt to Accounting"
    },
    {
        "po": "26022500943217-400000",
        "date": "2026-02-25",
        "vendor": "Vevor",
        "contact": "Online Order",
        "item": "T319 1/8\" 1x19 SS Cable (1000')",
        "cat": "Cable / Wire",
        "qty": 3.0,
        "unit": "Roll",
        "unitCost": 134.9,
        "total": 404.7,
        "freight": 0.0,
        "grandTotal": 404.7,
        "leadDays": 3.0,
        "received": "2026-02-26",
        "status": "Received",
        "terms": "Credit Card",
        "notes": "emailed receipt to Accounting"
    },
    {
        "po": "486675",
        "date": "2026-02-25",
        "vendor": "Alcobra",
        "contact": "Ashley Coleman",
        "item": "6061-T6 Flat Bar 1/8\" x 2\"",
        "cat": "Aluminum Flat Stock",
        "qty": 180.0,
        "unit": "LF",
        "unitCost": 2.27,
        "total": 408.24,
        "freight": 37.15,
        "grandTotal": 445.39,
        "leadDays": 0.0,
        "received": "2026-02-26",
        "status": "Received",
        "terms": "Credit Card",
        "notes": "emailed receipt to Accounting"
    },
    {
        "po": "18560388",
        "date": "2026-02-25",
        "vendor": "Ryerson",
        "contact": "Winston Hodgson",
        "item": "6061-T6 Tube 2in SQ x 0.125",
        "cat": "Aluminum Tube",
        "qty": 500.0,
        "unit": "LF",
        "unitCost": 4.6,
        "total": 2300.0,
        "freight": 209.3,
        "grandTotal": 2509.3,
        "leadDays": 1.0,
        "received": "2026-02-26",
        "status": "Received",
        "terms": "Credit Card",
        "notes": "emailed receipt to Accounting"
    }
],
  // Not yet built
  costPerStation: [],
  bom: [],
  adjustmentLog: [],
};

// ─── LOGIN ───────────────────────────────────────────────────────────────────────
const Login = ({ onLogin }) => {
  const [email,setEmail]=useState('');const [pass,setPass]=useState('');const [err,setErr]=useState('');const [show,setShow]=useState(false);
  const submit=()=>{const u=DEMO_USERS.find(u=>u.email===email.trim().toLowerCase()&&u.password===pass);if(u){setErr('');onLogin(u);}else setErr('Invalid email or password.');};
  return (
    <div className="login-wrap">
      <div className="login-box fade-up">
        <div style={{textAlign:'center',marginBottom:28}}>
          <div style={{width:52,height:52,background:'linear-gradient(135deg,var(--acc),var(--acc2))',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px'}}>
            <span className="hd" style={{fontSize:24,color:'#000'}}>M</span>
          </div>
          <div className="hd" style={{fontSize:26}}>MAISY ERP</div>
          <div style={{fontSize:11,color:'var(--muted)',letterSpacing:'.14em',textTransform:'uppercase',marginTop:3}}>Maisy Railing · Hayden, Idaho</div>
        </div>
        <div style={{marginBottom:14}}><label>Email Address</label><input className="login-input" type="email" value={email} onChange={e=>{setEmail(e.target.value);setErr('');}} onKeyDown={e=>e.key==='Enter'&&submit()} placeholder="you@maisyrailing.com" autoFocus/></div>
        <div style={{marginBottom:20}}><label>Password</label><div style={{position:'relative'}}><input className="login-input" type={show?'text':'password'} value={pass} onChange={e=>{setPass(e.target.value);setErr('');}} onKeyDown={e=>e.key==='Enter'&&submit()} placeholder="••••••••••"/><button onClick={()=>setShow(s=>!s)} style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'var(--muted)',cursor:'pointer',fontSize:11,fontFamily:'Barlow Condensed',fontWeight:700,letterSpacing:'.08em'}}>{show?'HIDE':'SHOW'}</button></div></div>
        {err&&<div style={{background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.25)',borderRadius:5,padding:'8px 12px',fontSize:12,color:'var(--err)',marginBottom:14}}>{err}</div>}
        <button className="btn btn-p" style={{width:'100%',justifyContent:'center',padding:'11px',fontSize:14}} onClick={()=>submit()}>Sign In →</button>
        <div className="divider" style={{margin:'20px 0 14px'}}/>
        <div style={{fontSize:10.5,color:'var(--muted)',marginBottom:8,fontFamily:'Barlow Condensed',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase'}}>Demo Credentials</div>
        {DEMO_USERS.map(u=>(
          <div key={u.email} onClick={()=>{setEmail(u.email);setPass(u.password);setErr('');}} style={{display:'flex',justifyContent:'space-between',padding:'6px 10px',background:'var(--s2)',borderRadius:4,marginBottom:5,cursor:'pointer',border:'1px solid var(--bdr)'}}>
            <div style={{fontSize:11.5}}>{u.email}</div>
            <span className={`badge role-${u.role}`} style={{fontSize:9}}>{u.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────────
const NAVS = [
  {section:'Overview'},
  {id:'dashboard',icon:'▦',label:'Dashboard'},
  {id:'todo',icon:'☑',label:'To-Do / Hot List'},
  {section:'Operations'},
  {id:'sales',icon:'◈',label:'Sales & Quotes'},
  {id:'production',icon:'◎',label:'Production'},
  {id:'inventory',icon:'◉',label:'Inventory'},
  {id:'shipping',icon:'◒',label:'Shipping'},
  {section:'Finance'},
  {id:'invoicing',icon:'◑',label:'Invoicing & A/R'},
  {id:'purchasing',icon:'◐',label:'Purchasing'},
  {id:'finance',icon:'◧',label:'Finance & P&L'},
  {section:'Advanced'},
  {id:'jobcost',icon:'◬',label:'Job Costing'},
  {id:'customers',icon:'◫',label:'Customers'},
  {id:'autopo',icon:'◩',label:'Auto Reorder'},
  {id:'sister',icon:'⊕',label:'Sister Company'},
  {section:'People & Quality'},
  {id:'people',icon:'◍',label:'People & HR'},
  {id:'automation',icon:'⊞',label:'Automation Roadmap'},
  {id:'kpi',icon:'◈',label:'KPI Dashboard'},
  {section:'Reference'},
  {id:'shopref',icon:'⊟',label:'Shop Reference'},
  {id:'srscatalog',icon:'⊛',label:'SRS Catalog'},
  {id:'legacyorders',icon:'◫',label:'Legacy Orders'},
  {id:'printcenter',icon:'🖨',label:'Print Center'},
  {id:'reports',icon:'◪',label:'Reports'},
];

const Sidebar = ({page,setPage,data,user}) => {
  const access=ROLE_ACCESS[user.role]||[];
  const overdueInv=data.invoices.filter(i=>i.status==='Overdue').length;
  const lowStock=data.inventory.filter(i=>i.qty<=i.reorder).length;
  const openTodos=data.todos.filter(t=>t.status!=='Done').length;
  return (
    <div className="sidebar">
      <div style={{padding:'15px 14px 12px',borderBottom:'1px solid var(--bdr)'}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:28,height:28,background:'linear-gradient(135deg,var(--acc),var(--acc2))',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <span style={{color:'#000',fontSize:13,fontWeight:900,fontFamily:'Barlow Condensed'}}>M</span>
          </div>
          <div><div className="hd" style={{fontSize:15}}>MAISY ERP</div><div style={{fontSize:9,color:'var(--muted)',letterSpacing:'.13em',textTransform:'uppercase'}}>v5.1 · All Modules</div></div>
        </div>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:'5px 0'}}>
        {NAVS.map((n,i)=>{
          if(n.section)return <div key={i} className="nav-section">{n.section}</div>;
          if(!access.includes(n.id))return null;
          const badge=n.id==='invoicing'&&overdueInv>0?overdueInv:n.id==='inventory'&&lowStock>0?lowStock:n.id==='todo'&&openTodos>0?openTodos:null;
          return(
            <div key={n.id} className={`nav-i${page===n.id?' on':''}`} onClick={()=>setPage(n.id)}>
              <span style={{fontSize:13,width:14,textAlign:'center',opacity:.65}}>{n.icon}</span>
              <span style={{flex:1,fontSize:12.5}}>{n.label}</span>
              {badge&&<span style={{background:'var(--err)',color:'#fff',fontSize:9,fontWeight:700,padding:'1px 5px',borderRadius:10}}>{badge}</span>}
            </div>
          );
        })}
      </div>
      <div style={{padding:'10px 14px',borderTop:'1px solid var(--bdr)'}}>
        <div style={{fontSize:12,fontWeight:600}}>{user.name}</div>
        <div style={{display:'flex',alignItems:'center',gap:6,marginTop:3}}><span className={`badge role-${user.role}`} style={{fontSize:9}}>{user.role}</span><span style={{fontSize:10,color:'var(--muted)'}}>{user.title}</span></div>
      </div>
    </div>
  );
};

// ─── DASHBOARD ───────────────────────────────────────────────────────────────────
const Dashboard = ({data,setPage}) => {
  const rev=data.salesOrders.filter(o=>o.type==='order').reduce((a,b)=>a+b.total,0);
  const arOwed=data.invoices.filter(i=>i.status!=='Paid'&&i.status!=='Cancelled').reduce((a,b)=>a+b.amount,0);
  const cost=data.workOrders.reduce((a,b)=>a+(b.matCost+(b.laborHrs*b.laborRate)),0);
  const openTodos=data.todos.filter(t=>t.status!=='Done');
  const hotItems=data.hotList;
  const alerts=[
    ...data.inventory.filter(i=>i.qty<=i.reorder).map(i=>({t:'warn',m:`Low stock: ${i.name} — ${i.qty} ${i.unit}`})),
    ...data.invoices.filter(i=>i.status==='Overdue').map(i=>({t:'err',m:`Overdue: ${i.id} · ${i.customer} · ${fmt$(i.amount)}`})),
    ...data.todos.filter(t=>t.priority==='Critical'&&t.status!=='Done').map(t=>({t:'err',m:`Critical task: ${t.title}`})),
  ];
  const totalBudget=data.automationPhases.reduce((a,b)=>a+b.budget,0);
  const spent=data.automationPhases.reduce((a,b)=>a+(b.budget*(b.completion/100)),0);
  const monthData=data.pnlMonthly;
  const laborCostTotal=data.laborRates.reduce((a,b)=>a+b.rateHr,0);
  return (
    <div className="fade-up">
      <div className="section-hd">
        <div className="hd" style={{fontSize:24}}>Command Dashboard</div>
        <div style={{fontSize:11,color:'var(--muted)'}}>{new Date().toLocaleString()}</div>
      </div>
      <div className="grid4" style={{marginBottom:18}}>
        {[
          {l:'YTD Revenue',v:fmt$(rev),c:'var(--acc)',click:'sales'},
          {l:'Open Orders',v:data.salesOrders.filter(o=>['In Production','Pending'].includes(o.status)).length,c:'var(--acc2)',click:'production'},
          {l:'A/R Outstanding',v:fmt$(arOwed),c:'var(--warn)',click:'invoicing'},
          {l:'COGS Tracked',v:fmt$(cost),c:'var(--ok)',click:'jobcost'},
        ].map(s=>(
          <div className="stat-card" key={s.l} style={{cursor:'pointer'}} onClick={()=>setPage&&setPage(s.click)}>
            <div style={{fontSize:9,fontFamily:'Barlow Condensed',fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>{s.l}</div>
            <div className="mono hd" style={{fontSize:22,color:s.c}}>{s.v}</div>
          </div>
        ))}
      </div>
      <div className="grid4" style={{marginBottom:18}}>
        {[
          {l:'Open Tasks',v:openTodos.length,c:'var(--acc3)',click:'todo'},
          {l:'Hot List Items',v:hotItems.length,c:'var(--err)',click:'todo'},
          {l:'Open Positions',v:data.openPositions.filter(p=>p.status==='Open').length,c:'#a78bfa',click:'people'},
          {l:'Automation Progress',v:`${Math.round(data.automationPhases.reduce((a,b)=>a+(b.completion*(b.budget/totalBudget)),0))}%`,c:'var(--ok)',click:'automation'},
        ].map(s=>(
          <div className="stat-card" key={s.l} style={{cursor:'pointer'}} onClick={()=>setPage&&setPage(s.click)}>
            <div style={{fontSize:9,fontFamily:'Barlow Condensed',fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>{s.l}</div>
            <div className="mono hd" style={{fontSize:22,color:s.c}}>{s.v}</div>
          </div>
        ))}
      </div>
      <div className="grid2" style={{marginBottom:16}}>
        <div className="card">
          <div style={{fontFamily:'Barlow Condensed',fontWeight:700,fontSize:13,marginBottom:14}}>Revenue vs EBITDA — 6 Months</div>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={monthData} margin={{top:0,right:0,bottom:0,left:-18}}>
              <XAxis dataKey="month" tick={{fill:'#4a5070',fontSize:9}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:'#4a5070',fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
              <Tooltip contentStyle={{background:'var(--s1)',border:'1px solid var(--bdr2)',borderRadius:6,fontSize:11}} formatter={v=>[fmt$(v)]}/>
              <Bar dataKey="revenue" fill="#00e5ff" radius={[2,2,0,0]} opacity={.7} name="Revenue"/>
              <Bar dataKey="ebitda" fill="#10b981" radius={[2,2,0,0]} opacity={.9} name="EBITDA"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div style={{fontFamily:'Barlow Condensed',fontWeight:700,fontSize:13,marginBottom:12}}>Alerts & Production Queue</div>
          {alerts.length===0&&<div style={{fontSize:11.5,color:'var(--ok)',marginBottom:10}}>✓ All clear</div>}
          {alerts.slice(0,3).map((a,i)=>(
            <div key={i} style={{display:'flex',gap:7,padding:'6px 9px',background:'var(--s2)',borderRadius:5,marginBottom:5,borderLeft:`2px solid ${a.t==='err'?'var(--err)':'var(--warn)'}`}}>
              <span style={{color:a.t==='err'?'var(--err)':'var(--warn)',fontSize:10,marginTop:1}}>●</span>
              <span style={{fontSize:11}}>{a.m}</span>
            </div>
          ))}
          <div style={{marginTop:12,fontFamily:'Barlow Condensed',fontWeight:700,fontSize:12,marginBottom:8,color:'var(--muted)'}}>WORK IN PROGRESS</div>
          {data.workOrders.filter(w=>w.status!=='Complete').map(w=>(
            <div key={w.id} style={{marginBottom:8}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:2,alignItems:'center'}}>
                <span style={{fontSize:11.5}}>{w.product}</span><Badge s={w.status}/>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{width:`${w.progress}%`,background:'var(--acc)'}}/></div>
              <div style={{display:'flex',justifyContent:'space-between',marginTop:2}}>
                <span style={{fontSize:10,color:'var(--muted)'}}>{w.station} · {w.assigned}</span>
                <span style={{fontSize:10,color:'var(--muted)'}}>Due {fmtDs(w.due)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid2">
        <div className="card">
          <div style={{fontFamily:'Barlow Condensed',fontWeight:700,fontSize:13,marginBottom:10}}>🔥 Hot List</div>
          {hotItems.length===0&&<Empty msg="Nothing hot right now"/>}
          {hotItems.map(h=>(
            <div key={h.id} style={{padding:'8px 10px',background:'var(--s2)',borderRadius:5,marginBottom:6,borderLeft:`3px solid ${h.flag==='HOT'?'var(--err)':'var(--warn)'}`}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontSize:12.5,fontWeight:500}}>{h.customer}</span>
                <span style={{fontSize:9,fontFamily:'Barlow Condensed',fontWeight:700,color:h.flag==='HOT'?'var(--err)':'var(--warn)'}}>{h.flag}</span>
              </div>
              <div style={{fontSize:11,color:'var(--muted)',marginTop:2}}>{h.item}</div>
              {h.notes&&<div style={{fontSize:10.5,color:'var(--muted)',marginTop:2,fontStyle:'italic'}}>{h.notes}</div>}
            </div>
          ))}
        </div>
        <div className="card">
          <div style={{fontFamily:'Barlow Condensed',fontWeight:700,fontSize:13,marginBottom:10}}>⚡ Automation Progress</div>
          {data.automationPhases.map(ph=>(
            <div key={ph.id} style={{marginBottom:10}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                <span style={{fontSize:11.5,fontWeight:500}}>Phase {ph.phase}: {ph.title}</span>
                <span style={{fontSize:11,color:'var(--muted)'}}>{ph.completion}%</span>
              </div>
              <div className="progress-bar" style={{height:5}}>
                <div className="progress-fill" style={{width:`${ph.completion}%`,background:ph.status==='In Progress'?'var(--acc)':ph.status==='Planning'?'var(--warn)':'var(--dim)'}}/>
              </div>
            </div>
          ))}
          <div style={{marginTop:10,fontSize:11,color:'var(--muted)'}}>Total Budget: {fmt$(totalBudget)} · Deployed: {fmt$(spent)}</div>
        </div>
      </div>
    </div>
  );
};

// ─── TODO & HOT LIST ─────────────────────────────────────────────────────────────
const Todo = ({data,setData,user}) => {
  const [tab,setTab]=useState('tasks');
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({});
  const [filter,setFilter]=useState('All');
  const cats=['Automation','Inventory','Hiring','Admin','Purchasing','Quality','Production','Shipping','Finance','Other'];
  const priorities=['Critical','High','Medium','Low'];
  const statuses=['Open','In Progress','Done'];
  const hotFlags=['HOT','RUSH','WATCH'];

  const openTask=(row=null)=>{setForm(row?{...row}:{id:`TODO-${uid()}`,title:'',cat:'Admin',priority:'Medium',status:'Open',due:now(),assigned:'Daniel Jones',notes:''});setModal('task');};
  const saveTask=()=>{if(modal==='task-new'||!data.todos.find(t=>t.id===form.id))setData(d=>({...d,todos:[...d.todos,form]}));else setData(d=>({...d,todos:d.todos.map(t=>t.id===form.id?form:t)}));setModal(null);};
  const delTask=id=>setData(d=>({...d,todos:d.todos.filter(t=>t.id!==id)}));
  const toggleDone=id=>setData(d=>({...d,todos:d.todos.map(t=>t.id===id?{...t,status:t.status==='Done'?'Open':'Done'}:t)}));

  const openHot=(row=null)=>{setForm(row?{...row}:{id:`HOT-${uid()}`,orderId:'',customer:'',item:'',notes:'',flag:'WATCH',date:now()});setModal('hot');};
  const saveHot=()=>{if(!data.hotList.find(h=>h.id===form.id))setData(d=>({...d,hotList:[...d.hotList,form]}));else setData(d=>({...d,hotList:d.hotList.map(h=>h.id===form.id?form:h)}));setModal(null);};
  const delHot=id=>setData(d=>({...d,hotList:d.hotList.filter(h=>h.id!==id)}));

  const filtered=data.todos.filter(t=>{
    if(filter==='Open'&&t.status==='Done')return false;
    if(filter==='Done'&&t.status!=='Done')return false;
    return true;
  });

  const priorityColor={Critical:'var(--err)',High:'var(--acc3)',Medium:'var(--warn)',Low:'var(--muted)'};

  return(
    <div className="fade-up">
      <div className="section-hd">
        <div><div className="hd" style={{fontSize:22}}>To-Do & Hot List</div>
          <div style={{display:'flex',gap:6,marginTop:5}}>
            <span className="chip">{data.todos.filter(t=>t.status!=='Done').length} open tasks</span>
            <span className="chip" style={{color:'var(--err)'}}>{data.hotList.length} hot items</span>
          </div>
        </div>
        <button className="btn btn-p" onClick={()=>{if(tab==='tasks')openTask();else openHot();}}>+ New {tab==='tasks'?'Task':'Hot Item'}</button>
      </div>
      <div style={{display:'flex',gap:6,marginBottom:14}}>
        {['tasks','hotlist'].map(t=><button key={t} className={`tab${tab===t?' on':''}`} onClick={()=>setTab(t)}>{t==='tasks'?'Tasks':'🔥 Hot List'}</button>)}
        {tab==='tasks'&&<div style={{marginLeft:'auto',display:'flex',gap:6}}>
          {['All','Open','Done'].map(f=><button key={f} className={`tab${filter===f?' on':''}`} onClick={()=>setFilter(f)}>{f}</button>)}
        </div>}
      </div>

      {tab==='tasks'&&<div>
        {filtered.length===0&&<Empty msg="No tasks"/>}
        {['Critical','High','Medium','Low'].map(pri=>{
          const items=filtered.filter(t=>t.priority===pri);
          if(!items.length)return null;
          return(
            <div key={pri} style={{marginBottom:16}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                <div style={{width:8,height:8,borderRadius:'50%',background:priorityColor[pri]}}/>
                <span style={{fontFamily:'Barlow Condensed',fontWeight:700,fontSize:11,letterSpacing:'.1em',color:priorityColor[pri]}}>{pri.toUpperCase()}</span>
                <span style={{fontSize:10,color:'var(--muted)'}}>{items.length}</span>
              </div>
              {items.map(t=>(
                <div key={t.id} style={{display:'flex',alignItems:'flex-start',gap:10,padding:'10px 14px',background:'var(--s1)',border:'1px solid var(--bdr)',borderRadius:6,marginBottom:6,opacity:t.status==='Done'?.5:1}}>
                  <input type="checkbox" checked={t.status==='Done'} onChange={()=>toggleDone(t.id)} style={{marginTop:2,flexShrink:0}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
                      <span style={{fontSize:13,fontWeight:500,textDecoration:t.status==='Done'?'line-through':'none'}}>{t.title}</span>
                      <span className="chip">{t.cat}</span>
                      {t.due&&<span style={{fontSize:10,color:new Date(t.due+'T00:00:00')<new Date()&&t.status!=='Done'?'var(--err)':'var(--muted)'}}>Due {fmtDs(t.due)}</span>}
                    </div>
                    {t.notes&&<div style={{fontSize:11,color:'var(--muted)',marginTop:3}}>{t.notes}</div>}
                    <div style={{fontSize:10,color:'var(--dim)',marginTop:3}}>Assigned: {t.assigned}</div>
                  </div>
                  <div style={{display:'flex',gap:4,flexShrink:0}}>
                    <button className="btn btn-g btn-xs" onClick={()=>{setForm({...t});setModal('task');}}>Edit</button>
                    <button className="btn btn-d btn-xs" onClick={()=>delTask(t.id)}>×</button>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>}

      {tab==='hotlist'&&<div>
        {data.hotList.length===0&&<Empty msg="Hot list clear"/>}
        {data.hotList.map(h=>(
          <div key={h.id} style={{padding:'12px 16px',background:'var(--s1)',border:`1px solid ${h.flag==='HOT'?'rgba(239,68,68,.3)':h.flag==='RUSH'?'rgba(249,115,22,.3)':'var(--bdr)'}`,borderLeft:`4px solid ${h.flag==='HOT'?'var(--err)':h.flag==='RUSH'?'var(--acc3)':'var(--warn)'}`,borderRadius:6,marginBottom:8,display:'flex',gap:12,alignItems:'flex-start'}}>
            <span className="badge" style={{background:h.flag==='HOT'?'rgba(239,68,68,.15)':h.flag==='RUSH'?'rgba(249,115,22,.15)':'rgba(245,158,11,.15)',color:h.flag==='HOT'?'var(--err)':h.flag==='RUSH'?'var(--acc3)':'var(--warn)',flexShrink:0,marginTop:2}}>{h.flag}</span>
            <div style={{flex:1}}>
              <div style={{fontWeight:600,fontSize:13}}>{h.customer}</div>
              <div style={{fontSize:12,color:'var(--muted)',marginTop:2}}>{h.item}</div>
              {h.notes&&<div style={{fontSize:11,color:'var(--muted)',marginTop:2,fontStyle:'italic'}}>{h.notes}</div>}
              <div style={{fontSize:10,color:'var(--dim)',marginTop:3}}>{h.orderId} · {fmtD(h.date)}</div>
            </div>
            <div style={{display:'flex',gap:4}}>
              <button className="btn btn-g btn-xs" onClick={()=>{setForm({...h});setModal('hot');}}>Edit</button>
              <button className="btn btn-d btn-xs" onClick={()=>delHot(h.id)}>×</button>
            </div>
          </div>
        ))}
      </div>}

      {modal==='task'&&<Modal title={data.todos.find(t=>t.id===form.id)?'Edit Task':'New Task'} onClose={()=>setModal(null)}>
        <Field label="Title"><input value={form.title||''} onChange={e=>setForm(f=>({...f,title:e.target.value}))}/></Field>
        <div className="grid2">
          <Field label="Category"><select value={form.cat||'Admin'} onChange={e=>setForm(f=>({...f,cat:e.target.value}))}>{cats.map(c=><option key={c}>{c}</option>)}</select></Field>
          <Field label="Priority"><select value={form.priority||'Medium'} onChange={e=>setForm(f=>({...f,priority:e.target.value}))}>{priorities.map(p=><option key={p}>{p}</option>)}</select></Field>
        </div>
        <div className="grid2">
          <Field label="Status"><select value={form.status||'Open'} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>{statuses.map(s=><option key={s}>{s}</option>)}</select></Field>
          <Field label="Due Date"><input type="date" value={form.due||''} onChange={e=>setForm(f=>({...f,due:e.target.value}))}/></Field>
        </div>
        <Field label="Assigned To"><input value={form.assigned||''} onChange={e=>setForm(f=>({...f,assigned:e.target.value}))}/></Field>
        <Field label="Notes"><textarea rows={2} value={form.notes||''} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/></Field>
        <div style={{display:'flex',gap:8,marginTop:10}}><button className="btn btn-p" onClick={saveTask}>Save</button><button className="btn btn-g" onClick={()=>setModal(null)}>Cancel</button></div>
      </Modal>}

      {modal==='hot'&&<Modal title={data.hotList.find(h=>h.id===form.id)?'Edit Hot Item':'New Hot Item'} onClose={()=>setModal(null)}>
        <div className="grid2">
          <Field label="Customer"><input value={form.customer||''} onChange={e=>setForm(f=>({...f,customer:e.target.value}))}/></Field>
          <Field label="Order ID"><input value={form.orderId||''} onChange={e=>setForm(f=>({...f,orderId:e.target.value}))}/></Field>
        </div>
        <Field label="Item / Description"><input value={form.item||''} onChange={e=>setForm(f=>({...f,item:e.target.value}))}/></Field>
        <div className="grid2">
          <Field label="Flag"><select value={form.flag||'WATCH'} onChange={e=>setForm(f=>({...f,flag:e.target.value}))}>{hotFlags.map(f=><option key={f}>{f}</option>)}</select></Field>
          <Field label="Date"><input type="date" value={form.date||''} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/></Field>
        </div>
        <Field label="Notes"><textarea rows={2} value={form.notes||''} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/></Field>
        <div style={{display:'flex',gap:8,marginTop:10}}><button className="btn btn-p" onClick={saveHot}>Save</button><button className="btn btn-g" onClick={()=>setModal(null)}>Cancel</button></div>
      </Modal>}
    </div>
  );
};
const Sales = ({data, setData}) => {
  const [tab,setTab]=useState('all');
  const [search,setSearch]=useState('');
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({});
  const statuses=['Quoted','Pending','In Production','Shipped','Completed','Cancelled'];
  const filtered=data.salesOrders.filter(o=>{
    if(tab==='orders'&&o.type!=='order')return false;
    if(tab==='quotes'&&o.type!=='quote')return false;
    if(search&&!o.customer.toLowerCase().includes(search.toLowerCase())&&!o.id.toLowerCase().includes(search.toLowerCase()))return false;
    return true;
  });
  const open=(row=null)=>{setForm(row?{...row}:{id:`SO-${uid()}`,type:'order',customer:'',cusId:'',date:now(),total:0,status:'Pending',notes:''});setModal(row?'edit':'new');};
  const save=()=>{const so={...form,total:Number(form.total)};if(modal==='new')setData(d=>({...d,salesOrders:[...d.salesOrders,so]}));else setData(d=>({...d,salesOrders:d.salesOrders.map(o=>o.id===so.id?so:o)}));setModal(null);};
  const del=id=>setData(d=>({...d,salesOrders:d.salesOrders.filter(o=>o.id!==id)}));
  const totalOrders=data.salesOrders.filter(o=>o.type==='order').reduce((a,b)=>a+b.total,0);
  return (
    <div className="fade-up">
      <div className="section-hd">
        <div><div className="hd" style={{fontSize:22}}>Sales Orders & Quoting</div><div style={{display:'flex',gap:6,marginTop:5}}><span className="chip">{fmt$(totalOrders)}</span><span className="chip">{data.salesOrders.length} records</span></div></div>
        <button className="btn btn-p" onClick={()=>open()}>+ New</button>
      </div>
      <div style={{display:'flex',gap:6,marginBottom:12,alignItems:'center'}}>
        {['all','orders','quotes'].map(t=><button key={t} className={`tab${tab===t?' on':''}`} onClick={()=>setTab(t)} style={{textTransform:'capitalize'}}>{t==='all'?'All':t}</button>)}
        <input className="search" placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)} style={{marginLeft:'auto',width:200}}/>
      </div>
      <div className="card" style={{padding:0,overflow:'hidden'}}>
        <table><thead><tr><th>ID</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th><th>Type</th><th>Notes</th><th/></tr></thead>
          <tbody>{filtered.length===0&&<tr><td colSpan={8}><Empty/></td></tr>}
            {filtered.map(o=>(
              <tr key={o.id}>
                <td className="mono" style={{fontSize:11,color:'var(--acc)'}}>{o.id}</td>
                <td style={{fontWeight:500}}>{o.customer}</td>
                <td style={{color:'var(--muted)',fontSize:11}}>{fmtD(o.date)}</td>
                <td className="mono" style={{fontWeight:500}}>{fmt$(o.total)}</td>
                <td><Badge s={o.status}/></td>
                <td><span className="chip" style={{textTransform:'capitalize'}}>{o.type}</span></td>
                <td style={{color:'var(--muted)',maxWidth:180,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontSize:11}}>{o.notes}</td>
                <td><div style={{display:'flex',gap:4}}><button className="btn btn-g btn-sm" onClick={()=>open(o)}>Edit</button><button className="btn btn-d btn-sm" onClick={()=>del(o.id)}>Del</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal&&<Modal title={modal==='new'?'New Order / Quote':'Edit'} onClose={()=>setModal(null)}>
        <div className="grid2"><Field label="Order ID"><input value={form.id||''} onChange={e=>setForm(f=>({...f,id:e.target.value}))}/></Field>
        <Field label="Type"><select value={form.type||'order'} onChange={e=>setForm(f=>({...f,type:e.target.value}))}><option value="order">Sales Order</option><option value="quote">Quote</option></select></Field></div>
        <Field label="Customer"><input value={form.customer||''} onChange={e=>setForm(f=>({...f,customer:e.target.value}))}/></Field>
        <div className="grid2"><Field label="Date"><input type="date" value={form.date||''} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/></Field>
        <Field label="Total ($)"><input type="number" value={form.total||0} onChange={e=>setForm(f=>({...f,total:e.target.value}))}/></Field></div>
        <Field label="Status"><select value={form.status||'Pending'} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>{statuses.map(s=><option key={s}>{s}</option>)}</select></Field>
        <Field label="Notes"><textarea value={form.notes||''} rows={2} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/></Field>
        <div style={{display:'flex',gap:8,marginTop:10}}><button className="btn btn-p" onClick={save}>Save</button><button className="btn btn-g" onClick={()=>setModal(null)}>Cancel</button></div>
      </Modal>}
    </div>
  );
};

// ─── INVENTORY (ENHANCED) ────────────────────────────────────────────────────────
const QRLabel = ({item, onClose}) => {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`SKU:${item.sku}|${item.name}|LOC:${item.loc}`)}&bgcolor=ffffff&color=000000`;
  return (
    <Modal title="SKU Label / QR Code" onClose={onClose}>
      <div style={{textAlign:'center',padding:'10px 0 20px'}}>
        <div style={{background:'#fff',borderRadius:8,padding:20,display:'inline-block',marginBottom:14}}>
          <img src={qrUrl} alt="QR" style={{width:160,height:160,display:'block'}}/>
        </div>
        <div style={{fontFamily:'Barlow Condensed',fontWeight:800,fontSize:20,letterSpacing:'.04em'}}>{item.sku}</div>
        <div style={{fontSize:13,color:'var(--muted)',marginTop:4}}>{item.name}</div>
        <div style={{fontSize:12,color:'var(--muted)',marginTop:2}}>Location: {item.loc} · Unit: {item.unit}</div>
        <div style={{fontSize:12,color:'var(--muted)',marginTop:1}}>Unit Cost: {fmt$(item.cost)}</div>
        <div style={{marginTop:16,display:'flex',gap:8,justifyContent:'center'}}>
          <button className="btn btn-g" onClick={()=>window.print()}>🖨 Print Label</button>
          <button className="btn btn-g" onClick={onClose}>Close</button>
        </div>
      </div>
    </Modal>
  );
};

const Inventory = ({data, setData, user}) => {
  const [tab,setTab]=useState('items');
  const [search,setSearch]=useState('');
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({});
  const [qrItem,setQrItem]=useState(null);
  const [adjForm,setAdjForm]=useState({inventoryId:'',type:'add',qty:1,reason:''});
  const [csvText,setCsvText]=useState('');
  const [csvPreview,setCsvPreview]=useState([]);
  const [bomForm,setBomForm]=useState({id:'',productSku:'',productName:'',items:[]});
  const [bomItem,setBomItem]=useState({inventoryId:'',qty:1,unit:'ft',note:''});
  const cats=['Raw Material','Hardware','Fasteners','Finish','Glass','Other'];

  const filtered=data.inventory.filter(i=>!search||i.name.toLowerCase().includes(search.toLowerCase())||i.sku.toLowerCase().includes(search.toLowerCase()));
  const low=data.inventory.filter(i=>i.qty<=i.reorder);
  const totalVal=data.inventory.reduce((a,b)=>a+(b.qty*b.cost),0);

  const openItem=(row=null)=>{setForm(row?{...row}:{id:`ITM-${uid()}`,sku:'',name:'',cat:'Raw Material',qty:0,unit:'ft',reorder:0,cost:0,loc:''});setModal('item');};
  const saveItem=()=>{const it={...form,qty:Number(form.qty),cost:Number(form.cost),reorder:Number(form.reorder)};if(modal==='item'&&!data.inventory.find(x=>x.id===it.id))setData(d=>({...d,inventory:[...d.inventory,it]}));else setData(d=>({...d,inventory:d.inventory.map(i=>i.id===it.id?it:i)}));setModal(null);};
  const delItem=id=>setData(d=>({...d,inventory:d.inventory.filter(i=>i.id!==id)}));

  const applyAdj=()=>{
    if(!adjForm.inventoryId||!adjForm.reason)return;
    const item=data.inventory.find(i=>i.id===adjForm.inventoryId);
    if(!item)return;
    const delta=adjForm.type==='add'?Number(adjForm.qty):-Number(adjForm.qty);
    const log={id:`ADJ-${uid()}`,inventoryId:adjForm.inventoryId,itemName:item.name,type:adjForm.type,qty:Number(adjForm.qty),reason:adjForm.reason,date:now(),user:'Daniel Jones'};
    setData(d=>({...d,
      inventory:d.inventory.map(i=>i.id===adjForm.inventoryId?{...i,qty:Math.max(0,i.qty+delta)}:i),
      adjustmentLog:[log,...d.adjustmentLog],
    }));
    setAdjForm({inventoryId:'',type:'add',qty:1,reason:''});
  };

  const parseCSV=()=>{
    const rows=csvText.trim().split('\n').slice(1).map(r=>{
      const [sku,name,cat,qty,unit,reorder,cost,loc]=r.split(',').map(s=>s.trim().replace(/"/g,''));
      return {id:`ITM-${uid()}`,sku,name,cat:cat||'Raw Material',qty:Number(qty)||0,unit:unit||'ea',reorder:Number(reorder)||0,cost:Number(cost)||0,loc:loc||''};
    }).filter(r=>r.sku&&r.name);
    setCsvPreview(rows);
  };
  const importCSV=()=>{
    setData(d=>({...d,inventory:[...d.inventory,...csvPreview.filter(p=>!d.inventory.find(i=>i.sku===p.sku))]}));
    setCsvPreview([]);setCsvText('');
  };

  const saveBOM=()=>{
    if(!bomForm.productSku)return;
    const b={...bomForm,id:bomForm.id||`BOM-${uid()}`};
    if(!data.bom.find(x=>x.id===b.id))setData(d=>({...d,bom:[...d.bom,b]}));
    else setData(d=>({...d,bom:d.bom.map(x=>x.id===b.id?b:x)}));
    setModal(null);
  };
  const addBOMItem=()=>{
    if(!bomItem.inventoryId)return;
    const inv=data.inventory.find(i=>i.id===bomItem.inventoryId);
    setBomForm(f=>({...f,items:[...f.items,{...bomItem,qty:Number(bomItem.qty),invName:inv?.name||''}]}));
    setBomItem({inventoryId:'',qty:1,unit:'ft',note:''});
  };

  return (
    <div className="fade-up">
      <div className="section-hd">
        <div><div className="hd" style={{fontSize:22}}>Inventory & Materials</div>
          <div style={{display:'flex',gap:6,marginTop:5}}><span className="chip">{fmt$(totalVal)}</span><span className="chip" style={{color:low.length?'var(--warn)':undefined}}>{low.length} low stock</span></div>
        </div>
        {tab==='items'&&<button className="btn btn-p" onClick={()=>openItem()}>+ Add Item</button>}
        {tab==='bom'&&<button className="btn btn-p" onClick={()=>{setBomForm({id:`BOM-${uid()}`,productSku:'',productName:'',items:[]});setModal('bom');}}>+ New BOM</button>}
      </div>
      {low.length>0&&<div className="alert-bar alert-warn"><span style={{color:'var(--warn)'}}>⚠</span><span><strong>Low Stock:</strong> {low.map(i=>`${i.name} (${i.qty} ${i.unit})`).join(' · ')}</span></div>}
      <div style={{display:'flex',gap:6,marginBottom:16}}>
        {['items','bom','adjustments','import'].map(t=><button key={t} className={`tab${tab===t?' on':''}`} onClick={()=>setTab(t)} style={{textTransform:'capitalize'}}>{t==='bom'?'Bill of Materials':t==='import'?'CSV Import':t}</button>)}
      </div>

      {/* ITEMS TAB */}
      {tab==='items'&&<>
        <input className="search" placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)} style={{marginBottom:12,width:260}}/>
        <div className="card" style={{padding:0,overflow:'hidden'}}>
          <table><thead><tr><th>SKU</th><th>Item</th><th>Cat</th><th>On Hand</th><th>Reorder At</th><th>Unit Cost</th><th>Value</th><th>Location</th><th/></tr></thead>
            <tbody>{filtered.map(i=>{const l=i.qty<=i.reorder;return(
              <tr key={i.id}>
                <td className="mono" style={{fontSize:10.5,color:'var(--muted)'}}>{i.sku}</td>
                <td style={{fontWeight:500}}>{i.name}</td>
                <td><span className="chip">{i.cat}</span></td>
                <td className="mono" style={{color:l?'var(--warn)':'var(--ok)',fontWeight:600}}>{i.qty.toLocaleString()} {i.unit}{l?' ⚠':''}</td>
                <td className="mono" style={{color:'var(--muted)'}}>{i.reorder}</td>
                <td className="mono">{fmt$(i.cost)}</td>
                <td className="mono" style={{fontWeight:500}}>{fmt$(i.qty*i.cost)}</td>
                <td style={{fontSize:11,color:'var(--muted)'}}>{i.loc}</td>
                <td><div style={{display:'flex',gap:4}}>
                  <button className="btn btn-g btn-sm" onClick={()=>setQrItem(i)}>QR</button>
                  <button className="btn btn-g btn-sm" onClick={()=>{setForm({...i});setModal('item');}}>Edit</button>
                  <button className="btn btn-d btn-sm" onClick={()=>delItem(i.id)}>Del</button>
                </div></td>
              </tr>
            );})}
            </tbody>
          </table>
        </div>
      </>}

      {/* BOM TAB */}
      {tab==='bom'&&<>
        {data.bom.length===0&&<Empty msg="No Bills of Materials defined"/>}
        {data.bom.map(b=>{
          const totalMatCost=b.items.reduce((a,item)=>{const inv=data.inventory.find(i=>i.id===item.inventoryId);return a+(inv?inv.cost*item.qty:0);},0);
          return (
            <div key={b.id} className="card" style={{marginBottom:12}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                <div>
                  <div className="hd" style={{fontSize:15}}>{b.productName}</div>
                  <div className="mono" style={{fontSize:11,color:'var(--acc)',marginTop:2}}>{b.productSku}</div>
                </div>
                <div style={{display:'flex',gap:8,alignItems:'center'}}>
                  <span className="mono" style={{fontSize:13,color:'var(--ok)',fontWeight:600}}>Mat. Cost: {fmt$(totalMatCost)}</span>
                  <button className="btn btn-g btn-sm" onClick={()=>{setBomForm({...b,items:[...b.items.map(x=>({...x}))]});setModal('bom');}}>Edit</button>
                  <button className="btn btn-d btn-sm" onClick={()=>setData(d=>({...d,bom:d.bom.filter(x=>x.id!==b.id)}))}>Del</button>
                </div>
              </div>
              <table><thead><tr><th>Component</th><th>SKU</th><th>Qty</th><th>Unit</th><th>Unit Cost</th><th>Ext. Cost</th><th>Note</th></tr></thead>
                <tbody>{b.items.map((item,i)=>{const inv=data.inventory.find(x=>x.id===item.inventoryId);return(
                  <tr key={i}><td style={{fontWeight:500}}>{inv?.name||item.invName||item.inventoryId}</td><td className="mono" style={{fontSize:10.5,color:'var(--muted)'}}>{inv?.sku||'—'}</td>
                    <td className="mono">{item.qty}</td><td style={{color:'var(--muted)'}}>{item.unit}</td>
                    <td className="mono">{inv?fmt$(inv.cost):'—'}</td><td className="mono" style={{color:'var(--ok)'}}>{inv?fmt$(inv.cost*item.qty):'—'}</td>
                    <td style={{fontSize:11,color:'var(--muted)'}}>{item.note}</td>
                  </tr>);
                })}</tbody>
              </table>
            </div>
          );
        })}
      </>}

      {/* ADJUSTMENTS TAB */}
      {tab==='adjustments'&&<>
        <div className="card" style={{marginBottom:16}}>
          <div className="hd" style={{fontSize:14,marginBottom:14}}>New Adjustment</div>
          <div className="grid2" style={{marginBottom:12}}>
            <Field label="Item">
              <select value={adjForm.inventoryId} onChange={e=>setAdjForm(f=>({...f,inventoryId:e.target.value}))}>
                <option value="">— Select Item —</option>
                {data.inventory.map(i=><option key={i.id} value={i.id}>{i.name} (On Hand: {i.qty} {i.unit})</option>)}
              </select>
            </Field>
            <Field label="Adjustment Type">
              <select value={adjForm.type} onChange={e=>setAdjForm(f=>({...f,type:e.target.value}))}>
                <option value="add">➕ Add to Stock</option>
                <option value="remove">➖ Remove from Stock</option>
              </select>
            </Field>
          </div>
          <div className="grid2" style={{marginBottom:12}}>
            <Field label="Quantity"><input type="number" min={1} value={adjForm.qty} onChange={e=>setAdjForm(f=>({...f,qty:e.target.value}))}/></Field>
            <Field label="Reason / Reference"><input value={adjForm.reason} onChange={e=>setAdjForm(f=>({...f,reason:e.target.value}))} placeholder="e.g. PO-003 received, WO-001 consumed"/></Field>
          </div>
          <button className="btn btn-p" onClick={applyAdj} disabled={!adjForm.inventoryId||!adjForm.reason}>Apply Adjustment</button>
        </div>
        <div className="card" style={{padding:0,overflow:'hidden'}}>
          <div style={{padding:'12px 14px',borderBottom:'1px solid var(--bdr)',fontFamily:'Barlow Condensed',fontWeight:700,fontSize:13}}>Adjustment History</div>
          <table><thead><tr><th>Date</th><th>Item</th><th>Type</th><th>Qty</th><th>Reason</th><th>By</th></tr></thead>
            <tbody>
              {data.adjustmentLog.length===0&&<tr><td colSpan={6}><Empty msg="No adjustments yet"/></td></tr>}
              {data.adjustmentLog.map(a=>(
                <tr key={a.id}>
                  <td style={{color:'var(--muted)',fontSize:11}}>{fmtD(a.date)}</td>
                  <td style={{fontWeight:500}}>{a.itemName}</td>
                  <td><span className="badge" style={{background:a.type==='add'?'rgba(16,185,129,.12)':'rgba(239,68,68,.12)',color:a.type==='add'?'var(--ok)':'var(--err)',border:`1px solid ${a.type==='add'?'rgba(16,185,129,.3)':'rgba(239,68,68,.3)'}`}}>{a.type==='add'?'+ ADD':'- REMOVE'}</span></td>
                  <td className="mono" style={{fontWeight:600,color:a.type==='add'?'var(--ok)':'var(--err)'}}>{a.type==='add'?'+':'-'}{a.qty}</td>
                  <td style={{fontSize:11,color:'var(--muted)'}}>{a.reason}</td>
                  <td style={{fontSize:11,color:'var(--muted)'}}>{a.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>}

      {/* CSV IMPORT TAB */}
      {tab==='import'&&<>
        <div className="card" style={{marginBottom:16}}>
          <div className="hd" style={{fontSize:14,marginBottom:8}}>Bulk SKU Import via CSV</div>
          <div className="alert-bar alert-info" style={{marginBottom:12}}>
            <span style={{color:'var(--info)'}}>ℹ</span>
            <span>Required columns (header row): <span className="mono" style={{fontSize:11}}>sku, name, cat, qty, unit, reorder, cost, loc</span></span>
          </div>
          <div style={{marginBottom:8}}>
            <div style={{background:'var(--s3)',border:'1px solid var(--bdr)',borderRadius:5,padding:'8px 12px',marginBottom:10}}>
              <div style={{fontSize:10,fontFamily:'Barlow Condensed',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:4}}>Example CSV Format</div>
              <code style={{fontSize:11,color:'var(--ok)',fontFamily:'JetBrains Mono',lineHeight:1.6,display:'block'}}>
                sku,name,cat,qty,unit,reorder,cost,loc<br/>
                ALU-004,6061 Tube 3×3,Raw Material,120,ft,50,8.40,Rack A4<br/>
                HWD-003,End Cap Square 2",Hardware,300,ea,100,0.65,Bin C4
              </code>
            </div>
            <textarea value={csvText} onChange={e=>setCsvText(e.target.value)} rows={8} placeholder="Paste CSV data here…" style={{fontFamily:'JetBrains Mono',fontSize:12}}/>
          </div>
          <div style={{display:'flex',gap:8}}>
            <button className="btn btn-g" onClick={parseCSV} disabled={!csvText.trim()}>Preview Import</button>
            {csvPreview.length>0&&<button className="btn btn-p" onClick={importCSV}>✓ Import {csvPreview.length} Item{csvPreview.length!==1?'s':''}</button>}
            {csvPreview.length>0&&<button className="btn btn-g" onClick={()=>setCsvPreview([])}>Clear</button>}
          </div>
        </div>
        {csvPreview.length>0&&<div className="card" style={{padding:0,overflow:'hidden'}}>
          <div style={{padding:'10px 14px',borderBottom:'1px solid var(--bdr)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span className="hd" style={{fontSize:13}}>Import Preview — {csvPreview.length} Items</span>
            <span className="chip">{csvPreview.filter(p=>!data.inventory.find(i=>i.sku===p.sku)).length} new · {csvPreview.filter(p=>data.inventory.find(i=>i.sku===p.sku)).length} duplicates (skipped)</span>
          </div>
          <table><thead><tr><th>SKU</th><th>Name</th><th>Cat</th><th>Qty</th><th>Unit</th><th>Reorder</th><th>Cost</th><th>Loc</th><th>Status</th></tr></thead>
            <tbody>{csvPreview.map((r,i)=>{const dup=!!data.inventory.find(x=>x.sku===r.sku);return(
              <tr key={i} style={{opacity:dup?.6:1}}>
                <td className="mono" style={{fontSize:10.5}}>{r.sku}</td><td>{r.name}</td><td>{r.cat}</td>
                <td className="mono">{r.qty}</td><td>{r.unit}</td><td className="mono">{r.reorder}</td>
                <td className="mono">{fmt$(r.cost)}</td><td style={{fontSize:11,color:'var(--muted)'}}>{r.loc}</td>
                <td>{dup?<span className="badge" style={{background:'rgba(239,68,68,.1)',color:'var(--err)',border:'1px solid rgba(239,68,68,.2)'}}>Duplicate</span>:<span className="badge" style={{background:'rgba(16,185,129,.1)',color:'var(--ok)',border:'1px solid rgba(16,185,129,.2)'}}>New</span>}</td>
              </tr>);})}
            </tbody>
          </table>
        </div>}
      </>}

      {/* QR Modal */}
      {qrItem&&<QRLabel item={qrItem} onClose={()=>setQrItem(null)}/>}

      {/* Item Edit Modal */}
      {modal==='item'&&<Modal title={form.id&&data.inventory.find(i=>i.id===form.id)?'Edit Item':'Add Item'} onClose={()=>setModal(null)}>
        <div className="grid2"><Field label="SKU"><input value={form.sku||''} onChange={e=>setForm(f=>({...f,sku:e.target.value}))}/></Field>
        <Field label="Category"><select value={form.cat||'Raw Material'} onChange={e=>setForm(f=>({...f,cat:e.target.value}))}>{cats.map(c=><option key={c}>{c}</option>)}</select></Field></div>
        <Field label="Item Name"><input value={form.name||''} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></Field>
        <div className="grid2"><Field label="Qty on Hand"><input type="number" value={form.qty||0} onChange={e=>setForm(f=>({...f,qty:e.target.value}))}/></Field>
        <Field label="Unit"><input value={form.unit||''} onChange={e=>setForm(f=>({...f,unit:e.target.value}))}/></Field></div>
        <div className="grid2"><Field label="Reorder Point"><input type="number" value={form.reorder||0} onChange={e=>setForm(f=>({...f,reorder:e.target.value}))}/></Field>
        <Field label="Unit Cost ($)"><input type="number" step=".01" value={form.cost||0} onChange={e=>setForm(f=>({...f,cost:e.target.value}))}/></Field></div>
        <Field label="Location"><input value={form.loc||''} onChange={e=>setForm(f=>({...f,loc:e.target.value}))}/></Field>
        <div style={{display:'flex',gap:8,marginTop:10}}><button className="btn btn-p" onClick={saveItem}>Save</button><button className="btn btn-g" onClick={()=>setModal(null)}>Cancel</button></div>
      </Modal>}

      {/* BOM Modal */}
      {modal==='bom'&&<Modal title="Bill of Materials" onClose={()=>setModal(null)} lg>
        <div className="grid2" style={{marginBottom:12}}>
          <Field label="Product SKU"><input value={bomForm.productSku} onChange={e=>setBomForm(f=>({...f,productSku:e.target.value}))}/></Field>
          <Field label="Product Name"><input value={bomForm.productName} onChange={e=>setBomForm(f=>({...f,productName:e.target.value}))}/></Field>
        </div>
        <div className="divider"/>
        <div className="hd" style={{fontSize:13,marginBottom:10}}>Components</div>
        {bomForm.items.length>0&&<div className="card" style={{padding:0,overflow:'hidden',marginBottom:12}}>
          <table><thead><tr><th>Component</th><th>Qty</th><th>Unit</th><th>Note</th><th/></tr></thead>
            <tbody>{bomForm.items.map((item,i)=>{const inv=data.inventory.find(x=>x.id===item.inventoryId);return(
              <tr key={i}><td>{inv?.name||item.inventoryId}</td><td className="mono">{item.qty}</td><td>{item.unit}</td><td style={{fontSize:11,color:'var(--muted)'}}>{item.note}</td>
                <td><button className="btn btn-d btn-xs" onClick={()=>setBomForm(f=>({...f,items:f.items.filter((_,j)=>j!==i)}))}>×</button></td>
              </tr>);})}
            </tbody>
          </table>
        </div>}
        <div style={{background:'var(--s2)',border:'1px solid var(--bdr)',borderRadius:6,padding:'12px 14px',marginBottom:14}}>
          <div className="hd" style={{fontSize:12,marginBottom:10,color:'var(--muted)'}}>Add Component</div>
          <div className="grid2" style={{marginBottom:8}}>
            <Field label="Inventory Item">
              <select value={bomItem.inventoryId} onChange={e=>setBomItem(f=>({...f,inventoryId:e.target.value}))}>
                <option value="">— Select —</option>
                {data.inventory.map(i=><option key={i.id} value={i.id}>{i.name}</option>)}
              </select>
            </Field>
            <div className="grid2">
              <Field label="Qty"><input type="number" step=".5" value={bomItem.qty} onChange={e=>setBomItem(f=>({...f,qty:e.target.value}))}/></Field>
              <Field label="Unit"><input value={bomItem.unit} onChange={e=>setBomItem(f=>({...f,unit:e.target.value}))}/></Field>
            </div>
          </div>
          <Field label="Note"><input value={bomItem.note} onChange={e=>setBomItem(f=>({...f,note:e.target.value}))} placeholder="Optional description"/></Field>
          <button className="btn btn-g btn-sm" style={{marginTop:6}} onClick={addBOMItem} disabled={!bomItem.inventoryId}>+ Add Component</button>
        </div>
        <div style={{display:'flex',gap:8}}><button className="btn btn-p" onClick={saveBOM}>Save BOM</button><button className="btn btn-g" onClick={()=>setModal(null)}>Cancel</button></div>
      </Modal>}
    </div>
  );
};

// ─── PRODUCTION ──────────────────────────────────────────────────────────────────
const Production = ({data, setData, user}) => {
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({});
  const stations=['CNC Cut','CNC Drill','Welding','Powder Coat','Assembly','QC Inspection','Packaging'];
  const statuses=['Queued','In Progress','On Hold','Complete'];
  const canEdit = user.role!=='shop';
  const open=(row=null)=>{if(!canEdit)return;setForm(row?{...row}:{id:`WO-${uid()}`,orderId:'',product:'',qty:1,station:'CNC Cut',assigned:'',status:'Queued',start:now(),due:'',progress:0,laborHrs:0,matCost:0,laborRate:28});setModal(row?'edit':'new');};
  const updateProgress=(id,progress)=>setData(d=>({...d,workOrders:d.workOrders.map(w=>w.id===id?{...w,progress}:w)}));
  const save=()=>{const wo={...form,qty:Number(form.qty),progress:Number(form.progress),laborHrs:Number(form.laborHrs),matCost:Number(form.matCost),laborRate:Number(form.laborRate)};if(modal==='new')setData(d=>({...d,workOrders:[...d.workOrders,wo]}));else setData(d=>({...d,workOrders:d.workOrders.map(w=>w.id===wo.id?wo:w)}));setModal(null);};
  const del=id=>setData(d=>({...d,workOrders:d.workOrders.filter(w=>w.id!==id)}));
  return (
    <div className="fade-up">
      <div className="section-hd">
        <div><div className="hd" style={{fontSize:22}}>Production / Work Orders</div>
          <div style={{display:'flex',gap:6,marginTop:5}}><span className="chip">{data.workOrders.filter(w=>w.status==='In Progress').length} active</span><span className="chip">{data.workOrders.filter(w=>w.status==='Queued').length} queued</span></div></div>
        {canEdit&&<button className="btn btn-p" onClick={()=>open()}>+ New Work Order</button>}
      </div>
      <div className="card" style={{padding:0,overflow:'hidden'}}>
        <table><thead><tr><th>WO #</th><th>Order</th><th>Product</th><th>Station</th><th>Assigned</th><th>Status</th><th>Progress</th><th>Due</th><th>Job Cost</th><th/></tr></thead>
          <tbody>{data.workOrders.map(w=>{
            const jc=w.matCost+(w.laborHrs*w.laborRate);
            return(
              <tr key={w.id}>
                <td className="mono" style={{fontSize:11,color:'var(--acc)'}}>{w.id}</td>
                <td className="mono" style={{fontSize:11,color:'var(--muted)'}}>{w.orderId}</td>
                <td style={{fontWeight:500,maxWidth:160,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{w.product}</td>
                <td><span className="chip">{w.station}</span></td>
                <td style={{fontSize:11,color:'var(--muted)'}}>{w.assigned}</td>
                <td><Badge s={w.status}/></td>
                <td style={{width:100}}>
                  <div style={{display:'flex',alignItems:'center',gap:5}}>
                    <div className="progress-bar" style={{flex:1}}><div className="progress-fill" style={{width:`${w.progress}%`,background:w.progress===100?'var(--ok)':'var(--acc)'}}/></div>
                    <span className="mono" style={{fontSize:10,color:'var(--muted)',width:25}}>{w.progress}%</span>
                  </div>
                  {user.role==='shop'&&<input type="range" min={0} max={100} value={w.progress} onChange={e=>updateProgress(w.id,Number(e.target.value))} style={{width:'100%',marginTop:3}}/>}
                </td>
                <td style={{fontSize:11,color:'var(--muted)'}}>{fmtD(w.due)}</td>
                <td className="mono" style={{fontSize:11,color:'var(--ok)',fontWeight:600}}>{fmt$(jc)}</td>
                <td><div style={{display:'flex',gap:4}}>{canEdit&&<><button className="btn btn-g btn-sm" onClick={()=>open(w)}>Edit</button><button className="btn btn-d btn-sm" onClick={()=>del(w.id)}>Del</button></>}<PrintBtn small onClick={()=>printWorkOrder(w)} label="WO"/></div></td>
              </tr>
            );})}
          </tbody>
        </table>
      </div>
      {modal&&canEdit&&<Modal title={modal==='new'?'New Work Order':'Edit'} onClose={()=>setModal(null)}>
        <div className="grid2"><Field label="WO ID"><input value={form.id||''} onChange={e=>setForm(f=>({...f,id:e.target.value}))}/></Field>
        <Field label="Sales Order #"><input value={form.orderId||''} onChange={e=>setForm(f=>({...f,orderId:e.target.value}))}/></Field></div>
        <Field label="Product"><input value={form.product||''} onChange={e=>setForm(f=>({...f,product:e.target.value}))}/></Field>
        <div className="grid2"><Field label="Qty"><input type="number" value={form.qty||1} onChange={e=>setForm(f=>({...f,qty:e.target.value}))}/></Field>
        <Field label="Assigned To"><input value={form.assigned||''} onChange={e=>setForm(f=>({...f,assigned:e.target.value}))}/></Field></div>
        <div className="grid2"><Field label="Station"><select value={form.station||'CNC Cut'} onChange={e=>setForm(f=>({...f,station:e.target.value}))}>{stations.map(s=><option key={s}>{s}</option>)}</select></Field>
        <Field label="Status"><select value={form.status||'Queued'} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>{statuses.map(s=><option key={s}>{s}</option>)}</select></Field></div>
        <div className="grid2"><Field label="Start"><input type="date" value={form.start||''} onChange={e=>setForm(f=>({...f,start:e.target.value}))}/></Field>
        <Field label="Due"><input type="date" value={form.due||''} onChange={e=>setForm(f=>({...f,due:e.target.value}))}/></Field></div>
        <div className="grid3"><Field label="Labor Hrs"><input type="number" step=".5" value={form.laborHrs||0} onChange={e=>setForm(f=>({...f,laborHrs:e.target.value}))}/></Field>
        <Field label="$/hr"><input type="number" value={form.laborRate||28} onChange={e=>setForm(f=>({...f,laborRate:e.target.value}))}/></Field>
        <Field label="Mat Cost ($)"><input type="number" value={form.matCost||0} onChange={e=>setForm(f=>({...f,matCost:e.target.value}))}/></Field></div>
        <Field label={`Progress: ${form.progress||0}%`}><input type="range" min={0} max={100} value={form.progress||0} onChange={e=>setForm(f=>({...f,progress:Number(e.target.value)}))}/></Field>
        <div style={{display:'flex',gap:8,marginTop:10}}><button className="btn btn-p" onClick={save}>Save</button><button className="btn btn-g" onClick={()=>setModal(null)}>Cancel</button></div>
      </Modal>}
    </div>
  );
};

// ─── PURCHASING (with PO Receiving) ──────────────────────────────────────────────
const Purchasing = ({data, setData}) => {
  const [tab,setTab]=useState('po');
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({});
  const [receiving,setReceiving]=useState(null);
  const [recQtys,setRecQtys]=useState({});
  const poStatuses=['Draft','Ordered','In Transit','Received','Cancelled'];

  const openPO=(row=null)=>{
    setForm(row?{...row,items:row.items?[...row.items.map(i=>({...i}))]:[]}:{id:`PO-${uid()}`,vendor:'',vendorId:'',items:[],total:0,status:'Draft',ordered:now(),expected:'',received:false});
    setModal('po');
  };
  const openVnd=(row=null)=>{ setForm(row?{...row}:{id:`VND-${uid()}`,name:'',contact:'',email:'',phone:'',cat:'',rating:5,ytd:0,leadDays:7}); setModal('vnd'); };

  const savePO=()=>{
    const po={...form,total:Number(form.total||form.items?.reduce((a,b)=>a+b.qty*b.cost,0)||0)};
    if(!data.purchaseOrders.find(p=>p.id===po.id))setData(d=>({...d,purchaseOrders:[...d.purchaseOrders,po]}));
    else setData(d=>({...d,purchaseOrders:d.purchaseOrders.map(p=>p.id===po.id?po:p)}));
    setModal(null);
  };
  const saveVnd=()=>{const v={...form,ytd:Number(form.ytd),rating:Number(form.rating),leadDays:Number(form.leadDays)};if(!data.vendors.find(x=>x.id===v.id))setData(d=>({...d,vendors:[...d.vendors,v]}));else setData(d=>({...d,vendors:d.vendors.map(x=>x.id===v.id?v:x)}));setModal(null);};

  const startReceiving=(po)=>{
    const init={};
    po.items?.forEach(item=>{ init[item.inventoryId]=item.qty; });
    setRecQtys(init);
    setReceiving(po);
  };

  const confirmReceiving=()=>{
    if(!receiving)return;
    const logs=[];
    const updInv=data.inventory.map(i=>{
      const rcvQty=recQtys[i.id];
      if(rcvQty>0){
        logs.push({id:`ADJ-${uid()}`,inventoryId:i.id,itemName:i.name,type:'add',qty:Number(rcvQty),reason:`${receiving.id} received from ${receiving.vendor}`,date:now(),user:'Daniel Jones'});
        return {...i,qty:i.qty+Number(rcvQty)};
      }
      return i;
    });
    setData(d=>({...d,
      inventory:updInv,
      adjustmentLog:[...logs,...d.adjustmentLog],
      purchaseOrders:d.purchaseOrders.map(p=>p.id===receiving.id?{...p,status:'Received',received:true}:p),
    }));
    setReceiving(null);
  };

  const del=id=>setData(d=>({...d,purchaseOrders:d.purchaseOrders.filter(p=>p.id!==id)}));
  const delVnd=id=>setData(d=>({...d,vendors:d.vendors.filter(v=>v.id!==id)}));
  const readyToReceive=data.purchaseOrders.filter(p=>!p.received&&['Ordered','In Transit'].includes(p.status));
  return (
    <div className="fade-up">
      <div className="section-hd">
        <div><div className="hd" style={{fontSize:22}}>Purchasing & Vendors</div>
          <div style={{display:'flex',gap:6,marginTop:5}}><span className="chip">{data.vendors.length} vendors</span><span className="chip" style={{color:readyToReceive.length?'var(--info)':undefined}}>{readyToReceive.length} ready to receive</span></div></div>
        {tab==='po'?<button className="btn btn-p" onClick={()=>openPO()}>+ New PO</button>:<button className="btn btn-p" onClick={()=>openVnd()}>+ Add Vendor</button>}
      </div>
      {readyToReceive.length>0&&<div className="alert-bar alert-info"><span style={{color:'var(--info)'}}>📦</span><span><strong>POs Ready to Receive:</strong> {readyToReceive.map(p=>p.id).join(' · ')} — click "Receive" to update inventory automatically</span></div>}
      <div style={{display:'flex',gap:6,marginBottom:14}}><button className={`tab${tab==='po'?' on':''}`} onClick={()=>setTab('po')}>Purchase Orders</button><button className={`tab${tab==='vnd'?' on':''}`} onClick={()=>setTab('vnd')}>Vendors</button></div>

      {tab==='po'&&<div className="card" style={{padding:0,overflow:'hidden'}}>
        <table><thead><tr><th>PO #</th><th>Vendor</th><th>Items</th><th>Total</th><th>Status</th><th>Order Date</th><th>Expected</th><th/></tr></thead>
          <tbody>{data.purchaseOrders.map(p=>(
            <tr key={p.id}>
              <td className="mono" style={{fontSize:11,color:'var(--acc)'}}>{p.id}</td>
              <td style={{fontWeight:500}}>{p.vendor}</td>
              <td style={{fontSize:11,color:'var(--muted)'}}>{p.items?.map(i=>i.name).join(', ').slice(0,50)}</td>
              <td className="mono" style={{fontWeight:500}}>{fmt$(p.total||p.items?.reduce((a,b)=>a+b.qty*b.cost,0)||0)}</td>
              <td><Badge s={p.status}/></td>
              <td style={{fontSize:11,color:'var(--muted)'}}>{fmtD(p.ordered)}</td>
              <td style={{fontSize:11,color:'var(--muted)'}}>{fmtD(p.expected)}</td>
              <td><div style={{display:'flex',gap:4}}>
                {!p.received&&['Ordered','In Transit'].includes(p.status)&&<button className="btn btn-ok btn-sm" onClick={()=>startReceiving(p)}>Receive</button>}
                <button className="btn btn-g btn-sm" onClick={()=>openPO(p)}>Edit</button>
                <button className="btn btn-d btn-sm" onClick={()=>del(p.id)}>Del</button><PrintBtn small onClick={()=>printPO(p)} label="PO"/>
              </div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>}

      {tab==='vnd'&&<div className="card" style={{padding:0,overflow:'hidden'}}>
        <table><thead><tr><th>Vendor</th><th>Contact</th><th>Category</th><th>Lead Days</th><th>Rating</th><th>YTD Spend</th><th/></tr></thead>
          <tbody>{data.vendors.map(v=>(
            <tr key={v.id}>
              <td style={{fontWeight:500}}>{v.name}</td>
              <td style={{fontSize:11}}><div>{v.contact}</div><div className="mono" style={{fontSize:10,color:'var(--muted)'}}>{v.email}</div></td>
              <td><span className="chip">{v.cat}</span></td>
              <td className="mono" style={{color:'var(--muted)'}}>{v.leadDays}d</td>
              <td><span style={{color:'var(--warn)'}}>{Array(Math.round(v.rating)).fill('★').join('')}</span><span style={{color:'var(--dim)'}}>{Array(5-Math.round(v.rating)).fill('★').join('')}</span></td>
              <td className="mono" style={{fontWeight:500}}>{fmt$(v.ytd)}</td>
              <td><div style={{display:'flex',gap:4}}><button className="btn btn-g btn-sm" onClick={()=>openVnd(v)}>Edit</button><button className="btn btn-d btn-sm" onClick={()=>delVnd(v.id)}>Del</button></div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>}

      {/* PO Receiving Modal */}
      {receiving&&<Modal title={`Receive PO — ${receiving.id}`} onClose={()=>setReceiving(null)}>
        <div style={{background:'var(--s2)',border:'1px solid var(--bdr)',borderRadius:6,padding:'10px 14px',marginBottom:16}}>
          <div style={{fontSize:12,color:'var(--muted)'}}>Vendor: <strong style={{color:'var(--txt)'}}>{receiving.vendor}</strong></div>
        </div>
        <div className="hd" style={{fontSize:13,marginBottom:10}}>Confirm Received Quantities</div>
        {receiving.items?.map(item=>{
          const inv=data.inventory.find(i=>i.id===item.inventoryId);
          return (
            <div key={item.inventoryId} style={{display:'flex',alignItems:'center',gap:12,marginBottom:10,padding:'8px 12px',background:'var(--s2)',borderRadius:5}}>
              <div style={{flex:1}}>
                <div style={{fontSize:12.5,fontWeight:500}}>{item.name}</div>
                <div style={{fontSize:11,color:'var(--muted)'}}>Currently: {inv?.qty||0} {item.unit} on hand</div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <label style={{margin:0,textTransform:'none',letterSpacing:0,fontSize:11}}>Qty received:</label>
                <input type="number" min={0} value={recQtys[item.inventoryId]||0} onChange={e=>setRecQtys(r=>({...r,[item.inventoryId]:e.target.value}))} style={{width:80}}/>
                <span style={{fontSize:11,color:'var(--muted)'}}>{item.unit}</span>
              </div>
            </div>
          );
        })}
        <div style={{background:'rgba(16,185,129,.07)',border:'1px solid rgba(16,185,129,.2)',borderRadius:5,padding:'8px 12px',fontSize:12,marginBottom:14,color:'var(--ok)'}}>
          ✓ Receiving this PO will automatically update inventory quantities and log adjustments.
        </div>
        <div style={{display:'flex',gap:8}}><button className="btn btn-p" onClick={confirmReceiving}>Confirm & Update Inventory</button><button className="btn btn-g" onClick={()=>setReceiving(null)}>Cancel</button></div>
      </Modal>}

      {modal==='po'&&<Modal title="Purchase Order" onClose={()=>setModal(null)}>
        <div className="grid2"><Field label="PO #"><input value={form.id||''} onChange={e=>setForm(f=>({...f,id:e.target.value}))}/></Field>
        <Field label="Vendor"><input value={form.vendor||''} onChange={e=>setForm(f=>({...f,vendor:e.target.value}))}/></Field></div>
        <div className="grid2"><Field label="Status"><select value={form.status||'Draft'} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>{poStatuses.map(s=><option key={s}>{s}</option>)}</select></Field>
        <Field label="Total ($)"><input type="number" value={form.total||0} onChange={e=>setForm(f=>({...f,total:e.target.value}))}/></Field></div>
        <div className="grid2"><Field label="Order Date"><input type="date" value={form.ordered||''} onChange={e=>setForm(f=>({...f,ordered:e.target.value}))}/></Field>
        <Field label="Expected"><input type="date" value={form.expected||''} onChange={e=>setForm(f=>({...f,expected:e.target.value}))}/></Field></div>
        <div style={{display:'flex',gap:8,marginTop:10}}><button className="btn btn-p" onClick={savePO}>Save</button><button className="btn btn-g" onClick={()=>setModal(null)}>Cancel</button></div>
      </Modal>}
      {modal==='vnd'&&<Modal title="Vendor" onClose={()=>setModal(null)}>
        <Field label="Company Name"><input value={form.name||''} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></Field>
        <div className="grid2"><Field label="Contact"><input value={form.contact||''} onChange={e=>setForm(f=>({...f,contact:e.target.value}))}/></Field>
        <Field label="Category"><input value={form.cat||''} onChange={e=>setForm(f=>({...f,cat:e.target.value}))}/></Field></div>
        <div className="grid2"><Field label="Email"><input value={form.email||''} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/></Field>
        <Field label="Phone"><input value={form.phone||''} onChange={e=>setForm(f=>({...f,phone:e.target.value}))}/></Field></div>
        <div className="grid2"><Field label="Lead Days"><input type="number" value={form.leadDays||7} onChange={e=>setForm(f=>({...f,leadDays:e.target.value}))}/></Field>
        <Field label="Rating (1-5)"><input type="number" min={1} max={5} step={.1} value={form.rating||5} onChange={e=>setForm(f=>({...f,rating:e.target.value}))}/></Field></div>
        <div style={{display:'flex',gap:8,marginTop:10}}><button className="btn btn-p" onClick={saveVnd}>Save</button><button className="btn btn-g" onClick={()=>setModal(null)}>Cancel</button></div>
      </Modal>}
    </div>
  );
};

// ─── INVOICING ───────────────────────────────────────────────────────────────────
const Invoicing = ({data, setData}) => {
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({});
  const statuses=['Pending','Paid','Overdue','Cancelled'];
  const open=(row=null)=>{setForm(row?{...row}:{id:`INV-${uid()}`,orderId:'',customer:'',amount:0,status:'Pending',issued:now(),due:'',paid:null});setModal(row?'edit':'new');};
  const save=()=>{const inv={...form,amount:Number(form.amount),paid:form.paid||null};if(modal==='new')setData(d=>({...d,invoices:[...d.invoices,inv]}));else setData(d=>({...d,invoices:d.invoices.map(i=>i.id===inv.id?inv:i)}));setModal(null);};
  const del=id=>setData(d=>({...d,invoices:d.invoices.filter(i=>i.id!==id)}));
  const paid=data.invoices.filter(i=>i.status==='Paid').reduce((a,b)=>a+b.amount,0);
  const owed=data.invoices.filter(i=>i.status!=='Paid'&&i.status!=='Cancelled').reduce((a,b)=>a+b.amount,0);
  return (
    <div className="fade-up">
      <div className="section-hd">
        <div><div className="hd" style={{fontSize:22}}>Invoicing & A/R</div>
          <div style={{display:'flex',gap:6,marginTop:5}}><span className="chip" style={{color:'var(--ok)'}}>{fmt$(paid)} collected</span><span className="chip" style={{color:owed?'var(--warn)':undefined}}>{fmt$(owed)} owed</span></div></div>
        <button className="btn btn-p" onClick={()=>open()}>+ New Invoice</button>
      </div>
      {data.invoices.filter(i=>i.status==='Overdue').length>0&&<div className="alert-bar alert-err"><span style={{color:'var(--err)'}}>⚠</span><strong style={{color:'var(--err)'}}>Overdue:</strong>&nbsp;{data.invoices.filter(i=>i.status==='Overdue').map(i=>`${i.id} · ${i.customer} (${fmt$(i.amount)})`).join(' — ')}</div>}
      <div className="card" style={{padding:0,overflow:'hidden'}}>
        <table><thead><tr><th>Invoice #</th><th>Order</th><th>Customer</th><th>Amount</th><th>Status</th><th>Issued</th><th>Due</th><th>Paid</th><th/></tr></thead>
          <tbody>{data.invoices.map(i=>(
            <tr key={i.id}>
              <td className="mono" style={{fontSize:11,color:'var(--acc)'}}>{i.id}</td>
              <td className="mono" style={{fontSize:11,color:'var(--muted)'}}>{i.orderId}</td>
              <td style={{fontWeight:500}}>{i.customer}</td>
              <td className="mono" style={{fontWeight:600}}>{fmt$(i.amount)}</td>
              <td><Badge s={i.status}/></td>
              <td style={{fontSize:11,color:'var(--muted)'}}>{fmtD(i.issued)}</td>
              <td style={{fontSize:11,color:i.status==='Overdue'?'var(--err)':'var(--muted)'}}>{fmtD(i.due)}</td>
              <td style={{fontSize:11,color:'var(--ok)'}}>{i.paid?fmtD(i.paid):'—'}</td>
              <td><div style={{display:'flex',gap:4}}><button className="btn btn-g btn-sm" onClick={()=>open(i)}>Edit</button><button className="btn btn-d btn-sm" onClick={()=>del(i.id)}>Del</button><PrintBtn small onClick={()=>printInvoice(i)} label="INV"/></div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {modal&&<Modal title={modal==='new'?'New Invoice':'Edit'} onClose={()=>setModal(null)}>
        <div className="grid2"><Field label="Invoice #"><input value={form.id||''} onChange={e=>setForm(f=>({...f,id:e.target.value}))}/></Field>
        <Field label="Sales Order #"><input value={form.orderId||''} onChange={e=>setForm(f=>({...f,orderId:e.target.value}))}/></Field></div>
        <Field label="Customer"><input value={form.customer||''} onChange={e=>setForm(f=>({...f,customer:e.target.value}))}/></Field>
        <div className="grid2"><Field label="Amount ($)"><input type="number" value={form.amount||0} onChange={e=>setForm(f=>({...f,amount:e.target.value}))}/></Field>
        <Field label="Status"><select value={form.status||'Pending'} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>{statuses.map(s=><option key={s}>{s}</option>)}</select></Field></div>
        <div className="grid2"><Field label="Issue Date"><input type="date" value={form.issued||''} onChange={e=>setForm(f=>({...f,issued:e.target.value}))}/></Field>
        <Field label="Due Date"><input type="date" value={form.due||''} onChange={e=>setForm(f=>({...f,due:e.target.value}))}/></Field></div>
        <Field label="Paid Date"><input type="date" value={form.paid||''} onChange={e=>setForm(f=>({...f,paid:e.target.value||null}))}/></Field>
        <div style={{display:'flex',gap:8,marginTop:10}}><button className="btn btn-p" onClick={save}>Save</button><button className="btn btn-g" onClick={()=>setModal(null)}>Cancel</button></div>
      </Modal>}
    </div>
  );
};

// ─── SHIPPING ────────────────────────────────────────────────────────────────────
const Shipping = ({data, setData}) => {
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({});
  const statuses=['Ready to Ship','Shipped','In Transit','Delivered','Exception'];
  const carriers=['R+L Carriers','XPO Logistics','Old Dominion','FedEx Freight','UPS Freight','Local Delivery'];
  const open=(row=null)=>{setForm(row?{...row}:{id:`SHP-${uid()}`,orderId:'',customer:'',carrier:'R+L Carriers',tracking:'',status:'Ready to Ship',shipped:'',delivered:''});setModal(row?'edit':'new');};
  const save=()=>{if(modal==='new')setData(d=>({...d,shipments:[...d.shipments,form]}));else setData(d=>({...d,shipments:d.shipments.map(s=>s.id===form.id?form:s)}));setModal(null);};
  const del=id=>setData(d=>({...d,shipments:d.shipments.filter(s=>s.id!==id)}));
  return (
    <div className="fade-up">
      <div className="section-hd">
        <div><div className="hd" style={{fontSize:22}}>Shipping & Fulfillment</div>
          <div style={{display:'flex',gap:6,marginTop:5}}><span className="chip">{data.shipments.filter(s=>['Shipped','In Transit'].includes(s.status)).length} in transit</span><span className="chip">{data.shipments.filter(s=>s.status==='Delivered').length} delivered</span></div></div>
        <button className="btn btn-p" onClick={()=>open()}>+ New Shipment</button>
      </div>
      <div className="card" style={{padding:0,overflow:'hidden'}}>
        <table><thead><tr><th>Shipment #</th><th>Order</th><th>Customer</th><th>Carrier</th><th>Tracking</th><th>Status</th><th>Shipped</th><th>Delivered</th><th/></tr></thead>
          <tbody>
            {data.shipments.length===0&&<tr><td colSpan={9}><Empty msg="No shipments"/></td></tr>}
            {data.shipments.map(s=>(
              <tr key={s.id}>
                <td className="mono" style={{fontSize:11,color:'var(--acc)'}}>{s.id}</td>
                <td className="mono" style={{fontSize:11,color:'var(--muted)'}}>{s.orderId}</td>
                <td style={{fontWeight:500}}>{s.customer}</td>
                <td style={{fontSize:11,color:'var(--muted)'}}>{s.carrier}</td>
                <td className="mono" style={{fontSize:10.5,color:'var(--muted)'}}>{s.tracking||'—'}</td>
                <td><Badge s={s.status}/></td>
                <td style={{fontSize:11,color:'var(--muted)'}}>{fmtD(s.shipped)}</td>
                <td style={{fontSize:11,color:s.status==='Delivered'?'var(--ok)':'var(--muted)'}}>{fmtD(s.delivered)}</td>
                <td><div style={{display:'flex',gap:4}}><button className="btn btn-g btn-sm" onClick={()=>open(s)}>Edit</button><button className="btn btn-d btn-sm" onClick={()=>del(s.id)}>Del</button><PrintBtn small onClick={()=>printPackingSlip(s)} label="Slip"/></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal&&<Modal title={modal==='new'?'New Shipment':'Edit'} onClose={()=>setModal(null)}>
        <div className="grid2"><Field label="Shipment #"><input value={form.id||''} onChange={e=>setForm(f=>({...f,id:e.target.value}))}/></Field>
        <Field label="Sales Order #"><input value={form.orderId||''} onChange={e=>setForm(f=>({...f,orderId:e.target.value}))}/></Field></div>
        <Field label="Customer"><input value={form.customer||''} onChange={e=>setForm(f=>({...f,customer:e.target.value}))}/></Field>
        <div className="grid2"><Field label="Carrier"><select value={form.carrier} onChange={e=>setForm(f=>({...f,carrier:e.target.value}))}>{carriers.map(c=><option key={c}>{c}</option>)}</select></Field>
        <Field label="Tracking #"><input value={form.tracking||''} onChange={e=>setForm(f=>({...f,tracking:e.target.value}))}/></Field></div>
        <Field label="Status"><select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>{statuses.map(s=><option key={s}>{s}</option>)}</select></Field>
        <div className="grid2"><Field label="Ship Date"><input type="date" value={form.shipped||''} onChange={e=>setForm(f=>({...f,shipped:e.target.value}))}/></Field>
        <Field label="Delivery Date"><input type="date" value={form.delivered||''} onChange={e=>setForm(f=>({...f,delivered:e.target.value}))}/></Field></div>
        <div style={{display:'flex',gap:8,marginTop:10}}><button className="btn btn-p" onClick={save}>Save</button><button className="btn btn-g" onClick={()=>setModal(null)}>Cancel</button></div>
      </Modal>}
    </div>
  );
};

// ─── JOB COSTING ────────────────────────────────────────────────────────────────
const JobCost = ({data}) => {
  const wos=data.workOrders.map(w=>{
    const order=data.salesOrders.find(o=>o.id===w.orderId);
    const labor=w.laborHrs*w.laborRate;const total=labor+w.matCost;
    const rev=order?order.total/Math.max(1,data.workOrders.filter(x=>x.orderId===w.orderId).length):0;
    return {...w,labor,total,rev,margin:rev>0?((rev-total)/rev*100):null};
  });
  const totalRev=wos.reduce((a,b)=>a+(b.rev||0),0);
  const totalCost=wos.reduce((a,b)=>a+b.total,0);
  const margin=totalRev>0?((totalRev-totalCost)/totalRev*100):0;
  return (
    <div className="fade-up">
      <div className="section-hd">
        <div><div className="hd" style={{fontSize:22}}>Job Costing</div>
          <div style={{display:'flex',gap:6,marginTop:5}}>
            <span className="chip" style={{color:'var(--ok)'}}>{fmt$(totalRev)} revenue</span>
            <span className="chip" style={{color:'var(--err)'}}>{fmt$(totalCost)} cost</span>
            <span className="chip" style={{color:margin>40?'var(--ok)':margin>20?'var(--warn)':'var(--err)'}}>{margin.toFixed(1)}% margin</span>
          </div></div>
      </div>
      <div className="card" style={{padding:0,overflow:'hidden'}}>
        <table><thead><tr><th>WO #</th><th>Product</th><th>Status</th><th>Labor Hrs</th><th>Labor $</th><th>Material $</th><th>Total Cost</th><th>Est. Revenue</th><th>Margin</th></tr></thead>
          <tbody>{wos.map(w=>(
            <tr key={w.id}>
              <td className="mono" style={{fontSize:11,color:'var(--acc)'}}>{w.id}</td>
              <td style={{fontWeight:500,maxWidth:160,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{w.product}</td>
              <td><Badge s={w.status}/></td>
              <td className="mono">{w.laborHrs}h @ ${w.laborRate}</td>
              <td className="mono">{fmt$(w.labor)}</td>
              <td className="mono">{fmt$(w.matCost)}</td>
              <td className="mono" style={{fontWeight:600,color:'var(--err)'}}>{fmt$(w.total)}</td>
              <td className="mono" style={{fontWeight:600,color:'var(--ok)'}}>{fmt$(w.rev)}</td>
              <td>{w.margin!==null?<span className="mono" style={{fontWeight:700,fontSize:12,color:w.margin>40?'var(--ok)':w.margin>20?'var(--warn)':'var(--err)'}}>{w.margin.toFixed(1)}%</span>:'—'}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
};

// ─── CUSTOMERS ───────────────────────────────────────────────────────────────────
const Customers = ({data, setData}) => {
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({});
  const [view,setView]=useState(null);
  const types=['Builder','GC','Developer','Commercial','Residential','Other'];
  const open=(row=null)=>{setForm(row?{...row}:{id:`CUS-${uid()}`,name:'',contact:'',email:'',phone:'',type:'Builder',city:'',ytd:0,portalAccess:false,notes:''});setModal(row?'edit':'new');};
  const save=()=>{const c={...form,ytd:Number(form.ytd)};if(modal==='new')setData(d=>({...d,customers:[...d.customers,c]}));else setData(d=>({...d,customers:d.customers.map(x=>x.id===c.id?c:x)}));setModal(null);};
  const del=id=>setData(d=>({...d,customers:d.customers.filter(c=>c.id!==id)}));
  const vc=data.customers.find(c=>c.id===view);
  const vcOrders=vc?data.salesOrders.filter(o=>o.cusId===vc.id):[];
  return (
    <div className="fade-up">
      <div className="section-hd">
        <div><div className="hd" style={{fontSize:22}}>Customers</div>
          <div style={{display:'flex',gap:6,marginTop:5}}><span className="chip">{data.customers.length} accounts</span><span className="chip">{fmt$(data.customers.reduce((a,b)=>a+b.ytd,0))} YTD</span></div></div>
        <button className="btn btn-p" onClick={()=>open()}>+ Add Customer</button>
      </div>
      <div className="card" style={{padding:0,overflow:'hidden'}}>
        <table><thead><tr><th>Customer</th><th>Contact</th><th>Type</th><th>City</th><th>YTD Revenue</th><th>Portal</th><th/></tr></thead>
          <tbody>{data.customers.map(c=>(
            <tr key={c.id}>
              <td style={{fontWeight:600}}>{c.name}</td>
              <td style={{fontSize:11}}><div>{c.contact}</div><div className="mono" style={{fontSize:10,color:'var(--muted)'}}>{c.email}</div></td>
              <td><span className="chip">{c.type}</span></td>
              <td style={{fontSize:11,color:'var(--muted)'}}>{c.city}</td>
              <td className="mono" style={{fontWeight:600,color:'var(--ok)'}}>{fmt$(c.ytd)}</td>
              <td>{c.portalAccess?<span className="badge" style={{background:'rgba(16,185,129,.12)',color:'var(--ok)',border:'1px solid rgba(16,185,129,.25)'}}>Active</span>:<span className="chip">None</span>}</td>
              <td><div style={{display:'flex',gap:4}}>
                <button className="btn btn-g btn-sm" onClick={()=>setView(c.id)}>View</button>
                <button className="btn btn-g btn-sm" onClick={()=>open(c)}>Edit</button>
                <button className="btn btn-d btn-sm" onClick={()=>del(c.id)}>Del</button>
              </div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {modal&&<Modal title={modal==='new'?'Add Customer':'Edit Customer'} onClose={()=>setModal(null)}>
        <Field label="Company Name"><input value={form.name||''} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></Field>
        <div className="grid2"><Field label="Contact"><input value={form.contact||''} onChange={e=>setForm(f=>({...f,contact:e.target.value}))}/></Field>
        <Field label="Type"><select value={form.type||'Builder'} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>{types.map(t=><option key={t}>{t}</option>)}</select></Field></div>
        <div className="grid2"><Field label="Email"><input value={form.email||''} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/></Field>
        <Field label="Phone"><input value={form.phone||''} onChange={e=>setForm(f=>({...f,phone:e.target.value}))}/></Field></div>
        <div className="grid2"><Field label="City"><input value={form.city||''} onChange={e=>setForm(f=>({...f,city:e.target.value}))}/></Field>
        <Field label="YTD ($)"><input type="number" value={form.ytd||0} onChange={e=>setForm(f=>({...f,ytd:e.target.value}))}/></Field></div>
        <Field label="Portal Access"><div style={{display:'flex',alignItems:'center',gap:8,marginTop:4}}><input type="checkbox" checked={!!form.portalAccess} onChange={e=>setForm(f=>({...f,portalAccess:e.target.checked}))}/><span style={{fontSize:12}}>Enable portal access</span></div></Field>
        <Field label="Notes"><textarea value={form.notes||''} rows={2} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/></Field>
        <div style={{display:'flex',gap:8,marginTop:10}}><button className="btn btn-p" onClick={save}>Save</button><button className="btn btn-g" onClick={()=>setModal(null)}>Cancel</button></div>
      </Modal>}
      {vc&&<Modal title={vc.name} onClose={()=>setView(null)} lg>
        <div className="grid3" style={{marginBottom:16}}>
          {[{l:'YTD Revenue',v:fmt$(vc.ytd),c:'var(--ok)'},{l:'Total Orders',v:vcOrders.length,c:'var(--acc)'},{l:'Portal',v:vc.portalAccess?'Active':'Inactive',c:vc.portalAccess?'var(--ok)':'var(--muted)'}].map(k=>(
            <div key={k.l} style={{background:'var(--s2)',border:'1px solid var(--bdr)',borderRadius:6,padding:'10px 12px'}}>
              <div style={{fontSize:9,fontFamily:'Barlow Condensed',fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--muted)',marginBottom:4}}>{k.l}</div>
              <div className="mono" style={{fontSize:18,fontWeight:700,color:k.c}}>{k.v}</div>
            </div>
          ))}
        </div>
        <div className="hd" style={{fontSize:13,marginBottom:10}}>Orders</div>
        {vcOrders.length===0?<Empty msg="No orders"/>:vcOrders.map(o=>(
          <div key={o.id} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid var(--bdr)',alignItems:'center'}}>
            <div><span className="mono" style={{fontSize:11,color:'var(--acc)'}}>{o.id}</span><span style={{fontSize:12,marginLeft:8,color:'var(--muted)'}}>{o.notes?.slice(0,50)}</span></div>
            <div style={{display:'flex',gap:8,alignItems:'center'}}><span className="mono" style={{fontSize:12}}>{fmt$(o.total)}</span><Badge s={o.status}/></div>
          </div>
        ))}
      </Modal>}
    </div>
  );
};

// ─── AUTO REORDER ────────────────────────────────────────────────────────────────
const AutoPO = ({data, setData}) => {
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({});
  const [confirm,setConfirm]=useState(null);
  const triggered=data.autoPoRules.filter(r=>{const i=data.inventory.find(x=>x.id===r.inventoryId);return r.enabled&&i&&i.qty<=i.reorder;});
  const open=(row=null)=>{setForm(row?{...row}:{id:`APR-${uid()}`,inventoryId:'',itemName:'',vendorId:'',vendorName:'',triggerQty:0,orderQty:0,unitCost:0,unit:'ft',enabled:true});setModal(row?'edit':'new');};
  const save=()=>{const r={...form,triggerQty:Number(form.triggerQty),orderQty:Number(form.orderQty),unitCost:Number(form.unitCost)};if(!data.autoPoRules.find(x=>x.id===r.id))setData(d=>({...d,autoPoRules:[...d.autoPoRules,r]}));else setData(d=>({...d,autoPoRules:d.autoPoRules.map(x=>x.id===r.id?r:x)}));setModal(null);};
  const toggle=id=>setData(d=>({...d,autoPoRules:d.autoPoRules.map(r=>r.id===id?{...r,enabled:!r.enabled}:r)}));
  const del=id=>setData(d=>({...d,autoPoRules:d.autoPoRules.filter(r=>r.id!==id)}));
  const generatePO=(rule)=>{
    const vnd=data.vendors.find(v=>v.id===rule.vendorId);
    const exp=new Date();exp.setDate(exp.getDate()+(vnd?.leadDays||7));
    const po={id:`PO-${uid()}`,vendor:rule.vendorName,vendorId:rule.vendorId,
      items:[{inventoryId:rule.inventoryId,sku:'',name:rule.itemName,qty:rule.orderQty,unit:rule.unit,cost:rule.unitCost}],
      total:rule.orderQty*rule.unitCost,status:'Ordered',ordered:now(),expected:exp.toISOString().slice(0,10),received:false,autoGenerated:true};
    setData(d=>({...d,purchaseOrders:[...d.purchaseOrders,po]}));
    setConfirm(null);
  };
  return (
    <div className="fade-up">
      <div className="section-hd">
        <div><div className="hd" style={{fontSize:22}}>Auto Reorder Rules</div>
          <div style={{display:'flex',gap:6,marginTop:5}}><span className="chip">{data.autoPoRules.filter(r=>r.enabled).length} active</span><span className="chip" style={{color:triggered.length?'var(--err)':undefined}}>{triggered.length} triggered</span></div></div>
        <button className="btn btn-p" onClick={()=>open()}>+ New Rule</button>
      </div>
      {triggered.length>0&&<div className="alert-bar alert-err" style={{flexDirection:'column',gap:8}}>
        <div style={{display:'flex',gap:6,alignItems:'center'}}><span style={{color:'var(--err)'}}>⚡</span><strong style={{color:'var(--err)'}}>Auto PO Triggers Active</strong></div>
        {triggered.map(r=>{const i=data.inventory.find(x=>x.id===r.inventoryId);return(
          <div key={r.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',background:'var(--s2)',borderRadius:5,padding:'8px 12px'}}>
            <span style={{fontSize:12}}><strong>{r.itemName}</strong> — {i?.qty} {r.unit} remaining (reorder at {r.triggerQty}) · Order {r.orderQty} {r.unit} for {fmt$(r.orderQty*r.unitCost)}</span>
            <button className="btn btn-p btn-sm" onClick={()=>setConfirm(r)}>Generate PO</button>
          </div>
        );})}
      </div>}
      <div className="card" style={{padding:0,overflow:'hidden'}}>
        <table><thead><tr><th>Item</th><th>Vendor</th><th>Trigger At</th><th>Order Qty</th><th>Est. Total</th><th>Enabled</th><th>Stock Now</th><th/></tr></thead>
          <tbody>{data.autoPoRules.map(r=>{const i=data.inventory.find(x=>x.id===r.inventoryId);const trg=i&&i.qty<=r.triggerQty;return(
            <tr key={r.id}>
              <td style={{fontWeight:500}}>{r.itemName}</td>
              <td style={{fontSize:11,color:'var(--muted)'}}>{r.vendorName}</td>
              <td className="mono">{r.triggerQty.toLocaleString()} {r.unit}</td>
              <td className="mono">{r.orderQty.toLocaleString()} {r.unit}</td>
              <td className="mono" style={{fontWeight:500}}>{fmt$(r.orderQty*r.unitCost)}</td>
              <td>
                <div style={{display:'flex',alignItems:'center',gap:6}}>
                  <div onClick={()=>toggle(r.id)} style={{width:30,height:15,borderRadius:8,background:r.enabled?'var(--ok)':'var(--bdr2)',cursor:'pointer',transition:'background .2s',position:'relative'}}>
                    <div style={{position:'absolute',top:2,left:r.enabled?15:2,width:11,height:11,borderRadius:'50%',background:'#fff',transition:'left .2s'}}/>
                  </div>
                  <span style={{fontSize:11,color:r.enabled?'var(--ok)':'var(--muted)'}}>{r.enabled?'On':'Off'}</span>
                </div>
              </td>
              <td><span className="mono" style={{color:trg?'var(--err)':'var(--ok)',fontWeight:600}}>{i?.qty||'—'} {r.unit}{trg?' ⚡':''}</span></td>
              <td><div style={{display:'flex',gap:4}}>
                {trg&&r.enabled&&<button className="btn btn-ok btn-sm" onClick={()=>setConfirm(r)}>PO</button>}
                <button className="btn btn-g btn-sm" onClick={()=>open(r)}>Edit</button>
                <button className="btn btn-d btn-sm" onClick={()=>del(r.id)}>Del</button>
              </div></td>
            </tr>
          );})}
          </tbody>
        </table>
      </div>
      {modal&&<Modal title={modal==='new'?'New Rule':'Edit Rule'} onClose={()=>setModal(null)}>
        <Field label="Item Name"><input value={form.itemName||''} onChange={e=>setForm(f=>({...f,itemName:e.target.value}))}/></Field>
        <div className="grid2"><Field label="Inventory Item ID"><input value={form.inventoryId||''} onChange={e=>setForm(f=>({...f,inventoryId:e.target.value}))}/></Field>
        <Field label="Unit"><input value={form.unit||''} onChange={e=>setForm(f=>({...f,unit:e.target.value}))}/></Field></div>
        <div className="grid2"><Field label="Vendor Name"><input value={form.vendorName||''} onChange={e=>setForm(f=>({...f,vendorName:e.target.value}))}/></Field>
        <Field label="Vendor ID"><input value={form.vendorId||''} onChange={e=>setForm(f=>({...f,vendorId:e.target.value}))}/></Field></div>
        <div className="grid3"><Field label="Trigger Qty"><input type="number" value={form.triggerQty||0} onChange={e=>setForm(f=>({...f,triggerQty:e.target.value}))}/></Field>
        <Field label="Order Qty"><input type="number" value={form.orderQty||0} onChange={e=>setForm(f=>({...f,orderQty:e.target.value}))}/></Field>
        <Field label="Unit Cost ($)"><input type="number" step=".01" value={form.unitCost||0} onChange={e=>setForm(f=>({...f,unitCost:e.target.value}))}/></Field></div>
        <div style={{display:'flex',gap:8,marginTop:10}}><button className="btn btn-p" onClick={save}>Save</button><button className="btn btn-g" onClick={()=>setModal(null)}>Cancel</button></div>
      </Modal>}
      {confirm&&<Modal title="Confirm Purchase Order" onClose={()=>setConfirm(null)}>
        <div style={{background:'var(--s2)',border:'1px solid var(--bdr)',borderRadius:6,padding:'14px',marginBottom:14}}>
          <div style={{marginBottom:6,fontSize:12}}><span style={{color:'var(--muted)'}}>Item:</span><strong style={{marginLeft:6}}>{confirm.itemName}</strong></div>
          <div style={{marginBottom:6,fontSize:12}}><span style={{color:'var(--muted)'}}>Vendor:</span><span style={{marginLeft:6}}>{confirm.vendorName}</span></div>
          <div style={{fontSize:12}}><span style={{color:'var(--muted)'}}>Qty:</span><span className="mono" style={{marginLeft:6}}>{confirm.orderQty} {confirm.unit}</span>&nbsp;&nbsp;<span style={{color:'var(--muted)'}}>Total:</span><span className="mono" style={{color:'var(--ok)',fontWeight:700,marginLeft:6,fontSize:16}}>{fmt$(confirm.orderQty*confirm.unitCost)}</span></div>
        </div>
        <div style={{display:'flex',gap:8}}><button className="btn btn-p" onClick={()=>generatePO(confirm)}>✓ Generate PO</button><button className="btn btn-g" onClick={()=>setConfirm(null)}>Cancel</button></div>
      </Modal>}
    </div>
  );
};

// ─── REPORTS ─────────────────────────────────────────────────────────────────────
const Reports = ({data}) => {
  const [loading,setLoading]=useState(false);
  const [report,setReport]=useState('');
  const rev=data.salesOrders.filter(o=>o.type==='order').reduce((a,b)=>a+b.total,0);
  const cost=data.workOrders.reduce((a,b)=>a+(b.matCost+(b.laborHrs*b.laborRate)),0);
  const owed=data.invoices.filter(i=>i.status!=='Paid'&&i.status!=='Cancelled').reduce((a,b)=>a+b.amount,0);
  const topCus=[...data.customers].sort((a,b)=>b.ytd-a.ytd).slice(0,5);
  const PIE_C=['#00e5ff','#7c3aed','#f59e0b','#10b981','#ec4899'];
  const genReport=async()=>{
    setLoading(true);setReport('');
    try{
      const res=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:900,
          system:'You are a manufacturing operations analyst. Write a concise 3-section executive report for Daniel Jones, Director of Operations at Maisy Railing. Sections: 1) Financial Health 2) Operational Highlights & Risks 3) Top 3 Action Items (bullet points). Be specific with numbers. Be direct and professional.',
          messages:[{role:'user',content:`Revenue: ${fmt$(rev)} | COGS: ${fmt$(cost)} | Margin: ${rev>0?((rev-cost)/rev*100).toFixed(1):'N/A'}% | A/R Owed: ${fmt$(owed)} | Low Stock: ${data.inventory.filter(i=>i.qty<=i.reorder).length} | Overdue Invoices: ${data.invoices.filter(i=>i.status==='Overdue').length} | Active WOs: ${data.workOrders.filter(w=>w.status==='In Progress').length} | Top Customer: ${topCus[0]?.name} (${fmt$(topCus[0]?.ytd)})`}]})});
      const d=await res.json();setReport(d.content?.[0]?.text||'Error.');
    }catch(e){setReport('Connection error.');}
    setLoading(false);
  };
  const exportCSV=()=>{
    const rows=data.salesOrders.map(o=>`"${o.id}","${o.customer}","${o.date}","${o.total}","${o.status}","${o.type}"`);
    const csv=['ID,Customer,Date,Total,Status,Type',...rows].join('\n');
    const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='maisy_sales.csv';a.click();
  };
  return (
    <div className="fade-up">
      <div className="section-hd">
        <div><div className="hd" style={{fontSize:22}}>Reports & Analytics</div></div>
        <div style={{display:'flex',gap:8}}>
          <button className="btn btn-v" onClick={genReport} disabled={loading}>{loading?<><Spinner/> Analyzing…</>:'◈ AI Executive Report'}</button>
          <button className="btn btn-g" onClick={exportCSV}>↓ Export CSV</button>
        </div>
      </div>
      {report&&<div style={{background:'rgba(0,229,255,.04)',border:'1px solid rgba(0,229,255,.18)',borderRadius:8,padding:'16px 18px',marginBottom:18}}>
        <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:12}}>
          <div style={{width:7,height:7,borderRadius:'50%',background:'var(--acc)'}} className="pulse"/>
          <span className="hd" style={{fontSize:14,color:'var(--acc)'}}>AI Executive Report — {new Date().toLocaleDateString()}</span>
        </div>
        {report.split('\n').map((l,i)=><div key={i} style={{fontSize:13,lineHeight:1.75,minHeight:4}}>{l}</div>)}
      </div>}
      <div className="grid4" style={{marginBottom:16}}>
        {[{l:'Revenue',v:fmt$(rev),c:'var(--acc)'},{l:'COGS',v:fmt$(cost),c:'var(--err)'},{l:'Gross Margin',v:rev>0?((rev-cost)/rev*100).toFixed(1)+'%':'N/A',c:'var(--ok)'},{l:'A/R Outstanding',v:fmt$(owed),c:'var(--warn)'}].map(k=>(
          <div className="stat-card" key={k.l}><div style={{fontSize:9,fontFamily:'Barlow Condensed',fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--muted)',marginBottom:6}}>{k.l}</div><div className="mono hd" style={{fontSize:22,color:k.c}}>{k.v}</div></div>
        ))}
      </div>
      <div className="grid2">
        <div className="card">
          <div className="hd" style={{fontSize:13,marginBottom:12}}>Top Customers</div>
          {topCus.map((c,i)=>(
            <div key={c.id} style={{display:'flex',alignItems:'center',gap:10,marginBottom:9}}>
              <div style={{width:20,height:20,borderRadius:'50%',background:`${PIE_C[i]}22`,border:`1px solid ${PIE_C[i]}44`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,color:PIE_C[i],fontWeight:700,minWidth:20}}>{i+1}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:12}}>{c.name}</div>
                <div className="progress-bar" style={{marginTop:3}}><div className="progress-fill" style={{width:`${(c.ytd/topCus[0].ytd*100)}%`,background:PIE_C[i]}}/></div>
              </div>
              <span className="mono" style={{fontSize:12,fontWeight:600}}>{fmt$(c.ytd)}</span>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="hd" style={{fontSize:13,marginBottom:12}}>Inventory Health</div>
          {data.inventory.map(i=>{const pct=(i.qty/Math.max(i.reorder*2,1)*100);const low=i.qty<=i.reorder;return(
            <div key={i.id} style={{marginBottom:8}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:2}}>
                <span style={{fontSize:11}}>{i.name}</span>
                <span className="mono" style={{fontSize:10,color:low?'var(--warn)':'var(--muted)'}}>{i.qty} {i.unit}{low?' ⚠':''}</span>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{width:`${Math.min(100,pct)}%`,background:low?'var(--warn)':'var(--ok)'}}/></div>
            </div>
          );})}
        </div>
      </div>
    </div>
  );
};

// ─── FINANCE & P&L ────────────────────────────────────────────────────────────────
const Finance = ({data,setData}) => {
  const [tab,setTab]=useState('pnl');
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({});

  const latest=data.pnlMonthly[data.pnlMonthly.length-1]||{};
  const ytdRev=data.pnlMonthly.reduce((a,b)=>a+b.revenue,0);
  const ytdEbitda=data.pnlMonthly.reduce((a,b)=>a+b.ebitda,0);
  const avgMargin=ytdRev?Math.round((ytdEbitda/ytdRev)*100):0;

  const saveMonth=()=>{
    if(!data.pnlMonthly.find(m=>m.month===form.month))setData(d=>({...d,pnlMonthly:[...d.pnlMonthly,{...form,revenue:Number(form.revenue),cogs:Number(form.cogs),gross:Number(form.revenue)-Number(form.cogs),overhead:Number(form.overhead),ebitda:Number(form.revenue)-Number(form.cogs)-Number(form.overhead)}]}));
    else setData(d=>({...d,pnlMonthly:d.pnlMonthly.map(m=>m.month===form.month?{...form,revenue:Number(form.revenue),cogs:Number(form.cogs),gross:Number(form.revenue)-Number(form.cogs),overhead:Number(form.overhead),ebitda:Number(form.revenue)-Number(form.cogs)-Number(form.overhead)}:m)}));
    setModal(null);
  };
  const saveLR=()=>{
    if(!data.laborRates.find(r=>r.id===form.id))setData(d=>({...d,laborRates:[...d.laborRates,{...form,rateHr:Number(form.rateHr),overtime:Number(form.overtime),burden:Number(form.burden)}]}));
    else setData(d=>({...d,laborRates:d.laborRates.map(r=>r.id===form.id?{...form,rateHr:Number(form.rateHr),overtime:Number(form.overtime),burden:Number(form.burden)}:r)}));
    setModal(null);
  };
  const saveCS=()=>{
    setData(d=>({...d,costPerStation:d.costPerStation.map(s=>s.station===form.station?{...form,laborHrAvg:Number(form.laborHrAvg),setupMin:Number(form.setupMin),cycleMin:Number(form.cycleMin),laborCostUnit:Number(form.laborCostUnit)}:s)}));
    setModal(null);
  };

  return(
    <div className="fade-up">
      <div className="section-hd">
        <div><div className="hd" style={{fontSize:22}}>Finance & P&L</div>
          <div style={{display:'flex',gap:6,marginTop:5}}>
            <span className="chip">YTD {fmt$(ytdRev)}</span>
            <span className="chip" style={{color:'var(--ok)'}}>{avgMargin}% EBITDA margin</span>
          </div>
        </div>
        {tab==='pnl'&&<button className="btn btn-p" onClick={()=>{setForm({month:'',revenue:0,cogs:0,overhead:0});setModal('month');}}>+ Add Month</button>}
        {tab==='labor'&&<button className="btn btn-p" onClick={()=>{setForm({id:`LR-${uid()}`,role:'',level:'',rateHr:0,overtime:0,burden:1.28,notes:''});setModal('lr');}}>+ Add Rate</button>}
      </div>
      <div style={{display:'flex',gap:6,marginBottom:14}}>
        {['pnl','labor','stations'].map(t=><button key={t} className={`tab${tab===t?' on':''}`} onClick={()=>setTab(t)}>{t==='pnl'?'P&L':t==='labor'?'Labor Rates':'Station Costs'}</button>)}
      </div>

      {tab==='pnl'&&<>
        <div className="grid4" style={{marginBottom:16}}>
          {[
            {l:'YTD Revenue',v:fmt$(ytdRev),c:'var(--acc)'},
            {l:'YTD COGS',v:fmt$(data.pnlMonthly.reduce((a,b)=>a+b.cogs,0)),c:'var(--err)'},
            {l:'YTD EBITDA',v:fmt$(ytdEbitda),c:'var(--ok)'},
            {l:'EBITDA Margin',v:`${avgMargin}%`,c:avgMargin>20?'var(--ok)':avgMargin>10?'var(--warn)':'var(--err)'},
          ].map(s=><div className="stat-card" key={s.l}><div style={{fontSize:9,fontFamily:'Barlow Condensed',fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>{s.l}</div><div className="mono hd" style={{fontSize:20,color:s.c}}>{s.v}</div></div>)}
        </div>
        <div className="card" style={{marginBottom:16}}>
          <div style={{fontFamily:'Barlow Condensed',fontWeight:700,fontSize:13,marginBottom:14}}>Monthly P&L Trend</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={data.pnlMonthly} margin={{top:0,right:0,bottom:0,left:-18}}>
              <XAxis dataKey="month" tick={{fill:'#4a5070',fontSize:9}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:'#4a5070',fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
              <Tooltip contentStyle={{background:'var(--s1)',border:'1px solid var(--bdr2)',borderRadius:6,fontSize:11}} formatter={v=>[fmt$(v)]}/>
              <Area type="monotone" dataKey="revenue" stroke="#00e5ff" fill="rgba(0,229,255,.06)" strokeWidth={2} name="Revenue"/>
              <Area type="monotone" dataKey="gross" stroke="#f59e0b" fill="rgba(245,158,11,.06)" strokeWidth={2} name="Gross Profit"/>
              <Area type="monotone" dataKey="ebitda" stroke="#10b981" fill="rgba(16,185,129,.1)" strokeWidth={2} name="EBITDA"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card" style={{padding:0,overflow:'hidden'}}>
          <table><thead><tr><th>Month</th><th>Revenue</th><th>COGS</th><th>Gross Profit</th><th>Overhead</th><th>EBITDA</th><th>Margin</th><th/></tr></thead>
            <tbody>{data.pnlMonthly.map(m=>(
              <tr key={m.month}>
                <td className="hd">{m.month}</td>
                <td className="mono">{fmt$(m.revenue)}</td>
                <td className="mono" style={{color:'var(--muted)'}}>{fmt$(m.cogs)}</td>
                <td className="mono">{fmt$(m.gross)}</td>
                <td className="mono" style={{color:'var(--muted)'}}>{fmt$(m.overhead)}</td>
                <td className="mono" style={{color:'var(--ok)',fontWeight:600}}>{fmt$(m.ebitda)}</td>
                <td className="mono" style={{color:m.revenue?m.ebitda/m.revenue>.2?'var(--ok)':m.ebitda/m.revenue>.1?'var(--warn)':'var(--err)':'var(--muted)'}}>{m.revenue?Math.round((m.ebitda/m.revenue)*100):0}%</td>
                <td><button className="btn btn-g btn-xs" onClick={()=>{setForm({...m});setModal('month');}}>Edit</button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </>}

      {tab==='labor'&&<div className="card" style={{padding:0,overflow:'hidden'}}>
        <table><thead><tr><th>Role</th><th>Level</th><th>Base $/hr</th><th>OT $/hr</th><th>Burden Rate</th><th>Burdened $/hr</th><th>Notes</th><th/></tr></thead>
          <tbody>{data.laborRates.map(r=>(
            <tr key={r.id}>
              <td style={{fontWeight:500}}>{r.role}</td>
              <td><span className="chip">{r.level}</span></td>
              <td className="mono" style={{color:'var(--ok)'}}>{fmt$(r.rateHr)}</td>
              <td className="mono">{fmt$(r.overtime)}</td>
              <td className="mono">{r.burden}×</td>
              <td className="mono" style={{color:'var(--acc)',fontWeight:600}}>{fmt$(r.rateHr*r.burden)}</td>
              <td style={{fontSize:11,color:'var(--muted)'}}>{r.notes}</td>
              <td><div style={{display:'flex',gap:4}}>
                <button className="btn btn-g btn-xs" onClick={()=>{setForm({...r});setModal('lr');}}>Edit</button>
                <button className="btn btn-d btn-xs" onClick={()=>setData(d=>({...d,laborRates:d.laborRates.filter(x=>x.id!==r.id)}))}>×</button>
              </div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>}

      {tab==='stations'&&<div className="card" style={{padding:0,overflow:'hidden'}}>
        <table><thead><tr><th>Station</th><th>Avg Labor Hrs</th><th>Setup (min)</th><th>Cycle (min)</th><th>Labor Cost/Unit</th><th>Notes</th><th/></tr></thead>
          <tbody>{data.costPerStation.map(s=>(
            <tr key={s.station}>
              <td style={{fontWeight:600}}>{s.station}</td>
              <td className="mono">{s.laborHrAvg}</td>
              <td className="mono">{s.setupMin}</td>
              <td className="mono">{s.cycleMin}</td>
              <td className="mono" style={{color:'var(--warn)',fontWeight:600}}>{fmt$(s.laborCostUnit)}</td>
              <td style={{fontSize:11,color:'var(--muted)'}}>{s.notes}</td>
              <td><button className="btn btn-g btn-xs" onClick={()=>{setForm({...s});setModal('cs');}}>Edit</button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>}

      {modal==='month'&&<Modal title="P&L Month" onClose={()=>setModal(null)}>
        <Field label="Month (e.g. Apr 26)"><input value={form.month||''} onChange={e=>setForm(f=>({...f,month:e.target.value}))}/></Field>
        <div className="grid2">
          <Field label="Revenue ($)"><input type="number" value={form.revenue||0} onChange={e=>setForm(f=>({...f,revenue:e.target.value}))}/></Field>
          <Field label="COGS ($)"><input type="number" value={form.cogs||0} onChange={e=>setForm(f=>({...f,cogs:e.target.value}))}/></Field>
        </div>
        <Field label="Overhead ($)"><input type="number" value={form.overhead||0} onChange={e=>setForm(f=>({...f,overhead:e.target.value}))}/></Field>
        <div style={{padding:'8px 12px',background:'var(--s2)',borderRadius:5,fontSize:12,color:'var(--ok)',marginBottom:12}}>EBITDA = Revenue − COGS − Overhead = {fmt$(Number(form.revenue||0)-Number(form.cogs||0)-Number(form.overhead||0))}</div>
        <div style={{display:'flex',gap:8}}><button className="btn btn-p" onClick={saveMonth}>Save</button><button className="btn btn-g" onClick={()=>setModal(null)}>Cancel</button></div>
      </Modal>}
      {modal==='lr'&&<Modal title="Labor Rate" onClose={()=>setModal(null)}>
        <Field label="Role"><input value={form.role||''} onChange={e=>setForm(f=>({...f,role:e.target.value}))}/></Field>
        <div className="grid2">
          <Field label="Level"><input value={form.level||''} onChange={e=>setForm(f=>({...f,level:e.target.value}))}/></Field>
          <Field label="Burden Rate (e.g. 1.28)"><input type="number" step=".01" value={form.burden||1.28} onChange={e=>setForm(f=>({...f,burden:e.target.value}))}/></Field>
        </div>
        <div className="grid2">
          <Field label="Base $/hr"><input type="number" step=".50" value={form.rateHr||0} onChange={e=>setForm(f=>({...f,rateHr:e.target.value}))}/></Field>
          <Field label="OT $/hr"><input type="number" step=".50" value={form.overtime||0} onChange={e=>setForm(f=>({...f,overtime:e.target.value}))}/></Field>
        </div>
        <Field label="Notes"><input value={form.notes||''} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/></Field>
        <div style={{display:'flex',gap:8,marginTop:10}}><button className="btn btn-p" onClick={saveLR}>Save</button><button className="btn btn-g" onClick={()=>setModal(null)}>Cancel</button></div>
      </Modal>}
      {modal==='cs'&&<Modal title="Station Cost" onClose={()=>setModal(null)}>
        <div className="grid2">
          <Field label="Avg Labor Hrs"><input type="number" step=".1" value={form.laborHrAvg||0} onChange={e=>setForm(f=>({...f,laborHrAvg:e.target.value}))}/></Field>
          <Field label="Setup (min)"><input type="number" value={form.setupMin||0} onChange={e=>setForm(f=>({...f,setupMin:e.target.value}))}/></Field>
        </div>
        <div className="grid2">
          <Field label="Cycle (min)"><input type="number" value={form.cycleMin||0} onChange={e=>setForm(f=>({...f,cycleMin:e.target.value}))}/></Field>
          <Field label="Labor Cost/Unit ($)"><input type="number" step=".01" value={form.laborCostUnit||0} onChange={e=>setForm(f=>({...f,laborCostUnit:e.target.value}))}/></Field>
        </div>
        <Field label="Notes"><input value={form.notes||''} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/></Field>
        <div style={{display:'flex',gap:8,marginTop:10}}><button className="btn btn-p" onClick={saveCS}>Save</button><button className="btn btn-g" onClick={()=>setModal(null)}>Cancel</button></div>
      </Modal>}
    </div>
  );
};

// ─── PEOPLE & HR ─────────────────────────────────────────────────────────────────
const STATIONS_ALL = ['CNC Cut','CNC Drill','Welding','Powder Coat','Assembly','QC Inspection','Packaging'];
const SKILL_LEVELS = [{v:0,label:'—',bg:'var(--dim)',fg:'var(--muted)'},{v:1,label:'T',bg:'rgba(245,158,11,.2)',fg:'var(--warn)'},{v:2,label:'✓',bg:'rgba(59,130,246,.2)',fg:'var(--info)'},{v:3,label:'★',bg:'rgba(16,185,129,.2)',fg:'var(--ok)'}];

const People = ({data,setData,user}) => {
  const [tab,setTab]=useState('employees');
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({});

  const saveEmp=()=>{
    if(!data.employees.find(e=>e.id===form.id))setData(d=>({...d,employees:[...d.employees,{...form,rateHr:Number(form.rateHr)}]}));
    else setData(d=>({...d,employees:d.employees.map(e=>e.id===form.id?{...form,rateHr:Number(form.rateHr)}:e)}));
    setModal(null);
  };
  const delEmp=id=>setData(d=>({...d,employees:d.employees.filter(e=>e.id!==id)}));

  const getSkill=(empId,station)=>{
    const tm=data.trainingMatrix.find(t=>t.empId===empId&&t.station===station);
    return tm?tm.level:0;
  };
  const cycleSkill=(empId,station)=>{
    const cur=getSkill(empId,station);
    const next=(cur+1)%4;
    const existing=data.trainingMatrix.find(t=>t.empId===empId&&t.station===station);
    if(existing){
      setData(d=>({...d,trainingMatrix:next===0?d.trainingMatrix.filter(t=>!(t.empId===empId&&t.station===station)):d.trainingMatrix.map(t=>t.empId===empId&&t.station===station?{...t,level:next}:t)}));
    } else {
      setData(d=>({...d,trainingMatrix:[...d.trainingMatrix,{empId,station,level:next}]}));
    }
  };

  const savePos=()=>{
    if(!data.openPositions.find(p=>p.id===form.id))setData(d=>({...d,openPositions:[...d.openPositions,form]}));
    else setData(d=>({...d,openPositions:d.openPositions.map(p=>p.id===form.id?form:p)}));
    setModal(null);
  };
  const saveDisc=()=>{
    if(!data.disciplineLog.find(d=>d.id===form.id))setData(d=>({...d,disciplineLog:[...d.disciplineLog,form]}));
    else setData(d=>({...d,disciplineLog:d.disciplineLog.map(x=>x.id===form.id?form:x)}));
    setModal(null);
  };

  const activeEmp=data.employees.filter(e=>e.status==='Active');

  return(
    <div className="fade-up">
      <div className="section-hd">
        <div><div className="hd" style={{fontSize:22}}>People & HR</div>
          <div style={{display:'flex',gap:6,marginTop:5}}>
            <span className="chip">{activeEmp.length} active employees</span>
            <span className="chip" style={{color:'var(--warn)'}}>{data.openPositions.filter(p=>p.status==='Open').length} open positions</span>
          </div>
        </div>
        {tab==='employees'&&<button className="btn btn-p" onClick={()=>{setForm({id:`EMP-${uid()}`,name:'',role:'',dept:'Production',hire:now(),status:'Active',rateHr:20,email:'',phone:'',notes:''});setModal('emp');}}>+ Add Employee</button>}
        {tab==='positions'&&<button className="btn btn-p" onClick={()=>{setForm({id:`POS-${uid()}`,title:'',dept:'Production',priority:'Medium',status:'Open',posted:now(),notes:''});setModal('pos');}}>+ Add Position</button>}
        {tab==='discipline'&&<button className="btn btn-p" onClick={()=>{setForm({id:`DIS-${uid()}`,empId:'',empName:'',type:'Verbal Warning',date:now(),issue:'',action:'',issuedBy:'Daniel Jones'});setModal('disc');}}>+ Add Entry</button>}
      </div>
      <div style={{display:'flex',gap:6,marginBottom:14}}>
        {['employees','training','positions','discipline'].map(t=><button key={t} className={`tab${tab===t?' on':''}`} onClick={()=>setTab(t)} style={{textTransform:'capitalize'}}>{t}</button>)}
      </div>

      {tab==='employees'&&<div className="card" style={{padding:0,overflow:'hidden'}}>
        <table><thead><tr><th>Name</th><th>Role</th><th>Dept</th><th>Hire Date</th><th>$/hr</th><th>Status</th><th>Contact</th><th/></tr></thead>
          <tbody>{data.employees.map(e=>(
            <tr key={e.id}>
              <td style={{fontWeight:600}}>{e.name}</td>
              <td>{e.role}</td>
              <td><span className="chip">{e.dept}</span></td>
              <td style={{color:'var(--muted)',fontSize:11}}>{fmtD(e.hire)}</td>
              <td className="mono" style={{color:'var(--ok)'}}>{fmt$(e.rateHr)}</td>
              <td><Badge s={e.status}/></td>
              <td style={{fontSize:11}}>{e.email||'—'}</td>
              <td><div style={{display:'flex',gap:4}}>
                <button className="btn btn-g btn-xs" onClick={()=>{setForm({...e});setModal('emp');}}>Edit</button>
                <button className="btn btn-d btn-xs" onClick={()=>delEmp(e.id)}>×</button>
              </div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>}

      {tab==='training'&&<div>
        <div className="alert-bar alert-info" style={{marginBottom:14}}><span style={{color:'var(--info)'}}>ℹ</span> Click any cell to cycle skill level: — → T (Trainee) → ✓ (Capable) → ★ (Expert) → —</div>
        <div className="card" style={{overflowX:'auto',padding:0}}>
          <table className="ref-table">
            <thead><tr>
              <th style={{minWidth:140}}>Employee</th>
              {STATIONS_ALL.map(s=><th key={s} style={{textAlign:'center',minWidth:80}}>{s}</th>)}
            </tr></thead>
            <tbody>{activeEmp.map(e=>(
              <tr key={e.id}>
                <td style={{fontWeight:600,fontSize:12}}>{e.name}</td>
                {STATIONS_ALL.map(s=>{
                  const lvl=getSkill(e.id,s);
                  const sl=SKILL_LEVELS[lvl];
                  return(
                    <td key={s} style={{textAlign:'center'}}>
                      <button className="skill-cell" style={{background:sl.bg,color:sl.fg}} onClick={()=>cycleSkill(e.id,s)} title={`${e.name} · ${s} · Click to change`}>{sl.label}</button>
                    </td>
                  );
                })}
              </tr>
            ))}</tbody>
          </table>
        </div>
        <div style={{display:'flex',gap:12,marginTop:12}}>
          {SKILL_LEVELS.map(sl=><div key={sl.v} style={{display:'flex',alignItems:'center',gap:6}}><span className="skill-cell" style={{background:sl.bg,color:sl.fg,width:26,height:26,display:'inline-flex',alignItems:'center',justifyContent:'center',borderRadius:4,fontSize:11,fontWeight:700}}>{sl.label}</span><span style={{fontSize:11,color:'var(--muted)'}}>{sl.v===0?'No training':sl.v===1?'Trainee':sl.v===2?'Capable':'Expert'}</span></div>)}
        </div>
      </div>}

      {tab==='positions'&&<div className="card" style={{padding:0,overflow:'hidden'}}>
        <table><thead><tr><th>Position</th><th>Dept</th><th>Priority</th><th>Status</th><th>Posted</th><th>Notes</th><th/></tr></thead>
          <tbody>{data.openPositions.map(p=>(
            <tr key={p.id}>
              <td style={{fontWeight:600}}>{p.title}</td>
              <td><span className="chip">{p.dept}</span></td>
              <td><Badge s={p.priority}/></td>
              <td><Badge s={p.status}/></td>
              <td style={{color:'var(--muted)',fontSize:11}}>{fmtD(p.posted)}</td>
              <td style={{fontSize:11,color:'var(--muted)',maxWidth:200}}>{p.notes}</td>
              <td><div style={{display:'flex',gap:4}}>
                <button className="btn btn-g btn-xs" onClick={()=>{setForm({...p});setModal('pos');}}>Edit</button>
                <button className="btn btn-d btn-xs" onClick={()=>setData(d=>({...d,openPositions:d.openPositions.filter(x=>x.id!==p.id)}))}>×</button>
              </div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>}

      {tab==='discipline'&&<div>
        <div className="alert-bar alert-warn"><span style={{color:'var(--warn)'}}>⚠</span> Disciplinary records are confidential — admin access only.</div>
        <div className="card" style={{padding:0,overflow:'hidden'}}>
          <table><thead><tr><th>Employee</th><th>Type</th><th>Date</th><th>Issue</th><th>Action Taken</th><th>Issued By</th><th/></tr></thead>
            <tbody>{data.disciplineLog.length===0&&<tr><td colSpan={7}><Empty/></td></tr>}
              {data.disciplineLog.map(d=>(
                <tr key={d.id}>
                  <td style={{fontWeight:600}}>{d.empName}</td>
                  <td><Badge s={d.type}/></td>
                  <td style={{color:'var(--muted)',fontSize:11}}>{fmtD(d.date)}</td>
                  <td style={{maxWidth:180,fontSize:11}}>{d.issue}</td>
                  <td style={{maxWidth:180,fontSize:11}}>{d.action}</td>
                  <td style={{fontSize:11,color:'var(--muted)'}}>{d.issuedBy}</td>
                  <td><div style={{display:'flex',gap:4}}>
                    <button className="btn btn-g btn-xs" onClick={()=>{setForm({...d});setModal('disc');}}>Edit</button>
                    <button className="btn btn-d btn-xs" onClick={()=>setData(dt=>({...dt,disciplineLog:dt.disciplineLog.filter(x=>x.id!==d.id)}))}>×</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>}

      {modal==='emp'&&<Modal title={data.employees.find(e=>e.id===form.id)?'Edit Employee':'Add Employee'} onClose={()=>setModal(null)}>
        <div className="grid2"><Field label="Full Name"><input value={form.name||''} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></Field>
        <Field label="Role"><input value={form.role||''} onChange={e=>setForm(f=>({...f,role:e.target.value}))}/></Field></div>
        <div className="grid2"><Field label="Department"><input value={form.dept||''} onChange={e=>setForm(f=>({...f,dept:e.target.value}))}/></Field>
        <Field label="Status"><select value={form.status||'Active'} onChange={e=>setForm(f=>({...f,status:e.target.value}))}><option>Active</option><option>Inactive</option><option>On Leave</option></select></Field></div>
        <div className="grid2"><Field label="Hire Date"><input type="date" value={form.hire||''} onChange={e=>setForm(f=>({...f,hire:e.target.value}))}/></Field>
        <Field label="Base $/hr"><input type="number" step=".50" value={form.rateHr||0} onChange={e=>setForm(f=>({...f,rateHr:e.target.value}))}/></Field></div>
        <div className="grid2"><Field label="Email"><input value={form.email||''} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/></Field>
        <Field label="Phone"><input value={form.phone||''} onChange={e=>setForm(f=>({...f,phone:e.target.value}))}/></Field></div>
        <Field label="Notes"><textarea rows={2} value={form.notes||''} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/></Field>
        <div style={{display:'flex',gap:8,marginTop:10}}><button className="btn btn-p" onClick={saveEmp}>Save</button><button className="btn btn-g" onClick={()=>setModal(null)}>Cancel</button></div>
      </Modal>}
      {modal==='pos'&&<Modal title="Open Position" onClose={()=>setModal(null)}>
        <Field label="Job Title"><input value={form.title||''} onChange={e=>setForm(f=>({...f,title:e.target.value}))}/></Field>
        <div className="grid2"><Field label="Department"><input value={form.dept||''} onChange={e=>setForm(f=>({...f,dept:e.target.value}))}/></Field>
        <Field label="Priority"><select value={form.priority||'Medium'} onChange={e=>setForm(f=>({...f,priority:e.target.value}))}><option>Critical</option><option>High</option><option>Medium</option><option>Low</option></select></Field></div>
        <div className="grid2"><Field label="Status"><select value={form.status||'Open'} onChange={e=>setForm(f=>({...f,status:e.target.value}))}><option>Open</option><option>Interviewing</option><option>Filled</option><option>On Hold</option></select></Field>
        <Field label="Posted Date"><input type="date" value={form.posted||''} onChange={e=>setForm(f=>({...f,posted:e.target.value}))}/></Field></div>
        <Field label="Notes / Requirements"><textarea rows={2} value={form.notes||''} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/></Field>
        <div style={{display:'flex',gap:8,marginTop:10}}><button className="btn btn-p" onClick={savePos}>Save</button><button className="btn btn-g" onClick={()=>setModal(null)}>Cancel</button></div>
      </Modal>}
      {modal==='disc'&&<Modal title="Disciplinary Entry" onClose={()=>setModal(null)}>
        <div className="grid2">
          <Field label="Employee"><select value={form.empId||''} onChange={e=>{const emp=data.employees.find(x=>x.id===e.target.value);setForm(f=>({...f,empId:e.target.value,empName:emp?.name||''}));}}>
            <option value="">— Select —</option>{data.employees.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}</select></Field>
          <Field label="Type"><select value={form.type||'Verbal Warning'} onChange={e=>setForm(f=>({...f,type:e.target.value}))}><option>Verbal Warning</option><option>Written Warning</option><option>Final Warning</option><option>Suspension</option><option>Termination</option><option>Performance Plan</option></select></Field>
        </div>
        <Field label="Date"><input type="date" value={form.date||''} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/></Field>
        <Field label="Issue Description"><textarea rows={2} value={form.issue||''} onChange={e=>setForm(f=>({...f,issue:e.target.value}))}/></Field>
        <Field label="Action Taken / Resolution"><textarea rows={2} value={form.action||''} onChange={e=>setForm(f=>({...f,action:e.target.value}))}/></Field>
        <Field label="Issued By"><input value={form.issuedBy||''} onChange={e=>setForm(f=>({...f,issuedBy:e.target.value}))}/></Field>
        <div style={{display:'flex',gap:8,marginTop:10}}><button className="btn btn-p" onClick={saveDisc}>Save</button><button className="btn btn-g" onClick={()=>setModal(null)}>Cancel</button></div>
      </Modal>}
    </div>
  );
};

// ─── AUTOMATION ROADMAP ──────────────────────────────────────────────────────────
const Automation = ({data,setData}) => {
  const [expanded,setExpanded]=useState({});
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({});

  const toggle=id=>setExpanded(e=>({...e,[id]:!e[id]}));
  const totalBudget=data.automationPhases.reduce((a,b)=>a+b.budget,0);
  const totalSpent=data.automationPhases.reduce((a,b)=>a+(b.budget*(b.completion/100)),0);
  const overallPct=Math.round(data.automationPhases.reduce((a,b)=>a+(b.completion*(b.budget/totalBudget)),0));

  const updatePhase=(id,field,val)=>{
    setData(d=>({...d,automationPhases:d.automationPhases.map(p=>p.id===id?{...p,[field]:field==='completion'||field==='budget'?Number(val):val}:p)}));
  };
  const updateItem=(phaseId,itemId,field,val)=>{
    setData(d=>({...d,automationPhases:d.automationPhases.map(p=>p.id===phaseId?{...p,items:p.items.map(i=>i.id===itemId?{...i,[field]:field==='cost'?Number(val):val}:i)}:p)}));
  };

  const phaseColor={
    'In Progress':'var(--acc)','Planning':'var(--warn)','Not Started':'var(--dim)','Complete':'var(--ok)'
  };

  return(
    <div className="fade-up">
      <div className="section-hd">
        <div><div className="hd" style={{fontSize:22}}>Automation Roadmap</div>
          <div style={{display:'flex',gap:6,marginTop:5}}>
            <span className="chip">{fmt$(totalBudget)} total budget</span>
            <span className="chip" style={{color:'var(--ok)'}}>{overallPct}% overall progress</span>
          </div>
        </div>
      </div>

      <div className="card" style={{marginBottom:16}}>
        <div style={{fontFamily:'Barlow Condensed',fontWeight:700,fontSize:13,marginBottom:12}}>5-Phase Progress Overview</div>
        <div className="progress-bar" style={{height:10,marginBottom:12}}>
          <div className="progress-fill" style={{width:`${overallPct}%`,background:'linear-gradient(90deg,var(--acc),var(--ok))'}}/>
        </div>
        <div className="grid4">
          {[
            {l:'Total Budget',v:fmt$(totalBudget),c:'var(--txt)'},
            {l:'Deployed',v:fmt$(totalSpent),c:'var(--warn)'},
            {l:'Remaining',v:fmt$(totalBudget-totalSpent),c:'var(--acc)'},
            {l:'Target',v:'Lights-Out by Month 30',c:'var(--ok)'},
          ].map(s=><div key={s.l}><div style={{fontSize:9,fontFamily:'Barlow Condensed',fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--muted)',marginBottom:4}}>{s.l}</div><div style={{fontSize:14,fontWeight:700,color:s.c}}>{s.v}</div></div>)}
        </div>
      </div>

      {data.automationPhases.map(ph=>(
        <div key={ph.id} style={{background:'var(--s1)',border:`1px solid ${ph.status==='In Progress'?'rgba(0,229,255,.2)':'var(--bdr)'}`,borderRadius:8,marginBottom:12,overflow:'hidden'}}>
          <div style={{padding:'14px 18px',cursor:'pointer',display:'flex',alignItems:'center',gap:12}} onClick={()=>toggle(ph.id)}>
            <div style={{width:32,height:32,borderRadius:8,background:`${phaseColor[ph.status]}22`,border:`1px solid ${phaseColor[ph.status]}44`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <span style={{fontFamily:'Barlow Condensed',fontSize:16,fontWeight:900,color:phaseColor[ph.status]}}>{ph.phase}</span>
            </div>
            <div style={{flex:1}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                <span style={{fontWeight:700,fontSize:14}}>Phase {ph.phase}: {ph.title}</span>
                <Badge s={ph.status}/>
                <span style={{fontSize:10,color:'var(--muted)'}}>{ph.months} months</span>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <div className="progress-bar" style={{flex:1,height:4}}>
                  <div className="progress-fill" style={{width:`${ph.completion}%`,background:phaseColor[ph.status]}}/>
                </div>
                <span style={{fontSize:11,color:'var(--muted)',whiteSpace:'nowrap'}}>{ph.completion}% · {fmt$(ph.budget)}</span>
              </div>
            </div>
            <span style={{fontSize:16,color:'var(--muted)',transform:expanded[ph.id]?'rotate(180deg)':'none',transition:'transform .2s'}}>▾</span>
          </div>
          {expanded[ph.id]&&<div style={{borderTop:'1px solid var(--bdr)',padding:'14px 18px'}}>
            <div className="grid2" style={{marginBottom:14}}>
              <Field label="Status">
                <select value={ph.status} onChange={e=>updatePhase(ph.id,'status',e.target.value)}>
                  {['Planning','In Progress','On Hold','Complete','Not Started'].map(s=><option key={s}>{s}</option>)}
                </select>
              </Field>
              <div>
                <label>Completion % — {ph.completion}%</label>
                <input type="range" min={0} max={100} value={ph.completion} onChange={e=>updatePhase(ph.id,'completion',e.target.value)} style={{width:'100%',marginTop:8}}/>
              </div>
            </div>
            <div style={{fontFamily:'Barlow Condensed',fontWeight:700,fontSize:12,letterSpacing:'.1em',marginBottom:8,color:'var(--muted)'}}>LINE ITEMS</div>
            {ph.items.map(item=>(
              <div key={item.id} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 10px',background:'var(--s2)',borderRadius:5,marginBottom:5}}>
                <span style={{fontSize:11,flex:1}}>{item.task}</span>
                <span className="mono" style={{fontSize:11,color:'var(--muted)',whiteSpace:'nowrap'}}>{fmt$(item.cost)}</span>
                <select value={item.status} onChange={e=>updateItem(ph.id,item.id,'status',e.target.value)} style={{width:120,fontSize:11,padding:'3px 6px'}}>
                  {['Planned','In Progress','Done','On Hold','Cancelled'].map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
            ))}
          </div>}
        </div>
      ))}
    </div>
  );
};

// ─── SISTER COMPANY ───────────────────────────────────────────────────────────────
const Sister = ({data,setData}) => {
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({});
  const [tab,setTab]=useState('orders');

  const totalOrderValue=data.sisterOrders.reduce((a,b)=>a+b.value,0);
  const totalLaborCost=data.sisterLabor.reduce((a,b)=>a+b.billable,0);
  const netDue=totalOrderValue-totalLaborCost;

  const saveOrder=()=>{
    if(!data.sisterOrders.find(o=>o.id===form.id))setData(d=>({...d,sisterOrders:[...d.sisterOrders,{...form,value:Number(form.value)}]}));
    else setData(d=>({...d,sisterOrders:d.sisterOrders.map(o=>o.id===form.id?{...form,value:Number(form.value)}:o)}));
    setModal(null);
  };
  const saveLabor=()=>{
    if(!data.sisterLabor.find(l=>l.id===form.id))setData(d=>({...d,sisterLabor:[...d.sisterLabor,{...form,hrs:Number(form.hrs),rate:Number(form.rate),billable:Number(form.hrs)*Number(form.rate)}]}));
    else setData(d=>({...d,sisterLabor:d.sisterLabor.map(l=>l.id===form.id?{...form,hrs:Number(form.hrs),rate:Number(form.rate),billable:Number(form.hrs)*Number(form.rate)}:l)}));
    setModal(null);
  };

  return(
    <div className="fade-up">
      <div className="section-hd">
        <div><div className="hd" style={{fontSize:22}}>Sister Company</div>
          <div style={{display:'flex',gap:6,marginTop:5}}>
            <span className="chip">Orders: {fmt$(totalOrderValue)}</span>
            <span className="chip" style={{color:'var(--warn)'}}>Labor: {fmt$(totalLaborCost)}</span>
            <span className="chip" style={{color:netDue>0?'var(--ok)':'var(--err)'}}>Net: {fmt$(netDue)}</span>
          </div>
        </div>
        <button className="btn btn-p" onClick={()=>{if(tab==='orders')setForm({id:`SIS-${uid()}`,description:'',value:0,date:now(),status:'Pending',notes:''});else setForm({id:`SLB-${uid()}`,empName:'',hrs:0,date:now(),rate:28,task:'',billable:0});setModal(tab==='orders'?'order':'labor');}}>+ New {tab==='orders'?'Order':'Labor Entry'}</button>
      </div>
      <div className="grid3" style={{marginBottom:16}}>
        {[
          {l:'Total Order Value',v:fmt$(totalOrderValue),c:'var(--acc)'},
          {l:'Total Labor Billed',v:fmt$(totalLaborCost),c:'var(--warn)'},
          {l:'Net Receivable',v:fmt$(netDue),c:netDue>0?'var(--ok)':'var(--err)'},
        ].map(s=><div className="stat-card" key={s.l}><div style={{fontSize:9,fontFamily:'Barlow Condensed',fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>{s.l}</div><div className="mono hd" style={{fontSize:22,color:s.c}}>{s.v}</div></div>)}
      </div>
      <div style={{display:'flex',gap:6,marginBottom:14}}>
        {['orders','labor'].map(t=><button key={t} className={`tab${tab===t?' on':''}`} onClick={()=>setTab(t)} style={{textTransform:'capitalize'}}>{t==='orders'?'Order Fulfillment':'Borrowed Labor'}</button>)}
      </div>

      {tab==='orders'&&<div className="card" style={{padding:0,overflow:'hidden'}}>
        <table><thead><tr><th>ID</th><th>Description</th><th>Value</th><th>Date</th><th>Status</th><th>Notes</th><th/></tr></thead>
          <tbody>{data.sisterOrders.map(o=>(
            <tr key={o.id}>
              <td className="mono" style={{fontSize:11,color:'var(--acc)'}}>{o.id}</td>
              <td style={{fontWeight:500}}>{o.description}</td>
              <td className="mono" style={{color:'var(--ok)'}}>{fmt$(o.value)}</td>
              <td style={{color:'var(--muted)',fontSize:11}}>{fmtD(o.date)}</td>
              <td><Badge s={o.status}/></td>
              <td style={{fontSize:11,color:'var(--muted)'}}>{o.notes}</td>
              <td><div style={{display:'flex',gap:4}}>
                <button className="btn btn-g btn-xs" onClick={()=>{setForm({...o});setModal('order');}}>Edit</button>
                <button className="btn btn-d btn-xs" onClick={()=>setData(d=>({...d,sisterOrders:d.sisterOrders.filter(x=>x.id!==o.id)}))}>×</button>
              </div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>}

      {tab==='labor'&&<div className="card" style={{padding:0,overflow:'hidden'}}>
        <table><thead><tr><th>Employee</th><th>Date</th><th>Hours</th><th>Rate $/hr</th><th>Billable</th><th>Task</th><th/></tr></thead>
          <tbody>{data.sisterLabor.map(l=>(
            <tr key={l.id}>
              <td style={{fontWeight:500}}>{l.empName}</td>
              <td style={{color:'var(--muted)',fontSize:11}}>{fmtD(l.date)}</td>
              <td className="mono">{l.hrs}</td>
              <td className="mono">{fmt$(l.rate)}</td>
              <td className="mono" style={{color:'var(--warn)',fontWeight:600}}>{fmt$(l.billable)}</td>
              <td style={{fontSize:11,color:'var(--muted)'}}>{l.task}</td>
              <td><div style={{display:'flex',gap:4}}>
                <button className="btn btn-g btn-xs" onClick={()=>{setForm({...l});setModal('labor');}}>Edit</button>
                <button className="btn btn-d btn-xs" onClick={()=>setData(d=>({...d,sisterLabor:d.sisterLabor.filter(x=>x.id!==l.id)}))}>×</button>
              </div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>}

      {modal==='order'&&<Modal title="Sister Co Order" onClose={()=>setModal(null)}>
        <Field label="Description"><input value={form.description||''} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/></Field>
        <div className="grid2">
          <Field label="Value ($)"><input type="number" value={form.value||0} onChange={e=>setForm(f=>({...f,value:e.target.value}))}/></Field>
          <Field label="Date"><input type="date" value={form.date||''} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/></Field>
        </div>
        <Field label="Status"><select value={form.status||'Pending'} onChange={e=>setForm(f=>({...f,status:e.target.value}))}><option>Pending</option><option>In Progress</option><option>Completed</option><option>Invoiced</option><option>Paid</option></select></Field>
        <Field label="Notes"><textarea rows={2} value={form.notes||''} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/></Field>
        <div style={{display:'flex',gap:8,marginTop:10}}><button className="btn btn-p" onClick={saveOrder}>Save</button><button className="btn btn-g" onClick={()=>setModal(null)}>Cancel</button></div>
      </Modal>}
      {modal==='labor'&&<Modal title="Borrowed Labor Entry" onClose={()=>setModal(null)}>
        <div className="grid2">
          <Field label="Employee"><input value={form.empName||''} onChange={e=>setForm(f=>({...f,empName:e.target.value}))}/></Field>
          <Field label="Date"><input type="date" value={form.date||''} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/></Field>
        </div>
        <div className="grid2">
          <Field label="Hours"><input type="number" step=".5" value={form.hrs||0} onChange={e=>setForm(f=>({...f,hrs:e.target.value}))}/></Field>
          <Field label="Rate $/hr"><input type="number" step=".50" value={form.rate||28} onChange={e=>setForm(f=>({...f,rate:e.target.value}))}/></Field>
        </div>
        <Field label="Task Description"><input value={form.task||''} onChange={e=>setForm(f=>({...f,task:e.target.value}))}/></Field>
        <div style={{padding:'8px 12px',background:'var(--s2)',borderRadius:5,fontSize:12,color:'var(--ok)',marginBottom:12}}>Billable = {fmt$(Number(form.hrs||0)*Number(form.rate||0))}</div>
        <div style={{display:'flex',gap:8}}><button className="btn btn-p" onClick={saveLabor}>Save</button><button className="btn btn-g" onClick={()=>setModal(null)}>Cancel</button></div>
      </Modal>}
    </div>
  );
};

// ─── SHOP REFERENCE ──────────────────────────────────────────────────────────────
const SHOP_DATA = {
  fasteners:[
    {type:'Self-Tap Screw',size:'#8-32',diam:'0.164"',pitch:'32 tpi',head:'Pan/Flat',drive:'Phillips',material:'SS 316',use:'General aluminum attachment'},
    {type:'Self-Tap Screw',size:'#10-32',diam:'0.190"',pitch:'32 tpi',head:'Pan/Flat',drive:'Phillips',material:'SS 316',use:'Heavy-duty aluminum attachment'},
    {type:'Machine Bolt',size:'1/4"-20',diam:'0.250"',pitch:'20 tpi',head:'Hex',drive:'Hex Wrench',material:'SS 304',use:'Post base mounting'},
    {type:'Machine Bolt',size:'5/16"-18',diam:'0.312"',pitch:'18 tpi',head:'Hex',drive:'Hex Wrench',material:'SS 304',use:'Structural connections'},
    {type:'Lag Bolt',size:'3/8"-7',diam:'0.375"',pitch:'7 tpi',head:'Hex',drive:'Socket',material:'HDG Steel',use:'Deck ledger attachment'},
    {type:'Set Screw',size:'10-32',diam:'0.190"',pitch:'32 tpi',head:'Cup Point',drive:'Allen',material:'SS 316',use:'Cable tensioner lock'},
  ],
  drillSizes:[
    {size:'#7',decimal:'0.201"',mm:'5.10',use:'10-32 tap drill'},
    {size:'#29',decimal:'0.136"',mm:'3.45',use:'8-32 tap drill'},
    {size:'7/32"',decimal:'0.218"',mm:'5.56',use:'1/4"-20 clearance'},
    {size:'F',decimal:'0.257"',mm:'6.53',use:'1/4" through'},
    {size:'5/16"',decimal:'0.312"',mm:'7.94',use:'5/16" through'},
    {size:'3/8"',decimal:'0.375"',mm:'9.53',use:'3/8" through / lag pilot'},
    {size:'7/16"',decimal:'0.437"',mm:'11.11',use:'1/2" clearance'},
    {size:'1/2"',decimal:'0.500"',mm:'12.70',use:'Large clearance'},
  ],
  torqueSpecs:[
    {fastener:'10-32 SS Bolt',material:'6061 Aluminum',torqueInLb:'24–30',torqueFtLb:'2.0–2.5',notes:'Do not overtighten — strip risk'},
    {fastener:'1/4"-20 SS Bolt',material:'6061 Aluminum',torqueInLb:'55–65',torqueFtLb:'4.6–5.4',notes:'With SS washer'},
    {fastener:'5/16"-18 SS Bolt',material:'6061 Aluminum',torqueInLb:'115–130',torqueFtLb:'9.6–10.8',notes:'Structural use'},
    {fastener:'3/8"-7 Lag Bolt',material:'Pressure Treated',torqueInLb:'—',torqueFtLb:'25–30',notes:'Pre-drill required'},
    {fastener:'Cable Tensioner Set Screw',material:'Fitting Body',torqueInLb:'40–45',torqueFtLb:'3.3–3.75',notes:'Loctite 243 recommended'},
  ],
  tigSettings:[
    {material:'6061 Aluminum',thickness:'1/8"',ampRange:'80–100A',tungsten:'3/32" Pure/Zirconiated',filler:'4043 1/16"',gas:'100% Argon',cfh:'15–20',notes:'AC balance 70/30'},
    {material:'6061 Aluminum',thickness:'3/16"',ampRange:'130–160A',tungsten:'1/8" Pure/Zirconiated',filler:'4043 3/32"',gas:'100% Argon',cfh:'18–22',notes:'Pre-heat may help'},
    {material:'6061 Aluminum',thickness:'1/4"',ampRange:'180–220A',tungsten:'1/8" Pure/Zirconiated',filler:'4043 1/8"',gas:'100% Argon',cfh:'20–25',notes:'Multi-pass on thick sections'},
    {material:'SS 316',thickness:'1/8"',ampRange:'60–90A',tungsten:'2% Thoriated or Ceriated',filler:'316L 1/16"',gas:'Argon/2%N2',cfh:'12–18',notes:'DC- polarity'},
  ],
  aluminumAlloys:[
    {alloy:'6061-T6',tensile:'45 ksi',yield:'40 ksi',elongation:'12%',machinability:'Good',weldability:'Good',uses:'Posts, rails, structural tube — primary alloy used at Maisy'},
    {alloy:'6063-T5',tensile:'27 ksi',yield:'21 ksi',elongation:'12%',machinability:'Excellent',weldability:'Good',uses:'Architectural extrusions, handrail profile'},
    {alloy:'5052-H32',tensile:'33 ksi',yield:'28 ksi',elongation:'12%',machinability:'Fair',weldability:'Excellent',uses:'Sheet metal, backing plates'},
    {alloy:'2024-T3',tensile:'70 ksi',yield:'50 ksi',elongation:'18%',machinability:'Fair',weldability:'Poor',uses:'High-strength applications (NOT used for welded parts)'},
  ],
  fractionDecimal:[
    {frac:'1/64',dec:'0.015625',mm:'0.397'},{frac:'1/32',dec:'0.03125',mm:'0.794'},{frac:'3/64',dec:'0.046875',mm:'1.191'},
    {frac:'1/16',dec:'0.0625',mm:'1.588'},{frac:'5/64',dec:'0.078125',mm:'1.984'},{frac:'3/32',dec:'0.09375',mm:'2.381'},
    {frac:'7/64',dec:'0.109375',mm:'2.778'},{frac:'1/8',dec:'0.125',mm:'3.175'},{frac:'5/32',dec:'0.15625',mm:'3.969'},
    {frac:'3/16',dec:'0.1875',mm:'4.763'},{frac:'7/32',dec:'0.21875',mm:'5.556'},{frac:'1/4',dec:'0.25',mm:'6.350'},
    {frac:'9/32',dec:'0.28125',mm:'7.144'},{frac:'5/16',dec:'0.3125',mm:'7.938'},{frac:'11/32',dec:'0.34375',mm:'8.731'},
    {frac:'3/8',dec:'0.375',mm:'9.525'},{frac:'13/32',dec:'0.40625',mm:'10.319'},{frac:'7/16',dec:'0.4375',mm:'11.113'},
    {frac:'15/32',dec:'0.46875',mm:'11.906'},{frac:'1/2',dec:'0.500',mm:'12.700'},{frac:'9/16',dec:'0.5625',mm:'14.288'},
    {frac:'5/8',dec:'0.625',mm:'15.875'},{frac:'11/16',dec:'0.6875',mm:'17.463'},{frac:'3/4',dec:'0.750',mm:'19.050'},
    {frac:'13/16',dec:'0.8125',mm:'20.638'},{frac:'7/8',dec:'0.875',mm:'22.225'},{frac:'15/16',dec:'0.9375',mm:'23.813'},
    {frac:'1',dec:'1.000',mm:'25.400'},
  ],
};

// Stair Angle Calculator
const StairCalc = () => {
  const [rise,setRise]=useState('7');
  const [run,setRun]=useState('10');
  const [style,setStyle]=useState('residential');

  const riseN=parseFloat(rise)||0;
  const runN=parseFloat(run)||0;
  const angleDeg=runN>0?Math.round(Math.atan(riseN/runN)*180/Math.PI*100)/100:0;
  const slopeRatio=runN>0?Math.round((riseN/runN)*1000)/1000:0;
  const postCutDeg=Math.round((90-angleDeg)*100)/100;
  const railCutDeg=angleDeg;

  const irc_ok=riseN>=4&&riseN<=7.75&&runN>=10;
  const ibc_ok=riseN>=4&&riseN<=7&&runN>=11;

  const pcPowder=formatPowderAngle(angleDeg);
  function formatPowderAngle(a){
    if(a<1)return 'Flat — standard railing applies';
    if(a<30)return `Slight pitch — consider adjustable fittings (${a}°)`;
    if(a<45)return `Moderate stair — stair posts recommended (${a}°)`;
    return `Steep stair (${a}°) — verify post base fitting compatibility`;
  }

  const compliance=[];
  if(riseN>0&&runN>0){
    compliance.push({code:'IRC R311.7',label:'Residential (IRC)',ok:irc_ok,detail:`Rise 4"–7¾" (${riseN}"), Run ≥10" (${runN}")`});
    compliance.push({code:'IBC 1011.5',label:'Commercial (IBC)',ok:ibc_ok,detail:`Rise 4"–7" (${riseN}"), Run ≥11" (${runN}")`});
  }

  return(
    <div className="calc-box">
      <div className="hd" style={{fontSize:15,marginBottom:14}}>🧮 Stair Angle Calculator</div>
      <div className="grid3" style={{marginBottom:16}}>
        <Field label="Rise (inches)"><input type="number" step=".125" value={rise} onChange={e=>setRise(e.target.value)} placeholder="7"/></Field>
        <Field label="Run (inches)"><input type="number" step=".125" value={run} onChange={e=>setRun(e.target.value)} placeholder="10"/></Field>
        <Field label="Application"><select value={style} onChange={e=>setStyle(e.target.value)}><option value="residential">Residential (IRC)</option><option value="commercial">Commercial (IBC)</option></select></Field>
      </div>
      {riseN>0&&runN>0&&<>
        <div className="grid4" style={{marginBottom:12}}>
          {[
            {l:'Stair Angle',v:`${angleDeg}°`,c:'var(--acc)'},
            {l:'Slope Ratio',v:`1:${Math.round(runN/riseN*100)/100}`,c:'var(--txt)'},
            {l:'Post Cut Angle',v:`${postCutDeg}°`,c:'var(--warn)'},
            {l:'Rail Cut Angle',v:`${railCutDeg}°`,c:'var(--ok)'},
          ].map(s=><div key={s.l} style={{background:'var(--s3)',border:'1px solid var(--bdr)',borderRadius:6,padding:'10px 12px'}}>
            <div style={{fontSize:9,fontFamily:'Barlow Condensed',fontWeight:700,letterSpacing:'.1em',color:'var(--muted)',marginBottom:4,textTransform:'uppercase'}}>{s.l}</div>
            <div className="mono hd" style={{fontSize:18,color:s.c}}>{s.v}</div>
          </div>)}
        </div>
        <div style={{padding:'10px 14px',background:'var(--s3)',borderRadius:6,marginBottom:12,fontSize:12,color:'var(--muted)'}}>
          <strong style={{color:'var(--txt)'}}>Powder Coat & Fitting Note:</strong> {pcPowder}
        </div>
        {compliance.map(c=>(
          <div key={c.code} className={`alert-bar ${c.ok?'alert-ok':'alert-warn'}`} style={{marginBottom:8}}>
            <span style={{color:c.ok?'var(--ok)':'var(--warn)',marginTop:1}}>{c.ok?'✓':'⚠'}</span>
            <div><strong style={{color:c.ok?'var(--ok)':'var(--warn)'}}>{c.label}</strong><span style={{marginLeft:6,color:'var(--muted)'}}>{c.code}</span><div style={{marginTop:2}}>{c.detail}</div></div>
          </div>
        ))}
      </>}
    </div>
  );
};

// Material Cost Calculator
const MatCostCalc = () => {
  const [price,setPrice]=useState('');
  const [qty,setQty]=useState('');
  const [wastePct,setWastePct]=useState('8');
  const [unit,setUnit]=useState('ft');

  const priceN=parseFloat(price)||0;
  const qtyN=parseFloat(qty)||0;
  const wasteN=parseFloat(wastePct)||0;
  const totalCost=priceN*qtyN;
  const withWaste=totalCost*(1+wasteN/100);
  const costPerUsable=qtyN>0?withWaste/(qtyN*(1-wasteN/100)):0;

  return(
    <div className="calc-box">
      <div className="hd" style={{fontSize:15,marginBottom:14}}>📐 Material Cost Calculator</div>
      <div className="grid2" style={{marginBottom:12}}>
        <Field label="Unit Price ($)"><input type="number" step=".01" value={price} onChange={e=>setPrice(e.target.value)} placeholder="2.85"/></Field>
        <Field label="Quantity"><input type="number" step=".5" value={qty} onChange={e=>setQty(e.target.value)} placeholder="100"/></Field>
      </div>
      <div className="grid2" style={{marginBottom:12}}>
        <Field label="Unit"><select value={unit} onChange={e=>setUnit(e.target.value)}><option>ft</option><option>ea</option><option>gal</option><option>lb</option><option>kg</option><option>in</option></select></Field>
        <Field label="Waste Factor %"><input type="number" step="1" value={wastePct} onChange={e=>setWastePct(e.target.value)} placeholder="8"/></Field>
      </div>
      {priceN>0&&qtyN>0&&<div className="grid3">
        {[
          {l:'Raw Total',v:fmt$(totalCost)},
          {l:`With ${wastePct}% Waste`,v:fmt$(withWaste)},
          {l:`Cost per Usable ${unit}`,v:fmt$(costPerUsable)},
        ].map(s=><div key={s.l} style={{background:'var(--s3)',border:'1px solid var(--bdr)',borderRadius:6,padding:'10px 12px'}}>
          <div style={{fontSize:9,fontFamily:'Barlow Condensed',fontWeight:700,letterSpacing:'.1em',color:'var(--muted)',marginBottom:4,textTransform:'uppercase'}}>{s.l}</div>
          <div className="mono hd" style={{fontSize:18,color:'var(--acc)'}}>{s.v}</div>
        </div>)}
      </div>}
    </div>
  );
};

const ShopRef = () => {
  const [tab,setTab]=useState('fasteners');
  return(
    <div className="fade-up">
      <div className="section-hd">
        <div className="hd" style={{fontSize:22}}>Shop Reference</div>
        <span className="chip">Read-only · Maisy_08_Blueprint</span>
      </div>
      <div style={{display:'flex',gap:4,flexWrap:'wrap',marginBottom:14}}>
        {['fasteners','drills','torque','tig','alloys','fractions','calculators'].map(t=>(
          <button key={t} className={`tab${tab===t?' on':''}`} onClick={()=>setTab(t)} style={{textTransform:'capitalize'}}>{t==='tig'?'TIG Welding':t==='fractions'?'Fraction/Decimal':t==='drills'?'Drill Sizes':t}</button>
        ))}
      </div>

      {tab==='fasteners'&&<div className="card" style={{padding:0,overflow:'hidden'}}>
        <table className="ref-table"><thead><tr><th>Type</th><th>Size</th><th>Diam</th><th>Pitch</th><th>Head</th><th>Drive</th><th>Material</th><th>Use</th></tr></thead>
          <tbody>{SHOP_DATA.fasteners.map((r,i)=><tr key={i}><td>{r.type}</td><td className="mono" style={{fontWeight:600}}>{r.size}</td><td className="mono">{r.diam}</td><td className="mono">{r.pitch}</td><td>{r.head}</td><td>{r.drive}</td><td><span className="chip">{r.material}</span></td><td style={{fontSize:11,color:'var(--muted)'}}>{r.use}</td></tr>)}</tbody>
        </table>
      </div>}

      {tab==='drills'&&<div className="card" style={{padding:0,overflow:'hidden'}}>
        <table className="ref-table"><thead><tr><th>Drill Size</th><th>Decimal</th><th>mm</th><th>Common Use</th></tr></thead>
          <tbody>{SHOP_DATA.drillSizes.map((r,i)=><tr key={i}><td className="mono" style={{fontWeight:700,color:'var(--acc)'}}>{r.size}</td><td className="mono">{r.decimal}</td><td className="mono">{r.mm}</td><td style={{fontSize:11,color:'var(--muted)'}}>{r.use}</td></tr>)}</tbody>
        </table>
      </div>}

      {tab==='torque'&&<div className="card" style={{padding:0,overflow:'hidden'}}>
        <table className="ref-table"><thead><tr><th>Fastener</th><th>Material</th><th>Torque (in-lb)</th><th>Torque (ft-lb)</th><th>Notes</th></tr></thead>
          <tbody>{SHOP_DATA.torqueSpecs.map((r,i)=><tr key={i}><td style={{fontWeight:600}}>{r.fastener}</td><td>{r.material}</td><td className="mono" style={{color:'var(--warn)'}}>{r.torqueInLb}</td><td className="mono" style={{color:'var(--warn)'}}>{r.torqueFtLb}</td><td style={{fontSize:11,color:'var(--muted)'}}>{r.notes}</td></tr>)}</tbody>
        </table>
      </div>}

      {tab==='tig'&&<div className="card" style={{padding:0,overflow:'hidden'}}>
        <table className="ref-table"><thead><tr><th>Material</th><th>Thickness</th><th>Amps</th><th>Tungsten</th><th>Filler</th><th>Gas</th><th>CFH</th><th>Notes</th></tr></thead>
          <tbody>{SHOP_DATA.tigSettings.map((r,i)=><tr key={i}><td style={{fontWeight:600}}>{r.material}</td><td className="mono">{r.thickness}</td><td className="mono" style={{color:'var(--acc)'}}>{r.ampRange}</td><td style={{fontSize:11}}>{r.tungsten}</td><td className="mono">{r.filler}</td><td style={{fontSize:11}}>{r.gas}</td><td className="mono">{r.cfh}</td><td style={{fontSize:11,color:'var(--muted)'}}>{r.notes}</td></tr>)}</tbody>
        </table>
      </div>}

      {tab==='alloys'&&<div className="card" style={{padding:0,overflow:'hidden'}}>
        <table className="ref-table"><thead><tr><th>Alloy</th><th>Tensile</th><th>Yield</th><th>Elongation</th><th>Machinability</th><th>Weldability</th><th>Uses</th></tr></thead>
          <tbody>{SHOP_DATA.aluminumAlloys.map((r,i)=><tr key={i}><td className="mono" style={{fontWeight:700,color:i===0?'var(--acc)':'var(--txt)'}}>{r.alloy}{i===0&&<span className="badge" style={{marginLeft:8,background:'rgba(0,229,255,.15)',color:'var(--acc)',fontSize:9}}>PRIMARY</span>}</td><td className="mono">{r.tensile}</td><td className="mono">{r.yield}</td><td className="mono">{r.elongation}</td><td>{r.machinability}</td><td>{r.weldability}</td><td style={{fontSize:11,color:'var(--muted)'}}>{r.uses}</td></tr>)}</tbody>
        </table>
      </div>}

      {tab==='fractions'&&<div className="grid2" style={{gap:16}}>
        <div className="card" style={{padding:0,overflow:'hidden'}}>
          <div style={{padding:'10px 14px',background:'var(--s2)',borderBottom:'1px solid var(--bdr)'}}><span className="hd" style={{fontSize:12}}>Fraction → Decimal → mm</span></div>
          <table className="ref-table"><thead><tr><th>Fraction</th><th>Decimal</th><th>mm</th></tr></thead>
            <tbody>{SHOP_DATA.fractionDecimal.map((r,i)=><tr key={i}><td className="mono" style={{fontWeight:700,color:'var(--acc)'}}>{r.frac}</td><td className="mono">{r.dec}</td><td className="mono">{r.mm}</td></tr>)}</tbody>
          </table>
        </div>
        <div>
          <div style={{background:'var(--s1)',border:'1px solid var(--bdr)',borderRadius:8,padding:'14px',marginBottom:14}}>
            <div className="hd" style={{fontSize:13,marginBottom:10}}>Quick Reference</div>
            {[['1/8" = 0.125"','3.175mm'],['1/4" = 0.250"','6.350mm'],['3/8" = 0.375"','9.525mm'],['1/2" = 0.500"','12.700mm'],['5/8" = 0.625"','15.875mm'],['3/4" = 0.750"','19.050mm'],['1" = 1.000"','25.400mm']].map(([f,m])=>(
              <div key={f} style={{display:'flex',justifyContent:'space-between',padding:'5px 0',borderBottom:'1px solid var(--bdr)',fontSize:12}}>
                <span className="mono" style={{color:'var(--acc)'}}>{f}</span><span className="mono" style={{color:'var(--muted)'}}>{m}</span>
              </div>
            ))}
          </div>
        </div>
      </div>}

      {tab==='calculators'&&<div className="grid2" style={{gap:16,alignItems:'start'}}>
        <StairCalc/>
        <MatCostCalc/>
      </div>}
    </div>
  );
};

// ─── AI PANEL ─────────────────────────────────────────────────────────────────────
const AIPanel = ({data,open,onClose}) => {
  const [msgs,setMsgs]=useState([{role:'ai',text:'Hi Daniel — I have full visibility into your ERP: orders, inventory, production, finance, people, and automation roadmap. What do you need?'}]);
  const [input,setInput]=useState('');
  const [loading,setLoading]=useState(false);
  const ref=useRef(null);
  useEffect(()=>{if(ref.current)ref.current.scrollIntoView({behavior:'smooth'})},[msgs]);
  const send=async()=>{
    if(!input.trim()||loading)return;
    const q=input.trim();setInput('');setMsgs(m=>[...m,{role:'user',text:q}]);setLoading(true);
    try{
      const res=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:700,
          system:`You are the ERP AI for Maisy Railing (custom aluminum railing, Hayden ID). Director of Operations is Daniel Jones. Live data summary: Orders=${data.salesOrders.length}, Inventory items=${data.inventory.length}, Open work orders=${data.workOrders.filter(w=>w.status!=='Complete').length}, Open tasks=${data.todos.filter(t=>t.status!=='Done').length}, Employees=${data.employees.length}. Full data: ${JSON.stringify(data)}. Answer concisely with specific numbers and IDs.`,
          messages:[{role:'user',content:q}]})});
      const d=await res.json();
      setMsgs(m=>[...m,{role:'ai',text:d.content?.[0]?.text||'Error.'}]);
    }catch(e){setMsgs(m=>[...m,{role:'ai',text:'Connection error. Make sure you\'re running with a valid API key.'}]);}
    setLoading(false);
  };
  if(!open)return null;
  return (
    <div className="ai-panel slide-r">
      <div style={{padding:'13px 15px',borderBottom:'1px solid var(--bdr)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:7,height:7,borderRadius:'50%',background:'var(--acc)'}} className="pulse"/><span className="hd" style={{fontSize:14,color:'var(--acc)'}}>AI Operations Assistant</span></div>
        <button onClick={onClose} style={{background:'none',border:'none',color:'var(--muted)',cursor:'pointer',fontSize:20,lineHeight:1}}>×</button>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:'11px'}}>
        {msgs.map((m,i)=>(
          <div key={i} className={`ai-msg ${m.role==='user'?'ai-u':'ai-a'}`}>
            <div style={{fontSize:9,fontFamily:'Barlow Condensed',fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:m.role==='user'?'var(--muted)':'var(--acc)',marginBottom:4}}>{m.role==='user'?'YOU':'MAISY AI'}</div>
            {m.text.split('\n').map((l,j)=><div key={j} style={{minHeight:4}}>{l}</div>)}
          </div>
        ))}
        {loading&&<div className="ai-msg ai-a"><div style={{fontSize:9,fontFamily:'Barlow Condensed',fontWeight:700,letterSpacing:'.12em',color:'var(--acc)',marginBottom:4}}>MAISY AI</div><div style={{display:'flex',gap:4}}>{[0,1,2].map(i=><div key={i} style={{width:5,height:5,borderRadius:'50%',background:'var(--acc)',opacity:.6,animation:`pulse 1s ${i*.2}s infinite`}}/>)}</div></div>}
        <div ref={ref}/>
      </div>
      <div style={{padding:'10px 11px',borderTop:'1px solid var(--bdr)',display:'flex',gap:6}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Ask about your operations…" style={{flex:1,fontSize:12.5}}/>
        <button className="btn btn-p" onClick={send} disabled={loading} style={{minWidth:50}}>Send</button>
      </div>
    </div>
  );
};


// ─── KPI DASHBOARD ─────────────────────────────────────────────────────────────
const KPIDashboard = ({data}) => {
  const targets = data.kpiTargets||[];
  const weekly = (data.kpiWeekly||[]).filter(w=>w.onTimeDeliveryPct||w.firstPassYieldPct||w.wipCount||w.scrapWasteDollar);
  const latest = weekly[weekly.length-1]||{};
  const pctColor = (val, metric) => {
    const t = targets.find(t=>t.metric===metric);
    if(!t||!val) return 'var(--muted)';
    if(val>=t.green*100) return 'var(--ok)';
    if(val>=t.yellow*100) return 'var(--warn)';
    return 'var(--err)';
  };
  return (
    <div style={{padding:'20px 24px'}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:20}}>
        {[
          {label:'On-Time Delivery',val:latest.onTimeDeliveryPct,unit:'%',metric:'On-Time Delivery Rate'},
          {label:'First-Pass Yield',val:latest.firstPassYieldPct,unit:'%',metric:'First-Pass Yield'},
          {label:'Avg Lead Time',val:latest.avgLeadTimeDays,unit:' days',metric:'Avg Lead Time (Days)'},
          {label:'Open WIP',val:latest.wipCount,unit:' pcs',metric:'WIP Count'},
          {label:'Scrap This Week',val:latest.scrapWasteDollar,unit:'',metric:'Scrap/Waste ($)',fmt:'$'},
          {label:'Safety Incidents',val:latest.safetyIncidents,unit:'',metric:'Safety Incidents'},
          {label:'Labor Utilization',val:latest.laborUtilizationPct,unit:'%',metric:'Labor Utilization %'},
          {label:'Order Fulfillment',val:latest.orderFulfillmentPct,unit:'%',metric:'Order Fulfillment %'},
        ].map((k,i)=>(
          <div key={i} style={{background:'var(--s1)',border:'1px solid var(--bdr)',borderRadius:8,padding:'14px 18px'}}>
            <div style={{fontSize:9,color:'var(--muted)',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:6}}>{k.label}</div>
            <div style={{fontSize:26,fontFamily:'Barlow Condensed',fontWeight:700,color:k.val?pctColor(k.val,k.metric):'var(--muted)'}}>{k.val?(k.fmt||'')+k.val.toFixed(1)+k.unit:'—'}</div>
          </div>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        <div style={{background:'var(--s1)',border:'1px solid var(--bdr)',borderRadius:8,padding:16}}>
          <div style={{fontSize:11,fontFamily:'Barlow Condensed',fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',marginBottom:12}}>KPI Targets</div>
          <table className="tbl"><thead><tr><th>Metric</th><th>Green</th><th>Yellow</th><th>Unit</th></tr></thead>
          <tbody>{targets.map((t,i)=><tr key={i}><td>{t.metric}</td><td style={{color:'var(--ok)'}}>{(t.green*100).toFixed(0)}</td><td style={{color:'var(--warn)'}}>{(t.yellow*100).toFixed(0)}</td><td style={{color:'var(--muted)'}}>{t.unit}</td></tr>)}</tbody></table>
        </div>
        <div style={{background:'var(--s1)',border:'1px solid var(--bdr)',borderRadius:8,padding:16}}>
          <div style={{fontSize:11,fontFamily:'Barlow Condensed',fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',marginBottom:12}}>Station Output (Process Cost Analysis)</div>
          <table className="tbl"><thead><tr><th>Station</th><th>Min/Section</th><th>Sections/Day</th><th>Labor $/Day</th></tr></thead>
          <tbody>{(data.costPerStation||[]).slice(0,12).map((s,i)=><tr key={i}><td style={{fontSize:11}}>{s.station}</td><td>{s.timePerSectionMin?.toFixed(1)}</td><td>{s.sectionsPerDay?.toFixed(0)}</td><td style={{color:'var(--acc)'}}>${s.laborDollarDay?.toFixed(0)}</td></tr>)}</tbody></table>
        </div>
      </div>
    </div>
  );
};

// ─── SRS CATALOG ───────────────────────────────────────────────────────────────
const SRSCatalog = ({data}) => {
  const [search,setSearch] = React.useState('');
  const [catFilter,setCatFilter] = React.useState('All');
  const catalog = data.srsCatalog||[];
  const dims = data.srsDims||[];
  const cats = ['All',...new Set(catalog.map(s=>s.category).filter(Boolean))];
  const filtered = catalog.filter(s=>{
    const matchCat = catFilter==='All'||s.category===catFilter;
    const matchSearch = !search||s.sku.toLowerCase().includes(search.toLowerCase())||s.commonName.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });
  return (
    <div style={{padding:'20px 24px'}}>
      <div style={{background:'rgba(251,191,36,.08)',border:'1px solid rgba(251,191,36,.3)',borderRadius:6,padding:'8px 14px',marginBottom:16,fontSize:12,color:'var(--warn)'}}>
        ⚠️ SRS Customer Catalog — sourced from co-worker. Separate from Maisy production SKUs. {catalog.length} SKUs with GTINs.
      </div>
      <div style={{display:'flex',gap:8,marginBottom:14,flexWrap:'wrap'}}>
        <input placeholder="Search SKU or name…" value={search} onChange={e=>setSearch(e.target.value)} style={{flex:1,minWidth:200}}/>
        <select value={catFilter} onChange={e=>setCatFilter(e.target.value)} style={{minWidth:140}}>
          {cats.map(c=><option key={c}>{c}</option>)}
        </select>
        <span className="chip">{filtered.length} SKUs</span>
      </div>
      <div style={{overflowX:'auto'}}>
        <table className="tbl"><thead><tr><th>Category</th><th>SKU</th><th>Common Name</th><th>SRS Stock</th><th>GTIN</th></tr></thead>
        <tbody>{filtered.map((s,i)=>(
          <tr key={i}>
            <td style={{fontSize:10,color:'var(--muted)'}}>{s.category}</td>
            <td style={{fontFamily:'monospace',fontSize:11,color:'var(--acc)'}}>{s.sku}</td>
            <td style={{fontSize:12}}>{s.commonName}</td>
            <td style={{textAlign:'center'}}>{s.srsStock||'—'}</td>
            <td style={{fontFamily:'monospace',fontSize:10,color:'var(--muted)'}}>{s.gtin}</td>
          </tr>
        ))}</tbody></table>
      </div>
    </div>
  );
};

// ─── LEGACY ORDERS ─────────────────────────────────────────────────────────────
const LegacyOrders = ({data}) => {
  const [search,setSearch] = React.useState('');
  const [typeFilter,setTypeFilter] = React.useState('All');
  const orders = data.legacyOrders||[];
  const types = ['All',...new Set(orders.map(o=>o.productType))];
  const filtered = orders.filter(o=>{
    const matchType = typeFilter==='All'||o.productType===typeFilter;
    const matchSearch = !search||o.customer.toLowerCase().includes(search.toLowerCase())||o.shipTo.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });
  const byType = {};
  orders.forEach(o=>{byType[o.productType]=(byType[o.productType]||0)+1;});
  return (
    <div style={{padding:'20px 24px'}}>
      <div style={{background:'rgba(99,102,241,.08)',border:'1px solid rgba(99,102,241,.3)',borderRadius:6,padding:'8px 14px',marginBottom:16,fontSize:12,color:'#818cf8'}}>
        📁 Historical orders from pre-2026 ERP system. {orders.length} orders across {Object.keys(byType).length} product lines. Reference only — not active.
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:16}}>
        {Object.entries(byType).slice(0,8).map(([type,count])=>(
          <div key={type} onClick={()=>setTypeFilter(type===typeFilter?'All':type)} style={{background:typeFilter===type?'rgba(99,102,241,.15)':'var(--s1)',border:`1px solid ${typeFilter===type?'rgba(99,102,241,.5)':'var(--bdr)'}`,borderRadius:6,padding:'10px 12px',cursor:'pointer'}}>
            <div style={{fontSize:9,color:'var(--muted)',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:3}}>{type}</div>
            <div style={{fontSize:22,fontFamily:'Barlow Condensed',fontWeight:700,color:'#818cf8'}}>{count}</div>
          </div>
        ))}
      </div>
      <div style={{display:'flex',gap:8,marginBottom:12}}>
        <input placeholder="Search customer or ship-to…" value={search} onChange={e=>setSearch(e.target.value)} style={{flex:1}}/>
        <span className="chip">{filtered.length} orders</span>
        {typeFilter!=='All'&&<button className="btn btn-xs" onClick={()=>setTypeFilter('All')}>Clear Filter</button>}
      </div>
      <div style={{overflowX:'auto'}}>
        <table className="tbl"><thead><tr><th>ID</th><th>Customer</th><th>Product Type</th><th>Date</th><th>Ship To</th></tr></thead>
        <tbody>{filtered.slice(0,200).map(o=>(
          <tr key={o.id}>
            <td style={{fontFamily:'monospace',fontSize:10,color:'var(--muted)'}}>{o.id}</td>
            <td style={{fontSize:12}}>{o.customer}</td>
            <td style={{fontSize:10,color:'var(--acc)'}}>{o.productType}</td>
            <td style={{fontSize:11,color:'var(--muted)'}}>{o.date}</td>
            <td style={{fontSize:11}}>{o.shipTo}</td>
          </tr>
        ))}</tbody></table>
        {filtered.length>200&&<div style={{textAlign:'center',padding:12,color:'var(--muted)',fontSize:12}}>Showing 200 of {filtered.length} — use search to narrow</div>}
      </div>
    </div>
  );
};


// ─── PRINT CENTER ──────────────────────────────────────────────────────────────
const PrintCenter = ({data}) => {
  const docs = [
    {
      cat:'Shop Floor',
      items:[
        {icon:'📋',title:'Daily Huddle Board',desc:'Standup form — one per shift. Team updates, priorities, output vs goal.',action:()=>printHuddleBoard()},
        {icon:'🔧',title:'Work Order Travelers',desc:`Print all ${data.workOrders?.length||0} active work orders as shop-floor travelers.`,action:()=>data.workOrders?.forEach(w=>setTimeout(()=>printWorkOrder(w),150))},
        {icon:'📊',title:'Training Matrix',desc:'Full cross-training skills snapshot for all employees.',action:()=>printTrainingMatrix(data)},
        {icon:'⚠️',title:'Safety Log + Blank Form',desc:`${data.safetyLog?.length||0} incidents logged. Includes blank incident report form.`,action:()=>printSafetyLog(data)},
        {icon:'💡',title:'Improvement Log (Kaizen)',desc:`${data.improvementLog?.length||0} ideas. Includes blank submission form.`,action:()=>printImprovementLog(data)},
      ]
    },
    {
      cat:'Finance & Orders',
      items:[
        {icon:'🧾',title:'All Invoices',desc:`Print all ${data.invoices?.length||0} invoices as individual documents.`,action:()=>data.invoices?.forEach(i=>setTimeout(()=>printInvoice(i),150))},
        {icon:'📦',title:'All Purchase Orders',desc:`Print all ${data.purchaseOrders?.length||0} POs with line items.`,action:()=>data.purchaseOrders?.forEach(p=>setTimeout(()=>printPO(p),150))},
        {icon:'🚚',title:'All Packing Slips',desc:`Print packing slips for all ${data.shipments?.length||0} shipments.`,action:()=>data.shipments?.forEach(s=>setTimeout(()=>printPackingSlip(s),150))},
      ]
    },
    {
      cat:'Management Reports',
      items:[
        {icon:'📈',title:'KPI Report',desc:'Weekly KPI trend, targets, and station output summary.',action:()=>printKPIReport(data)},
        {icon:'🏭',title:'Inventory Report',desc:`Full stock report with ${(data.inventory?.filter(i=>i.qty<=i.reorder)||[]).length} critical/low items highlighted.`,action:()=>printInventoryReport(data)},
        {icon:'🗂️',title:'Scrap & Waste Log',desc:`${data.scrapWaste?.length||0} scrap events, YTD totals by station.`,action:()=>{
          const log = data.scrapWaste||[];
          const byStation = {};
          log.forEach(s=>{byStation[s.station]=(byStation[s.station]||0)+(s.cost||0);});
          printHTML('Scrap & Waste Log',`<div class="page"><div class="hdr"><div><div class="logo">MAISY<span>ERP</span> · Maisy Railing</div><div class="doc-meta">Scrap & Waste Report</div></div><div style="text-align:right"><div class="doc-title">SCRAP LOG</div><div class="doc-meta">Printed ${new Date().toLocaleDateString()}</div></div></div><div class="grid-4" style="margin-bottom:16px">${Object.entries(byStation).map(([k,v])=>`<div class="box"><div class="box-label">${k}</div><div class="box-val" style="color:#991b1b">$${v.toFixed(2)}</div></div>`).join('')}</div><table><thead><tr><th>Date</th><th>Station</th><th>SKU</th><th>Qty</th><th>Cost</th><th>Reason</th><th>Corrective Action</th><th>By</th></tr></thead><tbody>${log.map(s=>`<tr><td>${s.date||'—'}</td><td>${s.station||'—'}</td><td style="font-family:monospace;font-size:10px">${s.sku||'—'}</td><td>${s.qty||'—'} ${s.unit||''}</td><td style="color:#991b1b;font-weight:700">$${(s.cost||0).toFixed(2)}</td><td style="font-size:10px">${s.reasonCode||'—'}</td><td style="font-size:10px">${s.corrAction||'—'}</td><td style="font-size:10px">${s.reportedBy||'—'}</td></tr>`).join('')}</tbody></table><div class="sig-line"><span>Report Generated: ${new Date().toLocaleDateString()}</span><span>Daniel Jones, Director of Operations</span></div></div>`);
        }},
      ]
    },
  ];

  return (
    <div style={{padding:'20px 24px'}}>
      <div style={{marginBottom:20}}>
        <div className="hd" style={{fontSize:22,marginBottom:6}}>Print Center</div>
        <div style={{fontSize:12,color:'var(--muted)'}}>All printable documents in one place. Each opens a print-ready window and triggers the browser print dialog automatically.</div>
      </div>
      {docs.map(cat=>(
        <div key={cat.cat} style={{marginBottom:24}}>
          <div style={{fontFamily:'Barlow Condensed',fontSize:11,fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--dim)',borderBottom:'1px solid var(--bdr)',paddingBottom:6,marginBottom:12}}>{cat.cat}</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:10}}>
            {cat.items.map(item=>(
              <div key={item.title} style={{background:'var(--s1)',border:'1px solid var(--bdr)',borderRadius:8,padding:'14px 16px',display:'flex',flexDirection:'column',gap:6}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <span style={{fontSize:20}}>{item.icon}</span>
                  <span style={{fontFamily:'Barlow Condensed',fontWeight:700,fontSize:14,letterSpacing:'.03em'}}>{item.title}</span>
                </div>
                <div style={{fontSize:11,color:'var(--muted)',lineHeight:1.5,flex:1}}>{item.desc}</div>
                <button className="btn btn-p" style={{alignSelf:'flex-start',marginTop:4,gap:6}} onClick={item.action}>
                  🖨 Print
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div style={{background:'rgba(0,229,255,.04)',border:'1px solid rgba(0,229,255,.12)',borderRadius:8,padding:'12px 16px',fontSize:11,color:'var(--muted)',marginTop:8}}>
        💡 <strong style={{color:'var(--txt)'}}>Tip:</strong> Individual print buttons (🖨) are also available on each row in Production, Invoicing, Purchasing, and Shipping.
      </div>
    </div>
  );
};

// ─── ROOT APP ─────────────────────────────────────────────────────────────────────
// To add a new module: add to PAGES, TITLES, NAVS, ROLE_ACCESS, and INIT. That's it.
const PAGES = {
  dashboard:Dashboard, todo:Todo,
  sales:Sales, production:Production, inventory:Inventory, shipping:Shipping,
  invoicing:Invoicing, purchasing:Purchasing, finance:Finance,
  jobcost:JobCost, customers:Customers, autopo:AutoPO,
  sister:Sister, people:People, automation:Automation,
  kpi:KPIDashboard, shopref:ShopRef, srscatalog:SRSCatalog,
  legacyorders:LegacyOrders, printcenter:PrintCenter, reports:Reports,
};
const TITLES = {
  dashboard:'Dashboard', todo:'To-Do & Hot List',
  sales:'Sales & Quotes', production:'Production', inventory:'Inventory', shipping:'Shipping',
  invoicing:'Invoicing & A/R', purchasing:'Purchasing', finance:'Finance & P&L',
  jobcost:'Job Costing', customers:'Customers', autopo:'Auto Reorder',
  sister:'Sister Company', people:'People & HR', automation:'Automation Roadmap',
  kpi:'KPI Dashboard', shopref:'Shop Reference', srscatalog:'SRS Catalog',
  legacyorders:'Legacy Orders (Pre-2026)', printcenter:'Print Center', reports:'Reports',
};

const normalizeData = (d) => {
  if (!d) return d;
  if (!d.inventory) d.inventory = [...(d.rawMaterials||[]).map(i=>({...i,sku:i.id,type:'Raw Material'})),...(d.assemblyItems||[]).map(i=>({...i,sku:i.id,type:'Assembly'})),...(d.shopConsumables||[]).map(i=>({...i,sku:i.id,type:'Consumable'}))];
  if (!d.shipments) d.shipments = (d.shipCostLog||[]).map((s,i)=>({...s,id:s.poRef||s.tracking||`SHP-${i+1}`,status:'Delivered'}));
  if (!d.laborRates) d.laborRates = d.laborProcesses||[];
  if (!d.purchaseOrders) d.purchaseOrders = d.purchaseLog||[];
  if (!d.bom) d.bom = [];
  if (!d.adjustmentLog) d.adjustmentLog = [];
  if (!d.costPerStation) d.costPerStation = [];
  return d;
};

export default function MaisyERP() {
  const [user,  setUser]  = useState(null);
  const [page,  setPage]  = useState('dashboard');
  const [data,  setData]  = useState(INIT);
  const [aiOpen,setAiOpen]= useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(()=>{(async()=>{try{const r=await window.storage.get('maisy_erp_v4');if(r?.value)setData(normalizeData(JSON.parse(r.value)));}catch(e){}})();},[]);
  useEffect(()=>{if(!data)return;const t=setTimeout(async()=>{try{await window.storage.set('maisy_erp_v4',JSON.stringify(data));setSaved(true);setTimeout(()=>setSaved(false),1600);}catch(e){}},900);return()=>clearTimeout(t);},[data]);

  const handleLogin=(u)=>{setUser(u);setPage('dashboard');};
  const handleLogout=()=>{setUser(null);setAiOpen(false);};

  if(!user)return <><G/><Login onLogin={handleLogin}/></>;

  const PageComp=PAGES[page]||Dashboard;
  const access=ROLE_ACCESS[user.role]||[];
  const alerts=data.invoices.filter(i=>i.status==='Overdue').length+data.inventory.filter(i=>i.qty<=i.reorder).length+data.todos.filter(t=>t.priority==='Critical'&&t.status!=='Done').length;

  return (
    <>
      <G/>
      <div className="app">
        <Sidebar page={page} setPage={(p)=>{if(access.includes(p))setPage(p);}} data={data} user={user}/>
        <div className="main" style={{marginRight:aiOpen?370:0,transition:'margin-right .3s'}}>
          <div className="topbar">
            <span className="hd" style={{fontSize:13,color:'var(--muted)',flex:1}}>{TITLES[page]}</span>
            {saved&&<span style={{fontSize:10,color:'var(--ok)',fontFamily:'Barlow Condensed',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',animation:'fadeIn .2s ease'}}>● Saved</span>}
            <div style={{width:1,height:18,background:'var(--bdr)',margin:'0 6px'}}/>
            <button onClick={()=>setAiOpen(o=>!o)} style={{position:'relative',background:aiOpen?'rgba(0,229,255,.1)':'none',border:'1px solid',borderColor:aiOpen?'rgba(0,229,255,.4)':'var(--bdr)',color:aiOpen?'var(--acc)':'var(--muted)',borderRadius:5,padding:'5px 12px',cursor:'pointer',fontFamily:'Barlow Condensed',fontSize:11.5,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',display:'flex',alignItems:'center',gap:5,transition:'all .2s'}}>
              {alerts>0&&<div className="pulse" style={{width:6,height:6,background:'var(--err)',borderRadius:'50%'}}/>}
              ◈ AI{alerts>0?` · ${alerts}`:''}
            </button>
            <div style={{width:1,height:18,background:'var(--bdr)',margin:'0 6px'}}/>
            <button onClick={handleLogout} style={{background:'none',border:'1px solid var(--bdr)',color:'var(--muted)',borderRadius:5,padding:'5px 10px',cursor:'pointer',fontFamily:'Barlow Condensed',fontSize:11,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',transition:'all .15s'}} onMouseOver={e=>e.target.style.color='var(--err)'} onMouseOut={e=>e.target.style.color='var(--muted)'}>Sign Out</button>
          </div>
          <div className="content">
            <PageComp data={data} setData={setData} user={user} setPage={setPage}/>
          </div>
        </div>
        <AIPanel data={data} open={aiOpen} onClose={()=>setAiOpen(false)}/>
      </div>
    </>
  );
}
