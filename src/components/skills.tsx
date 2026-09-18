"use client";

import { useEffect, useRef } from "react";
import { skillRows, type Skill } from "@/lib/skills";
import { delay } from "@/lib/styles";

const tag =
  "inline-flex h-[34px] shrink-0 items-center gap-[5px] rounded-[10px] bg-[#F2F2F2] px-3 text-[15px] font-medium tracking-[-0.03em] text-[#919191] transition-colors duration-300 hover:text-[#5E5E5E]";

// Motion: glide in fast, decay into a slow drift. Rows travel in opposite directions.
// Rows can be grabbed and flung; they then ease back to the drift.
const BASE_SPEED = 10; // px/s at rest
const BOOST = 1400; // extra px/s at the start
const SETTLE = 0.38; // s — time constant for easing back to the drift speed
const START_DELAY = 450; // ms — lines up with the page's entrance sequence
const MAX_FLING = 2600; // px/s
const COPIES = 3; // repeat each row so the loop is seamless at any width
const DIRS = [-1, 1]; // row 0 drifts left, row 1 drifts right

function Row({ skills, hidden }: { skills: Skill[]; hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 gap-1 pr-1">
      {skills.map((skill) => (
        <li
          key={skill.name}
          className={`group ${tag}`}
          style={{ "--brand": skill.color } as React.CSSProperties}
        >
          <svg
            viewBox="0 0 24 24"
            width={14}
            height={14}
            fill="currentColor"
            aria-hidden
            className="transition-colors duration-300 group-hover:text-(--brand)"
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
  const drag = useRef<{
    row: number;
    lastX: number;
    lastT: number;
    v: number;
  } | null>(null);
  const state = useRef({ x: [0, 0.5], v: [0, 0], started: false });

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const els = tracks.current.filter(Boolean) as HTMLDivElement[];
    const st = state.current;
    let widths = els.map((el) => el.scrollWidth / COPIES);
    // Second row starts half a set in, so the two rows never line up.
    st.x = [0, widths[1] * 0.5];
    const ro = new ResizeObserver(
      () => (widths = els.map((el) => el.scrollWidth / COPIES)),
    );
    els.forEach((el) => ro.observe(el));

    const apply = () =>
      els.forEach((el, i) => {
        const w = widths[i] || 1;
        const x = ((st.x[i] % w) + w) % w;
        el.style.transform = `translate3d(${x - w}px,0,0)`;
      });
    apply();

    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      els.forEach((_, i) => {
        if (drag.current?.row === i) return; // pointer owns this row
        const target = reduce || hovered.current ? 0 : DIRS[i] * BASE_SPEED;
        st.v[i] += (target - st.v[i]) * (1 - Math.exp(-dt / SETTLE));
        st.x[i] += st.v[i] * dt;
      });
      apply();
      raf = requestAnimationFrame(tick);
    };
    const timer = setTimeout(() => {
      if (!reduce) st.v = DIRS.map((d) => d * (BASE_SPEED + BOOST));
      st.started = true;
      raf = requestAnimationFrame(tick);
    }, START_DELAY);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  const onPointerDown = (row: number) => (e: React.PointerEvent) => {
    if (!state.current.started) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { row, lastX: e.clientX, lastT: performance.now(), v: 0 };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const now = performance.now();
    const dx = e.clientX - d.lastX;
    const dt = Math.max((now - d.lastT) / 1000, 0.001);
    d.v = d.v * 0.7 + (dx / dt) * 0.3; // smoothed release velocity
    d.lastX = e.clientX;
    d.lastT = now;
    state.current.x[d.row] += dx;
  };
  const onPointerUp = () => {
    const d = drag.current;
    if (!d) return;
    // Stale velocity (held still before letting go) shouldn't fling.
    const idle = performance.now() - d.lastT > 80;
    state.current.v[d.row] = idle
      ? 0
      : Math.max(-MAX_FLING, Math.min(MAX_FLING, d.v));
    drag.current = null;
  };

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
          onPointerDown={onPointerDown(i)}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="flex w-max cursor-grab touch-pan-y select-none will-change-transform active:cursor-grabbing"
        >
          {Array.from({ length: COPIES }, (_, c) => (
            <Row key={c} skills={row} hidden={c > 0} />
          ))}
        </div>
      ))}
    </section>
  );
}
