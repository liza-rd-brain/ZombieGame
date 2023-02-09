import { CoordItem, EnemyListType, State } from "../../types";
import { getNextPlayerCoord } from "../common";

/**
 * Changing coordinates of player if he can take the cell in certain direction.
 */
export const getStateEnemyMovedToCoord = (
  state: State,
  newCoord: CoordItem
): State => {
  const { deadPlayerList, activePlayerNumber, enemyList } = state;

  const enemyIndex =
    deadPlayerList && deadPlayerList[activePlayerNumber].index
      ? deadPlayerList[activePlayerNumber].index
      : null;

  if (enemyIndex) {
    const nextEnemyCoordString = Object.values(newCoord).join(".");

    const canTakeNextCell =
      state.gameState.coordOfAvailableCells?.includes(nextEnemyCoordString);

    switch (canTakeNextCell) {
      case true: {
        const enemyListArray = Object.entries(enemyList).map((enemyItem) => {
          const [key, enemy] = enemyItem;
          if (Number(enemyIndex) === Number(key)) {
            const newEnemy = { ...enemy, coord: nextEnemyCoordString };
            return [key, newEnemy];
          } else return enemyItem;
        });

        const newEnemyList: EnemyListType = Object.fromEntries(enemyListArray);

        return {
          ...state,
          gameState: { ...state.gameState, coordOfAvailableCells: null },
          enemyList: newEnemyList,
          doEffect: { type: "!getPlayerMoveResult" },
        };
      }

      case false: {
        return state;
      }

      default: {
        return state;
      }
    }
  } else {
    return state;
  }
};
