import { AMOUNT_PLAYERS} from "../../initialState";
import { State } from "../../types";
import { ActionType } from "../../reducer";

export const getOrder = (action: ActionType, state: State): State => {
  const numberCurrPlayer = state.numberOfPlayer;
  const maxPlayersNumber = AMOUNT_PLAYERS - 1;
  const minPlayersNumber = 0;
  const nextPlayersNumber =
    numberCurrPlayer + 1 > maxPlayersNumber
      ? minPlayersNumber
      : numberCurrPlayer + 1;

  switch (action.type) {
    case "receivedNextPlayer": {
      return {
        ...state,
        numberOfPlayer: nextPlayersNumber,
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
};
