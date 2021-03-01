/* import state from "./initialState"; */

import { GameState, GameList, TypeEffect, State } from "./types";
import { reducer } from "./reducer";
import { createStore, compose } from "redux";
export const store = createStore(
  reducer,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);
/* 
export const initialState: State = state; */
