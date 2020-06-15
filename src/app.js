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
`;

const getRandomArray = (arr, type) => {
  let hor = Math.floor(Math.random() * 9 + 1);
  let vert = Math.floor(Math.random() * 9 + 1);
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
      changeManHealth,
      changeHealthList
      endGame, */
    startCoord: { hor: 0, vert: 0 },
    endCoord: { hor: 9, vert: 9 },
    man: {
      hor: 0,
      vert: 0,
    },
    manHealth: 1,
    dice: null,
    healthCards: 10,
    cardInteract: false,
    healthList: createHealthArray(14, ["increment", "decrement"]),
    /*   diceState: "enable",
    arrowState: "disable",
    gameState: "waiting",
    gamePhase: "бросить кубик",
    ,
    gameResult: "waiting",
     */
  };
};

const reducer = (state = getInitialState(), action) => {
  const waitingStart = state.gameState === "waitingStart";
  const trownDice = state.gameState === "trownDice";
  const clickArrow = state.gameState === "clickArrow";
  switch (true) {
    case waitingStart: {
      switch (action.type) {
        case "clickStartButton": {
          return {
            ...state,
            gameState: "trownDice",
          };
        }
        default:
          return state;
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

          const isNextCellFinish =
            nextManCoord.hor === state.endCoord.hor &&
            nextManCoord.vert === state.endCoord.vert;
        }
      }
    }
    default:
      return state;
  }

  /*   case "clickStartButton": {
    return {
      ...state,
      gameState: "start",
    };
  } */
};
const reducerOLD = (state = getInitialState(), action) => {
  switch (action.type) {
    case "freezeController": {
      return {
        ...state,
        diceState: "disable",
        arrowState: "disable",
      };
    }
    case "needOpenHealthCard": {
      return {
        ...state,
        cardInteract: action.payload,
        healthList: openHealthItemList(action.payload, state.healthList),
      };
    }
    case "changeManHealth": {
      return {
        ...state,
        manHealth: changeManHealth(action.payload, state.manHealth),

        /*пока тут отследим уровень здоровья! */
      };
    }

    case "setEndHealth": {
      return {
        ...state,
        gameResult: "Вы проиграли",
        gamePhase: "Здоровье закончилось",
        gameState: "end",
      };
    }

    case "changeHealthList": {
      const isLastDiceThrow = state.dice === 0;
      const currDiceState = isLastDiceThrow ? "enable" : "disable";
      const currArrowState = isLastDiceThrow ? "disable" : "enable";
      return {
        ...state,
        healthList: changeHealthList(action.payload, state.healthList),
        diceState: "disable",
        arrowState: "disable",
        cardInteract: false,
        diceState: currDiceState,
        arrowState: currArrowState,
      };
    }

    case "clickStartButton": {
      return {
        ...state,
        gameState: "start",
      };
    }

    case "setGameEnd": {
      return {
        ...state,
        gameState: "getScore",
      };
    }

    case "arrowPressed": {
      const direction = action.payload;
      const nextManCoord = changeCoord(state, direction);
      const isLastDiceThrow = state.dice === 1;

      const nextDiceState = isLastDiceThrow ? "enable" : "disable";
      const nextArrowState = isLastDiceThrow ? "disable" : "enable";

      const manInField = checkCanMove(
        direction,
        state.startCoord,
        state.endCoord,
        nextManCoord
      );

      const isNextCellFinish =
        nextManCoord.hor === state.endCoord.hor &&
        nextManCoord.vert === state.endCoord.vert;

      /*вернет объект или false*/
      const nextCellCard = checkCell(nextManCoord, state.healthList);
      const nextCellHasCard = nextCellCard ? true : false;

      const nextGamePhase = isLastDiceThrow ? "бросить кубик" : "сделать ход";

      switch (manInField) {
        case true: {
          switch (isNextCellFinish) {
            case false: {
              /*проверка на попадание на карточку*/
              switch (nextCellHasCard) {
                case true: {
                  /*процесс открытия карточки*/

                  return {
                    ...state,
                    dice: state.dice - 1,
                    man: nextManCoord,
                    cardInteract: nextCellCard,
                    arrowState: nextArrowState,
                    diceState: nextDiceState,
                    gamePhase: nextGamePhase,
                  };
                }

                case false: {
                  return {
                    ...state,
                    dice: state.dice - 1,
                    man: nextManCoord,
                    arrowState: nextArrowState,
                    diceState: nextDiceState,
                    gamePhase: nextGamePhase,
                  };
                }
              }
            }
            case true: {
              return {
                ...state,
                gameState: "end",
                diceState: "disable",
                arrowState: "disable",
                gamePhase: "Финиш!",
                man: nextManCoord,
                gameResult: "Вы выиграли",
              };
            }
          }
        }

        case false:
          return state;
        default:
          return state;
      }
    }

    case "diceThrown": {
      return {
        ...state,
        dice: action.payload,
        gamePhase: "сделать ход",
        diceState: "disable",
        arrowState: "enable",
      };
    }

    case "incHealth": {
      return {
        ...state,
        manHealth: state.manHealth + 1,
        healthList: state.healthList.filter((item) => {
          item.hor != action.payload.hor && item.vert != action.payload.vert;
        }),
      };
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
  const currManVert = state.man.vert;
  const currManHor = state.man.hor;
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

const changeManHealth = (sign, manHealth) => {
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
      return card;
    } else return item;
  });
};

function App() {
  const [
    gameState,
    manHor,
    manVert,
    manHealth,
    cardInteract,
  ] = useSelector((state) => [
    state.gameState,
    state.man.hor,
    state.man.vert,
    state.manHealth,
    state.cardInteract,
  ]);

  const dispatch = useDispatch();
  const textPhase = gameState === "trownDice" ? "бросить кубик" : "сделать ход";
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
    function getEndScreen() {
      switch (gameState) {
        case "end":
          const timer = setTimeout(
            () => dispatch({ type: "setGameEnd" }),
            1000
          );

          return () => clearTimeout(timer);

        default:
          break;
      }
    },
    [gameState]
  );

  useEffect(
    function openCard() {
      const hasCardInteract = cardInteract ? true : false;
      switch (hasCardInteract) {
        case true:
          dispatch({
            type: "freezeController",
          });

          const timerOpen = setTimeout(
            () =>
              dispatch({
                type: "needOpenHealthCard",
                payload: cardInteract,
              }),
            1000
          );
          const timerChangeManHealth = setTimeout(
            () =>
              dispatch({
                type: "changeManHealth",
                payload: cardInteract.type,
              }),
            1500
          );
          const timerChangeHealthList = setTimeout(
            () =>
              dispatch({
                type: "changeHealthList",
                payload: cardInteract,
              }),
            2000
          );
          return () =>
            clearTimeout(
              timerOpen,
              timerChangeManHealth,
              timerChangeHealthList
            );
        default:
          break;
      }
    },
    [cardInteract]
  );

  const getGameScreen = () => {
    switch (gameState) {
      case "waitingStart":
        return <StartScreen />;

      case "getScore":
        return <EndScreen />;

      default:
        return (
          <>
            <Field>
              <Grid />
            </Field>
            <LeftPanel>
              <Status>{textPhase}</Status>
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
