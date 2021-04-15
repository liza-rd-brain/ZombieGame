import {
  GameField,
  State,
  GameFieldCells,
  CellType,
  MoveDirection,
} from "../../../types";
import { ActionType } from "../../../reducer";

import { getNextPlayerCoord } from "./getNextPlayerCoord";
import { getNewState } from "./getNewState";
import { checkCanTakeCell } from "./checkCanTakeCell";

export const playerMove = (action: ActionType, state: State): State => {
  // TODO: First, before the switch, checking all direction on opportunities of making move

  switch (action.type) {
    case "req-checkAvailableNeighboringCell": {
      const newState = getStateWithMarkedCell(state);
      return newState;
    }
    case "arrowPressed": {
      const direction = action.payload;

      const { playerList, numberOfPlayer } = state;
      const prevPlayerCoord = playerList[numberOfPlayer].coord;
      const nextPlayerCoord = getNextPlayerCoord(prevPlayerCoord, direction);

      const canTakeNextCell = checkCanTakeCell(
        state,
        nextPlayerCoord,
        direction
      );

      switch (canTakeNextCell) {
        case true: {
          const newState = getNewState(state, nextPlayerCoord, direction);
          return newState;
        }
        case false: {
          return state;
        }
        default: {
          return state;
        }
      }
    }

    default: {
      return state;
    }
  }
};

/**
 * We need chekout all neighboring cell
 */
const getStateWithMarkedCell = (state: State): State => {
  const { playerList, numberOfPlayer, gameField } = state;
  const prevPlayerCoord = playerList[numberOfPlayer].coord;
  const topCellCoor = getNextPlayerCoord(prevPlayerCoord, "top");
  const bottomCellCoor = getNextPlayerCoord(prevPlayerCoord, "bottom");
  const rightCellCoor = getNextPlayerCoord(prevPlayerCoord, "right");
  const leftCellCoor = getNextPlayerCoord(prevPlayerCoord, "left");

  const availableCellCoord: Record<MoveDirection, string> = {
    top: topCellCoor,
    bottom: bottomCellCoor,
    right: rightCellCoor,
    left: leftCellCoor,
  };

  const availableCellCoordList = Object.entries(availableCellCoord);

  const existanceAvailableCellCoord = availableCellCoordList.filter(
    (coordItem) => {
      const [direction, coord] = coordItem;
      return gameField.values[coord];
    }
  );

  console.log("existanceAvailableCellCoord", existanceAvailableCellCoord);
  /*   console.log("availableCellList", availableCellCoord); */
  const availableCellList = existanceAvailableCellCoord.map((coordItem): [
    string,
    CellType
  ] => {
    const [direction, coord] = coordItem;
    const availableForTake = checkCanTakeCell(
      state,
      coord,
      direction as MoveDirection
    );
    return [
      coord,
      { ...gameField.values[coord], availableForTake: availableForTake },
    ];
  });

  const availableGameCells = Object.fromEntries(availableCellList);

  console.log("availableGameCells", availableGameCells);

  const cleanedMarkedCellList = Object.entries({ ...gameField }.values).map(
    (gameFieldCells): [string, CellType] => {
      const [index, cell] = gameFieldCells;
      delete cell.availableForTake;
      return [index, cell];
    }
  );
  console.log("cleanedMarkedGameCells", cleanedMarkedCellList);

  const cleanedMarkedGameCells = Object.fromEntries(cleanedMarkedCellList);

  const cleanedMarkedGameField: GameField = {
    ...gameField,
    values: {
      ...cleanedMarkedGameCells,
    },
  };

  const gameFieldWicthavailableCells = {
    ...cleanedMarkedGameField,
    values: {
      ...cleanedMarkedGameField.values,
      ...availableGameCells,
    },
  };

  console.log("gameFieldWicthavailableCells", gameFieldWicthavailableCells);
  const newState = { ...state, gameField: gameFieldWicthavailableCells };
  return newState;
};
