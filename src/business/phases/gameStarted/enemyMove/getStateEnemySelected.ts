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

      /**
       * we should compare indexes. They doesnt change!!!
       */
      const currEnemyIndex = Object.keys(enemyList).find((key) => {
        return enemyList[Number(key)].coord === currEnemyCard.coord;
      });

      if (deadPlayerList) {
        /**
         * Choose enemy once!
         */
        const canPickEnemyCard = deadPlayerList[activePlayerNumber]?.index
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
                index: currEnemyIndex,
              },
            };

            return {
              ...state,
              gameState: {
                ...state.gameState,
                type: "enemyMove",
              },
              doEffect: { type: "!checkAvailableNeighboringCell" },
              deadPlayerList: newDeadPLayerList,
            };
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
