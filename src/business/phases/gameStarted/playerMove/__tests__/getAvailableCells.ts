import { initialState } from "../../../../initialState";
import { reducer } from "../../../../reducer";
import { State } from "../../../../types";

describe("test getting coordOfAvailableCells ", () => {
  const stateWithoutAvailableCells: State = {
    ...initialState,
    gameState: {
      ...initialState.gameState,
      type: "gameStarted.playerMove",
    },
    playerList: {
      "0": {
        name: "player",
        health: 3,
        orderNumber: 0,
        coord: "1.1",
        inventory: {
          boards: 0,
          weapon: 1,
          health: 0,
          cardSelected: null,
        },
      },
    },
    dice: 2,
    doEffect: { type: "!checkAvailableNeighboringCell" },
    activePlayerNumber: 0,
  };

  const stateWithAvailableCell = reducer(stateWithoutAvailableCells, {
    type: "req-checkAvailableNeighboringCell",
  });

  it("should return available cell for moving", () => {
    const coordOfAvailableCells = ["1.2", "2.1", "1.0", "0.1"];

    expect(stateWithAvailableCell.gameState.coordOfAvailableCells).toEqual(
      coordOfAvailableCells
    );
  });

  it("doEffect should switch to null", () => {
    expect(stateWithAvailableCell.doEffect).toBeNull();
  });

  it("should check that the available cells don`t contain cells behind the wall", () => {
    const stateHasWallsAround = {
      ...stateWithoutAvailableCells,
      playerList: {
        ...stateWithoutAvailableCells.playerList,
        "0": { ...stateWithoutAvailableCells.playerList[0], coord: "2.2" },
      },
    };

    const coordOfAvailableCells = ["2.3", "3.2"];

    const stateWithAvailableCell = reducer(stateHasWallsAround, {
      type: "req-checkAvailableNeighboringCell",
    });

    expect(stateWithAvailableCell.gameState.coordOfAvailableCells).toEqual(
      coordOfAvailableCells
    );
  });

  it("should check that the available cells don`t contain cell with player if it last step  ", () => {
    const notExpectedCoord = "0.1";

    const stateBeforeLastStep: State = {
      ...stateWithoutAvailableCells,
      dice: 1,
      playerList: {
        ...stateWithoutAvailableCells.playerList,
        "1": {
          name: "player",
          health: 3,
          orderNumber: 1,
          coord: notExpectedCoord,
          inventory: {
            boards: 0,
            weapon: 1,
            health: 0,
            cardSelected: null,
          },
        },
      },
    };

    const stateWithAvailableCell = reducer(stateBeforeLastStep, {
      type: "req-checkAvailableNeighboringCell",
    });

    expect(stateWithAvailableCell.gameState.coordOfAvailableCells).toEqual(
      expect.not.arrayContaining([notExpectedCoord])
    );
  });
});
