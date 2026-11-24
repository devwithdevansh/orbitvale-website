'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import styles from './ui-kit.module.css';

const colors = [
  { name: 'Void', hex: '#08090B', role: 'Primary canvas' },
  { name: 'Carbon', hex: '#17191D', role: 'Surface / raised' },
  { name: 'Chalk', hex: '#F4F3EF', role: 'Primary text' },
  { name: 'Mist', hex: '#9A9DA4', role: 'Secondary text' },
  { name: 'Signal', hex: '#8CE7D0', role: 'Provisional interaction accent' },
];

const projects = [
  { name: 'School ERP', type: 'Product / education', image: '/ui-kit/projects/academic-erp-dashboard.png', note: 'Real uploaded dashboard composition. Product status requires confirmation.' },
  { name: 'Raj Tourism', type: 'Client work / travel', image: '/ui-kit/projects/raj-tourism.webp', note: 'Original client-work device mockup supplied in assets.zip.' },
  { name: 'Om Studypoint', type: 'Client work / education', image: '/ui-kit/projects/om-studypoint.png', note: 'Original client-work composition supplied in assets.zip.' },
  { name: 'Raj Traders', type: 'Client work / commerce', image: '/ui-kit/projects/raj-traders.png', note: 'Original client-work UI supplied in assets.zip.' },
];

export default function UiKitPage() {
  const reduceMotion = useReducedMotion();
  const [view, setView] = useState<'dark' | 'light'>('dark');
  const [active, setActive] = useState(0);
  const [assembled, setAssembled] = useState(true);
  const [tab, setTab] = useState<'projects' | 'foundations'>('projects');
  const dark = view === 'dark';
  const selected = projects[active];
  return (
    <main className={`${styles.root} ${dark ? styles.dark : styles.light}`}>
      <div className={styles.wrap}>
        <header className={styles.header}>
          <a href="/" className={styles.brand} aria-label="Orbitvale home"><Image src={dark ? '/brand/v2/full-logo.png' : '/brand/v2/full-logo-black.png'} width={150} height={60} alt="Orbitvale" style={{ width: 150, height: 'auto' }} priority /></a>
          <span className={styles.meta}>OV / 01 <span className={styles.dot}>•</span> IDENTITY LAB</span>
          <div className={styles.headerRight}><button className={styles.smallButton} onClick={() => setView(dark ? 'light' : 'dark')} aria-label={`Switch to ${dark ? 'light' : 'dark'} theme`}>{dark ? 'LIGHT MODE ↗' : 'DARK MODE ↗'}</button><a className={styles.back} href="/">← SITE</a></div>
        </header>

        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}><span className={styles.pulse}/> CREATIVE SYSTEM / EXPLORATION 001</p>
            <h1>ORDER<br/><i>IN</i> MOTION<span className={styles.period}>.</span></h1>
            <p className={styles.description}>One visual language. Many industries. Digital products and experiences with craft, clarity, and a sense of gravity.</p>
            <div className={styles.heroActions}><a className={styles.primary} href="#specimens">EXPLORE THE SYSTEM <span>↗</span></a><span className={styles.understated}>Prototype / not a launched brand guideline</span></div>
          </div>
          <div className={styles.heroMark} aria-label="Orbitvale layered logo motion study">
            <div className={styles.orbitGrid}/>
            <motion.div className={styles.logoStage} initial={false} animate={assembled || reduceMotion ? {rotate: 0,scale:1} : {rotate: -8,scale: .92}} transition={{type:'spring', stiffness:120,damping:20}}>
              <Image className={styles.orbitLayer} src="/brand/v2/orbit-overlay-aligned.png" alt="" fill sizes="(max-width: 800px) 90vw, 48vw" style={{objectFit:'contain'}}/>
              <motion.div className={styles.wordLayer} initial={false} animate={assembled || reduceMotion ? {opacity:1,y:0} : {opacity:.45,y:15}} transition={{duration:.6}}>
                <Image src={dark ? '/brand/v2/full-logo.png' : '/brand/v2/full-logo-black.png'} alt="Orbitvale orbital identity" fill sizes="(max-width: 800px) 90vw, 48vw" style={{objectFit:'contain'}} priority/>
              </motion.div>
            </motion.div>
            <span className={styles.markLabel}>FIG. 01 / ORBITAL IDENTITY</span>
            <button className={styles.markControl} onClick={() => setAssembled(v => !v)}>{assembled ? 'DISPLACE ↗' : 'ASSEMBLE ↗'}</button>
          </div>
        </section>

        <div className={styles.ticker} aria-hidden="true"><span>DESIGN <b>✳</b> ENGINEERING <b>✳</b> SYSTEMS <b>✳</b> PRODUCTS <b>✳</b> EXPERIENCE <b>✳</b> DESIGN <b>✳</b> ENGINEERING</span></div>

        <section className={styles.section} id="specimens">
          <div className={styles.sectionTitle}><p className={styles.eyebrow}>01 / FOUNDATIONS</p><h2>Made of<br/><em>relationships.</em></h2><p className={styles.sectionSide}>The motif is orbital, but the expression should be precise and editorial—not a generic space illustration.</p></div>
          <div className={styles.foundationGrid}>
            <div className={styles.panel}><span className={styles.panelLabel}>COLOR SYSTEM / EXPLORATORY</span><div className={styles.swatches}>{colors.map(c => <div key={c.name} className={styles.swatch}><div style={{background:c.hex}}/><strong>{c.name}</strong><span>{c.hex}</span><small>{c.role}</small></div>)}</div></div>
            <div className={styles.panel}><span className={styles.panelLabel}>TYPOGRAPHY / ACTUAL PROJECT FONTS</span><div className={styles.typography}><span className={styles.displaySpecimen}>Aa<span>.</span></span><span className={styles.specimenInfo}>SYNE / DISPLAY<br/>JetBrains Mono / Meta, labels & data</span></div><p className={styles.panelNote}>The typography shown here uses the website's installed typefaces, not an invented font pairing.</p></div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionTitle}><p className={styles.eyebrow}>02 / INTERACTION PRIMITIVES</p><h2>Purpose before<br/><em>spectacle.</em></h2><p className={styles.sectionSide}>Prototype states for buttons, interactive surfaces, focus, and animation. Motion is reduced when requested by the visitor's system.</p></div>
          <div className={styles.interactionGrid}>
            <div className={styles.panel}><span className={styles.panelLabel}>ACTION STATES</span><div className={styles.actions}><button className={styles.primary} onClick={()=>setTab('projects')}>VIEW WORK <span>↗</span></button><button className={styles.secondary} onClick={()=>setTab('foundations')}>FOUNDATIONS <span>↗</span></button><button className={styles.textLink} onClick={()=>setAssembled(v=>!v)}>REPLAY IDENTITY ↗</button></div><span className={styles.panelNote}>These are local playground actions; no form submission or external transaction.</span></div>
            <div className={styles.panel}><span className={styles.panelLabel}>MOTION GRAMMAR</span><div className={styles.motionRow}><motion.span className={styles.motionDisc} whileHover={reduceMotion ? {} : {scale:1.18,rotate:20}} transition={{type:'spring',stiffness:240,damping:18}}/><div><strong>QUIET BY DEFAULT.</strong><p>Micro-feedback: fast and precise. Editorial movement: slower and intentional. Spatial spectacle: reserved for signature moments.</p></div></div></div>
          </div>
        </section>

        <section className={styles.section} id="projects">
          <div className={styles.sectionTitle}><p className={styles.eyebrow}>03 / SHOWCASE PROTOTYPE</p><h2>Different worlds.<br/><em>One orbit.</em></h2><p className={styles.sectionSide}>Actual imagery from the supplied archive, displayed inside Orbitvale's own presentation language. Project status and commercial claims are intentionally excluded.</p></div>
          <div className={styles.tabRow} role="tablist" aria-label="Specimen categories"><button role="tab" aria-selected={tab==='projects'} className={tab==='projects'?styles.selectedTab:''} onClick={()=>setTab('projects')}>PROJECT SHOWCASE</button><button role="tab" aria-selected={tab==='foundations'} className={tab==='foundations'?styles.selectedTab:''} onClick={()=>setTab('foundations')}>SYSTEM NOTES</button></div>
          {tab==='projects' ? <div className={styles.projectGrid}>
            <div className={styles.projectPreview}><Image key={selected.image} src={selected.image} alt={`${selected.name} supplied project visual`} fill sizes="(max-width: 800px) 100vw, 65vw" style={{objectFit:'contain'}}/><div className={styles.projectIndex}>PROJECT {String(active+1).padStart(2,'0')} / {String(projects.length).padStart(2,'0')}</div></div>
            <div className={styles.projectList}>{projects.map((p,i)=><button key={p.name} onMouseEnter={()=>setActive(i)} onFocus={()=>setActive(i)} onClick={()=>setActive(i)} aria-pressed={active===i} className={`${styles.projectItem} ${active===i?styles.activeProject:''}`}><span className={styles.count}>{String(i+1).padStart(2,'0')}</span><span><strong>{p.name}</strong><small>{p.type}</small></span><span className={styles.arrow}>↗</span></button>)}<p className={styles.projectNote}>{selected.note}</p></div>
          </div> : <div className={styles.notes}><p>Art direction: restrained editorial typography × orbital geometry × selected cinematic movement.</p><p>Ownership: Orbitvale brand is the presentation layer. Every product retains its original visual identity.</p><p>Evidence: live status, client permissions, and measurable outcomes must be verified before publishing.</p><p>Performance: sequence frames must be deduplicated; effects must have responsive and reduced-motion alternatives.</p></div>}
        </section>
        <footer className={styles.footer}><span>ORBITVALE / OV—01</span><span>INTERNAL CREATIVE PROTOTYPE • NO PRODUCT CLAIMS</span><a href="#">BACK TO TOP ↑</a></footer>
      </div>
    </main>
  );
}
