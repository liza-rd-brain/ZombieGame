import {
  GameField,
  State,
  GameFieldCells,
  CellType,
  MoveDirection,
  AvailableCellListType,
} from "../../../types";

import { ActionType } from "../../../reducer";
import { MOVE_DIRECTION_LIST } from "../../../../shared/config";

import { getNextPlayerCoord } from "../getNextPlayerCoord";
import { getPlayerMoveResult } from "./getPlayerMoveResult";
import { checkCanTakeCell } from "./checkCanTakeCell";
import { changePlayerCoord } from "./changePlayerCoord";
import { getStateCardChosed } from "../getStateCardChosed";

export const playerMove = (action: ActionType, state: State): State => {
  switch (action.type) {
    case "req-checkAvailableNeighboringCell": {
      return getPlayerWithAvailableCells(state);
    }

    case "playerMoved": {
      const direction = action.payload;
      return getStatePlayerMoved(state, direction);
    }

    case "req-cleanAvailableCells": {
      return getStateClearedAvailableCells(state);
    }

    case "req-getPlayerMoveResult": {
      return getPlayerMoveResult(state);
    }
    
    case "cardChoosed": {
      const target = action.payload;
      return getStateCardChosed(state, target);
    }

    case "cardChoosed": {
      const target = action.payload;
      return getStateCardChosed(state, target);
        // TODO: Need get highlightning to playerCard with index indexChosenPlayer
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
  const { playerList, numberOfPlayer, gameField } = state;

  const prevPlayerCoord = playerList[numberOfPlayer].coord;
  const nextPlayerCoord = getNextPlayerCoord(prevPlayerCoord, direction);

  /*   const canTakeNextCell = gameField.values[nextPlayerCoord].availableForTake;
   */

  const canTakeNextCell = playerList[
    numberOfPlayer
  ].availableCellsCoords?.includes(nextPlayerCoord);

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

const getPlayerWithAvailableCells = (state: State): State => {
  const { playerList, numberOfPlayer, gameField } = state;

  const prevPlayerCoord = playerList[numberOfPlayer].coord;

const getPlayerWithAvailableCells = (state: State): State => {
  const { numberOfPlayer } = state;

  const neighboringCellList = getNeighboringCellList(state);

  /**
   * Returns the coordinates of Cell that can be taken by player.
   */
  const availableCellList: AvailableCellListType = neighboringCellList.filter(
    (cellItem) => {
      const { direction, coord } = cellItem;

      return checkCanTakeCell(state, coord, direction);
    }
  );

  const availableCellsCoords = availableCellList.map((cellItem) => {
    const { direction, coord } = cellItem;
    return coord;
  });

  return {
    ...state,
    playerList: {
      ...state.playerList,
      [numberOfPlayer]: {
        ...state.playerList[numberOfPlayer],
        availableCellsCoords: availableCellsCoords,
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
  delete currPlayer.availableCellsCoords;
  return {
    ...state,
    playerList: { ...state.playerList, [numberOfPlayer]: currPlayer },
    doEffect: { type: "!getPlayerMoveResult" },
  };
};
