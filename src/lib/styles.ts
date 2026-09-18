import type { CSSProperties } from "react";

// Tailwind v4 only applies `hover:` on devices that truly hover, so taps never leave buttons stuck.
export const button =
  "group inline-flex h-[34px] items-center gap-[5px] rounded-[10px] px-3 text-[15px] font-medium tracking-[-0.03em] outline-none transition-[background-color,color,transform] duration-200 ease-out active:scale-[0.97] active:duration-100 focus-visible:ring-2 focus-visible:ring-black/15 focus-visible:ring-offset-2";

export const buttonPrimary = `${button} bg-black text-white hover:bg-[#2a2a2a]`;
export const buttonSecondary = `${button} bg-[#F2F2F2] text-[#919191] hover:bg-[#EAEAEA] hover:text-[#5E5E5E]`;

/** Icon micro-motions, driven by the parent button's hover. */
export const nudge = {
  lift: "transition-transform duration-200 ease-out group-hover:-translate-y-px",
  send: "transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
  forward: "transition-transform duration-200 ease-out group-hover:translate-x-0.5",
};

/** Stagger delay for the `enter` / `enter-scale` utilities. */
export const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;
