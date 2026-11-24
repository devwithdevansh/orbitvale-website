/** Source-grounded art direction. Never imply a demonstration is a verified client delivery. */
export type CinematicCase = {eyebrow:string;index:string;accent:string;accent2:string;background:string;headline:string[];deck:string;hero:string;portrait:string;video?:string;videoCaption?:string;chapters:{id:string;title:string;text:string;image:string}[];choices?:{label:string;subtitle:string;desc:string;href:string}[];sourceNote:string};
export const cinematicCases:Record<string,CinematicCase> = {
  "forge-gym": {
    "eyebrow": "PRODUCT / FITNESS",
    "index": "02",
    "accent": "#ff533f",
    "accent2": "#e7b09b",
    "background": "#0f1013",
    "headline": [
      "ONE GYM.",
      "THREE WAYS",
      "TO GROW."
    ],
    "deck": "From a cinematic website to connected gym operations, FORGE scales with the needs of a fitness business.",
    "hero": "/orbitvale/visuals/forge-product-landscape.webp",
    "portrait": "/orbitvale/visuals/forge-essential-portrait.webp",
    "video": "/orbitvale/motion/forge-essential-experience.mp4",
    "videoCaption": "Essential sample-gym scroll recording",
    "chapters": [
      {
        "id": "01",
        "title": "Make a stronger first impression.",
        "text": "The Essential package focuses on an online presence for a gym: classes, trainers, memberships, schedules and enquiries. The sample gym is a demonstration, not a real client.",
        "image": "/orbitvale/visuals/forge-essential-landscape.webp"
      },
      {
        "id": "02",
        "title": "Bring the operation together.",
        "text": "Growth introduces core day-to-day management workflows: member records, attendance, payments, renewals, leads and reporting.",
        "image": "/orbitvale/visuals/forge-product-landscape.webp"
      },
      {
        "id": "03",
        "title": "Connect the entire experience.",
        "text": "Performance extends the experience toward coaching, trainers and member-facing tools. Availability of specific add-ons should be checked in the live demo.",
        "image": "/orbitvale/visuals/forge-essential-portrait.webp"
      }
    ],
    "choices": [
      {
        "label": "Essential",
        "subtitle": "Get found online",
        "desc": "A branded gym website and enquiry experience.",
        "href": "https://demo-web-forge-gym.onrender.com/"
      },
      {
        "label": "Growth",
        "subtitle": "Run daily operations",
        "desc": "Members, check-ins, dues and follow-up workflows.",
        "href": "https://demo-web-gym-saas.onrender.com/login"
      },
      {
        "label": "Performance",
        "subtitle": "Connect trainers & members",
        "desc": "A larger ecosystem incorporating member and coaching experiences.",
        "href": "https://demo-web-gym-member.onrender.com/login"
      }
    ],
    "sourceNote": "Real FORGE frontend capture and supplied recordings. Figures and gym accounts displayed in demos are fictional sample data. Proposed prices and preview add-ons are not published here as guaranteed offerings."
  },
  "automotive": {
    "eyebrow": "DESIGN COLLECTION / AUTOMOTIVE",
    "index": "03",
    "accent": "#dbb787",
    "accent2": "#c0a38b",
    "background": "#11110f",
    "headline": [
      "THREE",
      "IDENTITIES.",
      "ONE INDUSTRY."
    ],
    "deck": "A curated collection of search-conscious websites for car-detailing studios, with three distinct visual identities rather than a one-size-fits-all reskin.",
    "hero": "/orbitvale/visuals/automotive-collection-landscape.webp",
    "portrait": "/orbitvale/visuals/automotive-collection-portrait.webp",
    "video": "/orbitvale/motion/kohinoor-scroll.mp4",
    "videoCaption": "Original Kohinoor scroll recording",
    "chapters": [
      {
        "id": "01",
        "title": "Kohinoor — an expressive presence.",
        "text": "A premium, darker visual language with cinematic automotive imagery and scroll-led storytelling.",
        "image": "/orbitvale/visuals/kohinoor-landscape.webp"
      },
      {
        "id": "02",
        "title": "A catalogue, not a recolour.",
        "text": "The three studio designs offer different typographic systems and creative sensibilities, plus a client-facing catalogue for selection.",
        "image": "/orbitvale/visuals/automotive-collection-landscape.webp"
      },
      {
        "id": "03",
        "title": "Designed for the next customer.",
        "text": "Service discovery, studio information and contact paths are integral to these demonstrations. Search rankings and traffic impact have not been independently verified.",
        "image": "/orbitvale/visuals/kohinoor-portrait.webp"
      }
    ],
    "choices": [
      {
        "label": "Kohinoor",
        "subtitle": "Dark / cinematic",
        "desc": "Dark luxury detailing flagship.",
        "href": "https://car-detailing-by-dwd.onrender.com/"
      },
      {
        "label": "Boond",
        "subtitle": "Single-studio wash",
        "desc": "Single-studio wash experience with clean editorial layout.",
        "href": "https://car-detailing-by-dwd.onrender.com/boond/"
      },
      {
        "label": "Kavach",
        "subtitle": "Ceramic & PPF network",
        "desc": "Multi-studio ceramic & PPF network.",
        "href": "https://car-detailing-by-dwd.onrender.com/kavach/"
      }
    ],
    "sourceNote": "Design demonstrations, not verified paid client deliveries or SEO outcomes. Existing sample photography may require independent rights review before reuse in advertising."
  },
  "raj-tourism": {
    "eyebrow": "PROJECT SHOWCASE / TRAVEL",
    "index": "04",
    "accent": "#9dbce7",
    "accent2": "#b9cdec",
    "background": "#0a1422",
    "headline": [
      "EXPLORE",
      "BEYOND",
      "THE ORDINARY."
    ],
    "deck": "An editorial travel website presented through original desktop and mobile compositions supplied by the team.",
    "hero": "/ui-kit/projects/raj-tourism.webp",
    "portrait": "/ui-kit/projects/raj-tourism.webp",
    "chapters": [
      {
        "id": "01",
        "title": "Destinations become stories.",
        "text": "An emphasis on destinations, journey discovery and visual hierarchy.",
        "image": "/ui-kit/projects/raj-tourism.webp"
      },
      {
        "id": "02",
        "title": "A consistent experience.",
        "text": "Desktop and mobile mockups were supplied as existing project presentation material.",
        "image": "/ui-kit/projects/raj-tourism.webp"
      }
    ],
    "sourceNote": "Original user-supplied presentation imagery. Project commissioning, public permissions and outcomes not independently verified."
  },
  "om-studypoint": {
    "eyebrow": "PROJECT SHOWCASE / EDUCATION",
    "index": "05",
    "accent": "#c1b2f0",
    "accent2": "#e5ddf9",
    "background": "#151022",
    "headline": [
      "A CLEARER",
      "WAY TO",
      "LEARN."
    ],
    "deck": "An education web experience documented in the supplied laptop, tablet and mobile mockups.",
    "hero": "/ui-kit/projects/om-studypoint.png",
    "portrait": "/ui-kit/projects/om-studypoint.png",
    "chapters": [
      {
        "id": "01",
        "title": "Learning, organised.",
        "text": "An approachable information architecture for students and the people who support them.",
        "image": "/ui-kit/projects/om-studypoint.png"
      },
      {
        "id": "02",
        "title": "From desktop to mobile.",
        "text": "The original supplied project images cover multiple screen sizes.",
        "image": "/ui-kit/projects/om-studypoint.png"
      }
    ],
    "sourceNote": "Original user-supplied presentation material. Any client relationship or business outcome must be confirmed before publishing as factual."
  },
  "raj-traders": {
    "eyebrow": "PROJECT SHOWCASE / COMMERCE",
    "index": "06",
    "accent": "#cee09c",
    "accent2": "#e3efbb",
    "background": "#131911",
    "headline": [
      "PRODUCTS",
      "WITH",
      "PRESENCE."
    ],
    "deck": "A commerce-focused website experience shown through provided homepage, product and tablet compositions.",
    "hero": "/ui-kit/projects/raj-traders.png",
    "portrait": "/ui-kit/projects/raj-traders.png",
    "chapters": [
      {
        "id": "01",
        "title": "Products, presented with intent.",
        "text": "A visual structure built to make the offering easy to discover and navigate.",
        "image": "/ui-kit/projects/raj-traders.png"
      },
      {
        "id": "02",
        "title": "Designed to work across screens.",
        "text": "Original project presentation assets include desktop, product-section and tablet compositions.",
        "image": "/ui-kit/projects/raj-traders.png"
      }
    ],
    "sourceNote": "Original user-supplied project images. Deployment and client results not independently verified."
  },
  "saltlight": {
    "eyebrow": "WEB EXPERIENCE / HOSPITALITY",
    "index": "07",
    "accent": "#badadf",
    "accent2": "#d9eaec",
    "background": "#101d24",
    "headline": [
      "WHERE LAND",
      "BECOMES",
      "STORY."
    ],
    "deck": "A hospitality web demonstration set around the landscape of the White Rann, with an editorial scroll journey.",
    "hero": "https://raw.githubusercontent.com/devwithdevansh/demo-web/orbitvale-authentic-captures-20261123/orbitvale-capture/public-sites/saltlight.jpg",
    "portrait": "https://raw.githubusercontent.com/devwithdevansh/demo-web/orbitvale-authentic-captures-20261123/orbitvale-capture/public-sites/saltlight.jpg",
    "chapters": [
      {
        "id": "01",
        "title": "An original interface, a distinct perspective.",
        "text": "This scene is built around the actual deployed frontend capture, rather than an invented layout or artificially generated dashboard.",
        "image": "https://raw.githubusercontent.com/devwithdevansh/demo-web/orbitvale-authentic-captures-20261123/orbitvale-capture/public-sites/saltlight.jpg"
      },
      {
        "id": "02",
        "title": "A digital experience with purpose.",
        "text": "The public site demonstrates its visual and editorial direction. Any customer outcomes, licensing of included photography and delivery status require separate confirmation.",
        "image": "https://raw.githubusercontent.com/devwithdevansh/demo-web/orbitvale-authentic-captures-20261123/orbitvale-capture/public-sites/saltlight.jpg"
      }
    ],
    "sourceNote": "Authentic public browser viewport from https://demo-web-six-xi.vercel.app/. This is a demonstration capture, not verified paid client delivery. The image is currently loaded from the isolated GitHub capture branch and requires internet access. Photography rights and live feature claims remain to be checked."
  },
  "amber-ash": {
    "eyebrow": "WEB EXPERIENCE / HOSPITALITY",
    "index": "08",
    "accent": "#e3ad7d",
    "accent2": "#f5cb9f",
    "background": "#241814",
    "headline": [
      "THE HEAT",
      "OF A GOOD",
      "STORY."
    ],
    "deck": "A restaurant design demonstration marrying warm editorial typography with menus, story and booking journeys.",
    "hero": "https://raw.githubusercontent.com/devwithdevansh/demo-web/orbitvale-authentic-captures-20261123/orbitvale-capture/public-sites/amber-ash.jpg",
    "portrait": "https://raw.githubusercontent.com/devwithdevansh/demo-web/orbitvale-authentic-captures-20261123/orbitvale-capture/public-sites/amber-ash.jpg",
    "chapters": [
      {
        "id": "01",
        "title": "An original interface, a distinct perspective.",
        "text": "This scene is built around the actual deployed frontend capture, rather than an invented layout or artificially generated dashboard.",
        "image": "https://raw.githubusercontent.com/devwithdevansh/demo-web/orbitvale-authentic-captures-20261123/orbitvale-capture/public-sites/amber-ash.jpg"
      },
      {
        "id": "02",
        "title": "A digital experience with purpose.",
        "text": "The public site demonstrates its visual and editorial direction. Any customer outcomes, licensing of included photography and delivery status require separate confirmation.",
        "image": "https://raw.githubusercontent.com/devwithdevansh/demo-web/orbitvale-authentic-captures-20261123/orbitvale-capture/public-sites/amber-ash.jpg"
      }
    ],
    "sourceNote": "Authentic public browser viewport from https://amber-ash.onrender.com/. This is a demonstration capture, not verified paid client delivery. The image is currently loaded from the isolated GitHub capture branch and requires internet access. Photography rights and live feature claims remain to be checked."
  },
  "nuance": {
    "eyebrow": "WEB EXPERIENCE / BEAUTY",
    "index": "09",
    "accent": "#cfbaa3",
    "accent2": "#e1d3c6",
    "background": "#211a1b",
    "headline": [
      "THE ART",
      "OF THE",
      "DETAIL."
    ],
    "deck": "An editorial salon demonstration exploring refined imagery, services and understated micro-interactions.",
    "hero": "https://raw.githubusercontent.com/devwithdevansh/demo-web/orbitvale-authentic-captures-20261123/orbitvale-capture/public-sites/nuance.jpg",
    "portrait": "https://raw.githubusercontent.com/devwithdevansh/demo-web/orbitvale-authentic-captures-20261123/orbitvale-capture/public-sites/nuance.jpg",
    "chapters": [
      {
        "id": "01",
        "title": "An original interface, a distinct perspective.",
        "text": "This scene is built around the actual deployed frontend capture, rather than an invented layout or artificially generated dashboard.",
        "image": "https://raw.githubusercontent.com/devwithdevansh/demo-web/orbitvale-authentic-captures-20261123/orbitvale-capture/public-sites/nuance.jpg"
      },
      {
        "id": "02",
        "title": "A digital experience with purpose.",
        "text": "The public site demonstrates its visual and editorial direction. Any customer outcomes, licensing of included photography and delivery status require separate confirmation.",
        "image": "https://raw.githubusercontent.com/devwithdevansh/demo-web/orbitvale-authentic-captures-20261123/orbitvale-capture/public-sites/nuance.jpg"
      }
    ],
    "sourceNote": "Authentic public browser viewport from https://nuance-react.onrender.com/. This is a demonstration capture, not verified paid client delivery. The image is currently loaded from the isolated GitHub capture branch and requires internet access. Photography rights and live feature claims remain to be checked."
  },
  "invoice-manager": {
    "eyebrow": "BUSINESS SOFTWARE / BUSINESS SOFTWARE",
    "index": "10",
    "accent": "#ffd065",
    "accent2": "#f9e5ad",
    "background": "#181810",
    "headline": [
      "EVERY",
      "DETAIL",
      "COUNTS."
    ],
    "deck": "A business billing interface hosted as a legacy-brand demonstration; the next presentation phase requires access to functional internal screens.",
    "hero": "https://raw.githubusercontent.com/devwithdevansh/demo-web/orbitvale-authentic-captures-20261123/orbitvale-capture/public-sites/invoice-manager.jpg",
    "portrait": "https://raw.githubusercontent.com/devwithdevansh/demo-web/orbitvale-authentic-captures-20261123/orbitvale-capture/public-sites/invoice-manager.jpg",
    "chapters": [
      {
        "id": "01",
        "title": "An original interface, a distinct perspective.",
        "text": "This scene is built around the actual deployed frontend capture, rather than an invented layout or artificially generated dashboard.",
        "image": "https://raw.githubusercontent.com/devwithdevansh/demo-web/orbitvale-authentic-captures-20261123/orbitvale-capture/public-sites/invoice-manager.jpg"
      },
      {
        "id": "02",
        "title": "A digital experience with purpose.",
        "text": "The public deployment exposes a legacy-branded billing interface. Internal billing workflows require further authentication before visual claims can be made.",
        "image": "https://raw.githubusercontent.com/devwithdevansh/demo-web/orbitvale-authentic-captures-20261123/orbitvale-capture/public-sites/invoice-manager.jpg"
      }
    ],
    "sourceNote": "Authentic public browser viewport from https://lightskyblue-elk-819393.hostingersite.com/. This is a demonstration capture, not verified paid client delivery. The image is currently loaded from the isolated GitHub capture branch and requires internet access. Photography rights and live feature claims remain to be checked."
  }
};
