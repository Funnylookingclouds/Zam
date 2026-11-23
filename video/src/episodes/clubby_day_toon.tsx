/** ZAM Special Edition – "Clubby: Back in My Day" (cartoon). Facts: first indoor game Mar 3 1875 Montreal (McGill 2–1),
 *  goalies allowed to drop to the ice Jan 9 1918, forward passes in the attacking zone from 1929–30 (scoring more than doubled),
 *  Stan Mikita's accidental curved blade (1960s), Craig MacTavish last helmetless player (retired 1997). */
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, random, staticFile, useCurrentFrame, Easing } from "remotion";
import words from "../data/clubby_day_words.json";
import { P, HAND, clamp, onTwos } from "../presenter/kit";
import { Mascot } from "../mascots/Gang";
import { Confetti, type W } from "../zam/common";
import { timing } from "../zam/Episode";
import { BgBurst, BgLab, BgRink, Big, Flash, Grain, Pow, Sparkles, StickerCard, makeToon, type ToonShot } from "../zam/toon";

const WORDS = words as W[];
const { S, at } = timing(WORDS);

/** Cosy living room with a flickering fireplace. */
const BgLiving: React.FC = () => {
  const f = onTwos(useCurrentFrame());
  return (
    <AbsoluteFill style={{ background: "repeating-linear-gradient(90deg,#f3d9a4 0 60px,#eccf94 60px 120px)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1150, bottom: 0, background: "repeating-linear-gradient(90deg,#9a6b3f 0 140px,#8a5d35 140px 280px)", borderTop: `10px solid ${P.ink}` }} />
      <div style={{ position: "absolute", left: 640, top: 520, width: 400, height: 640, background: "#a1442c", border: `10px solid ${P.ink}`, borderRadius: "20px 20px 0 0" }}>
        <div style={{ position: "absolute", left: 60, top: 220, width: 280, height: 420, background: "#2b1a12", border: `8px solid ${P.ink}`, borderRadius: "140px 140px 0 0", overflow: "hidden" }}>
          {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 50 + i * 60, bottom: 20, width: 80, height: 150 + Math.abs(Math.sin(f / 5 + i * 2)) * 80, borderRadius: "50% 50% 40% 40%", background: ["#f97316", "#facc15", "#ef4444"][i], opacity: 0.9 }} />)}
        </div>
      </div>
      <div style={{ position: "absolute", left: 600, top: 470, width: 480, height: 60, background: "#6b3f22", border: `8px solid ${P.ink}` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 80% 60%, #ffb34733 0%, transparent 50%)" }} />
      <Grain />
    </AbsoluteFill>
  );
};
/** Old-film flashback wrapper: sepia, scratches, flicker, vignette, year stamp. */
const OldFilm: React.FC<{ year: string; children: React.ReactNode }> = ({ year, children }) => {
  const f = onTwos(useCurrentFrame());
  return (
    <AbsoluteFill style={{ filter: `sepia(0.9) contrast(1.05) brightness(${0.97 + random(`fl${f}`) * 0.06})` }}>
      {children}
      {[...Array(4)].map((_, i) => <div key={i} style={{ position: "absolute", left: random(`sc${i}${Math.floor(f / 5)}`) * 1080, top: 0, width: 3, height: 1920, background: "#2b262255", zIndex: 7 }} />)}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse, transparent 50%, #2b2622bb 100%)", zIndex: 7 }} />
      <div style={{ position: "absolute", right: 200, top: 250, fontFamily: HAND, fontWeight: 700, fontSize: 110, color: "#3b2a1a", transform: "rotate(-6deg)", zIndex: 8 }}>{year}</div>
    </AbsoluteFill>
  );
};
const OldRink: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg,#8b6b3e 0%,#a0804f 40%,#f4fbff 41%,#d4eaf7 100%)" }}>
    {[...Array(7)].map((_, i) => <div key={i} style={{ position: "absolute", left: 40 + i * 150, top: 160, width: 30, height: 600, background: "#5b3e22", border: `5px solid ${P.ink}` }} />)}
    {[...Array(4)].map((_, i) => <div key={`l${i}`} style={{ position: "absolute", left: 120 + i * 260, top: 120, width: 50, height: 70, borderRadius: 25, background: "#fde68a", boxShadow: "0 0 50px 24px #fde68a66", border: `4px solid ${P.ink}` }} />)}
    <div style={{ position: "absolute", left: 0, right: 0, top: 770, height: 50, background: "#c9a26b", borderTop: `6px solid ${P.ink}`, borderBottom: `6px solid ${P.ink}` }} />
    <Grain />
  </AbsoluteFill>
);
const Chair: React.FC<{ rock: number }> = ({ rock }) => (
  <svg width={900} height={700} viewBox="0 0 900 700" style={{ position: "absolute", left: -60, top: 980, transform: `rotate(${rock}deg)`, transformOrigin: "50% 95%", zIndex: 1 }}>
    <path d="M60 640 Q450 720 840 640" stroke="#6b3f22" strokeWidth={34} fill="none" strokeLinecap="round" />
    <path d="M60 640 Q450 720 840 640" stroke={P.ink} strokeWidth={6} fill="none" />
    <rect x={150} y={380} width={600} height={70} rx={20} fill="#8b5e3c" stroke={P.ink} strokeWidth={8} />
    <rect x={180} y={20} width={60} height={380} rx={18} fill="#8b5e3c" stroke={P.ink} strokeWidth={8} />
    <rect x={660} y={20} width={60} height={380} rx={18} fill="#8b5e3c" stroke={P.ink} strokeWidth={8} />
    <path d="M200 450 L170 650 M700 450 L730 650" stroke="#6b3f22" strokeWidth={30} strokeLinecap="round" />
  </svg>
);
const Blanket: React.FC = () => <div style={{ position: "absolute", left: 120, top: 1220, width: 620, height: 260, background: "repeating-linear-gradient(45deg,#d94b3b 0 40px,#f3ead6 40px 80px)", border: `8px solid ${P.ink}`, borderRadius: 40, zIndex: 3 }} />;

const shots: ToonShot[] = [
  { from: 0, Comp: ({ t, lf }) => (<><BgLiving /><Chair rock={Math.sin(lf / 14) * 4} /><Big who="clubby" t={t} size={900} x={30} y={420} mood="tired" rot={Math.sin(lf / 14) * 4} /><Blanket />
      <Big who="zam" t={t} size={460} x={620} y={1080} mood="wow" z={4} flip />
      <StickerCard x={110} y={250} rot={-3} w={860} h={250}><div style={{ fontSize: 34, fontWeight: 900, color: P.red, letterSpacing: 4 }}>ZAM SPECIAL EDITION</div><div style={{ fontSize: 76, fontWeight: 900, lineHeight: 1 }}>CLUBBY: BACK<br />IN MY DAY</div></StickerCard></>) },
  { from: S("c_1875").start - 0.2, chapter: ["1875", "MONTREAL"], Comp: ({ t, lf }) => (
      <OldFilm year="1875"><OldRink />
        <Big who="clubby" t={t} size={1050} x={interpolate(lf, [0, 300], [-60, 60])} y={560} mood="laugh" rot={Math.sin(lf / 10) * 6} />
        {t >= at("c_1875", "first") - 0.1 && <StickerCard x={110} y={1090} rot={-3} w={860} h={240}><div style={{ fontSize: 50, fontWeight: 900 }}>FIRST INDOOR HOCKEY GAME</div><div style={{ fontFamily: HAND, fontSize: 44, color: P.red }}>Victoria Skating Rink · Montreal · Mar 3, 1875</div></StickerCard>}
      </OldFilm>) },
  { from: S("h_check").start - 0.15, Comp: ({ t }) => (<><BgLab /><Big who="helmy" t={t} size={950} x={65} y={800} mood="wow" />
      {t >= at("h_check", "true") - 0.1 && <Pow text="FACT CHECK ✓" x={90} y={300} size={110} rot={-6} color={P.green} />}
      {t >= at("h_check", "mcgill") - 0.1 && <StickerCard x={300} y={520} rot={4} w={560} h={190}><div style={{ fontSize: 64, fontWeight: 900 }}>McGILL 2–1</div><div style={{ fontFamily: HAND, fontSize: 40, color: P.teal }}>vs Victoria · 9 players a side</div></StickerCard>}</>) },
  { from: S("p_there").start - 0.15, Comp: ({ t, lf }) => (<><BgBurst c1="#fde68a" c2="#fcd34d" /><Big who="pucky" t={t} size={1300} x={-110} y={440} mood="scared" rot={Math.sin(lf * 0.8) * 3} />
      {t >= at("p_there", "there") && <Pow text="THERE?!" x={300} y={280} size={170} rot={-8} color={P.red} />}</>) },
  { from: S("c_fall").start - 0.15, chapter: ["1918", "GOALIE RULE"], Comp: ({ t }) => (<><BgLiving /><Big who="clubby" t={t} size={1250} x={-85} y={430} mood="grumpy" />
      {t < at("c_fall", "goalies") && <Pow text="RUDE." x={420} y={300} size={150} rot={6} color={P.green} />}</>) },
  { from: at("c_fall", "goalies") - 0.05, Comp: ({ t, lf }) => {
      const tip = interpolate(lf, [10, 40], [0, 70], { ...clamp, easing: Easing.in(Easing.quad) });
      const blown = lf > 40;
      return (<OldFilm year="1917"><OldRink />
        <Big who="biscuit" t={t} size={1050} x={20} y={560} mood={blown ? "scared" : "determined"} rot={blown ? 0 : tip} />
        {blown && <Pow text="TWEEEET!" x={120} y={330} size={150} rot={-8} color={P.ink} />}
        {t >= at("c_fall", "1918") - 0.1 && <StickerCard x={430} y={1120} rot={4} w={600} h={230}><div style={{ fontSize: 46, fontWeight: 900 }}>JAN 9, 1918</div><div style={{ fontFamily: HAND, fontSize: 40, color: P.red }}>NHL finally lets goalies drop to the ice</div></StickerCard>}
      </OldFilm>);
    } },
  { from: S("b_box").start - 0.15, Comp: ({ t }) => (<><BgRink />
      <div style={{ position: "absolute", left: 40, top: 320, width: 1000, height: 1080, background: "#dde9f2", border: `12px solid ${P.ink}`, borderRadius: 30, zIndex: 1 }}>
        <div style={{ position: "absolute", left: 30, top: 24, padding: "6px 20px", background: P.ink, color: "#fff", fontWeight: 900, fontSize: 44, letterSpacing: 3 }}>PENALTY BOX</div>
        <div style={{ position: "absolute", right: 40, top: 30, padding: "8px 18px", background: "#fff", border: `6px solid ${P.ink}`, borderRadius: 10, fontFamily: HAND, fontWeight: 700, fontSize: 56, transform: "rotate(5deg)" }}>home sweet home</div>
        <div style={{ position: "absolute", left: 60, top: 800, width: 340, height: 140, background: "#fff", border: `8px solid ${P.ink}`, borderRadius: 60 }} />
        <div style={{ position: "absolute", left: 760, top: 760, width: 26, height: 190, background: "#60a5fa", border: `6px solid ${P.ink}`, borderRadius: 10, transform: "rotate(18deg)" }} />
      </div>
      <Big who="biscuit" t={t} size={1000} x={40} y={460} mood={t >= at("b_box", "id") ? "sad" : "scared"} /></>) },
  { from: S("c_pass").start - 0.2, chapter: ["1929", "FORWARD PASS"], Comp: ({ t, lf }) => {
      const k = interpolate(lf, [20, 50], [0, 1], clamp);
      const blocked = lf > 50;
      return (<OldFilm year="1929"><OldRink />
        <Big who="clubby" t={t} size={760} x={-80} y={760} mood={blocked ? "grumpy" : "determined"} />
        <svg width={1080} height={400} style={{ position: "absolute", left: 0, top: 700, zIndex: 4 }}><path d={`M380 200 L${380 + k * 420} 200`} stroke={P.mustard} strokeWidth={22} strokeLinecap="round" /><path d={`M${380 + k * 420} 170 l40 30 l-40 30`} fill={P.mustard} stroke={P.ink} strokeWidth={6} /></svg>
        <div style={{ position: "absolute", left: 820, top: 560, width: 70, height: 560, background: "repeating-linear-gradient(0deg,#d94b3b 0 70px,#fff 70px 140px)", border: `8px solid ${P.ink}`, transform: `rotate(${blocked ? 0 : -60}deg)`, transformOrigin: "50% 100%", zIndex: 5 }} />
        {blocked && <StickerCard x={80} y={380} rot={-4} w={760} h={190}><div style={{ fontSize: 50, fontWeight: 900 }}>NO FORWARD PASS</div><div style={{ fontFamily: HAND, fontSize: 40, color: P.red }}>in the attacking zone · until 1929–30</div></StickerCard>}
      </OldFilm>);
    } },
  { from: S("h_double").start - 0.15, Comp: ({ t }) => {
      const k = interpolate(t, [at("h_double", "scoring"), at("h_double", "doubled") + 0.2], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
      return (<><BgLab /><Big who="helmy" t={t} size={760} x={-120} y={940} mood="wow" />
        <div style={{ position: "absolute", left: 300, top: 260, width: 700, height: 700, zIndex: 3 }}>
          <div style={{ position: "absolute", left: 60, bottom: 90, width: 200, height: 240, background: "#94a3b8", border: `8px solid ${P.ink}` }} />
          <div style={{ position: "absolute", left: 380, bottom: 90, width: 200, height: 30 + k * 490, background: P.teal, border: `8px solid ${P.ink}` }} />
          <div style={{ position: "absolute", left: 40, bottom: 20, width: 240, textAlign: "center", fontWeight: 900, fontSize: 40 }}>BEFORE</div>
          <div style={{ position: "absolute", left: 360, bottom: 20, width: 240, textAlign: "center", fontWeight: 900, fontSize: 40 }}>AFTER</div>
          {k > 0.9 && <div style={{ position: "absolute", left: 330, top: 0, fontFamily: HAND, fontWeight: 700, fontSize: 64, color: P.teal }}>more than ×2!</div>}
        </div></>);
    } },
  { from: S("c_curve").start - 0.2, chapter: ["1960s", "CURVED STICK"], Comp: ({ t, lf }) => {
      const slam = at("c_curve", "bent");
      const hit = t >= slam;
      const door = interpolate(t, [slam - 0.3, slam], [1200, 640], clamp);
      return (<><BgRink />
        <Big who="clubby" t={t} size={1150} x={-120} y={460} mood={hit ? (t < slam + 0.6 ? "dizzy" : "wow") : "talk"} sx={hit && t < slam + 0.15 ? 1.2 : 1} sy={hit && t < slam + 0.15 ? 0.85 : 1} />
        <div style={{ position: "absolute", left: door, top: 900, width: 420, height: 760, background: "#8b5e3c", border: `10px solid ${P.ink}`, borderRadius: 12, zIndex: 4 }}><div style={{ position: "absolute", left: 30, top: 340, width: 30, height: 90, background: "#ddd", border: `5px solid ${P.ink}`, borderRadius: 8 }} /></div>
        {hit && t < slam + 0.7 && <Pow text="BOI-OING!" x={140} y={330} size={140} rot={-8} color={P.green} />}
        {t >= at("c_curve", "curved") - 0.1 && <StickerCard x={100} y={330} rot={-3} w={700} h={210}><div style={{ fontSize: 46, fontWeight: 900 }}>STAN MIKITA · 1960s</div><div style={{ fontFamily: HAND, fontSize: 42, color: P.red }}>bent blade by accident → the curved stick</div></StickerCard>}
        <Flash at={Math.round((slam - S("c_curve").start + 0.2) * 60)} /></>);
    } },
  { from: S("p_crooked").start - 0.15, Comp: ({ t, lf }) => (<><BgBurst c1="#fecaca" c2="#fca5a5" /><Big who="pucky" t={t} size={1300} x={-110} y={460} mood="laugh" rot={Math.sin(lf / 3) * 4} /></>) },
  { from: S("c_helmet").start - 0.2, chapter: ["1997", "HELMETS"], Comp: ({ t }) => (<><BgRink crowd /><Big who="clubby" t={t} size={1150} x={-40} y={480} mood="smug" />
      {t >= at("c_helmet", "craig") - 0.1 && <StickerCard x={90} y={330} rot={-3} w={880} h={230}><div style={{ fontSize: 48, fontWeight: 900 }}>CRAIG MacTAVISH · 1997</div><div style={{ fontFamily: HAND, fontSize: 42, color: P.red }}>the last NHL player to play without a helmet</div></StickerCard>}</>) },
  { from: S("h_wear").start - 0.15, Comp: ({ t, lf }) => {
      const k = ["please", "wear", "a", "helmet"].filter((w) => t >= at("h_wear", w)).length;
      return (<><BgBurst c1="#99f6e4" c2="#5eead4" />
        <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + k * 0.08})`, transformOrigin: "50% 45%" }}><Big who="helmy" t={t} size={1250} x={-85} y={430} mood="determined" /></div>
        {k > 0 && <Pow text={["PLEASE.", "WEAR.", "A.", "HELMET!"][k - 1]} x={130} y={290} size={k === 4 ? 180 : 150} rot={-6} color={P.teal} />}
        {lf % 30 < 15 && <div style={{ position: "absolute", right: 210, top: 1200, fontSize: 90, zIndex: 6 }}>⛑️</div>}</>);
    } },
  { from: S("z_last").start - 0.15, chapter: ["TODAY", "STORY OVER"], Comp: ({ t, lf }) => (<><BgLiving /><Chair rock={Math.sin(lf / 14) * 4} /><Big who="clubby" t={t} size={800} x={60} y={560} mood="grumpy" rot={Math.sin(lf / 14) * 4} /><Blanket />
      <Big who="zam" t={t} size={620} x={520} y={980} mood="talk" z={4} flip /></>) },
  { from: S("c_off").start - 0.12, Comp: ({ t, lf }) => (<><BgLiving /><Big who="clubby" t={t} size={1300} x={-110} y={420} mood="grumpy" rot={Math.sin(lf * 0.9) * 2} />
      <Pow text="GET OFF MY ICE." x={60} y={300} size={100} rot={-4} color={P.green} /></>) },
  { from: S("z_mine").start - 0.12, Comp: ({ t, lf }) => {
      const zx = interpolate(lf, [0, 50], [-700, 1200], clamp);
      const slide = interpolate(lf, [22, 70], [0, 1], clamp);
      return (<><BgRink /><Sparkles n={10} />
        <div style={{ position: "absolute", left: 0, top: 1060, width: Math.max(0, zx + 300), height: 500, background: "linear-gradient(90deg,#ffffff00,#ffffffcc)", zIndex: 1 }} />
        <Big who="clubby" t={t} size={760} x={160 + slide * 900} y={560 - slide * 120} mood={slide > 0 ? "scared" : "grumpy"} rot={slide * 260} hop={0} />
        <div style={{ position: "absolute", left: zx, top: 1000, zIndex: 3 }}><Mascot who="zam" size={620} mood="laugh" talking open={0.3 + 0.4 * Math.abs(Math.sin(lf / 3))} seed="zmine" noSticker /></div>
        {slide > 0.1 && <Pow text="WHEEE…" x={420} y={340} size={110} rot={8} color="#3b82f6" />}
        <StickerCard x={90} y={1180} rot={-5} w={460} h={150} show={20}><div style={{ fontSize: 56, fontWeight: 900, color: "#2563eb" }}>MY ICE. ❄</div></StickerCard></>);
    } },
];

const Extras: React.FC<{ N: (s: number) => number }> = ({ N }) => (
  <>
    <Sequence from={N(at("h_check", "true"))} durationInFrames={50}><Audio src={staticFile("brand/ding.wav")} volume={0.55} /></Sequence>
    <Sequence from={N(at("p_there", "there"))} durationInFrames={40}><Audio src={staticFile("brand/boing.wav")} volume={0.5} /></Sequence>
    <Sequence from={N(at("c_fall", "goalies") - 0.05) + 40} durationInFrames={40}><Audio src={staticFile("brand/impact.wav")} volume={0.45} /></Sequence>
    <Sequence from={N(S("c_pass").start - 0.2) + 50} durationInFrames={40}><Audio src={staticFile("brand/impact.wav")} volume={0.55} /></Sequence>
    <Sequence from={N(at("h_double", "doubled"))} durationInFrames={50}><Audio src={staticFile("brand/riser.wav")} volume={0.35} /></Sequence>
    <Sequence from={N(at("c_curve", "bent"))} durationInFrames={40}><Audio src={staticFile("brand/boing.wav")} volume={0.7} /></Sequence>
    <Sequence from={N(at("p_crooked", "crooked"))} durationInFrames={40}><Audio src={staticFile("brand/rimshot.wav")} volume={0.6} /></Sequence>
    {["please", "wear", "a", "helmet"].map((w) => <Sequence key={w} from={N(at("h_wear", w))} durationInFrames={20}><Audio src={staticFile("pop.wav")} volume={0.6} /></Sequence>)}
    <Sequence from={N(S("z_mine").start - 0.12)} durationInFrames={50}><Audio src={staticFile("sfx/scrape.wav")} volume={0.8} /></Sequence>
    <Sequence from={N(at("z_mine", "ice"))} durationInFrames={40}><Audio src={staticFile("brand/rimshot.wav")} volume={0.6} /></Sequence>
    <Sequence from={N(at("z_mine", "ice"))} durationInFrames={90}><Confetti n={40} x={540} y={600} /></Sequence>
  </>
);

export const { Comp: ClubbyDay, FRAMES: CLUBBYDAY_FRAMES } = makeToon({ words: WORDS, vo: "ep/clubby_day.mp3", shots, tag: "ZAM · SPECIAL EDITION", tagline: "special edition!", Extras });
