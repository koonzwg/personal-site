"use client";

import { useState } from "react";
import type { Contributions } from "@/lib/github";
import { button } from "@/lib/styles";

export const LEVEL_COLORS = ["#F2F2F2", "#C7C7C7", "#8F8F8F", "#4D4D4D", "#111111"];

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
  // Pad partial first/last weeks with empty cells so the grid is a clean rectangle.
  const trailing = (7 - ((offset + days.length) % 7)) % 7;
  const cells: (string | null)[] = [
    ...Array<null>(offset).fill(null),
    ...days,
    ...Array<null>(trailing).fill(null),
  ];

  return (
    <section aria-label="GitHub contributions" className="flex items-start gap-4">
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        {/* Columns = weeks (Jan → Dec), rows = Sun → Sat */}
        <div className="grid grid-flow-col grid-rows-7 auto-cols-fr gap-[2px]">
          {cells.map((date, i) => (
            <span
              key={date ?? `pad-${i}`}
              title={date ?? undefined}
              className="aspect-square rounded-[2px]"
              style={{
                backgroundColor: LEVEL_COLORS[date ? (levels[date] ?? 0) : 0],
              }}
            />
          ))}
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

      <div className="flex shrink-0 flex-col">
        {years.map((y) => (
          <button
            key={y}
            type="button"
            onClick={() => setYear(y)}
            aria-pressed={y === year}
            className={`${button} cursor-pointer ${
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
