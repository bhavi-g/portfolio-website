import { skillGroups } from "@/content/content";
import Section from "./Section";
import Reveal, { RevealItem } from "./Reveal";

export default function Skills() {
  return (
    <Section
      id="skills"
      index="05"
      eyebrow="Skills"
      title="Tools of the trade"
      contentClassName="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2"
    >
      {skillGroups.map((group, i) => (
        <Reveal key={group.label} delay={i * 0.05} className="bg-bg p-6 md:p-8">
          <h3 className="font-mono text-eyebrow uppercase text-accent">{group.label}</h3>
          <Reveal stagger className="mt-5 flex flex-wrap gap-2" amount={0.2}>
            {group.skills.map((skill) => (
              <RevealItem
                as="span"
                key={skill}
                className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted"
              >
                {skill}
              </RevealItem>
            ))}
          </Reveal>
        </Reveal>
      ))}
    </Section>
  );
}
