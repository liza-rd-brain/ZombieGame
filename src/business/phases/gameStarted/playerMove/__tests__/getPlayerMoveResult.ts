import { createConfig } from "../../../../../shared/helpers/createConfig";
import { getInitialState } from "../../../../initialState";
import { reducer } from "../../../../reducer";
import { CardApperance, State, TypeOfCard } from "../../../../types";

const configEmptyField = createConfig();
const initialState = getInitialState(configEmptyField);

const commonStateBeforGetResult: State = {
  ...initialState,
  gameState: {
    ...initialState.gameState,
    coordOfAvailableCells: null,
    type: "gameStarted.playerMove",
  },
  dice: 3,
  doEffect: {
    type: "!getPlayerMoveResult",
  },
};

test("move to empty cell", () => {
  const expectedState = {
    ...commonStateBeforGetResult,
    dice: commonStateBeforGetResult.dice - 1,
    gameState: {
      ...commonStateBeforGetResult.gameState,
      type: "gameStarted.playerMove",
    },
    doEffect: { type: "!checkAvailableNeighboringCell" },
  };

  const newState = reducer(commonStateBeforGetResult, {
    type: "req-getPlayerMoveResult",
  });

  expect(newState).toEqual(expectedState);
});

test("player took the finish", () => {
  const stateTakenFinish = {
    ...commonStateBeforGetResult,
    playerList: {
      [0]: {
        ...commonStateBeforGetResult.playerList[0],
        coord: "11.11",
      },
    },
  };

  const expectedStateWithResult = {
    ...stateTakenFinish,
    dice: stateTakenFinish.dice - 1,
    gameResult: "Вы выиграли",
    doEffect: null,
  };

  const stateWithResult = reducer(stateTakenFinish, {
    type: "req-getPlayerMoveResult",
  });

  expect(stateWithResult).toEqual(expectedStateWithResult);
});

describe("player on cell with inventoryCard", () => {
  it("player met boardCard closed", () => {
    const stateMetCard = getStateWithCard(
      commonStateBeforGetResult,
      "boards",
      "closed"
    );
    const expectedState = getStateTakeCard(stateMetCard);
    const newState = reducer(stateMetCard, {
      type: "req-getPlayerMoveResult",
    });

    expect(newState).toEqual(expectedState);
  });

  it("player met boardCard open", () => {
    const stateMetCard = getStateWithCard(
      commonStateBeforGetResult,
      "boards",
      "open"
    );
    const expectedState = getStateTakeCard(stateMetCard);
    const newState = reducer(stateMetCard, {
      type: "req-getPlayerMoveResult",
    });

    expect(newState).toEqual(expectedState);
  });

  it("player met healthCard closed", () => {
    const stateMetCard = getStateWithCard(
      commonStateBeforGetResult,
      "health",
      "closed"
    );
    const expectedState = getStateTakeCard(stateMetCard);
    const newState = reducer(stateMetCard, {
      type: "req-getPlayerMoveResult",
    });

    expect(newState).toEqual(expectedState);
  });

  it("player met healthCard open", () => {
    const stateMetCard = getStateWithCard(
      commonStateBeforGetResult,
      "health",
      "open"
    );
    const expectedState = getStateTakeCard(stateMetCard);
    const newState = reducer(stateMetCard, {
      type: "req-getPlayerMoveResult",
    });

    expect(newState).toEqual(expectedState);
  });

  it("player met weaponCard closed", () => {
    const stateMetCard = getStateWithCard(
      commonStateBeforGetResult,
      "weapon",
      "closed"
    );
    const expectedState = getStateTakeCard(stateMetCard);
    const newState = reducer(stateMetCard, {
      type: "req-getPlayerMoveResult",
    });

    expect(newState).toEqual(expectedState);
  });

  it("player met weaponCard open", () => {
    const stateMetCard = getStateWithCard(
      commonStateBeforGetResult,
      "weapon",
      "open"
    );
    const expectedState = getStateTakeCard(stateMetCard);
    const newState = reducer(stateMetCard, {
      type: "req-getPlayerMoveResult",
    });

    expect(newState).toEqual(expectedState);
  });
});

describe("player met enemy", () => {
  it("enemyCard closed", () => {
    const stateMetEnemy = getStateWithEnemy(
      commonStateBeforGetResult,
      "closed"
    );
    const expectedState = getStateInteracyWithEnemy(stateMetEnemy);
    const newState = reducer(stateMetEnemy, {
      type: "req-getPlayerMoveResult",
    });

    expect(newState).toEqual(expectedState);
  });

  it("enemyCard open", () => {
    const stateMetEnemy = getStateWithEnemy(commonStateBeforGetResult, "open");
    const expectedState = getStateInteracyWithEnemy(stateMetEnemy);
    const newState = reducer(stateMetEnemy, {
      type: "req-getPlayerMoveResult",
    });

    expect(newState).toEqual(expectedState);
  });
});

test("player make last step", () => {
  const stateLastStep = {
    ...commonStateBeforGetResult,
    dice: 1,
  };

  const expectedState = {
    ...commonStateBeforGetResult,
    dice: 0,
    gameState: {
      ...commonStateBeforGetResult.gameState,
      type: "gameStarted.rollDice",
    },
  };

  const newState = reducer(stateLastStep, {
    type: "req-getPlayerMoveResult",
  });

  expect(newState).toEqual(expectedState);
});

const getStateTakeCard = (state: State): State => {
  return {
    ...state,
    dice: state.dice - 1,
    gameState: {
      ...state.gameState,
      type: "gameStarted.takeCard",
    },
    doEffect: { type: "!checkApperanceInventoryCard" },
  };
};

const getStateWithCard = (
  initialState: State,
  type: TypeOfCard,
  apperance: CardApperance
): State => {
  if (type) {
    return {
      ...initialState,
      playerList: {
        [0]: {
          ...initialState.playerList[0],
          coord: "1.1",
        },
      },

      gameField: {
        ...initialState.gameField,
        values: {
          ...initialState.gameField.values,
          ["1.1"]: {
            name: "commonCell",
            cardItem: [
              {
                name: type,
                apperance: apperance,
              },
            ],
          },
        },
      },
    };
  } else {
    return initialState;
  }
};

const getStateWithEnemy = (
  initialState: State,
  apperance: CardApperance
): State => {
  return {
    ...initialState,
    playerList: {
      [0]: {
        ...initialState.playerList[0],
        coord: "1.1",
      },
    },
    enemyList: {
      [1.1]: {
        name: "enemy",
        power: 1,
        coord: "1.1",
        apperance: apperance,
      },
    },
  };
};

const getStateInteracyWithEnemy = (state: State): State => {
  return {
    ...state,
    dice: state.dice - 1,
    gameState: { ...state.gameState, type: "interactWithEnemy" },
    doEffect: { type: "!checkApperanceEnemyCard" },
  };
};
