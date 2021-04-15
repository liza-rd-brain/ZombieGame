import { State } from "../../../types";
import { ActionType } from "../../../reducer";

import { getNextPlayerCoord } from "./getNextPlayerCoord";
import { getNewState } from "./getNewState";
import { checkCanTakeCell } from "./checkCanTakeCell";

export const playerMove = (action: ActionType, state: State): State => {
  // TODO: First, before the switch, checking all direction on opportunities of making move

  switch (action.type) {
    case "arrowPressed": {
      const direction = action.payload;

      const { playerList, numberOfPlayer } = state;
      const prevPlayerCoord = playerList[numberOfPlayer].coord;
      const nextPlayerCoord = getNextPlayerCoord(prevPlayerCoord, direction);

      const canTakeNextCell = checkCanTakeCell(
        state,
        nextPlayerCoord,
        direction
      );

      switch (canTakeNextCell) {
        case true: {
          const newState = getNewState(state, nextPlayerCoord, direction);
          return newState;
        }
        case false: {
          return state;
        }
        default: {
          return state;
        }
      }
    }

    default: {
      return state;
    }
  }
};
