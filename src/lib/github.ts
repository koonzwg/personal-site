export const GITHUB_USER = "koonzwg";

/** date (YYYY-MM-DD) -> level 0-4, scraped from GitHub's public contributions fragment. */
export type Contributions = Record<string, number>;

export async function getContributions(year: number): Promise<Contributions> {
  try {
    const res = await fetch(
      `https://github.com/users/${GITHUB_USER}/contributions?from=${year}-01-01&to=${year}-12-31`,
      {
        headers: { "X-Requested-With": "XMLHttpRequest" },
        next: { revalidate: 60 * 60 },
      },
    );
    if (!res.ok) return {};
    const html = await res.text();
    const out: Contributions = {};
    for (const m of html.matchAll(
      /data-date="(\d{4}-\d{2}-\d{2})"[^>]*?data-level="(\d)"/g,
    )) {
      out[m[1]] = Number(m[2]);
    }
    return out;
  } catch {
    return {};
  }
}
