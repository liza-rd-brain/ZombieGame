import { State } from "../../types";
import { getNextPlayerNumber } from "../common/getNextPlayerNumber";

export const removeEnemyCard = (state: State): State => {
  const { enemyList, activePlayerNumber, playerList } = state;
  const currentCoord = playerList[activePlayerNumber].coord;
  const newEnemyList = { ...enemyList };
  delete newEnemyList[currentCoord];

  const newPlayerNumber = getNextPlayerNumber(state);

  return {
    ...state,
    enemyList: newEnemyList,
    dice: 0,
    gameState: { ...state.gameState, type: "gameStarted.rollDice" },
    activePlayerNumber: newPlayerNumber,
  };
};
