/** ZAM – "Hockey's Wildest Moments" #1: Lemieux 5 ways, Holt 67 PIM, Fight Night at the Joe, Ullmark goalie goal + frozen-puck joke. */
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import words from "../data/wild01_words.json";
import { P, HAND, clamp, onTwos, PaperCard, Slap, Stamp } from "../presenter/kit";
import { ComicBurst, Scoreboard, VersusCard, ReplayOverlay } from "../presenter/banana";
import { FONT } from "../theme";
import { Mascot, mouthOpen, type Mood, type Who } from "../mascots/Gang";
import { BoardFoot, Caption, Chip, Confetti, Header, Ice, IceWipe, Lineup, Logo, PaperGoalie, RinkDiagram, buildSegs, type W } from "../zam/common";

export const FPS = 60;
const WORDS = words as W[];
const WHO = (id: string): Who => ({ z: "zam", p: "pucky", b: "biscuit", h: "helmy", c: "clubby" } as Record<string, Who>)[id[0]];
const SEGS = buildSegs(WORDS, WHO);
const S = (id: string) => SEGS.find((s) => s.id === id)!;
const at = (seg: string, prefix: string, nth = 0) => S(seg).words.filter((w) => w.display.toLowerCase().replace(/[^a-z0-9]/g, "").startsWith(prefix))[nth].start;
const MOOD: Record<string, Mood> = { z_hook: "wow", p_lemieux: "smug", h_lemieux: "wow", b_lemieux: "grumpy", z_holt: "wow", c_holt: "talk", z_fight: "wow", b_fight: "grumpy", p_roast: "smug", z_ullmark: "wow", b_ullmark: "laugh", p_ullmark: "smug", h_joke: "talk", p_joke: "laugh" };

const INTRO = 2.0;
const LAST = WORDS[WORDS.length - 1].end;
const OUT_AT = INTRO + LAST + 0.35;
const OUTRO = 3.2;
export const WILD01_FRAMES = Math.ceil((OUT_AT + OUTRO) * FPS);
const F = (s: number) => Math.round(s * FPS);
const N = (s: number) => F(INTRO + s); // news-time → frame

// scenes (news time)
const SC = [
  { id: "hook", from: 0, to: S("p_lemieux").start - 0.2 },
  { id: "lemieux", from: S("p_lemieux").start - 0.2, to: S("z_holt").start - 0.2 },
  { id: "holt", from: S("z_holt").start - 0.2, to: S("z_fight").start - 0.2 },
  { id: "fight", from: S("z_fight").start - 0.2, to: S("p_roast").start - 0.2 },
  { id: "roast", from: S("p_roast").start - 0.2, to: S("z_ullmark").start - 0.2 },
  { id: "ullmark", from: S("z_ullmark").start - 0.2, to: S("h_joke").start - 0.2 },
  { id: "joke", from: S("h_joke").start - 0.2, to: LAST + 0.35 },
];
const TAG = "ZAM · WILDEST MOMENTS";

// ---------------------------------------------------------------- boards (local frame 0 = scene start)
const lf = (sceneFrom: number, s: number) => F(s - sceneFrom); // news time → local frame

const HookBoard: React.FC = () => {
  const from = SC[0].from;
  const items = [["GOALS", P.red, "wildest"], ["PENALTIES", P.mustard, "any"], ["FIGHTS", "#d94b3b", "era"], ["GOALIE GOALS", P.teal, "lets"]] as const;
  return (
    <PaperCard w={960} h={740} seed="hook" tag={TAG}>
      <div style={{ fontSize: 112, fontWeight: 900, lineHeight: 0.95, letterSpacing: -2, marginTop: 10 }}>HOCKEY'S<br />WILDEST<br />MOMENTS</div>
      <div style={{ fontFamily: HAND, fontSize: 60, color: P.red, marginTop: 6 }}>any year · any era</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, display: "flex", flexWrap: "wrap", gap: 18 }}>
        {items.map(([txt, col, w], i) => <Stamp key={txt} color={col} at={lf(from, at("z_hook", w)) - 2 + (i === 3 ? 0 : 0)} rot={[-6, 4, -3, 5][i]} size={44}>{txt}</Stamp>)}
      </div>
    </PaperCard>
  );
};

const NET = ({ s = 300 }: { s?: number }) => (
  <svg width={s} height={s * 0.8} viewBox="0 0 300 240">
    <path d="M20 220 L40 40 H260 L280 220" fill="none" stroke={P.red} strokeWidth={12} strokeLinejoin="round" />
    {[...Array(9)].map((_, i) => <line key={`v${i}`} x1={60 + i * 22} y1={44} x2={50 + i * 25} y2={216} stroke={P.ink} strokeWidth={2} opacity={0.35} />)}
    {[...Array(7)].map((_, i) => <line key={`h${i}`} x1={40 - i * 3} y1={64 + i * 24} x2={260 + i * 3} y2={64 + i * 24} stroke={P.ink} strokeWidth={2} opacity={0.35} />)}
    <rect x={10} y={216} width={280} height={10} fill={P.red} />
  </svg>
);

const LemieuxBoard: React.FC = () => {
  const f = useCurrentFrame();
  const from = SC[1].from;
  const g0 = lf(from, at("p_lemieux", "goals"));
  const pucks = [0, 1, 2, 3, 4].map((i) => g0 + i * 16);
  const scored = pucks.filter((p) => f >= p + 10).length;
  const ways: [string, string][] = [["Even strength", "even"], ["Power play", "power"], ["Shorthanded", "shorthanded"], ["Penalty shot", "penalty"], ["Empty net", "empty"]];
  const flash = pucks.some((p) => f >= p + 10 && f < p + 18);
  return (
    <PaperCard w={960} h={740} seed="lem" tag={TAG}>
      <Header title="MARIO LEMIEUX" sub="Dec 31, 1988 · Penguins 8–6 Devils" />
      <div style={{ position: "absolute", left: 0, top: 150, width: 380, height: 380 }}>
        <div style={{ position: "absolute", left: 30, top: 60 }}><NET s={320} /></div>
        {flash && <div style={{ position: "absolute", left: 160, top: 10, width: 60, height: 40, borderRadius: 10, background: "#ff3b30", boxShadow: "0 0 50px 20px #ff3b3088", border: `4px solid ${P.ink}` }} />}
        {pucks.map((p, i) => {
          const k = interpolate(f, [p, p + 10], [0, 1], clamp);
          if (f < p) return null;
          const x = interpolate(k, [0, 1], [-300, 110 + (i % 3) * 70]);
          const y = interpolate(k, [0, 1], [380, 130 + Math.floor(i / 3) * 70]) - Math.sin(k * Math.PI) * 120;
          return <div key={i} style={{ position: "absolute", left: x, top: y, width: 56, height: 22, borderRadius: "50%", background: "#111", border: `3px solid ${P.ink}`, transform: `rotate(${-18 + i * 7}deg)` }} />;
        })}
        <div style={{ position: "absolute", left: 120, top: 270, fontSize: 130, fontWeight: 900, color: P.ink, lineHeight: 1 }}>{scored}<span style={{ fontSize: 44, marginLeft: 8 }}>GOALS</span></div>
      </div>
      <div style={{ position: "absolute", left: 420, top: 160, right: 0 }}>
        {ways.map(([label, key], i) => {
          const tick = lf(from, at("h_lemieux", key));
          const on = f >= tick;
          const pop = interpolate(f, [tick, tick + 8], [1.6, 1], clamp);
          return (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 18, height: 78, opacity: on ? 1 : 0.35 }}>
              <div style={{ width: 52, height: 52, border: `5px solid ${P.ink}`, borderRadius: 8, background: P.paper2, position: "relative" }}>
                {on && <div style={{ position: "absolute", left: 4, top: -18, fontSize: 64, color: P.green, fontWeight: 900, transform: `scale(${pop})` }}>✓</div>}
              </div>
              <div style={{ fontSize: 42, fontWeight: 800 }}>{i + 1}. {label}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 140, top: 530 }}><Stamp color={P.red} at={lf(from, at("h_lemieux", "never"))} rot={-4} size={44}>ONLY TIME IN NHL HISTORY</Stamp></div>
      <BoardFoot source="NHL.com" />
    </PaperCard>
  );
};

const HoltBoard: React.FC = () => {
  const f = useCurrentFrame();
  const from = SC[2].from;
  const c0 = lf(from, at("z_holt", "67"));
  const n = Math.round(interpolate(onTwos(f), [c0 - 4, c0 + 50], [0, 67], { ...clamp, easing: Easing.out(Easing.cubic) }));
  const chips = Math.min(9, Math.floor((n / 67) * 9 + 0.001));
  return (
    <PaperCard w={960} h={740} seed="holt" tag={TAG}>
      <Header title="RANDY HOLT" sub="Mar 11, 1979 · Kings vs Flyers" accent={P.mustard} />
      {/* counter */}
      <div style={{ position: "absolute", left: 0, top: 150, display: "flex", alignItems: "center", gap: 26 }}>
        <div style={{ display: "flex", gap: 10 }}>
          {String(n).padStart(2, "0").split("").map((d, i) => (
            <div key={i} style={{ width: 150, height: 200, background: "#1d1a17", color: "#f7d84a", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 170, fontWeight: 900, boxShadow: "inset 0 -100px 0 #2a2622", position: "relative" }}>
              {d}<div style={{ position: "absolute", left: 0, right: 0, top: 98, height: 4, background: "#000" }} />
            </div>
          ))}
        </div>
        <div style={{ fontSize: 46, fontWeight: 900, lineHeight: 1.05 }}>PENALTY<br />MINUTES<div style={{ fontFamily: HAND, fontSize: 44, color: P.red, fontWeight: 700 }}>in ONE game</div></div>
      </div>
      {/* penalty box filling with paper players (1 minor, 3 majors, 2 misconducts, 3 game misconducts = 9 penalties) */}
      <div style={{ position: "absolute", left: 0, top: 370, width: 600, height: 150, border: `6px solid ${P.ink}`, borderRadius: 14, background: "#e9f3fa" }}>
        <div style={{ position: "absolute", left: 14, top: -30, padding: "2px 14px", background: P.ink, color: "#fff", fontSize: 24, fontWeight: 900, letterSpacing: 2 }}>PENALTY BOX</div>
        <div style={{ position: "absolute", left: 18, top: 26, display: "flex", gap: 2 }}>
          {[...Array(chips)].map((_, i) => <Chip key={i} c1="#5b2c83" c2="#f2c230" n={i % 2 ? "!" : "?!"} s={62} />)}
        </div>
      </div>
      <div style={{ position: "absolute", left: 630, top: 370 }}><Stamp color={P.red} at={c0 + 52} rot={8} size={46}>NHL<br />RECORD</Stamp></div>
      <div style={{ position: "absolute", left: 60, top: 540 }}><Stamp color={P.teal} at={lf(from, at("c_holt", "first"))} rot={-3} size={40}>ALL IN THE 1ST PERIOD</Stamp></div>
      <BoardFoot source="NHL.com · Guinness World Records" />
    </PaperCard>
  );
};

const FightBoard: React.FC = () => {
  const from = SC[3].from;
  return (
    <PaperCard w={960} h={740} seed="fight" tag={TAG}>
      <Header title="FIGHT NIGHT AT THE JOE" sub="Mar 26, 1997 · Detroit vs Colorado" />
      <div style={{ position: "absolute", left: 6, top: 135 }}>
        <Sequence from={lf(from, at("z_fight", "goalies")) - 10} layout="none">
          <VersusCard w={880} h={375} leftLabel="VERNON · DET" rightLabel="ROY · COL" left={<PaperGoalie c1="#ce1126" c2="#ffffff" n={29} s={220} />} right={<PaperGoalie c1="#6f263d" c2="#236192" n={33} s={220} flip />} />
        </Sequence>
      </div>
      <div style={{ position: "absolute", left: 120, top: 525 }}><Stamp color={P.red} at={lf(from, at("b_fight", "masks"))} rot={-3} size={40}>MASKS OFF · GLOVES OFF</Stamp></div>
      <BoardFoot source="WDIV ClickOnDetroit · Wikipedia" />
    </PaperCard>
  );
};

const RoastBoard: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <PaperCard w={960} h={740} seed="roast" tag={TAG}>
      <Header title="PUCKY'S ROAST CORNER" sub="all-time fight record (unofficial)" />
      <div style={{ position: "absolute", left: 0, top: 160, transform: "scale(0.95)", transformOrigin: "left top" }}>
        <Scoreboard left="BISCUIT" right="ICE MACHINE" a={0} b={1} prevA={0} prevB={0} label="FIGHTS" flipAt={24} />
      </div>
      <div style={{ position: "absolute", left: 60, top: 320 }}><Mascot who="biscuit" size={280} mood="grumpy" seed="rb" /></div>
      <div style={{ position: "absolute", left: 520, top: 320, transform: `rotate(${Math.sin(f / 10) * 3}deg)` }}><Mascot who="zam" size={300} mood="laugh" seed="rz" flip /></div>
      <div style={{ position: "absolute", left: 360, top: 400 }}><Stamp color={P.mustard} at={30} rot={10} size={40}>K.O.</Stamp></div>
    </PaperCard>
  );
};

const UllmarkBoard: React.FC = () => {
  const f = useCurrentFrame();
  const from = SC[5].from;
  const s0 = lf(from, at("z_ullmark", "fires"));
  const g = lf(from, at("z_ullmark", "goal", 1));
  const k = interpolate(f, [s0, g], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const x0 = 110, x1 = 812, y = 170;
  const px = x0 + (x1 - x0) * k;
  const lit = f >= g && f < g + 50 && Math.floor((f - g) / 6) % 2 === 0;
  return (
    <PaperCard w={960} h={740} seed="ull" tag={TAG}>
      <Header title="LINUS ULLMARK" sub="Feb 25, 2023 · Bruins 3–1 Canucks" accent={P.teal} />
      <div style={{ position: "absolute", left: 0, top: 150 }}>
        <RinkDiagram w={890} h={340}>
          <div style={{ position: "absolute", left: 40, top: 130 }}><Chip c1="#111" c2="#fcb514" n={35} s={80} goalie /></div>
          <div style={{ position: "absolute", left: 795, top: 135, width: 36, height: 70, border: `5px dashed ${P.red}`, borderRadius: 6 }} />
          <div style={{ position: "absolute", left: 745, top: 210, fontFamily: HAND, fontSize: 32, color: P.red, fontWeight: 700 }}>empty net!</div>
          <svg width={890} height={340} style={{ position: "absolute", left: 0, top: 0 }}>
            <path d={`M${x0 + 20} ${y} L${px} ${y}`} stroke={P.mustard} strokeWidth={8} strokeDasharray="20 14" />
          </svg>
          {f >= s0 && <div style={{ position: "absolute", left: px - 16, top: y - 10, width: 34, height: 20, borderRadius: "50%", background: "#111", border: `3px solid ${P.ink}` }} />}
          {lit && <div style={{ position: "absolute", left: 790, top: 70, width: 46, height: 34, borderRadius: 8, background: "#ff3b30", boxShadow: "0 0 44px 18px #ff3b3088", border: `4px solid ${P.ink}` }} />}
        </RinkDiagram>
      </div>
      <Sequence from={g + 30} layout="none"><div style={{ position: "absolute", left: 0, top: 170, width: 890, height: 340 }}><ReplayOverlay cx={815} cy={150} /></div></Sequence>
      <div style={{ position: "absolute", left: 20, top: 505, fontFamily: HAND, fontSize: 40, color: P.ink }}>goalie shot · whole rink · into the empty net</div>
      <div style={{ position: "absolute", left: 430, top: 560 }}><Stamp color={P.teal} at={lf(from, at("p_ullmark", "took"))} rot={-4} size={38}>FIRST GOALIE GOAL SINCE 2020</Stamp></div>
      <BoardFoot source="NHL.com · CBC" />
    </PaperCard>
  );
};

const JokeBoard: React.FC = () => {
  const f = useCurrentFrame();
  const from = SC[6].from;
  const cool = lf(from, at("p_joke", "cool"));
  return (
    <PaperCard w={960} h={740} seed="joke" tag={TAG}>
      <Header title="HELMY'S FUN FACT" sub="(this one is actually true)" accent={P.teal} />
      {/* freezer */}
      <div style={{ position: "absolute", left: 20, top: 160, width: 400, height: 420, background: "#eef7fd", border: `7px solid ${P.ink}`, borderRadius: 22 }}>
        <div style={{ position: "absolute", left: 18, right: 18, top: 18, height: 26, background: "#cfe7f6", border: `4px solid ${P.ink}`, borderRadius: 8 }} />
        <div style={{ position: "absolute", left: 30, top: 70, fontFamily: HAND, fontSize: 46, fontWeight: 700, color: "#3b82f6" }}>FREEZER</div>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ position: "absolute", left: 60 + (i % 2) * 120, top: 150 + i * 80, width: 150, height: 70, background: "#bfe3ffcc", border: `4px solid #7cc4f5`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 90, height: 34, borderRadius: "50%", background: "#111", border: `3px solid ${P.ink}` }} />
          </div>
        ))}
        {[...Array(10)].map((_, i) => <div key={`s${i}`} style={{ position: "absolute", left: 30 + ((i * 73) % 330), top: 120 + ((i * 131 + onTwos(f)) % 280), fontSize: 30, color: "#7cc4f5" }}>❄</div>)}
      </div>
      <div style={{ position: "absolute", left: 460, top: 190, right: 0, fontSize: 50, fontWeight: 900, lineHeight: 1.15 }}>Pucks are frozen before games</div>
      <div style={{ position: "absolute", left: 460, top: 340, right: 0, fontFamily: HAND, fontSize: 46, color: P.teal }}>→ less bounce on the ice</div>
      {f >= cool - 10 && <div style={{ position: "absolute", left: 520, top: 430, transform: `scale(${interpolate(f, [cool - 10, cool], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) })})` }}><Mascot who="pucky" size={240} mood="laugh" shades seed="cool" /></div>}
    </PaperCard>
  );
};

const BOARDS: Record<string, React.FC> = { hook: HookBoard, lemieux: LemieuxBoard, holt: HoltBoard, fight: FightBoard, roast: RoastBoard, ullmark: UllmarkBoard, joke: JokeBoard };

// ---------------------------------------------------------------- speaker
const Speaker: React.FC<{ t: number }> = ({ t }) => {
  const f = useCurrentFrame();
  const i = SEGS.findIndex((s, k) => t >= s.start - 0.2 && t < (SEGS[k + 1]?.start ?? 999) - 0.2);
  if (i < 0) return null;
  const s = SEGS[i];
  const prevSame = i > 0 && SEGS[i - 1].who === s.who;
  const local = onTwos(f - N(s.start - 0.2));
  const pop = prevSame ? 1 : interpolate(local, [0, 12], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.8)) });
  const w = s.words.find((x) => t >= x.start && t <= x.end);
  const hop = w ? Math.max(0, 1 - (t - w.start) * 6) * (w.keyword ? 44 : 16) : 0;
  return (
    <div style={{ position: "absolute", left: 540 - 225 - 60, top: 1090 + (1 - pop) * 800, transform: `rotate(${(1 - pop) * -16 + Math.sin(f / 30) * 1.5}deg)` }}>
      <Mascot who={s.who} size={450} open={mouthOpen(s.words, t)} talking={!!w} mood={MOOD[s.id]} hop={hop} seed={s.id} flip={i % 2 === 1 && s.who !== "zam"} shades={s.id === "p_joke" && t > at("p_joke", "cool") - 0.2} />
    </div>
  );
};

// ---------------------------------------------------------------- intro & outro
const Intro: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Ice />
      <div style={{ position: "absolute", top: 520, left: 0, right: 0 }}><Logo delay={18} /></div>
      <div style={{ position: "absolute", top: 830, left: 0, right: 0, textAlign: "center", fontFamily: HAND, fontSize: 76, color: P.ink, opacity: interpolate(f, [40, 52], [0, 1], clamp) }}>hockey in under a minute!</div>
      <div style={{ position: "absolute", left: 560, top: 980 + interpolate(onTwos(f), [50, 64], [900, 0], { ...clamp, easing: Easing.out(Easing.back(1.6)) }) }}><Mascot who="pucky" size={340} mood="smug" seed="intro" /></div>
      <Sequence from={0} durationInFrames={40}><IceWipe dur={40} y={980} /></Sequence>
      <Audio src={staticFile("sfx/scrape.wav")} volume={0.8} />
      <Sequence from={14}><Audio src={staticFile("brand/riser.wav")} volume={0.35} /></Sequence>
      <Sequence from={26}><Audio src={staticFile("brand/impact.wav")} volume={0.55} /></Sequence>
      <Sequence from={56}><Audio src={staticFile("pop.wav")} volume={0.8} /></Sequence>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const fade = interpolate(f, [0, 12], [0, 1], clamp);
  const pulse = 1 + Math.sin(f / 6) * 0.04;
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <Ice />
      <div style={{ position: "absolute", top: 150, left: 0, right: 0 }}><Logo scale={0.8} /></div>
      <Lineup top={500} mood="laugh" talkWho="zam" open={f > 6 && f < 6 + 120 ? 0.3 + 0.6 * Math.abs(Math.sin(f / 4)) : 0} />
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

// ---------------------------------------------------------------- main
export const Wild01: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS - INTRO;
  const goalLem = at("p_lemieux", "goals");
  const ull = at("z_ullmark", "goal", 1);
  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: "#dbeef8" }}>
      <Audio src={staticFile("music.wav")} volume={(fr) => (fr < F(OUT_AT) ? 0.5 : interpolate(fr, [F(OUT_AT), F(OUT_AT + OUTRO)], [0.5, 0.15], clamp))} />
      <Sequence from={0} durationInFrames={F(INTRO) + 6}><Intro /></Sequence>
      <Sequence from={F(INTRO)} durationInFrames={F(OUT_AT - INTRO) + 12}>
        <Ice />
        <Audio src={staticFile("ep/wild01.mp3")} />
      </Sequence>
      {SC.map((sc) => {
        const B = BOARDS[sc.id];
        return (
          <Sequence key={sc.id} from={N(sc.from)} durationInFrames={N(sc.to) - N(sc.from)}>
            <div style={{ position: "absolute", top: 150, left: 60 }}><Slap from={sc.id === "lemieux" || sc.id === "fight" || sc.id === "joke" ? "left" : "right"}><B /></Slap></div>
          </Sequence>
        );
      })}
      {f >= F(INTRO) && t < LAST + 0.35 && <Speaker t={t} />}
      {f >= F(INTRO) && <Caption t={t} segs={SEGS} />}

      {/* scene-change SFX + Zam ice wipes */}
      {SC.slice(1).map((sc) => <Sequence key={`wh${sc.id}`} from={N(sc.from) - 8} durationInFrames={30}><Audio src={staticFile("whoosh.wav")} volume={0.45} /></Sequence>)}
      {["holt", "fight", "ullmark", "joke"].map((id) => { const sc = SC.find((x) => x.id === id)!; return <Sequence key={`iw${id}`} from={N(sc.from) - 18} durationInFrames={36}><IceWipe dur={36} y={1120} /><Audio src={staticFile("sfx/scrape.wav")} volume={0.6} /></Sequence>; })}

      {/* banana moments */}
      <ComicBurst text="LET'S GO!" at={N(at("z_hook", "lets"))} x={760} y={1240} color={P.red} size={0.8} dur={40} />
      <Sequence from={N(goalLem) + 10} durationInFrames={110}><Audio src={staticFile("sfx/horn.wav")} volume={0.5} /></Sequence>
      {[1, 2, 3, 4].map((i) => <Sequence key={`pp${i}`} from={N(goalLem) + i * 16 + 10} durationInFrames={20}><Audio src={staticFile("pop.wav")} volume={0.7} /></Sequence>)}
      <ComicBurst text="FIVE?!" at={N(at("b_lemieux", "five"))} x={800} y={1240} color={P.mustard} size={0.8} dur={60} rot={8} />
      <Sequence from={N(at("b_lemieux", "hug"))} durationInFrames={40}><Audio src={staticFile("brand/boing.wav")} volume={0.5} /></Sequence>
      <Sequence from={N(at("z_holt", "67"))} durationInFrames={60}><Audio src={staticFile("brand/ding.wav")} volume={0.5} /></Sequence>
      <Sequence from={N(at("z_fight", "goalies")) + 10} durationInFrames={40}><Audio src={staticFile("brand/impact.wav")} volume={0.7} /></Sequence>
      <ComicBurst text="BOOM!" at={N(at("z_fight", "goalies")) + 10} x={820} y={1240} color={P.red} size={0.8} dur={55} />
      <Sequence from={N(at("p_roast", "ice"))} durationInFrames={40}><Audio src={staticFile("brand/rimshot.wav")} volume={0.6} /></Sequence>
      <Sequence from={N(ull)} durationInFrames={110}><Audio src={staticFile("sfx/horn.wav")} volume={0.5} /></Sequence>
      <ComicBurst text="GOALIE GOAL!" at={N(ull)} x={760} y={1240} color={P.teal} size={0.75} dur={70} />
      <Sequence from={N(at("b_ullmark", "finally"))} durationInFrames={120}><Confetti n={60} x={540} y={300} /><Audio src={staticFile("sfx/crowd.wav")} volume={0.4} /></Sequence>
      <ComicBurst text="COOL!" at={N(at("p_joke", "cool"))} x={800} y={1240} color="#3b82f6" size={0.8} dur={40} />
      <Sequence from={N(at("p_joke", "cool"))} durationInFrames={40}><Audio src={staticFile("brand/rimshot.wav")} volume={0.6} /></Sequence>

      <Sequence from={F(OUT_AT)}><Outro /></Sequence>
    </AbsoluteFill>
  );
};
