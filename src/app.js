import React, { useEffect, useMemo } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { createStore } from "redux";
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

const getRandomArray = (arr, type) => {
  let hor = Math.floor(Math.random() * 9);
  let vert = Math.floor(Math.random() * 9);
  let randomType = Math.floor(Math.random() * 2);

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
  } else return getRandomArray(arr, type);
};

const createHealthArray = (number, type) => {
  let healthArray = new Array(number).fill(0).reduce((prevValue) => {
    const currValue = getRandomArray(prevValue, type);

    return [currValue, ...prevValue];
  }, []);
  console.log(healthArray.length, healthArray);
  return healthArray;
};

const getInitialState = () => {
  return {
    gameState: "waitingStart",
    /* waitingStart ,
      trownDice ,
      clickArrow,
      checkCellHasCard,
        openHealthCard,
      checkCellIsFinish,
      changeManHealth,
      changeHealthList
      endGame, */
    startCoord: { hor: 0, vert: 0 },
    endCoord: { hor: 9, vert: 9 },
    manCoord: {
      hor: 0,
      vert: 0,
    },
    manHealth: 1,
    dice: null,
    healthCards: 10,
    cardInteract: false,
    healthList: createHealthArray(30, ["increment", "decrement"]),
    gameResult: "",
  };
};

const reducer = (state = getInitialState(), action) => {
  const phaseOuter = state.gameState.split(".")[0];
  const phaseInner = state.gameState.split(".")[1];

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
              return {
                ...state,
                healthList: openHealthItemList(
                  state.cardInteract,
                  state.healthList
                ),
              };
            }
            case "changeManHealth": {
              return {
                ...state,
                manHealth: changeHealth(
                  state.cardInteract.type,
                  state.manHealth
                ),
              };
            }
            case "changeHealthList": {
              const isManLive = state.manHealth > 0;

              switch (true) {
                case isManLive: {
                  const isNextTrowLast = state.dice === 0;
                  switch (true) {
                    case isNextTrowLast: {
                      return {
                        ...state,
                        healthList: changeHealthList(
                          state.cardInteract,
                          state.healthList
                        ),
                        gameState: "gameStarted.trownDice",
                        cardInteract: false,
                      };
                    }

                    case !isNextTrowLast: {
                      return {
                        ...state,
                        healthList: changeHealthList(
                          state.cardInteract,
                          state.healthList
                        ),
                        cardInteract: false,
                        gameState: "gameStarted.clickArrow",
                      };
                    }
                  }
                }
                case !isManLive: {
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

const checkCanMove = (direction, startCoord, endCoord, manCoord) => {
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

const changeCoord = (state, direction) => {
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

const checkCell = (nextManCoord, healthList) => {
  const index = healthList.findIndex((item) => {
    return item.hor === nextManCoord.hor && item.vert === nextManCoord.vert;
  });

  if (index != -1) {
    const currItem = healthList[index];
    return currItem;
  } else return false;
};

const changeHealth = (sign, manHealth) => {
  switch (sign) {
    case "increment":
      return manHealth + 1;
    case "decrement":
      return manHealth - 1;
    default:
      break;
  }
};
const changeHealthList = (coord, healthList) => {
  return healthList.filter((item) => {
    return !(coord.hor === item.hor && coord.vert === item.vert);
  });
};

const openHealthItemList = (card, healthList) => {
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
  ] = useSelector((state) => [
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
          return () =>
            clearTimeout(
              timerOpen,
              timerChangeManHealth,
              timerChangeHealthList
            );
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
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector("#root")
);
