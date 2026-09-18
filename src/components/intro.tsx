import { Actions } from "@/components/actions";

export function Intro() {
  return (
    <section className="flex flex-col gap-3">
      <h1 className="text-2xl leading-[1.2] text-balance font-semibold tracking-[-0.03em] text-black">
        I design and build products{" "}
        <br className="hidden sm:inline" />
        from first idea to shipped software.
      </h1>
      <p className="text-[15px] leading-6 font-medium tracking-[-0.03em] text-black/60">
        I work across product strategy, UX/UI, engineering, and AI, wherever
        the problem needs me. Currently building{" "}
        <a
          href="https://apps.apple.com/app/id6777745636"
          target="_blank"
          rel="noopener noreferrer"
          className="text-black underline decoration-1 underline-offset-[3px] transition-opacity hover:opacity-70"
        >
          Shado
        </a>
        , an AI-guided reflection product I took from concept to the App Store.
      </p>
      <Actions className="mt-3 flex sm:hidden" />
    </section>
  );
}
