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
  { email:'admin@maisyrailing.com',  password:'Maisy2026!',  role:'admin',  name:'Daniel Jones',    title:'Director of Operations' },
  { email:'rocky@maisyrailing.com',  password:'Rocky2026!',  role:'owner',  name:'Rocky',           title:'Owner' },
  { email:'office@maisyrailing.com', password:'Office2026!', role:'office', name:'Office Staff',     title:'Office' },
  { email:'shop@maisyrailing.com',   password:'Shop2026!',   role:'shop',   name:'Shop Floor',       title:'Production' },
];

const ROLE_ACCESS = {
  admin:  ['dashboard','todo','sales','production','inventory','shipping','invoicing','purchasing','jobcost','customers','autopo','people','shopref','automation','sister','finance','reports'],
  owner:  ['dashboard','sales','invoicing','finance','reports','customers','automation','people'],
  office: ['dashboard','todo','sales','invoicing','shipping','customers'],
  shop:   ['dashboard','todo','production','shopref'],
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
  // ── Maisy_02_VELOCITY_SALES ─────────────────────────────────────────────
  salesOrders:[
    {id:'SO-001',customer:'Spokane Custom Homes',cusId:'CUS-001',date:'2026-02-12',total:8450,status:'In Production',type:'order',notes:'Cable system, 42" posts, powder black'},
    {id:'SO-002',customer:'Idaho Falls Builders',cusId:'CUS-002',date:'2026-02-15',total:3200,status:'Pending',type:'order',notes:'Glass panel system 36"'},
    {id:'SO-003',customer:'Pacific NW Construction',cusId:'CUS-003',date:'2026-02-20',total:12800,status:'Quoted',type:'quote',notes:'Large commercial deck'},
    {id:'SO-004',customer:"Coeur d'Alene Resort",cusId:'CUS-004',date:'2026-02-22',total:18600,status:'Shipped',type:'order',notes:'Exterior deck & stair railing'},
    {id:'SO-005',customer:'Hayden Lake Properties',cusId:'CUS-005',date:'2026-02-25',total:5500,status:'Completed',type:'order',notes:'Residential cable railing'},
  ],
  customers:[
    {id:'CUS-001',name:'Spokane Custom Homes',contact:'Brad Henley',email:'brad@spokanecustom.com',phone:'509-448-2210',type:'Builder',city:'Spokane, WA',ytd:8450,portalAccess:true,notes:'Repeat client, prefers cable'},
    {id:'CUS-002',name:'Idaho Falls Builders',contact:'Mark Tran',email:'mtran@ifbuilders.com',phone:'208-522-4490',type:'Builder',city:'Idaho Falls, ID',ytd:3200,portalAccess:false,notes:'New account'},
    {id:'CUS-003',name:'Pacific NW Construction',contact:'Linda Chu',email:'lchu@pacificnwcon.com',phone:'206-771-3300',type:'GC',city:'Seattle, WA',ytd:12800,portalAccess:true,notes:'Large commercial'},
    {id:'CUS-004',name:"Coeur d'Alene Resort",contact:'Tony Vega',email:'tvega@cdaresort.com',phone:'208-765-4000',type:'Commercial',city:"CDA, ID",ytd:18600,portalAccess:true,notes:'Premium hospitality'},
    {id:'CUS-005',name:'Hayden Lake Properties',contact:'Sue Alcott',email:'salcott@hlprop.com',phone:'208-772-5500',type:'Developer',city:'Hayden, ID',ytd:5500,portalAccess:false,notes:'Local developer'},
  ],
  // ── Maisy_04_ARSENAL_SUPPLY ─────────────────────────────────────────────
  inventory:[
    {id:'ALU-001',sku:'6061-TUBE-1X1',name:'6061 Aluminum Tube 1"×1"',cat:'Raw Material',qty:240,unit:'ft',reorder:100,cost:2.85,loc:'Rack A1'},
    {id:'ALU-002',sku:'6061-TUBE-2X2',name:'6061 Aluminum Tube 2"×2"',cat:'Raw Material',qty:180,unit:'ft',reorder:80,cost:5.40,loc:'Rack A2'},
    {id:'ALU-003',sku:'6061-FLAT-1X4',name:'6061 Aluminum Flat 1"×4"',cat:'Raw Material',qty:95,unit:'ft',reorder:60,cost:6.20,loc:'Rack A3'},
    {id:'CBL-001',sku:'SS-CBL-316',name:'SS Cable 3/16"',cat:'Hardware',qty:1800,unit:'ft',reorder:2000,cost:0.85,loc:'Bin B1'},
    {id:'HWD-001',sku:'ENDCAP-1-RND',name:'End Cap 1" Round',cat:'Hardware',qty:450,unit:'ea',reorder:200,cost:0.45,loc:'Bin C3'},
    {id:'HWD-002',sku:'BLT-SS-1032',name:'SS Bolt 10-32×1"',cat:'Fasteners',qty:2800,unit:'ea',reorder:500,cost:0.12,loc:'Bin D2'},
    {id:'FIN-001',sku:'PWD-WHT-5G',name:'Powder Coat White 5gal',cat:'Finish',qty:12,unit:'gal',reorder:5,cost:89.00,loc:'Chem Storage'},
    {id:'FIN-002',sku:'PWD-BLK-5G',name:'Powder Coat Black 5gal',cat:'Finish',qty:3,unit:'gal',reorder:5,cost:89.00,loc:'Chem Storage'},
    {id:'GLS-001',sku:'GLS-PNL-36',name:'Glass Panel 36" Tempered',cat:'Glass',qty:28,unit:'ea',reorder:15,cost:145.00,loc:'Glass Bay'},
    {id:'GLS-002',sku:'GLS-PNL-42',name:'Glass Panel 42" Tempered',cat:'Glass',qty:48,unit:'ea',reorder:15,cost:165.00,loc:'Glass Bay'},
    {id:'HWD-003',sku:'SPIGOT-42',name:'Glass Spigot 42"',cat:'Hardware',qty:120,unit:'ea',reorder:40,cost:18.50,loc:'Bin C1'},
  ],
  bom:[
    {id:'BOM-001',productSku:'P-CBL-SM-LINE-42',productName:'Cable Post 42" Standard',items:[
      {inventoryId:'ALU-001',qty:3.5,unit:'ft',note:'Post shaft'},
      {inventoryId:'HWD-001',qty:2,unit:'ea',note:'Top/bottom caps'},
      {inventoryId:'HWD-002',qty:4,unit:'ea',note:'Mounting hardware'},
      {inventoryId:'CBL-001',qty:8,unit:'ft',note:'Per run allowance'},
    ]},
    {id:'BOM-002',productSku:'P-GLS-SM-36',productName:'Glass Panel Frame 36"',items:[
      {inventoryId:'ALU-002',qty:8,unit:'ft',note:'Frame perimeter'},
      {inventoryId:'GLS-001',qty:1,unit:'ea',note:'Tempered glass panel'},
      {inventoryId:'HWD-002',qty:8,unit:'ea',note:'Frame fasteners'},
    ]},
  ],
  adjustmentLog:[
    {id:'ADJ-001',inventoryId:'CBL-001',itemName:'SS Cable 3/16"',type:'remove',qty:200,reason:'WO-001 — SO-001 production',date:'2026-02-14',user:'Daniel Jones'},
    {id:'ADJ-002',inventoryId:'ALU-001',itemName:'6061 Aluminum Tube 1"×1"',type:'add',qty:100,reason:'PO-001 received from Ryerson',date:'2026-02-10',user:'Daniel Jones'},
    {id:'ADJ-003',inventoryId:'FIN-002',itemName:'Powder Coat Black 5gal',type:'remove',qty:3,reason:'WO-005 — powder coat run',date:'2026-03-02',user:'Sarah K.'},
  ],
  vendors:[
    {id:'VND-001',name:'Ryerson Metals',contact:'Dave Kowalski',email:'dkowalski@ryerson.com',phone:'800-777-4020',cat:'Aluminum Stock',rating:4.5,ytd:48200,leadDays:7},
    {id:'VND-002',name:'Outwater Industries',contact:'Sales Desk',email:'sales@outwater.com',phone:'800-631-8375',cat:'End Caps / Hardware',rating:4.2,ytd:12600,leadDays:5},
    {id:'VND-003',name:'Cardinal Industrial',contact:'Jim Steele',email:'jsteele@cardinalind.com',phone:'800-468-1888',cat:'Powder Coat',rating:4.7,ytd:9800,leadDays:3},
    {id:'VND-004',name:'Pacific Wire & Cable',contact:'Angela Ross',email:'aross@pacwire.com',phone:'253-445-9900',cat:'SS Cable',rating:4.4,ytd:22400,leadDays:10},
  ],
  purchaseOrders:[
    {id:'PO-001',vendor:'Ryerson Metals',vendorId:'VND-001',items:[{inventoryId:'ALU-001',sku:'6061-TUBE-1X1',name:'6061 Aluminum Tube 1"×1"',qty:300,unit:'ft',cost:2.85}],total:855,status:'Received',ordered:'2026-02-01',expected:'2026-02-10',received:false},
    {id:'PO-002',vendor:'Cardinal Industrial',vendorId:'VND-003',items:[{inventoryId:'FIN-002',sku:'PWD-BLK-5G',name:'Powder Coat Black 5gal',qty:6,unit:'gal',cost:89}],total:534,status:'Ordered',ordered:'2026-02-20',expected:'2026-02-28',received:false},
    {id:'PO-003',vendor:'Pacific Wire & Cable',vendorId:'VND-004',items:[{inventoryId:'CBL-001',sku:'SS-CBL-316',name:'SS Cable 3/16"',qty:5000,unit:'ft',cost:0.85}],total:4250,status:'In Transit',ordered:'2026-02-18',expected:'2026-03-02',received:false},
  ],
  autoPoRules:[
    {id:'APR-001',inventoryId:'CBL-001',itemName:'SS Cable 3/16"',vendorId:'VND-004',vendorName:'Pacific Wire & Cable',triggerQty:2000,orderQty:5000,unitCost:0.85,unit:'ft',enabled:true},
    {id:'APR-002',inventoryId:'FIN-002',itemName:'Powder Coat Black 5gal',vendorId:'VND-003',vendorName:'Cardinal Industrial',triggerQty:5,orderQty:10,unitCost:89,unit:'gal',enabled:true},
  ],
  // ── Maisy_03_FORGE_PRODUCTION ──────────────────────────────────────────
  workOrders:[
    {id:'WO-001',orderId:'SO-001',product:'Cable Post 42" w/ Base',qty:40,station:'CNC Cut',assigned:'Mike R.',status:'In Progress',start:'2026-02-13',due:'2026-02-20',progress:65,laborHrs:18,matCost:1240,laborRate:28},
    {id:'WO-002',orderId:'SO-002',product:'Glass Panel Frame 36"',qty:16,station:'Powder Coat',assigned:'Sarah K.',status:'Queued',start:'2026-02-18',due:'2026-02-26',progress:0,laborHrs:0,matCost:2320,laborRate:28},
    {id:'WO-003',orderId:'SO-004',product:'Deck Railing System',qty:1,station:'Assembly',assigned:'Tom B.',status:'Complete',start:'2026-02-10',due:'2026-02-21',progress:100,laborHrs:32,matCost:3100,laborRate:28},
  ],
  // ── Maisy_05_MERIDIAN_FINANCE ──────────────────────────────────────────
  invoices:[
    {id:'INV-001',orderId:'SO-004',customer:"Coeur d'Alene Resort",amount:18600,status:'Paid',issued:'2026-02-22',due:'2026-03-08',paid:'2026-02-28'},
    {id:'INV-002',orderId:'SO-005',customer:'Hayden Lake Properties',amount:5500,status:'Overdue',issued:'2026-02-10',due:'2026-02-25',paid:null},
    {id:'INV-003',orderId:'SO-001',customer:'Spokane Custom Homes',amount:8450,status:'Pending',issued:'2026-02-28',due:'2026-03-15',paid:null},
  ],
  laborRates:[
    {id:'LR-001',role:'Welder / Fabricator',level:'Journeyman',rateHr:28,overtime:42,burden:1.28,notes:'TIG cert required'},
    {id:'LR-002',role:'Powder Coat Technician',level:'Experienced',rateHr:24,overtime:36,burden:1.28,notes:'EPA trained'},
    {id:'LR-003',role:'CNC Operator',level:'Skilled',rateHr:26,overtime:39,burden:1.28,notes:'Laguna Swift certified'},
    {id:'LR-004',role:'Assembly Worker',level:'Entry',rateHr:20,overtime:30,burden:1.28,notes:''},
    {id:'LR-005',role:'QC Inspector',level:'Experienced',rateHr:25,overtime:37.50,burden:1.28,notes:''},
    {id:'LR-006',role:'Shipping Coordinator',level:'Skilled',rateHr:22,overtime:33,burden:1.28,notes:'Forklift cert'},
    {id:'LR-007',role:'Director of Operations',level:'Management',rateHr:58,overtime:58,burden:1.35,notes:'Exempt'},
  ],
  pnlMonthly:[
    {month:'Oct 25',revenue:34200,cogs:20520,gross:13680,overhead:8500,ebitda:5180},
    {month:'Nov 25',revenue:41800,cogs:25080,gross:16720,overhead:8500,ebitda:8220},
    {month:'Dec 25',revenue:28900,cogs:17340,gross:11560,overhead:8500,ebitda:3060},
    {month:'Jan 26',revenue:52100,cogs:31260,gross:20840,overhead:9200,ebitda:11640},
    {month:'Feb 26',revenue:57600,cogs:34560,gross:23040,overhead:9200,ebitda:13840},
    {month:'Mar 26',revenue:38450,cogs:23070,gross:15380,overhead:9200,ebitda:6180},
  ],
  costPerStation:[
    {station:'CNC Cut',laborHrAvg:2.1,setupMin:15,cycleMin:8,laborCostUnit:1.96,notes:'Laguna Swift 5×10'},
    {station:'CNC Drill',laborHrAvg:1.4,setupMin:10,cycleMin:5,laborCostUnit:1.31,notes:'3-axis drill press'},
    {station:'Welding',laborHrAvg:4.8,setupMin:20,cycleMin:18,laborCostUnit:5.60,notes:'TIG/MIG per post'},
    {station:'Powder Coat',laborHrAvg:3.2,setupMin:30,cycleMin:45,laborCostUnit:4.27,notes:'Includes cure time'},
    {station:'Assembly',laborHrAvg:2.6,setupMin:10,cycleMin:12,laborCostUnit:2.43,notes:'Per section'},
    {station:'QC Inspection',laborHrAvg:0.5,setupMin:0,cycleMin:8,laborCostUnit:0.52,notes:'Pass/fail check'},
    {station:'Packaging',laborHrAvg:0.8,setupMin:5,cycleMin:6,laborCostUnit:0.67,notes:'Wrap + label'},
  ],
  // ── Maisy_06_DISPATCH_LOGISTICS ────────────────────────────────────────
  shipments:[
    {id:'SHP-001',orderId:'SO-004',customer:"Coeur d'Alene Resort",carrier:'R+L Carriers',tracking:'RL9823741',status:'Delivered',shipped:'2026-02-21',delivered:'2026-02-22',cost:385,weight:420},
    {id:'SHP-002',orderId:'SO-005',customer:'Hayden Lake Properties',carrier:'XPO Logistics',tracking:'XP4471892',status:'In Transit',shipped:'2026-02-26',delivered:'2026-03-02',cost:220,weight:180},
  ],
  // ── Maisy_07_NEXUS_PEOPLE ──────────────────────────────────────────────
  employees:[
    {id:'EMP-001',name:'Daniel Jones',role:'Director of Operations',dept:'Management',hire:'2026-02-09',status:'Active',rateHr:58,email:'daniel@maisyrailing.com',phone:'208-603-8149',notes:''},
    {id:'EMP-002',name:'Mike R.',role:'Welder / Fabricator',dept:'Production',hire:'2024-06-15',status:'Active',rateHr:28,email:'',phone:'',notes:'TIG certified, lead fabricator'},
    {id:'EMP-003',name:'Sarah K.',role:'Powder Coat Technician',dept:'Production',hire:'2024-09-01',status:'Active',rateHr:24,email:'',phone:'',notes:'EPA certified'},
    {id:'EMP-004',name:'Tom B.',role:'Assembly Worker',dept:'Production',hire:'2025-01-10',status:'Active',rateHr:20,email:'',phone:'',notes:''},
  ],
  trainingMatrix:[
    // {empId, station, level: 0=none,1=trainee,2=capable,3=expert}
    {empId:'EMP-002',station:'CNC Cut',level:2},{empId:'EMP-002',station:'Welding',level:3},{empId:'EMP-002',station:'Assembly',level:2},{empId:'EMP-002',station:'QC Inspection',level:1},
    {empId:'EMP-003',station:'Powder Coat',level:3},{empId:'EMP-003',station:'Assembly',level:1},
    {empId:'EMP-004',station:'Assembly',level:2},{empId:'EMP-004',station:'Packaging',level:2},{empId:'EMP-004',station:'CNC Cut',level:1},
  ],
  openPositions:[
    {id:'POS-001',title:'Welder / Fabricator',dept:'Production',priority:'High',status:'Open',posted:'2026-02-15',notes:'TIG aluminum required, 2yr min exp'},
    {id:'POS-002',title:'Powder Coat Prep',dept:'Production',priority:'Medium',status:'Open',posted:'2026-02-20',notes:'Entry level OK, will train'},
    {id:'POS-003',title:'QC Inspector',dept:'Quality',priority:'High',status:'Open',posted:'2026-03-01',notes:'Measurement tools experience required'},
  ],
  disciplineLog:[
    {id:'DIS-001',empId:'EMP-003',empName:'Sarah K.',type:'Verbal Warning',date:'2026-02-15',issue:'Powder coat defect on 3 panels — inadequate surface prep',action:'Reviewed SOP-005. Re-trained on cleaning process.',issuedBy:'Daniel Jones'},
  ],
  // ── Todo & Task List ───────────────────────────────────────────────────
  todos:[
    {id:'TODO-001',title:'Finalize automation RFQ from Vention Robotics',cat:'Automation',priority:'High',status:'Open',due:'2026-03-20',assigned:'Daniel Jones',notes:'Phase 1 cobot install'},
    {id:'TODO-002',title:'Update inventory reorder points after Q1 audit',cat:'Inventory',priority:'Medium',status:'Open',due:'2026-03-15',assigned:'Daniel Jones',notes:''},
    {id:'TODO-003',title:'Post QC Inspector job listing on Indeed',cat:'Hiring',priority:'High',status:'Open',due:'2026-03-10',assigned:'Daniel Jones',notes:''},
    {id:'TODO-004',title:'Transfer vendor accounts from Tom\'s email to Maisy accounts',cat:'Admin',priority:'High',status:'Done',due:'2026-03-01',assigned:'Daniel Jones',notes:'Fastenal, Vevor, Uline done'},
    {id:'TODO-005',title:'Review Cardinal powder coat pricing — contract renewal',cat:'Purchasing',priority:'Medium',status:'Open',due:'2026-03-25',assigned:'Daniel Jones',notes:''},
    {id:'TODO-006',title:'Calibrate CMM and update measurement log',cat:'Quality',priority:'Low',status:'Open',due:'2026-03-30',assigned:'Sarah K.',notes:''},
  ],
  hotList:[
    {id:'HOT-001',orderId:'SO-001',customer:'Spokane Custom Homes',item:'Cable Post 42" × 40',notes:'Customer follow-up promised by 3/10',flag:'HOT',date:'2026-03-05'},
    {id:'HOT-002',orderId:'SO-002',customer:'Idaho Falls Builders',item:'Glass Panel Frame 36" × 16',notes:'Waiting on glass delivery',flag:'WATCH',date:'2026-03-06'},
  ],
  // ── Automation Roadmap ─────────────────────────────────────────────────
  automationPhases:[
    {id:'PH-001',phase:1,title:'CNC Automation & Digital Ops',months:'1–6',budget:280000,status:'In Progress',completion:35,items:[
      {id:'PH-001-A',task:'Laguna Swift 5×10 CNC upgrade — nesting software',cost:18000,status:'In Progress'},
      {id:'PH-001-B',task:'Automated drill press with fixture library',cost:45000,status:'Planned'},
      {id:'PH-001-C',task:'Digital work order & traveler system (this ERP)',cost:0,status:'Done'},
      {id:'PH-001-D',task:'Barcode / QR inventory scan stations',cost:8000,status:'Planned'},
    ]},
    {id:'PH-002',phase:2,title:'Cobot Welding Integration',months:'6–12',budget:520000,status:'Planning',completion:5,items:[
      {id:'PH-002-A',task:'Vention cobot arm — TIG welding cell',cost:185000,status:'Planned'},
      {id:'PH-002-B',task:'Fixture & jig library for post welding',cost:22000,status:'Planned'},
      {id:'PH-002-C',task:'Safety enclosure & light curtains',cost:18000,status:'Planned'},
    ]},
    {id:'PH-003',phase:3,title:'Powder Coat Automation',months:'12–18',budget:890000,status:'Not Started',completion:0,items:[
      {id:'PH-003-A',task:'Automated conveyorized powder coat line',cost:380000,status:'Planned'},
      {id:'PH-003-B',task:'Auto-masking tooling',cost:28000,status:'Planned'},
      {id:'PH-003-C',task:'Cure oven with temp profiling',cost:95000,status:'Planned'},
    ]},
    {id:'PH-004',phase:4,title:'Assembly & Packaging Robotics',months:'18–24',budget:640000,status:'Not Started',completion:0,items:[
      {id:'PH-004-A',task:'6-axis collaborative assembly robot',cost:210000,status:'Planned'},
      {id:'PH-004-B',task:'Automated packaging & labeling line',cost:85000,status:'Planned'},
    ]},
    {id:'PH-005',phase:5,title:'Lights-Out Manufacturing Target',months:'24–30',budget:480000,status:'Not Started',completion:0,items:[
      {id:'PH-005-A',task:'SCADA / MES integration',cost:120000,status:'Planned'},
      {id:'PH-005-B',task:'Autonomous material handling AGV',cost:165000,status:'Planned'},
      {id:'PH-005-C',task:'AI-driven quality vision system',cost:95000,status:'Planned'},
    ]},
  ],
  // ── Sister Company ─────────────────────────────────────────────────────
  sisterOrders:[
    {id:'SIS-001',description:'Cable Railing System — 80 LF',value:6400,date:'2026-02-10',status:'Invoiced',notes:''},
    {id:'SIS-002',description:'Glass Panel Railing — 40 LF',value:5800,date:'2026-02-22',status:'Completed',notes:'Pickup complete'},
  ],
  sisterLabor:[
    {id:'SLB-001',empName:'Mike R.',hrs:12,date:'2026-02-12',rate:28,task:'Welding — sister co order SIS-001',billable:336},
    {id:'SLB-002',empName:'Tom B.',hrs:8,date:'2026-02-24',rate:20,task:'Assembly — sister co order SIS-002',billable:160},
  ],
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
        <button className="btn btn-p" style={{width:'100%',justifyContent:'center',padding:'11px',fontSize:14}} onMouseDown={e=>{e.preventDefault();submit();}}>Sign In →</button>
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
  {section:'Reference'},
  {id:'shopref',icon:'⊟',label:'Shop Reference'},
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
          <div><div className="hd" style={{fontSize:15}}>MAISY ERP</div><div style={{fontSize:9,color:'var(--muted)',letterSpacing:'.13em',textTransform:'uppercase'}}>v4.0 · All Modules</div></div>
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
                <td>{canEdit&&<div style={{display:'flex',gap:4}}><button className="btn btn-g btn-sm" onClick={()=>open(w)}>Edit</button><button className="btn btn-d btn-sm" onClick={()=>del(w.id)}>Del</button></div>}</td>
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
                <button className="btn btn-d btn-sm" onClick={()=>del(p.id)}>Del</button>
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
              <td><div style={{display:'flex',gap:4}}><button className="btn btn-g btn-sm" onClick={()=>open(i)}>Edit</button><button className="btn btn-d btn-sm" onClick={()=>del(i.id)}>Del</button></div></td>
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
                <td><div style={{display:'flex',gap:4}}><button className="btn btn-g btn-sm" onClick={()=>open(s)}>Edit</button><button className="btn btn-d btn-sm" onClick={()=>del(s.id)}>Del</button></div></td>
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

// ─── ROOT APP ─────────────────────────────────────────────────────────────────────
// To add a new module: add to PAGES, TITLES, NAVS, ROLE_ACCESS, and INIT. That's it.
const PAGES = {
  dashboard:Dashboard, todo:Todo,
  sales:Sales, production:Production, inventory:Inventory, shipping:Shipping,
  invoicing:Invoicing, purchasing:Purchasing, finance:Finance,
  jobcost:JobCost, customers:Customers, autopo:AutoPO,
  sister:Sister, people:People, automation:Automation,
  shopref:ShopRef, reports:Reports,
};
const TITLES = {
  dashboard:'Dashboard', todo:'To-Do & Hot List',
  sales:'Sales & Quotes', production:'Production', inventory:'Inventory', shipping:'Shipping',
  invoicing:'Invoicing & A/R', purchasing:'Purchasing', finance:'Finance & P&L',
  jobcost:'Job Costing', customers:'Customers', autopo:'Auto Reorder',
  sister:'Sister Company', people:'People & HR', automation:'Automation Roadmap',
  shopref:'Shop Reference', reports:'Reports',
};

export default function MaisyERP() {
  const [user,  setUser]  = useState(null);
  const [page,  setPage]  = useState('dashboard');
  const [data,  setData]  = useState(INIT);
  const [aiOpen,setAiOpen]= useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(()=>{(async()=>{try{const r=await window.storage.get('maisy_erp_v4');if(r?.value)setData(JSON.parse(r.value));}catch(e){}})();},[]);
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
