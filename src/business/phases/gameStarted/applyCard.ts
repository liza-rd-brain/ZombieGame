import { State, PlayerListType } from "../../types";

import { ActionType } from "../../reducer";

/**
 * 1. We need to check type of highlitningCard
 * 2. In depends of type call the function!
 * 3. On player we need to handle callback

 */
export const applyCard = (action: ActionType, state: State): State => {
  switch (action.type) {
    case "playerChoosed":
      /**
       * Need to increase playerHealth
       * Then remove card from inventory
       * Can we do this simultaneously?
       */
      const { playerList } = state;
      const indexCurrPlayer = action.payload;

      const currInventory = playerList[indexCurrPlayer].inventory;
      const inventoryWithoutAppyingCard = currInventory.filter(
        (inventoryCard) => {
          return inventoryCard.highlighting !== true;
        }
      );

      const newPlayerList: PlayerListType = {
        ...playerList,
        [indexCurrPlayer]: {
          ...playerList[indexCurrPlayer],
          health: playerList[indexCurrPlayer].health + 1,
          inventory: inventoryWithoutAppyingCard,
        },
      };


      return {
        ...state,
        playerList: newPlayerList,
        gameState: {
          type: "gameStarted.playerMove",
        },
      };
      

    default:
      return state;
  }
};
