"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ArrowUpRightIcon, ChevronRightIcon } from "@/components/icons";
import { ProjectMedia } from "@/components/project-media";
import { projects } from "@/lib/projects";

// Long, soft ease-out: moves quickly, then settles gently.
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const DURATION = 560;
const GAP = 10;
// Progressive blur at the stage edges: stacked layers, each blurrier and masked closer to the
// viewport edge, like a Figma progressive layer blur. `from` is a fraction of the band's width.
//
// This lives on the STAGE, not on the cards, and is never moved or faded. That is deliberate:
// animating opacity on a backdrop-filter's ancestor makes it a backdrop root, so the filter has
// nothing left to sample and the blur silently vanishes for the length of the animation. Pinning
// it also keeps the gradient correct mid-slide (card-owned gradients are anchored to the card's
// resting slot) and cuts ~20 moving backdrop layers down to 10 static ones.
// Three layers, not five: backdrop-filter is the single most expensive thing on this screen, and
// the outer third of the band sits under 85%+ white anyway, so heavier layers there buy nothing.
const BLUR_LAYERS = [
  { blur: 2, from: 0 },
  { blur: 8, from: 0.25 },
  { blur: 20, from: 0.55 },
];

type Size = {
  w: number;
  h: number;
  sw: number;
  sh: number;
  horizontal: boolean;
};

// Whole, even pixel sizes so centered cards never land on a half pixel (which blurs text).
const even = (n: number) => Math.round(n / 2) * 2;

function useStageSize(ref: React.RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState<Size | null>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const { width: sw, height: sh } = el.getBoundingClientRect();
      const horizontal = window.matchMedia("(min-width: 640px)").matches;
      if (horizontal) {
        // 3:2 card, as tall as the stage allows, capped so neighbors peek in.
        let h = sh;
        let w = h * 1.5;
        const maxW = Math.min(sw * 0.62, 1000);
        if (w > maxW) {
          w = maxW;
          h = w / 1.5;
        }
        setSize({ w: even(w), h: even(h), sw, sh, horizontal });
      } else {
        const w = Math.min(sw - 48, 592);
        const h = Math.min(w * 1.15, sh * 0.7);
        setSize({ w: even(w), h: even(h), sw, sh, horizontal });
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

const MORPH = 620; // ms — card growing out of / back into the home-page card

export function WorkViewer({
  onExit,
  initial = 0,
  origin,
}: {
  onExit: (active: number) => void;
  initial?: number;
  /** Where the home-page card sits on screen; the active card morphs from/to it. */
  origin?: DOMRect | null;
}) {
  const [active, setActive] = useState(initial);
  const [shown, setShown] = useState(false);
  // "origin": active card sits exactly over the home-page card. "open": full view.
  const [phase, setPhase] = useState<"origin" | "open">(
    origin ? "origin" : "open",
  );
  const [stageRect, setStageRect] = useState<DOMRect | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const controls = useRef<HTMLDivElement>(null);
  const [controlsH, setControlsH] = useState(200);
  useLayoutEffect(() => {
    const el = controls.current;
    if (!el) return;
    // The whole controls block, fade included: the active card must never sit under the
    // white fade (it tints dark work). Neighbors can still slide beneath it.
    const ro = new ResizeObserver(() => setControlsH(el.offsetHeight - 8));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const size = useStageSize(stage);
  const last = projects.length - 1;

  const go = useCallback(
    (dir: number) => setActive((i) => Math.min(last, Math.max(0, i + dir))),
    [last],
  );

  const closing = useRef(false);
  const exit = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    setShown(false);
    if (origin) setPhase("origin"); // shrink back into the home-page card
    setTimeout(() => onExit(active), origin ? MORPH - 40 : 220);
  }, [onExit, origin, active]);

  // Scroll lock + focus.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    root.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Once the stage is measured, grow the card out of its origin (two frames so the
  // starting position paints first).
  useLayoutEffect(() => {
    if (!size || !stage.current) return;
    setStageRect(stage.current.getBoundingClientRect());
  }, [size]);
  const started = useRef(false);
  useEffect(() => {
    if (!size || !stageRect || started.current) return;
    started.current = true;
    // Not cancelled on re-render: re-measures must not strand the view half-open.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setShown(true);
        setPhase("open");
      }),
    );
  }, [size, stageRect]);

  // Keep Tab focus inside the viewer.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab" || !root.current) return;
    const items = Array.from(
      root.current.querySelectorAll<HTMLElement>(
        "button:not([disabled]), a[href]",
      ),
    ).filter((el) => el.tabIndex >= 0);
    if (!items.length) return;
    const first = items[0];
    const lastEl = items[items.length - 1];
    if (
      e.shiftKey &&
      (document.activeElement === first ||
        document.activeElement === root.current)
    ) {
      e.preventDefault();
      lastEl.focus();
    } else if (!e.shiftKey && document.activeElement === lastEl) {
      e.preventDefault();
      first.focus();
    }
  };

  // Keyboard.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") exit();
      else if (e.key === "ArrowRight" || e.key === "ArrowDown") go(1);
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") go(-1);
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [exit, go]);

  // Trackpad / wheel: one step per gesture (inertia included).
  const wheel = useRef({ last: 0, moved: false, acc: 0 });
  const onWheel = (e: React.WheelEvent) => {
    const w = wheel.current;
    const now = performance.now();
    if (now - w.last > 150) {
      w.moved = false;
      w.acc = 0;
    }
    w.last = now;
    if (w.moved) return;
    const d =
      size?.horizontal && Math.abs(e.deltaX) > Math.abs(e.deltaY)
        ? e.deltaX
        : e.deltaY;
    w.acc += d;
    if (Math.abs(w.acc) > 30) {
      go(Math.sign(w.acc));
      w.moved = true;
    }
  };

  // Touch: cards follow the finger 1:1, then settle to the nearest project.
  const touch = useRef<{ x: number; y: number } | null>(null);
  const [drag, setDrag] = useState(0);
  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!touch.current) return;
    let d = size?.horizontal
      ? e.touches[0].clientX - touch.current.x
      : e.touches[0].clientY - touch.current.y;
    // Rubber-band past the first/last project.
    if ((active === 0 && d > 0) || (active === last && d < 0)) d /= 3;
    setDrag(d);
  };
  const onTouchEnd = () => {
    if (!touch.current) return;
    if (Math.abs(drag) > 50) go(drag < 0 ? 1 : -1);
    setDrag(0);
    touch.current = null;
  };
  const dragging = drag !== 0;

  const project = projects[active];
  const horizontal = size?.horizontal ?? true;

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label="Work"
      tabIndex={-1}
      onWheel={onWheel}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
      onKeyDown={onKeyDown}
      className="fixed inset-0 z-50 touch-none overflow-hidden outline-none"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-white"
        style={{
          opacity: shown ? 1 : 0,
          transition: `opacity ${shown ? 380 : 320}ms ${EASE}`,
        }}
      />
      <div
        ref={stage}
        className="absolute inset-x-0 top-6 sm:top-12"
        style={{ bottom: controlsH + 16 }}
      >
        {size &&
          projects.map((p, i) => {
            const offset = i - active;
            if (Math.abs(offset) > 2) return null;
            const isActive = offset === 0;
            // Neighbors are scaled to 0.97, so offset by their scaled size to keep a true GAP.
            const len = horizontal ? size.w : size.h;
            const n = Math.abs(offset);
            const dist =
              n === 0
                ? 0
                : len / 2 +
                  (len * 0.97) / 2 +
                  GAP +
                  (n - 1) * (len * 0.97 + GAP);
            const x = horizontal ? Math.sign(offset) * dist : 0;
            const y = horizontal ? 0 : Math.sign(offset) * dist;
            // Morph: while in the "origin" phase the active card is sized and placed exactly over
            // the home-page card, then eases into the full view (and back on exit).
            const atOrigin =
              isActive && phase === "origin" && origin && stageRect;
            const w = atOrigin ? origin.width : size.w;
            const h = atOrigin ? origin.height : size.h;
            const ox = atOrigin
              ? origin.left +
                origin.width / 2 -
                (stageRect.left + stageRect.width / 2)
              : 0;
            const oy = atOrigin
              ? origin.top +
                origin.height / 2 -
                (stageRect.top + stageRect.height / 2)
              : 0;
            const morph = `${MORPH}ms ${EASE}`;
            const t = dragging
              ? "none"
              : isActive
                ? `transform ${morph}, width ${morph}, height ${morph}, opacity ${DURATION}ms ${EASE}`
                : `transform ${DURATION}ms ${EASE}, opacity ${shown ? DURATION : 260}ms ${EASE}`;
            return (
              <button
                key={p.title}
                type="button"
                tabIndex={isActive ? -1 : 0}
                aria-label={isActive ? p.title : `Show ${p.title}`}
                onClick={() => !isActive && go(Math.sign(offset))}
                className={`absolute top-1/2 left-1/2 outline-none ${
                  isActive ? "cursor-default" : "cursor-pointer"
                }`}
                style={{
                  width: w,
                  height: h,
                  transform: `translate(calc(-50% + ${x + ox + (horizontal ? drag : 0)}px), calc(-50% + ${y + oy + (horizontal ? 0 : drag)}px)) scale(${isActive ? 1 : 0.97})`,
                  // Neighbors fade in around the active card as the view opens.
                  opacity:
                    Math.abs(offset) > 1 || (!isActive && !shown) ? 0 : 1,
                  transition: t,
                  willChange: "transform",
                }}
              >
                <span className="absolute inset-0 grid place-items-center overflow-hidden rounded-[32px] bg-[#F2F2F2]">
                  <ProjectMedia
                    project={p}
                    eager={isActive}
                    sizes="(min-width: 640px) 62vw, 100vw"
                  />
                </span>
              </button>
            );
          })}
      </div>

      {/* Edge treatment sits outside the stage, pinned to the viewport: cards are clipped by the
          root, not the stage, so a band inset with the stage leaves an unblurred strip. */}
      {size && stageRect && (
        <EdgeBlur size={size} lead={stageRect.top} trail={controlsH + 16} />
      )}

      {/* Info + controls float over the cards on a white fade. */}
      <div
        ref={controls}
        className="absolute inset-x-0 bottom-0 z-10 bg-linear-to-t from-white from-60% to-transparent pt-10"
        style={{
          opacity: shown ? 1 : 0,
          transform: shown ? "none" : "translateY(10px)",
          transition: `opacity ${shown ? 420 : 200}ms ${EASE} ${shown ? 120 : 0}ms, transform ${shown ? 520 : 200}ms ${EASE} ${shown ? 120 : 0}ms`,
        }}
      >
        <div className="mx-auto flex w-full max-w-[640px] flex-col gap-2 px-6 pb-6 sm:pb-12">
          <div aria-live="polite" className="rounded-[20px] bg-[#F2F2F2] p-4">
            <div key={active} className="animate-info-in flex flex-col gap-1">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-[15px] font-medium tracking-[-0.03em] text-black">
                  {project.title}
                </h2>
                {project.links.length > 0 && (
                  <div className="flex shrink-0 gap-3">
                    {project.links.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 text-[13px] font-medium tracking-[-0.03em] text-black/40 transition-colors hover:text-black"
                      >
                        {l.label}
                        <ArrowUpRightIcon
                          width={18}
                          height={18}
                          className="-my-1 -mr-1"
                        />
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <p className="line-clamp-2 h-[42px] text-[15px] leading-[21px] font-medium tracking-[-0.03em] text-black/30">
                {project.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* Desktop: ← Exit →. Mobile (vertical stack): ↓ Exit ↑ */}
            <ControlButton
              label={horizontal ? "Previous project" : "Next project"}
              disabled={horizontal ? active === 0 : active === last}
              onClick={() => go(horizontal ? -1 : 1)}
            >
              <ChevronRightIcon
                width={20}
                height={20}
                className={`transition-transform duration-200 ease-out ${
                  horizontal
                    ? "rotate-180 group-hover:-translate-x-0.5"
                    : "rotate-90 group-hover:translate-y-0.5"
                }`}
              />
            </ControlButton>
            <ControlButton label="Exit" onClick={exit}>
              <span className="text-[15px] font-semibold tracking-[-0.03em]">
                Exit
              </span>
            </ControlButton>
            <ControlButton
              label={horizontal ? "Next project" : "Previous project"}
              disabled={horizontal ? active === last : active === 0}
              onClick={() => go(horizontal ? 1 : -1)}
            >
              <ChevronRightIcon
                width={20}
                height={20}
                className={`transition-transform duration-200 ease-out ${
                  horizontal
                    ? "group-hover:translate-x-0.5"
                    : "-rotate-90 group-hover:-translate-y-0.5"
                }`}
              />
            </ControlButton>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * The blur/fade band at each edge of the viewport. Cards slide underneath it; it never moves and
 * its opacity is never animated, so the treatment is identical on every frame of a transition.
 * Each band runs from the viewport edge in to the active card's edge, where the fade is fully
 * transparent, so the focused card is untouched.
 *
 * `lead`/`trail` are the stage's own insets along the scroll axis. The bands have to cover those
 * too — cards are clipped by the viewport, not by the stage, so they show through otherwise.
 */
function EdgeBlur({
  size,
  lead,
  trail,
}: {
  size: Size;
  lead: number;
  trail: number;
}) {
  const { horizontal } = size;
  // Stage edge → active card edge.
  const gap = Math.max(
    80,
    horizontal ? (size.sw - size.w) / 2 : (size.sh - size.h) / 2,
  );
  // `to <side>` starts the gradient at the band's inner edge in every case, so the side name
  // doubles as the gradient direction.
  const bands = horizontal
    ? ([
        ["left", gap],
        ["right", gap],
      ] as const)
    : ([
        ["top", lead + gap],
        ["bottom", trail + gap],
      ] as const);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {bands.map(([side, extent]) => {
        const len = Math.round(extent);
        const px = (f: number) => `${Math.round(f * len)}px`;
        return (
          <span
            key={side}
            className="absolute"
            style={
              horizontal
                ? { top: 0, bottom: 0, [side]: 0, width: len }
                : { left: 0, right: 0, [side]: 0, height: len }
            }
          >
            {BLUR_LAYERS.map((l) => {
              const m = `linear-gradient(to ${side}, transparent ${px(l.from)}, black ${px(l.from + 0.2)})`;
              return (
                <span
                  key={l.blur}
                  className="absolute inset-0"
                  style={{
                    backdropFilter: `blur(${l.blur}px)`,
                    WebkitBackdropFilter: `blur(${l.blur}px)`,
                    maskImage: m,
                    WebkitMaskImage: m,
                  }}
                />
              );
            })}
            <span
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to ${side}, rgba(255,255,255,0) 0px, rgba(255,255,255,0.5) ${px(0.35)}, rgba(255,255,255,0.85) ${px(0.7)}, white ${len}px)`,
              }}
            />
          </span>
        );
      })}
    </div>
  );
}

function ControlButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="group grid h-12 cursor-pointer place-items-center rounded-full bg-[#F2F2F2] text-[#919191] transition-[color,background-color,opacity,transform] duration-150 outline-none hover:bg-[#EAEAEA] hover:text-black focus-visible:ring-2 focus-visible:ring-black/20 active:scale-[0.97] disabled:cursor-default disabled:opacity-40 disabled:hover:bg-[#F2F2F2] disabled:hover:text-[#919191]"
    >
      {children}
    </button>
  );
}
