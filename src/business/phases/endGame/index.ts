import { State } from "../../types";
import { ActionType } from "../../reducer";

export const endGame = (state: State, action: ActionType): State => {
  switch (action.type) {
    case "req-getEndScreen": {
      return {
        ...state,
        gameState: { ...state.gameState, type: "getEndScreen" },
      };
    }

    default:
      return state;
  }
};
