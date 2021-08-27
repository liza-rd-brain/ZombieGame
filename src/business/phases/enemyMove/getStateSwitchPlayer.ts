import { DeadPlayerListType, State } from "../../types";
import { getNextPlayerNumber } from "../common/getNextPlayerNumber";

export const getStateSwitchPlayer = (state: State) => {
  const { activePlayerNumber, deadPlayerList } = state;

  if (deadPlayerList) {
    const newPlayerNumber = getNextPlayerNumber(state);

    const newDeadPlayerList: DeadPlayerListType = Object.fromEntries(
      Object.entries(deadPlayerList).map(([orderIndex, deadPlayerItem]) => {
        const { name, orderNumber, index } = deadPlayerItem;
        return [orderIndex, { name, orderNumber }];
      })
    );

    console.log(newDeadPlayerList);

    const newState: State = {
      ...state,
      dice: 0,
      gameState: { ...state.gameState, type: "gameStarted.rollDice" },
      activePlayerNumber: newPlayerNumber,
      deadPlayerList: newDeadPlayerList,
      /*    deadPlayerList: {
        ...deadPlayerList,
        [activePlayerNumber]: null,

      }, */
    };
    return newState;
  } else {
    return state;
  }
};
