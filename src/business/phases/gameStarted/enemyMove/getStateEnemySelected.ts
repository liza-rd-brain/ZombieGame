import { ActionType } from "../../../reducer";
import { State } from "../../../types";

export const getStateEnemySelected = (
  state: State,
  action: ActionType
): State => {
  switch (action.type) {
    case "clickedEnemy": {
      const { enemyList, deadPlayerList, activePlayerNumber } = state;
      const currEnemyCard = action.payload.enemyCard;

      const currEnemyCoord = Object.keys(enemyList).find((key) => {
        return enemyList[key].index === currEnemyCard.index;
      });

      if (deadPlayerList) {
        const canPickEnemyCard = deadPlayerList[activePlayerNumber].index
          ? false
          : true;

        switch (canPickEnemyCard) {
          case false: {
            return state;
          }
          case true: {
            /*     console.log(currEnemyCoord); */
            const newDeadPLayerList = {
              ...deadPlayerList,
              [activePlayerNumber]: {
                ...deadPlayerList[activePlayerNumber],
                index: currEnemyCard.index,
              },
            };
            return { ...state, deadPlayerList: newDeadPLayerList };
          }
        }
      } else {
        return state;
      }
    }
    default: {
      return state;
    }
  }
};
