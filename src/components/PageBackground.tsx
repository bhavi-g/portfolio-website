"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import CursorSpotlight from "./hero/CursorSpotlight";

// Client-only, loaded after hydration — the gradient wash keeps the page
// visually complete in the meantime. Under reduced motion it still mounts,
// but renders a single static frame.
const NeuralField = dynamic(() => import("./hero/NeuralField"), { ssr: false });

/**
 * Site-wide ambient background: fixed to the viewport (not the document), so
 * it stays put and keeps animating behind every section as you scroll,
 * instead of being scoped to the hero. Painted before <main> in the DOM, so
 * it sits behind all normal-flow content without needing z-index juggling.
 */
export default function PageBackground() {
  const reducedMotion = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_45%,color-mix(in_srgb,var(--accent-strong)_8%,transparent),transparent)]" />
      <CursorSpotlight />
      <div className="absolute inset-0">
        <NeuralField animated={!reducedMotion} />
      </div>
    </div>
  );
}
