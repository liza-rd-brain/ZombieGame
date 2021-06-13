import { State } from "../../types";

export const removeEnemyCard = (state: State): State => {
  const { enemyList, numberOfPlayer, playerList } = state;
  const currentCoord = playerList[numberOfPlayer].coord;
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
