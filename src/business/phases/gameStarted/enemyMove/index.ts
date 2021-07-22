import { State, TypeOfCard } from "../../../types";

import { ActionType } from "../../../reducer";
import { getPlayerMoveResult } from "../playerMove/getPlayerMoveResult";
import { getStateCardSelected } from "../../common/getStateCardSelected";
import { getAvailableCells } from "../playerMove/getAvailableCells";
import { getStatePlayerMoved } from "../playerMove/getStatePlayerMoved";
import { getStateClickedEnemy } from "./getStateClickedEnemy";

export const enemyMove = (state: State, action: ActionType): State => {
  switch (action.type) {
    case "req-checkAvailableNeighboringCell": {
      return getAvailableCells(state);
    }

    case "clickedEnemy": {
      return getStateClickedEnemy(state, action);

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
