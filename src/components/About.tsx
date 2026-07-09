import Image from "next/image";
import { about, site } from "@/content/content";
import { findPublicAsset } from "@/lib/publicAsset";
import Reveal from "./Reveal";
import { SocialLinks, ResumeButton } from "./SocialLinks";

export default function About() {
  return (
    <section id="about" className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-28 md:py-36">
      <Reveal>
        <p className="flex items-center gap-3 font-mono text-eyebrow uppercase text-accent">
          <span className="text-subtle">01</span>
          <span className="h-px w-8 bg-border" aria-hidden />
          About
        </p>
      </Reveal>

      <div className="mt-10 grid items-center gap-12 md:mt-14 md:grid-cols-[1.5fr_1fr] md:gap-16">
        {/* Text — left on desktop, below photo on mobile */}
        <Reveal className="order-2 md:order-1" delay={0.1}>
          <p className="text-xl font-light leading-relaxed tracking-tight text-fg sm:text-2xl md:text-[1.75rem] md:leading-[1.5]">
            {about.paragraph}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <SocialLinks />
            <ResumeButton />
          </div>
        </Reveal>

        {/* Photo — right on desktop, on top for mobile */}
        <Reveal className="order-1 md:order-2" delay={0.15}>
          <PhotoPlaceholder />
        </Reveal>
      </div>
    </section>
  );
}

/**
 * Portrait slot. Reserves the correct 4:5 aspect so there's no layout shift when
 * the real image lands. Drop the photo at public/bhavish.jpg and this becomes a
 * next/image (see the note in the build summary).
 */
function PhotoPlaceholder() {
  // Auto-swaps to the real portrait once you drop it into /public (any of these names).
  const photo = findPublicAsset(["bhavish.jpg", "bhavish.jpeg", "bhavish.png", "bhavish.webp"]);
  return (
    <div className="mx-auto w-full max-w-[18rem] md:mx-0 md:ml-auto">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-surface">
        {photo ? (
          <Image
            src={photo}
            alt={site.name}
            fill
            sizes="(max-width: 768px) 18rem, 20rem"
            className="object-cover"
            priority={false}
          />
        ) : (
          <>
            {/* subtle accent wash */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,color-mix(in_srgb,var(--accent-strong)_14%,transparent),transparent_70%)]" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-subtle">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="8.5" r="4" />
                <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
              </svg>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.15em]">Portrait</span>
            </div>
            {/* corner ticks, echoing the diagram language */}
            <span className="absolute left-3 top-3 h-3 w-3 border-l border-t border-accent/50" aria-hidden />
            <span className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-accent/50" aria-hidden />
          </>
        )}
      </div>
    </div>
  );
}
