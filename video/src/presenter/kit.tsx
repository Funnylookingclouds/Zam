/** Paper-cutout board kit: torn paper cards, ink icons, hand-drawn charts. */
import React from "react";
import "@fontsource/caveat/700.css";
import { interpolate, random, useCurrentFrame, Easing } from "remotion";
import { FONT } from "../theme";

export const P = { ink: "#2b2622", teal: "#1d6b73", mustard: "#c98a1c", red: "#b4483b", paper: "#f3ead6", paper2: "#fbf6ea", muted: "#7a6f62", green: "#4f7d3a" };
export const HAND = "Caveat, cursive";
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
/** Stop-motion time: hold each drawing for 5 frames (12 fps feel). */
export const onTwos = (f: number) => Math.floor(f / 5) * 5;
export const useTwos = () => onTwos(useCurrentFrame());

export const tornPath = (w: number, h: number, seed: string, step = 16, amp = 7) => {
  const pts: [number, number][] = [];
  const j = (k: string) => random(`${seed}${k}`) * amp;
  for (let x = 0; x <= w; x += step) pts.push([x, j(`t${x}`)]);
  for (let y = 0; y <= h; y += step) pts.push([w - j(`r${y}`), y]);
  for (let x = w; x >= 0; x -= step) pts.push([x, h - j(`b${x}`)]);
  for (let y = h; y >= 0; y -= step) pts.push([j(`l${y}`), y]);
  return "M" + pts.map((p) => p.join(" ")).join(" L") + " Z";
};

export const PaperCard: React.FC<{ w?: number; h?: number; seed: string; rot?: number; tag?: string; children: React.ReactNode }> = ({ w = 960, h = 760, seed, rot = 0, tag, children }) => (
  <div style={{ position: "relative", width: w, height: h, transform: `rotate(${rot}deg)`, filter: "drop-shadow(0 18px 28px #0007)" }}>
    <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <filter id={`grain${seed}`}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={7} /><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.38  0 0 0 0 0.28  0 0 0 0.10 0" /><feComposite in2="SourceGraphic" operator="in" /></filter>
      </defs>
      <path d={tornPath(w, h, seed + "o", 18, 9)} fill={P.paper2} />
      <path d={tornPath(w - 24, h - 24, seed + "i", 16, 6)} transform="translate(12 12)" fill={P.paper} />
      <path d={tornPath(w - 24, h - 24, seed + "i", 16, 6)} transform="translate(12 12)" fill="#fff" filter={`url(#grain${seed})`} />
    </svg>
    {tag && <div style={{ position: "absolute", right: 10, top: -24, padding: "4px 12px", background: P.red, color: "#fff", fontFamily: FONT, fontSize: 20, fontWeight: 900, letterSpacing: 2 }}>{tag}</div>}
    <div style={{ position: "absolute", inset: 34, fontFamily: FONT, color: P.ink }}>{children}</div>
  </div>
);

/** Card slapped onto the table – stepped motion with overshoot. */
export const Slap: React.FC<{ from?: "left" | "right" | "top"; children: React.ReactNode }> = ({ from = "right", children }) => {
  const f = useTwos();
  const p = interpolate(f, [0, 15], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
  const dx = from === "left" ? -1200 : from === "right" ? 1200 : 0;
  const dy = from === "top" ? -1400 : 0;
  return <div style={{ transform: `translate(${dx * (1 - p)}px, ${dy * (1 - p)}px) rotate(${(1 - p) * (from === "left" ? -14 : 12)}deg)` }}>{children}</div>;
};

export const Title: React.FC<{ children: React.ReactNode; sub?: string }> = ({ children, sub }) => (
  <div>
    <div style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.05 }}>{children}</div>
    {sub && <div style={{ fontFamily: HAND, fontSize: 42, color: P.mustard, marginTop: 2 }}>{sub}</div>}
  </div>
);
export const Source: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: 6, right: 6, bottom: 0, fontSize: 21, color: P.muted }}>Source: {children}</div>
);
export const Hand: React.FC<{ children: React.ReactNode; color?: string; size?: number; rot?: number; show?: boolean; style?: React.CSSProperties }> = ({ children, color = P.mustard, size = 44, rot = 0, show = true, style }) => (
  <div style={{ fontFamily: HAND, fontSize: size, color, transform: `rotate(${rot}deg) scale(${show ? 1 : 0})`, transformOrigin: "left center", ...style }}>{children}</div>
);
/** Rubber stamp that thumps in. */
export const Stamp: React.FC<{ children: React.ReactNode; color?: string; at?: number; rot?: number; size?: number }> = ({ children, color = P.red, at = 0, rot = -8, size = 64 }) => {
  const f = useTwos() - at;
  const s = f < 0 ? 0 : interpolate(f, [0, 5, 10], [2.2, 0.9, 1], clamp);
  return <div style={{ display: "inline-block", padding: "10px 26px", border: `7px solid ${color}`, borderRadius: 14, color, fontSize: size, fontWeight: 900, letterSpacing: 3, transform: `rotate(${rot}deg) scale(${s})`, opacity: f < 0 ? 0 : 0.92 }}>{children}</div>;
};
/** Ink line that draws itself. */
export const InkLine: React.FC<{ d: string; w: number; h: number; color?: string; from?: number; to?: number; width?: number; len?: number }> = ({ d, w, h, color = P.mustard, from = 0, to = 30, width = 5, len = 1600 }) => {
  const f = useTwos();
  return <svg width={w} height={h}><path d={d} stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" strokeDasharray={len} strokeDashoffset={interpolate(f, [from, to], [len, 0], clamp)} /></svg>;
};

// ---------- ink icons ----------
export const InkDoctor: React.FC<{ s?: number; fade?: number }> = ({ s = 90, fade = 0 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" style={{ opacity: 1 - fade * 0.6 }}>
    <circle cx={12} cy={7} r={4} fill="none" stroke={P.ink} strokeWidth={1.4} />
    <path d="M4 22 C4 15.5 8 13.2 12 13.2 C16 13.2 20 15.5 20 22" fill="none" stroke={P.ink} strokeWidth={1.4} />
    <path d="M9 14.2 V18 A2 2 0 0 0 13 18" stroke={P.teal} strokeWidth={1.3} fill="none" /><circle cx={13} cy={18.2} r={0.9} fill={P.teal} />
  </svg>
);
export const InkChip: React.FC<{ s?: number }> = ({ s = 170 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24">
    {[6, 10, 14, 18].map((p) => (
      <g key={p} stroke={P.teal} strokeWidth={1.1} strokeLinecap="round">
        <line x1={p} y1={2} x2={p} y2={4.6} /><line x1={p} y1={19.4} x2={p} y2={22} /><line x1={2} y1={p} x2={4.6} y2={p} /><line x1={19.4} y1={p} x2={22} y2={p} />
      </g>
    ))}
    <rect x={4.6} y={4.6} width={14.8} height={14.8} rx={2.5} fill={`${P.teal}22`} stroke={P.teal} strokeWidth={1.3} />
    <text x={12} y={14.4} textAnchor="middle" fontSize={6.5} fontWeight={900} fill={P.teal} fontFamily={FONT}>AI</text>
  </svg>
);
export const InkHeart: React.FC<{ s?: number; beat?: number }> = ({ s = 220, beat = 1 }) => (
  <svg width={s} height={s} viewBox="0 0 100 100" style={{ transform: `scale(${beat})` }}>
    <path d="M50 88 C20 66 5 50 5 32 C5 18 16 8 29 8 C38 8 45 13 50 21 C55 13 62 8 71 8 C84 8 95 18 95 32 C95 50 80 66 50 88Z" fill={`${P.red}33`} stroke={P.red} strokeWidth={4} />
  </svg>
);
export const InkLaptop: React.FC<{ s?: number }> = ({ s = 380 }) => (
  <svg width={s} height={s * 0.68} viewBox="0 0 100 68">
    <rect x={14} y={4} width={72} height={46} rx={4} fill="#ffffffaa" stroke={P.ink} strokeWidth={2.2} />
    <path d="M4 56 H96 L90 64 H10 Z" fill={`${P.ink}22`} stroke={P.ink} strokeWidth={2.2} strokeLinejoin="round" />
    <rect x={22} y={14} width={34} height={7} rx={3.5} fill={`${P.teal}66`} /><rect x={38} y={26} width={40} height={7} rx={3.5} fill={`${P.mustard}88`} />
  </svg>
);
export const InkLock: React.FC<{ s?: number }> = ({ s = 200 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24">
    <path d="M7.5 11 V8 a4.5 4.5 0 0 1 9 0 V11" stroke={P.ink} strokeWidth={1.6} fill="none" />
    <rect x={5} y={11} width={14} height={10} rx={2} fill={`${P.green}55`} stroke={P.ink} strokeWidth={1.6} />
    <circle cx={12} cy={15.6} r={1.5} fill={P.ink} />
  </svg>
);
export const ecgPath = (w: number, h: number, beats: number) => {
  let d = `M0 ${h / 2}`;
  const bw = w / beats;
  for (let i = 0; i < beats; i++) {
    const x = i * bw;
    d += ` L${x + bw * 0.3} ${h / 2} L${x + bw * 0.38} ${h * 0.4} L${x + bw * 0.44} ${h / 2} L${x + bw * 0.5} ${h * 0.06} L${x + bw * 0.56} ${h * 0.9} L${x + bw * 0.62} ${h / 2} L${x + bw * 0.75} ${h * 0.42} L${x + bw * 0.85} ${h / 2} L${x + bw} ${h / 2}`;
  }
  return d;
};

/** Hand-drawn gauge 0–100. */
export const Gauge: React.FC<{ value: number; from?: number; to?: number }> = ({ value, from = 6, to = 50 }) => {
  const g = useTwos();
  const v = interpolate(g, [from, to], [0, value], { ...clamp, easing: Easing.out(Easing.cubic) });
  const a = Math.PI * (1 - v / 100), cx = 230, cy = 230, R = 190;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <svg width={470} height={290} style={{ flexShrink: 0 }}>
        <path d={`M${cx - R} ${cy} A${R} ${R} 0 0 1 ${cx + R} ${cy}`} stroke={P.ink} strokeWidth={6} fill="none" />
        {[...Array(11)].map((_, i) => { const t = Math.PI * (1 - i / 10); return <line key={i} x1={cx + Math.cos(t) * (R - 6)} y1={cy - Math.sin(t) * (R - 6)} x2={cx + Math.cos(t) * (R - 30)} y2={cy - Math.sin(t) * (R - 30)} stroke={P.ink} strokeWidth={4} />; })}
        <line x1={cx} y1={cy} x2={cx + Math.cos(a) * (R - 46)} y2={cy - Math.sin(a) * (R - 46)} stroke={P.ink} strokeWidth={9} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={15} fill={P.ink} />
      </svg>
      <div style={{ fontSize: 130, fontWeight: 900, color: P.mustard, lineHeight: 1 }}>{Math.round(v)}%</div>
    </div>
  );
};

/** Hand-drawn bar pair (values in %). */
export const BarPair: React.FC<{ a: number; b: number; la: string; lb: string; H?: number; ta?: string; tb?: string }> = ({ a, b, la, lb, H = 380, ta, tb }) => {
  const g = useTwos();
  const pa = interpolate(g, [4, 30], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const pb = interpolate(g, [24, 52], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const Bar: React.FC<{ v: number; p: number; c: string; l: string; tx?: string }> = ({ v, p, c, l, tx }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 260 }}>
      <div style={{ fontSize: 84, fontWeight: 900, color: c, opacity: tx ? p : 1 }}>{tx ?? `${Math.round(v * p)}%`}</div>
      <div style={{ height: H, display: "flex", alignItems: "flex-end" }}>
        <div style={{ width: 170, height: H * (v / 100) * p, border: `4px solid ${P.ink}`, borderBottom: "none", borderRadius: "10px 10px 0 0", background: `repeating-linear-gradient(-45deg, ${c}99 0 10px, ${c}55 10px 20px)` }} />
      </div>
      <div style={{ width: 230, height: 5, background: P.ink }} />
      <div style={{ fontFamily: HAND, fontSize: 44, marginTop: 6 }}>{l}</div>
    </div>
  );
  return <div style={{ display: "flex", gap: 60, justifyContent: "center" }}><Bar v={a} p={pa} c={P.muted} l={la} tx={ta} /><Bar v={b} p={pb} c={P.teal} l={lb} tx={tb} /></div>;
};
