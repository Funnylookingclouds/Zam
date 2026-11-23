/** ZAM Child Edition #1 – "Baby Gang: Playtime". Slow TV for the littlest viewers: the gang as babies playing on the
 *  playroom floor, humming the "Little Puck" song (ElevenLabs music), falling asleep and dreaming about hockey.
 *  Soft everything: long shots, gentle sway, crossfades, music-box intro/outro, no flashes or bangs. */
import React from "react";
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import words from "../data/child01_words.json";
import { P, HAND, clamp } from "../presenter/kit";
import { FONT } from "../theme";
import { Mascot, type Mood, type Who } from "../mascots/Gang";
import { Caption, Logo, type W } from "../zam/common";
import { FPS, timing } from "../zam/Episode";
import { Big, SegCtx } from "../zam/toon";

const WORDS = words as W[];
const { SEGS, LAST } = timing(WORDS);
const INTRO = 2.4, OUTRO = 3.9, XF = 0.6;
const F = (s: number) => Math.round(s * FPS);
const OUT_AT = INTRO + LAST + 0.5;
export const CHILD01_FRAMES = Math.ceil((OUT_AT + OUTRO) * FPS);
const soft = { ...clamp, easing: Easing.inOut(Easing.sin) };
const sway = (t: number, sp = 0.6, amp = 3, ph = 0) => Math.sin(t * sp * Math.PI * 2 + ph) * amp;

// ------------------------------------------------------------------ song lyrics (song starts at news-time 20.65)
const SONG = 20.65;
const LYRICS: { at: number; end: number; text: string }[] = [
  { at: 1.2, end: 4.0, text: "Mm-mm, mm-mm…" },
  { at: 4.06, end: 7.9, text: "Little puck, little puck, slide so slow," },
  { at: 8.04, end: 11.9, text: "round and round on the ice we go." },
  { at: 12.06, end: 16.0, text: "Swish, swish, skate, skate, dream of hockey," },
  { at: 16.16, end: 19.0, text: "it's getting late…" },
  { at: 19.2, end: 22.0, text: "Mm-mm, mm-mm…" },
].map((l) => ({ ...l, at: l.at + SONG, end: l.end + SONG }));
const singing = (t: number) => LYRICS.some((l) => t >= l.at && t <= l.end);
const singOpen = (t: number, ph = 0) => (singing(t) ? 0.25 + 0.3 * Math.max(0, Math.sin(t * 9 + ph)) : 0);

const LyricCard: React.FC<{ t: number }> = ({ t }) => {
  const l = LYRICS.find((x) => t >= x.at - 0.2 && t <= x.end);
  if (!l) return null;
  const o = interpolate(t, [l.at - 0.2, l.at + 0.2, l.end - 0.3, l.end], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 60, right: 170, top: 1420, opacity: o, background: "#fffdf7", borderLeft: "14px solid #f9a8d4", borderRadius: 8, padding: "18px 26px", boxShadow: "0 10px 30px #0b254533", fontFamily: FONT, fontSize: 44, fontWeight: 800, color: P.ink, lineHeight: 1.25, zIndex: 7 }}>
      <span style={{ color: "#db2777", marginRight: 10 }}>♪</span>{l.text}<span style={{ color: "#db2777", marginLeft: 10 }}>♪</span>
    </div>
  );
};

// ------------------------------------------------------------------ playroom set
const Floor: React.FC<{ top?: number }> = ({ top = 1050 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top, bottom: 0, background: "repeating-linear-gradient(90deg,#e8c39e 0 150px,#deb58c 150px 154px)" }} />
);
const Rug: React.FC<{ x?: number; y?: number; w?: number }> = ({ x = 90, y = 1150, w = 900 }) => (
  <svg width={w} height={w * 0.36} style={{ position: "absolute", left: x, top: y }}>
    {["#bfdbfe", "#fbcfe8", "#fef08a", "#bbf7d0"].map((c, i) => <ellipse key={i} cx={w / 2} cy={w * 0.18} rx={w / 2 - 4 - i * w * 0.07} ry={w * 0.18 - 4 - i * w * 0.025} fill={c} stroke="#00000014" strokeWidth={4} />)}
  </svg>
);
const Window: React.FC<{ night?: number }> = ({ night = 0 }) => (
  <div style={{ position: "absolute", left: 640, top: 300, width: 320, height: 380, background: `linear-gradient(180deg, ${night > 0.5 ? "#1e3a8a,#312e81" : "#bae6fd,#e0f2fe"})`, border: "16px solid #fff7ed", borderRadius: "160px 160px 12px 12px", boxShadow: "0 0 0 5px #00000018", overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 136, top: 0, bottom: 0, width: 16, background: "#fff7ed" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 200, height: 16, background: "#fff7ed" }} />
    {night > 0.5 ? (
      <>
        <div style={{ position: "absolute", left: 180, top: 40, width: 80, height: 80, borderRadius: 40, boxShadow: "-18px 8px 0 0 #fef9c3" }} />
        {[...Array(7)].map((_, i) => <div key={i} style={{ position: "absolute", left: 20 + random(`st${i}`) * 250, top: 20 + random(`sy${i}`) * 300, color: "#fef9c3", fontSize: 26 }}>✦</div>)}
      </>
    ) : (
      <>
        <div style={{ position: "absolute", left: 30, top: 50, width: 90, height: 40, borderRadius: 30, background: "#fff" }} />
        <div style={{ position: "absolute", left: 180, top: 250, width: 100, height: 44, borderRadius: 30, background: "#fff" }} />
      </>
    )}
  </div>
);
const Blocks: React.FC<{ x: number; y: number; n?: number; s?: number }> = ({ x, y, n = 3, s = 110 }) => (
  <div style={{ position: "absolute", left: x, top: y }}>
    {[...Array(n)].map((_, i) => (
      <div key={i} style={{ position: "absolute", left: (i % 2) * s * 0.15, top: -i * s, width: s, height: s, background: ["#fca5a5", "#93c5fd", "#fde68a", "#86efac", "#c4b5fd"][i % 5], border: `5px solid ${P.ink}`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: s * 0.55, color: "#fff", WebkitTextStroke: `3px ${P.ink}`, paintOrder: "stroke fill" }}>{"ZAM!"[i % 4]}</div>
    ))}
  </div>
);
const Playroom: React.FC<{ night?: number; rug?: boolean }> = ({ night = 0, rug = true }) => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg,#fde2e4 0%,#fff1e6 60%)" }}>
    {/* wallpaper dots */}
    {[...Array(30)].map((_, i) => <div key={i} style={{ position: "absolute", left: (i % 6) * 190 + ((i / 6) | 0) % 2 * 95 + 30, top: ((i / 6) | 0) * 190 + 60, width: 22, height: 22, borderRadius: 11, background: ["#fbcfe8", "#bfdbfe", "#fde68a"][i % 3] }} />)}
    {/* bunting */}
    <svg width={1080} height={200} style={{ position: "absolute", top: 210 }}>
      <path d="M0 20 Q540 120 1080 20" stroke="#a78bfa" strokeWidth={5} fill="none" />
      {[...Array(9)].map((_, i) => { const x = 60 + i * 120, y = 20 + Math.sin((x / 1080) * Math.PI) * 76; return <path key={i} d={`M${x - 34} ${y} L${x + 34} ${y} L${x} ${y + 70} Z`} fill={["#f9a8d4", "#93c5fd", "#fde68a", "#86efac"][i % 4]} stroke={P.ink} strokeWidth={3} />; })}
    </svg>
    <Window night={night} />
    {/* shelf with toys */}
    <div style={{ position: "absolute", left: 80, top: 520, width: 440, height: 22, background: "#c08457", border: `4px solid ${P.ink}`, borderRadius: 6 }} />
    <div style={{ position: "absolute", left: 110, top: 430, width: 90, height: 90, borderRadius: 45, background: "#fca5a5", border: `4px solid ${P.ink}` }} />
    <div style={{ position: "absolute", left: 240, top: 420, width: 70, height: 100, background: "#93c5fd", border: `4px solid ${P.ink}`, borderRadius: 10 }} />
    <div style={{ position: "absolute", left: 350, top: 440, fontSize: 80 }}>⭐</div>
    <Floor />
    {rug && <Rug />}
    {night > 0 && <AbsoluteFill style={{ background: "#1e1b4b", opacity: night * 0.55 }} />}
  </AbsoluteFill>
);
const Notes: React.FC<{ t: number; n?: number; x?: number; w?: number; top?: number }> = ({ t, n = 7, x = 80, w = 900, top = 1250 }) => (
  <>
    {[...Array(n)].map((_, i) => {
      const life = ((t * 0.18 + random(`nt${i}`)) % 1);
      return <div key={i} style={{ position: "absolute", left: x + random(`nx${i}`) * w + sway(t, 0.3, 30, i), top: top - life * 900, fontSize: 70 + random(`ns${i}`) * 40, color: ["#db2777", "#7c3aed", "#2563eb", "#059669"][i % 4], opacity: interpolate(life, [0, 0.15, 0.8, 1], [0, 0.9, 0.9, 0]), zIndex: 6 }}>{i % 2 ? "♪" : "♫"}</div>;
    })}
  </>
);
const Zs: React.FC<{ t: number; x: number; y: number }> = ({ t, x, y }) => (
  <>
    {[0, 1, 2].map((i) => { const life = (t * 0.25 + i / 3) % 1; return <div key={i} style={{ position: "absolute", left: x + life * 80 + sway(t, 0.4, 12, i), top: y - life * 180, fontFamily: FONT, fontWeight: 900, fontSize: 46 + life * 40, color: "#c7d2fe", opacity: interpolate(life, [0, 0.2, 0.8, 1], [0, 1, 1, 0]), zIndex: 6 }}>z</div>; })}
  </>
);

/** Baby actor: lip-syncs when it's their line, sways gently, optional song mouth. */
const Baby: React.FC<{ who: Who; t: number; size: number; x: number; y: number; mood?: Mood; flip?: boolean; ph?: number; sing?: boolean; rot?: number; z?: number }> = ({ who, t, size, x, y, mood = "bliss", flip, ph = 0, sing, rot = 0, z }) => (
  <Big who={who} t={t} size={size} x={x + sway(t, 0.25, 8, ph)} y={y} mood={mood} flip={flip} rot={rot + sway(t, 0.3, 2.5, ph)} baby z={z} open={sing ? singOpen(t, ph) : undefined} />
);
const Pan: React.FC<{ lf: number; dur: number; from?: number; to?: number; x0?: number; x1?: number; children: React.ReactNode }> = ({ lf, dur, from = 1, to = 1.06, x0 = 0, x1 = 0, children }) => {
  const k = interpolate(lf, [0, F(dur)], [0, 1], soft);
  return <AbsoluteFill style={{ transform: `scale(${from + (to - from) * k}) translateX(${x0 + (x1 - x0) * k}px)`, transformOrigin: "50% 60%" }}>{children}</AbsoluteFill>;
};

// ------------------------------------------------------------------ shots (news time)
type Shot = { from: number; dur?: number; Comp: React.FC<{ t: number; lf: number; dur: number }> };
const SHOTS: Shot[] = [
  { from: 0, Comp: ({ t, lf, dur }) => ( // Zam rolls in slowly: "Hi hi… play time!"
    <Pan lf={lf} dur={dur} to={1.08}><Playroom />
      <Baby who="zam" t={t} size={620} x={interpolate(lf, [0, F(1.6)], [-520, 230], soft)} y={720} mood={t > 0.8 ? "laugh" : "bliss"} />
      <Blocks x={820} y={1180} n={2} s={100} />
    </Pan>) },
  { from: 2.9, Comp: ({ t, lf, dur }) => { // Pucky with pacifier and a toy puck
    const px = interpolate(lf, [0, F(dur)], [180, 760], soft);
    return (<Pan lf={lf} dur={dur} to={1.07}><Playroom />
      <Baby who="pucky" t={t} size={660} x={250} y={620} mood={t > 4.5 ? "laugh" : "bliss"} />
      <div style={{ position: "absolute", left: px, top: 1290, width: 120, height: 46, borderRadius: "50%", background: "#334155", border: `5px solid ${P.ink}` }} />
    </Pan>); } },
  { from: 6.4, Comp: ({ t, lf, dur }) => { // Biscuit stacks a big block
    const drop = interpolate(lf, [F(1.0), F(2.2)], [-400, 0], soft);
    return (<Pan lf={lf} dur={dur} from={1.04} to={1}><Playroom />
      <Baby who="biscuit" t={t} size={600} x={60} y={700} mood={t > 7.6 ? "laugh" : "bliss"} />
      <div style={{ position: "absolute", left: 640, top: 1200 }}><Blocks x={0} y={0} n={2} s={130} /></div>
      <div style={{ position: "absolute", left: 650, top: 920 + drop, width: 160, height: 160, background: "#c4b5fd", border: `6px solid ${P.ink}`, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 90, color: "#fff", WebkitTextStroke: `4px ${P.ink}`, paintOrder: "stroke fill" }}>B</div>
    </Pan>); } },
  { from: 10.3, Comp: ({ t, lf, dur }) => ( // Helmy counts 1, 2, 3
    <Pan lf={lf} dur={dur} to={1.06}><Playroom />
      <Baby who="helmy" t={t} size={600} x={240} y={640} mood="bliss" />
      {[["1", 10.55], ["2", 11.05], ["3", 11.6]].map(([n, a], i) => (
        <div key={n} style={{ position: "absolute", left: 170 + i * 270, top: 400 + sway(t, 0.4, 10, i), width: 180, height: 180, borderRadius: 90, background: ["#fca5a5", "#93c5fd", "#fde68a"][i], border: `6px solid ${P.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 120, color: P.ink, opacity: interpolate(t, [Number(a), Number(a) + 0.4], [0, 1], clamp), transform: `scale(${interpolate(t, [Number(a), Number(a) + 0.5], [0.6, 1], soft)})`, zIndex: 5 }}>{n}</div>
      ))}
    </Pan>) },
  { from: 13.3, Comp: ({ t, lf, dur }) => { // Clubby on a rocking horse
    const rock = Math.sin(t * 1.6) * 7;
    return (<Pan lf={lf} dur={dur} to={1.05} x0={-20} x1={20}><Playroom />
      <div style={{ position: "absolute", left: 210, top: 840, transform: `rotate(${rock}deg)`, transformOrigin: "330px 520px" }}>
        <svg width={660} height={560} style={{ position: "absolute", left: 0, top: 0 }}>
          <path d="M40 470 Q330 580 620 470" stroke="#b45309" strokeWidth={26} fill="none" strokeLinecap="round" />
          <rect x={180} y={380} width={22} height={100} fill="#b45309" /><rect x={460} y={380} width={22} height={100} fill="#b45309" />
          <ellipse cx={330} cy={360} rx={210} ry={70} fill="#fcd34d" stroke={P.ink} strokeWidth={6} />
          <path d="M500 330 L560 170 L640 190 L600 340 Z" fill="#fcd34d" stroke={P.ink} strokeWidth={6} />
          <circle cx={600} cy={215} r={9} fill={P.ink} />
          <path d="M540 180 Q520 250 500 300" stroke="#f472b6" strokeWidth={22} fill="none" strokeLinecap="round" />
          <path d="M120 340 Q60 360 70 430" stroke="#f472b6" strokeWidth={20} fill="none" strokeLinecap="round" />
        </svg>
        <div style={{ position: "absolute", left: 140, top: -110 }}><Big who="clubby" t={t} size={430} x={0} y={0} mood={t > 13.9 ? "laugh" : "bliss"} baby /></div>
      </div>
    </Pan>); } },
  { from: 16.3, Comp: ({ t, lf, dur }) => { // Agenty gives Pucky a star sticker
    const k = interpolate(t, [18.2, 19.6], [0, 1], soft);
    return (<Pan lf={lf} dur={dur} to={1.05}><Playroom />
      <Baby who="agenty" t={t} size={470} x={40} y={760} mood="bliss" />
      <Baby who="pucky" t={t} size={440} x={590} y={820} mood={t > 18.6 ? "laugh" : "bliss"} flip ph={1.2} />
      <div style={{ position: "absolute", left: interpolate(k, [0, 1], [400, 760]), top: interpolate(k, [0, 0.5, 1], [900, 760, 950]), fontSize: 130, transform: `rotate(${k * 360}deg)`, opacity: t > 17.6 ? 1 : 0, zIndex: 6 }}>⭐</div>
    </Pan>); } },
  { from: 20.4, Comp: ({ t, lf, dur }) => { // all six in a circle, humming & singing
    const row1: [Who, number, number][] = [["helmy", 70, 720], ["zam", 390, 680], ["clubby", 720, 640]];
    const row2: [Who, number, number][] = [["biscuit", 30, 1010], ["pucky", 375, 1040], ["agenty", 690, 1020]];
    return (<Pan lf={lf} dur={dur} from={1} to={1.08}><Playroom />
      {row1.map(([w, x, y], i) => <Baby key={w} who={w} t={t} size={330} x={x} y={y} sing ph={i} mood="bliss" />)}
      {row2.map(([w, x, y], i) => <Baby key={w} who={w} t={t} size={345} x={x} y={y} sing ph={i + 3} mood="bliss" z={3} />)}
      <Notes t={t} />
    </Pan>); } },
  { from: 31.3, Comp: ({ t, lf, dur }) => { // toy rink: little puck slides round and round
    const a = t * 0.9;
    return (<Pan lf={lf} dur={dur} from={1.08} to={1}><Playroom rug={false} />
      <div style={{ position: "absolute", left: 90, top: 760, width: 900, height: 520, borderRadius: 220, background: "#f0f9ff", border: `14px solid #f9a8d4`, boxShadow: "0 18px 0 #e9a5c6" }}>
        <div style={{ position: "absolute", left: 440, top: 0, bottom: 0, width: 10, background: "#fca5a5" }} />
        <div style={{ position: "absolute", left: 365, top: 185, width: 150, height: 150, borderRadius: 75, border: "8px solid #93c5fd" }} />
        <div style={{ position: "absolute", left: 425 + Math.cos(a) * 300, top: 240 + Math.sin(a) * 160, width: 70, height: 30, borderRadius: "50%", background: "#334155", border: `4px solid ${P.ink}` }} />
      </div>
      <Baby who="pucky" t={t} size={360} x={60} y={420} sing mood="bliss" ph={2} />
      <Baby who="biscuit" t={t} size={340} x={680} y={440} sing mood="bliss" flip ph={4} />
      <Notes t={t} n={5} top={900} />
    </Pan>); } },
  { from: 39.6, Comp: ({ t, lf, dur }) => { // lights go down, sleepy, "Sleepy…" / "…goal."
    const night = interpolate(t, [39.6, 42.5], [0.15, 1], soft);
    const asleep = (k: number) => t > 42 + k * 0.6;
    const cast: [Who, number, number, number][] = [["biscuit", 20, 960, 360], ["zam", 340, 1000, 380], ["pucky", 700, 990, 340]];
    return (<Pan lf={lf} dur={dur} from={1} to={1.1}><Playroom night={night} />
      <div style={{ position: "absolute", left: 470, top: 840, width: 140, height: 140, borderRadius: 70, background: "radial-gradient(#fef9c3,#fde68a00 70%)", opacity: night, zIndex: 1 }} />
      {cast.map(([w, x, y, s], i) => <Baby key={w} who={w} t={t} size={s} x={x} y={y} mood={asleep(i) && !(w === "pucky" && t > 45.8 && t < 47) && !(w === "zam" && t > 43.2 && t < 44.5) ? "sleep" : "tired"} ph={i} />)}
      {t > 42.5 && <Zs t={t} x={200} y={950} />}
      {t > 44 && <Zs t={t + 1.3} x={560} y={980} />}
    </Pan>); } },
  { from: 46.0, Comp: ({ t, lf, dur }) => { // dream bubble: grown-up Clubby shoots, Pucky scores
    const k = interpolate(t, [46.6, 48.2], [0, 1], soft);
    const bubble = interpolate(lf, [0, F(0.8)], [0, 1], soft);
    return (<Pan lf={lf} dur={dur} to={1.05}><Playroom night={1} />
      <Baby who="pucky" t={t} size={420} x={330} y={1020} mood="sleep" />
      <Zs t={t} x={640} y={1020} />
      {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: 600 + i * 60, top: 960 - i * 80, width: 40 + i * 20, height: 40 + i * 20, borderRadius: "50%", background: "#eef2ff", opacity: bubble }} />)}
      <div style={{ position: "absolute", left: 90, top: 260, width: 900, height: 660, borderRadius: 330, background: "#eef2ff", boxShadow: "0 0 60px #c7d2fe", opacity: bubble, transform: `scale(${0.7 + 0.3 * bubble})`, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 120, top: 420, width: 660, height: 160, borderRadius: 80, background: "#e0f2fe" }} />
        {/* net */}
        <div style={{ position: "absolute", left: 690, top: 320, width: 120, height: 150, border: `8px solid #ef4444`, borderLeft: "none", background: "repeating-linear-gradient(45deg,#fff0 0 14px,#cbd5e1 14px 17px)" }} />
        <div style={{ position: "absolute", left: 120, top: 180 }}><Mascot who="clubby" size={260} mood="laugh" seed="dreamc" noSticker /></div>
        <div style={{ position: "absolute", left: 300 + k * 410, top: 400 - Math.sin(k * Math.PI) * 120, transform: `rotate(${k * 720}deg)` }}><Mascot who="pucky" size={110} mood="laugh" seed="dreamp" noSticker /></div>
        {k > 0.95 && [...Array(8)].map((_, i) => <div key={i} style={{ position: "absolute", left: 650 + random(`gs${i}`) * 200, top: 200 + random(`gy${i}`) * 220, fontSize: 40, color: "#f59e0b", opacity: interpolate(t, [48.2, 48.6], [0, 1], clamp) }}>✦</div>)}
        <div style={{ position: "absolute", left: 0, right: 0, top: 80, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 70, color: "#6366f1", opacity: interpolate(t, [48.2, 48.8], [0, 1], clamp) }}>goal… ✨</div>
      </div>
    </Pan>); } },
  { from: 48.85, Comp: ({ t, lf, dur }) => ( // Zam close-up: "Sweet dreams."
    <Pan lf={lf} dur={dur} from={1.02} to={1.1}><Playroom night={1} />
      <Baby who="zam" t={t} size={640} x={220} y={760} mood={t > 49.8 ? "sleep" : "tired"} />
      <Zs t={t} x={760} y={800} />
    </Pan>) },
];
const RANGES = SHOTS.map((s, i) => ({ ...s, to: SHOTS[i + 1]?.from ?? LAST + 0.5 }));

// ------------------------------------------------------------------ soft intro / outro
const BabyIntro: React.FC = () => {
  const f = useCurrentFrame();
  const fade = interpolate(f, [F(INTRO) - 14, F(INTRO)], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#fde2e4,#e0f2fe)", opacity: fade }}>
      {[...Array(14)].map((_, i) => <div key={i} style={{ position: "absolute", left: random(`ib${i}`) * 1000, top: 1900 - ((f * (1 + random(`is${i}`)) + random(`iy${i}`) * 1900) % 2000), width: 60, height: 60, borderRadius: 30, border: "4px solid #ffffffcc", background: "#ffffff44" }} />)}
      <div style={{ position: "absolute", top: 560, left: 0, right: 0, transform: `scale(${interpolate(f, [0, 40], [0.85, 1], soft)})`, opacity: interpolate(f, [0, 24], [0, 1], clamp) }}><Logo /></div>
      <div style={{ position: "absolute", top: 880, left: 0, right: 0, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 88, color: "#db2777", opacity: interpolate(f, [30, 54], [0, 1], clamp) }}>baby gang ♡</div>
      <div style={{ position: "absolute", left: 300, top: 1040, opacity: interpolate(f, [40, 70], [0, 1], clamp) }}><Mascot who="pucky" size={480} mood="bliss" baby noSticker seed="ip" /></div>
      <Audio src={staticFile("sfx/musicbox_intro.wav")} volume={0.6} />
    </AbsoluteFill>
  );
};
const BabyOutro: React.FC = () => {
  const f = useCurrentFrame();
  const gang: Who[] = ["helmy", "biscuit", "zam", "pucky", "clubby", "agenty"];
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#312e81,#1e1b4b)", opacity: interpolate(f, [0, 18], [0, 1], clamp) }}>
      {[...Array(30)].map((_, i) => <div key={i} style={{ position: "absolute", left: random(`os${i}`) * 1060, top: random(`oy${i}`) * 1300, color: "#fef9c3", fontSize: 18 + random(`oz${i}`) * 26, opacity: 0.5 + 0.5 * Math.sin(f / 20 + i) }}>✦</div>)}
      <div style={{ position: "absolute", left: 760, top: 220, width: 170, height: 170, borderRadius: 85, boxShadow: "-34px 16px 0 0 #fef9c3" }} />
      <div style={{ position: "absolute", top: 420, left: 0, right: 0 }}><Logo scale={0.75} /></div>
      <div style={{ position: "absolute", top: 720, left: 0, right: 0, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 84, color: "#fbcfe8" }}>bye bye… see you soon ♡</div>
      <div style={{ position: "absolute", top: 830, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: "#c7d2fe" }}>follow @ZamHockey for more baby gang</div>
      {gang.map((w, i) => <div key={w} style={{ position: "absolute", left: 30 + i * 165, top: 1060 + (i % 2) * 70 + Math.sin(f / 30 + i) * 6 }}><Mascot who={w} size={180} mood={w === "zam" ? "bliss" : "sleep"} baby noSticker seed={`o${w}`} open={w === "zam" && f > 8 && f < 110 ? 0.3 + 0.3 * Math.max(0, Math.sin(f / 4)) : 0} talking={w === "zam" && f > 8 && f < 110} /></div>)}
      <Sequence from={8}><Audio src={staticFile("brand/outro_baby.mp3")} volume={0.95} /></Sequence>
      <Audio src={staticFile("sfx/musicbox_outro.wav")} volume={0.45} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ composition
export const Child01: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS - INTRO;
  const N = (s: number) => F(INTRO + s);
  const live = f >= F(INTRO) && t < LAST + 0.5;
  return (
    <SegCtx.Provider value={SEGS}>
      <AbsoluteFill style={{ fontFamily: FONT, background: "#fff1e6", overflow: "hidden" }}>
        <Sequence from={F(INTRO)} durationInFrames={F(OUT_AT - INTRO) + 20}><Audio src={staticFile("ep/child01.mp3")} /></Sequence>
        {RANGES.map((s, i) => {
          const C = s.Comp; const start = N(s.from) - (i ? F(XF) : 0); const dur = N(s.to) - start + F(XF);
          return (
            <Sequence key={s.from} from={start} durationInFrames={dur}>
              <XFade first={i === 0} dur={dur}><C t={t} lf={f - N(s.from)} dur={s.to - s.from} /></XFade>
            </Sequence>
          );
        })}
        {RANGES.slice(1).map((s) => <Sequence key={`c${s.from}`} from={N(s.from) - F(XF / 2)} durationInFrames={F(1.8)}><Audio src={staticFile("sfx/chime.wav")} volume={s.from > 20 && s.from < 40 ? 0.05 : 0.14} /></Sequence>)}
        {live && <div style={{ position: "absolute", left: 52, top: 168, padding: "4px 12px", background: "#db2777", color: "#fff", fontWeight: 900, fontSize: 22, letterSpacing: 2, zIndex: 8 }}>ZAM · BABY GANG #1</div>}
        {live && <Caption t={t} segs={SEGS} top={1420} />}
        {live && <LyricCard t={t} />}
        <Sequence from={0} durationInFrames={F(INTRO) + 2}><BabyIntro /></Sequence>
        <Sequence from={F(OUT_AT)}><BabyOutro /></Sequence>
      </AbsoluteFill>
    </SegCtx.Provider>
  );
};
const XFade: React.FC<{ first: boolean; dur: number; children: React.ReactNode }> = ({ first, dur, children }) => {
  const f = useCurrentFrame();
  const o = first ? 1 : interpolate(f, [0, F(XF)], [0, 1], soft);
  void dur;
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};
