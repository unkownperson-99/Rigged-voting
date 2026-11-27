import { GameMapType, listedMaps } from "@openfront/engine-api/game/GameTypes";

/**
 * Maps offered in the single-player build.
 *
 * The full map set is about 760 MB, so the static site ships only these
 * maps (their folders are kept under resources/maps/). To add a map back,
 * add its GameMapType here and keep its folder in resources/maps/.
 */
export const SOLO_MAP_TYPES: ReadonlySet<GameMapType> = new Set<GameMapType>([
  GameMapType.World1938,
]);

/** Listed maps restricted to SOLO_MAP_TYPES. */
export const soloListedMaps = listedMaps.filter((m) =>
  SOLO_MAP_TYPES.has(m.type),
);
