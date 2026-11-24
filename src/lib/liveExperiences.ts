/** Verified project source directories and explicitly provided frontend deployments. */
export type LiveExperience = { id:string; label:string; description:string; url:string; source:string; accent:string; status:'public-demo'|'login'|'public-site'; };
export type LiveCollection = { slug:string; title:string; eyebrow:string; description:string; entries:LiveExperience[] };
export const liveCollections:Record<string,LiveCollection> = {
  'forge-gym': {slug:'forge-gym',title:'FORGE',eyebrow:'CONNECTED FITNESS / THREE PACKAGES',description:'Explore the real FORGE ecosystem. Website, management portal and member app are separate demonstrations; their feature scopes differ.',entries:[
    {id:'website',label:'Public Marketing Website',description:'FORGE website, package comparison and Essential demonstration entry.',url:'https://demo-web-forge-gym.onrender.com/',source:'forge-gym/web/website',accent:'#ff584f',status:'public-site'},
    {id:'growth',label:'Owner / Growth',description:'Live demo login for members, attendance, dues, renewals and operations.',url:'https://demo-web-gym-saas.onrender.com/login',source:'forge-gym/web/saas',accent:'#f0a48c',status:'login'},
    {id:'member',label:'Member experience',description:'Actual member web application, accessible using the public quick-demo sign-in.',url:'https://demo-web-gym-member.onrender.com/login',source:'forge-gym/web/member',accent:'#f09b91',status:'login'},
  ]},
  'school-erp':{slug:'school-erp',title:'SCHOOL ERP',eyebrow:'EDUCATION / TWO EDITIONS',description:'View the actual Essential and Professional published frontends. Both require their own demonstration logins for the internal software.',entries:[
    {id:'essential',label:'Essential',description:'Essential edition public sign-in and authenticated school administration experience.',url:'https://school-erp-essential.onrender.com/',source:'User-supplied frontend deployment',accent:'#9f82fa',status:'login'},
    {id:'professional',label:'Professional',description:'Professional edition sign-in and broader school operations experience.',url:'https://school-erp-frontend-fjqv.onrender.com/',source:'User-supplied frontend deployment',accent:'#9f82fa',status:'login'},
  ]},
  'automotive':{slug:'automotive',title:'AUTOMOTIVE WEBSITES',eyebrow:'ONE WEBSITE OFFERING / THREE TEMPLATES',description:'One search-oriented website offering with three individually coded choices: Kohinoor, Boond and Kavach. Templates are not automotive management software or verified ranking results.',entries:[
    {id:'catalog',label:'Studio Catalog & Design Lab',description:'Public studio catalog, design lab and template chooser.',url:'https://car-detailing-by-dwd.onrender.com/catalog/',source:'obsidian-react/src/pages/Catalog.jsx',accent:'#c6a37b',status:'public-site'},
    {id:'kohinoor-primary',label:'Kohinoor (Primary)',description:'Dark luxury detailing flagship.',url:'https://car-detailing-by-dwd.onrender.com/',source:'obsidian-react/src/sites + src/data/catalogSites.js',accent:'#b08d57',status:'public-demo'},
    {id:'kohinoor-alternate',label:'Kohinoor (Alternate)',description:'Dark luxury detailing flagship alternate deployment.',url:'https://obsidian-react.onrender.com/',source:'obsidian-react',accent:'#b08d57',status:'public-demo'},
    {id:'boond',label:'Boond (Beadline)',description:'Single-studio wash experience with light editorial design.',url:'https://car-detailing-by-dwd.onrender.com/boond/',source:'obsidian-react/src/sites/boond',accent:'#3fa9d9',status:'public-demo'},
    {id:'kavach',label:'Kavach (Lacquer)',description:'Multi-studio ceramic & PPF network with warm dark design.',url:'https://car-detailing-by-dwd.onrender.com/kavach/',source:'obsidian-react/src/sites/kavach',accent:'#e8a05a',status:'public-demo'},
  ]},
  'saltlight':{slug:'saltlight',title:'SALTLIGHT',eyebrow:'HOSPITALITY / SCROLL EXPERIENCE',description:'A real interactive demonstration; this is not proof of a real property booking.',entries:[
    {id:'primary',label:'Saltlight Experience',description:'Retreats, craft & stay experience.',url:'https://saltlight.onrender.com',source:'saltlight repository directory',accent:'#badadf',status:'public-demo'},
    {id:'hub',label:'Saltlight Hub',description:'Published showcase hub deployment.',url:'https://demo-web-six-xi.vercel.app/',source:'saltlight repository directory',accent:'#b9dee7',status:'public-demo'}
  ]},
  'nuance':{slug:'nuance',title:'NUANCE',eyebrow:'BEAUTY / EXPERIENCE DESIGN',description:'The original salon experience with source-built editorial interactions.',entries:[
    {id:'primary',label:'Nuance React',description:'Beauty, aesthetics & salon experience.',url:'https://nuance-react.onrender.com',source:'nuance-react repository directory',accent:'#c7b49f',status:'public-demo'},
    {id:'salon-dashboard',label:'Salon Dashboard',description:'Booking & operations management.',url:'https://salon-dashboard.onrender.com',source:'salon-dashboard deployment',accent:'#d4b098',status:'public-site'}
  ]},
  'invoice-manager':{slug:'invoice-manager',title:'INVOICE MANAGER',eyebrow:'BUSINESS SYSTEM / LEGACY DEMO',description:'Legacy-branded live deployment. It is retained as the authentic software source, not rebranded within the app.',entries:[{id:'main',label:'Explore billing system',description:'Published legacy frontend.',url:'https://lightskyblue-elk-819393.hostingersite.com/',source:'User-supplied Hostinger deployment',accent:'#f9d26e',status:'public-site'}]}
};
