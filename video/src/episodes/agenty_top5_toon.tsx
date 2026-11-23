/** ZAM Special Edition – "Meet Agenty: Top 5 Prospects Ever" (cartoon). Facts: Lindros refused Quebec (1991 #1) → Flyers paid
 *  6 players, 2 firsts, $15M; McDavid exceptional status at 15 (2012); 2005 lottery = "Sidney Crosby Sweepstakes";
 *  Lemieux 133 goals in 1983–84 (QMJHL record); Gretzky 378 goals at age 10. */
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, random, staticFile, useCurrentFrame, Easing } from "remotion";
import words from "../data/agenty_top5_words.json";
import { P, HAND, clamp, onTwos, tornPath, Stamp } from "../presenter/kit";
import { FONT } from "../theme";
import { Mascot } from "../mascots/Gang";
import { type W } from "../zam/common";
import { timing } from "../zam/Episode";
import { BgBurst, BgLab, Big, Grain, Pow, Sparkles, SpeedLines, StickerCard, makeToon, type ToonShot } from "../zam/toon";

const WORDS = words as W[];
const { S, at } = timing(WORDS);
const fr = (from: number, news: number) => Math.round((news - from) * 60);

export const BgCarpet: React.FC = () => {
  const f = onTwos(useCurrentFrame());
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#1e1b4b 0%,#312e81 55%,#4c1d95 100%)" }}>
      <div style={{ position: "absolute", left: 240, right: 240, top: 700, bottom: 0, background: "#b91c1c", clipPath: "polygon(35% 0, 65% 0, 100% 100%, 0 100%)" }} />
      {[...Array(14)].map((_, i) => { const on = Math.floor(f / 6 + i * 3) % 7 === 0; return <div key={i} style={{ position: "absolute", left: (i % 7) * 160 + 20, top: 360 + Math.floor(i / 7) * 160, width: 60, height: 44, borderRadius: 8, background: "#111", border: "4px solid #000" }}>{on && <div style={{ position: "absolute", left: -40, top: -40, width: 140, height: 120, borderRadius: "50%", background: "radial-gradient(circle,#fff 0%,#fff0 70%)" }} />}</div>; })}
      {[0, 1].map((i) => <div key={`r${i}`} style={{ position: "absolute", left: i ? 760 : 160, top: 700, width: 14, height: 600, background: "#facc15", border: `4px solid ${P.ink}` }} />)}
      <Grain />
    </AbsoluteFill>
  );
};
export const BgOffice: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg,#ede9fe 0%,#ddd6fe 62%,#6b4f2e 62.5%,#5b3f22 100%)" }}>
    <div style={{ position: "absolute", left: 120, top: 120, padding: "10px 30px", background: "#4c1d95", color: "#fde68a", fontFamily: FONT, fontWeight: 900, fontSize: 40, letterSpacing: 3, border: `6px solid ${P.ink}`, borderRadius: 10, opacity: 0 }}>AGENTY & ASSOCIATES</div>
    {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 80 + i * 330, top: 300, width: 240, height: 300, background: "#fef3c7", border: `8px solid ${P.ink}`, transform: `rotate(${[-4, 3, -2][i]}deg)` }}><div style={{ margin: 30, height: 160, background: "#c4b5fd" }} /><div style={{ textAlign: "center", fontFamily: HAND, fontSize: 36 }}>⭐ client ⭐</div></div>)}
    <Grain />
  </AbsoluteFill>
);
export const ProspectFile: React.FC<{ n: number; name: string; sub: string; children?: React.ReactNode }> = ({ n, name, sub, children }) => (
  <div style={{ position: "absolute", left: 60, top: 250, width: 960, height: 980, zIndex: 3 }}>
    <div style={{ position: "absolute", left: 420, top: 0, width: 320, height: 80, background: "#e5c07b", border: `8px solid ${P.ink}`, borderBottom: "none", borderRadius: "20px 20px 0 0", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 36 }}>PROSPECT FILE</div>
    <div style={{ position: "absolute", left: 0, top: 72, right: 0, bottom: 0, background: "#e5c07b", border: `8px solid ${P.ink}`, borderRadius: 24 }}>
      <svg width={900} height={860} style={{ position: "absolute", left: 22, top: 24 }}><path d={tornPath(900, 860, `pf${n}`, 18, 8)} fill="#fffdf7" /></svg>
      <div style={{ position: "absolute", left: 60, top: 60, width: 190, height: 190, borderRadius: "50%", background: "#8b5cf6", border: `8px solid ${P.ink}`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 120 }}>#{n}</div>
      <div style={{ position: "absolute", left: 290, top: 80, right: 40, fontWeight: 900, fontSize: 70, lineHeight: 1, color: P.ink }}>{name}</div>
      <div style={{ position: "absolute", left: 292, top: 230, right: 40, fontFamily: HAND, fontSize: 48, color: "#7c3aed" }}>{sub}</div>
      <div style={{ position: "absolute", left: 60, top: 300, right: 60, bottom: 40 }}>{children}</div>
    </div>
  </div>
);
export const Counter: React.FC<{ v: number; label: string; color?: string }> = ({ v, label, color = "#7c3aed" }) => (
  <div style={{ textAlign: "center" }}><div style={{ fontSize: 260, fontWeight: 900, color, lineHeight: 1 }}>{v}</div><div style={{ fontSize: 56, fontWeight: 900 }}>{label}</div></div>
);
const BusinessCards: React.FC = () => {
  const f = onTwos(useCurrentFrame());
  return <>{[...Array(6)].map((_, i) => { const k = ((f / 50 + i / 6) % 1); return <div key={i} style={{ position: "absolute", left: 540 + Math.cos(i * 1.1) * k * 700 - 110, top: 700 + Math.sin(i * 1.7) * k * 500, width: 220, height: 120, background: "#fff", border: `5px solid ${P.ink}`, borderRadius: 10, transform: `rotate(${k * 360 + i * 40}deg) scale(${0.6 + k})`, opacity: 1 - k * 0.6, zIndex: 5, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 26, color: "#7c3aed" }}>AGENTY<span style={{ fontSize: 16, color: P.ink }}>TOP AGENT ★</span></div>; })}</>;
};

const shots: ToonShot[] = [
  { from: 0, Comp: ({ t, lf }) => (<><BgBurst c1="#a78bfa" c2="#c4b5fd" />
      <div style={{ position: "absolute", left: 340, top: 420, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,#fffbe6,#fffbe600 70%)", zIndex: 1 }} />
      <Big who="zam" t={t} size={900} x={90} y={760} mood="wow" />
      <StickerCard x={110} y={250} rot={-3} w={860} h={240}><div style={{ fontSize: 34, fontWeight: 900, color: P.red, letterSpacing: 4 }}>ZAM SPECIAL EDITION</div><div style={{ fontSize: 76, fontWeight: 900, lineHeight: 1 }}>MEET THE NEW<br />GUY…</div></StickerCard>
      {lf % 20 < 10 && <div style={{ position: "absolute", right: 200, top: 560, fontSize: 90, zIndex: 4 }}>❓</div>}</>) },
  { from: S("a_hello").start - 0.15, chapter: ["NEW", "AGENTY"], Comp: ({ t, lf }) => (<><BgCarpet /><BusinessCards />
      <Big who="agenty" t={t} size={1150} x={interpolate(lf, [0, 30], [-700, -35], { ...clamp, easing: Easing.out(Easing.back(1.3)) })} y={500} mood="smug" />
      {t >= at("a_hello", "welcome") - 0.1 && <Pow text="YOU'RE WELCOME." x={70} y={320} size={100} rot={-6} color="#7c3aed" />}</>) },
  { from: S("a_five").start - 0.15, chapter: ["#5", "PROSPECT FILE"], Comp: ({ t, lf }) => (<><BgOffice />
      {t < at("a_five", "number") - 0.1 ? <Big who="agenty" t={t} size={1150} x={-35} y={480} mood="smug" rot={Math.sin(lf / 8) * 3} /> : (<>
        <ProspectFile n={5} name="ERIC LINDROS" sub="#1 pick · 1991 draft">
          {t >= at("a_five", "refused") - 0.1 && <div style={{ marginTop: 120, marginLeft: 60 }}><Stamp color={P.red} at={fr(S("a_five").start - 0.15, at("a_five", "refused"))} rot={-8} size={84}>REFUSED TO SIGN</Stamp></div>}
        </ProspectFile>
        <Big who="agenty" t={t} size={520} x={600} y={1060} mood="smug" z={4} /></>)}</>) },
  { from: S("h_paid").start - 0.15, Comp: ({ t }) => {
      const six = t >= at("h_paid", "six"), two = t >= at("h_paid", "two"), cash = t >= at("h_paid", "fifteen");
      return (<><BgLab /><Big who="helmy" t={t} size={700} x={-120} y={1000} mood="wow" />
        <div style={{ position: "absolute", left: 60, top: 300, display: "flex", flexWrap: "wrap", gap: 16, width: 960, zIndex: 3 }}>
          {six && [...Array(6)].map((_, i) => <div key={i} style={{ width: 140, height: 190, background: "#fff", border: `6px solid ${P.ink}`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 70, transform: `rotate(${(i % 2 ? 4 : -4)}deg)` }}>🧑</div>)}
        </div>
        {two && <div style={{ position: "absolute", left: 60, top: 720, display: "flex", gap: 20, zIndex: 3 }}>{[0, 1].map((i) => <div key={i} style={{ padding: "16px 30px", background: "#fde68a", border: `6px dashed ${P.ink}`, fontWeight: 900, fontSize: 50, transform: `rotate(${i ? 5 : -5}deg)` }}>1ST-ROUND PICK</div>)}</div>}
        {cash && <div style={{ position: "absolute", left: 540, top: 900, width: 420, height: 380, zIndex: 3, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ fontSize: 200 }}>💰</div><div style={{ position: "absolute", bottom: 20, fontWeight: 900, fontSize: 80, color: P.green, WebkitTextStroke: `3px ${P.ink}` }}>$15M</div></div>}</>);
    } },
  { from: S("a_leverage").start - 0.15, Comp: ({ t, lf }) => (<><BgBurst c1="#ddd6fe" c2="#c4b5fd" /><Sparkles n={8} color="#7c3aed" />
      <Big who="agenty" t={t} size={1300} x={-110} y={430} mood="smug" rot={Math.sin(lf / 6) * 4} />
      {t >= at("a_leverage", "leverage") - 0.1 && <Pow text="LEVERAGE." x={240} y={290} size={150} rot={-6} color="#7c3aed" />}</>) },
  { from: S("a_four").start - 0.15, chapter: ["#4", "PROSPECT FILE"], Comp: ({ t, lf }) => (<><BgOffice />
      <ProspectFile n={4} name="CONNOR McDAVID" sub="exceptional status · 2012">
        <div style={{ position: "absolute", left: 40, top: 60, width: 360, height: 260 }}>
          <div style={{ position: "absolute", left: 0, bottom: 0, width: 360, height: 160, background: "#f9a8d4", border: `8px solid ${P.ink}`, borderRadius: 20 }} />
          <div style={{ position: "absolute", left: 120, top: 0, width: 120, height: 110, background: "#fff", border: `6px solid ${P.ink}`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 64 }}>15</div>
          <div style={{ position: "absolute", left: 168, top: -50 + Math.sin(lf / 3) * 4, fontSize: 50 }}>🔥</div>
        </div>
        {t >= at("a_four", "fifteen") - 0.2 && <div style={{ position: "absolute", left: 420, top: 120 }}><Stamp color={P.teal} at={fr(S("a_four").start - 0.15, at("a_four", "fifteen"))} rot={6} size={50}>A YEAR EARLY</Stamp></div>}
      </ProspectFile>
      <Big who="agenty" t={t} size={520} x={600} y={1060} mood="wow" z={4} /></>) },
  { from: S("a_three").start - 0.15, chapter: ["#3", "PROSPECT FILE"], Comp: ({ t, lf }) => (<><BgOffice />
      <ProspectFile n={3} name="SIDNEY CROSBY" sub="#1 pick · 2005 draft">
        <div style={{ position: "absolute", left: 60, top: 40, width: 300, height: 300, borderRadius: "50%", border: `10px solid ${P.ink}`, background: "#e0f2fe", transform: `rotate(${lf * 6}deg)` }}>
          {[...Array(8)].map((_, i) => <div key={i} style={{ position: "absolute", left: 120 + Math.cos(i) * 90, top: 120 + Math.sin(i * 1.3) * 90, width: 56, height: 56, borderRadius: 28, background: ["#fde68a", "#fca5a5", "#a7f3d0", "#c4b5fd"][i % 4], border: `5px solid ${P.ink}` }} />)}
        </div>
        {t >= at("a_three", "called") - 0.2 && <div style={{ position: "absolute", left: 380, top: 60, width: 420, padding: 20, background: "#fde68a", border: `8px solid ${P.ink}`, borderRadius: 16, transform: "rotate(4deg)", fontWeight: 900, fontSize: 44, textAlign: "center" }}>THE SIDNEY CROSBY SWEEPSTAKES</div>}
      </ProspectFile>
      <Big who="agenty" t={t} size={520} x={600} y={1060} mood="laugh" z={4} /></>) },
  { from: S("a_two").start - 0.15, chapter: ["#2", "PROSPECT FILE"], Comp: ({ t }) => {
      const n = Math.round(interpolate(t, [at("a_two", "one") - 0.1, at("a_two", "goals")], [0, 133], { ...clamp, easing: Easing.out(Easing.cubic) }));
      return (<><BgOffice />
        <ProspectFile n={2} name="MARIO LEMIEUX" sub="Laval · 1983–84 junior season">
          <div style={{ position: "absolute", left: 40, top: 20 }}><Counter v={n} label="GOALS · ONE SEASON" /></div>
          <div style={{ position: "absolute", left: 60, top: 400, fontFamily: HAND, fontSize: 44, color: P.red }}>(+282 points · still the QMJHL record)</div>
        </ProspectFile>
        <Big who="agenty" t={t} size={520} x={600} y={1060} mood="wow" z={4} /></>);
    } },
  { from: S("c_career").start - 0.15, Comp: ({ t }) => (<><BgBurst c1="#bbf7d0" c2="#dcfce7" /><Big who="clubby" t={t} size={1250} x={-85} y={430} mood="grumpy" />
      <StickerCard x={560} y={300} rot={6} w={420} h={150}><div style={{ fontSize: 50, fontWeight: 900 }}>133 = A CAREER</div></StickerCard></>) },
  { from: S("a_one").start - 0.15, chapter: ["#1", "PROSPECT FILE"], Comp: ({ t, lf }) => {
      const n = Math.round(interpolate(t, [at("a_one", "three") - 0.1, at("a_one", "goals")], [0, 378], { ...clamp, easing: Easing.out(Easing.cubic) }));
      const age = t >= at("a_one", "age") - 0.15;
      return (<><BgOffice /><Sparkles n={10} color="#f59e0b" />
        <ProspectFile n={1} name="WAYNE GRETZKY" sub="Brantford · minor hockey">
          <div style={{ position: "absolute", left: 40, top: 20 }}><Counter v={n} label="GOALS · ONE SEASON" color="#d97706" /></div>
          {age && <div style={{ position: "absolute", left: 520, top: 40 - Math.sin(lf / 8) * 14, width: 230, height: 270, borderRadius: "50% 50% 46% 46%", background: "#f472b6", border: `8px solid ${P.ink}`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", fontWeight: 900, fontSize: 52, color: "#fff", WebkitTextStroke: `2px ${P.ink}` }}>AGE<span style={{ fontSize: 120 }}>10</span></div>}
        </ProspectFile>
        <Big who="agenty" t={t} size={520} x={600} y={1060} mood={age ? "starry" : "wow"} z={4} /></>);
    } },
  { from: S("b_skates").start - 0.15, Comp: ({ t, lf }) => (<><BgLab /><Big who="biscuit" t={t} size={1150} x={-35} y={380} mood="sad" />
      <svg width={1080} height={500} style={{ position: "absolute", left: 0, top: 1150, zIndex: 4 }}><path d={`M200 300 C ${300 + Math.sin(lf / 5) * 40} 100, 500 400, 600 200 S 900 ${150 + Math.cos(lf / 4) * 50}, 860 320`} stroke="#fff" strokeWidth={16} fill="none" /><path d={`M200 300 C ${300 + Math.sin(lf / 5) * 40} 100, 500 400, 600 200 S 900 ${150 + Math.cos(lf / 4) * 50}, 860 320`} stroke={P.ink} strokeWidth={4} fill="none" /></svg>
      <div style={{ position: "absolute", left: 640, top: 1150, fontFamily: HAND, fontWeight: 700, fontSize: 60, zIndex: 5 }}>knot #47</div></>) },
  { from: S("p_still").start - 0.15, Comp: ({ t, lf }) => (<><BgBurst c1="#fecaca" c2="#fca5a5" /><Big who="pucky" t={t} size={1300} x={-110} y={460} mood="laugh" rot={Math.sin(lf / 3) * 4} /></>) },
  { from: S("a_sign").start - 0.15, Comp: ({ t, lf }) => (<><BgCarpet />
      <Big who="agenty" t={t} size={900} x={-200} y={520} mood="smug" />
      <Big who="pucky" t={t} size={600} x={520} y={900} mood={t >= at("a_sign", "star") ? "starry" : "wow"} z={3} />
      {t >= at("a_sign", "sign") - 0.2 && <div style={{ position: "absolute", left: 380, top: 380, width: 520, height: 380, background: "#fffdf7", border: `8px solid ${P.ink}`, transform: `rotate(${4 + Math.sin(lf / 6) * 2}deg)`, zIndex: 5, padding: 30, boxSizing: "border-box", fontFamily: FONT }}>
        <div style={{ fontWeight: 900, fontSize: 48 }}>CONTRACT</div>
        {[0, 1, 2].map((i) => <div key={i} style={{ height: 10, background: "#cbd5e1", marginTop: 26, width: `${90 - i * 15}%` }} />)}
        <div style={{ marginTop: 50, fontFamily: HAND, fontSize: 52 }}>✗ ____________</div>
      </div>}</>) },
  { from: S("b_run").start - 0.12, Comp: ({ t, lf }) => (<><BgCarpet /><SpeedLines />
      <Big who="biscuit" t={t} size={760} x={-160} y={420} mood="scared" />
      <Big who="pucky" t={t} size={520} x={interpolate(lf, [6, 30], [460, 1300], clamp)} y={900} mood="scared" rot={-15} hop={0} z={4} />
      <Big who="agenty" t={t} size={560} x={560} y={300} mood="scared" open={0} />
      <Pow text="RUN!" x={140} y={1180} size={200} rot={-8} color={P.red} /></>) },
];

const Extras: React.FC<{ N: (s: number) => number }> = ({ N }) => (
  <>
    <Sequence from={N(S("a_hello").start - 0.15)} durationInFrames={60}><Audio src={staticFile("sfx/crowd.wav")} volume={0.35} /></Sequence>
    <Sequence from={N(at("a_hello", "welcome"))} durationInFrames={40}><Audio src={staticFile("brand/ding.wav")} volume={0.5} /></Sequence>
    <Sequence from={N(at("a_five", "refused"))} durationInFrames={40}><Audio src={staticFile("brand/impact.wav")} volume={0.6} /></Sequence>
    {["six", "two", "fifteen"].map((w) => <Sequence key={w} from={N(at("h_paid", w))} durationInFrames={20}><Audio src={staticFile("pop.wav")} volume={0.7} /></Sequence>)}
    <Sequence from={N(at("a_leverage", "leverage"))} durationInFrames={40}><Audio src={staticFile("brand/rimshot.wav")} volume={0.55} /></Sequence>
    <Sequence from={N(at("a_four", "fifteen"))} durationInFrames={40}><Audio src={staticFile("brand/impact.wav")} volume={0.5} /></Sequence>
    <Sequence from={N(at("a_three", "sweepstakes"))} durationInFrames={50}><Audio src={staticFile("brand/ding.wav")} volume={0.55} /></Sequence>
    <Sequence from={N(at("a_two", "goals"))} durationInFrames={50}><Audio src={staticFile("brand/riser.wav")} volume={0.35} /></Sequence>
    <Sequence from={N(at("a_one", "ten"))} durationInFrames={110}><Audio src={staticFile("sfx/horn.wav")} volume={0.4} /></Sequence>
    <Sequence from={N(at("p_still", "cant"))} durationInFrames={40}><Audio src={staticFile("brand/rimshot.wav")} volume={0.6} /></Sequence>
    <Sequence from={N(at("b_run", "run"))} durationInFrames={40}><Audio src={staticFile("whoosh.wav")} volume={0.7} /></Sequence>
  </>
);

export const { Comp: AgentyTop5, FRAMES: AGENTYTOP5_FRAMES } = makeToon({ words: WORDS, vo: "ep/agenty_top5.mp3", shots, tag: "ZAM · SPECIAL EDITION", tagline: "special edition!", Extras });
void random;
