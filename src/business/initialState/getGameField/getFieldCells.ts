import {
  StartCell,
  CommonCell,
  FinishCell,
  GameFieldCells,
  CellType,
  ConfigType,
} from "../../types";

/**
 *  Returns an object with start and finish  in structure of GameValues.
 */
export const getFieldCells = (
  cellList: string[],
  config: ConfigType
): GameFieldCells => {
  const emptyFieldCells = createEmptyFieldCells(cellList);
  const fieldCellsWithWalls = getCellsWalls(emptyFieldCells, config);
  const organizedFieldCells = getOrganizedFieldCells(
    fieldCellsWithWalls,
    config
  );
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
const getOrganizedFieldCells = (
  emptyField: GameFieldCells,
  config: ConfigType
): GameFieldCells => {
  const startIndex = `${config.startCoord.hor}.${config.startCoord.vert}`;
  const finishIndex = `${config.finishCoord.hor}.${config.finishCoord.vert}`;

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
const getCellsWalls = (
  emptyField: GameFieldCells,
  config: ConfigType
): GameFieldCells => {
  // TODO: Need add checking for CommonCell?

  /**
   * Returns list of Cells with walls(barriers)
   */
  const cellsWithBarrierList = config.cellsBarrierList.map(
    (cellBarrier): [string, CellType] => {
      const { coord, barrierList } = cellBarrier;
      const cellIndex = `${coord.hor}.${coord.vert}`;

      const cellWithoutBarrier = emptyField[cellIndex];

      if (cellWithoutBarrier.name === "commonCell") {
        const cellWithBarrier = {
          ...cellWithoutBarrier,
          barrierList: barrierList,
        };

        return [cellIndex, cellWithBarrier];
      } else {
        return [cellIndex, cellWithoutBarrier];
      }
    }
  );

  const cellsWithBarriers: GameFieldCells =
    Object.fromEntries(cellsWithBarrierList);

  const fieldCellsWithWalls = { ...emptyField, ...cellsWithBarriers };
  return fieldCellsWithWalls;
};
