import { ConfigType } from "../../business/types";
import { CELLS_BARRIERS_LIST } from "./walls";
import { MOVE_DIRECTION_LIST } from "./common";

export const DEV_CONFIG: ConfigType = {
  START_COORD: { hor: 0, vert: 0 },
  FINISH_COORD: { hor: 11, vert: 11 },
  AMOUNT_PLAYERS: 1,
  INITIAL_PLAYER_HEALTH: 3,
  AMOUNT_HEALTH_ITEMS: 0,
  AMOUNT_BOARDS_ITEMS: 0,
  AMOUNT_WEAPONS_ITEMS: 30,
  AMOUNT_ENEMIES: 30,
  CARD_APPERANCE: "open",
  PLAY_GRID_MODE: "image",
  MAX_HEALTH_AMOUNT: 7,
  CELLS_BARRIERS_LIST,
  MOVE_DIRECTION_LIST,
};
