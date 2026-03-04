import { useState, useEffect, useMemo, useCallback } from "react";
import { BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend, PieChart, Pie } from "recharts";

const SB="https://emmzgzwrohwznoghqudq.supabase.co";
const SK="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtbXpnendyb2h3em5vZ2hxdWRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NjU0NTgsImV4cCI6MjA4ODA0MTQ1OH0.0lw51fPKvk4KeS-7DaIW6WCn0AmuipSj0uwKlxYAbKQ";
async function sbGet(p){const a=[];let o=0;while(true){const s=p.includes("?")?"&":"?",r=await fetch(`${SB}/rest/v1/${p}${s}limit=1000&offset=${o}`,{headers:{apikey:SK,Authorization:`Bearer ${SK}`}});if(!r.ok)throw new Error(`HTTP ${r.status}`);const d=await r.json();if(!Array.isArray(d)||!d.length)break;a.push(...d);if(d.length<1000)break;o+=1000;}return a;}

/* ── Theme ── */
const T={
  bg:"#060b14",sf:"#0d1520",sfh:"#131d2e",bd:"#1a2740",
  tx:"#e8edf5",txs:"#c4cdd9",tm:"#94a3b8",td:"#64748b",
  em:"#059669",el:"#34d399",ed:"#047857",
  go:"#f59e0b",rd:"#ef4444",or:"#f97316",bl:"#3b82f6",pp:"#8b5cf6"
};

/* ── Constants ── */
const CL={Excelente:{c:T.el,e:"\u{1F7E2}"},Bom:{c:T.bl,e:"\u{1F535}"},Regular:{c:T.go,e:"\u{1F7E1}"},Preocupante:{c:T.or,e:"\u{1F7E0}"},"Cr\u00edtico":{c:T.rd,e:"\u{1F534}"}};
const gc=s=>s>=850?"Excelente":s>=700?"Bom":s>=500?"Regular":s>=300?"Preocupante":"Cr\u00edtico";
const CAPAG_CL={"A+":{c:"#34d399",l:"Excelente capacidade de pagamento",e:"\u{1F7E2}"},"A":{c:"#34d399",l:"Boa capacidade de pagamento",e:"\u{1F7E2}"},"B+":{c:"#3b82f6",l:"Capacidade de pagamento boa",e:"\u{1F535}"},"B":{c:"#3b82f6",l:"Capacidade de pagamento aceit\u00e1vel",e:"\u{1F535}"},"C":{c:"#f59e0b",l:"Capacidade de pagamento fraca",e:"\u{1F7E1}"},"D":{c:"#ef4444",l:"Sem capacidade de pagamento",e:"\u{1F534}"},"n.e.":{c:"#64748b",l:"N\u00e3o eleg\u00edvel",e:"\u26AA"},"n.d.":{c:"#64748b",l:"Dados n\u00e3o dispon\u00edveis",e:"\u26AA"},"#N/A":{c:"#64748b",l:"Sem dados",e:"\u26AA"}};
const UF=["AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT","PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO"];
const RG={N:["AC","AM","AP","PA","RO","RR","TO"],NE:["AL","BA","CE","MA","PB","PE","PI","RN","SE"],CO:["DF","GO","MS","MT"],SE:["ES","MG","RJ","SP"],S:["PR","RS","SC"]};
const gr=u=>{for(const[r,us]of Object.entries(RG))if(us.includes(u))return r;return"";};
const fN=v=>v==null?"\u2014":Math.abs(v)>=1e9?`R$ ${(v/1e9).toFixed(1)}B`:Math.abs(v)>=1e6?`R$ ${(v/1e6).toFixed(1)}M`:Math.abs(v)>=1e3?`R$ ${(v/1e3).toFixed(0)}K`:`R$ ${v.toFixed(0)}`;
const fP=v=>v==null?"\u2014":`${v.toFixed(1)}%`;
const fPo=v=>!v?"\u2014":v>=1e6?`${(v/1e6).toFixed(1)}M`:v>=1e3?`${(v/1e3).toFixed(0)} mil`:`${v}`;
const pt=p=>!p?"?":p>500000?"Metr\u00f3pole":p>100000?"Grande":p>50000?"M\u00e9dio":p>20000?"Pequeno":"Micro";
const dc=s=>s>=700?T.el:s>=400?T.go:T.rd;

/* ── Brazil tile grid positions ── */
const STATE_GRID={
  RR:{c:3,r:0},AP:{c:5,r:0},
  AM:{c:1,r:1},PA:{c:3,r:1},MA:{c:5,r:1},CE:{c:6,r:1},RN:{c:7,r:1},PB:{c:8,r:1},
  AC:{c:0,r:2},TO:{c:4,r:2},PI:{c:5,r:2},PE:{c:8,r:2},AL:{c:9,r:2},
  RO:{c:2,r:3},BA:{c:6,r:3},SE:{c:8,r:3},
  MT:{c:2,r:4},GO:{c:4,r:4},DF:{c:5,r:4},MG:{c:6,r:4},ES:{c:8,r:4},RJ:{c:7,r:5},
  MS:{c:3,r:5},SP:{c:5,r:5},PR:{c:6,r:5},
  SC:{c:6,r:6},RS:{c:5,r:7}
};

/* ── Components ── */
function Gauge({score,size=160}){
  if(score==null)return <div style={{textAlign:"center",padding:20}}><div style={{fontSize:24,color:T.td}}>{"\u2014"}</div><div style={{fontSize:11,color:T.td}}>Sem score SICONFI</div></div>;
  const cl=gc(score),cf=CL[cl],pct=Math.min(score/1000,1),r=size/2-16,ci=Math.PI*r,of=ci*(1-pct);
  return <div style={{textAlign:"center"}}><svg width={size} height={size/2+30} viewBox={`0 0 ${size} ${size/2+30}`}>
    <path d={`M 16 ${size/2+4} A ${r} ${r} 0 0 1 ${size-16} ${size/2+4}`} fill="none" stroke={T.bd} strokeWidth="10" strokeLinecap="round"/>
    <path d={`M 16 ${size/2+4} A ${r} ${r} 0 0 1 ${size-16} ${size/2+4}`} fill="none" stroke={cf.c} strokeWidth="10" strokeLinecap="round" strokeDasharray={ci} strokeDashoffset={of} style={{transition:"stroke-dashoffset 1s ease"}}/>
    <text x={size/2} y={size/2-8} textAnchor="middle" fill={cf.c} style={{fontSize:size>140?"36px":"24px",fontWeight:700}}>{Math.round(score)}</text>
    <text x={size/2} y={size/2+18} textAnchor="middle" fill={T.txs} style={{fontSize:"12px"}}>{cf.e} {cl}</text>
  </svg></div>;
}

function CapagBadge({capag,size="md"}){
  const info=CAPAG_CL[capag]||CAPAG_CL["n.d."];
  const fs=size==="sm"?11:size==="lg"?16:13;
  const pd=size==="sm"?"2px 8px":size==="lg"?"6px 16px":"3px 10px";
  return <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:pd,borderRadius:99,fontSize:fs,fontWeight:700,background:`${info.c}18`,color:info.c,border:`1.5px solid ${info.c}44`,letterSpacing:".02em"}}>{info.e} CAPAG {capag||"\u2014"}</span>;
}

function SiconfiFlag(){
  return <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:99,fontSize:10,fontWeight:600,background:`${T.or}18`,color:T.or,border:`1px solid ${T.or}44`}}>{"\u26A0"} Pendente SICONFI</span>;
}

/* ── Brazil Tile Map ── */
function BrazilMap({stateData, onStateClick, selectedUf}){
  const TILE=52, GAP=4, COLS=10, ROWS=8;
  const w=COLS*(TILE+GAP)+GAP, h=ROWS*(TILE+GAP)+GAP;
  return <svg viewBox={`0 0 ${w} ${h}`} style={{width:"100%",maxWidth:560,height:"auto"}}>
    {Object.entries(STATE_GRID).map(([uf,pos])=>{
      const d=stateData[uf]||{};
      const avg=d.avg;
      const fill=avg!=null?(avg>=700?"#059669":avg>=500?"#0d6e4e":avg>=300?"#b45309":"#b91c1c"):"#1e293b";
      const x=GAP+pos.c*(TILE+GAP), y=GAP+pos.r*(TILE+GAP);
      const isSel=selectedUf===uf;
      return <g key={uf} onClick={()=>onStateClick(uf)} style={{cursor:"pointer"}}>
        <rect x={x} y={y} width={TILE} height={TILE} rx={8} fill={fill} stroke={isSel?"#fff":fill} strokeWidth={isSel?2.5:0} opacity={isSel?1:0.85}
          onMouseEnter={e=>e.target.setAttribute("opacity","1")}
          onMouseLeave={e=>e.target.setAttribute("opacity",isSel?"1":"0.85")}/>
        <text x={x+TILE/2} y={y+TILE/2-4} textAnchor="middle" fill="#fff" style={{fontSize:"13px",fontWeight:700,pointerEvents:"none"}}>{uf}</text>
        <text x={x+TILE/2} y={y+TILE/2+12} textAnchor="middle" fill="rgba(255,255,255,0.7)" style={{fontSize:"10px",fontWeight:500,pointerEvents:"none"}}>{avg!=null?Math.round(avg):"\u2014"}</text>
      </g>;
    })}
  </svg>;
}

/* ── Main App ── */
export default function App(){
  const[muns,setMuns]=useState([]);const[ld,setLd]=useState(true);const[er,setEr]=useState(null);
  const[tab,setTab]=useState("home");const[srch,setSrch]=useState("");const[ufF,setUfF]=useState("");
  const[rgF,setRgF]=useState("");const[clF,setClF]=useState("");const[cpF,setCpF]=useState("");
  const[siF,setSiF]=useState("");const[sBy,setSBy]=useState("sf");const[sDir,setSDir]=useState("desc");
  const[sel,setSel]=useState(null);const[cmp,setCmp]=useState(null);
  const[pg,setPg]=useState(0);const PP=50;
  const[homeSrch,setHomeSrch]=useState("");const[homeResults,setHomeResults]=useState([]);

  useEffect(()=>{(async()=>{try{setLd(true);
    const[m,f,s,cp]=await Promise.all([sbGet("municipios?select=cod_ibge,nome,uf,populacao"),sbGet("financeiro_anual?select=*&ano=eq.2024"),sbGet("scores?select=*&ano=eq.2024"),sbGet("capag?select=*&ano=eq.2024")]);
    const fm={};f.forEach(x=>fm[x.cod_ibge]=x);const sm={};s.forEach(x=>sm[x.cod_ibge]=x);const cm={};cp.forEach(x=>cm[x.cod_ibge]=x);
    const seen=new Set();
    const j=m.filter(x=>{if(!cm[x.cod_ibge]&&!sm[x.cod_ibge])return false;if(seen.has(x.cod_ibge))return false;seen.add(x.cod_ibge);return true;}).map(x=>{
      const fi=fm[x.cod_ibge]||{},sc=sm[x.cod_ibge]||null,ca=cm[x.cod_ibge]||{};
      const hasSiconfi=!!sc;
      return{
      cod_ibge:x.cod_ibge,nome:x.nome,uf:x.uf,pop:x.populacao,reg:gr(x.uf),cls:pt(x.populacao),hasSiconfi,
      rt:fi.receita_total||null,rp:fi.receita_propria||null,tr:fi.transferencias_total||null,dp:fi.despesa_pessoal||null,rcl:fi.rcl||null,
      dpr:fi.despesa_pessoal_pct_rcl||null,dvc:fi.divida_consolidada||null,dvr:fi.divida_pct_rcl||null,
      sa:sc?sc.score_autonomia||0:null,sp:sc?sc.score_pessoal||0:null,se:sc?sc.score_endividamento||0:null,ss:sc?sc.score_social||0:null,
      sf:sc?sc.score_final||0:null,cl:sc?(sc.classificacao||gc(sc.score_final||0)):null,
      capag:ca.capag||null,capag_end:ca.nota_endividamento,capag_poup:ca.nota_poupanca,capag_liq:ca.nota_liquidez,
      capag_ind_end:ca.indicador_endividamento,capag_ind_poup:ca.indicador_poupanca,capag_ind_liq:ca.indicador_liquidez,
      capag_icf:ca.icf,capag_ajuste:ca.ajuste_score||0};});
    j.sort((a,b)=>(b.sf??-1)-(a.sf??-1));setMuns(j);if(j.length)setSel(j[0]);setLd(false);
  }catch(e){setEr(e.message);setLd(false);}})();},[]);

  /* Filters */
  const fl=useMemo(()=>{let l=muns;if(srch){const q=srch.toLowerCase();l=l.filter(m=>m.nome.toLowerCase().includes(q));}
    if(ufF)l=l.filter(m=>m.uf===ufF);if(rgF)l=l.filter(m=>m.reg===rgF);if(clF)l=l.filter(m=>m.cls===clF);
    if(cpF)l=l.filter(m=>m.capag===cpF);
    if(siF==="sim")l=l.filter(m=>m.hasSiconfi);if(siF==="nao")l=l.filter(m=>!m.hasSiconfi);
    return[...l].sort((a,b)=>{const va=a[sBy]??-1,vb=b[sBy]??-1;return sDir==="desc"?vb-va:va-vb;});},[muns,srch,ufF,rgF,clF,cpF,siF,sBy,sDir]);
  const pd=useMemo(()=>fl.slice(pg*PP,(pg+1)*PP),[fl,pg]);const tp=Math.ceil(fl.length/PP);
  const nSic=useMemo(()=>muns.filter(m=>m.hasSiconfi).length,[muns]);
  const nNoSic=useMemo(()=>muns.filter(m=>!m.hasSiconfi).length,[muns]);
  const st=useMemo(()=>{if(!muns.length)return null;const scored=muns.filter(m=>m.sf!=null);const avg=scored.length?scored.reduce((a,b)=>a+b.sf,0)/scored.length:0;const cc={};Object.keys(CL).forEach(k=>cc[k]=0);scored.forEach(m=>{if(m.cl)cc[m.cl]=(cc[m.cl]||0)+1;});const cpc={};muns.forEach(m=>{const k=m.capag||"s/d";cpc[k]=(cpc[k]||0)+1;});return{avg,n:muns.length,nScored:scored.length,cc,cpc};},[muns]);
  const pk=useCallback(m=>{if(tab==="comp"&&sel&&sel.cod_ibge!==m.cod_ibge)setCmp(m);else setSel(m);},[tab,sel]);

  /* State averages for map */
  const stateData=useMemo(()=>{
    const d={};
    UF.forEach(uf=>{
      const ms=muns.filter(m=>m.uf===uf&&m.sf!=null);
      const all=muns.filter(m=>m.uf===uf);
      if(all.length){
        d[uf]={avg:ms.length?Math.round(ms.reduce((a,b)=>a+b.sf,0)/ms.length):null,n:all.length,nScored:ms.length};
      }
    });
    return d;
  },[muns]);

  /* Home search */
  useEffect(()=>{
    if(!homeSrch.trim()){setHomeResults([]);return;}
    const q=homeSrch.toLowerCase();
    setHomeResults(muns.filter(m=>m.nome.toLowerCase().includes(q)).slice(0,8));
  },[homeSrch,muns]);

  /* ── Styles ── */
  const font="'Outfit',system-ui,sans-serif";
  const sC={background:T.sf,border:`1px solid ${T.bd}`,borderRadius:"12px",padding:"20px"};
  const sI={background:T.sf,border:`1px solid ${T.bd}`,borderRadius:"8px",padding:"8px 12px",color:T.tx,fontSize:"13px",fontFamily:font,outline:"none"};
  const sS={...sI,cursor:"pointer"};
  const sTb=a=>({padding:"8px 16px",borderRadius:"8px",border:"none",cursor:"pointer",fontSize:"13px",fontWeight:600,fontFamily:font,background:a?T.ed:"transparent",color:a?"#fff":T.tm,transition:"all .2s"});
  const sB=c=>({display:"inline-block",padding:"2px 10px",borderRadius:"99px",fontSize:"11px",fontWeight:600,background:`${c}22`,color:c,border:`1px solid ${c}44`});

  if(ld)return <div style={{background:T.bg,color:T.tx,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",gap:16,fontFamily:font}}>
    <div style={{width:48,height:48,border:`3px solid ${T.bd}`,borderTopColor:T.em,borderRadius:"50%",animation:"spin 1s linear infinite"}}/><div style={{color:T.tm}}>Carregando dados do Tesouro Nacional...</div><style>{`@keyframes spin{to{transform:rotate(360deg)}}@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');`}</style></div>;
  if(er)return <div style={{background:T.bg,color:T.tx,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",gap:12,fontFamily:font}}>
    <div style={{fontSize:40}}>{"\u26A0\uFE0F"}</div><div style={{color:T.rd,fontSize:18}}>Erro: {er}</div></div>;

return <div style={{background:T.bg,color:T.tx,fontFamily:font,minHeight:"100vh",fontSize:"14px"}}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');`}</style>

    {/* ── Header ── */}
    <div style={{background:"linear-gradient(135deg,#060b14,#0a1628,#0d1f3c)",borderBottom:`1px solid ${T.bd}`,padding:"16px 24px"}}>
      <div style={{maxWidth:1200,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
        <div style={{cursor:"pointer"}} onClick={()=>setTab("home")}>
          <h1 style={{fontWeight:800,fontSize:26,margin:0}}><span style={{color:T.el}}>Muni</span><span style={{color:"#fff"}}>Score</span><span style={{color:T.go,fontSize:13,fontWeight:500,marginLeft:8}}>Brasil</span></h1>
          <p style={{margin:"2px 0 0",fontSize:12,color:T.tm}}>{"Sa\u00fade fiscal de "}{st?.n.toLocaleString()}{" munic\u00edpios \u00b7 SICONFI + CAPAG 2024"}</p>
        </div>
        <div style={{display:"flex",gap:4,background:T.bg,padding:3,borderRadius:10,border:`1px solid ${T.bd}`}}>
          {[["home","In\u00edcio"],["ranking","Ranking"],["visao","Vis\u00e3o Geral"],["comp","Comparativo"],["panorama","Panorama"]].map(([id,l])=><button key={id} style={sTb(tab===id)} onClick={()=>setTab(id)}>{l}</button>)}
        </div>
      </div>
    </div>

    <div style={{maxWidth:1200,margin:"0 auto",padding:"24px 24px 60px"}}>

    {/* ══════════════════ HOME ══════════════════ */}
    {tab==="home"&&st&&<div>
      {/* Hero */}
      <div style={{textAlign:"center",marginBottom:32,paddingTop:8}}>
        <h2 style={{fontSize:32,fontWeight:800,margin:"0 0 8px",color:"#fff",letterSpacing:"-0.02em"}}>{"Panorama Fiscal dos Munic\u00edpios"}</h2>
        <p style={{color:T.tm,fontSize:15,margin:0,maxWidth:560,marginLeft:"auto",marginRight:"auto"}}>{"Explore a sa\u00fade financeira de "}{st.n.toLocaleString()}{" munic\u00edpios brasileiros com dados oficiais do Tesouro Nacional."}</p>
      </div>

      {/* Search Bar */}
      <div style={{maxWidth:520,margin:"0 auto 32px",position:"relative"}}>
        <div style={{position:"relative"}}>
          <span style={{position:"absolute",left:16,top:"50%",transform:"translateY(-50%)",fontSize:18,pointerEvents:"none"}}>{"\uD83D\uDD0D"}</span>
          <input
            style={{width:"100%",padding:"14px 16px 14px 48px",borderRadius:12,border:`2px solid ${T.bd}`,background:T.sf,color:T.tx,fontSize:16,fontFamily:font,outline:"none",boxSizing:"border-box",transition:"border-color .2s"}}
            placeholder={"Buscar munic\u00edpio..."}
            value={homeSrch}
            onChange={e=>setHomeSrch(e.target.value)}
            onFocus={e=>e.target.style.borderColor=T.el}
            onBlur={e=>{setTimeout(()=>{e.target.style.borderColor=T.bd;},200);}}
          />
        </div>
        {homeResults.length>0&&<div style={{position:"absolute",top:"100%",left:0,right:0,background:T.sf,border:`1px solid ${T.bd}`,borderRadius:12,marginTop:4,overflow:"hidden",zIndex:50,boxShadow:"0 12px 40px rgba(0,0,0,.5)"}}>
          {homeResults.map(m=>{const cf=m.cl?CL[m.cl]:null;return <div key={m.cod_ibge} style={{padding:"12px 16px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${T.bd}`}}
            onClick={()=>{setSel(m);setTab("visao");setHomeSrch("");setHomeResults([]);}}
            onMouseEnter={e=>e.currentTarget.style.background=T.sfh}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div><div style={{fontWeight:600,color:T.tx,fontSize:14}}>{m.nome}</div><div style={{fontSize:11,color:T.tm}}>{m.uf}{" \u00b7 "}{fPo(m.pop)}{" \u00b7 "}{m.cls}</div></div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              {cf&&<span style={{fontWeight:700,color:cf.c,fontSize:16}}>{Math.round(m.sf)}</span>}
              <CapagBadge capag={m.capag} size="sm"/>
            </div>
          </div>;})}
        </div>}
      </div>

      {/* Stats Row */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:28}}>
        <div style={{...sC,textAlign:"center"}}><div style={{fontSize:11,color:T.tm,marginBottom:6,textTransform:"uppercase",letterSpacing:".06em"}}>{"Munic\u00edpios"}</div><div style={{fontWeight:800,fontSize:30,color:T.el}}>{st.n.toLocaleString()}</div></div>
        <div style={{...sC,textAlign:"center"}}><div style={{fontSize:11,color:T.tm,marginBottom:6,textTransform:"uppercase",letterSpacing:".06em"}}>{"Score M\u00e9dio"}</div><div style={{fontWeight:800,fontSize:30,color:(CL[gc(st.avg)]||{c:T.tm}).c}}>{Math.round(st.avg)}</div></div>
        <div style={{...sC,textAlign:"center"}}><div style={{fontSize:11,color:T.tm,marginBottom:6,textTransform:"uppercase",letterSpacing:".06em"}}>SICONFI Completo</div><div style={{fontWeight:800,fontSize:30,color:T.el}}>{nSic.toLocaleString()}</div></div>
        <div style={{...sC,textAlign:"center"}}><div style={{fontSize:11,color:T.tm,marginBottom:6,textTransform:"uppercase",letterSpacing:".06em"}}>Pendentes</div><div style={{fontWeight:800,fontSize:30,color:T.or}}>{nNoSic.toLocaleString()}</div></div>
      </div>

      {/* Map + Sidebar */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:20,marginBottom:28}}>
        {/* Map */}
        <div style={{...sC,display:"flex",flexDirection:"column",alignItems:"center"}}>
          <h3 style={{fontWeight:700,fontSize:17,margin:"0 0 4px",color:"#fff",alignSelf:"flex-start"}}>{"Score M\u00e9dio por Estado"}</h3>
          <p style={{fontSize:12,color:T.tm,margin:"0 0 16px",alignSelf:"flex-start"}}>Clique em um estado para filtrar o ranking</p>
          <BrazilMap stateData={stateData} selectedUf={ufF}
            onStateClick={(uf)=>{setUfF(prev=>prev===uf?"":uf);setRgF("");setPg(0);setTab("ranking");}}/>
          <div style={{display:"flex",gap:16,marginTop:16,flexWrap:"wrap",justifyContent:"center"}}>
            {[{l:"\u2265700 Bom",c:"#059669"},{l:"500-699",c:"#0d6e4e"},{l:"300-499",c:"#b45309"},{l:"<300 Cr\u00edtico",c:"#b91c1c"},{l:"Sem dados",c:"#1e293b"}].map(x=>
              <div key={x.l} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:T.tm}}>
                <div style={{width:12,height:12,borderRadius:3,background:x.c}}/>{x.l}
              </div>
            )}
          </div>
        </div>

        {/* Classification + Quick Actions */}
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div style={sC}>
            <h3 style={{fontWeight:700,fontSize:15,margin:"0 0 14px",color:"#fff"}}>{"Classifica\u00e7\u00e3o Geral"}</h3>
            {Object.entries(st.cc).filter(([,v])=>v>0).map(([k,v])=>{const pct=(v/st.nScored*100);return <div key={k} style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontSize:13,fontWeight:600,color:(CL[k]||{c:T.tm}).c}}>{(CL[k]||{e:""}).e} {k}</span>
                <span style={{fontSize:12,color:T.txs}}>{v} ({pct.toFixed(0)}%)</span>
              </div>
              <div style={{height:6,background:T.bd,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:(CL[k]||{c:T.tm}).c,borderRadius:3,transition:"width .5s"}}/></div>
            </div>;})}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[["ranking","\uD83D\uDCCA","Ranking"],["comp","\u2696\uFE0F","Comparar"],["panorama","\uD83D\uDCC8","Panorama"],["visao","\uD83C\uDFDB\uFE0F","Detalhe"]].map(([t,ico,l])=>
              <div key={t} style={{...sC,cursor:"pointer",textAlign:"center",padding:"16px 12px",transition:"all .2s"}}
                onClick={()=>setTab(t)}
                onMouseEnter={e=>e.currentTarget.style.borderColor=T.el}
                onMouseLeave={e=>e.currentTarget.style.borderColor=T.bd}>
                <div style={{fontSize:24,marginBottom:6}}>{ico}</div>
                <div style={{fontSize:13,fontWeight:600,color:T.txs}}>{l}</div>
              </div>
            )}
          </div>
          {/* Top 5 mini */}
          <div style={sC}>
            <h3 style={{fontWeight:700,fontSize:15,margin:"0 0 10px",color:"#fff"}}>Top 5</h3>
            {muns.filter(m=>m.sf!=null).slice(0,5).map((m,i)=>
              <div key={m.cod_ibge} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:`1px solid ${T.bd}`,cursor:"pointer"}}
                onClick={()=>{setSel(m);setTab("visao");}}>
                <span style={{fontSize:12,color:T.txs}}><span style={{color:T.go,marginRight:6,fontWeight:700}}>{i+1}</span>{m.nome} <span style={{color:T.td}}>({m.uf})</span></span>
                <span style={{fontWeight:700,color:T.el,fontSize:13}}>{Math.round(m.sf)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>}

    {/* ══════════════════ RANKING ══════════════════ */}
    {tab==="ranking"&&<div>
      <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:20}}>
        <input style={{...sI,flex:"1 1 200px",minWidth:180}} placeholder={"Buscar munic\u00edpio..."} value={srch} onChange={e=>{setSrch(e.target.value);setPg(0);}}/>
        <select style={sS} value={rgF} onChange={e=>{setRgF(e.target.value);setUfF("");setPg(0);}}><option value="">{"Regi\u00e3o"}</option>{Object.keys(RG).map(r=><option key={r}>{r}</option>)}</select>
        <select style={sS} value={ufF} onChange={e=>{setUfF(e.target.value);setPg(0);}}><option value="">UF</option>{(rgF?RG[rgF]:UF).map(u=><option key={u}>{u}</option>)}</select>
        <select style={sS} value={clF} onChange={e=>{setClF(e.target.value);setPg(0);}}><option value="">Porte</option>{["Metr\u00f3pole","Grande","M\u00e9dio","Pequeno","Micro"].map(c=><option key={c}>{c}</option>)}</select>
        <select style={sS} value={cpF} onChange={e=>{setCpF(e.target.value);setPg(0);}}><option value="">CAPAG</option>{["A+","A","B+","B","C","D","n.e.","n.d."].map(c=><option key={c}>{c}</option>)}</select>
        <select style={sS} value={siF} onChange={e=>{setSiF(e.target.value);setPg(0);}}><option value="">SICONFI</option><option value="sim">Com dados</option><option value="nao">Pendente</option></select>
        <select style={sS} value={`${sBy}_${sDir}`} onChange={e=>{const[f,d]=e.target.value.split("_");setSBy(f);setSDir(d);setPg(0);}}><option value="sf_desc">Maior score</option><option value="sf_asc">Menor score</option><option value="pop_desc">Maior pop.</option><option value="sa_desc">Maior autonomia</option></select>
      </div>
      <div style={{color:T.tm,fontSize:12,marginBottom:12}}>{fl.length}{" munic\u00edpios \u2014 SICONFI + CAPAG 2024"}</div>
      <div style={{display:"flex",padding:"8px 16px",fontSize:11,color:T.tm,borderBottom:`1px solid ${T.bd}`,fontWeight:600,textTransform:"uppercase",letterSpacing:".05em"}}>
        <div style={{width:40}}>#</div><div style={{flex:"1 1 160px"}}>{"Munic\u00edpio"}</div><div style={{width:65,textAlign:"center"}}>Score</div><div style={{width:70,textAlign:"center"}}>CAPAG</div><div style={{width:80,textAlign:"center"}}>Class.</div><div style={{width:55,textAlign:"center"}}>Aut.</div><div style={{width:55,textAlign:"center"}}>Pes.</div><div style={{width:55,textAlign:"center"}}>{"D\u00edv."}</div><div style={{width:75,textAlign:"right"}}>Status</div>
      </div>
      {pd.map((m,i)=>{const rk=pg*PP+i+1,cf=m.cl?CL[m.cl]||CL.Regular:null,cpInfo=CAPAG_CL[m.capag]||CAPAG_CL["n.d."],is=sel&&sel.cod_ibge===m.cod_ibge;
        return <div key={m.cod_ibge} style={{display:"flex",alignItems:"center",padding:"10px 16px",borderBottom:`1px solid ${T.bd}`,cursor:"pointer",background:is?`${T.em}11`:m.hasSiconfi?"transparent":`${T.or}06`}} onClick={()=>pk(m)} onMouseEnter={e=>{if(!is)e.currentTarget.style.background=T.sfh;}} onMouseLeave={e=>{if(!is)e.currentTarget.style.background=m.hasSiconfi?"transparent":`${T.or}06`;}}>
          <div style={{width:40,color:rk<=3&&m.hasSiconfi?T.go:T.td,fontWeight:rk<=3&&m.hasSiconfi?700:400,fontSize:13}}>{rk<=3&&m.hasSiconfi?["\uD83E\uDD47","\uD83E\uDD48","\uD83E\uDD49"][rk-1]:rk}</div>
          <div style={{flex:"1 1 160px"}}><div style={{fontWeight:500,fontSize:14,color:T.tx}}>{m.nome}</div><div style={{fontSize:11,color:T.tm}}>{m.uf}{" \u00b7 "}{fPo(m.pop)}{" \u00b7 "}{m.cls}</div></div>
          <div style={{width:65,textAlign:"center",fontWeight:700,fontSize:16,color:cf?cf.c:T.td}}>{m.sf!=null?Math.round(m.sf):"\u2014"}</div>
          <div style={{width:70,textAlign:"center"}}><span style={{fontSize:11,fontWeight:700,color:cpInfo.c}}>{cpInfo.e}{m.capag||"\u2014"}</span></div>
          <div style={{width:80,textAlign:"center"}}>{cf?<span style={sB(cf.c)}>{cf.e} {m.cl}</span>:<SiconfiFlag/>}</div>
          <div style={{width:55,textAlign:"center",fontSize:13,color:m.sa!=null?dc(m.sa):T.td}}>{m.sa!=null?Math.round(m.sa):"\u2014"}</div>
          <div style={{width:55,textAlign:"center",fontSize:13,color:m.sp!=null?dc(m.sp):T.td}}>{m.sp!=null?Math.round(m.sp):"\u2014"}</div>
          <div style={{width:55,textAlign:"center",fontSize:13,color:m.se!=null?dc(m.se):T.td}}>{m.se!=null?Math.round(m.se):"\u2014"}</div>
          <div style={{width:75,textAlign:"right"}}>{m.hasSiconfi?<span style={{fontSize:10,color:T.el}}>{"\u2713"} Completo</span>:<span style={{fontSize:10,color:T.or}}>{"\u26A0"} Pendente</span>}</div>
        </div>;})}
      {tp>1&&<div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:12,padding:"20px 0"}}>
        <button onClick={()=>setPg(Math.max(0,pg-1))} disabled={pg===0} style={{...sTb(false),opacity:pg===0?.3:1}}>{"\u2190"}</button>
        <span style={{color:T.tm,fontSize:13}}>{pg+1}/{tp}</span>
        <button onClick={()=>setPg(Math.min(tp-1,pg+1))} disabled={pg>=tp-1} style={{...sTb(false),opacity:pg>=tp-1?.3:1}}>{"\u2192"}</button>
      </div>}
    </div>}

    {/* ══════════════════ VISÃO GERAL ══════════════════ */}
    {tab==="visao"&&(sel?<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
      {!sel.hasSiconfi&&<div style={{gridColumn:"1/-1",background:`${T.or}12`,border:`1px solid ${T.or}44`,borderRadius:12,padding:"14px 20px",display:"flex",alignItems:"center",gap:12}}>
        <span style={{fontSize:24}}>{"\u26A0\uFE0F"}</span>
        <div><div style={{fontWeight:600,color:T.or,fontSize:14}}>Dados SICONFI pendentes</div>
          <div style={{fontSize:12,color:T.txs}}>{"Este munic\u00edpio n\u00e3o entregou ou n\u00e3o teve dados processados do RREO/RGF 2024 no SICONFI. O score MuniScore n\u00e3o est\u00e1 dispon\u00edvel, mas os dados CAPAG do Tesouro Nacional est\u00e3o completos abaixo."}</div>
        </div>
      </div>}
      <div style={{...sC,gridColumn:"1/-1",display:"flex",alignItems:"center",gap:24,flexWrap:"wrap"}}>
        <Gauge score={sel.sf} size={160}/>
        <div style={{flex:1,minWidth:200}}>
          <h2 style={{fontWeight:700,fontSize:28,margin:"0 0 4px",color:"#fff"}}>{sel.nome}</h2>
          <div style={{color:T.txs,fontSize:14,marginBottom:8}}>{sel.uf}{" \u00b7 "}{fPo(sel.pop)}{" hab \u00b7 "}{sel.cls}</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
            {sel.cl&&<span style={sB((CL[sel.cl]||CL.Regular).c)}>{(CL[sel.cl]||CL.Regular).e} {sel.cl}</span>}
            <CapagBadge capag={sel.capag}/>
            {!sel.hasSiconfi&&<SiconfiFlag/>}
          </div>
        </div>
      </div>

      <div style={sC}>
        <h3 style={{fontWeight:600,fontSize:16,margin:"0 0 16px",color:"#fff"}}>{"CAPAG \u2014 Capacidade de Pagamento"}</h3>
        {(()=>{const info=CAPAG_CL[sel.capag]||CAPAG_CL["n.d."];return <div>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
            <span style={{fontSize:36,fontWeight:800,color:info.c}}>{sel.capag||"\u2014"}</span>
            <div><div style={{fontSize:14,fontWeight:600,color:info.c}}>{info.l}</div>
              <div style={{fontSize:11,color:T.tm}}>{"Tesouro Nacional \u00b7 Ano base 2024"}</div>
              {sel.capag_ajuste!==0&&<div style={{fontSize:11,color:sel.capag_ajuste>0?T.el:T.rd,marginTop:2}}>Ajuste no score: {sel.capag_ajuste>0?"+":""}{sel.capag_ajuste} pontos</div>}
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
            {[{l:"Endividamento",n:sel.capag_end,v:sel.capag_ind_end},{l:"Poupan\u00e7a",n:sel.capag_poup,v:sel.capag_ind_poup},{l:"Liquidez",n:sel.capag_liq,v:sel.capag_ind_liq}].map(x=>{
              const nc={"A":T.el,"B":T.bl,"C":T.go,"D":T.rd}[x.n]||T.td;
              return <div key={x.l} style={{padding:10,background:T.bg,borderRadius:8,border:`1px solid ${T.bd}`,textAlign:"center"}}>
                <div style={{fontSize:11,color:T.tm,marginBottom:4}}>{x.l}</div>
                <div style={{fontSize:22,fontWeight:700,color:nc}}>{x.n||"\u2014"}</div>
                {x.v!=null&&<div style={{fontSize:11,color:T.tm,marginTop:2}}>{(x.v*100).toFixed(1)}%</div>}
              </div>;})}
          </div>
          {sel.capag_icf&&<div style={{marginTop:10,fontSize:12,color:T.tm}}>{"ICF (Qualidade da Informa\u00e7\u00e3o): "}<span style={{fontWeight:600,color:T.txs}}>{sel.capag_icf}</span></div>}
        </div>;})()}
      </div>

      {sel.hasSiconfi?<div style={sC}>
        <h3 style={{fontWeight:600,fontSize:16,margin:"0 0 16px",color:"#fff"}}>Perfil MuniScore</h3>
        <ResponsiveContainer width="100%" height={250}><RadarChart data={[{d:"Autonomia",v:sel.sa},{d:"Pessoal",v:sel.sp},{d:"D\u00edvida",v:sel.se},{d:"Social",v:sel.ss}]}><PolarGrid stroke={T.bd}/><PolarAngleAxis dataKey="d" tick={{fill:T.txs,fontSize:12}}/><PolarRadiusAxis angle={90} domain={[0,1000]} tick={false} axisLine={false}/><Radar dataKey="v" stroke={T.em} fill={T.em} fillOpacity={0.2} strokeWidth={2}/></RadarChart></ResponsiveContainer>
      </div>:<div style={sC}>
        <h3 style={{fontWeight:600,fontSize:16,margin:"0 0 16px",color:"#fff"}}>Perfil MuniScore</h3>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:200,color:T.tm}}>
          <div style={{fontSize:40,marginBottom:8}}>{"\uD83D\uDCCA"}</div>
          <div style={{fontSize:14,fontWeight:500}}>{"Score indispon\u00edvel"}</div>
          <div style={{fontSize:12,marginTop:4,color:T.tm}}>{"Dados RREO/RGF n\u00e3o entregues ao SICONFI em 2024"}</div>
        </div>
      </div>}

      {sel.hasSiconfi&&<div style={sC}>
        <h3 style={{fontWeight:600,fontSize:16,margin:"0 0 16px",color:"#fff"}}>{"Dimens\u00f5es"}</h3>
        {[{l:"Autonomia Fiscal",s:sel.sa,d:sel.rp&&sel.rt?`Pr\u00f3pria: ${fP(sel.rp/sel.rt*100)}`:null},{l:"Gest\u00e3o Pessoal",s:sel.sp,d:sel.dpr?`Pessoal/RCL: ${fP(sel.dpr)}`:null},{l:"Endividamento",s:sel.se,d:sel.dvr?`D\u00edvida/RCL: ${fP(sel.dvr)}`:null},{l:"Social",s:sel.ss,d:"IDHM pendente"}].map(x=><div key={x.l} style={{marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:13,fontWeight:500,color:T.txs}}>{x.l}</span><span style={{fontWeight:600,color:dc(x.s)}}>{Math.round(x.s)}</span></div>
          <div style={{height:6,background:T.bd,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${x.s/10}%`,background:dc(x.s),borderRadius:3,transition:"width .6s"}}/></div>
          {x.d&&<div style={{fontSize:11,color:T.tm,marginTop:3}}>{x.d}</div>}
        </div>)}
      </div>}

      {sel.hasSiconfi&&<div style={{...sC,gridColumn:sel.hasSiconfi?"1/-1":"auto"}}>
        <h3 style={{fontWeight:600,fontSize:16,margin:"0 0 16px",color:"#fff"}}>Indicadores 2024</h3>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12}}>
          {[{l:"Receita Total",v:fN(sel.rt)},{l:"Receita Pr\u00f3pria",v:fN(sel.rp)},{l:"Transfer\u00eancias",v:fN(sel.tr)},{l:"RCL",v:fN(sel.rcl)},{l:"Desp.Pessoal",v:fN(sel.dp)},{l:"Pessoal/RCL",v:fP(sel.dpr),a:sel.dpr>54},{l:"D\u00edvida",v:fN(sel.dvc)},{l:"D\u00edvida/RCL",v:fP(sel.dvr),a:sel.dvr>120}].map(x=><div key={x.l} style={{padding:12,background:T.bg,borderRadius:8,border:`1px solid ${x.a?T.rd+"44":T.bd}`}}><div style={{fontSize:11,color:T.tm,marginBottom:4}}>{x.l}</div><div style={{fontWeight:600,fontSize:16,color:x.a?T.rd:"#fff"}}>{x.v}</div></div>)}
        </div>
      </div>}
    </div>:<div style={{color:T.tm,padding:40,textAlign:"center"}}>{"Selecione um munic\u00edpio no ranking"}</div>)}

    {/* ══════════════════ COMPARATIVO (FIXED) ══════════════════ */}
    {tab==="comp"&&(()=>{const a=sel,b=cmp||(fl.length>1?fl.find(f=>f.cod_ibge!==(sel?.cod_ibge)):null);
      if(!a||!b)return<div style={{color:T.tm,padding:40,textAlign:"center"}}>{"Selecione dois munic\u00edpios no ranking"}</div>;
      const bd=a.hasSiconfi&&b.hasSiconfi?[{d:"Autonomia",[a.nome]:a.sa,[b.nome]:b.sa},{d:"Pessoal",[a.nome]:a.sp,[b.nome]:b.sp},{d:"D\u00edvida",[a.nome]:a.se,[b.nome]:b.se},{d:"Social",[a.nome]:a.ss,[b.nome]:b.ss},{d:"Final",[a.nome]:a.sf,[b.nome]:b.sf}]:null;
      return<div>
        <div style={{color:T.txs,fontSize:13,marginBottom:16}}>{"Clique em munic\u00edpios no ranking para selecionar/comparar."}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20}}>
          {[a,b].map(m=>{const cf=m.cl?CL[m.cl]||CL.Regular:null;return<div key={m.cod_ibge} style={sC}><div style={{display:"flex",alignItems:"center",gap:16}}><Gauge score={m.sf} size={100}/><div><h3 style={{fontWeight:600,fontSize:18,margin:0,color:"#fff"}}>{m.nome}</h3><div style={{color:T.tm,fontSize:12}}>{m.uf}{" \u00b7 "}{fPo(m.pop)}</div><div style={{display:"flex",gap:6,marginTop:6,flexWrap:"wrap"}}>{cf&&<span style={{...sB(cf.c),marginTop:0}}>{cf.e} {m.cl}</span>}<CapagBadge capag={m.capag} size="sm"/>{!m.hasSiconfi&&<SiconfiFlag/>}</div></div></div></div>;})}
        </div>
        {bd&&<div style={{...sC,marginBottom:20}}>
          <h3 style={{fontWeight:600,fontSize:16,margin:"0 0 16px",color:"#fff"}}>{"Dimens\u00f5es"}</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={bd} layout="vertical" margin={{left:10,right:60,top:5,bottom:5}} barGap={4} barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" stroke={T.bd} horizontal={false}/>
              <XAxis type="number" domain={[0,1000]} tick={{fill:T.tm,fontSize:11}}/>
              <YAxis type="category" dataKey="d" width={90} tick={{fill:T.txs,fontSize:13,fontWeight:500}}/>
              <Tooltip contentStyle={{background:T.sf,border:`1px solid ${T.bd}`,borderRadius:8,color:T.tx}} labelStyle={{color:T.txs,fontWeight:600}} itemStyle={{color:T.txs}} cursor={{fill:`${T.bd}44`}}/>
              <Legend wrapperStyle={{color:T.txs,fontSize:12}}/>
              <Bar dataKey={a.nome} fill={T.em} radius={[0,4,4,0]} barSize={14}/>
              <Bar dataKey={b.nome} fill={T.bl} radius={[0,4,4,0]} barSize={14}/>
            </BarChart>
          </ResponsiveContainer>
        </div>}
        <div style={sC}><h3 style={{fontWeight:600,fontSize:16,margin:"0 0 16px",color:"#fff"}}>Indicadores</h3>
          {[{l:"CAPAG",a:a.capag||"\u2014",b:b.capag||"\u2014"},{l:"Score",a:a.sf!=null?Math.round(a.sf):"\u2014",b:b.sf!=null?Math.round(b.sf):"\u2014"},{l:"Receita",a:fN(a.rt),b:fN(b.rt)},{l:"Pessoal/RCL",a:a.dpr!=null?fP(a.dpr):"\u2014",b:b.dpr!=null?fP(b.dpr):"\u2014"},{l:"D\u00edvida/RCL",a:a.dvr!=null?fP(a.dvr):"\u2014",b:b.dvr!=null?fP(b.dvr):"\u2014"},{l:"Pop.",a:fPo(a.pop),b:fPo(b.pop)},{l:"SICONFI",a:a.hasSiconfi?"\u2713 Completo":"\u26A0 Pendente",b:b.hasSiconfi?"\u2713 Completo":"\u26A0 Pendente"}].map(x=><div key={x.l} style={{display:"flex",padding:"10px 0",borderBottom:`1px solid ${T.bd}`,alignItems:"center"}}><div style={{flex:1,textAlign:"right",fontWeight:500,color:T.txs}}>{x.a}</div><div style={{width:100,textAlign:"center",fontSize:12,color:T.tm}}>{x.l}</div><div style={{flex:1,fontWeight:500,color:T.txs}}>{x.b}</div></div>)}
        </div>
      </div>;})()}

    {/* ══════════════════ PANORAMA ══════════════════ */}
    {tab==="panorama"&&st&&(()=>{
      const dd=Object.entries(st.cc).map(([k,v])=>({name:k,value:v,color:(CL[k]||{c:T.tm}).c})).filter(d=>d.value>0);
      const cpd=Object.entries(st.cpc).filter(([k])=>["A+","A","B+","B","C","D","n.e.","n.d."].includes(k)).map(([k,v])=>({name:"CAPAG "+k,value:v,color:(CAPAG_CL[k]||{c:T.td}).c})).filter(d=>d.value>0);
      const scored=muns.filter(m=>m.sf!=null);
      const sr=[...scored].sort((a,b)=>b.sf-a.sf),t10=sr.slice(0,10),b10=sr.slice(-10).reverse();
      const byR={};Object.keys(RG).forEach(r=>{const ms=scored.filter(m=>m.reg===r);if(ms.length)byR[r]=Math.round(ms.reduce((a,b)=>a+b.sf,0)/ms.length);});
      const rD=Object.entries(byR).map(([r,m])=>({r,m}));
      return<div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:16,marginBottom:24}}>
          <div style={sC}><div style={{fontSize:11,color:T.tm,marginBottom:4}}>Total</div><div style={{fontWeight:700,fontSize:32,color:T.el}}>{st.n.toLocaleString()}</div><div style={{fontSize:11,color:T.tm}}>{"munic\u00edpios"}</div></div>
          <div style={sC}><div style={{fontSize:11,color:T.tm,marginBottom:4}}>Com SICONFI</div><div style={{fontWeight:700,fontSize:32,color:T.el}}>{nSic.toLocaleString()}</div><div style={{fontSize:11,color:T.tm}}>{(nSic/st.n*100).toFixed(0)}%</div></div>
          <div style={sC}><div style={{fontSize:11,color:T.tm,marginBottom:4}}>Pendentes SICONFI</div><div style={{fontWeight:700,fontSize:32,color:T.or}}>{nNoSic.toLocaleString()}</div><div style={{fontSize:11,color:T.tm}}>{(nNoSic/st.n*100).toFixed(0)}%</div></div>
          <div style={sC}><div style={{fontSize:11,color:T.tm,marginBottom:4}}>{"Score M\u00e9dio"}</div><div style={{fontWeight:700,fontSize:32,color:(CL[gc(st.avg)]||{c:T.tm}).c}}>{Math.round(st.avg)}</div><div style={{fontSize:11,color:T.tm}}>{st.nScored}{" munic\u00edpios"}</div></div>
          {Object.entries(st.cc).filter(([,v])=>v>0).map(([k,v])=><div key={k} style={sC}><div style={{fontSize:11,color:T.tm,marginBottom:4}}>{(CL[k]||{e:""}).e} {k}</div><div style={{fontWeight:700,fontSize:28,color:(CL[k]||{c:T.tm}).c}}>{v}</div><div style={{fontSize:11,color:T.tm}}>{(v/st.nScored*100).toFixed(1)}%</div></div>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20}}>
          <div style={sC}><h3 style={{fontWeight:600,fontSize:16,margin:"0 0 16px",color:"#fff"}}>{"Distribui\u00e7\u00e3o por Score"}</h3>
            <ResponsiveContainer width="100%" height={260}><PieChart><Pie data={dd} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2}>{dd.map((d,i)=><Cell key={i} fill={d.color}/>)}</Pie><Tooltip contentStyle={{background:T.sf,border:`1px solid ${T.bd}`,borderRadius:8,color:T.tx}} labelStyle={{color:T.txs,fontWeight:600}} itemStyle={{color:T.txs}}/><Legend formatter={v=><span style={{color:T.txs,fontSize:12}}>{v}</span>}/></PieChart></ResponsiveContainer>
          </div>
          <div style={sC}><h3 style={{fontWeight:600,fontSize:16,margin:"0 0 16px",color:"#fff"}}>{"Distribui\u00e7\u00e3o por CAPAG"}</h3>
            <ResponsiveContainer width="100%" height={260}><PieChart><Pie data={cpd} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2}>{cpd.map((d,i)=><Cell key={i} fill={d.color}/>)}</Pie><Tooltip contentStyle={{background:T.sf,border:`1px solid ${T.bd}`,borderRadius:8,color:T.tx}} labelStyle={{color:T.txs,fontWeight:600}} itemStyle={{color:T.txs}}/><Legend formatter={v=><span style={{color:T.txs,fontSize:12}}>{v}</span>}/></PieChart></ResponsiveContainer>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20}}>
          <div style={sC}><h3 style={{fontWeight:600,fontSize:16,margin:"0 0 16px",color:"#fff"}}>{"M\u00e9dia por Regi\u00e3o"}</h3>
            <ResponsiveContainer width="100%" height={260}><BarChart data={rD}><CartesianGrid strokeDasharray="3 3" stroke={T.bd}/><XAxis dataKey="r" tick={{fill:T.txs,fontSize:12}}/><YAxis domain={[0,1000]} tick={{fill:T.tm,fontSize:11}}/><Tooltip contentStyle={{background:T.sf,border:`1px solid ${T.bd}`,borderRadius:8,color:T.tx}} labelStyle={{color:T.txs,fontWeight:600}} itemStyle={{color:T.txs}}/><Bar dataKey="m" name={"M\u00e9dia"} radius={[4,4,0,0]}>{rD.map((d,i)=><Cell key={i} fill={d.m>=700?T.em:d.m>=500?T.go:T.rd}/>)}</Bar></BarChart></ResponsiveContainer>
          </div>
          <div style={sC}><h3 style={{fontWeight:600,fontSize:16,margin:"0 0 4px",color:"#fff"}}>{"CAPAG por Regi\u00e3o"}</h3>
            <div style={{fontSize:11,color:T.tm,marginBottom:12}}>{"% de munic\u00edpios com CAPAG A ou B"}</div>
            {Object.entries(RG).map(([r,ufs])=>{const ms=muns.filter(m=>ufs.includes(m.uf));const ab=ms.filter(m=>["A+","A","B+","B"].includes(m.capag)).length;const pct=ms.length?(ab/ms.length*100):0;
              return <div key={r} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:13,fontWeight:500,color:T.txs}}>{r}</span><span style={{fontSize:12,color:pct>=50?T.el:pct>=30?T.go:T.rd}}>{pct.toFixed(0)}% ({ab}/{ms.length})</span></div>
                <div style={{height:6,background:T.bd,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:pct>=50?T.el:pct>=30?T.go:T.rd,borderRadius:3}}/></div>
              </div>;})}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
          <div style={sC}><h3 style={{fontWeight:600,fontSize:16,margin:"0 0 16px",color:T.el}}>Top 10</h3>
            {t10.map((m,i)=><div key={m.cod_ibge} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:`1px solid ${T.bd}`,cursor:"pointer"}} onClick={()=>{setSel(m);setTab("visao");}}><span style={{fontSize:13,color:T.txs}}><span style={{color:T.go,marginRight:8}}>{i+1}.</span>{m.nome} <span style={{color:T.td}}>({m.uf})</span></span><div style={{display:"flex",alignItems:"center",gap:8}}><CapagBadge capag={m.capag} size="sm"/><span style={{fontWeight:600,color:T.el}}>{Math.round(m.sf)}</span></div></div>)}
          </div>
          <div style={sC}><h3 style={{fontWeight:600,fontSize:16,margin:"0 0 16px",color:T.rd}}>10 Piores Scores</h3>
            {b10.map((m,i)=><div key={m.cod_ibge} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:`1px solid ${T.bd}`,cursor:"pointer"}} onClick={()=>{setSel(m);setTab("visao");}}><span style={{fontSize:13,color:T.txs}}><span style={{color:T.td,marginRight:8}}>{st.nScored-9+i}.</span>{m.nome} <span style={{color:T.td}}>({m.uf})</span></span><div style={{display:"flex",alignItems:"center",gap:8}}><CapagBadge capag={m.capag} size="sm"/><span style={{fontWeight:600,color:T.rd}}>{Math.round(m.sf)}</span></div></div>)}
          </div>
        </div>
      </div>;})()}

    </div>
    <div style={{borderTop:`1px solid ${T.bd}`,padding:"16px 24px",textAlign:"center"}}><p style={{margin:0,fontSize:11,color:T.tm}}>{"MuniScore Brasil \u00b7 SICONFI + CAPAG / Tesouro Nacional \u00b7 2024"}</p></div>
  </div>;
}
