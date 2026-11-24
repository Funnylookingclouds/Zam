/** 2.5D look test: three stills from one locker-room set – wide establishing, over-the-shoulder, low-angle two-shot. */
import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT } from "../theme";
import { Mascot } from "../mascots/Gang";
import { StickPerson } from "../mascots/Stick";
import { Bill, LockerRoom3D, type Camera } from "./Set3D";

/** Back of a head for over-the-shoulder shots. */
export const BackHead: React.FC<{ who: "walt" | "rookie"; size: number }> = ({ who, size }) => (
  <svg width={size} height={size * 1.25} viewBox="-120 -150 240 300">
    <path d="M-110 150 Q-110 60 -60 40 L60 40 Q110 60 110 150 Z" fill={who === "walt" ? "#e0a526" : "#2a9d8f"} stroke="#2b2622" strokeWidth={9} />
    {[...Array(14)].map((_, i) => <rect key={i} x={-100 + i * 15} y={50} width={5} height={100} fill="#00000018" />)}
    <ellipse cx={0} cy={-30} rx={100} ry={110} fill="#fffaf0" stroke="#2b2622" strokeWidth={9} />
    {who === "rookie" ? <path d="M-100 -40 Q-90 -150 0 -142 Q90 -150 100 -40 Q60 -80 0 -78 Q-60 -80 -100 -40 Z" fill="#7c4a1e" stroke="#2b2622" strokeWidth={7} /> : <g><rect x={-80} y={-150} width={160} height={90} rx={40} fill="#f8fafc" stroke="#2b2622" strokeWidth={7} /><path d="M-70 -60 Q0 -20 70 -60" stroke="#475569" strokeWidth={8} fill="none" /></g>}
  </svg>
);
const Cap: React.FC<{ words: string[]; on: number }> = ({ words, on }) => (
  <div style={{ position: "absolute", left: 60, right: 170, top: 1360, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 96, textTransform: "uppercase", zIndex: 9 }}>
    {words.map((w, i) => <span key={i} style={{ display: "inline-block", margin: "0 14px", color: i === on ? "#fde047" : "#fff", WebkitTextStroke: "11px #111", paintOrder: "stroke fill" }}>{w}</span>)}
  </div>
);

const Scene: React.FC<{ cam: Camera; ots?: boolean }> = ({ cam, ots }) => (
  <LockerRoom3D cam={cam}>
    <Bill x={-300} z={-820} cam={cam} w={700} h={910}><StickPerson who="walt" size={700} mood="smug" pose="crossed" sitting bean seed={1} /></Bill>
    <Bill x={330} z={-380} cam={cam} w={650} h={845}><StickPerson who="rookie" size={650} mood="shock" pose="point" open={0.6} bean seed={2} /></Bill>
    <Bill x={-760} z={-1000} y={-200} cam={cam} w={210} h={235} shadow={false}><Mascot who="pucky" size={210} mood="laugh" noSticker seed="p25" /></Bill>
    <Bill x={950} z={-1050} cam={cam} w={520} h={676}><StickPerson who="gus" size={520} mood="grumpy" pose="crossed" bean seed={3} /></Bill>
    {ots && <Bill x={-260} z={-180} y={0} cam={cam} w={1000} h={1250} shadow={false} blurPx={7}><BackHead who="walt" size={1000} /></Bill>}
  </LockerRoom3D>
);

export const Proto25DWide: React.FC = () => <AbsoluteFill><Scene cam={{ x: 0, y: -560, z: 250, rx: -4, focus: -550 }} /><Cap words={["BIG", "WALT", "WON'T", "RETIRE."]} on={1} /></AbsoluteFill>;
export const Proto25DOTS: React.FC = () => <AbsoluteFill><Scene cam={{ x: 150, y: -620, z: -40, ry: -12, rx: -2, focus: -380 }} ots /><Cap words={["THE", "NET", "IS", "YOURS?!"]} on={3} /></AbsoluteFill>;
export const Proto25DLow: React.FC = () => <AbsoluteFill><Scene cam={{ x: -140, y: -240, z: -120, ry: 14, rx: 8, focus: -820 }} /><Cap words={["I", "SLEEP", "IN", "THE", "NET."]} on={1} /></AbsoluteFill>;
