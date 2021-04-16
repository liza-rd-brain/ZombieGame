import { State } from "../types";

import { getGameField } from "./getGameField";
import { getPlayers } from "./getPlayers";
import { getEnemies } from "./getEnemies";

const getInitialState = (): State => {
  //отдаем gameFieldWithoutEnemy для рандомного выбора координат врагов из пустых ячеек
  const gameFieldWithoutEnemy = getGameField();

  return {
    gameState: { type: "waitingStart" },
    dice: 0,
    gameResult: "",
    playerList: getPlayers(),
    enemyList: getEnemies(gameFieldWithoutEnemy),
    gameField: gameFieldWithoutEnemy,
    doEffect: null,
    numberOfPlayer: 0,
  };
};

export const initialState = getInitialState();
