import { createConfig } from "../../../../shared/helpers/createConfig";
import { getInitialState } from "../../../initialState";
import { reducer } from "../../../reducer";
import { State } from "../../../types";

test("should shange dice to payload,gameState.type to gameStarted.playerMove and doEffect.type to'!checkAvailableNeighboringCell '", () => {
  const config = createConfig();

  const initialState = getInitialState(config);

  const stateBeforeThrownDice: State = {
    ...initialState,
    gameState: {
      ...initialState.gameState,
      type: "gameStarted.rollDice",
    },
    activePlayerNumber: 0,
  };

  const newState = {
    ...stateBeforeThrownDice,
    dice: 3,
    gameState: {
      ...stateBeforeThrownDice.gameState,
      type: "gameStarted.playerMove",
    },
    doEffect: { type: "!checkAvailableNeighboringCell" },
  };

  const stateDiceThrown = reducer(stateBeforeThrownDice, {
    type: "diceThrown",
    payload: 3,
  });

  expect(stateDiceThrown).toEqual(newState);
});
