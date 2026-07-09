import { type ReactNode } from "react";
import Reveal from "./Reveal";

/**
 * Shared section shell: consistent vertical rhythm, max width, and a header
 * with a numbered mono eyebrow + display heading. Each section reads as a
 * deliberate "slide".
 */
export default function Section({
  id,
  index,
  eyebrow,
  title,
  children,
  className = "",
  headerClassName = "",
  contentClassName = "",
}: {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}) {
  return (
    <section
      id={id}
      className={`mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-24 md:py-32 ${className}`}
    >
      <Reveal className={`mb-12 md:mb-16 ${headerClassName}`}>
        <p className="flex items-center gap-3 font-mono text-eyebrow uppercase text-accent">
          <span className="text-subtle">{index}</span>
          <span className="h-px w-8 bg-border" aria-hidden />
          {eyebrow}
        </p>
        <h2 className="mt-4 text-heading">{title}</h2>
      </Reveal>
      <div className={contentClassName}>{children}</div>
    </section>
  );
}
