/**
 * Deterministic seeding for generated art.
 *
 * Every icon in the app is derived from a vegetable id, so the same id must
 * always produce the same glyph — across sessions, devices and releases.
 * That rules out `Math.random()` and rules in a hash plus a tiny PRNG.
 */

/** FNV-1a, 32-bit. Cheap, well spread for short ASCII keys. */
export function hash32(key: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Mulberry32: 32 bits of state, uniform enough for shape parameters. */
export function rng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A draw helper set bound to one seed — reads as intent, not arithmetic. */
export type Dice = {
  /** Float in [min, max). */
  f: (min: number, max: number) => number;
  /** Integer in [min, max]. */
  i: (min: number, max: number) => number;
  /** Uniform pick. */
  pick: <T>(items: readonly T[]) => T;
  /** True with the given probability. */
  odds: (p: number) => boolean;
};

export function dice(seed: string | number): Dice {
  const next = rng(typeof seed === "string" ? hash32(seed) : seed);
  return {
    f: (min, max) => min + next() * (max - min),
    i: (min, max) => min + Math.floor(next() * (max - min + 1)),
    pick: (items) => items[Math.floor(next() * items.length)]!,
    odds: (p) => next() < p,
  };
}
