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
  let healthArray = new Array(number)
    .fill(0)
    .reduce((prevValue, currentValue, index) => {
      const currValue = getRandomArray(prevValue, type);

      return [currValue, ...prevValue];
    }, []);
  console.log(healthArray.length, healthArray);
  return healthArray;
};

const getInitialState = () => {
  const healthArray = createHealthArray(14, ["increment", "decrement"]);
  return {
    gameState: "waiting",
    gamePhase: "бросить кубик",
    startCoord: { hor: 0, vert: 0 },
    endCoord: { hor: 9, vert: 9 },
    man: {
      hor: 0,
      vert: 0,
    },
    manHealth: 3,
    diceState: "enable",
    arrowState: "disable",
    mode: 0,
    dice: null,
    healthCards: 10,
    healthList: healthArray,
    gameResult: "waiting",
    cardInteract: false,
  };
};

const reducer = (state = getInitialState(), action) => {

  switch (action.type) {
    case "needOpenHealthCard": {
      return {
        ...state,
        cardInteract: action.payload,
        healthList: openHealthItemList(action.payload, state.healthList),
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

      /*проверка на границу*/
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

      const isLastDiceThrow = state.dice === 1;
      const nextDiceState = isLastDiceThrow ? "enable" : "disable";
      const nextArrowState = isLastDiceThrow ? "disable" : "enable";
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

  /* if (index != -1) {
    const currType = healthList[index].type;
    return currType;
  } else return false; */
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

const changeHealthList = (nextManCoord, healthList) => {
  return healthList.filter((item) => {
    return !(nextManCoord.hor === item.hor && nextManCoord.vert === item.vert);
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
    gamePhase,
    gameState,
    manHor,
    manVert,
    manHealth,
    cardInteract,
  ] = useSelector((state) => [
    state.gamePhase,
    state.gameState,
    state.man.hor,
    state.man.vert,
    state.manHealth,
    state.cardInteract,
  ]);

  const dispatch = useDispatch();

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
          const timer = setTimeout(
            () =>
              dispatch({
                type: "needOpenHealthCard",
                payload: cardInteract,
              }),
            500
          );
          return () => clearTimeout(timer);
        default:
          break;
      }
      /*       if (cardInteract) {
        cardInteract = "open";
        const timer = setTimeout(
          dispatch({
            type: "needOpenHealthCard",
            payload: cardInteract,
          }),
          1000
        );
        return () => clearTimeout(timer);
      } */

      /*
  принимаем карточку, координаты
  добавить св-во apperance: closed/open
  сменить цвет карточки
  через 1 секунду
  dispatch({type:openHealthCard,payload:новая карточка})

  */
    },
    [cardInteract]
  );

  useEffect(
    () => {
      /*
  принимаем карточку, координаты
  добавить св-во apperance: closed/open
  сменить цвет карточки
  через 1 секунду
  dispatch({type:openHealthCard,payload:новая карточка})

  */
    },
    [
      /*
      cardInteract:"open"
      */
    ]
  );

  const getGameScreen = () => {
    switch (gameState) {
      case "waiting":
        return <StartScreen />;
      case "start":
        return (
          <>
            <Field>
              <Grid />
            </Field>
            <LeftPanel>
              <Status>{gamePhase}</Status>
              <Status>{`координаты: ${manHor}${manVert}`}</Status>
              <Status>{`здоровье: ${manHealth}`}</Status>

              <Dice />
              <Arrows />
            </LeftPanel>
          </>
        );
      case "end":
        return (
          <>
            <Field>
              <Grid />
            </Field>
            <LeftPanel>
              <Status>{gamePhase}</Status>
              <Status>{`координаты: ${manHor}${manVert}`}</Status>
              <Status>{`здоровье: ${manHealth}`}</Status>

              <Dice />
              <Arrows />
            </LeftPanel>
          </>
        );
      case "getScore":
        return <EndScreen />;

      default:
        break;
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
