import {
  State,
  PlayerListType,
  AvailableCellListType,
  MoveDirection,
} from "../../types";
import { ActionType } from "../../reducer";

import { getStateCardSelected } from "./getStateCardSelected";
import { getNeighboringCellList } from "./getNeighboringCellList";
import { canInteractWithCell } from "./canInteractWithCell";

/**
 *  In payload get order number of chosen for interact player.
 * If this number = indexCurrPlayer we heal player.
 * If not - we give context menu: need heal or apply.
 */
export const applyCard = (action: ActionType, state: State): State => {
  const { numberOfPlayer, playerList } = state;
  const [, , phaseInner] = state.gameState.type.split(".");

  const chosenCardType = playerList[numberOfPlayer].inventory.find((card) => {
    return card?.isSelected === true;
  })?.name;

  switch (chosenCardType) {
    case "health": {
      switch (action.type) {
        case "req-healPlayer": {
          /**
           * Need to increase playerHealth
           * Then remove card from inventory
           * Can we do this simultaneously?
           */

          const indexChosenPlayer = action.payload;
          const isCurrPlayer = indexChosenPlayer === numberOfPlayer;

          switch (isCurrPlayer) {
            case true:
              return getStateHealCurrPlayer(state);

            case false: {
              return getStateHealAnotherPlayer(state, indexChosenPlayer);
            }
            default:
              return state;
          }
        }

        case "req-shareHealthCard": {
          const recipientPlayerNumber = action.payload;
          return getStateGiveHealthCard(state, recipientPlayerNumber);
        }
        case "cardChoosed": {
          const target = action.payload;
          return getStateCardSelected(state, target);
        }

        default:
          return state;
      }
    }
    case "boards": {
      switch (action.type) {
        case "cardChoosed": {
          const target = action.payload;
          return getStateCardSelected(state, target);
        }

        case "req-fillHole": {
          const { coord, direction } = action.payload;
          console.log("заполнить проем", coord, direction);
          return getStateHoleFilled(state, coord, direction);
        }

        default:
          return state;
      }
    }
    default:
      return state;
  }
};

const getStateGiveHealthCard = (
  state: State,
  recipientPlayerNumber: number
): State => {
  const { playerList, numberOfPlayer } = state;
  const indexCurrPlayer = numberOfPlayer;

  const currentPlayerInventory = playerList[indexCurrPlayer].inventory;
  const recepientPlayerInventory = playerList[recipientPlayerNumber].inventory;

  const sharedCardIndex = playerList[indexCurrPlayer].inventory.findIndex(
    (card) => {
      return card?.name === "health";
    }
  );
  const sharedCard = [...currentPlayerInventory][sharedCardIndex];
  const sharedCardWithoutHighlightning = { ...sharedCard, isSelected: false };

  const newCurrentPlayerInventory = currentPlayerInventory.filter(
    (card, indexOfCard) => {
      return indexOfCard !== sharedCardIndex;
    }
  );

  const newRecepientPlayerInventory = [
    ...recepientPlayerInventory,
    sharedCardWithoutHighlightning,
  ];

  const newPlayerList = {
    ...playerList,
    [indexCurrPlayer]: {
      ...playerList[indexCurrPlayer],
      inventory: newCurrentPlayerInventory,
    },
    [recipientPlayerNumber]: {
      ...playerList[recipientPlayerNumber],
      inventory: newRecepientPlayerInventory,
    },
  };

  return {
    ...state,
    playerList: newPlayerList,
    gameState: { type: "gameStarted.playerMove" },
  };
};

const getStateHealCurrPlayer = (state: State): State => {
  const { playerList, numberOfPlayer } = state;
  const indexCurrPlayer = numberOfPlayer;
  const newHealth = changeHealth(playerList, indexCurrPlayer);
  const newInventory = deleteSelectedCard(playerList, numberOfPlayer);
  const newPlayerList: PlayerListType = {
    ...playerList,
    [indexCurrPlayer]: {
      ...playerList[indexCurrPlayer],
      inventory: newInventory,
      health: newHealth,
    },
  };

  return {
    ...state,
    playerList: newPlayerList,
    gameState: { type: "gameStarted.playerMove" },
  };
};

const getStateHealAnotherPlayer = (
  state: State,
  indexChosenPlayer: number
): State => {
  const { playerList, numberOfPlayer } = state;
  const indexCurrPlayer = numberOfPlayer;
  const newInventory = deleteSelectedCard(playerList, numberOfPlayer);
  const newHealth = changeHealth(playerList, indexChosenPlayer);

  const newPlayerList: PlayerListType = {
    ...playerList,
    [indexChosenPlayer]: {
      ...playerList[indexChosenPlayer],
      health: newHealth,
    },
    [indexCurrPlayer]: {
      ...playerList[indexCurrPlayer],
      inventory: newInventory,
    },
  };

  return {
    ...state,
    playerList: newPlayerList,
    gameState: { type: "gameStarted.playerMove" },
  };
};

const getStateHoleFilled = (
  state: State,
  coord: number,
  direction: MoveDirection
) => {
  const { gameField, playerList, numberOfPlayer } = state;
  const indexCurrPlayer = numberOfPlayer;
  const newInventory = deleteSelectedCard(playerList, numberOfPlayer);
  const cellWithChosedHole = gameField.values[coord];

  if (cellWithChosedHole.name === "commonCell") {
    const barriersWithClosedHole = cellWithChosedHole.barrierList?.map(
      (barrier) => {
        if (barrier.direction === direction) {
          return { ...barrier, isOpen: false };
        } else return barrier;
      }
    );

    const newGameField = {
      ...gameField,
      values: {
        ...gameField.values,
        [coord]: {
          ...gameField.values[coord],
          barrierList: barriersWithClosedHole,
        },
      },
    };

    const newPlayerList: PlayerListType = {
      ...playerList,
      [indexCurrPlayer]: {
        ...playerList[indexCurrPlayer],
        inventory: newInventory,
      },
    };
    const newState: State = {
      ...state,
      gameField: newGameField,
      playerList: newPlayerList,
      gameState: { type: "gameStarted.playerMove" },
    };
    return newState;
  } else {
    return state;
  }
};

const changeHealth = (playerList: PlayerListType, indexTarget: number) => {
  return playerList[indexTarget].health + 1;
};

const deleteSelectedCard = (
  playerList: PlayerListType,
  numberOfPlayer: number
) => {
  const indexCurrPlayer = numberOfPlayer;
  const currInventory = playerList[indexCurrPlayer].inventory;

  const removedCardIndex = playerList[indexCurrPlayer].inventory.findIndex(
    (card) => {
      return card?.isSelected === true;
    }
  );

  const newInventory = currInventory.filter((card, indexOfCard) => {
    return indexOfCard !== removedCardIndex;
  });
  return newInventory;
};
