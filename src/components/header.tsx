import Image from "next/image";
import { ResumeIcon, EmailIcon } from "@/components/icons";

const text = "text-[17px] font-medium tracking-[-0.03em] leading-tight";
const button =
  "inline-flex h-[34px] items-center gap-[5px] rounded-[10px] px-3 text-[15px] font-medium tracking-[-0.03em] transition-opacity hover:opacity-80";

export function Header() {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Image
          src="/headshot.png"
          alt="William Koonz"
          width={64}
          height={64}
          priority
          className="size-16 rounded-full object-cover"
        />
        <div className="flex flex-col gap-1">
          <p className={`${text} text-black`}>William Koonz</p>
          <p className={`${text} text-black/40`}>Design Engineer</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className={`${button} bg-black text-white`}
        >
          <ResumeIcon />
          Resume
        </a>
        <a
          href="mailto:koonzwg@gmail.com"
          className={`${button} bg-[#F2F2F2] text-[#919191]`}
        >
          <EmailIcon />
          Email
        </a>
      </div>
    </header>
  );
}
