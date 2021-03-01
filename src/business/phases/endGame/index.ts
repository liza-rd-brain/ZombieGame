import { State  } from "../../types";
import { ActionType } from "../../reducer";
function endGame(action: ActionType, state: State): State {
  switch (action.type) {
    case "getEndScreen": {
      return {
        ...state,
        gameState: { type: "getEndScreen", context: {} },
      };
    }
    default:
      return state;
  }
}
export default endGame;
