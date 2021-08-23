import { EnemyCardType, EnemyListType, State } from "../../types";

/**
 * Need separate method for open EnemyCard
 * Because it dont lying structurally on cell
 */
export const openEnemyCard = (state: State): State => {
  const { enemyList, playerList, activePlayerNumber } = state;
  const currentCoord = playerList[activePlayerNumber].coord;
  /* 
  const currEnemyCard = Object.entries(enemyList)
    .map((enemyItem) => {
      const [index, enemyCard] = enemyItem;
      return enemyCard;
    })
    .find((enemyCard) => {
      return enemyCard.coord === currentCoord;
    }); */

  //TODO: we have one enemy in the same coordinate, but if not?
  const currEnemyIndex = Object.entries(enemyList)
    .filter(([index, enemyCard]) => {
      return enemyCard.coord === currentCoord;
    })
    .map(([index, enemyCard]) => {
      return index;
    })
    .join();

  console.log(currEnemyIndex);

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
  /*   if (currEnemyCard) {
    const openedEnemyCard: EnemyCardType = {
      ...currEnemyCard,
      apperance: "open",
    };

    const newEnemyList = { ...enemyList, [currentCoord]: openedEnemyCard };
    return {
      ...state,
      enemyList: newEnemyList,
      gameState: {
        ...state.gameState,
        type: "interactWithEnemy.throwBattleDice",
      },
      dice: 0,
    };
  } else return state; */
};
