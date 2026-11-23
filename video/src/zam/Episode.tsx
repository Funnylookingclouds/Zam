/** Reusable ZAM episode shell: intro (2 s) → boards per scene + speaking mascot + captions + Zam wipes → outro (3.2 s). */
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import { P, HAND, clamp, onTwos, Slap } from "../presenter/kit";
import { FONT } from "../theme";
import { Mascot, mouthOpen, type Mood, type Who } from "../mascots/Gang";
import { Caption, Confetti, Ice, IceWipe, Lineup, Logo, buildSegs, type Seg, type W } from "./common";

export const FPS = 60;
export const INTRO = 2.0;
export const OUTRO = 3.2;
const F = (s: number) => Math.round(s * FPS);

export const timing = (words: W[]) => {
  const WHO = (id: string): Who => ({ z: "zam", p: "pucky", b: "biscuit", h: "helmy", c: "clubby", a: "agenty" } as Record<string, Who>)[id[0]];
  const SEGS = buildSegs(words, WHO);
  const S = (id: string) => SEGS.find((s) => s.id === id)!;
  const at = (seg: string, prefix: string, nth = 0) => {
    const m = S(seg).words.filter((w) => w.display.toLowerCase().replace(/[^a-z0-9]/g, "").startsWith(prefix));
    if (!m[nth]) throw new Error(`word "${prefix}" #${nth} not in ${seg}`);
    return m[nth].start;
  };
  const LAST = words[words.length - 1].end;
  return { SEGS, S, at, LAST };
};

/** Board gets the scene's news-time start; inside, news time = from + frame/FPS. */
export type SceneDef = { id: string; from: number; Board: React.FC<{ from: number }>; slap?: "left" | "right"; wipe?: boolean };

const Speaker: React.FC<{ t: number; segs: Seg[]; mood: Record<string, Mood>; shades?: (id: string, t: number) => boolean; hidden?: (t: number) => boolean }> = ({ t, segs, mood, shades, hidden }) => {
  const f = useCurrentFrame();
  const i = segs.findIndex((s, k) => t >= s.start - 0.2 && t < (segs[k + 1]?.start ?? 999) - 0.2);
  if (i < 0 || (hidden && hidden(t))) return null;
  const s = segs[i];
  const prevSame = i > 0 && segs[i - 1].who === s.who;
  const local = onTwos(f - F(INTRO + s.start - 0.2));
  const pop = prevSame ? 1 : interpolate(local, [0, 12], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.8)) });
  const w = s.words.find((x) => t >= x.start && t <= x.end);
  const hop = w ? Math.max(0, 1 - (t - w.start) * 6) * (w.keyword ? 44 : 16) : 0;
  return (
    <div style={{ position: "absolute", left: 255, top: 1090 + (1 - pop) * 800, transform: `rotate(${(1 - pop) * -16 + Math.sin(f / 30) * 1.5}deg)` }}>
      <Mascot who={s.who} size={450} open={mouthOpen(s.words, t)} talking={!!w} mood={mood[s.id] ?? "talk"} hop={hop} seed={s.id} flip={i % 2 === 1 && s.who !== "zam"} shades={shades ? shades(s.id, t) : false} />
    </div>
  );
};

export const Intro: React.FC<{ tagline: string }> = ({ tagline }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Ice />
      <div style={{ position: "absolute", top: 520, left: 0, right: 0 }}><Logo delay={18} /></div>
      <div style={{ position: "absolute", top: 830, left: 0, right: 0, textAlign: "center", fontFamily: HAND, fontSize: 76, color: P.ink, opacity: interpolate(f, [40, 52], [0, 1], clamp) }}>{tagline}</div>
      <div style={{ position: "absolute", left: 560, top: 980 + interpolate(onTwos(f), [50, 64], [900, 0], { ...clamp, easing: Easing.out(Easing.back(1.6)) }) }}><Mascot who="pucky" size={340} mood="smug" seed="intro" /></div>
      <Sequence from={0} durationInFrames={40}><IceWipe dur={40} y={980} /></Sequence>
      <Audio src={staticFile("sfx/scrape.wav")} volume={0.8} />
      <Sequence from={14}><Audio src={staticFile("brand/riser.wav")} volume={0.35} /></Sequence>
      <Sequence from={26}><Audio src={staticFile("brand/impact.wav")} volume={0.55} /></Sequence>
      <Sequence from={56}><Audio src={staticFile("pop.wav")} volume={0.8} /></Sequence>
    </AbsoluteFill>
  );
};

export const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const pulse = 1 + Math.sin(f / 6) * 0.04;
  return (
    <AbsoluteFill style={{ opacity: interpolate(f, [0, 12], [0, 1], clamp) }}>
      <Ice />
      <div style={{ position: "absolute", top: 150, left: 0, right: 0 }}><Logo scale={0.8} /></div>
      <Lineup top={500} mood="laugh" talkWho="zam" open={f > 6 && f < 126 ? 0.3 + 0.6 * Math.abs(Math.sin(f / 4)) : 0} />
      <div style={{ position: "absolute", top: 1290, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 60, color: P.ink }}>FOLLOW FOR MORE</div>
        <div style={{ transform: `scale(${pulse}) rotate(-2deg)`, padding: "16px 46px", background: "#d94b3b", color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 52, borderRadius: 18, border: `6px solid ${P.ink}`, boxShadow: "0 8px 0 #0004" }}>🔔 SUBSCRIBE</div>
      </div>
      <Sequence from={6}><Audio src={staticFile("brand/outro_vo.mp3")} /></Sequence>
      <Audio src={staticFile("sfx/crowd.wav")} volume={0.35} />
      <Confetti n={50} y={420} />
    </AbsoluteFill>
  );
};

export const makeEpisode = (cfg: {
  words: W[]; vo: string; mood: Record<string, Mood>; scenes: SceneDef[]; tagline?: string;
  Extras?: React.FC<{ N: (s: number) => number }>; shades?: (id: string, t: number) => boolean; hideSpeaker?: (t: number) => boolean;
}) => {
  const { SEGS, LAST } = timing(cfg.words);
  const OUT_AT = INTRO + LAST + 0.35;
  const FRAMES = Math.ceil((OUT_AT + OUTRO) * FPS);
  const N = (s: number) => F(INTRO + s);
  const scenes = cfg.scenes.map((sc, i) => ({ ...sc, to: cfg.scenes[i + 1]?.from ?? LAST + 0.35 }));
  const Comp: React.FC = () => {
    const f = useCurrentFrame();
    const t = f / FPS - INTRO;
    return (
      <AbsoluteFill style={{ fontFamily: FONT, background: "#dbeef8" }}>
        <Audio src={staticFile("music.wav")} volume={(fr) => (fr < F(OUT_AT) ? 0.5 : interpolate(fr, [F(OUT_AT), F(OUT_AT + OUTRO)], [0.5, 0.15], clamp))} />
        <Sequence from={0} durationInFrames={F(INTRO) + 6}><Intro tagline={cfg.tagline ?? "hockey in under a minute!"} /></Sequence>
        <Sequence from={F(INTRO)} durationInFrames={F(OUT_AT - INTRO) + 12}><Ice /><Audio src={staticFile(cfg.vo)} /></Sequence>
        {scenes.map((sc) => (
          <Sequence key={sc.id} from={N(sc.from)} durationInFrames={N(sc.to) - N(sc.from)}>
            <div style={{ position: "absolute", top: 150, left: 60 }}><Slap from={sc.slap ?? "right"}><sc.Board from={sc.from} /></Slap></div>
          </Sequence>
        ))}
        {f >= F(INTRO) && t < LAST + 0.35 && <Speaker t={t} segs={SEGS} mood={cfg.mood} shades={cfg.shades} hidden={cfg.hideSpeaker} />}
        {f >= F(INTRO) && <Caption t={t} segs={SEGS} />}
        {scenes.slice(1).map((sc) => <Sequence key={`wh${sc.id}`} from={N(sc.from) - 8} durationInFrames={30}><Audio src={staticFile("whoosh.wav")} volume={0.45} /></Sequence>)}
        {scenes.filter((s) => s.wipe).map((sc) => <Sequence key={`iw${sc.id}`} from={N(sc.from) - 18} durationInFrames={36}><IceWipe dur={36} y={1120} /><Audio src={staticFile("sfx/scrape.wav")} volume={0.6} /></Sequence>)}
        {cfg.Extras && <cfg.Extras N={N} />}
        <Sequence from={F(OUT_AT)}><Outro /></Sequence>
      </AbsoluteFill>
    );
  };
  return { Comp, FRAMES };
};
