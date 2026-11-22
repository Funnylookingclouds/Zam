/** ZAM – "Hockey's Wildest Moments" #2: Ovechkin "The Goal", Sittler 10 points, Svechnikov lacrosse goal, Florida's rat trick. The gang acts it out. */
import React from "react";
import { Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import words from "../data/wild02_words.json";
import { P, HAND, clamp, onTwos, PaperCard, Stamp } from "../presenter/kit";
import { ComicBurst } from "../presenter/banana";
import { Mascot, type Mood } from "../mascots/Gang";
import { BoardFoot, Confetti, HalfStage, Header, Play, sample, type Band, type Key, type Track, type W } from "../zam/common";
import { FPS, makeEpisode, timing, type SceneDef } from "../zam/Episode";

const WORDS = words as W[];
const { S, at, LAST } = timing(WORDS);
const TAG = "ZAM · WILDEST MOMENTS #2";
const MOOD: Record<string, Mood> = { z_hook: "wow", p_ovi: "smug", h_ovi: "wow", b_ovi: "grumpy", z_sittler: "wow", h_sittler: "talk", b_sittler: "grumpy", z_svech: "wow", p_svech: "laugh", z_rat: "wow", c_rat: "laugh", p_rat: "smug", b_end: "grumpy" };
const M = (id: string, who: Track["who"], s: number, keys: Key[], extra: Partial<Track> = {}): Track => ({ id, c1: "", c2: "", n: "", kind: "mascot", who, s, keys, ...extra });
const Light: React.FC<{ on: boolean; x: number; y: number }> = ({ on, x, y }) => (on ? <div style={{ position: "absolute", left: x, top: y, width: 40, height: 30, borderRadius: 8, background: "#ff3b30", boxShadow: "0 0 44px 18px #ff3b3088", border: `4px solid ${P.ink}`, zIndex: 1000 }} /> : null);
const Mini: React.FC<{ a: string; b: string; sa: number; sb: number; clock: string }> = ({ a, b, sa, sb, clock }) => (
  <div style={{ position: "absolute", right: 0, top: 70, display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", background: P.ink, borderRadius: 12, border: `4px solid ${P.mustard}`, color: "#fff", fontWeight: 900, fontSize: 30 }}>
    {a} <span style={{ color: "#f7d84a", fontSize: 40 }}>{sa}</span> – <span style={{ color: "#f7d84a", fontSize: 40 }}>{sb}</span> {b}
    <span style={{ marginLeft: 8, padding: "2px 8px", background: P.red, borderRadius: 6, fontSize: 24 }}>{clock}</span>
  </div>
);
const useT = (from: number) => from + useCurrentFrame() / FPS;

// ------------------------------------------------------------------ boards
const HookBoard: React.FC<{ from: number }> = ({ from }) => {
  const t = useT(from);
  const items: [string, string, string][] = [["ON HIS BACK", P.red, "wildest"], ["10 POINTS", P.mustard, "round"], ["LACROSSE GOAL", P.teal, "two"], ["RAT TRICK", "#6b7280", "lets"]];
  return (
    <PaperCard w={960} h={740} seed="hook2" tag={TAG}>
      <div style={{ fontSize: 112, fontWeight: 900, lineHeight: 0.95, letterSpacing: -2, marginTop: 10 }}>HOCKEY'S<br />WILDEST<br />MOMENTS <span style={{ color: P.red }}>#2</span></div>
      <div style={{ fontFamily: HAND, fontSize: 60, color: P.red, marginTop: 6 }}>any year · any era</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, display: "flex", flexWrap: "wrap", gap: 18 }}>
        {items.map(([txt, col, w], i) => <Stamp key={txt} color={col} at={Math.round((at("z_hook", w) - from) * FPS) - 2} rot={[-6, 4, -3, 5][i]} size={42}>{txt}</Stamp>)}
      </div>
      <div style={{ position: "absolute", right: 0, top: 330, opacity: t > 0.5 ? 1 : 0 }}><Mascot who="pucky" size={200} mood="smug" seed="h2" /></div>
    </PaperCard>
  );
};

// Ovechkin, Jan 16 2006: tangled with Paul Mara near the left circle, falls, slides on his back and hooks it one-handed past Brian Boucher.
const OviBoard: React.FC<{ from: number }> = ({ from }) => {
  const t = useT(from);
  const WSH: Band = { c1: "#c8102e", c2: "#041e42", n: 8 }, PHX: Band = { c1: "#8c2633", c2: "#e2d6b5", n: "PHX" };
  const fall = at("p_ovi", "back") - 0.1, slide0 = S("h_ovi").start, hook = at("h_ovi", "hand"), goal = hook + 0.55;
  const coach = at("h_ovi", "wayne");
  const ovi = M("ovi", "clubby", 140, [[from, 180, 110], [fall, 560, 120], [slide0 + 0.9, 680, 140]], { band: WSH, mood: t > goal ? "laugh" : "wow", rot: t < fall ? undefined : () => -90 });
  const tracks: Track[] = [
    M("bis", "biscuit", 150, [[0, 762, 205]], { band: PHX, flip: true, mood: "wow", dizzy: (tt) => tt > S("b_ovi").start, rot: (tt) => (tt > S("b_ovi").start ? Math.sin(tt * 9) * 25 : 0) }),
    { id: "mara", c1: "#8c2633", c2: "#e2d6b5", n: "", s: 54, keys: [[from, 420, 60], [fall, 545, 80], [goal, 600, 70]] },
    ovi,
  ];
  if (t > coach) tracks.push(M("coach", "zam", 120, [[coach, -80, 330], [coach + 0.5, 110, 330]], { band: { c1: "#8c2633", c2: "#e2d6b5", n: "COACH" }, mood: "wow" }));
  const puck: Key[] = [[from, 250, 140], [fall, 620, 150], [slide0 + 0.8, 735, 170], [hook, 742, 172], [goal, 836, 200]];
  return (
    <PaperCard w={960} h={740} seed="ovi" tag={TAG}>
      <Header title="ALEX OVECHKIN" sub="Jan 16, 2006 · at Phoenix" />
      <Mini a="WSH" b="PHX" sa={t > goal ? 6 : 5} sb={1} clock="3RD · 11:54" />
      <div style={{ position: "absolute", left: 0, top: 128 }}>
        <HalfStage light={t > goal && t < goal + 0.6}>
          <Play t={t} tracks={tracks} puck={puck} puckWho puckSize={64} trailFrom={slide0} />
          <div style={{ position: "absolute", left: 16, top: 14, padding: "2px 12px", background: P.red, color: "#fff", fontSize: 28, fontWeight: 900, zIndex: 1001 }}>{t < fall ? "LEFT CIRCLE · TANGLED UP" : t < goal ? "ON HIS BACK · ONE HAND" : "\"THE GOAL\""}</div>
          <div style={{ position: "absolute", left: 18, bottom: 8, fontFamily: HAND, fontSize: 26, color: P.muted, zIndex: 1001 }}>the gang's recreation · paths approx.</div>
        </HalfStage>
      </div>
      <div style={{ position: "absolute", left: 40, top: 548 }}><Stamp color={P.red} at={Math.round((goal + 0.3 - from) * FPS)} rot={-3} size={40}>SCORED LYING ON HIS BACK</Stamp></div>
      <BoardFoot source="NHL.com · Washington Times" />
    </PaperCard>
  );
};

// Sittler, Feb 7 1976: six goals + four assists = 10 points, Leafs 11–4 Bruins.
const SEQ = ["G", "G", "A", "G", "A", "G", "G", "A", "G", "A"];
const SittlerBoard: React.FC<{ from: number }> = ({ from }) => {
  const t = useT(from);
  const step = 0.82, t0 = from + 0.5;
  const k = Math.min(9, Math.max(0, Math.floor((t - t0) / step)));
  const u = (t - t0 - k * step) / step;
  const done = t < t0 ? 0 : Math.min(10, Math.floor((t - t0) / step + 0.55));
  const TOR: Band = { c1: "#00205b", c2: "#ffffff", n: 27 }, BOS: Band = { c1: "#111", c2: "#fcb514", n: "BOS" };
  const isA = SEQ[k] === "A";
  const base = t0 + k * step;
  const tracks: Track[] = [
    M("bis", "biscuit", 130, [[0, 770, 165]], { band: BOS, flip: true, mood: "grumpy", dizzy: () => done >= 7 }),
    M("sit", "clubby", 120, [[base, 300, isA ? 230 : 120], [base + step * 0.4, 520, isA ? 250 : 140]], { band: TOR }),
    M("mate", "helmy", 110, [[0, 600, 270]], { band: { c1: "#00205b", c2: "#ffffff", n: "TOR" } }),
  ];
  const puck: Key[] = isA
    ? [[base, 370, 270], [base + step * 0.4, 590, 290], [base + step * 0.5, 600, 280], [base + step * 0.75, 836, 165]]
    : [[base, 370, 160], [base + step * 0.4, 590, 180], [base + step * 0.75, 836, 165]];
  return (
    <PaperCard w={960} h={740} seed="sit" tag={TAG}>
      <Header title="DARRYL SITTLER" sub="Feb 7, 1976 · Maple Leafs 11–4 Bruins" accent={P.mustard} />
      <div style={{ position: "absolute", left: 0, top: 128 }}>
        <HalfStage h={330} light={u > 0.75 && u < 0.98 && t > t0}>
          <Play t={t} tracks={tracks} puck={puck} puckWho puckSize={54} trailFrom={base} />
          <div style={{ position: "absolute", left: 16, top: 14, padding: "2px 12px", background: P.red, color: "#fff", fontSize: 28, fontWeight: 900, zIndex: 1001 }}>{SEQ[k] === "G" ? "GOAL" : "ASSIST"} · POINT {Math.min(10, k + 1)}</div>
        </HalfStage>
      </div>
      <div style={{ position: "absolute", left: 0, top: 476, display: "flex", gap: 8, alignItems: "center" }}>
        {SEQ.map((g, i) => <div key={i} style={{ width: 58, height: 58, borderRadius: 10, border: `4px solid ${P.ink}`, background: i < done ? (g === "G" ? "#fcd34d" : "#bfe3ff") : P.paper2, opacity: i < done ? 1 : 0.4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 900 }}>{g}</div>)}
        <div style={{ marginLeft: 14, fontSize: 64, fontWeight: 900 }}>{done}<span style={{ fontSize: 28 }}> PTS</span></div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 552, fontFamily: HAND, fontSize: 34, color: P.muted }}>G = goal · A = assist</div>
      <div style={{ position: "absolute", left: 300, top: 548, whiteSpace: "nowrap" }}><Stamp color={P.red} at={Math.round((at("h_sittler", "record") - from) * FPS)} rot={-4} size={34}>STILL THE NHL RECORD</Stamp></div>
      <BoardFoot source="NHL.com" />
    </PaperCard>
  );
};

// Svechnikov, Oct 29 2019 vs Calgary: stops behind the net, scoops it onto the blade and tucks it in over David Rittich's shoulder.
const SvechBoard: React.FC<{ from: number }> = ({ from }) => {
  const t = useT(from);
  const CAR: Band = { c1: "#cc0000", c2: "#111", n: 37 }, CGY: Band = { c1: "#c8102e", c2: "#f1be48", n: "CGY" };
  const scoop = at("z_svech", "scoops"), lax = at("z_svech", "lacrossestyle"), goal = at("z_svech", "first") - 0.1, cone = S("p_svech").start - 0.1;
  const sv = M("sv", "clubby", 130, [[from, 300, 320], [scoop, 700, 330], [lax - 0.1, 790, 210], [goal, 760, 120]], { band: CAR, mood: "wow" });
  const tracks: Track[] = [M("rit", "biscuit", 140, [[0, 560, 210]], { band: CGY, flip: true, mood: "wow", dizzy: (tt) => tt > goal + 0.3 }), sv];
  const ps = sample(sv.keys, t);
  const puck: Key[] = t < goal - 0.25 ? [[0, ps.x + 52, ps.y + 30, t > scoop ? 70 : 0]] : [[goal - 0.25, 812, 150, 70], [goal, 600, 200, 46]];
  return (
    <PaperCard w={960} h={740} seed="sv" tag={TAG}>
      <Header title="ANDREI SVECHNIKOV" sub="Oct 29, 2019 · Hurricanes vs Flames" accent={P.teal} />
      <div style={{ position: "absolute", left: 0, top: 128, width: 892, height: 400, background: "#f4fbff", border: `6px solid ${P.ink}`, borderRadius: 26, overflow: "hidden" }}>
        <svg width={892} height={400} style={{ position: "absolute" }}>
          <line x1={612} y1={0} x2={612} y2={400} stroke="#d94b3b" strokeWidth={4} />
          <path d="M612 140 a 60 60 0 0 0 0 120" fill="#bfe3ff" stroke="#d94b3b" strokeWidth={3} />
          <rect x={612} y={165} width={40} height={70} fill="#fff" stroke="#d94b3b" strokeWidth={6} />
          <path d="M100 0 V400" stroke="#3b82f6" strokeWidth={12} opacity={0.6} />
        </svg>
        {t < cone && <Play t={t} tracks={tracks} puck={puck} puckWho puckSize={60} />}
        <Light on={t > goal && t < goal + 0.6} x={612} y={110} />
        {t >= cone && (
          <div style={{ position: "absolute", left: 330, top: 40, transform: `scale(${interpolate(t - cone, [0, 0.25], [0.3, 1], clamp)})` }}>
            <svg width={220} height={330} viewBox="0 0 220 330" style={{ position: "absolute", left: 0, top: 120 }}>
              <path d="M20 10 L200 10 L110 200 Z" fill="#d9a55f" stroke={P.ink} strokeWidth={6} strokeLinejoin="round" />
              {[40, 80, 120, 160].map((x) => <line key={x} x1={x} y1={10} x2={x * 0.5 + 55} y2={150} stroke="#a8733a" strokeWidth={4} />)}
            </svg>
            <div style={{ position: "absolute", left: 10, top: 0 }}><Mascot who="pucky" size={200} mood="laugh" seed="cone" /></div>
            {[...Array(10)].map((_, i) => <div key={i} style={{ position: "absolute", left: 30 + ((i * 47) % 160), top: 30 + ((i * 71) % 110), width: 16, height: 6, borderRadius: 3, background: ["#d94b3b", "#3b82f6", "#e0a526", "#2a9d8f"][i % 4], transform: `rotate(${i * 40}deg)` }} />)}
          </div>
        )}
        <div style={{ position: "absolute", left: 16, top: 14, padding: "2px 12px", background: P.red, color: "#fff", fontSize: 28, fontWeight: 900, zIndex: 1001 }}>{t < scoop ? "BEHIND THE NET" : t < goal ? "SCOOP · LACROSSE-STYLE" : t < cone ? "1ST EVER IN THE NHL" : "PUCKY: 1 SCOOP, PLEASE"}</div>
        <div style={{ position: "absolute", left: 18, bottom: 8, fontFamily: HAND, fontSize: 26, color: P.muted, zIndex: 1001 }}>the gang's recreation · paths approx.</div>
      </div>
      <div style={{ position: "absolute", left: 10, top: 548, whiteSpace: "nowrap" }}><Stamp color={P.teal} at={Math.round((goal + 0.2 - from) * FPS)} rot={-3} size={32}>FIRST LACROSSE GOAL IN NHL HISTORY</Stamp></div>
      <BoardFoot source="NHL.com · CBS Sports" />
    </PaperCard>
  );
};

/** Cartoon paper rat (rubber-toy style). */
const Rat: React.FC<{ s?: number; ko?: boolean; mask?: boolean }> = ({ s = 90, ko, mask }) => (
  <svg width={s} height={s * 0.7} viewBox="-60 -40 120 84" style={{ overflow: "visible" }}>
    <path d="M40 10 Q70 0 62 -24" stroke={P.ink} strokeWidth={4} fill="none" strokeLinecap="round" />
    <ellipse cx={0} cy={10} rx={42} ry={26} fill="#9ca3af" stroke={P.ink} strokeWidth={4} />
    <path d="M-30 -4 L-60 10 L-30 22 Z" fill="#9ca3af" stroke={P.ink} strokeWidth={4} strokeLinejoin="round" />
    <circle cx={-26} cy={-14} r={10} fill="#f9a8d4" stroke={P.ink} strokeWidth={3} />
    {ko ? <path d="M-44 4 l6 6 m0 -6 l-6 6" stroke={P.ink} strokeWidth={3} /> : <circle cx={-42} cy={8} r={3.5} fill={P.ink} />}
    <circle cx={-60} cy={10} r={4} fill="#f472b6" />
    {mask && <path d="M-56 -6 Q-38 -22 -24 -6 L-26 22 Q-40 30 -56 22 Z" fill="#f8fafc" stroke={P.ink} strokeWidth={3} opacity={0.95} />}
  </svg>
);

// Rat trick, Oct 8 1995: Mellanby swats a rat in the locker room before the home opener, then scores twice with the same stick (4–3 vs Calgary).
const RatBoard: React.FC<{ from: number }> = ({ from }) => {
  const t = useT(from);
  const f = useCurrentFrame();
  const smack = at("z_rat", "smacks"), scores = at("z_rat", "scores"), trick = S("c_rat").start;
  const ratX = t < smack ? interpolate(t, [from, smack], [820, 330], clamp) : 330;
  const swing = t > smack - 0.25 && t < smack + 0.2 ? interpolate(t, [smack - 0.25, smack, smack + 0.2], [0, -70, -20], clamp) : 0;
  const goals = t < scores ? 0 : Math.min(2, 1 + Math.floor((t - scores) / 0.7));
  return (
    <PaperCard w={960} h={740} seed="rat" tag={TAG}>
      <Header title="SCOTT MELLANBY" sub="Oct 8, 1995 · Panthers 4–3 Flames" accent={P.red} />
      <div style={{ position: "absolute", left: 0, top: 128, width: 892, height: 400, background: t < trick ? "#efe6d2" : "#f4fbff", border: `6px solid ${P.ink}`, borderRadius: 26, overflow: "hidden" }}>
        {t < trick ? (
          <>
            {[...Array(6)].map((_, i) => <div key={i} style={{ position: "absolute", left: 20 + i * 145, top: 20, width: 125, height: 230, background: "#c9b48a", border: `5px solid ${P.ink}`, borderRadius: 8 }}><div style={{ position: "absolute", left: 50, top: 100, width: 22, height: 8, background: P.ink, borderRadius: 4 }} /></div>)}
            <div style={{ position: "absolute", left: 20, top: 262, right: 20, height: 26, background: "#8b6b3e", border: `4px solid ${P.ink}` }} />
            <div style={{ position: "absolute", left: 16, top: 14, padding: "2px 12px", background: P.red, color: "#fff", fontSize: 28, fontWeight: 900, zIndex: 1001 }}>LOCKER ROOM · BEFORE THE GAME</div>
            <div style={{ position: "absolute", left: ratX - 45, top: 300 + (t < smack ? Math.abs(Math.sin(f / 3)) * -8 : 10), transform: t > smack ? "rotate(180deg) scaleX(-1)" : undefined }}><Rat s={100} ko={t > smack} /></div>
            <div style={{ position: "absolute", left: 120, top: 200, transform: `rotate(${swing}deg)`, transformOrigin: "50% 90%" }}><Mascot who="clubby" size={170} mood={t > smack ? "laugh" : "wow"} seed="mel" /></div>
            <div style={{ position: "absolute", left: 150, top: 394 - 30, zIndex: 3 }} />
            {t > smack && t < smack + 0.6 && <div style={{ position: "absolute", left: 300, top: 250, fontFamily: "Inter", fontWeight: 900, fontStyle: "italic", fontSize: 60, color: "#fff", WebkitTextStroke: `5px ${P.ink}`, paintOrder: "stroke fill" }}>BONK!</div>}
            {goals > 0 && (
              <div style={{ position: "absolute", right: 24, top: 70, background: P.ink, color: "#f7d84a", padding: "10px 18px", borderRadius: 14, fontSize: 46, fontWeight: 900, zIndex: 1001 }}>
                {goals} GOAL{goals > 1 ? "S" : ""} <span style={{ color: "#fff", fontSize: 26 }}>same stick</span>
              </div>
            )}
          </>
        ) : (
          <>
            <div style={{ position: "absolute", left: 16, top: 14, padding: "2px 12px", background: P.red, color: "#fff", fontSize: 28, fontWeight: 900, zIndex: 1001 }}>FANS: RUBBER RATS ON THE ICE</div>
            {[...Array(22)].map((_, i) => {
              const tt = t - trick - (i % 8) * 0.12;
              if (tt < 0) return null;
              const y = Math.min(300 + (i % 3) * 25, -80 + tt * 900);
              return <div key={i} style={{ position: "absolute", left: 20 + ((i * 97) % 820), top: y, transform: `rotate(${(i * 53) % 360}deg)` }}><Rat s={70} /></div>;
            })}
            <div style={{ position: "absolute", left: interpolate(t, [trick + 1.2, trick + 3.2], [-260, 900], clamp), top: 210, zIndex: 50 }}><Mascot who="zam" size={180} mood="wow" talking open={0.4} seed="ratzam" /></div>
          </>
        )}
      </div>
      <div style={{ position: "absolute", left: 40, top: 548 }}><Stamp color={P.mustard} at={Math.round((trick - from) * FPS)} rot={-3} size={44}>"RAT TRICK"</Stamp></div>
      <BoardFoot source="NHL.com · CBS News Miami (cartoon recreation)" />
    </PaperCard>
  );
};

const RoastBoard: React.FC<{ from: number }> = ({ from }) => {
  const t = useT(from);
  return (
    <PaperCard w={960} h={740} seed="r2" tag={TAG}>
      <Header title="PUCKY'S ROAST CORNER" sub="goalies through history (not accurate)" />
      <div style={{ position: "absolute", left: 40, top: 170, width: 300, height: 260, border: `6px solid ${P.red}`, borderBottom: "none", borderRadius: "16px 16px 0 0", background: "repeating-linear-gradient(90deg, #0001 0 2px, transparent 2px 22px)" }}>
        <div style={{ position: "absolute", left: 70, top: 90 }}><Rat s={160} mask /></div>
      </div>
      <div style={{ position: "absolute", left: 40, top: 440, fontFamily: HAND, fontSize: 40 }}>"goalie", 1995 (allegedly)</div>
      <div style={{ position: "absolute", left: 470, top: 150 }}><Mascot who="biscuit" size={330} mood="grumpy" seed="rb2" /></div>
      <div style={{ position: "absolute", left: 470, top: 480, whiteSpace: "nowrap" }}><Stamp color={P.teal} at={Math.round((at("b_end", "walrus") - from) * FPS)} rot={6} size={42}>100% WALRUS</Stamp></div>
      {t > S("b_end").start && <div style={{ position: "absolute", left: 400, top: 120, fontSize: 90, fontWeight: 900, color: P.red, transform: "rotate(-12deg)" }}>!?</div>}
    </PaperCard>
  );
};

// ------------------------------------------------------------------ assembly
const scenes: SceneDef[] = [
  { id: "hook", from: 0, Board: HookBoard },
  { id: "ovi", from: S("p_ovi").start - 0.2, Board: OviBoard, slap: "left" },
  { id: "sittler", from: S("z_sittler").start - 0.2, Board: SittlerBoard, wipe: true },
  { id: "svech", from: S("z_svech").start - 0.2, Board: SvechBoard, slap: "left", wipe: true },
  { id: "rat", from: S("z_rat").start - 0.2, Board: RatBoard, wipe: true },
  { id: "roast", from: S("p_rat").start - 0.2, Board: RoastBoard, slap: "left" },
];

const Extras: React.FC<{ N: (s: number) => number }> = ({ N }) => {
  const oviGoal = at("h_ovi", "hand") + 0.55, svGoal = at("z_svech", "first") - 0.1;
  return (
    <>
      <ComicBurst text="LET'S GO!" at={N(at("z_hook", "lets"))} x={760} y={1240} color={P.red} size={0.8} dur={40} />
      <Sequence from={N(oviGoal)} durationInFrames={110}><Audio src={staticFile("sfx/horn.wav")} volume={0.5} /></Sequence>
      <ComicBurst text="WHAT?!" at={N(oviGoal)} x={790} y={1240} color={P.mustard} size={0.8} dur={60} />
      <Sequence from={N(at("p_ovi", "back"))} durationInFrames={40}><Audio src={staticFile("brand/boing.wav")} volume={0.5} /></Sequence>
      {SEQ.map((_, i) => <Sequence key={i} from={N(S("z_sittler").start - 0.2 + 0.5 + i * 0.82 + 0.6)} durationInFrames={20}><Audio src={staticFile("pop.wav")} volume={0.6} /></Sequence>)}
      <ComicBurst text="10!" at={N(at("z_sittler", "10"))} x={800} y={1240} color={P.mustard} size={0.9} dur={60} />
      <Sequence from={N(at("z_sittler", "10"))} durationInFrames={60}><Audio src={staticFile("brand/ding.wav")} volume={0.5} /></Sequence>
      <Sequence from={N(svGoal)} durationInFrames={110}><Audio src={staticFile("sfx/horn.wav")} volume={0.5} /></Sequence>
      <ComicBurst text="LACROSSE!" at={N(svGoal)} x={770} y={1240} color={P.teal} size={0.75} dur={60} />
      <Sequence from={N(at("z_rat", "smacks"))} durationInFrames={40}><Audio src={staticFile("brand/boing.wav")} volume={0.6} /></Sequence>
      <ComicBurst text="RAT TRICK!" at={N(S("c_rat").start)} x={770} y={1240} color="#9ca3af" size={0.75} dur={60} />
      <Sequence from={N(S("c_rat").start)} durationInFrames={120}><Audio src={staticFile("sfx/crowd.wav")} volume={0.45} /></Sequence>
      <Sequence from={N(at("p_rat", "goalie"))} durationInFrames={40}><Audio src={staticFile("brand/rimshot.wav")} volume={0.6} /></Sequence>
      <Sequence from={N(S("b_end").start)} durationInFrames={90}><Confetti n={40} x={540} y={600} /></Sequence>
    </>
  );
};

export const { Comp: Wild02, FRAMES: WILD02_FRAMES } = makeEpisode({ words: WORDS, vo: "ep/wild02.mp3", mood: MOOD, scenes, Extras });
void LAST;
