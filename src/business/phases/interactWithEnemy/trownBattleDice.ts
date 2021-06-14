import { State } from "../../types";
import { ActionType } from "../../reducer";

export const trownBattleDice = (state: State, action: ActionType): State => {
  switch (action.type) {
    case "diceThrown": {
      return {
        ...state,
        dice: action.payload,
        gameState: { type: "interactWithEnemy" },
        doEffect: { type: "!getBattleResult" },
      };
    }

    default:
      return state;
  }
};
