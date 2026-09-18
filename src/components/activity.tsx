import { getContributions } from "@/lib/github";
import { ActivityGraph } from "@/components/activity-graph";

export async function Activity() {
  const current = new Date().getUTCFullYear();
  const years = [current, current - 1, current - 2];
  const data = Object.fromEntries(
    await Promise.all(years.map(async (y) => [y, await getContributions(y)])),
  );
  return <ActivityGraph years={years} data={data} />;
}
