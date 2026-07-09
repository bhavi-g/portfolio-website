"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTheme } from "next-themes";
import * as THREE from "three";

/*
  Ambient "neural field": drifting nodes, proximity edges, and pointer-triggered
  signal pulses. Three draw calls total (nodes, edges, pulses); all buffers are
  preallocated — nothing is allocated per frame. NODE_COUNT_* are the tuning
  knobs for low-end devices.
*/
const NODE_COUNT_FINE = 200;
const NODE_COUNT_COARSE = 120;
const MAX_EDGES = 700;
const PULSES = 12;
const TARGET_NEIGHBORS = 3.2; // avg edges per node, kept constant across viewports
const POINTER_RADIUS = 2.2; // world units
const POINTER_IDLE_MS = 2500;

type Palette = {
  bg: THREE.Color;
  nodeBase: THREE.Color;
  nodeBright: THREE.Color;
  edge: THREE.Color;
  pulse: THREE.Color;
  edgeOpacity: number;
  nodeOpacity: number;
};

function makePalette(isDark: boolean): Palette {
  return isDark
    ? {
        bg: new THREE.Color("#0a0a0a"),
        nodeBase: new THREE.Color("#4b5a75"),
        nodeBright: new THREE.Color("#9cc2ff"),
        edge: new THREE.Color("#3b82f6"),
        pulse: new THREE.Color("#9cc2ff"),
        edgeOpacity: 0.55,
        nodeOpacity: 0.85,
      }
    : {
        // Light theme needs notably darker "ink" than the dark theme needs
        // light glow — equal hex lightness reads as invisible on white.
        bg: new THREE.Color("#fafafa"),
        nodeBase: new THREE.Color("#54627a"),
        nodeBright: new THREE.Color("#2563eb"),
        edge: new THREE.Color("#5b6b85"),
        pulse: new THREE.Color("#2563eb"),
        edgeOpacity: 0.6,
        nodeOpacity: 0.9,
      };
}

function makeDotTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.4, "rgba(255,255,255,0.7)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

type Pulse = { active: boolean; a: number; b: number; t: number; hops: number };

function Field({
  count,
  animated,
  isDark,
}: {
  count: number;
  animated: boolean;
  isDark: boolean;
}) {
  const { gl, invalidate } = useThree();
  const palette = useMemo(() => makePalette(isDark), [isDark]);
  const dotTexture = useMemo(() => makeDotTexture(), []);

  const initialViewport = useThree((s) => s.viewport);
  const sim = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 2);
    const glow = new Float32Array(count);
    const w = initialViewport.width + 2;
    const h = initialViewport.height + 2;
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * w;
      pos[i * 3 + 1] = (Math.random() - 0.5) * h;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2.5;
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.04 + Math.random() * 0.08;
      vel[i * 2] = Math.cos(angle) * speed;
      vel[i * 2 + 1] = Math.sin(angle) * speed;
    }
    return { pos, vel, glow };
    // Initialized once — resize is handled by wrap bounds in the frame loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  const nodeColors = useMemo(() => new Float32Array(count * 3), [count]);
  const edgePositions = useMemo(() => new Float32Array(MAX_EDGES * 2 * 3), []);
  const edgeColors = useMemo(() => new Float32Array(MAX_EDGES * 2 * 3), []);
  const edgePairs = useMemo(() => new Int16Array(MAX_EDGES * 2), []);
  const pulsePositions = useMemo(() => {
    const arr = new Float32Array(PULSES * 3);
    for (let k = 0; k < PULSES; k++) arr[k * 3 + 2] = 999; // park offscreen
    return arr;
  }, []);
  const pulseColors = useMemo(() => new Float32Array(PULSES * 3), []);
  const pulses = useMemo<Pulse[]>(
    () => Array.from({ length: PULSES }, () => ({ active: false, a: 0, b: 0, t: 0, hops: 0 })),
    []
  );

  const nodeGeo = useRef<THREE.BufferGeometry>(null);
  const edgeGeo = useRef<THREE.BufferGeometry>(null);
  const pulseGeo = useRef<THREE.BufferGeometry>(null);
  const spawnTimer = useRef(0);
  const pointer = useRef({ x: 0, y: 0, lastMove: -1e9 });

  useEffect(() => {
    if (!animated) return;
    const el = gl.domElement;
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      pointer.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      pointer.current.lastMove = performance.now();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [animated, gl]);

  // Static mode (reduced motion): render exactly one frame; re-render on theme change.
  useEffect(() => {
    if (!animated) invalidate();
  }, [animated, isDark, invalidate]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const vw = state.viewport.width;
    const vh = state.viewport.height;
    const halfW = vw / 2 + 1;
    const halfH = vh / 2 + 1;
    const { pos, vel, glow } = sim;

    const pointerFresh = animated && performance.now() - pointer.current.lastMove < POINTER_IDLE_MS;
    const px = (pointer.current.x * vw) / 2;
    const py = (pointer.current.y * vh) / 2;
    const influenceR2 = POINTER_RADIUS * POINTER_RADIUS;

    const area = (vw + 2) * (vh + 2);
    const connectR2 = (area * TARGET_NEIGHBORS) / (Math.PI * count);

    const { bg, nodeBase, nodeBright, edge, pulse: pulseColor } = palette;

    // 1) Drift, wrap, pointer glow, node colors
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      if (animated) {
        pos[i3] += vel[i * 2] * dt;
        pos[i3 + 1] += vel[i * 2 + 1] * dt;
        if (pos[i3] > halfW) pos[i3] = -halfW;
        else if (pos[i3] < -halfW) pos[i3] = halfW;
        if (pos[i3 + 1] > halfH) pos[i3 + 1] = -halfH;
        else if (pos[i3 + 1] < -halfH) pos[i3 + 1] = halfH;
      }

      let target = 0;
      if (pointerFresh) {
        const dx = pos[i3] - px;
        const dy = pos[i3 + 1] - py;
        const d2 = dx * dx + dy * dy;
        if (d2 < influenceR2) target = 1 - Math.sqrt(d2 / influenceR2);
      }
      glow[i] += (target - glow[i]) * Math.min(1, dt * 4);

      const g = glow[i];
      nodeColors[i3] = nodeBase.r + (nodeBright.r - nodeBase.r) * g;
      nodeColors[i3 + 1] = nodeBase.g + (nodeBright.g - nodeBase.g) * g;
      nodeColors[i3 + 2] = nodeBase.b + (nodeBright.b - nodeBase.b) * g;
    }

    // 2) Proximity edges (O(n²)/2 distance checks — ~20K for 200 nodes)
    let e = 0;
    for (let i = 0; i < count && e < MAX_EDGES; i++) {
      const i3 = i * 3;
      const ix = pos[i3];
      const iy = pos[i3 + 1];
      const iz = pos[i3 + 2];
      for (let j = i + 1; j < count && e < MAX_EDGES; j++) {
        const j3 = j * 3;
        const dx = ix - pos[j3];
        const dy = iy - pos[j3 + 1];
        const d2 = dx * dx + dy * dy;
        if (d2 > connectR2) continue;

        // Strength: fade with distance, boosted by endpoint glow.
        // "Alpha" is faked by lerping the color toward the page background.
        const s = (1 - d2 / connectR2) * (0.35 + Math.max(glow[i], glow[j]) * 0.65);
        const r = bg.r + (edge.r - bg.r) * s;
        const g = bg.g + (edge.g - bg.g) * s;
        const b = bg.b + (edge.b - bg.b) * s;

        const e6 = e * 6;
        edgePositions[e6] = ix;
        edgePositions[e6 + 1] = iy;
        edgePositions[e6 + 2] = iz;
        edgePositions[e6 + 3] = pos[j3];
        edgePositions[e6 + 4] = pos[j3 + 1];
        edgePositions[e6 + 5] = pos[j3 + 2];
        edgeColors[e6] = r;
        edgeColors[e6 + 1] = g;
        edgeColors[e6 + 2] = b;
        edgeColors[e6 + 3] = r;
        edgeColors[e6 + 4] = g;
        edgeColors[e6 + 5] = b;
        edgePairs[e * 2] = i;
        edgePairs[e * 2 + 1] = j;
        e++;
      }
    }

    // 3) Signal pulses: spawn near the pointer, travel 1–2 edge hops, fade out
    if (animated) {
      spawnTimer.current -= dt;
      if (pointerFresh && spawnTimer.current <= 0 && e > 0) {
        spawnTimer.current = 0.35;
        for (let attempt = 0; attempt < 8; attempt++) {
          const k = (Math.random() * e) | 0;
          const a = edgePairs[k * 2];
          const b = edgePairs[k * 2 + 1];
          if (Math.max(glow[a], glow[b]) > 0.35) {
            const p = pulses.find((q) => !q.active);
            if (p) {
              if (glow[a] >= glow[b]) {
                p.a = a;
                p.b = b;
              } else {
                p.a = b;
                p.b = a;
              }
              p.t = 0;
              p.hops = 1 + ((Math.random() * 2) | 0);
              p.active = true;
            }
            break;
          }
        }
      }

      for (let k = 0; k < PULSES; k++) {
        const p = pulses[k];
        const k3 = k * 3;
        if (!p.active) {
          pulsePositions[k3 + 2] = 999;
          continue;
        }
        p.t += dt / 0.55;
        if (p.t >= 1) {
          let next = -1;
          if (p.hops > 0) {
            for (let m = 0; m < e; m++) {
              const a2 = edgePairs[m * 2];
              const b2 = edgePairs[m * 2 + 1];
              if (a2 === p.b && b2 !== p.a) {
                next = b2;
                break;
              }
              if (b2 === p.b && a2 !== p.a) {
                next = a2;
                break;
              }
            }
          }
          if (next >= 0) {
            p.a = p.b;
            p.b = next;
            p.t = 0;
            p.hops--;
          } else {
            p.active = false;
            pulsePositions[k3 + 2] = 999;
            continue;
          }
        }
        const t = p.t;
        const a3 = p.a * 3;
        const b3 = p.b * 3;
        pulsePositions[k3] = pos[a3] + (pos[b3] - pos[a3]) * t;
        pulsePositions[k3 + 1] = pos[a3 + 1] + (pos[b3 + 1] - pos[a3 + 1]) * t;
        pulsePositions[k3 + 2] = pos[a3 + 2] + (pos[b3 + 2] - pos[a3 + 2]) * t;
        const fade = Math.sin(Math.PI * t);
        pulseColors[k3] = bg.r + (pulseColor.r - bg.r) * fade;
        pulseColors[k3 + 1] = bg.g + (pulseColor.g - bg.g) * fade;
        pulseColors[k3 + 2] = bg.b + (pulseColor.b - bg.b) * fade;
      }
    }

    if (nodeGeo.current) {
      (nodeGeo.current.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (nodeGeo.current.attributes.color as THREE.BufferAttribute).needsUpdate = true;
    }
    if (edgeGeo.current) {
      edgeGeo.current.setDrawRange(0, e * 2);
      (edgeGeo.current.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (edgeGeo.current.attributes.color as THREE.BufferAttribute).needsUpdate = true;
    }
    if (pulseGeo.current) {
      (pulseGeo.current.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (pulseGeo.current.attributes.color as THREE.BufferAttribute).needsUpdate = true;
    }
  });

  return (
    <>
      <points frustumCulled={false}>
        <bufferGeometry ref={nodeGeo}>
          <bufferAttribute attach="attributes-position" args={[sim.pos, 3]} />
          <bufferAttribute attach="attributes-color" args={[nodeColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          map={dotTexture}
          size={0.08}
          sizeAttenuation
          transparent
          opacity={palette.nodeOpacity}
          depthWrite={false}
        />
      </points>
      <lineSegments frustumCulled={false}>
        <bufferGeometry ref={edgeGeo}>
          <bufferAttribute attach="attributes-position" args={[edgePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[edgeColors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={palette.edgeOpacity}
          depthWrite={false}
        />
      </lineSegments>
      <points frustumCulled={false}>
        <bufferGeometry ref={pulseGeo}>
          <bufferAttribute attach="attributes-position" args={[pulsePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[pulseColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          map={dotTexture}
          size={0.16}
          sizeAttenuation
          transparent
          opacity={0.9}
          depthWrite={false}
        />
      </points>
    </>
  );
}

export default function NeuralField({ animated }: { animated: boolean }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";
  const [tabVisible, setTabVisible] = useState(true);
  // Sparser field on touch devices / small screens, decided once at mount
  const [count] = useState(() =>
    window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768
      ? NODE_COUNT_COARSE
      : NODE_COUNT_FINE
  );

  // This is now a persistent, fixed full-viewport background — it's always
  // spatially "in view", so the only thing worth pausing for is a hidden tab.
  useEffect(() => {
    const onVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <div className="h-full w-full" aria-hidden>
      <Canvas
        frameloop={!animated ? "demand" : tabVisible ? "always" : "never"}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        style={{ background: "transparent" }}
      >
        <Field count={count} animated={animated} isDark={isDark} />
      </Canvas>
    </div>
  );
}
