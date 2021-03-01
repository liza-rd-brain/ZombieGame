import { State } from "../../types";
import { ActionType } from "../../reducer";

function waitingStart(action: ActionType, state: State): State {
  switch (action.type) {
    case "clickStartButton": {
      return {
        ...state,
        gameState: {
          type: "gameStarted.trownDice",
          gameStartedContext: {},
          context: {},
        },
      };
    }
    default:
      return state;
  }
}

export default waitingStart;
