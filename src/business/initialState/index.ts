import {
  StartCell,
  HealthItemTypeArr,
  CoordItem,
  СommonCell,
  FinishCell,
  WallItem,
  GameList,
  CellType,
  HealthItemType,
  State,
  GameField,
} from "../types";

export const START_COORD = { hor: 0, vert: 0 };
export const FINISH_COORD = { hor: 9, vert: 9 };
export const INITIAL_PLAYER_HEALTH = 3;
export const AMOUNT_HEALTH_ITEMS = 30;
export const AMOUNT_PLAYERS = 4;
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

/**
 * 1.@cellOrder cначала нарисовать массив с порядком ячеек
 * 2.@cellValues затем пройтись по объекту и заполнить его ключами
 * так же можно сразу добавить стартовую, финишную клетку и стены
 */

const newGameField = {
  cellOrder: ["0.0", "0.1"],
  cellValues: {
    "0.0": {},
    "0.1": {},
  },
};

const getCellOrder = () => {
  const width = FINISH_COORD.hor;
  const height = FINISH_COORD.vert;

  // TODO: нужно выносить в отдельный тип-?!
  let orderList: Array<string> = [];

  for (let hor = 0; hor <= width; hor++) {
    for (let vert = 0; vert <= height; vert++) {
      const index: string = `${hor}.${vert}`;
      orderList.push(index);
    }
  }
  return orderList;
};

const createEmptyGameField = (cellList: Array<string>): GameField => {
  const emptyFieldItem: СommonCell = {
    name: "commonCell",
    cardItem: {},
  };

  let newEmptyGameField: GameField = {};
  cellList.map((cell: string) => {
    newEmptyGameField[cell] = emptyFieldItem;
  });

  return newEmptyGameField;
};

const organizeGameField = (emptyField: GameField): GameField => {
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

  // Object.fromEntries удобно использовать для наглядности
  // чтобы ни непонятно откуда была мутация
  // а прозрачное изменение св-в объекта
  const wallCells = Object.fromEntries(wallList);

  const organizedGameField = {
    ...emptyField,
    ...wallCells,
    [startIndex]: startCell,
    [finishIndex]: finishCell,
  };

  return organizedGameField;
};

const getRandomNumber = (arrNumber: Array<number>): number => {
  const number = Math.floor(Math.random() * 30);

  if (arrNumber) {
    return arrNumber.includes(number) ? getRandomNumber(arrNumber) : number;
  } else {
    return number;
  }
};

const getCellForCards = (cellList: Array<string>) => {
  const keyList = new Array(30).fill(0).reduce((prev) => {
    const index = getRandomNumber(prev);
    if (prev) {
      return [...prev, index];
    } else return [index];
  });

  const cellForCards = keyList.map((keyItem: number) => {
    return cellList[keyItem];
  });

  return cellForCards;
};

const spreadHealthCards = (
  gameField: GameField,
  cellOrder: Array<string>
) /* : GameField  */ => {
  /**
   * 1. @emptyCell сначала выберем индексы пустых ячеек
   * 2. @getCellForCards выберем n-неповторяющихся ячеек
   * 3. разложим на них карточки здоровья
   */

  const emptyCell = cellOrder.filter((cellIndex) => {
    return gameField[cellIndex].name === "commonCell";
  });
  console.log(emptyCell);
  const cellsForCards = getCellForCards(emptyCell);
  console.log(cellsForCards);
};

const getNewGameField = () => {
  /**
   * 1. @getCellOrder создаст массив с порядком ячеек
   * 2. @createEmptyGameField вернет объект поле заполненное ключами и пустыми ячейками
   * 3. @organizeGameField вернет объеет поле со стартом, фишием, стенами
   * 4. @spreadHealthCards вернет объеет поле с разложенными карточками здоровья
   */
  const cellOrder = getCellOrder();

  const newEmptyGameField = createEmptyGameField(cellOrder);
  const newOrganizedGameField = organizeGameField(newEmptyGameField);
  const healthCardsField = spreadHealthCards(newOrganizedGameField, cellOrder);
  /* console.log(cellOrder); */
};

getNewGameField();

const createGameField = (End_Coord: CoordItem): any => {
  const width = End_Coord.hor;
  const height = End_Coord.vert;

  const emptyFieldItem: СommonCell = {
    name: "commonCell",
    cardItem: {},
  };

  const finishCell: FinishCell = {
    name: "finish",
    cardItem: {},
  };

  const startCell: StartCell = {
    name: "start",
    cardItem: {},
  };

  const emptyMap = new Map();

  for (let hor = 0; hor <= width; hor++) {
    for (let vert = 0; vert <= height; vert++) {
      const hasFinish = width === hor && height === vert;
      const hasStart = hor === 0 && vert === 0;
      const wallCell = WALLS_COORD.find((item) => {
        return item.hor === hor && item.vert === vert;
      });
      const hasWall = wallCell ? true : false;
      switch (true) {
        case hasWall: {
          const wallItem: WallItem = {
            name: "wall",
          };
          emptyMap.set(`${hor}.${vert}`, wallItem);
          break;
        }

        case hasFinish: {
          emptyMap.set(`${hor}.${vert}`, finishCell);
          break;
        }

        case hasStart: {
          emptyMap.set(`${hor}.${vert}`, startCell);
          break;
        }

        default:
          emptyMap.set(`${hor}.${vert}`, emptyFieldItem);
      }
    }
  }

  return emptyMap;
};

const takeItemForCard = (lenght: number, maxNumber: number): Number[] => {
  //TODO: разобраться с комментарием ниже
  //массив из 30 неповторяющихся индексов карточек
  return new Array(lenght).fill(0).reduce((prev, item) => {
    const number = getRandomNumber(prev);
    if (prev) {
      return [number, ...prev];
    } else {
      return [number];
    }

    function getRandomNumber(arr: Number[]): Number {
      const number = Math.floor(Math.random() * maxNumber);
      const repeat: Boolean =
        prev && prev.find((item: Number) => item === number) >= 0;
      if (repeat) {
        return getRandomNumber(prev);
      } else {
        return number;
      }
    }
  });
};

const spreadCards = (initialField: GameList) => {
  const arrayGameField: [string, CellType][] = Array.from(initialField);
  const emptyItems: [string, CellType][] = arrayGameField.filter((innerArr) => {
    return innerArr.find((cell) => {
      //только один объект в ячейке
      return cell instanceof Object && cell.name === "commonCell";
    });
  });

  const maxRandomNumber = emptyItems.length;

  const indexArray: Number[] = takeItemForCard(
    AMOUNT_HEALTH_ITEMS,
    maxRandomNumber
  );

  function getRandomType(): HealthItemType {
    return HEALTH_ITEM_TYPE_ARR[Math.floor(Math.random() * 2)];
  }

  const itemsWithHealth = emptyItems.map((item, index) => {
    const cardWithHealth = indexArray.find((indexItem) => indexItem === index);

    if (cardWithHealth) {
      const [index, value] = item;

      if (value.name === "commonCell") {
        const healthCell: CellType = {
          ...value,
          cardItem: {
            ...value.cardItem,
            healthItem: {
              name: "health",
              type: getRandomType(),
              apperance: "closed",
            },
          },
        };
        // TODO: assertion будет исправлен с заменой структуры GameField на объект
        return [index, healthCell] as [string, CellType];
      } else {
        return item;
      }
    } else {
      return item;
    }
  });

  const fullGameField = [...arrayGameField, ...itemsWithHealth];
  const fullMapGameField = new Map(fullGameField);
  return fullMapGameField;
};

const addPlayerCards = (fieild: GameList) => {
  const startIndex = `${START_COORD.hor}.${START_COORD.vert}`;
  const startCard: CellType = {
    name: "commonCell",
    cardItem: {
      playerList: new Array(AMOUNT_PLAYERS).fill(0).map((item, index) => {
        return {
          name: "player",
          health: INITIAL_PLAYER_HEALTH,
          orderNumber: index,
        };
      }),
    },
  };

  fieild.set(startIndex, startCard);
  return fieild;
};

const getGameList = (
  Amount_Health_Items: number,
  Wall_List: Array<CoordItem>,
  End_Coord: CoordItem
) => {
  /**
   *1. @createGameField создаст пустую Map со стенами, стартом, финишем
   *2. @spreadCards  вернет Map c разложенными карточками здоровья
   *3. @addPlayerCards возвращает Map c карточками игроков на стартовой позиции
   */

  const emptyGameField: GameList = createGameField(End_Coord);
  const filledCardsField: GameList = spreadCards(emptyGameField);
  const fullPreparedField = addPlayerCards(filledCardsField);
  return fullPreparedField;
};

const getInitialState = (): State => {
  return {
    gameState: { type: "waitingStart" },
    dice: 0,
    gameResult: "",
    cardInteractIndex: new Array(AMOUNT_PLAYERS).fill(0).map(() => {
      return `${START_COORD.hor}.${START_COORD.vert}`;
    }),
    GameList: getGameList(AMOUNT_HEALTH_ITEMS, WALLS_COORD, FINISH_COORD),
    doEffect: null,
    numberOfPlayer: 0,
  };
};

export const initialState = getInitialState();
