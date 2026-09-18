import type { CSSProperties } from "react";

export const button =
  "inline-flex h-[34px] items-center gap-[5px] rounded-[10px] px-3 text-[15px] font-medium tracking-[-0.03em] transition-opacity hover:opacity-80";

export const buttonPrimary = `${button} bg-black text-white`;
export const buttonSecondary = `${button} bg-[#F2F2F2] text-[#919191]`;

/** Stagger delay for the `enter` / `enter-scale` utilities. */
export const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;
