import { ActionType } from "../../../reducer";
import { State } from "../../../types";

export const getStateClickedEnemy = (
  state: State,
  action: ActionType
): State => {
  switch (action.type) {
    case "clickedEnemy": {
      const { enemyList, deadPlayerList, activePlayerNumber } = state;
      const currEnemyCard = action.payload.enemyCard;
      const currEnemyCoord = currEnemyCard.coord;

      if (deadPlayerList) {
        const canPickEnemyCard = deadPlayerList[activePlayerNumber].coord
          ? false
          : true;

        switch (canPickEnemyCard) {
          case false: {
            return state;
          }
          case true: {
            console.log(currEnemyCoord);
            const newDeadPLayerList = {
              ...deadPlayerList,
              [activePlayerNumber]: {
                ...deadPlayerList[activePlayerNumber],
                coord: currEnemyCoord,
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
