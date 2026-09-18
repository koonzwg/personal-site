"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronRightIcon } from "@/components/icons";
import { ProjectMedia } from "@/components/project-media";
import { WorkViewer } from "@/components/work-viewer";
import { projects } from "@/lib/projects";
import { buttonSecondary, delay, nudge } from "@/lib/styles";

// Inverted 16px fillet: white outside a quarter circle anchored bottom-left.
const fillet =
  "pointer-events-none absolute size-4 bg-[radial-gradient(circle_at_0_100%,transparent_16px,white_16.5px)]";

// Carve the corner once the rest of the entrance has landed, then pop in View all.
const CARVE = { "--carve-d": "950ms" } as React.CSSProperties;

const INTERVAL = 5000; // ms per project
const FIRST_ADVANCE = 2200 + INTERVAL; // let the entrance finish first

export function Showcase() {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const [origin, setOrigin] = useState<DOMRect | null>(null);
  // Coming back from the viewer: swap to the project you left on instantly (no crossfade),
  // so the shrinking card lands on exactly what the home card shows.
  const [snap, setSnap] = useState(false);
  const [calm, setCalm] = useState<number | null>(null); // skip the settle zoom on that landing
  useEffect(() => {
    if (!snap) return;
    const t = setTimeout(() => setSnap(false), 60);
    return () => clearTimeout(t);
  }, [snap]);
  const opener = useRef<HTMLElement | null>(null);
  const card = useRef<HTMLElement>(null);
  const paused = useRef({ hover: false, offscreen: false });

  // Cycle projects; hold while hovered, off screen, in a background tab, or while the viewer is open.
  useEffect(() => {
    const el = card.current;
    const io = new IntersectionObserver(
      ([e]) => (paused.current.offscreen = !e.isIntersecting),
    );
    if (el) io.observe(el);
    let last = performance.now() - (INTERVAL - FIRST_ADVANCE);
    const id = setInterval(() => {
      const now = performance.now();
      const p = paused.current;
      if (p.hover || p.offscreen || document.hidden || open !== null) {
        last = now; // restart the clock so resuming never skips instantly
        return;
      }
      if (now - last >= INTERVAL) {
        last = now;
        setIndex((i) => (i + 1) % projects.length);
      }
    }, 250);
    return () => {
      clearInterval(id);
      io.disconnect();
    };
  }, [open]);

  const onOpen = (e: React.MouseEvent<HTMLElement>) => {
    opener.current = e.currentTarget;
    setOrigin(card.current?.getBoundingClientRect() ?? null); // the viewer grows out of this card
    setOpen(index); // open on whichever project is showing
  };
  const close = useCallback((active: number) => {
    setSnap(true);
    setCalm(active);
    setIndex(active); // come back showing the project you left on
    setOpen(null);
    opener.current?.focus({ preventScroll: true });
  }, []);

  const project = projects[index];

  return (
    <section
      ref={card}
      style={{ ...delay(400), ...CARVE }}
      onPointerEnter={(e) => (paused.current.hover = e.pointerType === "mouse")}
      onPointerLeave={() => (paused.current.hover = false)}
      className="showcase-in relative aspect-[3/2] w-full rounded-[32px] rounded-tr-none bg-[#F2F2F2]"
    >
      {/* Slides: crossfade, each settling in from a slight zoom. */}
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Open ${project.title}`}
        className="group/card absolute inset-0 cursor-pointer overflow-hidden rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-black/15 focus-visible:ring-offset-2"
      >
        {projects.map((p, i) => (
          <span
            key={p.title}
            aria-hidden
            className="absolute inset-0 transition-opacity duration-[900ms] ease-in-out"
            style={{
              opacity: i === index ? 1 : 0,
              transitionDuration: snap ? "0ms" : undefined,
            }}
          >
            <span
              key={i === index ? `on-${index}` : "off"}
              className={`absolute inset-0 grid place-items-center ${i === index && calm !== index ? "settle" : ""}`}
            >
              <ProjectMedia
                project={p}
                eager={i === 0}
                sizes="(min-width: 640px) 592px, 100vw"
              />
            </span>
          </span>
        ))}

        {/* Caption */}
        <span className="absolute bottom-3 left-3 flex h-7 items-center overflow-hidden rounded-[9px] bg-white/85 px-2.5 text-[13px] font-medium tracking-[-0.03em] text-black/60 backdrop-blur-md">
          <span key={index} className="animate-info-in">
            {project.title.split(":")[0]}
          </span>
        </span>
      </button>

      <div
        style={CARVE}
        className="carve absolute top-0 right-0 z-10 rounded-bl-2xl bg-white pb-2.5 pl-2.5"
      >
        <span aria-hidden className={`${fillet} top-0 right-full`} />
        <span aria-hidden className={`${fillet} top-full right-0`} />
        <span
          className="enter-scale block origin-top-right"
          style={delay(1500)}
        >
          <button
            type="button"
            onClick={onOpen}
            className={`${buttonSecondary} cursor-pointer`}
          >
            View all
            <ChevronRightIcon className={`-mx-1 ${nudge.forward}`} />
          </button>
        </span>
      </div>

      {open !== null &&
        createPortal(
          <WorkViewer initial={open} origin={origin} onExit={close} />,
          document.body,
        )}
    </section>
  );
}
