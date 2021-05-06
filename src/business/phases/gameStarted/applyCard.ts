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
  const [, , phaseInner] = state.gameState.type.split(".");
  switch (phaseInner) {
    case "contextMenu": {
      switch (action.type) {
        case "req-healPlayer": {
          const indexChosenPlayer = action.payload;
          //Added check out of enable to heal
          return getStateHealAnotherPlayer(state, indexChosenPlayer);
        }

        case "req-shareHealthCard": {
          const recipientPlayerNumber = action.payload;
          return getStateGiveHealthCard(state, recipientPlayerNumber);
        }

        default:
          return state;
      }
    }

    default: {
      switch (action.type) {
        case "req-healPlayer": {
          /**
           * Need to increase playerHealth
           * Then remove card from inventory
           * Can we do this simultaneously?
           */
          return getStateHealCurrPlayer(state);
        }

        case "cardChoosed": {
          const target = action.payload;
          return getStateCardSelected(state, target);
        }

        case "req-contextMenu": {
          return {
            ...state,
            gameState: { type: "gameStarted.applyCard.contextMenu" },
          };
        }
        default:
          return state;
      }
    }
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

  const newCurrentPlayerInventory = currentPlayerInventory.filter(
    (card, indexOfCard) => {
      return indexOfCard !== sharedCardIndex;
    }
  );

  const newRecepientPlayerInventory = [...recepientPlayerInventory, sharedCard];

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
  /*  const newInventory = changeInventory(playerList, indexCurrPlayer); */
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

// TODO: Not a obviously, what  exactly do this method!
/* const changeInventory = (playerList: PlayerListType, indexTarget: number) => {
  const currInventory = playerList[indexTarget].inventory;
  const inventoryWithoutAppyingCard = currInventory.filter((inventoryCard) => {
    return inventoryCard.highlighting !== true;
  });
  return inventoryWithoutAppyingCard;
}; */

/**
 * This could be useful for special players
 */
const changeHealth = (playerList: PlayerListType, indexTarget: number) => {
  return playerList[indexTarget].health + 1;
};
