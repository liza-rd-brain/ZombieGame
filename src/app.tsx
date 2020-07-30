import React, { useEffect, useMemo, forwardRef } from "react";
import ReactDOM from "react-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { createStore, compose } from "redux";
import styled, { ThemeProvider } from "styled-components";

import Grid from "./features/Grid";
import Arrows from "./features/Arrows";
import Dice from "./features/Dice";
import StartScreen from "./features/StartScreen";
import EndScreen from "./features/EndScreen";

import waitingStartPhase from "./phases/waitingStart";
import trownDice from "./phases/gameStarted/trownDice";
import clickArrow from "./phases/gameStarted/clickArrow";
import openHealthCard, {
  getManHealth,
} from "./phases/gameStarted/openHealthCard";
import endGame from "./phases/endGame";

const Field = styled.div`
  position: relative;
  width: 300px;
  margin: 0 auto;
`;

const Game = styled.div`
  width: 500px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
`;

const LeftPanel = styled.div`
  width: 120px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  flex-grow: 0;
`;
const Status = styled.div`
  border: 1px dotted red;
  color: red;
  width: 150px;
  min-height: 18px;
`;

/** параметризируемые переменные  **/

export const StartCell = { hor: 0, vert: 0 };

export const EndCell = { hor: 3, vert: 3 };
const initialManHealth = 3;
const amountHealthItems = 3;

const wallList: Array<CoordItem> = [
  { hor: 2, vert: 2 },
  { hor: 3, vert: 2 },
  { hor: 4, vert: 2 },
  { hor: 2, vert: 3 },
  { hor: 4, vert: 3 },
  { hor: 2, vert: 4 },
  { hor: 3, vert: 4 },
  { hor: 4, vert: 4 },
];

/** объявление типов  **/
export type CoordItem = { hor: number; vert: number };

export type HealthItemType = "increment" | "decrement";

export type HealthItemTypeArr = ["increment", "decrement"];

export type MoveDirection = "top" | "bottom" | "left" | "right";

export type WallItem = {
  hor: number;
  vert: number;
  name: "wall";
};

export type ManItem = {
  name: "man";
  health: number;
};

export type FinishCell = {
  hor: number;
  vert: number;
  name: "finish";
};

export type HealthItem = {
  name: "health";
  type: HealthItemType;
  apperance: "closed" | "open";
};

export type CardInteract = ManItem | HealthItem;

export type FieldItem = {
  hor: number;
  vert: number;
  name: "field";
  cardItem: CardInteract[];
};

/*_____________________новые типы  для объекта начинаются с приписки Obj_______________________*/
export type ObjFieldItem = {
  hor: number;
  vert: number;
  name: "field";
  cardItem: { manItem?: ManItem; healthItem?: HealthItem };
};
export type ObjCellType = ObjFieldItem | WallItem | FinishCell;

export type ObjGameList = { [key: string]: ObjCellType /* number */ };

/*______________________________________________________________________________ */
export type CellType = FieldItem | WallItem | FinishCell;

export type GameList = CellType[][];

export type State = {
  gameState: GameState;
  dice: number;
  gameResult: "" | "Вы выиграли" | "Вы проиграли";
  gameList: GameList;
  cardInteractIndex: string;
  objGameList: ObjGameList;
};

export type ActionType =
  | { type: "clickStartButton" }
  | DiceThrownAction
  | ArrowPressAction
  | { type: "needOpenHealthCard" }
  | { type: "changeManHealth" }
  | { type: "changeHealthList" }
  | { type: "getEndScreen" };

export type GameState =
  | "waitingStart"
  | "gameStarted.trownDice"
  | "gameStarted.clickArrow"
  | "gameStarted.openHealthCard"
  | "endGame"
  | "getEndScreen";

export type ArrowPressAction = { type: "arrowPressed"; payload: MoveDirection };
export type DiceThrownAction = { type: "diceThrown"; payload: number };
export const healthItemTypeArr: HealthItemTypeArr = ["increment", "decrement"];

const getRandomHealthItem = (arr: Array<FieldItem>): FieldItem => {
  const hor = Math.floor(Math.random() * (EndCell.hor + 1));
  const vert = Math.floor(Math.random() * (EndCell.vert + 1));
  const randomType: HealthItemType =
    healthItemTypeArr[Math.floor(Math.random() * 2)];

  const crossStartCell = StartCell.hor === hor && StartCell.vert === vert;
  const wallCell = wallList.find((item) => {
    return item && item.hor === hor && item.vert === vert;
  });

  const crossWall = wallCell ? true : false;

  const hasIntersection = crossWall || crossStartCell;

  const healthRepetition = arr.find((item) => {
    return item && item.hor === hor && item.vert === vert;
  });

  const hasHealthRepitition = healthRepetition
    ? healthRepetition.hor === hor && healthRepetition.vert === vert
    : false;
  const firstElement = arr.length === 0;

  switch (true) {
    case hasIntersection: {
      return getRandomHealthItem(arr);
    }
    case !crossStartCell: {
      switch (true) {
        case firstElement: {
          return {
            hor: hor,
            vert: vert,
            name: "field",
            cardItem: [
              { name: "health", type: randomType, apperance: "closed" },
            ],
          };
        }
        case !hasHealthRepitition: {
          return {
            hor: hor,
            vert: vert,
            name: "field",
            cardItem: [
              { name: "health", type: randomType, apperance: "closed" },
            ],
          };
        }
        case hasHealthRepitition: {
          return getRandomHealthItem(arr);
        }
      }
    }
    default:
      return getRandomHealthItem(arr);
  }
};

const getRandomHealthItemObj = (arr: Array<FieldItem>): ObjFieldItem => {
  const hor = Math.floor(Math.random() * (EndCell.hor + 1));
  const vert = Math.floor(Math.random() * (EndCell.vert + 1));
  const randomType: HealthItemType =
    healthItemTypeArr[Math.floor(Math.random() * 2)];

  const crossStartCell = StartCell.hor === hor && StartCell.vert === vert;
  const wallCell = wallList.find((item) => {
    return item && item.hor === hor && item.vert === vert;
  });

  const crossWall = wallCell ? true : false;

  const hasIntersection = crossWall || crossStartCell;

  const healthRepetition = arr.find((item) => {
    return item && item.hor === hor && item.vert === vert;
  });

  const hasHealthRepitition = healthRepetition
    ? healthRepetition.hor === hor && healthRepetition.vert === vert
    : false;
  const firstElement = arr.length === 0;

  switch (true) {
    case hasIntersection: {
      return getRandomHealthItemObj(arr);
    }
    case !crossStartCell: {
      switch (true) {
        case firstElement: {
          return {
            hor: hor,
            vert: vert,
            name: "field",
            cardItem: {
              healthItem: {
                name: "health",
                type: randomType,
                apperance: "closed",
              },
            },

            /* cardItem: [
              { name: "health", type: randomType, apperance: "closed" },
            ], */
          };
        }
        case !hasHealthRepitition: {
          return {
            hor: hor,
            vert: vert,
            name: "field",
            cardItem: {
              healthItem: {
                name: "health",
                type: randomType,
                apperance: "closed",
              },
            },
          };
        }
        case hasHealthRepitition: {
          return getRandomHealthItemObj(arr);
        }
      }
    }
    default:
      return getRandomHealthItemObj(arr);
  }
};

const createHealthArray = (number: number) => {
  let healthArray = new Array(number).fill(0).reduce((prevValue) => {
    const currValue = getRandomHealthItem(prevValue);
    return [currValue, ...prevValue];
  }, []);
  console.log(healthArray);
  return healthArray;
};

const createHealthArrayObj = (number: number) => {
  let healthArray = new Array(number).fill(0).reduce((prevValue) => {
    const currValue = getRandomHealthItemObj(prevValue);
    return [currValue, ...prevValue];
  }, []);
  console.log(healthArray);
  return healthArray;
};

const getObjGameList = (
  amountHealthItems: number,
  wallList: Array<CoordItem>,
  endCell: CoordItem
) => {
  const width = EndCell.hor; /* + 1 */
  const height = EndCell.vert; /* + 1 */

  const healthList: Array<ObjFieldItem> = createHealthArrayObj(
    amountHealthItems
  );

  const gameArray: ObjGameList = {};

  for (let vert = 0; vert <= height; vert++) {
    for (let hor = 0; hor <= width; hor++) {
      const hasMan = StartCell.hor === hor && StartCell.vert === vert;
      const hasFinish = EndCell.hor === hor && EndCell.vert === vert;

      const health = healthList.find((item, index) => {
        return item.hor === hor && item.vert === vert;
      });

      const hasHealth = health ? true : false;
      const hasManAndHealth = hasHealth && hasMan;

      const wallCell = wallList.find((item) => {
        return item.hor === hor && item.vert === vert;
      });
      const hasWall = wallCell ? true : false;

      const emptyObjFieldItem: ObjFieldItem = {
        hor: hor,
        vert: vert,
        name: "field",
        cardItem: {},
      };

      const getCell = () => {
        switch (true) {
          case hasWall: {
            const wallItem: WallItem = {
              hor: hor,
              vert: vert,
              name: "wall",
            };
            return wallItem;
          }
          case !hasWall: {
            switch (true) {
              case hasFinish: {
                const finishCell: FinishCell = {
                  hor: hor,
                  vert: vert,
                  name: "finish",
                };
                return finishCell;
              }
              case hasManAndHealth: {
                if (health != undefined) {
                  const fieldItem: ObjFieldItem = {
                    ...health,
                    cardItem: {
                      manItem: {
                        name: "man",
                        health: initialManHealth,
                      },
                      healthItem: health.cardItem.healthItem,
                    },
                  };
                  return fieldItem;
                } else return emptyObjFieldItem;
              }
              case hasHealth: {
                if (health != undefined) {
                  return health;
                } else return emptyObjFieldItem;
              }
              case hasMan: {
                const fieldItem: ObjFieldItem = {
                  hor: hor,
                  vert: vert,
                  name: "field",
                  cardItem: {
                    manItem: { name: "man", health: initialManHealth },
                  },
                };
                return fieldItem;
              }

              default:
                return emptyObjFieldItem;
            }
          }
          default:
            return emptyObjFieldItem;
        }
      };
      /*для каждого индеккса вызываем функцию
       */

      gameArray[`${hor}${vert}`] = getCell();
    }
  }
  console.log("gameArray:", gameArray);
  return gameArray;
};

const getGameList = (
  amountHealthItems: number,
  wallList: Array<CoordItem>,
  endCell: CoordItem
): GameList => {
  const width = endCell.hor + 1;
  const height = endCell.vert + 1;

  const healthList: Array<FieldItem> = createHealthArray(amountHealthItems);

  const gameArray = new Array(height).fill(0).map((itemVert, hor) =>
    new Array(width).fill({}).map((itemHor, vert) => {
      const hasMan = StartCell.hor === hor && StartCell.vert === vert;
      const hasFinish = EndCell.hor === hor && EndCell.vert === vert;

      const health = healthList.find((item, index) => {
        return item.hor === hor && item.vert === vert;
      });

      const hasHealth = health ? true : false;
      const hasManAndHealth = hasHealth && hasMan;

      const wallCell = wallList.find((item) => {
        return item.hor === hor && item.vert === vert;
      });

      const hasWall = wallCell ? true : false;

      const emptyFieldItem: FieldItem = {
        hor: hor,
        vert: vert,
        name: "field",
        cardItem: [],
      };

      switch (true) {
        case hasWall: {
          const wallItem: WallItem = {
            hor: hor,
            vert: vert,
            name: "wall",
          };
          return wallItem;
        }
        case !hasWall: {
          switch (true) {
            case hasManAndHealth: {
              if (health != undefined) {
                const fieldItem: FieldItem = {
                  ...health,
                  cardItem: [
                    ...health.cardItem,
                    { name: "man", health: initialManHealth },
                  ],
                };
                return fieldItem;
              } else return emptyFieldItem;
            }
            case hasMan: {
              const fieldItem: FieldItem = {
                hor: hor,
                vert: vert,
                name: "field",
                cardItem: [{ name: "man", health: initialManHealth }],
              };
              return fieldItem;
            }
            case hasFinish: {
              const finishCell: FinishCell = {
                hor: hor,
                vert: vert,
                name: "finish",
              };
              return finishCell;
            }
            case hasHealth: {
              if (health != undefined) {
                return health;
              } else return emptyFieldItem;
            }
            default:
              return emptyFieldItem;
          }
        }
        default:
          return emptyFieldItem;
      }
    })
  );

  return gameArray;
};

const getIndexWithMan = (gameList: GameList) => {
  const index = gameList
    .flat()
    .findIndex((item, index) => {
      switch (item.name) {
        case "field": {
          return item.cardItem.find((item, index) => item.name === "man");
        }
        default:
          return null;
      }
    })
    .toString();
  if (index === "0") {
    return "00";
  } else return index;
};

const initialGameList = getGameList(amountHealthItems, wallList, EndCell);

const initialObjGameList = getObjGameList(amountHealthItems, wallList, EndCell);

const indexWithMan = getIndexWithMan(initialGameList);
/* console.log(indexWithMan);
console.log(initialGameList.flat()); */

const getInitialState = (): State => {
  return {
    gameState: "waitingStart",
    dice: 0,
    gameList: initialGameList,
    gameResult: "",
    cardInteractIndex: indexWithMan,
    objGameList: initialObjGameList,
  };
};

const reducer = (state = getInitialState(), action: ActionType): State => {
  const [phaseOuter, phaseInner] = state.gameState.split(".");

  switch (phaseOuter) {
    case "waitingStart": {
      return waitingStartPhase(action, state);
    }

    case "gameStarted": {
      switch (phaseInner) {
        case "trownDice": {
          return trownDice(action, state);
        }

        case "clickArrow": {
          return clickArrow(action, state);
        }

        case "openHealthCard": {
          return openHealthCard(action, state);
        }
        default:
          return state;
      }
    }

    case "endGame": {
      endGame(action, state);
    }
    default:
      return state;
  }
};

function App() {
  const [
    gameState,
    gameResult,
    gameList,
    cardInteractIndex,
  ] = useSelector((state: State) => [
    state.gameState,

    state.gameResult,
    state.gameList,
    state.cardInteractIndex,
  ]);

  const dispatch = useDispatch();
  const textPhase = () => {
    switch (gameState) {
      case "gameStarted.trownDice":
        return "бросить кубик";
      case "gameStarted.clickArrow":
        return "сделать ход";
      case "gameStarted.openHealthCard":
        return "открываем карточку";
      case "endGame":
        return gameResult;
      default:
        return " ";
    }
  };

  useEffect(
    function openCard() {
      switch (gameState) {
        case "gameStarted.openHealthCard": {
          const timerOpen = setTimeout(
            () =>
              dispatch({
                type: "needOpenHealthCard",
              }),
            1000
          );
          const timerChangeManHealth = setTimeout(
            () =>
              dispatch({
                type: "changeManHealth",
              }),
            1500
          );
          const timerChangeHealthList = setTimeout(
            () =>
              dispatch({
                type: "changeHealthList",
              }),
            2000
          );
          return (): void => {
            clearTimeout(timerOpen),
              clearTimeout(timerChangeManHealth),
              clearTimeout(timerChangeHealthList);
          };
        }
        default:
          break;
      }
    },
    [gameState]
  );

  useEffect(
    function getEndScreen() {
      switch (gameState) {
        case "endGame":
          const timer = setTimeout(
            () => dispatch({ type: "getEndScreen" }),
            1000
          );

          return () => clearTimeout(timer);

        default:
          break;
      }
    },
    [gameState]
  );

  const getGameScreen = () => {
    switch (gameState) {
      case "waitingStart":
        return <StartScreen />;

      case "getEndScreen":
        return <EndScreen />;

      default:
        return (
          <>
            <Field>
              <Grid />
            </Field>
            <LeftPanel>
              {/* <Status>{textPhase()}</Status>
              <Status>{`здоровье: ${getManHealth(
                gameList,
                cardInteractIndex
              )}`}</Status> */}
              {/*   <Status>{`координаты: ${manHor}${manVert}`}</Status>
              <Status>{`здоровье: ${manHealth}`}</Status> */}

              <Dice />
              <Arrows />
            </LeftPanel>
          </>
        );
    }
  };

  return <Game>{getGameScreen()}</Game>;
}

const store = createStore(
  reducer,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector("#root")
);
