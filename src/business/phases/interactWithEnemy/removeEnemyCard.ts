import { State } from "../../types";
import { getNextPlayerNumber } from "../common/getNextPlayerNumber";

export const removeEnemyCard = (state: State): State => {
  const { enemyList, activePlayerNumber, playerList } = state;
  const currentCoord = playerList[activePlayerNumber].coord;

  delete enemyList[currentCoord];

  const newPlayerNumber = getNextPlayerNumber(state);

  return {
    ...state,
    enemyList,
    dice: 0,
    gameState: { ...state.gameState, type: "gameStarted.rollDice" },
    activePlayerNumber: newPlayerNumber,
  };
};
