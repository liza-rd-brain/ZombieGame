import { State, TypeOfInventoryCard } from "../../../types";

import { ActionType } from "../../../reducer";
import { getPlayerMoveResult } from "./getPlayerMoveResult";
import { getStateCardSelected } from "../../common/getStateCardSelected";
import { getAvailableCells } from "./getAvailableCells";
import { getStatePlayerMoved } from "./getStatePlayerMoved";

export const playerMove = (state: State, action: ActionType): State => {
  switch (action.type) {
    case "req-checkAvailableNeighboringCell": {
      return getAvailableCells(state);
    }

    case "moveControlsClicked": {
      const direction = action.payload;
      return getStatePlayerMoved(state, direction);
    }

    case "req-getPlayerMoveResult": {
      return getPlayerMoveResult(state);
    }

    //TODO: Rename to inventoryCardClicked-?!
    case "cardChoosed": {
      const TypeOfInventoryCard: TypeOfInventoryCard = action.payload.type;
      return getStateCardSelected(state, TypeOfInventoryCard);
    }

    default: {
      return state;
    }
  }
};
