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

const initialState = (() => {
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
    manHealth: 1,
    diceState: "enable",
    arrowState: "disable",
    mode: 0,
    dice: null,
    healthCards: 10,
    healthList: healthArray,
    gameResult: "waiting",
  };
})();

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

const checkCurrentCell = (currManCoord, healthList) => {
  /*проверяем попал ли человек на координату с здоровьем*/

  const index = healthList.findIndex((item) => {
    return item.hor === currManCoord.hor && item.vert === currManCoord.vert;
  });

  if (index != -1) {
    const currType = healthList[index].type;
    return currType;
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
const changeHealthList = (currManCoord, healthList) => {
  return healthList.filter((item) => {
    return !(currManCoord.hor === item.hor && currManCoord.vert === item.vert);
  });
};

const reducer = (state = initialState, action) => {
  const currManVert = state.man.vert;
  const currManHor = state.man.hor;
  const nextManVert = currManVert + 1;
  const nextManHor = currManHor + 1;
  const endGameVert = state.endCoord.vert;
  const endGameHor = state.endCoord.hor;
  const startGameVert = state.startCoord.vert;
  const startGameHor = state.startCoord.hor;

  switch (action.type) {
    case "clickStartButton":
      return {
        ...state,
        gameState: "start",
      };
    case "setGameEnd":
      return {
        ...state,
        gameState: "getScore",
      };

    case "arrowPressed": {
      const direction = action.payload;

      /*проверка на конец игры*/
      /*на границу поля*/
      let isEndGamePlace = false;
      let isInField = true;
      let isСurrentStepEndVert = false;
      let isCurrentStepEndHor = false;

      switch (direction) {
        case "top":
          isСurrentStepEndVert =
            nextManVert === endGameVert && currManHor === endGameHor;
          isEndGamePlace = isСurrentStepEndVert;
          isInField = currManVert >= startGameVert && currManVert < endGameVert;

          break;
        case "right":
          isCurrentStepEndHor =
            currManVert === endGameVert && nextManHor === endGameHor;
          isEndGamePlace = isCurrentStepEndHor;
          isInField = currManHor < endGameHor && currManHor >= startGameHor;

          break;
        case "bottom":
          isInField = currManVert > startGameVert && currManVert <= endGameVert;
          break;
        case "left":
          isInField = currManHor <= endGameHor && currManHor > startGameHor;
          break;
        default:
          break;
      }

      /*последний бросок кубика*/
      const isLastDiceThrow = state.dice === 1;

      const currManCoord = changeCoord(state, direction);

      /*Inc,dec,false*/
      const currCellHealthSign = checkCurrentCell(
        currManCoord,
        state.healthList
      );

      const isEndHealth =
        currCellHealthSign === "decrement" && state.manHealth === 1;

      if (isEndHealth) {
        return {
          ...state,
          dice: state.dice - 1,
          man: currManCoord,
          manHealth: changeManHealth(currCellHealthSign, state.manHealth),
          healthList: changeHealthList(currManCoord, state.healthList),
          gamePhase: "здоровье закончилось",
          gameState: "end",
          diceState: "disable",
          arrowState: "disable",
          gameResult: "Вы проиграли",
        };
      } else if (isEndGamePlace) {
        return {
          ...state,
          dice: null,
          gameState: "end",
          diceState: "disable",
          arrowState: "disable",
          gamePhase: "Финиш!",
          man: currManCoord,
          gameResult: "Вы выиграли",
          /*если есть знак изменения здоровья-меняем*/

          manHealth: currCellHealthSign
            ? changeManHealth(currCellHealthSign, state.manHealth)
            : state.manHealth,
          healthList: changeHealthList(currManCoord, state.healthList),
        };

        /*человек в поле и не последняя цифра кубика*/
      } else if (isInField && !isLastDiceThrow) {
        return {
          ...state,
          dice: state.dice - 1,
          man: currManCoord,
          manHealth: currCellHealthSign
            ? changeManHealth(currCellHealthSign, state.manHealth)
            : state.manHealth,
          healthList: changeHealthList(currManCoord, state.healthList),
          /*  gamePhase: isEndHealth ? "здоровье закончилось" : state.gamePhase, */
        };
      } else if (isInField && isLastDiceThrow) {
        /*человек в поле и последняя цифра кубика*/
        return {
          ...state,
          dice: state.dice - 1,
          man: currManCoord,
          manHealth: currCellHealthSign
            ? changeManHealth(currCellHealthSign, state.manHealth)
            : state.manHealth,
          healthList: changeHealthList(currManCoord, state.healthList),
          gamePhase:
            /* isEndHealth ? "здоровье закончилось" : */ "бросить кубик",
          arrowState: "disable",
          diceState: "enable",
        };
      } else {
        /*человек вне поля*/
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

function App() {
  const [
    gamePhase,
    gameState,
    manHor,
    manVert,
    manHealth,
  ] = useSelector((state) => [
    state.gamePhase,
    state.gameState,
    state.man.hor,
    state.man.vert,
    state.manHealth,
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

      /* dispatch({ type: "setGameEnd" }); */
    },
    [gameState]
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
