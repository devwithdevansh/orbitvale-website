import {notFound} from 'next/navigation';
import {liveCollections} from '@/lib/liveExperiences';
import {LiveLab} from '@/components/live/LiveLab';
import type {Metadata} from 'next';
export function generateStaticParams(){return Object.keys(liveCollections).map(slug=>({slug}));}
export function generateMetadata({params}:{params:{slug:string}}):Metadata{const a=liveCollections[params.slug];return {title:a?`${a.title} Live Preview — Orbitvale`:'Not found',description:a?.description};}
export default function Page({params}:{params:{slug:string}}){const collection=liveCollections[params.slug];if(!collection)notFound();return <LiveLab collection={collection}/>;}
