"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { ArrowUpRightIcon, ChevronRightIcon } from "@/components/icons";
import { projects } from "@/lib/projects";

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
const DURATION = 320;
const GAP = 16;

type Size = { w: number; h: number; horizontal: boolean };

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
        setSize({ w, h, horizontal });
      } else {
        const w = Math.min(sw - 48, 592);
        const h = Math.min(w * 1.15, sh * 0.7);
        setSize({ w, h, horizontal });
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

function Overlay({ onExit }: { onExit: () => void }) {
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const controls = useRef<HTMLDivElement>(null);
  const [controlsH, setControlsH] = useState(200);
  useLayoutEffect(() => {
    const el = controls.current;
    if (!el) return;
    // Measure only the solid part (the gradient's top padding may overlap cards).
    const ro = new ResizeObserver(() => setControlsH(el.offsetHeight - 64));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const size = useStageSize(stage);
  const last = projects.length - 1;

  const go = useCallback(
    (dir: number) => setActive((i) => Math.min(last, Math.max(0, i + dir))),
    [last],
  );

  const exit = useCallback(() => {
    setShown(false);
    setTimeout(onExit, 220);
  }, [onExit]);

  // Enter animation, scroll lock, focus.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => setShown(true));
    root.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

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

  // Touch swipe.
  const touch = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return;
    const dx = touch.current.x - e.changedTouches[0].clientX;
    const dy = touch.current.y - e.changedTouches[0].clientY;
    const d = size?.horizontal ? dx : dy;
    if (Math.abs(d) > 40) go(Math.sign(d));
    touch.current = null;
  };

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
      onTouchEnd={onTouchEnd}
      className="fixed inset-0 z-50 touch-none overflow-hidden bg-white outline-none"
      style={{
        opacity: shown ? 1 : 0,
        transition: `opacity ${shown ? 260 : 200}ms ${EASE}`,
      }}
    >
      <div
        ref={stage}
        className="absolute inset-x-0 top-6 sm:top-12"
        style={{
          bottom: controlsH + 16,
          transform: shown ? "none" : "translateY(8px)",
          transition: `transform ${DURATION}ms ${EASE}`,
        }}
      >
        {size &&
          projects.map((p, i) => {
            const offset = i - active;
            if (Math.abs(offset) > 2) return null;
            const isActive = offset === 0;
            const step = (horizontal ? size.w : size.h) + GAP;
            const x = horizontal ? offset * step : 0;
            const y = horizontal ? 0 : offset * step;
            // Neighbors fade toward the viewport edge.
            const dir = horizontal
              ? offset < 0
                ? "to left"
                : "to right"
              : offset < 0
                ? "to top"
                : "to bottom";
            const mask = isActive
              ? "none"
              : `linear-gradient(${dir}, black 20%, transparent 95%)`;
            return (
              <button
                key={p.title}
                type="button"
                tabIndex={isActive ? -1 : 0}
                aria-label={isActive ? p.title : `Show ${p.title}`}
                onClick={() => !isActive && go(Math.sign(offset))}
                className={`absolute top-1/2 left-1/2 overflow-hidden rounded-[32px] bg-[#F2F2F2] ${
                  isActive ? "cursor-default" : "cursor-pointer"
                }`}
                style={{
                  width: size.w,
                  height: size.h,
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${isActive ? 1 : 0.97})`,
                  opacity: isActive ? 1 : Math.abs(offset) === 1 ? 0.6 : 0,
                  filter: isActive ? "none" : "blur(4px)",
                  maskImage: mask,
                  WebkitMaskImage: mask,
                  transition: `transform ${DURATION}ms ${EASE}, opacity ${DURATION}ms ${EASE}, filter ${DURATION}ms ${EASE}`,
                  willChange: "transform, opacity, filter",
                }}
              >
                {p.media && (
                  <Image
                    src={p.media}
                    alt=""
                    fill
                    sizes="80vw"
                    className="object-cover"
                  />
                )}
              </button>
            );
          })}
      </div>

      {/* Info + controls float over the cards on a white fade. */}
      <div
        ref={controls}
        className="absolute inset-x-0 bottom-0 z-10 bg-linear-to-t from-white from-60% to-transparent pt-16"
      >
        <div className="mx-auto flex w-full max-w-[640px] flex-col gap-2 px-6 pb-6 sm:pb-12">
          <div
            aria-live="polite"
            className="flex flex-col gap-1 rounded-[20px] bg-[#F2F2F2] p-4"
          >
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
                className={horizontal ? "rotate-180" : "rotate-90"}
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
                className={horizontal ? "" : "-rotate-90"}
              />
            </ControlButton>
          </div>
        </div>
      </div>
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
      className="grid h-12 cursor-pointer place-items-center rounded-full bg-[#F2F2F2] text-[#919191] transition-[color,opacity,transform] duration-150 outline-none hover:text-black focus-visible:ring-2 focus-visible:ring-black/20 active:scale-[0.97] disabled:cursor-default disabled:opacity-40 disabled:hover:text-[#919191]"
    >
      {children}
    </button>
  );
}

export function ViewAllButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus({ preventScroll: true });
  }, []);
  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className={`${className ?? ""} cursor-pointer`}
      >
        View all
        <ChevronRightIcon className="-mx-1" />
      </button>
      {open && createPortal(<Overlay onExit={close} />, document.body)}
    </>
  );
}
