/**
 * "Bouncy" – the AI Bounce mascot: the logo's glowing ball come alive, wrapped in a torn paper-sticker
 * border so it fits the paper style. Fully code-drawn → mouth flaps on every word, eyes look around,
 * blinks, waves, squash-and-stretch bounces, laughs with tears of joy.
 */
import React from "react";
import { random, useCurrentFrame, interpolate } from "remotion";
import { onTwos, P } from "./kit";

const tornCircle = (r: number, seed: string, n = 46, amp = 7) =>
  "M" + [...Array(n)].map((_, i) => { const a = (i / n) * Math.PI * 2; const rr = r - random(`${seed}${i}`) * amp; return `${Math.cos(a) * rr} ${Math.sin(a) * rr}`; }).join(" L") + " Z";

export type BouncyMood = "talk" | "laugh" | "wink" | "wow" | "bored";
type W = { start: number; end: number; word: string };

/** 0..1 mouth opening from word timings (syllable-ish flapping inside each word). */
export const mouthOpen = (words: W[], t: number) => {
  const w = words.find((x) => t >= x.start && t <= x.end + 0.04);
  if (!w) return 0;
  const syll = Math.max(1, Math.round(w.word.replace(/[^aeiouy]/gi, "").length * 0.8));
  const ph = (t - w.start) / Math.max(0.08, w.end - w.start);
  return 0.25 + 0.75 * Math.abs(Math.sin(ph * Math.PI * syll));
};

export const Bouncy: React.FC<{ size?: number; mood?: BouncyMood; open?: number; bounce?: boolean; look?: number }> = ({ size = 420, mood = "talk", open = 0, bounce = true, look }) => {
  const f = useCurrentFrame();
  const g = onTwos(f);
  // bounce cycle (squash on landing)
  const cyc = (f % 42) / 42;
  const hop = bounce ? Math.abs(Math.sin(cyc * Math.PI)) : 0;
  const squash = bounce ? (cyc < 0.08 || cyc > 0.92 ? 0.14 : 0) : 0;
  const laugh = mood === "laugh";
  const shake = laugh ? Math.sin(f / 1.6) * 6 : 0;
  const blink = mood !== "laugh" && g % 150 < 6;
  const lx = look ?? Math.sin(g / 40) * 6;
  const R = 100;
  const arm = Math.sin(g / 7) * 18;
  return (
    <div style={{ width: size, height: size * 1.15, position: "relative", transform: `translateY(${-hop * size * 0.12}px) translateX(${shake}px)` }}>
      <svg width={size} height={size * 1.15} viewBox="-130 -140 260 300" style={{ overflow: "visible" }}>
        <defs>
          <radialGradient id="bouncyBody" cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="22%" stopColor="#22D3EE" />
            <stop offset="70%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#5b21b6" />
          </radialGradient>
        </defs>
        {/* shadow */}
        <ellipse cx={0} cy={150} rx={80 - hop * 25} ry={10} fill="#0005" />
        <g transform={`translate(0 ${squash * 40}) scale(${1 + squash}, ${1 - squash})`}>
          {/* paper sticker border, arms, body */}
          <path d={tornCircle(122, "bouncy")} fill={P.paper2} stroke="#0002" strokeWidth={2} />
          {/* arms */}
          <path d={`M-95 10 Q-135 ${-10 - arm} -125 ${-50 - arm}`} stroke={P.ink} strokeWidth={9} fill="none" strokeLinecap="round" />
          <path d={`M95 10 Q135 ${-10 + arm} 125 ${-50 + arm}`} stroke={P.ink} strokeWidth={9} fill="none" strokeLinecap="round" />
          <circle cx={-125} cy={-50 - arm} r={11} fill={P.paper2} stroke={P.ink} strokeWidth={5} />
          <circle cx={125} cy={-50 + arm} r={11} fill={P.paper2} stroke={P.ink} strokeWidth={5} />

          <circle r={R} fill="url(#bouncyBody)" stroke={P.ink} strokeWidth={5} />
          {/* speed-trail cheeks */}
          <ellipse cx={-58} cy={22} rx={16} ry={9} fill="#F472B6" opacity={0.7} />
          <ellipse cx={58} cy={22} rx={16} ry={9} fill="#F472B6" opacity={0.7} />
          {/* eyebrows */}
          <path d={`M-58 ${-52 - (mood === "wow" ? 12 : 0)} q 20 -12 38 0`} stroke={P.ink} strokeWidth={7} fill="none" strokeLinecap="round" />
          <path d={`M20 ${-52 - (mood === "wow" ? 12 : 0)} q 20 -12 38 0`} stroke={P.ink} strokeWidth={7} fill="none" strokeLinecap="round" />
          {/* eyes */}
          {laugh ? (
            <>
              <path d="M-58 -18 q 19 -22 38 0" stroke={P.ink} strokeWidth={8} fill="none" strokeLinecap="round" />
              <path d="M20 -18 q 19 -22 38 0" stroke={P.ink} strokeWidth={8} fill="none" strokeLinecap="round" />
              {[0, 1].map((k) => { const tt = ((f + k * 20) % 40) / 40; return <path key={k} d={`M${k ? 62 : -62} ${-10 + tt * 50} q -6 10 0 14 q 6 -4 0 -14`} fill="#7dd3fc" stroke={P.ink} strokeWidth={2} opacity={1 - tt} />; })}
            </>
          ) : (
            [-39, 39].map((x, i) => (
              <g key={i}>
                <ellipse cx={x} cy={-20} rx={22} ry={blink || (mood === "wink" && i === 1) ? 2.5 : 27} fill="#fff" stroke={P.ink} strokeWidth={5} />
                {mood === "bored" && <path d={`M${x - 24} -22 A 24 27 0 0 1 ${x + 24} -22 Z`} fill="#7c3aed" stroke={P.ink} strokeWidth={5} />}
                {!(blink || (mood === "wink" && i === 1)) && <><circle cx={x + lx} cy={-16} r={11} fill={P.ink} /><circle cx={x + lx - 4} cy={-21} r={3.5} fill="#fff" /></>}
              </g>
            ))
          )}
          {/* mouth */}
          {laugh ? (
            <path d="M-45 28 Q0 95 45 28 Z" fill="#7f1d1d" stroke={P.ink} strokeWidth={5} strokeLinejoin="round" />
          ) : (
            <g>
              <ellipse cx={0} cy={42} rx={26 + open * 6} ry={4 + open * 22} fill="#7f1d1d" stroke={P.ink} strokeWidth={5} />
              {open > 0.5 && <ellipse cx={0} cy={50 + open * 8} rx={12} ry={5} fill="#F472B6" />}
            </g>
          )}
        </g>
        {mood === "bored" && [0, 1, 2].map((k) => { const tt = ((f + k * 25) % 75) / 75; return <text key={k} x={90 + tt * 40} y={-90 - tt * 70} fontSize={30 + k * 8} fontWeight={900} fill={P.ink} opacity={1 - tt}>Z</text>; })}
      </svg>
    </div>
  );
};

/** Confetti burst (paper bits) for punchlines. */
export const Confetti: React.FC<{ at: number; n?: number }> = ({ at, n = 60 }) => {
  const f = useCurrentFrame() - at;
  if (f < 0) return null;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {[...Array(n)].map((_, i) => {
        const x0 = 540 + (random(`cx${i}`) - 0.5) * 300;
        const vx = (random(`cvx${i}`) - 0.5) * 30;
        const vy = -18 - random(`cvy${i}`) * 22;
        const x = x0 + vx * f, y = 1100 + vy * f + 0.7 * f * f;
        const c = [P.mustard, P.teal, P.red, P.green, "#A855F7", "#22D3EE"][i % 6];
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 18, height: 12, background: c, border: `2px solid ${P.ink}`, transform: `rotate(${f * 12 + i * 30}deg)`, opacity: interpolate(f, [60, 90], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }} />;
      })}
    </div>
  );
};
