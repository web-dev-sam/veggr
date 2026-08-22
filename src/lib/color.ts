/**
 * Palette derivation.
 *
 * The catalogue stores a plain sRGB/HSL hue per vegetable because that is what
 * a human can eyeball ("carrot is 28"). Rendering straight from HSL looks
 * broken though: `hsl(60 90% 60%)` (yellow) reads far brighter than
 * `hsl(280 90% 60%)` (purple) at the same lightness, so a list of icons would
 * flicker between glaring and muddy.
 *
 * So we convert the authored hue once into OKLCH hue and rebuild every colour
 * at fixed perceptual lightness/chroma. Same visual weight for every hue, real
 * colour identity preserved.
 */

function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** HSL with fixed s/l — we only care about the resulting hue angle. */
function hslToRgb(hue: number): [number, number, number] {
  const h = ((hue % 360) + 360) % 360;
  const c = 0.9; // saturation 90%, lightness 50% -> chroma 0.9
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const seg = Math.floor(h / 60) % 6;
  const rgb: [number, number, number][] = [
    [c, x, 0],
    [x, c, 0],
    [0, c, x],
    [0, x, c],
    [x, 0, c],
    [c, 0, x],
  ];
  const [r, g, b] = rgb[seg]!;
  const m = 0.5 - c / 2;
  return [r + m, g + m, b + m];
}

/**
 * OKLCH hue angle for an authored HSL hue.
 * Coefficients are Björn Ottosson's linear-sRGB -> OKLab matrix.
 */
export function oklchHue(hslHue: number): number {
  const [r8, g8, b8] = hslToRgb(hslHue);
  const r = srgbToLinear(r8);
  const g = srgbToLinear(g8);
  const b = srgbToLinear(b8);

  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

  const deg = (Math.atan2(bb, a) * 180) / Math.PI;
  return (deg + 360) % 360;
}

/** `oklch()` string. Browsers gamut-map out-of-range chroma for us. */
export function oklch(lightness: number, chroma: number, hue: number): string {
  const h = ((hue % 360) + 360) % 360;
  return `oklch(${lightness.toFixed(3)} ${chroma.toFixed(3)} ${h.toFixed(1)})`;
}

export type Palette = {
  /** Primary form. */
  ink: string;
  /** Secondary form — same family, one step deeper. */
  inkDeep: string;
  /** Small details: seeds, veins, ticks. */
  spark: string;
  /** Plate gradient, top-left to bottom-right. */
  plateFrom: string;
  plateTo: string;
  /** Flat tint for chips, bars and progress arcs outside the icon. */
  tint: string;
  /** OKLCH hue, exposed so callers can build their own steps. */
  hue: number;
};

/**
 * Build the icon palette for a hue. `drift` (degrees, from the glyph's seed)
 * separates neighbours that share an authored hue: two greens land on slightly
 * different families instead of rendering identically.
 */
export function palette(hslHue: number, drift = 0): Palette {
  const h = oklchHue(hslHue) + drift;
  return {
    ink: oklch(0.84, 0.152, h),
    inkDeep: oklch(0.68, 0.145, h - 12),
    spark: oklch(0.94, 0.09, h + 24),
    // The plate has to read as a distinct chip against --surface (#1d251f)
    // while staying dark enough for the ink to stay legible on top.
    plateFrom: oklch(0.4, 0.075, h + 6),
    plateTo: oklch(0.27, 0.05, h - 14),
    tint: oklch(0.78, 0.15, h),
    hue: h,
  };
}
