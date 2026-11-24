/** ZAM 2.5D prototype: real-perspective sets built from CSS 3D planes (floor, walls, ceiling, props), a moving camera,
 *  flat 2D characters as billboards, contact shadows, practical lights, light shafts, depth-of-field and grain.
 *  No WebGL needed – Chromium renders preserve-3d transforms in Remotion. */
import React from "react";
import { AbsoluteFill } from "remotion";
import { HAND } from "../presenter/kit";
import { FONT } from "../theme";

export type Camera = { x: number; y: number; z: number; ry?: number; rx?: number; fov?: number; focus?: number };
const P3: React.CSSProperties = { position: "absolute", transformStyle: "preserve-3d" };
const plane = (w: number, h: number, transform: string, style: React.CSSProperties): React.CSSProperties => ({ position: "absolute", left: -w / 2, top: -h / 2, width: w, height: h, transform, backfaceVisibility: "hidden", ...style });

const W = 2600, D = 2600, H = 1500; // room size (x, z, y)
const grainUrl = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/><feColorMatrix values='0 0 0 0 0.3 0 0 0 0 0.25 0 0 0 0 0.2 0 0 0 0.35 0'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>\")";

const Locker: React.FC<{ name?: string; color?: string; open?: boolean }> = ({ name, color = "#4f6f93", open }) => (
  <div style={{ width: 220, height: 900, position: "relative", background: `linear-gradient(90deg, ${color}, #6d8db1 45%, ${color})`, border: "6px solid #1f2937", borderRadius: 8, boxShadow: "inset 0 -60px 80px #0006" }}>
    {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 50, top: 40 + i * 16, width: 120, height: 7, borderRadius: 4, background: "#0b122088" }} />)}
    {name && <div style={{ position: "absolute", left: 30, top: 140, width: 160, height: 46, background: "#f8f1e3", border: "3px solid #1f2937", fontFamily: HAND, fontSize: 36, textAlign: "center", lineHeight: "44px", color: "#1f2937" }}>{name}</div>}
    <div style={{ position: "absolute", right: 22, top: 430, width: 16, height: 80, borderRadius: 6, background: "#cbd5e1", border: "3px solid #1f2937" }} />
    {open && <div style={{ position: "absolute", inset: 10, background: "linear-gradient(180deg,#111827,#1f2937)", borderRadius: 4 }}><div style={{ position: "absolute", left: 40, top: 120, width: 140, height: 200, background: "#e0a526", border: "4px solid #111", borderRadius: "20px 20px 6px 6px" }} /></div>}
  </div>
);
const Jersey: React.FC<{ color: string; num: string }> = ({ color, num }) => (
  <svg width={260} height={240} viewBox="0 0 260 240"><path d="M60 20 L100 0 Q130 30 160 0 L200 20 L250 70 L215 105 L200 90 L200 235 L60 235 L60 90 L45 105 L10 70 Z" fill={color} stroke="#1f2937" strokeWidth={7} strokeLinejoin="round" /><text x={130} y={170} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={70} fill="#fff">{num}</text></svg>
);

/** The locker room as a 3D set. Children are placed in world space via <Bill/>. */
export const LockerRoom3D: React.FC<{ cam: Camera; children?: React.ReactNode; lamp?: number }> = ({ cam, children, lamp = 1 }) => {
  const fov = cam.fov ?? 1300;
  return (
    <AbsoluteFill style={{ background: "#0b1220", perspective: fov, perspectiveOrigin: "540px 900px", overflow: "hidden" }}>
      <div style={{ ...P3, left: 540, top: 900, transform: `rotateX(${cam.rx ?? 0}deg) rotateY(${cam.ry ?? 0}deg) translate3d(${-cam.x}px, ${-cam.y}px, ${-cam.z}px)` }}>
        {/* floor: rubber mat tiles + warm pool of light */}
        <div style={plane(W, D, "rotateX(90deg)", { background: `radial-gradient(ellipse 900px 700px at 50% 55%, #6b7a8f, #3b4656 70%, #252d39), ${grainUrl}`, backgroundBlendMode: "multiply" })}>
          <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg,#00000022 0 4px,transparent 4px 160px),repeating-linear-gradient(90deg,#00000022 0 4px,transparent 4px 160px)" }} />
        </div>
        {/* back wall with lockers + team banner + window */}
        <div style={{ ...plane(W, H, `translate3d(0px, ${-H / 2}px, ${-D / 2}px)`, { background: "linear-gradient(180deg,#d9c3a0,#c7ab84 70%,#9c8463)" }), display: "flex", gap: 16, alignItems: "flex-end", padding: "0 80px 0 80px", boxSizing: "border-box" }}>
          <div style={{ position: "absolute", left: 1000, top: 120, width: 600, height: 150, background: "#7f1d1d", border: "8px solid #451a03", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 70, color: "#fde047", letterSpacing: 6 }}>ZAM ICE</div>
          {["WALT", "GUS", "", "ROOKIE", "", "REF?", "", "", ""].map((n, i) => <div key={i} style={{ marginBottom: 60 }}><Locker name={n} open={i === 2} color={i % 2 ? "#4b6a8e" : "#557599"} /></div>)}
        </div>
        {/* left wall: window with arena lights */}
        <div style={plane(D, H, `translate3d(${-W / 2}px, ${-H / 2}px, 0px) rotateY(90deg)`, { background: "linear-gradient(180deg,#cdb592,#b39a76 70%,#8d7657)" })}>
          <div style={{ position: "absolute", left: 900, top: 260, width: 700, height: 420, background: "linear-gradient(180deg,#1e3a8a,#312e81 60%,#f59e0b33)", border: "22px solid #6b4f2e", boxShadow: "0 0 80px #93c5fd55" }}>
            {[...Array(12)].map((_, i) => <div key={i} style={{ position: "absolute", left: 30 + i * 55, top: 300, width: 18, height: 18, borderRadius: 9, background: "#fde68a", boxShadow: "0 0 18px #fde68a" }} />)}
            <div style={{ position: "absolute", left: 520, top: 50, width: 90, height: 90, borderRadius: 45, background: "#fef9c3", boxShadow: "0 0 50px #fef9c3" }} />
          </div>
          <div style={{ position: "absolute", left: 300, top: 300, width: 260, height: 240 }}><Jersey color="#2a9d8f" num="00" /></div>
          <div style={{ position: "absolute", left: 1800, top: 300, width: 260, height: 240 }}><Jersey color="#e0a526" num="30" /></div>
        </div>
        {/* right wall */}
        <div style={plane(D, H, `translate3d(${W / 2}px, ${-H / 2}px, 0px) rotateY(-90deg)`, { background: "linear-gradient(180deg,#c9b08b,#ad9470 70%,#86704f)" })}>
          <div style={{ position: "absolute", left: 500, top: 200, width: 900, height: 520, background: "#f8fafc", border: "14px solid #475569", borderRadius: 8 }}>
            <svg width={900} height={520}><path d="M80 260 Q300 120 520 280 T840 200" stroke="#2563eb" strokeWidth={10} fill="none" strokeDasharray="30 18" /><circle cx={200} cy={200} r={28} fill="none" stroke="#dc2626" strokeWidth={8} /><path d="M600 340 l40 40 m0 -40 l-40 40" stroke="#dc2626" strokeWidth={8} /><text x={60} y={470} fontFamily="Caveat" fontSize={56} fill="#1f2937">PLAN: don't let Walt leave the net</text></svg>
          </div>
        </div>
        {/* ceiling with beams – tiled so strips behind the camera are culled individually */}
        {[...Array(8)].map((_, i) => <div key={`c${i}`} style={plane(W, D / 8, `translate3d(0px, ${-H}px, ${-D / 2 + (i + 0.5) * (D / 8)}px) rotateX(-90deg)`, { background: "linear-gradient(180deg,#a08a6a,#8f7a5c)", backfaceVisibility: "visible" })}><div style={{ position: "absolute", left: 0, right: 0, top: 120, height: 60, background: "#6b4f2e", boxShadow: "0 20px 30px #0005" }} /></div>)}
        {/* bench (3D box) */}
        <div style={{ ...P3, transform: `translate3d(0px, 0px, ${-D / 2 + 380}px)` }}>
          <div style={plane(2000, 60, "translate3d(0px, -170px, 0px)", { background: "#a16207", border: "5px solid #422006" })} />
          <div style={plane(2000, 220, "translate3d(0px, -200px, -110px) rotateX(90deg)", { background: "linear-gradient(90deg,#b4791e,#ca8a04,#b4791e)", border: "5px solid #422006" })} />
          {[-900, -300, 300, 900].map((x) => <div key={x} style={plane(40, 170, `translate3d(${x}px, -85px, 0px)`, { background: "#713f12", border: "4px solid #422006" })} />)}
        </div>
        {/* hanging lamp + light cone (practical light) */}
        <div style={{ ...P3, transform: `translate3d(0px, ${-H + 380}px, -300px)` }}>
          <div style={plane(8, 380, "translate3d(0px, -190px, 0px)", { background: "#111" })} />
          <div style={plane(240, 110, "translate3d(0px, 20px, 0px)", { background: "#14532d", borderRadius: "120px 120px 10px 10px", border: "6px solid #052e16" })} />
          <div style={plane(70, 70, "translate3d(0px, 80px, 0px)", { background: "#fef3c7", borderRadius: 35, boxShadow: `0 0 ${120 * lamp}px ${40 * lamp}px #fde68a` })} />
          <div style={plane(1300, 1150, "translate3d(0px, 660px, 1px)", { background: "linear-gradient(180deg,#fde68a66,#fde68a00 85%)", clipPath: "polygon(45% 0, 55% 0, 100% 100%, 0 100%)", opacity: 0.45 * lamp, mixBlendMode: "screen" })} />
        </div>
        {children}
      </div>
      {/* lens: warm grade, vignette, grain */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #fde68a14, transparent 55%, #000a 100%)", pointerEvents: "none" }} />
      <AbsoluteFill style={{ backgroundImage: grainUrl, opacity: 0.35, mixBlendMode: "multiply", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

/** A flat 2D element placed in world space (x, floor y, z), always facing the camera, with contact shadow + DOF. */
export const Bill: React.FC<{ x: number; z: number; y?: number; cam: Camera; w: number; h: number; children: React.ReactNode; shadow?: boolean; light?: string; blurPx?: number }> = ({ x, z, y = 0, cam, w, h, children, shadow = true, light, blurPx }) => {
  const dz = Math.abs(z - (cam.focus ?? 0));
  const blur = blurPx ?? Math.min(12, Math.max(0, (dz - 300) / 80));
  return (
    <div style={{ ...P3, transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${-(cam.ry ?? 0)}deg)` }}>
      {shadow && <div style={{ position: "absolute", left: -w * 0.32, top: -24, width: w * 0.64, height: 48, borderRadius: "50%", background: "radial-gradient(#000a, #0000 70%)", transform: "rotateX(80deg)", filter: `blur(${4 + blur}px)` }} />}
      <div style={{ position: "absolute", left: -w / 2, top: -h, width: w, height: h, filter: `blur(${blur}px) ${light ? `drop-shadow(0 0 24px ${light})` : ""}` }}>{children}</div>
    </div>
  );
};
