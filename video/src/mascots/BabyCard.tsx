/** Character sheet: the Baby Gang (Child Edition). */
import React from "react";
import { AbsoluteFill } from "remotion";
import { HAND } from "../presenter/kit";
import { FONT } from "../theme";
import { Mascot, type Who } from "./Gang";

const NAMES: Record<Who, string> = { zam: "Baby Zam", pucky: "Baby Pucky", biscuit: "Baby Biscuit", helmy: "Baby Helmy", clubby: "Baby Clubby", agenty: "Baby Agenty" };
export const BabyCard: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg,#fde7f3 0%,#e0f2fe 60%,#fef9c3 100%)", alignItems: "center", fontFamily: FONT }}>
    <div style={{ marginTop: 70, fontSize: 40, fontWeight: 900, color: "#db2777", letterSpacing: 6 }}>ZAM CHILD EDITION</div>
    <div style={{ fontSize: 140, fontWeight: 900, color: "#7c3aed", lineHeight: 1 }}>BABY GANG</div>
    <div style={{ fontFamily: HAND, fontSize: 56, color: "#0e7490" }}>little ones, big hockey dreams</div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 30 }}>
      {(["pucky", "biscuit", "zam", "helmy", "clubby", "agenty"] as Who[]).map((w) => (
        <div key={w} style={{ textAlign: "center" }}>
          <Mascot who={w} size={400} mood="talk" baby seed={`b${w}`} />
          <div style={{ fontWeight: 900, fontSize: 40, color: "#6b21a8", marginTop: -20 }}>{NAMES[w]}</div>
        </div>
      ))}
    </div>
  </AbsoluteFill>
);
