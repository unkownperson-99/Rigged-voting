/**
 * Single-player build switch.
 *
 * `false` hides every player-facing multiplayer surface: the host, join,
 * ranked and public-lobby cards on the home screen, the Leaderboard and Clans
 * nav items, and URL routes that would open a multiplayer game.
 *
 * The networking, lobby, matchmaking and server code is intentionally kept
 * and still compiled, so it can be re-enabled by flipping this flag to `true`.
 * Solo games, the tutorial, replays and saved games are not affected.
 */
export const MULTIPLAYER_UI_ENABLED = false;
