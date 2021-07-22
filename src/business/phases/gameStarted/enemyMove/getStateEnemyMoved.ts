import { ActionType } from "../../../reducer";
import { MoveDirection, State } from "../../../types";
import { getNextPlayerCoord } from "../../common";

export const getStateEnemyMoved = (state: State, action: ActionType): State => {
  switch (action.type) {
    case "moveControlsClicked": {
      const { deadPlayerList, activePlayerNumber, enemyList } = state;
      const direction = action.payload;
      if (deadPlayerList) {
        const prevEnemyCoord = deadPlayerList[activePlayerNumber].coord;

        if (prevEnemyCoord) {
          const nextEnemyCoord = getNextPlayerCoord(prevEnemyCoord, direction);
          //TODO: Add chack canTakeNextCell
          const enemyListArray = Object.entries(enemyList).map((enemyItem) => {
            const [key, enemy] = enemyItem;
            if (key === prevEnemyCoord) {
              const newEnemy = { ...enemy, coord: nextEnemyCoord };
              return [nextEnemyCoord, newEnemy];
            } else return enemyItem;
          });
          const newEnemyList = Object.fromEntries(enemyListArray);

          const newDeadPLayerList = {
            ...deadPlayerList,
            [activePlayerNumber]: {
              ...deadPlayerList[activePlayerNumber],
              coord: nextEnemyCoord,
            },
          };
          console.log(newEnemyList);
          return {
            ...state,
            enemyList: newEnemyList,
            deadPlayerList: newDeadPLayerList,
          };
        }
      } else {
        return state;
      }
    }
  }
  return state;
};
