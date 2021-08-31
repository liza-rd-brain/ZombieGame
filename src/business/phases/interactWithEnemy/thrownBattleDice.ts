import { State } from "../../types";
import { ActionType } from "../../reducer";

export const thrownBattleDice = (state: State, action: ActionType): State => {
  switch (action.type) {
    case "diceThrown": {
      return {
        ...state,
        dice: action.payload,
        gameState: { ...state.gameState, type: "interactWithEnemy" },
        doEffect: { type: "!getBattleResult" },
      };
    }

    default:
      return state;
  }
};
