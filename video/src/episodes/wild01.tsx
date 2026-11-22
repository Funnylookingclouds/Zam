/** ZAM – "Hockey's Wildest Moments" #1: Lemieux 5 ways, Holt 67 PIM, Fight Night at the Joe, Ullmark goalie goal + frozen-puck joke. */
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import words from "../data/wild01_words.json";
import { P, HAND, clamp, onTwos, PaperCard, Slap, Stamp } from "../presenter/kit";
import { ComicBurst, Scoreboard, VersusCard, ReplayOverlay } from "../presenter/banana";
import { FONT } from "../theme";
import { Mascot, mouthOpen, type Mood, type Who } from "../mascots/Gang";
import { BoardFoot, Caption, Confetti, FightCloud, HalfStage, Header, Ice, IceWipe, Lineup, Logo, Play, RinkDiagram, buildSegs, sample, type Band, type Key, type Track, type W } from "../zam/common";

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


// The gang acts it out: Clubby (#66) shoots Pucky past Biscuit (NJ), one mini-play per scoring type, timed to Helmy's list.
// Paths follow the recaps where known (PP: shot from above the circle · SH: between Sauve's legs · PS: Terreri's stick thrown at the puck).
const PIT_B: Band = { c1: "#111", c2: "#fcb514", n: 66 }, PIT_M: Band = { c1: "#111", c2: "#fcb514", n: "PIT" }, NJD_B: Band = { c1: "#c8102e", c2: "#1b5e20", n: "NJ" };
const LemieuxStage: React.FC<{ t: number }> = ({ t }) => {
  const NET: [number, number] = [838, 200];
  const hs = S("h_lemieux").start - 0.1, he = S("h_lemieux").end;
  const bis = (keys: Key[], extra: Partial<Track> = {}): Track => ({ id: "bis", c1: "", c2: "", n: "", kind: "mascot", who: "biscuit", s: 150, mood: "grumpy", band: NJD_B, flip: true, keys, ...extra });
  const clu = (keys: Key[]): Track => ({ id: "clu", c1: "", c2: "", n: "", kind: "mascot", who: "clubby", s: 150, mood: "wow", band: PIT_B, keys });
  const G: Key[] = [[0, 762, 200]];
  let tracks: Track[] = [], puck: Key[] = [], label = "", light = false, idx = -1;
  if (t < hs) {
    const a = S("p_lemieux").start - 0.2;
    const k: Key[] = [[a, 90, 300], [a + 1.3, 420, 140], [a + 2.6, 560, 290], [a + 3.8, 360, 250], [a + 5.4, 250, 210]];
    tracks = [bis(G), clu(k)]; puck = k.map(([tt, x, y]) => [tt + 0.05, x + 78, y + 46] as Key); label = "5 GOALS · 5 WAYS";
  } else if (t < he + 0.35) {
    const ways = ["even", "power", "shorthanded", "penalty", "empty"].map((w) => at("h_lemieux", w));
    const ends = [...ways.slice(1), he + 0.35];
    idx = Math.max(0, ways.filter((w) => t >= w - 0.05).length - 1);
    const a = ways[idx], d = ends[idx] - a; const u = (x: number) => a + x * d;
    if (idx === 0) { label = "1/5 · EVEN STRENGTH"; tracks = [bis(G), clu([[u(0), 240, 300], [u(0.55), 590, 230]])]; puck = [[u(0), 318, 346], [u(0.55), 668, 276], [u(0.85), ...NET]]; }
    if (idx === 1) { label = "2/5 · POWER PLAY"; tracks = [bis(G), { id: "hel", c1: "", c2: "", n: "", kind: "mascot", who: "helmy", s: 120, band: PIT_M, keys: [[0, 540, 80]] }, clu([[u(0), 400, 300]])]; puck = [[u(0), 600, 110], [u(0.3), 478, 346], [u(0.42), 478, 346], [u(0.85), ...NET]]; }
    if (idx === 2) { label = "3/5 · SHORTHANDED"; tracks = [bis(G, { squash: (tt) => (tt > u(0.55) && tt < u(1) ? 0.7 : 1) }), clu([[u(0), 200, 200], [u(0.55), 590, 200]])]; puck = [[u(0), 278, 246], [u(0.55), 668, 246], [u(0.9), ...NET]]; }
    if (idx === 3) { label = "4/5 · PENALTY SHOT"; tracks = [bis(G), { id: "st", c1: "", c2: "", n: "", kind: "stick", keys: [[u(0), 740, 180], [u(0.3), 650, 300]], hideAfter: u(0.42) }, clu([[u(0.3), 140, 200], [u(0.72), 590, 200]])]; puck = [[u(0), 650, 300], [u(0.32), 218, 246], [u(0.72), 668, 246], [u(0.9), ...NET]]; }
    if (idx === 4) { label = "5/5 · EMPTY NET · 19:59"; tracks = [bis([[u(0), 762, 200], [u(0.3), 960, -120]], { hideAfter: u(0.32) }), clu([[u(0), 200, 260], [u(0.2), 250, 250]])]; puck = [[u(0), 278, 300], [u(0.2), 328, 296], [u(0.7), ...NET]]; }
    light = t >= puck[puck.length - 1][0] && t < puck[puck.length - 1][0] + 0.5;
  } else {
    // "That goalie needs a hug": Biscuit back in net, Zam skates in for a hug; Pucky dizzy in the net
    const a = he + 0.35;
    tracks = [bis([[a, 960, -120], [a + 0.3, 740, 200]], { dizzy: () => true }), { id: "zam", c1: "", c2: "", n: "", kind: "mascot", who: "zam", s: 160, mood: "laugh", keys: [[a + 0.2, 120, 230], [a + 1.0, 620, 220]] }];
    puck = [[0, ...NET]]; label = "GROUP HUG";
  }
  return (
    <HalfStage light={light}>
      <Play t={t} tracks={tracks} puck={puck} puckWho puckSize={74} trailFrom={idx >= 0 ? puck[0][0] : undefined} />
      <div style={{ position: "absolute", left: 16, top: 14, padding: "2px 12px", background: P.red, color: "#fff", fontSize: 28, fontWeight: 900, letterSpacing: 1, zIndex: 1001 }}>{label}</div>
      <div style={{ position: "absolute", left: 18, bottom: 8, fontFamily: HAND, fontSize: 26, color: P.muted, zIndex: 1001 }}>the gang's recreation · paths approx.</div>
    </HalfStage>
  );
};

const LemieuxBoard: React.FC = () => {
  const f = useCurrentFrame();
  const from = SC[1].from;
  const t = from + f / FPS;
  const ways: [string, string][] = [["EVEN", "even"], ["PP", "power"], ["SH", "shorthanded"], ["PS", "penalty"], ["EN", "empty"]];
  const done = ways.filter(([, k]) => t >= at("h_lemieux", k)).length;
  return (
    <PaperCard w={960} h={740} seed="lem" tag={TAG}>
      <Header title="MARIO LEMIEUX" sub="Dec 31, 1988 · Penguins 8–6 Devils" />
      <div style={{ position: "absolute", left: 0, top: 128 }}><LemieuxStage t={t} /></div>
      <div style={{ position: "absolute", left: 0, top: 545, display: "flex", gap: 10, alignItems: "center" }}>
        {ways.map(([lab, k], i) => {
          const on = t >= at("h_lemieux", k);
          const pop = interpolate(t - at("h_lemieux", k), [0, 0.15], [1.4, 1], clamp);
          return <div key={k} style={{ width: 128, height: 62, border: `5px solid ${P.ink}`, borderRadius: 12, background: on ? "#d9f0d0" : P.paper2, opacity: on ? 1 : 0.4, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 32, fontWeight: 900, transform: `scale(${on ? pop : 1})` }}>{on ? <span style={{ color: P.green }}>✓</span> : null}{lab}</div>;
        })}
        <div style={{ marginLeft: 10, fontSize: 56, fontWeight: 900 }}>{done}<span style={{ fontSize: 26 }}> GOALS</span></div>
      </div>
      <div style={{ position: "absolute", left: 20, top: 425, zIndex: 1100 }}><Stamp color={P.red} at={lf(from, at("h_lemieux", "never"))} rot={-4} size={40}>ONLY TIME IN NHL HISTORY</Stamp></div>
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
      {/* Clubby (as Holt, LA) keeps getting sent to the box by referee Helmy */}
      <div style={{ position: "absolute", left: 0, top: 345, width: 892, height: 190, background: "#f4fbff", border: `6px solid ${P.ink}`, borderRadius: 18, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 250, height: 190, background: "#dde9f2", borderRight: `8px solid ${P.ink}` }}>
          <div style={{ position: "absolute", left: 12, top: 8, padding: "2px 10px", background: P.ink, color: "#fff", fontSize: 22, fontWeight: 900, letterSpacing: 2 }}>PENALTY BOX</div>
        </div>
        <Play t={from + f / FPS} tracks={[
          { id: "ref", c1: "", c2: "", n: "", kind: "mascot", who: "helmy", s: 110, mood: "wow", band: { c1: "#ffffff", c2: "#111", n: "REF" }, flip: true, keys: [[0, 520, 70]] },
          { id: "clu", c1: "", c2: "", n: "", kind: "mascot", who: "clubby", s: 120, mood: "grumpy", band: { c1: "#5b2c83", c2: "#f2c230", n: "LA" }, keys: [...Array(10)].flatMap((_, k) => [[from + 0.4 + k * 0.85, 760, 66], [from + 0.4 + k * 0.85 + 0.4, 130, 66]] as Key[]) },
        ]} />
        <div style={{ position: "absolute", left: 280, top: 148, fontFamily: HAND, fontSize: 30, color: P.red, fontWeight: 700 }}>tweeeet! · tweeeet! · tweeeet!</div>
      </div>
      <div style={{ position: "absolute", left: 650, top: 150 }}><Stamp color={P.red} at={c0 + 52} rot={8} size={46}>NHL<br />RECORD</Stamp></div>
      <div style={{ position: "absolute", left: 60, top: 552 }}><Stamp color={P.teal} at={lf(from, at("c_holt", "first"))} rot={-3} size={40}>ALL IN THE 1ST PERIOD</Stamp></div>
      <BoardFoot source="NHL.com · Guinness World Records" />
    </PaperCard>
  );
};

const FightBoard: React.FC = () => {
  const f = useCurrentFrame();
  const from = SC[3].from;
  const t = from + f / FPS;
  const go = at("z_fight", "goalies"), masks = at("b_fight", "masks"), end = S("b_fight").end;
  const DET: Band = { c1: "#ce1126", c2: "#ffffff", n: 29 }, COL: Band = { c1: "#6f263d", c2: "#236192", n: 33 };
  const inCloud = t > go + 0.3 && t < end;
  const bounce = (x: number, y: number): Key[] => [...Array(14)].map((_, k) => [from + k * 0.3, x, y + (k % 2 ? -10 : 0)] as Key);
  const tracks: Track[] = inCloud ? [] : t <= go + 0.3 ? [
    { id: "b", c1: "", c2: "", n: "", kind: "mascot", who: "biscuit", s: 160, mood: "grumpy", band: DET, label: "VERNON · DET", keys: t < go ? bounce(190, 190) : [[go, 190, 190], [go + 0.3, 380, 200]] },
    { id: "h", c1: "", c2: "", n: "", kind: "mascot", who: "helmy", s: 160, mood: "grumpy", band: COL, label: "ROY · COL", flip: true, keys: t < go ? bounce(700, 190) : [[go, 700, 190], [go + 0.3, 510, 200]] },
  ] : [
    { id: "b", c1: "", c2: "", n: "", kind: "mascot", who: "biscuit", s: 160, mood: "grumpy", band: DET, dizzy: () => true, keys: [[end, 380, 200], [end + 0.3, 200, 190]] },
    { id: "h", c1: "", c2: "", n: "", kind: "mascot", who: "helmy", s: 160, mood: "wow", band: COL, dizzy: () => true, flip: true, keys: [[end, 510, 200], [end + 0.3, 690, 190]] },
  ];
  const fly = (k: number, x1: number, y1: number, el: React.ReactNode) => {
    const u = interpolate(t, [masks + k * 0.15, masks + k * 0.15 + 0.9], [0, 1], clamp);
    if (t < masks + k * 0.15) return null;
    return <div style={{ position: "absolute", left: 445 + (x1 - 445) * u, top: 200 + (y1 - 200) * u - Math.sin(u * Math.PI) * 140, transform: `rotate(${u * 720}deg)`, zIndex: 1100 }}>{el}</div>;
  };
  return (
    <PaperCard w={960} h={740} seed="fight" tag={TAG}>
      <Header title="FIGHT NIGHT AT THE JOE" sub="Mar 26, 1997 · Detroit vs Colorado" />
      <div style={{ position: "absolute", left: 0, top: 128, width: 892, height: 390, background: "#f4fbff", border: `6px solid ${P.ink}`, borderRadius: 26 }}>
        <div style={{ position: "absolute", left: 443, top: 0, width: 10, height: 378, background: "#d94b3b", opacity: 0.7 }} />
        <Play t={t} tracks={tracks} />
        {inCloud && <div style={{ position: "absolute", left: 445 - 190, top: 40, zIndex: 900 }}><FightCloud s={380} /></div>}
        {fly(0, 90, 40, <div style={{ width: 70, height: 60, background: "#f8fafc", border: `5px solid ${P.ink}`, borderRadius: "40% 40% 20% 20%" }} />)}
        {fly(1, 820, 60, <div style={{ width: 60, height: 50, background: P.teal, border: `5px solid ${P.ink}`, borderRadius: "50% 50% 10% 10%" }} />)}
        {fly(2, 150, 330, <div style={{ width: 54, height: 44, background: "#ce1126", border: `5px solid ${P.ink}`, borderRadius: 12 }} />)}
        {fly(3, 760, 340, <div style={{ width: 54, height: 44, background: "#6f263d", border: `5px solid ${P.ink}`, borderRadius: 12 }} />)}
      </div>
      <div style={{ position: "absolute", left: 120, top: 530 }}><Stamp color={P.red} at={lf(from, masks)} rot={-3} size={40}>MASKS OFF · GLOVES OFF</Stamp></div>
      <BoardFoot source="WDIV ClickOnDetroit · Wikipedia (the gang's recreation)" />
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

// Recreation per recaps: VAN goalie pulled, puck chipped into BOS zone but short of the corner, Ullmark leaves
// his crease, lifts a high wrist shot over the traffic, it lands past the blue line in the slot and slides in (0:48 left).
const DizzyStars: React.FC = () => { const f = onTwos(useCurrentFrame()); return <>{[0, 1, 2].map((i) => { const a = f / 9 + (i * Math.PI * 2) / 3; return <div key={i} style={{ position: "absolute", left: Math.cos(a) * 40 - 12, top: Math.sin(a) * 16 - 40, fontSize: 28, color: P.mustard, WebkitTextStroke: `2px ${P.ink}` }}>★</div>; })}</>; };
const BOS = { c1: "#111", c2: "#fcb514" }, VAN = { c1: "#00205b", c2: "#00843d" };
const UllmarkBoard: React.FC = () => {
  const f = useCurrentFrame();
  const from = SC[5].from;
  const T = (news: number) => news - from; // news time → local seconds
  const t = f / FPS;
  const fire = T(at("z_ullmark", "fires")), g = T(at("z_ullmark", "goal", 1));
  const chip = fire - 1.1;
  const van: Track[] = [[300, 80], [250, 250], [200, 120], [330, 200], [380, 280], [420, 130]].map(([x, y], k) => ({ id: `v${k}`, ...VAN, n: "", s: 44, keys: [[0, x + 120, y], [chip, x, y], [fire, x - 20, y + (k % 2 ? 10 : -10)], [g, x + 90, y]] as Key[] }));
  const bos: Track[] = [[220, 180], [300, 240], [260, 100]].map(([x, y], k) => ({ id: `b${k}`, ...BOS, n: "", s: 44, keys: [[0, x, y], [fire, x - 30, y], [g, x + 60, y]] as Key[] }));
  const ull: Track = { id: "u", c1: "", c2: "", n: "", kind: "mascot", who: "biscuit", s: 104, mood: t > g ? "laugh" : "grumpy", band: { c1: "#111", c2: "#fcb514", n: 35 }, keys: [[0, 92, 160], [chip + 0.3, 92, 160], [fire - 0.15, 140, 236], [g, 134, 226], [g + 0.25, 134, 196], [g + 0.5, 134, 226], [g + 0.75, 134, 196], [g + 1, 134, 226]] };
  const puck: Key[] = [[0, 520, 120], [chip, 480, 110], [chip + 0.75, 150, 258], [fire, 150, 254], [fire + (g - fire) * 0.45, 470, 205, 135], [fire + (g - fire) * 0.72, 690, 178, 0], [g, 826, 170, 0]];
  const lit = f >= F(g) && f < F(g) + 50 && Math.floor((f - F(g)) / 6) % 2 === 0;
  const scored = t >= g;
  return (
    <PaperCard w={960} h={740} seed="ull" tag={TAG}>
      <Header title="LINUS ULLMARK" sub="Feb 25, 2023 · at Vancouver" accent={P.teal} />
      <div style={{ position: "absolute", right: 0, top: 70, display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", background: P.ink, borderRadius: 12, border: `4px solid ${P.mustard}`, color: "#fff", fontWeight: 900, fontSize: 30 }}>
        BOS <span style={{ color: "#f7d84a", fontSize: 40 }}>{scored ? 3 : 2}</span> – <span style={{ color: "#f7d84a", fontSize: 40 }}>1</span> VAN
        <span style={{ marginLeft: 8, padding: "2px 8px", background: P.red, borderRadius: 6, fontSize: 24 }}>0:48 · 3RD</span>
      </div>
      <div style={{ position: "absolute", left: 0, top: 150 }}>
        <RinkDiagram w={890} h={340}>
          <div style={{ position: "absolute", left: 798, top: 120, fontFamily: HAND, fontSize: 30, color: P.red, fontWeight: 700 }}>empty!</div>
          <Play t={t} tracks={[...van, ...bos, ull]} puck={puck} trailFrom={fire} puckWho puckSize={58} />
          {t > fire && t < g && <div style={{ position: "absolute", left: sample(puck, t).x - 40, top: sample(puck, t).y - sample(puck, t).z - 90, fontFamily: HAND, fontSize: 40, fontWeight: 700, color: P.red, zIndex: 1000 }}>WHEEE!</div>}
          {t > g + 0.2 && <div style={{ position: "absolute", left: 826, top: 150, zIndex: 1000 }}><DizzyStars /></div>}
          {lit && <div style={{ position: "absolute", left: 808, top: 76, width: 40, height: 30, borderRadius: 8, background: "#ff3b30", boxShadow: "0 0 44px 18px #ff3b3088", border: `4px solid ${P.ink}` }} />}
        </RinkDiagram>
      </div>
      <Sequence from={F(g) + 30} layout="none"><div style={{ position: "absolute", left: 0, top: 150, width: 890, height: 340 }}><ReplayOverlay cx={826} cy={170} /></div></Sequence>
      <div style={{ position: "absolute", left: 20, top: 505, fontFamily: HAND, fontSize: 38, color: P.ink }}>chip-in → Ullmark lifts it over everyone → empty net</div>
      <div style={{ position: "absolute", left: 430, top: 560 }}><Stamp color={P.teal} at={lf(from, at("p_ullmark", "took"))} rot={-4} size={38}>FIRST GOALIE GOAL SINCE 2020</Stamp></div>
      <BoardFoot source="NHL.com · CBC · ESPN (recreation)" />
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
