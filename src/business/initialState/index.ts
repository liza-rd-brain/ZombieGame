import { ConfigType, State } from "../types";

import { getGameField } from "./getGameField";
import { getPlayers } from "./getPlayers";
import { getEnemies } from "./getEnemies";

import { PROD_CONFIG, DEV_CONFIG } from "../../shared/config";

const getInitialState = (config: ConfigType): State => {
  //отдаем gameFieldWithoutEnemy для рандомного выбора координат врагов из пустых ячеек
  const gameFieldWithoutEnemy = getGameField(config);

  return {
    gameState: {
      type: "waitingStart",
      coordOfAvailableCells: null,
      coordOfAvailableCards: null,
    },
    dice: 0,
    gameResult: "",
    playerList: getPlayers(config),
    enemyList: getEnemies(gameFieldWithoutEnemy, config),
    gameField: gameFieldWithoutEnemy,
    doEffect: null,
    activePlayerNumber: 0,
    _config: config,
  };
};

const getConfig = (
  PROD_CONFIG: ConfigType,
  DEV_CONFIG: ConfigType
): ConfigType => {
  if (process.env.NODE_ENV === "production") {
    return PROD_CONFIG;
  } else if (process.env.NODE_ENV === "development") {
    return DEV_CONFIG;
  } else {
    return PROD_CONFIG;
  }
};

export const config = getConfig(PROD_CONFIG, DEV_CONFIG);

export const initialState = getInitialState(config);
