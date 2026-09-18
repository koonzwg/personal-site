"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronRightIcon } from "@/components/icons";
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
    setOpen(index); // open on whichever project is showing
  };
  const close = useCallback(() => {
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
            style={{ opacity: i === index ? 1 : 0 }}
          >
            <span
              key={i === index ? `on-${index}` : "off"}
              className={`absolute inset-0 grid place-items-center ${i === index ? "settle" : ""}`}
            >
              {p.media ? (
                <Image
                  src={p.media}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 592px, 100vw"
                  className="object-cover"
                />
              ) : (
                // Placeholder until real work is added.
                <span className="px-10 text-center text-[28px] font-semibold tracking-[-0.04em] text-black/[0.07]">
                  {p.title.split(":")[0]}
                </span>
              )}
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
          <WorkViewer initial={open} onExit={close} />,
          document.body,
        )}
    </section>
  );
}
