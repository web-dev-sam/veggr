import type { Plant } from "../plant.ts";

/**
 * The grain sack: cereals — the grass seeds — and the pseudocereals that are
 * cooked, milled and flaked exactly like them.
 *
 * Botany would split this shelf down the middle, since quinoa and buckwheat
 * are no more grasses than a sunflower is. Nobody shops that way: amaranth,
 * teff and oats end up in the same jar, the same porridge and the same aisle,
 * so they end up in the same category here. What stays in `seeds.ts` is the
 * seed eaten as a seed — a spoonful on top of the bowl, not the bowl.
 *
 * A grain is one entry whatever the mill did to it. Flour, flakes, groats,
 * semolina, bulgur and pearled barley are aliases of the plant they came from,
 * because a diversity count wants the plant, not the packet.
 *
 * Maize is deliberately absent: `sweetcorn` in `fruiting.ts` is the same
 * plant, and polenta searches find it there.
 */
export const GRAINS: Plant[] = [
  {
    id: "amaranth-grain",
    name: "Amaranth Grain",
    category: "grain",
    hue: 42,
    aliases: ["amaranth", "kiwicha", "amaranth seeds", "popped amaranth"],
  },
  {
    id: "barley",
    name: "Barley",
    category: "grain",
    hue: 48,
    aliases: ["pearl barley", "pot barley", "barley flakes", "hulled barley", "malted barley"],
  },
  {
    id: "black-rice",
    name: "Black Rice",
    category: "grain",
    hue: 285,
    aliases: ["forbidden rice", "purple rice", "riso venere", "nerone rice"],
  },
  {
    id: "buckwheat",
    name: "Buckwheat",
    category: "grain",
    hue: 70,
    aliases: ["buckwheat groats", "kasha", "soba grain", "buckwheat flour"],
  },
  {
    id: "canary-seed",
    name: "Canary Seed",
    category: "grain",
    hue: 48,
    aliases: ["canary grass seed", "alpiste", "canaryseed"],
  },
  {
    id: "durum-wheat",
    name: "Durum Wheat",
    category: "grain",
    hue: 46,
    aliases: ["semolina", "pasta wheat", "bulgur", "couscous", "freekeh"],
  },
  {
    id: "einkorn",
    name: "Einkorn",
    category: "grain",
    hue: 44,
    aliases: ["small spelt", "farro piccolo", "triticum monococcum"],
  },
  {
    id: "emmer",
    name: "Emmer",
    category: "grain",
    hue: 38,
    aliases: ["farro", "emmer wheat", "triticum dicoccum"],
  },
  {
    id: "finger-millet",
    name: "Finger Millet",
    category: "grain",
    hue: 22,
    aliases: ["ragi", "nachni", "eleusine", "kodo"],
  },
  {
    id: "fonio",
    name: "Fonio",
    category: "grain",
    hue: 52,
    aliases: ["acha", "hungry rice", "digitaria", "findi"],
  },
  {
    id: "jobs-tears",
    name: "Job's Tears",
    category: "grain",
    hue: 200,
    aliases: ["coix", "adlay", "hato mugi", "chinese pearl barley"],
  },
  {
    id: "kaniwa",
    name: "Kaniwa",
    category: "grain",
    hue: 15,
    aliases: ["canihua", "cañihua", "baby quinoa"],
  },
  {
    id: "khorasan-wheat",
    name: "Khorasan Wheat",
    category: "grain",
    hue: 46,
    aliases: ["kamut", "oriental wheat", "triticum turanicum"],
  },
  {
    id: "millet",
    name: "Millet",
    category: "grain",
    hue: 50,
    aliases: ["proso millet", "golden millet", "millet flakes", "broomcorn millet"],
  },
  {
    id: "oats",
    name: "Oats",
    category: "grain",
    hue: 44,
    aliases: ["rolled oats", "oatmeal", "porridge oats", "oat groats", "oat bran", "naked oats"],
  },
  {
    id: "pearl-millet",
    name: "Pearl Millet",
    category: "grain",
    hue: 255,
    aliases: ["bajra", "cattail millet", "pennisetum"],
  },
  {
    id: "quinoa",
    name: "Quinoa",
    category: "grain",
    hue: 50,
    aliases: ["white quinoa", "red quinoa", "chenopodium", "quinoa flakes"],
  },
  {
    id: "red-rice",
    name: "Red Rice",
    category: "grain",
    hue: 10,
    aliases: ["camargue rice", "bhutanese red rice", "thai red rice"],
  },
  {
    id: "rice",
    name: "Rice",
    category: "grain",
    hue: 45,
    aliases: ["brown rice", "white rice", "basmati", "jasmine rice", "rice flakes", "poha"],
  },
  {
    id: "rye",
    name: "Rye",
    category: "grain",
    hue: 36,
    aliases: ["rye berries", "rye flakes", "pumpernickel", "rye flour", "secale"],
  },
  {
    id: "sorghum-grain",
    name: "Sorghum",
    category: "grain",
    hue: 28,
    aliases: ["jowar", "milo", "sorghum grain", "white sorghum"],
  },
  {
    id: "spelt",
    name: "Spelt",
    category: "grain",
    hue: 40,
    aliases: ["dinkel", "spelt flakes", "farro grande", "green spelt", "triticum spelta"],
  },
  {
    id: "teff",
    name: "Teff",
    category: "grain",
    hue: 20,
    aliases: ["tef", "teff grain", "eragrostis"],
  },
  {
    id: "triticale",
    name: "Triticale",
    category: "grain",
    hue: 42,
    aliases: ["rye wheat", "triticosecale"],
  },
  {
    id: "wheat",
    name: "Wheat",
    category: "grain",
    hue: 43,
    aliases: ["wheat berries", "wholemeal wheat", "wheat flakes", "wheat bran", "seitan"],
  },
  {
    id: "wild-rice",
    name: "Wild Rice",
    category: "grain",
    hue: 265,
    aliases: ["zizania", "water oats", "manoomin"],
  },
];
