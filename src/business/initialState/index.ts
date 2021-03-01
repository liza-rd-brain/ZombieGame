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
/* import {
  endCell,
  startCell,
  wallList,
  amountHealthItems,
  amountMen,
  initialManHealth,
} from "../../app"; */

//1.создаем пустую Map-у со стенами, стартом и финишем
//сначала ставим стены, потом рандомно раскладываем карточки здоровья

/** параметризируемые переменные  **/

export const startCell = { hor: 0, vert: 0 };
export const endCell = { hor: 9, vert: 9 };
export const initialManHealth = 3;
export const amountHealthItems = 30;
export const amountMen = 4;

export const wallList: Array<CoordItem> = [
  { hor: 2, vert: 2 },
  { hor: 3, vert: 2 },
  { hor: 4, vert: 2 },
  { hor: 2, vert: 3 },
  { hor: 4, vert: 3 },
  { hor: 2, vert: 4 },
  { hor: 3, vert: 4 },
  { hor: 4, vert: 4 },
];

export const healthItemTypeArr: HealthItemTypeArr = ["increment", "decrement"];

const createGameField = (number: number, endCell: CoordItem): any => {
  const width = endCell.hor;
  const height = endCell.vert;

  const emptyFieldItem: ObjFieldItem = {
    name: "field",
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
      const wallCell = wallList.find((item) => {
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

//2.раскладываем карточки здоровья
//изначально карточки лежат по одной на ячейке

const spreadCards = (initialField: GameList) => {
  const arrayGameField: [string, ObjCellType][] = Array.from(initialField);

  //emptyItems - пустые карточки
  const emptyItems: [string, ObjCellType][] = arrayGameField.filter(
    (innerArr) => {
      return innerArr.find((item) => {
        //только один объект в ячейке
        return item instanceof Object && item.name === "field";
      });
    }
  );

  const maxRandomNumber = emptyItems.length;

  const indexArray: Number[] = takeItemForCard(
    amountHealthItems,
    maxRandomNumber
  );

  function getRandomType(): HealthItemType {
    return healthItemTypeArr[Math.floor(Math.random() * 2)];
  }

  const itemsWithHealth = emptyItems.map((item, index) => {
    const cardWithHealth = indexArray.find((indexItem) => indexItem === index);
    //по этому приципу можно будет раскладывать и карточки противников!

    if (cardWithHealth) {
      //положить по этим ячейкам карточки здоровья
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
        return [index, healthCell] as [string, ObjCellType];
      } else return item;
    } else return item;
  });

  const fullGameField = [...arrayGameField, ...itemsWithHealth];

  const fullMapGameField = new Map(fullGameField);

  return fullMapGameField;

  function takeItemForCard(lenght: number, maxNumber: number): Number[] {
    //массив из 30 неповторяющихся индексов карточек
    return new Array(lenght).fill(0).reduce((prev, item) => {
      const number = getRandomNumber(prev);
      if (prev) {
        return [number, ...prev];
      } else return [number];

      function getRandomNumber(arr: Number[]): Number {
        const number = Math.floor(Math.random() * maxNumber);
        const repeat: Boolean =
          prev && prev.find((item: Number) => item === number) >= 0;
        if (repeat) {
          return getRandomNumber(prev);
        } else return number;
      }
    });
  }
};

const addMens = (fieild: GameList) => {
  fieild.forEach((item, index) => {
    /* const [index, value] = item; */
    if (item.name === "start") {
      const startCard: ObjCellType = {
        name: "field",
        cardItem: {
          manList: new Array(amountMen).fill(0).map((item, index) => {
            return {
              name: "man",
              health: initialManHealth,
              orderNumber: index,
            };
          }),
        },
      };
      fieild.set(index, startCard);
    } else return item;
  });
  console.log(fieild);
  return fieild;
};

const getGameList = (
  amountHealthItems: number,
  wallList: Array<CoordItem>,
  endCell: CoordItem
) => {
  const emptyGameField: GameList = createGameField(amountHealthItems, endCell);
  const filledCardsField: GameList = spreadCards(emptyGameField);
  const fullPreparedField = addMens(filledCardsField);
  return fullPreparedField;
};

const getInitialState = (): State => {
  return {
    gameState: { type: "waitingStart" },
    dice: 0,
    gameResult: "",
    cardInteractIndex: new Array(amountMen).fill(0).map((item, index) => {
      return `${startCell.hor}.${startCell.vert}`;
    }),
    GameList: getGameList(amountHealthItems, wallList, endCell),
    doEffect: null,
    numberOfMan: 0,
  };
};
export const initialState = getInitialState();
