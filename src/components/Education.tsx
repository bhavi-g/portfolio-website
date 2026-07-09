import { education } from "@/content/content";
import { findPublicAsset } from "@/lib/publicAsset";
import Section from "./Section";
import Reveal, { RevealItem } from "./Reveal";

export default function Education() {
  return (
    <Section id="education" index="04" eyebrow="Education" title="Education">
      <Reveal>
        <div className="flex items-start gap-5 rounded-2xl border border-border bg-surface/40 p-6 md:gap-7 md:p-8">
          <LogoMark />
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <h3 className="text-lg font-semibold tracking-tight md:text-xl">{education.school}</h3>
              <p className="shrink-0 font-mono text-xs text-subtle">{education.period}</p>
            </div>
            <p className="mt-1 text-muted">{education.degree}</p>
            <p className="mt-0.5 text-accent">{education.specialization}</p>

            <ul className="mt-5 space-y-2">
              {education.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-sm text-muted md:text-base">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/60" aria-hidden />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>

      {/* Olympiads & national scholar exams */}
      <Reveal delay={0.1} className="mt-10">
        <h3 className="font-mono text-eyebrow uppercase text-subtle">
          Olympiads &amp; National Scholar Exams
        </h3>
        <Reveal stagger className="mt-5 flex flex-wrap gap-2.5" amount={0.3}>
          {education.olympiads.map((o) => (
            <RevealItem
              as="span"
              key={o}
              className="rounded-full border border-accent/25 bg-accent/5 px-4 py-1.5 font-mono text-xs font-medium tracking-wide text-fg"
            >
              {o}
            </RevealItem>
          ))}
        </Reveal>
      </Reveal>
    </Section>
  );
}

/**
 * University crest slot — crisp mark beside the entry (theme-safe, accessible).
 * Drop the logo at public/uwaterloo-logo.svg and this becomes an <img> with
 * alt="University of Waterloo" (see the build summary note).
 */
function LogoMark() {
  // Auto-swaps to the real crest once you drop it into /public (any of these names).
  const logo = findPublicAsset([
    "uwaterloo-logo.svg",
    "uwaterloo-logo.png",
    "waterloo-logo.svg",
    "waterloo-logo.png",
    "uwaterloo.svg",
    "uwaterloo.png",
  ]);
  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-bg md:h-16 md:w-16">
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logo}
          alt="University of Waterloo"
          className="h-9 w-9 object-contain md:h-10 md:w-10"
        />
      ) : (
        <span className="font-mono text-sm font-semibold tracking-tight text-muted" aria-hidden>
          UW
        </span>
      )}
    </div>
  );
}
