/** AI Bounce presenters (artwork owned by the channel; cut out by scripts/cutout_characters.py). */
export type PresenterId = "rune" | "ture" | "saga" | "cara" | "bouncy";
/** Generic moods used by episode files; each character maps them to their own art. */
export type Mood = "body" | "happy" | "curious" | "serious";

export type Character = { id: PresenterId; name: string; art: Record<Mood, string>; accent: string };

const art = (id: PresenterId, happy: string, curious: string, serious: string): Record<Mood, string> => ({
  body: `chars/${id}_body.png`, happy: `chars/${id}_${happy}.png`, curious: `chars/${id}_${curious}.png`, serious: `chars/${id}_${serious}.png`,
});

export const CHARACTERS: Record<PresenterId, Character> = {
  rune: { id: "rune", name: "RUNE", art: art("rune", "smile", "think", "watch"), accent: "#1d6b73" },
  ture: { id: "ture", name: "TURE", art: art("ture", "laugh", "phone", "watch"), accent: "#b86b17" },
  saga: { id: "saga", name: "SAGA", art: art("saga", "smile", "surprised", "watch"), accent: "#2c4a7a" },
  cara: { id: "cara", name: "CARA", art: art("cara", "laugh", "smile", "watch"), accent: "#5d7a2e" },
  /** mascot – drawn in code (Bouncy.tsx); art paths unused */
  bouncy: { id: "bouncy", name: "BOUNCY", art: art("rune", "smile", "think", "watch"), accent: "#A855F7" },
};

/** Weekly rotation: presenter = ROTATION[isoWeek % 4]  (wk 47 → Cara, wk 48 → Rune, …). */
export const ROTATION: PresenterId[] = ["rune", "saga", "ture", "cara"];
export const presenterForWeek = (week: number): Character => CHARACTERS[ROTATION[week % ROTATION.length]];
