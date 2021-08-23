import { State, TypeOfCard } from "../../types";

import { ActionType } from "../../reducer";

import { getAvailableCells } from "./getAvailableCells";
import { getStateEnemySelected } from "./getStateEnemySelected";
import { getStateEnemyMoved } from "./getStateEnemyMoved";
import { getEnemyMoveResult } from "./getEnemyMoveResult";

export const enemyMove = (state: State, action: ActionType): State => {
  const [, phaseInner] = state.gameState.type.split(".");

  switch (phaseInner) {
    case "chooseEnemy": {
      switch (action.type) {
        case "clickedEnemy": {
          return getStateEnemySelected(state, action);

          //Need to pull this card to player?
        }

        default: {
          return state;
        }
      }
    }

    default: {
      switch (action.type) {
        case "req-checkAvailableNeighboringCell": {
          return getAvailableCells(state);
        }

        case "moveControlsClicked": {
          return getStateEnemyMoved(state, action);
        }

        case "req-getPlayerMoveResult": {
          return getEnemyMoveResult(state);
        }

        default: {
          return state;
        }
      }
    }
  }
};
