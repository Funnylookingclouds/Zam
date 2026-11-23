/** ZAM Special Edition – "Biscuit's Worst Day" (cartoon). Facts: ~0.2 s for a 100 mph shot from 30 ft (computed),
 *  Jacques Plante full-time mask 1959, Sam LoPresti 80 saves in a 3–2 loss (Mar 4, 1941), Ken McAuley 15–0 (Jan 23, 1944). */
import React from "react";
import { Audio, Sequence, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import words from "../data/biscuit_day_words.json";
import { P, HAND, clamp, onTwos } from "../presenter/kit";
import { Scoreboard } from "../presenter/banana";
import { FONT } from "../theme";
import { Mascot } from "../mascots/Gang";
import { Confetti, type W } from "../zam/common";
import { timing } from "../zam/Episode";
import { BgBurst, BgLab, BgLocker, BgRink, Big, Flash, Pow, Rain, Sparkles, SpeedLines, StickerCard, makeToon, type ToonShot } from "../zam/toon";

const WORDS = words as W[];
const { S, at } = timing(WORDS);

const Item: React.FC<{ show: boolean; x: number; y: number; w: number; h: number; c: string; r?: number; label?: string }> = ({ show, x, y, w, h, c, r = 0, label }) => {
  const f = useCurrentFrame();
  if (!show) return null;
  return <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: c, border: `9px solid ${P.ink}`, borderRadius: 30, transform: `rotate(${r}deg)`, zIndex: 4, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 44, color: P.ink }}>{label}{f < 0 ? null : null}</div>;
};
const Thumb: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 260 }) => (
  <svg width={s} height={s} viewBox="0 0 100 100" style={{ position: "absolute", left: x, top: y, zIndex: 5 }}>
    <path d="M30 45 L45 15 Q52 8 56 16 L52 40 L80 40 Q90 42 86 52 L80 80 Q78 88 68 88 L30 88 Z" fill="#a16207" stroke={P.ink} strokeWidth={5} strokeLinejoin="round" />
    <rect x={12} y={42} width={20} height={48} rx={5} fill="#f8fafc" stroke={P.ink} strokeWidth={5} />
  </svg>
);

const shots: ToonShot[] = [
  // ---- intro
  { from: 0, Comp: ({ t }) => (<><BgBurst c1="#cbd5e1" c2="#e2e8f0" />
      <Big who="biscuit" t={t} size={900} x={240} y={560} mood="tired" />
      <Big who="zam" t={t} size={520} x={-60} y={1040} mood="wow" z={3} />
      <StickerCard x={110} y={250} rot={-3} w={860} h={280}><div style={{ fontSize: 34, fontWeight: 900, color: P.red, letterSpacing: 4 }}>ZAM SPECIAL EDITION</div><div style={{ fontSize: 86, fontWeight: 900, lineHeight: 1 }}>BISCUIT'S<br />WORST DAY</div></StickerCard></>) },
  // ---- 6:00 AM gear up
  { from: S("b_gear").start - 0.2, chapter: ["6:00 AM", "LOCKER ROOM"], Comp: ({ t }) => (<><BgLocker />
      <Big who="biscuit" t={t} size={1250} x={-85} y={430} mood="tired" />
      <Item show={t >= at("b_gear", "pads")} x={20} y={1050} w={280} h={420} c="#f8fafc" r={-6} label="PAD" />
      <Item show={t >= at("b_gear", "pads") + 0.1} x={780} y={1050} w={280} h={420} c="#f8fafc" r={6} label="PAD" />
      <Item show={t >= at("b_gear", "gloves")} x={-40} y={640} w={250} h={230} c="#fde68a" r={-12} label="GLOVE" />
      <Item show={t >= at("b_gear", "gloves") + 0.12} x={860} y={640} w={240} h={300} c="#f8fafc" r={10} label="BLOCK" />
      {t >= at("b_gear", "mask") && <Pow text="MASK ✓" x={300} y={300} size={110} rot={-6} />}</>) },
  { from: at("b_gear", "im") - 0.15, Comp: ({ t, lf }) => (<><BgLocker />
      <div style={{ position: "absolute", left: -40, top: 900, width: 1160, height: 560, background: "#8b5e3c", border: `10px solid ${P.ink}`, borderRadius: 80, zIndex: 1 }}>
        {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 40 + i * 360, top: 40, width: 330, height: 200, background: "#a8744f", border: `8px solid ${P.ink}`, borderRadius: 40 }} />)}
      </div>
      <Big who="biscuit" t={t} size={1100} x={-10} y={520} mood="tired" sx={1.35 + Math.sin(lf / 8) * 0.02} sy={0.82} />
      <StickerCard x={560} y={260} rot={5} w={420} h={150}><div style={{ fontSize: 54, fontWeight: 900 }}>🛋️ SOFA MODE</div></StickerCard></>) },
  // ---- 7:00 AM warm-ups
  { from: S("p_catch").start - 0.2, chapter: ["7:00 AM", "WARM-UPS"], Comp: ({ t, lf }) => (<><BgRink /><Big who="pucky" t={t} size={1300} x={-110} y={460} mood="smug" rot={Math.sin(lf / 8) * 4} />
      {t >= at("p_catch", "catch") && <Pow text="CATCH!" x={150} y={330} size={160} rot={-8} color={P.red} />}</>) },
  { from: S("b_ow").start - 0.12, Comp: ({ t, lf }) => {
      const hits = [0, 1, 2].map((k) => at("b_ow", "ow", k));
      const i = hits.filter((h) => t >= h - 0.12).length - 1;
      const k = i < 0 ? 0 : interpolate(t, [hits[i] - 0.12, hits[i]], [0, 1], clamp);
      const hit = i >= 0 && t >= hits[i] && t < hits[i] + 0.18;
      return (<><BgBurst c1="#fecaca" c2="#fca5a5" />
        <Big who="biscuit" t={t} size={1250} x={-85 + (hit ? Math.sin(lf * 3) * 24 : 0)} y={430} mood={i >= 2 && t > hits[2] ? "dizzy" : "scared"} hop={0} />
        {i >= 0 && <Big who="pucky" t={t} size={420} x={-400 + k * 720} y={540 + (i - 1) * 120} mood="laugh" rot={k * 400} sx={hit ? 0.6 : 1} sy={hit ? 1.2 : 1} z={4} hop={0} />}
        {hit && <Pow text={["OW.", "OW.", "OW!!"][i]} x={420} y={260} size={[130, 150, 200][i]} rot={[-8, 6, -4][i]} />}
        {i >= 0 && hit && <Flash at={0} />}</>);
    } },
  // ---- Helmy's lab: a fifth of a second
  { from: S("h_fifth").start - 0.15, Comp: ({ t }) => {
      const s = interpolate(t, [at("h_fifth", "reaches"), at("h_fifth", "fifth")], [0, 0.2], clamp);
      return (<><BgLab /><Big who="helmy" t={t} size={900} x={90} y={880} mood="wow" />
        <div style={{ position: "absolute", left: 300, top: 250, width: 480, height: 480, borderRadius: "50%", background: "#fff", border: `14px solid ${P.ink}`, zIndex: 3 }}>
          <div style={{ position: "absolute", left: 205, top: -60, width: 70, height: 60, background: P.ink, borderRadius: 10 }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DejaVu Sans Mono', monospace", fontWeight: 900, fontSize: 120, color: P.red }}>{s.toFixed(2)}s</div>
        </div>
        <StickerCard x={40} y={760} rot={-5} w={520} h={170}><div style={{ fontSize: 46, fontWeight: 900 }}>100 mph · 30 ft</div><div style={{ fontFamily: HAND, fontSize: 40, color: P.teal }}>≈ 160 km/h from 9 m</div></StickerCard></>);
    } },
  { from: S("b_blink").start - 0.15, Comp: ({ t, lf }) => {
      const closed = t > at("b_blink", "blink") && t < at("b_blink", "than");
      return (<><BgRink /><Big who="biscuit" t={t} size={1250} x={-85} y={430} mood={closed ? "sleep" : "wow"} />
        {closed && <SpeedLines />}
        {closed && <div style={{ position: "absolute", left: interpolate(lf, [10, 40], [-300, 1200], clamp), top: 420, zIndex: 5 }}><Mascot who="pucky" size={300} mood="laugh" seed="zoom" /></div>}
        <div style={{ position: "absolute", left: 120, top: 320, fontFamily: HAND, fontWeight: 700, fontSize: 90, color: P.ink, letterSpacing: 30, zIndex: 5 }}>{closed ? "b l i n k" : ""}</div></>);
    } },
  // ---- Clubby's flashback (sepia)
  { from: S("c_mask").start - 0.2, Comp: ({ t, lf }) => {
      const duck = Math.max(0, Math.sin(lf / 12)) * 80;
      return (<div style={{ position: "absolute", inset: 0, filter: "sepia(0.85) contrast(1.05)" }}>
        <BgRink />
        <Big who="clubby" t={t} size={1150} x={-40} y={420 + duck} mood="scared" />
        <div style={{ position: "absolute", left: interpolate((lf % 50), [0, 50], [1200, -300]), top: 520, width: 180, height: 70, borderRadius: "50%", background: "#111", border: `6px solid ${P.ink}`, zIndex: 5 }} />
        <div style={{ position: "absolute", left: 80, top: 260, fontFamily: HAND, fontWeight: 700, fontSize: 80, color: P.ink, transform: "rotate(-6deg)", zIndex: 5 }}>back in the day…</div>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse, transparent 55%, #2b2622aa 100%)`, opacity: 0.8 + (onTwos(lf) % 20 === 0 ? 0.15 : 0), zIndex: 6 }} />
        {t >= at("c_mask", "jacques") - 0.1 && <StickerCard x={470} y={1130} rot={4} w={580} h={240}><div style={{ fontSize: 48, fontWeight: 900 }}>JACQUES PLANTE · 1959</div><div style={{ fontFamily: HAND, fontSize: 42, color: P.red }}>first goalie to wear a mask full-time</div></StickerCard>}
      </div>);
    } },
  // ---- 7:00 PM game
  { from: S("z_game").start - 0.2, chapter: ["7:00 PM", "GAME TIME"], Comp: ({ t, lf }) => {
      const saves = [at("z_game", "save", 0), at("z_game", "save", 1)];
      const lose = at("z_game", "loses");
      const n = Math.floor(interpolate(t, [S("z_game").start, lose], [0, 38], clamp));
      return (<><BgRink crowd />
        <Big who="biscuit" t={t} size={1250} x={-85} y={480} mood={t >= lose ? "sad" : "determined"} hop={saves.some((s) => t >= s && t < s + 0.2) ? 70 : 0} rot={saves.some((s) => t >= s && t < s + 0.2) ? -8 : 0} />
        {saves.map((s, i) => t >= s && t < s + 0.5 && <Pow key={i} text="SAVE!" x={[140, 520][i]} y={[340, 300][i]} size={140} rot={[-10, 8][i]} color={P.teal} />)}
        <StickerCard x={580} y={1090} rot={4} w={420} h={140}><div style={{ fontSize: 52, fontWeight: 900 }}>SAVES: {n}</div></StickerCard>
        {t >= lose && <div style={{ position: "absolute", left: 470, top: 250, width: 140, height: 100, borderRadius: 16, background: "#ff3b30", boxShadow: `0 0 80px 40px #ff3b30${Math.floor(lf / 6) % 2 ? "88" : "33"}`, border: `6px solid ${P.ink}`, zIndex: 5 }} />}
        {t >= lose && <div style={{ position: "absolute", left: 120, top: 400, zIndex: 6 }}><Scoreboard left="BISCUIT" right="OTHERS" a={2} b={3} label="FINAL" /></div>}</>);
    } },
  { from: S("h_lopresti").start - 0.15, Comp: ({ t }) => {
      const n = Math.round(interpolate(t, [at("h_lopresti", "80") - 0.6, at("h_lopresti", "80")], [0, 80], clamp));
      return (<><BgLab /><Big who="helmy" t={t} size={760} x={360} y={950} mood="wow" />
        <StickerCard x={70} y={260} rot={-3} w={940} h={520}>
          <div style={{ fontSize: 66, fontWeight: 900 }}>SAM LoPRESTI</div>
          <div style={{ fontFamily: HAND, fontSize: 48, color: P.red }}>Black Hawks · Mar 4, 1941</div>
          <div style={{ fontSize: 170, fontWeight: 900, lineHeight: 1, marginTop: 8 }}>{n}<span style={{ fontSize: 60 }}> SAVES</span></div>
          <div style={{ fontSize: 52, fontWeight: 900, color: P.red, opacity: t >= at("h_lopresti", "lost") ? 1 : 0 }}>…still lost 3–2 😩</div>
        </StickerCard></>);
    } },
  { from: S("b_worst").start - 0.15, Comp: ({ t }) => {
      const k = ["worst", "day", "ever"].filter((w) => t >= at("b_worst", w)).length;
      return (<><BgBurst c1="#64748b" c2="#94a3b8" /><Rain />
        <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + k * 0.12})`, transformOrigin: "50% 45%" }}><Big who="biscuit" t={t} size={1250} x={-85} y={430} mood="sad" /></div>
        {k > 0 && <Pow text={["WORST.", "WORST. DAY.", "WORST. DAY. EVER."][k - 1]} x={60} y={250} size={k === 3 ? 100 : 120} rot={-4} color="#334155" />}</>);
    } },
  { from: S("h_mcauley").start - 0.15, Comp: ({ t }) => (<><BgLab /><Big who="helmy" t={t} size={760} x={-120} y={960} mood="smug" />
      <div style={{ position: "absolute", left: 60, top: 300, transform: "scale(1.45)", transformOrigin: "left top", zIndex: 4, opacity: t >= at("h_mcauley", "ken") - 0.2 ? 1 : 0 }}>
        <Scoreboard left="DETROIT" right="RANGERS" a={15} b={0} label="JAN 23, 1944" prevA={0} prevB={0} flipAt={30} />
      </div>
      {t >= at("h_mcauley", "ken") && <StickerCard x={430} y={560} rot={4} w={590} h={250}><div style={{ fontSize: 50, fontWeight: 900 }}>KEN McAULEY</div><div style={{ fontFamily: HAND, fontSize: 42, color: P.red }}>Rangers goalie · biggest loss in NHL history</div></StickerCard>}</>) },
  { from: S("b_great").start - 0.15, Comp: ({ t, lf }) => {
      const happy = t >= at("b_great", "feel") - 0.2;
      return (<>{happy ? <BgBurst c1="#fde047" c2="#fef08a" /> : <BgRink />}{happy && <Sparkles n={10} color="#f59e0b" />}
        <Big who="biscuit" t={t} size={1300} x={-110} y={430} mood={happy ? "starry" : "scared"} rot={happy ? Math.sin(lf / 6) * 5 : 0} />
        {!happy && <Pow text="15?!" x={330} y={260} size={200} rot={-8} color={P.red} />}
        {happy && [0, 1].map((i) => <div key={i} style={{ position: "absolute", left: interpolate(lf, [0, 90], [-120 + i * 200, 1100 + i * 100]), top: 300 + i * 90 + Math.sin(lf / 4 + i) * 20, fontSize: 90, zIndex: 5 }}>🐦</div>)}</>);
    } },
  { from: S("p_fourteen").start - 0.15, Comp: ({ t, lf }) => (<><BgRink /><Big who="pucky" t={t} size={1300} x={-110} y={460} mood="smug" rot={Math.sin(lf / 10) * 3} />
      {t >= at("p_fourteen", "14") && <StickerCard x={560} y={260} rot={6} w={420} h={170}><div style={{ fontSize: 50, fontWeight: 900 }}>TOMORROW:</div><div style={{ fontSize: 60, fontWeight: 900, color: P.red }}>14 HITS</div></StickerCard>}</>) },
  { from: S("b_progress").start - 0.15, Comp: ({ t, lf }) => (<><BgBurst c1="#bbf7d0" c2="#dcfce7" />
      <Big who="biscuit" t={t} size={1050} x={-180} y={560} mood={t >= at("b_progress", "progress") ? "bliss" : "tired"} />
      <Big who="pucky" t={t} size={560} x={600} y={1000} mood="laugh" z={3} />
      <Thumb x={620} y={interpolate(lf, [0, 12], [1100, 500], { ...clamp, easing: Easing.out(Easing.back(2)) })} s={300} /></>) },
];

const Extras: React.FC<{ N: (s: number) => number }> = ({ N }) => (
  <>
    {["pads", "gloves", "mask"].map((w) => <Sequence key={w} from={N(at("b_gear", w))} durationInFrames={20}><Audio src={staticFile("pop.wav")} volume={0.7} /></Sequence>)}
    <Sequence from={N(at("b_gear", "sofa"))} durationInFrames={40}><Audio src={staticFile("brand/boing.wav")} volume={0.5} /></Sequence>
    {[0, 1, 2].map((k) => <Sequence key={k} from={N(at("b_ow", "ow", k))} durationInFrames={30}><Audio src={staticFile("brand/impact.wav")} volume={0.5 + k * 0.1} /></Sequence>)}
    <Sequence from={N(at("h_fifth", "fifth"))} durationInFrames={50}><Audio src={staticFile("brand/ding.wav")} volume={0.5} /></Sequence>
    <Sequence from={N(at("b_blink", "blink"))} durationInFrames={30}><Audio src={staticFile("whoosh.wav")} volume={0.5} /></Sequence>
    {[0, 1].map((k) => <Sequence key={k} from={N(at("z_game", "save", k))} durationInFrames={30}><Audio src={staticFile("pop.wav")} volume={0.7} /></Sequence>)}
    <Sequence from={N(S("z_game").start - 0.2)} durationInFrames={120}><Audio src={staticFile("sfx/crowd.wav")} volume={0.35} /></Sequence>
    <Sequence from={N(at("z_game", "loses"))} durationInFrames={110}><Audio src={staticFile("sfx/horn.wav")} volume={0.45} /></Sequence>
    <Sequence from={N(at("h_mcauley", "15"))} durationInFrames={50}><Audio src={staticFile("brand/impact.wav")} volume={0.6} /></Sequence>
    <Sequence from={N(at("b_great", "feel"))} durationInFrames={60}><Audio src={staticFile("brand/riser.wav")} volume={0.35} /></Sequence>
    <Sequence from={N(at("p_fourteen", "14"))} durationInFrames={40}><Audio src={staticFile("brand/rimshot.wav")} volume={0.6} /></Sequence>
    <Sequence from={N(at("b_progress", "progress"))} durationInFrames={100}><Confetti n={50} x={540} y={500} /></Sequence>
  </>
);

export const { Comp: BiscuitDay, FRAMES: BISCUITDAY_FRAMES } = makeToon({ words: WORDS, vo: "ep/biscuit_day.mp3", shots, tag: "ZAM · SPECIAL EDITION", tagline: "special edition!", Extras });
