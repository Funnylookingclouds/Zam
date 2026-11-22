import words from "./data/words.json";

export type Word = {
  word: string;
  display: string;
  start: number;
  end: number;
  segment: string;
  keyword: boolean;
};

export const WORDS = words as Word[];
export const FPS = 60;
export const TAIL = 0.6; // seconds after last word (outro cross-fades in)
export const TOTAL_SEC = WORDS[WORDS.length - 1].end + TAIL;

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");

/** Start time (s) of the nth word in `segment` beginning with `prefix`. */
export const at = (segment: string, prefix: string, nth = 0): number => {
  const p = norm(prefix);
  const hits = WORDS.filter((w) => w.segment === segment && norm(w.word).startsWith(p));
  if (!hits[nth]) throw new Error(`timing: no word "${prefix}" #${nth} in ${segment}`);
  return hits[nth].start;
};

export const segStart = (segment: string) => WORDS.find((w) => w.segment === segment)!.start;
