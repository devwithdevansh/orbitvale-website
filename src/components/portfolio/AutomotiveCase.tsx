'use client';

import { useState } from 'react';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import './portfolio.css';

const templates = [
  {name:'Kohinoor', number:'01', headline:'Precision, presented with presence.', detail:'Dark luxury detailing flagship with strong typography, deliberate scroll choreography and product-service storytelling.', source:'obsidian-react/src/App.jsx (Kohinoor page)' , url:'https://car-detailing-by-dwd.onrender.com/',tone:'#b7a077', background:'#121315'},
  {name:'Boond', number:'02', headline:'A lighter way to stand out.', detail:'Single-studio wash experience. Clean, legible presentation and editorial layout for a detailing studio.', source:'obsidian-react/src/sites/boond', url:'https://car-detailing-by-dwd.onrender.com/boond/',tone:'#68b8df', background:'#f2f5f6'},
  {name:'Kavach', number:'03', headline:'Protection with character.', detail:'Multi-studio ceramic & PPF network with a studio locator concept and interactive detailing content.', source:'obsidian-react/src/sites/kavach',url:'https://car-detailing-by-dwd.onrender.com/kavach/',tone:'#e8a05a',background:'#201a16'},
] as const;

export function AutomotiveCase(){
 const [active,setActive] = useState(0);
 const [opened,setOpened] = useState(false);
 const selected=templates[active];
 return <main className="ov07-auto">
  <section className="ov07-auto-hero">
   <div className="ov07-rail"><span>ORBITVALE / PRODUCT OFFERINGS / 03</span><Link href="/work">ALL WORK ↗</Link></div>
   <div className="ov07-auto-heading"><p className="ov07-eyebrow">CAR DETAILING · CAR WASH · SEARCH-FOCUSED WEBSITES</p><h1>YOUR STUDIO.<br/><em>YOUR PRESENCE.</em></h1><p>One website offering. Three complete, individually coded starting points. Built for detailing and car-wash businesses that want to be found and remembered online.</p><a href="#choose-a-site" className="ov07-action">EXPLORE THE COLLECTION <span>↓</span></a></div>
   <div className="ov07-auto-media"><img src="/orbitvale/ov07/kohinoor-original.jpg" alt="Authentic recorded Kohinoor automotive detailing website, showing car photography and editorial typography"/><div className="ov07-auto-media-label">SOURCE FRAME / KOHINOOR WEBSITE SCROLL RECORDING</div></div>
  </section>
  <section className="ov07-auto-value"><div className="ov07-section-index">01 / THE OFFER</div><div><h2>NOT ANOTHER<br/>SOFTWARE DASHBOARD.</h2><p>This is a website solution for detailing and car-wash businesses: an interactive frontend that can be configured for a studio's identity, services and enquiries. Customers choose a coded design—not a random collection of AI-generated templates.</p><div className="ov07-value-points"><span>01 / PICK A TEMPLATE</span><span>02 / CUSTOMISE THE STUDIO</span><span>03 / LAUNCH THE SITE</span></div></div></section>
  <section className="ov07-auto-selector" id="choose-a-site" aria-labelledby="ov07-choice-title"><div className="ov07-section-index">02 / THREE ACTUAL FRONTENDS</div><div className="ov07-selector-body"><div className="ov07-selector-top"><h2 id="ov07-choice-title">CHOOSE A<br/><em>STARTING POINT.</em></h2><p>The source repository contains three different built website experiences, not merely palette variations. Select a template to explore its live original.</p></div>
    <div className="ov07-template-tabs" role="tablist" aria-label="Website template choices">{templates.map((t,i)=><button key={t.name} role="tab" id={`ov07-tab-${i}`} aria-selected={i===active} aria-controls="ov07-template-panel" onClick={()=>{setActive(i);setOpened(false)}} style={{'--ov07-template-accent':t.tone} as CSSProperties}><span>{t.number} / TEMPLATE</span><strong>{t.name}</strong><span aria-hidden="true">↗</span></button>)}</div>
    <div className="ov07-selected" id="ov07-template-panel" role="tabpanel" aria-labelledby={`ov07-tab-${active}`}><div className="ov07-selected-copy"><div className="ov07-eyebrow">{selected.number} / {selected.name.toUpperCase()}</div><h3>{selected.headline}</h3><p>{selected.detail}</p><div className="ov07-selected-links"><button onClick={()=>setOpened(v=>!v)} type="button" className="ov07-action">{opened?'CLOSE LIVE VIEW':'LOAD ORIGINAL WEBSITE'} <span>↗</span></button><a href={selected.url} rel="noopener noreferrer" target="_blank" className="ov07-text-link">OPEN FULL DEMO ↗</a></div><div className="ov07-source-small">ORIGINAL SOURCE: {selected.source}</div></div><div className="ov07-selected-stage" style={{background:selected.background}}>{opened?<><iframe title={`${selected.name} live website`} src={selected.url} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" sandbox="allow-forms allow-scripts allow-same-origin allow-popups"/><a href={selected.url} target="_blank" rel="noopener noreferrer" className="ov07-iframe-fallback">IF THE EMBED IS BLOCKED, OPEN DIRECTLY ↗</a></>:<div className="ov07-stage-unloaded"><span className="ov07-eye">◉</span><strong>{selected.name}</strong><span>ACTUAL CODED FRONTEND / SELECT TO LOAD</span></div>}</div></div>
  </div></section>
  <section className="ov07-auto-recording"><div><span className="ov07-section-index">03 / ORIGINAL MOTION</span><h2>REAL CODE.<br/>REAL INTERACTION.</h2><p>This recording was provided by the team. The animation belongs to the original website—no newly generated mock interface.</p></div><video src="/orbitvale/motion/kohinoor-scroll.mp4" playsInline muted controls preload="metadata" aria-label="Original Kohinoor scrolling website recording"/></section>
  <section className="ov07-auto-cta"><p>LOOKING FOR A DETAILING WEBSITE?</p><h2>MAKE IT<br/><em>YOURS.</em></h2><div><Link href="/contact" className="ov07-action">DISCUSS YOUR STUDIO <span>↗</span></Link><Link href="/live-lab/automotive" className="ov07-text-link">OPEN ALL LIVE PREVIEWS ↗</Link></div><small>The website structures are designed with search discoverability in mind. Rankings and traffic outcomes are not guaranteed. Demonstration images and content are examples, not client performance evidence.</small></section>
 </main>
}
