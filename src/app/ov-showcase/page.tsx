'use client';

import { useState } from 'react';
import Link from 'next/link';

const studies = [
  { id: 'forge-product', name: 'FORGE', subtitle: 'Three packages. One gym ecosystem.', type: 'READY-MADE PRODUCT', narrative: 'Essential / Growth / Performance', copy: 'A tiered offering that starts with a distinctive gym website and expands into operations, coaching and member access.', video: '/orbitvale/motion/forge-packages.mp4', source: 'User-provided FORGE catalogue recording', route:'/work/forge-gym', border: '#de6154' },
  { id: 'forge-essential', name: 'IRONPEAK', subtitle: 'FORGE Essential / Experience', type: 'PRODUCT DEMONSTRATION', narrative: 'Cinematic sample gym', copy: 'An original scroll-based demo showing the gym website experience included in the Essential package. Membership plans inside this demo are not FORGE subscription tiers.', video: '/orbitvale/motion/forge-essential-experience.mp4', source: 'User-provided FORGE Essential demonstration recording', route:'/work/forge-gym', border: '#de6154' },
  { id: 'automotive-collection', name: 'AUTOMOTIVE', subtitle: 'Three visual systems for one industry.', type: 'FRONTEND DESIGN COLLECTION', narrative: 'Kohinoor / Boond / Kavach', copy: 'A family of website design directions for car detailing businesses, paired with the original catalogue, typography choices and style selector.', video: null, source: 'User-provided automotive catalogue recording', route:'/work/automotive', border: '#d2ab71' },
  { id: 'kohinoor', name: 'KOHINOOR', subtitle: 'Precision in motion.', type: 'INTERACTIVE WEBSITE DEMO', narrative: 'Scroll-driven automotive experience', copy: 'An actual capture of the Kohinoor template, showing service storytelling, automotive photography and interaction. Photography rights must be verified before public campaigns.', video: '/orbitvale/motion/kohinoor-scroll.mp4', source: 'User-provided automotive catalogue and Kohinoor recording', route:'/work/automotive', border: '#d2ab71' },
  { id: 'school-erp', name: 'SCHOOL ERP', subtitle: 'Two editions. A tailored fit.', type: 'SOFTWARE PRODUCT', narrative: 'Essential / Professional', copy: 'A proposed editorial presentation using the dashboard artwork the team supplied. The public deployments currently expose sign-in screens; this composition is not a live dashboard capture.', video: null, source: 'User-provided assets.zip / professional-erp-dashboard.png', route:'/work/school-erp', border: '#8e77da' },
] as const;

export default function ShowcaseLab() {
 const [selected, setSelected] = useState(0);
 const [view, setView] = useState<'portrait'|'landscape'>('landscape');
 const study=studies[selected];
 return (
   <main className="min-h-screen bg-[#0a0c10] text-[#f4f3ef] px-5 md:px-10 lg:px-16 py-9 font-sans" aria-label="Orbitvale visual showcase lab">
    <div className="max-w-[1450px] mx-auto">
     <header className="flex flex-wrap items-center justify-between gap-5 border-b border-white/20 pb-6">
      <div><Link className="text-xl md:text-2xl font-semibold tracking-[.16em]" href="/">ORBITVALE</Link><span className="ml-4 text-[#8bd7c4] font-mono text-xs">OV / 03</span></div>
      <div className="flex gap-4 text-[11px] tracking-widest font-mono uppercase text-white/60"><span>Original captures</span><span>—</span><span>Creative lab</span><Link href="/work" className="text-white hover:text-[#9ae5d0]">Work ↗</Link></div>
     </header>
     <section className="pt-14 md:pt-20 pb-12 grid md:grid-cols-[1.4fr_.6fr] gap-9 items-end">
      <div><p className="text-[#8bd7c4] text-xs font-mono tracking-[.18em] uppercase">Brand experiences / Originals & demonstrations</p><h1 className="font-display font-bold tracking-[-.065em] leading-[.95] text-5xl sm:text-7xl xl:text-[96px] mt-7">Real work.<br/>New perspective.</h1></div>
      <p className="text-white/60 text-sm md:text-base leading-7 max-w-sm">A working, art-directed showcase built from actual recordings and supplied product material. Explore distinct scene formats without changing Orbitvale&apos;s existing journey.</p>
     </section>
     <div className="flex flex-wrap justify-between gap-3 border-y border-white/20 py-4 items-center"><span className="text-xs font-mono tracking-widest text-white/50">SELECT A PROJECT / 0{selected+1}—0{studies.length}</span><div className="flex gap-2"><button onClick={()=>setView('landscape')} aria-pressed={view==='landscape'} className={`px-4 py-2 text-xs uppercase font-mono border ${view==='landscape'?'text-black bg-[#a4dfd0] border-[#a4dfd0]':'border-white/25'}`}>Case-study</button><button onClick={()=>setView('portrait')} aria-pressed={view==='portrait'} className={`px-4 py-2 text-xs uppercase font-mono border ${view==='portrait'?'text-black bg-[#a4dfd0] border-[#a4dfd0]':'border-white/25'}`}>Hero cards</button></div></div>
     <div className="flex flex-wrap gap-2 py-6">{studies.map((s,i)=><button key={s.id} onClick={()=>setSelected(i)} aria-pressed={selected===i} className={`border py-3 px-4 text-xs font-mono tracking-widest transition-colors text-left ${selected===i?'bg-white text-black border-white':'border-white/20 text-white/65 hover:border-white/70'}`}>{String(i+1).padStart(2,'0')} / {s.name}</button>)}</div>
     <section className="grid lg:grid-cols-[1.5fr_.5fr] gap-8 items-start">
      <div className={`overflow-hidden bg-[#11151b] border border-white/15 flex items-center justify-center ${view==='portrait'?'py-8':''}`}>
       {/* eslint-disable-next-line @next/next/no-img-element */}
       <img key={`${study.id}-${view}`} src={`/orbitvale/visuals/${study.id}-${view}.webp`} alt={`Art-directed ${study.name} ${view} composition using genuine user-supplied source material`} className={view==='portrait'?'max-w-[420px] w-[80%] shadow-2xl':'w-full'}/>
      </div>
      <aside className="lg:pt-3 space-y-5"><p className="text-[#a4dfd0] text-[11px] font-mono uppercase tracking-widest">{study.type}</p><h2 className="text-3xl md:text-4xl font-semibold tracking-tighter">{study.subtitle}</h2><p className="font-mono text-[11px] text-white/55 tracking-widest">{study.narrative}</p><p className="leading-7 text-white/70 text-sm">{study.copy}</p><div className="border-t border-white/15 pt-5 text-xs text-white/55 leading-6">SOURCE: {study.source}<br/>SCREEN CONTENT: Original, unretouched<br/>COMPOSITION: Orbitvale art direction</div><Link href={study.route} className="inline-flex border border-[#a4dfd0] text-[#a4dfd0] px-5 py-3 text-xs tracking-widest font-mono uppercase hover:bg-[#a4dfd0] hover:text-black">View existing project page ↗</Link></aside>
     </section>
     {study.video && <section className="border-t border-white/20 mt-16 pt-12"><div className="flex flex-wrap justify-between gap-5 items-end mb-6"><div><p className="text-xs font-mono tracking-widest text-[#a4dfd0]">MOTION / ORIGINAL RECORDING</p><h2 className="text-3xl md:text-5xl mt-3 font-semibold tracking-tight">The experience in motion.</h2></div><span className="text-[11px] text-white/50 font-mono">REAL SCREEN RECORDING EXCERPT · NO SOUND</span></div><video key={study.id} className="w-full max-w-[1080px] border border-white/20 bg-black" controls playsInline preload="metadata" poster={`/orbitvale/visuals/${study.id}-landscape.webp`}><source src={study.video} type="video/mp4"/>Your browser does not support video playback.</video></section>}
     <section className="my-20 border-t border-white/20 pt-8"><h2 className="text-2xl md:text-3xl font-semibold mb-5">One system. Different visual personalities.</h2><div className="grid grid-cols-2 md:grid-cols-5 gap-3">{studies.map((s,i)=><button key={s.id} onClick={()=>{setSelected(i);setView('portrait');window.scrollTo({top:0,behavior:'smooth'})}} className="text-left group"><img src={`/orbitvale/visuals/${s.id}-portrait.webp`} alt={`${s.name} art-directed preview`} className="w-full aspect-[3/4] object-cover group-hover:opacity-75 transition-opacity"/><div className="flex justify-between pt-3 text-xs tracking-wide"><span>{s.name}</span><span className="text-white/50">0{i+1}</span></div></button>)}</div></section>
     <footer className="border-t border-white/20 py-7 text-[11px] text-white/50 font-mono leading-5">OV/03 IS A SEPARATE CURATION LAB. THE HOMEPAGE, ORBITAL JOURNEY AND PREVIOUS/NEXT PAGE TRANSITIONS ARE UNCHANGED. ORIGINAL FILES ARE TRACKED IN /public/orbitvale/ASSET_PROVENANCE.json.</footer>
    </div>
   </main>
 );
}
