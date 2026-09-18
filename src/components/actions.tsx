"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { CheckIcon, EmailIcon, ResumeIcon } from "@/components/icons";
import { buttonPrimary, buttonSecondary, nudge } from "@/lib/styles";

const EMAIL = "koonzwg@gmail.com";
const SWAP =
  "transition-[opacity,filter,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]";

/**
 * Email copies the address (a mailto does nothing for anyone without a mail app set up).
 * Cmd/Ctrl-click still opens the mail client. The button eases between its two widths.
 */
function EmailButton() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const labels = useRef<(HTMLSpanElement | null)[]>([]);
  const [widths, setWidths] = useState<[number, number] | null>(null);

  useLayoutEffect(() => {
    const [a, b] = labels.current;
    if (a && b) setWidths([a.offsetWidth, b.offsetWidth]);
  }, []);

  const onClick = async (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };

  const show = (on: boolean) =>
    on ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-[2px] scale-90";

  return (
    <a
      href={`mailto:${EMAIL}`}
      onClick={onClick}
      aria-label={
        copied ? "Email address copied" : `Copy email address ${EMAIL}`
      }
      className={`${buttonSecondary} ${copied ? "text-[#5E5E5E]" : ""}`}
    >
      <span className="relative grid size-4 place-items-center">
        <span className={`absolute ${SWAP} ${show(!copied)}`}>
          <EmailIcon className={nudge.send} />
        </span>
        <span className={`absolute ${SWAP} ${show(copied)}`}>
          <CheckIcon />
        </span>
      </span>
      <span
        className="relative inline-block h-5 overflow-hidden transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={widths ? { width: copied ? widths[1] : widths[0] } : undefined}
      >
        <span
          ref={(el) => {
            labels.current[0] = el;
          }}
          className={`inline-block whitespace-nowrap ${SWAP} ${show(!copied)}`}
        >
          Email
        </span>
        <span
          ref={(el) => {
            labels.current[1] = el;
          }}
          aria-hidden
          className={`absolute top-0 left-0 whitespace-nowrap ${SWAP} ${show(copied)}`}
        >
          Copied
        </span>
      </span>
      <span className="sr-only" aria-live="polite">
        {copied ? "Email address copied" : ""}
      </span>
    </a>
  );
}

export function Actions({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`items-center gap-2 ${className}`} style={style}>
      <Link href="/resume" className={buttonPrimary}>
        <ResumeIcon className={nudge.lift} />
        Resume
      </Link>
      <EmailButton />
    </div>
  );
}
