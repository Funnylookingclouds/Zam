/** ZAM – "Hockey's Wildest Moments" #3 (Daily Facts): Orr's flying goal (May 10 1970), Gretzky 50 in 39 (Dec 30 1981),
 *  Detroit's octopus (1952), Selänne's glove shot + 76-goal rookie record (1993). The gang acts it out on the boards. */
import React from "react";
import { Audio, Sequence, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import words from "../data/wild03_words.json";
import { P, HAND, clamp, onTwos, PaperCard, Stamp } from "../presenter/kit";
import { ComicBurst } from "../presenter/banana";
import { Mascot, type Mood } from "../mascots/Gang";
import { BoardFoot, HalfStage, Header, Play, type Band, type Key, type Track, type W } from "../zam/common";
import { FPS, makeEpisode, timing, type SceneDef } from "../zam/Episode";

const WORDS = words as W[];
const { S, at } = timing(WORDS);
const TAG = "ZAM · WILDEST MOMENTS #3";
const MOOD: Record<string, Mood> = { z_hook: "wow", p_orr: "smug", h_orr: "wow", b_orr: "grumpy", z_wayne: "wow", h_wayne: "talk", c_wayne: "grumpy", z_octo: "wow", b_octo: "grumpy", z_me: "tired", p_selanne: "laugh", h_selanne: "wow", p_toss: "smug", b_end: "grumpy" };
const M = (id: string, who: Track["who"], s: number, keys: Key[], extra: Partial<Track> = {}): Track => ({ id, c1: "", c2: "", n: "", kind: "mascot", who, s, keys, ...extra });
const useT = (from: number) => from + useCurrentFrame() / FPS;
const fr = (from: number, news: number) => Math.round((news - from) * FPS);
const Mini: React.FC<{ a: string; b: string; sa: number; sb: number; clock: string }> = ({ a, b, sa, sb, clock }) => (
  <div style={{ position: "absolute", right: 0, top: 70, display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", background: P.ink, borderRadius: 12, border: `4px solid ${P.mustard}`, color: "#fff", fontWeight: 900, fontSize: 30 }}>
    {a} <span style={{ color: "#f7d84a", fontSize: 40 }}>{sa}</span> – <span style={{ color: "#f7d84a", fontSize: 40 }}>{sb}</span> {b}
    <span style={{ marginLeft: 8, padding: "2px 8px", background: P.red, borderRadius: 6, fontSize: 24 }}>{clock}</span>
  </div>
);
const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => <div style={{ position: "absolute", left: 16, top: 14, padding: "2px 12px", background: P.red, color: "#fff", fontSize: 28, fontWeight: 900, zIndex: 1001 }}>{children}</div>;
const Approx: React.FC = () => <div style={{ position: "absolute", left: 18, bottom: 8, fontFamily: HAND, fontSize: 26, color: P.muted, zIndex: 1001 }}>the gang's recreation · paths approx.</div>;

const Octopus: React.FC<{ s?: number; lit?: number }> = ({ s = 220, lit = 0 }) => {
  const f = onTwos(useCurrentFrame());
  return (
    <svg width={s} height={s} viewBox="-110 -100 220 220" style={{ overflow: "visible" }}>
      {[...Array(8)].map((_, i) => { const a = (Math.PI * (0.1 + (i / 7) * 0.8)); const w = Math.sin(f / 6 + i) * 10; return <path key={i} d={`M${Math.cos(a) * 40} ${20} q${Math.cos(a) * 50 + w} 50 ${Math.cos(a) * 80} ${70 + (i % 2) * 15} q${-w} 10 ${Math.cos(a) * 10} -10`} stroke={i < lit ? P.mustard : "#7c3aed"} strokeWidth={16} fill="none" strokeLinecap="round" />; })}
      <ellipse cx={0} cy={-20} rx={62} ry={66} fill="#8b5cf6" stroke={P.ink} strokeWidth={6} />
      {[-22, 22].map((x) => <g key={x}><circle cx={x} cy={-18} r={13} fill="#fff" stroke={P.ink} strokeWidth={4} /><circle cx={x + 3} cy={-15} r={6} fill={P.ink} /></g>)}
      <path d="M-14 12 Q0 22 14 12" stroke={P.ink} strokeWidth={5} fill="none" strokeLinecap="round" />
    </svg>
  );
};
const Glove: React.FC<{ s?: number }> = ({ s = 90 }) => (
  <svg width={s} height={s} viewBox="0 0 100 100"><rect x={15} y={35} width={70} height={55} rx={14} fill="#a16207" stroke={P.ink} strokeWidth={6} />{[0, 1, 2, 3].map((i) => <rect key={i} x={18 + i * 17} y={10} width={14} height={36} rx={7} fill="#a16207" stroke={P.ink} strokeWidth={5} />)}</svg>
);

// ------------------------------------------------------------------ boards
const HookBoard: React.FC<{ from: number }> = ({ from }) => {
  const items: [string, string, string][] = [["FLYING GOAL", P.red, "wildest"], ["50 IN 39", P.mustard, "round"], ["OCTOPUS!", "#7c3aed", "three"], ["GLOVE SHOT", P.teal, "lets"]];
  return (
    <PaperCard w={960} h={740} seed="hook3" tag={TAG}>
      <div style={{ fontSize: 112, fontWeight: 900, lineHeight: 0.95, letterSpacing: -2, marginTop: 10 }}>HOCKEY'S<br />WILDEST<br />MOMENTS <span style={{ color: P.red }}>#3</span></div>
      <div style={{ fontFamily: HAND, fontSize: 60, color: P.red, marginTop: 6 }}>any year · any era</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, display: "flex", flexWrap: "wrap", gap: 18 }}>
        {items.map(([txt, col, w], i) => <Stamp key={txt} color={col} at={fr(from, at("z_hook", w)) - 2} rot={[-6, 4, -3, 5][i]} size={42}>{txt}</Stamp>)}
      </div>
    </PaperCard>
  );
};

// Orr, May 10 1970: Sanderson's feed, Orr slips it past Glenn Hall 40 s into OT, Noel Picard trips him and he flies.
const OrrBoard: React.FC<{ from: number }> = ({ from }) => {
  const t = useT(from);
  const BOS: Band = { c1: "#111", c2: "#fcb514", n: 4 }, STL: Band = { c1: "#002f87", c2: "#fcb514", n: "STL" };
  const shot = at("p_orr", "scores"), goal = shot + 0.45, flyS = at("p_orr", "flies") - 0.4, land = flyS + 1.3;
  const jump = S("b_orr").start;
  const orr: Track = M("orr", "clubby", 140, [[from, 160, 300], [shot, 600, 250], [flyS, 700, 230, 0], [flyS + 0.6, 790, 210, 110], [land, 860, 260, 0]], { band: BOS, mood: t > flyS ? "laugh" : "wow", rot: t > flyS && t < land ? () => -35 : undefined });
  const tracks: Track[] = [
    M("hall", "biscuit", 150, [[0, 762, 200], [jump, 762, 200], [jump + 0.2, 762, 175], [jump + 0.35, 762, 200]], { band: { c1: "#002f87", c2: "#fcb514", n: 1 }, flip: true, mood: t > goal ? "dizzy" : "wow", squash: (tt) => (tt > jump + 0.33 && tt < jump + 0.5 ? 0.8 : 1) }),
    M("picard", "helmy", 120, [[from, 520, 360], [flyS, 660, 300], [land, 640, 320]], { band: STL, mood: "scared" }),
    orr,
  ];
  const puck: Key[] = [[from, 230, 340], [shot, 670, 290], [goal, 836, 200]];
  return (
    <PaperCard w={960} h={740} seed="orr" tag={TAG}>
      <Header title="BOBBY ORR" sub="May 10, 1970 · Cup Final" />
      <Mini a="BOS" b="STL" sa={t > goal ? 4 : 3} sb={3} clock="OT · 0:40" />
      <div style={{ position: "absolute", left: 0, top: 128 }}>
        <HalfStage light={t > goal && t < goal + 0.7}>
          <Play t={t} tracks={tracks} puck={puck} puckWho puckSize={60} trailFrom={from + 0.3} />
          <Label>{t < goal ? "OVERTIME" : t < land ? "TRIPPED… AND FLYING!" : "\"THE GOAL\""}</Label>
          <Approx />
        </HalfStage>
      </div>
      <div style={{ position: "absolute", left: 40, top: 548, whiteSpace: "nowrap" }}><Stamp color={P.red} at={fr(from, at("h_orr", "1941"))} rot={-3} size={38}>BOSTON'S FIRST CUP SINCE 1941</Stamp></div>
      <BoardFoot source="NHL.com · ESPN" />
    </PaperCard>
  );
};

// Gretzky, Dec 30 1981: five goals in a 7–5 win over Philadelphia, the 50th into an empty net with 3 s left – 50 in 39 games.
const WayneBoard: React.FC<{ from: number }> = ({ from }) => {
  const t = useT(from);
  const n = Math.round(interpolate(t, [at("z_wayne", "fifty") - 0.4, at("z_wayne", "fifty") + 0.4], [45, 50], clamp));
  const t0 = S("h_wayne").start, t1 = S("h_wayne").end + 0.2;
  const step = (t1 - t0) / 5;
  const k = Math.min(4, Math.max(0, Math.floor((t - t0) / step)));
  const base = t0 + k * step;
  const empty = k === 4;
  const EDM: Band = { c1: "#041e42", c2: "#fc4c02", n: 99 }, PHI: Band = { c1: "#f74902", c2: "#111", n: "PHI" };
  const tracks: Track[] = [M("w", "clubby", 120, [[base, 300, 120 + (k % 3) * 60], [base + step * 0.45, 560, 160 + (k % 2) * 40]], { band: EDM })];
  if (!empty) tracks.push(M("g", "biscuit", 130, [[0, 770, 165]], { band: PHI, flip: true, mood: k >= 3 ? "dizzy" : "grumpy" }));
  const puck: Key[] = [[base, 370, 160 + (k % 3) * 60], [base + step * 0.45, 630, 200 + (k % 2) * 40], [base + step * 0.8, 836, 165]];
  const scored = t < t0 ? 0 : Math.min(5, Math.floor((t - t0) / step + 0.25));
  return (
    <PaperCard w={960} h={740} seed="wg" tag={TAG}>
      <Header title="WAYNE GRETZKY" sub="Dec 30, 1981 · Oilers 7–5 Flyers" accent={P.mustard} />
      <div style={{ position: "absolute", left: 0, top: 128, display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ display: "flex", gap: 8 }}>{String(n).split("").map((d, i) => <div key={i} style={{ width: 120, height: 160, background: "#1d1a17", color: "#f7d84a", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 130, fontWeight: 900, border: `5px solid ${P.ink}` }}>{d}</div>)}</div>
        <div style={{ fontSize: 50, fontWeight: 900, lineHeight: 1.05 }}>GOALS<div style={{ fontFamily: HAND, fontSize: 52, color: P.red, fontWeight: 700 }}>in 39 games!</div></div>
      </div>
      {t >= t0 - 0.2 && (
        <div style={{ position: "absolute", left: 0, top: 310 }}>
          <HalfStage h={230} light={t > base + step * 0.8 && t < base + step}>
            <Play t={t} tracks={tracks} puck={puck} puckWho puckSize={48} trailFrom={base} />
            <Label>GOAL {Math.min(5, k + 1)} OF 5{empty ? " · EMPTY NET · 3 s LEFT" : ""}</Label>
          </HalfStage>
        </div>
      )}
      <div style={{ position: "absolute", left: 0, top: 552, display: "flex", gap: 10, alignItems: "center" }}>
        {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ width: 70, height: 34, borderRadius: "50%", background: i < scored ? "#111" : "#1111", border: `4px solid ${i < scored ? P.ink : "#0002"}` }} />)}
        <div style={{ marginLeft: 12, fontFamily: HAND, fontSize: 40, color: P.muted }}>that night</div>
      </div>
      <div style={{ position: "absolute", left: 590, top: 150, whiteSpace: "nowrap" }}><Stamp color={P.red} at={fr(from, S("c_wayne").start)} rot={-4} size={34}>50 BEFORE<br />GAME 40</Stamp></div>
      <BoardFoot source="NHL.com · Wikipedia" />
    </PaperCard>
  );
};

// Detroit, April 1952: the Cusimano brothers throw an octopus – eight arms for the eight wins a Cup then took.
const OctoBoard: React.FC<{ from: number }> = ({ from }) => {
  const t = useT(from);
  const throwT = at("z_octo", "octopus") - 0.4, land = throwT + 0.6;
  const e1 = at("z_octo", "eight", 0), e2 = at("z_octo", "cup");
  const lit = Math.round(interpolate(t, [e1, e2], [0, 8], clamp));
  const zamIn = S("b_octo").start + 0.3;
  const ox = t < land ? interpolate(t, [throwT, land], [880, 380], clamp) : 380;
  const oy = t < land ? interpolate(t, [throwT, land], [-40, 140], clamp) - Math.sin(interpolate(t, [throwT, land], [0, Math.PI], clamp)) * 120 : 140;
  const zx = interpolate(t, [zamIn, zamIn + 0.9], [-300, 230], { ...clamp, easing: Easing.out(Easing.quad) });
  const carried = t > S("z_me").start - 0.1;
  return (
    <PaperCard w={960} h={740} seed="octo" tag={TAG}>
      <Header title="THE DETROIT OCTOPUS" sub="April 1952 · the Cusimano brothers" accent="#7c3aed" />
      <div style={{ position: "absolute", left: 0, top: 128, width: 892, height: 400, background: "#f4fbff", border: `6px solid ${P.ink}`, borderRadius: 26, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 70, background: "repeating-linear-gradient(90deg,#c8102e 0 40px,#fff 40px 80px)", borderBottom: `6px solid ${P.ink}` }} />
        {t >= throwT && <div style={{ position: "absolute", left: (carried ? zx + 60 : ox) - 110, top: (carried ? 70 : oy), transform: `rotate(${t < land ? (t - throwT) * 600 : 0}deg)`, zIndex: 5 }}><Octopus s={220} lit={lit} /></div>}
        {t >= e1 && t < zamIn && <div style={{ position: "absolute", left: 620, top: 110, fontSize: 70, fontWeight: 900, color: "#7c3aed", zIndex: 6 }}>{lit} / 8<div style={{ fontSize: 34 }}>WINS</div></div>}
        {t >= zamIn && <div style={{ position: "absolute", left: zx, top: 170, zIndex: 4 }}><Mascot who="zam" size={200} mood={carried ? "tired" : "wow"} talking={carried} open={carried ? 0.3 : 0} seed="octozam" /></div>}
        <Label>{t < throwT ? "OLYMPIA STADIUM" : t < zamIn ? "8 ARMS = 8 WINS" : "CLEAN-UP CREW"}</Label>
      </div>
      <div style={{ position: "absolute", left: 40, top: 548, whiteSpace: "nowrap" }}><Stamp color="#7c3aed" at={fr(from, e2)} rot={-3} size={38}>8 WINS FOR THE CUP (THEN)</Stamp></div>
      <BoardFoot source="Wikipedia · ClickOnDetroit (cartoon recreation)" />
    </PaperCard>
  );
};

// Selänne, Mar 2 1993: goal No. 54 breaks Mike Bossy's rookie record (53); he tosses his glove up and "shoots" it. 76 by season's end.
const SelanneBoard: React.FC<{ from: number }> = ({ from }) => {
  const t = useT(from);
  const WPG: Band = { c1: "#041e42", c2: "#ac162c", n: 8 }, QUE: Band = { c1: "#3366cc", c2: "#fff", n: "QUE" };
  const shot = at("p_selanne", "breaks") - 0.3, goal = shot + 0.5;
  const toss = at("p_selanne", "glove") - 0.7, bang = at("p_selanne", "glove");
  const sev = S("h_selanne").start - 0.1;
  const tracks: Track[] = [
    M("q", "biscuit", 140, [[0, 770, 200]], { band: QUE, flip: true, mood: t > goal ? "dizzy" : "wow" }),
    M("sel", "clubby", 140, [[from, 200, 280], [shot, 560, 240], [toss, 520, 230]], { band: WPG, mood: t > goal ? "laugh" : "wow", rot: t > toss - 0.1 && t < bang + 0.4 ? () => -25 : undefined }),
  ];
  const puck: Key[] = [[from, 270, 320], [shot, 630, 280], [goal, 836, 200]];
  const gy = t < toss ? 240 : t < bang ? interpolate(t, [toss, bang], [240, 40], { ...clamp, easing: Easing.out(Easing.quad) }) : interpolate(t, [bang, bang + 0.6], [40, 330], { ...clamp, easing: Easing.in(Easing.quad) });
  return (
    <PaperCard w={960} h={740} seed="sel" tag={TAG}>
      <Header title="TEEMU SELÄNNE" sub="Mar 2, 1993 · Jets vs Nordiques" accent={P.teal} />
      <div style={{ position: "absolute", left: 0, top: 128 }}>
        {t < sev ? (
          <HalfStage light={t > goal && t < goal + 0.6}>
            <Play t={t} tracks={tracks} puck={puck} puckWho puckSize={60} />
            {t >= toss && <div style={{ position: "absolute", left: 470, top: gy, transform: `rotate(${(t - toss) * 500}deg)`, zIndex: 1100 }}><Glove s={90} /></div>}
            {t >= bang && t < bang + 0.4 && <div style={{ position: "absolute", left: 380, top: 30, fontWeight: 900, fontStyle: "italic", fontSize: 80, color: "#fff", WebkitTextStroke: `6px ${P.ink}`, paintOrder: "stroke fill", zIndex: 1101 }}>BANG!</div>}
            <div style={{ position: "absolute", right: 120, top: 14, padding: "4px 14px", background: P.ink, color: "#f7d84a", fontWeight: 900, fontSize: 34, borderRadius: 10, zIndex: 1001 }}>GOAL #{t > goal ? 54 : 53}</div>
            <Label>{t < goal ? "ROOKIE SEASON" : "BREAKS BOSSY'S 53!"}</Label>
            <Approx />
          </HalfStage>
        ) : (
          <div style={{ width: 892, height: 400, display: "flex", alignItems: "center", gap: 30 }}>
            <div style={{ fontSize: 300, fontWeight: 900, color: P.teal, lineHeight: 1 }}>76</div>
            <div style={{ fontSize: 56, fontWeight: 900, lineHeight: 1.1 }}>GOALS AS<br />A ROOKIE<div style={{ fontFamily: HAND, fontSize: 48, color: P.red, fontWeight: 700 }}>1992–93 · still the record</div></div>
          </div>
        )}
      </div>
      <div style={{ position: "absolute", left: 40, top: 548, whiteSpace: "nowrap" }}><Stamp color={P.teal} at={fr(from, at("h_selanne", "still"))} rot={-3} size={40}>NHL ROOKIE RECORD</Stamp></div>
      <BoardFoot source="NHL.com · Guinness World Records" />
    </PaperCard>
  );
};

const EndBoard: React.FC<{ from: number }> = ({ from }) => {
  const t = useT(from);
  return (
    <PaperCard w={960} h={740} seed="end3" tag={TAG}>
      <Header title="BISCUIT'S GLOVE" sub="not for tossing" />
      <div style={{ position: "absolute", left: 60, top: 150 }}><Mascot who="biscuit" size={360} mood="grumpy" seed="eb" /></div>
      <div style={{ position: "absolute", left: 330, top: 380, transform: `rotate(${Math.sin(t * 6) * 6}deg)` }}><Glove s={160} /></div>
      <div style={{ position: "absolute", left: 600, top: 200 }}><Mascot who="pucky" size={260} mood="smug" seed="ep" /></div>
      <div style={{ position: "absolute", left: 470, top: 520, whiteSpace: "nowrap" }}><Stamp color={P.red} at={fr(from, at("b_end", "only"))} rot={6} size={40}>ONLY SAVE TODAY</Stamp></div>
    </PaperCard>
  );
};

const scenes: SceneDef[] = [
  { id: "hook", from: 0, Board: HookBoard },
  { id: "orr", from: S("p_orr").start - 0.2, Board: OrrBoard, slap: "left" },
  { id: "wayne", from: S("z_wayne").start - 0.2, Board: WayneBoard, wipe: true },
  { id: "octo", from: S("z_octo").start - 0.2, Board: OctoBoard, slap: "left", wipe: true },
  { id: "sel", from: S("p_selanne").start - 0.2, Board: SelanneBoard, wipe: true },
  { id: "end", from: S("p_toss").start - 0.2, Board: EndBoard, slap: "left" },
];

const Extras: React.FC<{ N: (s: number) => number }> = ({ N }) => {
  const orrGoal = at("p_orr", "scores") + 0.45, t0 = S("h_wayne").start, step = (S("h_wayne").end + 0.2 - t0) / 5;
  return (
    <>
      <ComicBurst text="LET'S GO!" at={N(at("z_hook", "lets"))} x={760} y={1240} color={P.red} size={0.8} dur={40} />
      <Sequence from={N(orrGoal)} durationInFrames={110}><Audio src={staticFile("sfx/horn.wav")} volume={0.5} /></Sequence>
      <ComicBurst text="HE FLIES!" at={N(at("p_orr", "flies"))} x={780} y={1240} color={P.mustard} size={0.75} dur={60} />
      <Sequence from={N(at("p_orr", "flies"))} durationInFrames={40}><Audio src={staticFile("whoosh.wav")} volume={0.6} /></Sequence>
      <Sequence from={N(at("b_orr", "jump"))} durationInFrames={40}><Audio src={staticFile("brand/boing.wav")} volume={0.5} /></Sequence>
      <Sequence from={N(at("z_wayne", "fifty"))} durationInFrames={60}><Audio src={staticFile("brand/ding.wav")} volume={0.5} /></Sequence>
      {[0, 1, 2, 3, 4].map((k) => <Sequence key={k} from={N(t0 + k * step + step * 0.8)} durationInFrames={20}><Audio src={staticFile("pop.wav")} volume={0.6} /></Sequence>)}
      <ComicBurst text="50 IN 39!" at={N(at("z_wayne", "thirtynine"))} x={780} y={1240} color={P.mustard} size={0.75} dur={60} />
      <Sequence from={N(at("z_octo", "octopus") - 0.4)} durationInFrames={40}><Audio src={staticFile("whoosh.wav")} volume={0.6} /></Sequence>
      <ComicBurst text="SPLAT!" at={N(at("z_octo", "octopus") + 0.2)} x={780} y={1240} color="#8b5cf6" size={0.75} dur={50} />
      <Sequence from={N(S("z_me").start)} durationInFrames={40}><Audio src={staticFile("brand/rimshot.wav")} volume={0.6} /></Sequence>
      <Sequence from={N(at("p_selanne", "breaks") + 0.2)} durationInFrames={110}><Audio src={staticFile("sfx/horn.wav")} volume={0.5} /></Sequence>
      <Sequence from={N(at("p_selanne", "glove"))} durationInFrames={40}><Audio src={staticFile("brand/impact.wav")} volume={0.6} /></Sequence>
      <Sequence from={N(at("h_selanne", "still"))} durationInFrames={60}><Audio src={staticFile("brand/ding.wav")} volume={0.55} /></Sequence>
      <Sequence from={N(at("b_end", "save"))} durationInFrames={40}><Audio src={staticFile("brand/rimshot.wav")} volume={0.6} /></Sequence>
    </>
  );
};

export const { Comp: Wild03, FRAMES: WILD03_FRAMES } = makeEpisode({ words: WORDS, vo: "ep/wild03.mp3", mood: MOOD, scenes, Extras });
