import { EnemyCardType, State } from "../../types";

/**
 * Need separate method for open EnemyCard
 * Because it dont lying structurally on cell
 */
export const openEnemyCard = (state: State): State => {
  const { enemyList, playerList, activePlayerNumber } = state;
  const currentCoord = playerList[activePlayerNumber].coord;

  const currEnemyCard = Object.entries(enemyList)
    .map((enemyItem) => {
      const [index, enemyCard] = enemyItem;
      return enemyCard;
    })
    .find((enemyCard) => {
      return enemyCard.coord === currentCoord;
    });

  if (currEnemyCard) {
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
  } else return state;
};
