"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Server and the client's very first paint always render with motion fully
 * disabled — no `initial`/`whileInView` props at all — so hydration can never
 * mismatch. A client-only effect then checks prefers-reduced-motion and, only
 * if motion is allowed, adds those props on a normal post-mount re-render.
 *
 * Branching which props to pass directly on useReducedMotion()'s return value
 * is unsafe: that hook can resolve synchronously on the client before the
 * first paint, differing from the server's render (which has no way to know
 * the client's OS preference) and producing a hydration mismatch React
 * explicitly won't patch up — content can get stuck invisible.
 */
function useRevealEnabled() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setEnabled(true);
    }
  }, []);
  return enabled;
}

/**
 * Shared scroll-reveal wrapper: a quiet fade + short rise, played once when the
 * element enters the viewport. Under prefers-reduced-motion (or before mount)
 * it renders the final state immediately with no transform, so nothing moves.
 *
 * Wrap a list in <Reveal stagger> and its <RevealItem> children to cascade.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  y = 16,
  stagger = false,
  as = "div",
  amount = 0.3,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  stagger?: boolean;
  as?: "div" | "section" | "ul" | "li" | "span";
  amount?: number;
}) {
  const enabled = useRevealEnabled();
  const MotionTag = motion[as];

  if (stagger) {
    const container: Variants = {
      hidden: {},
      show: { transition: { staggerChildren: 0.08, delayChildren: delay } },
    };
    return (
      <MotionTag
        className={className}
        variants={container}
        {...(enabled
          ? { initial: "hidden", whileInView: "show", viewport: { once: true, amount } }
          : {})}
      >
        {children}
      </MotionTag>
    );
  }

  return (
    <MotionTag
      className={className}
      {...(enabled
        ? {
            initial: { opacity: 0, y },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, amount },
            transition: { duration: 0.6, delay, ease: EASE },
          }
        : {})}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Child of a <Reveal stagger> container. Its animation is entirely driven by
 * variant propagation from the parent's `initial`/`whileInView` — when the
 * parent has motion disabled (pre-mount or reduced-motion), it never declares
 * those, so this component inherits nothing and just renders at rest. No
 * reduced-motion branch of its own needed, and nothing here can hydration-
 * mismatch since its props never change.
 */
export function RevealItem({
  children,
  className,
  y = 16,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  as?: "div" | "li" | "span";
}) {
  const MotionTag = motion[as];
  const item: Variants = {
    hidden: { opacity: 0, y },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  };
  return (
    <MotionTag className={className} variants={item}>
      {children}
    </MotionTag>
  );
}
