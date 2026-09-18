import Image from "next/image";
import { Actions } from "@/components/actions";
import { delay } from "@/lib/styles";

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
          className="enter-scale size-16 rounded-full object-cover"
        />
        <div className="enter flex flex-col gap-1" style={delay(60)}>
          <p className={`${text} text-black`}>William Koonz</p>
          <p className={`${text} text-black/40`}>Design Engineer</p>
        </div>
      </div>

      <Actions className="enter hidden sm:flex" style={delay(120)} />
    </header>
  );
}
