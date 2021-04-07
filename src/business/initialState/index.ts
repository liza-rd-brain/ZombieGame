import { State } from "../types";

import { getGameField } from "./getGameField";
import { getPlayers } from "./getPlayers";
import { getEnemies } from "./getEnemies";

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
