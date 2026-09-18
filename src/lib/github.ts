export const GITHUB_USER = "koonzwg";

/** Per day (YYYY-MM-DD): shade level 0–4 and exact contribution count. */
export type Contributions = {
  levels: Record<string, number>;
  counts: Record<string, number>;
};

/** Scraped from GitHub's public contributions fragment (no token needed). */
export async function getContributions(year: number): Promise<Contributions> {
  const empty = { levels: {}, counts: {} };
  try {
    const res = await fetch(
      `https://github.com/users/${GITHUB_USER}/contributions?from=${year}-01-01&to=${year}-12-31`,
      {
        headers: { "X-Requested-With": "XMLHttpRequest" },
        next: { revalidate: 60 * 60 },
      },
    );
    if (!res.ok) return empty;
    const html = await res.text();

    const levels: Record<string, number> = {};
    const idToDate: Record<string, string> = {};
    for (const [td] of html.matchAll(/<td[^>]*data-date="[^"]*"[^>]*>/g)) {
      const date = td.match(/data-date="([^"]+)"/)?.[1];
      const level = td.match(/data-level="(\d)"/)?.[1];
      const id = td.match(/id="([^"]+)"/)?.[1];
      if (!date) continue;
      levels[date] = Number(level ?? 0);
      if (id) idToDate[id] = date;
    }

    // Tooltips carry the counts: "3 contributions on March 4th." / "No contributions on …"
    const counts: Record<string, number> = {};
    for (const m of html.matchAll(/<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]*)</g)) {
      const date = idToDate[m[1]];
      if (!date) continue;
      const n = m[2].match(/^(\d[\d,]*)/)?.[1];
      counts[date] = n ? Number(n.replace(/,/g, "")) : 0;
    }
    return { levels, counts };
  } catch {
    return empty;
  }
}
