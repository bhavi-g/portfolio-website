import { extracurriculars } from "@/content/content";
import Section from "./Section";
import Reveal, { RevealItem } from "./Reveal";

export default function Extracurriculars() {
  return (
    <Section
      id="extracurriculars"
      index="06"
      eyebrow="Leadership"
      title="Beyond the code"
    >
      <Reveal stagger className="grid gap-6 md:grid-cols-2" amount={0.2}>
        {extracurriculars.map((item) => (
          <RevealItem
            key={item.title}
            className="rounded-2xl border border-border bg-surface/40 p-6 md:p-8"
          >
            <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
            <p className="mt-3 text-muted">{item.description}</p>
          </RevealItem>
        ))}
      </Reveal>
    </Section>
  );
}
