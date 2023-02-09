import { State, TypeOfInventoryCard } from "../../../types";

import { ActionType } from "../../../reducer";
import { getAvailableCells } from "./getAvailableCells";
import { getAvailableCellsMax } from "./getAvailableCellsMax";
import { getPlayerMoveResult } from "./getPlayerMoveResult";
import { getStatePlayerMoved } from "./getStatePlayerMoved";
import { getStatePlayerMovedToCoord } from "./getStatePlayerMovedToCoord";
import { getStateCardSelected } from "../../common/getStateCardSelected";

export const playerMove = (state: State, action: ActionType): State => {
  switch (action.type) {
    case "req-checkAvailableNeighboringCell": {
      return getAvailableCellsMax(state);
    }

    case "playerWasMoved": {
      const newCoord = action.payload;
      return getStatePlayerMovedToCoord(state, newCoord);
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
