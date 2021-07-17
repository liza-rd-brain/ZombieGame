/* import { initialState } from "../../initialState"; */

import { createConfig } from "../../../shared/helpers/createConfig";
import { reducer } from "../../reducer";
import { getInitialState } from "../../initialState";

test("click on button should switch state of game to gameStarted.rollDice", () => {
  const config = createConfig();

  const initialState = getInitialState(config);

  const newState = {
    ...initialState,
    gameState: { ...initialState.gameState, type: "gameStarted.rollDice" },
  };

  const stateclickedStartButton = reducer(initialState, {
    type: "clickedStartButton",
  });

  expect(stateclickedStartButton).toEqual(newState);
});
