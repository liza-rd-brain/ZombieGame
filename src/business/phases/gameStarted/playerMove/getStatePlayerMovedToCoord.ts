import { CoordItem, State } from "../../../types";
import { getNextPlayerCoord } from "../../common";
import { changePlayerCoord } from "./changePlayerCoord";

/**
 * Changing coordinates of player if he can take the cell in certain direction.
 */
export const getStatePlayerMovedToCoord = (
  state: State,
  newCoord: CoordItem
): State => {
  const { playerList, activePlayerNumber } = state;

  //TODO: took out common functional for coordinates
  const nextPlayerCoordString = Object.values(newCoord).join(".");

  const canTakeNextCell = state.gameState.coordOfAvailableCells?.includes(
    nextPlayerCoordString
  );

  switch (canTakeNextCell) {
    case true: {
      const newPlayerList = changePlayerCoord(state, nextPlayerCoordString);

      console.log("newPlayerList", newPlayerList);

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
