import { State } from "../../types";

/**
 * Need separate method for open EnemyCard
 * Because it dont lying structurally on cell
 */
export const openEnemyCard = (state: State): State => {
  const { enemyList, playerList, activePlayerNumber } = state;
  const currentCoord = playerList[activePlayerNumber].coord;

  //TODO: we have one enemy in the same coordinate, but if not?
  const currEnemyIndex = Object.entries(enemyList)
    .filter(([, enemyCard]) => {
      return enemyCard.coord === currentCoord;
    })
    .map(([index]) => {
      return index;
    })
    .join();

  const newEnemyList = {
    ...enemyList,
    [currEnemyIndex]: {
      ...enemyList[Number(currEnemyIndex)],
      apperance: "open",
    },
  };

  if (currEnemyIndex) {
    return {
      ...state,
      enemyList: newEnemyList,
      gameState: {
        ...state.gameState,
        type: "interactWithEnemy.throwBattleDice",
      },
      dice: 0,
    };
  } else {
    return state;
  }
};
