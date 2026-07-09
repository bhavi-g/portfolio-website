import { type Project } from "@/content/content";
import { GithubIcon } from "../icons";
import ProjectImage from "./ProjectImage";

/**
 * Clean, fully readable fallback — the SSR baseline, and what mobile /
 * reduced-motion users always get. Preview image, title, subtitle,
 * description, tech as labeled tags, and the GitHub link.
 */
export default function ProjectCard({
  project,
  image,
}: {
  project: Project;
  image: string | null;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-surface/50">
      <ProjectImage image={image} title={project.title} />
      <div className="p-7 md:p-8">
        <h3 className="text-xl font-semibold tracking-tight md:text-2xl">{project.title}</h3>
        {project.subtitle && (
          <p className="mt-1 font-mono text-xs text-subtle">{project.subtitle}</p>
        )}
        <p className="mt-4 text-muted">{project.description}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
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
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-fg"
        >
          <GithubIcon />
          View on GitHub
        </a>
      </div>
    </article>
  );
}
