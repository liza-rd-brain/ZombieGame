import { ConfigType } from "../../types";
import { getFieldCells } from "./getFieldCells";
import { spreadCards } from "./spreadCards";

//TODO: Need add some config object for all cards and spreading them simultaneously.
export const getGameField = (config: ConfigType) => {
  const order = getCellOrder(config);
  const gameFieldCells = getFieldCells(order, config);
  const filledWithCardsCells = spreadCards(gameFieldCells, config);
  const gameField = { order, values: filledWithCardsCells };
  return gameField;
};

/**
 * Creates an array with cell index order.
 */
const getCellOrder = (config: any): Array<string> => {
  const width = config.finishCoord.hor;
  const height = config.finishCoord.vert;

  let orderList: Array<string> = [];

  for (let hor = 0; hor <= width; hor++) {
    for (let vert = 0; vert <= height; vert++) {
      const index: string = `${hor}.${vert}`;
      orderList.push(index);
    }
  }

  return orderList;
};
