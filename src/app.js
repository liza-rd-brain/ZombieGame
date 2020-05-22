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

  /*  &:last-child {
    align-items: flex-end;
 
  } */
`;
const Status = styled.div`
  border: 1px dotted red;
  color: red;
`;

const startText = "бросить кубик";

const initialState = {
  gameState: "start",
  gamePhase: startText,
  startCoord: { hor: 0, vert: 0 },
  endCoord: { hor: 9, vert: 9 },
  man: {
    hor: 0,
    vert: 0,
  },

  mode: 0,
  dice: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "changeCoord":
      return {
        ...state,
        man: action.payload,
      };
    case "changeDice":
      return {
        ...state,
        dice: action.payload,
      };
    case "changeGameState":
      return {
        ...state,
        gamePhase: action.payload,
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
          <Dice />
          <Arrows />
        </LeftPanel>
      </Game>
    </>
  );
}

/* export function GameStatus() {
  const gamePhase = useSelector((state) => state.gamePhase);
  return <Status>{gamePhase}</Status>;
} */

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
