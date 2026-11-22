/** "Meet the gang" – 20 s test: all five mascots introduce themselves, lip-synced to the ElevenLabs dialogue. */
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, random, staticFile, useCurrentFrame, Easing } from "remotion";
import words from "./data/meet_words.json";
import { P, HAND, clamp, onTwos, PaperCard, Slap, Stamp, tornPath } from "./presenter/kit";
import { ComicBurst } from "./presenter/banana";
import { FONT } from "./theme";
import { GANG, Mascot, mouthOpen, type Mood, type Who } from "./mascots/Gang";

type W = { word: string; display: string; start: number; end: number; segment: string; keyword: boolean };
const WORDS = words as W[];
export const FPS = 60;
const TAIL = 2.6;
export const MEET_FRAMES = Math.ceil((WORDS[WORDS.length - 1].end + TAIL) * FPS);

const WHO: Record<string, Who> = { zam1: "zam", pucky: "pucky", biscuit: "biscuit", helmy: "helmy", clubby: "clubby", zam2: "zam" };
const MOOD: Record<string, Mood> = { zam1: "wow", pucky: "smug", biscuit: "grumpy", helmy: "wow", clubby: "grumpy", zam2: "laugh" };
const SEGS = Object.keys(WHO).map((id) => {
  const ws = WORDS.filter((w) => w.segment === id);
  return { id, who: WHO[id], start: ws[0].start, end: ws[ws.length - 1].end, words: ws };
});
const wordAt = (seg: string, prefix: string) => WORDS.find((w) => w.segment === seg && w.display.toLowerCase().startsWith(prefix))!.start;
const F = (s: number) => Math.round(s * FPS);
const FINALE = SEGS[5].start;

/** Top-down rink on ice, slightly jittered on twos. */
const Rink: React.FC = () => {
  const g = onTwos(useCurrentFrame());
  const j = (random(`rk${g}`) - 0.5) * 3;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 35%, #f4fbff 0%, #dbeef8 60%, #b9d9ea 100%)" }}>
      <svg width={1080} height={1920} style={{ position: "absolute", transform: `translate(${j}px, ${-j}px)` }}>
        {[...Array(26)].map((_, i) => {
          const x = random(`sx${i}`) * 1080, y = random(`sy${i}`) * 1920, l = 120 + random(`sl${i}`) * 260, a = random(`sa${i}`) * 0.6 - 0.3;
          return <path key={i} d={`M${x} ${y} q${l / 2} ${l * a} ${l} ${l * a * 0.4}`} stroke="#ffffff" strokeWidth={3} fill="none" opacity={0.7} />;
        })}
        <rect x={0} y={420} width={1080} height={18} fill="#3b82f6" opacity={0.45} />
        <rect x={0} y={1440} width={1080} height={18} fill="#3b82f6" opacity={0.45} />
        <rect x={0} y={925} width={1080} height={16} fill="#d94b3b" opacity={0.4} />
        <circle cx={540} cy={933} r={260} stroke="#3b82f6" strokeWidth={8} fill="none" opacity={0.3} />
        <circle cx={540} cy={933} r={14} fill="#3b82f6" opacity={0.4} />
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, #0b254555 100%)" }} />
    </AbsoluteFill>
  );
};

const NameBoard: React.FC<{ who: Who }> = ({ who }) => {
  const m = GANG[who];
  return (
    <Slap from={who === "pucky" || who === "helmy" ? "left" : "right"}>
      <PaperCard w={900} h={250} seed={`nb${who}`} rot={who === "biscuit" ? 1.5 : -1.2} tag="ZAM · MEET THE GANG">
        <div style={{ display: "flex", alignItems: "center", gap: 28, height: "100%" }}>
          <div style={{ width: 22, alignSelf: "stretch", background: m.accent, borderRadius: 6 }} />
          <div>
            <div style={{ fontSize: 104, fontWeight: 900, lineHeight: 0.95, letterSpacing: -1 }}>{m.name.toUpperCase()}</div>
            <div style={{ fontFamily: HAND, fontSize: 54, color: m.accent, marginTop: 4 }}>{m.role}</div>
          </div>
        </div>
      </PaperCard>
    </Slap>
  );
};

const Caption: React.FC<{ t: number }> = ({ t }) => {
  const seg = SEGS.find((s, i) => t >= s.start - 0.15 && t < (SEGS[i + 1]?.start ?? 99) - 0.15);
  if (!seg || seg.id === "zam2" || t > seg.end + 0.5) return null;
  // chunk the segment by punctuation (max 7 words)
  const chunks: W[][] = []; let cur: W[] = [];
  seg.words.forEach((w, i) => {
    const prev = cur[cur.length - 1];
    if (prev && /^%/.test(w.display)) cur[cur.length - 1] = { ...prev, display: prev.display + w.display, end: w.end };
    else cur.push(w);
    if (/[.?!,–]$/.test(w.word) || cur.length >= 7 || i === seg.words.length - 1) { chunks.push(cur); cur = []; }
  });
  // merge tiny one-word chunks ("Every." "Single." "Time.") so the strip doesn't flicker
  const merged: W[][] = [];
  chunks.forEach((c) => { const last = merged[merged.length - 1]; if (last && last.length + c.length <= 5 && (c.length === 1 || last.length === 1)) last.push(...c); else merged.push([...c]); });
  const c = merged.find((x, i) => t >= x[0].start - 0.1 && t < (merged[i + 1]?.[0].start ?? 99) - 0.1) ?? merged[0];
  return (
    <div style={{ position: "absolute", left: 60, right: 170, top: 1228, background: "#fffdf7", borderLeft: `14px solid ${GANG[seg.who].accent}`, borderRadius: 8, padding: "20px 28px", boxShadow: "0 10px 30px #0b254555", fontFamily: FONT, fontSize: 46, fontWeight: 800, color: P.ink, lineHeight: 1.25 }}>
      {c.map((w, i) => {
        const on = t >= w.start, active = on && t < w.end + 0.05;
        return <span key={i} style={{ opacity: on ? 1 : 0.35, color: w.keyword && on ? P.mustard : P.ink, borderBottom: active ? `5px solid ${P.mustard}` : "5px solid transparent" }}>{w.display} </span>;
      })}
    </div>
  );
};

/** The current speaker, big and centred: pops up from below, hops on every word. */
const Speaker: React.FC<{ t: number }> = ({ t }) => {
  const f = useCurrentFrame();
  const i = SEGS.findIndex((s, k) => t >= s.start - 0.2 && t < (SEGS[k + 1]?.start ?? 99) - 0.2);
  if (i < 0 || i === 5) return null;
  const s = SEGS[i];
  const local = onTwos(f - F(s.start - 0.2));
  const pop = interpolate(local, [0, 14], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.8)) });
  const w = s.words.find((x) => t >= x.start && t <= x.end);
  const sinceWord = w ? t - w.start : 1;
  const hop = (w ? Math.max(0, 1 - sinceWord * 6) * (w.keyword ? 46 : 18) : 0);
  const open = mouthOpen(s.words, t);
  return (
    <div style={{ position: "absolute", left: 540 - 290, top: 520 + (1 - pop) * 900 , transform: `rotate(${(1 - pop) * -18 + Math.sin(f / 30) * 1.5}deg)` }}>
      <Mascot who={s.who} size={580} open={open} talking={!!w} mood={MOOD[s.id]} hop={hop} seed={s.id} />
    </div>
  );
};

/** Bench row: everyone not speaking, small and dimmed; Pucky gets bonked by Clubby. */
const Bench: React.FC<{ t: number }> = ({ t }) => {
  const f = useCurrentFrame();
  const cur = SEGS.find((s, k) => t >= s.start - 0.2 && t < (SEGS[k + 1]?.start ?? 99) - 0.2);
  if (!cur || t >= FINALE - 0.2) return null;
  const order: Who[] = ["zam", "pucky", "biscuit", "helmy", "clubby"];
  const bonkT = wordAt("clubby", "place");
  return (
    <div style={{ position: "absolute", left: 40, right: 170, top: 1390, display: "flex", justifyContent: "space-between" }}>
      {order.filter((w) => w !== cur.who).map((w) => {
        const shake = w === "pucky" && t > bonkT && t < bonkT + 0.6 ? Math.sin(f * 1.4) * 10 : 0;
        const squash = w === "pucky" && t > bonkT && t < bonkT + 0.25 ? 18 : 0;
        return (
          <div key={w} style={{ transform: `translateX(${shake}px) translateY(${squash}px)`, textAlign: "center" }}>
            <Mascot who={w} size={190} dim seed="bench" />
          </div>
        );
      })}
    </div>
  );
};

/** Helmy's stat card (a joke stat about Pucky, not a real NHL number). */
const StatCard: React.FC = () => {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(onTwos(f), [0, 20], [0, 11], clamp));
  return (
    <Slap from="right">
      <div style={{ transform: "rotate(5deg)" }}>
        <PaperCard w={330} h={260} seed="stat">
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 120, fontWeight: 900, color: GANG.helmy.accent, lineHeight: 1 }}>{n}%</div>
            <div style={{ fontFamily: HAND, fontSize: 40, color: P.ink }}>Pucky's shots → goals</div>
          </div>
        </PaperCard>
      </div>
    </Slap>
  );
};

/** Zam drives across and resurfaces the ice – the channel's scene wipe. */
const IceWipe: React.FC<{ dur?: number }> = ({ dur = 40 }) => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, dur], [-420, 1500], clamp);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 8 }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: Math.max(0, x - 40), height: 1920, background: "linear-gradient(90deg, #ffffff00 0%, #ffffffcc 85%, #eaf7ff 100%)", opacity: interpolate(f, [dur * 0.6, dur], [1, 0], clamp) }} />
      <div style={{ position: "absolute", left: x - 230, top: 860 }}>
        <Mascot who="zam" size={420} open={0} mood="wow" talking seed="wipe" />
      </div>
    </AbsoluteFill>
  );
};

/** Final lineup + ZAM paper logo. */
const Finale: React.FC<{ t: number }> = ({ t }) => {
  const f = useCurrentFrame();
  const LINE: { w: Who; x: number; y: number; size: number }[] = [
    { w: "biscuit", x: 110, y: 0, size: 290 }, { w: "clubby", x: 650, y: 0, size: 290 },
    { w: "pucky", x: -10, y: 340, size: 270 }, { w: "helmy", x: 790, y: 340, size: 270 },
    { w: "zam", x: 320, y: 250, size: 430 },
  ];
  const zw = SEGS[5].words;
  return (
    <AbsoluteFill>
      {/* logo */}
      <div style={{ position: "absolute", top: 210, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 18 }}>
        {["Z", "A", "M"].map((l, i) => {
          const p = interpolate(onTwos(f) - i * 5, [0, 12], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
          const col = ["#3b82f6", "#d94b3b", "#e0a526"][i];
          return (
            <div key={l} style={{ position: "relative", width: 230, height: 270, transform: `translateY(${(1 - p) * -700}px) rotate(${[-6, 3, -3][i] + Math.sin((f + i * 20) / 18) * 2}deg)`, filter: "drop-shadow(0 14px 18px #0b254577)" }}>
              <svg width={230} height={270} style={{ position: "absolute" }}><path d={tornPath(230, 270, `lg${i}`, 18, 10)} fill={P.paper2} /><path d={tornPath(206, 246, `lgi${i}`, 16, 7)} transform="translate(12 12)" fill={col} /></svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontStyle: "italic", fontSize: 220, color: "#fff", WebkitTextStroke: `8px ${P.ink}`, paintOrder: "stroke fill" }}>{l}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", top: 520, left: 0, right: 0, textAlign: "center", fontFamily: HAND, fontSize: 74, color: P.ink, opacity: interpolate(f, [20, 32], [0, 1], clamp) }}>the NHL week – in under a minute!</div>
      {/* lineup */}
      <div style={{ position: "absolute", top: 680, left: 0, right: 0, height: 760 }}>
        {LINE.map(({ w, x, y, size }, i) => {
          const p = interpolate(onTwos(f) - 8 - i * 4, [0, 14], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.7)) });
          const big = w === "zam";
          const hop = Math.max(0, Math.sin((f / 60) * Math.PI * 2 * 1.2 + i * 1.3)) * 26 * (t > zw[zw.length - 1].end ? 1 : 0.4);
          return (
            <div key={w} style={{ position: "absolute", left: x, top: y + (1 - p) * 1200 }}>
              <Mascot who={w} size={size} open={big ? mouthOpen(zw, t) : 0} talking={big && t < zw[zw.length - 1].end} mood={big ? "laugh" : "talk"} hop={hop} flip={x > 500 && !big} seed="fin" />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const MeetGang: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const snipe = wordAt("pucky", "top"), save = wordAt("biscuit", "no"), stat = wordAt("helmy", "11"), bonk = wordAt("clubby", "place");
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Rink />
      <Audio src={staticFile("meet/voiceover.mp3")} />
      <Audio src={staticFile("music.wav")} volume={0.55} />
      {SEGS.map((s, i) => i < 5 && (
        <Sequence key={s.id} from={F(s.start - 0.2)} durationInFrames={F((SEGS[i + 1].start - 0.2) - (s.start - 0.2))}>
          <div style={{ position: "absolute", top: 120, left: 90 }}><NameBoard who={s.who} /></div>
        </Sequence>
      ))}
      {SEGS.map((s, i) => i > 0 && <Sequence key={`w${s.id}`} from={F(s.start - 0.3)} durationInFrames={30}><Audio src={staticFile("whoosh.wav")} volume={0.5} /></Sequence>)}
      <Bench t={t} />
      <Speaker t={t} />
      {/* banana moments */}
      <ComicBurst text="SNIPE!" at={F(snipe)} x={760} y={560} color={P.red} size={0.9} dur={70} />
      <Sequence from={F(snipe)} durationInFrames={20}><Audio src={staticFile("pop.wav")} /></Sequence>
      <Sequence from={F(save)} durationInFrames={80}><div style={{ position: "absolute", left: 640, top: 560, zIndex: 6 }}><Stamp color={P.red} rot={-12} size={92}>SAVE!</Stamp></div></Sequence>
      <Sequence from={F(save)} durationInFrames={40}><Audio src={staticFile("brand/impact.wav")} volume={0.6} /></Sequence>
      <Sequence from={F(stat) - 6} durationInFrames={F(SEGS[4].start - 0.2) - F(stat) + 6}><div style={{ position: "absolute", left: 700, top: 520, zIndex: 6 }}><StatCard /></div></Sequence>
      <Sequence from={F(stat)} durationInFrames={40}><Audio src={staticFile("brand/ding.wav")} volume={0.6} /></Sequence>
      <ComicBurst text="BONK!" at={F(bonk)} x={330} y={1560} color={P.mustard} size={0.6} dur={60} rot={6} />
      <Sequence from={F(bonk)} durationInFrames={40}><Audio src={staticFile("brand/boing.wav")} volume={0.7} /></Sequence>
      <Caption t={t} />
      {/* finale: ice wipe → logo + lineup */}
      <Sequence from={F(FINALE - 0.45)} durationInFrames={44}><IceWipe dur={44} /><Audio src={staticFile("whoosh.wav")} volume={0.7} /></Sequence>
      <Sequence from={F(FINALE - 0.1)}><Finale t={t} /><Sequence from={10}><Audio src={staticFile("brand/impact.wav")} volume={0.5} /></Sequence></Sequence>
    </AbsoluteFill>
  );
};
