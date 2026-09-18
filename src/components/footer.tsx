import { socials } from "@/lib/socials";

export function Footer() {
  return (
    <footer className="-mt-6 flex justify-center sm:justify-end gap-1">
      {socials.map((s) => (
        <a
          key={s.name}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.name}
          title={s.name}
          className="grid size-[34px] place-items-center rounded-[10px] text-[#919191] transition-colors hover:bg-[#F2F2F2] hover:text-black"
        >
          <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden>
            <path d={s.path} />
          </svg>
        </a>
      ))}
    </footer>
  );
}
