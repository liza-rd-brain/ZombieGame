import { useDispatch, useSelector } from "react-redux";

import { State, HealthCardType, PlayerListType } from "../../types";

/**
 * We need to give highlighting to healthCard
 */

/**
 * 
Need switch for click false/true
 */
export const getStateCardChosed = (state: State, currentCardIndex: number) => {
  const stateWithHighlightning: State = {
    ...state,

    gameState: {
      type:
        state.gameState.type === "gameStarted.applyCard"
          ? "gameStarted.playerMove"
          : "gameStarted.applyCard",
    },
  };
  return stateWithHighlightning;
};
