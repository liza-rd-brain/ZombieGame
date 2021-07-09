import {
  State,
  MoveDirection,
  AvailableCellListType,
  TypeOfCard,
} from "../../../types";

import { ActionType } from "../../../reducer";
import { MOVE_DIRECTION_LIST } from "../../../../shared/config";

import { getNextPlayerCoord } from "../../common/getNextPlayerCoord";
import { getPlayerMoveResult } from "./getPlayerMoveResult";
import { checkCanTakeCell } from "./checkCanTakeCell";
import { changePlayerCoord } from "./changePlayerCoord";
import { getStateCardSelected } from "../../common/getStateCardSelected";
import { getNeighboringCellList } from "../../common/getNeighboringCellList";

export const playerMove = (state: State, action: ActionType): State => {
  switch (action.type) {
    case "req-checkAvailableNeighboringCell": {
      return getAvailableCells(state);
    }

    case "playerMoved": {
      const direction = action.payload;
      return getStatePlayerMoved(state, direction);
    }

    case "req-getPlayerMoveResult": {
      return getPlayerMoveResult(state);
    }

    case "cardChoosed": {
      const typeofCard: TypeOfCard = action.payload.type;
      return getStateCardSelected(state, typeofCard);
    }

    default: {
      return state;
    }
  }
};

/**
 * Changing coordinates of player if he can take the cell in certain direction.
 */
const getStatePlayerMoved = (state: State, direction: MoveDirection): State => {
  const { playerList, activePlayerNumber, gameField } = state;

  const prevPlayerCoord = playerList[activePlayerNumber].coord;
  const nextPlayerCoord = getNextPlayerCoord(prevPlayerCoord, direction);

  /*   const canTakeNextCell = gameField.values[nextPlayerCoord].availableForTake;
   */

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

/**
 * Current player get field "availableForTake" with coordinate of cells that can be taken
 */

export const getAvailableCells = (state: State): State => {
  const { playerList, activePlayerNumber, gameField } = state;
  const prevPlayerCoord = playerList[activePlayerNumber].coord;
  const neighboringCellList = getNeighboringCellList(
    prevPlayerCoord,
    gameField
  );

  /**
   * Returns the coordinates of Cell that can be taken by player.
   */
  const availableCellList: AvailableCellListType = neighboringCellList.filter(
    (cellItem) => {
      const { direction, coord } = cellItem;

      return checkCanTakeCell(state, coord, direction);
    }
  );

  const coordOfAvailableCells = availableCellList.map((cellItem) => {
    const { direction, coord } = cellItem;
    return coord;
  });

  return {
    ...state,
    gameState: { ...state.gameState, coordOfAvailableCells },
  };
};

/**
 *Remove from current player availableCellList
 */
const getStateClearedAvailableCells = (state: State): State => {
  const { playerList, activePlayerNumber, gameField } = state;

  return {
    ...state,
    doEffect: { type: "!getPlayerMoveResult" },
    gameState: { ...state.gameState, coordOfAvailableCells: null },
  };
};
