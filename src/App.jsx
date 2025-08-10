/* KayG HR Tech Intelligence — Tier 1 + Tier 2 (Pro)
   Drop-in App.jsx for Vite + React
   Dependencies: react, recharts
*/

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ResponsiveContainer, CartesianGrid, Tooltip, XAxis, YAxis, Legend,
  LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter, ZAxis, ReferenceLine, ComposedChart, Area
} from "recharts";

/* -------------------------------------------
   Global: font (Poppins) once
-------------------------------------------- */
function usePoppins() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById("poppins-font")) return;
    const link = document.createElement("link");
    link.id = "poppins-font";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

/* -------------------------------------------
   Mock Data (shared)
-------------------------------------------- */
const NEWS_SOURCES = [
  "Josh Bersin","HR Tech Feed","HR Tech Outlook","Unleash","HR Dive","People Managing People"
];

const mockNews = [
  { id:"n1", source:"Josh Bersin", title:"Skills-based orgs surge with AI copilots", url:"#", publishedAt:"2025-08-05T08:15:00Z", keywords:["AI","Skills"], entities:{orgs:["Mercer","Deloitte Human Capital"], people:["Ravin Jesuthasan"], events:["Future of Work 2025"]}},
  { id:"n2", source:"Unleash", title:"Korn Ferry upgrades leadership analytics", url:"#", publishedAt:"2025-08-04T12:00:00Z", keywords:["Leadership","Analytics"], entities:{orgs:["Korn Ferry"], people:[], events:[]}},
  { id:"n3", source:"HR Dive", title:"WTW launches pay equity benchmark", url:"#", publishedAt:"2025-08-03T07:45:00Z", keywords:["Pay Equity","Benchmarking"], entities:{orgs:["Willis Towers Watson"], people:[], events:[]}},
  { id:"n4", source:"HR Tech Outlook", title:"Aon unveils AI rewards simulator", url:"#", publishedAt:"2025-08-02T16:20:00Z", keywords:["AI","Total Rewards"], entities:{orgs:["Aon"], people:[], events:[]}},
  { id:"n5", source:"People Managing People", title:"Deloitte HC releases 2025 HC Trends", url:"#", publishedAt:"2025-08-01T10:00:00Z", keywords:["Trends","Transformation"], entities:{orgs:["Deloitte Human Capital"], people:[], events:["HC Trends 2025"]}},
];

const companies = [
  {
    key: "MERCER",
    name: "Mercer",
    initials: "M",
    color: "#2F80ED",
    revenue: "$5.7B",
    growthPct: 6,
    tags: ["Career", "Rewards", "Consulting"],
    sentimentNow: 72,
    sentimentTrend: [
      { date: "2025-01", value: 68 },{ date: "2025-02", value: 71 },{ date: "2025-03", value: 69 },
      { date: "2025-04", value: 73 },{ date: "2025-05", value: 72 },
    ],
    newsVelocity: [
      { date: "2025-01-05", value: 8, source: { title: "AI-enabled skills framework", site: "PR", url: "#" } },
      { date: "2025-02-12", value: 10, source: { title: "HRIS partnership", site: "News", url: "#" } },
      { date: "2025-03-02", value: 7, source: { title: "FoW 2025", site: "Analyst", url: "#" } },
      { date: "2025-04-18", value: 12, source: { title: "Mobility update", site: "PR", url: "#" } },
      { date: "2025-05-09", value: 11, source: { title: "Skills-based pay", site: "Research", url: "#" } },
    ],
    leaders: [
      { name: "Jason Averbook", title: "Senior Partner, Digital HR", initials: "JA", color: "#2F80ED",
        insight: "Pushing skills-based HR operating models.", source:{site:"HR Executive", title:"Future of work", url:"#"} },
      { name: "Ravin Jesuthasan", title: "Global Leader, Transformation", initials: "RJ", color: "#2F80ED",
        insight: "Human+AI work design to augment capability.", source:{site:"Unleash", title:"AI in HR", url:"#"} },
    ],
    headcountK: 250,
  },
  {
    key: "KF", name: "Korn Ferry", initials:"KF", color:"#10B981", revenue:"$2.76B", growthPct:3,
    tags:["Talent","Leadership","Consulting"], sentimentNow:68,
    newsVelocity:[{date:"2025-01-05",value:6},{date:"2025-02-12",value:7},{date:"2025-03-02",value:5},{date:"2025-04-18",value:8},{date:"2025-05-09",value:9}],
    sentimentTrend:[{date:"2025-01",value:65},{date:"2025-02",value:67},{date:"2025-03",value:64},{date:"2025-04",value:69},{date:"2025-05",value:68}],
    headcountK:120,
  },
  {
    key: "WTW", name:"Willis Towers Watson", initials:"WTW", color:"#7C3AED", revenue:"$9.48B", growthPct:4,
    tags:["Rewards","Benefits","People"], sentimentNow:66,
    newsVelocity:[{date:"2025-01-05",value:5},{date:"2025-02-12",value:6},{date:"2025-03-02",value:6},{date:"2025-04-18",value:7},{date:"2025-05-09",value:8}],
    sentimentTrend:[{date:"2025-01",value:63},{date:"2025-02",value:65},{date:"2025-03",value:64},{date:"2025-04",value:66},{date:"2025-05",value:66}],
    headcountK:460,
  },
  {
    key: "AON", name:"Aon", initials:"AON", color:"#EF4444", revenue:"$13.4B", growthPct:5,
    tags:["Rewards","Advisory","Risk"], sentimentNow:70,
    newsVelocity:[{date:"2025-01-05",value:7},{date:"2025-02-12",value:8},{date:"2025-03-02",value:6},{date:"2025-04-18",value:9},{date:"2025-05-09",value:10}],
    sentimentTrend:[{date:"2025-01",value:66},{date:"2025-02",value:69},{date:"2025-03",value:68},{date:"2025-04",value:71},{date:"2025-05",value:70}],
    headcountK:500,
  },
  {
    key: "DH", name:"Deloitte Human Capital", initials:"DH", color:"#059669", revenue:"$67.2B (global, HC subset)", growthPct:4,
    tags:["Transformation","HR Tech","Consulting"], sentimentNow:73,
    newsVelocity:[{date:"2025-01-05",value:9},{date:"2025-02-12",value:11},{date:"2025-03-02",value:8},{date:"2025-04-18",value:12},{date:"2025-05-09",value:13}],
    sentimentTrend:[{date:"2025-01",value:70},{date:"2025-02",value:72},{date:"2025-03",value:71},{date:"2025-04",value:74},{date:"2025-05",value:73}],
    headcountK:450,
  },
];

const kpiSummary = [
  { name: "AI Adoption Rate", value: 67, change: +3, icon: "🤖", unit:"%" },
  { name: "Remote Work Penetration", value: 54, change: -2, icon: "🏠", unit:"%" },
  { name: "HR Tech Investment", value: 4.2, change: +1, icon: "💼", unit:"B" },
];

/* -------------------------------------------
   Small helpers / atoms
-------------------------------------------- */
const Pill = ({ children }) => (
  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 999, background: "#F3F4F6", color: "#374151", marginRight: 6 }}>
    {children}
  </span>
);

function formatDate(iso) {
  try { return new Date(iso).toLocaleDateString(undefined, {year:"numeric", month:"short", day:"numeric"}); }
  catch { return "—"; }
}

/* -------------------------------------------
   TIER 1 — Core
-------------------------------------------- */

/** 1) RealTimeNewsAggregator */
function RealTimeNewsAggregator() {
  const [selected, setSelected] = useState(new Set());
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");

  const filtered = useMemo(() => {
    let items = mockNews.slice();
    if (selected.size) items = items.filter(n => selected.has(n.source));
    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter(n =>
        n.title.toLowerCase().includes(q) ||
        (n.keywords||[]).some(k=>k.toLowerCase().includes(q)) ||
        (n.entities?.orgs||[]).some(o=>o.toLowerCase().includes(q))
      );
    }
    items.sort((a,b)=> sort==="oldest" ? +new Date(a.publishedAt) - +new Date(b.publishedAt)
                                       : +new Date(b.publishedAt) - +new Date(a.publishedAt));
    return items;
  }, [selected, query, sort]);

  const toggle = (s) => setSelected(prev => {
    const next = new Set(prev); next.has(s) ? next.delete(s) : next.add(s); return next;
  });

  return (
    <div style={{ display:"grid", gap:12 }}>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        <input placeholder="Search news…" value={query} onChange={e=>setQuery(e.target.value)}
               style={{ padding:"8px 10px", border:"1px solid #E5E7EB", borderRadius:10, minWidth:260 }}/>
        <select value={sort} onChange={(e)=>setSort(e.target.value)} style={{ padding:"8px 10px", border:"1px solid #E5E7EB", borderRadius:10 }}>
          <option value="newest">Newest</option><option value="oldest">Oldest</option>
        </select>
      </div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        {NEWS_SOURCES.map(s => {
          const active = selected.has(s);
          return (
            <button key={s} onClick={()=>toggle(s)}
              style={{ padding:"6px 10px", borderRadius:999, border:`1px solid ${active?"#111827":"#E5E7EB"}`, background:active?"#111827":"#fff", color:active?"#fff":"#111827" }}>
              {s}
            </button>
          );
        })}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(320px,1fr))", gap:12 }}>
        {filtered.map(n=>(
          <div key={n.id} style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
              <div style={{ fontWeight:700 }}>{n.source}</div>
              <a href={n.url} target="_blank" rel="noreferrer" style={{ fontSize:12, color:"#2563EB", textDecoration:"none" }}>Open</a>
            </div>
            <div style={{ color:"#6B7280", fontSize:12, marginTop:2 }}>{formatDate(n.publishedAt)}</div>
            <div style={{ marginTop:8, fontWeight:600 }}>{n.title}</div>
            <div style={{ marginTop:8 }}>
              {(n.keywords||[]).map(k => <Pill key={k}>{k}</Pill>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** 2) SentimentAnalysis (simple line from aggregated) */
function SentimentAnalysis() {
  const sentimentMoM = [
    { m:"Jan", s:60 },{ m:"Feb", s:65 },{ m:"Mar", s:58 },
    { m:"Apr", s:62 },{ m:"May", s:68 },{ m:"Jun", s:64 },
  ];
  return (
    <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:12 }}>
      <div style={{ fontWeight:700, marginBottom:8 }}>Industry Sentiment (MoM)</div>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={sentimentMoM}>
          <CartesianGrid stroke="#F3F4F6" />
          <XAxis dataKey="m" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip />
          <Line dataKey="s" name="Sentiment" stroke="#6366F1" strokeWidth={2}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/** 3) TopicCategorization (chips from news) */
function TopicCategorization() {
  const topics = Array.from(new Set(mockNews.flatMap(n => n.keywords || [])));
  return (
    <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:12 }}>
      <div style={{ fontWeight:700, marginBottom:8 }}>Hot Topics</div>
      {topics.map(t => <Pill key={t}>{t}</Pill>)}
    </div>
  );
}

/** 4) KPIDashboard */
function KPIDashboard() {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px,1fr))", gap:12 }}>
      {kpiSummary.map(k=>(
        <div key={k.name} style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:12 }}>
          <div style={{ fontSize:20 }}>{k.icon}</div>
          <div style={{ fontWeight:700, marginTop:4 }}>{k.name}</div>
          <div style={{ display:"flex", alignItems:"baseline", gap:8, marginTop:6 }}>
            <div style={{ fontSize:24, fontWeight:800 }}>{k.value}{k.unit}</div>
            <div style={{ fontSize:12, color:k.change>=0?"#166534":"#991B1B", background:k.change>=0?"#DCFCE7":"#FEE2E2", padding:"2px 6px", borderRadius:999 }}>
              {k.change>=0 ? `↑ ${k.change}` : `↓ ${Math.abs(k.change)}`}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/** 5) DataVisualizations (company sentiment mini-trends) */
function DataVisualizations() {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px,1fr))", gap:12 }}>
      {companies.map(c=>(
        <div key={c.key} style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:12 }}>
          <div style={{ fontWeight:700 }}>{c.name}</div>
          <div style={{ color:"#6B7280", fontSize:12 }}>Sentiment trend</div>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={c.sentimentTrend}>
              <CartesianGrid stroke="#F3F4F6" />
              <XAxis dataKey="date" hide />
              <YAxis hide />
              <Tooltip />
              <Line dataKey="value" stroke={c.color} strokeWidth={2} dot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
}

/** 6) PersonalizedFeed (simple “followed companies” mock) */
function PersonalizedFeed() {
  const [following, setFollowing] = useState(new Set(["MERCER","AON"]));
  const toggle = (k)=> setFollowing(prev => { const n = new Set(prev); n.has(k)?n.delete(k):n.add(k); return n; });
  const rows = companies.filter(c => following.has(c.key));
  return (
    <div style={{ display:"grid", gap:10 }}>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        {companies.map(c=>(
          <button key={c.key} onClick={()=>toggle(c.key)}
            style={{ padding:"6px 10px", borderRadius:999, border:"1px solid #E5E7EB",
                     background: following.has(c.key)?"#111827":"#fff", color:following.has(c.key)?"#fff":"#111827" }}>
            {following.has(c.key) ? "Following" : "Follow"} {c.name}
          </button>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px,1fr))", gap:12 }}>
        {rows.map(c=>(
          <div key={c.key} style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:12 }}>
            <div style={{ fontWeight:700 }}>{c.name}</div>
            <div style={{ fontSize:12, color:"#6B7280" }}>Revenue {c.revenue} • Sentiment {c.sentimentNow}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** 7) CompanyCards + 8) PeopleCards (leaders) */
function CompanyCards() {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px,1fr))", gap:12 }}>
      {companies.map(c=>(
        <div key={c.key} style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:40, height:40, borderRadius:10, background:c.color+"11", color:c.color, border:`1px solid ${c.color}44`,
                          display:"grid", placeItems:"center", fontWeight:800 }}>{c.initials}</div>
            <div style={{ fontWeight:700 }}>{c.name}</div>
          </div>
          <div style={{ marginTop:6, fontSize:12, color:"#6B7280" }}>Growth: {c.growthPct >= 0 ? `↑ ${c.growthPct}%` : `↓ ${Math.abs(c.growthPct)}%`}</div>
          <div style={{ marginTop:8 }}>
            {(c.tags||[]).map(t => <Pill key={t}>{t}</Pill>)}
          </div>
        </div>
      ))}
    </div>
  );
}
function PeopleCards() {
  const leaders = companies.flatMap(c => (c.leaders||[]).map(L => ({...L, company:c.name})));
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(240px,1fr))", gap:12 }}>
      {leaders.map((L,i)=>(
        <div key={i} style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:9, background:(L.color||"#111827")+"11", color:(L.color||"#111827"),
                          border:`1px solid ${(L.color||"#111827")}44`, display:"grid", placeItems:"center", fontWeight:800 }}>{L.initials}</div>
            <div>
              <div style={{ fontWeight:700 }}>{L.name}</div>
              <div style={{ fontSize:12, color:"#6B7280" }}>{L.title}</div>
            </div>
          </div>
          <div style={{ marginTop:8, fontSize:13 }}>{L.insight}</div>
          {L.source?.url ? <a href={L.source.url} target="_blank" rel="noreferrer" style={{ fontSize:12, color:"#2563EB", textDecoration:"none" }}>
            {L.source.site}: {L.source.title}
          </a> : null}
        </div>
      ))}
    </div>
  );
}

/** 9) BenchmarkingTool (Tier‑1) */
const BENCHMARK_METRICS = [
  { key:"ai", label:"AI Adoption %", unit:"%", min:10, max:90 },
  { key:"remote", label:"Remote Work %", unit:"%", min:5, max:80 },
  { key:"invest", label:"HR Tech Invest ($B)", unit:"B", min:0.5, max:10 },
  { key:"sentiment", label:"Sentiment %", unit:"%", min:40, max:85 },
];
const INDUSTRY_BASELINES = {
  "Consulting & Advisory": { ai:62, remote:45, invest:3.1, sentiment:70 },
  "HR Tech Vendors": { ai:68, remote:55, invest:4.8, sentiment:67 },
  "Enterprise (General)": { ai:50, remote:40, invest:2.0, sentiment:63 },
};
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
const pctDelta = (company, base) => (!isFinite(base) || base===0) ? 0 : ((company - base) / base) * 100;

function BenchmarkingTool() {
  const industryNames = Object.keys(INDUSTRY_BASELINES);
  const [industry, setIndustry] = useState(industryNames[0]);
  const [preset, setPreset] = useState("Custom");
  const [ai, setAi] = useState(60);
  const [remote, setRemote] = useState(45);
  const [invest, setInvest] = useState(3.0);
  const [sentiment, setSentiment] = useState(68);

  const presets = {
    Custom:null,
    Mercer:{ ai:64, remote:48, invest:3.6, sentiment:72 },
    Aon:{ ai:62, remote:46, invest:3.4, sentiment:70 },
    "Korn Ferry":{ ai:58, remote:42, invest:2.9, sentiment:68 },
    WTW:{ ai:59, remote:44, invest:3.1, sentiment:66 },
    "Deloitte HC":{ ai:66, remote:50, invest:4.0, sentiment:73 },
  };
  useEffect(()=>{ const d = presets[preset]; if (d){ setAi(d.ai); setRemote(d.remote); setInvest(d.invest); setSentiment(d.sentiment);} },[preset]);

  const base = INDUSTRY_BASELINES[industry];
  const companyVector = { ai, remote, invest, sentiment };
  const radarData = BENCHMARK_METRICS.map(m => ({ metric:m.label, Company: clamp(companyVector[m.key], m.min, m.max), Industry: base[m.key]}));
  const deltaBars = BENCHMARK_METRICS.map(m => ({ name:m.label.split(" ")[0], Delta: pctDelta(companyVector[m.key], base[m.key]) }));

  return (
    <div style={{ display:"grid", gap:12 }}>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        <label>Industry:
          <select value={industry} onChange={(e)=>setIndustry(e.target.value)} style={{ marginLeft:6 }}>
            {industryNames.map(n=><option key={n}>{n}</option>)}
          </select>
        </label>
        <label>Preset:
          <select value={preset} onChange={(e)=>setPreset(e.target.value)} style={{ marginLeft:6 }}>
            {Object.keys(presets).map(p=><option key={p}>{p}</option>)}
          </select>
        </label>
        <label>AI %
          <input type="number" value={ai} onChange={e=>setAi(parseFloat(e.target.value||0))} style={{ marginLeft:6, width:80 }}/>
        </label>
        <label>Remote %
          <input type="number" value={remote} onChange={e=>setRemote(parseFloat(e.target.value||0))} style={{ marginLeft:6, width:80 }}/>
        </label>
        <label>Invest $B
          <input type="number" step="0.1" value={invest} onChange={e=>setInvest(parseFloat(e.target.value||0))} style={{ marginLeft:6, width:80 }}/>
        </label>
        <label>Sentiment %
          <input type="number" value={sentiment} onChange={e=>setSentiment(parseFloat(e.target.value||0))} style={{ marginLeft:6, width:80 }}/>
        </label>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1.2fr 1fr", gap:12 }}>
        <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:12 }}>
          <div style={{ fontWeight:700, marginBottom:6 }}>Profile (Radar)</div>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize:11 }} />
              <PolarRadiusAxis />
              <Radar name="Company" dataKey="Company" stroke="#111827" fill="#111827" fillOpacity={0.3}/>
              <Radar name="Industry" dataKey="Industry" stroke="#6366F1" fill="#6366F1" fillOpacity={0.25}/>
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:12 }}>
          <div style={{ fontWeight:700, marginBottom:6 }}>Delta vs Industry (%)</div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deltaBars} layout="vertical" margin={{ left: 16 }}>
              <CartesianGrid stroke="#F3F4F6" />
              <XAxis type="number" tickFormatter={(v)=>`${v}%`} />
              <YAxis type="category" dataKey="name" width={80} />
              <Tooltip />
              <Bar dataKey="Delta" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------
   TIER 2 — Pro (8 improvements)
-------------------------------------------- */

/** Pro‑1) TrendPrediction */
const TREND_MOCK = [
  { id:"t1", title:"Skills-Based Talent Architecture", confidence:84, firstSeen:"2024-11",
    topSignals:[{type:"News", title:"Mercer skills framework", url:"#"}, {type:"Funding", title:"Series B skills graph", url:"#"}],
    timeline:[{m:"Jan",score:46},{m:"Feb",score:51},{m:"Mar",score:58},{m:"Apr",score:63},{m:"May",score:70},{m:"Jun",score:74}] },
  { id:"t2", title:"AI in Total Rewards (Simulation)", confidence:72, firstSeen:"2025-02",
    topSignals:[{type:"News", title:"Aon AI rewards", url:"#"},{type:"Analyst", title:"Comp optimization", url:"#"}],
    timeline:[{m:"Jan",score:30},{m:"Feb",score:42},{m:"Mar",score:55},{m:"Apr",score:57},{m:"May",score:61},{m:"Jun",score:66}] },
];
const Badge = ({ text, tone="neutral" }) => {
  const tones = {
    positive:{ bg:"#DCFCE7", fg:"#166534" },
    negative:{ bg:"#FEE2E2", fg:"#991B1B" },
    neutral:{ bg:"#F3F4F6", fg:"#374151" },
    info:{ bg:"#E0E7FF", fg:"#3730A3" },
  };
  const t = tones[tone] || tones.neutral;
  return <span style={{ padding:"2px 8px", borderRadius:999, background:t.bg, color:t.fg, fontSize:12, fontWeight:600 }}>{text}</span>;
};
const Progress = ({ value=0 }) => (
  <div style={{ height:8, background:"#E5E7EB", borderRadius:999, overflow:"hidden" }}>
    <div style={{ width:`${Math.max(0,Math.min(100,value))}%`, height:"100%", background:"#6366F1" }}/>
  </div>
);
function TrendPrediction() {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(320px,1fr))", gap:12 }}>
      {TREND_MOCK.map(t=>(
        <div key={t.id} style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:12 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ fontWeight:700 }}>{t.title}</div>
            <Badge text={`Confidence ${t.confidence}%`} tone={t.confidence>=70?"positive":"info"} />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:12, marginTop:8 }}>
            <div>
              <div style={{ fontSize:12, color:"#6B7280" }}>Confidence</div>
              <Progress value={t.confidence}/>
            </div>
            <div style={{ fontSize:12 }}><strong>First seen:</strong> {t.firstSeen}</div>
          </div>
          <div style={{ height:140, marginTop:8 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={t.timeline}>
                <CartesianGrid stroke="#F3F4F6" />
                <XAxis dataKey="m" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Line dataKey="score" stroke="#10B981" strokeWidth={2} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <details style={{ marginTop:8 }}>
            <summary style={{ cursor:"pointer", fontWeight:600 }}>Why this trend?</summary>
            <div style={{ display:"grid", gap:6, marginTop:6 }}>
              {t.topSignals.map((s,i)=>(<a key={i} href={s.url} target="_blank" rel="noreferrer" style={{ fontSize:13, color:"#2563EB", textDecoration:"none" }}>{s.type}: {s.title}</a>))}
            </div>
          </details>
        </div>
      ))}
    </div>
  );
}

/** Pro‑2) TalentMovementTracker */
const TALENT_MOVES = [
  { id:"mv1", person:"Alex Morgan", role:"CHRO", from:"Aon", to:"Mercer", date:"2025-07-22", signals:["LinkedIn update","Press release"],
    impact:"AI rewards expertise into consulting — expect AI-led rewards design acceleration." },
  { id:"mv2", person:"Priya Shah", role:"Chief People Officer", from:"WTW", to:"Korn Ferry", date:"2025-08-02", signals:["Press coverage"],
    impact:"Analytics-heavy background → likely focus on data-led leadership programs." },
];
function TalentMovementTracker() {
  const [alerts, setAlerts] = useState(true);
  const [q, setQ] = useState("");
  const [role, setRole] = useState("All");
  const roles = ["All", ...Array.from(new Set(TALENT_MOVES.map(m=>m.role)))];
  const list = TALENT_MOVES.filter(m => (role==="All" || m.role===role) && (m.person+m.company+m.role+m.from+m.to).toLowerCase().includes(q.toLowerCase()));

  return (
    <div style={{ display:"grid", gap:12 }}>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        <label style={{ display:"flex", alignItems:"center", gap:6 }}>
          <input type="checkbox" checked={alerts} onChange={e=>setAlerts(e.target.checked)} />
          Role-change alerts (CHRO/CPO/Heads of Talent)
        </label>
        <input placeholder="Search person/company…" value={q} onChange={e=>setQ(e.target.value)}
               style={{ padding:"8px 10px", border:"1px solid #E5E7EB", borderRadius:10 }}/>
        <select value={role} onChange={e=>setRole(e.target.value)} style={{ padding:"8px 10px", border:"1px solid #E5E7EB", borderRadius:10 }}>
          {roles.map(r=><option key={r}>{r}</option>)}
        </select>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(320px,1fr))", gap:12 }}>
        {list.map(m=>(
          <div key={m.id} style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
              <div style={{ fontWeight:700 }}>{m.person} — {m.role}</div>
              <Badge text={new Date(m.date).toLocaleDateString()} tone="info" />
            </div>
            <div style={{ fontSize:13, marginTop:2 }}>{m.from} → <strong>{m.to}</strong></div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:6 }}>
              {m.signals.map((s,i)=> <Badge key={i} text={s} tone="neutral" />)}
              {alerts && <Badge text="Alert enabled" tone="positive" />}
            </div>
            <div style={{ fontSize:13, marginTop:6 }}>{m.impact}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Pro‑3) SentimentVsRealityAnalyzer */
const SVR_NEWS = [
  { title:"Analyst upbeat on HR AI", url:"#" },
  { title:"Earnings miss amid optimism", url:"#"},
  { title:"Product launch buzz", url:"#"},
];
const SVR_DATA = {
  revenue: { series:[{m:"Jan",s:62,k:3.2},{m:"Feb",s:66,k:3.1},{m:"Mar",s:68,k:3.0},{m:"Apr",s:70,k:3.2},{m:"May",s:72,k:3.3},{m:"Jun",s:69,k:3.1}], unit:"$B" },
  headcount:{ series:[{m:"Jan",s:61,k:1.2},{m:"Feb",s:63,k:1.25},{m:"Mar",s:65,k:1.23},{m:"Apr",s:66,k:1.28},{m:"May",s:64,k:1.22},{m:"Jun",s:63,k:1.20}], unit:"x" },
  funding:  { series:[{m:"Jan",s:55,k:0.8},{m:"Feb",s:57,k:0.9},{m:"Mar",s:60,k:0.95},{m:"Apr",s:64,k:1.1},{m:"May",s:62,k:1.05},{m:"Jun",s:61,k:0.98}], unit:"$B" },
  retention:{ series:[{m:"Jan",s:58,k:86},{m:"Feb",s:60,k:87},{m:"Mar",s:62,k:86},{m:"Apr",s:63,k:87},{m:"May",s:64,k:88},{m:"Jun",s:63,k:87}], unit:"%" },
};
function SentimentVsRealityAnalyzer() {
  const [metric, setMetric] = useState("revenue");
  const data = SVR_DATA[metric];
  const sVals = data.series.map(d => d.s / 100);
  const kArr = data.series.map(d => d.k);
  const min = Math.min(...kArr), max = Math.max(...kArr);
  const kVals = data.series.map(d => (d.k - min) / Math.max(1e-9, (max-min)));
  const mae = sVals.reduce((acc, v, i) => acc + Math.abs(v - kVals[i]), 0) / sVals.length;
  const trust = Math.round((1 - Math.min(1, mae)) * 100);
  const latest = data.series[data.series.length-1];
  const hypeGap = Math.round(latest.s - (kVals[kVals.length-1]*100));

  return (
    <div style={{ display:"grid", gridTemplateColumns:"1.2fr 1fr", gap:12 }}>
      <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:12 }}>
        <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:8 }}>
          <select value={metric} onChange={e=>setMetric(e.target.value)} style={{ padding:"8px 12px", borderRadius:10, border:"1px solid #E5E7EB" }}>
            <option value="revenue">Revenue</option>
            <option value="headcount">Headcount Growth</option>
            <option value="funding">Funding</option>
            <option value="retention">Retention Rate</option>
          </select>
          <Badge text={`Trust: ${trust}`} tone={trust>=65?"positive":trust>=45?"info":"negative"} />
          <Badge text={`Hype gap: ${hypeGap>=0?`+${hypeGap}`:hypeGap}`} tone={hypeGap>=10?"negative":hypeGap>=-10?"neutral":"positive"} />
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.series}>
            <CartesianGrid stroke="#F3F4F6" />
            <XAxis dataKey="m" stroke="#9CA3AF" />
            <YAxis yAxisId="left" stroke="#9CA3AF" />
            <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
            <Tooltip />
            <Line yAxisId="left" dataKey="s" name="Media Sentiment" stroke="#6366F1" strokeWidth={2}/>
            <Line yAxisId="right" dataKey="k" name={`KPI (${data.unit})`} stroke="#10B981" strokeWidth={2}/>
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:12 }}>
        <div style={{ fontWeight:700, marginBottom:8 }}>Context (top articles)</div>
        <div style={{ display:"grid", gap:6 }}>
          {SVR_NEWS.map((n,i)=>(<a key={i} href={n.url} target="_blank" rel="noreferrer" style={{ color:"#2563EB", textDecoration:"none", fontSize:13 }}>{n.title}</a>))}
        </div>
      </div>
    </div>
  );
}

/** Pro‑4) TimelineExplorer (comparative overlay + narrative) */
const TL_ALL = [
  { company:"Mercer", month:"Jan", signal:8, event:"Report: Future of Work" },
  { company:"Mercer", month:"Feb", signal:10, event:"HRIS partnership" },
  { company:"Mercer", month:"Mar", signal:7, event:"Skills-based pay study" },
  { company:"Mercer", month:"Apr", signal:12, event:"Mobility update" },
  { company:"Mercer", month:"May", signal:11, event:"Leadership podcast" },
  { company:"Korn Ferry", month:"Jan", signal:6, event:"Talent analytics update" },
  { company:"Korn Ferry", month:"Feb", signal:7, event:"Leadership suite" },
  { company:"Korn Ferry", month:"Mar", signal:5, event:"Earnings" },
  { company:"Korn Ferry", month:"Apr", signal:8, event:"LMS partnership" },
  { company:"Korn Ferry", month:"May", signal:9, event:"Leadership index" },
];
function TimelineExplorer() {
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun"];
  const [range, setRange] = useState(["Jan","May"]);
  const [c1, setC1] = useState("Mercer");
  const [c2, setC2] = useState("Korn Ferry");
  const [start, end] = range;
  const inRange = (d) => MONTHS.indexOf(d.month) >= MONTHS.indexOf(start) && MONTHS.indexOf(d.month) <= MONTHS.indexOf(end);
  const d1 = TL_ALL.filter(d => d.company===c1 && inRange(d));
  const d2 = TL_ALL.filter(d => d.company===c2 && inRange(d));
  const narrative = `Between ${start} and ${end}, ${c1} shows ${d1.length?"steady":"limited"} activity (e.g., “${d1[0]?.event||"—"}”). ${c2} shows ${d2.length?"consistent":"limited"} movement (e.g., “${d2[0]?.event||"—"}”).`;

  return (
    <div style={{ display:"grid", gap:12 }}>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        <label>From:
          <select value={start} onChange={e=>setRange([e.target.value, end])} style={{ marginLeft:6 }}>
            {MONTHS.map(m=><option key={m}>{m}</option>)}
          </select>
        </label>
        <label>To:
          <select value={end} onChange={e=>setRange([start, e.target.value])} style={{ marginLeft:6 }}>
            {MONTHS.map(m=><option key={m}>{m}</option>)}
          </select>
        </label>
        <label>Company A:
          <select value={c1} onChange={e=>setC1(e.target.value)} style={{ marginLeft:6 }}>
            <option>Mercer</option><option>Korn Ferry</option><option>Aon</option><option>WTW</option><option>Deloitte Human Capital</option>
          </select>
        </label>
        <label>Company B:
          <select value={c2} onChange={e=>setC2(e.target.value)} style={{ marginLeft:6 }}>
            <option>Mercer</option><option>Korn Ferry</option><option>Aon</option><option>WTW</option><option>Deloitte Human Capital</option>
          </select>
        </label>
      </div>

      <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:12 }}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart>
            <CartesianGrid stroke="#F3F4F6" />
            <XAxis dataKey="month" type="category" allowDuplicatedCategory={false} stroke="#9CA3AF"/>
            <YAxis stroke="#9CA3AF" />
            <Tooltip />
            <Line dataKey="signal" name={c1} data={d1} stroke="#6366F1" />
            <Line dataKey="signal" name={c2} data={d2} stroke="#10B981" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:12, padding:12, fontSize:13 }}>
        <strong>AI Narrative:</strong> {narrative}
      </div>
    </div>
  );
}

/** Pro‑5) DynamicPeerBenchmarking */
const PEER_POOL = [
  { name:"Mercer", size:"L", region:"Global", maturity:5, ai:64, sentiment:72 },
  { name:"Aon", size:"L", region:"Global", maturity:4, ai:62, sentiment:70 },
  { name:"Korn Ferry", size:"M", region:"Global", maturity:4, ai:58, sentiment:68 },
  { name:"WTW", size:"L", region:"Global", maturity:4, ai:59, sentiment:66 },
  { name:"Deloitte Human Capital", size:"XL", region:"Global", maturity:5, ai:66, sentiment:73 },
  { name:"SmartRecruiters", size:"M", region:"US/EU", maturity:3, ai:61, sentiment:65 },
];
function DynamicPeerBenchmarking() {
  const [company, setCompany] = useState("Mercer");
  const [leadersOnly, setLeadersOnly] = useState(true);
  const [whatIf, setWhatIf] = useState(0);

  const base = PEER_POOL.find(p => p.name === company) || PEER_POOL[0];
  const peers = PEER_POOL.filter(p => leadersOnly ? ["Mercer","Aon","WTW","Deloitte Human Capital","Korn Ferry"].includes(p.name) : true);

  const rows = peers.map(p => ({ name:p.name, ai: p.name===base.name ? Math.round(p.ai*(1+whatIf/100)) : p.ai, sentiment:p.sentiment }))
                    .sort((a,b)=> b.ai - a.ai);
  const rank = rows.findIndex(r => r.name===base.name) + 1;

  return (
    <div style={{ display:"grid", gap:12 }}>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
        <label>Company:
          <select value={company} onChange={e=>setCompany(e.target.value)} style={{ marginLeft:6 }}>
            {PEER_POOL.map(p=><option key={p.name}>{p.name}</option>)}
          </select>
        </label>
        <label style={{ display:"flex", alignItems:"center", gap:6 }}>
          <input type="checkbox" checked={leadersOnly} onChange={e=>setLeadersOnly(e.target.checked)}/> Leaders only
        </label>
        <label style={{ display:"flex", alignItems:"center", gap:6 }}>
          What‑if AI +%
          <input type="number" value={whatIf} onChange={e=>setWhatIf(parseFloat(e.target.value||0))} style={{ width:80 }}/>
        </label>
        <Badge text={`Current rank: ${rank}/${rows.length}`} tone="info" />
      </div>

      <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:12 }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={rows} layout="vertical" margin={{ left: 80 }}>
            <CartesianGrid stroke="#F3F4F6" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" />
            <Tooltip />
            <Bar dataKey="ai" name="AI Adoption %" fill="#6366F1" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/** Pro‑6) CompanyHeatmaps (tile choropleth) */
const REGIONS = [
  { region:"North America", value:78, hq:6, hiring:320, rnd:12 },
  { region:"Europe", value:65, hq:5, hiring:260, rnd:9 },
  { region:"APAC", value:72, hq:7, hiring:340, rnd:11 },
  { region:"LATAM", value:40, hq:2, hiring:120, rnd:3 },
  { region:"MEA", value:35, hq:2, hiring:90, rnd:2 },
];
function colorScale(v) { const a = Math.round(40 + (v/100)*140); return `rgba(20,184,166,${a/255})`; }
function CompanyHeatmaps() {
  const [layer, setLayer] = useState("value");
  return (
    <div style={{ display:"grid", gap:12 }}>
      <div>
        <label>Layer:
          <select value={layer} onChange={e=>setLayer(e.target.value)} style={{ marginLeft:6 }}>
            <option value="value">Presence</option>
            <option value="hiring">Hiring</option>
            <option value="rnd">R&D centers</option>
            <option value="hq">HQ density</option>
          </select>
        </label>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px,1fr))", gap:12 }}>
        {REGIONS.map(r=>{
          const val = r[layer] ?? r.value;
          const pct = layer==="value" ? val : Math.min(100, (val/400)*100);
          return (
            <div key={r.region} style={{ border:"1px solid #E5E7EB", borderRadius:12, overflow:"hidden" }}>
              <div style={{ background:colorScale(pct), height:90 }} />
              <div style={{ padding:10 }}>
                <div style={{ fontWeight:700 }}>{r.region}</div>
                <div style={{ fontSize:12, color:"#6B7280" }}>{layer==="value"?"Presence":layer==="hiring"?"Hiring":layer==="rnd"?"R&D centers":"HQs"}: {val}</div>
                <button onClick={()=>alert(`Open drilldown for ${r.region}`)} style={{ marginTop:6, padding:"6px 10px", border:"1px solid #E5E7EB", borderRadius:8, background:"#fff", cursor:"pointer", fontSize:12 }}>
                  View companies
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Pro‑7) CompareMultipleCompanies (radar + trends) */
const CMP = [
  { name:"Mercer", ai:64, remote:48, invest:3.6, sentiment:72, trend:{ ai:3, remote:1, invest:0.2, sentiment:-1 } },
  { name:"Aon", ai:62, remote:46, invest:3.4, sentiment:70, trend:{ ai:2, remote:1, invest:0.1, sentiment:1 } },
  { name:"Korn Ferry", ai:58, remote:42, invest:2.9, sentiment:68, trend:{ ai:1, remote:0, invest:0.0, sentiment:1 } },
  { name:"WTW", ai:59, remote:44, invest:3.1, sentiment:66, trend:{ ai:1, remote:1, invest:0.1, sentiment:0 } },
  { name:"Deloitte Human Capital", ai:66, remote:50, invest:4.0, sentiment:73, trend:{ ai:2, remote:2, invest:0.3, sentiment:1 } },
];
const arrow = (v) => v>0 ? `↑ ${v}` : v<0 ? `↓ ${Math.abs(v)}` : "→ 0";
function CompareMultipleCompanies() {
  const [a, setA] = useState("Mercer");
  const [b, setB] = useState("Aon");
  const A = CMP.find(x=>x.name===a) || CMP[0];
  const B = CMP.find(x=>x.name===b) || CMP[1];
  const radarData = [
    { metric:"AI Adoption %", A:A.ai, B:B.ai },
    { metric:"Remote Work %", A:A.remote, B:B.remote },
    { metric:"Investment (B)", A:A.invest, B:B.invest },
    { metric:"Sentiment %", A:A.sentiment, B:B.sentiment },
  ];
  return (
    <div style={{ display:"grid", gap:12 }}>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
        <label>Company A:<select value={a} onChange={e=>setA(e.target.value)} style={{ marginLeft:6 }}>{CMP.map(c=><option key={c.name}>{c.name}</option>)}</select></label>
        <label>Company B:<select value={b} onChange={e=>setB(e.target.value)} style={{ marginLeft:6 }}>{CMP.map(c=><option key={c.name}>{c.name}</option>)}</select></label>
        <button onClick={()=>window.print()} style={{ marginLeft:"auto", padding:"8px 12px", border:"1px solid #E5E7EB", borderRadius:8, background:"#fff" }}>Export view</button>
      </div>
      <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:12 }}>
        <ResponsiveContainer width="100%" height={340}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize:11 }}/>
            <PolarRadiusAxis />
            <Radar name={A.name} dataKey="A" stroke="#111827" fill="#111827" fillOpacity={0.3}/>
            <Radar name={B.name} dataKey="B" stroke="#6366F1" fill="#6366F1" fillOpacity={0.25}/>
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px,1fr))", gap:10 }}>
        <div style={{ background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:12, padding:10 }}>
          <div style={{ fontWeight:700, marginBottom:6 }}>{A.name} — trend</div>
          <div style={{ fontSize:13, display:"grid", gap:3 }}>
            <div>AI: {arrow(A.trend.ai)}%</div>
            <div>Remote: {arrow(A.trend.remote)}%</div>
            <div>Invest: {arrow(A.trend.invest)}B</div>
            <div>Sentiment: {arrow(A.trend.sentiment)}%</div>
          </div>
        </div>
        <div style={{ background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:12, padding:10 }}>
          <div style={{ fontWeight:700, marginBottom:6 }}>{B.name} — trend</div>
          <div style={{ fontSize:13, display:"grid", gap:3 }}>
            <div>AI: {arrow(B.trend.ai)}%</div>
            <div>Remote: {arrow(B.trend.remote)}%</div>
            <div>Invest: {arrow(B.trend.invest)}B</div>
            <div>Sentiment: {arrow(B.trend.sentiment)}%</div>
          </div>
        </div>
      </div>
      <div style={{ background:"#F0F9FF", border:"1px solid #BAE6FD", borderRadius:12, padding:12, fontSize:13 }}>
        <strong>AI Competitive Edge:</strong> {A.name} leads in sentiment and AI adoption vs {B.name}; {B.name} is close on remote readiness. Priority for {B.name}: scale AI programs to close the gap.
      </div>
    </div>
  );
}

/** Pro‑8) MonthlyInsightReports */
function MonthlyInsightReports() {
  const [brand, setBrand] = useState("kayG.ai — Pro");
  const [role, setRole] = useState("CHRO");
  const [include, setInclude] = useState({ industry:true, competitors:true, mykpis:true, narrative:true });

  const summary = `Executive Summary for ${role}: AI adoption rises among leaders, with skills-based talent models accelerating. Compensation innovation and hybrid work remain hot. Expect steady consolidation and increased HR analytics investment.`;

  return (
    <div style={{ display:"grid", gap:12 }}>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        <label>Brand:<input value={brand} onChange={e=>setBrand(e.target.value)} style={{ marginLeft:6 }}/></label>
        <label>Role:
          <select value={role} onChange={e=>setRole(e.target.value)} style={{ marginLeft:6 }}>
            <option>CHRO</option><option>CEO</option><option>CFO</option><option>CTO</option>
          </select>
        </label>
      </div>
      <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
        {Object.keys(include).map(k=>(
          <label key={k} style={{ display:"flex", alignItems:"center", gap:6 }}>
            <input type="checkbox" checked={include[k]} onChange={e=>setInclude(s=>({...s,[k]:e.target.checked}))}/>
            {k}
          </label>
        ))}
      </div>

      <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:16 }}>
        <div style={{ fontSize:18, fontWeight:800, marginBottom:6 }}>{brand} — Monthly Insights</div>

        {include.narrative && (
          <div style={{ background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:12, padding:12, marginBottom:12 }}>
            <div style={{ fontWeight:700, marginBottom:6 }}>Executive Summary</div>
            <div style={{ fontSize:13 }}>{summary}</div>
          </div>
        )}

        {include.industry && (
          <div style={{ marginBottom:12 }}>
            <div style={{ fontWeight:700, marginBottom:6 }}>Industry Trend Snapshot</div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={[{m:"Jan",v:60},{m:"Feb",v:62},{m:"Mar",v:65},{m:"Apr",v:67},{m:"May",v:69},{m:"Jun",v:70}]}>
                <CartesianGrid stroke="#F3F4F6" />
                <XAxis dataKey="m" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Line dataKey="v" name="Sentiment" stroke="#6366F1" strokeWidth={2}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {include.competitors && (
          <div style={{ marginBottom:12 }}>
            <div style={{ fontWeight:700, marginBottom:6 }}>Competitor AI Adoption</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={CMP}>
                <CartesianGrid stroke="#F3F4F6" />
                <XAxis dataKey="name" hide />
                <YAxis />
                <Tooltip />
                <Bar dataKey="ai" name="AI Adoption %" fill="#10B981"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {include.mykpis && (
          <div>
            <div style={{ fontWeight:700, marginBottom:6 }}>My KPIs (placeholder)</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px,1fr))", gap:10 }}>
              <div><div style={{ fontSize:11, color:"#6B7280" }}>AI Adoption</div><div style={{ fontWeight:700 }}>62%</div></div>
              <div><div style={{ fontSize:11, color:"#6B7280" }}>Remote %</div><div style={{ fontWeight:700 }}>46%</div></div>
              <div><div style={{ fontSize:11, color:"#6B7280" }}>HR Tech Invest</div><div style={{ fontWeight:700 }}>$3.4B</div></div>
              <div><div style={{ fontSize:11, color:"#6B7280" }}>Sentiment</div><div style={{ fontWeight:700 }}>70%</div></div>
            </div>
          </div>
        )}
      </div>

      <div style={{ display:"flex", gap:8 }}>
        <button onClick={()=>window.print()} style={{ padding:"8px 12px", border:"1px solid #E5E7EB", borderRadius:8, background:"#fff" }}>
          Download / Print
        </button>
        <button onClick={()=>alert("White-label export ready (mock).")} style={{ padding:"8px 12px", border:"1px solid #E5E7EB", borderRadius:8, background:"#fff" }}>
          White-label Export
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------
   MAIN APP (tabs for Tier 1 / Pro)
-------------------------------------------- */
export default function App() {
  usePoppins();
  const [tab, setTab] = useState("tier1");

  return (
    <div style={{ fontFamily:"'Poppins', sans-serif", padding:"20px", background:"#F5F7FB", minHeight:"100vh" }}>
      <h1 style={{ margin:"0 0 12px", letterSpacing:"0.2px" }}>KayG — HR Tech Intelligence</h1>
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        <button onClick={()=>setTab("tier1")} style={{ padding:"8px 12px", borderRadius:8, border:"1px solid #E5E7EB", background: tab==="tier1"?"#111827":"#fff", color: tab==="tier1"?"#fff":"#111827" }}>
          Tier 1 (Core)
        </button>
        <button onClick={()=>setTab("pro")} style={{ padding:"8px 12px", borderRadius:8, border:"1px solid #E5E7EB", background: tab==="pro"?"#111827":"#fff", color: tab==="pro"?"#fff":"#111827" }}>
          Tier 2 (Pro)
        </button>
      </div>

      {tab === "tier1" ? (
        <div style={{ display:"grid", gap:16 }}>
          <KPIDashboard />
          <SentimentAnalysis />
          <TopicCategorization />
          <DataVisualizations />
          <PersonalizedFeed />
          <CompanyCards />
          <PeopleCards />
          <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:12 }}>
            <div style={{ fontWeight:700, marginBottom:8 }}>Benchmarking</div>
            <BenchmarkingTool />
          </div>
          <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:12 }}>
            <div style={{ fontWeight:700, marginBottom:8 }}>Real‑Time News</div>
            <RealTimeNewsAggregator />
          </div>
        </div>
      ) : (
        <div style={{ display:"grid", gap:16 }}>
          <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:12 }}>
            <div style={{ fontWeight:700, marginBottom:8 }}>Trend Prediction</div>
            <TrendPrediction />
          </div>

          <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:12 }}>
            <div style={{ fontWeight:700, marginBottom:8 }}>Talent Movement Tracker</div>
            <TalentMovementTracker />
          </div>

          <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:12 }}>
            <div style={{ fontWeight:700, marginBottom:8 }}>Sentiment vs. Reality Analyzer</div>
            <SentimentVsRealityAnalyzer />
          </div>

          <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:12 }}>
            <div style={{ fontWeight:700, marginBottom:8 }}>Timeline Explorer</div>
            <TimelineExplorer />
          </div>

          <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:12 }}>
            <div style={{ fontWeight:700, marginBottom:8 }}>Dynamic Peer Benchmarking</div>
            <DynamicPeerBenchmarking />
          </div>

          <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:12 }}>
            <div style={{ fontWeight:700, marginBottom:8 }}>Company Heatmaps</div>
            <CompanyHeatmaps />
          </div>

          <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:12 }}>
            <div style={{ fontWeight:700, marginBottom:8 }}>Compare Multiple Companies</div>
            <CompareMultipleCompanies />
          </div>

          <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:12 }}>
            <div style={{ fontWeight:700, marginBottom:8 }}>Monthly Insight Reports</div>
            <MonthlyInsightReports />
          </div>
        </div>
      )}
    </div>
  );
}
