import { createConfig } from "../../../../../shared/helpers/createConfig";
import { getInitialState } from "../../../../initialState";
import { reducer } from "../../../../reducer";
import { CellsBarrierListType, State } from "../../../../types";

const getStateWithoutAvailableCells = (initialState: State): State => {
  return {
    ...initialState,
    gameState: {
      ...initialState.gameState,
      type: "gameStarted.playerMove",
    },
    dice: 2,
    doEffect: { type: "!checkAvailableNeighboringCell" },
  };
};

describe("test getting coordOfAvailableCells,field without Barriers", () => {
  const configEmptyField = createConfig({ startCoord: { hor: 1, vert: 1 } });

  const initialState = getInitialState(configEmptyField);

  const stateWithoutAvailableCells =
    getStateWithoutAvailableCells(initialState);

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

  it("should check that the available cells don`t contain cell with player if it last step ", () => {
    const notExpectedCoord = "0.1";

    const configWithTwoPlayers = createConfig({ amountPlayers: 2 });
    const initialState = getInitialState(configWithTwoPlayers);

    const stateBeforeLastStep: State = {
      ...stateWithoutAvailableCells,
      dice: 1,
      playerList: {
        ...stateWithoutAvailableCells.playerList,
        "1": {
          ...initialState.playerList[1],
          coord: notExpectedCoord,
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

describe("test getting coordOfAvailableCells,field with Barriers", () => {
  it("should check that the available cells don`t contain cells behind the wall, but contain behind open door and window", () => {
    const configWithBarriers = createConfig({
      cellsBarrierList: getBarrieredCell(true),
    });

    const initialState = getInitialState(configWithBarriers);

    const stateWithPlayerOnField = {
      ...initialState,
      playerList: {
        ...initialState.playerList,
        0: {
          ...initialState.playerList[0],
          coord: "1.1",
        },
      },
    };

    const stateWithoutAvailableCells = getStateWithoutAvailableCells(
      stateWithPlayerOnField
    );

    const coordOfAvailableCells = ["1.2", "2.1"];

    const stateWithAvailableCell = reducer(stateWithoutAvailableCells, {
      type: "req-checkAvailableNeighboringCell",
    });

    expect(stateWithAvailableCell.gameState.coordOfAvailableCells).toEqual(
      coordOfAvailableCells
    );
  });

  it("should check that the available cells don`t contain cells behind the wall, closed door and window", () => {
    const configWithBarriers = createConfig({
      cellsBarrierList: getBarrieredCell(false),
    });

    const initialState = getInitialState(configWithBarriers);

    const stateWithPlayerStuck = {
      ...initialState,
      playerList: {
        ...initialState.playerList,
        0: {
          ...initialState.playerList[0],
          coord: "1.1",
        },
      },
    };

    const stateWithoutAvailableCells =
      getStateWithoutAvailableCells(stateWithPlayerStuck);

    const coordOfAvailableCells: string[] = [];

    const stateWithAvailableCell = reducer(stateWithoutAvailableCells, {
      type: "req-checkAvailableNeighboringCell",
    });

    expect(stateWithAvailableCell.gameState.coordOfAvailableCells).toEqual(
      coordOfAvailableCells
    );
  });
});

const getBarrieredCell = (isOpen: boolean): CellsBarrierListType => {
  return [
    {
      coord: { hor: 1, vert: 1 },
      barrierList: [
        {
          name: "wall",
          direction: "bottom",
        },
        {
          name: "wall",
          direction: "left",
        },
      ],
    },
    {
      coord: { hor: 1, vert: 2 },
      barrierList: [
        {
          name: "door",
          direction: "bottom",
          isOpen,
        },
      ],
    },
    {
      coord: { hor: 2, vert: 1 },
      barrierList: [
        {
          name: "window",
          direction: "left",
          isOpen,
        },
      ],
    },
  ];
};
