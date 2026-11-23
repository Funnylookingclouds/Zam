/** Series icons (1080×1080, circle-safe): Wildest Moments, Daily Facts, Special Edition. */
import React from "react";
import { AbsoluteFill, random } from "remotion";
import { P, HAND, tornPath } from "../presenter/kit";
import { FONT } from "../theme";
import { Mascot } from "../mascots/Gang";
import { Logo } from "../zam/common";

const Burst: React.FC<{ c1: string; c2: string }> = ({ c1, c2 }) => (
  <AbsoluteFill style={{ background: c1 }}>
    <svg width={1080} height={1080} viewBox="-540 -540 1080 1080" style={{ position: "absolute" }}>
      {[...Array(18)].map((_, i) => { const a = (i / 18) * Math.PI * 2; const b = a + Math.PI / 18; return <path key={i} d={`M0 0 L${Math.cos(a) * 900} ${Math.sin(a) * 900} L${Math.cos(b) * 900} ${Math.sin(b) * 900} Z`} fill={c2} />; })}
    </svg>
  </AbsoluteFill>
);
const Title: React.FC<{ lines: string[]; color: string; stroke?: string; size?: number; top: number; rot?: number }> = ({ lines, color, stroke = P.ink, size = 150, top, rot = -4 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontStyle: "italic", fontSize: size, lineHeight: 0.92, color, WebkitTextStroke: `${Math.round(size / 14)}px ${stroke}`, paintOrder: "stroke fill", transform: `rotate(${rot}deg)`, letterSpacing: -2, zIndex: 5 }}>
    {lines.map((l) => <div key={l}>{l}</div>)}
  </div>
);
const PaperStrip: React.FC<{ x: number; y: number; w: number; h: number; seed: string; children: React.ReactNode; rot?: number }> = ({ x, y, w, h, seed, children, rot = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, transform: `rotate(${rot}deg)`, zIndex: 4, filter: "drop-shadow(0 12px 14px #0006)" }}>
    <svg width={w} height={h} style={{ position: "absolute" }}><path d={tornPath(w, h, seed, 18, 9)} fill={P.paper2} /></svg>
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>
  </div>
);

/** WILDEST MOMENTS – red/orange burst, Pucky flying off Clubby's stick, "!?" energy. */
export const IconWildest: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT }}>
    <Burst c1="#dc2626" c2="#f97316" />
    {[...Array(26)].map((_, i) => <div key={i} style={{ position: "absolute", left: random(`wc${i}`) * 1040, top: random(`wy${i}`) * 1040, width: 26, height: 38, background: ["#fde047", "#fff", "#3b82f6", "#2a9d8f"][i % 4], border: `3px solid ${P.ink}`, transform: `rotate(${random(`wr${i}`) * 360}deg)` }} />)}
    <Title lines={["WILDEST", "MOMENTS"]} color="#fde047" top={150} size={170} />
    <div style={{ position: "absolute", left: 90, top: 520 }}><Mascot who="clubby" size={420} mood="laugh" seed="iw1" /></div>
    <div style={{ position: "absolute", left: 520, top: 470, transform: "rotate(-18deg)" }}><Mascot who="pucky" size={430} mood="laugh" seed="iw2" /></div>
    {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 380 + i * 30, top: 640 + i * 50, width: 180, height: 14, borderRadius: 7, background: "#fff", transform: "rotate(-18deg)" }} />)}
    <div style={{ position: "absolute", left: 800, top: 420, fontFamily: FONT, fontWeight: 900, fontSize: 130, color: "#fff", WebkitTextStroke: `8px ${P.ink}`, paintOrder: "stroke fill", transform: "rotate(14deg)" }}>?!</div>
  </AbsoluteFill>
);

/** DAILY FACTS – cream paper board, rink diagram, Helmy with a big check mark and stat card. */
export const IconDailyFacts: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT, background: "radial-gradient(circle at 50% 45%, #e0f2fe 0%, #9cc9e8 80%)" }}>
    <svg width={1080} height={1080} style={{ position: "absolute" }}>
      <rect x={60} y={540} width={960} height={420} rx={180} fill="#f4fbff" stroke={P.ink} strokeWidth={10} />
      <rect x={530} y={540} width={20} height={420} fill="#d94b3b" opacity={0.7} />
      <rect x={330} y={540} width={18} height={420} fill="#3b82f6" opacity={0.7} />
      <rect x={732} y={540} width={18} height={420} fill="#3b82f6" opacity={0.7} />
      <circle cx={540} cy={750} r={80} fill="none" stroke="#3b82f6" strokeWidth={8} />
      <path d="M200 860 Q420 640 880 740" stroke={P.mustard} strokeWidth={14} strokeDasharray="34 22" fill="none" />
    </svg>
    <PaperStrip x={110} y={110} w={860} h={330} seed="dfp" rot={-3}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontWeight: 900, fontSize: 160, lineHeight: 0.95, color: P.ink, letterSpacing: -3 }}>DAILY<br /><span style={{ color: P.teal }}>FACTS</span></div>
      </div>
    </PaperStrip>
    <div style={{ position: "absolute", left: 300, top: 540 }}><Mascot who="helmy" size={460} mood="wow" seed="idf" /></div>
    <div style={{ position: "absolute", left: 760, top: 450, width: 220, height: 220, borderRadius: "50%", background: P.green, border: `10px solid ${P.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 150, color: "#fff", fontWeight: 900, transform: "rotate(10deg)", zIndex: 6 }}>✓</div>
    <PaperStrip x={70} y={500} w={250} h={160} seed="dfs" rot={-8}><div style={{ fontWeight: 900, fontSize: 80, color: P.red }}>#1</div></PaperStrip>
    <div style={{ position: "absolute", left: 0, right: 0, top: 915, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 50, zIndex: 7, color: P.ink }}>real NHL facts · checked ✓</div>
  </AbsoluteFill>
);

/** SPECIAL EDITION – purple sunburst, film clapper, Pucky in shades + Biscuit, gold stars. */
export const IconSpecial: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT }}>
    <Burst c1="#7c3aed" c2="#a78bfa" />
    {[...Array(12)].map((_, i) => <div key={i} style={{ position: "absolute", left: random(`ss${i}`) * 1000, top: random(`sy${i}`) * 1000, fontSize: 60 + random(`sz${i}`) * 50, color: "#fde047", WebkitTextStroke: `3px ${P.ink}` }}>★</div>)}
    {/* clapperboard */}
    <div style={{ position: "absolute", left: 250, top: 150, width: 580, height: 360, transform: "rotate(-6deg)", zIndex: 4 }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 580, height: 80, background: "repeating-linear-gradient(135deg,#111 0 50px,#fff 50px 100px)", border: `8px solid ${P.ink}`, transform: "rotate(-10deg)", transformOrigin: "0 100%" }} />
      <div style={{ position: "absolute", left: 0, top: 86, width: 580, height: 280, background: "#111", border: `8px solid ${P.ink}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontWeight: 900, fontSize: 96, color: "#fff", lineHeight: 1 }}>SPECIAL</div>
        <div style={{ fontWeight: 900, fontSize: 96, color: "#fde047", lineHeight: 1 }}>EDITION</div>
      </div>
    </div>
    <div style={{ position: "absolute", left: 60, top: 560 }}><Mascot who="biscuit" size={420} mood="laugh" seed="is1" /></div>
    <div style={{ position: "absolute", left: 540, top: 540, transform: "rotate(8deg)" }}><Mascot who="pucky" size={450} mood="smug" shades seed="is2" /></div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 915, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 50, zIndex: 7, color: "#fff", WebkitTextStroke: `2px ${P.ink}` }}>cartoon episodes with the gang</div>
  </AbsoluteFill>
);

export const SeriesSheet: React.FC = () => (
  <AbsoluteFill style={{ background: "#111", flexDirection: "row", gap: 30, alignItems: "center", justifyContent: "center" }}>{null}</AbsoluteFill>
);
void Logo;
