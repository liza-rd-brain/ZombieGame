import {
  StartCell,
  CommonCell,
  FinishCell,
  WallItem,
  GameValues,
} from "../../types";

import { FINISH_COORD, START_COORD, WALLS_COORD } from "../index";

/**
 *  Returns an object with start, finish and walls in structure of GameValues.
 */
export const getGameValues = (cellList: string[]): GameValues => {
  const emptyGameValues = createEmptyGameValues(cellList);
  const organizedGameValues = organizeGameValues(emptyGameValues);
  return organizedGameValues;
};

/**
 * Creates an object with keys and empty cells in structure of GameValues.
 */
const createEmptyGameValues = (cellList: Array<string>): GameValues => {
  const emptyFieldItem: CommonCell = {
    name: "commonCell",
    cardItem: {},
  };

  let newEmptyGameField: GameValues = {};

  cellList.forEach((cell: string) => {
    newEmptyGameField[cell] = emptyFieldItem;
  });

  return newEmptyGameField;
};

/**
 *  Creates an object with start, finish and walls in structure of GameValues.
 */
const organizeGameValues = (emptyField: GameValues): GameValues => {
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

  const wallCells: GameValues = Object.fromEntries(wallList);

  const organizedGameValues = {
    ...emptyField,
    ...wallCells,
    [startIndex]: startCell,
    [finishIndex]: finishCell,
  };

  return organizedGameValues;
};
