import { AMOUNT_PLAYERS } from "../../../shared/config";
import { State } from "../../types";
import { ActionType } from "../../reducer";

export const getPlayersOrder = (state: State, action: ActionType): State => {
  const numberCurrPlayer = state.activePlayerNumber;
  const playerList = Object.entries(state.playerList);
  const maxPlayersNumber = playerList.length - 1;
  const minPlayersNumber = 0;
  const nextPlayersNumber =
    numberCurrPlayer + 1 > maxPlayersNumber
      ? minPlayersNumber
      : numberCurrPlayer + 1;

  switch (action.type) {
    case "req-getNextPlayer": {
      return {
        ...state,
        activePlayerNumber: nextPlayersNumber,
        gameState: { ...state.gameState, type: "gameStarted.trownDice" },
      };
    }

    default:
      return state;
  }
};
