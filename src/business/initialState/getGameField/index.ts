import { FINISH_COORD } from "../index";

import { getGameValues } from "./getGameValues";
import { spreadHealthCards } from "./spreadHealthCards";

export const getGameField = () => {
  const order = getCellOrder();
  const gameValues = getGameValues(order);
  const filledWithCardsGameValues = spreadHealthCards(gameValues);
  const gameField = { order, values: filledWithCardsGameValues };
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
