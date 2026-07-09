import { experience } from "@/content/content";
import Section from "./Section";
import Reveal, { RevealItem } from "./Reveal";

export default function Experience() {
  return (
    <Section id="experience" index="03" eyebrow="Experience" title="Where I've worked">
      <Reveal stagger className="relative" amount={0.1}>
        {/* Vertical spine */}
        <span
          className="absolute left-[7px] top-2 bottom-2 w-px bg-border md:left-[9px]"
          aria-hidden
        />
        <ol className="space-y-12 md:space-y-14">
          {experience.map((job) => (
            <RevealItem as="li" key={`${job.company}-${job.period}`} className="relative pl-8 md:pl-12">
              {/* Node marker */}
              <span
                className="absolute left-0 top-1.5 flex h-[15px] w-[15px] items-center justify-center md:h-[19px] md:w-[19px]"
                aria-hidden
              >
                <span className="h-full w-full rounded-full border-2 border-accent bg-bg" />
              </span>

              <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between md:gap-4">
                <h3 className="text-lg font-semibold tracking-tight md:text-xl">
                  {job.company}
                </h3>
                <p className="shrink-0 font-mono text-xs text-subtle">
                  {job.period}
                  {job.location && <span className="text-subtle/70"> · {job.location}</span>}
                </p>
              </div>
              <p className="mt-0.5 text-accent">{job.role}</p>

              {job.highlights.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {job.highlights.map((h, i) => (
                    <li key={i} className="flex gap-3 text-sm text-muted md:text-base">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/60" aria-hidden />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              )}
            </RevealItem>
          ))}
        </ol>
      </Reveal>
    </Section>
  );
}
