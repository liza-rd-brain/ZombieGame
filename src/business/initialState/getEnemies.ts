import { EnemyListType, GameField, CommonCell, ConfigType } from "../types";

/* import { AMOUNT_ENEMIES, CARD_APPERANCE } from "../../shared/config/devConfig";

 */ export const getEnemies = (
  gameField: GameField,
  config: ConfigType
): EnemyListType => {
  const emptyCellsList = getEmptyList(gameField);
  const enemiesCoords = getListOfIndexes(emptyCellsList, config);
  const enemiesObj = getListOfEnemy(enemiesCoords, config);
  return enemiesObj;
};

/**
 * For every element checks that cell has no cards on it.
 * Returns the list of cells without any cards.
 */
const getEmptyList = (gameField: GameField): [string, CommonCell][] => {
  const listCells = Object.entries(gameField.values);
  const emptyCellsList = listCells.filter(
    (cellItem): cellItem is [string, CommonCell] => {
      const [, item] = cellItem;
      return item.name === "commonCell" && item.cardItem.length === 0;
    }
  );
  return emptyCellsList;
};

/**
 * Returns the list of random picked indexes of emptyCellsList
 */
const getListOfIndexes = (
  emptyCellsList: [string, CommonCell][],
  config: ConfigType
) => {
  const AMOUNT_EMPTY_CELLS = emptyCellsList.length;

  // TODO: it may be taking out as separate module with getRandomNumber?
  const keyList: Array<number> = new Array(config.AMOUNT_ENEMIES)
    .fill(0)
    .reduce((prevkeyList) => {
      const randomNumber = getRandomNumber(prevkeyList, AMOUNT_EMPTY_CELLS);

      if (prevkeyList) {
        return [...prevkeyList, randomNumber];
      } else {
        return [randomNumber];
      }
    }, []);

  const idexesListForCards = keyList.map((keyItem: number): string => {
    const [index] = emptyCellsList[keyItem];
    return index;
  });

  return idexesListForCards;
};

/**
 * Returns the object of all enemies
 */
const getListOfEnemy = (enemiesCoords: string[], config: ConfigType) => {
  const enemyList = enemiesCoords.map((coord) => {
    const enemyCard = {
      name: "enemy",
      power: 1,
      coord: coord,
      apperance: config.CARD_APPERANCE,
    };
    return [enemyCard.coord, enemyCard];
  });

  const enemiesObj: EnemyListType = Object.fromEntries(enemyList);
  return enemiesObj;
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
