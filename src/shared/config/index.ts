import { MoveDirectionList } from "../../business/types";

export const START_COORD = { hor: 4, vert: 5 };
export const FINISH_COORD = { hor: 11, vert: 11 };
export const INITIAL_PLAYER_HEALTH = 3;
export const AMOUNT_HEALTH_ITEMS = 30;
export const AMOUNT_BOARDS_ITEMS = 80;
export const AMOUNT_PLAYERS = 1;
export const AMOUNT_ENEMIES = 0;

export const MAX_HEALTH_AMOUNT = 7;

export const MOVE_DIRECTION_LIST: MoveDirectionList = [
  "top",
  "right",
  "bottom",
  "left",
];

export { CELLS_BARRIERS_LIST } from "./walls";
