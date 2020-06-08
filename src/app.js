import React, { useEffect, useMemo } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { createStore } from "redux";
import styled, { ThemeProvider } from "styled-components";

import Grid from "./features/Grid";
import Arrows from "./features/Arrows";
import Dice from "./features/Dice";
import Health from "./features/Health";

const Field = styled.div`
  position: relative;
  width: 300px;
  margin: 0 auto;
`;

const Game = styled.div`
  width: 500px;
  margin: 0 auto;
  display: flex;
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

function createHealthArray(number, type) {
  let healthArray = new Array(number)
    .fill(0)
    .reduce((prevValue, currentValue, index) => {
      let hor = Math.floor(Math.random() * 9 + 1);
      let vert = Math.floor(Math.random() * 9 + 1);
      let randomType = Math.floor(Math.random() * 2);
      if (
        !prevValue.find((item) => {
          return item.hor === hor && item.vert === vert;
        }) ||
        prevValue === 0
      ) {
        console.log(prevValue);
        return [
          {
            hor: hor,
            vert: vert,
            type: type[randomType],
          },
          ...prevValue,
        ];
      } else return prevValue;
    }, []);

  return healthArray;
}

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
    manHealth: 3,
    diceState: "enable",
    arrowState: "disable",
    mode: 0,
    dice: null,
    healthCards: 10,
    healthList: healthArray,
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

const checkCurrentCell = (currManCoord, healthList, manHealth) => {
  /*проверяем попал ли человек на координату с здоровьем*/
  const index = healthList.findIndex((item) => {
    return item.hor === currManCoord.hor && item.vert === currManCoord.vert;
  });

  if (index != -1) {
    const currType = healthList[index].type;

    switch (currType) {
      case "increment":
        return manHealth + 1;
      case "decrement":
        /* const isEndGame
        switch() */
        return manHealth - 1;
      default:
        break;
    }
  } else return manHealth;
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
  /* 
  const isInFieldHor = currManHor < endGameHor && nextManHor > startGameHor;
  const isInFieldVert =
    nextManVert > startGameVert && currManVert < endGameVert;
 */
  switch (action.type) {
    case "createСalculated":
      const healthList = createHealthArray(14, ["increment", "decrement"]);
      if (state.healthList.length > 0) {
        return {
          ...state,
          healthList: healthList,
          gameState: "start",
        };
      }

    case "gameEnd":
      return {
        ...state,
        gameState: "end",
        diceState: "disable",
        arrowState: "disable",
        gamePhase: action.payload,
      };
    case "createHealthArr": {
      return {
        ...state,
        healthList: action.payload,
      };
    }
    case "arrowPressed": {
      const direction = action.payload;

      /*проверка на конец игры*/
      /*на границу поля*/
      let isEndGame = false;
      let isInField = true;
      let isСurrentStepEndVert = false;
      let isCurrentStepEndHor = false;

      switch (direction) {
        case "top":
          isСurrentStepEndVert =
            nextManVert === endGameVert && currManHor === endGameHor;
          isEndGame = isСurrentStepEndVert;
          isInField = currManVert >= startGameVert && currManVert < endGameVert;

          break;
        case "right":
          isCurrentStepEndHor =
            currManVert === endGameVert && nextManHor === endGameHor;
          isEndGame = isCurrentStepEndHor;
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

      if (isEndGame) {
        return {
          ...state,
          dice: null,
          gameState: "end",
          diceState: "disable",
          arrowState: "disable",
          gamePhase: "игра окончена",
          man: currManCoord,
          manHealth: checkCurrentCell(
            currManCoord,
            state.healthList,
            state.manHealth
          ),
          healthList: changeHealthList(currManCoord, state.healthList),
        };

        /*человек в поле и не последняя цифра кубика*/
      } else if (isInField && !isLastDiceThrow) {
        return {
          ...state,
          dice: state.dice - 1,
          man: currManCoord,
          manHealth: checkCurrentCell(
            currManCoord,
            state.healthList,
            state.manHealth
          ),
          healthList: changeHealthList(currManCoord, state.healthList),
        };
      } else if (isInField && isLastDiceThrow) {
        /*человек в поле и последняя цифра кубика*/
        return {
          ...state,
          dice: state.dice - 1,
          man: currManCoord,
          manHealth: checkCurrentCell(
            currManCoord,
            state.healthList,
            state.manHealth
          ),
          healthList: changeHealthList(currManCoord, state.healthList),
          gamePhase: "бросить кубик",
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

  /*проверка на конец игры перед рендером-?!
  большой switch-case*/

  /* switch (gameState) {
    case "waiting":
      dispatch({ type: "createСalculated", payload: 10 });

    case "start":
      if (manHealth === 0 && gameState === "start") {
        dispatch({ type: "gameEnd", payload: "здровье закончилось" });
      } else
        return (
          <>
            <Game>
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
            </Game>
          </>
        );
    default:
      break;
  } */

  return (
    <>
      <Game>
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
      </Game>
    </>
  );
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
