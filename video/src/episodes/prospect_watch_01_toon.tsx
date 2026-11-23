/** ZAM Special Edition – "Agenty's Prospect Watch #1" (cartoon). Facts (Nov 2026): Toronto won the 2026 lottery at 8.5% and took
 *  Gavin McKenna 1st; Ivar Stenberg (Frölunda) 2nd to San Jose – 33 SHL points at 18, most by an 18-year-old since the Sedins (1998–99);
 *  Matthew Schaefer youngest Calder winner ever (18y 223d), unanimous, 23 goals = Leetch's rookie-D record; Celebrini 115 pts, Sharks record. */
import React from "react";
import { Audio, Sequence, interpolate, staticFile, Easing } from "remotion";
import words from "../data/prospect_watch_01_words.json";
import { P, HAND, clamp, Stamp } from "../presenter/kit";
import { Mascot } from "../mascots/Gang";
import { type W } from "../zam/common";
import { timing } from "../zam/Episode";
import { BgBurst, BgLab, BgRink, Big, Pow, Sparkles, StickerCard, makeToon, type ToonShot } from "../zam/toon";
import { BgOffice, Counter, ProspectFile } from "./agenty_top5_toon";

const WORDS = words as W[];
const { S, at } = timing(WORDS);
const fr = (from: number, news: number) => Math.round((news - from) * 60);

const Binoculars: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `scale(${s})`, transformOrigin: "left top", zIndex: 5 }}>
    {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: i * 170, top: 0, width: 150, height: 150, borderRadius: "50%", background: "#111", border: `10px solid #444`, boxShadow: "inset 0 0 0 18px #222" }}><div style={{ position: "absolute", left: 40, top: 30, width: 34, height: 34, borderRadius: 17, background: "#9cd3ff" }} /></div>)}
    <div style={{ position: "absolute", left: 140, top: 55, width: 40, height: 40, background: "#444" }} />
  </div>
);
const MiniTrophy: React.FC<{ s?: number }> = ({ s = 260 }) => (
  <svg width={s} height={s * 1.2} viewBox="0 0 100 120"><defs><linearGradient id="gtr" x1="0" x2="1"><stop offset="0" stopColor="#b45309" /><stop offset="0.5" stopColor="#fde68a" /><stop offset="1" stopColor="#92400e" /></linearGradient></defs>
    <path d="M25 8 H75 Q75 45 50 52 Q25 45 25 8 Z" fill="url(#gtr)" stroke={P.ink} strokeWidth={4} /><path d="M25 14 Q8 16 12 30 Q16 40 28 38 M75 14 Q92 16 88 30 Q84 40 72 38" stroke={P.ink} strokeWidth={4} fill="none" />
    <rect x={44} y={52} width={12} height={22} fill="url(#gtr)" stroke={P.ink} strokeWidth={4} /><rect x={28} y={74} width={44} height={14} fill="url(#gtr)" stroke={P.ink} strokeWidth={4} /><rect x={22} y={88} width={56} height={22} fill="#7c2d12" stroke={P.ink} strokeWidth={4} /></svg>
);

const shots: ToonShot[] = [
  { from: 0, chapter: ["SCOUTING", "PROSPECT WATCH"], Comp: ({ t, lf }) => (<><BgRink crowd />
      <Big who="agenty" t={t} size={1150} x={-35} y={480} mood="smug" />
      <Binoculars x={300} y={interpolate(lf, [0, 15], [1300, 760], { ...clamp, easing: Easing.out(Easing.back(1.5)) })} s={1.4} />
      <StickerCard x={110} y={350} rot={-3} w={860} h={230}><div style={{ fontSize: 34, fontWeight: 900, color: P.red, letterSpacing: 4 }}>ZAM SPECIAL EDITION</div><div style={{ fontSize: 78, fontWeight: 900, lineHeight: 1, color: "#6d28d9" }}>AGENTY'S PROSPECT<br />WATCH #1</div></StickerCard></>) },
  { from: S("a_mckenna").start - 0.15, chapter: ["#1", "2026 #1 PICK"], Comp: ({ t, lf }) => {
      const ball = t >= at("a_mckenna", "eight") - 0.1;
      return (<><BgOffice />
        <ProspectFile n={1} name="GAVIN McKENNA" sub="Penn State → Toronto · June 2026">
          <div style={{ position: "absolute", left: 30, top: 30, width: 280, height: 280, borderRadius: "50%", border: `10px solid ${P.ink}`, background: "#e0f2fe", transform: `rotate(${ball ? 0 : lf * 7}deg)` }}>
            {[...Array(7)].map((_, i) => <div key={i} style={{ position: "absolute", left: 110 + Math.cos(i) * 80, top: 110 + Math.sin(i * 1.4) * 80, width: 50, height: 50, borderRadius: 25, background: ["#fde68a", "#fca5a5", "#a7f3d0", "#c4b5fd"][i % 4], border: `5px solid ${P.ink}` }} />)}
          </div>
          {ball && <div style={{ position: "absolute", left: interpolate(t, [at("a_mckenna", "eight") - 0.1, at("a_mckenna", "eight") + 0.4], [200, 380], clamp), top: interpolate(t, [at("a_mckenna", "eight") - 0.1, at("a_mckenna", "eight") + 0.4], [240, 60], clamp), width: 200, height: 200, borderRadius: "50%", background: "#1e3a8a", border: `8px solid ${P.ink}`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 64 }}>8.5%</div>}
          {t >= at("a_mckenna", "first") - 0.1 && <div style={{ position: "absolute", left: 360, top: 330, whiteSpace: "nowrap" }}><Stamp color={P.red} at={fr(S("a_mckenna").start - 0.15, at("a_mckenna", "first"))} rot={-6} size={56}>1ST OVERALL</Stamp></div>}
        </ProspectFile>
        <Big who="agenty" t={t} size={520} x={600} y={1060} mood="wow" z={4} /></>);
    } },
  { from: S("p_lucky").start - 0.15, Comp: ({ t, lf }) => (<><BgBurst c1="#fecaca" c2="#fca5a5" /><Big who="pucky" t={t} size={1300} x={-110} y={460} mood="laugh" rot={Math.sin(lf / 3) * 4} />
      <StickerCard x={560} y={260} rot={6} w={420} h={150}><div style={{ fontSize: 46, fontWeight: 900 }}>BISCUIT SAVE: 0.1%</div></StickerCard></>) },
  { from: S("b_hey").start - 0.15, Comp: ({ t }) => (<><BgRink /><Big who="biscuit" t={t} size={1250} x={-85} y={430} mood="grumpy" />
      <Pow text="HEY!" x={360} y={270} size={190} rot={-8} color={P.mustard} /></>) },
  { from: S("a_stenberg").start - 0.15, chapter: ["#2", "FROM SWEDEN"], Comp: ({ t }) => {
      const n = Math.round(interpolate(t, [at("a_stenberg", "thirtythree") - 0.2, at("a_stenberg", "points")], [0, 33], { ...clamp, easing: Easing.out(Easing.cubic) }));
      return (<><BgOffice />
        <ProspectFile n={2} name="IVAR STENBERG" sub="Frölunda → San Jose · #2 pick 2026">
          <div style={{ position: "absolute", left: 0, top: 0, width: 300, height: 190, background: "#006aa7", border: `8px solid ${P.ink}` }}><div style={{ position: "absolute", left: 80, top: 0, width: 40, height: 174, background: "#fecc00" }} /><div style={{ position: "absolute", left: 0, top: 70, width: 284, height: 40, background: "#fecc00" }} /></div>
          <div style={{ position: "absolute", left: 360, top: -20 }}><Counter v={n} label="SHL POINTS · AGE 18" /></div>
          {t >= at("a_stenberg", "sedin") - 0.2 && <div style={{ position: "absolute", left: 20, top: 400, right: 20, fontFamily: HAND, fontSize: 42, color: P.red }}>most by an 18-year-old since the Sedins (1998–99)</div>}
        </ProspectFile>
        <Big who="agenty" t={t} size={520} x={600} y={1060} mood="smug" z={4} /></>);
    } },
  { from: S("c_sedins").start - 0.15, Comp: ({ t, lf }) => (<div style={{ position: "absolute", inset: 0, filter: "sepia(0.85)" }}><BgRink />
      <Big who="clubby" t={t} size={1150} x={-35} y={460} mood="grumpy" rot={Math.sin(lf / 12) * 3} />
      <StickerCard x={470} y={280} rot={5} w={540} h={200}><div style={{ fontSize: 46, fontWeight: 900 }}>THE SEDIN TWINS</div><div style={{ fontFamily: HAND, fontSize: 42, color: P.red }}>prospects back in '98–99</div></StickerCard></div>) },
  { from: S("a_schaefer").start - 0.15, chapter: ["#3", "CALDER TROPHY"], Comp: ({ t }) => (<><BgOffice /><Sparkles n={8} color="#d97706" />
      <ProspectFile n={3} name="MATTHEW SCHAEFER" sub="Islanders · defenseman · 2025–26">
        <div style={{ position: "absolute", left: 20, top: 0 }}><MiniTrophy s={260} /></div>
        <div style={{ position: "absolute", left: 340, top: 30, fontSize: 64, fontWeight: 900, lineHeight: 1.05 }}>YOUNGEST<br />WINNER EVER</div>
        <div style={{ position: "absolute", left: 342, top: 190, fontFamily: HAND, fontSize: 48, color: "#7c3aed" }}>18 years, 223 days</div>
        {t >= at("a_schaefer", "unanimous") - 0.1 && <div style={{ position: "absolute", left: 300, top: 300, whiteSpace: "nowrap" }}><Stamp color={P.green} at={fr(S("a_schaefer").start - 0.15, at("a_schaefer", "unanimous"))} rot={-6} size={64}>UNANIMOUS</Stamp></div>}
      </ProspectFile>
      <Big who="agenty" t={t} size={520} x={600} y={1060} mood="starry" z={4} /></>) },
  { from: S("h_schaefer").start - 0.15, Comp: ({ t }) => {
      const n = Math.round(interpolate(t, [S("h_schaefer").start, at("h_schaefer", "goals")], [0, 23], clamp));
      return (<><BgLab /><Big who="helmy" t={t} size={760} x={-120} y={960} mood="wow" />
        <div style={{ position: "absolute", left: 300, top: 300, zIndex: 3 }}><Counter v={n} label="GOALS · ROOKIE DEFENSEMAN" color={P.teal} /></div>
        {t >= at("h_schaefer", "brian") - 0.1 && <StickerCard x={440} y={760} rot={4} w={560} h={210}><div style={{ fontSize: 46, fontWeight: 900 }}>= BRIAN LEETCH</div><div style={{ fontFamily: HAND, fontSize: 42, color: P.red }}>rookie D record (1988–89) – tied!</div></StickerCard>}</>);
    } },
  { from: S("a_celebrini").start - 0.15, chapter: ["#4", "SHARKS RECORD"], Comp: ({ t }) => {
      const n = Math.round(interpolate(t, [at("a_celebrini", "one") - 0.1, at("a_celebrini", "points")], [0, 115], { ...clamp, easing: Easing.out(Easing.cubic) }));
      return (<><BgOffice />
        <ProspectFile n={4} name="MACKLIN CELEBRINI" sub="Sharks · 2025–26 season">
          <div style={{ position: "absolute", left: 20, top: -10 }}><Counter v={n} label="POINTS · AGE 19" color="#0d9488" /></div>
          <div style={{ position: "absolute", left: 40, top: 380, fontFamily: HAND, fontSize: 44, color: P.muted }}>45 goals · 70 assists</div>
          {t >= at("a_celebrini", "sharks") - 0.15 && <div style={{ position: "absolute", left: 20, top: 470, whiteSpace: "nowrap" }}><Stamp color={P.teal} at={fr(S("a_celebrini").start - 0.15, at("a_celebrini", "sharks"))} rot={6} size={56}>SHARKS RECORD</Stamp></div>}
        </ProspectFile>
        <Big who="agenty" t={t} size={520} x={600} y={1060} mood="laugh" z={4} /></>);
    } },
  { from: S("z_ask").start - 0.15, chapter: ["AND…", "THE TOP PROSPECT?"], Comp: ({ t }) => (<><BgBurst c1="#bfdbfe" c2="#dbeafe" /><Big who="zam" t={t} size={1150} x={-35} y={520} mood="wow" /></>) },
  { from: S("a_me").start - 0.12, Comp: ({ t, lf }) => (<><BgOffice /><Sparkles n={10} color="#7c3aed" />
      <div style={{ position: "absolute", left: 460, top: 330, width: 540, height: 760, borderRadius: "50%", background: "linear-gradient(135deg,#e0f2fe,#ffffff,#c7d2fe)", border: `16px solid #b07a45`, zIndex: 1, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 60, top: 160, transform: "scaleX(-1)" }}><Mascot who="agenty" size={420} mood="starry" noSticker seed="mirror" /></div>
      </div>
      <Big who="agenty" t={t} size={760} x={-120} y={640} mood="smug" />
      <Big who="pucky" t={t} size={340} x={760} y={1150} mood="grumpy" z={4} hop={0} />
      {t >= at("a_me", "still") - 0.1 && <div style={{ position: "absolute", left: 90, top: 300, zIndex: 6, whiteSpace: "nowrap" }}><Stamp color="#7c3aed" at={fr(S("a_me").start - 0.12, at("a_me", "still"))} rot={-8} size={70}>STILL IMPROVING</Stamp></div>}
      {lf > 4 && <Pow text="ME." x={560} y={1130} size={140} rot={-6} color="#7c3aed" />}</>) },
];

const Extras: React.FC<{ N: (s: number) => number }> = ({ N }) => (
  <>
    <Sequence from={N(0)} durationInFrames={60}><Audio src={staticFile("sfx/crowd.wav")} volume={0.3} /></Sequence>
    <Sequence from={N(at("a_mckenna", "eight"))} durationInFrames={40}><Audio src={staticFile("brand/ding.wav")} volume={0.5} /></Sequence>
    <Sequence from={N(at("a_mckenna", "first"))} durationInFrames={40}><Audio src={staticFile("brand/impact.wav")} volume={0.55} /></Sequence>
    <Sequence from={N(at("p_lucky", "save"))} durationInFrames={40}><Audio src={staticFile("brand/rimshot.wav")} volume={0.6} /></Sequence>
    <Sequence from={N(at("b_hey", "hey"))} durationInFrames={40}><Audio src={staticFile("brand/boing.wav")} volume={0.5} /></Sequence>
    <Sequence from={N(at("a_stenberg", "points"))} durationInFrames={50}><Audio src={staticFile("brand/riser.wav")} volume={0.35} /></Sequence>
    <Sequence from={N(at("a_schaefer", "unanimous"))} durationInFrames={110}><Audio src={staticFile("sfx/horn.wav")} volume={0.4} /></Sequence>
    <Sequence from={N(at("a_celebrini", "sharks"))} durationInFrames={40}><Audio src={staticFile("brand/impact.wav")} volume={0.5} /></Sequence>
    <Sequence from={N(at("a_me", "me"))} durationInFrames={40}><Audio src={staticFile("brand/rimshot.wav")} volume={0.6} /></Sequence>
  </>
);

export const { Comp: ProspectWatch01, FRAMES: PROSPECTWATCH01_FRAMES } = makeToon({ words: WORDS, vo: "ep/prospect_watch_01.mp3", shots, tag: "ZAM · SPECIAL EDITION", tagline: "special edition!", Extras });
