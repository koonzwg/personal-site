import { ArrowUpRightIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { experience } from "@/lib/experience";
import { delay } from "@/lib/styles";

const type = "text-[15px] font-medium tracking-[-0.03em]";
const rise = { "--enter-y": "8px" } as React.CSSProperties;

export function Experience() {
  return (
    <section className="flex flex-col gap-5">
      <Reveal>
        <h2 className={`${type} enter font-semibold text-black`}>Experience</h2>
      </Reveal>
      <ol className="flex flex-col">
        {experience.map((role) => (
          // Each role reveals on its own as it scrolls in: header → title → description → stack,
          // then the divider draws beneath it.
          <Reveal
            as="li"
            key={role.company}
            className="relative py-[30px] first:pt-0"
          >
            <div className="flex flex-col gap-0.5">
              <div
                className="enter flex items-baseline justify-between gap-4"
                style={rise}
              >
                <h3 className={`${type} font-semibold text-black`}>
                  {role.href ? (
                    <a
                      href={role.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-0.5 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-black/15"
                    >
                      {role.company}
                      <ArrowUpRightIcon
                        width={16}
                        height={16}
                        className="-translate-x-1 translate-y-0.5 text-black/40 opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                      />
                    </a>
                  ) : (
                    role.company
                  )}
                </h3>
                <span className={`${type} shrink-0 text-black/30`}>
                  {role.dates}
                </span>
              </div>
              <p
                className={`${type} enter text-black`}
                style={{ ...rise, ...delay(40) }}
              >
                {role.title}
              </p>
            </div>
            <p
              className={`${type} enter mt-5 leading-[1.45] text-pretty text-black/30`}
              style={{ ...rise, ...delay(80) }}
            >
              {role.description}
            </p>
            <p
              className={`${type} enter mt-2.5 text-black/30`}
              style={{ ...rise, ...delay(120) }}
            >
              {role.stack.join(" / ")}
            </p>
            <span
              aria-hidden
              className="draw absolute inset-x-0 bottom-0 h-px bg-[#F2F2F2]"
              style={delay(260)}
            />
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
