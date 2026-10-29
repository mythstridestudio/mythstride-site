import { getAssetPath } from "./assets";

/** Exact achievement artwork codes from mythstride mobile: lib/widgets/achievement_artwork.dart.
 * Image files must be mirrored from mobile assets/achievement/ before rendering them.
 * This list is not a fixed UI limit: the API determines which achievements exist.
 */
export const ACHIEVEMENT_ART_CODES = new Set<string>([
  "accept_friend_invite",
  "all_15_bosses",
  "all_achievements",
  "beat_friend_pace",
  "boss_50_kills",
  "boss_battle_100",
  "complete_first_raid",
  "consume_10_items",
  "create_guild",
  "daily_missions_week",
  "equip_first_item",
  "fifty_runs",
  "first_boss",
  "first_friend",
  "first_item",
  "first_legendary_item",
  "first_rare_item",
  "first_run",
  "first_store_purchase",
  "five_bosses",
  "five_hundred_runs",
  "full_equipment",
  "group_boss_defeat",
  "group_run_10",
  "group_run_5_players",
  "guild_30_days",
  "guild_event_complete",
  "guild_global_boss_contribution",
  "guild_ranking_entry",
  "guild_ranking_first",
  "invite_friend",
  "item_consumed",
  "join_guild",
  "marathon_accumulated",
  "one_million_boss_damage",
  "own_50_items",
  "participate_10_events",
  "participate_5_events",
  "participate_first_event",
  "personal_record_10",
  "pin_3_achievements",
  "pin_first_achievement",
  "public_runs_100",
  "receive_friend_invite",
  "repair_10_items",
  "repair_first_item",
  "run_1000_km",
  "run_100_km",
  "run_500_km",
  "run_50_km",
  "run_5_km",
  "run_with_friend",
  "send_friend_invite",
  "share_aethron_result",
  "streak_100",
  "streak_3",
  "streak_30",
  "streak_7",
  "ten_friends",
  "ten_runs_with_friends",
  "two_runs_same_day",
  "unlock_100_items",
  "upload_first_avatar",
  "weekly_first_place",
  "weekly_ranking_entry",
  "weekly_top_10",
]);

/** Resolve only known codes; null makes missing art explicit instead of a broken image. */
export function resolveAchievementArt(code: string | null | undefined): string | null {
  const normalized = code?.trim().toLowerCase();
  return normalized && ACHIEVEMENT_ART_CODES.has(normalized)
    ? getAssetPath(`/assets/mythstride/achievement/${normalized}.png`)
    : null;
}

/**
 * Resolve the real art by the canonical backend code, never by a translated
 * achievement name. Supports pre-code API versions that supplied an asset path.
 */
export function resolveAchievementImage(
  code: string | null | undefined,
  iconUrl: string | null | undefined,
): string | null {
  const byCode = resolveAchievementArt(code);
  if (byCode) return byCode;

  const raw = iconUrl?.trim();
  if (!raw) return null;

  const assetCode = raw.match(/(?:^|\\/)achievement\\/([a-z0-9_]+)\\.(?:png|webp)(?:\\?.*)?$/i)?.[1];
  const byAssetPath = resolveAchievementArt(assetCode);
  if (byAssetPath) return byAssetPath;

  // Only valid external or site-relative art URLs may bypass the built-in map.
  if (/^https:\\/\\/[^/]+/i.test(raw)) return raw;
  if (raw.startsWith("/") && !raw.startsWith("//")) return getAssetPath(raw);
  return null;
}
