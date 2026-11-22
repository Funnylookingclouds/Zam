import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, random } from "remotion";
import { C, FONT } from "../theme";
import { GlitchText, Particles, Overlay } from "../Effects";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const HANDLE = "@AIBounce";
const GRAD = `linear-gradient(135deg, ${C.cyan}, ${C.purple} 55%, ${C.pink})`;

// ===========================================================================
// LOGO
// ===========================================================================
/** The ball: gradient sphere with highlight. */
export const Ball: React.FC<{ size: number; squash?: number; glow?: number }> = ({ size, squash = 0, glow = 1 }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    background: `radial-gradient(circle at 32% 28%, #ffffff 0%, ${C.cyan} 22%, ${C.purple} 70%, #4c1d95 100%)`,
    boxShadow: `0 0 ${40 * glow}px ${C.cyan}, 0 0 ${90 * glow}px ${C.purple}88`,
    transform: `scale(${1 + squash * 0.35}, ${1 - squash * 0.35})`, transformOrigin: "50% 100%",
  }} />
);

/** Wordmark: "AI" gradient + "BOUNCE" with letters on a rising (exponential) baseline. */
export const Wordmark: React.FC<{ scale?: number; reveal?: number; bounceIn?: boolean }> = ({ scale = 1, reveal = 1, bounceIn = false }) => {
  const f = useCurrentFrame();
  const word = "BOUNCE".split("");
  return (
    <div style={{ display: "flex", alignItems: "flex-end", fontFamily: FONT, fontWeight: 900, fontStyle: "italic", transform: `scale(${scale})`, letterSpacing: -4 }}>
      <span style={{ fontSize: 210, lineHeight: 1, background: GRAD, WebkitBackgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 30px ${C.cyan}88)`, marginRight: 22, opacity: reveal }}>AI</span>
      {word.map((ch, i) => {
        const rise = Math.pow(1.55, i) * 3; // exponential baseline
        const t = f - i * 3;
        const p = bounceIn ? interpolate(t, [0, 14], [0, 1], { ...clamp, easing: Easing.out(Easing.bounce) }) : 1;
        return (
          <span key={i} style={{
            fontSize: 150, lineHeight: 1, color: C.text, display: "inline-block",
            transform: `translateY(${-rise - (1 - p) * 500}px) rotate(${-4 - i * 1.5}deg)`,
            opacity: bounceIn ? (t > 0 ? 1 : 0) : reveal, textShadow: `0 10px 0 #020617, 0 0 24px ${C.purple}66`,
          }}>{ch}</span>
        );
      })}
    </div>
  );
};

/** Compact logo lockup: ball with speed trails + wordmark + tagline. */
export const LogoLockup: React.FC<{ scale?: number; tagline?: boolean }> = ({ scale = 1, tagline = true }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${scale})` }}>
    <div style={{ position: "relative", marginBottom: 10 }}>
      {[0, 1, 2].map((k) => (
        <div key={k} style={{ position: "absolute", top: 40 + k * 26, right: 130, width: 220 - k * 50, height: 12, borderRadius: 6, background: `linear-gradient(90deg, transparent, ${C.cyan})`, opacity: 0.8 - k * 0.2 }} />
      ))}
      <Ball size={130} />
    </div>
    <Wordmark />
    {tagline && <div style={{ marginTop: 26, fontFamily: FONT, fontSize: 44, fontWeight: 800, letterSpacing: 10, color: C.muted }}>KEEP UP WITH AI</div>}
  </div>
);

const Bg: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: C.bg, overflow: "hidden", fontFamily: FONT, color: C.text }}>
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, ${C.purple}33, transparent 60%)` }} />
    <Particles />
    {children}
    <Overlay />
  </AbsoluteFill>
);

const Flash: React.FC<{ at: number; color?: string }> = ({ at, color = "#fff" }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [at, at + 2, at + 14], [0, 0.9, 0], clamp);
  return <AbsoluteFill style={{ background: color, opacity: o, pointerEvents: "none" }} />;
};

const Ring: React.FC<{ at: number; y?: number; color?: string }> = ({ at, y = 960, color = C.cyan }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 30], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  if (f < at || p >= 1) return null;
  return <div style={{ position: "absolute", left: 540 - p * 1000, top: y - p * 1000, width: p * 2000, height: p * 2000, borderRadius: "50%", border: `${(1 - p) * 26}px solid ${color}`, opacity: 1 - p, boxShadow: `0 0 60px ${color}` }} />;
};

const shake = (f: number, at: number, amt = 30) => {
  const k = interpolate(f, [at, at + 18], [1, 0], clamp);
  if (f < at) return "none";
  return `translate(${(random(`sx${f}`) - 0.5) * amt * k}px, ${(random(`sy${f}`) - 0.5) * amt * k}px)`;
};

const Burst: React.FC<{ at: number; cx?: number; cy?: number }> = ({ at, cx = 540, cy = 900 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const t = f - at;
  return (
    <>
      {[...Array(36)].map((_, i) => {
        const a = random(`ba${i}`) * Math.PI * 2;
        const v = 18 + random(`bv${i}`) * 30;
        const x = cx + Math.cos(a) * v * t;
        const y = cy + Math.sin(a) * v * t + 0.6 * t * t;
        const c = [C.cyan, C.purple, C.pink, C.amber, C.green][i % 5];
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 18, height: 18, borderRadius: i % 2 ? 4 : 9, background: c, opacity: interpolate(t, [0, 40], [1, 0], clamp), transform: `rotate(${t * 15 + i}deg)`, boxShadow: `0 0 12px ${c}` }} />;
      })}
    </>
  );
};

// ===========================================================================
// INTRO A – "Hyperbounce": ball bounces higher & faster along an exponential curve
// ===========================================================================
const BOUNCES = [ // [startFrame, duration, height]
  [0, 26, 110], [26, 20, 210], [46, 15, 360], [61, 11, 560], [72, 8, 820],
];
const ballPos = (f: number) => {
  const xs = [80, 230, 380, 530, 690, 540];
  for (let k = 0; k < BOUNCES.length; k++) {
    const [s, d, h] = BOUNCES[k];
    if (f < s + d) {
      const u = Math.max(0, (f - s) / d);
      const floor = 1500 - k * 40;
      return { x: xs[k] + (xs[k + 1] - xs[k]) * u, y: floor - 4 * h * u * (1 - u), squash: u < 0.12 ? (1 - u / 0.12) : 0 };
    }
  }
  return null;
};
export const IntroHyperbounce: React.FC = () => {
  const f = useCurrentFrame();
  const HIT = 80;
  const pos = ballPos(f);
  const trail = [...Array(14)].map((_, k) => ballPos(f - k * 1.5)).filter(Boolean) as { x: number; y: number }[];
  const reveal = interpolate(f, [HIT, HIT + 12], [0, 1], clamp);
  return (
    <Bg>
      {/* growth chart */}
      <svg width={1080} height={1920} style={{ position: "absolute", opacity: interpolate(f, [HIT, HIT + 10], [0.9, 0.15], clamp) }}>
        <line x1={70} y1={1560} x2={1010} y2={1560} stroke="#ffffff33" strokeWidth={4} />
        <line x1={70} y1={1560} x2={70} y2={500} stroke="#ffffff33" strokeWidth={4} />
        <text x={80} y={1610} fill={C.muted} fontSize={30} fontWeight={800} fontFamily={FONT}>TIME →</text>
        <text x={90} y={520} fill={C.muted} fontSize={30} fontWeight={800} fontFamily={FONT}>AI PROGRESS ↑</text>
        <path d={`M70 1540 ${[...Array(60)].map((_, i) => { const x = 70 + i * 16; const y = 1540 - Math.pow(1.085, i) * 6; return `L${x} ${Math.max(300, y)}`; }).join(" ")}`}
          stroke={C.pink} strokeWidth={6} fill="none" strokeDasharray={2600} strokeDashoffset={interpolate(f, [0, HIT], [2600, 0], clamp)} style={{ filter: `drop-shadow(0 0 12px ${C.pink})` }} />
      </svg>
      <AbsoluteFill style={{ transform: shake(f, HIT, 40) }}>
        {f < HIT && trail.map((p, k) => <div key={k} style={{ position: "absolute", left: p.x - 45, top: p.y - 90, width: 90, height: 90, borderRadius: "50%", background: C.cyan, opacity: 0.25 * (1 - k / 14) }} />)}
        {pos && f < HIT && <div style={{ position: "absolute", left: pos.x - 60, top: pos.y - 120 }}><Ball size={120} squash={pos.squash} /></div>}
        {f >= HIT && (
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
            <div style={{ transform: `scale(${interpolate(f, [HIT, HIT + 10, HIT + 20], [1.6, 0.92, 1], clamp)})`, opacity: reveal }}>
              <Sequence from={HIT} layout="none"><LogoBounceIn /></Sequence>
            </div>
          </AbsoluteFill>
        )}
        <Ring at={HIT} y={900} />
        <Ring at={HIT + 6} y={900} color={C.pink} />
        <Burst at={HIT} />
      </AbsoluteFill>
      <Flash at={HIT} />
      {[0, 26, 46, 61, 72].map((s) => <Sequence key={s} from={s} durationInFrames={30}><Audio src={staticFile("brand/boing.wav")} volume={0.5} playbackRate={1 + s / 80} /></Sequence>)}
      <Sequence from={HIT}><Audio src={staticFile("brand/impact.wav")} volume={0.9} /></Sequence>
    </Bg>
  );
};

const LogoBounceIn: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ball = spring({ frame: f, fps, config: { damping: 7 } });
  const tag = interpolate(f, [40, 55], [0, 1], clamp);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ transform: `translateY(${(1 - ball) * -300}px)`, marginBottom: 10 }}><Ball size={130} /></div>
      <Wordmark bounceIn />
      <div style={{ marginTop: 26, fontSize: 44, fontWeight: 800, letterSpacing: 10 * tag + 2, color: C.muted, opacity: tag }}>KEEP UP WITH AI</div>
    </div>
  );
};

// ===========================================================================
// INTRO B – "Warp Speed": light-speed streaks, glitch "AI", BOUNCE ricochets in
// ===========================================================================
const STREAKS = [...Array(70)].map((_, i) => ({ a: random(`wa${i}`) * Math.PI * 2, r: random(`wr${i}`), c: [C.cyan, C.purple, C.pink, C.text][i % 4] }));
export const IntroWarp: React.FC = () => {
  const f = useCurrentFrame();
  const HIT = 42; // compressed: whole intro is 2 s (INTRO_SEG)
  const speed = interpolate(f, [0, HIT], [0.2, 3], { ...clamp, easing: Easing.in(Easing.cubic) });
  const counter = f < 12 ? "1×" : f < 24 ? "10×" : f < 35 ? "1000×" : "∞";
  const ai = interpolate(f, [0, HIT], [0.05, 1], { ...clamp, easing: Easing.in(Easing.exp) });
  return (
    <Bg>
      <AbsoluteFill style={{ transform: shake(f, HIT, 50) }}>
        <svg width={1080} height={1920} style={{ position: "absolute", opacity: f < HIT + 14 ? 1 : interpolate(f, [HIT + 14, HIT + 30], [1, 0.2], clamp) }}>
          {STREAKS.map((s, i) => {
            const d0 = ((s.r * 900 + f * 30 * speed) % 1100);
            const len = 20 + speed * 160;
            const x0 = 540 + Math.cos(s.a) * d0, y0 = 900 + Math.sin(s.a) * d0;
            const x1 = 540 + Math.cos(s.a) * (d0 + len), y1 = 900 + Math.sin(s.a) * (d0 + len);
            return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} stroke={s.c} strokeWidth={3 + speed} strokeLinecap="round" opacity={0.8} />;
          })}
        </svg>
        {f < HIT && (
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 380, fontWeight: 900, fontStyle: "italic", transform: `scale(${ai})` }}>
              <GlitchText seed="warp" color={C.text}>AI</GlitchText>
            </div>
          </AbsoluteFill>
        )}
        <div style={{ position: "absolute", top: 300, width: 1080, textAlign: "center", fontSize: 50, fontWeight: 900, color: C.amber, letterSpacing: 6, opacity: f < HIT ? 1 : 0 }}>
          SPEED: <span style={{ fontSize: 80 }}>{counter}</span>
        </div>
        {f >= HIT && (
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
            <Sequence from={HIT} layout="none"><RicochetLogo /></Sequence>
          </AbsoluteFill>
        )}
        <Ring at={HIT} y={900} color={C.purple} />
        <Burst at={HIT} />
      </AbsoluteFill>
      <Flash at={HIT} color={C.cyan} />
      <Audio src={staticFile("brand/riser.wav")} volume={0.8} startFrom={Math.round(1.4 * 60) - HIT} />
      <Sequence from={HIT}><Audio src={staticFile("brand/impact.wav")} /></Sequence>
      <Sequence from={HIT + 12}><Audio src={staticFile("brand/boing.wav")} volume={0.4} /></Sequence>
    </Bg>
  );
};

const RicochetLogo: React.FC = () => {
  const f = useCurrentFrame();
  const letters = "BOUNCE".split("");
  const ai = interpolate(f, [0, 8], [2.4, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ fontSize: 250, fontWeight: 900, fontStyle: "italic", lineHeight: 1, transform: `scale(${ai})`, background: GRAD, WebkitBackgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 40px ${C.cyan})` }}>AI</div>
      <div style={{ display: "flex", fontSize: 160, fontWeight: 900, fontStyle: "italic", letterSpacing: -4, marginTop: -10 }}>
        {letters.map((ch, i) => {
          const t = f - 6 - i * 2;
          const p = interpolate(t, [0, 14], [0, 1], { ...clamp, easing: Easing.out(Easing.elastic(1.2)) });
          const sx = (random(`rx${i}`) - 0.5) * 2400, sy = (random(`ry${i}`) - 0.5) * 2400;
          return <span key={i} style={{ display: "inline-block", transform: `translate(${sx * (1 - p)}px, ${sy * (1 - p) - Math.pow(1.55, i) * 3}px) rotate(${(1 - p) * 720}deg)`, opacity: t > 0 ? 1 : 0, textShadow: `0 10px 0 #020617` }}>{ch}</span>;
        })}
      </div>
      <div style={{ marginTop: 30, fontSize: 44, fontWeight: 800, letterSpacing: 10, color: C.muted, opacity: interpolate(f, [26, 38], [0, 1], clamp) }}>KEEP UP WITH AI</div>
    </div>
  );
};

// ===========================================================================
// INTRO C – "Off the Charts": chart rockets off the top, ball falls back = logo
// ===========================================================================
export const IntroOffTheCharts: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const SPIKE = 50, LAND = 88;
  const pts: [number, number][] = [[80, 1450], [220, 1420], [340, 1440], [460, 1380], [580, 1330], [690, 1200], [780, 1000], [850, 650], [890, 100], [910, -400]];
  const prog = interpolate(f, [0, SPIKE], [0, pts.length - 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const shown = pts.slice(0, Math.floor(prog) + 1);
  const k = Math.floor(prog), u = prog - k;
  const tip = k < pts.length - 1 ? [pts[k][0] + (pts[k + 1][0] - pts[k][0]) * u, pts[k][1] + (pts[k + 1][1] - pts[k][1]) * u] : pts[pts.length - 1];
  const tiltCam = interpolate(f, [30, SPIKE], [0, -120], clamp) * (f < LAND ? 1 : 0);
  const fallY = interpolate(f, [SPIKE + 10, LAND], [-300, 760], { ...clamp, easing: Easing.in(Easing.quad) });
  const land = spring({ frame: f - LAND, fps, config: { damping: 6 } });
  const year = Math.round(interpolate(f, [0, SPIKE], [2020, 2026], clamp));
  return (
    <Bg>
      <AbsoluteFill style={{ transform: `translateY(${-tiltCam}px) ${shake(f, LAND, 36)}` }}>
        <svg width={1080} height={1920} style={{ position: "absolute", opacity: f < LAND ? 1 : interpolate(f, [LAND, LAND + 12], [1, 0.12], clamp) }}>
          {[...Array(8)].map((_, i) => <line key={i} x1={60} x2={1020} y1={1500 - i * 150} y2={1500 - i * 150} stroke="#ffffff12" strokeWidth={2} />)}
          <polyline points={[...shown, tip].map((p) => p.join(",")).join(" ")} fill="none" stroke={C.green} strokeWidth={10} strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 16px ${C.green})` }} />
          <circle cx={tip[0]} cy={tip[1]} r={18} fill={C.green} />
        </svg>
        <div style={{ position: "absolute", left: 80, top: 1520, fontSize: 60, fontWeight: 900, color: C.muted, opacity: f < LAND ? 1 : 0 }}>{year}</div>
        <div style={{ position: "absolute", top: 260, width: 1080, textAlign: "center", fontSize: 70, fontWeight: 900, color: C.amber, opacity: interpolate(f, [SPIKE - 5, SPIKE + 5, LAND - 5, LAND], [0, 1, 1, 0], clamp), transform: `rotate(-4deg) scale(${1 + Math.sin(f / 3) * 0.04})` }}>OFF THE CHARTS!</div>
        {f > SPIKE + 10 && f < LAND && <div style={{ position: "absolute", left: 480, top: fallY }}><Ball size={120} /></div>}
        {f >= LAND && (
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
            <div style={{ transform: `scale(${0.6 + 0.4 * land})` }}><LogoLockup /></div>
          </AbsoluteFill>
        )}
        <Ring at={LAND} y={880} color={C.green} />
        <Burst at={LAND} />
      </AbsoluteFill>
      <Flash at={LAND} />
      <Audio src={staticFile("brand/riser.wav")} volume={0.7} />
      <Sequence from={LAND}><Audio src={staticFile("brand/impact.wav")} /></Sequence>
    </Bg>
  );
};

// ===========================================================================
// OUTROS (3 s) – "Follow for more – and please subscribe!"
// ===========================================================================
const OutroVO: React.FC = () => <Sequence from={12}><Audio src={staticFile("brand/outro_vo.mp3")} /></Sequence>;

const SubButton: React.FC<{ pressed: number; done: boolean }> = ({ pressed, done }) => (
  <div style={{
    padding: "34px 70px", borderRadius: 999, fontSize: 76, fontWeight: 900, letterSpacing: 2,
    background: done ? C.green : C.text, color: C.bg, transform: `scaleY(${1 - pressed * 0.18}) scaleX(${1 + pressed * 0.06})`,
    boxShadow: done ? `0 0 70px ${C.green}` : `0 0 50px ${C.cyan}66`, display: "flex", alignItems: "center", gap: 20,
  }}>{done ? "SUBSCRIBED ✓" : "SUBSCRIBE"}</div>
);
const Bell: React.FC<{ ring: number }> = ({ ring }) => (
  <svg width={130} height={130} viewBox="0 0 24 24" style={{ transform: `rotate(${Math.sin(ring * 1.4) * 25 * Math.max(0, 1 - ring / 40)}deg)`, transformOrigin: "50% 10%", filter: `drop-shadow(0 0 20px ${C.amber})` }}>
    <path d="M12 2 C8 2 6 5 6 9 V14 L4 17 H20 L18 14 V9 C18 5 16 2 12 2 Z" fill={C.amber} />
    <circle cx={12} cy={20} r={2.2} fill={C.amber} />
  </svg>
);

/** Outro 1 – the ball drops and smashes the subscribe button. */
export const OutroSmash: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const HIT = 34;
  const y = f < HIT ? interpolate(f, [0, HIT], [-200, 820], { easing: Easing.in(Easing.quad) }) : 820 - Math.abs(Math.sin((f - HIT) / 9)) * 260 * Math.exp(-(f - HIT) / 30);
  const pressed = interpolate(f, [HIT, HIT + 4, HIT + 12], [0, 1, 0], clamp);
  const head = spring({ frame: f, fps, config: { damping: 12 } });
  return (
    <Bg>
      <AbsoluteFill style={{ transform: shake(f, HIT, 24) }}>
        <div style={{ position: "absolute", top: 330, width: 1080, display: "flex", justifyContent: "center", transform: `scale(${head})` }}>
          <div style={{ fontSize: 96, fontWeight: 900, textAlign: "center", lineHeight: 1.05 }}>FOLLOW<br /><span style={{ background: GRAD, WebkitBackgroundClip: "text", color: "transparent" }}>FOR MORE</span></div>
        </div>
        <div style={{ position: "absolute", left: 480, top: y - 120 }}><Ball size={120} /></div>
        <div style={{ position: "absolute", top: 940, width: 1080, display: "flex", justifyContent: "center", alignItems: "center", gap: 30 }}>
          <SubButton pressed={pressed} done={f > HIT + 2} />
          <div style={{ opacity: f > HIT ? 1 : 0.3 }}><Bell ring={Math.max(0, f - HIT)} /></div>
        </div>
        <div style={{ position: "absolute", top: 1180, width: 1080, textAlign: "center", fontSize: 54, fontWeight: 800, color: C.muted, opacity: interpolate(f, [HIT + 10, HIT + 25], [0, 1], clamp) }}>{HANDLE}</div>
        <Ring at={HIT} y={1010} color={C.green} />
        <Burst at={HIT} cx={540} cy={1000} />
      </AbsoluteFill>
      <OutroVO />
      <Sequence from={HIT}><Audio src={staticFile("brand/boing.wav")} volume={0.5} /></Sequence>
      <Sequence from={HIT + 3}><Audio src={staticFile("brand/ding.wav")} volume={0.6} /></Sequence>
    </Bg>
  );
};

/** Outro 2 – "next week's AI is loading…" progress bar that maxes out. */
export const OutroLoading: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [8, 120], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const glitch = f > 120;
  return (
    <Bg>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: "translateY(-260px)" }}><LogoLockup scale={0.62} tagline={false} /></div>
      </AbsoluteFill>
      <div style={{ position: "absolute", top: 1010, left: 110, right: 110 }}>
        <div style={{ fontSize: 44, fontWeight: 800, color: C.muted, letterSpacing: 3, marginBottom: 20 }}>NEXT WEEK'S AI NEWS LOADING…</div>
        <div style={{ height: 50, borderRadius: 25, background: "#ffffff14", overflow: "hidden" }}>
          <div style={{ width: `${p * 100}%`, height: 50, borderRadius: 25, background: GRAD, boxShadow: `0 0 30px ${C.cyan}` }} />
        </div>
        <div style={{ fontSize: 60, fontWeight: 900, marginTop: 14, textAlign: "right", fontVariantNumeric: "tabular-nums", color: glitch ? C.pink : C.text }}>
          {glitch ? <GlitchText seed="ld">TOO FAST!</GlitchText> : `${Math.round(p * 100)}%`}
        </div>
      </div>
      <div style={{ position: "absolute", top: 1300, width: 1080, textAlign: "center", fontSize: 64, fontWeight: 900, lineHeight: 1.15 }}>
        Follow &amp; subscribe<br /><span style={{ color: C.cyan }}>so you don't fall behind</span>
      </div>
      <OutroVO />
      <Sequence from={120}><Audio src={staticFile("brand/ding.wav")} volume={0.5} /></Sequence>
    </Bg>
  );
};

/** Outro 3 – karaoke bounce: the ball hops across FOLLOW · FOR · MORE, then SUBSCRIBE pops. */
export const OutroKaraoke: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = [{ w: "FOLLOW", x: 210 }, { w: "FOR", x: 545 }, { w: "MORE", x: 850 }];
  const hopT = [10, 30, 50];
  let bx = 100, by = 700;
  for (let i = 0; i < 3; i++) {
    const s = hopT[i] - 20, e = hopT[i];
    if (f >= s && f < e + 20) {
      const u = interpolate(f, [s, e], [0, 1], clamp);
      const px = i === 0 ? 100 : words[i - 1].x;
      bx = px + (words[i].x - px) * u;
      by = 700 - Math.sin(u * Math.PI) * 220;
    }
    if (f >= e + 20 && i === 2) { bx = 850; by = 700; }
  }
  const sub = spring({ frame: f - 70, fps, config: { damping: 8 } });
  return (
    <Bg>
      <div style={{ position: "absolute", top: 420, width: 1080, textAlign: "center" }}><LogoLockup scale={0.45} tagline={false} /></div>
      <div style={{ position: "absolute", left: bx - 50, top: by - 100 }}><Ball size={100} /></div>
      {words.map((w, i) => {
        const lit = f >= hopT[i];
        const pop = lit ? interpolate(f, [hopT[i], hopT[i] + 6, hopT[i] + 14], [1, 1.25, 1], clamp) : 1;
        return <div key={i} style={{ position: "absolute", top: 760, left: w.x - 200, width: 400, textAlign: "center", fontSize: 80, fontWeight: 900, color: lit ? C.cyan : "#ffffff33", transform: `scale(${pop})`, textShadow: lit ? `0 0 30px ${C.cyan}` : undefined }}>{w.w}</div>;
      })}
      <div style={{ position: "absolute", top: 1000, width: 1080, display: "flex", justifyContent: "center", alignItems: "center", gap: 30, transform: `scale(${sub})` }}>
        <SubButton pressed={0} done={false} />
        <Bell ring={Math.max(0, f - 70)} />
      </div>
      <div style={{ position: "absolute", top: 1230, width: 1080, textAlign: "center", fontSize: 54, fontWeight: 800, color: C.muted, opacity: sub }}>{HANDLE}</div>
      {hopT.map((t) => <Sequence key={t} from={t} durationInFrames={30}><Audio src={staticFile("brand/boing.wav")} volume={0.35} playbackRate={1 + t / 60} /></Sequence>)}
      <OutroVO />
      <Sequence from={70}><Audio src={staticFile("brand/ding.wav")} volume={0.5} /></Sequence>
    </Bg>
  );
};

// ===========================================================================
// Review reel + logo stills
// ===========================================================================
const ITEMS: { C: React.FC; label: string }[] = [
  { C: IntroHyperbounce, label: "INTRO A · HYPERBOUNCE" },
  { C: IntroWarp, label: "INTRO B · WARP SPEED" },
  { C: IntroOffTheCharts, label: "INTRO C · OFF THE CHARTS" },
  { C: OutroSmash, label: "OUTRO 1 · BUTTON SMASH" },
  { C: OutroLoading, label: "OUTRO 2 · LOADING NEXT WEEK" },
  { C: OutroKaraoke, label: "OUTRO 3 · KARAOKE BOUNCE" },
];
export const SEG = 180;
export const INTRO_SEG = 120; // chosen intro (Warp Speed) is 2 s
export const ProposalsReel: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {ITEMS.map((it, i) => (
      <Sequence key={i} from={i * (SEG + 30)} durationInFrames={SEG + 30}>
        <Sequence durationInFrames={30}><Card label={it.label} /></Sequence>
        <Sequence from={30} durationInFrames={SEG}><it.C /></Sequence>
      </Sequence>
    ))}
  </AbsoluteFill>
);
export const REEL_LEN = ITEMS.length * (SEG + 30);
const Card: React.FC<{ label: string }> = ({ label }) => (
  <AbsoluteFill style={{ background: "#000", alignItems: "center", justifyContent: "center", fontFamily: FONT }}>
    <div style={{ fontSize: 64, fontWeight: 900, color: C.text, letterSpacing: 4, textAlign: "center", padding: 60 }}>{label}</div>
  </AbsoluteFill>
);

export const LogoSquare: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg, alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, ${C.purple}55, transparent 65%)` }} />
    <LogoLockup scale={0.95} />
  </AbsoluteFill>
);

/** Channel avatar: ball + "AI" monogram, reads at tiny sizes. */
export const LogoAvatar: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, #1e1b4b, ${C.bg})`, alignItems: "center", justifyContent: "center", fontFamily: FONT }}>
    {[0, 1, 2].map((k) => <div key={k} style={{ position: "absolute", left: 30 + k * 40, top: 290 + k * 80, width: 260 - k * 70, height: 34, borderRadius: 17, background: `linear-gradient(90deg, transparent, ${C.cyan})`, opacity: 0.9 - k * 0.2 }} />)}
    <div style={{ position: "relative", transform: "translateX(70px)" }}>
      <Ball size={520} glow={1.4} />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 300, fontWeight: 900, fontStyle: "italic", color: "#fff", textShadow: "0 12px 0 #2e1065" }}>AI</div>
    </div>
  </AbsoluteFill>
);
