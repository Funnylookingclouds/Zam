/** "ZAM GANG 2.0" character sheet (originals in the new 2.5D bean style) + a 2.5D group still. */
import React from "react";
import { AbsoluteFill } from "remotion";
import { HAND } from "../presenter/kit";
import { FONT } from "../theme";
import { Mascot } from "./Gang";
import { GANG2, GangPerson, type GangWho } from "./Hybrid";
import { Bill, LockerRoom3D, frame } from "../hl3d/Set3D";
import type { StickMood, StickPose } from "./Stick";

const ORDER: GangWho[] = ["pucky", "biscuit", "zam", "helmy", "clubby", "agenty"];
const LOOK: Record<GangWho, [StickMood, StickPose]> = { pucky: ["happy", "up"], biscuit: ["smug", "crossed"], zam: ["happy", "wave"], helmy: ["talk", "point"], clubby: ["grumpy", "point"], agenty: ["smug", "wave"] };

export const GangCard2: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg,#f2d9b3,#e8c79a)", fontFamily: FONT, alignItems: "center" }}>
    <div style={{ marginTop: 50, fontSize: 32, fontWeight: 900, letterSpacing: 8, color: "#b4483b" }}>THE ORIGINALS · NEW LOOK</div>
    <div style={{ fontSize: 120, fontWeight: 900, fontStyle: "italic", color: "#2b2622", lineHeight: 1 }}>ZAM GANG 2.0</div>
    <div style={{ fontFamily: HAND, fontSize: 48, color: "#2b2622", marginBottom: 16 }}>same faces you know – ready for 2.5D</div>
    <div style={{ display: "grid", gridTemplateColumns: "490px 490px", gap: 26 }}>
      {ORDER.map((w, i) => (
        <div key={w} style={{ width: 490, height: 500, background: "#fbf6ea", border: "6px solid #2b2622", borderRadius: 18, position: "relative", overflow: "hidden", boxShadow: "0 12px 0 #2b262233" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 360, background: `radial-gradient(circle at 50% 60%, ${GANG2[w].body}33, transparent 70%)` }} />
          <div style={{ position: "absolute", right: 14, top: 14, width: 110, height: 110, borderRadius: 55, background: "#fff", border: "4px dashed #2b262255", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}><Mascot who={w} size={90} mood="laugh" noSticker seed={`o${w}`} /></div>
          <div style={{ position: "absolute", left: 0, right: 0, top: -14, display: "flex", justifyContent: "center" }}><GangPerson who={w} size={250} mood={LOOK[w][0]} pose={LOOK[w][1]} seed={i} open={w === "pucky" || w === "clubby" ? 0.5 : 0} /></div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 336, textAlign: "center" }}>
            <div style={{ fontWeight: 900, fontSize: 42, color: "#2b2622" }}><span style={{ display: "inline-block", width: 18, height: 18, borderRadius: 9, background: GANG2[w].body, marginRight: 10, border: "3px solid #2b2622" }} />{GANG2[w].name}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#7a6f62", padding: "0 14px" }}>{GANG2[w].role}</div>
            <div style={{ fontFamily: HAND, fontSize: 32, color: "#2b2622" }}>{GANG2[w].line}</div>
          </div>
        </div>
      ))}
    </div>
  </AbsoluteFill>
);

export const GangScene2: React.FC = () => {
  const cam = frame(0, -560, -800, 1800, 860, { rx: -3 });
  const pos: [GangWho, number, number][] = [["clubby", -760, -1050], ["helmy", -380, -820], ["biscuit", 0, -1000], ["pucky", 380, -760], ["agenty", 760, -1000], ["zam", 0, -520]];
  return (
    <AbsoluteFill>
      <LockerRoom3D cam={cam}>{pos.map(([w, x, z], i) => <Bill key={w} x={x} z={z} cam={cam} w={460} h={598}><GangPerson who={w} size={460} mood={LOOK[w][0]} pose={LOOK[w][1]} seed={i} sitting={w === "biscuit"} /></Bill>)}</LockerRoom3D>
      <div style={{ position: "absolute", left: 60, right: 170, top: 1420, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 92, textTransform: "uppercase", color: "#fff", WebkitTextStroke: "11px #111", paintOrder: "stroke fill" }}>THE GANG IS <span style={{ color: "#fde047" }}>BACK.</span></div>
    </AbsoluteFill>
  );
};
