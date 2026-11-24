"use client";
import {useEffect,useState} from 'react';
import Link from 'next/link';
import type {LiveCollection} from '@/lib/liveExperiences';
import './live-lab.css';
export function LiveLab({collection}:{collection:LiveCollection}){
 const [selected,setSelected]=useState(0);const [active,setActive]=useState(false);const [loaded,setLoaded]=useState(false);const [device,setDevice]=useState<'desktop'|'tablet'|'phone'>('desktop');
 const item=collection.entries[selected];
 useEffect(()=>{setActive(false);setLoaded(false)},[collection.slug,selected]);
 const select=(i:number)=>{setSelected(i);setActive(false);setLoaded(false)};
 return <main className="ov-live" style={{'--lab-accent':item.accent} as React.CSSProperties}>
  <div className="ov-live-grain" aria-hidden="true"/>
  <div className="ov-live-heading"><div className="ov-live-meta"><Link href={`/work/${collection.slug}`}>← CASE STUDY</Link><span>ORBITVALE / INTERACTIVE SOURCE</span><span>NO RECONSTRUCTED UI</span></div><p className="ov-live-tag">{collection.eyebrow}</p><h1>{collection.title}<span className="ov-live-dot">.</span></h1><p>{collection.description}</p></div>
  <section className="ov-live-selector" aria-label="Choose a live experience"><div className="ov-live-sections">{collection.entries.map((e,i)=><button key={e.id} className={selected===i?'active':''} aria-pressed={selected===i} onClick={()=>select(i)}><small>0{i+1}</small><b>{e.label}</b><span aria-hidden="true">↗</span></button>)}</div><div className="ov-live-about"><span>ACTIVE SOURCE / {String(selected+1).padStart(2,'0')}</span><h2>{item.label}</h2><p>{item.description}</p><span className="ov-live-source">GitHub source: {item.source}</span></div></section>
  <section className="ov-live-workspace" aria-label="Demo viewer"><div className="ov-live-tools"><div className="ov-live-dots" aria-hidden="true">● ● ●</div><div className="ov-live-devices" role="group" aria-label="Preview viewport">{(['desktop','tablet','phone'] as const).map(x=><button key={x} aria-pressed={device===x} onClick={()=>setDevice(x)}>{x.toUpperCase()}</button>)}</div><a href={item.url} target="_blank" rel="noopener noreferrer">OPEN ORIGINAL ↗</a></div>
    <div className={'ov-live-stage '+device}><div className="ov-live-frame">
      {active ? <><iframe title={`${item.label} original demo`} src={item.url} loading="lazy" onLoad={()=>setLoaded(true)} referrerPolicy="no-referrer-when-downgrade" allow="fullscreen"/><div className="ov-live-frame-help"><span>{loaded?'PREVIEW REQUESTED':'CONNECTING TO DEMO…'} — IF THE SITE BLOCKS FRAMING, OPEN THE ORIGINAL.</span><a target="_blank" rel="noopener noreferrer" href={item.url}>OPEN IN NEW TAB ↗</a></div></> : <div className="ov-live-activate"><div className="ov-live-ring" aria-hidden="true"/><span className="ov-live-label">ORIGINAL FRONTEND / LIVE CODE</span><h3>{item.label}</h3><p>Open the real deployed experience inside this frame, not a screenshot or re-created interface.</p><button onClick={()=>setActive(true)}>LOAD LIVE EXPERIENCE ↗</button><a href={item.url} rel="noopener noreferrer" target="_blank">OPEN ORIGINAL DIRECTLY ↗</a></div>}
    </div></div><p className="ov-live-disclaimer">External sites may prohibit iframe embedding through their security headers. In that case use the original link; no code has been copied or visual claims fabricated. Demo interfaces may contain fictional sample data. Mobile mode changes viewport width but does not simulate mobile hardware.</p></section>
  <div className="ov-live-end"><span>EXPERIENCE / {collection.slug.toUpperCase()}</span><Link href="/work">EXPLORE ALL WORK ↗</Link></div>
 </main>
}
