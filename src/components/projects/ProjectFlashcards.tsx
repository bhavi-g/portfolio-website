"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { projects, type Project } from "@/content/content";
import { GithubIcon, ArrowIcon } from "../icons";
import ProjectImage from "./ProjectImage";

const SPACING = 330; // px between adjacent card-slot centers

/**
 * Scroll-jacked "coverflow": the section pins for a stretch of vertical
 * scroll, and that scroll continuously moves a "focus index" through the
 * project list. Only the card nearest the focus is large with full detail;
 * neighbors shrink to a minimal name tile; anything further out fades away
 * entirely — so at most three cards read as visible at once.
 *
 * Driven by real page scroll (useScroll tracks the document), so wheel,
 * trackpad, keyboard Page Down/Space/arrows, and scrollbar drag all move the
 * carousel correctly. Desktop + motion-allowed only — Projects.tsx falls
 * back to a plain stacked list on mobile / reduced motion.
 */
export default function ProjectFlashcards({
  projectImages,
}: {
  projectImages: Record<string, string | null>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div
      ref={containerRef}
      style={{ height: `${Math.max(320, projects.length * 95)}vh` }}
      className="relative"
    >
      <div className="sticky top-0 flex h-dvh w-full flex-col items-center justify-center overflow-hidden">
        <div className="relative h-[29rem] w-full lg:h-[31rem]">
          {projects.map((project, i) => (
            <Flashcard
              key={project.title}
              project={project}
              image={projectImages[project.title]}
              index={i}
              total={projects.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>

        <div className="mt-8 flex items-center gap-2.5" aria-hidden>
          {projects.map((_, i) => (
            <ProgressDot
              key={i}
              index={i}
              total={projects.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Flashcard({
  project,
  image,
  index,
  total,
  scrollYProgress,
}: {
  project: Project;
  image: string | null;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  // Continuous signed distance from "in focus" — 0 exactly when centered,
  // ±1 at the immediate neighbor slot, etc. Derived off the shared scroll
  // progress so nothing here triggers a React re-render on scroll.
  const distance = useTransform(scrollYProgress, (p) => index - p * (total - 1));

  const x = useTransform(distance, (d) => d * SPACING);
  const scale = useTransform(distance, [-1.4, -1, 0, 1, 1.4], [0.48, 0.56, 1, 0.56, 0.48]);
  const cardOpacity = useTransform(distance, [-2, -1.4, 0, 1.4, 2], [0, 1, 1, 1, 0]);
  const zIndex = useTransform(distance, (d) => Math.round(100 - Math.abs(d) * 10));
  // Full detail only reveals very close to focus; mini tiles show the image
  // + name only. Opacity-only (no height animation) so longer descriptions
  // can never clip — each card's own natural content height is always fully
  // reserved regardless of focus state.
  const detailOpacity = useTransform(distance, [-0.6, 0, 0.6], [0, 1, 0]);

  return (
    <motion.article
      style={{ x, scale, opacity: cardOpacity, zIndex }}
      className="absolute left-1/2 top-1/2 w-[22rem] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-border bg-surface/50 text-center backdrop-blur-md lg:w-[26rem]"
    >
      <ProjectImage image={image} title={project.title} className="h-36 w-full md:h-40" />

      <div className="p-6">
        <p className="font-mono text-xs text-subtle">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
        <h3 className="mt-2 text-xl font-semibold tracking-tight md:text-2xl">
          {project.title}
        </h3>

        <motion.div style={{ opacity: detailOpacity }}>
          {project.subtitle && (
            <p className="mt-1 font-mono text-xs text-subtle">{project.subtitle}</p>
          )}
          <p className="mt-3 text-sm text-muted">{project.description}</p>
          <ul className="mt-4 flex flex-wrap justify-center gap-2">
            {project.tech.map((t) => (
              <li
                key={t}
                className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted"
              >
                {t}
              </li>
            ))}
          </ul>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.title} on GitHub (opens in a new tab)`}
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-fg"
          >
            <GithubIcon />
            View on GitHub
            <ArrowIcon />
          </a>
        </motion.div>
      </div>
    </motion.article>
  );
}

function ProgressDot({
  index,
  total,
  scrollYProgress,
}: {
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const distance = useTransform(scrollYProgress, (p) => index - p * (total - 1));
  const scale = useTransform(distance, [-1, 0, 1], [1, 1.7, 1]);
  const opacity = useTransform(distance, [-1, 0, 1], [0.35, 1, 0.35]);

  return <motion.span style={{ scale, opacity }} className="h-1.5 w-1.5 rounded-full bg-accent" />;
}
