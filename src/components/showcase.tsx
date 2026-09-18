import { ViewAllButton } from "@/components/work-viewer";
import { buttonSecondary, delay } from "@/lib/styles";

// Inverted 16px fillet: white outside a quarter circle anchored bottom-left.
const fillet =
  "pointer-events-none absolute size-4 bg-[radial-gradient(circle_at_0_100%,transparent_16px,white_16.5px)]";

// Carve the corner once the rest of the entrance has landed, then pop in View all.
const CARVE = { "--carve-d": "950ms" } as React.CSSProperties;

export function Showcase() {
  return (
    <section
      style={{ ...delay(400), ...CARVE }}
      className="showcase-in relative aspect-[3/2] w-full rounded-[32px] rounded-tr-none bg-[#F2F2F2]"
    >
      {/* Work slides go here */}

      <div
        style={CARVE}
        className="carve absolute top-0 right-0 rounded-bl-2xl bg-white pb-2.5 pl-2.5"
      >
        <span aria-hidden className={`${fillet} top-0 right-full`} />
        <span aria-hidden className={`${fillet} top-full right-0`} />
        <span
          className="enter-scale block origin-top-right"
          style={delay(1500)}
        >
          <ViewAllButton className={buttonSecondary} />
        </span>
      </div>
    </section>
  );
}
