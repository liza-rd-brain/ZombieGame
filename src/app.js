import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { createStore } from "redux";
import styled, { ThemeProvider } from "styled-components";

import Grid from "./features/Grid";
import Man from "./features/Man";
import Arrows from "./features/Arrows";

const Field = styled.div`
  position: relative;
  width: 300px;
  margin: 0 auto;
`;

const initialState = {
  gameState: "start",
  gamePhase: null,
  startCoord: { hor: 0, vert: 0 },
  endCoord: { hor: 0, vert: 0 },
  man: {
    hor: 0,
    vert: 0,
  },
  /*   manHor,
  manVert, */
  mode: 0,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "changeCoordY":
      console.log(state);
      return {
        ...state,
        man: { ...state.man, vert: state.man.vert + action.payload },
      };
    case "changeCoordX":
      console.log(state);
      return {
        ...state,
        man: { ...state.man, hor: state.man.hor + action.payload },
      };
    default:
      return state;
  }
};
function App() {
  return (
    <>
      <Field>
        <Grid />
        <Man />
      </Field>
      <Arrows />
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
