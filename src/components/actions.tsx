import { ResumeIcon, EmailIcon } from "@/components/icons";
import { buttonPrimary, buttonSecondary } from "@/lib/styles";

export function Actions({ className = "" }: { className?: string }) {
  return (
    <div className={`items-center gap-2 ${className}`}>
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
