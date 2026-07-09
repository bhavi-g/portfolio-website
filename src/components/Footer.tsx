import { site } from "@/content/content";
import { SocialLinks } from "./SocialLinks";
import { ResumeIcon } from "./icons";
import { contact } from "@/content/content";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 md:flex-row md:items-center md:justify-between">
        <div>
          <a href="#top" className="text-sm font-semibold tracking-tight transition-colors hover:text-accent">
            {site.name}
          </a>
          <p className="mt-2 text-sm text-subtle">
            {site.role} · © {year}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-5">
          <a
            href={contact.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
          >
            <ResumeIcon size={15} />
            Resume
          </a>
          <SocialLinks />
        </div>
      </div>
    </footer>
  );
}
