"use client";

import { useLayoutEffect, useRef } from "react";
import { NAME_ASPECT, NAME_STROKES, NAME_TEXT, NAME_VIEWBOX } from "./name-path";

const DRAW_MS = 2100;
// Gentle global ease — pen speed stays constant along the path (lengths drive
// timing), this just softens the start and the final lift.
const ease = (u: number) => 0.5 - 0.5 * Math.cos(Math.PI * u);

/**
 * Self-drawing signature. Strokes are baked single-stroke pen paths
 * (see scripts/generate-name-path.mjs); drawing animates stroke-dashoffset
 * sequentially at constant pen speed, with an accent dot riding the pen tip.
 * With play=false it renders the finished name statically.
 */
export default function HandwrittenName({
  play,
  onDone,
}: {
  play: boolean;
  onDone?: () => void;
}) {
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const penRef = useRef<SVGCircleElement>(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const playedRef = useRef(false);

  // useLayoutEffect so strokes are hidden before first paint — no flash.
  useLayoutEffect(() => {
    if (!play || playedRef.current) return;
    playedRef.current = true;

    const paths = pathRefs.current.filter((p): p is SVGPathElement => p !== null);
    const pen = penRef.current;
    const lengths = paths.map((p) => p.getTotalLength());
    const starts: number[] = [];
    let total = 0;
    for (const len of lengths) {
      starts.push(total);
      total += len;
    }

    for (let i = 0; i < paths.length; i++) {
      paths[i].style.strokeDasharray = `${lengths[i]}`;
      paths[i].style.strokeDashoffset = `${lengths[i]}`;
    }

    let raf = 0;
    const startTime = performance.now();

    const tick = (now: number) => {
      const u = Math.min(1, (now - startTime) / DRAW_MS);
      const drawn = ease(u) * total;

      for (let i = 0; i < paths.length; i++) {
        const local = Math.max(0, Math.min(lengths[i], drawn - starts[i]));
        paths[i].style.strokeDashoffset = `${lengths[i] - local}`;
        if (pen && local > 0 && local < lengths[i]) {
          const pt = paths[i].getPointAtLength(local);
          pen.setAttribute("cx", `${pt.x}`);
          pen.setAttribute("cy", `${pt.y}`);
          pen.style.opacity = "1";
        }
      }

      if (u < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        if (pen) pen.style.opacity = "0"; // CSS transition fades it out
        onDoneRef.current?.();
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play]);

  return (
    <>
      <span className="sr-only">{NAME_TEXT}</span>
      <svg
        viewBox={NAME_VIEWBOX}
        aria-hidden
        className="mx-auto block w-[min(85vw,34rem)] md:w-[min(70vw,44rem)]"
        style={{ aspectRatio: NAME_ASPECT }}
      >
        {NAME_STROKES.map((d, i) => (
          <path
            key={i}
            ref={(el) => {
              pathRefs.current[i] = el;
            }}
            d={d}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.1}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        <circle
          ref={penRef}
          r={1.4}
          fill="var(--accent)"
          style={{ opacity: 0, transition: "opacity 0.45s ease" }}
        />
      </svg>
    </>
  );
}
