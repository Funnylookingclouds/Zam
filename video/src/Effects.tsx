import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { C } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ---------------------------------------------------------------------------
// Scene transitions (enter + exit), chosen per beat
// ---------------------------------------------------------------------------
export type TransitionKind = "glitch" | "punch" | "whip" | "wipe" | "rise";
export const TRANSITIONS: TransitionKind[] = ["punch", "glitch", "whip", "wipe", "rise"];

export const SceneTransition: React.FC<{ kind: TransitionKind; dur: number; i: number; children: React.ReactNode }> = ({ kind, dur, i, children }) => {
  const f = useCurrentFrame();
  const IN = 14;
  const OUT = 8;
  const p = interpolate(f, [0, IN], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const q = interpolate(f, [dur - OUT, dur], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  // slow camera drift over the whole beat
  const drift = f / Math.max(1, dur);
  const dir = i % 2 ? 1 : -1;
  let transform = `scale(${1 + drift * 0.05}) rotate(${dir * drift * 1}deg)`;
  let filter = "";
  let clipPath: string | undefined;
  let opacity = 1;

  if (kind === "punch") {
    transform += ` scale(${interpolate(p, [0, 1], [1.6, 1])})`;
    filter = `blur(${(1 - p) * 18}px)`;
    opacity = p;
  } else if (kind === "whip") {
    transform += ` translateX(${(1 - p) * dir * 900}px) skewX(${(1 - p) * dir * -18}deg)`;
    filter = `blur(${(1 - p) * 24}px)`;
  } else if (kind === "wipe") {
    clipPath = `circle(${p * 150}% at 50% 40%)`;
    transform += ` scale(${interpolate(p, [0, 1], [1.15, 1])})`;
  } else if (kind === "rise") {
    transform += ` translateY(${(1 - p) * 220}px) rotateX(${(1 - p) * 35}deg)`;
    opacity = p;
  }
  // exit: quick zoom-through + blur
  transform += ` scale(${1 + q * 0.35})`;
  filter += ` blur(${q * 14}px)`;
  opacity *= 1 - q;

  const content = (
    <AbsoluteFill style={{ transform, filter, clipPath, opacity, perspective: 1400 }}>{children}</AbsoluteFill>
  );
  if (kind !== "glitch" || f > IN) return content;

  // glitch: RGB-split copies + horizontal slice offsets for the first frames
  const g = 1 - f / IN;
  const slices = 7;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${-26 * g}px)`, mixBlendMode: "screen", filter: "url(#rOnly)", opacity: 0.9 }}>{children}</AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${26 * g}px)`, mixBlendMode: "screen", filter: "url(#cOnly)", opacity: 0.9 }}>{children}</AbsoluteFill>
      {[...Array(slices)].map((_, k) => {
        const top = (k / slices) * 100;
        const off = (random(`g${i}-${k}-${Math.floor(f / 2)}`) - 0.5) * 160 * g;
        return (
          <AbsoluteFill key={k} style={{ clipPath: `inset(${top}% 0 ${100 - top - 100 / slices}% 0)`, transform: `translateX(${off}px)` }}>
            {children}
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

/** SVG colour-channel filters used by the glitch transition. */
export const GlitchDefs: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <filter id="rOnly"><feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" /></filter>
    <filter id="cOnly"><feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" /></filter>
  </svg>
);

// ---------------------------------------------------------------------------
// One-shot accents placed at each beat start
// ---------------------------------------------------------------------------
export const Shockwave: React.FC<{ color?: string; y?: number }> = ({ color = C.cyan, y = 700 }) => {
  const f = useCurrentFrame();
  if (f > 40) return null;
  const p = interpolate(f, [0, 40], [0, 1], { easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {[0, 6].map((d) => {
        const pp = interpolate(f - d, [0, 34], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
        return (
          <div key={d} style={{
            position: "absolute", left: 540 - pp * 900, top: y - pp * 900, width: pp * 1800, height: pp * 1800,
            borderRadius: "50%", border: `${(1 - pp) * 14}px solid ${color}`, opacity: (1 - pp) * 0.8,
            boxShadow: `0 0 40px ${color}`,
          }} />
        );
      })}
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% ${(y / 1920) * 100}%, ${color}55, transparent 60%)`, opacity: 1 - p }} />
    </AbsoluteFill>
  );
};

export const LightSweep: React.FC = () => {
  const f = useCurrentFrame();
  if (f > 30) return null;
  const x = interpolate(f, [0, 30], [-700, 1500], { easing: Easing.inOut(Easing.quad) });
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
      <div style={{ position: "absolute", top: -400, left: x, width: 260, height: 2800, transform: "rotate(18deg)", background: `linear-gradient(90deg, transparent, ${C.text}30, ${C.cyan}40, transparent)`, filter: "blur(10px)" }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Persistent ambience
// ---------------------------------------------------------------------------
const PARTICLES = [...Array(46)].map((_, i) => ({
  x: random(`px${i}`) * 1080,
  y: random(`py${i}`) * 1920,
  z: 0.3 + random(`pz${i}`) * 0.9,
  c: [C.cyan, C.purple, C.pink, C.text][i % 4],
  ph: random(`pp${i}`) * Math.PI * 2,
}));

export const Particles: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {PARTICLES.map((p, i) => {
        const y = ((p.y - f * 1.6 * p.z) % 1920 + 1920) % 1920;
        const x = p.x + Math.sin(f / 50 + p.ph) * 30 * p.z;
        const s = 4 + p.z * 9;
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(f / 30 + p.ph));
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: "50%", background: p.c, opacity: tw * p.z * 0.7, boxShadow: `0 0 ${s * 2}px ${p.c}`, filter: p.z < 0.6 ? "blur(2px)" : undefined }} />;
      })}
    </AbsoluteFill>
  );
};

export const BEAT_SEC = 60 / 112; // music tempo (see scripts/make_audio_assets.py)

/** 0..1 envelope that spikes on each music beat. */
export const useBeatPulse = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const phase = ((f / fps) % BEAT_SEC) / BEAT_SEC;
  return Math.exp(-phase * 7);
};

export const Overlay: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* scanlines */}
      <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(0deg, #00000022 0px, #00000022 2px, transparent 2px, transparent 5px)", backgroundPosition: `0 ${f % 5}px`, opacity: 0.5 }} />
      {/* vignette */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, #000000aa 100%)" }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Kinetic typography
// ---------------------------------------------------------------------------
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&@*<>/";

/** Text that decodes from random glyphs, left to right. */
export const Scramble: React.FC<{ text: string; delay?: number; speed?: number; style?: React.CSSProperties }> = ({ text, delay = 0, speed = 1.6, style }) => {
  const f = useCurrentFrame() - delay;
  const out = text.split("").map((ch, i) => {
    if (ch === " " || ch === "-") return ch;
    const settle = i * speed + 6;
    if (f >= settle) return ch;
    if (f < i * speed * 0.4) return " ";
    return GLYPHS[Math.floor(random(`${text}-${i}-${Math.floor(f / 2)}`) * GLYPHS.length)];
  });
  return <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>{out.join("")}</span>;
};

/** RGB-split text with occasional jitter bursts. */
export const GlitchText: React.FC<{ children: string; color?: string; style?: React.CSSProperties; seed?: string }> = ({ children, color = C.text, style, seed = "gt" }) => {
  const f = useCurrentFrame();
  const burst = random(`${seed}-${Math.floor(f / 6)}`) > 0.82;
  const dx = burst ? (random(`${seed}x-${f}`) - 0.5) * 22 : 2;
  const dy = burst ? (random(`${seed}y-${f}`) - 0.5) * 8 : 0;
  return (
    <span style={{ position: "relative", display: "inline-block", whiteSpace: "nowrap", ...style }}>
      <span style={{ position: "absolute", left: dx, top: dy, color: "#FF2D75", mixBlendMode: "screen", opacity: 0.85 }}>{children}</span>
      <span style={{ position: "absolute", left: -dx, top: -dy, color: C.cyan, mixBlendMode: "screen", opacity: 0.85 }}>{children}</span>
      <span style={{ position: "relative", color }}>{children}</span>
    </span>
  );
};

/** Letters drop in one by one with a bounce. */
export const StaggerText: React.FC<{ text: string; delay?: number; style?: React.CSSProperties }> = ({ text, delay = 0, style }) => {
  const f = useCurrentFrame() - delay;
  return (
    <span style={{ display: "inline-flex", ...style }}>
      {text.split("").map((ch, i) => {
        const t = f - i * 2.2;
        const p = interpolate(t, [0, 12], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2.2)) });
        return <span key={i} style={{ display: "inline-block", transform: `translateY(${(1 - p) * -120}px) rotate(${(1 - p) * -25}deg)`, opacity: interpolate(t, [0, 4], [0, 1], clamp), whiteSpace: "pre" }}>{ch}</span>;
      })}
    </span>
  );
};
