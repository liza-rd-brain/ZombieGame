import { State } from "../../../types";
import { ActionType } from "../../../reducer";

import { changePlayerCoord } from "./changePlayerCoord";
import { getNewState } from "./getNewState";

export const playerMove = (action: ActionType, state: State): State => {
  switch (action.type) {
    case "arrowPressed": {
      const direction = action.payload;
      const { playerList, numberOfPlayer } = state;
      const prevPlayerCoord = playerList[numberOfPlayer].coord;
      const newPlayerCoord = changePlayerCoord(prevPlayerCoord, direction);
      // TODO: Need separate chek out: can the player take nextCell?
      const newState = getNewState(state, newPlayerCoord, direction);
      return newState;
    }

    default: {
      return state;
    }
  }
};
