/** "Paper Diorama" look test: the ORIGINAL ZAM gang as paper cut-outs (white sticker edge + cardboard thickness)
 *  inside a 3D miniature arena on a table – neon rim light, hard coloured shadows, volumetric beams, dust, tilt-shift,
 *  hyper-saturated grade, a split-depth frame (objects break out over white bars) and easter eggs in every corner. */
import React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from "remotion";
import { HAND, clamp } from "../presenter/kit";
import { FONT } from "../theme";
import { Mascot, type Mood, type Who } from "../mascots/Gang";

export type DCam = { x: number; y: number; z: number; ry?: number; rx?: number; focus?: number };
export const FOV = 1300;
export const P3: React.CSSProperties = { position: "absolute", transformStyle: "preserve-3d" };
export const pl = (w: number, h: number, tr: string, st: React.CSSProperties): React.CSSProperties => ({ position: "absolute", left: -w / 2, top: -h / 2, width: w, height: h, transform: tr, ...st });
export const dframe = (x: number, y: number, z: number, dist: number, sy = 800, extra: Partial<DCam> = {}): DCam => { const s = FOV / dist; return { x, y: y - (sy - 900) / s, z: z + dist - FOV, focus: z, ...extra }; };
export const dlerp = (a: DCam, b: DCam, k: number): DCam => ({ x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, z: a.z + (b.z - a.z) * k, ry: (a.ry ?? 0) + ((b.ry ?? 0) - (a.ry ?? 0)) * k, rx: (a.rx ?? 0) + ((b.rx ?? 0) - (a.rx ?? 0)) * k, focus: (a.focus ?? 0) + ((b.focus ?? 0) - (a.focus ?? 0)) * k });
export const grain = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/><feColorMatrix values='0 0 0 0 0.5 0 0 0 0 0.4 0 0 0 0 0.3 0 0 0 0.5 0'/></filter><rect width='220' height='220' filter='url(%23n)'/></svg>\")";
const cardboard = "repeating-linear-gradient(90deg,#c08a4f 0 6px,#b47d44 6px 12px)";

/** Paper cut-out billboard: sticker edge, cardboard thickness, neon rim (magenta left / cyan right), projected hard shadow. */
export const Cut: React.FC<{ x: number; z: number; y?: number; cam: DCam; size: number; children: React.ReactNode; rim?: boolean; shadow?: boolean; tilt?: number; toon?: boolean }> = ({ x, z, y = 0, cam, size, children, rim = true, shadow = true, tilt = 0, toon = false }) => {
  const dz = Math.abs(z - (cam.focus ?? 0));
  const blur = Math.min(10, Math.max(0, (dz - 350) / 90));
  const h = size * 1.12;
  return (
    <div style={{ ...P3, transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${-(cam.ry ?? 0)}deg)` }}>
      {shadow && <div style={{ position: "absolute", left: -size * 0.2, top: -size * 0.12, width: size * 0.9, height: size * 0.22, borderRadius: "50%", background: "radial-gradient(#000b, #0000 70%)", transform: "rotateX(90deg) skewX(-30deg)", transformOrigin: "50% 50%" }} />}
      <div style={{ position: "absolute", left: -size / 2, top: -h, width: size, height: h, transform: `rotate(${tilt}deg)`, transformOrigin: "50% 100%", filter: `${toon ? "drop-shadow(-8px 0 14px #ff2bd677) drop-shadow(8px -4px 14px #22e3ff77)" : rim ? "drop-shadow(6px 6px 0 #6b4423) drop-shadow(-5px 0 0 #ff2bd6) drop-shadow(5px -2px 0 #22e3ff)" : "drop-shadow(6px 6px 0 #6b4423)"}${blur > 0.5 ? ` blur(${blur}px)` : ""}` }}>{children}</div>
    </div>
  );
};
/** Tiny paper fan holding a sign – the easter-egg carriers. */
const Fan: React.FC<{ sign?: string; color: string; t: number; i: number; cheer: number }> = ({ sign, color, t, i, cheer }) => {
  const hop = Math.max(0, Math.sin(t * (3 + cheer * 5) + i * 1.7)) * (3 + cheer * 16);
  return (
    <div style={{ position: "relative", width: 70, height: 110, transform: `translateY(${-hop}px)` }}>
      <div style={{ position: "absolute", left: 13, top: 0, width: 44, height: 44, borderRadius: 22, background: "#fffaf0", border: "4px solid #111" }}><div style={{ position: "absolute", left: 10, top: 14, width: 6, height: 6, borderRadius: 3, background: "#111" }} /><div style={{ position: "absolute", left: 24, top: 14, width: 6, height: 6, borderRadius: 3, background: "#111" }} /></div>
      <div style={{ position: "absolute", left: 8, top: 40, width: 54, height: 66, borderRadius: "22px 22px 6px 6px", background: color, border: "4px solid #111" }} />
      {sign && <div style={{ position: "absolute", left: -40, top: -78, width: 150, background: "#fff", border: "4px solid #111", fontFamily: HAND, fontWeight: 700, fontSize: 21, lineHeight: 1, padding: "4px 6px", textAlign: "center", color: "#111", transform: `rotate(${(i % 3) - 1}deg)` }}>{sign}</div>}
    </div>
  );
};
const SIGNS = ["BISCUIT 0 · PUCKS 4,021", "HELMY IS RIGHT (statistically)", "FREE THE PUCKS!", "CLUBBY WAS HERE 1972", "MARRY ME, ZAM", "AGENTY OWES ME $5", "I'M HERE FOR THE ICE", "LOST: 1 TOOTH (PUCKY)", "WAKE ME AT OT6", "🐙 BRING BACK OCTOPUS 🐙"];

/** The miniature arena on a workbench. */
export const Diorama: React.FC<{ cam: DCam; t: number; cheer?: number; jumbo?: React.ReactNode; children?: React.ReactNode; pulse?: number }> = ({ cam, t, cheer = 0.3, jumbo, children, pulse = 0 }) => {
  const RW = 2200, RD = 2600;
  const neon = 0.8 + 0.2 * Math.sin(t * 9) + pulse;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 30%, #2a0f45 0%, #0b0716 70%)", perspective: FOV, perspectiveOrigin: "540px 900px", overflow: "hidden" }}>
      {/* far wall of the "workshop": neon signs + string lights (out of focus) */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 900, filter: "blur(5px)" }}>
        {[...Array(22)].map((_, i) => <div key={i} style={{ position: "absolute", left: i * 52, top: 120 + Math.sin(i * 0.6) * 40, width: 18, height: 18, borderRadius: 9, background: ["#fde047", "#f472b6", "#67e8f9"][i % 3], boxShadow: `0 0 26px ${["#fde047", "#f472b6", "#67e8f9"][i % 3]}`, opacity: 0.6 + 0.4 * Math.sin(t * 3 + i) }} />)}
        <div style={{ position: "absolute", left: 640, top: 240, fontFamily: FONT, fontWeight: 900, fontStyle: "italic", fontSize: 130, color: "#ff2bd6", textShadow: `0 0 ${30 * neon}px #ff2bd6, 0 0 ${60 * neon}px #ff2bd6`, opacity: neon }}>ZAM</div>
        <div style={{ position: "absolute", left: 60, top: 320, fontFamily: HAND, fontSize: 80, color: "#22e3ff", textShadow: "0 0 30px #22e3ff" }}>est. 2026</div>
      </div>
      <div style={{ ...P3, left: 540, top: 900, transform: `rotateX(${cam.rx ?? 0}deg) rotateY(${cam.ry ?? 0}deg) translate3d(${-cam.x}px, ${-cam.y}px, ${-cam.z}px)` }}>
        {/* workbench (wood) */}
        {[...Array(6)].map((_, i) => <div key={`wb${i}`} style={pl(5200, 900, `translate3d(0px, 30px, ${-3200 + i * 900}px) rotateX(90deg)`, { background: "repeating-linear-gradient(90deg,#6b3f1d 0 180px,#7a4a24 180px 360px)", backfaceVisibility: "visible" })}>
          {i === 3 && <><div style={{ position: "absolute", left: 300, top: 200, width: 160, height: 160, borderRadius: 80, border: "18px solid #a16207", opacity: 0.5 }} /><div style={{ position: "absolute", left: 4300, top: 300, width: 420, height: 60, background: "#facc15", border: "6px solid #111", borderRadius: 6, transform: "rotate(18deg)" }} /></>}
        </div>)}
        {/* cardboard base under the rink */}
        <div style={pl(RW + 200, 60, `translate3d(0px, 0px, ${RD / 2 + 100}px)`, { background: cardboard, border: "4px solid #5a3a1a" })} />
        {/* ice: printed paper with markings, glossy */}
        {[...Array(6)].map((_, i) => <div key={`ice${i}`} style={pl(RW, RD / 6, `translate3d(0px, -30px, ${-RD / 2 + (i + 0.5) * (RD / 6)}px) rotateX(90deg)`, { background: "linear-gradient(180deg,#bfe3f7,#9fd0ee)", backfaceVisibility: "visible" })}>
          {i === 3 && <div style={{ position: "absolute", left: 0, right: 0, top: 150, height: 22, background: "#ff3b3b" }} />}
          {(i === 1 || i === 4) && <div style={{ position: "absolute", left: 0, right: 0, top: 200, height: 22, background: "#2f6bff" }} />}
          {i === 3 && <div style={{ position: "absolute", left: 900, top: -40, width: 400, height: 400, borderRadius: 200, border: "12px solid #2f6bff" }} />}
          {i === 2 && [...Array(8)].map((_, k) => <div key={k} style={{ position: "absolute", left: 200 + random(`pc${k}`) * 1800, top: 40 + random(`pz${k}`) * 300, width: 22, height: 18, borderRadius: 9, background: "#fef3c7", border: "2px solid #d97706" }} />)}
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(${100 + i * 8}deg, transparent 40%, #ffffff55 50%, transparent 60%)` }} />
        </div>)}
        {/* boards with ads + easter-egg poster */}
        <div style={pl(RW, 130, `translate3d(0px, -95px, ${-RD / 2}px)`, { background: "#fff", borderTop: "10px solid #111", borderBottom: "16px solid #ffb703", display: "flex", gap: 70, alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 52, color: "#1d4ed8" })}><span>ZAM ICE</span><span style={{ color: "#e11d48" }}>PUCKY'S GYM</span><span style={{ background: "#fde047", padding: "0 10px", color: "#111", fontSize: 34 }}>LOST: 1 TOOTH</span><span>HELMY STATS™</span></div>
        {[-1, 1].map((sd) => <div key={sd} style={pl(RD, 130, `translate3d(${sd * RW / 2}px, -95px, 0px) rotateY(${-sd * 90}deg)`, { background: "#fff", borderTop: "10px solid #111", borderBottom: "16px solid #ffb703", backfaceVisibility: "visible" })} />)}
        {/* stepped cardboard stands with paper fans holding signs */}
        {[0, 1, 2, 3].map((r) => (
          <div key={`st${r}`} style={{ ...P3, transform: `translate3d(0px, ${-160 - r * 140}px, ${-RD / 2 - 200 - r * 170}px)` }}>
            <div style={pl(RW + 600, 160, "", { background: cardboard, border: "5px solid #5a3a1a", boxShadow: "inset 0 -30px 40px #0006" })} />
            <div style={{ position: "absolute", left: -(RW + 600) / 2 + 40, top: -190, display: "flex", gap: 32 }}>
              {[...Array(19)].map((_, i) => { const idx = r * 19 + i; const sign = idx % 7 === 3 ? SIGNS[(idx / 7 | 0) % SIGNS.length] : undefined; return <Fan key={i} sign={sign} color={["#ef4444", "#3b82f6", "#a855f7", "#10b981", "#f59e0b"][idx % 5]} t={t} i={idx} cheer={cheer} />; })}
            </div>
          </div>
        ))}
        {/* Agenty scouting from the top row with binoculars (easter egg) */}
        <div style={{ ...P3, transform: `translate3d(${RW / 2 - 80}px, -760px, ${-RD / 2 - 760}px)` }}><div style={{ position: "absolute", left: -90, top: -200, transform: "scale(0.6)" }}><Mascot who="agenty" size={300} mood="smug" seed="dagy" /></div></div>
        {/* hanging jumbotron on strings */}
        <div style={{ ...P3, transform: "translate3d(0px, -1100px, -600px)" }}>
          {[-220, 220].map((x) => <div key={x} style={pl(4, 700, `translate3d(${x}px, -560px, 0px)`, { background: "#e5e7eb" })} />)}
          <div style={pl(620, 360, "", { background: "#0b1020", border: "14px solid #111", boxShadow: "0 0 60px #22e3ff88", overflow: "hidden" })}>{jumbo}</div>
        </div>
        {/* neon light bars on the bench edge: hard coloured light pools */}
        {[-1, 1].map((sd) => <div key={`nb${sd}`} style={pl(40, 900, `translate3d(${sd * (RW / 2 + 260)}px, -30px, 300px) rotateX(90deg)`, { background: sd < 0 ? "#ff2bd6" : "#22e3ff", boxShadow: `0 0 ${120 * neon}px ${50 * neon}px ${sd < 0 ? "#ff2bd6" : "#22e3ff"}`, opacity: 0.85 })} />)}
        {children}
      </div>
      {/* volumetric beams + dust */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, mixBlendMode: "screen", opacity: 0.35 }}>
        <defs><linearGradient id="bm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff6c8" /><stop offset="1" stopColor="#fff6c800" /></linearGradient></defs>
        <path d="M380 -50 L520 -50 L760 1500 L140 1500 Z" fill="url(#bm)" opacity={0.8 + 0.2 * Math.sin(t * 2)} />
        <path d="M820 -50 L900 -50 L1080 1100 L700 1100 Z" fill="url(#bm)" opacity={0.5} />
      </svg>
      {[...Array(24)].map((_, i) => <div key={`d${i}`} style={{ position: "absolute", left: (random(`dx${i}`) * 1080 + Math.sin(t * 0.7 + i) * 30), top: ((random(`dy${i}`) * 1920 - t * (10 + random(`dv${i}`) * 25)) % 1920 + 1920) % 1920, width: 4 + random(`ds${i}`) * 5, height: 4 + random(`ds${i}`) * 5, borderRadius: 4, background: "#fff6c8", opacity: 0.5, boxShadow: "0 0 8px #fff6c8", pointerEvents: "none" }} />)}
      {/* tilt-shift feel: soft dark bands top and bottom (cheap) */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#0b071699 0%,transparent 18%,transparent 78%,#0b0716aa 100%)", pointerEvents: "none" }} />
      {/* grade: teal shadows / warm highlights, vignette, grain */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#22e3ff18,#ff2bd612)", mixBlendMode: "overlay", pointerEvents: "none" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 50%, #000c 100%)", pointerEvents: "none" }} />
      <AbsoluteFill style={{ backgroundImage: grain, opacity: 0.25, mixBlendMode: "overlay", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

/** Split-depth frame: two white bars; children passed as `over` are drawn above them (they "break out" of the frame). */
export const SplitDepth: React.FC<{ children: React.ReactNode; over?: React.ReactNode; top?: number; bottom?: number }> = ({ children, over, top = 470, bottom = 1360 }) => (
  <AbsoluteFill>
    {children}
    <div style={{ position: "absolute", left: 0, right: 0, top, height: 26, background: "#fff", boxShadow: "0 0 30px #fff8", zIndex: 5 }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: bottom, height: 26, background: "#fff", boxShadow: "0 0 30px #fff8", zIndex: 5 }} />
    <div style={{ position: "absolute", inset: 0, zIndex: 6 }}>{over}</div>
  </AbsoluteFill>
);

// ------------------------------------------------------------------ prototype scenes
const Octo: React.FC = () => (
  <svg width={200} height={224} viewBox="-110 -110 220 246"><g>{[...Array(8)].map((_, i) => { const a = (i / 8) * Math.PI + 0.1; const x = Math.cos(a) * 90, y = 40 + Math.sin(a) * 60; return <path key={i} d={`M${x * 0.3} 20 Q${x * 0.7} ${y - 10} ${x} ${y}`} stroke="#c026d3" strokeWidth={18} fill="none" strokeLinecap="round" />; })}<ellipse cx={0} cy={-10} rx={70} ry={62} fill="#d946ef" stroke="#2b2622" strokeWidth={6} />{[-24, 24].map((x) => <g key={x}><circle cx={x} cy={-20} r={16} fill="#fff" stroke="#2b2622" strokeWidth={4} /><circle cx={x + 3} cy={-18} r={7} fill="#2b2622" /></g>)}</g></svg>
);
const JumboFace: React.FC<{ who: Who; text: string; mood?: Mood }> = ({ who, text, mood = "laugh" }) => (
  <div style={{ position: "absolute", inset: 0, background: "radial-gradient(#1e3a8a,#0b1020)" }}>
    <div style={{ position: "absolute", left: 30, top: 30 }}><Mascot who={who} size={230} mood={mood} noSticker seed={`j${who}`} /></div>
    <div style={{ position: "absolute", left: 270, top: 70, width: 300, fontFamily: FONT, fontWeight: 900, fontSize: 52, color: "#fde047", lineHeight: 1, textShadow: "0 0 14px #facc15" }}>{text}</div>
    <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg,#0000 0 4px,#0004 4px 6px)" }} />
  </div>
);
const Caption: React.FC<{ words: string[]; on: number }> = ({ words, on }) => (
  <div style={{ position: "absolute", left: 60, right: 170, top: 1440, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 96, textTransform: "uppercase", zIndex: 9 }}>
    {words.map((w, i) => <span key={i} style={{ display: "inline-block", margin: "0 14px", color: i === on ? "#fde047" : "#fff", WebkitTextStroke: "11px #111", paintOrder: "stroke fill", textShadow: "0 0 30px #ff2bd6aa" }}>{w}</span>)}
  </div>
);

/** Motion test (8 s): dolly across the diorama, Clubby's slapshot sends Pucky OUT of the frame over the split bar. */
export const DioramaTest: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 60;
  const cam = dlerp(dframe(-300, -420, -700, 1700, 860, { ry: 12, rx: -6 }), dframe(150, -380, -700, 1150, 820, { ry: -6, rx: -3 }), interpolate(t, [0, 7.5], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) }));
  const k = interpolate(t, [3.2, 4.4], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const hit = t > 3.2;
  const flash = interpolate(t, [4.4, 4.5, 4.9], [0, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <SplitDepth over={hit && k < 1 ? <div style={{ position: "absolute", left: 420 + k * 120, top: 1000 - k * 980, transform: `rotate(${k * 900}deg) scale(${1 + k * 1.6})` }}><Mascot who="pucky" size={240} mood="wow" seed="dpk" /></div> : null}>
        <Diorama cam={cam} t={t} cheer={hit ? 1 : 0.4} pulse={flash} jumbo={<JumboFace who={hit ? "biscuit" : "pucky"} text={hit ? "UH OH." : "PUCKY CAM"} mood={hit ? "scared" : "laugh"} />}>
          <Cut x={-380} z={-700} cam={cam} size={420} tilt={t > 3 && t < 3.4 ? -10 : 0}><Mascot who="clubby" size={420} mood={hit ? "laugh" : "determined"} seed="dcl" /></Cut>
          {!hit && <Cut x={-40} z={-650} cam={cam} size={260}><Mascot who="pucky" size={260} mood="smug" seed="dpk2" /></Cut>}
          <Cut x={420} z={-900} cam={cam} size={400}><Mascot who="biscuit" size={400} mood={hit ? "scared" : "grumpy"} seed="dbs" /></Cut>
          <Cut x={-750} z={-1050} cam={cam} size={330}><Mascot who="helmy" size={330} mood="wow" seed="dhm" /></Cut>
          <Cut x={760} z={-500} cam={cam} size={360}><Mascot who="zam" size={360} mood="laugh" seed="dzm" /></Cut>
        </Diorama>
      </SplitDepth>
      {flash > 0 && <AbsoluteFill style={{ background: "#fff", opacity: flash * 0.8, zIndex: 8 }} />}
      <Caption words={hit ? ["PUCKY", "HAS", "LEFT", "THE", "VIDEO."] : ["BACK", "IN", "MY", "DAY…"]} on={hit ? 2 : 1} />
      <div style={{ position: "absolute", left: 52, top: 140, padding: "4px 12px", background: "#ff2bd6", color: "#fff", fontWeight: 900, fontSize: 22, letterSpacing: 2, zIndex: 9 }}>ZAM · DIORAMA TEST</div>
    </AbsoluteFill>
  );
};

/** Still 1: hero wide. Still 2: face-off close-up. Still 3: crowd detail with easter eggs. */
export const DioramaHero: React.FC = () => { const cam = dframe(0, -400, -700, 1500, 860, { rx: -6 }); return (
  <SplitDepth over={<div style={{ position: "absolute", left: 640, top: 330, transform: "rotate(-20deg)" }}><Mascot who="pucky" size={300} mood="laugh" seed="hpk" /></div>}>
    <Diorama cam={cam} t={1.3} cheer={1} jumbo={<JumboFace who="biscuit" text="SAVE % 12.0" mood="sad" />}>
      <Cut x={-380} z={-700} cam={cam} size={420}><Mascot who="clubby" size={420} mood="laugh" seed="hc" /></Cut>
      <Cut x={420} z={-900} cam={cam} size={400}><Mascot who="biscuit" size={400} mood="scared" seed="hb" /></Cut>
      <Cut x={-760} z={-1050} cam={cam} size={330}><Mascot who="helmy" size={330} mood="wow" seed="hh" /></Cut>
      <Cut x={760} z={-520} cam={cam} size={360}><Mascot who="zam" size={360} mood="laugh" seed="hz" /></Cut>
    </Diorama><Caption words={["THE", "GANG", "IS", "MINIATURE."]} on={3} />
  </SplitDepth>); };
export const DioramaFaceoff: React.FC = () => { const cam = dframe(0, -300, -800, 1050, 800, { rx: 2 }); return (
  <SplitDepth over={<div style={{ position: "absolute", left: 470, top: 300, width: 140, height: 56, borderRadius: "50%", background: "#111", border: "5px solid #444", transform: "rotate(-14deg)", boxShadow: "0 0 30px #22e3ff" }} />}>
    <Diorama cam={cam} t={2.1} cheer={0.8} jumbo={<JumboFace who="pucky" text="FACE-OFF!" />}>
      <Cut x={-250} z={-800} cam={cam} size={470} tilt={6}><Mascot who="pucky" size={470} mood="smug" seed="fp" /></Cut>
      <Cut x={260} z={-820} cam={cam} size={470} tilt={-6}><Mascot who="biscuit" size={470} mood="grumpy" flip seed="fb" /></Cut>
    </Diorama><Caption words={["NOTHING", "PERSONAL."]} on={1} />
  </SplitDepth>); };
export const DioramaCrowd: React.FC = () => { const cam = dframe(150, -700, -1700, 900, 820, { rx: -2, ry: -8 }); return (
  <AbsoluteFill><Diorama cam={cam} t={0.7} cheer={1} jumbo={<JumboFace who="zam" text="KISS CAM?" />}>
    <Cut x={330} z={-1520} y={-300} cam={cam} size={200} shadow={false}><Octo /></Cut>
  </Diorama><Caption words={["FIND", "THE", "OCTOPUS."]} on={2} /></AbsoluteFill>); };
