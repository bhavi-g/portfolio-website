"use client";

import { useReducedMotion } from "framer-motion";
import { projects } from "@/content/content";
import { useMediaQuery } from "@/lib/hooks";
import Reveal from "../Reveal";
import ProjectCard from "./ProjectCard";
import ProjectFlashcards from "./ProjectFlashcards";

export default function Projects({
  projectImages,
}: {
  projectImages: Record<string, string | null>;
}) {
  const reduce = useReducedMotion();
  // ≥768px gets the scroll-jacked flashcards; narrower (or reduced motion)
  // stays as a plain stacked list — pinning has no room to breathe on a small
  // screen, and scroll-jacking is a poor fit for touch scrolling anyway.
  // useMediaQuery defaults to false until mounted, so this always matches the
  // plain-list branch on first paint (server and client) — never mismatches.
  const wide = useMediaQuery("(min-width: 768px)");
  const useFlashcards = wide && !reduce;

  return (
    <section id="projects" className="relative w-full scroll-mt-24">
      <div className="mx-auto w-full max-w-6xl px-6 pt-24 md:pt-32">
        <Reveal>
          <p className="flex items-center gap-3 font-mono text-eyebrow uppercase text-accent">
            <span className="text-subtle">02</span>
            <span className="h-px w-8 bg-border" aria-hidden />
            Projects
          </p>
          <h2 className="mt-4 text-heading">Systems I&rsquo;ve built</h2>
        </Reveal>
      </div>

      {useFlashcards ? (
        <ProjectFlashcards projectImages={projectImages} />
      ) : (
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-16 md:gap-10 md:py-24">
          {projects.map((project) => (
            <Reveal key={project.title} amount={0.15}>
              <ProjectCard project={project} image={projectImages[project.title]} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
