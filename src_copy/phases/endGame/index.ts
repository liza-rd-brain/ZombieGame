import { State, ActionType } from "../../app";

function endGame(action: ActionType, state: State): State {
  switch (action.type) {
    case "getEndScreen": {
      return {
        ...state,
        gameState: "getEndScreen",
      };
    }
    default:
      return state;
  }
}
export default endGame;
