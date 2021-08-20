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

        const prevEnemyCoord = enemyList[currCardIndex].coord;

        if (prevEnemyCoord) {
          const nextEnemyCoord = getNextPlayerCoord(prevEnemyCoord, direction);
          //TODO: Add check canTakeNextCell
          const enemyListArray = Object.entries(enemyList).map((enemyItem) => {
            const [key, enemy] = enemyItem;
            if (Number(currCardIndex) === Number(key)) {
              const newEnemy = { ...enemy, coord: nextEnemyCoord };
              return [key, newEnemy];
            } else return enemyItem;
          });

          const newEnemyList = Object.fromEntries(enemyListArray);

          console.log(newEnemyList);

          return {
            ...state,
            dice: state.dice - 1,
            enemyList: newEnemyList,
            doEffect: { type: "!checkAvailableNeighboringCell" },
          };
        }
      } else {
        return state;
      }
    }
  }

  return state;
};
