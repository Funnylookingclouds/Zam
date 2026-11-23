/** Character sheet for the new gang member Agenty (still). */
import React from "react";
import { AbsoluteFill } from "remotion";
import { HAND } from "../presenter/kit";
import { FONT } from "../theme";
import { Mascot, type Mood } from "./Gang";

export const AgentyCard: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg,#1e1b4b,#312e81)", alignItems: "center", fontFamily: FONT }}>
    <div style={{ marginTop: 70, fontSize: 40, fontWeight: 900, color: "#c4b5fd", letterSpacing: 6 }}>NEW IN THE ZAM GANG</div>
    <div style={{ fontSize: 150, fontWeight: 900, color: "#fff", lineHeight: 1 }}>AGENTY</div>
    <div style={{ fontFamily: HAND, fontSize: 56, color: "#fde68a" }}>the prospect hunter · "Kid, you're going places!"</div>
    <div style={{ marginTop: 20 }}><Mascot who="agenty" size={620} mood="smug" open={0.5} talking seed="card" /></div>
    <div style={{ display: "flex", gap: 20, marginTop: 10 }}>
      {(["wow", "laugh", "scared", "starry"] as Mood[]).map((m) => (
        <div key={m} style={{ textAlign: "center" }}>
          <Mascot who="agenty" size={220} mood={m} seed={m} />
          <div style={{ color: "#c4b5fd", fontWeight: 800, fontSize: 30 }}>{m}</div>
        </div>
      ))}
    </div>
    <div style={{ display: "flex", gap: 6, marginTop: 30, alignItems: "flex-end" }}>
      {(["zam", "pucky", "biscuit", "helmy", "clubby", "agenty"] as const).map((w) => <Mascot key={w} who={w} size={160} mood="laugh" seed={`l${w}`} />)}
    </div>
  </AbsoluteFill>
);
