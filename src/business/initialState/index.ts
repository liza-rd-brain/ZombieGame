import {
  StartCell,
  HealthItemTypeArr,
  CoordItem,
  ObjFieldItem,
  FinishCell,
  WallItem,
  GameList,
  ObjCellType,
  HealthItemType,
  State,
} from "../types";

export const Start_Coord = { hor: 0, vert: 0 };
export const End_Coord = { hor: 9, vert: 9 };
export const Initial_Player_Health = 3;
export const Amount_Health_Items = 30;
export const Amount_Players = 4;
export const Wall_List: Array<CoordItem> = [
  { hor: 2, vert: 2 },
  { hor: 3, vert: 2 },
  { hor: 4, vert: 2 },
  { hor: 2, vert: 3 },
  { hor: 4, vert: 3 },
  { hor: 2, vert: 4 },
  { hor: 3, vert: 4 },
  { hor: 4, vert: 4 },
];
export const Health_Item_Type_Arr: HealthItemTypeArr = [
  "increment",
  "decrement",
];

const createGameField = (number: number, End_Coord: CoordItem): any => {
  const width = End_Coord.hor;
  const height = End_Coord.vert;

  const emptyFieldItem: ObjFieldItem = {
    name: "field",
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
      const wallCell = Wall_List.find((item) => {
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
  const arrayGameField: [string, ObjCellType][] = Array.from(initialField);
  const emptyItems: [string, ObjCellType][] = arrayGameField.filter(
    (innerArr) => {
      return innerArr.find((cell) => {
        //только один объект в ячейке
        return cell instanceof Object && cell.name === "field";
      });
    }
  );

  const maxRandomNumber = emptyItems.length;

  const indexArray: Number[] = takeItemForCard(
    Amount_Health_Items,
    maxRandomNumber
  );

  function getRandomType(): HealthItemType {
    return Health_Item_Type_Arr[Math.floor(Math.random() * 2)];
  }

  const itemsWithHealth = emptyItems.map((item, index) => {
    const cardWithHealth = indexArray.find((indexItem) => indexItem === index);

    if (cardWithHealth) {
      const [index, value] = item;

      if (value.name === "field") {
        const healthCell: ObjCellType = {
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
        return [index, healthCell] as [string, ObjCellType];
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
  const startIndex = `${Start_Coord.hor}.${Start_Coord.vert}`;
  const startCard: ObjCellType = {
    name: "field",
    cardItem: {
      playerList: new Array(Amount_Players).fill(0).map((item, index) => {
        return {
          name: "player",
          health: Initial_Player_Health,
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

  const emptyGameField: GameList = createGameField(
    Amount_Health_Items,
    End_Coord
  );
  const filledCardsField: GameList = spreadCards(emptyGameField);
  const fullPreparedField = addPlayerCards(filledCardsField);
  return fullPreparedField;
};

const getInitialState = (): State => {
  return {
    gameState: { type: "waitingStart" },
    dice: 0,
    gameResult: "",
    cardInteractIndex: new Array(Amount_Players).fill(0).map(() => {
      return `${Start_Coord.hor}.${Start_Coord.vert}`;
    }),
    GameList: getGameList(Amount_Health_Items, Wall_List, End_Coord),
    doEffect: null,
    numberOfPlayer: 0,
  };
};

export const initialState = getInitialState();
