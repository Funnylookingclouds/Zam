/** ZAM 2.0 "Hockey Life" prototype stills: cast sheet + style frame (painted locker room, centred word-by-word captions). */
import React from "react";
import { AbsoluteFill } from "remotion";
import { HAND } from "../presenter/kit";
import { FONT } from "../theme";
import { Mascot } from "./Gang";
import { CAST, StickPerson, type StickMood, type StickPose, type StickWho } from "./Stick";

const Grain: React.FC<{ o?: number }> = ({ o = 0.18 }) => (
  <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: o, mixBlendMode: "multiply", pointerEvents: "none" }}>
    <filter id="gouache"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={3} seed={4} /><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 0.9 0" /></filter>
    <rect width="100%" height="100%" filter="url(#gouache)" />
  </svg>
);

export const LockerRoom: React.FC<{ light?: number }> = ({ light = 1 }) => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg,#f2d9b3 0%,#e8c79a 55%,#7b8fa6 55.2%,#5f7389 100%)" }}>
    {/* window + light beams */}
    <div style={{ position: "absolute", left: 640, top: 150, width: 300, height: 200, background: "linear-gradient(180deg,#bfe3ff,#fff7d6)", border: "14px solid #b88a5a", borderRadius: 10 }} />
    <svg width={1080} height={1920} style={{ position: "absolute", opacity: 0.35 * light }}><path d="M660 350 L940 350 L700 1300 L120 1300 Z" fill="#fff7d6" /></svg>
    {/* lockers */}
    {[...Array(5)].map((_, i) => (
      <div key={i} style={{ position: "absolute", left: 30 + i * 125, top: 330, width: 115, height: 720, background: `linear-gradient(90deg,#6f8fb0,#87a7c6 40%,#6382a3)`, border: "5px solid #2b2622", borderRadius: 8 }}>
        {[0, 1, 2].map((v) => <div key={v} style={{ position: "absolute", left: 30, top: 30 + v * 12, width: 55, height: 5, background: "#2b262255", borderRadius: 3 }} />)}
        <div style={{ position: "absolute", left: 18, top: 120, width: 78, height: 30, background: "#fbf6ea", border: "3px solid #2b2622", fontFamily: HAND, fontSize: 24, textAlign: "center", lineHeight: "26px", color: "#2b2622" }}>{["WALT", "GUS?", "", "ROOKIE", ""][i]}</div>
        <div style={{ position: "absolute", right: 14, top: 360, width: 10, height: 50, background: "#2b2622", borderRadius: 4 }} />
      </div>
    ))}
    {/* bench */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 1110, height: 42, background: "#b5793f", border: "5px solid #2b2622" }} />
    {[120, 500, 880].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 1150, width: 26, height: 90, background: "#8a5a2b", border: "4px solid #2b2622" }} />)}
    {/* hanging jerseys */}
    <div style={{ position: "absolute", left: 980, top: 420, width: 0, height: 0 }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 60% 35%, #fff7d633 0%, #00000033 85%)" }} />
    <Grain />
  </AbsoluteFill>
);

const CapWord: React.FC<{ words: string[]; on: number }> = ({ words, on }) => (
  <div style={{ position: "absolute", left: 70, right: 170, top: 1380, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 92, lineHeight: 1.05, color: "#fff", WebkitTextStroke: "10px #111", paintOrder: "stroke fill", textTransform: "uppercase", zIndex: 9 }}>
    {words.map((w, i) => <span key={i} style={{ color: i === on ? "#fde047" : "#fff", display: "inline-block", transform: i === on ? "scale(1.12) rotate(-2deg)" : undefined, margin: "0 16px" }}>{w}</span>)}
  </div>
);

/** One frame of the pilot "The Goalie Who Refused to Retire". */
export const HockeyLifeFrame: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT }}>
    <LockerRoom />
    <div style={{ position: "absolute", left: 470, top: 640 }}><StickPerson who="walt" size={520} mood="grumpy" pose="crossed" sitting seed={1} /></div>
    <div style={{ position: "absolute", left: -10, top: 600 }}><StickPerson who="rookie" size={470} mood="shock" pose="point" open={0.7} seed={2} /></div>
    <div style={{ position: "absolute", left: 830, top: 1000 }}><Mascot who="pucky" size={190} mood="laugh" noSticker seed="hlf" /></div>
    <CapWord words={["He's", "been", "the", "goalie", "for", "30", "years."]} on={3} />
    <div style={{ position: "absolute", left: 52, top: 168, padding: "4px 12px", background: "#111", color: "#fde047", fontWeight: 900, fontSize: 24, letterSpacing: 2 }}>ZAM · HOCKEY LIFE</div>
  </AbsoluteFill>
);

const Card: React.FC<{ title: string; trait: string; line: string; color: string; children: React.ReactNode }> = ({ title, trait, line, color, children }) => (
  <div style={{ width: 490, height: 480, background: "#fbf6ea", border: "6px solid #2b2622", borderRadius: 18, position: "relative", overflow: "hidden", boxShadow: "0 12px 0 #2b262233" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 380, background: `radial-gradient(circle at 50% 60%, ${color}33, transparent 70%)` }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: -4, display: "flex", justifyContent: "center" }}>{children}</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 318, textAlign: "center" }}>
      <div style={{ fontWeight: 900, fontSize: 40, color: "#2b2622" }}><span style={{ display: "inline-block", width: 18, height: 18, borderRadius: 9, background: color, marginRight: 10, border: "3px solid #2b2622" }} />{title}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: "#7a6f62", marginTop: 0, padding: "0 14px" }}>{trait}</div>
      <div style={{ fontFamily: HAND, fontSize: 30, color: "#2b2622", marginTop: 2, padding: "0 14px", lineHeight: 1.05 }}>{line}</div>
    </div>
  </div>
);
const POSES: Record<StickWho, [StickMood, StickPose]> = { rookie: ["happy", "wave"], walt: ["grumpy", "crossed"], gus: ["shock", "point"], ref: ["sad", "shrug"] };

export const HockeyLifeCast: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg,#f2d9b3,#e8c79a)", fontFamily: FONT, alignItems: "center" }}>
    <Grain o={0.12} />
    <div style={{ marginTop: 50, fontSize: 32, fontWeight: 900, letterSpacing: 8, color: "#b4483b" }}>ZAM 2.0 · PROTOTYPE</div>
    <div style={{ fontSize: 110, fontWeight: 900, fontStyle: "italic", color: "#2b2622", lineHeight: 1 }}>HOCKEY LIFE</div>
    <div style={{ fontFamily: HAND, fontSize: 50, color: "#2b2622", marginBottom: 20 }}>tiny sitcoms from the rink – the cast</div>
    <div style={{ display: "grid", gridTemplateColumns: "490px 490px", gap: 30 }}>
      {(Object.keys(CAST) as StickWho[]).map((w, i) => (
        <Card key={w} title={CAST[w].name} trait={CAST[w].trait} line={CAST[w].line} color={CAST[w].color}>
          <StickPerson who={w} size={238} mood={POSES[w][0]} pose={POSES[w][1]} seed={i} open={w === "gus" ? 0.6 : 0} />
        </Card>
      ))}
      <Card title="Pucky" trait="living puck – only the Rookie hears him" line="&quot;Psst. Rookie. Shoot ME.&quot;" color="#d94b3b">
        <div style={{ marginTop: 40 }}><Mascot who="pucky" size={240} mood="smug" noSticker seed="hlc" /></div>
      </Card>
      <Card title="Zam" trait="ice machine – scene wipes, no lines" line="*vroooom* (cleans everything)" color="#3b82f6">
        <div style={{ marginTop: 50 }}><Mascot who="zam" size={240} mood="laugh" noSticker seed="hlz" /></div>
      </Card>
    </div>
  </AbsoluteFill>
);
