import { experience } from "@/lib/experience";

const type = "text-[15px] font-medium tracking-[-0.03em]";

export function Experience() {
  return (
    <section className="flex flex-col gap-5">
      <h2 className={`${type} font-semibold text-black`}>Experience</h2>
      <ol className="flex flex-col">
        {experience.map((role) => (
          <li
            key={role.company}
            className="border-b border-[#F2F2F2] py-[30px] first:pt-0"
          >
            <div className="flex flex-col gap-0.5">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className={`${type} font-semibold text-black`}>
                  {role.company}
                </h3>
                <span className={`${type} shrink-0 text-black/30`}>
                  {role.dates}
                </span>
              </div>
              <p className={`${type} text-black`}>{role.title}</p>
            </div>
            <p className={`${type} mt-5 leading-[1.45] text-black/30`}>{role.description}</p>
            <p className={`${type} mt-2.5 text-black/30`}>
              {role.stack.join(" / ")}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
