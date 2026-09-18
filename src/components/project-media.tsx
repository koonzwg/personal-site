import Image from "next/image";
import type { Project } from "@/lib/projects";

/**
 * A project's visual, filling whatever card it's in. The image is never cropped: it's shown
 * whole (object-contain) on the project's background color, so it works in the 3:2 home card,
 * the wide desktop viewer, and the taller mobile viewer alike. `scale` zooms in on the
 * centered subject when the export has lots of empty background around it.
 */
export function ProjectMedia({
  project: p,
  sizes,
}: {
  project: Project;
  /** Layout width hint, in vw at 1x zoom. */
  sizes: number;
}) {
  if (!p.media) {
    // Placeholder until real work is added.
    return (
      <span className="grid size-full place-items-center px-10 text-center text-[28px] font-semibold tracking-[-0.04em] text-black/[0.07]">
        {p.title.split(":")[0]}
      </span>
    );
  }
  const scale = p.scale ?? 1;
  return (
    <span className="absolute inset-0" style={{ background: p.background }}>
      <Image
        src={p.media}
        alt={p.title}
        fill
        // Ask for a larger file when zoomed so text stays crisp.
        sizes={`${Math.round(sizes * scale)}vw`}
        quality={90}
        className="object-contain"
        style={{ transform: scale !== 1 ? `scale(${scale})` : undefined }}
      />
    </span>
  );
}
