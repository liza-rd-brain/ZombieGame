import {
  StartCell,
  CommonCell,
  FinishCell,
  WallItem,
  HealthItemType,
  GameValues,
  HealthCardType,
  HealthCell,
} from "../types";

import {
  FINISH_COORD,
  START_COORD,
  WALLS_COORD,
  HEALTH_ITEM_TYPE_ARR,
  AMOUNT_HEALTH_ITEMS,
} from "./index";

export const gameField = () => {
  /**
   * 1. getCellOrder создаст массив с порядком ячеек
   * 2. createEmptyGameValues вернет объект поле заполненное ключами и пустыми ячейками
   * 3. organizeGameValues вернет объеет поле со стартом, фишием, стенами
   * 4. spreadHealthCards вернет объеет поле с разложенными карточками здоровья
   *
   */
  const order = getCellOrder();
  const emptyGameValues = createEmptyGameValues(order);
  const organizedGameValues = organizeGameValues(emptyGameValues);
  const fullPreparedGameValues = spreadHealthCards(organizedGameValues);
  const gameField = { order, values: fullPreparedGameValues };
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

/**
 * Returns an object with spreaded healthCards in random picked cells.
 */
const spreadHealthCards = (gameValues: GameValues): GameValues => {
  const cellsForCards = getListForCards(gameValues);
  const filledWithCardsGameValues = setHealthCards(cellsForCards, gameValues);
  return filledWithCardsGameValues;
};

/**
 *  Creates an object with spreaded healthCard into cells from cellsForCards.
 */
const setHealthCards = (
  cellList: [string, CommonCell][],
  gameValues: GameValues
): GameValues => {
  const cellListWithCards = cellList.map(
    (cellWithCards: [string, CommonCell]) => {
      const [index, cell] = cellWithCards;

      const healthItem: HealthCardType = {
        name: "health",
        type: getRandomType(),
        apperance: "closed",
      };

      const cellWithCard: HealthCell = {
        ...cell,
        cardItem: { ...cell.cardItem, healthItem },
      };
      return [index, cellWithCard];
    }
  );

  const gameValuesWithCards = Object.fromEntries(cellListWithCards);
  const gameFieldFull = { ...gameValues, ...gameValuesWithCards };

  return gameFieldFull;
};

const getRandomType = (): HealthItemType => {
  return HEALTH_ITEM_TYPE_ARR[Math.floor(Math.random() * 2)];
};

/**
 * Returns an array with random empty cell witch suitable for healthCard.
 * Array lenght is equal AMOUNT_HEALTH_ITEMS.
 */
const getListForCards = (gameField: GameValues): [string, CommonCell][] => {
  const listGameField = Object.entries(gameField);
  const emptyCellsList = listGameField.filter((cellItem): cellItem is [
    string,
    CommonCell
  ] => {
    const [, item] = cellItem;
    return item.name === "commonCell";
  });

  const AMOUNT_EMPTY_CELLS = emptyCellsList.length;

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
