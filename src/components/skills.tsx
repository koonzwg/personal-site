import { skillRows } from "@/lib/skills";
import { button, delay } from "@/lib/styles";

const tag = `${button} shrink-0 bg-[#F2F2F2] text-[#919191] hover:opacity-100`;

export function Skills() {
  return (
    <section
      aria-label="Skills"
      className="flex flex-col gap-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
    >
      {skillRows.map((row, i) => (
        <ul key={i} className="flex justify-center gap-1">
          {row.map((skill, j) => (
            <li
              key={skill.name}
              className={`enter ${tag}`}
              // Ripple outward from the center of each row.
              style={delay(
                500 + i * 40 + Math.abs(j - (row.length - 1) / 2) * 20,
              )}
            >
              <svg
                viewBox="0 0 24 24"
                width={14}
                height={14}
                fill="currentColor"
                aria-hidden
              >
                <path d={skill.path} />
              </svg>
              {skill.name}
            </li>
          ))}
        </ul>
      ))}
    </section>
  );
}
