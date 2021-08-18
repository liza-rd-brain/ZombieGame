import { ActionType } from "../../../reducer";
import { State } from "../../../types";
import { getNextPlayerCoord } from "../../common";

export const getStateEnemyMoved = (state: State, action: ActionType): State => {
  switch (action.type) {
    case "moveControlsClicked": {
      const { deadPlayerList, activePlayerNumber, enemyList } = state;
      const direction = action.payload;

      if (deadPlayerList) {
        const currCardIndex = deadPlayerList[activePlayerNumber].index;

        const prevEnemyCoord = Object.keys(enemyList).find((key) => {
          return (
            enemyList[key].index === deadPlayerList[activePlayerNumber].index
          );
        });
        /* const prevEnemyCoord = deadPlayerList[activePlayerNumber].coord; */

        if (prevEnemyCoord) {
          const nextEnemyCoord = getNextPlayerCoord(prevEnemyCoord, direction);
          //TODO: Add check canTakeNextCell
          const enemyListArray = Object.entries(enemyList).map((enemyItem) => {
            const [key, enemy] = enemyItem;
            if (currCardIndex === enemyList[key].index) {
              const newEnemy = { ...enemy, coord: nextEnemyCoord };
              return [nextEnemyCoord, newEnemy];
            } else return enemyItem;
          });

          const newEnemyList = Object.fromEntries(enemyListArray);

          console.log(newEnemyList);
          return {
            ...state,
            enemyList: newEnemyList,
          };
        }
      } else {
        return state;
      }
    }
  }

  return state;
};
