import { ConfigType } from "../../business/types";
import { COMMON_CONFIG } from "./common";
export const DEV_CONFIG: ConfigType = {
  ...COMMON_CONFIG,
  START_COORD: { hor: 0, vert: 0 },
  FINISH_COORD: { hor: 11, vert: 11 },
  AMOUNT_PLAYERS: 2,
  INITIAL_PLAYER_HEALTH: 3,
  AMOUNT_HEALTH_ITEMS: 0,
  AMOUNT_BOARDS_ITEMS: 0,
  AMOUNT_WEAPONS_ITEMS: 30,
  AMOUNT_ENEMIES: 0,
  CARD_APPERANCE: "open",
  PLAY_GRID_MODE: "cssStyle",
  MAX_HEALTH_AMOUNT: 7,
};
