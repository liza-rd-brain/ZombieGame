import React, { useEffect, useMemo } from "react";
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
import openHealthCard from "./phases/gameStarted/openHealthCard";
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

export type HealthItemType = "increment" | "decrement" | undefined;

export type HealthItemTypeArr = ["increment", "decrement"];
export type MoveDirection = "top" | "bottom" | "left" | "right";

export type HealthItem = {
  hor: number;
  vert: number;
  type?: HealthItemType;
  apperance?: "closed" | "open";
};

export type CurrentHealthItem = {
  hor: number;
  vert: number;
  health: {
    type: HealthItemType;
    apperance: "closed" | "open";
  };
};
export type ManItem = {
  hor: number;
  vert: number;
  man: true;
};

export type CoordItem = { hor: number; vert: number };

type GameState =
  | "waitingStart"
  | "gameStarted.trownDice"
  | "gameStarted.clickArrow"
  | "gameStarted.openHealthCard"
  | "endGame"
  | "getEndScreen";

export type State = {
  gameState: GameState;
  startCoord: CoordItem;
  endCoord: CoordItem;
  /*  manCoord: CoordItem; */
  manHealth: number;
  dice: null | number;
  cardInteract: CurrentHealthItem | false;
  gameResult: "" | "Вы выиграли" | "Вы проиграли";
  gameList: Array<any>;
};

export type ActionType =
  | { type: "clickStartButton" }
  | DiceThrownAction
  | ArrowPressAction
  | { type: "needOpenHealthCard" }
  | { type: "changeManHealth" }
  | { type: "changeHealthList" }
  | { type: "getEndScreen" };

export type ArrowPressAction = { type: "arrowPressed"; payload: MoveDirection };
type DiceThrownAction = { type: "diceThrown"; payload: number };

/*может мне все-таки нужна общая функция getRandomCell?!
получаем рандомную клетку, а потом уже проверяем ее на соответствие условиям
здоровье, враги, целевые карточки прогонять через нее */

const getRandomHealthItem = (arr: Array<HealthItem>): HealthItem => {
  const hor = Math.floor(Math.random() * 10);
  const vert = Math.floor(Math.random() * 10);
  const randomType: HealthItemType =
    healthItemTypeArr[Math.floor(Math.random() * 2)];

  const crossStartCell = startCell.hor === hor && startCell.vert === vert;
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
            type: randomType,
            apperance: "closed",
          };
        }
        case !hasHealthRepitition: {
          return {
            hor: hor,
            vert: vert,
            type: randomType,
            apperance: "closed",
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

  /*  if (!crossStartCell) {
    if (arr.length === 0) {
      return {
        hor: hor,
        vert: vert,
        type: randomType,
        apperance: "closed",
      };
    } else if (
      !arr.find((item) => {
        return item && item.hor === hor && item.vert === vert;
      })
    ) {
      return {
        hor: hor,
        vert: vert,
        type: randomType,
        apperance: "closed",
      };
    } else return getRandomHealthItem(arr);
  } else {
    return getRandomHealthItem(arr);
  } */
};

const createHealthArray = (number: number) => {
  let healthArray = new Array(number).fill(0).reduce((prevValue) => {
    const currValue = getRandomHealthItem(prevValue);
    return [currValue, ...prevValue];
  }, []);

  return healthArray;
};

const getGameList = (
  numberHelthItem: number,
  wallList: Array<CoordItem>,
  endCell: CoordItem,
  manCoord: CoordItem
): Array<any> => {
  const width = endCell.hor + 1;
  const height = endCell.vert + 1;

  const healthList: Array<HealthItem> = createHealthArray(30);

  return new Array(height)
    .fill(0)
    .map(
      (itemVert, vert) =>
        new Array(width).fill({}).map((itemHor, hor) => {
          const hasMan = manCoord.hor === hor && manCoord.vert === vert;
          const health = healthList.find((item, index) => {
            return item.hor === hor && item.vert === vert;
          });
          const hasHealth = health ? true : false;
          const hasManAndHealth = hasHealth && hasMan;
          const wallCell = wallList.find((item) => {
            return item.hor === hor && item.vert === vert;
          });

          const hasWall = wallCell ? true : false;

          switch (true) {
            case hasWall: {
              return {
                hor: hor,
                vert: vert,
                wall: true,
              };
            }
            case !hasWall: {
              switch (true) {
                case hasManAndHealth: {
                  if (health != undefined) {
                    return {
                      hor: hor,
                      vert: vert,
                      health: {
                        type: health.type,
                        apperance: health.apperance,
                      },
                      /*  в этом поле потом можно будет хранить здоровье человека */
                      man: true,
                    };
                  } else return null;
                }
                case hasMan: {
                  return {
                    hor: hor,
                    vert: vert,
                    man: true,
                  };
                }
                case hasHealth: {
                  if (health != undefined) {
                    return {
                      hor: hor,
                      vert: vert,
                      health: {
                        type: health.type,
                        apperance: health.apperance,
                      },
                    };
                  } else return null;
                }
              }
            }
            default:
              return { hor: hor, vert: vert };
          }
          /*     return []; */
        })
      /*  .reverse() */
    )
    .reverse();

  /*стены
cardItem:HealthItem|Man
{
  hor: number;
  vert: number;
  content:wall|cardItem

}
    карточки здоровья (не могут пересекаться со стенами)
    человек
  */

  /* return []; */
};

const startCell = { hor: 0, vert: 0 };
const endCell = { hor: 3, vert: 3 };

const healthItemTypeArr: HealthItemTypeArr = ["increment", "decrement"];

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

const manCoord: CoordItem = {
  hor: 0,
  vert: 0,
};

const getInitialState = (): State => {
  return {
    gameState: "waitingStart",
    startCoord: startCell,
    endCoord: endCell,
    /*  manCoord: manCoord, */
    manHealth: 3,
    dice: null,
    cardInteract: false,

    gameList: getGameList(30, wallList, endCell, manCoord),
    gameResult: "",
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
    /*     manHor,
    manVert, */
    manHealth,
    gameResult,
  ] = useSelector((state: State) => [
    state.gameState,
    /* state.manCoord.hor,
    state.manCoord.vert, */
    state.manHealth,
    state.gameResult,
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
      console.log("open");
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
              <Status>{textPhase()}</Status>
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
