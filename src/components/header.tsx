import Image from "next/image";
import { Actions } from "@/components/actions";

const text = "text-[17px] font-medium tracking-[-0.03em] leading-tight";

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

      <Actions className="hidden sm:flex" />
    </header>
  );
}
