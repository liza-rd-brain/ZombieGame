import { State } from "../../types";

export const removeEnemyCard = (state: State): State => {
  const { enemyList, activePlayerNumber, playerList } = state;
  const currentCoord = playerList[activePlayerNumber].coord;
  const newEnemyList = { ...enemyList };
  delete newEnemyList[currentCoord];

  return {
    ...state,
    enemyList: newEnemyList,
    dice: 0,
    gameState: {
      type: "gameStarted.getPlayersOrder",
    },
    doEffect: {
      type: "!getNextPlayer",
    },
  };
};
