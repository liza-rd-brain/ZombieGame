import { State } from "../../types";
import { ActionType } from "../../reducer";

export const endGame = (action: ActionType, state: State): State => {
  switch (action.type) {
    case "req-getEndScreen": {
      return {
        ...state,
        gameState: { type: "getEndScreen" },
      };
    }

    default:
      return state;
  }
};
