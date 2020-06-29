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

type HealthItemType = "increment" | "decrement";
export type MoveDirection = "top" | "bottom" | "left" | "right";

export type HealthItem = {
  hor: number;
  vert: number;
  type?: HealthItemType;
  apperance?: "closed" | "open";
  /* kind: "health-item"; */
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
  manCoord: CoordItem;
  manHealth: number;
  dice: null | number;
  healthCards: number;
  cardInteract: HealthItem | false;
  healthList: Array<HealthItem>;
  gameResult: "" | "Вы выиграли" | "Вы проиграли";
};

type ActionType =
  | { type: "clickStartButton" }
  | DiceThrownAction
  | ArrowPressAction
  | { type: "needOpenHealthCard" }
  | { type: "changeManHealth" }
  | { type: "changeHealthList" }
  | { type: "getEndScreen" };

export type ArrowPressAction = { type: "arrowPressed"; payload: MoveDirection };
type DiceThrownAction = { type: "diceThrown"; payload: number };

/* для конкретного акшена конкретный пэйлоад */

// type Card = HealthItem | { kind: "no-card" };
// const card: Card = { kind: "no-card" };
// function checkCard(c: Card) {
//   if (c.kind === "health-item") {
//     return console.log(c)
//   }
//   if (c.kind === "no-card") {
//     return console.log(c)
//   }

// }

const getRandomHealthItem = (
  arr: Array<HealthItem>,
  type: ["increment", "decrement"],
  forbidenCell?: CoordItem
): HealthItem => {
  let hor = Math.floor(Math.random() * 9);
  let vert = Math.floor(Math.random() * 9);
  let randomType = Math.floor(Math.random() * 2);

  let forbiddenCondition =
    forbidenCell.hor === hor && forbidenCell.vert === vert;

  switch (true) {
    case !forbiddenCondition: {
      if (arr.length === 0) {
        return {
          hor: hor,
          vert: vert,
          type: type[randomType],
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
          type: type[randomType],
          apperance: "closed",
        };
      } else return getRandomHealthItem(arr, type , forbidenCell);
    }
    case forbiddenCondition: {
      return getRandomHealthItem(arr, type , forbidenCell);
    }
    default:
      return null;
  }
};

const createHealthArray = (
  number: number,
  type: ["increment", "decrement"],
  forbidenCell?: CoordItem
) => {
  let healthArray = new Array(number).fill(0).reduce((prevValue) => {
    const currValue = getRandomHealthItem(prevValue, type, forbidenCell);

    return [currValue, ...prevValue];
  }, []);

  return healthArray;
};

const startCell = { hor: 0, vert: 0 };

const getInitialState = (): State => {
  return {
    gameState: "waitingStart",
    startCoord: startCell,
    endCoord: { hor: 9, vert: 9 },
    manCoord: {
      hor: 0,
      vert: 0,
    },
    manHealth: 3,
    dice: null,
    healthCards: 10,
    cardInteract: false,
    healthList: createHealthArray(30, ["increment", "decrement"], startCell),
    gameResult: "",
  };
};

const reducer = (state = getInitialState(), action: ActionType) => {
  const [phaseOuter, phaseInner] = state.gameState.split(".");

  switch (phaseOuter) {
    case "waitingStart": {
      switch (action.type) {
        case "clickStartButton": {
          return {
            ...state,
            gameState: "gameStarted.trownDice",
          };
        }
        default:
          return state;
      }
    }

    case "gameStarted": {
      switch (phaseInner) {
        case "trownDice": {
          switch (action.type) {
            case "diceThrown": {
              return {
                ...state,
                dice: action.payload,
                gameState: "gameStarted.clickArrow",
              };
            }
            default:
              return state;
          }
        }

        case "clickArrow": {
          switch (action.type) {
            case "arrowPressed": {
              const direction = action.payload;
              const nextManCoord = changeCoord(state, direction);
              const isNextTrowLast = state.dice === 1;

              const manInField = checkCanMove(
                direction,
                state.startCoord,
                state.endCoord,
                nextManCoord
              );
              const nextCellCard = checkCell(nextManCoord, state.healthList);
              const nextCellHasCard = nextCellCard ? true : false;

              const isNextCellFinish =
                nextManCoord.hor === state.endCoord.hor &&
                nextManCoord.vert === state.endCoord.vert;

              switch (true) {
                case manInField: {
                  switch (true) {
                    case nextCellHasCard: {
                      return {
                        ...state,
                        dice: state.dice - 1,
                        manCoord: nextManCoord,
                        cardInteract: nextCellCard,
                        gameState: "gameStarted.openHealthCard",
                      };
                    }
                    case !nextCellHasCard: {
                      switch (true) {
                        case isNextCellFinish: {
                          return {
                            ...state,
                            dice: state.dice - 1,
                            manCoord: nextManCoord,
                            gameState: "endGame",
                            gameResult: "Вы выиграли",
                          };
                        }
                        case !isNextCellFinish: {
                          switch (true) {
                            case isNextTrowLast: {
                              return {
                                ...state,
                                dice: state.dice - 1,
                                manCoord: nextManCoord,
                                gameState: "gameStarted.trownDice",
                              };
                            }
                            case !isNextTrowLast: {
                              return {
                                ...state,
                                dice: state.dice - 1,
                                manCoord: nextManCoord,
                                gameState: "gameStarted.clickArrow",
                              };
                            }
                          }
                        }
                      }
                    }
                  }
                }
                case !manInField: {
                  return { ...state };
                }
              }
            }
            default:
              return state;
          }
        }

        case "openHealthCard": {
          switch (action.type) {
            case "needOpenHealthCard": {
              if (state.cardInteract != false) {
                console.log(state.cardInteract);
                return {
                  ...state,
                  healthList: openHealthItemList(
                    state.cardInteract,
                    state.healthList
                  ),
                };
              } else return { ...state };
            }
            case "changeManHealth": {
              if (state.cardInteract != false) {
                return {
                  ...state,
                  manHealth: changeHealth(
                    state.cardInteract.type,
                    state.manHealth
                  ),
                };
              } else return { ...state };
            }
            case "changeHealthList": {
              debugger;
              const isManLive = state.manHealth > 0;

              switch (true) {
                case isManLive: {
                  const isNextTrowLast = state.dice === 0;
                  switch (true) {
                    case isNextTrowLast: {
                      if (state.cardInteract != false) {
                        return {
                          ...state,
                          healthList: changeHealthList(
                            state.cardInteract,
                            state.healthList
                          ),
                          gameState: "gameStarted.trownDice",
                          cardInteract: false,
                        };
                      } else return { ...state };
                    }

                    case !isNextTrowLast: {
                      if (state.cardInteract != false) {
                        return {
                          ...state,
                          healthList: changeHealthList(
                            state.cardInteract,
                            state.healthList
                          ),
                          cardInteract: false,
                          gameState: "gameStarted.clickArrow",
                        };
                      } else return { ...state };
                    }
                  }
                }
                case !isManLive: {
                  if (state.cardInteract != false) {
                    return {
                      ...state,
                      healthList: changeHealthList(
                        state.cardInteract,
                        state.healthList
                      ),
                      cardInteract: false,
                      gameState: "endGame",
                      gameResult: "Вы проиграли",
                    };
                  } else return { ...state };
                }
              }
            }
            default:
              return state;
          }
        }
        default:
          return state;
      }
    }

    case "endGame": {
      switch (action.type) {
        case "getEndScreen": {
          return {
            ...state,
            gameState: "getEndScreen",
          };
        }
        default:
          return state;
      }
    }
    default:
      return state;
  }
};

const checkCanMove = (
  direction: MoveDirection,
  startCoord: CoordItem,
  endCoord: CoordItem,
  manCoord: CoordItem
) => {
  switch (direction) {
    case "top":
      if (manCoord.vert <= endCoord.vert) {
        return true;
      } else return false;
    case "bottom":
      if (manCoord.vert >= startCoord.vert) {
        return true;
      } else return false;
    case "right":
      if (manCoord.hor <= endCoord.hor) {
        return true;
      } else return false;
    case "left":
      if (manCoord.hor >= startCoord.hor) {
        return true;
      } else return false;
    default:
      return false;
  }
};

const changeCoord = (state: State, direction: MoveDirection) => {
  const currManVert = state.manCoord.vert;
  const currManHor = state.manCoord.hor;
  const nextManVert = currManVert + 1;
  const nextManHor = currManHor + 1;
  const prevManVert = currManVert - 1;
  const prevManHor = currManHor - 1;

  switch (direction) {
    case "top": {
      return {
        hor: currManHor,
        vert: nextManVert,
      };
    }
    case "bottom": {
      return {
        hor: currManHor,
        vert: prevManVert,
      };
    }
    case "left": {
      return {
        hor: prevManHor,
        vert: currManVert,
      };
    }
    case "right": {
      return {
        hor: nextManHor,
        vert: currManVert,
      };
    }
    default:
      break;
  }
};

const checkCell = (nextManCoord: CoordItem, healthList: Array<HealthItem>) => {
  const index = healthList.findIndex((item) => {
    return item.hor === nextManCoord.hor && item.vert === nextManCoord.vert;
  });

  if (index != -1) {
    const currItem = healthList[index];
    return currItem;
  } else return false;
};

const changeHealth = (sign: HealthItemType, manHealth: number) => {
  switch (sign) {
    case "increment":
      return manHealth + 1;
    case "decrement":
      return manHealth - 1;
    default:
      break;
  }
};
const changeHealthList = (coord: HealthItem, healthList: Array<HealthItem>) => {
  return healthList.filter((item) => {
    return !(coord.hor === item.hor && coord.vert === item.vert);
  });
};

const openHealthItemList = (
  card: HealthItem,
  healthList: Array<HealthItem>
) => {
  return healthList.map((item, index) => {
    if (card.hor === item.hor && card.vert === item.vert) {
      card.apperance = "open";
      return {
        ...card,
        apperance: "open",
      };
    } else return item;
  });
};

function App() {
  const [
    gameState,
    manHor,
    manVert,
    manHealth,
    gameResult,
    cardInteract,
  ] = useSelector((state: State) => [
    state.gameState,
    state.manCoord.hor,
    state.manCoord.vert,
    state.manHealth,
    state.gameResult,
    state.cardInteract,
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
              <Status>{`координаты: ${manHor}${manVert}`}</Status>
              <Status>{`здоровье: ${manHealth}`}</Status>

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
