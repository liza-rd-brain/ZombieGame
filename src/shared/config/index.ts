import {
  MoveDirectionList,
  CardApperance,
  PlayGridMode,
} from "../../business/types";

export const START_COORD = { hor: 1, vert: 5 };
export const FINISH_COORD = { hor: 11, vert: 11 };
export const INITIAL_PLAYER_HEALTH = 3;
export const AMOUNT_HEALTH_ITEMS = 0;
export const AMOUNT_BOARDS_ITEMS = 60;
export const AMOUNT_WEAPONS_ITEMS = 0;
export const AMOUNT_PLAYERS = 1;
export const AMOUNT_ENEMIES = 0;

export const CARD_APPERANCE: CardApperance = "open";

export const PLAY_GRID_MODE: PlayGridMode = "cssStyle";

export const MAX_HEALTH_AMOUNT = 7;

export const MOVE_DIRECTION_LIST: MoveDirectionList = [
  "top",
  "right",
  "bottom",
  "left",
];

export { CELLS_BARRIERS_LIST } from "./walls";
