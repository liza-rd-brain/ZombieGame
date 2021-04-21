import { HealthItemTypeArr, MoveDirectionList } from "../../business/types";

export const START_COORD = { hor: 0, vert: 0 };
export const FINISH_COORD = { hor: 11, vert: 11 };
export const INITIAL_PLAYER_HEALTH = 3;
export const AMOUNT_HEALTH_ITEMS = 60;
export const AMOUNT_PLAYERS = 4;
export const AMOUNT_ENEMIES = 10;

export const MAX_HEALTH_AMOUNT = 7;
export const HEALTH_ITEM_TYPE_ARR: HealthItemTypeArr = [
  "increment",
  "decrement",
];

export const MOVE_DIRECTION_LIST: MoveDirectionList = [
  "top",
  "right",
  "bottom",
  "left",
];

export { CELLS_SURFACES_LIST } from "./walls";
