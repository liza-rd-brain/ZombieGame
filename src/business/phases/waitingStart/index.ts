import { State } from "../../types";
import { ActionType } from "../../reducer";

export const waitingStart = (action: ActionType, state: State): State => {
  switch (action.type) {
    case "clickedStartButton": {
      return {
        ...state,
        gameState: {
          type: "gameStarted.trownDice",
        },
      };
    }
    default:
      return state;
  }
};
