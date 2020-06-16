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
  /* const healthArray  */
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
  const waitingStart = state.gameState === "waitingStart";
  const trownDice = state.gameState === "trownDice";
  const clickArrow = state.gameState === "clickArrow";
  const checkCellHasCard = state.gameState === "checkCellHasCard";
  const openHealthCard = state.gameState === "openHealthCard";
  const checkCellIsFinish = state.gameState === "checkCellIsFinish";
  const endGame = state.gameState === "endGame";
  const changeManHealth = state.gameState === "changeManHealth";
  const changeHealthList = state.gameState === "changeHealthList";
  const checkDice = state.gameState === "checkDice";
  const checkManHealth = state.gameState === "checkManHealth";
  switch (true) {
    case waitingStart: {
      switch (action.type) {
        case "clickStartButton": {
          return {
            ...state,
            gameState: "trownDice",
          };
        }
      }
    }

    case trownDice: {
      switch (action.type) {
        case "diceThrown": {
          return {
            ...state,
            dice: action.payload,
            gameState: "clickArrow",
          };
        }
        default:
          return state;
      }
    }

    case clickArrow: {
      switch (action.type) {
        case "arrowPressed": {
          const direction = action.payload;
          const nextManCoord = changeCoord(state, direction);

          const isLastDiceThrow = state.dice === 1;

          const manInField = checkCanMove(
            direction,
            state.startCoord,
            state.endCoord,
            nextManCoord
          );

          switch (true) {
            case manInField: {
              return {
                ...state,
                /*здесь меняем кубик-?! */
                dice: state.dice - 1,

                manCoord: nextManCoord,
                gameState: "checkCellHasCard",
              };
            }
          }
        }
      }
    }

    case checkCellHasCard: {
      switch (action.type) {
        case "checkCellHasCard": {
          const nextCellCard = checkCell(state.manCoord, state.healthList);
          const nextCellHasCard = nextCellCard ? true : false;

          switch (true) {
            case nextCellHasCard: {
              return {
                ...state,
                gameState: "openHealthCard",
                cardInteract: nextCellCard,
              };
            }
            case !nextCellHasCard: {
              return {
                ...state,
                gameState: "checkCellIsFinish",
              };
            }
          }
        }
      }
    }

    case openHealthCard: {
      /*координата карты =координата человека */
      switch (action.type) {
        case "needOpenHealthCard": {
          return {
            ...state,
            gameState: "changeManHealth",
            healthList: openHealthItemList(
              state.cardInteract,
              state.healthList
            ),
          };
        }
      }
    }

    case changeManHealth: {
      switch (action.type) {
        case "changeManHealth": {
          return {
            ...state,
            manHealth: changeHealth(state.cardInteract.type, state.manHealth),
            gameState: "changeHealthList",
          };
        }
        default:
          return state;
      }
    }

    case changeHealthList: {
      switch (action.type) {
        case "changeHealthList": {
          return {
            ...state,
            healthList: getHealthList(state.cardInteract, state.healthList),
            gameState: "checkManHealth",
          };
        }
      }
    }

    case checkManHealth: {
      switch (action.type) {
        case "checkManHealth": {
          const isManLive = state.manHealth > 0;
          switch (true) {
            case isManLive: {
              return {
                ...state,
                gameState: "checkDice",
              };
            }
            case !isManLive: {
              return {
                ...state,
                gameState: "endGame",
                gameResult: "Вы проиграли",
              };
            }
          }
        }
      }
    }

    case checkCellIsFinish: {
      switch (action.type) {
        case "checkCellIsFinish": {
          const cellFinish =
            state.manCoord.hor === state.endCoord.hor &&
            state.manCoord.vert === state.endCoord.vert;
          switch (true) {
            case cellFinish: {
              return {
                ...state,
                gameState: "endGame",
                gameResult: "Вы выиграли",
              };
            }
            case !cellFinish: {
              return {
                ...state,
                gameState: "checkDice",
              };
            }
            default:
              return state;
          }
        }
        default:
          return state;
      }
    }
    case checkDice: {
      switch (action.type) {
        case "checkDice": {
          const isDiceZero = state.dice === 0;
          switch (true) {
            case isDiceZero: {
              return {
                ...state,
                gameState: "trownDice",
              };
            }
            case !isDiceZero: {
              return {
                ...state,
                gameState: "clickArrow",
              };
            }
            default:
              return state;
          }
        }
      }
    }

    case endGame: {
      switch (action.type) {
        case "getEndScreen": {
          return {
            ...state,
            gameState: "getEndScreen",
          };
        }
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
  /*проверяем попал ли человек на координату с здоровьем*/
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

const getHealthList = (coord, healthList) => {
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
  ] = useSelector((state) => [
    state.gameState,
    state.manCoord.hor,
    state.manCoord.vert,
    state.manHealth,
    state.gameResult,
  ]);

  const dispatch = useDispatch();
  const textPhase = () => {
    switch (gameState) {
      case "trownDice":
        return "бросить кубик";
      case "clickArrow":
        return "сделать ход";
      case "endGame":
        return gameResult;
      default:
        return " ";
    }
  };
  gameState === "trownDice" ? "бросить кубик" : "сделать ход";

  useEffect(
    function setEndHealth() {
      switch (manHealth) {
        case 0:
          dispatch({ type: "setEndHealth" });
          break;
        default:
          break;
      }
    },
    [manHealth]
  );

  useEffect(
    function checkNewPosition() {
      switch (gameState) {
        case "checkCellHasCard": {
          dispatch({ type: "checkCellHasCard" });
        }
        case "openHealthCard": {
          const timerOpen = setTimeout(
            () =>
              dispatch({
                type: "needOpenHealthCard",
              }),
            1000
          );

          return () => clearTimeout(timerOpen);
        }
        case "changeManHealth": {
          const timerChangeManHealth = setTimeout(
            () =>
              dispatch({
                type: "changeManHealth",
              }),
            1000
          );
          return () => clearTimeout(timerChangeManHealth);
        }
        case "changeHealthList": {
          const timerChangeHealthList = setTimeout(
            () =>
              dispatch({
                type: "changeHealthList",
              }),
            1000
          );
          return () => clearTimeout(timerChangeHealthList);
        }

        case "checkManHealth": {
          dispatch({ type: "checkManHealth" });
        }
        case "checkDice": {
          dispatch({ type: "checkDice" });
        }

        case "checkCellIsFinish": {
          dispatch({ type: "checkCellIsFinish" });
        }

        case "endGame": {
          const timer = setTimeout(
            () => dispatch({ type: "getEndScreen" }),
            1000
          );

          return () => clearTimeout(timer);
        }

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

/* healthList: [
    { hor: 1, vert: 0 },
    { hor: 6, vert: 4 },
    { hor: 8, vert: 2 },
    { hor: 5, vert: 0 },
    { hor: 6, vert: 2 },
    { hor: 7, vert: 7 },
  ], */
