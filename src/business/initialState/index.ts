import {
  StartCell,
  HealthItemTypeArr,
  CoordItem,
  CommonCell,
  FinishCell,
  WallItem,
  HealthItemType,
  State,
  GameValues,
  HealthCardType,
  PlayersListType,
  HealthCell,
  EnemiesListType,
  EnemyCardType,
} from "../types";

export const START_COORD = { hor: 0, vert: 0 };
export const FINISH_COORD = { hor: 9, vert: 9 };
export const INITIAL_PLAYER_HEALTH = 3;
export const AMOUNT_HEALTH_ITEMS = /* 3;  */30;
export const AMOUNT_PLAYERS = 1; /* 6 */
export const AMOUNT_ENEMIES = 1;
export const WALLS_COORD: Array<CoordItem> = [
  { hor: 2, vert: 2 },
  { hor: 3, vert: 2 },
  { hor: 4, vert: 2 },
  { hor: 2, vert: 3 },
  { hor: 4, vert: 3 },
  { hor: 2, vert: 4 },
  { hor: 3, vert: 4 },
  { hor: 4, vert: 4 },
];
export const HEALTH_ITEM_TYPE_ARR: HealthItemTypeArr = [
  "increment",
  "decrement",
];

const enemies = {
  "0": {
    name: "enemy",
    power: 1,
    orderNumber: 0,
    coord: "1.1",
  },
};

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

const createEmptyGameField = (cellList: Array<string>): GameValues => {
  const emptyFieldItem: CommonCell = {
    name: "commonCell",
    cardItem: {},
  };

  let newEmptyGameField: GameValues = {};

  cellList.map((cell: string) => {
    newEmptyGameField[cell] = emptyFieldItem;
  });

  return newEmptyGameField;
};

const organizeGameField = (emptyField: GameValues): GameValues => {
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

  const organizedGameField = {
    ...emptyField,
    ...wallCells,
    [startIndex]: startCell,
    [finishIndex]: finishCell,
  };

  return organizedGameField;
};

const getRandomNumber = (
  arrNumber: Array<number>,
  maxNumber: number
): number => {
  const number = Math.floor(Math.random() * 90);

  if (arrNumber) {
    return arrNumber.includes(number)
      ? getRandomNumber(arrNumber, maxNumber)
      : number;
  } else {
    return number;
  }
};

const getListForCards = (gameField: GameValues): [string, CommonCell][] => {
  const listGameField = Object.entries(gameField);
  const emptyCellsList = listGameField.filter((cellItem): cellItem is [
    string,
    CommonCell
  ] => {
    const [index, item] = cellItem;
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

const setHealthCards = (
  cellList: [string, CommonCell][],
  gameField: GameValues
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

  const gameFieldWithCards = Object.fromEntries(cellListWithCards);
  const gameFieldFull = { ...gameField, ...gameFieldWithCards };

  return gameFieldFull;
};

const getRandomType = (): HealthItemType => {
  return HEALTH_ITEM_TYPE_ARR[Math.floor(Math.random() * 2)];
};

const spreadHealthCards = (gameField: GameValues): GameValues => {
  /**
   * 1. cellsForCards вернет список ячеек для карточек
   * 2. setHealthCardsразложим на них карточки здоровья
   */

  const cellsForCards = getListForCards(gameField);
  const filledGameField = setHealthCards(cellsForCards, gameField);
  return filledGameField;
};

const getNewGameField = () => {
  /**
   * 1. getCellOrder создаст массив с порядком ячеек
   * 2. createEmptyGameField вернет объект поле заполненное ключами и пустыми ячейками
   * 3. organizeGameField вернет объеет поле со стартом, фишием, стенами
   * 4. spreadHealthCards вернет объеет поле с разложенными карточками здоровья
   *
   */
  const order = getCellOrder();
  const newEmptyGameField = createEmptyGameField(order);
  const newOrganizedGameField = organizeGameField(newEmptyGameField);
  const fullPreparedGameField = spreadHealthCards(newOrganizedGameField);

  const gameFieldWithList = { order, values: fullPreparedGameField };
  return gameFieldWithList;
};

const getPlayers = (): PlayersListType => {
  const playersList = new Array(AMOUNT_PLAYERS).fill(0).map((player, index) => {
    const playerCard = {
      name: "player",
      health: INITIAL_PLAYER_HEALTH,
      orderNumber: index,
      coord: "0.0",
    };
    return [index, playerCard];
  });

  const playersObj: PlayersListType = Object.fromEntries(playersList);
  return playersObj;
};

const getEnemies = (): EnemiesListType => {
  //Добавить сначала рандомный массив с коорлинатами пустых ячеек
  const enemiesList = new Array(AMOUNT_ENEMIES).fill(0).map((enemy, index) => {
    const enemyCard = {
      name: "enemy",
      power: 1,
      coord: "1.1",
      apperance: "closed",
    };
    //ключ=координата
    return [enemyCard.coord, enemyCard];
  });

  const enemiesObj: EnemiesListType = Object.fromEntries(enemiesList);
  return enemiesObj;
};

const getInitialState = (): State => {
  return {
    gameState: { type: "waitingStart" },
    dice: 0,
    gameResult: "",
    playersList: getPlayers(),
    enemiesList: getEnemies(),
    gameField: getNewGameField(),
    doEffect: null,
    numberOfPlayer: 0,
  };
};

export const initialState = getInitialState();
