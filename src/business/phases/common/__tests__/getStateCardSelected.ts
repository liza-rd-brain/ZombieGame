import { createConfig } from "../../../../shared/helpers/createConfig";
import { getInitialState } from "../../../initialState";
import { reducer } from "../../../reducer";
import { CardAppearance, State, TypeOfCard } from "../../../types";

const configEmptyField = createConfig();

const initialState = getInitialState(configEmptyField);

test("click on zero card in inventory don`t change state", () => {
  const stateBeforeClick: State = {
    ...initialState,
    gameState: {
      ...initialState.gameState,
      type: "gameStarted.playerMove",
    },
  };

  const stateClickedHealth = reducer(stateBeforeClick, {
    type: "cardChoosed",
    payload: { type: "health" },
  });

  const stateClickedWeapon = reducer(stateBeforeClick, {
    type: "cardChoosed",
    payload: { type: "weapon" },
  });
  const stateClickedBoards = reducer(stateBeforeClick, {
    type: "cardChoosed",
    payload: { type: "boards" },
  });

  expect(stateClickedHealth).toEqual(stateBeforeClick);
  expect(stateClickedWeapon).toEqual(stateBeforeClick);
  expect(stateClickedBoards).toEqual(stateBeforeClick);
});

describe("click on non-zero card in inventory selected/unselected this card", () => {
  it("health card not clicked", () => {
    const stateCardNotSelected = getStateCardNotSelected(
      initialState,
      "health"
    );

    const stateCardSelected = getStateCardSelected(
      stateCardNotSelected,
      "health"
    );

    const newStateClikedHealth = reducer(stateCardNotSelected, {
      type: "cardChoosed",
      payload: { type: "health" },
    });

    const newStateClikedBoards = reducer(stateCardNotSelected, {
      type: "cardChoosed",
      payload: { type: "boards" },
    });

    const newStateClikedWeapon = reducer(stateCardNotSelected, {
      type: "cardChoosed",
      payload: { type: "weapon" },
    });

    expect(newStateClikedHealth).toEqual(stateCardSelected);
    expect(newStateClikedBoards).toEqual(stateCardNotSelected);
    expect(newStateClikedWeapon).toEqual(stateCardNotSelected);
  });

  it("health card clicked,", () => {
    const stateCardNotSelected = getStateCardNotSelected(
      initialState,
      "health"
    );

    const stateCardSelected = getStateCardSelected(
      stateCardNotSelected,
      "health"
    );

    const stateCardUnSelected: State = {
      ...stateCardNotSelected,
      doEffect: { type: "!checkAvailableNeighboringCell" },
    };

    const newStateUnClikedHealth = reducer(stateCardSelected, {
      type: "cardChoosed",
      payload: { type: "health" },
    });

    const newStateClikedBoards = reducer(stateCardSelected, {
      type: "cardChoosed",
      payload: { type: "boards" },
    });

    const newStateClikedWeapon = reducer(stateCardSelected, {
      type: "cardChoosed",
      payload: { type: "weapon" },
    });

    expect(newStateUnClikedHealth).toEqual(stateCardUnSelected);
    expect(newStateClikedBoards).toEqual(stateCardSelected);
    expect(newStateClikedWeapon).toEqual(stateCardSelected);
  });

  it("weapon card not clicked", () => {
    const stateCardNotSelected = getStateCardNotSelected(
      initialState,
      "weapon"
    );

    const stateCardSelected = getStateCardSelected(
      stateCardNotSelected,
      "weapon"
    );

    const newStateClikedWeapon = reducer(stateCardNotSelected, {
      type: "cardChoosed",
      payload: { type: "weapon" },
    });

    const newStateClikedBoards = reducer(stateCardNotSelected, {
      type: "cardChoosed",
      payload: { type: "boards" },
    });

    const newStateClikedHealth = reducer(stateCardNotSelected, {
      type: "cardChoosed",
      payload: { type: "health" },
    });

    expect(newStateClikedWeapon).toEqual(stateCardSelected);
    expect(newStateClikedBoards).toEqual(stateCardNotSelected);
    expect(newStateClikedHealth).toEqual(stateCardNotSelected);
  });

  it("weapon card clicked,", () => {
    const stateCardNotSelected = getStateCardNotSelected(
      initialState,
      "weapon"
    );

    const stateCardSelected = getStateCardSelected(
      stateCardNotSelected,
      "weapon"
    );

    const stateCardUnSelected: State = {
      ...stateCardNotSelected,
      doEffect: { type: "!checkAvailableNeighboringCell" },
    };

    const newStateUnClikedWeapon = reducer(stateCardSelected, {
      type: "cardChoosed",
      payload: { type: "weapon" },
    });

    const newStateClikedBoards = reducer(stateCardSelected, {
      type: "cardChoosed",
      payload: { type: "boards" },
    });

    const newStateClikedHealth = reducer(stateCardSelected, {
      type: "cardChoosed",
      payload: { type: "health" },
    });

    expect(newStateUnClikedWeapon).toEqual(stateCardUnSelected);
    expect(newStateClikedBoards).toEqual(stateCardSelected);
    expect(newStateClikedHealth).toEqual(stateCardSelected);
  });

  it("boards card not clicked", () => {
    const stateCardNotSelected = getStateCardNotSelected(
      initialState,
      "boards"
    );

    const stateCardSelected = getStateCardSelected(
      stateCardNotSelected,
      "boards"
    );

    const newStateClikedBoards = reducer(stateCardNotSelected, {
      type: "cardChoosed",
      payload: { type: "boards" },
    });

    const newStateClikedWeapon = reducer(stateCardNotSelected, {
      type: "cardChoosed",
      payload: { type: "weapon" },
    });

    const newStateClikedHealth = reducer(stateCardNotSelected, {
      type: "cardChoosed",
      payload: { type: "health" },
    });

    expect(newStateClikedBoards).toEqual(stateCardSelected);
    expect(newStateClikedWeapon).toEqual(stateCardNotSelected);
    expect(newStateClikedHealth).toEqual(stateCardNotSelected);
  });

  it("boards card clicked,", () => {
    const stateCardNotSelected = getStateCardNotSelected(
      initialState,
      "boards"
    );

    const stateCardSelected = getStateCardSelected(
      stateCardNotSelected,
      "boards"
    );

    const stateCardUnSelected: State = {
      ...stateCardNotSelected,
      doEffect: { type: "!checkAvailableNeighboringCell" },
    };

    const newStateUnClikedBoards = reducer(stateCardSelected, {
      type: "cardChoosed",
      payload: { type: "boards" },
    });

    const newStateClikedWeapon = reducer(stateCardSelected, {
      type: "cardChoosed",
      payload: { type: "weapon" },
    });

    const newStateClikedHealth = reducer(stateCardSelected, {
      type: "cardChoosed",
      payload: { type: "health" },
    });

    expect(newStateUnClikedBoards).toEqual(stateCardUnSelected);
    expect(newStateClikedWeapon).toEqual(stateCardSelected);
    expect(newStateClikedHealth).toEqual(stateCardSelected);
  });
});

describe("switch select on another card in full inventory", () => {
  it("selected health, click in other cards", () => {
    const stateHealthSelected = getStateFullInvenory(initialState, "health");
    const stateWeaponSelected = getStateFullInvenory(initialState, "weapon");
    const stateBoardsSelected = getStateFullInvenory(initialState, "boards");
    const newStateWeaponClicked = reducer(stateHealthSelected, {
      type: "cardChoosed",
      payload: { type: "weapon" },
    });

    const newStateBoardsClicked = reducer(stateHealthSelected, {
      type: "cardChoosed",
      payload: { type: "boards" },
    });

    expect(newStateWeaponClicked).toEqual(stateWeaponSelected);
    expect(newStateBoardsClicked).toEqual(stateBoardsSelected);
  });

  it("selected weapon, click in other cards", () => {
    const stateWeaponSelected = getStateFullInvenory(initialState, "weapon");
    const stateHealthSelected = getStateFullInvenory(initialState, "health");
    const stateBoardsSelected = getStateFullInvenory(initialState, "boards");

    const newStateHealthClicked = reducer(stateWeaponSelected, {
      type: "cardChoosed",
      payload: { type: "health" },
    });

    const newStateBoardsClicked = reducer(stateWeaponSelected, {
      type: "cardChoosed",
      payload: { type: "boards" },
    });

    expect(newStateHealthClicked).toEqual(stateHealthSelected);
    expect(newStateBoardsClicked).toEqual(stateBoardsSelected);
  });

  it("selected boards, click on other cards", () => {
    const stateBoardsSelected = getStateFullInvenory(initialState, "boards");
    const stateWeaponSelected = getStateFullInvenory(initialState, "weapon");
    const stateHealthSelected = getStateFullInvenory(initialState, "health");

    const newStateHealthClicked = reducer(stateBoardsSelected, {
      type: "cardChoosed",
      payload: { type: "health" },
    });

    const newStateWeaponClicked = reducer(stateBoardsSelected, {
      type: "cardChoosed",
      payload: { type: "weapon" },
    });

    expect(newStateHealthClicked).toEqual(stateHealthSelected);
    expect(newStateWeaponClicked).toEqual(stateWeaponSelected);
  });
});

const getStateCardNotSelected = (
  initialState: State,
  type: TypeOfCard
): State => {
  if (type) {
    return {
      ...initialState,
      gameState: {
        ...initialState.gameState,
        type: "gameStarted.playerMove",
      },
      playerList: {
        [0]: {
          ...initialState.playerList[0],
          inventory: {
            ...initialState.playerList[0].inventory,
            [type]: 1,
            cardSelected: null,
          },
        },
      },
    };
  } else {
    return initialState;
  }
};

const getStateCardSelected = (initialState: State, type: TypeOfCard): State => {
  if (type) {
    return {
      ...initialState,
      gameState: {
        ...initialState.gameState,
        type: "gameStarted.applyCard",
      },
      playerList: {
        [0]: {
          ...initialState.playerList[0],
          inventory: {
            ...initialState.playerList[0].inventory,
            [type]: 1,
            cardSelected: type,
          },
        },
      },
      doEffect: {
        type: "!checkAvailableNeighboringCards",
      },
    };
  } else {
    return initialState;
  }
};

const getStateFullInvenory = (initialState: State, type: TypeOfCard): State => {
  if (type) {
    return {
      ...initialState,
      gameState: {
        ...initialState.gameState,
        type: "gameStarted.applyCard",
      },
      playerList: {
        [0]: {
          ...initialState.playerList[0],
          inventory: {
            boards: 1,
            weapon: 1,
            health: 1,
            cardSelected: type,
          },
        },
      },
      doEffect: {
        type: "!checkAvailableNeighboringCards",
      },
    };
  } else {
    return initialState;
  }
};
