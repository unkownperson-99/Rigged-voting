// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import en from "../../resources/lang/en.json";
import { ClientEnv } from "../../src/client/ClientEnv";
import { GameModeSelector } from "../../src/client/GameModeSelector";
import { MULTIPLAYER_UI_ENABLED } from "../../src/client/MultiplayerFeatures";

// Covers the single-player build: with MULTIPLAYER_UI_ENABLED off, the home
// screen must offer Solo (and Tutorial) only, and must not open the public
// lobby socket. The real flag value is used here on purpose.

const lobbyStart = vi.hoisted(() => vi.fn());

vi.mock("../../src/client/LazyModals", () => ({
  whenModalLoaded: vi.fn(),
}));

vi.mock("../../src/client/LobbySocket", () => ({
  PublicLobbySocket: class {
    start = lobbyStart;
    stop = vi.fn();
  },
}));

vi.mock("../../src/client/ServerList", () => ({
  backendUnreachableConfirmed: () => false,
  isPinnedToAVersion: () => false,
  refreshServerList: vi.fn(),
  retryServerList: vi.fn(),
  manualRetryAvailable: () => true,
  MANUAL_RETRY_COOLDOWN_MS: 3000,
}));

function flatten(
  value: Record<string, unknown>,
  prefix = "",
  out: Record<string, string> = {},
): Record<string, string> {
  for (const [key, child] of Object.entries(value)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof child === "string") out[fullKey] = child;
    else flatten(child as Record<string, unknown>, fullKey, out);
  }
  return out;
}

describe("multiplayer UI feature flag (off)", () => {
  let selector: GameModeSelector | undefined;
  let languageFixture: HTMLElement | undefined;

  beforeEach(async () => {
    (
      window as unknown as { BOOTSTRAP_CONFIG?: Record<string, unknown> }
    ).BOOTSTRAP_CONFIG = {
      gameEnv: "dev",
      turnstileSiteKey: "test",
      jwtAudience: "localhost",
      gitCommit: "test",
      isDev: false,
      version: "test",
    };
    const translations = flatten(en);
    languageFixture = document.createElement("lang-selector");
    Object.assign(languageFixture, {
      translations,
      defaultTranslations: translations,
      currentLang: "en",
    });
    document.body.appendChild(languageFixture);

    selector = new GameModeSelector();
    document.body.appendChild(selector);
    await selector.updateComplete;
  });

  afterEach(() => {
    selector?.remove();
    selector = undefined;
    languageFixture?.remove();
    languageFixture = undefined;
    document.body.innerHTML = "";
    delete (window as unknown as { BOOTSTRAP_CONFIG?: Record<string, unknown> })
      .BOOTSTRAP_CONFIG;
    ClientEnv.reset();
    lobbyStart.mockClear();
  });

  it("is switched off", () => {
    expect(MULTIPLAYER_UI_ENABLED).toBe(false);
  });

  it("offers Solo", () => {
    const labels = Array.from(selector!.querySelectorAll("button")).map(
      (b) => b.textContent?.trim() ?? "",
    );
    expect(labels).toContain(en.main.solo);
  });

  it("renders no host, join or ranked buttons", () => {
    const labels = Array.from(selector!.querySelectorAll("button")).map(
      (b) => b.textContent?.trim() ?? "",
    );
    const forbidden = [
      en.main.create,
      en.main.join,
      flatten(en)["mode_selector.ranked_title"],
    ];
    for (const label of forbidden) {
      expect(label).toBeTruthy();
      expect(labels.some((text) => text.includes(label))).toBe(false);
    }
  });

  it("does not open the public lobby socket", () => {
    expect(lobbyStart).not.toHaveBeenCalled();
  });
});
