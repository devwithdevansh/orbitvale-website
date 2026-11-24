import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { projects, featuredProjects, getProject } from '@/lib/projects';
import { SchoolOrbitExperience } from '@/components/school-orbit/SchoolOrbitExperience';
import { CinematicCaseExperience } from '@/components/cinematic/CinematicCaseExperience';
import { cinematicCases } from '@/lib/cinematicCases';
import { AutomotiveCase } from '@/components/portfolio/AutomotiveCase';
import { CustomSolutionsCase } from '@/components/portfolio/CustomSolutionsCase';
import { SupportingProject } from '@/components/portfolio/SupportingProject';
import { liveCollections } from '@/lib/liveExperiences';
export function generateStaticParams(){return projects.map(p=>({slug:p.slug}));}
export function generateMetadata({params}:{params:{slug:string}}):Metadata{
 const p=getProject(params.slug);return {title:p?`${p.title} — Orbitvale Work`:'Project not found',description:p?.description};
}
export default function ProjectPage({params}:{params:{slug:string}}){
 const p=getProject(params.slug);if(!p)notFound();if(params.slug==='school-erp') return <SchoolOrbitExperience />;if(params.slug==='automotive') return <AutomotiveCase />;if(params.slug==='custom-solutions') return <CustomSolutionsCase />;if(['raj-tourism','om-studypoint','raj-traders'].includes(params.slug)) return <SupportingProject slug={params.slug} />;if(cinematicCases[params.slug]) return <CinematicCaseExperience slug={params.slug} />;const index=projects.findIndex(x=>x.slug===p.slug);const next=featuredProjects[(Math.max(0,featuredProjects.findIndex(x=>x.slug===p.slug))+1)%featuredProjects.length];
 return <main className="min-h-screen bg-[#090b0f] text-[#f4f5f6] px-6 pt-32 pb-28">
   <div className="max-w-6xl mx-auto">
     <div className="flex flex-wrap justify-between items-center gap-4 border-b border-white/20 pb-5 font-mono text-xs uppercase tracking-[0.22em] text-[#aab4b9]">
       <span>Orbitvale / Selected Work / {String(index+1).padStart(2,'0')}</span><Link className="hover:text-[#7ff3d0]" href="/work">← All work</Link>
     </div>
     <div className="py-16 md:py-24"><p className="mb-5 font-mono text-xs uppercase tracking-[0.24em]" style={{color:p.accent}}>{p.kind} / {p.industry}</p>
       <h1 className="font-display text-[clamp(3rem,10vw,9rem)] leading-[.9] tracking-[-.06em] font-bold uppercase">{p.title}</h1>
       <p className="mt-7 max-w-2xl text-lg md:text-2xl text-[#aeb6ba]">{p.subtitle}</p>
     </div>
     <div className="relative overflow-hidden rounded-xl border border-white/15 bg-[#141820]" style={{aspectRatio:'16 / 9'}}>
       {/* eslint-disable-next-line @next/next/no-img-element */}<img src={p.image} alt={`Visual presentation of ${p.title}`} className="h-full w-full object-contain"/>
     </div>
     <div className="grid md:grid-cols-12 gap-10 md:gap-20 py-20 border-b border-white/20">
       <div className="md:col-span-3 font-mono text-xs uppercase tracking-[0.22em] text-[#7ff3d0]">01 / Overview</div>
       <div className="md:col-span-9"><p className="font-display text-2xl md:text-4xl leading-snug">{p.description}</p>
         <div className="flex flex-wrap gap-3 mt-8">{p.capabilities.map(c=><span key={c} className="rounded-full border border-white/20 px-4 py-2 font-mono text-xs">{c}</span>)}</div>
         {p.demo&&<a href={p.demo} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex rounded-full bg-[#7ff3d0] text-[#0b1111] px-6 py-3 font-mono text-xs uppercase tracking-widest hover:bg-white transition-colors">Open external demo ↗</a>}
       </div>
     </div>
     <div className="grid md:grid-cols-12 gap-8 py-12 border-b border-white/20"><p className="md:col-span-3 font-mono text-xs uppercase tracking-widest text-[#7ff3d0]">02 / Source note</p>
       <div className="md:col-span-9 text-[#aeb6ba] text-sm leading-relaxed"><p>{p.note}</p><p className="mt-2 text-[#747e82]">Material: {p.source}</p></div>
     </div>
     {liveCollections[p.slug] && <Link href={`/live-lab/${p.slug}`} className="my-12 inline-flex bg-[#7ff3d0] text-[#091013] px-7 py-4 font-mono text-xs uppercase tracking-wider">Experience the real frontend ↗</Link>}
     <Link href={`/work/${next.slug}`} className="group block pt-20"><span className="font-mono text-xs uppercase tracking-widest text-[#7ff3d0]">Next orbit ↗</span><h2 className="font-display text-5xl md:text-8xl font-bold mt-4 group-hover:text-[#7ff3d0] transition-colors">{next.title}</h2></Link>
   </div>
 </main>;
}
