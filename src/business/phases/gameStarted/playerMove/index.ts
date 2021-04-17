import {
  GameField,
  State,
  GameFieldCells,
  CellType,
  MoveDirection,
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
      return getGameFieldWithAvailableCell(state);
    }
    case "arrowPressed": {
      const direction = action.payload;
      return getStateArrowPressed(state, direction);
    }
    case "req-cleanAvailableCells": {
      return getStateClearedAvailableCells(state);
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

  const canTakeNextCell = gameField.values[nextPlayerCoord].availableForTake;

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
 * Cells that can be taken get special field "availableForTake".
 * With this field we add color for these cells.
 */
const getGameFieldWithAvailableCell = (state: State): State => {
  const { playerList, numberOfPlayer, gameField } = state;

  const prevPlayerCoord = playerList[numberOfPlayer].coord;

  /**
   * Returns coordinate of neighboring cells in all direction.
   */
  const coordNeighboringCells: {
    direction: MoveDirection;
    coord: string;
  }[] = MOVE_DIRECTION_LIST.map((directionItem) => {
    return {
      direction: directionItem,
      coord: getNextPlayerCoord(prevPlayerCoord, directionItem),
    };
  });

  /**
   * Returns the coordinates that lying in the GameField.
   */
  const existanceInGameFieldCells = coordNeighboringCells.filter(
    (coordItem) => {
      const { direction, coord } = coordItem;
      return gameField.values[coord];
    }
  );

  /**
   * Returns the coordinates of Cell that can be taken by player.
   */
  const availableCellList = existanceInGameFieldCells.map((coordItem): [
    string,
    CellType
  ] => {
    const { direction, coord } = coordItem;

    const availableForTake = checkCanTakeCell(state, coord, direction);
    return [
      coord,
      { ...gameField.values[coord], availableForTake: availableForTake },
    ];
  });

  const availableGameCells = Object.fromEntries(availableCellList);

  const gameFieldWithhAvailableCells = {
    ...gameField,
    values: { ...gameField.values, ...availableGameCells },
  };
  return { ...state, gameField: gameFieldWithhAvailableCells };
};

/**
 * Re field "availableForTake".
 * With this field we add color for these cells.
 */
const getStateClearedAvailableCells = (state: State): State => {
  const { gameField } = state;

  const cleanedMarkedCellList = Object.entries({ ...gameField }.values).map(
    (gameFieldCells): [string, CellType] => {


      const [index, cell] = gameFieldCells;
      delete cell.availableForTake;
      return [index, cell];
    }
  );

  const cleanedMarkedGameCells = Object.fromEntries(cleanedMarkedCellList);

  const cleanedMarkedGameField: GameField = {
    ...gameField,
    values: {
      ...cleanedMarkedGameCells,
    },
  };

  return {
    ...state,
    gameField: cleanedMarkedGameField,
    doEffect: { type: "!getPlayerMoveResult" },
  };
};
