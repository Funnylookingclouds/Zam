/**
 * The ZAM gang – code-drawn, lip-synced paper-sticker mascots.
 * Each drawing takes `open` (0..1 mouth), `blink`, `look` (pupil offset) and `arm` (wave angle).
 * <Mascot> wraps a drawing with the sticker border, hop/squash-and-stretch and shadow.
 */
import React from "react";
import { random, useCurrentFrame } from "remotion";
import { P, onTwos } from "../presenter/kit";

export type Who = "zam" | "pucky" | "biscuit" | "helmy" | "clubby" | "agenty";
export type Mood = "talk" | "wow" | "laugh" | "grumpy" | "smug" | "bliss" | "sleep" | "scared" | "dizzy" | "sweat" | "determined" | "sad" | "tired" | "starry";
export type Pose = { open: number; blink: boolean; look: number; arm: number; mood: Mood; shades?: boolean };

export const GANG: Record<Who, { name: string; role: string; accent: string; voice: string }> = {
  zam: { name: "Zam", role: "the host · ice machine", accent: "#3b82f6", voice: "wGkprrTXgBM5EC3Znt6U" },
  pucky: { name: "Pucky", role: "the hype puck", accent: "#d94b3b", voice: "fBD19tfE58bkETeiwUoC" },
  biscuit: { name: "Biscuit", role: "walrus goalie", accent: "#e0a526", voice: "D38z5RcWu1voky8WS1ja" },
  helmy: { name: "Helmy", role: "the stats nerd", accent: "#2a9d8f", voice: "RDSy0QN68yhrjuOgqzQ4" },
  clubby: { name: "Clubby", role: "old-school stick", accent: "#5a8f3e", voice: "Q4oILuo4P8VeXtE6FMLI" },
  agenty: { name: "Agenty", role: "the prospect hunter", accent: "#8b5cf6", voice: "" },
};

const INK = P.ink;
const tornCircle = (r: number, seed: string, n = 46, amp = 7) =>
  "M" + [...Array(n)].map((_, i) => { const a = (i / n) * Math.PI * 2; const rr = r - random(`${seed}${i}`) * amp; return `${(Math.cos(a) * rr).toFixed(1)} ${(Math.sin(a) * rr).toFixed(1)}`; }).join(" L") + " Z";

const Eyes: React.FC<{ y: number; gap?: number; r?: number; p: Pose; brow?: "angry" | "up" | "none" }> = ({ y, gap = 30, r = 18, p, brow = "none" }) => (
  <>
    {[-gap, gap].map((x, i) => (
      <g key={x}>
        <ellipse cx={x} cy={y} rx={r} ry={p.blink ? 3 : r * 1.22} fill="#fff" stroke={INK} strokeWidth={5} />
        {!p.blink && <circle cx={x + p.look} cy={y + 3} r={r * 0.5} fill={INK} />}
        {!p.blink && <circle cx={x + p.look - 4} cy={y - 2} r={3} fill="#fff" />}
        {brow === "angry" && <path d={i === 0 ? `M${x - 20} ${y - 34} L${x + 16} ${y - 24}` : `M${x + 20} ${y - 34} L${x - 16} ${y - 24}`} stroke={INK} strokeWidth={8} strokeLinecap="round" />}
        {brow === "up" && <path d={`M${x - 16} ${y - 34} Q${x} ${y - 44} ${x + 16} ${y - 34}`} stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />}
      </g>
    ))}
  </>
);

/** D-shaped mouth that opens with speech; closed = smile/frown line. */
const Mouth: React.FC<{ y: number; w: number; open: number; smile?: number; tooth?: boolean; fill?: string }> = ({ y, w, open, smile = 1, tooth, fill = "#7f1d1d" }) => {
  const d = 6 + open * 34;
  if (open < 0.12) return <path d={`M${-w} ${y} Q0 ${y + 18 * smile} ${w} ${y}`} stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />;
  return (
    <g>
      <path d={`M${-w} ${y} Q0 ${y + 6 * smile} ${w} ${y} Q${w * 0.8} ${y + d * 1.4} 0 ${y + d * 1.5} Q${-w * 0.8} ${y + d * 1.4} ${-w} ${y} Z`} fill={fill} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <ellipse cx={0} cy={y + d * 1.05} rx={w * 0.45} ry={d * 0.32} fill="#e46a6a" />
      {tooth && <rect x={-8} y={y + 1} width={11} height={12} fill="#fff" stroke={INK} strokeWidth={2} />}
    </g>
  );
};

const Zam: React.FC<{ p: Pose }> = ({ p }) => (
  <g>
    <path d="M-150 112 H150" stroke="#93c5fd" strokeWidth={12} strokeLinecap="round" />
    <rect x={-128} y={-36} width={256} height={116} rx={26} fill="#3b82f6" stroke={INK} strokeWidth={5} />
    <rect x={-128} y={44} width={256} height={14} fill="#2563eb" />
    <rect x={-62} y={-104} width={124} height={72} rx={14} fill="#bfdbfe" stroke={INK} strokeWidth={5} />
    <path d="M-44 -90 L-20 -50" stroke="#fff" strokeWidth={7} strokeLinecap="round" opacity={0.8} />
    {/* rotating beacon */}
    <rect x={-10} y={-122} width={20} height={18} rx={5} fill={p.mood === "wow" ? "#fde047" : "#f59e0b"} stroke={INK} strokeWidth={4} />
    <FaceEyes p={p} y={6} line={INK} lid="#2563eb" />
    <Mouth y={36} w={34} open={p.open} />
    {[-82, 82].map((x) => <g key={x}><circle cx={x} cy={84} r={28} fill="#222" stroke={INK} strokeWidth={5} /><circle cx={x} cy={84} r={9} fill="#9ca3af" /></g>)}
    <path d={`M-128 10 Q-160 ${-6 - p.arm} -158 ${-40 - p.arm}`} stroke={INK} strokeWidth={9} fill="none" strokeLinecap="round" />
  </g>
);

const Pucky: React.FC<{ p: Pose }> = ({ p }) => (
  <g>
    <path d={`M-112 -6 Q-150 ${-30 - p.arm} -140 ${-72 - p.arm}`} stroke={INK} strokeWidth={9} fill="none" strokeLinecap="round" />
    <path d={`M112 -6 Q150 ${-30 + p.arm * 0.6} 140 ${-72 + p.arm * 0.6}`} stroke={INK} strokeWidth={9} fill="none" strokeLinecap="round" />
    <ellipse cx={0} cy={42} rx={112} ry={42} fill="#111" stroke={INK} strokeWidth={5} />
    <rect x={-112} y={-40} width={224} height={82} fill="#1c1c1c" />
    <path d="M-112 -40 V42 M112 -40 V42" stroke={INK} strokeWidth={5} />
    <ellipse cx={0} cy={-40} rx={112} ry={42} fill="#2b2b2b" stroke={INK} strokeWidth={5} />
    <rect x={-112} y={-64} width={224} height={18} fill={P.red} stroke={INK} strokeWidth={3} />
    <path d="M100 -58 L138 -84 M100 -52 L142 -62" stroke={P.red} strokeWidth={9} strokeLinecap="round" />
    {p.shades ? (
      <g>
        <path d="M-78 -24 H78" stroke={INK} strokeWidth={6} />
        {[-36, 36].map((x) => <path key={x} d={`M${x - 32} -26 H${x + 32} Q${x + 30} 8 ${x} 10 Q${x - 30} 8 ${x - 32} -26 Z`} fill="#111" stroke={INK} strokeWidth={4} />)}
        {[-36, 36].map((x) => <path key={`g${x}`} d={`M${x - 18} -18 L${x - 4} -18`} stroke="#9cd3ff" strokeWidth={5} strokeLinecap="round" />)}
      </g>
    ) : <PuckyEyes p={p} />}
    {(p.mood === "bliss" || p.mood === "sweat" || p.mood === "laugh") && [-62, 62].map((x) => <ellipse key={x} cx={x} cy={18} rx={16} ry={9} fill="#f472b6" opacity={0.75} />)}
    {p.mood === "sweat" && [[-90, -40], [92, -30], [70, -50]].map(([x, y], i) => <path key={i} d={`M${x} ${y} q8 14 0 20 q-8 -6 0 -20`} fill="#7dd3fc" stroke={INK} strokeWidth={3} />)}
    <PuckyMouth p={p} />
  </g>
);

/** Expression set for close-ups (Pucky: white lines on black; Biscuit: ink lines on the white mask). Eyes centred at y. */
const PuckyEyes: React.FC<{ p: Pose }> = ({ p }) => <FaceEyes p={p} />;
const FaceEyes: React.FC<{ p: Pose; y?: number; line?: string; lid?: string }> = ({ p, y = -6, line = "#fff", lid = "#c08a3e" }) => {
  const m = p.mood;
  const X = [-30, 30];
  if (m === "sleep") return <>{X.map((x) => <path key={x} d={`M${x - 16} ${y - 2} Q${x} ${y + 10} ${x + 16} ${y - 2}`} stroke={line} strokeWidth={6} fill="none" strokeLinecap="round" />)}</>;
  if (m === "bliss") return <>{X.map((x) => <path key={x} d={`M${x - 17} ${y + 4} Q${x} ${y - 16} ${x + 17} ${y + 4}`} stroke={line} strokeWidth={7} fill="none" strokeLinecap="round" />)}</>;
  if (m === "dizzy") return <>{X.map((x) => <g key={x}><circle cx={x} cy={y} r={19} fill="#fff" stroke={INK} strokeWidth={4} /><path d={`M${x} ${y} m-3 0 a3 3 0 1 1 6 0 a6 6 0 1 1 -12 0 a9 9 0 1 1 18 0 a12 12 0 1 1 -24 0`} stroke={INK} strokeWidth={3} fill="none" /></g>)}</>;
  if (m === "scared") return <>{[-32, 32].map((x) => <g key={x}><ellipse cx={x} cy={y - 2} rx={22} ry={28} fill="#fff" stroke={INK} strokeWidth={5} /><circle cx={x} cy={y} r={5} fill={INK} /><path d={`M${x - 16} ${y - 40} Q${x} ${y - 50} ${x + 16} ${y - 40}`} stroke={line} strokeWidth={5} fill="none" strokeLinecap="round" /></g>)}</>;
  if (m === "tired") return <>{X.map((x) => <g key={x}><ellipse cx={x} cy={y} rx={18} ry={22} fill="#fff" stroke={INK} strokeWidth={5} /><circle cx={x} cy={y + 8} r={8} fill={INK} /><path d={`M${x - 20} ${y - 2} Q${x} ${y - 30} ${x + 20} ${y - 2} Z`} fill={lid} stroke={INK} strokeWidth={4} /></g>)}</>;
  if (m === "sad") return <><Eyes y={y} p={p} brow="up" />{X.map((x) => <path key={x} d={`M${x} ${y + 26} q-6 40 0 70 q6 -30 0 -70`} fill="#7dd3fc" stroke={INK} strokeWidth={3} />)}</>;
  if (m === "starry") return <>{X.map((x) => <path key={x} d={`M${x} ${y - 24} L${x + 7} ${y - 7} L${x + 24} ${y - 6} L${x + 10} ${y + 5} L${x + 15} ${y + 22} L${x} ${y + 12} L${x - 15} ${y + 22} L${x - 10} ${y + 5} L${x - 24} ${y - 6} L${x - 7} ${y - 7} Z`} fill="#facc15" stroke={INK} strokeWidth={4} strokeLinejoin="round" />)}</>;
  return <Eyes y={y} p={p} brow={m === "smug" || m === "determined" || m === "grumpy" ? "angry" : m === "sweat" || m === "wow" ? "up" : "none"} />;
};
const PuckyMouth: React.FC<{ p: Pose }> = ({ p }) => {
  const m = p.mood;
  if (p.open < 0.12) {
    if (m === "sleep") return <ellipse cx={0} cy={32} rx={8} ry={6} fill="#7f1d1d" stroke={INK} strokeWidth={3} />;
    if (m === "scared") return <ellipse cx={0} cy={34} rx={12} ry={14} fill="#7f1d1d" stroke={INK} strokeWidth={4} />;
    if (m === "dizzy") return <path d="M-34 28 q8 -8 17 0 t17 0 t17 0 t17 0" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />;
    if (m === "bliss") return <g><path d="M-38 22 Q0 58 38 22 Z" fill="#7f1d1d" stroke={INK} strokeWidth={4} /><rect x={-8} y={22} width={11} height={11} fill="#fff" stroke={INK} strokeWidth={2} /></g>;
    if (m === "determined") return <path d="M-30 30 L30 26" stroke={INK} strokeWidth={6} strokeLinecap="round" />;
  }
  return <Mouth y={26} w={40} open={m === "scared" ? Math.max(0.5, p.open) : p.open} tooth smile={m === "sweat" ? 0.4 : 1.4} />;
};

const Biscuit: React.FC<{ p: Pose }> = ({ p }) => (
  <g>
    <circle r={112} fill="#a16207" stroke={INK} strokeWidth={5} />
    <path d="M-72 -92 Q0 -134 72 -92 L82 -12 Q0 8 -82 -12 Z" fill="#f8fafc" stroke={INK} strokeWidth={5} />
    {[-50, -20, 10, 40].map((x) => <line key={x} x1={x} y1={-98} x2={x + 6} y2={-14} stroke={INK} strokeWidth={3} />)}
    <FaceEyes p={p} y={-48} line={INK} />
    <ellipse cx={0} cy={30} rx={58} ry={36} fill="#d6a76a" stroke={INK} strokeWidth={5} />
    {[-30, -16, 16, 30].map((x) => <circle key={x} cx={x} cy={22 + Math.abs(x) * 0.2} r={3} fill={INK} />)}
    {p.mood === "sad" && [-30, 30].map((x) => <path key={`t${x}`} d={`M${x * 1.25} -22 q-10 50 0 84 q10 -34 0 -84`} fill="#7dd3fc" stroke={INK} strokeWidth={3} />)}
    {/* mouth hides under the muzzle; tusks open apart when talking */}
    <ellipse cx={0} cy={58} rx={20} ry={4 + p.open * 16} fill="#5b1414" stroke={INK} strokeWidth={4} />
    {[-1, 1].map((s) => (
      <g key={s} transform={`rotate(${s * p.open * 6} ${s * 22} 52)`}>
        <path d={`M${s * 22} 52 L${s * 26} 114`} stroke="#fff" strokeWidth={15} strokeLinecap="round" />
        <path d={`M${s * 22} 52 L${s * 26} 114`} stroke={INK} strokeWidth={3} fill="none" />
      </g>
    ))}
  </g>
);

const Helmy: React.FC<{ p: Pose }> = ({ p }) => (
  <g>
    <path d="M-106 40 Q-116 -96 0 -112 Q116 -96 106 40 L80 50 L80 10 L-80 10 L-80 50 Z" fill={P.teal} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    {[-40, 0, 40].map((x) => <path key={x} d={`M${x} -102 L${x * 0.9} -72`} stroke={INK} strokeWidth={6} strokeLinecap="round" />)}
    <g transform="rotate(14 79 -50)">
      <rect x={62} y={-62} width={34} height={24} rx={4} fill={P.mustard} stroke={INK} strokeWidth={3} />
      <text x={79} y={-44} fontSize={15} fontWeight={900} textAnchor="middle" fill={INK}>#1</text>
    </g>
    <circle cx={0} cy={58} r={62} fill="#fbf6ea" stroke={INK} strokeWidth={5} />
    <path d="M-92 -40 Q0 -62 92 -40 L86 28 Q0 46 -86 28 Z" fill="#d6f3f6" fillOpacity={0.85} stroke={INK} strokeWidth={5} />
    <FaceEyes p={p} y={-6} line={INK} lid="#2a9d8f" />
    <path d="M-70 -34 L-40 -42" stroke="#fff" strokeWidth={7} strokeLinecap="round" opacity={0.9} />
    <Mouth y={64} w={24} open={p.open} smile={0.8} />
    <path d={`M-80 46 Q-62 ${116 + p.open * 8} 0 ${114 + p.open * 8} Q62 ${116 + p.open * 8} 80 46`} stroke={INK} strokeWidth={7} fill="none" />
    <rect x={-12} y={106 + p.open * 8} width={24} height={16} rx={4} fill="#ddd" stroke={INK} strokeWidth={3} />
  </g>
);

const Clubby: React.FC<{ p: Pose }> = ({ p }) => (
  <g>
    <path d="M-34 -128 L34 -128 L30 70 L-30 70 Z" fill="#d9a55f" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M-14 -110 Q-8 -40 -16 40 M14 -90 Q20 -20 12 50" stroke="#a8733a" strokeWidth={3} fill="none" />
    <rect x={-37} y={-140} width={74} height={30} rx={6} fill="#222" stroke={INK} strokeWidth={4} />
    {[-24, -8, 8, 24].map((x) => <line key={x} x1={x} y1={-138} x2={x + 6} y2={-112} stroke="#555" strokeWidth={3} />)}
    <path d="M-30 70 L30 70 L38 96 Q40 112 20 114 L-110 114 Q-122 112 -118 98 L-102 90 L-30 88 Z" fill="#222" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    {[-90, -66, -42, -18, 6].map((x) => <line key={x} x1={x} y1={92} x2={x + 10} y2={112} stroke="#fff" strokeWidth={2.5} opacity={0.55} />)}
    <path d={`M-52 ${-60 - (p.mood === "grumpy" ? -6 : 0)} Q-30 -78 -8 -62 M8 -62 Q30 -78 52 ${-60 - (p.mood === "grumpy" ? -6 : 0)}`} stroke={INK} strokeWidth={11} fill="none" strokeLinecap="round" />
    <Eyes y={-34} gap={24} r={15} p={p} />
    <Mouth y={12} w={22} open={p.open} smile={0.6} />
    <rect x={-32} y={40} width={64} height={14} fill="#f8fafc" stroke={INK} strokeWidth={3} transform="rotate(-12 0 47)" />
    <path d={`M-34 -6 Q-70 -10 -84 ${-40 - p.arm}`} stroke={INK} strokeWidth={8} fill="none" strokeLinecap="round" />
    <path d={`M34 -6 Q70 0 82 ${-30 + p.arm * 0.5}`} stroke={INK} strokeWidth={8} fill="none" strokeLinecap="round" />
  </g>
);

/** Agenty – smooth-talking scout clipboard: shiny clip "hairdo" with shades pushed up, purple tie, gold pen, stopwatch. */
const Agenty: React.FC<{ p: Pose }> = ({ p }) => (
  <g>
    {/* arms: one with gold pen, one doing "finger guns" */}
    <path d={`M-104 0 Q-150 ${-20 - p.arm} -146 ${-62 - p.arm}`} stroke={INK} strokeWidth={9} fill="none" strokeLinecap="round" />
    <path d={`M-146 ${-62 - p.arm} l-6 -34`} stroke="#d4a017" strokeWidth={10} strokeLinecap="round" />
    <path d={`M-146 ${-62 - p.arm} l-6 -34`} stroke={INK} strokeWidth={2.5} fill="none" />
    <path d={`M104 0 Q150 ${-10 + p.arm * 0.6} 150 ${-46 + p.arm * 0.6}`} stroke={INK} strokeWidth={9} fill="none" strokeLinecap="round" />
    {/* board */}
    <rect x={-104} y={-118} width={208} height={262} rx={18} fill="#b07a45" stroke={INK} strokeWidth={6} />
    <rect x={-88} y={-96} width={176} height={226} rx={6} fill="#fffdf7" stroke={INK} strokeWidth={4} />
    {[0, 1, 2].map((i) => <g key={i}><rect x={-72} y={66 + i * 20} width={12} height={12} fill="#fff" stroke={INK} strokeWidth={3} /><path d={`M-70 ${72 + i * 20} l4 4 l8 -10`} stroke={P.green} strokeWidth={3} fill="none" /><line x1={-52} y1={72 + i * 20} x2={20 + (i % 2) * 30} y2={72 + i * 20} stroke="#94a3b8" strokeWidth={4} /></g>)}
    {/* clip = slick hairdo */}
    <path d="M-60 -112 Q-58 -150 0 -152 Q58 -150 60 -112 Z" fill="#cbd5e1" stroke={INK} strokeWidth={6} />
    <path d="M-36 -136 Q0 -146 30 -138" stroke="#fff" strokeWidth={7} strokeLinecap="round" opacity={0.9} />
    <rect x={-30} y={-122} width={60} height={20} rx={6} fill="#94a3b8" stroke={INK} strokeWidth={4} />
    {/* shades pushed up */}
    <path d="M-70 -128 H70" stroke={INK} strokeWidth={5} />
    {[-34, 34].map((x) => <path key={x} d={`M${x - 26} -132 H${x + 26} Q${x + 24} -108 ${x} -106 Q${x - 24} -108 ${x - 26} -132 Z`} fill="#111" stroke={INK} strokeWidth={4} />)}
    <FaceEyes p={p} y={-56} line={INK} lid="#b07a45" />
    {p.mood !== "scared" && <path d="M-54 -88 Q-30 -98 -10 -88 M10 -88 Q30 -98 54 -88" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" opacity={p.mood === "smug" ? 1 : 0.6} />}
    <Mouth y={-16} w={34} open={p.open} smile={1.5} />
    {/* tie */}
    <path d="M-12 34 L12 34 L8 44 L18 78 L0 92 L-18 78 L-8 44 Z" fill="#8b5cf6" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    {/* stopwatch on a string */}
    <path d="M60 -96 Q74 -20 70 40" stroke={INK} strokeWidth={3} fill="none" />
    <circle cx={70} cy={56} r={18} fill="#e2e8f0" stroke={INK} strokeWidth={4} />
    <path d="M70 56 L70 44 M70 56 L78 60" stroke={P.red} strokeWidth={3} strokeLinecap="round" />
  </g>
);

const DRAW: Record<Who, React.FC<{ p: Pose }>> = { zam: Zam, pucky: Pucky, biscuit: Biscuit, helmy: Helmy, clubby: Clubby, agenty: Agenty };

/** 0..1 mouth opening from word timings (syllable-ish flapping inside each word). */
export const mouthOpen = (words: { start: number; end: number; word: string }[], t: number) => {
  const w = words.find((x) => t >= x.start && t <= x.end + 0.03);
  if (!w) return 0;
  const syll = Math.max(1, Math.round(w.word.replace(/[^aeiouy]/gi, "").length * 0.8));
  const ph = (t - w.start) / Math.max(0.08, w.end - w.start);
  return 0.3 + 0.7 * Math.abs(Math.sin(ph * Math.PI * syll));
};

export const Mascot: React.FC<{
  who: Who; size?: number; open?: number; mood?: Mood; talking?: boolean; hop?: number; flip?: boolean; seed?: string; dim?: boolean; shades?: boolean; noSticker?: boolean;
}> = ({ who, size = 300, open = 0, mood = "talk", talking = false, hop = 0, flip = false, seed = "", dim = false, shades = false, noSticker = false }) => {
  const f = useCurrentFrame();
  const g = onTwos(f);
  const ph = random(who + seed) * 100;
  const blink = (g + Math.floor(ph) * 5) % 170 < 6;
  const look = Math.sin((g + ph * 10) / 45) * 6;
  const arm = talking ? Math.sin(g / 6 + ph) * 22 : Math.sin(g / 30 + ph) * 6;
  const laugh = mood === "laugh" ? Math.sin(f / 1.7) * 5 : 0;
  // squash on each syllable when talking + idle breathing
  const sq = talking ? open * 0.06 : Math.sin((f + ph * 20) / 24) * 0.015;
  const Draw = DRAW[who];
  return (
    <div style={{ width: size, height: size * 1.12, transform: `translateY(${-hop}px) translateX(${laugh}px)`, filter: dim ? "saturate(0.55) brightness(0.8)" : undefined }}>
      <svg width={size} height={size * 1.12} viewBox="-160 -170 320 360" style={{ overflow: "visible" }}>
        {!noSticker && <ellipse cx={0} cy={172} rx={110 - hop * 0.3} ry={12} fill="#0004" />}
        <g transform={`translate(0 ${sq * 120}) scale(${(flip ? -1 : 1) * (1 + sq)}, ${1 - sq})`}>
          {!noSticker && <path d={tornCircle(158, who + "st")} fill={P.paper2} stroke="#0002" strokeWidth={2} />}
          <Draw p={{ open, blink, look, arm, mood, shades }} />
        </g>
      </svg>
    </div>
  );
};
