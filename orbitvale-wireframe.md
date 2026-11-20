# Orbitvale — Website Wireframe & Component Map

**Brand:** Orbitvale (IT company)
**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS · shadcn/ui · Framer Motion · three.js / @react-three/fiber / @react-three/drei · lucide-react
**Aesthetic:** Dark theme, stencil/letterspaced typography, orbit/space motif, high-motion 3D + scroll-driven animation (inspired by Halden + Lusion + 21st.dev component library)

---

## Page structure

### 1. Home (/)
Landing page built as a sequence of full-height animated sections.

| Section | Component(s) from prompts.txt | Role / Animation |
|---|---|---|
| Hero | `OrbitalHeroSection` + `EZPZTypeTunnel` | Orbital hero with type-tunnel reveal of the Orbitvale wordmark; orbit-swoosh mark as SVG |
| Intro / value prop | `SingularityCore` | Particle "singularity" burst leading into the one-line positioning statement |
| Scroll narrative | `svg-follow-scroll` + `ScrollHeroSection` | Scroll-driven line drawing that unfolds the story as the user scrolls |
| What we do (services) | `CareersValues` (interactive values grid) | Re-purposed as service cards with hover micro-interactions |
| Work showcase | `WorksWheel` + `CoverFlow` | Rotating 3D wheel of case studies + cover-flow project browser |
| 3D gallery | `ParticleSphere` (`cosmos-3d-orbit-gallery`) | Image sphere of client/work thumbnails |
| Global network / CDN | `GlobeCdn` | 3D globe with location arcs showing delivery footprint |
| Black-hole / deep-tech | `BlackHoleVortex` + `EtchedAccretion` | Dramatic shader sections for "deep tech" positioning |
| Neon accent band | `NeonLoop` + `ChromeArcs` | Glowing motion accents between sections |
| CTA | `LightSpeed` + `WarpTunnel` | High-energy tunnel leading into the contact CTA |

### 2. About (/about)
- `OrbitalSphereBackground` as ambient page background
- Team/values content using `CareersValues` grid
- `SpiralAnimation` as a decorative timeline of the company story

### 3. Services (/services)
- Service cards built on `CareersValues` / `ValueCard`
- `ArcCarousel` or `CurvedLensCarousel` for service examples
- `EtchedAccretion` section for a "how we work" visual

### 4. Work / Projects (/work)
- `WorksWheel` as the main project browser
- `CoverFlow` for featured project stories
- Case-study detail pages (custom layouts, full-width imagery per Halden)

### 5. Contact (/contact)
- `BottleNotFound`-style playful 404 sibling tone
- Contact form (shadcn form primitives)
- `GlobeCdn` small variant showing office locations

### 6. 404 (/404)
- `BottleNotFound` — message-in-a-bottle 404 page, pure SVG + CSS, theme-aware

---

## Component inventory (from prompts.txt)

**3D / heroes (React Three Fiber):**
- `cosmos-3d-orbit-gallery` → `ParticleSphere` — rotating image sphere
- `orbital-sphere` → `OrbitalSphereBackground` — ambient orbital background
- `works-wheel` → `WorksWheel` — rotating 3D card wheel
- `cobe-globe-cdn` → `GlobeCdn` — globe with arcs
- `orbiting-circles-02` → orbiting circles globe
- `singularity` → `SingularityCore` — particle burst core
- `airlock-spaceship-hero` → `AirlockHero` — spaceship airlock hero
- `orbital-hero-section` → `OrbitalHeroSection` — full orbital hero scene

**Carousels / sliders:**
- `orbit-flip-slider` → `OrbitFlipSlider`
- `cover-flow` → `CoverFlow` — 3D cover-flow browser
- `neon-loop` → `NeonLoop` — neon glowing loop
- `chrome-arcs` → `ChromeArcs` — glossy black chrome rings
- `arc-carousel` → `ArcCarousel`
- `3d-curved-carousel` → `CurvedLensCarousel`

**Values / features:**
- `interactive-values-grid` → `CareersValues` — interactive grid of value cards

**Shaders / backgrounds:**
- `halftone-nebula` → `HalftoneNebula` — halftone gas sky
- `black-hole-vortex-animation` → `BlackHoleVortex`
- `etched-accretion` → `EtchedAccretion` — accretion disk shader
- `thinking-orbs` → thinking orbs
- `warp-drive-shader` → warp tunnel shader
- `light-speed` → `LightSpeed` — light speed tunnel
- `warp-tunnel` → `WarpTunnel`
- `sphere` → sphere component
- `spiral-animation` → `SpiralAnimation`

**Type / misc:**
- `ezpz-type-tunnel` → `EZPZTypeTunnel` — native font tunnel type
- `scroll-hero-section` → scroll-driven hero
- `lunar-gravity-card` → `LunarGravityCard`
- `bottle-page-not-found` → `BottleNotFound` — 404 page
- `shader-lines` → `ShaderAnimation`
- `svg-follow-scroll` → SVG follow-scroll

---

## Design tokens (derived from logo + references)

- **Background:** near-black (`#0a0a0a` / `#050505`)
- **Primary text:** white / off-white (`#ffffff`, `#f5f5f5`)
- **Accent:** single accent color for orbit glow (suggest cyan or amber against black)
- **Typography:** stencil / geometric sans, wide tracking (echoes the ORBITVALE wordmark); body in a clean geometric sans
- **Motion:** framer-motion layout + scroll animations, reduced-motion respect (`usePrefersReducedMotion` already present in prompts)

---

## Implementation order (step-by-step)

1. Scaffold Next.js + Tailwind + TypeScript + shadcn/ui
2. Install 3D + motion dependencies (`three`, `@react-three/fiber`, `@react-three/drei`, `framer-motion`, `lucide-react`)
3. Add Orbitvale logo + global dark theme + typography
4. Build layout shell (root layout, nav, footer)
5. Build Home hero + orbital sections
6. Build services / work / about / contact / 404 pages
7. Wire sections together with scroll-driven triggers
8. Test reduced motion + responsiveness, then deploy

Save this file and confirm, and I'll begin scaffolding the Next.js project in step 1.