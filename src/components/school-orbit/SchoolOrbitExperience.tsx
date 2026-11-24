'use client';
import { useEffect, useRef } from 'react';
import { schoolOrbitStyles, schoolOrbitHeaderOverrides } from './schoolOrbitStyles';
import { schoolOrbitMarkup } from './schoolOrbitMarkup';

const editions = {
  essential: {
    kicker: '01 / ESSENTIAL EDITION',
    title: 'The essentials,<br/>handled.',
    desc: 'A focused operating layer for everyday school administration: student records, fee collection and routine accounting.',
    features: ['Fee collection and dues', 'Student directory', 'Receipts and expenses'],
    url: 'https://school-erp-essential.onrender.com',
  },
  professional: {
    kicker: '02 / PROFESSIONAL EDITION',
    title: 'A wider view of<br/>school operations.',
    desc: 'A broader suite connecting school administration with academic workflows, attendance, timetables and examinations.',
    features: ['Academic masters', 'Attendance and timetable', 'Examinations and fees'],
    url: 'https://school-erp-frontend-fjqv.onrender.com/',
  },
} as const;

/** Fully integrated in the existing project; no iframe, separate header, footer or scroll provider. */
export function SchoolOrbitExperience() {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = container.current;
    if (!root) return;
    const track = root.querySelector<HTMLElement>('.sticky-track');
    const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-edition]'));
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    function update() {
      frame = 0;
      if (!root || !track) return;
      if (media.matches) { root.style.setProperty('--scroll', '1'); root.style.setProperty('--grow', '1'); return; }
      const rect = track.getBoundingClientRect();
      const length = Math.max(1, track.offsetHeight - window.innerHeight);
      const progress = Math.max(0, Math.min(1, -rect.top / length));
      root.style.setProperty('--scroll', progress.toFixed(4));
      root.style.setProperty('--grow', Math.min(1, progress * 1.7).toFixed(4));
    }
    function queue() { if (!frame) frame = window.requestAnimationFrame(update); }
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    if (typeof media.addEventListener === 'function') media.addEventListener('change', queue);
    update();

    const disposers = buttons.map((btn) => {
      const onClick = () => {
        const value = btn.dataset.edition === 'professional' ? 'professional' : 'essential';
        const version = editions[value];
        buttons.forEach((button) => button.setAttribute('aria-pressed', String(button === btn)));
        const main = root.querySelector<HTMLElement>('#edition-detail');
        if (main) { main.style.animation = 'none'; void main.offsetWidth; main.style.animation = 'fadeIn .35s ease'; }
        const kicker = root.querySelector('#edition-kicker');
        if (kicker) kicker.textContent = version.kicker;
        const title = root.querySelector('#edition-title');
        if (title) title.innerHTML = version.title;
        const desc = root.querySelector('#edition-desc');
        if (desc) desc.textContent = version.desc;
        const features = root.querySelector('#edition-features');
        if (features) features.innerHTML = version.features.map((feature, index) => '<div><span>0' + (index + 1) + ' / ' + feature + '</span><i>↗</i></div>').join('');
        const link = root.querySelector<HTMLAnchorElement>('#edition-demo');
        if (link) { link.href = version.url; link.textContent = 'OPEN ' + value.toUpperCase() + ' DEMO ↗'; }
      };
      btn.addEventListener('click', onClick);
      return () => btn.removeEventListener('click', onClick);
    });
    return () => {
      window.removeEventListener('scroll', queue);
      window.removeEventListener('resize', queue);
      if (typeof media.removeEventListener === 'function') media.removeEventListener('change', queue);
      if (frame) window.cancelAnimationFrame(frame);
      disposers.forEach((dispose) => dispose());
    };
  }, []);

  return (
    <div className="ov04-school" ref={container} aria-label="School ERP orbital product story">
      <style>{schoolOrbitStyles + schoolOrbitHeaderOverrides}</style>
      <div dangerouslySetInnerHTML={{ __html: schoolOrbitMarkup }} />
      <div className="ov-school-live-gateway"><a href="/live-lab/school-erp">EXPLORE LIVE EDITION PREVIEWS ↗</a><span>Real published demos · no reconstructed UI</span></div>
    </div>
  );
}
