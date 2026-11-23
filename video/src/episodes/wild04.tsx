/** ZAM – "Hockey's Wildest Moments" #4 (Daily Facts): longest game (6 OT, ended 2:25 a.m., Mar 1936), Steve Smith's own goal on his
 *  23rd birthday (Game 7, Apr 30 1986), Gordie Howe at 51 playing all 80 games + a shift with his sons (1979–80), fastest goal = 5 s. */
import React from "react";
import { Audio, Sequence, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import words from "../data/wild04_words.json";
import { P, HAND, clamp, onTwos, PaperCard, Stamp } from "../presenter/kit";
import { ComicBurst } from "../presenter/banana";
import { Mascot, type Mood } from "../mascots/Gang";
import { BoardFoot, HalfStage, Header, Play, sample, type Band, type Key, type Track, type W } from "../zam/common";
import { FPS, makeEpisode, timing, type SceneDef } from "../zam/Episode";

const WORDS = words as W[];
const { S, at } = timing(WORDS);
const TAG = "ZAM · WILDEST MOMENTS #4";
const MOOD: Record<string, Mood> = { z_hook: "wow", h_long: "wow", p_long: "laugh", b_long: "tired", z_smith: "wow", p_smith: "laugh", b_smith: "sad", c_howe: "smug", h_howe: "wow", c_myday: "grumpy", a_fast: "smug", p_skates: "laugh", b_end: "grumpy" };
const M = (id: string, who: Track["who"], s: number, keys: Key[], extra: Partial<Track> = {}): Track => ({ id, c1: "", c2: "", n: "", kind: "mascot", who, s, keys, ...extra });
const useT = (from: number) => from + useCurrentFrame() / FPS;
const fr = (from: number, news: number) => Math.round((news - from) * FPS);
const Mini: React.FC<{ a: string; b: string; sa: number; sb: number; clock: string }> = ({ a, b, sa, sb, clock }) => (
  <div style={{ position: "absolute", right: 0, top: 70, display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", background: P.ink, borderRadius: 12, border: `4px solid ${P.mustard}`, color: "#fff", fontWeight: 900, fontSize: 30, zIndex: 5 }}>
    {a} <span style={{ color: "#f7d84a", fontSize: 40 }}>{sa}</span> – <span style={{ color: "#f7d84a", fontSize: 40 }}>{sb}</span> {b}
    <span style={{ marginLeft: 8, padding: "2px 8px", background: P.red, borderRadius: 6, fontSize: 24 }}>{clock}</span>
  </div>
);
const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => <div style={{ position: "absolute", left: 16, top: 14, padding: "2px 12px", background: P.red, color: "#fff", fontSize: 26, fontWeight: 900, zIndex: 1001 }}>{children}</div>;
const Approx: React.FC = () => <div style={{ position: "absolute", left: 18, bottom: 6, fontFamily: HAND, fontSize: 24, color: P.muted, zIndex: 1001 }}>the gang's recreation · paths approx.</div>;

// ------------------------------------------------------------------ boards
const HookBoard: React.FC<{ from: number }> = ({ from }) => {
  const items: [string, string, string][] = [["6 OVERTIMES", "#1e3a8a", "wildest"], ["OWN GOAL", P.red, "round"], ["AGE 51", P.green, "four"], ["5 SECONDS", P.teal, "lets"]];
  return (
    <PaperCard w={960} h={740} seed="hook4" tag={TAG}>
      <div style={{ fontSize: 112, fontWeight: 900, lineHeight: 0.95, letterSpacing: -2, marginTop: 10 }}>HOCKEY'S<br />WILDEST<br />MOMENTS <span style={{ color: P.red }}>#4</span></div>
      <div style={{ fontFamily: HAND, fontSize: 60, color: P.red, marginTop: 6 }}>any year · any era</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, display: "flex", flexWrap: "wrap", gap: 18 }}>
        {items.map(([txt, col, w], i) => <Stamp key={txt} color={col} at={fr(from, at("z_hook", w)) - 2} rot={[-6, 4, -3, 5][i]} size={42}>{txt}</Stamp>)}
      </div>
    </PaperCard>
  );
};

// Mar 24–25 1936: Detroit 1–0 Montreal Maroons, Mud Bruneteau in the 6th overtime, game over at 2:25 a.m. (176:30 played).
const LongBoard: React.FC<{ from: number }> = ({ from }) => {
  const t = useT(from);
  const goal = at("p_long", "scored") + 0.3;
  const k = interpolate(t, [from, goal], [0, 1], clamp); // 8:30 pm → 2:25 am
  const mins = 20 * 60 + 30 + k * (5 * 60 + 55);
  const hh = Math.floor(mins / 60) % 24, mm = Math.floor(mins % 60);
  const label = `${((hh + 11) % 12) + 1}:${String(mm).padStart(2, "0")} ${hh >= 12 && hh < 24 ? "PM" : "AM"}`;
  const ot = Math.min(6, Math.floor(interpolate(t, [from + 0.3, at("h_long", "overtimes") + 0.3], [0, 6], clamp)));
  const DET: Band = { c1: "#ce1126", c2: "#fff", n: "DET" }, MTL: Band = { c1: "#7b1e1e", c2: "#fff", n: "MTL" };
  const tracks: Track[] = [
    M("g", "biscuit", 120, [[0, 770, 100]], { band: MTL, flip: true, mood: t < goal ? "sleep" : "dizzy" }),
    M("b", "clubby", 120, [[from, 200, 120], [goal - 0.6, 560, 110], [goal + 0.5, 600, 120]], { band: DET, mood: t < goal - 1 ? "tired" : "wow" }),
  ];
  const puck: Key[] = [[from, 270, 150], [goal - 0.6, 630, 140], [goal, 836, 120]];
  return (
    <PaperCard w={960} h={740} seed="long" tag={TAG}>
      <Header title="THE LONGEST GAME" sub="Mar 1936 · playoffs" accent="#1e3a8a" />
      <Mini a="DET" b="MTL" sa={t > goal ? 1 : 0} sb={0} clock={`${ot ? ot : ""}OT`} />
      <div style={{ position: "absolute", left: 0, top: 130, width: 892, height: 200, background: "linear-gradient(180deg,#0b1026,#1e3a8a)", borderRadius: 18, border: `6px solid ${P.ink}`, overflow: "hidden" }}>
        {[...Array(14)].map((_, i) => <div key={i} style={{ position: "absolute", left: (i * 131) % 860, top: 20 + (i * 47) % 150, color: "#fff", fontSize: 22, opacity: (onTwos(Math.round(t * 60)) / 10 + i) % 3 < 1.5 ? 1 : 0.3 }}>✦</div>)}
        <div style={{ position: "absolute", left: 30, top: 20, width: 160, height: 160, borderRadius: "50%", background: "#fff", border: `8px solid ${P.ink}` }}>
          <div style={{ position: "absolute", left: 72, top: 20, width: 8, height: 60, background: P.ink, transformOrigin: "4px 60px", transform: `rotate(${(mins % 60) * 6}deg)` }} />
          <div style={{ position: "absolute", left: 71, top: 40, width: 10, height: 40, background: P.red, transformOrigin: "5px 40px", transform: `rotate(${(mins / 60 % 12) * 30}deg)` }} />
        </div>
        <div style={{ position: "absolute", left: 230, top: 30, fontFamily: "'DejaVu Sans Mono', monospace", fontWeight: 900, fontSize: 80, color: "#7CFC9A" }}>{label}</div>
        <div style={{ position: "absolute", left: 232, top: 130, display: "flex", gap: 10 }}>{[1, 2, 3, 4, 5, 6].map((i) => <div key={i} style={{ padding: "2px 10px", borderRadius: 8, background: i <= ot ? P.mustard : "#ffffff33", color: P.ink, fontWeight: 900, fontSize: 26 }}>OT{i}</div>)}</div>
        <div style={{ position: "absolute", right: 30, top: 20, fontSize: 90 }}>🌙</div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 345 }}>
        <HalfStage h={195} light={t > goal && t < goal + 0.7}>
          <Play t={t} tracks={tracks} puck={puck} puckWho puckSize={50} trailFrom={goal - 0.6} />
          {t < goal && <div style={{ position: "absolute", left: 680, top: 10, fontFamily: HAND, fontWeight: 700, fontSize: 44, color: "#2563eb", zIndex: 1001 }}>z z Z</div>}
          <Label>{t < goal ? "STILL 0–0…" : "MUD BRUNETEAU SCORES!"}</Label>
        </HalfStage>
      </div>
      <div style={{ position: "absolute", left: 20, top: 552, whiteSpace: "nowrap" }}><Stamp color="#1e3a8a" at={fr(from, goal + 0.3)} rot={-2} size={30}>LONGEST GAME IN NHL HISTORY · 176:30</Stamp></div>
      <BoardFoot source="NHL.com · Hockey-Reference" />
    </PaperCard>
  );
};

// Apr 30 1986, Game 7: Smith's outlet pass from behind the net banks in off Grant Fuhr's skate → Calgary 3–2; it was Smith's 23rd birthday.
const SmithBoard: React.FC<{ from: number }> = ({ from }) => {
  const t = useT(from);
  const pass = at("z_smith", "pass") - 0.1, hit = at("z_smith", "goalie") - 0.1, goal = at("z_smith", "in") - 0.05;
  const bday = at("p_smith", "birthday");
  const EDM: Band = { c1: "#041e42", c2: "#fc4c02", n: "EDM" };
  const smith = M("s", "clubby", 130, [[from, 780, 330], [pass, 760, 300]], { band: EDM, mood: t > goal ? "scared" : "wow" });
  const tracks: Track[] = [M("f", "biscuit", 140, [[0, 545, 200]], { band: { c1: "#041e42", c2: "#fc4c02", n: 31 }, flip: true, mood: t > goal ? (t > bday ? "sad" : "scared") : "wow", squash: (tt) => (tt > hit && tt < hit + 0.2 ? 0.8 : 1) }), smith];
  const puck: Key[] = [[from, 740, 340], [pass, 730, 320], [hit, 560, 268], [goal, 632, 205]];
  const sp = sample(smith.keys, t);
  return (
    <PaperCard w={960} h={740} seed="smith" tag={TAG}>
      <Header title="STEVE SMITH" sub="Apr 30, 1986 · playoffs" />
      <Mini a="CGY" b="EDM" sa={t > goal ? 3 : 2} sb={2} clock="GAME 7" />
      <div style={{ position: "absolute", left: 0, top: 128, width: 892, height: 400, background: "#f4fbff", border: `6px solid ${P.ink}`, borderRadius: 26, overflow: "hidden" }}>
        <svg width={892} height={400} style={{ position: "absolute" }}>
          <line x1={612} y1={0} x2={612} y2={400} stroke="#d94b3b" strokeWidth={4} />
          <path d="M612 140 a 60 60 0 0 0 0 120" fill="#bfe3ff" stroke="#d94b3b" strokeWidth={3} />
          <rect x={612} y={165} width={40} height={70} fill="#fff" stroke="#d94b3b" strokeWidth={6} />
        </svg>
        <Play t={t} tracks={tracks} puck={puck} puckWho puckSize={56} trailFrom={pass} />
        <div style={{ position: "absolute", left: sp.x - 22, top: sp.y - 160, width: 0, height: 0, borderLeft: "26px solid transparent", borderRight: "26px solid transparent", borderBottom: "60px solid #f472b6", zIndex: 1000 }} />
        {t > goal && t < goal + 0.7 && <div style={{ position: "absolute", left: 612, top: 100, width: 40, height: 30, borderRadius: 8, background: "#ff3b30", boxShadow: "0 0 44px 18px #ff3b3088", border: `4px solid ${P.ink}`, zIndex: 1000 }} />}
        {t >= bday - 0.1 && <div style={{ position: "absolute", left: 60, top: 160, width: 220, zIndex: 1001, textAlign: "center" }}><div style={{ fontSize: 40 }}>🕯️🕯️</div><div style={{ height: 90, background: "#f9a8d4", border: `6px solid ${P.ink}`, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 56 }}>23</div></div>}
        <Label>{t < hit ? "BEHIND HIS OWN NET" : t < goal ? "OFF THE GOALIE'S SKATE…" : "…AND IN. OOPS."}</Label>
        <Approx />
      </div>
      <div style={{ position: "absolute", left: 30, top: 548, whiteSpace: "nowrap" }}><Stamp color={P.red} at={fr(from, bday)} rot={-3} size={34}>OWN GOAL · ON HIS 23RD BIRTHDAY</Stamp></div>
      <BoardFoot source="SI · FlamesNation" />
    </PaperCard>
  );
};

// 1979–80: Gordie Howe, 51 at the start of the season, plays all 80 games for Hartford; Mar 9 1980 one shift with sons Mark and Marty.
const HoweBoard: React.FC<{ from: number }> = ({ from }) => {
  const t = useT(from);
  const games = Math.round(interpolate(t, [at("c_howe", "played") - 0.3, at("c_howe", "games")], [0, 80], clamp));
  const sons = t >= S("h_howe").start - 0.15;
  const HFD = (n: string | number): Band => ({ c1: "#00539b", c2: "#00a651", n });
  const loop = (y: number, d: number): Key[] => [...Array(8)].map((_, i) => [from + i * 0.9 + d, i % 2 ? 640 : 200, y] as Key);
  const tracks: Track[] = [M("gh", "clubby", 140, loop(130, 0), { band: HFD(9), mood: "smug" })];
  if (sons) { tracks.push(M("mk", "clubby", 100, loop(60, 0.15), { band: HFD("MARK"), mood: "laugh" })); tracks.push(M("mt", "clubby", 100, loop(210, 0.3), { band: HFD("MARTY"), mood: "laugh" })); }
  const gp = sample(tracks[0].keys, t);
  return (
    <PaperCard w={960} h={740} seed="howe" tag={TAG}>
      <Header title="GORDIE HOWE" sub="1979–80 · Hartford Whalers" accent={P.green} />
      <div style={{ position: "absolute", left: 0, top: 128, display: "flex", gap: 30, alignItems: "center" }}>
        <div style={{ padding: "10px 24px", background: P.ink, color: "#f7d84a", borderRadius: 14, fontWeight: 900, fontSize: 64 }}>AGE 51</div>
        <div style={{ fontSize: 64, fontWeight: 900 }}>{games}<span style={{ fontSize: 36 }}> / 80 GAMES</span></div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 240 }}>
        <HalfStage h={290}>
          <Play t={t} tracks={tracks} />
          <div style={{ position: "absolute", left: gp.x - 34, top: gp.y + 6, width: 68, height: 50, borderRadius: "0 0 34px 34px", background: "#fff", border: `4px solid ${P.ink}`, zIndex: 1000 }} />
          <Label>{sons ? "MAR 9, 1980 · ONE SHIFT WITH HIS SONS" : "MR. HOCKEY, STILL GOING"}</Label>
        </HalfStage>
      </div>
      <div style={{ position: "absolute", left: 40, top: 548, whiteSpace: "nowrap" }}><Stamp color={P.green} at={fr(from, S("c_myday").start)} rot={-3} size={40}>VINTAGE, CERTIFIED</Stamp></div>
      <BoardFoot source="NHL.com" />
    </PaperCard>
  );
};

// NHL record: fastest goal from the opening faceoff = 5 seconds (shared by four players).
const FastBoard: React.FC<{ from: number }> = ({ from }) => {
  const t = useT(from);
  const t0 = at("a_fast", "five") - 0.2, t5 = t0 + 1.0;
  const sec = interpolate(t, [t0, t5], [0, 5], clamp);
  const tracks: Track[] = [
    M("c", "clubby", 120, [[0, 300, 200], [t5 - 0.3, 520, 190]], { band: { c1: P.ink, c2: P.mustard, n: "?" }, mood: "wow" }),
    M("bz", "biscuit", 130, [[0, 760, 300]], { mood: t > S("b_end").start ? "grumpy" : "determined", rot: (tt) => Math.sin(tt * 10) * 6 }),
  ];
  const puck: Key[] = [[0, 300, 220], [t0, 300, 220], [t5 - 0.3, 590, 210], [t5, 836, 200]];
  return (
    <PaperCard w={960} h={740} seed="fast" tag={TAG}>
      <Header title="FASTEST GOAL EVER" sub="from the opening faceoff · NHL record" accent={P.teal} />
      <div style={{ position: "absolute", right: 0, top: 70, padding: "8px 18px", background: P.ink, color: "#7CFC9A", fontFamily: "'DejaVu Sans Mono', monospace", fontWeight: 900, fontSize: 56, borderRadius: 12, border: `4px solid ${P.mustard}`, zIndex: 5 }}>{sec.toFixed(1)} s</div>
      <div style={{ position: "absolute", left: 0, top: 150 }}>
        <HalfStage h={380} light={t > t5 && t < t5 + 0.7}>
          <div style={{ position: "absolute", left: 270, top: 180, width: 60, height: 60, borderRadius: 30, border: "5px solid #d94b3b" }} />
          <Play t={t} tracks={tracks} puck={puck} puckWho puckSize={56} trailFrom={t0} />
          <svg width={200} height={120} style={{ position: "absolute", left: 690, top: 330, zIndex: 1000 }}><path d={`M10 60 C 60 ${10 + Math.sin(t * 8) * 20}, 120 110, 190 ${50 + Math.cos(t * 7) * 20}`} stroke="#fff" strokeWidth={10} fill="none" /><path d={`M10 60 C 60 ${10 + Math.sin(t * 8) * 20}, 120 110, 190 ${50 + Math.cos(t * 7) * 20}`} stroke={P.ink} strokeWidth={3} fill="none" /></svg>
          <Label>{t < t0 ? "FACEOFF…" : t < t5 ? "GO GO GO!" : "GOAL – BISCUIT IS STILL TYING HIS SKATES"}</Label>
        </HalfStage>
      </div>
      <div style={{ position: "absolute", left: 40, top: 548, whiteSpace: "nowrap" }}><Stamp color={P.teal} at={fr(from, t5 + 0.2)} rot={-3} size={38}>5 SECONDS · SHARED BY 4 PLAYERS</Stamp></div>
      <BoardFoot source="The Hockey Writers · Guinness World Records" />
    </PaperCard>
  );
};

const scenes: SceneDef[] = [
  { id: "hook", from: 0, Board: HookBoard },
  { id: "long", from: S("h_long").start - 0.2, Board: LongBoard, slap: "left" },
  { id: "smith", from: S("z_smith").start - 0.2, Board: SmithBoard, wipe: true },
  { id: "howe", from: S("c_howe").start - 0.2, Board: HoweBoard, slap: "left", wipe: true },
  { id: "fast", from: S("a_fast").start - 0.2, Board: FastBoard, wipe: true },
];

const Extras: React.FC<{ N: (s: number) => number }> = ({ N }) => {
  const longGoal = at("p_long", "scored") + 0.3, smithGoal = at("z_smith", "in") - 0.05, fast = at("a_fast", "five") - 0.2 + 1.0;
  return (
    <>
      <ComicBurst text="LET'S GO!" at={N(at("z_hook", "lets"))} x={760} y={1240} color={P.red} size={0.8} dur={40} />
      <Sequence from={N(longGoal)} durationInFrames={110}><Audio src={staticFile("sfx/horn.wav")} volume={0.5} /></Sequence>
      <ComicBurst text="FINALLY!" at={N(longGoal)} x={790} y={1240} color="#1e3a8a" size={0.75} dur={60} />
      <Sequence from={N(at("b_long", "asleep"))} durationInFrames={40}><Audio src={staticFile("brand/boing.wav")} volume={0.4} /></Sequence>
      <Sequence from={N(smithGoal)} durationInFrames={40}><Audio src={staticFile("brand/impact.wav")} volume={0.6} /></Sequence>
      <ComicBurst text="OOPS!" at={N(smithGoal)} x={790} y={1240} color={P.red} size={0.8} dur={60} />
      <Sequence from={N(at("b_smith", "present"))} durationInFrames={40}><Audio src={staticFile("brand/rimshot.wav")} volume={0.6} /></Sequence>
      <Sequence from={N(at("c_howe", "games"))} durationInFrames={50}><Audio src={staticFile("brand/ding.wav")} volume={0.5} /></Sequence>
      <Sequence from={N(at("c_myday", "was"))} durationInFrames={40}><Audio src={staticFile("brand/rimshot.wav")} volume={0.6} /></Sequence>
      <Sequence from={N(fast)} durationInFrames={110}><Audio src={staticFile("sfx/horn.wav")} volume={0.5} /></Sequence>
      <ComicBurst text="5 SECONDS!" at={N(fast)} x={780} y={1240} color={P.teal} size={0.75} dur={60} />
      <Sequence from={N(at("b_end", "doubleknotted"))} durationInFrames={40}><Audio src={staticFile("brand/boing.wav")} volume={0.5} /></Sequence>
    </>
  );
};

export const { Comp: Wild04, FRAMES: WILD04_FRAMES } = makeEpisode({ words: WORDS, vo: "ep/wild04.mp3", mood: MOOD, scenes, Extras });
void Mascot; void Easing;
