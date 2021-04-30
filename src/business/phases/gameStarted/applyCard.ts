import { State, PlayerListType, AvailableCellListType } from "../../types";
import { ActionType } from "../../reducer";

import { getStateCardChosed } from "./getStateCardChosed";
import { getNeighboringCellList } from "./getNeighboringCellList";
import { canInteractWithCell } from "./canInteractWithCell";
/**
 * 1. We need to check type of highlitningCard
 * 2. In depends of type call the function!
 * 3. On player we need to handle callback

 */

export const applyCard = (action: ActionType, state: State): State => {
  switch (action.type) {
    case "playerChoosed": {
      /**
       * Need to increase playerHealth
       * Then remove card from inventory
       * Can we do this simultaneously?
       */
      const { playerList, numberOfPlayer } = state;

      const indexChosenPlayer = action.payload;
      const indexCurrPlayer = numberOfPlayer;

      const needToHealCurrPlayer = indexChosenPlayer === indexCurrPlayer;
      const needToHealAnotherPlayer = !needToHealCurrPlayer;

      switch (true) {
        case needToHealCurrPlayer: {
          return getStateHealCurrPlayer(state);
        }

        case needToHealAnotherPlayer: {
          const indexChosenPlayer = action.payload;
          //Added check out of enable to heal
          return getStateHealAnotherPlayer(state, indexChosenPlayer);
        }

        default:
          return state;
      }
    }

    case "cardChoosed": {
      const target = action.payload;
      return getStateCardChosed(state, target);
    }

    default:
      return state;
  }
};

const getStateHealCurrPlayer = (state: State): State => {
  const { playerList, numberOfPlayer } = state;
  const indexCurrPlayer = numberOfPlayer;
  const newInventory = changeInventory(playerList, indexCurrPlayer);
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
  const coordCurrPlayer = playerList[indexCurrPlayer].coord;
  const coordChosenPlayer = playerList[indexChosenPlayer].coord;

  const playersMeetOnCell = coordCurrPlayer === coordChosenPlayer;
  const neighboringCellList = getAvailableCellList(state);

  const canInteractWithNeigboringCell = neighboringCellList.includes(
    coordChosenPlayer
  );

  const canHeal = playersMeetOnCell || canInteractWithNeigboringCell;

  const newInventory = changeInventory(playerList, indexCurrPlayer);
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

  switch (canHeal) {
  

    case true: {
      return {
        ...state,
        playerList: newPlayerList,
        gameState: { type: "gameStarted.playerMove" },
      };
    }
    case false: {
      return state;
    }

    default:
      return state;
  }
};

const changeInventory = (playerList: PlayerListType, indexTarget: number) => {
  const currInventory = playerList[indexTarget].inventory;
  const inventoryWithoutAppyingCard = currInventory.filter((inventoryCard) => {
    return inventoryCard.highlighting !== true;
  });
  return inventoryWithoutAppyingCard;
};

/**
 * This could be useful for special players
 */
const changeHealth = (playerList: PlayerListType, indexTarget: number) => {
  return playerList[indexTarget].health + 1;
};

const getAvailableCellList = (state: State) /* : State */ => {
  const neighboringCellList = getNeighboringCellList(state);
  const availableCellList: AvailableCellListType = neighboringCellList.filter(
    (cellItem) => {
      const { direction, coord } = cellItem;

      return canInteractWithCell(state, coord, direction);
    }
  );

  const availableCellsCoords = availableCellList.map((cellItem) => {
    const { direction, coord } = cellItem;
    return coord;
  });

  return availableCellsCoords;
};
