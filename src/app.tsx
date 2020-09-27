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
export const EndCell = { hor: 9, vert: 9 };
const initialManHealth = 3;
const amountHealthItems = 30;

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
  name: "wall";
};

export type ManItem = {
  name: "man";
  health: number;
};

export type FinishCell = {
  name: "finish";
  cardItem: { manItem?: ManItem };
};

export type HealthItem = {
  name: "health";
  type: HealthItemType;
  apperance: "closed" | "open";
};

export type CardInteract = ManItem | HealthItem;

/*нужен для рисования массива здоровья */
export type FieldItem = {
  hor: number;
  vert: number;
  name: "field";
  cardItem: CardInteract[];
};

export type ObjHealthItem = {
  hor: number;
  vert: number;
  name: "field";
  cardItem: { healthItem: HealthItem };
};

export type ObjFieldItem = {
  name: "field";
  cardItem: { manItem?: ManItem; healthItem?: HealthItem };
};
export type ObjCellType = ObjFieldItem | WallItem | FinishCell;

export type GameList = Map<string, ObjCellType>;

export type TypeEffect =
  | { type: "!needOpenHealthCard" }
  | { type: "!changeManHealth" }
  | { type: "!changeHealthList" }
  | null;

export type State = {
  gameState: GameState;
  dice: number;
  gameResult: "" | "Вы выиграли" | "Вы проиграли";
  cardInteractIndex: string;
  GameList: GameList;
  doEffect: TypeEffect;
};

export type ActionType =
  | { type: "clickStartButton" }
  | DiceThrownAction
  | ArrowPressAction
  | { type: "openedHealthCard" }
  | { type: "changedManHealth" }
  | { type: "changedHealthList" }
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

const getRandomHealthItem = (arr: Array<FieldItem>): ObjHealthItem => {
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
            cardItem: {
              healthItem: {
                name: "health",
                type: randomType,
                apperance: "closed",
              },
            },
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
          return getRandomHealthItem(arr);
        }
      }
    }
    default:
      return getRandomHealthItem(arr);
  }
};

/* const getRandomHealthItemMap = (arr: Array<FieldItem>): ObjHealthItem => {
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
            cardItem: {
              healthItem: {
                name: "health",
                type: randomType,
                apperance: "closed",
              },
            },
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
          return getRandomHealthItem(arr);
        }
      }
    }
    default:
      return getRandomHealthItem(arr);
  }
}; */

const createHealthArray = (number: number) => {
  let healthArray = new Array(number).fill(0).reduce((prevValue) => {
    const currValue = getRandomHealthItem(prevValue);
    return [currValue, ...prevValue];
  }, []);

  return healthArray;
};

/* const createHealthMap = (number: number) => {
  let healthArray = new Map();

  for (let i = 0; i <= number; i++) {
    const randomCoord = getRandomCoord;
  
  }

  return healthArray;
};
 */

const getGameList = (
  amountHealthItems: number,
  wallList: Array<CoordItem>,
  endCell: CoordItem
) => {
  const width = EndCell.hor;
  const height = EndCell.vert;
  const healthList: Array<ObjHealthItem> = createHealthArray(amountHealthItems);
  const gameArray: GameList = new Map();

  for (let hor = 0; hor <= width; hor++) {
    for (let vert = 0; vert <= height; vert++) {
      const hasManInStart = StartCell.hor === hor && StartCell.vert === vert;
      const hasFinish = EndCell.hor === hor && EndCell.vert === vert;

      const health = healthList.find((item, index) => {
        /*сделать поиск по индексу?!*/
        return item.hor === hor && item.vert === vert;
      });

      const hasHealth = health ? true : false;
      const hasManAndHealth = hasHealth && hasManInStart;

      const wallCell = wallList.find((item) => {
        return item.hor === hor && item.vert === vert;
      });
      const hasWall = wallCell ? true : false;

      const emptyFieldItem: ObjFieldItem = {
        name: "field",
        cardItem: {},
      };

      const getCell = () => {
        switch (true) {
          case hasWall: {
            const wallItem: WallItem = {
              name: "wall",
            };
            return wallItem;
          }
          case !hasWall: {
            switch (true) {
              case hasFinish: {
                const finishCell: FinishCell = {
                  name: "finish",
                  cardItem: {},
                };
                return finishCell;
              }
              case hasManAndHealth: {
                if (health != undefined) {
                  const fieldItem: ObjFieldItem = {
                    name: health.name,
                    /* ...health, */
                    cardItem: {
                      manItem: {
                        name: "man",
                        health: initialManHealth,
                      },
                      healthItem: health.cardItem.healthItem,
                    },
                  };
                  return fieldItem;
                } else return emptyFieldItem;
              }
              case hasHealth: {
                if (health != undefined) {
                  return health;
                } else return emptyFieldItem;
              }
              case hasManInStart: {
                const fieldItem: ObjFieldItem = {
                  name: "field",
                  cardItem: {
                    manItem: { name: "man", health: initialManHealth },
                  },
                };
                return fieldItem;
              }

              default:
                return emptyFieldItem;
            }
          }
          default:
            return emptyFieldItem;
        }
      };

      gameArray.set(`${hor}.${vert}`, getCell());
    }
  }

  return gameArray;
};

const getInitialState = (): State => {
  return {
    gameState: "waitingStart",
    dice: 0,
    gameResult: "",
    cardInteractIndex: `${StartCell.hor}.${StartCell.vert}`,
    GameList: getGameList(amountHealthItems, wallList, EndCell),
    doEffect: null,
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
  const {
    gameState,
    gameResult,
    cardInteractIndex,
    GameList,
    doEffect,
  } = useSelector((state: State) => ({ ...state }));

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
      switch (doEffect?.type) {
        case "!needOpenHealthCard": {
          const timerOpen = setTimeout(
            () =>
              dispatch({
                type: "openedHealthCard",
              }),
            1000
          );
          break;
        }
        case "!changeManHealth": {
          const timerChangeManHealth = setTimeout(
            () =>
              dispatch({
                type: "changedManHealth",
              }),
            500
          );
          break;
        }
        case "!changeHealthList": {
          const timerChangeHealthList = setTimeout(
            () =>
              dispatch({
                type: "changedHealthList",
              }),
            500
          );
          break;
        }

        default:
          break;
      }
    },
    [doEffect]
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
              <Status>{textPhase()}</Status>
              <Status>{`здоровье: ${getManHealth(
                GameList,
                cardInteractIndex
              )}`}</Status>
              <Status>{`координаты: ${cardInteractIndex}`}</Status>

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
