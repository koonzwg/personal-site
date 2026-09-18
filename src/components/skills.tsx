"use client";

import { useEffect, useRef } from "react";
import { skillRows, type Skill } from "@/lib/skills";
import { button, delay } from "@/lib/styles";

const tag = `${button} shrink-0 bg-[#F2F2F2] text-[#919191] hover:opacity-100`;

// Motion: glide in fast, decay into a slow drift. Rows travel in opposite directions.
const BASE_SPEED = 14; // px/s at rest
const BOOST = 1400; // extra px/s at the start
const DECAY = 0.38; // s — how quickly the boost bleeds off
const START_DELAY = 450; // ms — lines up with the page's entrance sequence
const COPIES = 3; // repeat each row so the loop is seamless at any width

function Row({ skills, hidden }: { skills: Skill[]; hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 gap-1 pr-1">
      {skills.map((skill) => (
        <li key={skill.name} className={tag}>
          <svg
            viewBox="0 0 24 24"
            width={14}
            height={14}
            fill="currentColor"
            aria-hidden
          >
            <path d={skill.path} />
          </svg>
          {skill.name}
        </li>
      ))}
    </ul>
  );
}

export function Skills() {
  const tracks = useRef<(HTMLDivElement | null)[]>([]);
  const hovered = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const els = tracks.current.filter(Boolean) as HTMLDivElement[];
    // Offset the second row so the two don't line up.
    const pos = els.map((_, i) => (i === 1 ? 0.5 : 0));
    let setWidths = els.map((el) => el.scrollWidth / COPIES);
    const measure = () =>
      (setWidths = els.map((el) => el.scrollWidth / COPIES));
    const ro = new ResizeObserver(measure);
    els.forEach((el) => ro.observe(el));

    const apply = () =>
      els.forEach((el, i) => {
        const w = setWidths[i];
        const x = (((pos[i] * w) % w) + w) % w;
        // Row 0 drifts left, row 1 drifts right.
        el.style.transform = `translate3d(${i === 0 ? -x : x - w}px,0,0)`;
      });
    apply();

    let raf = 0;
    let last = 0;
    let start = 0;
    let hoverMix = 1; // 1 = full speed, 0 = paused; eased so hover never jerks
    const tick = (now: number) => {
      if (!start) start = last = now;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t = (now - start) / 1000;
      hoverMix += ((hovered.current ? 0 : 1) - hoverMix) * Math.min(1, dt * 4);
      const speed = (BASE_SPEED + BOOST * Math.exp(-t / DECAY)) * hoverMix;
      els.forEach((_, i) => (pos[i] += (speed * dt) / (setWidths[i] || 1)));
      apply();
      raf = requestAnimationFrame(tick);
    };
    const timer = setTimeout(
      () => (raf = requestAnimationFrame(tick)),
      START_DELAY,
    );

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <section
      aria-label="Skills"
      style={delay(450)}
      onPointerEnter={(e) => (hovered.current = e.pointerType === "mouse")}
      onPointerLeave={() => (hovered.current = false)}
      className="enter flex flex-col gap-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
    >
      {skillRows.map((row, i) => (
        <div
          key={i}
          ref={(el) => {
            tracks.current[i] = el;
          }}
          className="flex w-max will-change-transform"
        >
          {Array.from({ length: COPIES }, (_, c) => (
            <Row key={c} skills={row} hidden={c > 0} />
          ))}
        </div>
      ))}
    </section>
  );
}
