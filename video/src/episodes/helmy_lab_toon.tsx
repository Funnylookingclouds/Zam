/** ZAM Special Edition – "Helmy's Number Lab" (cartoon). Facts: Mosienko hat trick in 21 s (Mar 23, 1952); Gretzky's 1,963
 *  regular-season assists > next-best career points (Jagr 1,921); Ovechkin's 895th goal passes Gretzky (Apr 6, 2025);
 *  Stanley Cup weighs 34.5 lb ≈ 15.6 kg (Hockey Hall of Fame). Trophy drawn generic – no logos. */
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, random, staticFile, useCurrentFrame, Easing } from "remotion";
import words from "../data/helmy_lab_words.json";
import { P, HAND, clamp, onTwos } from "../presenter/kit";
import { FONT } from "../theme";
import { Mascot } from "../mascots/Gang";
import { Confetti, type W } from "../zam/common";
import { timing } from "../zam/Episode";
import { BgBurst, BgLab, BgRink, Big, Pow, Sparkles, StickerCard, makeToon, type ToonShot } from "../zam/toon";

const WORDS = words as W[];
const { S, at } = timing(WORDS);

const Chalkboard: React.FC = () => (
  <div style={{ position: "absolute", left: 60, top: 300, width: 960, height: 420, background: "#1f3a2e", border: `14px solid #8b5e3c`, borderRadius: 10, zIndex: 1 }}>
    {["G + A = PTS", "21 s ⏱", "1,963 ÷ 1 = 😮", "895 > 894"].map((txt, i) => <div key={i} style={{ position: "absolute", left: 40 + (i % 2) * 460, top: 50 + Math.floor(i / 2) * 170, fontFamily: HAND, fontWeight: 700, fontSize: 72, color: "#f1f5f9", transform: `rotate(${[-3, 2, 2, -2][i]}deg)` }}>{txt}</div>)}
  </div>
);
const Beakers: React.FC<{ tip?: number }> = ({ tip = 0 }) => {
  const f = onTwos(useCurrentFrame());
  return <>{[{ x: 760, c: "#86efac" }, { x: 880, c: "#f9a8d4" }].map((b, i) => (
    <div key={i} style={{ position: "absolute", left: b.x, top: 780, width: 110, height: 170, border: `8px solid ${P.ink}`, borderTop: "none", borderRadius: "0 0 30px 30px", background: b.c, transform: `rotate(${i === 1 ? tip : 0}deg)`, transformOrigin: "50% 100%", zIndex: 3, overflow: "hidden" }}>
      {[0, 1, 2].map((k) => <div key={k} style={{ position: "absolute", left: 20 + k * 25, top: 150 - ((f * 2 + k * 50) % 150), width: 18, height: 18, borderRadius: 9, background: "#fff9" }} />)}
    </div>))}</>;
};
const Digits: React.FC<{ v: string; size?: number; color?: string }> = ({ v, size = 190, color = "#f7d84a" }) => (
  <div style={{ display: "flex", gap: 10 }}>{v.split("").map((d, i) => d === "," ? <div key={i} style={{ fontSize: size * 0.8, fontWeight: 900, color: P.ink, alignSelf: "flex-end" }}>,</div> : (
    <div key={i} style={{ width: size * 0.72, height: size * 1.05, background: "#1d1a17", color, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontSize: size, fontWeight: 900, boxShadow: `inset 0 -${size * 0.52}px 0 #2a2622`, position: "relative", border: `5px solid ${P.ink}` }}>{d}<div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 5, background: "#000" }} /></div>))}</div>
);
/** Generic silver trophy (no logos). */
const Trophy: React.FC<{ s?: number }> = ({ s = 420 }) => (
  <svg width={s} height={s * 1.3} viewBox="0 0 200 260">
    <defs><linearGradient id="silv" x1="0" x2="1"><stop offset="0" stopColor="#94a3b8" /><stop offset="0.45" stopColor="#f8fafc" /><stop offset="1" stopColor="#64748b" /></linearGradient></defs>
    <path d="M60 10 H140 Q140 50 100 60 Q60 50 60 10 Z" fill="url(#silv)" stroke={P.ink} strokeWidth={5} />
    <rect x={85} y={60} width={30} height={30} fill="url(#silv)" stroke={P.ink} strokeWidth={5} />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={70 - i * 10} y={90 + i * 40} width={60 + i * 20} height={40} fill="url(#silv)" stroke={P.ink} strokeWidth={5} />)}
    {[0, 1, 2, 3].map((i) => [...Array(4 + i)].map((_, k) => <line key={`${i}${k}`} x1={76 - i * 10 + k * 12} y1={98 + i * 40} x2={76 - i * 10 + k * 12} y2={122 + i * 40} stroke="#64748b" strokeWidth={2} />))}
  </svg>
);

const shots: ToonShot[] = [
  { from: 0, chapter: ["9:00 AM", "THE LAB"], Comp: ({ t, lf }) => (<><BgLab /><Chalkboard />
      <Big who="helmy" t={t} size={760} x={220} y={760} mood="wow" />
      <Big who="zam" t={t} size={460} x={-80} y={1080} mood="wow" z={4} />
      <Beakers tip={t > at("z_intro", "touch") ? interpolate(lf, [70, 90], [0, 50], clamp) : 0} />
      <div style={{ position: "absolute", left: 830, top: 640, zIndex: 4 }}><Mascot who="pucky" size={200} mood="smug" seed="peek" /></div>
      <StickerCard x={110} y={250} rot={-3} w={860} h={230}><div style={{ fontSize: 34, fontWeight: 900, color: P.red, letterSpacing: 4 }}>ZAM SPECIAL EDITION</div><div style={{ fontSize: 80, fontWeight: 900, lineHeight: 1 }}>HELMY'S<br />NUMBER LAB</div></StickerCard></>) },
  { from: S("h_one").start - 0.15, chapter: ["#1", "21 SECONDS"], Comp: ({ t }) => {
      const t0 = at("h_one", "twentyone"), t1 = at("h_one", "fastest");
      const sec = interpolate(t, [t0, t1], [0, 21], clamp);
      const goals = [0.25, 0.6, 0.95].map((k) => t0 + (t1 - t0) * k);
      return (<><BgBurst c1="#ccfbf1" c2="#99f6e4" />
        <div style={{ position: "absolute", left: 190, top: 300, width: 700, height: 700, borderRadius: "50%", background: "#fff", border: `18px solid ${P.ink}`, zIndex: 2 }}>
          <div style={{ position: "absolute", left: 300, top: -90, width: 100, height: 90, background: P.ink, borderRadius: 14 }} />
          {[...Array(12)].map((_, i) => <div key={i} style={{ position: "absolute", left: 340, top: 20, width: 12, height: 40, background: P.ink, transformOrigin: "6px 312px", transform: `rotate(${i * 30}deg)` }} />)}
          <div style={{ position: "absolute", left: 343, top: 70, width: 14, height: 280, background: P.red, transformOrigin: "7px 280px", transform: `rotate(${sec * 6}deg)`, borderRadius: 7 }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center", fontFamily: "'DejaVu Sans Mono', monospace", fontWeight: 900, fontSize: 120 }}>{sec.toFixed(0)}s</div>
        </div>
        <div style={{ position: "absolute", left: 60, top: 1060, display: "flex", gap: 20, zIndex: 3 }}>{goals.map((g, i) => <div key={i} style={{ width: 150, height: 60, borderRadius: "50%", background: t >= g ? "#111" : "#1111", border: `6px solid ${t >= g ? P.ink : "#0003"}`, transform: `scale(${t >= g && t < g + 0.2 ? 1.3 : 1})` }} />)}</div>
        <Big who="helmy" t={t} size={520} x={620} y={1000} mood="wow" z={3} />
        {t >= at("h_one", "bill") - 0.1 && <StickerCard x={70} y={250} rot={-4} w={620} h={200}><div style={{ fontSize: 48, fontWeight: 900 }}>BILL MOSIENKO</div><div style={{ fontFamily: HAND, fontSize: 40, color: P.red }}>Mar 23, 1952 · 3 goals in 21 seconds</div></StickerCard>}</>);
    } },
  { from: S("p_awake").start - 0.15, Comp: ({ t, lf }) => (<><BgBurst c1="#fecaca" c2="#fca5a5" /><Big who="pucky" t={t} size={1300} x={-110} y={460} mood="smug" rot={Math.sin(lf / 8) * 3} /></>) },
  { from: at("p_awake", "biscuit") - 0.1, Comp: ({ t }) => {
      const woke = t >= at("b_hey", "hey") - 0.05;
      return (<><BgRink /><Big who="biscuit" t={t} size={1250} x={-85} y={430} mood={woke ? "grumpy" : "sleep"} hop={woke && t < at("b_hey", "hey") + 0.25 ? 90 : 0} />
        {!woke && <div style={{ position: "absolute", left: 700, top: 360, fontFamily: HAND, fontWeight: 700, fontSize: 120, color: "#2563eb", zIndex: 4 }}>z z Z</div>}
        {woke && <Pow text="HEY!" x={340} y={260} size={190} rot={-8} color={P.mustard} />}</>);
    } },
  { from: S("h_two").start - 0.15, chapter: ["#2", "1,963"], Comp: ({ t }) => {
      const n = Math.round(interpolate(t, [at("h_two", "one"), at("h_two", "sixtythree") + 0.3], [0, 1963], { ...clamp, easing: Easing.out(Easing.cubic) }));
      const bars = t >= at("h_two", "more") - 0.2;
      const k = interpolate(t, [at("h_two", "more") - 0.2, at("h_two", "points")], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.3)) });
      return (<><BgLab />
        <div style={{ position: "absolute", left: 90, top: 300, zIndex: 3 }}><Digits v={n.toLocaleString("en-US")} size={150} /></div>
        <div style={{ position: "absolute", left: 140, top: 520, fontFamily: HAND, fontWeight: 700, fontSize: 56, color: P.teal, zIndex: 3 }}>Wayne Gretzky's career assists</div>
        {bars && <div style={{ position: "absolute", left: 80, top: 640, width: 920, height: 700, zIndex: 3 }}>
          {[{ x: 80, v: 1963, lab: "GRETZKY", sub: "assists only", c: P.teal }, { x: 500, v: 1921, lab: "JÁGR", sub: "total points (#2 ever)", c: "#94a3b8" }].map((b) => (
            <div key={b.lab}>
              <div style={{ position: "absolute", left: b.x, bottom: 140, width: 300, height: (b.v / 1963) * 480 * k, background: b.c, border: `8px solid ${P.ink}` }}>
                <div style={{ position: "absolute", top: -70, left: 0, right: 0, textAlign: "center", fontWeight: 900, fontSize: 52 }}>{k > 0.8 ? b.v.toLocaleString("en-US") : ""}</div>
              </div>
              <div style={{ position: "absolute", left: b.x - 20, bottom: 70, width: 340, textAlign: "center", fontWeight: 900, fontSize: 44 }}>{b.lab}</div>
              <div style={{ position: "absolute", left: b.x - 30, bottom: 20, width: 360, textAlign: "center", fontFamily: HAND, fontSize: 38, color: P.muted }}>{b.sub}</div>
            </div>))}
        </div>}</>);
    } },
  { from: S("c_share").start - 0.15, Comp: ({ t, lf }) => (<><BgRink />
      <Big who="clubby" t={t} size={950} x={-200} y={480} mood="laugh" />
      <Big who="pucky" t={t} size={560} x={interpolate(lf, [10, 60], [380, 560], clamp)} y={900} mood="laugh" rot={lf * 6} z={3} />
      {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 420 + i * 120, top: 760 - ((lf * 4 + i * 60) % 300), fontSize: 90, color: P.red, opacity: 0.85, zIndex: 4 }}>♥</div>)}
      {t >= at("c_share", "sharing") - 0.1 && <Pow text="SHARING ♥" x={300} y={300} size={120} rot={-6} color={P.green} />}</>) },
  { from: S("h_three").start - 0.15, chapter: ["#3", "895"], Comp: ({ t }) => {
      const flip = t >= at("h_three", "ninetyfive");
      return (<><BgBurst c1="#fef3c7" c2="#fde68a" />
        <div style={{ position: "absolute", left: 200, top: 360, zIndex: 3 }}><Digits v={flip ? "895" : "894"} size={230} /></div>
        <div style={{ position: "absolute", left: 230, top: 640, fontFamily: HAND, fontWeight: 700, fontSize: 60, color: P.red, zIndex: 3 }}>{flip ? "career NHL goals – new record!" : "the old record (Gretzky)"}</div>
        <Big who="helmy" t={t} size={600} x={480} y={960} mood="wow" z={3} />
        {flip && <Pow text="NEW RECORD!" x={40} y={1010} size={100} rot={-6} color={P.red} />}
        {t >= at("h_three", "alex") - 0.1 && <StickerCard x={50} y={760} rot={-4} w={560} h={220}><div style={{ fontSize: 46, fontWeight: 900 }}>ALEX OVECHKIN</div><div style={{ fontFamily: HAND, fontSize: 40, color: P.red }}>Apr 6, 2025 · goal No. 895</div></StickerCard>}</>);
    } },
  { from: S("z_cup").start - 0.15, chapter: ["BONUS", "THE CUP"], Comp: ({ t }) => (<><BgBurst c1="#e0e7ff" c2="#c7d2fe" /><Sparkles n={10} color="#6366f1" />
      <div style={{ position: "absolute", left: 600, top: 330, zIndex: 3 }}><Trophy s={400} /></div>
      <Big who="zam" t={t} size={900} x={-160} y={760} mood="wow" /></>) },
  { from: S("h_cup").start - 0.15, Comp: ({ t, lf }) => {
      const lunch = t >= S("p_lunch").start - 0.15;
      const tilt = lunch ? interpolate(t, [S("p_lunch").start - 0.15, S("p_lunch").start + 0.3], [0, 12], clamp) : Math.sin(lf / 10) * 1.5;
      return (<><BgLab />
        <div style={{ position: "absolute", left: 535, top: 780, width: 20, height: 420, background: P.ink, zIndex: 2 }} />
        <div style={{ position: "absolute", left: 90, top: 780, width: 900, height: 20, background: P.ink, transform: `rotate(${tilt}deg)`, transformOrigin: "50% 50%", zIndex: 2 }}>
          <div style={{ position: "absolute", left: 0, top: -360 }}><Trophy s={270} /></div>
          {lunch && <div style={{ position: "absolute", left: 600, top: -300, width: 320, height: 300, background: "#f59e0b", border: `10px solid ${P.ink}`, borderRadius: 30, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontWeight: 900, fontSize: 44 }}>BISCUIT'S<br />LUNCH 🐟</div>}
        </div>
        <StickerCard x={470} y={1130} rot={4} w={540} h={220}><div style={{ fontSize: 70, fontWeight: 900 }}>34.5 lb</div><div style={{ fontFamily: HAND, fontSize: 46, color: P.teal }}>≈ 15.6 kg (Hall of Fame)</div></StickerCard>
        {lunch ? <Big who="pucky" t={t} size={420} x={40} y={1100} mood="smug" z={3} /> : <Big who="helmy" t={t} size={480} x={0} y={1100} mood="wow" z={3} />}</>);
    } },
  { from: S("b_fair").start - 0.12, Comp: ({ t }) => (<><BgBurst c1="#fde68a" c2="#fef3c7" /><Big who="biscuit" t={t} size={1250} x={-85} y={430} mood="bliss" />
      <div style={{ position: "absolute", left: 620, top: 1180, fontSize: 160, zIndex: 4, transform: "rotate(-20deg)" }}>🐟</div></>) },
  { from: S("z_fav").start - 0.15, chapter: ["FINALLY", "FAVOURITE"], Comp: ({ t }) => (<><BgLab /><Big who="zam" t={t} size={1150} x={-35} y={520} mood="wow" /></>) },
  { from: S("h_wear").start - 0.12, Comp: ({ t, lf }) => {
      const words2 = ["one", "helmet", "every", "wear"];
      const k = words2.filter((w, i) => t >= at("h_wear", w, w === "one" ? 0 : 0)).length;
      return (<><BgBurst c1="#99f6e4" c2="#5eead4" /><Sparkles n={10} color="#0d9488" />
        <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + k * 0.06})`, transformOrigin: "50% 45%" }}><Big who="helmy" t={t} size={1250} x={-85} y={430} mood={k >= 4 ? "bliss" : "determined"} /></div>
        <div style={{ position: "absolute", left: 70, top: 260, width: 220, height: 300, background: P.red, border: `10px solid ${P.ink}`, borderRadius: 30, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 240, color: "#fff", transform: `rotate(${-8 + Math.sin(lf / 6) * 3}deg)`, zIndex: 5 }}>1</div>
        {k > 0 && <Pow text={["ONE.", "HELMET.", "EVERY GAME.", "WEAR IT!"][k - 1]} x={330} y={330} size={k === 4 ? 150 : 120} rot={-5} color={P.teal} />}</>);
    } },
];

const Extras: React.FC<{ N: (s: number) => number }> = ({ N }) => {
  const t0 = at("h_one", "twentyone"), t1 = at("h_one", "fastest");
  return (
    <>
      <Sequence from={N(at("z_intro", "touch") + 1)} durationInFrames={40}><Audio src={staticFile("brand/boing.wav")} volume={0.4} /></Sequence>
      {[0.25, 0.6, 0.95].map((k, i) => <Sequence key={i} from={N(t0 + (t1 - t0) * k)} durationInFrames={20}><Audio src={staticFile("pop.wav")} volume={0.7} /></Sequence>)}
      <Sequence from={N(at("b_hey", "hey"))} durationInFrames={40}><Audio src={staticFile("brand/impact.wav")} volume={0.5} /></Sequence>
      <Sequence from={N(at("h_two", "points"))} durationInFrames={50}><Audio src={staticFile("brand/ding.wav")} volume={0.55} /></Sequence>
      <Sequence from={N(at("h_three", "ninetyfive"))} durationInFrames={110}><Audio src={staticFile("sfx/horn.wav")} volume={0.45} /></Sequence>
      <Sequence from={N(at("h_three", "ninetyfive"))} durationInFrames={100}><Confetti n={50} x={540} y={400} /></Sequence>
      <Sequence from={N(S("p_lunch").start - 0.15)} durationInFrames={40}><Audio src={staticFile("brand/boing.wav")} volume={0.5} /></Sequence>
      <Sequence from={N(at("b_fair", "fair"))} durationInFrames={40}><Audio src={staticFile("brand/rimshot.wav")} volume={0.6} /></Sequence>
      {["one", "helmet", "every", "wear"].map((w) => <Sequence key={w} from={N(at("h_wear", w))} durationInFrames={20}><Audio src={staticFile("pop.wav")} volume={0.6} /></Sequence>)}
      <Sequence from={N(at("h_wear", "wear"))} durationInFrames={90}><Confetti n={50} x={540} y={500} /></Sequence>
    </>
  );
};

export const { Comp: HelmyLab, FRAMES: HELMYLAB_FRAMES } = makeToon({ words: WORDS, vo: "ep/helmy_lab.mp3", shots, tag: "ZAM · SPECIAL EDITION", tagline: "special edition!", Extras });
void random;
void AbsoluteFill;
