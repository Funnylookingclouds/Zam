/** YouTube channel art: avatar (800×800, shown as a circle) and banner (2560×1440; safe area 1546×423 centred). */
import React from "react";
import { AbsoluteFill, random } from "remotion";
import { P, HAND, tornPath } from "../presenter/kit";
import { FONT } from "../theme";
import { Mascot, type Who } from "../mascots/Gang";
import { Logo } from "../zam/common";

const IceBg: React.FC<{ w: number; h: number; dark?: boolean }> = ({ w, h, dark }) => (
  <AbsoluteFill style={{ background: dark ? "radial-gradient(ellipse at 50% 40%, #1e3a8a 0%, #0b2545 70%)" : "radial-gradient(ellipse at 50% 40%, #f4fbff 0%, #cfe7f6 60%, #9cc9e8 100%)" }}>
    <svg width={w} height={h} style={{ position: "absolute" }}>
      {[...Array(Math.round(w / 40))].map((_, i) => { const x = random(`ax${i}`) * w, y = random(`ay${i}`) * h, l = 80 + random(`al${i}`) * 260; return <path key={i} d={`M${x} ${y} q${l / 2} ${random(`aq${i}`) * 40 - 20} ${l} 0`} stroke={dark ? "#ffffff22" : "#ffffffcc"} strokeWidth={4} fill="none" />; })}
    </svg>
  </AbsoluteFill>
);

/** Avatar A: Zam + the paper ZAM logo – reads well even at tiny sizes. */
export const ChannelAvatarA: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT }}>
    <IceBg w={800} h={800} dark />
    <div style={{ position: "absolute", top: 120, left: 0, right: 0 }}><Logo scale={0.95} /></div>
    <div style={{ position: "absolute", left: 160, top: 400 }}><Mascot who="zam" size={480} mood="laugh" seed="avA" /></div>
  </AbsoluteFill>
);

/** Avatar B: all six faces in a cluster around a mini logo. */
export const ChannelAvatarB: React.FC = () => {
  const ring: { w: Who; x: number; y: number; s: number }[] = [
    { w: "pucky", x: 40, y: 150, s: 270 }, { w: "biscuit", x: 490, y: 150, s: 270 },
    { w: "helmy", x: 40, y: 450, s: 250 }, { w: "clubby", x: 520, y: 430, s: 250 },
    { w: "agenty", x: 280, y: 500, s: 250 }, { w: "zam", x: 230, y: 230, s: 340 },
  ];
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <IceBg w={800} h={800} dark />
      <div style={{ position: "absolute", top: 40, left: 0, right: 0 }}><Logo scale={0.5} /></div>
      {ring.map(({ w, x, y, s }) => <div key={w} style={{ position: "absolute", left: x, top: y }}><Mascot who={w} size={s} mood="laugh" seed={`avB${w}`} /></div>)}
    </AbsoluteFill>
  );
};

/** Banner 2560×1440: logo + tagline + all six inside the 1546×423 safe area; rink, crowd and confetti fill the TV-only edges. */
export const ChannelBanner: React.FC<{ guides?: boolean }> = ({ guides }) => {
  const W = 2560, H = 1440, sx = (W - 1546) / 2, sy = (H - 423) / 2;
  const left: Who[] = ["pucky", "biscuit", "clubby"], right: Who[] = ["helmy", "agenty", "zam"];
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <IceBg w={W} h={H} />
      {/* rink lines + crowd for the wide (TV) area */}
      <div style={{ position: "absolute", left: W / 2 - 14, top: 0, width: 28, height: H, background: "#d94b3b", opacity: 0.35 }} />
      {[W * 0.3, W * 0.7].map((x) => <div key={x} style={{ position: "absolute", left: x - 14, top: 0, width: 28, height: H, background: "#3b82f6", opacity: 0.3 }} />)}
      <div style={{ position: "absolute", left: W / 2 - 300, top: H / 2 - 300, width: 600, height: 600, borderRadius: "50%", border: "16px solid #3b82f655" }} />
      {[...Array(120)].map((_, i) => <div key={i} style={{ position: "absolute", left: (i % 40) * 66 - 10, top: (i < 40 ? 20 : i < 80 ? 120 : 1260) + (i % 3) * 8, width: 52, height: 66, borderRadius: "26px 26px 8px 8px", background: ["#e76f51", "#2a9d8f", "#e9c46a", "#f4a261", "#8ab17d", "#8b5cf6"][i % 6], border: `3px solid ${P.ink}`, opacity: 0.85 }} />)}
      {[...Array(60)].map((_, i) => <div key={`c${i}`} style={{ position: "absolute", left: random(`cx${i}`) * W, top: 260 + random(`cy${i}`) * 900, width: 22, height: 32, background: ["#3b82f6", "#d94b3b", "#e0a526", "#2a9d8f", "#5a8f3e", "#8b5cf6"][i % 6], border: `2px solid ${P.ink}`, transform: `rotate(${random(`cr${i}`) * 360}deg)`, opacity: (random(`cx${i}`) * W > sx - 40 && random(`cx${i}`) * W < sx + 1586 && 260 + random(`cy${i}`) * 900 > sy - 40 && 260 + random(`cy${i}`) * 900 < sy + 463) ? 0 : 0.9 }} />)}
      {/* safe area content */}
      <div style={{ position: "absolute", left: sx, top: sy, width: 1546, height: 423 }}>
        <svg width={1546} height={423} style={{ position: "absolute" }}><path d={tornPath(1546, 423, "bannerpaper", 22, 10)} fill="#fbf6eaee" /></svg>
        <div style={{ position: "absolute", left: 523, top: 34, width: 500 }}><Logo scale={0.62} /></div>
        <div style={{ position: "absolute", left: 423, top: 232, width: 700, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 64, color: P.ink }}>hockey in under a minute!</div>
        <div style={{ position: "absolute", left: 423, top: 316, width: 700, textAlign: "center", fontWeight: 900, fontSize: 34, letterSpacing: 4, color: P.red }}>DAILY FACTS · SPECIAL EDITIONS</div>
        {left.map((w, i) => <div key={w} style={{ position: "absolute", left: 6 + i * 132, top: i % 2 ? 150 : 40, zIndex: i % 2 ? 2 : 1 }}><Mascot who={w} size={200} mood="laugh" flip={false} seed={`bn${w}`} /></div>)}
        {right.map((w, i) => <div key={w} style={{ position: "absolute", left: 1078 + i * 132, top: i % 2 ? 150 : 40, zIndex: i % 2 ? 2 : 1 }}><Mascot who={w} size={200} mood="laugh" flip seed={`bn${w}`} /></div>)}
      </div>
      {guides && (
        <>
          <div style={{ position: "absolute", left: sx, top: sy, width: 1546, height: 423, border: "6px dashed #ff00aa" }} />
          <div style={{ position: "absolute", left: (W - 2560) / 2, top: (H - 423) / 2, width: 2560, height: 423, border: "4px dashed #00aaff" }} />
          <div style={{ position: "absolute", left: sx + 10, top: sy + 10, color: "#ff00aa", fontWeight: 900, fontSize: 30 }}>SAFE AREA (all devices) 1546×423</div>
        </>
      )}
    </AbsoluteFill>
  );
};
