/** ZAM Special Edition – "Zam's Night Shift" (cartoon). Facts: NHL ice ≈ 1 inch thick (sources 7/8–1.5 in); ice is painted white,
 *  lines painted between layers; a new rink takes almost two days in thin layers; flood water traditionally ~60–71 °C, hot water
 *  melts in/freezes smoother; first ice resurfacer built 1949 in Paramount, California. (Never say the trademark name.) */
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, random, staticFile, useCurrentFrame, Easing } from "remotion";
import words from "../data/zam_night_words.json";
import { P, HAND, clamp, onTwos } from "../presenter/kit";
import { Mascot } from "../mascots/Gang";
import { Confetti, type W } from "../zam/common";
import { timing } from "../zam/Episode";
import { BgBurst, BgLab, BgRink, Big, Grain, Pow, Sparkles, StickerCard, makeToon, type ToonShot } from "../zam/toon";

const WORDS = words as W[];
const { S, at } = timing(WORDS);

const BgArenaNight: React.FC<{ lightsOff?: number }> = ({ lightsOff = 1 }) => {
  const f = onTwos(useCurrentFrame());
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#0b1026 0%,#141c3d 42%,#1e2b52 43%,#2c3e6e 100%)" }}>
      {[...Array(80)].map((_, i) => <div key={i} style={{ position: "absolute", left: (i % 16) * 68 + ((i / 16) | 0) * 10 - 10, top: 170 + ((i / 16) | 0) * 105, width: 54, height: 40, borderRadius: "10px 10px 4px 4px", background: "#26335e", border: "3px solid #0b1026" }} />)}
      {[...Array(6)].map((_, i) => { const on = i >= Math.floor(lightsOff * 6) ? 1 : 0; return <div key={`l${i}`} style={{ position: "absolute", left: 60 + i * 180, top: 40, width: 40, height: 40, borderRadius: 20, background: on ? "#fffbe6" : "#334155", boxShadow: on ? "0 0 60px 30px #fffbe655" : "none" }} />; })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 790, height: 50, background: "#cbd5e1", borderTop: `6px solid ${P.ink}`, borderBottom: "12px solid #a16207" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 850, bottom: 0, background: "linear-gradient(180deg,#c7dff0,#9fbfd8)" }} />
      {[...Array(10)].map((_, i) => <div key={`s${i}`} style={{ position: "absolute", left: random(`st${i}`) * 1080, top: random(`sy${i}`) * 140, width: 4, height: 4, borderRadius: 2, background: "#fff", opacity: (f / 10 + i) % 3 < 1.5 ? 0.9 : 0.3 }} />)}
      <Grain />
    </AbsoluteFill>
  );
};
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
/** Cross-section of the rink: concrete → white paint → lines → clear ice. `show` reveals layers 0..4. */
const Layers: React.FC<{ show: number; x?: number; y?: number; w?: number; scaleH?: number }> = ({ show, x = 60, y = 520, w = 960, scaleH = 1 }) => {
  const L: [string, string, number][] = [["CONCRETE + COOLING PIPES", "#94a3b8", 150], ["WHITE PAINT", "#ffffff", 70], ["LINES & LOGOS", "#d94b3b", 50], ["CLEAR ICE ≈ 1 inch", "#bfe3ffcc", 170]];
  let top = y + 440 * scaleH;
  return (
    <>
      {L.map(([lab, c, h], i) => {
        top -= h * scaleH;
        const on = i < show;
        return (
          <div key={lab} style={{ position: "absolute", left: x, top, width: w, height: h * scaleH, background: c, border: `6px solid ${P.ink}`, opacity: on ? 1 : 0.12, zIndex: 3, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 24, boxSizing: "border-box", fontWeight: 900, fontSize: 38, color: i === 2 ? "#fff" : P.ink }}>
            {i === 0 && on && [...Array(6)].map((_, k) => <div key={k} style={{ position: "absolute", left: 40 + k * 120, top: 50 * scaleH, width: 60, height: 60, borderRadius: 30, border: `6px solid ${P.ink}`, background: "#64748b" }} />)}
            {i === 2 && on && <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, background: "repeating-linear-gradient(90deg,#d94b3b 0 120px,#3b82f6 120px 160px,#fff 160px 300px)" }} />}
            <span style={{ position: "relative", background: on ? "#fffdf7cc" : "transparent", padding: "0 10px", borderRadius: 6 }}>{on ? lab : ""}</span>
          </div>
        );
      })}
    </>
  );
};
const Steam: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const f = onTwos(useCurrentFrame());
  return <>{[...Array(7)].map((_, i) => { const k = ((f / 70 + i / 7) % 1); return <div key={i} style={{ position: "absolute", left: x + i * 110 + Math.sin(k * 6 + i) * 30, top: y - k * 360, width: 120, height: 120, borderRadius: 60, background: "#ffffff", opacity: 0.55 * (1 - k), zIndex: 4 }} />; })}</>;
};

const shots: ToonShot[] = [
  { from: 0, chapter: ["11:30 PM", "EMPTY ARENA"], Comp: ({ t, lf }) => {
      const off = interpolate(lf, [0, 50], [0, 1], clamp);
      const zx = interpolate(lf, [10, 60], [-900, 60], { ...clamp, easing: Easing.out(Easing.back(1.2)) });
      return (<><BgArenaNight lightsOff={off} />
        <div style={{ position: "absolute", left: zx + 700, top: 1000, width: 900, height: 420, background: "linear-gradient(90deg,#fff7c2aa,transparent)", clipPath: "polygon(0 40%, 100% 0, 100% 100%, 0 60%)", zIndex: 1 }} />
        <Big who="zam" t={t} size={1000} x={zx} y={760} mood="laugh" />
        <StickerCard x={110} y={250} rot={-3} w={860} h={250}><div style={{ fontSize: 34, fontWeight: 900, color: P.red, letterSpacing: 4 }}>ZAM SPECIAL EDITION</div><div style={{ fontSize: 86, fontWeight: 900, lineHeight: 1 }}>ZAM'S NIGHT<br />SHIFT</div></StickerCard></>);
    } },
  { from: S("h_inch").start - 0.15, Comp: ({ t }) => (<><BgLab /><Big who="helmy" t={t} size={800} x={-80} y={950} mood="wow" />
      <div style={{ position: "absolute", left: 120, top: 480, width: 840, height: 170, background: "#bfe3ff", border: `8px solid ${P.ink}`, borderRadius: 10, zIndex: 3 }} />
      <div style={{ position: "absolute", left: 980, top: 480, width: 30, height: 170, borderLeft: `8px solid ${P.red}`, borderTop: `8px solid ${P.red}`, borderBottom: `8px solid ${P.red}`, zIndex: 3 }} />
      {t >= at("h_inch", "inch") - 0.1 && <StickerCard x={330} y={720} rot={4} w={600} h={180}><div style={{ fontSize: 60, fontWeight: 900 }}>≈ 1 INCH</div><div style={{ fontFamily: HAND, fontSize: 42, color: P.teal }}>about 2.5 cm of ice</div></StickerCard>}</>) },
  { from: S("p_inch").start - 0.15, Comp: ({ t, lf }) => (<><BgBurst c1="#bae6fd" c2="#7dd3fc" />
      <div style={{ position: "absolute", left: 40, top: 1000, width: 460, height: 260, background: "#bfe3ff", border: `9px solid ${P.ink}`, borderRadius: 10, zIndex: 2 }}><div style={{ position: "absolute", left: 20, top: 90, fontWeight: 900, fontSize: 50 }}>ICE: 1"</div></div>
      <Big who="pucky" t={t} size={760} x={380} y={640} mood="smug" rot={Math.sin(lf / 8) * 3} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1000, borderTop: `8px dashed ${P.red}`, zIndex: 4 }} />
      {t >= at("p_inch", "me") - 0.1 && <Pow text="SAME!" x={140} y={330} size={170} rot={-8} color={P.red} />}</>) },
  { from: S("z_paint").start - 0.15, Comp: ({ t }) => {
      const show = t < at("z_paint", "white", 0) ? 0 : t < at("z_paint", "painted") ? 1 : t < at("z_paint", "lines") ? 2 : t < at("z_paint", "ice") ? 3 : 4;
      return (<><BgRink /><Layers show={show} />
        <Big who="zam" t={t} size={560} x={520} y={1020} mood="wow" z={4} flip />
        <div style={{ position: "absolute", left: 60, top: 290, fontFamily: HAND, fontWeight: 700, fontSize: 70, color: "#fff", WebkitTextStroke: `2px ${P.ink}`, zIndex: 4 }}>what's under the ice?</div></>);
    } },
  { from: S("b_paint").start - 0.15, Comp: ({ t, lf }) => (<><BgRink /><Big who="biscuit" t={t} size={1250} x={-85} y={380} mood="scared" rot={Math.sin(lf * 0.7) * 2} />
      <div style={{ position: "absolute", left: 300, top: 1250, width: 480, height: 90, background: "#fff", border: `8px solid ${P.ink}`, borderRadius: 14, zIndex: 3, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 48 }}>WET PAINT?!</div>
      {t >= at("b_paint", "paint") && <Pow text="PAINT?!" x={330} y={260} size={160} rot={-6} color={P.mustard} />}</>) },
  { from: S("c_pond").start - 0.2, Comp: ({ t, lf }) => {
      const duck = at("c_pond", "duck");
      return (<OldFilm year="1900s">
        <AbsoluteFill style={{ background: "linear-gradient(180deg,#e2e8f0 0%,#cbd5e1 45%,#94a3b8 46%,#64748b 100%)" }} />
        {[...Array(6)].map((_, i) => <div key={i} style={{ position: "absolute", left: 30 + i * 180, top: 620 - (i % 2) * 60, width: 0, height: 0, borderLeft: "70px solid transparent", borderRight: "70px solid transparent", borderBottom: "260px solid #3f6212" }} />)}
        <div style={{ position: "absolute", left: 40, top: 960, width: 1000, height: 480, borderRadius: "50%", background: "#bfe3ff", border: `8px solid ${P.ink}` }} />
        <Big who="clubby" t={t} size={900} x={-60} y={600} mood="laugh" rot={Math.sin(lf / 10) * 6} />
        {t >= duck - 0.3 && <div style={{ position: "absolute", left: interpolate(t, [duck - 0.3, duck + 1.2], [1100, 380], clamp), top: 1180, fontSize: 150, zIndex: 5, transform: "scaleX(-1)" }}>🦆</div>}
        {t >= duck && <Pow text="QUACK!" x={560} y={1000} size={100} rot={6} />}
      </OldFilm>);
    } },
  { from: S("z_build").start - 0.2, chapter: ["12:00 AM", "BUILDING ICE"], Comp: ({ t, lf }) => {
      const k = interpolate(t, [S("z_build").start, at("z_build", "layer", 1) + 0.3], [0, 4], clamp);
      return (<><BgArenaNight lightsOff={1} /><Layers show={Math.floor(k) + (k > 0.05 ? 1 : 0)} y={420} />
        <div style={{ position: "absolute", left: 720, top: 1080, width: 260, height: 260, borderRadius: "50%", background: "#fff", border: `10px solid ${P.ink}`, zIndex: 5 }}>
          <div style={{ position: "absolute", left: 125, top: 30, width: 10, height: 100, background: P.ink, transformOrigin: "50% 100%", transform: `rotate(${lf * 24}deg)` }} />
          <div style={{ position: "absolute", left: 125, top: 70, width: 10, height: 60, background: P.red, transformOrigin: "50% 100%", transform: `rotate(${lf * 2}deg)` }} />
        </div>
        <Big who="zam" t={t} size={600} x={40} y={1040} mood="determined" z={4} />
        {t >= at("z_build", "two") - 0.1 && <StickerCard x={130} y={250} rot={-3} w={820} h={170}><div style={{ fontSize: 54, fontWeight: 900 }}>ALMOST 2 DAYS</div><div style={{ fontFamily: HAND, fontSize: 40, color: P.teal }}>many thin layers, sprayed one by one</div></StickerCard>}</>);
    } },
  { from: S("z_flood").start - 0.1, Comp: ({ t, lf }) => (<><BgRink /><Sparkles n={8} />
      <Big who="zam" t={t} size={1250} x={-85} y={430} mood="bliss" rot={Math.sin(lf / 9) * 3} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1260, height: 140, background: "linear-gradient(180deg,#e0f2fe,#ffffff)", opacity: 0.85, zIndex: 3 }} />
      <Steam x={40} y={1250} />
      {t >= at("z_flood", "60") - 0.15 && <StickerCard x={520} y={260} rot={5} w={470} h={190}><div style={{ fontSize: 62, fontWeight: 900, color: P.red }}>≈ 60 °C</div><div style={{ fontFamily: HAND, fontSize: 40, color: P.ink }}>(140 °F) hot water flood</div></StickerCard>}</>) },
  { from: S("h_science").start - 0.15, Comp: ({ t, lf }) => (<><BgLab /><Big who="helmy" t={t} size={760} x={360} y={980} mood="wow" />
      {[{ x: 90, lab: "COLD", n: 14, c: "#93c5fd" }, { x: 520, lab: "HOT", n: 3, c: "#fca5a5" }].map((b) => (
        <div key={b.lab} style={{ position: "absolute", left: b.x, top: 300, width: 330, height: 460, border: `10px solid ${P.ink}`, borderTop: "none", borderRadius: "0 0 40px 40px", background: b.c, zIndex: 3, overflow: "hidden" }}>
          {[...Array(b.n)].map((_, i) => <div key={i} style={{ position: "absolute", left: 20 + random(`b${b.lab}${i}`) * 260, top: 440 - ((lf * 3 + random(`bt${b.lab}${i}`) * 440) % 440), width: 30, height: 30, borderRadius: 15, border: `5px solid ${P.ink}`, background: "#fff8" }} />)}
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 20, textAlign: "center", fontWeight: 900, fontSize: 50 }}>{b.lab}</div>
        </div>))}
      <div style={{ position: "absolute", left: 90, top: 790, fontFamily: HAND, fontWeight: 700, fontSize: 48, color: P.ink, zIndex: 4 }}>fewer air bubbles → smoother ice</div>
      {/* science burst sits below the beakers, clear of the chapter clock */}
      {t >= at("h_science", "science") - 0.05 && <Pow text="SCIENCE!" x={70} y={850} size={130} rot={-6} color={P.teal} z={7} />}</>) },
  { from: S("z_1949").start - 0.2, chapter: ["1949", "CALIFORNIA"], Comp: ({ t, lf }) => (
      <OldFilm year="1949"><BgRink warm />
        <div style={{ position: "absolute", left: 90, top: 380, width: 900, height: 760, background: "#f8f3e6", border: `10px solid ${P.ink}`, transform: "rotate(-3deg)", boxShadow: "0 20px 0 #0004" }}>
          <div style={{ position: "absolute", left: 40, top: 40, right: 40, height: 560, background: "#cbd5e1", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 120, top: 120 }}><Mascot who="zam" size={600} mood="laugh" noSticker seed="old" /></div>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 615, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 70 }}>the very first one!</div>
        </div>
        {t >= at("z_1949", "1949") - 0.1 && <StickerCard x={470} y={1160} rot={4} w={560} h={230}><div style={{ fontSize: 46, fontWeight: 900 }}>FIRST ICE RESURFACER</div><div style={{ fontFamily: HAND, fontSize: 42, color: P.red }}>1949 · Paramount, California</div></StickerCard>}
        {lf < 0 ? <Big who="zam" t={t} size={10} x={0} y={0} mood="talk" /> : null}
      </OldFilm>) },
  { from: S("b_classic").start - 0.15, chapter: ["5:30 AM", "ALL CLEAN"], Comp: ({ t, lf }) => (<><BgBurst c1="#fde68a" c2="#fef3c7" /><Sparkles n={10} color="#f59e0b" />
      <Big who="zam" t={t} size={900} x={260} y={640} mood="bliss" rot={Math.sin(lf / 8) * 3} />
      <Big who="biscuit" t={t} size={720} x={-200} y={420} mood="talk" z={3} />
      {t >= at("b_classic", "classic") && <Pow text="CLASSIC ✦" x={420} y={300} size={120} rot={6} color="#b45309" />}</>) },
  { from: S("p_wheee").start - 0.2, Comp: ({ t, lf }) => {
      const x = interpolate(lf, [0, 60], [-500, 1200], clamp);
      return (<><BgRink /><Sparkles n={12} />
        <svg width={1080} height={1920} style={{ position: "absolute", zIndex: 2 }}>{[0, 1, 2].map((i) => <path key={i} d={`M-100 ${1150 + i * 60} Q${x / 2} ${1100 + i * 80} ${x + 300} ${1180 + i * 40}`} stroke="#94a3b8" strokeWidth={10} fill="none" strokeLinecap="round" />)}</svg>
        <Big who="pucky" t={t} size={700} x={x} y={720} mood="laugh" rot={lf * 12} hop={0} />
        <Pow text="WHEEEE!" x={120} y={300} size={170} rot={-8} color={P.red} /></>);
    } },
  { from: S("z_end").start - 0.12, Comp: ({ t }) => (<><BgRink />
      <svg width={1080} height={1920} style={{ position: "absolute", zIndex: 1 }}>{[0, 1, 2, 3].map((i) => <path key={i} d={`M-50 ${1250 + i * 50} Q540 ${1180 + i * 70} 1130 ${1240 + i * 40}`} stroke="#94a3b8" strokeWidth={10} fill="none" />)}</svg>
      <Big who="zam" t={t} size={1250} x={-85} y={430} mood="tired" />
      {t >= at("z_end", "cleaned") - 0.1 && <StickerCard x={540} y={270} rot={6} w={440} h={150}><div style={{ fontSize: 54, fontWeight: 900 }}>SHIFT: +1 hr</div></StickerCard>}</>) },
];

const Extras: React.FC<{ N: (s: number) => number }> = ({ N }) => (
  <>
    {[0, 1, 2, 3, 4, 5].map((i) => <Sequence key={i} from={N(i * 0.14)} durationInFrames={10}><Audio src={staticFile("pop.wav")} volume={0.3} /></Sequence>)}
    <Sequence from={N(at("p_inch", "me"))} durationInFrames={40}><Audio src={staticFile("brand/ding.wav")} volume={0.5} /></Sequence>
    {["painted", "lines", "ice"].map((w) => <Sequence key={w} from={N(at("z_paint", w))} durationInFrames={20}><Audio src={staticFile("pop.wav")} volume={0.6} /></Sequence>)}
    <Sequence from={N(at("b_paint", "paint"))} durationInFrames={40}><Audio src={staticFile("brand/boing.wav")} volume={0.5} /></Sequence>
    <Sequence from={N(at("c_pond", "duck"))} durationInFrames={40}><Audio src={staticFile("brand/rimshot.wav")} volume={0.5} /></Sequence>
    <Sequence from={N(S("z_flood").start - 0.1)} durationInFrames={50}><Audio src={staticFile("sfx/scrape.wav")} volume={0.6} /></Sequence>
    <Sequence from={N(at("h_science", "science"))} durationInFrames={50}><Audio src={staticFile("brand/ding.wav")} volume={0.55} /></Sequence>
    <Sequence from={N(at("b_classic", "classic"))} durationInFrames={60}><Audio src={staticFile("brand/riser.wav")} volume={0.3} /></Sequence>
    <Sequence from={N(at("p_wheee", "wheeee"))} durationInFrames={40}><Audio src={staticFile("whoosh.wav")} volume={0.6} /></Sequence>
    <Sequence from={N(at("z_end", "cleaned"))} durationInFrames={40}><Audio src={staticFile("brand/rimshot.wav")} volume={0.6} /></Sequence>
    <Sequence from={N(at("b_classic", "classic"))} durationInFrames={90}><Confetti n={40} x={540} y={500} /></Sequence>
  </>
);

export const { Comp: ZamNight, FRAMES: ZAMNIGHT_FRAMES } = makeToon({ words: WORDS, vo: "ep/zam_night.mp3", shots, tag: "ZAM · SPECIAL EDITION", tagline: "special edition!", Extras });
