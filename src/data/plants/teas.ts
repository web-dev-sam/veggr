import type { Plant } from "../plant.ts";

/**
 * The tea shelf: leaves, flowers and hips that reach a kitchen as an infusion
 * and in no other form. Nobody cooks with rooibos.
 *
 * Which is also the line that keeps this file honest. A herb that is brewed
 * *and* chopped over a plate stays in the herb drawer — mint tea is the mint
 * already listed, ginger tea the ginger, and a second entry would let one plant
 * fill two of the thirty. The German names those brews are sold under live in
 * the alias tables instead, so searching for one still lands on the plant.
 *
 * One entry per plant, again: green, black, white, oolong, pu-erh and matcha
 * are one shrub picked at different moments and dried for different lengths of
 * time, so they are one row named Tea with the rest as aliases. Where a plant
 * is already here under a different *part* — elder as its berry, rose as its
 * petals — the flower or the hip is its own entry, the way fennel bulb and
 * fennel seed already are.
 */
export const TEAS: Plant[] = [
  {
    id: "butterfly-pea",
    name: "Butterfly Pea",
    category: "tea",
    hue: 255,
    aliases: ["blue pea", "blue tea", "clitoria", "anchan"],
  },
  {
    id: "chamomile",
    name: "Chamomile",
    category: "tea",
    hue: 50,
    aliases: ["camomile", "german chamomile", "matricaria", "chamomile flowers"],
  },
  {
    id: "chrysanthemum-flower",
    name: "Chrysanthemum Flower",
    category: "tea",
    hue: 46,
    aliases: ["juhua", "chrysanthemum tea", "gukhwa", "chrysanthemum buds"],
  },
  {
    id: "elderflower",
    name: "Elderflower",
    category: "tea",
    hue: 58,
    aliases: ["elder blossom", "elderflowers", "sambucus flower"],
  },
  {
    id: "greek-mountain-tea",
    name: "Greek Mountain Tea",
    category: "tea",
    hue: 84,
    aliases: ["sideritis", "ironwort", "shepherd's tea", "mountain tea"],
  },
  {
    id: "guayusa",
    name: "Guayusa",
    category: "tea",
    hue: 96,
    aliases: ["ilex guayusa", "amazon holly", "wayusa"],
  },
  {
    id: "honeybush",
    name: "Honeybush",
    category: "tea",
    hue: 34,
    aliases: ["cyclopia", "heuningbos", "honey bush"],
  },
  {
    id: "lemon-balm",
    name: "Lemon Balm",
    category: "tea",
    hue: 100,
    aliases: ["melissa", "balm mint", "melissa officinalis"],
  },
  {
    id: "lemon-verbena",
    name: "Lemon Verbena",
    category: "tea",
    hue: 92,
    aliases: ["verbena", "vervain", "aloysia", "cedron", "verveine"],
  },
  {
    id: "linden-blossom",
    name: "Linden Blossom",
    category: "tea",
    hue: 62,
    aliases: ["lime blossom", "linden flower", "tilia", "tilleul"],
  },
  {
    id: "mallow-blossom",
    name: "Mallow Blossom",
    category: "tea",
    hue: 288,
    aliases: ["blue mallow", "common mallow", "malva", "mallow flowers"],
  },
  {
    id: "rooibos",
    name: "Rooibos",
    category: "tea",
    hue: 16,
    aliases: ["red bush", "redbush tea", "aspalathus", "red tea"],
  },
  {
    id: "rosehip",
    name: "Rosehip",
    category: "tea",
    hue: 12,
    aliases: ["rose hips", "dog rose", "cynorhodon", "rosa canina"],
  },
  {
    id: "tea",
    name: "Tea",
    category: "tea",
    hue: 102,
    // The blends are the plant: an earl grey or a chai is this leaf plus a
    // flavouring already listed under its own name, so they point here.
    aliases: [
      "green tea",
      "black tea",
      "white tea",
      "oolong",
      "matcha",
      "pu-erh",
      "sencha",
      "chai",
      "earl grey",
      "jasmine tea",
      "camellia sinensis",
    ],
  },
  {
    id: "tulsi",
    name: "Tulsi",
    category: "tea",
    hue: 112,
    aliases: ["holy basil", "ocimum tenuiflorum", "kapoor tulsi"],
  },
  {
    id: "yerba-mate",
    name: "Yerba Mate",
    category: "tea",
    hue: 88,
    aliases: ["mate", "erva mate", "chimarrao", "ilex paraguariensis"],
  },
];
