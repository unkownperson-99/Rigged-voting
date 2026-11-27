import {
  Difficulty,
  GameMapType,
  GameMode,
} from "@openfront/engine-api/game/GameTypes";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/client/Utils", () => ({
  translateText: vi.fn((key: string) => key),
}));
vi.mock("../../src/client/components/map/MapPicker", () => ({}));
// The solo build offers exactly one map: the picker has nothing to choose.
vi.mock("../../src/client/SoloMaps", async () => {
  const gameTypes = await import("@openfront/engine-api/game/GameTypes");
  return {
    soloListedMaps: gameTypes.listedMaps.filter(
      (m) => m.type === GameMapType.World1938,
    ),
  };
});

import "../../src/client/components/GameConfigSettings";
import type {
  GameConfigSettings,
  GameConfigSettingsData,
} from "../../src/client/components/GameConfigSettings";

const settings: GameConfigSettingsData = {
  map: { selected: GameMapType.World1938, useRandom: false },
  difficulty: { selected: Difficulty.Medium, disabled: false },
  gameMode: { selected: GameMode.FFA },
  teamCount: { selected: 2 },
  options: {
    bots: { value: 0, labelKey: "game_settings.bots", disabledKey: "x" },
    toggles: [],
    inputCards: [],
  },
  unitTypes: { titleKey: "game_settings.disable_units", disabledUnits: [] },
};

describe("GameConfigSettings with one solo map", () => {
  let el: GameConfigSettings;

  beforeEach(async () => {
    el = document.createElement("game-config-settings") as GameConfigSettings;
    el.settings = settings;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => el.remove());

  it("hides the map section and its picker", () => {
    expect(el.querySelector("map-picker")).toBeNull();
    expect(el.textContent).not.toContain("map.map");
  });
});
