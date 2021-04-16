import { FINISH_COORD } from "../../../shared/config";

import { getFieldCells} from "./getFieldCells";
import { spreadHealthCards } from "./spreadHealthCards";

export const getGameField = () => {
  const order = getCellOrder();
  const gameFieldCells = getFieldCells(order);
  const filledWithCardsCells = spreadHealthCards(gameFieldCells);
  const gameField = { order, values: filledWithCardsCells };
  return gameField;
};

/**
 * Creates an array with cell index order.
 */
const getCellOrder = (): Array<string> => {
  const width = FINISH_COORD.hor;
  const height = FINISH_COORD.vert;

  let orderList: Array<string> = [];

  for (let hor = 0; hor <= width; hor++) {
    for (let vert = 0; vert <= height; vert++) {
      const index: string = `${hor}.${vert}`;
      orderList.push(index);
    }
  }

  return orderList;
};
