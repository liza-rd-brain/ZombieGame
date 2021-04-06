import {
  HealthItemTypeArr,
  CoordItem,
  State,
  PlayersListType,
  EnemiesListType,
} from "../types";

import { getGameField } from "./getGameField";

// TODO: создать конфиг-?!
export const START_COORD = { hor: 0, vert: 0 };
export const FINISH_COORD = { hor: 9, vert: 9 };
export const INITIAL_PLAYER_HEALTH = 3;
export const AMOUNT_HEALTH_ITEMS = 30;
export const AMOUNT_PLAYERS = 1;
export const AMOUNT_ENEMIES = 1;
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

const getPlayers = (): PlayersListType => {
  const playersList = new Array(AMOUNT_PLAYERS).fill(0).map((player, index) => {
    const playerCard = {
      name: "player",
      health: INITIAL_PLAYER_HEALTH,
      orderNumber: index,
      coord: "0.0",
    };
    return [index, playerCard];
  });

  const playersObj: PlayersListType = Object.fromEntries(playersList);
  return playersObj;
};

const getEnemies = (): EnemiesListType => {
  //Добавить сначала рандомный массив с координатами пустых ячеек
  const enemiesList = new Array(AMOUNT_ENEMIES).fill(0).map((enemy, index) => {
    const enemyCard = {
      name: "enemy",
      power: 1,
      coord: "1.1",
      apperance: "closed",
    };
    //ключ=координата
    return [enemyCard.coord, enemyCard];
  });

  const enemiesObj: EnemiesListType = Object.fromEntries(enemiesList);
  return enemiesObj;
};

const getInitialState = (): State => {
  return {
    gameState: { type: "waitingStart" },
    dice: 0,
    gameResult: "",
    playersList: getPlayers(),
    enemiesList: getEnemies(),
    gameField: getGameField(),
    doEffect: null,
    numberOfPlayer: 0,
  };
};

export const initialState = getInitialState();
