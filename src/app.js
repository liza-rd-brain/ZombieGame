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
    hor: 0,
    vert: 0,
  },
  diceState: "enable",
  arrowState: "disable",
  mode: 0,
  dice: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    /*__________Вариант 1 setCoord___________*/

    case "setCoord":
      switch (action.payload) {
        case "top":
          if (state.man.vert < state.endCoord.vert) {
            return state.dice === 1
              ? {
                  ...state,
                  dice: state.dice - 1,
                  man: {
                    hor: state.man.hor,
                    vert: state.man.vert + 1,
                  },
                  gamePhase: "бросить кубик",
                  arrowState: "disable",
                  diceState: "enable",
                }
              : {
                  ...state,
                  dice: state.dice - 1,
                  man: {
                    hor: state.man.hor,
                    vert: state.man.vert + 1,
                  },
                };
          } else {
            return state;
          }

        case "bottom":
          if (state.man.vert > state.startCoord.vert) {
            return state.dice === 1
              ? {
                  ...state,
                  dice: state.dice - 1,
                  man: {
                    hor: state.man.hor,
                    vert: state.man.vert - 1,
                  },
                  gamePhase: "бросить кубик",
                  arrowState: "disable",
                  diceState: "enable",
                }
              : {
                  ...state,
                  dice: state.dice - 1,
                  man: {
                    hor: state.man.hor,
                    vert: state.man.vert - 1,
                  },
                };
          } else {
            return state;
          }

        case "right":
          if (state.man.hor < state.endCoord.hor) {
            return state.dice === 1
              ? {
                  ...state,
                  dice: state.dice - 1,
                  man: {
                    hor: state.man.hor + 1,
                    vert: state.man.vert,
                  },
                  gamePhase: "бросить кубик",
                  arrowState: "disable",
                  diceState: "enable",
                }
              : {
                  ...state,
                  dice: state.dice - 1,
                  man: {
                    hor: state.man.hor + 1,
                    vert: state.man.vert,
                  },
                };
          } else {
            return state;
          }

        case "left":
          if (state.man.hor > state.startCoord.hor) {
            return state.dice === 1
              ? {
                  ...state,
                  dice: state.dice - 1,
                  man: {
                    hor: state.man.hor - 1,
                    vert: state.man.vert,
                  },
                  gamePhase: "бросить кубик",
                  arrowState: "disable",
                  diceState: "enable",
                }
              : {
                  ...state,
                  dice: state.dice - 1,
                  man: {
                    hor: state.man.hor - 1,
                    vert: state.man.vert,
                  },
                };
          } else {
            return state;
          }

        default:
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
