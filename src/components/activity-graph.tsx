"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useInView } from "@/components/reveal";
import type { Contributions } from "@/lib/github";
import { button, delay } from "@/lib/styles";

export const LEVEL_COLORS = [
  "#F2F2F2",
  "#C7C7C7",
  "#8F8F8F",
  "#4D4D4D",
  "#111111",
];

const label = "text-[11px] font-medium tracking-[-0.03em] text-black/40";

function yearDays(year: number) {
  const days: string[] = [];
  const d = new Date(Date.UTC(year, 0, 1));
  while (d.getUTCFullYear() === year) {
    days.push(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return { days, offset: new Date(Date.UTC(year, 0, 1)).getUTCDay() };
}

export function ActivityGraph({
  years,
  data,
}: {
  years: number[];
  data: Record<number, Contributions>;
}) {
  const [year, setYear] = useState(years[0]);
  const { days, offset } = yearDays(year);
  const levels = data[year] ?? {};
  const scroller = useRef<HTMLDivElement>(null);
  const [sectionRef, inView] = useInView<HTMLElement>(0.3);
  // Column the intro wave starts from: 0 on desktop, the visible centre on mobile.
  const [origin, setOrigin] = useState(0);
  // After the intro, cells drop their keyframes so year switches can transition instead.
  const [introDone, setIntroDone] = useState(false);

  // Mobile: the grid scrolls sideways. Open on the current week (or December for past years).
  useLayoutEffect(() => {
    const el = scroller.current;
    if (!el || el.scrollWidth <= el.clientWidth) return;
    const today = new Date().toISOString().slice(0, 10);
    const idx = days.indexOf(today);
    if (idx === -1) {
      el.scrollLeft = el.scrollWidth;
      setOrigin(Math.round((el.scrollLeft + el.clientWidth / 2) / 14));
      return;
    }
    const col = Math.floor((idx + offset) / 7);
    el.scrollLeft = (col + 3) * 14 - el.clientWidth;
    // The intro wave radiates from whatever is visible.
    setOrigin(Math.round((el.scrollLeft + el.clientWidth / 2) / 14));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year]);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setIntroDone(true), 1900);
    return () => clearTimeout(t);
  }, [inView]);

  // Sliding year pill.
  const yearBtns = useRef<(HTMLButtonElement | null)[]>([]);
  const [pill, setPill] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);
  useLayoutEffect(() => {
    const measure = () => {
      const b = yearBtns.current[years.indexOf(year)];
      if (b)
        setPill({
          x: b.offsetLeft,
          y: b.offsetTop,
          w: b.offsetWidth,
          h: b.offsetHeight,
        });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [year, years]);
  // Pad partial first/last weeks with empty cells so the grid is a clean rectangle.
  const trailing = (7 - ((offset + days.length) % 7)) % 7;
  const cells: (string | null)[] = [
    ...Array<null>(offset).fill(null),
    ...days,
    ...Array<null>(trailing).fill(null),
  ];

  return (
    <section
      ref={sectionRef}
      data-reveal=""
      data-inview={inView ? "" : undefined}
      aria-label="GitHub contributions"
      className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4"
    >
      <div className="flex min-w-0 flex-col gap-2 sm:flex-1">
        {/* Columns = weeks (Jan → Dec), rows = Sun → Sat.
            Mobile: fixed 12px squares, horizontal scroll. sm+: squares scale to fit. */}
        <div
          ref={scroller}
          className="overflow-x-auto [scrollbar-width:none] [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] sm:overflow-visible sm:[mask-image:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="grid w-max grid-flow-col grid-rows-7 auto-cols-[12px] gap-[2px] sm:w-auto sm:auto-cols-fr">
            {cells.map((date, i) => {
              const col = Math.floor(i / 7);
              const row = i % 7;
              const level = date ? (levels[date] ?? 0) : 0;
              const dist = Math.abs(col - origin);
              return (
                <span
                  key={i}
                  title={date ?? undefined}
                  className={`aspect-square rounded-[3px] sm:rounded-[2px] ${introDone ? "" : "cell-intro"}`}
                  style={
                    {
                      backgroundColor: LEVEL_COLORS[level],
                      // Intro: grid lays down as a diagonal wave, then activity paints in behind it.
                      "--d1": `${dist * 8 + row * 10}ms`,
                      "--d2": `${450 + dist * 8 + row * 10}ms`,
                      // Year switch: a quicker repaint wave.
                      transition: introDone
                        ? `background-color 220ms ease ${col * 4}ms`
                        : undefined,
                    } as React.CSSProperties
                  }
                />
              );
            })}
          </div>
        </div>

        <div
          className="enter flex items-center justify-between"
          style={delay(250)}
        >
          <span className={label}>Contributions</span>
          <div className="flex items-center gap-1">
            <span className={label}>Less</span>
            <div className="flex gap-[2px]">
              {LEVEL_COLORS.map((c, i) => (
                <span
                  key={c}
                  className="enter-scale size-[10px] rounded-[2px]"
                  style={{ backgroundColor: c, ...delay(1050 + i * 60) }}
                />
              ))}
            </div>
            <span className={label}>More</span>
          </div>
        </div>
      </div>

      <div
        className="enter relative order-first flex shrink-0 sm:order-none sm:flex-col"
        style={delay(150)}
      >
        {pill && (
          <span
            aria-hidden
            className="absolute top-0 left-0 rounded-[10px] bg-[#F2F2F2] transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              width: pill.w,
              height: pill.h,
              transform: `translate(${pill.x}px, ${pill.y}px)`,
            }}
          />
        )}
        {years.map((y, i) => (
          <button
            key={y}
            ref={(el) => {
              yearBtns.current[i] = el;
            }}
            type="button"
            onClick={() => setYear(y)}
            aria-pressed={y === year}
            className={`${button} relative cursor-pointer outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-black/20 hover:opacity-100 ${
              y === year ? "text-black" : "text-black/25 hover:text-black/50"
            } ${pill ? "" : y === year ? "bg-[#F2F2F2]" : ""}`}
          >
            {y}
          </button>
        ))}
      </div>
    </section>
  );
}
