/** Source-backed catalogue. A demonstration is not a claimed client delivery. */
export type ShowcaseProject = {
  slug: string; title: string; subtitle: string; kind: 'Product' | 'Demonstration' | 'Project showcase' | 'Custom solutions';
  industry: string; description: string; capabilities: string[]; image: string; accent: string;
  demo?: string; source: string; note: string; featured?: boolean;
};
export const projects: ShowcaseProject[] = [
  { featured:true, slug:'school-erp', title:'School ERP', subtitle:'Essential & Professional editions', kind:'Product', industry:'Education',
    description:'School operations software with distinct Essential and Professional editions. Explore the real application interfaces and their different levels of capability.',
    capabilities:['Administration','Fee workflows','School operations'], image:'/orbitvale/visuals/school-erp-portrait.webp',accent:'#7ff3d0',
    demo:'https://school-erp-frontend-fjqv.onrender.com/',source:'Uploaded School ERP screenshots and supplied frontend URLs',note:'Art-directed cover uses a user-supplied School ERP dashboard mockup. Essential and Professional have separate public login demos; internal production state and edition differences require authentication and verification.' },
  { featured:true, slug:'forge-gym', title:'FORGE Gym', subtitle:'Connected gym management ecosystem',kind:'Product', industry:'Fitness',
    description:'A connected gym management system spanning a product site, business console, administrator interface, member experience and Flutter application.',
    capabilities:['Gym management','Member experience','Web & mobile'],image:'/orbitvale/visuals/forge-product-portrait.webp',accent:'#cbd3e5',
    demo:'https://demo-web-forge-gym.onrender.com/',source:'demo-web/forge-gym/README.md',note:'Art-directed cover uses genuine FORGE package catalogue frames from a user-supplied screen recording. The catalogue demonstrates Essential, Growth and Performance; not all features are included in Essential.' },
  { featured:true, slug:'automotive',title:'Automotive Websites',subtitle:'SEO-oriented websites for detailing & car-wash businesses',kind:'Product',industry:'Automotive',
    description:'A ready-to-customise website offering for detailing and car-wash businesses. Customers can explore three separately coded website templates—Kohinoor, Boond and Kavach—then select a look that fits their studio. Search-focused structure is a design objective, not a guarantee of ranking.',
    capabilities:['Three website templates','Brand customisation','Search-focused foundations'],image:'/orbitvale/ov07/automotive-portrait.webp',accent:'#d4ad7d',
    demo:'https://car-detailing-by-dwd.onrender.com/',source:'demo-web/obsidian-react/src/data/catalogSites.js and original recorded car-detailing catalogue',note:'This is one commercial, template-based website offering, NOT an automotive management SaaS and NOT three separate Orbitvale products. The original code includes Kohinoor, Boond and Kavach websites. No search rankings or client growth results are claimed.' },
  { featured:true, slug:'custom-solutions',title:'Custom Solutions',subtitle:'Designed and engineered around each business',kind:'Custom solutions',industry:'Cross-industry',
    description:'Orbitvale also designs and develops websites, applications, software and workflows to suit a business rather than forcing it into an off-the-shelf package. Selected portfolio materials span tourism, education and commerce.',
    capabilities:['Custom web platforms','Business applications','UI / UX & integrations'],image:'/orbitvale/ov07/custom-solutions-portrait.webp',accent:'#baa5ec',
    source:'Original user-supplied Raj Tourism, Om Studypoint and Raj Traders visual materials',note:'The artwork assembles genuine supplied project images. Public client relationship, permission, functionality and outcome claims must be verified before publication.' },
  { slug:'raj-tourism',title:'Raj Tourism',subtitle:'Tourism website showcase',kind:'Project showcase',industry:'Travel',
    description:'A tourism web experience presented through the supplied desktop and mobile compositions.',
    capabilities:['Responsive web','Destination presentation','Content layouts'],image:'/ui-kit/projects/raj-tourism.webp',accent:'#a7b6dc',
    source:'User-supplied assets.zip',note:'Client delivery status and approved public case-study details are not yet verified.' },
  { slug:'om-studypoint',title:'Om Studypoint',subtitle:'Education website showcase',kind:'Project showcase',industry:'Education',
    description:'An education website shown through laptop, tablet and mobile presentation assets.',
    capabilities:['Responsive website','Education','Interface presentation'],image:'/ui-kit/projects/om-studypoint.png',accent:'#c4bbeb',
    source:'User-supplied assets.zip',note:'Client delivery status and outcomes are not yet verified.' },
  { slug:'raj-traders',title:'Raj Traders',subtitle:'Commercial website showcase',kind:'Project showcase',industry:'Commerce',
    description:'A commercial website presented through homepage, product-section and tablet compositions.',
    capabilities:['Web development','Product presentation','Responsive layouts'],image:'/ui-kit/projects/raj-traders.png',accent:'#c0d49e',
    source:'User-supplied assets.zip',note:'Client delivery status and outcomes are not yet verified.' },
  { slug:'saltlight',title:'Saltlight',subtitle:'Hospitality experience',kind:'Demonstration',industry:'Hospitality',description:'An editorial hospitality website concept centred on the White Rann.',capabilities:['Web storytelling','Responsive frontend','Editorial design'],image:'https://raw.githubusercontent.com/devwithdevansh/demo-web/orbitvale-authentic-captures-20261123/orbitvale-capture/public-sites/saltlight.jpg',accent:'#badadf',demo:'https://saltlight.onrender.com/',source:'Live public browser screenshot in Orbitvale capture branch',note:'Website demonstration. No real property booking or client outcomes are implied.' },
  { slug:'amber-ash',title:'Amber & Ash',subtitle:'Restaurant experience',kind:'Demonstration',industry:'Hospitality',description:'A restaurant website demonstration built around warm art direction and story-led service discovery.',capabilities:['Creative frontend','Hospitality','Editorial layout'],image:'https://raw.githubusercontent.com/devwithdevansh/demo-web/orbitvale-authentic-captures-20261123/orbitvale-capture/public-sites/amber-ash.jpg',accent:'#e3ad7d',demo:'https://amber-ash.onrender.com/',source:'Live public browser screenshot in Orbitvale capture branch',note:'Website demonstration. Photos and any hospitality claims require independent confirmation.' },
  { slug:'nuance',title:'Nuance',subtitle:'Salon experience',kind:'Demonstration',industry:'Beauty',description:'A design-forward salon website demonstration with editorial aesthetics and interaction details.',capabilities:['Art direction','Responsive frontend','Interaction design'],image:'https://raw.githubusercontent.com/devwithdevansh/demo-web/orbitvale-authentic-captures-20261123/orbitvale-capture/public-sites/nuance.jpg',accent:'#cfbaa3',demo:'https://nuance-react.onrender.com/',source:'Live public browser screenshot in Orbitvale capture branch',note:'Website demonstration; source photography rights not independently verified.' },
  { slug:'invoice-manager',title:'Invoice Manager',subtitle:'Business billing experience',kind:'Project showcase',industry:'Business software',description:'A legacy billing system frontend showcased from a publicly deployed site.',capabilities:['Billing UI','Web application','Business workflows'],image:'https://raw.githubusercontent.com/devwithdevansh/demo-web/orbitvale-authentic-captures-20261123/orbitvale-capture/public-sites/invoice-manager.jpg',accent:'#ffd065',demo:'https://lightskyblue-elk-819393.hostingersite.com/',source:'Live public browser screenshot in Orbitvale capture branch',note:'Legacy-branded demo. Internal billing functionality, project status and client results remain unverified.' },
];
export const featuredProjects = projects.filter(p => p.featured);
export const supportingProjects = projects.filter(p => !p.featured);
export function getProject(slug:string){return projects.find(p=>p.slug===slug)}
