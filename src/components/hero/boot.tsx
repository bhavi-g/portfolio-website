"use client";

import { useEffect, useRef, useState } from "react";

export type TextState = "hidden" | "playing" | "done";

/** Types text character by character. "hidden" renders nothing, "done" renders all. */
export function TypeLine({
  text,
  state,
  onDone,
  speed = 28,
}: {
  text: string;
  state: TextState;
  onDone?: () => void;
  speed?: number;
}) {
  const [n, setN] = useState(state === "done" ? text.length : 0);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (state === "done") {
      setN(text.length);
      return;
    }
    if (state === "hidden") {
      setN(0);
      return;
    }
    setN(0);
    let i = 0;
    const id = window.setInterval(() => {
      i++;
      setN(i);
      if (i >= text.length) {
        window.clearInterval(id);
        onDoneRef.current?.();
      }
    }, speed);
    return () => window.clearInterval(id);
  }, [state, text, speed]);

  return <span>{text.slice(0, n)}</span>;
}
