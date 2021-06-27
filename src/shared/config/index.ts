import {
  MoveDirectionList,
  CardApperance,
  PlayGridMode,
} from "../../business/types";

export const START_COORD = { hor: 0, vert: 0 };
export const FINISH_COORD = { hor: 11, vert: 11 };
export const INITIAL_PLAYER_HEALTH = 3;
export const AMOUNT_HEALTH_ITEMS = 20;
export const AMOUNT_BOARDS_ITEMS = 20;
export const AMOUNT_WEAPONS_ITEMS = 20;
export const AMOUNT_PLAYERS = 1;
export const AMOUNT_ENEMIES = 20;

export const CARD_APPERANCE: CardApperance = "closed";

export const PLAY_GRID_MODE: PlayGridMode = "image";

export const MAX_HEALTH_AMOUNT = 7;

export const MOVE_DIRECTION_LIST: MoveDirectionList = [
  "top",
  "right",
  "bottom",
  "left",
];

export { CELLS_BARRIERS_LIST } from "./walls";
