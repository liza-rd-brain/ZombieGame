import { MoveDirection, State } from "../../../types";
import { getNextPlayerCoord } from "../../common";
import { changePlayerCoord } from "./changePlayerCoord";

/**
 * Changing coordinates of player if he can take the cell in certain direction.
 */
export const getStatePlayerMoved = (
  state: State,
  direction: MoveDirection
): State => {
  const { playerList, activePlayerNumber } = state;

  const prevPlayerCoord = playerList[activePlayerNumber].coord;
  const nextPlayerCoord = getNextPlayerCoord(prevPlayerCoord, direction);

  const canTakeNextCell =
    state.gameState.coordOfAvailableCells?.includes(nextPlayerCoord);

  switch (canTakeNextCell) {
    case true: {
      const newPlayerList = changePlayerCoord(state, nextPlayerCoord);

      const newState: State = {
        ...state,
        gameState: { ...state.gameState, coordOfAvailableCells: null },
        playerList: newPlayerList,
        doEffect: { type: "!getPlayerMoveResult" },
      };
      return newState;
    }
    case false: {
      return state;
    }
    default: {
      return state;
    }
  }
};
