import { DeadPlayerListType, State } from "../../types";
import { getNextPlayerNumber } from "../common/getNextPlayerNumber";

export const getStateSwitchPlayer = (state: State) => {
  const { deadPlayerList } = state;

  if (deadPlayerList) {
    const newPlayerNumber = getNextPlayerNumber(state);

    const newDeadPlayerList: DeadPlayerListType = Object.fromEntries(
      Object.entries(deadPlayerList).map(([orderIndex, deadPlayerItem]) => {
        const { name, orderNumber, index } = deadPlayerItem;
        return [orderIndex, { name, orderNumber }];
      })
    );

    const newState: State = {
      ...state,
      dice: 0,
      gameState: { ...state.gameState, type: "gameStarted.rollDice" },
      activePlayerNumber: newPlayerNumber,
      deadPlayerList: newDeadPlayerList,
    };
    return newState;
  } else {
    return state;
  }
};
