import { Actions } from "@/components/actions";
import { delay } from "@/lib/styles";

export function Intro() {
  return (
    <section className="flex flex-col gap-3">
      {/* Desktop: lines reveal one after another. Mobile: the headline wraps freely, so it reveals as one block. */}
      <h1
        className="max-sm:enter text-2xl leading-[1.2] text-balance font-semibold tracking-[-0.03em] text-black"
        style={delay(150)}
      >
        <span className="sm:enter sm:block" style={delay(150)}>
          I design and build products
        </span>{" "}
        <span className="sm:enter sm:block" style={delay(230)}>
          from first idea to shipped software.
        </span>
      </h1>
      <p
        style={delay(300)}
        className="enter text-[15px] leading-6 text-pretty font-medium tracking-[-0.03em] text-black/60"
      >
        I work across product strategy, UX/UI, engineering, and AI, wherever the
        problem needs me. Currently building{" "}
        <a
          href="https://apps.apple.com/app/id6777745636"
          target="_blank"
          rel="noopener noreferrer"
          className="text-black underline decoration-black/30 decoration-1 underline-offset-[3px] transition-[text-decoration-color] duration-200 hover:decoration-black"
        >
          Shado
        </a>
        , an AI-guided reflection product I took from concept to the App Store.
      </p>
      <Actions className="enter mt-3 flex sm:hidden" style={delay(360)} />
    </section>
  );
}
