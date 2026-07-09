"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/content/content";
import { TypeLine } from "./boot";
import HandwrittenName from "./HandwrittenName";

const BOOTED_KEY = "hero-booted";

type Phase = "line1" | "line2" | "name" | "stream" | "done";
const ORDER: Phase[] = ["line1", "line2", "name", "stream", "done"];
const reached = (phase: Phase, min: Phase) => ORDER.indexOf(phase) >= ORDER.indexOf(min);

export default function Hero() {
  const reducedMotion = useReducedMotion();
  // Server and first client render show the final state (real text in the HTML
  // for SEO/no-JS); the boot sequence only starts after mount, once per session.
  const [phase, setPhase] = useState<Phase>("done");
  const [booting, setBooting] = useState(false);

  useEffect(() => {
    if (reducedMotion !== false) return;
    if (sessionStorage.getItem(BOOTED_KEY)) return;
    sessionStorage.setItem(BOOTED_KEY, "1");
    setBooting(true);
    setPhase("line1");
  }, [reducedMotion]);

  // "stream" phase ends after the tagline stagger has played out
  useEffect(() => {
    if (phase !== "stream") return;
    const t = window.setTimeout(() => setPhase("done"), 1100);
    return () => window.clearTimeout(t);
  }, [phase]);

  const nameVisible = !booting || reached(phase, "name");
  const streamVisible = !booting || reached(phase, "stream");
  const cueVisible = !booting || phase === "done";

  const words = site.tagline.split(" ");

  return (
    <section id="top" className="relative flex min-h-dvh items-center justify-center overflow-hidden">
      {/* Zone 1 (neural field + cursor spotlight) is now a persistent,
          site-wide layer — see PageBackground.tsx, mounted in layout.tsx. */}

      {/* Zone 2 — agent terminal boot */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
        {/* Status line (decorative) */}
        <div
          aria-hidden
          className="flex h-5 items-center justify-center font-mono text-xs text-subtle sm:text-sm"
        >
          <span className="mr-2 text-accent">&gt;</span>
          {phase === "line1" ? (
            <TypeLine
              key="line1"
              text="initializing agent…"
              state="playing"
              onDone={() => window.setTimeout(() => setPhase("line2"), 350)}
            />
          ) : (
            <TypeLine
              key="line2"
              text="session ready"
              state={phase === "line2" ? "playing" : "done"}
              onDone={() => window.setTimeout(() => setPhase("name"), 250)}
            />
          )}
          <span className="caret ml-1 inline-block h-3.5 w-[7px] bg-accent/70" />
        </div>

        {/* Name — self-drawing signature (baked single-stroke SVG paths) */}
        <h1
          className={`mt-8 transition-opacity duration-300 ${
            nameVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <HandwrittenName
            play={booting && phase === "name"}
            onDone={() => setPhase("stream")}
          />
        </h1>

        {/* Role + tagline, streamed in */}
        <motion.p
          initial={false}
          animate={{ opacity: streamVisible ? 1 : 0, y: streamVisible ? 0 : 6 }}
          transition={{ duration: streamVisible ? 0.4 : 0 }}
          className="mt-7 font-mono text-eyebrow uppercase text-accent"
        >
          {site.role}
        </motion.p>
        <p className="mx-auto mt-5 max-w-xl text-balance text-lg text-muted md:text-xl">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={false}
              animate={{ opacity: streamVisible ? 1 : 0 }}
              transition={{
                duration: streamVisible ? 0.3 : 0,
                delay: streamVisible && booting ? 0.25 + i * 0.045 : 0,
              }}
              className="inline-block whitespace-pre"
            >
              {word + (i < words.length - 1 ? " " : "")}
            </motion.span>
          ))}
        </p>
      </div>

      {/* Scroll cue */}
      <motion.a
        href="#about"
        aria-label="Scroll to about section"
        initial={false}
        animate={{ opacity: cueVisible ? 1 : 0 }}
        transition={{ duration: cueVisible ? 0.8 : 0 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-subtle transition-colors hover:text-fg"
      >
        <span className="text-[0.6875rem] uppercase tracking-[0.2em]">Scroll</span>
        <span className="relative block h-10 w-px overflow-hidden bg-border">
          {/* Always rendered (same DOM on server + client, so hydration can't
              mismatch) — motion-reduce:hidden is a pure CSS media query, safe
              to differ between SSR and the client's resolved preference. */}
          <motion.span
            aria-hidden
            className="absolute left-0 top-0 h-4 w-px bg-accent motion-reduce:hidden"
            animate={{ y: [-16, 40] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.a>
    </section>
  );
}
