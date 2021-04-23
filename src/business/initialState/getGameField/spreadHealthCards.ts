import {
  CommonCell,
  GameFieldCells,
  HealthCardType,
  HealthCell,
} from "../../types";

import { AMOUNT_HEALTH_ITEMS } from "../../../shared/config";

/**
 * Returns an object in structure of FieldCells with spreaded healthCards in random picked cells.
 */
export const spreadHealthCards = (
  gameFieldCells: GameFieldCells
): GameFieldCells => {
  const cellsForCards = getListForCards(gameFieldCells);
  const filledWithCardsFieldCells = setHealthCards(
    cellsForCards,
    gameFieldCells
  );
  return filledWithCardsFieldCells;
};

/**
 *  Creates an object with spreaded healthCard into cells from cellsForCards.
 */
const setHealthCards = (
  cellList: [string, CommonCell][],
  gameFieldCells: GameFieldCells
): GameFieldCells => {
  const cellListWithCards = cellList.map(
    (cellWithCards: [string, CommonCell]) => {
      const [index, cell] = cellWithCards;

      const healthItem: HealthCardType = {
        name: "health",
        apperance: "closed",
      };

      const cellWithCard: HealthCell = {
        ...cell,
        cardItem: { ...cell.cardItem, healthItem },
      };
      return [index, cellWithCard];
    }
  );

  const fieldCellsWithCards = Object.fromEntries(cellListWithCards);
  const gameFieldFull = { ...gameFieldCells, ...fieldCellsWithCards };

  return gameFieldFull;
};

/**
 * Returns an array with random empty cell witch suitable for healthCard.
 * Array lenght is equal AMOUNT_HEALTH_ITEMS.
 */
const getListForCards = (gameField: GameFieldCells): [string, CommonCell][] => {
  const listGameField = Object.entries(gameField);

  const emptyCellsList = listGameField.filter((cellItem): cellItem is [
    string,
    CommonCell
  ] => {
    const [, item] = cellItem;
    return item.name === "commonCell";
  });

  const AMOUNT_EMPTY_CELLS = emptyCellsList.length;

  /**
   * Is a list with number of indexes of empty cells.
   */
  const keyList: Array<number> = new Array(AMOUNT_HEALTH_ITEMS)
    .fill(0)
    .reduce((prevkeyList) => {
      const randomNumber = getRandomNumber(prevkeyList, AMOUNT_EMPTY_CELLS);

      if (prevkeyList) {
        return [...prevkeyList, randomNumber];
      } else {
        return [randomNumber];
      }
    }, []);

  const listForCards = keyList.map((keyItem: number): [string, CommonCell] => {
    return emptyCellsList[keyItem];
  });

  return listForCards;
};

/**
 * Gets an array with the previously selected random numbers and the maximum number to select.
 * Returns a random number satisfying the conditions.
 */
const getRandomNumber = (
  arrNumber: Array<number>,
  maxNumber: number
): number => {
  const number = Math.floor(Math.random() * maxNumber);

  if (arrNumber) {
    return arrNumber.includes(number)
      ? getRandomNumber(arrNumber, maxNumber)
      : number;
  } else {
    return number;
  }
};
