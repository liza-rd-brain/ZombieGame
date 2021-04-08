import { State } from "../../types";
import { ActionType } from "../../reducer";

export const trownDice = (action: ActionType, state: State): State => {
  switch (action.type) {
    case "diceThrown": {
      return {
        ...state,
        dice: action.payload,
        gameState: {
          ...state,
          type: "gameStarted.clickArrow",
        },
      };
    }
    default:
      return state;
  }
};
