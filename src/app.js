import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { createStore } from "redux";
import styled, { ThemeProvider } from "styled-components";

import Grid from "./features/Grid";
import Arrows from "./features/Arrows";
import Dice from "./features/Dice";

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
`;

const initialState = {
  gameState: "start",
  gamePhase: "бросить кубик",
  startCoord: { hor: 0, vert: 0 },
  endCoord: { hor: 9, vert: 9 },
  man: {
    hor: 8,
    vert: 8,
  },
  diceState: "enable",
  arrowState: "disable",
  mode: 0,
  dice: null,
};

const changeCoord = (state, direction) => {
  const currManVert = state.man.vert;
  const currManHor = state.man.hor;
  const nextManVert = state.man.vert + 1;
  const nextManHor = state.man.hor + 1;
  const prevManVert = state.man.vert - 1;
  const prevManHor = state.man.hor - 1;

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

const reducer = (state = initialState, action) => {
  const currManVert = state.man.vert;
  const currManHor = state.man.hor;
  const nextManVert = state.man.vert + 1;
  const nextManHor = state.man.hor + 1;
  const endGameVert = state.endCoord.vert;
  const endGameHor = state.endCoord.hor;
  const startGameVert = state.startCoord.vert;
  const startGameHor = state.startCoord.hor;
  const isInFieldHor = currManHor < endGameHor && currManHor > startGameHor;
  const isInFieldVert =
    currManVert > startGameVert && currManVert < endGameVert;

  switch (action.type) {
    case "arrowPressed":
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
          isInField = isInFieldVert;

          break;
        case "right":
          isCurrentStepEndHor =
            currManVert === endGameVert && nextManHor === endGameHor;
          isEndGame = isCurrentStepEndHor;
          isInField = isInFieldHor;

          break;
        case "bottom":
          isInField = isInFieldVert;
          break;
        case "left":
          isInField = isInFieldHor;
          break;
        default:
          break;
      }

      /*последний бросок кубика*/
      const isLastDiceThrow = state.dice === 1;

      if (isEndGame) {
        return {
          ...state,
          dice: null,
          gameState: "end",
          diceState: "disable",
          arrowState: "disable",
          gamePhase: "игра окончена",
          man: changeCoord(state, direction),
        };
        /*человек в поле и не последняя цифра кубика*/
      } else if (isInField && !isLastDiceThrow) {
        return {
          ...state,
          dice: state.dice - 1,
          man: changeCoord(state, direction),
        };
      } else if (isInField && isLastDiceThrow) {
        /*человек в поле и последняя цифра кубика*/
        return {
          ...state,
          dice: state.dice - 1,
          man: changeCoord(state, direction),
          gamePhase: "бросить кубик",
          arrowState: "disable",
          diceState: "enable",
        };
      } else {
        /*человек вне поля*/
        return state;
      }

    case "diceThrown":
      return {
        ...state,
        dice: action.payload,
        gamePhase: "сделать ход",
        diceState: "disable",
        arrowState: "enable",
      };

    default:
      return state;
  }
};

function App() {
  const [gamePhase, manHor, manVert] = useSelector((state) => [
    state.gamePhase,
    state.man.hor,
    state.man.vert,
  ]);

  return (
    <>
      <Game>
        <Field>
          <Grid />
        </Field>
        <LeftPanel>
          <Status>{gamePhase}</Status>
          <Status>{`координаты: ${manHor}${manVert}`}</Status>
          {/*  {
            gamePhase === "бросить кубик" ? <Dice /> : <Arrows />
          } */}
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
