import { EnemiesListType, GameField, CommonCell } from "../types";

import { AMOUNT_ENEMIES } from "../../shared/config";

export const getEnemies = (gameField: GameField): EnemiesListType => {
  //Добавить сначала рандомный массив с координатами пустых ячеек

  const enemiesCoords = getEnemiesCoord(gameField);
  console.log("enemiesCoords", enemiesCoords);

  const enemiesList = enemiesCoords.map((coord) => {
    const enemyCard = {
      name: "enemy",
      power: 1,
      coord: coord,
      apperance: "open",
    };
    return [enemyCard.coord, enemyCard];
  });
  const enemiesObj: EnemiesListType = Object.fromEntries(enemiesList);
  return enemiesObj;
};



/**
 * 1. Get list of indexes all of  empty cells
 */
const getEnemiesCoord = (gameField: GameField) => {
  const listFieldCells = Object.entries(gameField.values);

  const emptyCellsList = listFieldCells.filter((cellItem): cellItem is [
    string,
    CommonCell
  ] => {
    const [, item] = cellItem;
    //check that cardItem is empty
    return (
      item.name === "commonCell" && Object.entries(item.cardItem).length === 0
    );
  });

  const AMOUNT_EMPTY_CELLS = emptyCellsList.length;
  console.log("emptyCellsList", emptyCellsList);

  // TODO: it's also can be common module
  const keyList: Array<number> = new Array(AMOUNT_ENEMIES)
    .fill(0)
    .reduce((prevkeyList) => {
      const randomNumber = getRandomNumber(prevkeyList, AMOUNT_EMPTY_CELLS);

      if (prevkeyList) {
        return [...prevkeyList, randomNumber];
      } else {
        return [randomNumber];
      }
    }, []);

  console.log("keyList", keyList);

  const idexesListForCards = keyList.map((keyItem: number): string => {
    const [index] = emptyCellsList[keyItem];
    return index;
  });

  console.log("listForCards", idexesListForCards);
  return idexesListForCards;
};

// TODO: take out as separete module
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
