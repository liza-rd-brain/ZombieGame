import {
  GameField,
  State,
  GameFieldCells,
  CellType,
  MoveDirection,
  AvailableCellListType,
} from "../../../types";

import { ActionType } from "../../../reducer";
import { MOVE_DIRECTION_LIST } from "./../../../../shared/config";

import { getNextPlayerCoord } from "./getNextPlayerCoord";
import { getPlayerMoveResult } from "./getPlayerMoveResult";
import { checkCanTakeCell } from "./checkCanTakeCell";
import { changePlayerCoord } from "./changePlayerCoord";

export const playerMove = (action: ActionType, state: State): State => {
  switch (action.type) {
    case "req-checkAvailableNeighboringCell": {
      return getPlayerWithAvailableCell(state);
    }
    case "arrowPressed": {
      const direction = action.payload;
      return getStateArrowPressed(state, direction);
    }
    case "req-cleanAvailableCells": {
      const newState = getStateClearedAvailableCells(state);
      console.log(newState);
      return newState;
    }
    case "req-getPlayerMoveResult": {
      return getPlayerMoveResult(state);
    }

    default: {
      return state;
    }
  }
};

/**
 * Changing coordinates of player if he can take the cell in  certain direction.
 */
const getStateArrowPressed = (
  state: State,
  direction: MoveDirection
): State => {
  const { playerList, numberOfPlayer, gameField } = state;

  const prevPlayerCoord = playerList[numberOfPlayer].coord;
  const nextPlayerCoord = getNextPlayerCoord(prevPlayerCoord, direction);

  /*   const canTakeNextCell = gameField.values[nextPlayerCoord].availableForTake;
   */

  const canTakeNextCell = playerList[numberOfPlayer].availableCellList?.find(
    (cell) => {
      {
        return cell.coord == nextPlayerCoord;
      }
    }
  )
    ? true
    : false;

  switch (canTakeNextCell) {
    case true: {
      const newPlayerList = changePlayerCoord(state, nextPlayerCoord);
      const newState: State = {
        ...state,
        playerList: newPlayerList,
        doEffect: { type: "!cleanMarkedCell" },
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
const getPlayerWithAvailableCell = (state: State): State => {
  const { playerList, numberOfPlayer, gameField } = state;

  const prevPlayerCoord = playerList[numberOfPlayer].coord;

  /**
   * Returns coordinate of neighboring cells in all direction.
   */
  const coordNeighboringCells: AvailableCellListType = MOVE_DIRECTION_LIST.map(
    (directionItem) => {
      return {
        direction: directionItem,
        coord: getNextPlayerCoord(prevPlayerCoord, directionItem),
      };
    }
  );

  /**
   * Returns the coordinates that lying in the GameField.
   */
  const existanceInGameFieldCells: AvailableCellListType = coordNeighboringCells.filter(
    (coordItem) => {
      const { direction, coord } = coordItem;
      return gameField.values[coord];
    }
  );

  /**
   * Returns the coordinates of Cell that can be taken by player.
   */
  const availableCellList: AvailableCellListType = existanceInGameFieldCells.filter(
    (coordItem) => {
      const { direction, coord } = coordItem;

      return checkCanTakeCell(state, coord, direction);
    }
  );

  return {
    ...state,
    playerList: {
      ...state.playerList,
      [numberOfPlayer]: {
        ...state.playerList[numberOfPlayer],
        availableCellList: availableCellList,
      },
    },
  };
};

/**
 *Remove from current player availableCellList
 */
const getStateClearedAvailableCells = (state: State): State => {
  const { playerList, numberOfPlayer, gameField } = state;
  const currPlayer = playerList[numberOfPlayer];
  delete currPlayer.availableCellList;
  return {
    ...state,
    playerList: { ...state.playerList, [numberOfPlayer]: currPlayer },
    doEffect: { type: "!getPlayerMoveResult" },
  };
};
