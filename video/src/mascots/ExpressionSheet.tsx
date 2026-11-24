/** Expression sheet + 2.5D expression reel for the original gang (borderless, "Babblarna-style" full characters). */
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { clamp } from "../presenter/kit";
import { FONT } from "../theme";
import { Mascot, type Mood, type Who } from "./Gang";
import { Cut, Diorama, dframe, dlerp } from "../hl3d/Diorama";

const WHO: Who[] = ["pucky", "biscuit", "zam", "helmy", "clubby", "agenty"];
const MOODS: Mood[] = ["talk", "laugh", "angry", "wow", "sad", "smug", "love", "scared"];
export const ExpressionSheet: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 30%, #1e3a8a, #0b1220)", fontFamily: FONT }}>
    <div style={{ textAlign: "center", marginTop: 40, fontSize: 72, fontWeight: 900, color: "#fff" }}>ZAM gang · <span style={{ color: "#fde047" }}>expressions 2.0</span></div>
    <div style={{ display: "grid", gridTemplateColumns: `86px repeat(6, 154px)`, gap: "8px 4px", padding: "20px 14px" }}>
      <div />
      {WHO.map((w) => <div key={w} style={{ color: "#fde047", fontWeight: 900, fontSize: 26, textAlign: "center", textTransform: "capitalize" }}>{w}</div>)}
      {MOODS.map((m) => (
        <React.Fragment key={m}>
          <div style={{ color: "#93c5fd", fontWeight: 800, fontSize: 22, alignSelf: "center", textTransform: "uppercase" }}>{m}</div>
          {WHO.map((w) => <div key={w + m} style={{ width: 154, height: 190, display: "flex", alignItems: "center", justifyContent: "center", background: "#ffffff0d", borderRadius: 16 }}><Mascot who={w} size={130} mood={m} open={m === "talk" ? 0.6 : 0} talking={m === "talk"} noSticker seed={w + m} /></div>)}
        </React.Fragment>
      ))}
    </div>
  </AbsoluteFill>
);

/** 7 s silent reel: Pucky taunts, Biscuit fumes, the puck flies by, Biscuit melts down, Pucky in love with himself. */
export const ExpressionReel: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 60;
  const cam = dlerp(dframe(0, -260, -800, 1150, 860, { rx: -2, ry: 6 }), dframe(0, -250, -800, 950, 840, { rx: -2, ry: -4 }), interpolate(t, [0, 7], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) }));
  const pm: Mood = t < 1.6 ? "smug" : t < 3.0 ? "laugh" : t < 4.4 ? "shock" : t < 5.8 ? "proud" : "love";
  const bm: Mood = t < 1.6 ? "grumpy" : t < 3.0 ? "angry" : t < 4.4 ? "wow" : t < 5.8 ? "sad" : "scared";
  const talkP = t > 0.3 && t < 1.4; const talkB = t > 1.8 && t < 2.8;
  const openP = talkP ? 0.35 + 0.35 * Math.abs(Math.sin(t * 14)) : 0; const openB = talkB ? 0.35 + 0.35 * Math.abs(Math.sin(t * 12)) : 0;
  const k = interpolate(t, [3.0, 3.5], [0, 1], clamp);
  const label: [number, string][] = [[0, "SMUG vs GRUMPY"], [1.6, "LAUGH vs ANGRY"], [3.0, "SHOCK vs WOW"], [4.4, "PROUD vs SAD"], [5.8, "LOVE vs SCARED"]];
  const cur = [...label].reverse().find(([a]) => t >= a)!;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Diorama cam={cam} t={t} cheer={t > 3 && t < 4.4 ? 1 : 0.3} jumbo={<div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 64, color: "#fde047", textShadow: "0 0 16px #facc15" }}>{t > 3 && t < 4.4 ? "GOAL?!" : "ZAM"}</div>}>
        <Cut x={-230} z={-800} cam={cam} size={360} toon><Mascot who="pucky" size={360} mood={pm} open={openP} talking={talkP} noSticker seed="rp" /></Cut>
        <Cut x={240} z={-820} cam={cam} size={360} toon><Mascot who="biscuit" size={360} mood={bm} open={openB} talking={talkB} noSticker flip seed="rb" lookAt={t > 3 && t < 4.4 ? -8 : undefined} /></Cut>
        {k > 0 && k < 1 && <Cut x={-600 + k * 1300} z={-760} y={-200 - Math.sin(k * Math.PI) * 120} cam={cam} size={90} shadow={false} toon><div style={{ width: 90, height: 40, borderRadius: "50%", background: "#111", marginTop: 50 }} /></Cut>}
      </Diorama>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1440, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 84, color: "#fff", WebkitTextStroke: "10px #111", paintOrder: "stroke fill" }}>{cur[1]}</div>
      <div style={{ position: "absolute", left: 52, top: 140, padding: "4px 12px", background: "#ff2bd6", color: "#fff", fontWeight: 900, fontSize: 22, letterSpacing: 2 }}>ZAM · EXPRESSION TEST</div>
    </AbsoluteFill>
  );
};
