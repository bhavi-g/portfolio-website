import Image from "next/image";

/**
 * Project preview slot. Reserves a fixed 16:9 aspect so there's no layout
 * shift whether or not an image exists yet — falls back to a quiet tinted
 * placeholder until one is dropped in (see findProjectImage).
 */
export default function ProjectImage({
  image,
  title,
  className = "aspect-video w-full",
}: {
  image: string | null;
  title: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-surface ${className}`}>
      {image ? (
        <Image
          src={image}
          alt={`${title} preview`}
          fill
          sizes="(max-width: 768px) 90vw, 32rem"
          className="object-cover"
        />
      ) : (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,color-mix(in_srgb,var(--accent-strong)_12%,transparent),transparent_70%)]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-subtle">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <circle cx="8.5" cy="9.5" r="1.5" />
              <path d="m21 15-5-5-9 9" />
            </svg>
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.15em]">Preview</span>
          </div>
        </>
      )}
    </div>
  );
}
