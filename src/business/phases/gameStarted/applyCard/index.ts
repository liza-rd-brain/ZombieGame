import { State } from "../../../types";
import { ActionType } from "../../../reducer";

import { getStateCardSelected } from "../../common/getStateCardSelected";
import { getStateHoleFilled } from "./getStateHoleFilled";
import { getStateClickedContextMenu } from "./getStateClickedContextMenu";
import { getStateClickedPlayer } from "./getStateClickedPlayer";
import { getAvailableCards } from "./getAvailableCards";
/**
 *  In payload get order number of chosen for interact player.
 * If this number = indexCurrPlayer we heal player.
 * If not - we give context menu: need heal or apply.
 */
export const applyCard = (state: State, action: ActionType): State => {
  switch (action.type) {
    case "cardChoosed": {
      const typeOfSelect = action.payload.type;
      return getStateCardSelected(state, typeOfSelect);
    }

    case "req-fillHole": {
      const { coord, direction } = action.payload;
      return getStateHoleFilled(state, coord, direction);
    }

    case "clickedContextMenu": {
      const recipientPlayerNumber = action.payload.card.orderNumber;
      const typeOfAction = action.payload.buttonType;
      return getStateClickedContextMenu(
        state,
        recipientPlayerNumber,
        typeOfAction
      );
    }

    case "clickedPlayer": {
      const clickedPlayerCard = action.payload;
      return getStateClickedPlayer(state, clickedPlayerCard);
    }

    case "req-checkAvailableNeighboringCards": {
      const coordOfAvailableCards = getAvailableCards(state);
      return {
        ...state,
        gameState: { ...state.gameState, coordOfAvailableCards },
      };
    }

    default: {
      return state;
    }
  }
};
