/** ZAM Gang 2.0 – the ORIGINAL six mascots redrawn in the new 2.5D "bean" style: object heads that keep each
 *  character's identity (puck, walrus-goalie, ice machine, helmet, stick, clipboard) on bean bodies with fabric
 *  stripes, thin ink limbs, skates and thick outlines. Same moods/poses API as StickPerson. */
import React from "react";
import { useCurrentFrame } from "remotion";
import { ARMS, Brows, Eyes, Mouth, type StickMood, type StickPose } from "./Stick";

export type GangWho = "pucky" | "biscuit" | "zam" | "helmy" | "clubby" | "agenty";
const INK = "#2b2622", SKIN = "#fffaf0";
export const GANG2: Record<GangWho, { name: string; role: string; body: string; line: string }> = {
  pucky: { name: "Pucky", role: "the hype man – cocky, loud, lives for goals", body: "#d94b3b", line: "\"Shoot ME! I'm open!\"" },
  biscuit: { name: "Biscuit", role: "walrus goalie – grumpy, sarcastic, never leaves the crease", body: "#e0a526", line: "\"Wow. A goal. Thrilling.\"" },
  zam: { name: "Zam", role: "the ice machine – host, naive peacemaker", body: "#3b82f6", line: "\"Fresh ice, fresh start!\"" },
  helmy: { name: "Helmy", role: "the helmet – stats nerd, safety first", body: "#2a9d8f", line: "\"Statistically… that's a penalty.\"" },
  clubby: { name: "Clubby", role: "the stick – old-school veteran", body: "#5a8f3e", line: "\"Back in my day…\"" },
  agenty: { name: "Agenty", role: "the clipboard – fast-talking scout", body: "#4c1d95", line: "\"Kid, sign here.\"" },
};

/** Face (eyes/brows/mouth from the stick kit) re-positioned onto a custom head. */
const Face: React.FC<{ mood: StickMood; blink: boolean; open: number; x?: number; y?: number; s?: number; brows?: string; bushy?: boolean; big?: boolean; noMouth?: boolean }> = ({ mood, blink, open, x = 0, y = 0, s = 1, brows, bushy, big, noMouth }) => (
  <g transform={`translate(${x} ${y + 245 * s}) scale(${s})`}>
    <Eyes mood={mood} blink={blink} big={big} />
    <Brows mood={mood} color={brows} bushy={bushy} />
    {!noMouth && <Mouth mood={mood} open={open} />}
  </g>
);

const Head: React.FC<{ who: GangWho; mood: StickMood; blink: boolean; open: number; t: number }> = ({ who, mood, blink, open, t }) => {
  switch (who) {
    case "pucky": return (<g>
      <ellipse cx={0} cy={-200} rx={112} ry={34} fill="#111" stroke={INK} strokeWidth={9} />
      <path d="M-112 -290 L-112 -200 A112 34 0 0 0 112 -200 L112 -290 Z" fill="#1c1c1c" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
      <ellipse cx={0} cy={-290} rx={112} ry={34} fill="#333" stroke={INK} strokeWidth={9} />
      <rect x={-112} y={-292} width={224} height={26} fill="#d94b3b" />
      <path d={`M100 -282 Q140 ${-300 + Math.sin(t * 8) * 8} 168 ${-292 + Math.sin(t * 8) * 12} M100 -276 Q136 ${-270 + Math.sin(t * 8 + 1) * 8} 160 ${-262 + Math.sin(t * 8 + 1) * 12}`} stroke="#d94b3b" strokeWidth={12} fill="none" strokeLinecap="round" />
      {[-29, 29].map((x) => <circle key={x} cx={x} cy={-252} r={25} fill="#fff" stroke={INK} strokeWidth={5} />)}
      <Face mood={mood} blink={blink} open={open} y={-245 + 0} s={0.9} big />
      {open < 0.05 && mood !== "sad" && <rect x={-6} y={-222} width={12} height={10} fill="#111" />}
    </g>);
    case "biscuit": return (<g>
      <ellipse cx={0} cy={-250} rx={108} ry={104} fill="#9a6324" stroke={INK} strokeWidth={9} />
      <path d="M-78 -330 Q0 -380 78 -330 L72 -246 Q0 -232 -72 -246 Z" fill="#f8fafc" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
      {[-46, -16, 16, 46].map((x) => <path key={x} d={`M${x} -340 L${x} -248`} stroke="#94a3b8" strokeWidth={6} />)}
      <Face mood={mood} blink={blink} open={0} y={-300} s={0.8} brows="#64748b" bushy noMouth />
      <ellipse cx={0} cy={-205} rx={62} ry={38} fill="#d9b382" stroke={INK} strokeWidth={6} />
      {[-30, -12, 12, 30].map((x) => <circle key={x} cx={x} cy={-212} r={4} fill="#5b3a17" />)}
      <g transform="translate(0 30)"><Mouth mood={mood} open={open} /></g>
      {[-22, 22].map((x) => <path key={x} d={`M${x} -180 L${x * 1.1} -110`} stroke="#fff" strokeWidth={14} strokeLinecap="round" />)}
      {[-22, 22].map((x) => <path key={`o${x}`} d={`M${x} -180 L${x * 1.1} -110`} stroke={INK} strokeWidth={20} strokeLinecap="round" opacity={0.15} />)}
    </g>);
    case "helmy": return (<g>
      <path d="M-104 -230 Q-110 -360 0 -366 Q110 -360 104 -230 L104 -190 L-104 -190 Z" fill="#1f6f78" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
      {[-40, 0, 40].map((x) => <path key={x} d={`M${x} -360 L${x} -320`} stroke="#0f3f45" strokeWidth={8} strokeLinecap="round" />)}
      <ellipse cx={0} cy={-232} rx={84} ry={70} fill={SKIN} stroke={INK} strokeWidth={6} />
      <Face mood={mood} blink={blink} open={open} y={-245} s={0.8} big />
      <path d="M-100 -290 L100 -290 L92 -214 Q0 -196 -92 -214 Z" fill="#bae6fd" opacity={0.45} stroke="#e0f2fe" strokeWidth={6} />
      <path d="M-70 -280 L-30 -280" stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.8} />
      <rect x={66} y={-336} width={40} height={26} rx={4} fill="#f59e0b" stroke={INK} strokeWidth={4} transform="rotate(14 86 -323)" />
      <path d={`M-96 -200 Q-60 ${-150 + open * 14} 0 ${-146 + open * 16} Q60 ${-150 + open * 14} 96 -200`} stroke={INK} strokeWidth={6} fill="none" />
    </g>);
    case "clubby": return (<g>
      <rect x={-64} y={-372} width={128} height={70} rx={14} fill="#111" stroke={INK} strokeWidth={8} />
      {[-40, -14, 12, 38].map((x) => <path key={x} d={`M${x} -366 L${x + 10} -308`} stroke="#555" strokeWidth={6} />)}
      <rect x={-72} y={-310} width={144} height={190} rx={20} fill="#d6a46a" stroke={INK} strokeWidth={9} />
      {[-40, -6, 30].map((x) => <path key={x} d={`M${x} -300 Q${x + 8} -220 ${x - 4} -130`} stroke="#a8763d" strokeWidth={4} fill="none" />)}
      <Face mood={mood} blink={blink} open={open} y={-262} s={0.72} brows="#3f2a14" bushy />
      <rect x={-72} y={-160} width={144} height={16} fill="#f8fafc" stroke={INK} strokeWidth={3} transform="rotate(-6 0 -152)" />
      <path d="M-62 -232 Q-44 -246 -30 -228" stroke="#3f2a14" strokeWidth={6} fill="none" />
    </g>);
    case "agenty": return (<g>
      <rect x={-100} y={-350} width={200} height={232} rx={14} fill="#a8794b" stroke={INK} strokeWidth={9} />
      <rect x={-82} y={-326} width={164} height={196} rx={6} fill="#fdfcf8" stroke={INK} strokeWidth={4} />
      {[0, 1, 2].map((i) => <g key={i}><rect x={-66} y={-178 + i * 16} width={10} height={10} fill="none" stroke="#475569" strokeWidth={3} /><path d={`M-50 ${-173 + i * 16} L40 ${-173 + i * 16}`} stroke="#94a3b8" strokeWidth={4} /></g>)}
      <rect x={-44} y={-370} width={88} height={36} rx={10} fill="#cbd5e1" stroke={INK} strokeWidth={6} />
      <g><rect x={-64} y={-350} width={52} height={22} rx={8} fill="#111" /><rect x={12} y={-350} width={52} height={22} rx={8} fill="#111" /><path d="M-12 -340 L12 -340" stroke="#111" strokeWidth={5} /></g>
      <Face mood={mood} blink={blink} open={open} y={-282} s={0.72} />
      <path d="M84 -300 L120 -380" stroke="#f59e0b" strokeWidth={10} strokeLinecap="round" />
    </g>);
    case "zam": return (<g>
      <rect x={-70} y={-376} width={140} height={78} rx={18} fill="#cfe8ff" stroke={INK} strokeWidth={8} />
      <path d="M-40 -364 L-10 -312" stroke="#fff" strokeWidth={10} strokeLinecap="round" />
      <rect x={-14} y={-398} width={28} height={22} rx={6} fill="#f59e0b" stroke={INK} strokeWidth={5} />
      <rect x={-130} y={-302} width={260} height={150} rx={42} fill="#3b82f6" stroke={INK} strokeWidth={9} />
      <rect x={-130} y={-190} width={260} height={18} fill="#2563eb" />
      <Face mood={mood} blink={blink} open={open} y={-262} s={0.85} big />
      <circle cx={106} cy={-278} r={18} fill="#fcd34d" stroke={INK} strokeWidth={5} />
    </g>);
  }
};

export const GangPerson: React.FC<{ who: GangWho; size?: number; mood?: StickMood; pose?: StickPose; open?: number; arms?: [number, number, number, number]; skate?: number; lean?: number; seed?: number; sitting?: boolean; flip?: boolean; hold?: React.ReactNode }> = ({ who, size = 300, mood = "talk", pose = "idle", open = 0, arms, skate, lean = 0, seed = 0, sitting, flip, hold }) => {
  const f = useCurrentFrame();
  const t = f / 60;
  const breathe = Math.sin((f + seed * 17) / 22) * 3;
  const blink = (f + seed * 31) % 170 < 5;
  const c = GANG2[who].body;
  const tw = who === "biscuit" ? 100 : who === "zam" ? 96 : 72;
  const [lx, ly, rx, ry] = arms ?? ARMS[pose];
  const wave = pose === "wave" ? Math.sin(f / 5) * 18 : 0;
  const legY = sitting ? 40 : 150;
  const torso = `M${-tw} -120 Q${-tw} -172 0 -172 Q${tw} -172 ${tw} -120 L${tw} -5 Q${tw} 26 0 26 Q${-tw} 26 ${-tw} -5 Z`;
  return (
    <svg width={size} height={size * 1.3} viewBox="-200 -400 400 520" style={{ overflow: "visible", transform: flip ? "scaleX(-1)" : undefined }}>
      <g transform={`translate(0 ${breathe * 0.3}) rotate(${lean} 0 150)`}>
        {who === "zam" ? (
          <g>{[-1, 1].map((s) => <g key={s}><circle cx={s * 70} cy={110} r={40} fill="#1f2937" stroke={INK} strokeWidth={8} /><circle cx={s * 70} cy={110} r={14} fill="#94a3b8" /></g>)}<rect x={-160} y={146} width={320} height={10} rx={5} fill="#93c5fd" /></g>
        ) : [-1, 1].map((s) => { const ph = skate === undefined ? 0 : Math.sin(skate + (s > 0 ? Math.PI : 0)); const FX = s * 42 + ph * 46, FY = legY - (skate === undefined ? 0 : Math.max(0, ph) * 26); return (
          <g key={s}>
            {sitting ? <path d={`M${s * 26} 0 L${s * 70} 30 L${s * 74} 130`} stroke={INK} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : <path d={`M${s * 26} 0 L${FX} ${FY}`} stroke={INK} strokeWidth={10} strokeLinecap="round" />}
            {who === "biscuit" && <rect x={(sitting ? s * 74 : FX) - 26} y={sitting ? 40 : FY - 120} width={52} height={sitting ? 96 : 116} rx={14} fill="#f8fafc" stroke={INK} strokeWidth={5} />}
            {who === "clubby" && !sitting && <path d={`M${FX - 10} ${FY - 4} L${FX + s * 60} ${FY - 4}`} stroke="#111" strokeWidth={22} strokeLinecap="round" />}
            <path d={`M${(sitting ? s * 74 : FX) - 22} ${sitting ? 140 : FY + 8} L${(sitting ? s * 74 : FX) + 26} ${sitting ? 140 : FY + 8}`} stroke="#94a3b8" strokeWidth={6} strokeLinecap="round" />
            <rect x={(sitting ? s * 74 : FX) - 20} y={sitting ? 122 : FY - 12} width={42} height={16} rx={6} fill={INK} />
          </g>); })}
        {pose !== "crossed" && <g transform={who === "zam" ? "translate(0 110)" : undefined}>
          <path d={`M${-tw + 6} -135 L${lx} ${ly}`} stroke={INK} strokeWidth={10} strokeLinecap="round" />
          <path d={`M${tw - 6} -135 L${rx + wave} ${ry}`} stroke={INK} strokeWidth={10} strokeLinecap="round" />
          <circle cx={lx} cy={ly} r={13} fill={SKIN} stroke={INK} strokeWidth={5} />
          <circle cx={rx + wave} cy={ry} r={13} fill={SKIN} stroke={INK} strokeWidth={5} />
          {hold && <g transform={`translate(${rx + wave} ${ry})`}>{hold}</g>}
        </g>}
        {who !== "zam" && <>
          <defs><clipPath id={`gc${who}${seed}`}><path d={torso} /></clipPath></defs>
          <path d={torso} fill={c} />
          <g clipPath={`url(#gc${who}${seed})`}>
            {[...Array(16)].map((_, i) => <rect key={i} x={-tw + i * 13} y={-180} width={4} height={220} fill="#00000018" />)}
            <rect x={-tw} y={-180} width={tw * 0.6} height={220} fill="#ffffff22" />
            {who === "pucky" && <text x={0} y={-60} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={60} fill="#fff">★</text>}
            {who === "biscuit" && <><path d={`M${-tw} -110 Q0 -90 ${tw} -110 M${-tw} -60 Q0 -40 ${tw} -60`} stroke="#b45309" strokeWidth={6} fill="none" /><text x={0} y={-10} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={40} fill="#fff">1</text></>}
            {who === "helmy" && <><rect x={-tw} y={-90} width={tw * 2} height={14} fill="#fff" /><text x={0} y={-30} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={34} fill="#fff">STATS</text></>}
            {who === "clubby" && <><rect x={-6} y={-180} width={12} height={220} fill="#3f6b2a" />{[-50, -20, 20, 50].map((x) => <circle key={x} cx={x > 0 ? 18 : -18} cy={-120 + Math.abs(x) * 1.6} r={6} fill="#fef3c7" />)}</>}
            {who === "agenty" && <><path d="M-30 -172 L0 -120 L30 -172 Z" fill="#fff" /><path d="M-10 -150 L10 -150 L18 -40 L0 -20 L-18 -40 Z" fill="#8b5cf6" stroke={INK} strokeWidth={4} /></>}
          </g>
          <path d={torso} fill="none" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
        </>}
        {pose === "crossed" && <>
          <path d={`M${-tw + 6} -135 L-10 -70 L40 -95`} stroke={INK} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d={`M${tw - 6} -135 L10 -80 L-40 -95`} stroke={INK} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </>}
        <g transform={who === "zam" ? "translate(0 240)" : undefined}><Head who={who} mood={mood} blink={blink} open={open} t={t} /></g>
      </g>
    </svg>
  );
};
