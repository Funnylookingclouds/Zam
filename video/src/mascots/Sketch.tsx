/** First sketches of the ZAM gang (Zam, Pucky, Biscuit, Helmy, Clubby) – code-drawn paper-sticker style. */
import React from "react";
import { AbsoluteFill } from "remotion";
import { P, HAND } from "../presenter/kit";
import { FONT } from "../theme";

const Sticker: React.FC<{ children: React.ReactNode; label: string; sub: string }> = ({ children, label, sub }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 340 }}>
    <div style={{ width: 320, height: 320, borderRadius: "50%", background: P.paper2, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 24px #0005" }}>{children}</div>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 46, marginTop: 18, color: "#fff" }}>{label}</div>
    <div style={{ fontFamily: HAND, fontSize: 34, color: "#cfe8ff", textAlign: "center" }}>{sub}</div>
  </div>
);
const Eyes: React.FC<{ y?: number }> = ({ y = -10 }) => (
  <>{[-30, 30].map((x) => <g key={x}><ellipse cx={x} cy={y} rx={18} ry={22} fill="#fff" stroke={P.ink} strokeWidth={5} /><circle cx={x + 4} cy={y + 3} r={9} fill={P.ink} /><circle cx={x} cy={y - 2} r={3} fill="#fff" /></g>)}</>
);

/** 1. "Pucky" – a hockey puck with a gap-tooth grin and a headband */
const Pucky = () => (
  <svg width={280} height={280} viewBox="-140 -140 280 280">
    <ellipse cx={0} cy={40} rx={110} ry={40} fill="#111" stroke={P.ink} strokeWidth={5} />
    <rect x={-110} y={-40} width={220} height={80} fill="#1c1c1c" />
    <ellipse cx={0} cy={-40} rx={110} ry={40} fill="#2b2b2b" stroke={P.ink} strokeWidth={5} />
    <rect x={-110} y={-62} width={220} height={16} fill={P.red} />
    <Eyes y={-8} />
    <path d="M-40 26 Q0 60 40 26 Z" fill="#7f1d1d" stroke={P.ink} strokeWidth={4} />
    <rect x={-8} y={26} width={10} height={12} fill="#fff" stroke={P.ink} strokeWidth={2} />
    <path d="M-125 -10 Q-150 -40 -135 -70 M125 -10 Q150 -40 135 -70" stroke={P.ink} strokeWidth={8} fill="none" strokeLinecap="round" />
  </svg>
);
/** 2. "Zam" – a happy ice resurfacer (Zamboni-style machine, generic) */
const Zam = () => (
  <svg width={290} height={260} viewBox="-150 -120 300 250">
    <rect x={-120} y={-40} width={240} height={110} rx={24} fill="#3b82f6" stroke={P.ink} strokeWidth={5} />
    <rect x={-60} y={-100} width={120} height={70} rx={14} fill="#bfdbfe" stroke={P.ink} strokeWidth={5} />
    <Eyes y={10} />
    <path d="M-35 42 Q0 70 35 42" stroke={P.ink} strokeWidth={6} fill="none" strokeLinecap="round" />
    {[-80, 80].map((x) => <circle key={x} cx={x} cy={80} r={26} fill="#222" stroke={P.ink} strokeWidth={5} />)}
    <path d="M-140 100 H140" stroke="#93c5fd" strokeWidth={10} strokeLinecap="round" />
  </svg>
);
/** 3. "Biscuit the Walrus" – goalie mask walrus */
const Walrus = () => (
  <svg width={280} height={280} viewBox="-140 -140 280 280">
    <circle r={110} fill="#a16207" stroke={P.ink} strokeWidth={5} />
    <path d="M-70 -90 Q0 -130 70 -90 L80 -10 Q0 10 -80 -10 Z" fill="#f8fafc" stroke={P.ink} strokeWidth={5} />
    {[-50, -20, 10, 40].map((x) => <line key={x} x1={x} y1={-95} x2={x + 6} y2={-15} stroke={P.ink} strokeWidth={3} />)}
    <Eyes y={-45} />
    <ellipse cx={0} cy={30} rx={55} ry={34} fill="#d6a76a" stroke={P.ink} strokeWidth={5} />
    <path d="M-22 50 L-26 110 M22 50 L26 110" stroke="#fff" strokeWidth={14} strokeLinecap="round" />
    <path d="M-22 50 L-26 110 M22 50 L26 110" stroke={P.ink} strokeWidth={3} fill="none" />
  </svg>
);

/** 4. "Helmy" – hockey helmet, visor face, flapping chin strap (stats nerd) */
const Helmy = () => (
  <svg width={280} height={280} viewBox="-140 -140 280 280">
    {/* shell */}
    <path d="M-105 40 Q-115 -95 0 -110 Q115 -95 105 40 L80 50 L80 10 L-80 10 L-80 50 Z" fill={P.teal} stroke={P.ink} strokeWidth={5} strokeLinejoin="round" />
    {/* vent ridges */}
    {[-40, 0, 40].map((x) => <path key={x} d={`M${x} -100 L${x * 0.9} -70`} stroke={P.ink} strokeWidth={6} strokeLinecap="round" />)}
    {/* stat sticker */}
    <rect x={62} y={-62} width={34} height={24} rx={4} fill={P.mustard} stroke={P.ink} strokeWidth={3} transform="rotate(14 79 -50)" />
    <text x={79} y={-44} fontSize={15} fontWeight={900} textAnchor="middle" fill={P.ink} transform="rotate(14 79 -50)">#1</text>
    {/* visor */}
    <path d="M-92 -40 Q0 -62 92 -40 L86 28 Q0 46 -86 28 Z" fill="#d6f3f6" fillOpacity={0.85} stroke={P.ink} strokeWidth={5} />
    <Eyes y={-6} />
    <path d="M-70 -34 L-40 -42" stroke="#fff" strokeWidth={7} strokeLinecap="round" opacity={0.9} />
    {/* smug-smart mouth under the visor */}
    <path d="M-22 62 Q0 76 26 58" stroke={P.ink} strokeWidth={6} fill="none" strokeLinecap="round" />
    {/* chin strap */}
    <path d="M-80 46 Q-60 110 0 108 Q60 110 80 46" stroke={P.ink} strokeWidth={7} fill="none" />
    <rect x={-12} y={100} width={24} height={16} rx={4} fill="#ddd" stroke={P.ink} strokeWidth={3} />
  </svg>
);
/** 5. "Clubby" – old-school hockey stick, taped blade, bushy brows */
const Clubby = () => (
  <svg width={280} height={280} viewBox="-140 -140 280 280">
    {/* shaft */}
    <path d="M-34 -128 L34 -128 L30 70 L-30 70 Z" fill="#d9a55f" stroke={P.ink} strokeWidth={5} strokeLinejoin="round" />
    {/* wood grain */}
    <path d="M-14 -110 Q-8 -40 -16 40 M14 -90 Q20 -20 12 50" stroke="#a8733a" strokeWidth={3} fill="none" />
    {/* knob tape */}
    <rect x={-37} y={-138} width={74} height={30} rx={6} fill="#222" stroke={P.ink} strokeWidth={4} />
    {[-24, -8, 8, 24].map((x) => <line key={x} x1={x} y1={-136} x2={x + 6} y2={-110} stroke="#555" strokeWidth={3} />)}
    {/* blade (feet) */}
    <path d="M-30 70 L30 70 L38 96 Q40 112 20 114 L-110 114 Q-122 112 -118 98 L-102 90 L-30 88 Z" fill="#222" stroke={P.ink} strokeWidth={5} strokeLinejoin="round" />
    {[-90, -66, -42, -18, 6].map((x) => <line key={x} x1={x} y1={92} x2={x + 10} y2={112} stroke="#fff" strokeWidth={2.5} opacity={0.55} />)}
    {/* bushy brows + eyes */}
    <path d="M-52 -60 Q-30 -76 -8 -62 M8 -62 Q30 -76 52 -60" stroke={P.ink} strokeWidth={11} fill="none" strokeLinecap="round" />
    <Eyes y={-34} />
    {/* grumpy-veteran grin with a gap */}
    <path d="M-22 14 Q0 30 22 14" stroke={P.ink} strokeWidth={6} fill="none" strokeLinecap="round" />
    {/* repair-tape scar */}
    <rect x={-32} y={34} width={64} height={14} fill="#f8fafc" stroke={P.ink} strokeWidth={3} transform="rotate(-12 0 41)" />
    {/* little arms */}
    <path d="M-34 -6 Q-70 -10 -84 -40 M34 -6 Q70 0 82 -30" stroke={P.ink} strokeWidth={8} fill="none" strokeLinecap="round" />
  </svg>
);

export const HockeyMascots: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg,#0b2545,#13315c)", alignItems: "center", justifyContent: "center", gap: 40 }}>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: "#fff" }}>Meet the ZAM gang</div>
    <div style={{ display: "flex", gap: 30 }}>
      <Sticker label="Pucky" sub="cocky puck, gap-tooth grin">{<Pucky />}</Sticker>
      <Sticker label="Zam" sub="cheerful ice machine">{<Zam />}</Sticker>
      <Sticker label="Biscuit" sub="walrus goalie">{<Walrus />}</Sticker>
    </div>
    <div style={{ display: "flex", gap: 30 }}>
      <Sticker label="Helmy" sub="helmet, stats nerd">{<Helmy />}</Sticker>
      <Sticker label="Clubby" sub="old-school stick">{<Clubby />}</Sticker>
    </div>
  </AbsoluteFill>
);
