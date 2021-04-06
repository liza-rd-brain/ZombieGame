import { State } from "../../../types";
import { ActionType } from "../../../reducer";

import { changePlayerCoord, getNewState } from "./index";

export const clickArrow = (action: ActionType, state: State): State => {
  switch (action.type) {
    case "arrowPressed": {
      const direction = action.payload;
      const { playersList, numberOfPlayer } = { ...state };
      const prevPlayerCoord = playersList[numberOfPlayer].coord;
      const newPlayerCoord = changePlayerCoord(prevPlayerCoord, direction);
      const newState = getNewState(state, newPlayerCoord);
      return newState;
    }

    default: {
      return state;
    }
  }
};
