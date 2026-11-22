/** "Banana mode" graphics pack – loud, comic, broadcast-style extras in the paper look. Reusable in any episode. */
import React from "react";
import { interpolate, random, useCurrentFrame, Easing } from "remotion";
import { FONT } from "../theme";
import { P, HAND, clamp, onTwos, useTwos } from "./kit";

// ---------------------------------------------------------------------------
// Comic onomatopoeia burst ("KA-CHUNK!", "WHAT?!") – paper starburst + speed lines
// ---------------------------------------------------------------------------
const starPath = (r1: number, r2: number, n: number, seed: string) => {
  let d = "";
  for (let i = 0; i < n * 2; i++) {
    const a = (i / (n * 2)) * Math.PI * 2;
    const r = (i % 2 ? r2 : r1) * (0.9 + random(`${seed}${i}`) * 0.2);
    d += `${i ? "L" : "M"}${Math.cos(a) * r} ${Math.sin(a) * r} `;
  }
  return d + "Z";
};
export const ComicBurst: React.FC<{ text: string; at: number; x: number; y: number; color?: string; size?: number; dur?: number; rot?: number }> = ({ text, at, x, y, color = P.mustard, size = 1, dur = 50, rot = -8 }) => {
  const f = useTwos() - at;
  if (f < 0 || f > dur) return null;
  const s = interpolate(f, [0, 5, 10], [0.2, 1.25, 1], clamp) * size;
  const o = interpolate(f, [dur - 10, dur], [1, 0], clamp);
  const wob = Math.sin(f / 2) * 2;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${s}) rotate(${rot + wob}deg)`, opacity: o, pointerEvents: "none", zIndex: 5 }}>
      <svg width={520} height={340} viewBox="-260 -170 520 340" style={{ position: "absolute", left: -260, top: -170 }}>
        {[...Array(14)].map((_, i) => { const a = (i / 14) * Math.PI * 2; return <line key={i} x1={Math.cos(a) * 190} y1={Math.sin(a) * 125} x2={Math.cos(a) * 250} y2={Math.sin(a) * 165} stroke={P.ink} strokeWidth={6} strokeLinecap="round" />; })}
        <path d={starPath(175, 115, 13, text)} fill={P.paper2} stroke={P.ink} strokeWidth={7} strokeLinejoin="round" transform="scale(1 0.68)" />
        <path d={starPath(150, 100, 13, text + "b")} fill={color} stroke={P.ink} strokeWidth={4} strokeLinejoin="round" transform="scale(1 0.62)" />
      </svg>
      <div style={{ position: "relative", fontFamily: FONT, fontSize: 70, fontWeight: 900, color: "#fff", WebkitTextStroke: `6px ${P.ink}`, paintOrder: "stroke fill", whiteSpace: "nowrap", transform: "translate(-50%,-50%)", letterSpacing: 1, fontStyle: "italic" }}>{text}</div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Split-flap scoreboard (broadcast lower bar)
// ---------------------------------------------------------------------------
const Flap: React.FC<{ v: string; flipAt?: number }> = ({ v, flipAt = -1 }) => {
  const f = useCurrentFrame();
  const k = flipAt >= 0 ? interpolate(f, [flipAt, flipAt + 8], [0, 1], clamp) : 1;
  const ang = k < 1 ? Math.sin(k * Math.PI) * 80 : 0;
  return (
    <div style={{ width: 74, height: 96, background: "#1d1a17", color: "#f7d84a", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 70, position: "relative", transform: `perspective(400px) rotateX(${ang}deg)`, boxShadow: "inset 0 -48px 0 #2a2622" }}>
      <span style={{ position: "relative" }}>{v}</span>
      <div style={{ position: "absolute", left: 0, right: 0, top: 47, height: 3, background: "#000" }} />
    </div>
  );
};
export const Scoreboard: React.FC<{ left: string; right: string; a: number; b: number; label: string; prevA?: number; prevB?: number; flipAt?: number }> = ({ left, right, a, b, label, prevA, prevB, flipAt = 20 }) => {
  const f = useCurrentFrame();
  const flipped = f >= flipAt + 4;
  const A = prevA !== undefined && !flipped ? prevA : a;
  const B = prevB !== undefined && !flipped ? prevB : b;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 18, padding: "16px 22px", background: P.ink, borderRadius: 18, border: `5px solid ${P.mustard}`, boxShadow: "0 10px 0 #0003" }}>
      <div style={{ color: "#fff", fontSize: 38, fontWeight: 900, fontFamily: FONT, minWidth: 170, textAlign: "right" }}>{left}</div>
      <Flap v={String(A)} flipAt={prevA !== undefined && prevA !== a ? flipAt : -1} />
      <div style={{ color: P.mustard, fontSize: 50, fontWeight: 900 }}>–</div>
      <Flap v={String(B)} flipAt={prevB !== undefined && prevB !== b ? flipAt : -1} />
      <div style={{ color: "#fff", fontSize: 38, fontWeight: 900, fontFamily: FONT, minWidth: 120 }}>{right}</div>
      <div style={{ marginLeft: 8, padding: "6px 12px", background: P.red, color: "#fff", fontWeight: 900, fontSize: 24, borderRadius: 8, fontFamily: FONT }}>{label}</div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// "VS" fight card – two torn halves slam together, lightning crack
// ---------------------------------------------------------------------------
export const VersusCard: React.FC<{ left: React.ReactNode; right: React.ReactNode; leftLabel: string; rightLabel: string; w?: number; h?: number }> = ({ left, right, leftLabel, rightLabel, w = 880, h = 470 }) => {
  const f = useTwos();
  const p = interpolate(f, [0, 12], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.8)) });
  const flash = interpolate(f, [12, 14, 24], [0, 1, 0], clamp);
  const half = (side: -1 | 1, c: string, node: React.ReactNode, label: string) => (
    <div style={{ position: "absolute", top: 0, [side < 0 ? "left" : "right"]: 0, width: w / 2 + 20, height: h, transform: `translateX(${side * (1 - p) * 700}px) rotate(${side * (1 - p) * 10}deg)`, clipPath: side < 0 ? "polygon(0 0, 100% 0, 88% 50%, 100% 100%, 0 100%)" : "polygon(12% 0, 100% 0, 100% 100%, 12% 100%, 0 50%)", background: `${c}33`, border: `5px solid ${P.ink}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" } as React.CSSProperties}>
      {node}
      <div style={{ fontFamily: FONT, fontSize: 40, fontWeight: 900, marginTop: 10 }}>{label}</div>
    </div>
  );
  return (
    <div style={{ position: "relative", width: w, height: h }}>
      {half(-1, P.teal, left, leftLabel)}
      {half(1, P.red, right, rightLabel)}
      <svg width={120} height={h} style={{ position: "absolute", left: w / 2 - 60, top: 0, opacity: p >= 0.98 ? 1 : 0 }}>
        <path d={`M70 0 L40 ${h * 0.35} L75 ${h * 0.45} L35 ${h} `} stroke={P.mustard} strokeWidth={14} fill="none" strokeLinejoin="round" />
        <path d={`M70 0 L40 ${h * 0.35} L75 ${h * 0.45} L35 ${h} `} stroke={P.ink} strokeWidth={4} fill="none" strokeLinejoin="round" />
      </svg>
      <div style={{ position: "absolute", left: w / 2 - 90, top: h / 2 - 80, width: 180, height: 160, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HAND, fontSize: 150, fontWeight: 700, color: P.red, WebkitTextStroke: `4px ${P.ink}`, transform: `scale(${p >= 0.98 ? 1 : 0}) rotate(-8deg)` }}>VS</div>
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: flash, pointerEvents: "none" }} />
    </div>
  );
};

// ---------------------------------------------------------------------------
// Odds dial – a wheel of many slots spins and stops on the single lit one
// ---------------------------------------------------------------------------
export const OddsDial: React.FC<{ label?: string; r?: number }> = ({ label = "1 / 10,000", r = 200 }) => {
  const f = useCurrentFrame();
  const spin = interpolate(f, [0, 110], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const rot = spin * 1440 + 180;
  const done = spin > 0.985;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
      <div style={{ position: "relative", width: r * 2, height: r * 2 }}>
        <svg width={r * 2} height={r * 2} style={{ transform: `rotate(${onTwos(rot * 10) / 10}deg)` }}>
          <circle cx={r} cy={r} r={r - 6} fill={P.paper2} stroke={P.ink} strokeWidth={6} />
          {[...Array(120)].map((_, i) => { const a = (i / 120) * Math.PI * 2; const lit = i === 0; return <line key={i} x1={r + Math.cos(a) * (r - 14)} y1={r + Math.sin(a) * (r - 14)} x2={r + Math.cos(a) * (r - (lit ? 70 : 34))} y2={r + Math.sin(a) * (r - (lit ? 70 : 34))} stroke={lit ? P.red : P.ink} strokeWidth={lit ? 12 : 2} />; })}
          <circle cx={r} cy={r} r={24} fill={P.ink} />
        </svg>
        <svg width={60} height={70} style={{ position: "absolute", left: r * 2 - 30, top: r - 35 }}><path d="M0 35 L60 5 L60 65 Z" fill={P.mustard} stroke={P.ink} strokeWidth={4} strokeLinejoin="round" /></svg>
        {done && <div style={{ position: "absolute", inset: -10, borderRadius: "50%", border: `10px solid ${P.red}`, opacity: 0.6 + 0.4 * Math.sin(f / 4) }} />}
      </div>
      <div style={{ fontFamily: FONT, fontSize: 84, fontWeight: 900, color: P.red, transform: `scale(${done ? 1 : 0.4})`, opacity: done ? 1 : 0.2, whiteSpace: "nowrap" }}>{label}</div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Instant-replay freeze – tape + rewind scribbles + zoom ring on a point
// ---------------------------------------------------------------------------
export const ReplayOverlay: React.FC<{ cx: number; cy: number; at?: number }> = ({ cx, cy, at = 0 }) => {
  const f = useTwos() - at;
  if (f < 0) return null;
  const ring = interpolate(f, [0, 14], [300, 70], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: -20, top: 20, padding: "8px 40px", background: P.mustard, border: `4px solid ${P.ink}`, transform: "rotate(-6deg)", fontFamily: FONT, fontSize: 40, fontWeight: 900, letterSpacing: 6 }}>◀◀ REPLAY</div>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <circle cx={cx} cy={cy} r={ring} fill="none" stroke={P.red} strokeWidth={8} strokeDasharray="18 10" />
        {[0, 1, 2].map((i) => <path key={i} d={`M${cx + 90} ${cy - 60 + i * 26} q 30 -14 60 0 t 60 0`} stroke={P.ink} strokeWidth={4} fill="none" opacity={(f / 5 + i) % 3 < 2 ? 0.8 : 0.2} />)}
      </svg>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Crowd counter – rows of tiny paper people pop up while the number climbs
// ---------------------------------------------------------------------------
export const Crowd: React.FC<{ to: number; unit?: string; rows?: number; cols?: number }> = ({ to, unit = "M", rows = 5, cols = 16 }) => {
  const g = useTwos();
  const n = Math.round(interpolate(g, [4, 70], [0, to], clamp));
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontFamily: FONT, fontSize: 130, fontWeight: 900, lineHeight: 1, color: P.teal }}>{n}{unit}+</div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 48px)`, gap: 4, justifyContent: "center", marginTop: 16 }}>
        {[...Array(rows * cols)].map((_, i) => {
          const row = Math.floor(i / cols);
          const on = g > 6 + row * 10 + (i % cols) * 0.6;
          const c = [P.teal, P.red, P.mustard, P.green, P.ink][Math.floor(random(`cr${i}`) * 5)];
          return (
            <svg key={i} width={48} height={48} viewBox="0 0 24 24" style={{ transform: `translateY(${on ? Math.sin((g + i * 7) / 6) * 2 : 30}px)`, opacity: on ? 1 : 0 }}>
              <circle cx={12} cy={7} r={4.5} fill={`${c}aa`} stroke={P.ink} strokeWidth={1.2} /><path d="M4 23 C4 15 8 13 12 13 C16 13 20 15 20 23 Z" fill={`${c}66`} stroke={P.ink} strokeWidth={1.2} />
            </svg>
          );
        })}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Go board with stones that slap down (squash + ink ring + board shake)
// ---------------------------------------------------------------------------
export type Stone = { x: number; y: number; c: "b" | "w"; at: number; hl?: boolean };
export const GoBoard: React.FC<{ stones: Stone[]; size?: number; n?: number }> = ({ stones, size = 520, n = 9 }) => {
  const f = useTwos();
  const cell = size / (n + 1);
  const lastHit = stones.filter((s) => f >= s.at).map((s) => f - s.at).sort((a, b) => a - b)[0] ?? 99;
  const shake = lastHit < 8 ? Math.sin(lastHit * 3) * (8 - lastHit) * 1.2 : 0;
  return (
    <div style={{ width: size, height: size, background: "#d8a85a", border: `6px solid ${P.ink}`, borderRadius: 10, position: "relative", transform: `translate(${shake}px, ${-Math.abs(shake) / 2}px)`, boxShadow: "8px 10px 0 #0003" }}>
      <svg width={size} height={size} style={{ position: "absolute", inset: 0 }}>
        {[...Array(n)].map((_, i) => <g key={i}><line x1={cell} y1={cell * (i + 1)} x2={cell * n} y2={cell * (i + 1)} stroke={P.ink} strokeWidth={2.5} /><line x1={cell * (i + 1)} y1={cell} x2={cell * (i + 1)} y2={cell * n} stroke={P.ink} strokeWidth={2.5} /></g>)}
        {[[3, 3], [3, 7], [7, 3], [7, 7], [5, 5]].map(([x, y], i) => <circle key={i} cx={cell * x} cy={cell * y} r={5} fill={P.ink} />)}
        {stones.map((s, i) => {
          const t = f - s.at;
          if (t < 0) return null;
          const drop = interpolate(t, [0, 4], [-40, 0], clamp);
          const sq = t < 6 ? 1 + Math.sin((t / 6) * Math.PI) * 0.25 : 1;
          const ring = interpolate(t, [0, 16], [0, cell * 1.6], clamp);
          return (
            <g key={i} transform={`translate(${cell * s.x} ${cell * s.y + drop})`}>
              {t < 16 && <circle r={ring} fill="none" stroke={s.hl ? P.red : P.ink} strokeWidth={5} opacity={1 - t / 16} />}
              <ellipse rx={cell * 0.45 * sq} ry={cell * 0.45 / sq} fill={s.c === "b" ? "#1c1a18" : "#f6f1e6"} stroke={P.ink} strokeWidth={3} />
              <ellipse cx={-cell * 0.14} cy={-cell * 0.14} rx={cell * 0.12} ry={cell * 0.08} fill="#ffffff55" />
              {s.hl && t > 6 && <circle r={cell * 0.62} fill="none" stroke={P.red} strokeWidth={6} />}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
