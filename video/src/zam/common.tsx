/** Shared ZAM building blocks: ice background, captions, Zam ice-wipe, paper logo, lineup, confetti, paper players, rink diagram. */
import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, Easing } from "remotion";
import { P, HAND, clamp, onTwos, tornPath } from "../presenter/kit";
import { FONT } from "../theme";
import { GANG, Mascot, type Mood, type Who } from "../mascots/Gang";

export type W = { word: string; display: string; start: number; end: number; segment: string; keyword: boolean };
export type Seg = { id: string; who: Who; start: number; end: number; words: W[] };

export const buildSegs = (words: W[], who: (id: string) => Who): Seg[] => {
  const ids: string[] = [];
  words.forEach((w) => { if (!ids.includes(w.segment)) ids.push(w.segment); });
  return ids.map((id) => { const ws = words.filter((w) => w.segment === id); return { id, who: who(id), start: ws[0].start, end: ws[ws.length - 1].end, words: ws }; });
};

/** Soft ice background with skate scratches, on twos. */
export const Ice: React.FC = () => {
  const g = onTwos(useCurrentFrame());
  const j = (random(`ice${g}`) - 0.5) * 3;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 35%, #f4fbff 0%, #dbeef8 60%, #b9d9ea 100%)" }}>
      <svg width={1080} height={1920} style={{ position: "absolute", transform: `translate(${j}px, ${-j}px)` }}>
        {[...Array(26)].map((_, i) => {
          const x = random(`sx${i}`) * 1080, y = random(`sy${i}`) * 1920, l = 120 + random(`sl${i}`) * 260, a = random(`sa${i}`) * 0.6 - 0.3;
          return <path key={i} d={`M${x} ${y} q${l / 2} ${l * a} ${l} ${l * a * 0.4}`} stroke="#ffffff" strokeWidth={3} fill="none" opacity={0.7} />;
        })}
        <rect x={0} y={1010} width={1080} height={14} fill="#d94b3b" opacity={0.3} />
        <rect x={0} y={1640} width={1080} height={16} fill="#3b82f6" opacity={0.3} />
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, #0b254555 100%)" }} />
    </AbsoluteFill>
  );
};

/** Caption strip: current chunk of the current segment, speaker accent bar, word underline, keywords in mustard. */
export const Caption: React.FC<{ t: number; segs: Seg[]; top?: number; hide?: (id: string) => boolean }> = ({ t, segs, top = 925, hide }) => {
  const seg = segs.find((s, i) => t >= s.start - 0.15 && t < (segs[i + 1]?.start ?? 999) - 0.15);
  if (!seg || (hide && hide(seg.id)) || t > seg.end + 0.5) return null;
  const chunks: W[][] = []; let cur: W[] = [];
  seg.words.forEach((w, i) => {
    cur.push(w);
    if (/[.?!,–]$/.test(w.word) || cur.length >= 7 || i === seg.words.length - 1) { chunks.push(cur); cur = []; }
  });
  const merged: W[][] = [];
  chunks.forEach((c) => { const last = merged[merged.length - 1]; if (last && last.length + c.length <= 6 && (c.length <= 2 || last.length <= 2)) last.push(...c); else merged.push([...c]); });
  const c = merged.find((x, i) => t >= x[0].start - 0.1 && t < (merged[i + 1]?.[0].start ?? 999) - 0.1) ?? merged[0];
  return (
    <div style={{ position: "absolute", left: 60, right: 170, top, background: "#fffdf7", borderLeft: `14px solid ${GANG[seg.who].accent}`, borderRadius: 8, padding: "18px 26px", boxShadow: "0 10px 30px #0b254555", fontFamily: FONT, fontSize: 44, fontWeight: 800, color: P.ink, lineHeight: 1.25, zIndex: 7 }}>
      {c.map((w, i) => {
        const on = t >= w.start, active = on && t < w.end + 0.05;
        return <span key={i} style={{ opacity: on ? 1 : 0.35, color: w.keyword && on ? P.mustard : P.ink, borderBottom: active ? `5px solid ${P.mustard}` : "5px solid transparent" }}>{w.display} </span>;
      })}
    </div>
  );
};

/** Zam drives across and resurfaces the ice – the channel's scene wipe. */
export const IceWipe: React.FC<{ dur?: number; y?: number }> = ({ dur = 36, y = 700 }) => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, dur], [-460, 1540], clamp);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 20 }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: Math.max(0, x - 30), height: 1920, background: "linear-gradient(90deg, #ffffff00 0%, #f4fbffee 70%, #eaf7ff 100%)", opacity: interpolate(f, [dur * 0.55, dur], [1, 0], clamp) }} />
      <div style={{ position: "absolute", left: x - 240, top: y }}>
        <Mascot who="zam" size={440} mood="wow" talking open={0.4 + 0.3 * Math.sin(f / 2)} seed="wipe" />
      </div>
    </AbsoluteFill>
  );
};

/** Chunky paper-cutout ZAM logo, letters drop in. */
export const Logo: React.FC<{ scale?: number; delay?: number }> = ({ scale = 1, delay = 0 }) => {
  const f = useCurrentFrame() - delay;
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 18 * scale }}>
      {["Z", "A", "M"].map((l, i) => {
        const p = interpolate(onTwos(f) - i * 4, [0, 12], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
        const col = ["#3b82f6", "#d94b3b", "#e0a526"][i];
        const w = 230 * scale, h = 270 * scale;
        return (
          <div key={l} style={{ position: "relative", width: w, height: h, transform: `translateY(${(1 - p) * -900}px) rotate(${[-6, 3, -3][i] + Math.sin((f + i * 20) / 18) * 2}deg)`, filter: "drop-shadow(0 14px 18px #0b254577)" }}>
            <svg width={w} height={h} style={{ position: "absolute" }}><path d={tornPath(w, h, `lg${i}`, 18, 10)} fill={P.paper2} /><path d={tornPath(w - 24, h - 24, `lgi${i}`, 16, 7)} transform="translate(12 12)" fill={col} /></svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontStyle: "italic", fontSize: 220 * scale, color: "#fff", WebkitTextStroke: `${8 * scale}px ${P.ink}`, paintOrder: "stroke fill" }}>{l}</div>
          </div>
        );
      })}
    </div>
  );
};

/** All five mascots in a two-row lineup, hopping. */
export const Lineup: React.FC<{ mood?: "laugh" | "talk"; top?: number; talkWho?: Who; open?: number }> = ({ mood = "laugh", top = 700, talkWho, open = 0 }) => {
  const f = useCurrentFrame();
  const LINE: { w: Who; x: number; y: number; size: number }[] = [
    { w: "biscuit", x: 110, y: 0, size: 290 }, { w: "clubby", x: 650, y: 0, size: 290 },
    { w: "pucky", x: -10, y: 340, size: 270 }, { w: "helmy", x: 790, y: 340, size: 270 },
    { w: "zam", x: 320, y: 250, size: 430 },
  ];
  return (
    <div style={{ position: "absolute", top, left: 0, right: 0, height: 760 }}>
      {LINE.map(({ w, x, y, size }, i) => {
        const p = interpolate(onTwos(f) - 4 - i * 3, [0, 12], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.7)) });
        const hop = Math.max(0, Math.sin((f / 60) * Math.PI * 2 * 1.3 + i * 1.3)) * 28;
        return (
          <div key={w} style={{ position: "absolute", left: x, top: y + (1 - p) * 1200 }}>
            <Mascot who={w} size={size} mood={mood} talking={talkWho === w} open={talkWho === w ? open : 0} hop={hop} flip={x > 500 && w !== "zam"} seed="line" />
          </div>
        );
      })}
    </div>
  );
};

/** Paper confetti burst. */
export const Confetti: React.FC<{ n?: number; x?: number; y?: number; spread?: number }> = ({ n = 60, x = 540, y = 500, spread = 900 }) => {
  const f = onTwos(useCurrentFrame());
  const cols = ["#3b82f6", "#d94b3b", "#e0a526", "#2a9d8f", "#5a8f3e", "#ffffff"];
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 15 }}>
      {[...Array(n)].map((_, i) => {
        const a = random(`ca${i}`) * Math.PI * 2, v = 0.4 + random(`cv${i}`) * 0.6;
        const tt = f / 60;
        const px = x + Math.cos(a) * v * spread * Math.min(1, tt * 2.2);
        const py = y + Math.sin(a) * v * spread * 0.6 * Math.min(1, tt * 2.2) + tt * tt * 900;
        return <div key={i} style={{ position: "absolute", left: px, top: py, width: 18, height: 26, background: cols[i % cols.length], border: `2px solid ${P.ink}`, transform: `rotate(${f * 9 * (i % 2 ? 1 : -1) + i * 40}deg)`, opacity: interpolate(tt, [1.2, 1.8], [1, 0], clamp) }} />;
      })}
    </AbsoluteFill>
  );
};

/** Generic paper player chip: team-colour circle with a number (no logos, no faces). */
export const Chip: React.FC<{ c1: string; c2: string; n: string | number; s?: number; goalie?: boolean }> = ({ c1, c2, n, s = 70, goalie }) => (
  <svg width={s} height={s} viewBox="-50 -50 100 100" style={{ overflow: "visible" }}>
    <circle r={44} fill={c1} stroke={P.ink} strokeWidth={6} />
    <circle r={32} fill="none" stroke={c2} strokeWidth={6} />
    {goalie && <rect x={-44} y={30} width={88} height={14} rx={5} fill={P.paper2} stroke={P.ink} strokeWidth={4} />}
    <text y={14} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={38} fill={c2} stroke={P.ink} strokeWidth={1.5}>{n}</text>
  </svg>
);

/** Paper goalie figure (generic) for VS cards. */
export const PaperGoalie: React.FC<{ c1: string; c2: string; n: number; s?: number; flip?: boolean }> = ({ c1, c2, n, s = 230, flip }) => {
  const f = onTwos(useCurrentFrame());
  const w = Math.sin(f / 8) * 6;
  return (
    <svg width={s} height={s * 1.1} viewBox="-100 -110 200 220" style={{ transform: flip ? "scaleX(-1)" : undefined }}>
      <path d={tornPath(170, 200, `pg${n}`, 14, 6)} transform="translate(-85 -100)" fill={P.paper2} />
      {/* pads */}
      <rect x={-52} y={40} width={40} height={60} rx={10} fill="#fff" stroke={P.ink} strokeWidth={5} />
      <rect x={12} y={40} width={40} height={60} rx={10} fill="#fff" stroke={P.ink} strokeWidth={5} />
      {/* jersey */}
      <path d="M-60 -30 Q0 -55 60 -30 L55 45 L-55 45 Z" fill={c1} stroke={P.ink} strokeWidth={5} />
      <rect x={-55} y={10} width={110} height={12} fill={c2} />
      <text y={8} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#fff" stroke={P.ink} strokeWidth={1.5} style={{ transform: flip ? "scaleX(-1)" : undefined }}>{n}</text>
      {/* raised fists */}
      <circle cx={-72} cy={-40 + w} r={16} fill={P.paper2} stroke={P.ink} strokeWidth={5} />
      <circle cx={72} cy={-46 - w} r={16} fill={P.paper2} stroke={P.ink} strokeWidth={5} />
      {/* head (plain paper circle, mask pushed up) */}
      <circle cx={0} cy={-62} r={30} fill={P.paper2} stroke={P.ink} strokeWidth={5} />
      <path d="M-14 -66 L-4 -62 M14 -66 L4 -62" stroke={P.ink} strokeWidth={5} strokeLinecap="round" />
      <path d="M-10 -48 Q0 -54 10 -48" stroke={P.ink} strokeWidth={4} fill="none" />
    </svg>
  );
};

/** Horizontal top-down rink diagram. */
export const RinkDiagram: React.FC<{ w?: number; h?: number; children?: React.ReactNode }> = ({ w = 880, h = 340, children }) => (
  <div style={{ position: "relative", width: w, height: h }}>
    <svg width={w} height={h} style={{ position: "absolute" }}>
      <rect x={4} y={4} width={w - 8} height={h - 8} rx={h * 0.38} fill="#f4fbff" stroke={P.ink} strokeWidth={6} />
      <rect x={w / 2 - 5} y={4} width={10} height={h - 8} fill="#d94b3b" opacity={0.8} />
      <rect x={w * 0.33} y={4} width={10} height={h - 8} fill="#3b82f6" opacity={0.8} />
      <rect x={w * 0.66 - 10} y={4} width={10} height={h - 8} fill="#3b82f6" opacity={0.8} />
      <line x1={w * 0.08} y1={4} x2={w * 0.08} y2={h - 4} stroke="#d94b3b" strokeWidth={4} />
      <line x1={w * 0.92} y1={4} x2={w * 0.92} y2={h - 4} stroke="#d94b3b" strokeWidth={4} />
      <path d={`M${w * 0.08} ${h / 2 - 34} a 34 34 0 0 1 0 68`} fill="#bfe3ff" stroke="#d94b3b" strokeWidth={3} />
      <path d={`M${w * 0.92} ${h / 2 - 34} a 34 34 0 0 0 0 68`} fill="#bfe3ff" stroke="#d94b3b" strokeWidth={3} />
      <circle cx={w / 2} cy={h / 2} r={50} fill="none" stroke="#3b82f6" strokeWidth={4} />
    </svg>
    {children}
  </div>
);

/** Hand-written source line + small red tag for boards. */
export const BoardFoot: React.FC<{ source: string }> = ({ source }) => (
  <div style={{ position: "absolute", left: 6, right: 6, bottom: -8, fontSize: 22, color: P.muted, fontFamily: FONT }}>Source: {source}</div>
);
export const Header: React.FC<{ title: string; sub: string; accent?: string }> = ({ title, sub, accent = P.red }) => (
  <div>
    <div style={{ fontSize: 66, fontWeight: 900, lineHeight: 1, letterSpacing: -1 }}>{title}</div>
    <div style={{ fontFamily: HAND, fontSize: 46, color: accent, marginTop: 4 }}>{sub}</div>
  </div>
);

// ---------------------------------------------------------------------------
// Play engine – paper chips moving along timed paths (local seconds), puck with height + trail.
// ---------------------------------------------------------------------------
export type Key = [number, number, number, number?]; // [t, x, y, z]
export type Band = { c1: string; c2: string; n: string | number };
export type Track = { id: string; c1: string; c2: string; n: string | number; goalie?: boolean; s?: number; keys: Key[]; kind?: "chip" | "stick" | "mascot"; hideAfter?: number;
  who?: Who; mood?: Mood; band?: Band; flip?: boolean; spin?: number; squash?: (t: number) => number; label?: string; dizzy?: (t: number) => boolean; rot?: (t: number) => number; z?: number };
export const sample = (keys: Key[], t: number): { x: number; y: number; z: number } => {
  if (t <= keys[0][0]) return { x: keys[0][1], y: keys[0][2], z: keys[0][3] ?? 0 };
  for (let i = 1; i < keys.length; i++) {
    const [t1, x1, y1, z1 = 0] = keys[i];
    const [t0, x0, y0, z0 = 0] = keys[i - 1];
    if (t <= t1) { const u = (t - t0) / Math.max(1e-6, t1 - t0); const e = u * u * (3 - 2 * u) * 0.35 + u * 0.65; return { x: x0 + (x1 - x0) * e, y: y0 + (y1 - y0) * e, z: z0 + (z1 - z0) * e }; }
  }
  const k = keys[keys.length - 1];
  return { x: k[1], y: k[2], z: k[3] ?? 0 };
};
/** Little team armband under an actor: team colours + number (no logos). */
export const BandTag: React.FC<{ b: Band; w: number }> = ({ b, w }) => (
  <div style={{ width: w, height: w * 0.36, background: b.c1, border: `4px solid ${P.ink}`, borderRadius: 8, boxShadow: `inset 0 0 0 4px ${b.c2}`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: w * 0.26, WebkitTextStroke: `1px ${P.ink}` }}>{b.n}</div>
);
const Stars: React.FC<{ r: number }> = ({ r }) => {
  const f = onTwos(useCurrentFrame());
  return <>{[0, 1, 2].map((i) => { const a = f / 9 + (i * Math.PI * 2) / 3; return <div key={i} style={{ position: "absolute", left: Math.cos(a) * r - 12, top: Math.sin(a) * r * 0.4 - r * 0.9, fontSize: 30, color: P.mustard, WebkitTextStroke: `2px ${P.ink}` }}>★</div>; })}</>;
};
/** A mascot skating: leans into its velocity, speed lines when fast, optional spin/squash/dizzy, armband + label. */
const Actor: React.FC<{ tr: Track; t: number }> = ({ tr, t }) => {
  const p = sample(tr.keys, t), q = sample(tr.keys, t - 0.08);
  const vx = (p.x - q.x) / 0.08, vy = (p.y - q.y) / 0.08;
  const sp = Math.hypot(vx, vy);
  const s = tr.s ?? 140;
  const lean = Math.max(-16, Math.min(16, vx / 40));
  const rot = tr.rot ? tr.rot(t) : tr.spin ? t * tr.spin : lean;
  const sq = tr.squash ? tr.squash(t) : 1;
  const moving = sp > 120;
  return (
    <div style={{ position: "absolute", left: p.x - s / 2, top: p.y - s * 0.56 - p.z, width: s, zIndex: Math.round(p.y) }}>
      {moving && <svg width={s} height={s} style={{ position: "absolute", left: -Math.sign(vx || 1) * s * 0.55, top: 0, overflow: "visible" }}>{[0.35, 0.55, 0.75].map((k) => <line key={k} x1={s * 0.2} y1={s * k} x2={s * 0.2 - Math.sign(vx || 1) * s * 0.4} y2={s * k} stroke="#9cc9e8" strokeWidth={6} strokeLinecap="round" />)}</svg>}
      <div style={{ transform: `rotate(${rot}deg) scaleY(${sq})`, transformOrigin: "50% 90%" }}>
        <Mascot who={tr.who!} size={s} mood={tr.mood ?? "talk"} flip={tr.flip ?? vx < -40} seed={tr.id} talking={moving} open={moving ? 0.5 : 0} />
      </div>
      {tr.dizzy && tr.dizzy(t) && <div style={{ position: "absolute", left: s / 2, top: s * 0.2 }}><Stars r={s * 0.5} /></div>}
      {tr.band && <div style={{ position: "absolute", left: s * 0.25, top: s * 1.02 }}><BandTag b={tr.band} w={s * 0.5} /></div>}
      {tr.label && <div style={{ position: "absolute", left: -60, right: -60, top: s * 1.24, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 26, color: P.ink }}>{tr.label}</div>}
    </div>
  );
};

export const Play: React.FC<{ t: number; tracks: Track[]; puck?: Key[]; trailFrom?: number; puckWho?: boolean; puckSize?: number }> = ({ t, tracks, puck, trailFrom, puckWho, puckSize = 64 }) => {
  const tt = onTwos(Math.round(t * 60)) / 60; // stop-motion on twos
  const pk = puck ? sample(puck, tt) : null;
  const trail = puck && trailFrom !== undefined && tt > trailFrom ? [...Array(24)].map((_, i) => sample(puck, trailFrom + ((tt - trailFrom) * i) / 23)) : [];
  return (
    <>
      {trail.length > 1 && (
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
          <path d={"M" + trail.map((p) => `${p.x} ${p.y - p.z}`).join(" L")} stroke={P.mustard} strokeWidth={6} strokeDasharray="14 10" fill="none" strokeLinecap="round" />
        </svg>
      )}
      {tracks.map((tr) => {
        if (tr.hideAfter !== undefined && tt > tr.hideAfter) return null;
        const p = sample(tr.keys, tt);
        const s = tr.s ?? 54;
        if (tr.kind === "mascot") return <Actor key={tr.id} tr={tr} t={tt} />;
        if (tr.kind === "stick") return <div key={tr.id} style={{ position: "absolute", left: p.x - 40, top: p.y - 5, width: 80, height: 10, background: "#a8733a", border: `3px solid ${P.ink}`, borderRadius: 4, transform: `rotate(${tt * 900}deg)` }} />;
        return <div key={tr.id} style={{ position: "absolute", left: p.x - s / 2, top: p.y - s / 2 - p.z }}><Chip c1={tr.c1} c2={tr.c2} n={tr.n} s={s} goalie={tr.goalie} /></div>;
      })}
      {pk && puckWho && (() => {
        const q = sample(puck!, tt - 0.06); const v = Math.hypot(pk.x - q.x, pk.y - q.y) / 0.06; const sz = puckSize * (1 + pk.z / 160);
        return (
          <div style={{ position: "absolute", left: pk.x - sz / 2, top: pk.y - sz * 0.56 - pk.z, zIndex: 999 }}>
            {pk.z > 2 && <div style={{ position: "absolute", left: sz * 0.2, top: sz * 1.05 + pk.z, width: sz * 0.6, height: 10, borderRadius: "50%", background: "#0003" }} />}
            <div style={{ transform: `rotate(${v > 150 ? tt * 1100 : 0}deg)` }}><Mascot who="pucky" size={sz} mood={v > 150 ? "laugh" : "smug"} seed="pk" talking={v > 150} open={v > 150 ? 0.8 : 0} /></div>
          </div>
        );
      })()}
      {pk && !puckWho && (
        <>
          {pk.z > 2 && <div style={{ position: "absolute", left: pk.x - 12, top: pk.y - 5, width: 24, height: 10, borderRadius: "50%", background: "#0003" }} />}
          <div style={{ position: "absolute", left: pk.x - 13 * (1 + pk.z / 90), top: pk.y - 8 * (1 + pk.z / 90) - pk.z, width: 26 * (1 + pk.z / 90), height: 16 * (1 + pk.z / 90), borderRadius: "50%", background: "#111", border: `3px solid ${P.ink}` }} />
        </>
      )}
    </>
  );
};

/** Vertical half-rink (net at top) for close-up recreations. */
export const HalfRink: React.FC<{ w?: number; h?: number; emptyNet?: boolean; children?: React.ReactNode }> = ({ w = 380, h = 400, emptyNet, children }) => (
  <div style={{ position: "relative", width: w, height: h }}>
    <svg width={w} height={h} style={{ position: "absolute" }}>
      <path d={`M4 ${h - 4} V90 Q4 4 90 4 H${w - 90} Q${w - 4} 4 ${w - 4} 90 V${h - 4} Z`} fill="#f4fbff" stroke={P.ink} strokeWidth={6} />
      <line x1={4} y1={56} x2={w - 4} y2={56} stroke="#d94b3b" strokeWidth={3} />
      <path d={`M${w / 2 - 34} 56 a 34 34 0 0 0 68 0`} fill="#bfe3ff" stroke="#d94b3b" strokeWidth={3} />
      <rect x={w / 2 - 24} y={36} width={48} height={20} fill={emptyNet ? "#fff" : "#fff"} stroke="#d94b3b" strokeWidth={5} />
      {[0.26, 0.74].map((k) => <g key={k}><circle cx={w * k} cy={160} r={56} fill="none" stroke="#d94b3b" strokeWidth={3} /><circle cx={w * k} cy={160} r={5} fill="#d94b3b" /></g>)}
      <rect x={4} y={h - 70} width={w - 8} height={10} fill="#3b82f6" opacity={0.85} />
    </svg>
    {children}
  </div>
);

/** Horizontal half-rink stage, net on the right – the gang acts out plays on it. */
export const HalfStage: React.FC<{ w?: number; h?: number; children?: React.ReactNode; light?: boolean }> = ({ w = 892, h = 400, children, light }) => (
  <div style={{ position: "relative", width: w, height: h }}>
    <svg width={w} height={h} style={{ position: "absolute" }}>
      <path d={`M4 4 H${w - 110} Q${w - 4} 4 ${w - 4} 110 V${h - 110} Q${w - 4} ${h - 4} ${w - 110} ${h - 4} H4 Z`} fill="#f4fbff" stroke={P.ink} strokeWidth={6} />
      <rect x={300} y={4} width={12} height={h - 8} fill="#3b82f6" opacity={0.8} />
      <line x1={w - 80} y1={4} x2={w - 80} y2={h - 4} stroke="#d94b3b" strokeWidth={4} />
      <path d={`M${w - 80} ${h / 2 - 50} a 50 50 0 0 0 0 100`} fill="#bfe3ff" stroke="#d94b3b" strokeWidth={3} />
      {[0.27, 0.73].map((k) => <g key={k}><circle cx={w - 250} cy={h * k} r={70} fill="none" stroke="#d94b3b" strokeWidth={3} /><circle cx={w - 250} cy={h * k} r={6} fill="#d94b3b" /></g>)}
      <rect x={w - 80} y={h / 2 - 34} width={32} height={68} fill="#fff" stroke="#d94b3b" strokeWidth={6} />
      {[...Array(5)].map((_, i) => <line key={i} x1={w - 76} y1={h / 2 - 28 + i * 14} x2={w - 52} y2={h / 2 - 28 + i * 14} stroke={P.ink} strokeWidth={1.5} opacity={0.4} />)}
    </svg>
    {light && <div style={{ position: "absolute", left: w - 84, top: h / 2 - 96, width: 40, height: 30, borderRadius: 8, background: "#ff3b30", boxShadow: "0 0 44px 18px #ff3b3088", border: `4px solid ${P.ink}`, zIndex: 1000 }} />}
    {children}
  </div>
);

/** Cartoon fight cloud: paper dust ball with limbs, stars and POW/BAM. */
export const FightCloud: React.FC<{ s?: number }> = ({ s = 340 }) => {
  const f = onTwos(useCurrentFrame());
  const words = ["POW!", "BAM!", "WHACK!", "OOF!"];
  const wv = words[Math.floor(f / 20) % words.length];
  return (
    <div style={{ position: "relative", width: s, height: s * 0.8 }}>
      <svg width={s} height={s * 0.8} viewBox="-170 -136 340 272" style={{ overflow: "visible" }}>
        {[...Array(9)].map((_, i) => { const a = (i / 9) * Math.PI * 2 + f / 40; const r = 70 + random(`fc${i}${Math.floor(f / 5)}`) * 30; return <circle key={i} cx={Math.cos(a) * 80} cy={Math.sin(a) * 52} r={r * 0.75} fill={P.paper2} stroke={P.ink} strokeWidth={5} />; })}
        {[...Array(5)].map((_, i) => { const a = random(`lb${i}${Math.floor(f / 5)}`) * Math.PI * 2; return <g key={`l${i}`}><line x1={Math.cos(a) * 90} y1={Math.sin(a) * 60} x2={Math.cos(a) * 160} y2={Math.sin(a) * 110} stroke={P.ink} strokeWidth={8} strokeLinecap="round" /><circle cx={Math.cos(a) * 165} cy={Math.sin(a) * 114} r={14} fill={i % 2 ? "#a16207" : P.teal} stroke={P.ink} strokeWidth={4} /></g>; })}
        {[...Array(6)].map((_, i) => <text key={`s${i}`} x={(random(`sx${i}${Math.floor(f / 5)}`) - 0.5) * 260} y={(random(`sy${i}${Math.floor(f / 5)}`) - 0.5) * 170} fontSize={34} fill={P.mustard} stroke={P.ink} strokeWidth={2}>★</text>)}
      </svg>
      <div style={{ position: "absolute", left: s * 0.5, top: -20, transform: `translate(-50%,0) rotate(${(f % 40) - 20}deg)`, fontFamily: FONT, fontWeight: 900, fontStyle: "italic", fontSize: 64, color: "#fff", WebkitTextStroke: `5px ${P.ink}`, paintOrder: "stroke fill" }}>{wv}</div>
    </div>
  );
};
