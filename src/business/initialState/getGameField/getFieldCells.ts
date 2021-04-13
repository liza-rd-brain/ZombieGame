import {
  StartCell,
  CommonCell,
  FinishCell,
  WallItem,
  GameFieldCells,
} from "../../types";

import { FINISH_COORD, START_COORD, WALLS_COORD } from "../../../shared/config";

/**
 *  Returns an object with start, finish and walls in structure of GameValues.
 */
export const getFieldCells = (cellList: string[]): GameFieldCells => {
  const emptyFieldCells = createEmptyFieldCells(cellList);
  const organizedFieldCells= organizeFieldCells(emptyFieldCells);
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
const organizeFieldCells = (emptyField: GameFieldCells): GameFieldCells => {
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

  const wallItem: WallItem = {
    name: "wall",
  };

  const wallList = WALLS_COORD.map((wallCoord) => {
    return [`${wallCoord.hor}.${wallCoord.vert}`, wallItem];
  });

  /*    Object.fromEntries удобно использовать для наглядности
       чтобы ни непонятно откуда была мутация
      а прозрачное изменение св-в объекта */

  const wallCells: GameFieldCells = Object.fromEntries(wallList);

  const organizedGameFieldCells = {
    ...emptyField,
    ...wallCells,
    [startIndex]: startCell,
    [finishIndex]: finishCell,
  };

  return organizedGameFieldCells;
};
