import { createConfig } from "../../../../../shared/helpers/createConfig";
import { getInitialState } from "../../../../initialState";
import { reducer } from "../../../../reducer";
import { State } from "../../../../types";

describe("player move on the field without Barriers", () => {
  const configEmptyField = createConfig({ startCoord: { hor: 1, vert: 1 } });

  const initialState = getInitialState(configEmptyField);

  const stateBeforeMove: State = {
    ...initialState,
    gameState: {
      ...initialState.gameState,
      coordOfAvailableCells: ["0.1", "1.0", "1.2", "2.1"],
      type: "gameStarted.playerMove",
    },
    dice: 3,
  };

  const newPlayerCoordTop = "1.2";
  const newPlayerCoordBottom = "1.0";
  const newPlayerCoordLeft = "0.1";
  const newPlayerCoordRight = "2.1";

  const stateMovedTop = reducer(stateBeforeMove, {
    type: "playerMoved",
    payload: "top",
  });

  const stateMovedBottom = reducer(stateBeforeMove, {
    type: "playerMoved",
    payload: "bottom",
  });

  const stateMovedLeft = reducer(stateBeforeMove, {
    type: "playerMoved",
    payload: "left",
  });

  const stateMovedRight = reducer(stateBeforeMove, {
    type: "playerMoved",
    payload: "right",
  });

  it("should test that player can move on cell from coordOfAvailableCells", () => {
    expect(stateMovedTop.playerList[0].coord).toBe(newPlayerCoordTop);
    expect(stateMovedBottom.playerList[0].coord).toBe(newPlayerCoordBottom);
    expect(stateMovedLeft.playerList[0].coord).toBe(newPlayerCoordLeft);
    expect(stateMovedRight.playerList[0].coord).toBe(newPlayerCoordRight);
  });

  it("should test that doEffect switch to getPlayerMoveResult", () => {
    expect(stateMovedTop.doEffect).toEqual({
      type: "!getPlayerMoveResult",
    });

    expect(stateMovedBottom.doEffect).toEqual({
      type: "!getPlayerMoveResult",
    });

    expect(stateMovedLeft.doEffect).toEqual({
      type: "!getPlayerMoveResult",
    });

    expect(stateMovedRight.doEffect).toEqual({
      type: "!getPlayerMoveResult",
    });
  });
});

describe("player can move through open windows and walls", () => {
  const configOpenBarriers = createConfig({
    cellsBarrierList: [
      {
        coord: { hor: 1, vert: 2 },
        barrierList: [
          {
            name: "door",
            direction: "bottom",
            isOpen: true,
          },
        ],
      },
      {
        coord: { hor: 2, vert: 1 },
        barrierList: [
          {
            name: "window",
            direction: "left",
            isOpen: true,
          },
        ],
      },
    ],
  });

  const initialState = getInitialState(configOpenBarriers);

  const stateWithPlayerOnField: State = {
    ...initialState,
    gameState: {
      ...initialState.gameState,
      coordOfAvailableCells: ["0.1", "1.0", "1.2", "2.1"],
      type: "gameStarted.playerMove",
    },
    playerList: {
      ...initialState.playerList,
      0: {
        ...initialState.playerList[0],
        coord: "1.1",
      },
    },
    dice: 3,
  };

  const stateMovedLeft = reducer(stateWithPlayerOnField, {
    type: "playerMoved",
    payload: "right",
  });

  const stateMovedTop = reducer(stateWithPlayerOnField, {
    type: "playerMoved",
    payload: "top",
  });

  const newCoordMovedRight = "2.1";
  const newCoordMovedTop = "1.2";

  expect(stateMovedLeft.playerList[0].coord).toBe(newCoordMovedRight);
  expect(stateMovedTop.playerList[0].coord).toBe(newCoordMovedTop);
});

describe("player can`t move through closed windows and doors", () => {
  const currentPlayerCoord = "1.1";

  const configClosedBarriers = createConfig({
    cellsBarrierList: [
      {
        coord: { hor: 1, vert: 2 },
        barrierList: [
          {
            name: "door",
            direction: "bottom",
            isOpen: false,
          },
        ],
      },
      {
        coord: { hor: 2, vert: 1 },
        barrierList: [
          {
            name: "window",
            direction: "left",
            isOpen: false,
          },
        ],
      },
    ],
  });

  const initialState = getInitialState(configClosedBarriers);

  const stateWithPlayerOnField: State = {
    ...initialState,
    gameState: {
      ...initialState.gameState,
      coordOfAvailableCells: ["0.1", "1.0"],
      type: "gameStarted.playerMove",
    },
    playerList: {
      ...initialState.playerList,
      0: {
        ...initialState.playerList[0],
        coord: currentPlayerCoord,
      },
    },
    dice: 3,
  };

  const stateMovedLeft = reducer(stateWithPlayerOnField, {
    type: "playerMoved",
    payload: "right",
  });

  const stateMovedTop = reducer(stateWithPlayerOnField, {
    type: "playerMoved",
    payload: "top",
  });

  expect(stateMovedLeft.playerList[0].coord).toBe(currentPlayerCoord);
  expect(stateMovedTop.playerList[0].coord).toBe(currentPlayerCoord);
});

test("player can`t move through walls", () => {
  const currentPlayerCoord = "1.1";

  const configWithWalls = createConfig({
    cellsBarrierList: [
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
            name: "wall",
            direction: "bottom",
          },
        ],
      },
      {
        coord: { hor: 2, vert: 1 },
        barrierList: [
          {
            name: "wall",
            direction: "left",
          },
        ],
      },
    ],
  });

  const initialState = getInitialState(configWithWalls);

  const stateWithPlayerOnField: State = {
    ...initialState,
    gameState: {
      ...initialState.gameState,
      coordOfAvailableCells: [],
      type: "gameStarted.playerMove",
    },
    playerList: {
      ...initialState.playerList,
      0: {
        ...initialState.playerList[0],
        coord: currentPlayerCoord,
      },
    },
    dice: 3,
  };

  const stateMovedTop = reducer(stateWithPlayerOnField, {
    type: "playerMoved",
    payload: "top",
  });

  const stateMovedBottom = reducer(stateWithPlayerOnField, {
    type: "playerMoved",
    payload: "bottom",
  });

  const stateMovedLeft = reducer(stateWithPlayerOnField, {
    type: "playerMoved",
    payload: "left",
  });

  const stateMovedRight = reducer(stateWithPlayerOnField, {
    type: "playerMoved",
    payload: "right",
  });

  expect(stateMovedLeft.playerList[0].coord).toBe(currentPlayerCoord);
  expect(stateMovedRight.playerList[0].coord).toBe(currentPlayerCoord);
  expect(stateMovedBottom.playerList[0].coord).toBe(currentPlayerCoord);
  expect(stateMovedTop.playerList[0].coord).toBe(currentPlayerCoord);
});

test("should check that player can`t move on cell if it last step and cell is occupied", () => {
  const notTakableCoord = "0.1";
  const currentPlayerCoord = "1.1";

  const configWithTwoPlayers = createConfig({
    amountPlayers: 2,
    startCoord: { hor: 1, vert: 1 },
  });
  const initialState = getInitialState(configWithTwoPlayers);

  const stateBeforeLastStep: State = {
    ...initialState,
    dice: 1,
    gameState: {
      ...initialState.gameState,
      coordOfAvailableCells: ["1.0", "1.2", "2.1"],
      type: "gameStarted.playerMove",
    },

    playerList: {
      ...initialState.playerList,
      "1": {
        ...initialState.playerList[1],
        coord: notTakableCoord,
      },
    },
  };

  const stateAfterMove = reducer(stateBeforeLastStep, {
    type: "playerMoved",
    payload: "left",
  });

  expect(stateAfterMove.playerList[0].coord).toEqual(currentPlayerCoord);
});
