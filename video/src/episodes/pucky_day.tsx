/** ZAM special – "A Day at Work with Pucky" (behind the scenes mockumentary). Facts: pucks frozen (~-10 °C) so they bounce less,
 *  swapped after a couple of minutes, NHL tested colour-changing (purple-when-frozen) pucks, Chara's 108.8 mph hardest shot (2012). */
import React from "react";
import { Audio, Sequence, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import words from "../data/pucky_day_words.json";
import { P, HAND, clamp, onTwos, PaperCard, Stamp } from "../presenter/kit";
import { ComicBurst } from "../presenter/banana";
import { Mascot, type Mood } from "../mascots/Gang";
import { BoardFoot, BandTag, Confetti, HalfStage, Header, Play, type Key, type Track, type W } from "../zam/common";
import { FPS, makeEpisode, timing, type SceneDef } from "../zam/Episode";

const WORDS = words as W[];
const { S, at } = timing(WORDS);
const TAG = "ZAM · BEHIND THE SCENES";
const MOOD: Record<string, Mood> = { z_intro: "wow", p_wake: "talk", h_bounce: "wow", p_warm: "smug", c_partners: "grumpy", p_game: "laugh", b_mask: "grumpy", p_swap: "talk", h_colour: "wow", p_cool: "laugh" };
const useT = (from: number) => from + useCurrentFrame() / FPS;
const fr = (from: number, news: number) => Math.round((news - from) * FPS);
const Clock: React.FC<{ time: string }> = ({ time }) => (
  <div style={{ position: "absolute", right: 0, top: 66, padding: "6px 16px", background: P.ink, color: "#7CFC9A", fontFamily: "'DejaVu Sans Mono', monospace", fontWeight: 900, fontSize: 40, borderRadius: 10, border: `4px solid ${P.mustard}` }}>{time}</div>
);
const Frost: React.FC<{ n?: number; w?: number; h?: number }> = ({ n = 14, w = 880, h = 380 }) => {
  const f = onTwos(useCurrentFrame());
  return <>{[...Array(n)].map((_, i) => <div key={i} style={{ position: "absolute", left: (i * 131) % w, top: (i * 89 + f * 1.5) % h, fontSize: 30, color: "#7cc4f5", opacity: 0.8 }}>❄</div>)}</>;
};
const PlainPuck: React.FC<{ s?: number; frost?: boolean }> = ({ s = 90, frost }) => (
  <svg width={s} height={s * 0.6} viewBox="-60 -36 120 72"><ellipse cx={0} cy={10} rx={54} ry={22} fill="#111" stroke={P.ink} strokeWidth={4} /><rect x={-54} y={-14} width={108} height={24} fill="#1c1c1c" /><ellipse cx={0} cy={-14} rx={54} ry={22} fill={frost ? "#cfe7f6" : "#2b2b2b"} stroke={P.ink} strokeWidth={4} />{frost && <text x={-10} y={-8} fontSize={22} fill="#3b82f6">❄</text>}</svg>
);

const IntroBoard: React.FC<{ from: number }> = ({ from }) => {
  const f = useCurrentFrame();
  return (
    <PaperCard w={960} h={740} seed="pd0" tag={TAG}>
      <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: 6, color: P.red }}>ZAM DOCUMENTARIES PRESENTS</div>
      <div style={{ fontSize: 108, fontWeight: 900, lineHeight: 0.95, letterSpacing: -2, marginTop: 12 }}>A DAY AT<br />WORK WITH<br />PUCKY</div>
      <div style={{ position: "absolute", left: 0, top: 470 }}><Stamp color={P.teal} at={fr(from, at("z_intro", "today"))} rot={-5} size={48}>BEHIND THE SCENES</Stamp></div>
      <div style={{ position: "absolute", right: 0, top: 300, transform: `rotate(${Math.sin(f / 12) * 4}deg)` }}>
        <Mascot who="pucky" size={240} mood="smug" seed="pd0" />
        <div style={{ position: "absolute", left: 40, top: 262, padding: "6px 14px", background: "#fff", border: `4px solid ${P.ink}`, borderRadius: 10, fontWeight: 900, fontSize: 22, transform: "rotate(4deg)" }}>STAFF · PUCK #1</div>
      </div>
    </PaperCard>
  );
};

const WakeBoard: React.FC<{ from: number }> = ({ from }) => {
  const t = useT(from);
  const f = useCurrentFrame();
  const wake = at("p_wake", "wake"), cozy = at("p_wake", "cozy"), test = S("h_bounce").start - 0.1;
  const ring = t < wake + 0.6 ? Math.sin(f * 1.5) * 8 : 0;
  return (
    <PaperCard w={960} h={740} seed="pd1" tag={TAG}>
      <Header title={t < test ? "THE FREEZER" : "THE BOUNCE TEST"} sub={t < test ? "Pucky's bedroom" : "Helmy's lab"} accent={P.teal} />
      <Clock time="5:00 AM" />
      <div style={{ position: "absolute", left: 0, top: 128, width: 892, height: 400, background: t < test ? "#e8f4fb" : "#f8fafc", border: `6px solid ${P.ink}`, borderRadius: 22, overflow: "hidden" }}>
        {t < test ? (
          <>
            <Frost />
            {/* stacked frozen pucks as a bunk bed */}
            {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 40, top: 300 - i * 46 }}><PlainPuck s={150} frost /></div>)}
            <div style={{ position: "absolute", left: 210, top: 150 }}><Mascot who="pucky" size={200} mood={t < wake ? "talk" : "wow"} seed="bed" /></div>
            {t < wake && <div style={{ position: "absolute", left: 360, top: 120, fontFamily: HAND, fontSize: 60, color: P.teal }}>z z Z</div>}
            {/* alarm clock */}
            <div style={{ position: "absolute", left: 470, top: 200, transform: `rotate(${ring}deg)` }}>
              <svg width={140} height={150} viewBox="0 0 140 150"><circle cx={70} cy={80} r={56} fill="#fff" stroke={P.ink} strokeWidth={7} /><circle cx={30} cy={26} r={18} fill={P.red} stroke={P.ink} strokeWidth={5} /><circle cx={110} cy={26} r={18} fill={P.red} stroke={P.ink} strokeWidth={5} /><path d="M70 80 V44 M70 80 L94 92" stroke={P.ink} strokeWidth={7} strokeLinecap="round" /></svg>
              {t > wake - 0.2 && t < wake + 0.6 && <div style={{ position: "absolute", left: -30, top: -50, fontWeight: 900, fontSize: 44, color: P.red }}>RIIING!</div>}
            </div>
            {/* thermometer */}
            <div style={{ position: "absolute", left: 680, top: 40, width: 170, height: 320, background: "#fff", border: `6px solid ${P.ink}`, borderRadius: 20, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 16 }}>
              <div style={{ width: 30, height: 190, borderRadius: 15, border: `5px solid ${P.ink}`, position: "relative", overflow: "hidden", background: "#fff" }}><div style={{ position: "absolute", bottom: 0, width: "100%", height: 40, background: "#3b82f6" }} /></div>
              <div style={{ fontSize: 50, fontWeight: 900, color: "#3b82f6", marginTop: 6 }}>-10°C</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: P.muted }}>(14°F)</div>
            </div>
            {t > cozy && <div style={{ position: "absolute", left: 230, top: 60, fontFamily: HAND, fontSize: 54, color: P.red, transform: "rotate(-6deg)" }}>cozy ♥</div>}
          </>
        ) : (
          <>
            {[{ x: 170, lab: "WARM PUCK", warm: true }, { x: 590, lab: "FROZEN PUCK", warm: false }].map(({ x, lab, warm }) => {
              const tt = t - test - 0.2;
              const y = warm ? 250 - Math.abs(Math.sin(Math.max(0, tt) * 5)) * 200 * Math.exp(-Math.max(0, tt) * 0.5) : (tt < 0.35 ? 50 + tt * 570 : 250);
              return (
                <div key={lab}>
                  <div style={{ position: "absolute", left: x, top: y }}><PlainPuck s={130} frost={!warm} /></div>
                  <div style={{ position: "absolute", left: x - 65, top: 335, width: 260, whiteSpace: "nowrap", textAlign: "center", fontWeight: 900, fontSize: 30, color: warm ? P.red : "#3b82f6" }}>{lab}</div>
                  <div style={{ position: "absolute", left: x + 20, top: 20, fontFamily: HAND, fontSize: 44, color: P.ink }}>{warm ? "boing boing" : "thud."}</div>
                </div>
              );
            })}
            <div style={{ position: "absolute", left: 0, top: 316, width: "100%", height: 8, background: "#bfe3ff" }} />
          </>
        )}
      </div>
      <div style={{ position: "absolute", left: 40, top: 548 }}><Stamp color="#3b82f6" at={fr(from, at("h_bounce", "bounce"))} rot={-3} size={40}>FROZEN PUCKS BOUNCE LESS</Stamp></div>
      <BoardFoot source="The Hockey News · NHL officials" />
    </PaperCard>
  );
};

const WarmBoard: React.FC<{ from: number }> = ({ from }) => {
  const t = useT(from);
  const part = S("c_partners").start - 0.1;
  const t0 = at("p_warm", "slaps") - 0.2;
  // Clubby slaps Pucky back and forth
  const pk: Key[] = [...Array(8)].map((_, k) => [t0 + k * 0.55, k % 2 ? 700 : 260, 200 + (k % 3) * 30] as Key);
  const tracks: Track[] = [{ id: "clu", c1: "", c2: "", n: "", kind: "mascot", who: "clubby", s: 150, mood: "smug", keys: pk.map(([tt, x, y]) => [tt - 0.1, x === 700 ? 160 : 160, y] as Key) }];
  return (
    <PaperCard w={960} h={740} seed="pd2" tag={TAG}>
      <Header title={t < part ? "WARM-UPS" : "PARTNERS"} sub={t < part ? "Clubby's slap shot practice" : "since forever"} accent={P.green} />
      <Clock time="6:30 PM" />
      <div style={{ position: "absolute", left: 0, top: 128 }}>
        <HalfStage>
          {t < part ? (
            <Play t={t} tracks={tracks} puck={pk} puckWho puckSize={80} trailFrom={t0} />
          ) : (
            <>
              <div style={{ position: "absolute", left: 200, top: 90 }}><Mascot who="clubby" size={220} mood="grumpy" seed="pc" /></div>
              <div style={{ position: "absolute", left: 430, top: 140 }}><Mascot who="pucky" size={180} mood="laugh" seed="pp" /></div>
              <div style={{ position: "absolute", left: 400, top: 60, fontSize: 70, color: P.red }}>♥</div>
            </>
          )}
          {t < part && <div style={{ position: "absolute", left: 16, top: 14, padding: "2px 12px", background: P.red, color: "#fff", fontSize: 28, fontWeight: 900, zIndex: 1001 }}>SLAP · SLAP · SLAP</div>}
        </HalfStage>
      </div>
      <div style={{ position: "absolute", left: 40, top: 548 }}><Stamp color={P.green} at={fr(from, part)} rot={-3} size={44}>"WE'RE FRIENDS."</Stamp></div>
    </PaperCard>
  );
};

const GameBoard: React.FC<{ from: number }> = ({ from }) => {
  const t = useT(from);
  const f = useCurrentFrame();
  const g0 = at("p_game", "hardest"), mask = S("b_mask").start - 0.1;
  const mph = interpolate(t, [g0, g0 + 1.6], [0, 108.8], { ...clamp, easing: Easing.out(Easing.cubic) });
  const ang = -120 + (mph / 120) * 240;
  const bonks = ["every", "single", "day"].map((w) => at("b_mask", w));
  const hit = bonks.filter((b) => t >= b).length;
  return (
    <PaperCard w={960} h={740} seed="pd3" tag={TAG}>
      <Header title={t < mask ? "GAME TIME" : "MEANWHILE, IN NET…"} sub={t < mask ? "Zdeno Chara · 2012 All-Star Skills" : "Biscuit's daily routine"} accent={P.red} />
      <Clock time="7:00 PM" />
      <div style={{ position: "absolute", left: 0, top: 128, width: 892, height: 400, background: "#f4fbff", border: `6px solid ${P.ink}`, borderRadius: 22, overflow: "hidden" }}>
        {t < mask ? (
          <>
            <svg width={420} height={300} viewBox="-210 -200 420 300" style={{ position: "absolute", left: 30, top: 50 }}>
              <path d="M-170 0 A170 170 0 1 1 170 0" fill="#fff" stroke={P.ink} strokeWidth={8} />
              {[...Array(13)].map((_, i) => { const a = ((-120 + i * 20) * Math.PI) / 180; return <line key={i} x1={Math.sin(a) * 150} y1={-Math.cos(a) * 150} x2={Math.sin(a) * 128} y2={-Math.cos(a) * 128} stroke={P.ink} strokeWidth={5} />; })}
              <line x1={0} y1={0} x2={Math.sin((ang * Math.PI) / 180) * 130} y2={-Math.cos((ang * Math.PI) / 180) * 130} stroke={P.red} strokeWidth={10} strokeLinecap="round" />
              <circle r={16} fill={P.ink} />
            </svg>
            <div style={{ position: "absolute", left: 90, top: 280, fontSize: 70, fontWeight: 900 }}>{mph.toFixed(1)}<span style={{ fontSize: 34 }}> mph</span></div>
            <div style={{ position: "absolute", left: 130, top: 350, fontSize: 30, fontWeight: 800, color: P.muted }}>≈ {Math.round(mph * 1.609)} km/h</div>
            <div style={{ position: "absolute", left: interpolate(t, [g0 + 0.2, g0 + 1.6], [480, 700], clamp), top: 120, transform: `rotate(${f * 20}deg)` }}><Mascot who="pucky" size={150} mood="laugh" talking open={0.9} seed="fast" /></div>
            {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 440, top: 160 + i * 30, width: 200, height: 8, borderRadius: 4, background: "#9cc9e8" }} />)}
            {t > at("p_game", "felt") && <div style={{ position: "absolute", left: 600, top: 300, fontFamily: HAND, fontSize: 50, color: P.red }}>"I felt that."</div>}
          </>
        ) : (
          <>
            <div style={{ position: "absolute", left: 470, top: 70 }}><Mascot who="biscuit" size={280} mood="grumpy" seed="bm"/></div>
            {bonks.map((b, i) => {
              const k = interpolate(t, [b - 0.35, b], [0, 1], clamp);
              if (t < b - 0.35 || t > b + 0.5) return null;
              return <div key={i} style={{ position: "absolute", left: 60 + k * 470, top: 170 - Math.sin(k * Math.PI) * 60, transform: `rotate(${k * 720}deg)` }}><Mascot who="pucky" size={110} mood="laugh" seed={`b${i}`} /></div>;
            })}
            {bonks.map((b, i) => t >= b && t < b + 0.4 && <div key={`k${i}`} style={{ position: "absolute", left: 420, top: 70, fontWeight: 900, fontStyle: "italic", fontSize: 64, color: "#fff", WebkitTextStroke: `5px ${P.ink}`, paintOrder: "stroke fill" }}>BONK!</div>)}
            <div style={{ position: "absolute", left: 30, top: 300, display: "flex", gap: 10 }}>{["MON", "TUE", "WED"].map((d, i) => <div key={d} style={{ width: 110, height: 80, border: `5px solid ${P.ink}`, borderRadius: 10, background: i < hit ? "#fecaca" : "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 24 }}>{d}<span style={{ color: P.red, fontSize: 30 }}>{i < hit ? "BONK" : ""}</span></div>)}</div>
          </>
        )}
      </div>
      <div style={{ position: "absolute", left: 40, top: 548 }}><Stamp color={P.red} at={fr(from, g0 + 1.7)} rot={-3} size={40}>NHL RECORD · 108.8 MPH</Stamp></div>
      <BoardFoot source="NHL All-Star Skills 2012 (Fox Sports / AP)" />
    </PaperCard>
  );
};

const SwapBoard: React.FC<{ from: number }> = ({ from }) => {
  const t = useT(from);
  const f = useCurrentFrame();
  const warm = at("p_swap", "warm"), swap = at("p_swap", "swaps"), col = S("h_colour").start - 0.1;
  const heat = interpolate(t, [from, warm + 0.3], [0, 1], clamp);
  return (
    <PaperCard w={960} h={740} seed="pd4" tag={TAG}>
      <Header title={t < col ? "SHIFT CHANGE" : "THE MOOD PUCK"} sub={t < col ? "every couple of minutes" : "tested by the NHL"} accent={P.teal} />
      <Clock time="7:42 PM" />
      <div style={{ position: "absolute", left: 0, top: 128, width: 892, height: 400, background: "#f4fbff", border: `6px solid ${P.ink}`, borderRadius: 22, overflow: "hidden" }}>
        {t < col ? (
          <>
            <div style={{ position: "absolute", left: interpolate(t, [swap, swap + 0.6], [120, -260], clamp), top: 130 }}>
              <Mascot who="pucky" size={190} mood="talk" seed="sw" />
              {heat > 0.3 && [0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 30 + i * 60, top: 20 + ((f * 3 + i * 40) % 90), fontSize: 34, color: "#60a5fa" }}>💧</div>)}
            </div>
            <div style={{ position: "absolute", left: 330, top: 40, width: 50, height: 240, border: `6px solid ${P.ink}`, borderRadius: 25, background: "#fff", overflow: "hidden" }}><div style={{ position: "absolute", bottom: 0, width: "100%", height: `${20 + heat * 75}%`, background: heat > 0.6 ? P.red : "#3b82f6" }} /></div>
            <div style={{ position: "absolute", left: 470, top: 90 }}>
              <Mascot who="helmy" size={180} mood="wow" seed="lin" flip />
              <div style={{ position: "absolute", left: 50, top: 205 }}><BandTag b={{ c1: "#fff", c2: "#111", n: "LINE" }} w={90} /></div>
            </div>
            <div style={{ position: "absolute", left: interpolate(t, [swap, swap + 0.6], [900, 690], clamp), top: 200 }}><PlainPuck s={150} frost /></div>
            {t > swap + 0.6 && <div style={{ position: "absolute", left: 640, top: 140, fontFamily: HAND, fontSize: 40, color: "#3b82f6" }}>frozen buddy</div>}
          </>
        ) : (
          <>
            {[{ x: 120, lab: "FROZEN", fl: "hue-rotate(260deg) saturate(6) brightness(1.6)" }, { x: 520, lab: "WARM", fl: "opacity(0.45)" }].map(({ x, lab, fl }, i) => (
              <div key={lab} style={{ position: "absolute", left: x, top: 60, textAlign: "center", opacity: t > col + i * 0.6 ? 1 : 0.15 }}>
                <div style={{ filter: fl }}><Mascot who="pucky" size={220} mood={i ? "talk" : "laugh"} seed={`c${i}`} /></div>
                <div style={{ fontWeight: 900, fontSize: 36, color: i ? P.muted : "#7c3aed" }}>{lab} = {i ? "CLEAR" : "PURPLE"}</div>
              </div>
            ))}
          </>
        )}
      </div>
      <div style={{ position: "absolute", left: 40, top: 548 }}><Stamp color="#7c3aed" at={fr(from, at("h_colour", "colour"))} rot={-3} size={38}>COLOUR-CHANGING PUCKS · 2019–20</Stamp></div>
      <BoardFoot source="Cronkite News · NHL officials" />
    </PaperCard>
  );
};

const CoolBoard: React.FC<{ from: number }> = ({ from }) => {
  const t = useT(from);
  const cool = at("p_cool", "cool");
  return (
    <PaperCard w={960} h={740} seed="pd5" tag={TAG}>
      <Header title="BACK TO THE FREEZER" sub="clocking out" accent={P.teal} />
      <Clock time="11:00 PM" />
      <div style={{ position: "absolute", left: 0, top: 128, width: 892, height: 400, background: "#e8f4fb", border: `6px solid ${P.ink}`, borderRadius: 22, overflow: "hidden" }}>
        <Frost />
        <div style={{ position: "absolute", left: 300, top: 80 }}><Mascot who="pucky" size={280} mood="laugh" shades={t > cool - 0.15} seed="cool" /></div>
        {t > cool && <div style={{ position: "absolute", left: 80, top: 60, fontWeight: 900, fontStyle: "italic", fontSize: 96, color: "#fff", WebkitTextStroke: `7px #3b82f6`, paintOrder: "stroke fill", transform: "rotate(-8deg)" }}>COOL!</div>}
      </div>
      <div style={{ position: "absolute", left: 40, top: 548 }}><Stamp color={P.teal} at={fr(from, cool)} rot={-3} size={44}>EMPLOYEE OF THE MONTH</Stamp></div>
    </PaperCard>
  );
};

const scenes: SceneDef[] = [
  { id: "intro", from: 0, Board: IntroBoard },
  { id: "wake", from: S("p_wake").start - 0.2, Board: WakeBoard, slap: "left", wipe: true },
  { id: "warm", from: S("p_warm").start - 0.2, Board: WarmBoard, wipe: true },
  { id: "game", from: S("p_game").start - 0.2, Board: GameBoard, slap: "left", wipe: true },
  { id: "swap", from: S("p_swap").start - 0.2, Board: SwapBoard, wipe: true },
  { id: "cool", from: S("p_cool").start - 0.2, Board: CoolBoard, slap: "left", wipe: true },
];

const Extras: React.FC<{ N: (s: number) => number }> = ({ N }) => (
  <>
    <Sequence from={N(at("p_wake", "wake"))} durationInFrames={50}><Audio src={staticFile("brand/ding.wav")} volume={0.6} /></Sequence>
    <Sequence from={N(S("h_bounce").start + 0.2)} durationInFrames={40}><Audio src={staticFile("brand/boing.wav")} volume={0.5} /></Sequence>
    {[...Array(7)].map((_, k) => <Sequence key={k} from={N(at("p_warm", "slaps") - 0.2 + (k + 1) * 0.55)} durationInFrames={20}><Audio src={staticFile("pop.wav")} volume={0.6} /></Sequence>)}
    <ComicBurst text="SLAP!" at={N(at("p_warm", "slaps"))} x={790} y={1240} color={P.green} size={0.75} dur={50} />
    <Sequence from={N(at("p_game", "hardest"))} durationInFrames={60}><Audio src={staticFile("brand/riser.wav")} volume={0.4} /></Sequence>
    <ComicBurst text="108.8!" at={N(at("p_game", "hardest") + 1.6)} x={790} y={1240} color={P.red} size={0.8} dur={60} />
    {["every", "single", "day"].map((w) => <Sequence key={w} from={N(at("b_mask", w))} durationInFrames={30}><Audio src={staticFile("brand/impact.wav")} volume={0.45} /></Sequence>)}
    <Sequence from={N(at("p_swap", "swaps"))} durationInFrames={30}><Audio src={staticFile("whoosh.wav")} volume={0.5} /></Sequence>
    <ComicBurst text="COOL!" at={N(at("p_cool", "cool"))} x={790} y={1240} color="#3b82f6" size={0.8} dur={50} />
    <Sequence from={N(at("p_cool", "cool"))} durationInFrames={40}><Audio src={staticFile("brand/rimshot.wav")} volume={0.6} /></Sequence>
    <Sequence from={N(at("p_cool", "cool"))} durationInFrames={100}><Confetti n={50} x={540} y={400} /></Sequence>
  </>
);

export const { Comp: PuckyDay, FRAMES: PUCKYDAY_FRAMES } = makeEpisode({
  words: WORDS, vo: "ep/pucky_day.mp3", mood: MOOD, scenes, Extras, tagline: "behind the scenes!",
  shades: (id, t) => id === "p_cool" && t > at("p_cool", "cool") - 0.15,
});
