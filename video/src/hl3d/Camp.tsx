/** Summer-camp diorama (same 2.5D house style as the arena): felt grass, paper running track, blue lake with dock that
 *  can freeze, tents, pines, campfire, gym corner, chalkboard scoreboard, joke signs, neon "ZAM SUMMER CAMP", sun lamp. */
import React from "react";
import { AbsoluteFill, random } from "remotion";
import { HAND } from "../presenter/kit";
import { FONT } from "../theme";
import { FOV, P3, grain, pl, type DCam } from "./Diorama";

const Pine: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <svg width={160 * s} height={260 * s} viewBox="0 0 160 260"><rect x={70} y={200} width={20} height={60} fill="#7c4a1e" stroke="#2b2622" strokeWidth={4} /><path d="M80 0 L150 110 L110 110 L160 200 L0 200 L50 110 L10 110 Z" fill="#15803d" stroke="#2b2622" strokeWidth={6} strokeLinejoin="round" /><path d="M80 20 L120 90" stroke="#4ade80" strokeWidth={6} opacity={0.6} /></svg>
);
const Tent: React.FC<{ c: string; peek?: React.ReactNode }> = ({ c, peek }) => (
  <svg width={300} height={220} viewBox="0 0 300 220" style={{ overflow: "visible" }}><path d="M150 0 L300 220 L0 220 Z" fill={c} stroke="#2b2622" strokeWidth={7} strokeLinejoin="round" /><path d="M150 0 L190 220 L110 220 Z" fill="#00000033" stroke="#2b2622" strokeWidth={5} /><foreignObject x={110} y={150} width={80} height={70}>{peek}</foreignObject></svg>
);
const Campfire: React.FC<{ t: number }> = ({ t }) => (
  <svg width={200} height={200} viewBox="-100 -150 200 200">{[-40, 0, 40].map((x, i) => <rect key={i} x={x - 50} y={20} width={100} height={18} rx={8} fill="#7c4a1e" stroke="#2b2622" strokeWidth={4} transform={`rotate(${(i - 1) * 25} 0 30)`} />)}
    <path d={`M0 ${-120 - Math.sin(t * 12) * 12} Q50 -40 30 20 L-30 20 Q-50 -40 0 ${-120 - Math.sin(t * 12) * 12} Z`} fill="#f97316" /><path d={`M0 ${-70 - Math.sin(t * 15) * 10} Q26 -20 16 20 L-16 20 Q-26 -20 0 ${-70 - Math.sin(t * 15) * 10} Z`} fill="#fde047" /></svg>
);
const Sign: React.FC<{ text: string; w?: number; rot?: number }> = ({ text, w = 300, rot = -3 }) => (
  <div style={{ width: w, position: "relative" }}><div style={{ background: "#fef3c7", border: "6px solid #7c4a1e", padding: "8px 12px", fontFamily: HAND, fontWeight: 700, fontSize: 34, color: "#2b2622", textAlign: "center", transform: `rotate(${rot}deg)`, lineHeight: 1.05 }}>{text}</div><div style={{ width: 14, height: 120, background: "#7c4a1e", margin: "0 auto", border: "3px solid #2b2622" }} /></div>
);
export const Octo: React.FC<{ s?: number; t: number }> = ({ s = 90, t }) => (
  <svg width={s} height={s} viewBox="-110 -110 220 220">{[...Array(8)].map((_, i) => { const a = (i / 8) * Math.PI + 0.1; const w = Math.sin(t * 6 + i) * 14; return <path key={i} d={`M${Math.cos(a) * 27} 20 Q${Math.cos(a) * 63 + w} ${30 + Math.sin(a) * 50} ${Math.cos(a) * 90} ${40 + Math.sin(a) * 60 + w * 0.3}`} stroke="#c026d3" strokeWidth={18} fill="none" strokeLinecap="round" />; })}<ellipse cx={0} cy={-10} rx={70} ry={62} fill="#d946ef" stroke="#2b2622" strokeWidth={6} />{[-24, 24].map((x) => <g key={x}><circle cx={x} cy={-20} r={16} fill="#fff" stroke="#2b2622" strokeWidth={4} /><circle cx={x + 3} cy={-18} r={7} fill="#2b2622" /></g>)}<path d="M-16 14 Q0 26 16 14" stroke="#2b2622" strokeWidth={5} fill="none" /></svg>
);
/** Billboard helper (always faces camera). */
const B: React.FC<{ x: number; z: number; y?: number; cam: DCam; w: number; h: number; children: React.ReactNode }> = ({ x, z, y = 0, cam, w, h, children }) => (
  <div style={{ ...P3, transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${-(cam.ry ?? 0)}deg)` }}><div style={{ position: "absolute", left: -w / 2, top: -h, width: w, height: h }}>{children}</div></div>
);

export const CampDiorama: React.FC<{ cam: DCam; t: number; frozen?: number; board?: React.ReactNode; children?: React.ReactNode; octo?: boolean }> = ({ cam, t, frozen = 0, board, children, octo = true }) => {
  const GW = 2600, GD = 3200;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#3b1a5a 0%,#7c3aed 18%,#f472b6 38%,#fde68a 60%)", perspective: FOV, perspectiveOrigin: "540px 900px", overflow: "hidden" }}>
      {/* workshop wall behind (blurred): neon sign, string lights, sun lamp */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 860, filter: "blur(4px)" }}>
        {[...Array(22)].map((_, i) => <div key={i} style={{ position: "absolute", left: i * 52, top: 110 + Math.sin(i * 0.6) * 36, width: 18, height: 18, borderRadius: 9, background: ["#fde047", "#f472b6", "#67e8f9"][i % 3], boxShadow: `0 0 26px ${["#fde047", "#f472b6", "#67e8f9"][i % 3]}`, opacity: 0.6 + 0.4 * Math.sin(t * 3 + i) }} />)}
        <div style={{ position: "absolute", left: 150, top: 250, whiteSpace: "nowrap", fontFamily: FONT, fontWeight: 900, fontStyle: "italic", fontSize: 72, color: "#ff2bd6", textShadow: "0 0 30px #ff2bd6, 0 0 60px #ff2bd6" }}>ZAM SUMMER CAMP</div>
      </div>
      <div style={{ position: "absolute", right: -120, top: -160, width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(circle,#fff7c2 0%,#fde047 30%,#fde04700 70%)", opacity: 0.9 + 0.1 * Math.sin(t * 2) }} />
      <div style={{ ...P3, left: 540, top: 900, transform: `rotateX(${cam.rx ?? 0}deg) rotateY(${cam.ry ?? 0}deg) translate3d(${-cam.x}px, ${-cam.y}px, ${-cam.z}px)` }}>
        {/* workbench */}
        {[...Array(6)].map((_, i) => <div key={`wb${i}`} style={pl(5200, 900, `translate3d(0px, 30px, ${-3400 + i * 900}px) rotateX(90deg)`, { background: "repeating-linear-gradient(90deg,#6b3f1d 0 180px,#7a4a24 180px 360px)", backfaceVisibility: "visible" })} />)}
        {/* felt grass in strips, with track + lake printed on top */}
        {[...Array(8)].map((_, i) => { const zc = -GD / 2 + (i + 0.5) * (GD / 8); return (
          <div key={`g${i}`} style={pl(GW, GD / 8, `translate3d(0px, -20px, ${zc}px) rotateX(90deg)`, { background: "repeating-linear-gradient(80deg,#4ade80 0 14px,#22c55e 14px 28px)", backfaceVisibility: "visible", overflow: "hidden" })}>
            {/* track: big oval ring drawn per strip via a positioned ellipse */}
            <div style={{ position: "absolute", left: 200, top: 400 * 3.2 - i * 400 - 500, width: GW - 400, height: 1600, borderRadius: "50%", border: "120px solid #ef4444", boxSizing: "border-box", opacity: 0.95 }} />
            <div style={{ position: "absolute", left: 200, top: 400 * 3.2 - i * 400 - 500, width: GW - 400, height: 1600, borderRadius: "50%", border: "6px dashed #fff", boxSizing: "border-box", transform: "scale(0.955)" }} />
            {/* lake (back part of the set) */}
            <div style={{ position: "absolute", left: 800, top: -i * 400 + 60, width: 1100, height: 700, borderRadius: "50%", background: frozen > 0.5 ? "radial-gradient(ellipse,#f0f9ff,#bae6fd)" : `radial-gradient(ellipse,#38bdf8,#0369a1)`, border: "10px solid #a16207", boxShadow: frozen > 0.5 ? "inset 0 0 60px #fff" : "inset 0 0 40px #0c4a6e" }}>
              {frozen < 0.5 && [...Array(5)].map((_, k) => <div key={k} style={{ position: "absolute", left: 200 + k * 140, top: 200 + ((t * 30 + k * 70) % 300), width: 160, height: 20, borderRadius: "50%", border: "4px solid #bae6fd88" }} />)}
              {frozen > 0.5 && [...Array(6)].map((_, k) => <div key={k} style={{ position: "absolute", left: 120 + k * 150, top: 160 + (k % 3) * 120, width: 120, height: 8, background: "#fff", transform: `rotate(${k * 30}deg)` }} />)}
            </div>
          </div>); })}
        {/* dock */}
        <div style={pl(260, 700, "translate3d(-150px, -26px, -1150px) rotateX(90deg)", { background: "repeating-linear-gradient(0deg,#a16207 0 60px,#7c4a1e 60px 66px)", border: "6px solid #422006", backfaceVisibility: "visible" })} />
        {/* scenery billboards */}
        {[[-1150, -1500, 1.4], [-900, -1650, 1.1], [1150, -1500, 1.5], [900, -1700, 1.0], [-1200, -600, 1.2], [1200, -500, 1.3], [-600, -1700, 0.9], [500, -1750, 1.0]].map(([x, z, s], i) => <B key={`p${i}`} x={x} z={z} cam={cam} w={160 * s} h={260 * s}><Pine s={s} /></B>)}
        <B x={-700} z={-1350} cam={cam} w={300} h={220}><Tent c="#f97316" peek={octo ? <div style={{ marginTop: 10 }}><Octo t={t} s={70} /></div> : null} /></B>
        <B x={-380} z={-1450} cam={cam} w={300} h={220}><Tent c="#3b82f6" /></B>
        <B x={760} z={-1300} cam={cam} w={300} h={220}><Tent c="#facc15" /></B>
        <B x={-950} z={-300} cam={cam} w={200} h={200}><Campfire t={t} /></B>
        <B x={0} z={-1720} cam={cam} w={520} h={300}><Sign text="ZAM SUMMER CAMP ☀ est. 2026" w={520} rot={-2} /></B>
        <B x={-1000} z={-900} cam={cam} w={280} h={250}><Sign text="NO WALRUSES IN THE LAKE (we mean you)" w={280} rot={3} /></B>
        <B x={1050} z={-950} cam={cam} w={260} h={230}><Sign text="SUNSCREEN SPF 9000" w={260} rot={-4} /></B>
        <B x={1080} z={-250} cam={cam} w={260} h={230}><Sign text="MOSQUITO CROSSING 🦟" w={260} rot={2} /></B>
        {/* chalkboard scoreboard */}
        <B x={420} z={-1550} y={-60} cam={cam} w={460} h={330}><div style={{ width: 460, height: 260, background: "#14532d", border: "14px solid #7c4a1e", boxShadow: "0 10px 0 #0005", position: "relative", fontFamily: HAND, color: "#f0fdf4", overflow: "hidden" }}>{board ?? <div style={{ padding: 16, fontSize: 40, lineHeight: 1.1 }}>TODAY:<br />track · gym · lake<br /><span style={{ fontSize: 30, opacity: 0.8 }}>(Biscuit: nap)</span></div>}</div><div style={{ display: "flex", justifyContent: "space-between", padding: "0 40px" }}><div style={{ width: 12, height: 70, background: "#7c4a1e" }} /><div style={{ width: 12, height: 70, background: "#7c4a1e" }} /></div></B>
        {/* octopus pool float in the lake */}
        {octo && <B x={500} z={-1300} y={-30 - Math.sin(t * 2) * 6} cam={cam} w={110} h={110}><div style={{ position: "relative", width: 110, height: 110 }}><div style={{ position: "absolute", left: 0, top: 50, width: 110, height: 50, borderRadius: "50%", border: "14px solid #f472b6" }} /><div style={{ position: "absolute", left: 20, top: 0 }}><Octo t={t} s={70} /></div></div></B>}
        {children}
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, mixBlendMode: "screen", opacity: 0.35 }}><defs><linearGradient id="cb" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff6c8" /><stop offset="1" stopColor="#fff6c800" /></linearGradient></defs><path d="M1080 -50 L1080 300 L200 1500 L-100 1300 Z" fill="url(#cb)" /></svg>
      {[...Array(16)].map((_, i) => <div key={`d${i}`} style={{ position: "absolute", left: (random(`cx${i}`) * 1080 + Math.sin(t * 0.7 + i) * 30), top: ((random(`cy${i}`) * 1920 - t * (10 + random(`cv${i}`) * 25)) % 1920 + 1920) % 1920, width: 5, height: 5, borderRadius: 4, background: "#fff6c8", opacity: 0.6, boxShadow: "0 0 8px #fff6c8", pointerEvents: "none" }} />)}
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#3b1a5a66 0%,transparent 18%,transparent 80%,#1e0b2e99 100%)", pointerEvents: "none" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 55%, #000a 100%)", pointerEvents: "none" }} />
      <AbsoluteFill style={{ backgroundImage: grain, opacity: 0.22, mixBlendMode: "overlay", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
