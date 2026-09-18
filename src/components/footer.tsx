import { socials } from "@/lib/socials";
import { button } from "@/lib/styles";

export function Footer() {
  return (
    <footer className="-mt-6 flex justify-end">
      {socials.map((s) => (
        <a
          key={s.name}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${button} text-[#919191]`}
        >
          <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor" aria-hidden>
            <path d={s.path} />
          </svg>
          {s.name}
        </a>
      ))}
    </footer>
  );
}
