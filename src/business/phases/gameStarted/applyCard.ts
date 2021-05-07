import { State, PlayerListType, AvailableCellListType } from "../../types";
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
  const { numberOfPlayer } = state;
  const [, , phaseInner] = state.gameState.type.split(".");
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
  const currInventory = playerList[indexCurrPlayer].inventory;

  const removedCardIndex = playerList[indexCurrPlayer].inventory.findIndex(
    (card) => {
      return card?.name === "health";
    }
  );
  const newInventory = currInventory.filter((card, indexOfCard) => {
    return indexOfCard !== removedCardIndex;
  });
  const newHealth = changeHealth(playerList, indexCurrPlayer);

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
  const currInventory = playerList[indexCurrPlayer].inventory;

  const removedCardIndex = playerList[indexCurrPlayer].inventory.findIndex(
    (card) => {
      return card?.name === "health";
    }
  );
  const newInventory = currInventory.filter((card, indexOfCard) => {
    return indexOfCard !== removedCardIndex;
  });

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

const changeHealth = (playerList: PlayerListType, indexTarget: number) => {
  return playerList[indexTarget].health + 1;
};
