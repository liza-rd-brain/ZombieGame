import {
  StartCell,
  CommonCell,
  FinishCell,
  GameFieldCells,
  CellType,
} from "../../types";

import {
  FINISH_COORD,
  START_COORD,
  CELLS_BARRIERS_LIST,
} from "../../../shared/config";

/**
 *  Returns an object with start and finish  in structure of GameValues.
 */
export const getFieldCells = (cellList: string[]): GameFieldCells => {
  const emptyFieldCells = createEmptyFieldCells(cellList);
  const fieldCellsWithWalls = getCellsWalls(emptyFieldCells);
  const organizedFieldCells = getOrganizedFieldCells(fieldCellsWithWalls);
  return organizedFieldCells;
};

/**
 * Creates an object with keys and empty cells in structure of GameValues.
 */
const createEmptyFieldCells = (cellList: Array<string>): GameFieldCells => {
  const emptyFieldItem: CommonCell = {
    name: "commonCell",
    cardItem: [],
  };

  let newEmptyGameField: GameFieldCells = {};

  cellList.forEach((cell: string) => {
    newEmptyGameField[cell] = emptyFieldItem;
  });

  return newEmptyGameField;
};

/**
 *  Creates an object with start, finish and walls in structure of GameValues.
 */
const getOrganizedFieldCells = (emptyField: GameFieldCells): GameFieldCells => {
  const startIndex = `${START_COORD.hor}.${START_COORD.vert}`;
  const finishIndex = `${FINISH_COORD.hor}.${FINISH_COORD.vert}`;

  const startCell: StartCell = {
    name: "start",
    cardItem: [],
  };

  const finishCell: FinishCell = {
    name: "finish",
    cardItem: [],
  };

  const organizedGameFieldCells = {
    ...emptyField,
    [startIndex]: startCell,
    [finishIndex]: finishCell,
  };

  return organizedGameFieldCells;
};

/**
 * @returns The object in structure GameFieldCells. With walls(barriers) in cells.
 */
const getCellsWalls = (emptyField: GameFieldCells): GameFieldCells => {
  // TODO: Need add checking for CommonCell?

  /**
   * Returns list of Cells with walls(barriers)
   */
  const cellsWithBarrierList = CELLS_BARRIERS_LIST.map((cellBarrier): [
    string,
    CellType
  ] => {
    const { coord, barrier } = cellBarrier;
    const cellIndex = `${coord.hor}.${coord.vert}`;

    const cellWithoutBarrier = emptyField[cellIndex];

    if (cellWithoutBarrier.name === "commonCell") {
      const cellWithBarrier = {
        ...cellWithoutBarrier,
        barrierItem: barrier,
      };

      return [cellIndex, cellWithBarrier];
    } else {
      return [cellIndex, cellWithoutBarrier];
    }
  });

  const cellsWithBarriers: GameFieldCells = Object.fromEntries(
    cellsWithBarrierList
  );

  const fieldCellsWithWalls = { ...emptyField, ...cellsWithBarriers };
  return fieldCellsWithWalls;
};
