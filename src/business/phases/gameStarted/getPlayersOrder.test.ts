import { initialState } from "../../initialState";
import { reducer } from "../../reducer";
import { State } from "../../types";

test("should change playersOrder", () => {
  const stateZeroPlayer: State = {
    ...initialState,

    gameState: {
      ...initialState.gameState,
      type: "gameStarted.getPlayersOrder",
    },

    playerList: {
      "0": {
        name: "player",
        health: 3,
        orderNumber: 0,
        coord: "4.7",
        inventory: { boards: 0, weapon: 0, health: 0, cardSelected: null },
      },

      "1": {
        name: "player",
        health: 3,
        orderNumber: 1,
        coord: "4.6",
        inventory: { boards: 0, weapon: 0, health: 0, cardSelected: null },
      },
    },

    activePlayerNumber: 0,
  };

  const stateSwitchToFirstPlayer = reducer(stateZeroPlayer, {
    type: "req-getNextPlayer",
  });

  expect(stateSwitchToFirstPlayer.activePlayerNumber).toBe(1);

  expect(stateSwitchToFirstPlayer.gameState.type).toEqual(
    "gameStarted.rollDice"
  );

  const stateFirstPlayer: State = { ...stateZeroPlayer, activePlayerNumber: 1 };

  const stateswitchToZeroPlayer = reducer(stateFirstPlayer, {
    type: "req-getNextPlayer",
  });

  expect(stateswitchToZeroPlayer.activePlayerNumber).toBe(0);

  expect(stateswitchToZeroPlayer.gameState.type).toEqual(
    "gameStarted.rollDice"
  );
});
