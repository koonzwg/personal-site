import { ViewAllButton } from "@/components/work-viewer";
import { buttonSecondary } from "@/lib/styles";

// Inverted 16px fillet: white outside a quarter circle anchored bottom-left.
const fillet =
  "pointer-events-none absolute size-4 bg-[radial-gradient(circle_at_0_100%,transparent_16px,white_16.5px)]";

export function Showcase() {
  return (
    <section className="relative aspect-[3/2] w-full rounded-[32px] rounded-tr-none bg-[#F2F2F2]">
      {/* Work slides go here */}

      <div className="absolute top-0 right-0 rounded-bl-2xl bg-white pb-2.5 pl-2.5">
        <span aria-hidden className={`${fillet} top-0 right-full`} />
        <span aria-hidden className={`${fillet} top-full right-0`} />
        <ViewAllButton className={buttonSecondary} />
      </div>
    </section>
  );
}
