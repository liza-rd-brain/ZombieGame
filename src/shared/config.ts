import {
  HealthItemTypeArr,
  CoordItem,
  CellsSurfaceListType,
} from "../business/types";

export const START_COORD = { hor: 0, vert: 0 };
export const FINISH_COORD = { hor: 9, vert: 9 };
export const INITIAL_PLAYER_HEALTH = 3;
export const AMOUNT_HEALTH_ITEMS = 30;
export const AMOUNT_PLAYERS = 4;
export const AMOUNT_ENEMIES = 10;
export const WALLS_COORD: Array<CoordItem> = [
  { hor: 2, vert: 2 },
  { hor: 3, vert: 2 },
  { hor: 4, vert: 2 },
  { hor: 2, vert: 3 },
  { hor: 4, vert: 3 },
  { hor: 2, vert: 4 },
  { hor: 3, vert: 4 },
  { hor: 4, vert: 4 },
];
export const HEALTH_ITEM_TYPE_ARR: HealthItemTypeArr = [
  "increment",
  "decrement",
];

// The array is convenient for iterating
export const SURFACES_LIST: CellsSurfaceListType = [
  {
    coord: { hor: 2, vert: 2 },
    surfaces: {
      top: null,
      right: null,
      bottom: "wall",
      left: "wall",
    },
  },
  {
    coord: { hor: 3, vert: 2 },
    surfaces: {
      top: null,
      right: null,
      bottom: "door",
      left: null,
    },
  },
  {
    coord: { hor: 4, vert: 2 },
    surfaces: {
      top: null,
      right: "wall",
      bottom: "wall",
      left: null,
    },
  },
  {
    coord: { hor: 2, vert: 3 },
    surfaces: {
      top: null,
      right: null,
      bottom: null,
      left: "wall",
    },
  },
  {
    coord: { hor: 4, vert: 3 },
    surfaces: {
      top: null,
      right: "wall",
      bottom: null,
      left: null,
    },
  },
  {
    coord: { hor: 2, vert: 4 },
    surfaces: {
      top: "wall",
      right: null,
      bottom: null,
      left: "wall",
    },
  },
  {
    coord: { hor: 3, vert: 4 },
    surfaces: {
      top: "wall",
      right: null,
      bottom: null,
      left: null,
    },
  },
  {
    coord: { hor: 4, vert: 4 },
    surfaces: {
      top: "wall",
      right: "wall",
      bottom: null,
      left: null,
    },
  },
];

console.log(SURFACES_LIST);
