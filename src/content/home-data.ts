/**
 * The Home page's structural data — everything that is the same in every
 * language: artwork paths, rarity tiers, boss order, HUD figures.
 *
 * Nothing here is invented. The item names, rarities and artwork are the
 * MythStride catalogue (`ItemBaseFactory` in the API, `assets/itens/` in the
 * app). The campaign ladder is `ChefeFactory`, in its shipped order, with the
 * health values it seeds. The conversion figures come from
 * `RunRewardCalculator`: eligible distance yields 20 XP per kilometre and 25
 * points of boss damage per kilometre plus a fixed amount per run.
 *
 * Localised names live in `content/home.ts`, keyed by the slugs below.
 */

/** Rarity tiers, in the app's own order and colours (`myth_primitives.dart`). */
export const rarityTiers = [
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
  "mythic",
  "mythstride",
] as const;

export type RarityTier = (typeof rarityTiers)[number];

export type LootItem = {
  slug: string;
  rarity: RarityTier;
  art: string;
};

/** The loot rail: one authored piece per tier, climbing the ladder. */
export const lootItems: readonly LootItem[] = [
  { slug: "ironSword", rarity: "common", art: "/images/items/iron-sword.webp" },
  {
    slug: "hardenedLeatherArmor",
    rarity: "common",
    art: "/images/items/hardened-leather-armor.webp",
  },
  {
    slug: "marchingBoots",
    rarity: "uncommon",
    art: "/images/items/marching-boots.webp",
  },
  {
    slug: "reinforcedHelmet",
    rarity: "uncommon",
    art: "/images/items/reinforced-helmet.webp",
  },
  {
    slug: "blueSteelSword",
    rarity: "rare",
    art: "/images/items/blue-steel-sword.webp",
  },
  {
    slug: "scaledArmor",
    rarity: "rare",
    art: "/images/items/scaled-armor.webp",
  },
  {
    slug: "bastionGauntlets",
    rarity: "epic",
    art: "/images/items/bastion-gauntlets.webp",
  },
  {
    slug: "medusaSword",
    rarity: "epic",
    art: "/images/items/medusa-sword.webp",
  },
  {
    slug: "solarSword",
    rarity: "legendary",
    art: "/images/items/solar-sword.webp",
  },
  {
    slug: "titanicSword",
    rarity: "mythic",
    art: "/images/items/titanic-sword.webp",
  },
  {
    slug: "founderSword",
    rarity: "mythstride",
    art: "/assets/mythstride/icons/founder_sword.png",
  },
] as const;

export type EquipmentSlot = {
  slot: string;
  item: string;
  rarity: RarityTier;
  art: string;
};

/**
 * The equipped set the character panel shows. Six slots, matching the app's
 * inventory doll: helmet, weapon, armour, gloves, pants, boots.
 */
export const equipmentSlots: readonly EquipmentSlot[] = [
  {
    slot: "helmet",
    item: "reinforcedHelmet",
    rarity: "uncommon",
    art: "/images/items/reinforced-helmet.webp",
  },
  {
    slot: "weapon",
    item: "blueSteelSword",
    rarity: "rare",
    art: "/images/items/blue-steel-sword.webp",
  },
  {
    slot: "armor",
    item: "scaledArmor",
    rarity: "rare",
    art: "/images/items/scaled-armor.webp",
  },
  {
    slot: "gloves",
    item: "bastionGauntlets",
    rarity: "epic",
    art: "/images/items/bastion-gauntlets.webp",
  },
  {
    slot: "pants",
    item: "reinforcedPants",
    rarity: "uncommon",
    art: "/images/items/reinforced-pants.webp",
  },
  {
    slot: "boots",
    item: "marchingBoots",
    rarity: "uncommon",
    art: "/images/items/marching-boots.webp",
  },
] as const;

export type CampaignBoss = {
  slug: string;
  /** Medal key for `MythBossMedal`, which resolves the shipped medal art. */
  medal: string;
  level: number;
  health: number;
};

/** The campaign ladder, verbatim from `ChefeFactory.CriarCatalogoInicial`. */
export const campaignBosses: readonly CampaignBoss[] = [
  { slug: "arpia", medal: "arpia", level: 1, health: 450 },
  { slug: "cerberus", medal: "cerberus", level: 2, health: 700 },
  { slug: "ciclope", medal: "ciclope", level: 3, health: 1000 },
  { slug: "medusa", medal: "medusa", level: 4, health: 1400 },
  { slug: "minotaura", medal: "minotaura", level: 5, health: 1900 },
  { slug: "golemFerro", medal: "golem_ferro", level: 6, health: 2500 },
  { slug: "hidra", medal: "hidra", level: 7, health: 3300 },
  { slug: "fenix", medal: "fenix", level: 8, health: 4300 },
  { slug: "kraken", medal: "kraken", level: 9, health: 5600 },
  {
    slug: "dragaoAncestral",
    medal: "dragao_ancestral",
    level: 10,
    health: 7200,
  },
] as const;

/**
 * The single run the HUD demonstrates, and the numbers it produces.
 *
 * 7.4 km -> 7.4 x 20 = 148 XP, and 7.4 x 25 + 10 = 195 points of boss damage.
 *
 * The boss is Cerberus at his seeded 700 health, because that is the encounter
 * the dashboard capture behind the HUD is actually showing. The two must agree:
 * a floating card naming a different boss than the screen underneath it reads
 * as a mistake, however honest each number is on its own.
 */
export const heroRun = {
  distanceKm: 7.4,
  xp: 148,
  damage: 195,
  boss: { slug: "cerberus", medal: "cerberus", health: 700, remaining: 335 },
} as const;

/**
 * The encounter the battle section stages, at the health `ChefeFactory` seeds.
 * Medusa is the fourth campaign boss.
 */
export const bossScene = {
  slug: "medusa",
  medal: "medusa",
  art: "/images/bosses/medusa.webp",
  health: 1400,
  remaining: 1282,
  damage: 195,
} as const;

export const homeSectionIds = {
  loop: "como-funciona",
  boss: "batalhas",
  loot: "recompensas",
  elyndor: "elyndor",
  aethron: "aethron",
  community: "comunidade",
  join: "join",
  faq: "faq",
} as const;
