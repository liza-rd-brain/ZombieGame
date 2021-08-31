import { ActionType } from "../../reducer";
import { EnemyListType, State } from "../../types";
import { getNextPlayerCoord } from "../common";

export const getStateEnemyMoved = (state: State, action: ActionType): State => {
  switch (action.type) {
    case "moveControlsClicked": {
      const { deadPlayerList, activePlayerNumber, enemyList } = state;
      const direction = action.payload;

      const enemyIndex =
        deadPlayerList && deadPlayerList[activePlayerNumber].index
          ? deadPlayerList[activePlayerNumber].index
          : null;

      if (enemyIndex) {
        const prevEnemyCoord = enemyList[enemyIndex].coord;

        const nextEnemyCoord = getNextPlayerCoord(prevEnemyCoord, direction);

        //TODO: Add check canTakeNextCell

        const canTakeNextCell =
          state.gameState.coordOfAvailableCells?.includes(nextEnemyCoord);
        switch (canTakeNextCell) {
          case true: {
            const enemyListArray = Object.entries(enemyList).map(
              (enemyItem) => {
                const [key, enemy] = enemyItem;
                if (Number(enemyIndex) === Number(key)) {
                  const newEnemy = { ...enemy, coord: nextEnemyCoord };
                  return [key, newEnemy];
                } else return enemyItem;
              }
            );

            const newEnemyList: EnemyListType =
              Object.fromEntries(enemyListArray);

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
    }
  }

  return state;
};
