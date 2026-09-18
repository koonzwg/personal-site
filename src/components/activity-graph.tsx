"use client";

import { useEffect, useRef, useState } from "react";
import type { Contributions } from "@/lib/github";
import { button } from "@/lib/styles";

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

  // Mobile: the grid scrolls sideways. Open on the current week (or December for past years).
  useEffect(() => {
    const el = scroller.current;
    if (!el || el.scrollWidth <= el.clientWidth) return;
    const today = new Date().toISOString().slice(0, 10);
    const idx = days.indexOf(today);
    if (idx === -1) {
      el.scrollLeft = el.scrollWidth;
      return;
    }
    const col = Math.floor((idx + offset) / 7);
    el.scrollLeft = (col + 3) * 14 - el.clientWidth;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year]);
  // Pad partial first/last weeks with empty cells so the grid is a clean rectangle.
  const trailing = (7 - ((offset + days.length) % 7)) % 7;
  const cells: (string | null)[] = [
    ...Array<null>(offset).fill(null),
    ...days,
    ...Array<null>(trailing).fill(null),
  ];

  return (
    <section
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
            {cells.map((date, i) => (
              <span
                key={date ?? `pad-${i}`}
                title={date ?? undefined}
                className="aspect-square rounded-[3px] sm:rounded-[2px]"
                style={{
                  backgroundColor: LEVEL_COLORS[date ? (levels[date] ?? 0) : 0],
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className={label}>Contributions</span>
          <div className="flex items-center gap-1">
            <span className={label}>Less</span>
            <div className="flex gap-[2px]">
              {LEVEL_COLORS.map((c) => (
                <span
                  key={c}
                  className="size-[10px] rounded-[2px]"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <span className={label}>More</span>
          </div>
        </div>
      </div>

      <div className="order-first flex shrink-0 sm:order-none sm:flex-col">
        {years.map((y) => (
          <button
            key={y}
            type="button"
            onClick={() => setYear(y)}
            aria-pressed={y === year}
            className={`${button} cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-black/20 ${
              y === year
                ? "bg-[#F2F2F2] text-black hover:opacity-100"
                : "text-black/25 hover:text-black/50 hover:opacity-100"
            }`}
          >
            {y}
          </button>
        ))}
      </div>
    </section>
  );
}
