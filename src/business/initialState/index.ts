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
} from "../types";

export const START_COORD = { hor: 0, vert: 0 };
export const END_COORD = { hor: 9, vert: 9 };
export const INITIAL_PLAYER_HEALTH = 3;
export const AMOUNT_HEALTH_ITEMS = 30;
export const AMOUNT_PLAYERS = 4;
export const WALL_LIST: Array<CoordItem> = [
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
  const width = END_COORD.hor;
  const height = END_COORD.vert;

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

// пересмотреть имя типа
type ObjField = { [key: string]: {} };

const createEmptyGameField = (cellList: Array<string>) => {
  const wallItem: WallItem = {
    name: "wall",
  };

  const emptyFieldItem: СommonCell = {
    name: "commonCell",
    cardItem: {},
  };
  let newEmptyGameField: ObjField = {};

  //
  cellList.map((cell: string) => {
    newEmptyGameField[cell] = emptyFieldItem;
  });
  return newEmptyGameField;
};

const getNewGameField = () => {
  const cellOrder = getCellOrder();
  const newEmptyGameField = createEmptyGameField(cellOrder);
  console.log(newEmptyGameField);
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

  const Start_Coord: StartCell = {
    name: "start",
    cardItem: {},
  };

  const emptyMap = new Map();

  for (let hor = 0; hor <= width; hor++) {
    for (let vert = 0; vert <= height; vert++) {
      const hasFinish = width === hor && height === vert;
      const hasStart = hor === 0 && vert === 0;
      const wallCell = WALL_LIST.find((item) => {
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
          emptyMap.set(`${hor}.${vert}`, Start_Coord);
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
    GameList: getGameList(AMOUNT_HEALTH_ITEMS, WALL_LIST, END_COORD),
    doEffect: null,
    numberOfPlayer: 0,
  };
};

export const initialState = getInitialState();
