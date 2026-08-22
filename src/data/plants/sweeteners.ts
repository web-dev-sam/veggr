import type { Plant } from "../plant.ts";

/**
 * The sweet shelf: nectars, saps and boiled-down juices, plus the two leaves
 * that are eaten for nothing but their sweetness.
 *
 * One entry per plant, as everywhere else. The refined and the fresh forms of
 * a plant already listed are deliberately absent — date syrup, coconut sugar,
 * yacon syrup, beet and corn sugar would all be a plant this catalogue already
 * counts, logged a second time under a different label.
 *
 * Honey is the one thing here a plant did not make on its own: bees reduce
 * flower nectar, so it belongs on this shelf the way a user reaches for it,
 * next to the syrups. It is the sole animal-processed entry in the catalogue.
 */
export const SWEETENERS: Plant[] = [
  {
    id: "agave-syrup",
    name: "Agave Syrup",
    category: "sweet",
    hue: 44,
    aliases: ["agave nectar", "agave", "aguamiel"],
  },
  {
    id: "birch-syrup",
    name: "Birch Syrup",
    category: "sweet",
    hue: 30,
    aliases: ["birch sap", "birch molasses"],
  },
  {
    id: "carob",
    name: "Carob",
    category: "sweet",
    hue: 24,
    aliases: ["carob powder", "carob syrup", "locust bean", "st john's bread"],
  },
  {
    id: "honey",
    name: "Honey",
    category: "sweet",
    hue: 38,
    aliases: ["raw honey", "blossom honey", "wildflower honey", "manuka"],
  },
  {
    id: "jaggery",
    name: "Jaggery",
    category: "sweet",
    hue: 30,
    aliases: ["gur", "panela", "piloncillo", "muscovado"],
  },
  {
    id: "maple-syrup",
    name: "Maple Syrup",
    category: "sweet",
    hue: 26,
    aliases: ["maple", "maple sap", "maple sugar"],
  },
  {
    id: "molasses",
    name: "Molasses",
    category: "sweet",
    hue: 18,
    aliases: ["blackstrap molasses", "treacle", "black treacle", "cane syrup"],
  },
  {
    id: "monk-fruit",
    name: "Monk Fruit",
    category: "sweet",
    hue: 74,
    aliases: ["luo han guo", "monkfruit", "siraitia"],
  },
  {
    id: "palm-sugar",
    name: "Palm Sugar",
    category: "sweet",
    hue: 34,
    aliases: ["gula melaka", "arenga sugar", "palmyra sugar", "palm nectar"],
  },
  {
    id: "sorghum-syrup",
    name: "Sorghum Syrup",
    category: "sweet",
    hue: 22,
    aliases: ["sorghum molasses", "sweet sorghum", "sorghum"],
  },
  {
    id: "stevia",
    name: "Stevia",
    category: "sweet",
    hue: 116,
    aliases: ["stevia leaf", "sweetleaf", "candyleaf"],
  },
];
