import { LocalTime } from "@/components/local-time";
import { Reveal } from "@/components/reveal";
import { socials } from "@/lib/socials";
import { delay } from "@/lib/styles";

export function Footer() {
  return (
    <Reveal as="footer" className="-mt-6 flex items-center justify-between">
      <LocalTime
        className="enter text-[13px] font-medium tracking-[-0.03em] text-black/35"
        style={delay(150)}
      />
      <div className="flex gap-1">
        {socials.map((s, i) => (
          <a
            key={s.name}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.name}
            title={s.name}
            style={delay(200 + i * 50)}
            className="enter group grid size-[34px] place-items-center rounded-[10px] text-[#919191] outline-none transition-[background-color,color,transform] duration-200 hover:bg-[#F2F2F2] hover:text-black focus-visible:ring-2 focus-visible:ring-black/15 active:scale-[0.94]"
          >
            <svg
              viewBox="0 0 24 24"
              width={16}
              height={16}
              fill="currentColor"
              aria-hidden
              className="transition-transform duration-200 ease-out group-hover:-translate-y-px"
            >
              <path d={s.path} />
            </svg>
          </a>
        ))}
      </div>
    </Reveal>
  );
}
