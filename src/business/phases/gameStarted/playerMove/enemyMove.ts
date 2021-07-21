import { State, TypeOfCard } from "../../../types";

import { ActionType } from "../../../reducer";
import { getPlayerMoveResult } from "./getPlayerMoveResult";
import { getStateCardSelected } from "../../common/getStateCardSelected";
import { getAvailableCells } from "./getAvailableCells";
import { getStatePlayerMoved } from "./getStatePlayerMoved";

export const enemyMove = (state: State, action: ActionType): State => {
  switch (action.type) {
    case "req-checkAvailableNeighboringCell": {
      return getAvailableCells(state);
    }

    case "clickedEnemy": {
      const { enemyList, deadPlayerList, activePlayerNumber } = state;
      const currEnemyCard = action.payload.enemyCard;
      const currEnemyCoord = currEnemyCard.coord;

      if (deadPlayerList) {
        const canPickEnemyCard = deadPlayerList[activePlayerNumber].card
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
                card: currEnemyCard,
              },
            };
            return { ...state, deadPlayerList: newDeadPLayerList };
          }
        }
      } else {
        return state;
      }

      //Need to pull this card to player?
    }
    case "playerMoved": {
      console.log("двигаем врага");
      return state;
    }

    default: {
      return state;
    }
  }
};
