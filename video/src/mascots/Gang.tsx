/**
 * The ZAM gang – code-drawn, lip-synced paper-sticker mascots.
 * Each drawing takes `open` (0..1 mouth), `blink`, `look` (pupil offset) and `arm` (wave angle).
 * <Mascot> wraps a drawing with the sticker border, hop/squash-and-stretch and shadow.
 */
import React from "react";
import { random, useCurrentFrame } from "remotion";
import { P, onTwos } from "../presenter/kit";

export type Who = "zam" | "pucky" | "biscuit" | "helmy" | "clubby" | "agenty";
export type Mood = "talk" | "wow" | "laugh" | "grumpy" | "smug" | "bliss" | "sleep" | "scared" | "dizzy" | "sweat" | "determined" | "sad" | "tired" | "starry" | "love" | "angry" | "shock" | "proud";
export type Pose = { open: number; blink: boolean; look: number; arm: number; mood: Mood; shades?: boolean; baby?: boolean; lookY?: number; vis?: "A" | "E" | "O" | "M"; t?: number };

export const GANG: Record<Who, { name: string; role: string; accent: string; voice: string }> = {
  zam: { name: "Zam", role: "the host · ice machine", accent: "#3b82f6", voice: "wGkprrTXgBM5EC3Znt6U" },
  pucky: { name: "Pucky", role: "the hype puck", accent: "#d94b3b", voice: "fBD19tfE58bkETeiwUoC" },
  biscuit: { name: "Biscuit", role: "walrus goalie", accent: "#e0a526", voice: "D38z5RcWu1voky8WS1ja" },
  helmy: { name: "Helmy", role: "the stats nerd", accent: "#2a9d8f", voice: "RDSy0QN68yhrjuOgqzQ4" },
  clubby: { name: "Clubby", role: "old-school stick", accent: "#5a8f3e", voice: "Q4oILuo4P8VeXtE6FMLI" },
  agenty: { name: "Agenty", role: "the prospect hunter", accent: "#8b5cf6", voice: "R9RZPy40Zzy1wNxrgQpj" },
};

const INK = P.ink;
const tornCircle = (r: number, seed: string, n = 46, amp = 7) =>
  "M" + [...Array(n)].map((_, i) => { const a = (i / n) * Math.PI * 2; const rr = r - random(`${seed}${i}`) * amp; return `${(Math.cos(a) * rr).toFixed(1)} ${(Math.sin(a) * rr).toFixed(1)}`; }).join(" L") + " Z";

const Eyes: React.FC<{ y: number; gap?: number; r?: number; p: Pose; brow?: "angry" | "up" | "none" | "worried" | "raised"; bc?: string }> = ({ y, gap = 30, r: r0 = 18, p, brow = "none", bc = INK }) => {
  const r = p.baby ? r0 * 1.38 : r0;
  const m = p.mood;
  const pr = m === "wow" || m === "shock" ? 0.28 : m === "love" ? 0 : m === "proud" ? 0.42 : 0.5;
  const ly = (p.lookY ?? 0) + 3;
  const squint = m === "smug" || m === "proud" ? 0.45 : m === "angry" ? 0.35 : m === "grumpy" ? 0.3 : 0;
  const wide = m === "wow" || m === "shock" ? 1.25 : 1;
  const tt = p.t ?? 0;
  return (
  <>
    {p.baby && [-1, 1].map((sgn) => <ellipse key={`ck${sgn}`} cx={sgn * (gap + r * 0.9)} cy={y + r * 1.75} rx={r * 0.7} ry={r * 0.42} fill="#f9a8d4" opacity={0.85} />)}
    {[-gap, gap].map((x, i) => {
      const ry = p.blink ? 3 : r * 1.22 * wide;
      return (
      <g key={x}>
        <defs><clipPath id={`ec${x}${y}${r}`}><ellipse cx={x} cy={y} rx={r * wide} ry={ry} /></clipPath></defs>
        <ellipse cx={x} cy={y} rx={r * wide} ry={ry} fill="#fff" stroke={INK} strokeWidth={5} />
        {!p.blink && m !== "love" && <g clipPath={`url(#ec${x}${y}${r})`}>
          <circle cx={x + p.look} cy={y + ly} r={r * pr * (m === "shock" ? 1 + Math.sin(tt * 40) * 0.15 : 1)} fill={INK} />
          <circle cx={x + p.look - r * 0.22} cy={y + ly - r * 0.28} r={Math.max(2.5, r * 0.17)} fill="#fff" />
          {squint > 0 && <rect x={x - r * 1.4} y={y - ry - 2} width={r * 2.8} height={ry * 2 * squint} fill={INK} opacity={0.95} />}
        </g>}
        {!p.blink && m === "love" && <path d={`M${x} ${y + r * 0.7} C${x - r * 1.6} ${y - r * 0.3} ${x - r * 0.6} ${y - r * 1.3} ${x} ${y - r * 0.4} C${x + r * 0.6} ${y - r * 1.3} ${x + r * 1.6} ${y - r * 0.3} ${x} ${y + r * 0.7} Z`} fill="#ef4444" stroke={INK} strokeWidth={3} transform={`translate(0 ${Math.sin(tt * 10) * 2}) scale(1)`} />}
        {brow === "angry" && <path d={i === 0 ? `M${x - 20} ${y - 34 - (wide - 1) * 20} L${x + 16} ${y - 22}` : `M${x + 20} ${y - 34 - (wide - 1) * 20} L${x - 16} ${y - 22}`} stroke={bc} strokeWidth={8} strokeLinecap="round" />}
        {brow === "up" && <path d={`M${x - 16} ${y - 36 - (wide - 1) * 30} Q${x} ${y - 48 - (wide - 1) * 30} ${x + 16} ${y - 36 - (wide - 1) * 30}`} stroke={bc} strokeWidth={6} fill="none" strokeLinecap="round" />}
        {brow === "worried" && <path d={i === 0 ? `M${x - 18} ${y - 28} L${x + 16} ${y - 40}` : `M${x + 18} ${y - 28} L${x - 16} ${y - 40}`} stroke={bc} strokeWidth={7} strokeLinecap="round" />}
        {brow === "raised" && (i === 1 ? <path d={`M${x - 16} ${y - 44} Q${x} ${y - 54} ${x + 16} ${y - 44}`} stroke={bc} strokeWidth={6} fill="none" strokeLinecap="round" /> : <path d={`M${x - 18} ${y - 26} L${x + 16} ${y - 28}`} stroke={bc} strokeWidth={7} strokeLinecap="round" />)}
        {p.baby && !p.blink && <circle cx={x + p.look + 6} cy={y - 6} r={r * 0.18} fill="#fff" />}
      </g>
    ); })}
  </>
  );
};

/** D-shaped mouth that opens with speech; closed = smile/frown line. */
const Mouth: React.FC<{ y: number; w: number; open: number; smile?: number; tooth?: boolean; fill?: string; vis?: "A" | "E" | "O" | "M"; mood?: Mood }> = ({ y, w, open, smile = 1, tooth, fill = "#7f1d1d", vis = "A", mood }) => {
  if (open < 0.12) {
    if (mood === "laugh" || mood === "love" || mood === "proud") return <g><path d={`M${-w * 1.1} ${y - 2} Q0 ${y + 26 * Math.max(1, smile)} ${w * 1.1} ${y - 2} Q0 ${y + 10} ${-w * 1.1} ${y - 2} Z`} fill={fill} stroke={INK} strokeWidth={5} strokeLinejoin="round" />{tooth && <rect x={-8} y={y + 1} width={11} height={10} fill="#fff" stroke={INK} strokeWidth={2} />}</g>;
    if (mood === "angry" || mood === "grumpy") return <path d={`M${-w} ${y + 8} Q0 ${y - 12} ${w} ${y + 8}`} stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />;
    if (mood === "wow" || mood === "shock") return <ellipse cx={0} cy={y + 8} rx={w * 0.35} ry={w * 0.45} fill={fill} stroke={INK} strokeWidth={5} />;
    if (mood === "smug") return <path d={`M${-w} ${y + 4} Q${w * 0.2} ${y + 12} ${w} ${y - 10}`} stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />;
    if (mood === "sad" || mood === "tired") return <path d={`M${-w * 0.8} ${y + 10} Q0 ${y - 4} ${w * 0.8} ${y + 10}`} stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />;
    return <path d={`M${-w} ${y} Q0 ${y + 18 * smile} ${w} ${y}`} stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />;
  }
  const d = 6 + open * 34;
  const ww = vis === "E" ? w * 1.2 : vis === "O" ? w * 0.62 : vis === "M" ? w * 0.9 : w;
  const dd = vis === "E" ? d * 0.55 : vis === "O" ? d * 1.1 : vis === "M" ? d * 0.25 : d;
  if (vis === "O") return <g><ellipse cx={0} cy={y + dd * 0.7} rx={ww} ry={dd * 0.8} fill={fill} stroke={INK} strokeWidth={5} /><ellipse cx={0} cy={y + dd * 1.05} rx={ww * 0.55} ry={dd * 0.3} fill="#e46a6a" /></g>;
  return (
    <g>
      <path d={`M${-ww} ${y} Q0 ${y + 6 * smile} ${ww} ${y} Q${ww * 0.8} ${y + dd * 1.4} 0 ${y + dd * 1.5} Q${-ww * 0.8} ${y + dd * 1.4} ${-ww} ${y} Z`} fill={fill} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      {vis !== "M" && <ellipse cx={0} cy={y + dd * 1.05} rx={ww * 0.45} ry={dd * 0.32} fill="#e46a6a" />}
      {(tooth || vis === "E") && <rect x={-ww * 0.5} y={y + 1} width={ww} height={Math.min(10, dd * 0.4)} fill="#fff" opacity={tooth ? 0 : 1} />}
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
    <Mouth y={36} w={34} open={p.open} vis={p.vis} mood={p.mood} />
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
  if (m === "sad") return <><Eyes y={y} p={p} bc={line} brow="worried" />{X.map((x) => <path key={x} d={`M${x} ${y + 26} q-6 40 0 70 q6 -30 0 -70`} fill="#7dd3fc" stroke={INK} strokeWidth={3} />)}</>;
  if (m === "starry") return <>{X.map((x) => <path key={x} d={`M${x} ${y - 24} L${x + 7} ${y - 7} L${x + 24} ${y - 6} L${x + 10} ${y + 5} L${x + 15} ${y + 22} L${x} ${y + 12} L${x - 15} ${y + 22} L${x - 10} ${y + 5} L${x - 24} ${y - 6} L${x - 7} ${y - 7} Z`} fill="#facc15" stroke={INK} strokeWidth={4} strokeLinejoin="round" />)}</>;
  return <Eyes y={y} p={p} bc={line} brow={m === "determined" || m === "grumpy" || m === "angry" ? "angry" : m === "smug" || m === "proud" ? "raised" : m === "sweat" ? "worried" : m === "wow" || m === "shock" || m === "laugh" || m === "love" ? "up" : "none"} />;
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
  return <Mouth y={26} w={40} open={m === "scared" ? Math.max(0.5, p.open) : p.open} tooth smile={m === "sweat" ? 0.4 : 1.4} vis={p.vis} mood={m} />;
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
    <Mouth y={64} w={24} open={p.open} smile={0.8} vis={p.vis} mood={p.mood} />
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
    <path d={(() => { const m = p.mood; const a = m === "grumpy" || m === "angry" || m === "determined" ? 14 : m === "sad" || m === "sweat" ? -12 : 0; const up = m === "wow" || m === "shock" || m === "laugh" ? -14 : 0; return `M-52 ${-62 - a + up} Q-30 ${-80 + up} -8 ${-62 + a + up} M8 ${-62 + a + up} Q30 ${-80 + up} 52 ${-62 - a + up}`; })()} stroke={INK} strokeWidth={11} fill="none" strokeLinecap="round" />
    <Eyes y={-34} gap={24} r={15} p={p} brow="none" />
    <Mouth y={12} w={22} open={p.open} smile={0.6} vis={p.vis} mood={p.mood} />
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
    <Mouth y={-16} w={34} open={p.open} smile={1.5} vis={p.vis} mood={p.mood} />
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

/** Baby accessories for the Child Edition: Pucky's pacifier, knitted caps with pompoms, Agenty's bow and crayon. */
const BabyBits: React.FC<{ who: Who; open: number }> = ({ who, open }) => {
  const Cap: React.FC<{ y: number; w: number; c: string }> = ({ y, w, c }) => (
    <g>
      <path d={`M${-w} ${y + 20} Q0 ${y - w * 0.9} ${w} ${y + 20} Z`} fill={c} stroke={INK} strokeWidth={5} />
      <rect x={-w - 4} y={y + 12} width={w * 2 + 8} height={20} rx={10} fill="#fff" stroke={INK} strokeWidth={4} />
      <circle cx={0} cy={y - w * 0.62} r={16} fill="#fff" stroke={INK} strokeWidth={4} />
    </g>
  );
  if (who === "pucky") return (
    <g transform={`translate(0 ${34 + open * 4})`}>
      <ellipse cx={0} cy={0} rx={34} ry={18} fill="#f9a8d4" stroke={INK} strokeWidth={5} />
      <circle cx={0} cy={0} r={8} fill="#fde68a" stroke={INK} strokeWidth={3} />
      <circle cx={0} cy={22} r={13} fill="none" stroke="#f472b6" strokeWidth={7} />
    </g>
  );
  if (who === "biscuit") return <Cap y={-150} w={80} c="#93c5fd" />;
  if (who === "clubby") return <Cap y={-176} w={46} c="#86efac" />;
  if (who === "zam") return <g><circle cx={96} cy={-30} r={16} fill="#fde68a" stroke={INK} strokeWidth={4} /><path d="M96 -46 l4 10 l11 1 l-8 7 l3 11 l-10 -6 l-10 6 l3 -11 l-8 -7 l11 -1 Z" fill="#f59e0b" /></g>;
  if (who === "helmy") return <g><path d="M-18 -126 Q0 -150 18 -126" stroke="#f472b6" strokeWidth={10} fill="none" strokeLinecap="round" /><circle cx={0} cy={-128} r={9} fill="#f472b6" stroke={INK} strokeWidth={3} /></g>;
  if (who === "agenty") return <g><path d="M-26 20 L0 34 L-26 48 Z M26 20 L0 34 L26 48 Z" fill="#f9a8d4" stroke={INK} strokeWidth={4} strokeLinejoin="round" /><rect x={128} y={-110} width={14} height={60} rx={4} fill="#60a5fa" stroke={INK} strokeWidth={3} transform="rotate(20 135 -80)" /></g>;
  return null;
};

/** Emotion effects drawn around a character (svg coords of the -160..160 viewBox). */
const EmotionFX: React.FC<{ mood: Mood; t: number }> = ({ mood, t }) => {
  if (mood === "angry" || mood === "grumpy") return <g opacity={mood === "grumpy" ? 0.6 : 1}>{[-1, 1].map((s) => { const k = (t * 1.6 + (s > 0 ? 0.5 : 0)) % 1; return <g key={s} transform={`translate(${s * 110} ${-150 - k * 60}) scale(${0.6 + k})`} opacity={1 - k}><circle r={16} fill="#fff" stroke={INK} strokeWidth={3} /><circle cx={14} cy={-6} r={12} fill="#fff" stroke={INK} strokeWidth={3} /></g>; })}{mood === "angry" && <path d="M96 -120 l14 -14 m-14 0 l14 14 M104 -140 l0 28 M90 -126 l28 0" stroke="#ef4444" strokeWidth={7} strokeLinecap="round" transform={`rotate(${Math.sin(t * 20) * 8} 104 -126)`} />}</g>;
  if (mood === "love") return <g>{[0, 1, 2].map((i) => { const k = (t * 0.7 + i / 3) % 1; return <path key={i} transform={`translate(${-90 + i * 90 + Math.sin(t * 3 + i) * 12} ${-130 - k * 90}) scale(${0.7 + k * 0.5})`} opacity={1 - k} d="M0 12 C-26 -6 -12 -24 0 -10 C12 -24 26 -6 0 12 Z" fill="#f43f5e" stroke={INK} strokeWidth={3} />; })}</g>;
  if (mood === "wow" || mood === "shock") return <g>{[...Array(8)].map((_, i) => { const a = (i / 8) * Math.PI * 2; const r1 = 150 + Math.sin(t * 30) * 6; return <path key={i} d={`M${Math.cos(a) * r1} ${Math.sin(a) * r1 - 10} L${Math.cos(a) * (r1 + 26)} ${Math.sin(a) * (r1 + 26) - 10}`} stroke={INK} strokeWidth={6} strokeLinecap="round" />; })}</g>;
  if (mood === "laugh") return <g fontFamily="Caveat" fontWeight={700} fontSize={44} fill={INK}>{[0, 1].map((i) => { const k = (t * 1.3 + i * 0.5) % 1; return <text key={i} x={(i ? 1 : -1) * (120 + k * 20)} y={-90 - k * 50} opacity={1 - k} textAnchor="middle" transform={`rotate(${i ? 14 : -14} ${(i ? 1 : -1) * 120} -90)`}>HA!</text>; })}</g>;
  if (mood === "scared" || mood === "sweat") return <g>{[[-120, -70], [124, -90], [100, -130]].map(([x, y], i) => { const k = (t * 1.2 + i * 0.33) % 1; return <path key={i} d={`M${x} ${y + k * 30} q9 15 0 22 q-9 -7 0 -22`} fill="#7dd3fc" stroke={INK} strokeWidth={3} opacity={1 - k * 0.6} />; })}</g>;
  if (mood === "smug" || mood === "proud") return <g>{[0, 1].map((i) => { const k = (t * 1.1 + i * 0.5) % 1; return <path key={i} transform={`translate(${i ? 118 : -110} ${-120 + (i ? 30 : 0)}) scale(${Math.sin(k * Math.PI) * 1.1})`} d="M0 -16 L4 -4 L16 0 L4 4 L0 16 L-4 4 L-16 0 L-4 -4 Z" fill="#fde047" stroke={INK} strokeWidth={2.5} />; })}</g>;
  if (mood === "sleep") return <g fontFamily="Inter" fontWeight={900} fill="#fff" stroke={INK} strokeWidth={3} paintOrder="stroke">{[0, 1, 2].map((i) => { const k = (t * 0.5 + i / 3) % 1; return <text key={i} x={100 + k * 40} y={-110 - k * 80} fontSize={26 + k * 22} opacity={1 - k}>z</text>; })}</g>;
  if (mood === "dizzy") return <g>{[0, 1, 2].map((i) => { const a = t * 5 + (i * Math.PI * 2) / 3; return <path key={i} transform={`translate(${Math.cos(a) * 110} ${-150 + Math.sin(a) * 22})`} d="M0 -14 L4 -4 L14 -4 L6 3 L9 13 L0 7 L-9 13 L-6 3 L-14 -4 L-4 -4 Z" fill="#facc15" stroke={INK} strokeWidth={2.5} />; })}</g>;
  return null;
};
const TILT: Partial<Record<Mood, number>> = { smug: -7, proud: -4, sad: 8, tired: 6, love: -5, determined: 3, sweat: 4, grumpy: 3 };

export const Mascot: React.FC<{
  who: Who; size?: number; open?: number; mood?: Mood; talking?: boolean; hop?: number; flip?: boolean; seed?: string; dim?: boolean; shades?: boolean; noSticker?: boolean; baby?: boolean; fx?: boolean; lookAt?: number;
}> = ({ who, size = 300, open = 0, mood = "talk", talking = false, hop = 0, flip = false, seed = "", dim = false, shades = false, noSticker = false, baby = false, fx = true, lookAt }) => {
  const f = useCurrentFrame();
  const g = onTwos(f);
  const t = f / 60;
  const ph = random(who + seed) * 100;
  const blink = (g + Math.floor(ph) * 5) % 170 < 6 || (mood !== "sleep" && (g + Math.floor(ph) * 7) % 433 < 5);
  // saccades: pupils jump between targets and hold (alive), or look where told
  const sac = Math.floor((f + ph * 13) / 70);
  const look = lookAt ?? (random(`lx${who}${seed}${sac}`) - 0.5) * 14;
  const lookY = mood === "sad" || mood === "tired" ? 5 : mood === "proud" ? -4 : (random(`ly${who}${seed}${sac}`) - 0.5) * 6;
  const arm = baby ? Math.sin(f / 40 + ph) * 10 : talking ? Math.sin(g / 6 + ph) * 22 : mood === "laugh" ? Math.sin(f / 3) * 18 : mood === "angry" ? Math.sin(f / 2.4) * 14 : Math.sin(g / 30 + ph) * 6;
  const laugh = mood === "laugh" ? Math.sin(f / 1.7) * 5 : mood === "scared" || mood === "shock" ? Math.sin(f * 1.9) * 3.5 : 0;
  const vis = (["A", "E", "O", "A", "M", "E"] as const)[Math.floor((f + ph * 3) / 5) % 6];
  // squash on each syllable when talking + idle breathing + mood bounce
  const moodBounce = mood === "laugh" ? Math.abs(Math.sin(f / 3.4)) * 0.06 : mood === "love" ? Math.sin(f / 9) * 0.03 : 0;
  const sq = baby ? Math.sin((f + ph * 20) / 45) * 0.025 + (talking ? open * 0.03 : 0) : (talking ? open * 0.07 : Math.sin((f + ph * 20) / 24) * 0.018) + moodBounce;
  const tilt = (TILT[mood] ?? 0) + (talking ? Math.sin(f / 11 + ph) * 3 : Math.sin(f / 50 + ph) * 1.5);
  const Draw = DRAW[who];
  return (
    <div style={{ width: size, height: size * 1.12, transform: `translateY(${-hop}px) translateX(${laugh}px)`, filter: dim ? "saturate(0.55) brightness(0.8)" : baby ? "saturate(0.8) brightness(1.07)" : undefined }}>
      <svg width={size} height={size * 1.12} viewBox="-160 -170 320 360" style={{ overflow: "visible" }}>
        {!noSticker && <ellipse cx={0} cy={172} rx={110 - hop * 0.3} ry={12} fill="#0004" />}
        <g transform={`rotate(${tilt} 0 120) translate(0 ${sq * 120 + (baby ? 14 : 0)}) scale(${(flip ? -1 : 1) * (1 + sq) * (baby ? 1.06 : 1)}, ${(1 - sq) * (baby ? (who === "clubby" ? 0.78 : 0.92) : 1)})`}>
          {!noSticker && <path d={tornCircle(158, who + "st")} fill={P.paper2} stroke="#0002" strokeWidth={2} />}
          <Draw p={{ open, blink, look, arm, mood, shades, baby, lookY, vis: talking ? vis : "A", t }} />
          {baby && <BabyBits who={who} open={open} />}
        </g>
        {fx && !baby && <EmotionFX mood={mood} t={t} />}
      </svg>
    </div>
  );
};
