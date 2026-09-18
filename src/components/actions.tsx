import { ResumeIcon, EmailIcon } from "@/components/icons";
import type { CSSProperties } from "react";
import { buttonPrimary, buttonSecondary } from "@/lib/styles";

export function Actions({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`items-center gap-2 ${className}`} style={style}>
      <a
        href="/resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className={buttonPrimary}
      >
        <ResumeIcon />
        Resume
      </a>
      <a href="mailto:koonzwg@gmail.com" className={buttonSecondary}>
        <EmailIcon />
        Email
      </a>
    </div>
  );
}
