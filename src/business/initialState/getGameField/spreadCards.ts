import { CommonCell, GameFieldCells, CardItem } from "../../types";

import {
  AMOUNT_HEALTH_ITEMS,
  AMOUNT_BOARDS_ITEMS,
  APPERANCE_CARD,
} from "../../../shared/config";

type CardSet = {
  card: CardItem;
  amount: number;
};

const cardsList: CardSet[] = [
  {
    card: {
      name: "health",
      apperance: APPERANCE_CARD,
    },
    amount: AMOUNT_HEALTH_ITEMS,
  },
  {
    card: {
      name: "boards",
      apperance: APPERANCE_CARD,
    },
    amount: AMOUNT_BOARDS_ITEMS,
  },
];

/**
 * Returns an object in structure of FieldCells with spreaded cards in random picked cells.
 */
export const spreadCards = (gameFieldCells: GameFieldCells): GameFieldCells => {
  /**
   * filledСells - its object with filling cells
   * currCardSet -curr set of cards
   * from cardset making object with cards
   */
  const cellsWithAllCards = cardsList.reduce((filledСells, currCardSet) => {
    const gameFieldCellsWithPrevios = { ...gameFieldCells, ...filledСells };

    const cellsForCards = getListForCards(
      gameFieldCellsWithPrevios,
      filledСells,
      currCardSet
    );

    /**
     * Adding filled with previos cardSet cells
     */
    const filledWithCardsFieldCells = setCards(cellsForCards, currCardSet);
    const filledWithAllCardsCells = {
      ...filledСells,
      ...filledWithCardsFieldCells,
    };
    return filledWithAllCardsCells;
  }, {});

  const gameFieldFull = { ...gameFieldCells, ...cellsWithAllCards };
  return gameFieldFull;
};

/**
 *  Creates an object with spreaded cards into cells from cellsForCards.
 */
const setCards = (
  cellList: [string, CommonCell][],
  currCardSet: CardSet
): GameFieldCells => {
  const cellListWithCards = cellList.map(
    (cellWithCards: [string, CommonCell]) => {
      const [index, cell] = cellWithCards;

      const cellWithCard: CommonCell = {
        ...cell,
        cardItem: [currCardSet.card],
      };
      return [index, cellWithCard];
    }
  );

  const fieldCellsWithCards = Object.fromEntries(cellListWithCards);

  return fieldCellsWithCards;
};

/**
 * Returns an array with random empty cell witch suitable for healthCard.
 * Array lenght is equal AMOUNT_..._ITEMS.
 */
const getListForCards = (
  gameField: GameFieldCells,
  filledСells: GameFieldCells,
  currCardSet: CardSet
): [string, CommonCell][] => {
  const listGameField = Object.entries(gameField);

  /**
   * This array contains only empty cells
   */
  const emptyCellsList = listGameField.filter((cellItem): cellItem is [
    string,
    CommonCell
  ] => {
    const [, item] = cellItem;

    return item.name === "commonCell" && item.cardItem.length === 0;
  });

  const AMOUNT_EMPTY_CELLS = emptyCellsList.length;
  const amoutCurrentCards = currCardSet.amount;

  /**
   * Is a list with number of indexes of empty cells.
   */
  const keyList: Array<number> = new Array(amoutCurrentCards)
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
