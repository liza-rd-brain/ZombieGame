import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { createStore } from "redux";
import styled, { ThemeProvider } from "styled-components";

import Grid from "./features/Grid";
/* import Man from "./features/Man"; */
import Arrows from "./features/Arrows";

const Field = styled.div`
  position: relative;
  width: 300px;
  margin: 0 auto;
`;

const Game = styled.div`
  width: 500px;
  margin: 0 auto;
  display: flex;

  &:last-child {
    align-items: flex-end;
    /*  background-color: gold; */
  }
`;

const initialState = {
  gameState: "start",
  gamePhase: null,
  startCoord: { hor: 0, vert: 0 },
  endCoord: { hor: 9, vert: 9 },
  man: {
    hor: 0,
    vert: 0,
  },

  mode: 0,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "changeCoord":
      console.log(state);
      return {
        ...state,
        man: action.payload,
      };
    default:
      return state;
  }
};
function App() {
  return (
    <>
      <Game>
        <Field>
          <Grid />
          {/*   <Man /> */}
        </Field>
        <Arrows />
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
