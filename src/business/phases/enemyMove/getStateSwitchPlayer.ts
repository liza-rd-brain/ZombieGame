import { State } from "../../types";
import { getNextPlayerNumber } from "../common/getNextPlayerNumber";

export const getStateSwitchPlayer = (state: State) => {
  const { activePlayerNumber, deadPlayerList } = state;

  const newPlayerNumber = getNextPlayerNumber(state);

  const newState: State = {
    ...state,
    dice: 0,
    gameState: { ...state.gameState, type: "gameStarted.rollDice" },
    activePlayerNumber: newPlayerNumber,
    deadPlayerList: { ...deadPlayerList, [activePlayerNumber]: null },
  };
  return newState;
};
