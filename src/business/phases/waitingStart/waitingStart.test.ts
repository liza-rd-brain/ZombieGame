import { initialState } from "../../initialState";
import { reducer } from "../../reducer";

test("click on button should switch state of game to gameStarted.rollDice", () => {
  const newState = {
    ...initialState,
    gameState: { ...initialState.gameState, type: "gameStarted.rollDice" },
  };

  const stateclickedStartButton = reducer(initialState, {
    type: "clickedStartButton",
  });

  expect(stateclickedStartButton).toEqual(newState);
});
