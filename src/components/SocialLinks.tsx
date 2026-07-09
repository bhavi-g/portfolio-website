import { contact } from "@/content/content";
import { GithubIcon, LinkedInIcon, MailIcon, ResumeIcon } from "./icons";

const hasEmail = Boolean(contact.email) && !contact.email.toLowerCase().includes("todo");

type Link = { label: string; href: string; icon: typeof GithubIcon; external?: boolean };

const links: Link[] = [
  ...(hasEmail
    ? [{ label: "Email", href: `mailto:${contact.email}`, icon: MailIcon }]
    : []),
  { label: "LinkedIn", href: contact.linkedin, icon: LinkedInIcon, external: true },
  { label: "GitHub", href: contact.github, icon: GithubIcon, external: true },
];

/** Row of icon links (email / LinkedIn / GitHub). Email is omitted until a real address is set. */
export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex items-center gap-2 ${className}`}>
      {links.map(({ label, href, icon: Icon, external }) => (
        <li key={label}>
          <a
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            aria-label={external ? `${label} (opens in a new tab)` : label}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-fg/40 hover:text-fg"
          >
            <Icon size={18} />
          </a>
        </li>
      ))}
    </ul>
  );
}

/** "View Resume" button → /resume.pdf (opens in a new tab). */
export function ResumeButton({
  className = "",
  variant = "solid",
}: {
  className?: string;
  variant?: "solid" | "ghost";
}) {
  const base =
    "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors";
  const styles =
    variant === "solid"
      ? "bg-fg text-bg hover:bg-accent"
      : "border border-border text-fg hover:border-fg/40";
  return (
    <a
      href={contact.resume}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${styles} ${className}`}
    >
      <ResumeIcon size={16} />
      View Resume
    </a>
  );
}
