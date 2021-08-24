import { EnemyListType, State } from "../../types";
import { getNextPlayerNumber } from "../common/getNextPlayerNumber";

export const removeEnemyCard = (state: State): State => {
  const { enemyList, activePlayerNumber, playerList } = state;
  const currentCoord = playerList[activePlayerNumber].coord;

  const newEnemyArray = Object.entries(enemyList).filter((enemyItem) => {
    const [index, enemyCard] = enemyItem;
    return enemyCard.coord !== currentCoord;
  });
  const newEnemyList: EnemyListType = Object.fromEntries(newEnemyArray);

  const newPlayerNumber = getNextPlayerNumber(state);

  return {
    ...state,
    enemyList: newEnemyList,
    dice: 0,
    gameState: { ...state.gameState, type: "gameStarted.rollDice" },
    activePlayerNumber: newPlayerNumber,
  };
};
