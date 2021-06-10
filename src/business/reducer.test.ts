import { initialState } from "./initialState";
import { ActionType, reducer } from "./reducer";
import { waitingStart } from "./phases/waitingStart/index";

import {
  playerMove,
  takeCard,
  trownDice,
  interactWithEnemy,
  applyCard,
  getPlayersOrder,
} from "./phases/gameStarted";

import { getNeighboringCellList } from "./phases/common";
import { getAvailableCells } from "./phases/gameStarted/playerMove";
import { State, CellType, BarrierList, BarrierItem, CommonCell } from "./types";

test("test initial state", () => {
  const newState = reducer(initialState, {} as any);
  expect(newState).toEqual(initialState);
});

test("should change playersOrder", () => {
  const stateZeroPlayer: State = {
    ...initialState,
    gameState: { type: "gameStarted.getPlayersOrder" },
    playerList: {
      "0": {
        name: "player",
        health: 3,
        orderNumber: 0,
        coord: "4.7",
        inventory: [],
      },
      "1": {
        name: "player",
        health: 3,
        orderNumber: 1,
        coord: "4.6",
        inventory: [],
      },
    },
    numberOfPlayer: 0,
  };

  const stateSwitchToFirstPlayer = reducer(stateZeroPlayer, {
    type: "req-getNextPlayer",
  });

  expect(stateSwitchToFirstPlayer.numberOfPlayer).toBe(1);
  expect(stateSwitchToFirstPlayer.gameState).toEqual({
    type: "gameStarted.trownDice",
  });

  const stateFirstPlayer: State = { ...stateZeroPlayer, numberOfPlayer: 1 };

  const stateswitchToZeroPlayer = reducer(stateFirstPlayer, {
    type: "req-getNextPlayer",
  });

  expect(stateswitchToZeroPlayer.numberOfPlayer).toBe(0);
  expect(stateswitchToZeroPlayer.gameState).toEqual({
    type: "gameStarted.trownDice",
  });
});

describe("test player can move on next cell", () => {
  const stateBeforeMove: State = {
    ...initialState,
    gameState: {
      type: "gameStarted.playerMove",
    },
    dice: 3,
    doEffect: {
      type: "!checkAvailableNeighboringCell",
    },
    availableCellsCoords: ["4.7", "5.6", "4.5", "3.6"],
    numberOfPlayer: 0,
    playerList: {
      "0": {
        name: "player",
        health: 3,
        orderNumber: 0,
        coord: "4.6",
        inventory: [],
      },
      "1": {
        name: "player",
        health: 3,
        orderNumber: 0,
        coord: "4.7",
        inventory: [],
      },
    },
  };

  const newPlayerCoord = "4.7";
  const oldPlayerCoord = "4.6";

  it("should check that player can move through open door and window", () => {
    const openBarrierList: BarrierList = [
      {
        name: "door",
        direction: "bottom",
        isOpen: true,
      },
      {
        name: "window",
        direction: "bottom",
        isOpen: true,
      },
    ];

    openBarrierList.map((barrier) => {
      const stateWithBarrier: State = createStateWithBarrier(
        barrier,
        stateBeforeMove,
        newPlayerCoord
      );

      const newState = reducer(stateWithBarrier, {
        type: "playerMoved",
        payload: "top",
      });

      const playerCoord = newState.playerList[newState.numberOfPlayer].coord;
      const currentCell = newState.gameField.values[playerCoord];

      const noteExpectedBarrier: BarrierList = [
        {
          ...barrier,
          isOpen: false,
        },
      ];

      expect(
        currentCell.name === "commonCell" && currentCell.barrierList
      ).toBeTruthy();

      //expect that correctly changing coordinate
      expect(playerCoord).toBe(newPlayerCoord);

      //expect that door not closed
      if (currentCell.name === "commonCell" && currentCell.barrierList) {
        const barrierList = currentCell.barrierList;
        expect(barrierList).toEqual(
          expect.not.arrayContaining(noteExpectedBarrier)
        );
      }
    });
  });

  it("should check that player can`t move through closed door/window and wall", () => {
    const closeBarrierList: BarrierList = [
      {
        name: "door",
        direction: "bottom",
        isOpen: false,
      },
      {
        name: "window",
        direction: "bottom",
        isOpen: false,
      },
      //TODO: Need to correct isOpen. Wall can`t be open!
      {
        name: "wall",
        direction: "bottom",
        isOpen: true,
      },
      {
        name: "wall",
        direction: "bottom",
        isOpen: false,
      },
    ];

    const stateWithoutUnAnvailableCells = {
      ...stateBeforeMove,
      availableCellsCoords: ["5.6", "4.5", "3.6"],
    };

    closeBarrierList.map((barrier) => {
      const stateWithBarrier: State = createStateWithBarrier(
        barrier,
        stateWithoutUnAnvailableCells,
        newPlayerCoord
      );

      const newState = reducer(stateWithBarrier, {
        type: "playerMoved",
        payload: "top",
      });

      const playerCoord = newState.playerList[newState.numberOfPlayer].coord;
      const unTakenCell = newState.gameField.values[newPlayerCoord];
      console.log(playerCoord);
      //expect that player coordinate doesn`t  change
      expect(playerCoord).toBe(oldPlayerCoord);

      expect(
        unTakenCell.name === "commonCell" && unTakenCell.barrierList
      ).toBeTruthy();

      //expect that barrier dosn`t dissapear
      if (unTakenCell.name === "commonCell" && unTakenCell.barrierList) {
        const barrierList = unTakenCell.barrierList;
        expect(barrierList).toEqual(expect.arrayContaining([barrier]));
      }
    });
  });

  it("should check that player can`t move on non-existent cell", () => {
    const stateNextCellNonExistent: State = {
      ...initialState,
      gameState: {
        type: "gameStarted.playerMove",
      },
      dice: 3,
      doEffect: {
        type: "!checkAvailableNeighboringCell",
      },
      availableCellsCoords: ["0.7", "0.5", "1.6"],
      numberOfPlayer: 0,
      playerList: {
        "0": {
          name: "player",
          health: 3,
          orderNumber: 0,
          coord: "0.6",
          inventory: [],
        },
      },
    };

    const newState = reducer(stateNextCellNonExistent, {
      type: "playerMoved",
      payload: "left",
    });

    //expect that state doesn`t  change
    expect(newState).toEqual(stateNextCellNonExistent);
  });

  it("should check that player can`t move on cell if it last step and cell is occupied", () => {
    const stateOfLastStep = {
      ...stateBeforeMove,
      dice: 1,
      availableCellsCoords: ["5.6", "4.5", "3.6"],
    };

    const newState = reducer(stateOfLastStep, {
      type: "playerMoved",
      payload: "top",
    });
    //expect that state doesn`t  change
    expect(newState).toEqual(stateOfLastStep);
  });
});

const createStateWithBarrier = (
  barrier: BarrierItem,
  state: State,
  currentPlayerCoord: string
): State => {
  const newState: State = {
    ...state,
    gameField: {
      ...state.gameField,
      values: {
        ...state.gameField.values,
        [currentPlayerCoord]: {
          ...state.gameField.values[currentPlayerCoord],
          name: "commonCell",
          barrierList: [barrier],
        },
      },
    },
  };
  return newState;
};
