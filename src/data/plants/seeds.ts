import type { Plant } from "../plant.ts";

/**
 * Seeds eaten as food in their own right — a portion, not a pinch. Seeds used
 * only to season a dish (cumin, caraway, mustard) live in `spices.ts`, and the
 * ones cooked by the bowlful (quinoa, buckwheat, teff) in `grains.ts`.
 */
export const SEEDS: Plant[] = [
  {
    id: "basil-seeds",
    name: "Basil Seeds",
    category: "seed",
    hue: 265,
    aliases: ["sabja", "tukmaria", "falooda seeds"],
  },
  {
    id: "black-sesame",
    name: "Black Sesame",
    category: "seed",
    hue: 250,
    aliases: ["black sesame seeds", "kuro goma", "kala til"],
  },
  {
    id: "camelina-seeds",
    name: "Camelina Seeds",
    category: "seed",
    hue: 36,
    aliases: ["camelina", "gold-of-pleasure", "false flax"],
  },
  {
    id: "chia-seeds",
    name: "Chia Seeds",
    category: "seed",
    hue: 25,
    aliases: ["chia", "salvia hispanica"],
  },
  {
    id: "flax-seeds",
    name: "Flax Seeds",
    category: "seed",
    hue: 40,
    aliases: ["linseed", "flaxseed", "linseeds"],
  },
  {
    id: "hemp-seeds",
    name: "Hemp Seeds",
    category: "seed",
    hue: 80,
    aliases: ["hemp hearts", "hulled hemp", "hemp seed"],
  },
  {
    id: "lotus-seeds",
    name: "Lotus Seeds",
    category: "seed",
    hue: 55,
    aliases: ["lotus nut", "lian zi", "dried lotus seed"],
  },
  {
    id: "melon-seeds",
    name: "Melon Seeds",
    category: "seed",
    hue: 60,
    aliases: ["egusi", "muskmelon seeds", "charmagaz"],
  },
  {
    id: "milk-thistle-seeds",
    name: "Milk Thistle Seeds",
    category: "seed",
    hue: 30,
    aliases: ["milk thistle", "silybum", "silymarin seeds"],
  },
  {
    id: "nigella-seeds",
    name: "Nigella Seeds",
    category: "seed",
    hue: 255,
    aliases: ["black seed", "kalonji", "black cumin", "nigella"],
  },
  {
    id: "perilla-seeds",
    name: "Perilla Seeds",
    category: "seed",
    hue: 28,
    aliases: ["egoma", "deulkkae", "shiso seeds"],
  },
  {
    id: "poppy-seeds",
    name: "Poppy Seeds",
    category: "seed",
    hue: 240,
    aliases: ["poppyseed", "blue poppy seed", "khus khus"],
  },
  {
    id: "pumpkin-seeds",
    name: "Pumpkin Seeds",
    category: "seed",
    hue: 110,
    aliases: ["pepitas", "styrian pumpkin seeds", "pumpkin seed"],
  },
  {
    id: "safflower-seeds",
    name: "Safflower Seeds",
    category: "seed",
    hue: 58,
    aliases: ["safflower", "carthamus", "kusum seeds"],
  },
  {
    id: "sunflower-seeds",
    name: "Sunflower Seeds",
    category: "seed",
    hue: 35,
    aliases: ["sunflower kernels", "pipas", "sunflower seed"],
  },
  {
    id: "watermelon-seeds",
    name: "Watermelon Seeds",
    category: "seed",
    hue: 12,
    aliases: ["tsamma seeds", "watermelon kernels"],
  },
  {
    id: "white-sesame",
    name: "White Sesame",
    category: "seed",
    hue: 45,
    aliases: ["sesame seeds", "sesame", "til", "shiro goma"],
  },
];
