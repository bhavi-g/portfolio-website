"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Soft ambient glow that trails the pointer — a background "spotlight" layered
 * behind the neural field so the network reads crisply on top of it. Position
 * is written straight to the DOM via rAF (no React state) so it never
 * re-renders the hero. Pointer-fine only; inert under reduced motion or touch.
 */
export default function CursorSpotlight() {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = ref.current;
    const container = el?.parentElement;
    if (!el || !container) return;

    let raf = 0;
    let rect = container.getBoundingClientRect();
    let targetX = rect.width / 2;
    let targetY = rect.height / 2;
    let x = targetX;
    let y = targetY;

    const onMove = (e: PointerEvent) => {
      rect = container.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const tick = () => {
      // Trail slightly behind the pointer for a soft, unhurried feel.
      x += (targetX - x) * 0.08;
      y += (targetY - y) * 0.08;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    el.style.opacity = "1";

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="absolute left-0 top-0 h-[34rem] w-[34rem] rounded-full opacity-0 transition-opacity duration-700 will-change-transform"
      style={{
        background:
          "radial-gradient(circle, color-mix(in srgb, var(--accent-strong) var(--spotlight-mix), transparent) 0%, transparent var(--spotlight-stop))",
      }}
    />
  );
}
