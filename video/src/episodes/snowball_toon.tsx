/** ZAM Special Edition – "Snowball Fight on the Ice" (cartoon). Fact: an ice resurfacer's blade shaves the ice and the snow
 *  is carried into its snow tank (dumped afterwards). Clubby's trick shot: Pucky → Agenty's hot dog → Agenty's head → goal. */
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, random, staticFile, useCurrentFrame, Easing } from "remotion";
import words from "../data/snowball_words.json";
import { P, HAND, clamp, onTwos } from "../presenter/kit";
import { FONT } from "../theme";
import { Mascot, type Who } from "../mascots/Gang";
import { Confetti, type W } from "../zam/common";
import { timing } from "../zam/Episode";
import { BgBurst, BgRink, Big, Flash, Pow, Sparkles, SpeedLines, StickerCard, makeToon, type ToonShot } from "../zam/toon";

const WORDS = words as W[];
const { S, at } = timing(WORDS);
const lerp = (k: number, a: number, b: number) => a + (b - a) * k;

const HotDog: React.FC<{ s?: number; rot?: number }> = ({ s = 200, rot = 0 }) => (
  <svg width={s} height={s * 0.5} viewBox="0 0 200 100" style={{ transform: `rotate(${rot}deg)`, overflow: "visible" }}>
    <rect x={10} y={40} width={180} height={50} rx={25} fill="#e0a85a" stroke={P.ink} strokeWidth={6} />
    <rect x={0} y={28} width={200} height={34} rx={17} fill="#b4432f" stroke={P.ink} strokeWidth={6} />
    <path d="M20 44 l15 -8 l15 8 l15 -8 l15 8 l15 -8 l15 8 l15 -8 l15 8 l15 -8 l15 8" stroke="#facc15" strokeWidth={7} fill="none" strokeLinejoin="round" />
  </svg>
);
const Snowball: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 70 }) => <div style={{ position: "absolute", left: x - s / 2, top: y - s / 2, width: s, height: s, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%,#fff,#dbeafe)", border: `5px solid ${P.ink}`, zIndex: 6 }} />;
const Splat: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 220 }) => (
  <svg width={s} height={s} viewBox="-50 -50 100 100" style={{ position: "absolute", left: x - s / 2, top: y - s / 2, zIndex: 7 }}>
    <path d={"M" + [...Array(14)].map((_, i) => { const a = (i / 14) * Math.PI * 2; const r = i % 2 ? 26 : 42 + random(`sp${i}`) * 6; return `${Math.cos(a) * r} ${Math.sin(a) * r}`; }).join(" L") + " Z"} fill="#fff" stroke={P.ink} strokeWidth={3} />
  </svg>
);
const Net: React.FC<{ x: number; y: number; lit?: boolean }> = ({ x, y, lit }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 200, height: 170, zIndex: 3 }}>
    <svg width={200} height={170}><path d="M10 165 L24 20 H176 L190 165" fill="#ffffff99" stroke={P.red} strokeWidth={10} strokeLinejoin="round" />{[...Array(6)].map((_, i) => <line key={i} x1={40 + i * 24} y1={22} x2={34 + i * 27} y2={162} stroke={P.ink} strokeWidth={2} opacity={0.4} />)}</svg>
    {lit && <div style={{ position: "absolute", left: 70, top: -60, width: 60, height: 44, borderRadius: 10, background: "#ff3b30", boxShadow: "0 0 70px 30px #ff3b3088", border: `5px solid ${P.ink}` }} />}
  </div>
);
const SnowPile: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: "50% 50% 12px 12px", background: "radial-gradient(circle at 40% 30%,#fff,#dbeafe)", border: `6px solid ${P.ink}`, zIndex: 2 }} />;

// trick-shot timing (news time)
const T_SHOT = () => at("p_wheee", "wheeee") - 0.2;
const T_DOG = () => at("a_hotdog", "hot");
const T_HEAD = () => at("a_hotdog", "head");
const T_GOAL = () => at("b_goal", "goal") - 0.15;

const shots: ToonShot[] = [
  { from: 0, chapter: ["FINAL", "AFTER THE GAME"], Comp: ({ t, lf }) => (<><BgRink crowd />
      <div style={{ position: "absolute", left: 600, top: 300, padding: "10px 30px", background: P.ink, color: "#f7d84a", fontWeight: 900, fontSize: 70, borderRadius: 14, border: `6px solid ${P.mustard}`, zIndex: 3 }}>FINAL</div>
      <Big who="zam" t={t} size={900} x={interpolate(lf, [0, 50], [-500, 90], { ...clamp, easing: Easing.out(Easing.back(1.2)) })} y={760} mood="laugh" />
      <div style={{ position: "absolute", left: 0, top: 1350, width: interpolate(lf, [0, 60], [0, 1080], clamp), height: 120, background: "linear-gradient(90deg,#ffffffaa,#ffffff)", zIndex: 1 }} /></>) },
  { from: at("z_intro", "fun") - 0.1, Comp: ({ t }) => {
      const fill = interpolate(t, [at("z_intro", "shaves"), at("z_intro", "tank")], [0.1, 0.95], clamp);
      return (<><BgBurst c1="#bfdbfe" c2="#dbeafe" />
        <Big who="zam" t={t} size={700} x={-120} y={900} mood="wow" />
        <StickerCard x={90} y={250} rot={-2} w={900} h={560}>
          <div style={{ fontWeight: 900, fontSize: 52, textAlign: "center" }}>INSIDE ZAM</div>
          <div style={{ position: "relative", height: 420 }}>
            <div style={{ position: "absolute", left: 40, top: 300, width: 300, height: 30, background: "#94a3b8", border: `5px solid ${P.ink}`, transform: "skewX(-30deg)" }} />
            <div style={{ position: "absolute", left: 30, top: 345, fontFamily: HAND, fontSize: 40, fontWeight: 700 }}>blade shaves the ice</div>
            <div style={{ position: "absolute", left: 330, top: 200, fontSize: 90 }}>➜</div>
            <div style={{ position: "absolute", left: 470, top: 40, width: 300, height: 280, border: `8px solid ${P.ink}`, borderRadius: 18, background: "#fff", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${fill * 100}%`, background: "radial-gradient(circle at 40% 20%,#fff,#bfdbfe)" }} />
            </div>
            <div style={{ position: "absolute", left: 500, top: 330, fontWeight: 900, fontSize: 46, color: "#2563eb" }}>SNOW TANK ❄</div>
          </div>
        </StickerCard></>);
    } },
  { from: at("z_intro", "tank") - 0.05, Comp: ({ t, lf }) => (<><BgRink />
      <SnowPile x={460} y={interpolate(lf, [0, 30], [1300, 1000], clamp)} w={560} h={interpolate(lf, [0, 30], [80, 380], clamp)} />
      <div style={{ position: "absolute", left: 0, top: 0, transform: `rotate(${interpolate(lf, [0, 20], [0, -14], clamp)}deg)`, transformOrigin: "300px 1300px" }}><Big who="zam" t={t} size={700} x={-60} y={800} mood="laugh" /></div>
      <Pow text="SNOW!" x={520} y={760} size={130} rot={8} color="#2563eb" /></>) },
  { from: S("p_fight").start - 0.12, Comp: ({ t, lf }) => (<><BgBurst c1="#bae6fd" c2="#e0f2fe" />
      <Big who="pucky" t={t} size={1250} x={-85} y={480} mood="laugh" rot={Math.sin(lf / 4) * 4} />
      {[0, 1, 2, 3].map((i) => <Snowball key={i} x={((lf * 18 + i * 300) % 1400) - 150} y={350 + i * 90} s={80} />)}
      {t >= at("p_fight", "snowball") - 0.1 && <Pow text="SNOWBALL FIGHT!" x={40} y={260} size={110} rot={-5} color="#2563eb" />}</>) },
  { from: S("b_mask").start - 0.12, Comp: ({ t, lf }) => {
      const hit = at("b_mask", "hey") - 0.12;
      const k = interpolate(t, [hit - 0.35, hit], [0, 1], clamp);
      return (<><BgRink />
        <Big who="biscuit" t={t} size={1250} x={-85 + (t > hit && t < hit + 0.2 ? Math.sin(lf * 3) * 20 : 0)} y={430} mood={t > hit ? "grumpy" : "wow"} hop={0} />
        {t < hit && <Snowball x={lerp(k, 1200, 560)} y={lerp(k, 300, 700)} s={120} />}
        {t >= hit && <Splat x={560} y={690} s={300} />}
        {t >= hit && t < hit + 0.6 && <Pow text="SPLAT!" x={80} y={280} size={170} rot={-8} color="#2563eb" />}</>);
    } },
  { from: S("h_safety").start - 0.12, Comp: ({ t, lf }) => {
      const inc = at("h_safety", "incoming");
      return (<><BgRink />
        <Big who="helmy" t={t} size={1150} x={-35} y={480} mood={t < inc - 0.2 ? "determined" : "laugh"} />
        {t < inc - 0.6 && <div style={{ position: "absolute", left: 560, top: 300, padding: "14px 22px", background: "#facc15", border: `7px solid ${P.ink}`, borderRadius: 14, fontWeight: 900, fontSize: 52, transform: "rotate(6deg)", zIndex: 5 }}>⚠ SAFETY FIRST</div>}
        {t >= inc - 0.2 && <Snowball x={interpolate(t, [inc - 0.2, inc + 0.4], [600, 1300], clamp)} y={interpolate(t, [inc - 0.2, inc + 0.4], [800, 300], clamp)} s={110} />}
        {t >= inc && <Pow text="INCOMING!" x={60} y={280} size={140} rot={-6} color={P.teal} />}</>);
    } },
  { from: at("h_safety", "incoming") + 0.45, Comp: ({ lf }) => (<><BgRink />
      <SnowPile x={-40} y={1050} w={460} h={280} /><SnowPile x={660} y={1080} w={460} h={260} />
      {([["pucky", 80, 850], ["clubby", 200, 780], ["biscuit", 700, 830], ["helmy", 840, 860]] as [Who, number, number][]).map(([w, x, y], i) => <div key={w} style={{ position: "absolute", left: x, top: y - Math.abs(Math.sin(lf / 5 + i)) * 40, zIndex: 3 }}><Mascot who={w} size={260} mood="laugh" noSticker talking open={0.5} seed={`f${w}`} flip={x > 500} /></div>)}
      {[...Array(6)].map((_, i) => { const k = ((lf / 40 + i / 6) % 1); const dir = i % 2 ? 1 : -1; return <Snowball key={i} x={dir > 0 ? lerp(k, 200, 900) : lerp(k, 900, 200)} y={lerp(k, 800, 820) - Math.sin(k * Math.PI) * 260 + i * 10} s={70} />; })}
      <Pow text="❄ WAR! ❄" x={250} y={330} size={130} rot={-4} color="#2563eb" /></>) },
  { from: S("a_lunch").start - 0.12, Comp: ({ t, lf }) => (<><BgRink />
      <div style={{ position: "absolute", left: 300, top: 1130, width: 520, height: 70, background: "#f97316", border: `6px solid ${P.ink}`, borderRadius: 12, zIndex: 1 }} />
      {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: 330 + i * 400, top: 1180, width: 22, height: 160, background: "#a16207", border: `5px solid ${P.ink}`, transform: `rotate(${i ? 12 : -12}deg)`, zIndex: 1 }} />)}
      <Big who="agenty" t={t} size={1000} x={40} y={420} mood="smug" />
      <div style={{ position: "absolute", left: 640, top: 900 + Math.sin(lf / 6) * 8, zIndex: 5 }}><HotDog s={300} rot={-12} /></div>
      <StickerCard x={540} y={260} rot={5} w={440} h={140}><div style={{ fontWeight: 900, fontSize: 50 }}>🌭 LUNCH BREAK</div></StickerCard></>) },
  { from: S("c_trick").start - 0.12, Comp: ({ t, lf }) => (<><BgBurst c1="#bbf7d0" c2="#dcfce7" />
      <Big who="clubby" t={t} size={1250} x={-85} y={420} mood="determined" rot={interpolate(lf, [0, 50], [0, -22], clamp)} />
      {t >= at("c_trick", "trick") - 0.1 && <Pow text="TRICK SHOT!" x={140} y={290} size={140} rot={-6} color={P.green} />}</>) },
  { from: T_SHOT() - 0.1, Comp: ({ t, lf }) => {
      const s0 = T_SHOT(), d = T_DOG(), h = T_HEAD(), g = T_GOAL();
      // Pucky path: stick → hot dog → Agenty's head → goal
      const pts: [number, number, number][] = [[s0, 230, 1180], [d, 650, 1010], [h, 520, 760], [g, 905, 1260]];
      let px = pts[0][1], py = pts[0][2];
      for (let i = 1; i < pts.length; i++) if (t <= pts[i][0] || i === pts.length - 1) { const k = interpolate(t, [pts[i - 1][0], pts[i][0]], [0, 1], clamp); px = lerp(k, pts[i - 1][1], pts[i][1]); py = lerp(k, pts[i - 1][2], pts[i][2]) - (i === 3 ? Math.sin(k * Math.PI) * 260 : Math.sin(k * Math.PI) * 60); if (t <= pts[i][0]) break; }
      const dogK = interpolate(t, [d, d + 1.2], [0, 1], clamp);
      const lit = t > g && t < g + 0.8;
      return (<><BgRink />
        <Net x={840} y={1130} lit={lit} />
        <div style={{ position: "absolute", left: -60, top: 1000, zIndex: 3, transform: `rotate(${t > s0 ? 20 : -20}deg)`, transformOrigin: "50% 90%" }}><Mascot who="clubby" size={330} mood="laugh" noSticker seed="tc" /></div>
        <div style={{ position: "absolute", left: 330, top: 700, zIndex: 3 }}><Mascot who="agenty" size={420} mood={t > h ? "dizzy" : t > d ? "scared" : "smug"} noSticker seed="ta" /></div>
        {t > h && [0, 1, 2].map((i) => { const a = lf / 8 + (i * Math.PI * 2) / 3; return <div key={i} style={{ position: "absolute", left: 520 + Math.cos(a) * 140, top: 720 + Math.sin(a) * 40, fontSize: 60, color: P.mustard, WebkitTextStroke: `3px ${P.ink}`, zIndex: 8 }}>★</div>; })}
        <div style={{ position: "absolute", left: t < d ? 600 : lerp(dogK, 600, 120), top: t < d ? 980 : lerp(dogK, 980, 1250) - Math.sin(dogK * Math.PI) * 500, zIndex: 6, transform: `rotate(${t < d ? -12 : dogK * 900}deg)` }}><HotDog s={200} /></div>
        {dogK >= 1 && <div style={{ position: "absolute", left: 80, top: 1280, width: 260, height: 50, borderRadius: "50%", background: "#facc15", border: `4px solid ${P.ink}`, zIndex: 2 }} />}
        <div style={{ position: "absolute", left: px - 70, top: py - 70, zIndex: 9, transform: `rotate(${lf * 22}deg)` }}><Mascot who="pucky" size={140} mood="laugh" noSticker talking open={0.8} seed="tp" /></div>
        {t >= d && t < d + 0.45 && <Pow text="🌭 POP!" x={560} y={860} size={90} rot={10} color={P.red} />}
        {t >= h && t < h + 0.5 && <Pow text="BONK!" x={330} y={560} size={130} rot={-8} color={P.ink} />}
        {t >= g && <Pow text="GOAL!" x={420} y={300} size={170} rot={-6} color={P.red} />}
        {t < d && <SpeedLines />}
        <Flash at={Math.round((g - (s0 - 0.1)) * 60)} /></>);
    } },
  { from: S("h_assist").start - 0.15, Comp: ({ t }) => (<><BgRink />
      <div style={{ position: "absolute", left: 40, top: 230, padding: "8px 40px", background: P.mustard, border: `5px solid ${P.ink}`, transform: "rotate(-6deg)", fontWeight: 900, fontSize: 52, letterSpacing: 6, zIndex: 6 }}>◀◀ REPLAY</div>
      <svg width={1080} height={1000} style={{ position: "absolute", left: 0, top: 380, zIndex: 3 }}>
        <path d="M150 700 Q400 560 600 600 Q520 300 480 260 Q800 200 900 760" stroke={P.mustard} strokeWidth={14} strokeDasharray="30 18" fill="none" />
        {([[600, 600, "1 🌭"], [480, 260, "2 🤕"], [900, 760, "3 🥅"]] as [number, number, string][]).map(([x, y, l]) => <g key={l}><circle cx={x} cy={y} r={60} fill="#fff" stroke={P.ink} strokeWidth={6} /><text x={x} y={y + 18} textAnchor="middle" fontSize={44} fontWeight={900}>{l}</text></g>)}
      </svg>
      <Big who="helmy" t={t} size={520} x={-60} y={1060} mood="smug" z={4} />
      {t >= at("h_assist", "hot") - 0.2 && <StickerCard x={430} y={1150} rot={4} w={560} h={190}><div style={{ fontWeight: 900, fontSize: 56 }}>ASSIST:</div><div style={{ fontWeight: 900, fontSize: 64, color: P.red }}>🌭 HOT DOG</div></StickerCard>}</>) },
  { from: S("z_clean").start - 0.12, Comp: ({ t }) => (<><BgRink />
      <SnowPile x={-60} y={1150} w={420} h={260} /><SnowPile x={760} y={1180} w={380} h={220} />
      <div style={{ position: "absolute", left: 420, top: 1300, width: 260, height: 50, borderRadius: "50%", background: "#facc15", border: `4px solid ${P.ink}`, zIndex: 2 }} />
      <div style={{ position: "absolute", left: 600, top: 1230, zIndex: 3 }}><HotDog s={180} rot={30} /></div>
      <Big who="zam" t={t} size={1000} x={40} y={540} mood="sweat" /></>) },
  { from: S("p_notit").start - 0.12, Comp: ({ lf }) => (<><BgRink /><SpeedLines dir={-1} />
      {(["pucky", "clubby", "biscuit", "helmy", "agenty"] as Who[]).map((w, i) => <div key={w} style={{ position: "absolute", left: interpolate(lf, [0, 40], [200 + i * 140, 1300 + i * 200], clamp), top: 800 + (i % 2) * 180 - Math.abs(Math.sin(lf / 3 + i)) * 40, zIndex: 3 + i }}><Mascot who={w} size={260} mood="laugh" noSticker talking open={0.6} seed={`r${w}`} /></div>)}
      <Pow text="NOT IT!" x={160} y={330} size={190} rot={-6} color={P.red} /></>) },
  { from: S("z_again").start - 0.12, Comp: ({ t }) => (<><BgRink /><Big who="zam" t={t} size={1250} x={-85} y={430} mood="tired" />
      <Pow text="…ME AGAIN." x={160} y={300} size={130} rot={-5} color="#2563eb" /></>) },
];

const Extras: React.FC<{ N: (s: number) => number }> = ({ N }) => (
  <>
    <Sequence from={N(at("z_intro", "tank"))} durationInFrames={60}><Audio src={staticFile("sfx/scrape.wav")} volume={0.7} /></Sequence>
    <Sequence from={N(at("p_fight", "fight"))} durationInFrames={110}><Audio src={staticFile("sfx/crowd.wav")} volume={0.35} /></Sequence>
    <Sequence from={N(at("b_mask", "hey") - 0.12)} durationInFrames={30}><Audio src={staticFile("brand/impact.wav")} volume={0.5} /></Sequence>
    <Sequence from={N(at("h_safety", "incoming"))} durationInFrames={30}><Audio src={staticFile("whoosh.wav")} volume={0.6} /></Sequence>
    <Sequence from={N(T_SHOT())} durationInFrames={30}><Audio src={staticFile("whoosh.wav")} volume={0.7} /></Sequence>
    <Sequence from={N(T_DOG())} durationInFrames={20}><Audio src={staticFile("pop.wav")} volume={0.8} /></Sequence>
    <Sequence from={N(T_HEAD())} durationInFrames={40}><Audio src={staticFile("brand/boing.wav")} volume={0.7} /></Sequence>
    <Sequence from={N(T_GOAL())} durationInFrames={110}><Audio src={staticFile("sfx/horn.wav")} volume={0.5} /></Sequence>
    <Sequence from={N(T_GOAL())} durationInFrames={90}><Confetti n={50} x={700} y={500} /></Sequence>
    <Sequence from={N(at("h_assist", "dog"))} durationInFrames={40}><Audio src={staticFile("brand/rimshot.wav")} volume={0.6} /></Sequence>
    <Sequence from={N(at("z_again", "again"))} durationInFrames={40}><Audio src={staticFile("brand/rimshot.wav")} volume={0.6} /></Sequence>
  </>
);

export const { Comp: SnowballFight, FRAMES: SNOWBALL_FRAMES } = makeToon({ words: WORDS, vo: "ep/snowball.mp3", shots, tag: "ZAM · SPECIAL EDITION", tagline: "snowball fight!", Extras });
void onTwos; void Sparkles;
