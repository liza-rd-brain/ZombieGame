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
  CELLS_SURFACES_LIST,
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
    cardItem: {},
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
    cardItem: {},
  };

  const finishCell: FinishCell = {
    name: "finish",
    cardItem: {},
  };

  /*   const wallList = WALLS_COORD.map((wallCoord) => {
    return [`${wallCoord.hor}.${wallCoord.vert}`, wallItem];
  }); */

  /*    Object.fromEntries удобно использовать для наглядности
       чтобы ни непонятно откуда была мутация
      а прозрачное изменение св-в объекта */

  /*   const wallCells: GameFieldCells = Object.fromEntries(wallList); */

  const organizedGameFieldCells = {
    ...emptyField,
    [startIndex]: startCell,
    [finishIndex]: finishCell,
  };

  return organizedGameFieldCells;
};

/**
 *
 * @returns The object in structure GameFieldCells. With walls(surfaces) in cells.
 */
const getCellsWalls = (emptyField: GameFieldCells): GameFieldCells => {
  // TODO: Need add checking for CommonCell?
  /**
   * Returns list of Cells with walls(surfaces)
   */
  const cellsWithSurfacesList = CELLS_SURFACES_LIST.map((cellSurfaces): [
    string,
    CellType
  ] => {
    const { coord, surfaces } = cellSurfaces;
    const cellIndex = `${coord.hor}.${coord.vert}`;

    const cellWithoutSurface = emptyField[cellIndex];

    if (cellWithoutSurface.name === "commonCell") {
      const cellWithSurface = {
        ...cellWithoutSurface,
        surfaceItem: surfaces,
      };
      /* return { [cellIndex]: cellWithSurface }; */
      return [cellIndex, cellWithSurface];
    } else {
      return [cellIndex, cellWithoutSurface];
    }
  });

  const cellsWithSurfaces: GameFieldCells = Object.fromEntries(
    cellsWithSurfacesList
  );

  const fieldCellsWithWalls = { ...emptyField, ...cellsWithSurfaces };
  return fieldCellsWithWalls;
};
