/** ZAM 2.0 "Hockey Life" cast (prototype, option C): flat cel-shaded stick people with round heads, dot eyes and
 *  thin ink limbs. Identity is locked per character (silhouette, colour, accessory); acting varies via mood + pose.
 *  Pucky (living puck) and Zam (ice machine) stay as the code-drawn mascots from Gang.tsx. */
import React from "react";
import { useCurrentFrame } from "remotion";

export type StickWho = "rookie" | "walt" | "gus" | "ref";
export type StickMood = "talk" | "happy" | "grumpy" | "shock" | "smug" | "sad";
export type StickPose = "idle" | "wave" | "point" | "crossed" | "up" | "shrug";
const INK = "#2b2622", SKIN = "#fffaf0";

/** Identity blocks – keep these fixed across every episode. */
export const CAST: Record<StickWho, { name: string; trait: string; line: string; color: string; voice?: string }> = {
  rookie: { name: "The Rookie", trait: "19, naive, way too excited", line: "\"Is this MY locker?!\"", color: "#2a9d8f" },
  walt: { name: "Big Walt", trait: "30-year goalie, grumpy, won't leave the net", line: "\"This crease is my home.\"", color: "#e0a526" },
  gus: { name: "Coach Gus", trait: "old-school yeller, back in my day…", line: "\"In MY day we skated uphill!\"", color: "#d94b3b" },
  ref: { name: "The Ref", trait: "painfully polite, hates conflict", line: "\"Sorry… penalty? If that's okay?\"", color: "#334155" },
};

const Eyes: React.FC<{ mood: StickMood; blink: boolean; big?: boolean }> = ({ mood, blink, big }) => {
  const ex = 32, ey = -252, r = big ? 11 : 9;
  if (blink && mood !== "shock") return <>{[-1, 1].map((s) => <path key={s} d={`M${s * ex - 12} ${ey} L${s * ex + 12} ${ey}`} stroke={INK} strokeWidth={6} strokeLinecap="round" />)}</>;
  if (mood === "happy") return <>{[-1, 1].map((s) => <path key={s} d={`M${s * ex - 14} ${ey + 4} Q${s * ex} ${ey - 14} ${s * ex + 14} ${ey + 4}`} stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />)}</>;
  if (mood === "shock") return <>{[-1, 1].map((s) => <g key={s}><circle cx={s * ex} cy={ey} r={19} fill="#fff" stroke={INK} strokeWidth={5} /><circle cx={s * ex} cy={ey} r={6} fill={INK} /></g>)}</>;
  if (mood === "smug") return <>{[-1, 1].map((s) => <g key={s}><circle cx={s * ex} cy={ey + 2} r={r} fill={INK} /><rect x={s * ex - 15} y={ey - 16} width={30} height={14} fill={SKIN} /><path d={`M${s * ex - 14} ${ey - 2} L${s * ex + 14} ${ey - 2}`} stroke={INK} strokeWidth={5} strokeLinecap="round" /></g>)}</>;
  return <>{[-1, 1].map((s) => <g key={s}><circle cx={s * ex} cy={ey} r={r} fill={INK} />{big && <circle cx={s * ex + 3} cy={ey - 4} r={3.5} fill="#fff" />}</g>)}</>;
};
const Brows: React.FC<{ mood: StickMood; color?: string; bushy?: boolean }> = ({ mood, color = INK, bushy }) => {
  const w = bushy ? 11 : 6, y = -278;
  const tilt = mood === "grumpy" ? 9 : mood === "sad" ? -8 : mood === "shock" ? 0 : mood === "smug" ? 0 : 0;
  const lift = mood === "shock" ? -14 : 0;
  return <>{[-1, 1].map((s) => <path key={s} d={`M${s * 18} ${y + lift + tilt} L${s * 48} ${y + lift - tilt + (mood === "smug" && s > 0 ? -10 : 0)}`} stroke={color} strokeWidth={w} strokeLinecap="round" />)}</>;
};
const Mouth: React.FC<{ mood: StickMood; open: number }> = ({ mood, open }) => {
  const y = -208;
  if (open > 0.05) return <ellipse cx={0} cy={y + 4} rx={18 + open * 6} ry={6 + open * 18} fill="#7f1d1d" stroke={INK} strokeWidth={5} />;
  if (mood === "happy") return <path d={`M-26 ${y - 4} Q0 ${y + 24} 26 ${y - 4} Z`} fill="#7f1d1d" stroke={INK} strokeWidth={5} strokeLinejoin="round" />;
  if (mood === "grumpy" || mood === "sad") return <path d={`M-20 ${y + 8} Q0 ${y - 8} 20 ${y + 8}`} stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />;
  if (mood === "shock") return <ellipse cx={0} cy={y + 4} rx={12} ry={16} fill="#7f1d1d" stroke={INK} strokeWidth={5} />;
  if (mood === "smug") return <path d={`M-18 ${y + 2} Q8 ${y + 10} 24 ${y - 8}`} stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />;
  return <path d={`M-16 ${y} Q0 ${y + 10} 16 ${y}`} stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />;
};
const ARMS: Record<StickPose, [number, number, number, number]> = { // [lx, ly, rx, ry] hand positions (shoulders at ±w, -140)
  idle: [-78, -30, 78, -30], wave: [-78, -30, 120, -250], point: [-78, -30, 175, -150], crossed: [40, -95, -40, -95], up: [-120, -260, 120, -260], shrug: [-130, -170, 130, -170],
};

export const StickPerson: React.FC<{ who: StickWho; size?: number; mood?: StickMood; pose?: StickPose; open?: number; flip?: boolean; seed?: number; sitting?: boolean; shades?: boolean; hold?: React.ReactNode; arms?: [number, number, number, number]; skate?: number; lean?: number; headTurn?: number; headTilt?: number; bean?: boolean }> = ({ who, size = 300, mood = "talk", pose = "idle", open = 0, flip, seed = 0, sitting, shades, hold, arms, skate, lean = 0, headTurn = 0, headTilt = 0, bean = false }) => {
  const f = useCurrentFrame();
  const breathe = Math.sin((f + seed * 17) / 22) * 3;
  const blink = (f + seed * 31) % 170 < 5;
  const c = CAST[who].color;
  const tw = bean ? (who === "walt" ? 104 : 72) : who === "walt" ? 92 : 58; // half torso width
  const [lx, ly, rx, ry] = arms ?? ARMS[pose];
  const torsoD = bean ? `M${-tw} -120 Q${-tw} -172 0 -172 Q${tw} -172 ${tw} -120 L${tw} -5 Q${tw} 26 0 26 Q${-tw} 26 ${-tw} -5 Z` : `M${-tw} -150 Q0 -165 ${tw} -150 L${tw - 8} 10 L${-tw + 8} 10 Z`;
  const wave = pose === "wave" ? Math.sin(f / 5) * 18 : 0;
  const legY = sitting ? 40 : 150;
  return (
    <svg width={size} height={size * 1.3} viewBox="-200 -400 400 520" style={{ overflow: "visible", transform: flip ? "scaleX(-1)" : undefined }}>
      <g transform={`translate(0 ${breathe * 0.3}) rotate(${lean} 0 150)`}>
        {/* legs + skates */}
        {[-1, 1].map((s) => { const ph = skate === undefined ? 0 : Math.sin(skate + (s > 0 ? Math.PI : 0)); const FX = s * 42 + ph * 46; const FY = legY - (skate === undefined ? 0 : Math.max(0, ph) * 26); return (
          <g key={s}>
            {sitting ? <path d={`M${s * 26} 0 L${s * 70} 30 L${s * 74} 130`} stroke={INK} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : <path d={`M${s * 26} 0 L${FX} ${FY}`} stroke={INK} strokeWidth={10} strokeLinecap="round" />}
            {who === "walt" && <rect x={(sitting ? s * 74 : FX) - 26} y={sitting ? 40 : FY - 120} width={52} height={sitting ? 96 : 116} rx={14} fill="#f8fafc" stroke={INK} strokeWidth={5} />}
            <path d={`M${(sitting ? s * 74 : FX) - 22} ${sitting ? 140 : FY + 8} L${(sitting ? s * 74 : FX) + 26} ${sitting ? 140 : FY + 8}`} stroke="#94a3b8" strokeWidth={6} strokeLinecap="round" />
            <rect x={(sitting ? s * 74 : FX) - 20} y={sitting ? 122 : FY - 12} width={42} height={16} rx={6} fill={INK} />
          </g>
        ); })}
        {/* arms (behind torso when crossed is drawn after) */}
        {pose !== "crossed" && <>
          <path d={`M${-tw + 6} -135 L${lx} ${ly}`} stroke={INK} strokeWidth={10} strokeLinecap="round" />
          <path d={`M${tw - 6} -135 L${rx + wave} ${ry}`} stroke={INK} strokeWidth={10} strokeLinecap="round" />
          <circle cx={lx} cy={ly} r={13} fill={SKIN} stroke={INK} strokeWidth={5} />
          <circle cx={rx + wave} cy={ry} r={13} fill={SKIN} stroke={INK} strokeWidth={5} />
        </>}
        {hold && pose !== "crossed" && <g transform={`translate(${rx + wave} ${ry})`}>{hold}</g>}
        {/* torso */}
        <defs><clipPath id={`tc${who}${seed}`}><path d={torsoD} /></clipPath></defs>
        <path d={torsoD} fill={c} />
        <g clipPath={`url(#tc${who}${seed})`}>
          {who === "ref" && [...Array(8)].map((_, i) => <rect key={i} x={-tw + i * 18} y={-170} width={9} height={190} fill="#f8fafc" />)}
          {who === "rookie" && <><rect x={-tw} y={-60} width={tw * 2} height={14} fill="#fff" /><text x={0} y={-80} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={54} fill="#fff">00</text></>}
          {who === "walt" && <><path d={`M${-tw} -110 Q0 -90 ${tw} -110 M${-tw} -60 Q0 -40 ${tw} -60`} stroke="#b45309" strokeWidth={6} fill="none" /><text x={0} y={-15} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={40} fill="#fff">30</text></>}
          {who === "gus" && <><rect x={-3} y={-170} width={6} height={190} fill="#fff" /><rect x={-tw} y={-20} width={tw * 2} height={30} fill="#7f1d1d" /></>}
          {bean && [...Array(14)].map((_, i) => <rect key={`fs${i}`} x={-tw + i * 13} y={-180} width={4} height={220} fill="#00000018" />)}
          {bean && <rect x={-tw} y={-180} width={tw * 0.6} height={220} fill="#ffffff22" />}
          <rect x={-tw} y={-10} width={tw * 2} height={30} fill="#00000022" />
        </g>
        <path d={torsoD} fill="none" stroke={INK} strokeWidth={bean ? 9 : 6} strokeLinejoin="round" />
        {who === "ref" && [-1, 1].map((s) => <rect key={s} x={s * tw - (s > 0 ? 18 : 0) - 0} y={-140} width={18} height={26} fill="#f97316" stroke={INK} strokeWidth={4} />)}
        {who === "gus" && <><path d="M-30 -158 Q0 -100 30 -158" stroke="#94a3b8" strokeWidth={4} fill="none" /><rect x={-14} y={-112} width={28} height={16} rx={6} fill="#cbd5e1" stroke={INK} strokeWidth={4} /></>}
        {pose === "crossed" && <>
          <path d={`M${-tw + 6} -135 L-10 -70 L${lx} ${ly}`} stroke={INK} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d={`M${tw - 6} -135 L10 -80 L${rx} ${ry}`} stroke={INK} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </>}
        {/* head */}
        <g transform={`rotate(${(mood === "smug" ? -4 : mood === "sad" ? 5 : 0) + headTilt} 0 -170)`}>
          {who === "rookie" && <path d="M-70 -300 L-55 -345 L-30 -318 L-10 -360 L12 -320 L38 -352 L48 -312 L74 -330 L68 -290 Z" fill="#7c4a1e" stroke={INK} strokeWidth={5} strokeLinejoin="round" />}
          {bean ? <ellipse cx={0} cy={-250} rx={92} ry={102} fill={SKIN} stroke={INK} strokeWidth={9} /> : <circle cx={0} cy={-245} r={86} fill={SKIN} stroke={INK} strokeWidth={7} />}
          {who === "rookie" && <path d="M-78 -270 Q-40 -330 0 -318 Q40 -330 78 -270 Q40 -300 0 -296 Q-40 -300 -78 -270 Z" fill="#7c4a1e" />}
          {who === "gus" && <><path d="M-86 -250 Q-96 -210 -74 -196 M86 -250 Q96 -210 74 -196" stroke="#cbd5e1" strokeWidth={18} strokeLinecap="round" fill="none" /><path d="M-90 -282 Q0 -372 90 -282 Z" fill="#1e3a8a" stroke={INK} strokeWidth={6} strokeLinejoin="round" /><path d="M10 -284 Q80 -292 130 -270 L90 -268 Z" fill="#1e3a8a" stroke={INK} strokeWidth={5} /><text x={0} y={-300} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={30} fill="#fde047">C</text></>}
          {who === "ref" && <path d="M-80 -268 Q-60 -340 10 -334 Q70 -330 84 -270 Q50 -310 -10 -300 Z" fill={INK} />}
          {who === "walt" && <><g transform="translate(0 -352) rotate(-8)"><rect x={-72} y={-46} width={144} height={92} rx={40} fill="#f8fafc" stroke={INK} strokeWidth={6} />{[-36, 0, 36].map((x) => <path key={x} d={`M${x} -30 L${x} 30`} stroke="#94a3b8" strokeWidth={6} />)}<path d="M-60 0 L60 0" stroke="#94a3b8" strokeWidth={6} /></g>{[...Array(10)].map((_, i) => <circle key={i} cx={-48 + (i % 5) * 24} cy={-182 + Math.floor(i / 5) * 12} r={2.5} fill="#94a3b8" />)}</>}
          <g transform={`translate(${headTurn} 0)`}><Eyes mood={mood} blink={blink} big={who === "rookie"} />
          <Brows mood={mood} color={who === "walt" || who === "gus" ? "#94a3b8" : INK} bushy={who === "walt" || who === "gus"} />
          {who === "gus" && <ellipse cx={0} cy={-226} rx={13} ry={10} fill="#fca5a5" stroke={INK} strokeWidth={4} />}
          {shades && <g><rect x={-62} y={-272} width={52} height={36} rx={12} fill="#111" /><rect x={10} y={-272} width={52} height={36} rx={12} fill="#111" /><path d="M-10 -258 L10 -258" stroke="#111" strokeWidth={6} /><path d="M-52 -264 L-30 -264" stroke="#ffffff88" strokeWidth={4} /></g>}
          <Mouth mood={mood} open={open} /></g>
          {who === "walt" && <path d="M-46 -222 Q-24 -240 0 -226 Q24 -240 46 -222 Q30 -206 0 -214 Q-30 -206 -46 -222 Z" fill="#cbd5e1" stroke={INK} strokeWidth={4} />}
          {who === "ref" && mood !== "smug" && <path d="M70 -300 Q82 -282 72 -270 Q60 -282 70 -300 Z" fill="#7dd3fc" stroke={INK} strokeWidth={3} />}
          {(mood === "happy" || who === "rookie") && [-1, 1].map((s) => <ellipse key={s} cx={s * 52} cy={-222} rx={14} ry={8} fill="#fca5a5" opacity={0.75} />)}
        </g>
      </g>
    </svg>
  );
};
