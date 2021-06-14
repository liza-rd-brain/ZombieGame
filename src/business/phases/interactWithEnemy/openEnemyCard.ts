import { EnemyCardType, EnemyListType, State } from "../../types";

/**
 * Need separate method for open EnemyCard
 * Because it dont lying structurally on cell
 */
export const openEnemyCard = (state: State): State => {
  const { enemyList, playerList, numberOfPlayer } = state;
  const currentCoord = playerList[numberOfPlayer].coord;

  const currEnemyCard = enemyList[currentCoord];
  const openedEnemyCard: EnemyCardType = {
    ...currEnemyCard,
    apperance: "open",
  };

  const newEnemyList = { ...enemyList, [currentCoord]: openedEnemyCard };
  return {
    ...state,
    enemyList: newEnemyList,
    gameState: { type: "interactWithEnemy.throwBattleDice" },
    dice: 0,
  };
};
