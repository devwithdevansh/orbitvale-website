# Orbitvale: agent brief

Read this file fully before touching code. Work on ONE task at a time, in the order below. After each task, stop and wait for me to review.

## Project
- Next.js 14 App Router, TypeScript strict, Tailwind 3, Framer Motion 11, Lenis, three 0.160, @react-three/fiber 8, @react-three/drei 9.
- Brand: Orbitvale, an IT company. Dark theme with mint accent (#7ff3d0), a light "block" in the middle of the homepage, orbit-swoosh logo.
- Read `MEMORY.md` for the current architecture. Do not change anything it lists as working unless a task says so.

## Global rules
1. Do not add automatic redirects on scroll.
2. Keep the custom cursor, Lenis smooth scroll, page transitions and Nav exactly as they are.
3. Respect `prefers-reduced-motion` and touch devices (no pointer-only interactions without a fallback).
4. No scroll handler may call React `setState` every tick. Put scroll values in a ref and read them in `requestAnimationFrame` or `useFrame`.
5. Only mount WebGL canvases while they are in view, and dispose them when they leave.
6. Before saying a task is done, run `npx tsc --noEmit` and `npm run build`, and report the result honestly. If something fails, say so.
7. Do not invent client names, metrics or logos. Existing projects are concepts and stay labelled as concepts.
8. Install a new package only if the task names it, and tell me the exact version.

## Task 1: replace the Work page shelf
Files: `src/components/WorksWheel.tsx`, `src/app/work/page.tsx`, `public/covers/*`.

Problem in the current `WorksWheel`:
- Drag steps one card per ~40px because of `Math.round(deltaX / 80)` plus resetting the start point.
- Inactive cards have `pointerEvents: none`, so side cards cannot be clicked.
- Releasing after a drag can still trigger the arrow link.
- No `touch-action`, no keyboard, no wheel support.
- Covers are tiny placeholder SVGs, and the list below repeats the same six projects.

Build `OrbitGallery.tsx` as its replacement:
- Six projects sit on a tilted ellipse (about -12deg) that echoes the logo's orbit. The front card is largest and shows title, subtitle, and a "View" link.
- A single `target` value is set by drag, wheel, arrow keys, and clicking any card. A spring eases rotation toward it and then snaps to the nearest card.
- Use pointer events with pointer capture. Ignore the link click if the pointer moved more than 6px.
- `touch-action: pan-y` so page scroll still works on phones.
- Hovering a row in the project list below spins the gallery to that project.
- Counter (02 / 06), previous/next buttons, visible focus states, `aria-label`s.
- Reduced motion: a plain horizontally swipeable row.
- Use `next/image`. Keep the "Concept" label.

Acceptance: drag never skips cards, every card is clickable, keyboard works, no console errors, `OrbitGallery` has no per-frame React state updates.

Then remove `WorksWheel` from `work/page.tsx` and delete `WorksWheel.tsx` only after the new one works.

## Task 2: Step into Orbit v2
Files: `src/components/JourneySection.tsx` (keep its pinned `h-[320vh]` structure and `id="chapter-journey"`), `HomeClient.tsx` if needed.
Reference code (read only, do not paste wholesale): `reference/light-speed-r3f.tsx`, `reference/light-speed-alt.tsx`, `reference/warp-drive-shader.tsx`.

Replace the SVG ring tunnel with ONE pinned React Three Fiber canvas, layered back to front:
1. Soft nebula backdrop (gradient fog or simple shader).
2. About 4,000 instanced star streaks plus a little dust, stretched by scroll speed.
3. Twelve glowing ring loops in real Z depth. Some dashed with moving dashes. Each pulses as the camera passes it.
4. A low-poly satellite probe (procedural, or a CC0 model if I add one to `public/models`). Floats and tilts toward the pointer.
5. HTML overlay: "STEP INTO ORBIT" headline plus a small telemetry HUD (speed, distance). The headline must stay legible and not be covered by the probe.
6. Post effects if available: bloom, then chromatic aberration rising with speed.

Scroll beats (percent of section progress):
- 0-15 Arrive: calm dust, rings far, HUD "OV-PRB online".
- 15-40 Accelerate: stars stretch, headline resolves letter by letter.
- 40-70 Warp: long streaks, rings sweep past, aberration rises, headline passes the camera.
- 70-88 Singularity: everything converges on one bright point, bloom peaks.
- 88-100 Break: radial wipe from the centre point flips to the light block (`#f4f5f7`). Replace the current flat fade.

Performance and fallbacks:
- Clamp device pixel ratio to 1.75. Mobile: about 1,200 particles, no chromatic aberration.
- Reduced motion or no WebGL: keep the old SVG version as a fallback component.
- If you add `@react-three/postprocessing`, pick the version that matches R3F 8 and tell me which one.

Acceptance: smooth scrolling on a mid-range laptop, no memory growth after scrolling through five times, headline readable throughout, clean handoff into the light block.

## When you finish each task
Reply with: files changed, packages added, commands run and their results, anything you were unsure about, and what I should check by hand.
