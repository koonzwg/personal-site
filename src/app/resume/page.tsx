import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRightIcon, ResumeIcon } from "@/components/icons";
import { resume } from "@/lib/resume";
import { buttonPrimary, buttonSecondary, delay, nudge } from "@/lib/styles";

export const metadata: Metadata = {
  title: "Resume — William Koonz",
  description: `${resume.title}. ${resume.location}.`,
};

const type = "text-[15px] font-medium tracking-[-0.03em]";
const heading = `${type} font-semibold text-black`;

export default function ResumePage() {
  return (
    <main className="mx-auto flex w-full max-w-[640px] flex-col gap-10 px-6 pt-10 pb-16 sm:py-24">
      <nav className="enter flex items-center justify-between">
        <Link href="/" className={buttonSecondary}>
          <ChevronRightIcon className="-mx-1 rotate-180 transition-transform duration-200 ease-out group-hover:-translate-x-0.5" />
          Home
        </Link>
        <a
          href="/resume.pdf"
          download="William-Koonz-Resume.pdf"
          className={buttonPrimary}
        >
          <ResumeIcon className={nudge.lift} />
          Download PDF
        </a>
      </nav>

      <header className="enter flex flex-col gap-1" style={delay(80)}>
        <h1 className="text-2xl leading-[1.2] font-semibold tracking-[-0.03em] text-black">
          {resume.name}
        </h1>
        <p className={`${type} text-black/40`}>{resume.title}</p>
        <p className={`${type} mt-3 leading-6 text-black/60`}>
          {resume.location} · {resume.availability}
          <br />
          <a
            href={`mailto:${resume.email}`}
            className="text-black underline decoration-black/30 decoration-1 underline-offset-[3px] transition-[text-decoration-color] hover:decoration-black"
          >
            {resume.email}
          </a>
          {resume.links.map((l) => (
            <span key={l.href}>
              {" · "}
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black underline decoration-black/30 decoration-1 underline-offset-[3px] transition-[text-decoration-color] hover:decoration-black"
              >
                {l.label}
              </a>
            </span>
          ))}
        </p>
      </header>

      <section className="enter flex flex-col gap-3" style={delay(160)}>
        <h2 className={heading}>Profile</h2>
        <p className={`${type} leading-6 text-pretty text-black/60`}>
          {resume.profile}
        </p>
      </section>

      <section className="enter flex flex-col gap-5" style={delay(240)}>
        <h2 className={heading}>Experience</h2>
        <ol className="flex flex-col">
          {resume.experience.map((r) => (
            <li
              key={r.company}
              className="flex flex-col gap-0.5 border-b border-[#F2F2F2] py-6 first:pt-0 last:border-0 last:pb-0"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className={`${type} font-semibold text-black`}>
                  {r.company}
                </h3>
                <span className={`${type} shrink-0 text-black/30`}>
                  {r.dates}
                </span>
              </div>
              <p className={`${type} text-black`}>{r.title}</p>
              <ul className="mt-3 flex flex-col gap-2">
                {r.bullets.map((b, i) => (
                  <li
                    key={i}
                    className={`${type} relative pl-4 leading-[1.45] text-pretty text-black/45 before:absolute before:top-[0.6em] before:left-0.5 before:size-1 before:rounded-full before:bg-black/15`}
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section className="enter flex flex-col gap-3" style={delay(320)}>
        <h2 className={heading}>Education</h2>
        {resume.education.map((e) => (
          <div
            key={e.school}
            className="flex items-baseline justify-between gap-4"
          >
            <p className={`${type} text-black`}>
              <span className="font-semibold">{e.school}</span>
              <span className="text-black/30"> · </span>
              {e.program}
            </p>
            <span className={`${type} shrink-0 text-black/30`}>{e.dates}</span>
          </div>
        ))}
      </section>

      <section className="enter flex flex-col gap-3" style={delay(400)}>
        <h2 className={heading}>Skills</h2>
        <dl className="flex flex-col gap-3">
          {resume.skills.map((k) => (
            <div
              key={k.group}
              className="flex flex-col gap-0.5 sm:flex-row sm:gap-4"
            >
              <dt className={`${type} w-24 shrink-0 text-black`}>{k.group}</dt>
              <dd
                className={`${type} leading-[1.45] text-pretty text-black/45`}
              >
                {k.items}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
