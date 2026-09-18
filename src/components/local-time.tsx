"use client";

import { useEffect, useState } from "react";

const fmt = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: "America/Chicago",
});

/** "Dallas, TX · 9:41 PM" — rendered client-side only so the server's clock never shows. */
export function LocalTime({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    // Tick on the minute boundary, then every minute.
    const t = setTimeout(
      () => {
        update();
        id = setInterval(update, 60_000);
      },
      60_000 - (Date.now() % 60_000),
    );
    let id: ReturnType<typeof setInterval>;
    return () => {
      clearTimeout(t);
      clearInterval(id);
    };
  }, []);

  return (
    <p className={className} style={style}>
      Dallas, TX
      <span className="mx-1.5 text-black/20">·</span>
      <span
        className="tabular-nums transition-opacity duration-500"
        style={{ opacity: now ? 1 : 0 }}
      >
        {now ? fmt.format(now) : "0:00 PM"}
      </span>
    </p>
  );
}
