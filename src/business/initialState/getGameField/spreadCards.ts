import { CommonCell, GameFieldCells, CardItem, ConfigType } from "../../types";
/* 
import {
 amountHealthItems,
  amountBoardsItems,
  cardApperance,
  amountWeaponsItems,
} from "../../../shared/config/devConfig";
 */
type CardSet = {
  card: CardItem;
  amount: number;
};

const getCardList = (config: ConfigType): CardSet[] => {
  return [
    {
      card: {
        name: "health",
        apperance: config.cardApperance,
      },
      amount: config.amountHealthItems,
    },
    {
      card: {
        name: "boards",
        apperance: config.cardApperance,
      },
      amount: config.amountBoardsItems,
    },
    {
      card: {
        name: "weapon",
        apperance: config.cardApperance,
      },
      amount: config.amountWeaponsItems,
    },
  ];
};
/**
 * Returns an object in structure of FieldCells with spreaded cards in random picked cells.
 */
export const spreadCards = (
  gameFieldCells: GameFieldCells,
  config: ConfigType
): GameFieldCells => {
  /**
   * filledСells - its object with filling cells
   * currCardSet -curr set of cards
   * from cardset making object with cards
   */

  const cardsList = getCardList(config);
  const cellsWithAllCards = cardsList.reduce((filledСells, currCardSet) => {
    const gameFieldCellsWithPrevios = { ...gameFieldCells, ...filledСells };

    const cellsForCards = getListForCards(
      gameFieldCellsWithPrevios,
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
 * Returns an array with random empty cell witch suitable for card.
 * Array lenght is equal AMOUNT_..._ITEMS.
 */
const getListForCards = (
  gameField: GameFieldCells,
  currCardSet: CardSet
): [string, CommonCell][] => {
  const listGameField = Object.entries(gameField);

  /**
   * This array contains only empty cells
   */

  const emptyCellsList = listGameField.filter(
    (cellItem): cellItem is [string, CommonCell] => {
      const [, item] = cellItem;

      return item.name === "commonCell" && item.cardItem.length === 0;
    }
  );

  const AMOUNT_EMPTY_CELLS = emptyCellsList.length;
  const amoutCurrentCards = currCardSet.amount;

  const canSetAllCards = amoutCurrentCards < AMOUNT_EMPTY_CELLS;
  const remainingAmountCards = AMOUNT_EMPTY_CELLS;

  const afforableAmountCards = canSetAllCards
    ? amoutCurrentCards
    : remainingAmountCards;

  if (!canSetAllCards) {
    const cardName = currCardSet.card?.name;
    console.error(`Cards "${cardName}" more than empty cell.`);
  }

  /**
   * Is a list with number of indexes of empty cells.
   */
  const keyList: Array<number> = new Array(afforableAmountCards)
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
