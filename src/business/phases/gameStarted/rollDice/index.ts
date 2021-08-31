import { PlayerName, State } from "../../../types";
import { ActionType } from "../../../reducer";

export const rollDice = (state: State, action: ActionType): State => {
  switch (action.type) {
    case "diceThrown": {
      const typeOfPlayer: PlayerName = state.playerList[
        state.activePlayerNumber
      ]
        ? "player"
        : "dead";

      switch (typeOfPlayer) {
        case "dead": {
          return {
            ...state,
            dice: action.payload,
            gameState: {
              ...state.gameState,
              type: "enemyMove.chooseEnemy",
            },
          };
        }

        case "player": {
          return {
            ...state,
            dice: action.payload,
            gameState: { ...state.gameState, type: "gameStarted.playerMove" },
            doEffect: { type: "!checkAvailableNeighboringCell" },
          };
        }
      }
    }

    default:
      return state;
  }
};
