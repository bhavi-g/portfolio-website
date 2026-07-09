import { contact, site } from "@/content/content";
import Reveal from "./Reveal";
import { SocialLinks, ResumeButton } from "./SocialLinks";

const hasEmail = Boolean(contact.email) && !contact.email.toLowerCase().includes("todo");
const hasPhone = Boolean(contact.phone) && !contact.phone.toLowerCase().includes("todo");

export default function Contact() {
  return (
    <section
      id="contact"
      className="mx-auto w-full max-w-3xl scroll-mt-24 px-6 py-28 text-center md:py-40"
    >
      <Reveal>
        <p className="flex items-center justify-center gap-3 font-mono text-eyebrow uppercase text-accent">
          <span className="text-subtle">07</span>
          <span className="h-px w-8 bg-border" aria-hidden />
          Contact
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <h2 className="mt-6 text-heading">Let&rsquo;s build something.</h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
          I&rsquo;m open to co-op roles, collaborations, and conversations about AI. The fastest way
          to reach me is email — or find me on the links below.
        </p>
      </Reveal>

      <Reveal delay={0.2}>
        {hasEmail && (
          <a
            href={`mailto:${contact.email}`}
            className="mt-8 inline-block text-lg font-medium tracking-tight text-fg underline decoration-accent decoration-2 underline-offset-8 transition-colors hover:text-accent md:text-xl"
          >
            {contact.email}
          </a>
        )}
        {hasPhone && <p className="mt-3 font-mono text-sm text-muted">{contact.phone}</p>}

        <div className="mt-10 flex flex-col items-center gap-6">
          <ResumeButton />
          <SocialLinks />
        </div>
      </Reveal>

      <span className="sr-only">{`Contact ${site.name}`}</span>
    </section>
  );
}
