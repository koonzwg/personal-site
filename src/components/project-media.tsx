import Image from "next/image";
import type { Project } from "@/lib/projects";

/**
 * A project's visual, filling whatever card it's in. The image is never cropped: it's shown
 * whole (object-contain) on the project's background color, so it works in the 3:2 home card,
 * the wide desktop viewer, and the taller mobile viewer alike.
 *
 * Crispness: `scale` zooms by laying the image out larger (not a CSS transform, which the
 * browser rasterizes small and then stretches), and exports are served as-is (`unoptimized`)
 * so text and edges aren't re-compressed. Keep exports as optimized PNGs.
 */
export function ProjectMedia({ project: p }: { project: Project }) {
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
    <span
      className="absolute inset-0 overflow-hidden"
      style={{ background: p.background }}
    >
      <span
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: `${scale * 100}%`, height: `${scale * 100}%` }}
      >
        <Image
          src={p.media}
          alt={p.title}
          fill
          unoptimized
          className="object-contain"
        />
      </span>
    </span>
  );
}
