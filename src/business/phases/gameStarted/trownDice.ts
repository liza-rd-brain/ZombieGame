import { State } from "../../types";
import { ActionType } from "../../reducer";

export const trownDice = (state: State, action: ActionType): State => {
  switch (action.type) {
    case "diceThrown": {
      return {
        ...state,
        dice: action.payload,
        gameState: { ...state.gameState, type: "gameStarted.playerMove" },
        doEffect: { type: "!checkAvailableNeighboringCell" },
      };
    }

    default:
      return state;
  }
};
