import { State, ActionType } from "./../../app";

function waitingStart(action: ActionType, state: State): State {
  switch (action.type) {
    case "clickStartButton": {
      return {
        ...state,
        gameState: { type: "gameStarted.trownDice", context: {} },
      };
    }
    default:
      return state;
  }
}

export default waitingStart;
