import { Reveal } from "@/components/reveal";
import { socials } from "@/lib/socials";
import { delay } from "@/lib/styles";

export function Footer() {
  return (
    <Reveal
      as="footer"
      className="-mt-6 flex justify-center gap-1 sm:justify-end"
    >
      {socials.map((s, i) => (
        <a
          key={s.name}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.name}
          title={s.name}
          style={delay(200 + i * 50)}
          className="enter grid size-[34px] place-items-center rounded-[10px] text-[#919191] transition-colors hover:bg-[#F2F2F2] hover:text-black"
        >
          <svg
            viewBox="0 0 24 24"
            width={16}
            height={16}
            fill="currentColor"
            aria-hidden
          >
            <path d={s.path} />
          </svg>
        </a>
      ))}
    </Reveal>
  );
}
