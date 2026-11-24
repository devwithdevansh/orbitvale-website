"use client";
import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {cinematicCases} from '@/lib/cinematicCases';
import {projects} from '@/lib/projects';
import './cinematic.css';

function OrbitalLine({className=''}:{className?:string}){
 return <svg className={className} viewBox="0 0 1000 750" fill="none" aria-hidden="true"><ellipse cx="500" cy="375" rx="465" ry="150" transform="rotate(-27 500 375)" stroke="currentColor" strokeWidth="1.25"/><ellipse cx="500" cy="375" rx="370" ry="248" transform="rotate(25 500 375)" stroke="currentColor" strokeWidth="1" opacity=".55"/><ellipse cx="500" cy="375" rx="225" ry="340" transform="rotate(-19 500 375)" stroke="currentColor" opacity=".24"/><circle cx="780" cy="195" r="5" fill="currentColor"/></svg>
}
export function CinematicCaseExperience({slug}:{slug:string}){
 const model=cinematicCases[slug];
 const root=useRef<HTMLElement>(null);
 const [selected,setSelected]=useState(0);
 const [reduced,setReduced]=useState(false);
 useEffect(()=>{
  const node=root.current;if(!node)return;
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  const set=()=>setReduced(media.matches);set();media.addEventListener?.('change',set);
  let raf=0;
  const tick=()=>{raf=0;const stage=node.querySelector<HTMLElement>('.ov-cinematic-track');if(!stage)return;const rect=stage.getBoundingClientRect();const range=Math.max(1,stage.offsetHeight-window.innerHeight);const progress=Math.min(1,Math.max(0,-rect.top/range));node.style.setProperty('--ov-progress',String(progress));};
  const onScroll=()=>{if(!raf)raf=requestAnimationFrame(tick)};
  window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);tick();
  return ()=>{window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll);media.removeEventListener?.('change',set);if(raf)cancelAnimationFrame(raf)};
 },[slug]);
 if(!model)return null;
 const current=model.choices?.[selected];const index=projects.findIndex(p=>p.slug===slug);const next=projects[(index+1)%projects.length];
 return <article className="ov-cinematic" ref={root} style={{'--ov-accent':model.accent,'--ov-second':model.accent2,'--ov-dark':model.background} as React.CSSProperties}>
  <section className="ov-cinematic-opening" aria-labelledby="ov-case-title">
   <OrbitalLine className="ov-cinematic-opening-orbit"/>
   <div className="ov-cinematic-eyebrow"><span>ORBITVALE / SELECTED WORK</span><span>{model.index} / {String(projects.length).padStart(2,'0')} — {model.eyebrow}</span></div>
   <div className="ov-cinematic-intro"><p className="ov-cinematic-signal">{model.eyebrow}</p><h1 id="ov-case-title">{model.headline.map((line,i)=><span key={line} className={i===1?'highlight':''}>{line}</span>)}</h1><p>{model.deck}</p><div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '20px', marginTop: '28px' }}>
      <a className="ov-cinematic-scroll-link" href="#ov-cinematic-reveal" style={{ marginTop: 0 }}>EXPLORE THE STORY <span aria-hidden="true">↘</span></a>
      {slug === 'forge-gym' ? (
        <a
          href="https://demo-web-forge-gym.onrender.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '999px',
            background: 'var(--ov-accent)',
            color: '#07080a',
            font: '600 11px ui-monospace, monospace',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            boxShadow: '0 8px 24px rgba(0,0,0,0.18)'
          }}
        >
          <span>Explore Demo</span>
          <span aria-hidden="true">↗</span>
        </a>
      ) : (
        <Link
          href={`/live-lab/${slug}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '999px',
            background: 'var(--ov-accent)',
            color: '#07080a',
            font: '600 11px ui-monospace, monospace',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            boxShadow: '0 8px 24px rgba(0,0,0,0.18)'
          }}
        >
          <span>Explore Demo</span>
          <span aria-hidden="true">↗</span>
        </Link>
      )}
    </div></div>
   <span className="ov-cinematic-index">01 / ARRIVAL</span>
  </section>
  <section className="ov-cinematic-track" id="ov-cinematic-reveal" aria-label="Project cinematic reveal"><div className="ov-cinematic-stage"><OrbitalLine className="ov-cinematic-stage-orbit"/><div className="ov-cinematic-stage-grid"/><div className="ov-cinematic-stage-top"><span>02 / A NEW PERSPECTIVE</span><span>ORBITVALE / WORK</span></div><div className="ov-cinematic-stage-head"><p className="ov-cinematic-signal">THE EXPERIENCE</p><h2>BUILT TO<br/><em>MOVE.</em></h2></div><div className="ov-cinematic-device"><div className="ov-cinematic-browser"><span>● ● ●</span><span>{slug.replace(/-/g,' ').toUpperCase()} / PRODUCT VIEW</span></div><img src={model.hero} alt={`Original-source visual presentation of ${slug.replace(/-/g,' ')}`}/></div><div className="ov-cinematic-stage-bottom"><span>ORIGINAL-SOURCE MATERIAL / CURATED FOR ORBITVALE</span><span>SCROLL TO REVEAL ↓</span></div></div></section>
  <section className="ov-cinematic-story" aria-label="Case study details"><div className="ov-cinematic-section-label"><span>03 / STORY IN MOTION</span><span>FORM FOLLOWS PURPOSE</span></div><header className="ov-cinematic-story-head"><h2>EVERY DETAIL<br/><em>HAS A ROLE.</em></h2><p>Explore the actual interfaces and distinct creative decisions behind this experience.</p></header>
    <div className="ov-cinematic-chapters">{model.chapters.map((chapter,i)=><section className="ov-cinematic-chapter" key={chapter.id}><div className="ov-cinematic-chapter-info"><span>{chapter.id} / CHAPTER</span><h3>{chapter.title}</h3><p>{chapter.text}</p></div><div className={'ov-cinematic-chapter-image '+(i%2?'alt':'')}><img src={chapter.image} alt={`Source-backed visual for ${chapter.title}`}/></div></section>)}</div>
  </section>
  {model.video&&<section className="ov-cinematic-film" aria-label="Original recorded motion preview"><div className="ov-cinematic-section-label"><span>04 / MOTION STUDY</span><span>ORIGINAL RECORDING</span></div><h2>NOT JUST<br/>A STILL.</h2><div className="ov-cinematic-video"><video src={model.video} controls muted playsInline preload="metadata" aria-label={model.videoCaption||'Original website recording'}/></div><p>{model.videoCaption}. Captured from supplied site recording; no fabricated interface or animation.</p></section>}
  {model.choices&&<section className="ov-cinematic-choices" aria-label="Explore available versions"><div className="ov-cinematic-section-label"><span>05 / EXPLORE THE SYSTEM</span><span>SELECT A DIRECTION</span></div><h2>{slug==='forge-gym'?'THREE PACKAGES.':'THREE IDENTITIES.'}<br/><em>ONE CONNECTED STORY.</em></h2><div className="ov-cinematic-choice-layout"><div className="ov-cinematic-choice-tabs" role="group" aria-label="Choose a version">{model.choices.map((choice,i)=><button type="button" key={choice.label} aria-pressed={selected===i} onClick={()=>setSelected(i)}><span>0{i+1}</span>{choice.label}<span aria-hidden="true">↗</span></button>)}</div><div className="ov-cinematic-choice-detail" aria-live="polite"><span>0{selected+1} / SELECTED</span><h3>{current?.subtitle}</h3><p>{current?.desc}</p><a target="_blank" rel="noopener noreferrer" href={current?.href}>VISIT ORIGINAL DEMO ↗</a></div></div></section>}
  <section className="ov-live-invite"><span>EXPERIENCE THE ORIGINAL</span><h2>NOT A RENDER.<br/>A REAL INTERFACE.</h2><p>Explore the source-built working demo in Orbitvale’s live viewing studio. The actual interface stays intact.</p><Link href={`/live-lab/${slug}`}>OPEN INTERACTIVE PREVIEW ↗</Link></section>
  <aside className="ov-cinematic-source"><span>SOURCE INTEGRITY</span><p>{model.sourceNote}</p></aside>
  <Link className="ov-cinematic-next" href={`/work/${next.slug}`}><span>NEXT ORBIT ↗</span><strong>{next.title}</strong></Link>
 </article>;
}
